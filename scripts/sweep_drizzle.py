#!/usr/bin/env python3
"""Hold the Drizzle reader to the real `drizzle-kit generate`, across random schemas.

Usage: scripts/sweep_drizzle.py <node_modules> <work-dir> [rounds] [tables] [seed]

Each round writes one schema that mixes every form the reader knows, has the tool write its SQL,
and compares the reader with that SQL through real SQLite. `<node_modules>` is any folder with
`drizzle-kit` and `drizzle-orm` installed. Everything else lands in `<work-dir>`.

`generate` is the tool to ask, because `export` ignores `casing`. The same seed gives the same
schemas, so a failure can be read at leisure in `<work-dir>`.
"""
from __future__ import annotations

import random
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core.extractors import sqlite  # noqa: E402
from core.sources import TreeSource  # noqa: E402

IMPORTS = "blob, check, foreignKey, index, integer, numeric, primaryKey, real, sqliteTable, text, unique, uniqueIndex"
WORDS = ("title", "price", "owner", "city", "note", "code", "label", "score", "state", "kind", "start", "finish", "size", "color", "rank", "slug", "phone", "email", "weight", "guest")
#: Maker, its options, and the values a default can take.
TEXT = ('"plain"', '"it\'s"', "'single'", "`tick`", '"two words"', '"a;b"', '""')
STAMP = ("sql`(unixepoch())`", "sql`CURRENT_TIMESTAMP`")
JSON_VALUES = ("{ a: 1 }", "[]", '{ a: "x", b: [1, 2] }', "{ 'c': true }", "[1, 2, 3,]")
KINDS = (
    ("text", "", TEXT + ("sql`'x'`", "null")),
    ("text", "{ length: 40 }", TEXT),
    ("text", '{ enum: ["a", "b"] }', ('"a"', '"b"')),
    ("text", '{ mode: "json" }', JSON_VALUES),
    ("integer", "", ("0", "7", "-3", "12345")),
    ("integer", '{ mode: "boolean" }', ("true", "false")),
    ("integer", '{ mode: "timestamp" }', STAMP),
    ("integer", '{ mode: "timestamp_ms" }', STAMP),
    ("real", "", ("1.5", "-0.25", "0")),
    ("numeric", "", ('"1.5"',)),
    ("blob", "", ()),
    ("blob", '{ mode: "json" }', ()),
    ("blob", '{ mode: "bigint" }', ()),
)
ACTIONS = ("", '{ onDelete: "cascade" }', '{ onDelete: "set null", onUpdate: "restrict" }', '{ onUpdate: "no action" }', '{ onDelete: "set default", onUpdate: "cascade" }')
SHARED = """export const audit = {
  createdAt: integer("created_at").notNull(),
  changedAt: integer(),
};
"""


def column(rng: random.Random, key: str, prefix: str, tables: list[str]) -> str:
    """One column, with its modifiers in a random order."""
    maker, options, values = rng.choice(KINDS)
    name = f'"{key.lower()}_col"' if rng.random() < 0.7 else ""
    arguments = ", ".join(part for part in (name, options) if part)
    modifiers = []
    if rng.random() < 0.4:
        modifiers.append(".notNull()")
    if values and rng.random() < 0.5:
        modifiers.append(f".default({rng.choice(values)})")
    if rng.random() < 0.15:
        modifiers.append(rng.choice((".unique()", f'.unique("{prefix}_{key.lower()}_key")')))
    if rng.random() < 0.15:
        modifiers.append(rng.choice((".$defaultFn(() => null)", ".$onUpdate(() => null)", ".$type<Record<string, number>>()", ".$type<A | B>()")))
    if rng.random() < 0.2 and tables:
        action = rng.choice(ACTIONS)
        modifiers.append(f".references(() => {rng.choice(tables)}.id{', ' + action if action else ''})")
    rng.shuffle(modifiers)
    return f"{maker}({arguments})" + "".join(modifiers)


def extras(rng: random.Random, prefix: str, keys: list[str], tables: list[str], keyed: bool) -> list[str]:
    """Things that go in a table's third argument. Every name is unique across the schema."""
    pair = rng.sample(keys, min(2, len(keys)))
    fields = ", ".join(f"t.{key}" for key in pair)
    first = f"t.{pair[0]}"
    choices = [
        f'index("{prefix}_a_idx").on({fields})',
        f'uniqueIndex("{prefix}_b_idx").on({first})',
        f'unique("{prefix}_c_key").on({fields})',
        f"unique().on({fields})",
        f'index("{prefix}_d_idx").on({first}).where(sql`${{{first}}} is not null`)',
        f'index("{prefix}_e_idx").on(sql`lower(${{{first}}})`)',
        f'index("{prefix}_f_idx").on({first}, sql`upper(${{{first}}})`)',
        f'check("{prefix}_g_check", sql`${{{first}}} is not null`)',
    ]
    if tables:
        # A second key on the same pair is on purpose: the tool keeps one per name.
        target = rng.choice(tables)
        choices.append(f'foreignKey({{ columns: [{first}], foreignColumns: [{target}.id] }}).onDelete("cascade")')
        choices.append(f'foreignKey({{ columns: [{first}], foreignColumns: [{target}.id] }}).onDelete("restrict")')
        choices.append(f'foreignKey({{ columns: [{first}], foreignColumns: [{target}.id], name: "{prefix}_h_fk" }}).onUpdate("cascade")')
    found = rng.sample(choices, rng.randint(0, 5))
    if keyed:
        found.append(rng.choice((f"primaryKey({{ columns: [{fields}] }})", f"primaryKey({fields})")))
    return found


def table(rng: random.Random, number: int, tables: list[str], keyed: bool) -> str:
    """One table. A keyed one has a key across two columns, so nothing can point at its `id`."""
    const, prefix = f"table{number}", f"t{number}"
    keys = [f"{word}{index}" for index, word in enumerate(rng.sample(WORDS, rng.randint(2, 8)))]
    rows = [f"{key}: {column(rng, key, prefix, tables)}" for key in keys]
    if not keyed:
        rows.insert(0, "id: " + rng.choice(('text("id").primaryKey()', 'integer("id").primaryKey()', 'integer("id").primaryKey({ autoIncrement: true })')))
    if rng.random() < 0.2:
        rows.append("...audit")
    if rng.random() < 0.2:
        rows.append(f'madeUp: text("made_up").generatedAlwaysAs(sql`\'x\'`, {{ mode: "{rng.choice(("stored", "virtual"))}" }})')
    if rng.random() < 0.2:
        rows.append(f"madeFrom: text().generatedAlwaysAs((): any => sql`upper(${{{const}.{keys[0]}}})`)")
    callback = rng.random() < 0.2
    if callback:
        rows = [row.replace(": text(", ": t.text(").replace(": integer(", ": t.integer(").replace(": real(", ": t.real(").replace(": numeric(", ": t.numeric(").replace(": blob(", ": t.blob(") for row in rows]
    lines = []
    for row in rows:
        lines.append(f"  {row},")
        if rng.random() < 0.1:
            lines.append("  // a note that says .notNull()")
    body = "\n".join(lines)
    columns = f"(t) => ({{\n{body}\n}})" if callback else f"{{\n{body}\n}}"
    found = extras(rng, prefix, keys, tables, keyed)
    if not found:
        return f'export const {const} = sqliteTable("name_{number}", {columns});\n'
    if rng.random() < 0.5:
        third = "(t) => [\n    " + ",\n    ".join(found) + ",\n  ]"
    else:
        third = "(t) => ({\n    " + ",\n    ".join(f"part{index}: {item}" for index, item in enumerate(found)) + ",\n  })"
    return f'export const {const} = sqliteTable(\n  "name_{number}",\n  {columns},\n  {third},\n);\n'


def schema(rng: random.Random, count: int) -> str:
    made: list[str] = []
    parts = ['import { sql } from "drizzle-orm";\n' f'import {{ {IMPORTS} }} from "drizzle-orm/sqlite-core";\n', "type A = string;\ntype B = number;\n", SHARED]
    for number in range(count):
        keyed = rng.random() < 0.15
        parts.append(table(rng, number, made, keyed))
        if not keyed:
            made.append(f"table{number}")
    return "\n".join(parts)


def config(out: str, casing: str) -> str:
    line = f'  casing: "{casing}",\n' if casing else ""
    return f'export default {{\n  schema: "./db/schema.ts",\n  dialect: "sqlite",\n  out: "{out}",\n{line}}};\n'


def one_round(number: int, modules: Path, work: Path, count: int, rng: random.Random) -> dict:
    """Write a project, ask the tool, and compare. The tool's SQL stays out of the project."""
    project = work / f"round-{number:02}"
    generated = work / f"generated-{number:02}"
    (project / "db").mkdir(parents=True)
    (project / "node_modules").symlink_to(modules.resolve())
    casing = rng.choice(("", "snake_case", "camelCase"))
    (project / "db" / "schema.ts").write_text(schema(rng, count), encoding="utf-8")
    (project / "drizzle.config.ts").write_text(config(f"../{generated.name}", casing), encoding="utf-8")
    done = subprocess.run(["node_modules/.bin/drizzle-kit", "generate", "--name", "sweep"], cwd=project, capture_output=True, text=True, timeout=180)
    if done.returncode != 0:
        return {"failed": done.stdout + done.stderr, "project": project}
    truth = sqlite.Replay()
    for path in sorted(generated.glob("*.sql")):
        truth.run(path.name, 1, path.read_text(encoding="utf-8").replace("--> statement-breakpoint", ""))
    truth.retry()
    read = sqlite.extract(TreeSource(project))
    columns = sum(len(node["columns"]) for node in read["nodes"])
    return {
        "project": project,
        "casing": casing or "none",
        "tables": len(read["nodes"]),
        "columns": columns,
        "differences": sqlite.differences(read["nodes"], truth.connection),
        "unread": read["stats"]["drizzle_unread"],
        "rejected": dict(read["stats"]["unknown"]),
        "tool_rejected": dict(truth.unknown),
    }


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__, file=sys.stderr)
        return 2
    modules, work = Path(argv[0]), Path(argv[1])
    rounds = int(argv[2]) if len(argv) > 2 else 5
    count = int(argv[3]) if len(argv) > 3 else 40
    rng = random.Random(int(argv[4]) if len(argv) > 4 else 1)
    work.mkdir(parents=True, exist_ok=True)
    bad = 0
    for number in range(rounds):
        result = one_round(number, modules, work, count, rng)
        if "failed" in result:
            print(f"round {number}: the tool failed on {result['project']}\n{result['failed']}")
            bad += 1
            continue
        print(f"round {number}: casing {result['casing']}, {result['tables']} tables, {result['columns']} columns, {len(result['differences'])} differences, {len(result['unread'])} unread")
        for line in result["differences"] + [f"unread: {place}" for place in result["unread"]]:
            print(f"  {line}")
        for name in ("rejected", "tool_rejected"):
            if result[name]:
                print(f"  {name}: {result[name]}")
        bad += bool(result["differences"] or result["unread"] or result["rejected"] or result["tool_rejected"])
    print(f"{rounds} rounds, {bad} with a problem")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
