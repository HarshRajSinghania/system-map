import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core import store  # noqa: E402
from core.migrations import parse_migrations, statements_of, strip_noise  # noqa: E402

FIRST = """
-- a comment with CREATE TABLE ghost (id int);
CREATE TABLE public.orgs (
  id uuid PRIMARY KEY,
  name text NOT NULL UNIQUE,
  note text DEFAULT 'a; b',
  size numeric(10, 2) CHECK (size > 0)
);
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  old_col text,
  CONSTRAINT users_unique UNIQUE (org_id, id)
);

CREATE POLICY "read" ON public.orgs FOR SELECT TO authenticated USING (true);
CREATE POLICY "gone" ON public.orgs FOR DELETE USING (true);

CREATE FUNCTION public.f() RETURNS void LANGUAGE sql AS $$
  CREATE TABLE ghost2 (id int);
$$;
"""

SECOND = """
ALTER TABLE public.users ADD COLUMN team_id uuid REFERENCES public.orgs(id);
ALTER TABLE public.users DROP COLUMN old_col;
ALTER TABLE public.users ALTER COLUMN team_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS users_org_idx ON public.users (org_id);
DROP POLICY IF EXISTS "gone" ON public.orgs;
CREATE TABLE public.temp (id int);
DROP TABLE public.temp;
"""


class Fixture(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.base = Path(self._tmp.name)
        self.repo = self.base / "repo"
        migrations = self.repo / "supabase" / "migrations"
        migrations.mkdir(parents=True)
        (migrations / "001.sql").write_text(FIRST)
        (migrations / "002.sql").write_text(SECOND)
        self.data = self.base / "data"


class ParserTests(Fixture):
    def setUp(self):
        super().setUp()
        self.schema = parse_migrations(self.repo / "supabase" / "migrations", self.repo)

    def test_comments_and_function_bodies_are_not_schema(self):
        self.assertEqual(sorted(self.schema.tables), ["public.orgs", "public.users"])

    def test_columns_and_nullability(self):
        orgs = self.schema.tables["public.orgs"]
        self.assertEqual(list(orgs.columns), ["id", "name", "note", "size"])
        self.assertFalse(orgs.columns["name"]["nullable"])
        self.assertTrue(orgs.columns["note"]["nullable"])
        self.assertEqual(orgs.columns["size"]["type"], "numeric(10, 2)")

    def test_replay_applies_later_migrations(self):
        users = self.schema.tables["public.users"]
        self.assertNotIn("old_col", users.columns)
        self.assertFalse(users.columns["team_id"]["nullable"])
        self.assertEqual(users.indexes[0]["columns"], ["org_id"])

    def test_foreign_keys_and_delete_rule(self):
        fks = [c for c in self.schema.tables["public.users"].constraints if c["kind"] == "foreign_key"]
        self.assertEqual({f["columns"][0]: f["on_delete"] for f in fks}, {"org_id": "cascade", "team_id": "no action"})
        self.assertEqual(fks[0]["references"], "public.orgs")

    def test_rls_and_policies_replay(self):
        orgs = self.schema.tables["public.orgs"]
        self.assertTrue(orgs.rls)
        self.assertEqual(list(orgs.policies), ["read"])
        self.assertFalse(self.schema.tables["public.users"].rls)

    def test_every_fact_names_its_file_and_line(self):
        fk = next(c for c in self.schema.tables["public.users"].constraints if c["kind"] == "foreign_key")
        self.assertEqual(fk["source"], "supabase/migrations/001.sql:11")

    def test_strip_noise_keeps_line_numbers(self):
        sql = "select 1; -- x\n$$ a\nb $$;\nselect 2;"
        self.assertEqual(strip_noise(sql).count("\n"), sql.count("\n"))
        # The middle statement is only a blanked body, so it is not a statement at all.
        self.assertEqual([line for line, _ in statements_of(sql)], [1, 4])


class StoreTests(Fixture):
    def setUp(self):
        super().setUp()
        store.build(self.repo, self.data)
        self.target = store.repo_dir(self.repo, self.data)

    def test_one_file_per_table_with_a_hash(self):
        manifest = json.loads((self.target / "manifest.json").read_text())
        self.assertEqual(manifest["counts"]["tables"], 2)
        self.assertEqual(len(manifest["facts"]), 2)

    def test_overview_flags_a_table_without_rls(self):
        overview = (self.target / "overview.md").read_text()
        self.assertIn("users | 3 | 2 | 1 | 0 | NO", overview)

    def test_neighbors_go_both_ways(self):
        found = store.neighbors(self.target, "table:public.orgs")
        self.assertEqual(len(found["incoming"]), 2)
        self.assertEqual(found["outgoing"], [])

    def test_search_returns_ids_not_bodies(self):
        hits = store.search(self.target, "org_id")
        self.assertEqual(hits, [{"id": "table:public.users", "matched": ["column org_id"]}])

    def test_small_answers_stay_inline(self):
        self.assertTrue(store.fit(self.target, "x", "short")["inline"])

    def test_large_answers_go_to_a_file(self):
        result = store.fit(self.target, "x", "y" * 5000)
        self.assertFalse(result["inline"])
        self.assertEqual(Path(result["path"]).read_text(), "y" * 5000)
        self.assertLessEqual(len(result["head"]), 600)

    def test_note_needs_real_evidence(self):
        with self.assertRaises(ValueError):
            store.add_note(self.target, "table:public.orgs", "text", [])
        with self.assertRaises(ValueError):
            store.add_note(self.target, "table:public.orgs", "text", ["../../etc/passwd"])
        with self.assertRaises(ValueError):
            store.add_note(self.target, "table:public.orgs", "text", ["nope.sql:3"])

    def test_note_is_returned_with_its_node(self):
        store.add_note(self.target, "table:public.orgs", "Core table.", ["supabase/migrations/001.sql:3"])
        self.assertEqual(store.load_node(self.target, "table:public.orgs")["reads"][0]["text"], "Core table.")

    def test_tampered_facts_are_detected(self):
        self.assertEqual(store.verify_facts(self.target), [])
        path = self.target / "facts" / "tables" / "public.orgs.json"
        path.write_text(path.read_text() + " ")
        self.assertEqual(store.verify_facts(self.target), ["facts/tables/public.orgs.json"])

    def test_rebuild_keeps_notes(self):
        store.add_note(self.target, "table:public.orgs", "Keep me.", ["supabase/migrations/001.sql"])
        store.build(self.repo, self.data)
        self.assertEqual(len(store.load_notes(self.target, "table:public.orgs")), 1)

    def test_resolve_repo_defaults_to_the_only_model(self):
        self.assertEqual(store.resolve_repo(None, self.data), self.target)

    def test_staleness_counts_commits_behind(self):
        run = lambda *a: subprocess.run(["git", "-C", str(self.repo), *a], check=True, capture_output=True)
        run("init", "-q")
        run("-c", "user.name=t", "-c", "user.email=t@example.com", "commit", "-q", "--allow-empty", "-m", "one")
        store.build(self.repo, self.data)
        self.assertFalse(store.staleness(self.target)["stale"])
        run("-c", "user.name=t", "-c", "user.email=t@example.com", "commit", "-q", "--allow-empty", "-m", "two")
        self.assertEqual(store.staleness(self.target)["commits_behind"], 1)


if __name__ == "__main__":
    unittest.main()
