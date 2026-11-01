"""Each build says what it read and what it couldn't. Plans can come from a product brief."""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import read, store  # noqa: E402
from core.extractors import plans  # noqa: E402
from core.sources import open_source  # noqa: E402
from tests.helpers import commit_all, git  # noqa: E402


class Build(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base = Path(tmp.name).resolve()
        self.root = self.base / "repo"
        self.root.mkdir()
        self.data = self.base / "data"

    def write(self, name: str, text: str = "export const x = 1\n") -> None:
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)

    def build(self) -> dict:
        return store.build(self.root, self.data)

    def app(self, packages='"next": "16.0.0", "better-sqlite3": "13.0.0"'):
        self.write("package.json", '{"dependencies": {' + packages + "}}")
        self.write("tsconfig.json", '{"compilerOptions": {"paths": {"@/*": ["./*"]}}}')
        self.write("lib/db.ts")
        self.write("app/page.tsx", 'import { x } from "@/lib/db"\nexport default function Page() { return x }\n')


class WhatABuildRead(Build):
    def test_it_records_each_part(self):
        self.app()
        self.write("db/schema.sql", "CREATE TABLE a (id INTEGER PRIMARY KEY);\n")
        found = self.build()["read"]
        self.assertEqual(found["engine"], "sqlite")
        self.assertEqual(found["schema_files"], ["db/schema.sql"])
        self.assertEqual(found["tables"], 1)
        self.assertEqual(found["route_style"], "Next.js App Router")
        self.assertEqual(found["routes"], 1)
        self.assertEqual(found["code_files"], 2)
        self.assertGreaterEqual(found["links"], 1)
        self.assertEqual(found["unread"], [])

    def test_git_is_noted(self):
        self.app()
        self.assertFalse(self.build()["read"]["git"])
        git(self.root, "init", "-q")
        commit_all(self.root, "first")
        self.assertTrue(self.build()["read"]["git"])

    def test_a_statement_that_couldnt_run_is_named(self):
        self.app()
        self.write("schema.sql", "CREATE TABLE a (id INTEGER);\nCREATE TYPE x AS ENUM ('a');\n")
        unread = self.build()["read"]["unread"]
        self.assertEqual(unread[0]["what"], "1 SQL statement it couldn't read")

    def test_the_overview_says_it_for_agents(self):
        self.app()
        self.write("db/schema.sql", "CREATE TABLE a (id INTEGER PRIMARY KEY);\n")
        manifest = self.build()
        text = (store.current(self.data / "repos" / manifest["repo_key"]) / "overview.md").read_text()
        self.assertIn("Read: 1 table from sqlite; 1 route (Next.js App Router)", text)


class WhatItCouldntRead(Build):
    def unread(self) -> list[str]:
        return [item["what"] for item in self.build()["read"]["unread"]]

    def test_prisma_with_no_migrations_is_named(self):
        self.app('"next": "16.0.0", "@prisma/client": "6.0.0"')
        self.write("prisma/schema.prisma", 'datasource db {\n  provider = "postgresql"\n}\n')
        self.assertEqual(self.unread(), ["A Prisma schema with no SQL migrations"])

    def test_drizzle_with_no_migrations_is_named(self):
        self.app('"next": "16.0.0", "drizzle-orm": "1.0.0"')
        self.write("drizzle.config.ts")
        self.assertEqual(self.unread(), ["A Drizzle schema with no SQL migrations"])

    def test_other_databases_are_named(self):
        self.app('"next": "16.0.0", "mysql2": "3.0.0"')
        self.assertEqual(self.unread(), ["A MySQL database"])

    def test_a_next_app_in_a_subfolder_is_named(self):
        self.write("package.json", "{}")
        self.write("apps/web/next.config.ts")
        self.write("apps/web/app/page.tsx")
        self.assertEqual(self.unread(), ["A Next.js app in a subfolder"])

    def test_a_project_with_tables_has_nothing_to_explain(self):
        self.app()
        self.write("prisma/schema.prisma", 'datasource db {\n  provider = "sqlite"\n}\n')
        self.write("prisma/migrations/1_init/migration.sql", "CREATE TABLE a (id INTEGER PRIMARY KEY);\n")
        self.assertEqual(self.unread(), [])

    def test_a_folder_with_nothing_to_read_says_so_plainly(self):
        self.write("notes.txt", "hello\n")
        with self.assertRaisesRegex(ValueError, "no code or schema"):
            self.build()


class ProductBriefs(Build):
    def plans(self) -> list[dict]:
        manifest = self.build()
        system = store.load_system(self.data / "repos" / manifest["repo_key"])
        return [node for node in system["nodes"] if node["kind"] == "plan"]

    def test_a_brief_at_the_top_is_a_plan(self):
        self.app()
        self.write("BRIEF.md", "# Product brief\n\nGuests want fewer double bookings.\n")
        rows = self.plans()
        self.assertEqual([row["name"] for row in rows], ["Product brief"])
        self.assertEqual(rows[0]["path"], "BRIEF.md")

    def test_other_planning_files_count_in_any_case(self):
        self.app()
        for name in ("PLAN.md", "roadmap.md", "PRD.md", "SPEC.md", "TODO.md"):
            self.write(name, f"# {name}\n")
        self.assertEqual(len(self.plans()), 5)

    def test_a_readme_is_not_a_plan(self):
        self.app()
        self.write("README.md", "# Hello\n")
        self.write("CHANGELOG.md", "# Log\n")
        self.assertEqual(self.plans(), [])

    def test_a_plan_deep_in_the_tree_is_not_read_by_name(self):
        self.app()
        self.write("vendor/thing/PLAN.md", "# Not ours\n")
        self.assertEqual(self.plans(), [])


class PlansAreSteady(Build):
    def test_a_name_two_files_share_picks_the_same_file_each_time(self):
        self.app()
        self.write("lib/z/fields.ts")
        self.write("lib/a/fields.ts")
        self.write("docs/specs/one.md", "# One\n\n- `fields.ts`\n")
        index = plans.Index(open_source(self.root))
        self.assertEqual(index.match("fields.ts"), (True, "lib/a/fields.ts"))


class BackendRoutes(Build):
    def test_a_folder_with_no_git_can_be_added(self):
        self.app()
        self.write("db/schema.sql", "CREATE TABLE a (id INTEGER PRIMARY KEY);\n")
        code = (
            "import sys, json\n"
            f"sys.path.insert(0, {str(ROOT)!r})\n"
            "from pathlib import Path\n"
            "from core import store\n"
            f"print(store.check_folder(Path({str(self.root)!r})))\n"
        )
        done = subprocess.run(
            [sys.executable, "-c", code],
            capture_output=True,
            text=True,
            env={**os.environ, "SYSTEM_MAP_DATA": str(self.data)},
            check=True,
        )
        self.assertEqual(done.stdout.strip(), str(self.root))


class TheOneLineSummary(unittest.TestCase):
    def test_a_project_with_no_git_says_what_that_costs(self):
        line = read.tell({"engine": None, "tables": 0, "routes": 0, "route_style": "", "code_files": 3, "links": 1, "git": False, "unread": []})
        self.assertIn("no git history", line)

    def test_what_went_unread_is_named_with_its_file(self):
        unread = [{"what": "A Prisma schema with no SQL migrations", "where": "prisma/schema.prisma"}]
        line = read.tell({"engine": None, "tables": 0, "routes": 0, "route_style": "", "code_files": 3, "links": 1, "git": True, "unread": unread})
        self.assertIn("Not read: A Prisma schema with no SQL migrations (prisma/schema.prisma).", line)


if __name__ == "__main__":
    unittest.main()
