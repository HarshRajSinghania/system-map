import io
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from core import agent_drafts, explore, findings, store, verify  # noqa: E402
from core.sources import GitSource, TreeSource, canonical_root, default_ref  # noqa: E402
from helpers import commit_all, git, write_migration  # noqa: E402

BASE = """
CREATE TABLE public.orgs (
  id uuid PRIMARY KEY,
  name text NOT NULL
);
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE
);
"""


class Fixture(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base = Path(tmp.name)
        self.repo = self.base / "repo"
        self.repo.mkdir()
        git(self.repo, "init", "-q", "-b", "main")
        write_migration(self.repo, "001.sql", BASE)
        self.first = commit_all(self.repo, "first")
        self.data = self.base / "data"
        self.manifest = store.build(self.repo, self.data)
        self.target = store.repo_dir(self.repo, self.data)


class Sources(Fixture):
    def test_main_is_the_default_ref(self):
        self.assertEqual(default_ref(self.repo), "main")

    def test_a_folder_without_git_uses_the_tree(self):
        plain = self.base / "plain"
        write_migration(plain, "001.sql", BASE)
        store.build(plain, self.data)
        self.assertEqual(store.read_manifest(store.repo_dir(plain, self.data))["ref"], "working tree")

    def test_git_source_reads_the_ref_not_the_checkout(self):
        write_migration(self.repo, "001.sql", "CREATE TABLE ghost (id int);")
        text = GitSource(self.repo, "main").read_many(["supabase/migrations/001.sql"])
        self.assertIn("orgs", text["supabase/migrations/001.sql"])

    def test_a_checkout_on_a_branch_still_models_main(self):
        git(self.repo, "checkout", "-q", "-b", "feature")
        write_migration(self.repo, "002.sql", "CREATE TABLE feature_only (id int);")
        commit_all(self.repo)
        manifest = store.build(self.repo, self.data)
        self.assertEqual(manifest["ref"], "main")
        self.assertEqual(manifest["counts"]["tables"], 2)

    def test_a_worktree_shares_its_repo_model(self):
        worktree = self.base / "wt"
        git(self.repo, "worktree", "add", "-q", "-b", "side", str(worktree))
        self.assertEqual(canonical_root(worktree), self.repo.resolve())
        self.assertEqual(store.repo_dir(worktree, self.data), self.target)

    def test_tree_source_skips_dependencies(self):
        (self.repo / "node_modules").mkdir()
        (self.repo / "node_modules" / "x.ts").write_text("x")
        self.assertNotIn("node_modules/x.ts", TreeSource(self.repo).blobs)


class Versions(Fixture):
    def test_one_file_per_table_with_a_hash(self):
        self.assertEqual(self.manifest["counts"]["tables"], 2)
        tables = [path for path in self.manifest["facts"] if "/tables/" in path]
        self.assertEqual(len(tables), 2)
        self.assertEqual(store.verify_facts(self.target), [])

    def test_rebuilding_with_nothing_new_reports_unchanged(self):
        self.assertTrue(store.build(self.repo, self.data).get("unchanged"))

    def test_a_new_migration_makes_a_new_version_and_keeps_notes(self):
        store.add_note(self.target, "table:public.orgs", "Keep me.", ["supabase/migrations/001.sql"])
        write_migration(self.repo, "002.sql", "CREATE TABLE t (id int PRIMARY KEY);")
        commit_all(self.repo)
        manifest = store.build(self.repo, self.data)
        self.assertNotEqual(manifest["version"], self.manifest["version"])
        self.assertTrue((self.target / "versions" / self.manifest["version"]).is_dir())
        self.assertEqual(len(store.load_notes(self.target, "table:public.orgs")), 1)

    def test_a_failed_build_leaves_the_model_alone(self):
        write_migration(self.repo, "002.sql", "CREATE TABLE t (id int PRIMARY KEY);")
        commit_all(self.repo)
        original, store._write_version = store._write_version, lambda *a: 1 / 0
        self.addCleanup(setattr, store, "_write_version", original)
        with self.assertRaises(ZeroDivisionError):
            store.build(self.repo, self.data)
        self.assertEqual(store.read_manifest(self.target)["version"], self.manifest["version"])
        self.assertEqual([p.name for p in (self.target / "versions").iterdir() if p.name.startswith(".")], [])

    def test_old_versions_are_pruned(self):
        for number in range(8):
            write_migration(self.repo, f"1{number}.sql", f"CREATE TABLE t{number} (id int PRIMARY KEY);")
            commit_all(self.repo)
            store.build(self.repo, self.data)
        self.assertEqual(len(list((self.target / "versions").iterdir())), store.KEEP_VERSIONS)

    def test_tampered_facts_are_detected(self):
        relative = next(iter(self.manifest["facts"]))
        path = self.target / relative
        path.write_text(path.read_text() + " ")
        self.assertEqual(store.verify_facts(self.target), [relative])

    def test_an_old_format_model_is_ignored(self):
        path = self.target / "manifest.json"
        path.write_text(json.dumps({**self.manifest, "schema_version": 1}))
        self.assertEqual(store.repos(self.data), [])

    def test_startup_refresh_upgrades_an_old_format_model(self):
        old = {"schema_version": 1, "repo": str(self.repo), "repo_key": self.target.name, "commit": self.first}
        (self.target / "manifest.json").write_text(json.dumps(old))
        (self.target / "facts" / "tables").mkdir(parents=True)
        (self.target / "overview.md").write_text("old")
        self.assertEqual(store.refresh_all(self.data), [self.target.name])
        self.assertEqual(len(store.repos(self.data)), 1)
        self.assertFalse((self.target / "facts").exists())
        self.assertFalse((self.target / "overview.md").exists())

    def test_startup_refresh_survives_a_repo_that_is_gone(self):
        path = self.target / "manifest.json"
        path.write_text(json.dumps({**self.manifest, "repo": str(self.base / "gone")}))
        self.assertEqual(store.refresh_all(self.data), [])

    def test_a_parser_change_makes_a_new_version(self):
        original = store._builder_id
        store._builder_id = lambda: "something else"
        self.addCleanup(setattr, store, "_builder_id", original)
        self.assertFalse(store.build(self.repo, self.data).get("unchanged"))


class Freshness(Fixture):
    def test_a_commit_without_a_migration_is_behind_but_not_stale(self):
        (self.repo / "README.md").write_text("x")
        commit_all(self.repo)
        fresh = store.freshness(self.target)
        self.assertFalse(fresh["stale"])
        self.assertEqual(fresh["commits_behind"], 1)

    def test_a_new_migration_is_stale(self):
        write_migration(self.repo, "002.sql", "CREATE TABLE t (id int);")
        commit_all(self.repo)
        fresh = store.freshness(self.target)
        self.assertTrue(fresh["stale"])
        self.assertEqual(fresh["changed_inputs"], ["supabase/migrations/002.sql"])

    def test_current_model_is_fresh(self):
        fresh = store.freshness(self.target)
        self.assertFalse(fresh["stale"])
        self.assertEqual(fresh["commits_behind"], 0)


class Reading(Fixture):
    def test_overview_flags_a_table_without_rls(self):
        overview = (store.current(self.target) / "overview.md").read_text()
        self.assertIn("users | 2 | 1 | 0 | 0 | NO", overview)
        self.assertIn("1 high", overview)

    def test_a_huge_schema_keeps_the_overview_under_its_limit(self):
        sql = "\n".join(f"CREATE TABLE a_rather_long_table_name_{i} (id int PRIMARY KEY);" for i in range(500))
        write_migration(self.repo, "002.sql", sql)
        commit_all(self.repo)
        store.build(self.repo, self.data)
        overview = (store.current(self.target) / "overview.md").read_text()
        self.assertLess(len(overview), store.OVERVIEW_LIMIT_CHARS)
        self.assertIn("more. Use `search`", overview)

    def test_neighbors_go_both_ways(self):
        found = store.neighbors(self.target, "table:public.orgs")
        self.assertEqual(found["incoming"][0]["table"], "table:public.users")
        self.assertEqual(found["outgoing"], [])

    def test_search_returns_ids_not_bodies(self):
        hits = store.search(self.target, "org_id")
        self.assertEqual(hits, [{"id": "table:public.users", "matched": ["column org_id"]}])

    def test_graph_has_tables_lines_and_key_flags(self):
        graph = store.graph(self.target)
        self.assertEqual(len(graph["tables"]), 2)
        self.assertEqual(graph["edges"][0]["target"], "table:public.orgs")
        users = next(t for t in graph["tables"] if t["name"] == "users")
        self.assertTrue(next(c for c in users["columns"] if c["name"] == "org_id")["foreign"])
        self.assertTrue(next(c for c in users["columns"] if c["name"] == "id")["primary"])

    def test_graph_draws_an_outside_table_as_a_stub(self):
        write_migration(self.repo, "002.sql", "CREATE TABLE t (u uuid REFERENCES auth.users(id));")
        commit_all(self.repo)
        store.build(self.repo, self.data)
        stub = next(t for t in store.graph(self.target)["tables"] if t["id"] == "table:auth.users")
        self.assertEqual(stub["status"], "external")

    def test_a_node_carries_its_findings(self):
        node = store.load_node(self.target, "table:public.users")
        self.assertIn("rls_off", [f["check"] for f in node["findings"]])

    def test_every_node_has_status_layer_and_evidence(self):
        node = store.load_node(self.target, "table:public.orgs")
        self.assertEqual((node["status"], node["layer"]), ("built", "facts"))
        self.assertEqual(node["evidence"], ["supabase/migrations/001.sql:2"])


class Budgets(Fixture):
    def test_small_answers_stay_inline(self):
        self.assertTrue(store.fit(self.target, "x", "short")["inline"])

    def test_large_answers_go_to_a_file(self):
        text = "y" * (store.DEFAULT_BUDGET_CHARS + 1)
        result = store.fit(self.target, "x", text)
        self.assertFalse(result["inline"])
        self.assertEqual(Path(result["path"]).read_text(), text)
        self.assertLessEqual(len(result["head"]), 600)


class Notes(Fixture):
    def test_note_needs_real_evidence(self):
        for evidence in ([], ["../../etc/passwd"], ["nope.sql:3"]):
            with self.assertRaises(ValueError):
                store.add_note(self.target, "table:public.orgs", "text", evidence)

    def test_evidence_is_checked_at_the_models_commit(self):
        write_migration(self.repo, "002.sql", "CREATE TABLE t (id int);")
        with self.assertRaises(ValueError):
            store.add_note(self.target, "table:public.orgs", "text", ["supabase/migrations/002.sql"])

    def test_note_is_returned_with_its_node(self):
        store.add_note(self.target, "table:public.orgs", "Core table.", ["supabase/migrations/001.sql:3"])
        self.assertEqual(store.load_node(self.target, "table:public.orgs")["reads"][0]["text"], "Core table.")


class ResolveRepo(Fixture):
    def test_the_only_model_is_the_default(self):
        self.assertEqual(store.resolve_repo(None, self.data), self.target)

    def test_a_worktree_path_finds_its_repo(self):
        worktree = self.base / "wt"
        git(self.repo, "worktree", "add", "-q", "-b", "side", str(worktree))
        self.assertEqual(store.resolve_repo(str(worktree), self.data), self.target)


def node(**changes) -> dict:
    base = {
        "id": "table:public.t",
        "name": "t",
        "schema": "public",
        "source": "m.sql:1",
        "rls": True,
        "rls_source": "m.sql:2",
        "columns": [{"name": "id", "source": "m.sql:1"}],
        "constraints": [{"name": "t_pkey", "kind": "primary_key", "columns": ["id"], "source": "m.sql:1"}],
        "indexes": [],
        "policies": [{"name": "p"}],
    }
    return {**base, **changes}


def fk(column: str, on_delete: str = "cascade") -> dict:
    return {
        "name": f"t_{column}_fkey",
        "kind": "foreign_key",
        "columns": [column],
        "references": "public.p",
        "on_delete": on_delete,
        "source": "m.sql:3",
    }


def checks(found: list[dict]) -> list[str]:
    return [f["check"] for f in found]


class Findings(unittest.TestCase):
    def test_a_clean_table_has_no_findings(self):
        self.assertEqual(findings.check_table(node()), [])

    def test_rls_off(self):
        found = findings.check_table(node(rls=False))
        self.assertEqual((found[0]["check"], found[0]["severity"]), ("rls_off", "high"))

    def test_rls_off_only_matters_in_public(self):
        self.assertNotIn("rls_off", checks(findings.check_table(node(rls=False, schema="private"))))

    def test_rls_on_with_no_policy(self):
        self.assertEqual(checks(findings.check_table(node(policies=[]))), ["rls_no_policy"])

    def test_no_primary_key(self):
        self.assertEqual(checks(findings.check_table(node(constraints=[]))), ["no_primary_key"])

    def test_fk_without_an_index(self):
        table = node(constraints=[*node()["constraints"], fk("p_id")])
        found = findings.check_table(table)
        self.assertEqual((found[0]["check"], found[0]["severity"]), ("fk_no_index", "medium"))
        self.assertEqual(found[0]["evidence"], ["m.sql:3"])

    def test_fk_with_no_delete_action_is_lower(self):
        table = node(constraints=[*node()["constraints"], fk("p_id", "no action")])
        self.assertEqual(findings.check_table(table)[0]["severity"], "low")

    def test_fk_covered_by_a_leading_index_column(self):
        index = {"name": "i", "columns": ["p_id", "other"], "partial": False, "source": "m.sql:4"}
        table = node(constraints=[*node()["constraints"], fk("p_id")], indexes=[index])
        self.assertEqual(findings.check_table(table), [])

    def test_fk_not_covered_by_a_trailing_index_column(self):
        index = {"name": "i", "columns": ["other", "p_id"], "partial": False, "source": "m.sql:4"}
        table = node(constraints=[*node()["constraints"], fk("p_id")], indexes=[index])
        self.assertEqual(checks(findings.check_table(table)), ["fk_no_index"])

    def test_a_partial_index_does_not_cover_a_fk(self):
        index = {"name": "i", "columns": ["p_id"], "partial": True, "source": "m.sql:4"}
        table = node(constraints=[*node()["constraints"], fk("p_id")], indexes=[index])
        self.assertEqual(checks(findings.check_table(table)), ["fk_no_index"])

    def test_fk_covered_by_a_unique_rule(self):
        unique = {"name": "u", "kind": "unique", "columns": ["p_id"], "source": "m.sql:5"}
        table = node(constraints=[*node()["constraints"], fk("p_id"), unique])
        self.assertEqual(findings.check_table(table), [])

    def test_an_index_repeating_a_key_is_a_duplicate(self):
        index = {"name": "i", "columns": ["id"], "partial": False, "source": "m.sql:4"}
        found = findings.check_table(node(indexes=[index]))
        self.assertEqual(checks(found), ["index_duplicate"])
        self.assertEqual(found[0]["evidence"], ["m.sql:4", "m.sql:1"])

    def test_two_same_indexes_are_a_duplicate(self):
        indexes = [{"name": n, "columns": ["a"], "partial": False, "source": "m.sql:4"} for n in ("i", "j")]
        self.assertEqual(checks(findings.check_table(node(indexes=indexes))), ["index_duplicate"])

    def test_unused_column_is_flagged_softly(self):
        table = node(columns=[{"name": "id", "source": "m.sql:1"}, {"name": "ghost", "source": "m.sql:2"}])
        found = findings.check_unused(table, {"id"})
        self.assertEqual([f["id"] for f in found], ["column_unused:public.t:ghost"])
        self.assertEqual(found[0]["severity"], "info")

    def test_key_columns_never_count_as_unused(self):
        self.assertEqual(findings.check_unused(node(), set()), [])

    def test_findings_sort_worst_first(self):
        found = findings.find([node(rls=False, policies=[], constraints=[])], set())
        self.assertEqual([f["severity"] for f in found][:2], ["high", "medium"])


class CodeScan(unittest.TestCase):
    def test_generated_types_and_tests_are_not_usage(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        root = Path(tmp.name)
        (root / "src" / "integrations" / "supabase").mkdir(parents=True)
        (root / "src" / "integrations" / "supabase" / "types.ts").write_text("generated_only")
        (root / "src" / "a.test.ts").write_text("test_only")
        (root / "src" / "a.ts").write_text("real_use")
        tokens = findings.code_tokens(TreeSource(root), "from_sql")
        self.assertEqual(tokens & {"generated_only", "test_only", "real_use", "from_sql"}, {"real_use", "from_sql"})

    def test_a_seed_file_is_not_usage(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        root = Path(tmp.name)
        (root / "db").mkdir()
        (root / "db" / "seed.ts").write_text("seed_only")
        (root / "db" / "a.ts").write_text("real_use")
        self.assertEqual(findings.code_tokens(TreeSource(root), "") & {"seed_only", "real_use"}, {"real_use"})

    def test_what_counts_as_a_seed_file(self):
        seeds = ["seed.ts", "db/seed.ts", "prisma/seed.mjs", "db/seeds/users.ts", "db/seeders/a.js", "scripts/seed-db.ts", "seed_data.py", "seedData.ts", "lib/runSeed.ts", "db.seed.ts"]
        for path in seeds:
            with self.subTest(path):
                self.assertTrue(findings.SEED_FILE.search(path))
        for path in ("lib/seedling.ts", "app/seeded-random.ts", "lib/users.ts", "components/Aseedy.tsx"):
            with self.subTest(path):
                self.assertFalse(findings.SEED_FILE.search(path))


class Compare(unittest.TestCase):
    def shard(self, **changes) -> dict:
        return {
            "name": "t",
            "schema": "public",
            "source": "m.sql:1",
            "rls": True,
            "columns": [{"name": "id", "type": "timestamptz", "nullable": False, "default": None, "generated": False, "source": "m.sql:2"}],
            "constraints": [],
            "indexes": [],
            "policies": [],
            "triggers": [],
            **changes,
        }

    def catalog(self, **changes) -> dict:
        table = {
            "schema": "public",
            "name": "t",
            "rls": True,
            "columns": [{"name": "id", "type": "timestamp with time zone", "nullable": False, "has_default": False}],
            "constraints": None,
            "indexes": None,
            "policies": None,
            "triggers": None,
            **changes,
        }
        return {"tables": [table], "types": []}

    def test_a_match_reports_nothing(self):
        self.assertEqual(verify.compare([self.shard()], [], self.catalog()), [])

    def test_each_side_can_report_a_missing_thing(self):
        diffs = verify.compare([self.shard(rls=False)], [], self.catalog())
        self.assertEqual(diffs[0]["what"], "rls")

    def test_a_table_only_in_postgres_is_reported(self):
        catalog = self.catalog()
        catalog["tables"].append({**catalog["tables"][0], "name": "extra"})
        self.assertEqual(verify.compare([self.shard()], [], catalog)[0]["item"], "public.extra")

    def test_other_schemas_are_left_out(self):
        catalog = self.catalog()
        catalog["tables"].append({**catalog["tables"][0], "schema": "auth"})
        self.assertEqual(verify.compare([self.shard()], [], catalog), [])

    def test_type_spellings_normalize(self):
        pairs = [
            ("int", "integer"),
            ("timestamptz", "timestamp with time zone"),
            ("VARCHAR(20)", "character varying(20)"),
            ("numeric(10, 2)", "numeric(10,2)"),
            ("public.mood", "mood"),
            ("text[]", "text[]"),
            ("bool", "boolean"),
        ]
        for one, two in pairs:
            self.assertEqual(verify.normal_type(one), verify.normal_type(two))

    def test_a_source_line_must_name_its_fact(self):
        shard = self.shard()
        files = {"m.sql": "create table t (\n  wrong int\n);"}
        bad = verify.source_lines_name_their_facts([shard], files.__getitem__)
        self.assertEqual([b["fact"] for b in bad], ["id"])


BROKEN = b'{"half": \xff'
#: Valid UTF-8 that stops mid-object, so it fails as JSON and not as text.
SYNTAX = b'{"half": '
STAMP = "20261108T120000Z"


class SetAside(Fixture):
    """A saved file that can't be read is moved to unreadable/ and the reader carries on."""

    def setUp(self):
        super().setUp()
        patch = mock.patch("core.store.time.strftime", return_value=STAMP)
        patch.start()
        self.addCleanup(patch.stop)

    def broken(self, relative: str, data: bytes = BROKEN) -> Path:
        path = self.target / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return path

    def assert_kept(self, relative: str, data: bytes = BROKEN) -> None:
        kept = self.target / "unreadable" / f"{relative}.{STAMP}"
        self.assertEqual(kept.read_bytes(), data)
        self.assertFalse((self.target / relative).exists())

    def kept_files(self) -> list[str]:
        folder = self.target / "unreadable"
        return sorted(p.relative_to(folder).as_posix() for p in folder.rglob("*") if p.is_file()) if folder.is_dir() else []

    def test_each_saved_file_reads_as_its_empty_default_and_is_kept(self):
        cases = (
            ("intent/plan_status.json", lambda: store._plan_overrides(self.target), {}),
            ("intent/agents.json", lambda: store.load_agent_settings(self.target), {}),
            ("intent/regions.json", lambda: store.load_regions(self.target), {}),
            ("coverage.json", lambda: store.load_coverage(self.target), None),
            ("reads/table_public.orgs/a.json", lambda: store.load_notes(self.target, "table:public.orgs"), []),
            ("intent/proposals/p.json", lambda: explore.list_items(self.target, "proposals"), []),
            ("intent/use_cases/u.json", lambda: explore.list_items(self.target, "use_cases"), []),
            ("intent/views/v.json", lambda: explore.list_items(self.target, "views"), []),
            ("intent/agents-draft.json", lambda: agent_drafts.load(self.target)["draft"], None),
        )
        for data in (BROKEN, SYNTAX):
            shutil.rmtree(self.target / "unreadable", ignore_errors=True)
            for relative, read, empty in cases:
                with self.subTest(relative, data=data):
                    self.broken(relative, data)
                    self.assertEqual(read(), empty)
                    self.assert_kept(relative, data)

    def test_a_bad_proposal_is_a_missing_one_and_a_bad_draft_is_a_missing_draft(self):
        self.broken("intent/proposals/p.json")
        with self.assertRaises(KeyError):
            explore.get_item(self.target, "proposals", "p")
        self.assert_kept("intent/proposals/p.json")
        self.broken("intent/agents-draft.json")
        with self.assertRaises(KeyError):
            agent_drafts._read(self.target, "any")
        self.assert_kept("intent/agents-draft.json")

    def test_one_bad_file_in_a_folder_hides_none_of_the_others(self):
        folder = self.target / "intent" / "proposals"
        self.broken("intent/proposals/bad.json")
        (folder / "good.json").write_text(json.dumps({"id": "good", "updated_at": 5}))
        self.assertEqual([row["id"] for row in explore.list_items(self.target, "proposals")], ["good"])
        self.assert_kept("intent/proposals/bad.json")
        self.assertTrue((folder / "good.json").is_file())

    def test_notes_beside_a_bad_one_still_load(self):
        store.add_note(self.target, "table:public.orgs", "Core table.", ["supabase/migrations/001.sql:3"])
        self.broken("reads/table_public.orgs/aaa.json")
        self.assertEqual([n["text"] for n in store.load_notes(self.target, "table:public.orgs")], ["Core table."])

    def test_a_missing_file_gives_the_default_and_keeps_nothing(self):
        self.assertEqual(store.load_regions(self.target), {})
        self.assertEqual(store.set_aside(self.target), [])

    def test_a_good_file_is_left_alone(self):
        path = self.target / "intent" / "regions.json"
        path.parent.mkdir(parents=True)
        path.write_text('{"svc": {"region": "eu"}}')
        self.assertEqual(store.load_regions(self.target), {"svc": {"region": "eu"}})
        self.assertTrue(path.is_file())
        self.assertEqual(store.set_aside(self.target), [])

    def test_a_second_bad_file_of_the_same_name_keeps_both(self):
        for suffix in ("", "-2", "-3"):
            self.broken("intent/regions.json")
            store.load_regions(self.target)
            kept = self.target / "unreadable" / f"intent/regions.json.{STAMP}{suffix}"
            self.assertEqual(kept.read_bytes(), BROKEN)

    def test_set_aside_lists_what_was_kept_sorted(self):
        self.broken("intent/regions.json")
        self.broken("coverage.json")
        store.load_regions(self.target)
        store.load_coverage(self.target)
        self.assertEqual(
            store.set_aside(self.target),
            [
                {"file": "coverage.json", "kept_as": f"unreadable/coverage.json.{STAMP}"},
                {"file": "intent/regions.json", "kept_as": f"unreadable/intent/regions.json.{STAMP}"},
            ],
        )

    def test_the_stamp_is_utc_to_the_second(self):
        mock.patch.stopall()
        self.broken("intent/regions.json")
        store.load_regions(self.target)
        (kept,) = (self.target / "unreadable" / "intent").iterdir()
        self.assertRegex(kept.name, r"^regions\.json\.\d{8}T\d{6}Z$")

    def test_a_request_that_loses_the_race_still_succeeds_with_one_copy_kept(self):
        path = self.broken("intent/regions.json")
        real = os.replace

        def other_request_moved_it_first(source, destination):
            real(source, self.target / "unreadable" / "intent" / f"regions.json.{STAMP}-other")
            raise FileNotFoundError(source)

        with mock.patch("core.store.os.replace", side_effect=other_request_moved_it_first):
            self.assertEqual(store.load_regions(self.target), {})
        self.assertFalse(path.exists())
        self.assertEqual(self.kept_files(), [f"intent/regions.json.{STAMP}-other"])  # no empty reservation left over
        self.assertEqual(len(store.set_aside(self.target)), 1)

    def test_the_source_gone_after_the_name_is_reserved_leaves_no_empty_copy(self):
        path = self.broken("intent/regions.json")
        real = store._reserve

        def reserve_then_lose_the_file(base):
            kept = real(base)
            path.unlink()
            return kept

        with mock.patch("core.store._reserve", side_effect=reserve_then_lose_the_file):
            self.assertEqual(store.load_regions(self.target), {})
        self.assertEqual(self.kept_files(), [])

    def test_a_copy_already_kept_is_never_overwritten(self):
        base = self.target / "unreadable" / "intent" / f"regions.json.{STAMP}"
        base.parent.mkdir(parents=True)
        base.write_bytes(b"older copy")
        self.broken("intent/regions.json")
        with mock.patch.object(Path, "exists", return_value=False):  # a check-then-move would pick `base`
            self.assertEqual(store.load_regions(self.target), {})
        self.assertEqual(base.read_bytes(), b"older copy")
        self.assertEqual(base.with_name(base.name + "-2").read_bytes(), BROKEN)

    def test_a_file_that_was_fixed_since_it_was_read_is_returned_and_left_alone(self):
        path = self.broken("intent/regions.json")
        real = store._reserve

        def writer_lands_first(base):
            kept = real(base)
            path.write_text('{"svc": {"region": "eu"}}')
            return kept

        with mock.patch("core.store._reserve", side_effect=writer_lands_first):
            self.assertEqual(store.load_regions(self.target), {"svc": {"region": "eu"}})
        self.assertTrue(path.is_file())
        self.assertEqual(self.kept_files(), [])

    def test_a_folder_where_the_file_should_be_gives_the_default_and_stays(self):
        folder = self.target / "intent" / "regions.json"
        folder.mkdir(parents=True)
        self.assertEqual(store.load_regions(self.target), {})
        self.assertTrue(folder.is_dir())
        self.assertEqual(self.kept_files(), [])

    def test_a_move_that_fails_gives_the_default_logs_one_line_and_leaves_the_file(self):
        path = self.broken("intent/regions.json")
        errors = io.StringIO()
        with mock.patch("core.store.os.replace", side_effect=PermissionError(13, "Permission denied")):
            with mock.patch.object(sys, "stderr", errors):
                self.assertEqual(store.load_regions(self.target), {})
        self.assertEqual(path.read_bytes(), BROKEN)
        self.assertEqual(self.kept_files(), [])
        self.assertEqual(len(errors.getvalue().splitlines()), 1)
        self.assertIn("Permission denied", errors.getvalue())

    def test_a_move_that_cannot_start_gives_the_default_logs_one_line_and_leaves_the_file(self):
        path = self.broken("intent/regions.json")
        errors = io.StringIO()
        with mock.patch("core.store.os.open", side_effect=OSError(28, "No space left on device")):
            with mock.patch.object(sys, "stderr", errors):
                self.assertEqual(store.load_regions(self.target), {})
        self.assertEqual(path.read_bytes(), BROKEN)
        self.assertEqual(len(errors.getvalue().splitlines()), 1)

    def test_a_file_that_is_not_an_object_is_set_aside_like_bad_json(self):
        for relative, read, empty in (
            ("intent/plan_status.json", lambda: store._plan_overrides(self.target), {}),
            ("intent/regions.json", lambda: store.load_regions(self.target), {}),
            ("coverage.json", lambda: store.load_coverage(self.target), None),
        ):
            for data in (b"[]", b"null", b'"text"', b"3"):
                with self.subTest(relative, data=data):
                    shutil.rmtree(self.target / "unreadable", ignore_errors=True)
                    self.broken(relative, data)
                    self.assertEqual(read(), empty)
                    self.assert_kept(relative, data)

    def test_an_item_without_an_id_is_set_aside_and_the_others_still_list(self):
        folder = self.target / "intent" / "proposals"
        self.broken("intent/proposals/x.json", b"{}")
        (folder / "good.json").write_text(json.dumps({"id": "good", "updated_at": 5}))
        self.assertEqual([row["id"] for row in explore.list_items(self.target, "proposals")], ["good"])
        self.assert_kept("intent/proposals/x.json", b"{}")
        self.assertTrue((folder / "good.json").is_file())
        self.broken("intent/use_cases/y.json", b'{"title": "no id"}')
        with self.assertRaises(KeyError):
            explore.get_item(self.target, "use_cases", "y")
        self.assert_kept("intent/use_cases/y.json", b'{"title": "no id"}')

    def test_set_aside_alone_finds_every_broken_saved_file(self):
        paths = (
            "coverage.json",
            "intent/plan_status.json",
            "intent/agents.json",
            "intent/regions.json",
            "intent/agents-draft.json",
            "reads/table_public.orgs/a.json",
            "intent/proposals/p.json",
            "intent/use_cases/u.json",
            "intent/views/v.json",
        )
        for relative in paths:
            self.broken(relative)
        self.broken("intent/proposals/no-id.json", b"{}")
        listed = store.set_aside(self.target)
        self.assertEqual(sorted(row["file"] for row in listed), sorted((*paths, "intent/proposals/no-id.json")))
        for row in listed:
            self.assertTrue((self.target / row["kept_as"]).is_file())
        self.assertEqual(store.set_aside(self.target), listed)  # a second look moves nothing more

    def test_a_file_gone_before_it_is_read_gives_the_default(self):
        self.broken("intent/regions.json")
        with mock.patch.object(Path, "read_bytes", side_effect=FileNotFoundError):
            self.assertEqual(store.load_regions(self.target), {})
            self.assertEqual(store.set_aside(self.target), [])


if __name__ == "__main__":
    unittest.main()
