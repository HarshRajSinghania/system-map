"""A small web app in Next.js, TypeScript and SQLite, laid out the many ways people lay one out.

Each app here is built end to end. The promise is that an unfamiliar app of this kind gives a
real map: tables, routes, links between them, and nothing left unexplained.
"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import explore, store  # noqa: E402
from tests.helpers import commit_all, git  # noqa: E402

SCHEMA = """CREATE TABLE guests (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE stays (
  id INTEGER PRIMARY KEY,
  guest_id INTEGER NOT NULL REFERENCES guests(id),
  nights INTEGER NOT NULL
);
"""
QUERIES = """import {{ db }} from "{db}";

export function stays() {{
  return db.prepare("SELECT * FROM stays").all();
}}

export function book(guest: number, nights: number) {{
  const sql = `
    INSERT INTO stays (guest_id, nights)
    VALUES (?, ?)
  `;
  return db.prepare(sql).run(guest, nights);
}}
"""
PAGE = """import {{ stays }} from "{queries}";

export default function Page() {{
  return <ul>{{stays().map((stay) => <li key={{stay.id}}>{{stay.nights}}</li>)}}</ul>;
}}
"""
HANDLER = """import {{ book }} from "{queries}";

export async function POST() {{
  return Response.json(book(1, 2));
}}
"""
ROOT_ALIAS = '{"compilerOptions": {"paths": {"@/*": ["./*"]}}}'
SRC_ALIAS = '{"compilerOptions": {"paths": {"@/*": ["./src/*"]}}}'
NEXT = {"next": "16.0.0", "react": "19.0.0"}


def package(**extra) -> str:
    return json.dumps({"name": "app", "dependencies": {**NEXT, **extra}})


def app_router(prefix: str = "", tsconfig: str = ROOT_ALIAS) -> dict:
    return {
        "tsconfig.json": tsconfig,
        f"{prefix}lib/db.ts": 'export const db = {} as any;\n',
        f"{prefix}lib/queries.ts": QUERIES.format(db="@/lib/db"),
        f"{prefix}app/page.tsx": PAGE.format(queries="@/lib/queries"),
        f"{prefix}app/stays/[id]/page.tsx": PAGE.format(queries="@/lib/queries"),
        f"{prefix}app/api/book/route.ts": HANDLER.format(queries="@/lib/queries"),
    }


APPS = {
    "a schema file at db/schema.sql": {
        **app_router(),
        "package.json": package(**{"better-sqlite3": "13.0.0"}),
        "db/schema.sql": SCHEMA,
    },
    "everything inside src": {
        **app_router("src/", SRC_ALIAS),
        "package.json": package(**{"better-sqlite3": "13.0.0"}),
        "src/db/schema.sql": SCHEMA,
    },
    "the schema inside the code": {
        **app_router(),
        "package.json": package(**{"better-sqlite3": "13.0.0"}),
        "lib/db.ts": 'import Database from "better-sqlite3";\nexport const db = new Database("app.db");\ndb.exec(`\n' + SCHEMA.replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS") + "`);\n",
    },
    "Prisma with SQLite": {
        **app_router(),
        "package.json": package(**{"@prisma/client": "6.0.0"}),
        "prisma/schema.prisma": 'datasource db {\n  provider = "sqlite"\n  url = "file:./dev.db"\n}\n',
        "prisma/migrations/20260101_init/migration.sql": SCHEMA,
    },
    "Drizzle with SQLite": {
        **app_router(),
        "package.json": package(**{"better-sqlite3": "13.0.0", "drizzle-orm": "1.0.0"}),
        "drizzle.config.ts": "export default {}\n",
        "drizzle/0000_first.sql": SCHEMA.replace(";\n\nCREATE", ";\n--> statement-breakpoint\nCREATE"),
    },
    "Node's built-in SQLite": {
        **app_router(),
        "package.json": package(),
        "lib/db.ts": 'import { DatabaseSync } from "node:sqlite";\nexport const db = new DatabaseSync("app.db");\n',
        "sql/init.sql": SCHEMA,
    },
    "migrations in a folder": {
        **app_router(),
        "package.json": package(sqlite3="5.0.0"),
        "migrations/001_guests.sql": SCHEMA.split("\n\n")[0] + "\n",
        "migrations/002_stays.sql": SCHEMA.split("\n\n")[1],
    },
    "the Pages Router": {
        "package.json": package(**{"better-sqlite3": "13.0.0"}),
        "schema.sql": SCHEMA,
        "lib/db.ts": "export const db = {} as any;\n",
        "lib/queries.ts": QUERIES.format(db="./db"),
        "pages/index.tsx": PAGE.format(queries="../lib/queries"),
        "pages/stays/[id].tsx": PAGE.format(queries="../../lib/queries"),
        "pages/api/book.ts": 'import { book } from "../../lib/queries";\nexport default function handler() { return book(1, 2); }\n',
    },
}


class AnUnfamiliarApp(unittest.TestCase):
    def build(self, files: dict, use_git: bool) -> tuple[dict, Path, Path]:
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        base = Path(tmp.name).resolve()
        repo = base / "app"
        for name, text in files.items():
            path = repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        if use_git:
            git(repo, "init", "-q")
            commit_all(repo, "first")
        data = base / "data"
        manifest = store.build(repo, data)
        return manifest, data / "repos" / manifest["repo_key"], repo

    def test_each_layout_gives_a_real_map(self):
        for name, files in APPS.items():
            for use_git in (True, False):
                with self.subTest(app=name, git=use_git):
                    manifest, target, _repo = self.build(files, use_git)
                    read = manifest["read"]
                    self.assertEqual(read["engine"], "sqlite")
                    self.assertEqual(read["tables"], 2)
                    self.assertEqual(read["unread"], [])
                    self.assertGreaterEqual(read["routes"], 3)
                    self.assertTrue(read["route_style"].startswith("Next.js"))
                    self.assertEqual(read["git"], use_git)
                    system = store.load_system(target)
                    kinds = {edge["kind"] for edge in system["edges"]}
                    self.assertLessEqual({"imports", "renders", "uses_table"}, kinds)
                    tables = {edge["target"] for edge in system["edges"] if edge["kind"] == "uses_table"}
                    self.assertEqual(tables, {"table:main.stays"})

    def test_every_tool_an_agent_uses_answers(self):
        manifest, target, _repo = self.build(APPS["a schema file at db/schema.sql"], False)
        self.assertEqual(store.table_index(target)[0]["id"], "table:main.guests")
        self.assertEqual(store.load_node(target, "table:main.stays")["name"], "stays")
        self.assertTrue(store.neighbors(target, "table:main.guests")["incoming"])
        self.assertIn("modules", store.load_risk(target))
        self.assertEqual(store.worktree_state(target)["overlaps"], [])
        self.assertEqual(explore.summary(target)["proposals"], [])
        self.assertIsInstance(store.plan_items(target), list)
        self.assertTrue(store.load_findings(target))
        self.assertIn("Read: 2 tables from sqlite", (store.current(target) / "overview.md").read_text())

    def test_a_brief_shows_as_a_plan(self):
        _manifest, target, _repo = self.build({**APPS["a schema file at db/schema.sql"], "BRIEF.md": "# Product brief\n\nGuests want fewer bugs.\n"}, True)
        self.assertEqual([plan["name"] for plan in store.plan_items(target)], ["Product brief"])

    def test_an_app_with_only_a_prisma_schema_explains_itself(self):
        files = {**app_router(), "package.json": package(**{"@prisma/client": "6.0.0"}), "prisma/schema.prisma": 'datasource db {\n  provider = "sqlite"\n}\n'}
        manifest, _target, _repo = self.build(files, True)
        self.assertEqual(manifest["read"]["tables"], 0)
        self.assertEqual(manifest["read"]["routes"], 3)
        self.assertEqual(manifest["read"]["unread"][0]["where"], "prisma/schema.prisma")

    def test_nothing_is_written_to_the_app(self):
        for use_git in (True, False):
            with self.subTest(git=use_git):
                _manifest, _target, repo = self.build(APPS["a schema file at db/schema.sql"], use_git)
                names = sorted(path.as_posix() for path in repo.rglob("*") if ".git/" not in path.as_posix())
                self.assertFalse([name for name in names if name.endswith((".db", ".sqlite"))])


if __name__ == "__main__":
    unittest.main()
