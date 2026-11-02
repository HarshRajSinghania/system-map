"""Read a Drizzle schema for SQLite, and hold the result to what `drizzle-kit` writes.

The SQL in this file is pasted from `drizzle-kit`, run on the TypeScript beside it. Nothing here
comes from the reader, so a wrong guess about the tool shows up as a difference.
"""
import importlib.util
import json
import os
import random
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import store, system, verify, worktrees  # noqa: E402
from core.extractors import drizzle, extractor_for, sqlite  # noqa: E402
from core.sources import open_source  # noqa: E402
from tests.helpers import commit_all, git  # noqa: E402

TYPESCRIPT = ROOT / "ui" / "node_modules" / "typescript"

DRIVER = '{"dependencies": {"next": "16.0.0", "drizzle-orm": "1.0.0", "@libsql/client": "1.0.0"}}'
CONFIG = 'import { defineConfig } from "drizzle-kit";\n\nexport default defineConfig({\n  schema: "./db/schema.ts",\n  dialect: "sqlite",\n});\n'

SHARED = """import { integer } from "drizzle-orm/sqlite-core";

export const stamps = {
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at"),
};
"""

LIBRARY = """import { sql } from "drizzle-orm";
import {
  blob,
  check,
  foreignKey,
  index,
  int,
  integer,
  numeric,
  primaryKey,
  real,
  sqliteTable,
  sqliteView,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import * as core from "drizzle-orm/sqlite-core";
import { stamps } from "./shared";

// Every column kind, with no explicit name on two of them.
export const authors = sqliteTable("authors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name", { length: 120 }).notNull(),
  email: text("email").unique(),
  slug: text("slug").unique("authors_slug_key").notNull(),
  bio: text("bio"), // a comment with .notNull() in it
  rating: real("rating").default(4.5),
  salary: numeric("salary"),
  avatar: blob("avatar", { mode: "buffer" }),
  settings: blob("settings", { mode: "json" }),
  big: blob("big", { mode: "bigint" }),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  retired: integer("retired", { mode: "boolean" }).default(false),
  nickname: text(),
  age: int(),
  kind: text("kind", { enum: ["staff", "guest"] }).notNull().default("guest"),
  note: text("note").default("it's fine"),
  meta: text("meta", { mode: "json" }).$type<{ a: number }>().default({ a: 1 }),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  madeAt: integer("made_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  seenAt: text("seen_at").default(sql`CURRENT_TIMESTAMP`),
  token: text("token").$defaultFn(() => "x"),
  touched: integer("touched").$onUpdate(() => 1),
  copies: integer("copies").default(0).notNull(),
});

export const books = sqliteTable(
  "books",
  {
    id: text("id").primaryKey(),
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade", onUpdate: "restrict" }),
    editorId: integer("editor_id").references(() => authors.id, { onDelete: "set null" }),
    shelfId: text("shelf_id").references((): core.AnySQLiteColumn => shelves.code),
    title: text("title").notNull(),
    upper: text("upper").generatedAlwaysAs(sql`upper(title)`, { mode: "virtual" }),
    stock: integer("stock").notNull(),
    price: real("price"),
    ...stamps,
  },
  (t) => [
    index("books_title_idx").on(t.title),
    index("books_author_stock_idx").on(t.authorId, t.stock),
    uniqueIndex("books_title_author_key").on(t.title, t.authorId),
    index("books_cheap_idx").on(t.price).where(sql`price < 10`),
    check("stock_positive", sql`stock >= 0`),
    unique("books_shelf_title").on(t.shelfId, t.title),
    unique().on(t.authorId, t.price),
  ],
);

export const shelves = sqliteTable("shelves", {
  code: text("code").primaryKey(),
  floor: integer("floor").notNull(),
});

// A key across two columns, and a foreign key to it, in object form.
export const loans = sqliteTable(
  "loans",
  {
    bookId: text("book_id").notNull(),
    memberId: integer("member_id").notNull(),
    day: text("day").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.bookId, table.memberId] }),
    dayIdx: index("loans_day_idx").on(table.day),
    book: foreignKey({ columns: [table.bookId], foreignColumns: [books.id] }).onDelete("cascade"),
  }),
);

export const fines = sqliteTable("fines", {
  id: integer("id").primaryKey(),
  bookId: text("book_id").notNull(),
  memberId: integer("member_id").notNull(),
}, (t) => [
  foreignKey({
    columns: [t.bookId, t.memberId],
    foreignColumns: [loans.bookId, loans.memberId],
    name: "fines_loan_fk",
  }).onUpdate("cascade"),
]);

// The callback form of the columns.
export const reviews = sqliteTable("reviews", (t) => ({
  id: t.integer().primaryKey(),
  body: t.text("body").notNull(),
  score: t.real(),
}));

// Reached through a namespace import.
export const labels = core.sqliteTable("labels", {
  id: core.text("id").primaryKey(),
  name: core.text("name").notNull(),
});

export const cheapBooks = sqliteView("cheap_books").as((qb) => qb.select().from(books));
"""

#: `drizzle-kit export --sql`, run on LIBRARY and SHARED.
LIBRARY_SQL = """CREATE TABLE `authors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text(120) NOT NULL,
	`email` text,
	`slug` text NOT NULL,
	`bio` text,
	`rating` real DEFAULT 4.5,
	`salary` numeric,
	`avatar` blob,
	`settings` blob,
	`big` blob,
	`active` integer DEFAULT true NOT NULL,
	`retired` integer DEFAULT false,
	`nickname` text,
	`age` integer,
	`kind` text DEFAULT 'guest' NOT NULL,
	`note` text DEFAULT 'it''s fine',
	`meta` text DEFAULT '{"a":1}',
	`tags` text DEFAULT '[]',
	`made_at` integer DEFAULT (unixepoch()) NOT NULL,
	`seen_at` text DEFAULT CURRENT_TIMESTAMP,
	`token` text,
	`touched` integer,
	`copies` integer DEFAULT 0 NOT NULL
);

CREATE UNIQUE INDEX `authors_email_unique` ON `authors` (`email`);
CREATE UNIQUE INDEX `authors_slug_key` ON `authors` (`slug`);
CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` integer NOT NULL,
	`editor_id` integer,
	`shelf_id` text,
	`title` text NOT NULL,
	`upper` text GENERATED ALWAYS AS (upper(title)) VIRTUAL,
	`stock` integer NOT NULL,
	`price` real,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`editor_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`shelf_id`) REFERENCES `shelves`(`code`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "stock_positive" CHECK(stock >= 0)
);

CREATE INDEX `books_title_idx` ON `books` (`title`);
CREATE INDEX `books_author_stock_idx` ON `books` (`author_id`,`stock`);
CREATE UNIQUE INDEX `books_title_author_key` ON `books` (`title`,`author_id`);
CREATE INDEX `books_cheap_idx` ON `books` (`price`) WHERE price < 10;
CREATE UNIQUE INDEX `books_shelf_title` ON `books` (`shelf_id`,`title`);
CREATE UNIQUE INDEX `books_author_id_price_unique` ON `books` (`author_id`,`price`);
CREATE TABLE `fines` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_id` text NOT NULL,
	`member_id` integer NOT NULL,
	FOREIGN KEY (`book_id`,`member_id`) REFERENCES `loans`(`book_id`,`member_id`) ON UPDATE cascade ON DELETE no action
);

CREATE TABLE `labels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);

CREATE TABLE `loans` (
	`book_id` text NOT NULL,
	`member_id` integer NOT NULL,
	`day` text NOT NULL,
	PRIMARY KEY(`book_id`, `member_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `loans_day_idx` ON `loans` (`day`);
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`score` real
);

CREATE TABLE `shelves` (
	`code` text PRIMARY KEY NOT NULL,
	`floor` integer NOT NULL
);

CREATE VIEW `cheap_books` AS select "id", "author_id", "editor_id", "shelf_id", "title", "upper", "stock", "price", "created_at", "updated_at" from "books";
"""

CASED = """import { sql } from "drizzle-orm";
import { check, index, integer, primaryKey, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const items = sqliteTable(
  "items",
  {
    id: integer().primaryKey({ autoIncrement: true, onConflict: "replace" }),
    firstName: text().notNull(),
    lastName: text("last_name").notNull({ onConflict: "abort" }),
    HTMLBody: text(),
    version2Id: integer(),
    stock: integer().default(-1),
    ratio: real().default(0.25),
    nothing: text().default(null),
    line: text().default("a\\nb"),
    tick: text().default(`plain`),
    code: text().unique(),
    fullName: text().generatedAlwaysAs(sql`first_name || ' ' || last_name`, { mode: "stored" }),
    upperName: text().generatedAlwaysAs((): any => sql`upper(${items.firstName})`),
  },
  (t) => [
    check("stock_ok", sql`${t.stock} >= 0 AND ${t.ratio} < 1`),
    index("items_lower_idx").on(sql`lower(${t.firstName})`),
    index("items_mixed_idx").on(t.stock, sql`lower(${t.lastName})`),
    uniqueIndex("items_some_idx").on(t.stock).where(sql`${t.stock} > 0`),
  ],
);

export const pairs = sqliteTable(
  "pairs",
  {
    leftId: integer().notNull(),
    rightId: integer().notNull(),
  },
  (t) => [primaryKey(t.leftId, t.rightId)],
);

export const solo = sqliteTable(
  "solo",
  {
    only: text(),
  },
  (t) => [primaryKey({ columns: [t.only] })],
);
"""

#: `drizzle-kit generate` with `casing: "snake_case"`, run on CASED. `export` ignores `casing`.
CASED_SQL = """CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`html_body` text,
	`version2_id` integer,
	`stock` integer DEFAULT -1,
	`ratio` real DEFAULT 0.25,
	`nothing` text DEFAULT 'null',
	`line` text DEFAULT 'a
b',
	`tick` text DEFAULT 'plain',
	`code` text,
	`full_name` text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
	`upper_name` text GENERATED ALWAYS AS (upper("first_name")) VIRTUAL,
	CONSTRAINT "stock_ok" CHECK("items"."stock" >= 0 AND "items"."ratio" < 1)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `items_code_unique` ON `items` (`code`);--> statement-breakpoint
CREATE INDEX `items_lower_idx` ON `items` (lower("first_name"));--> statement-breakpoint
CREATE INDEX `items_mixed_idx` ON `items` (`stock`,lower("last_name"));--> statement-breakpoint
CREATE UNIQUE INDEX `items_some_idx` ON `items` (`stock`) WHERE "items"."stock" > 0;--> statement-breakpoint
CREATE TABLE `pairs` (
	`left_id` integer NOT NULL,
	`right_id` integer NOT NULL,
	PRIMARY KEY(`left_id`, `right_id`)
);
--> statement-breakpoint
CREATE TABLE `solo` (
	`only` text PRIMARY KEY
);
"""

REPEATED_KEYS = """import { foreignKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const a = sqliteTable("a", { id: text("id").primaryKey() });

export const b = sqliteTable(
  "b",
  {
    id: text("id").primaryKey(),
    x: text("x").references(() => a.id, { onDelete: "cascade" }),
    y: text("y").references(() => a.id, { onDelete: "cascade" }),
    z: text("z").references(() => a.id),
    w: text("w").references(() => a.id, { onDelete: "cascade" }).references(() => a.id, { onDelete: "set null" }),
    n: text("n").references(() => a.id, { onDelete: "cascade" }),
  },
  (t) => [
    foreignKey({ columns: [t.x], foreignColumns: [a.id] }).onDelete("set null"),
    foreignKey({ columns: [t.y], foreignColumns: [a.id], name: "b_y_named" }).onDelete("set null"),
    foreignKey({ columns: [t.z], foreignColumns: [a.id] }).onDelete("cascade"),
    foreignKey({ columns: [t.z], foreignColumns: [a.id] }).onDelete("restrict"),
    foreignKey({ columns: [t.n], foreignColumns: [a.id], name: "b_n_a_id_fk" }).onDelete("restrict"),
  ],
);
"""

#: `drizzle-kit generate`, run on REPEATED_KEYS. One key per name, and the last one wins.
REPEATED_KEYS_SQL = """CREATE TABLE `a` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `b` (
	`id` text PRIMARY KEY NOT NULL,
	`x` text,
	`y` text,
	`z` text,
	`w` text,
	`n` text,
	FOREIGN KEY (`x`) REFERENCES `a`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`y`) REFERENCES `a`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`z`) REFERENCES `a`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`w`) REFERENCES `a`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`n`) REFERENCES `a`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`y`) REFERENCES `a`(`id`) ON UPDATE no action ON DELETE set null
);
"""

SMALL = """import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey(),
  body: text("body").notNull(),
});
"""


def truth(sql: str) -> sqlite.Replay:
    replay = sqlite.Replay()
    replay.run("tool.sql", 1, sql.replace("--> statement-breakpoint", ""))
    replay.retry()
    return replay


def line_of(text: str, words: str) -> int:
    """The line a piece of the schema sits on, counted from the fixture itself."""
    return text[: text.index(words)].count("\n") + 1


class Repo(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name).resolve() / "repo"
        self.root.mkdir()
        self.write("package.json", DRIVER)

    def write(self, name: str, text: str = "") -> None:
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)

    def read(self) -> dict:
        return sqlite.extract(open_source(self.root))

    def table(self, name: str) -> dict:
        return next(node for node in self.read()["nodes"] if node["name"] == name)

    def names(self) -> list[str]:
        return sorted(node["name"] for node in self.read()["nodes"])

    def unread(self) -> list[str]:
        return self.read()["stats"]["drizzle_unread"]


class MatchesTheTool(Repo):
    def setUp(self):
        super().setUp()
        self.write("drizzle.config.ts", CONFIG)

    def test_the_tools_sql_loads_whole(self):
        for sql in (LIBRARY_SQL, CASED_SQL):
            self.assertEqual(truth(sql).unknown, {})

    def test_every_kind_of_table_matches(self):
        self.write("db/schema.ts", LIBRARY)
        self.write("db/shared.ts", SHARED)
        read = self.read()
        self.assertEqual(sqlite.differences(read["nodes"], truth(LIBRARY_SQL).connection), [])
        self.assertEqual(read["stats"]["drizzle_unread"], [])
        self.assertEqual(read["stats"]["statements_unknown"], 0)

    def test_casing_and_holes_match(self):
        self.write("drizzle.config.ts", CONFIG.replace('dialect: "sqlite",', 'dialect: "sqlite",\n  casing: "snake_case",'))
        self.write("db/schema.ts", CASED)
        read = self.read()
        self.assertEqual(sqlite.differences(read["nodes"], truth(CASED_SQL).connection), [])
        self.assertEqual(read["stats"]["drizzle_unread"], [])
        self.assertEqual(read["stats"]["statements_unknown"], 0)

    def test_repeated_foreign_keys_match(self):
        self.write("db/schema.ts", REPEATED_KEYS)
        read = self.read()
        self.assertEqual(sqlite.differences(read["nodes"], truth(REPEATED_KEYS_SQL).connection), [])
        self.assertEqual(read["stats"]["unknown"], {})

    def test_two_targets_on_one_column_both_stay(self):
        self.write("db/schema.ts", SMALL.replace('text("body").notNull()', 'integer("body").references(() => notes.id).references(() => other.id)').replace("export const notes", 'export const other = sqliteTable("other", { id: integer("id").primaryKey() });\n\nexport const notes'))
        targets = sorted(row["references"] for row in self.table("notes")["constraints"] if row["kind"] == "foreign_key")
        self.assertEqual(targets, ["main.notes", "main.other"])

    def test_camel_case_follows_drizzles_rule(self):
        self.write("drizzle.config.ts", 'export default { casing: "camelCase" };\n')
        self.write("db/schema.ts", SMALL.replace('text("body")', "text()").replace("body:", "first_name:"))
        self.assertEqual([row["name"] for row in self.table("notes")["columns"]], ["id", "firstName"])

    def test_the_real_comparison_notices_a_wrong_answer(self):
        self.write("db/schema.ts", SMALL)
        nodes = self.read()["nodes"]
        wrong = truth("CREATE TABLE `notes` (`id` integer PRIMARY KEY NOT NULL, `body` text);")
        self.assertEqual(sqlite.differences(nodes, wrong.connection), ["notes.body: differs"])


class Evidence(Repo):
    def setUp(self):
        super().setUp()
        self.write("db/schema.ts", LIBRARY)
        self.write("db/shared.ts", SHARED)

    def source(self, table: str, column: str) -> str:
        return next(row["source"] for row in self.table(table)["columns"] if row["name"] == column)

    def test_a_table_points_at_its_call(self):
        self.assertEqual(self.table("shelves")["source"], f"db/schema.ts:{line_of(LIBRARY, 'sqliteTable("shelves"')}")

    def test_a_column_points_at_its_own_line(self):
        self.assertEqual(self.source("authors", "bio"), f"db/schema.ts:{line_of(LIBRARY, 'bio: text')}")

    def test_a_column_over_many_lines_points_at_its_first(self):
        self.assertEqual(self.source("books", "author_id"), f"db/schema.ts:{line_of(LIBRARY, 'authorId: integer')}")

    def test_a_spread_column_points_at_the_spread(self):
        self.assertEqual(self.source("books", "created_at"), f"db/schema.ts:{line_of(LIBRARY, '...stamps')}")

    def test_an_index_points_at_its_line(self):
        index = next(row for row in self.table("books")["indexes"] if row["name"] == "books_title_idx")
        self.assertEqual(index["source"], f"db/schema.ts:{line_of(LIBRARY, 'index("books_title_idx")')}")

    def test_unique_points_at_its_column(self):
        index = next(row for row in self.table("authors")["indexes"] if row["name"] == "authors_email_unique")
        self.assertEqual(index["source"], f"db/schema.ts:{line_of(LIBRARY, 'email: text')}")

    def test_a_foreign_key_points_at_its_column(self):
        key = next(row for row in self.table("books")["constraints"] if row["kind"] == "foreign_key" and row["columns"] == ["editor_id"])
        self.assertEqual(key["source"], f"db/schema.ts:{line_of(LIBRARY, 'editorId: integer')}")

    def test_the_schema_file_counts_as_an_input(self):
        self.assertEqual(sorted(self.read()["inputs"]), ["db/schema.ts"])


class WhatItLeavesAlone(Repo):
    def test_a_commented_table_is_not_a_table(self):
        self.write("db/schema.ts", SMALL + '// export const ghost = sqliteTable("ghost", { id: text("id") });\n')
        self.assertEqual(self.names(), ["notes"])

    def test_a_table_in_a_string_is_not_a_table(self):
        self.write("db/schema.ts", SMALL + 'export const help = \'sqliteTable("ghost", { id: text("id") })\';\n')
        self.assertEqual(self.names(), ["notes"])

    def test_a_view_is_not_a_table(self):
        self.write("db/schema.ts", SMALL.replace("integer,", "integer, sqliteView,") + 'export const v = sqliteView("v").as((qb) => qb.select().from(notes));\n')
        self.assertEqual(self.names(), ["notes"])

    def test_a_test_file_is_not_the_schema(self):
        self.write("db/schema.test.ts", SMALL)
        self.assertEqual(self.names(), [])

    def test_an_aliased_import_is_followed(self):
        self.write("db/schema.ts", 'import { sqliteTable as table, text as words } from "drizzle-orm/sqlite-core";\nexport const a = table("a", { id: words("id").primaryKey() });\n')
        self.assertEqual(self.names(), ["a"])

    def test_a_type_import_reads_nothing(self):
        self.write("db/schema.ts", 'import type { sqliteTable } from "drizzle-orm/sqlite-core";\nconst a = sqliteTable("a", {});\n')
        self.assertEqual(self.names(), [])

    def test_a_schema_outside_the_code_root_is_read(self):
        self.write("src/app/page.tsx", "export default function Page() {}\n")
        self.write("db/schema.ts", SMALL)
        self.assertEqual(self.names(), ["notes"])

    def test_a_type_with_a_comma_stays_in_its_column(self):
        self.write("db/schema.ts", SMALL.replace('text("body").notNull()', 'text("body").$type<Record<string, number>>().notNull()'))
        self.assertEqual([row["nullable"] for row in self.table("notes")["columns"]], [False, False])

    def test_one_line_tables_read(self):
        self.write("db/schema.ts", 'import { sqliteTable, text } from "drizzle-orm/sqlite-core";\nexport const a = sqliteTable("a", { id: text("id").primaryKey(), b: text("b") });\n')
        self.assertEqual([row["name"] for row in self.table("a")["columns"]], ["id", "b"])
        self.assertEqual(self.unread(), [])


class WhenSqlIsThere(Repo):
    def test_sql_wins_over_the_schema(self):
        self.write("db/schema.ts", SMALL)
        self.write("drizzle/0000_first.sql", "CREATE TABLE `from_sql` (\n\t`id` integer PRIMARY KEY NOT NULL\n);\n")
        self.assertEqual(self.names(), ["from_sql"])
        self.assertEqual(self.read()["stats"]["statements_unknown"], 0)

    def test_create_table_in_code_also_wins(self):
        self.write("db/schema.ts", SMALL)
        self.write("lib/db.ts", 'db.exec("CREATE TABLE from_code (id INTEGER PRIMARY KEY)");\n')
        self.assertEqual(self.names(), ["from_code"])


class Unread(Repo):
    def assert_unread(self, schema: str, tables: list[str], line: int) -> None:
        self.write("db/schema.ts", schema)
        self.assertEqual(self.names(), tables)
        self.assertIn(f"db/schema.ts:{line}", self.unread())

    def test_a_table_made_in_a_loop(self):
        self.assert_unread(SMALL + 'for (const name of names) sqliteTable(name, { id: text("id") });\n', ["notes"], line_of(SMALL, "});") + 1)

    def test_a_table_creator(self):
        schema = SMALL.replace("integer,", "integer, sqliteTableCreator,") + 'export const make = sqliteTableCreator((name) => `app_${name}`);\n'
        self.assert_unread(schema, ["notes"], line_of(SMALL, "});") + 1)

    def test_columns_in_a_variable_that_is_not_an_object(self):
        self.assert_unread(SMALL + 'export const a = sqliteTable("a", makeColumns());\n', ["notes"], line_of(SMALL, "});") + 1)

    def test_a_custom_column_keeps_the_table(self):
        schema = SMALL.replace('body: text("body").notNull(),', 'body: text("body").notNull(),\n  price: money("price"),')
        self.assert_unread(schema, ["notes"], line_of(schema, "price: money"))
        self.assertEqual([row["name"] for row in self.table("notes")["columns"]], ["id", "body"])

    def test_a_default_only_the_code_knows(self):
        schema = SMALL.replace('text("body").notNull()', 'text("body").default(FIRST_NOTE)')
        self.assert_unread(schema, ["notes"], line_of(schema, "body: text"))
        self.assertIsNone(self.table("notes")["columns"][1]["default"])

    def test_a_spread_from_nowhere(self):
        schema = SMALL.replace('body: text("body").notNull(),', "...fromAPackage,")
        self.assert_unread(schema, ["notes"], line_of(schema, "fromAPackage"))

    def test_a_foreign_key_to_a_table_it_cant_see(self):
        schema = SMALL.replace('text("body").notNull()', 'text("body").references(() => elsewhere.id)')
        self.assert_unread(schema, ["notes"], line_of(schema, "body: text"))

    def test_an_index_on_a_column_that_is_not_there(self):
        schema = SMALL.replace("});\n", '}, (t) => [index("i").on(t.missing)]);\n').replace("integer,", "index, integer,")
        self.assert_unread(schema, ["notes"], line_of(schema, 'index("i")'))

    def test_a_hole_in_sql_that_is_not_a_column(self):
        schema = 'import { sql } from "drizzle-orm";\n' + SMALL.replace('text("body").notNull()', 'text("body").default(sql`${FIRST_NOTE}`)')
        self.assert_unread(schema, ["notes"], line_of(schema, "body: text"))

    def test_a_clean_schema_has_nothing_unread(self):
        self.write("db/schema.ts", SMALL)
        self.assertEqual(self.unread(), [])


class Detecting(Repo):
    def test_a_driver_is_enough(self):
        self.write("db/schema.ts", SMALL)
        self.assertIs(extractor_for(open_source(self.root)), sqlite)

    def test_hosted_sqlite_has_no_driver_package(self):
        self.write("package.json", '{"dependencies": {"next": "16.0.0", "drizzle-orm": "1.0.0"}}')
        self.write("db/schema.ts", SMALL)
        self.assertIs(extractor_for(open_source(self.root)), sqlite)

    def test_a_postgres_schema_stays_unread(self):
        self.write("package.json", '{"dependencies": {"next": "16.0.0", "drizzle-orm": "1.0.0", "postgres": "3.0.0"}}')
        self.write("drizzle.config.ts", CONFIG.replace('"sqlite"', '"postgresql"'))
        self.write("db/schema.ts", 'import { pgTable, text } from "drizzle-orm/pg-core";\nexport const a = pgTable("a", { id: text("id").primaryKey() });\n')
        self.write("app/page.tsx", "export default function Page() {}\n")
        with tempfile.TemporaryDirectory() as data:
            manifest = store.build(self.root, Path(data))
        self.assertEqual(manifest["counts"]["tables"], 0)
        self.assertEqual([row["what"] for row in manifest["read"]["unread"]], ["A Drizzle schema with no SQL migrations"])


class ThroughABuild(Repo):
    def build(self) -> dict:
        data = tempfile.TemporaryDirectory()
        self.addCleanup(data.cleanup)
        return store.build(self.root, Path(data.name))

    def test_a_build_counts_the_tables(self):
        self.write("drizzle.config.ts", CONFIG)
        self.write("db/schema.ts", LIBRARY)
        self.write("db/shared.ts", SHARED)
        manifest = self.build()
        self.assertEqual(manifest["engine"], "sqlite")
        self.assertEqual(manifest["counts"]["tables"], 7)
        self.assertEqual(manifest["read"]["schema_files"], ["db/schema.ts"])
        self.assertEqual(manifest["read"]["unread"], [])

    def test_a_table_gets_rule_checks(self):
        self.write("db/schema.ts", SMALL.replace('text("body").notNull()', 'integer("parent").references(() => notes.id)'))
        manifest = self.build()
        self.assertEqual(manifest["counts"]["findings"]["low"], 1)

    def test_unread_parts_are_named_by_place(self):
        self.write("db/schema.ts", SMALL.replace('text("body").notNull()', 'text("body").default(FIRST_NOTE)'))
        self.assertEqual(self.build()["read"]["unread"], [{"what": "1 part of a Drizzle schema it couldn't read", "where": f"db/schema.ts:{line_of(SMALL, 'body: text')}"}])

    def test_the_repo_is_not_changed(self):
        self.write("db/schema.ts", SMALL)
        before = sorted(str(path) for path in self.root.rglob("*"))
        self.build()
        self.assertEqual(sorted(str(path) for path in self.root.rglob("*")), before)


#: Two tables, one of them with a const name that is not its SQL name.
TWO_TABLES = """import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const bookGuests = sqliteTable("book_guests", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
});
"""
TSCONFIG = '{"compilerOptions": {"baseUrl": ".", "paths": {"@/*": ["./*"]}}}\n'


class CodeLinks(Repo):
    def setUp(self):
        super().setUp()
        self.write("tsconfig.json", TSCONFIG)
        self.write("db/schema.ts", TWO_TABLES)

    def calls(self, path: str = "lib/a.ts") -> list[tuple[str, str]]:
        source = open_source(self.root)
        found = system.build(source, sqlite.extract(source)["nodes"])
        return sorted((row["table"], row["access"]) for row in found["table_calls"].get(path, []))

    def link(self, table: str) -> dict:
        source = open_source(self.root)
        edges = system.build(source, sqlite.extract(source)["nodes"])["edges"]
        return next(edge for edge in edges if edge["kind"] == "uses_table" and edge["target"] == f"table:main.{table}")

    def test_each_write_call_is_a_write(self):
        self.write("lib/a.ts", 'import { users } from "@/db/schema";\ndb.insert(users);\ndb.update(users);\ndb.delete(users);\n')
        self.assertEqual(self.calls(), [("users", "write")] * 3)

    def test_each_read_call_is_a_read(self):
        code = 'import { users, bookGuests } from "@/db/schema";\ndb.select().from(users);\ndb.select().from(users).innerJoin(bookGuests, on);\ndb.select().from(users).leftJoin(bookGuests, on);\ndb.$count(users);\n'
        self.write("lib/a.ts", code)
        self.assertEqual(self.calls(), [("book_guests", "read")] * 2 + [("users", "read")] * 4)

    def test_the_query_api_goes_by_the_schemas_name(self):
        self.write("lib/a.ts", "db.query.users.findMany();\ndb.query.bookGuests.findFirst();\n")
        self.assertEqual(self.calls(), [("book_guests", "read"), ("users", "read")])

    def test_a_call_split_over_lines_counts(self):
        self.write("lib/a.ts", 'import { users } from "@/db/schema";\nawait db\n  .insert(users)\n  .values({});\n')
        self.assertEqual(self.calls(), [("users", "write")])

    def test_an_aliased_import_counts(self):
        self.write("lib/a.ts", 'import { users as people } from "@/db/schema";\ndb.insert(people);\n')
        self.assertEqual(self.calls(), [("users", "write")])

    def test_a_namespace_import_counts(self):
        self.write("lib/a.ts", 'import * as schema from "@/db/schema";\ndb.insert(schema.users);\n')
        self.assertEqual(self.calls(), [("users", "write")])

    def test_a_relative_import_counts(self):
        self.write("lib/a.ts", 'import { users } from "../db/schema";\ndb.insert(users);\n')
        self.assertEqual(self.calls(), [("users", "write")])

    def test_a_re_export_counts(self):
        self.write("db/index.ts", 'export * from "./schema";\n')
        self.write("lib/a.ts", 'import { users } from "@/db";\ndb.insert(users);\n')
        self.assertEqual(self.calls(), [("users", "write")])

    def test_a_re_export_of_a_re_export_counts(self):
        self.write("db/index.ts", 'export * from "./tables";\n')
        self.write("db/tables.ts", 'export { users } from "./schema";\n')
        self.write("lib/a.ts", 'import { users } from "@/db";\ndb.insert(users);\n')
        self.assertEqual(self.calls(), [("users", "write")])

    def test_a_table_used_where_it_is_made_counts(self):
        self.write("lib/a.ts", TWO_TABLES.replace("users", "owners").replace('"book_guests"', '"pets"') + "db.insert(owners);\n")
        self.write("db/schema.ts", "")
        self.assertEqual(self.calls(), [("owners", "write")])

    def test_a_const_links_to_its_sql_name(self):
        self.write("lib/a.ts", 'import { bookGuests } from "@/db/schema";\ndb.insert(bookGuests);\n')
        self.assertEqual(self.calls(), [("book_guests", "write")])

    def test_an_alias_of_a_table_counts(self):
        self.write("lib/a.ts", 'import { users } from "@/db/schema";\ndb.select().from(alias(users, "u"));\n')
        self.assertEqual(self.calls(), [("users", "read")])

    def test_a_name_that_is_only_like_a_table_does_not_count(self):
        self.write("lib/a.ts", "const users = [];\nArray.from(users);\nseen.delete(users);\n")
        self.assertEqual(self.calls(), [])

    def test_a_same_name_from_another_file_does_not_count(self):
        self.write("lib/words.ts", "export const users = [];\n")
        self.write("lib/a.ts", 'import { users } from "./words";\nArray.from(users);\n')
        self.assertEqual(self.calls(), [])

    def test_a_same_name_from_a_package_does_not_count(self):
        self.write("lib/a.ts", 'import { users } from "some-package";\nArray.from(users);\n')
        self.assertEqual(self.calls(), [])

    def test_a_type_import_does_not_count(self):
        self.write("lib/a.ts", 'import type { users } from "@/db/schema";\nArray.from(users);\n')
        self.assertEqual(self.calls(), [])

    def test_a_commented_call_does_not_count(self):
        self.write("lib/a.ts", 'import { users } from "@/db/schema";\n// db.insert(users);\n')
        self.assertEqual(self.calls(), [])

    def test_a_query_on_something_that_is_no_table_does_not_count(self):
        self.write("lib/a.ts", "db.query.ghosts.findMany();\n")
        self.assertEqual(self.calls(), [])

    def test_a_test_file_makes_no_link(self):
        self.write("lib/a.test.ts", 'import { users } from "@/db/schema";\ndb.insert(users);\n')
        self.assertEqual(self.calls("lib/a.test.ts"), [])

    def test_a_link_cites_the_call(self):
        self.write("lib/a.ts", 'import { users } from "@/db/schema";\n\ndb.insert(users);\n')
        link = self.link("users")
        self.assertEqual((link["source"], link["access"], link["evidence"]), ("module:lib", "write", ["lib/a.ts:3"]))

    def test_a_read_and_a_write_make_a_write_link(self):
        self.write("lib/a.ts", 'import { users } from "@/db/schema";\ndb.query.users.findMany();\ndb.insert(users);\n')
        link = self.link("users")
        self.assertEqual((link["access"], link["count"]), ("write", 2))

    def test_links_work_when_sql_made_the_tables(self):
        self.write("drizzle/0000_first.sql", "CREATE TABLE `users` (\n\t`id` integer PRIMARY KEY NOT NULL\n);\n")
        self.write("lib/a.ts", 'import { users } from "@/db/schema";\ndb.insert(users);\n')
        self.assertEqual(self.link("users")["access"], "write")

    def test_a_project_with_no_drizzle_is_left_alone(self):
        self.write("db/schema.ts", "")
        self.write("lib/a.ts", 'db.from("users").select("*");\nArray.from(users);\n')
        self.assertEqual(self.calls(), [("users", "read")])


class UnusedColumns(Repo):
    def unused(self) -> list[str]:
        data = tempfile.TemporaryDirectory()
        self.addCleanup(data.cleanup)
        target = store.repo_dir(self.root, Path(data.name))
        store.build(self.root, Path(data.name))
        return sorted(row["title"] for row in store.load_findings(target) if row["check"] == "column_unused")

    def setUp(self):
        super().setUp()
        self.write("db/schema.ts", SMALL.replace('body: text("body").notNull(),', 'firstName: text("first_name"),\n  body: text("body"),'))

    def test_the_schema_naming_a_column_is_not_use(self):
        self.assertEqual(self.unused(), ["notes.body may be unused", "notes.first_name may be unused"])

    def test_the_field_name_in_code_is_use(self):
        self.write("lib/a.ts", "export const show = (note) => note.firstName;\n")
        self.assertEqual(self.unused(), ["notes.body may be unused"])

    def test_the_sql_name_in_code_is_use(self):
        self.write("lib/a.ts", 'export const q = "SELECT first_name FROM notes";\n')
        self.assertEqual(self.unused(), ["notes.body may be unused"])

    def test_a_seed_file_naming_a_column_is_not_use(self):
        self.write("db/seed.ts", "await db.insert(notes).values({ firstName: 'a', body: 'b' });\n")
        self.assertEqual(self.unused(), ["notes.body may be unused", "notes.first_name may be unused"])

    def test_a_helper_that_holds_columns_is_not_use(self):
        self.write("db/schema.ts", SMALL.replace('body: text("body").notNull(),', "...stamps,").replace('import {', 'import { stamps } from "./shared";\nimport {', 1))
        self.write("db/shared.ts", SHARED)
        self.assertEqual(self.unused(), ["notes.created_at may be unused", "notes.updated_at may be unused"])

    def test_a_key_is_never_unused(self):
        self.write("db/schema.ts", SMALL.replace('text("body").notNull()', 'integer("parent").references(() => notes.id)'))
        self.assertEqual(self.unused(), [])

    def test_it_works_when_sql_made_the_tables(self):
        self.write("drizzle/0000_first.sql", "CREATE TABLE `notes` (\n\t`id` integer PRIMARY KEY NOT NULL,\n\t`first_name` text,\n\t`body` text\n);\n")
        self.write("lib/a.ts", "export const show = (note) => note.firstName;\n")
        self.assertEqual(self.unused(), ["notes.body may be unused"])

    def test_a_project_with_no_drizzle_still_counts_every_file(self):
        self.write("package.json", '{"dependencies": {"better-sqlite3": "1.0.0"}}')
        self.write("db/schema.ts", "")
        self.write("db/schema.sql", "CREATE TABLE notes (id INTEGER PRIMARY KEY, body TEXT, title TEXT);\n")
        self.write("lib/a.ts", 'export const q = "SELECT body FROM notes";\n')
        self.assertEqual(self.unused(), ["notes.title may be unused"])


class TablesAt(unittest.TestCase):
    def test_a_line_names_only_its_table(self):
        first = line_of(TWO_TABLES, 'name: text("name")')
        self.assertEqual(drizzle.tables_at(TWO_TABLES, {first}), {"users"})

    def test_the_first_and_last_lines_count(self):
        self.assertEqual(drizzle.tables_at(TWO_TABLES, {line_of(TWO_TABLES, 'sqliteTable("book_guests"')}), {"book_guests"})
        self.assertEqual(drizzle.tables_at(TWO_TABLES, {line_of(TWO_TABLES, 'sqliteTable("book_guests"') + 3}), {"book_guests"})

    def test_a_line_between_tables_names_none(self):
        self.assertEqual(drizzle.tables_at(TWO_TABLES, {line_of(TWO_TABLES, 'sqliteTable("book_guests"') - 1}), set())

    def test_the_third_argument_is_part_of_the_table(self):
        schema = SMALL.replace("});\n", '}, (t) => [\n  index("i").on(t.body),\n]);\n').replace("integer,", "index, integer,")
        self.assertEqual(drizzle.tables_at(schema, {line_of(schema, 'index("i")')}), {"notes"})

    def test_all_lines_means_every_table(self):
        self.assertEqual(drizzle.tables_at(TWO_TABLES, None), {"users", "book_guests"})

    def test_a_comment_is_no_table(self):
        self.assertEqual(drizzle.tables_at(TWO_TABLES + '// sqliteTable("ghost", {})\n', None), {"users", "book_guests"})


#: Long enough that an edit at the far end sits out of reach of the query at the top.
LONG_FILE = 'import { users } from "@/db/schema";\nexport const add = () => db.insert(users);\n' + "\n".join(f"export const c{n} = {n};" for n in range(40)) + "\n"
USES_NOTHING = "export const plain = 1;\n"


class InWorktrees(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base = Path(tmp.name).resolve()
        self.repo = self.base / "repo"
        self.repo.mkdir()
        self.data = self.base / "data"
        git(self.repo, "init", "-q", "-b", "main")
        self.write(self.repo, "package.json", DRIVER)
        self.write(self.repo, "tsconfig.json", TSCONFIG)
        self.write(self.repo, "db/schema.ts", TWO_TABLES)
        self.write(self.repo, "lib/a.ts", LONG_FILE)
        self.write(self.repo, "lib/b.ts", USES_NOTHING)
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        self.target = store.repo_dir(self.repo, self.data)

    def write(self, root: Path, name: str, text: str) -> None:
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)

    def worktree(self, name: str) -> Path:
        path = self.base / name
        git(self.repo, "worktree", "add", "-q", "-b", name, str(path))
        return path

    def state(self) -> dict:
        return store.worktree_state(self.target)

    def row(self, name: str) -> dict:
        return next(item for item in self.state()["worktrees"] if item["name"] == name)

    def test_a_schema_edit_names_its_table_only(self):
        work = self.worktree("one")
        self.write(work, "db/schema.ts", TWO_TABLES.replace('name: text("name").notNull(),', 'name: text("name"),'))
        self.assertEqual(self.row("one")["tables_schema"], ["table:main.users"])

    def test_an_edit_outside_any_table_names_none(self):
        work = self.worktree("one")
        self.write(work, "db/schema.ts", TWO_TABLES + "export const usersRelations = relations(users, () => ({}));\n")
        self.assertEqual(self.row("one")["tables_schema"], [])

    def test_a_committed_schema_edit_counts(self):
        work = self.worktree("one")
        self.write(work, "db/schema.ts", TWO_TABLES.replace('userId: integer("user_id")', 'userId: text("user_id")'))
        commit_all(work)
        self.assertEqual(self.row("one")["tables_schema"], ["table:main.book_guests"])

    def test_a_table_the_model_has_never_seen_is_left_out(self):
        work = self.worktree("one")
        self.write(work, "db/schema.ts", TWO_TABLES + 'export const pets = sqliteTable("pets", { id: text("id") });\n')
        self.assertEqual(self.row("one")["tables_schema"], [])

    def test_a_new_schema_file_counts_every_known_table_in_it(self):
        work = self.worktree("one")
        self.write(work, "db/more.ts", TWO_TABLES)
        self.assertEqual(self.row("one")["tables_schema"], ["table:main.book_guests", "table:main.users"])

    def test_a_schema_outside_the_code_root_counts(self):
        self.write(self.repo, "src/app/page.tsx", USES_NOTHING)
        for path in ("lib/a.ts", "lib/b.ts"):
            (self.repo / path).unlink()
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        work = self.worktree("one")
        self.write(work, "db/schema.ts", TWO_TABLES.replace('name: text("name").notNull(),', 'name: text("name"),'))
        self.assertEqual(self.row("one")["tables_schema"], ["table:main.users"])

    def test_a_test_file_is_no_schema_change(self):
        work = self.worktree("one")
        self.write(work, "db/schema.test.ts", TWO_TABLES)
        self.assertEqual(self.row("one")["tables_schema"], [])

    def test_an_edit_near_a_drizzle_call_touches_its_table(self):
        work = self.worktree("one")
        self.write(work, "lib/a.ts", LONG_FILE.replace("db.insert(users);", "db.insert(users).run();"))
        self.assertEqual(self.row("one")["tables_code"], ["table:main.users"])

    def test_an_edit_far_from_a_drizzle_call_does_not(self):
        work = self.worktree("one")
        self.write(work, "lib/a.ts", LONG_FILE.replace("c39 = 39", "c39 = 40"))
        self.assertEqual(self.row("one")["tables_code"], [])

    def test_two_schema_edits_on_one_table_are_high(self):
        self.write(self.worktree("one"), "db/schema.ts", TWO_TABLES.replace('name: text("name").notNull(),', 'name: text("full_name"),'))
        self.write(self.worktree("two"), "db/schema.ts", TWO_TABLES.replace('name: text("name").notNull(),', 'name: text("nick"),'))
        row = self.state()["overlaps"][0]
        self.assertEqual((row["severity"], row["schema"]), ("high", ["table:main.users"]))

    def test_a_schema_edit_and_code_that_uses_the_table_are_medium(self):
        self.write(self.worktree("one"), "db/schema.ts", TWO_TABLES.replace('name: text("name").notNull(),', 'name: text("name"),'))
        self.write(self.worktree("two"), "lib/a.ts", LONG_FILE.replace("db.insert(users);", "db.insert(users).run();"))
        row = self.state()["overlaps"][0]
        self.assertEqual((row["severity"], row["schema_and_code"]), ("medium", ["table:main.users"]))

    def test_two_edits_on_code_that_uses_a_table_are_low(self):
        self.write(self.worktree("one"), "lib/a.ts", LONG_FILE.replace("db.insert(users);", "db.insert(users).run();"))
        self.write(self.worktree("two"), "lib/c.ts", 'import { users } from "@/db/schema";\nexport const c = () => db.update(users);\n')
        row = self.state()["overlaps"][0]
        self.assertEqual((row["severity"], row["code"]), ("low", ["table:main.users"]))

    def test_a_model_from_before_this_reads_with_no_drizzle(self):
        self.assertEqual(worktrees.Model.of({"nodes": []}, set()).drizzle, {})


class SweepSchemas(Repo):
    """The sweep needs the real tool, so here it only proves its schemas stay readable."""

    def test_every_form_it_writes_is_read_whole(self):
        spec = importlib.util.spec_from_file_location("sweep_drizzle", ROOT / "scripts" / "sweep_drizzle.py")
        sweep = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(sweep)
        for seed in range(5):
            with self.subTest(seed):
                self.write("db/schema.ts", sweep.schema(random.Random(seed), 30))
                read = self.read()
                self.assertEqual(len(read["nodes"]), 30)
                self.assertEqual(read["stats"]["drizzle_unread"], [])
                self.assertEqual(read["stats"]["unknown"], {})


@unittest.skipUnless(TYPESCRIPT.exists(), "needs ui/node_modules; run npm install in ui")
class Compiler(Repo):
    def test_links_match_the_type_checker(self):
        self.write("tsconfig.json", TSCONFIG)
        self.write("db/schema.ts", TWO_TABLES)
        self.write("db/index.ts", 'export * from "./schema";\n')
        files = {
            "lib/named.ts": 'import { users, bookGuests } from "@/db/schema";\ndb.insert(users);\ndb.select().from(users).leftJoin(bookGuests, on);\ndb.update(bookGuests);\n',
            "lib/alias.ts": 'import { users as people } from "../db/schema";\ndb.delete(people);\ndb.$count(people);\n',
            "lib/space.ts": 'import * as schema from "@/db/schema";\ndb.insert(schema.bookGuests);\n',
            "lib/barrel.ts": 'import { users } from "@/db";\ndb.select().from(alias(users, "u"));\n',
            "lib/query.ts": "db.query.users.findMany();\ndb.query.bookGuests.findFirst();\ndb.query.ghosts.findMany();\n",
            "lib/not.ts": 'const users = [];\nArray.from(users);\nseen.delete(users);\n',
            "lib/words.ts": "export const bookGuests = [];\n",
            "lib/other.ts": 'import { bookGuests } from "./words";\nArray.from(bookGuests);\n',
        }
        for path, text in files.items():
            self.write(path, text)
        out = self.root.parent / "truth.json"
        done = subprocess.run(["node", str(ROOT / "scripts" / "ts_truth.mjs"), str(self.root), str(out)], capture_output=True, text=True, env=os.environ, timeout=120)
        self.assertEqual(done.returncode, 0, done.stderr)
        truth = json.loads(out.read_text())
        self.assertEqual(sorted(truth["tableCalls"]), ["lib/alias.ts", "lib/barrel.ts", "lib/named.ts", "lib/query.ts", "lib/space.ts"])
        source = open_source(self.root)
        found = system.build(source, sqlite.extract(source)["nodes"])
        self.assertEqual(verify.compare_table_calls(found["table_calls"], truth["tableCalls"]), [])


if __name__ == "__main__":
    unittest.main()
