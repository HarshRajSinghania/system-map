import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import explore, proposals, store, views  # noqa: E402
from core.extractors import typescript  # noqa: E402
from core.sources import TreeSource  # noqa: E402
from helpers import commit_all, git, write_migration  # noqa: E402

BASE = """
create table public.orgs (id uuid primary key, name text);
create table public.clients (
  id uuid primary key,
  org_id uuid not null references public.orgs (id),
  status text not null check (status in ('open', 'closed')),
  nickname text
);
create index clients_org_idx on public.clients (org_id);
alter table public.orgs enable row level security;
alter table public.clients enable row level security;
"""
REMINDERS = {
    "op": "add_table",
    "table": "reminders",
    "columns": [
        {"name": "id", "type": "uuid", "primary": True},
        {"name": "client_id", "type": "uuid", "nullable": False, "references": "clients", "index": True},
    ],
    "rls": True,
}


def write(root: Path, name: str, text: str) -> None:
    path = root / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


class Repo(unittest.TestCase):
    def setUp(self):
        self.folder = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.folder, ignore_errors=True)
        self.repo = self.folder / "repo"
        self.repo.mkdir()
        self.data = self.folder / "data"
        git(self.repo, "init", "-q", "-b", "main")
        write_migration(self.repo, "001_base.sql", BASE)
        write(self.repo, "src/data/clients.ts", 'export const load = (db) => db.from("clients").select("nickname")\n')
        write(self.repo, "src/data/orgs.ts", 'export const save = (db) => db.from("orgs").insert({})\n')
        write(self.repo, "src/data/clients.test.ts", 'import { load } from "./clients"\nload(null)\n')
        write(self.repo, "src/screens/desk/Desk.tsx", 'import { load } from "../../data/clients"\nexport const Desk = load\n')
        write(self.repo, "src/screens/desk/Desk.test.ts", 'import { Desk } from "./Desk"\nDesk(null)\n')
        write(self.repo, "src/screens/quiet/Quiet.tsx", "export const Quiet = 1\n")
        write(self.repo, "src/routes/desk.tsx", 'import { Desk } from "../screens/desk/Desk"\nexport const Route = Desk\n')
        write(self.repo, "src/routes/quiet.tsx", 'import { Quiet } from "../screens/quiet/Quiet"\nexport const Route = Quiet\n')
        write(self.repo, "src/routes/visited.$id.tsx", 'import { Quiet } from "../screens/quiet/Quiet"\nexport const Route = Quiet\n')
        write(self.repo, "e2e/visit.spec.ts", 'test("x", async ({ page }) => {\n  await page.goto("/visited/42");\n  // page.goto("/commented")\n})\n')
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        self.target = store.repo_dir(self.repo, self.data)
        self.head = git(self.repo, "rev-parse", "HEAD")

    def untouched(self):
        self.assertEqual(git(self.repo, "rev-parse", "HEAD"), self.head)
        self.assertEqual(git(self.repo, "status", "--porcelain"), "")


class Proposals(Repo):
    def test_a_draft_saves_in_app_data_and_leaves_the_repo_alone(self):
        result = explore.save_proposal(self.target, "Reminders", "Chase renewals", [REMINDERS])
        self.assertEqual((result["id"], result["status"]), ("reminders", "draft"))
        self.assertTrue((self.target / "intent" / "proposals" / "reminders.json").is_file())
        self.untouched()

    def test_a_dry_run_saves_nothing(self):
        result = explore.save_proposal(self.target, "Reminders", "", [REMINDERS], dry_run=True)
        self.assertEqual(result["diff"]["added"][0]["id"], "table:public.reminders")
        self.assertEqual(explore.list_items(self.target, "proposals"), [])

    def test_the_diff_shows_what_is_added_and_changed(self):
        change = {"op": "add_column", "table": "clients", "column": {"name": "tier", "type": "text"}}
        diff = explore.save_proposal(self.target, "Tier", "", [REMINDERS, change])["diff"]
        self.assertEqual([row["id"] for row in diff["added"]], ["table:public.reminders"])
        self.assertEqual(diff["changed"][0]["what"], ["adds column tier"])
        self.assertEqual(diff["removed"], [])

    def test_the_diff_shows_what_is_touched_today(self):
        change = {"op": "add_column", "table": "clients", "column": {"name": "tier", "type": "text"}}
        diff = explore.save_proposal(self.target, "Tier", "", [change])["diff"]
        self.assertEqual(diff["touched"][0]["id"], "module:src/data")
        self.assertEqual(diff["touched"][0]["because"], ["table:public.clients"])

    def test_a_removed_table_is_a_removal_and_its_children_are_touched(self):
        change = {"op": "drop_table", "table": "orgs"}
        result = explore.save_proposal(self.target, "Remove", "", [change])
        self.assertEqual([row["id"] for row in result["diff"]["removed"]], [])
        self.assertEqual(result["counts"]["refused"], 1)
        self.assertEqual(result["limits"][0]["check"], "table_has_fks")

    def test_removing_a_column_names_the_code_that_uses_it(self):
        change = {"op": "drop_column", "table": "clients", "column": "nickname"}
        limits = explore.save_proposal(self.target, "Remove", "", [change])["limits"]
        hit = next(limit for limit in limits if limit["check"] == "code_uses_column")
        self.assertEqual(hit["evidence"], ["src/data/clients.ts:1"])

    def test_sql_is_written_for_each_change(self):
        sql = explore.save_proposal(self.target, "Reminders", "", [REMINDERS])["sql"][0]["sql"]
        self.assertIn('CREATE TABLE "public"."reminders"', sql[0])
        self.assertIn("ENABLE ROW LEVEL SECURITY", sql[1])
        self.assertIn('CREATE INDEX "reminders_client_id_idx"', sql[2])

    def test_a_bad_change_is_an_error(self):
        with self.assertRaisesRegex(ValueError, "op must be"):
            explore.save_proposal(self.target, "Bad", "", [{"op": "nope"}])
        with self.assertRaisesRegex(ValueError, "list of changes"):
            explore.save_proposal(self.target, "Bad", "", [])
        with self.assertRaisesRegex(ValueError, "title"):
            explore.save_proposal(self.target, " ", "", [REMINDERS])

    def test_the_same_title_gets_its_own_id(self):
        explore.save_proposal(self.target, "Reminders", "", [REMINDERS])
        self.assertEqual(explore.save_proposal(self.target, "Reminders", "", [REMINDERS])["id"], "reminders-2")

    def test_an_id_updates_a_draft(self):
        explore.save_proposal(self.target, "Reminders", "first", [REMINDERS])
        explore.save_proposal(self.target, "Reminders", "second", [REMINDERS], "reminders")
        self.assertEqual(explore.get_item(self.target, "proposals", "reminders")["why"], "second")

    def test_only_a_person_changes_a_settled_proposal(self):
        explore.save_proposal(self.target, "Reminders", "", [REMINDERS])
        explore.set_status(self.target, "reminders", "accepted")
        with self.assertRaisesRegex(ValueError, "only a person"):
            explore.save_proposal(self.target, "Reminders", "again", [REMINDERS], "reminders")

    def test_a_bad_status_is_refused(self):
        explore.save_proposal(self.target, "Reminders", "", [REMINDERS])
        with self.assertRaises(ValueError):
            explore.set_status(self.target, "reminders", "shipped")

    def test_a_bad_id_cannot_leave_the_folder(self):
        with self.assertRaises(KeyError):
            explore.get_item(self.target, "proposals", "../../manifest")

    def test_a_proposal_outlives_a_rebuild(self):
        explore.save_proposal(self.target, "Reminders", "", [REMINDERS])
        write(self.repo, "src/data/orgs.ts", "export const changed = 1\n")
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        self.assertEqual(explore.read_proposal(self.target, "reminders")["title"], "Reminders")

    def test_facts_stay_as_they_were(self):
        explore.save_proposal(self.target, "Reminders", "", [REMINDERS])
        self.assertEqual(store.verify_facts(self.target), [])

    def test_new_modules_routes_jobs_and_services_are_drawn(self):
        changes = [
            {"op": "add_module", "path": "src/agents/chase", "uses_tables": ["clients"], "services": ["Twilio"], "imports": ["module:src/data"]},
            {"op": "add_route", "path": "/chase", "renders": "module:src/agents/chase"},
            {"op": "add_job", "name": "chase-nightly", "schedule": "0 1 * * *", "calls": "/chase"},
            {"op": "add_service", "name": "Twilio"},
        ]
        found = explore.evaluate(self.target, {"changes": [proposals.validate(c) for c in changes]})
        ids = {node["id"]: node for node in found["overlay"]["nodes"]}
        self.assertEqual(ids["module:src/agents/chase"]["area"], "area:src/agents")
        self.assertEqual(ids["area:src/agents"]["status"], "proposed")
        self.assertLessEqual({"route:/chase", "job:chase-nightly", "service:twilio"}, set(ids))
        links = {(edge["source"], edge["target"], edge["kind"]) for edge in found["overlay"]["edges"]}
        self.assertIn(("module:src/agents/chase", "table:public.clients", "uses_table"), links)
        self.assertIn(("route:/chase", "module:src/agents/chase", "renders"), links)
        self.assertIn(("job:chase-nightly", "route:/chase", "calls"), links)
        self.assertEqual(len(found["diff"]["added"]), 5)

    def test_a_module_that_exists_is_not_drawn_twice(self):
        found = explore.evaluate(self.target, {"changes": [{"op": "add_module", "path": "src/data"}]})
        self.assertEqual(found["overlay"]["nodes"], [])

    def test_the_diagram_marks_what_a_proposal_does(self):
        add_column = {"op": "add_column", "table": "clients", "column": {"name": "tier", "type": "text"}}
        graph = explore.evaluate(self.target, {"changes": [REMINDERS, add_column]})["graph"]
        rows = {table["name"]: table for table in graph["tables"]}
        self.assertEqual(rows["reminders"]["status"], "proposed")
        self.assertEqual(rows["clients"]["status"], "changed")
        self.assertEqual(rows["orgs"]["status"], "built")
        self.assertTrue(next(column for column in rows["clients"]["columns"] if column["name"] == "tier")["proposed"])
        self.assertFalse(next(column for column in rows["clients"]["columns"] if column["name"] == "status")["proposed"])
        self.assertIn("table:public.reminders:reminders_client_id_fkey", {edge["id"] for edge in graph["edges"]})

    def test_a_removed_table_stays_in_the_diagram_marked(self):
        change = {"op": "add_table", "table": "spare", "columns": [{"name": "id", "type": "uuid", "primary": True}]}
        explore.save_proposal(self.target, "Spare", "", [change])
        graph = explore.evaluate(self.target, {"changes": [{"op": "drop_column", "table": "clients", "column": "nickname"}]})["graph"]
        self.assertEqual(next(table for table in graph["tables"] if table["name"] == "clients")["status"], "changed")

    def test_a_worktree_on_the_same_table_is_named(self):
        tree = self.folder / "tree"
        git(self.repo, "worktree", "add", "-q", "-b", "feat", str(tree), "main")
        write(tree, "src/data/clients.ts", 'export const load = (db) => db.from("clients").select("id")\n')
        change = {"op": "add_column", "table": "clients", "column": {"name": "tier", "type": "text"}}
        limits = explore.evaluate(self.target, {"changes": [change]})["limits"]
        self.assertIn("worktree_on_it", {limit["check"] for limit in limits})

    def test_rows_stay_short(self):
        explore.save_proposal(self.target, "Reminders", "Why", [REMINDERS])
        row = explore.proposal_rows(self.target)[0]
        self.assertEqual((row["diff"]["added"], row["limits"]["refused"], row["why"]), (1, 0, "Why"))
        self.assertNotIn("graph", row)


class BrowserTests(Repo):
    def test_a_browser_test_counts_for_the_route_it_opens(self):
        routes = {node["path"]: node for node in store.load_system(self.target)["nodes"] if node["kind"] == "route"}
        self.assertEqual(routes["/visited/$id"]["browser_tests"], ["e2e/visit.spec.ts"])
        self.assertEqual(routes["/desk"]["browser_tests"], [])

    def test_a_commented_visit_does_not_count(self):
        self.assertEqual(typescript.browser_visits(TreeSource(self.repo))["e2e/visit.spec.ts"], ["/visited/42"])

    def test_route_parts_match_one_for_one(self):
        self.assertTrue(typescript.route_matches("/a/$id/b", "/a/1/b"))
        self.assertTrue(typescript.route_matches("/a", "/a?x=1#y"))
        self.assertTrue(typescript.route_matches("/", "/"))
        self.assertFalse(typescript.route_matches("/a/$id", "/a"))
        self.assertFalse(typescript.route_matches("/a", "/b"))


class UseCases(Repo):
    def save(self, **body) -> dict:
        return explore.save_use_case(self.target, {"title": "Case", **body})

    def checks(self, **body) -> list[str]:
        return [gap["check"] for gap in self.save(**body)["gaps"]]

    def test_a_mapped_path_with_tests_has_no_gaps(self):
        found = self.save(routes=["/desk"], tables=["clients"])
        self.assertEqual((found["state"], found["gaps"]), ("ready", []))
        route = found["parts"][0]
        self.assertEqual((route["tests"], route["test_files"]), (1, ["src/screens/desk/Desk.test.ts"]))

    def test_a_missing_route_or_table_is_a_gap(self):
        found = self.save(routes=["/nowhere"], tables=["ghosts"])
        self.assertEqual([gap["check"] for gap in found["gaps"]], ["no_route", "no_table"])
        self.assertEqual(found["state"], "missing")

    def test_a_route_no_test_reaches_is_a_gap(self):
        self.assertEqual(self.checks(routes=["/quiet"]), ["no_tests"])

    def test_a_browser_test_closes_that_gap(self):
        found = self.save(routes=["/visited/$id"])
        self.assertEqual(found["gaps"], [])
        self.assertEqual(found["parts"][0]["browser_tests"], ["e2e/visit.spec.ts"])

    def test_a_table_no_code_writes_is_a_gap_when_it_needs_writing(self):
        self.assertEqual(self.checks(tables=[{"table": "clients", "access": "write"}]), ["no_writer"])
        self.assertEqual(self.checks(tables=[{"table": "orgs", "access": "write"}]), [])

    def test_needs_are_tested_against_the_schema(self):
        found = self.save(needs=[{"need": "value", "table": "clients", "column": "status", "value": "paused"}, {"need": "optional", "table": "clients", "column": "status"}])
        self.assertEqual([gap["check"] for gap in found["gaps"]], ["value_not_allowed", "must_have_value"])
        self.assertIn("001_base.sql", found["gaps"][0]["evidence"][0])

    def test_a_module_with_no_tests_is_a_gap(self):
        self.assertEqual(self.checks(modules=["module:src/screens/quiet"]), ["no_tests"])
        self.assertEqual(self.checks(modules=["module:src/ghost"]), ["no_module"])

    def test_bad_input_is_refused(self):
        with self.assertRaisesRegex(ValueError, "title"):
            explore.save_use_case(self.target, {"title": ""})
        with self.assertRaisesRegex(ValueError, "starts with /"):
            self.save(routes=["desk"])
        with self.assertRaisesRegex(ValueError, "need must be"):
            self.save(needs=[{"need": "magic"}])
        with self.assertRaisesRegex(ValueError, "needs column"):
            self.save(needs=[{"need": "optional", "table": "clients"}])

    def test_use_cases_read_back_with_their_gaps(self):
        self.save(routes=["/nowhere"])
        self.assertEqual(explore.use_case_rows(self.target)[0]["gaps"][0]["check"], "no_route")

    def test_a_use_case_leaves_the_repo_alone(self):
        self.save(routes=["/desk"])
        self.untouched()


class Views(Repo):
    def save(self, **body) -> dict:
        return explore.save_view(self.target, {"title": "View", **body})

    def test_a_view_lists_the_nodes_it_names(self):
        found = self.save(nodes=["module:src/data", "table:public.clients"])
        self.assertEqual(found["resolved"], ["module:src/data", "table:public.clients"])

    def test_a_view_cannot_show_what_the_model_does_not_hold(self):
        with self.assertRaisesRegex(ValueError, "only show what the model holds"):
            self.save(nodes=["module:src/ghost"])

    def test_around_takes_a_node_and_its_neighbours(self):
        found = self.save(around="module:src/data")
        self.assertIn("table:public.clients", found["resolved"])
        self.assertIn("module:src/screens/desk", found["resolved"])
        self.assertNotIn("module:src/screens/quiet", found["resolved"])

    def test_an_area_takes_its_modules(self):
        found = self.save(area="area:src/screens")
        self.assertEqual(found["resolved"], ["module:src/screens/desk", "module:src/screens/quiet"])

    def test_kinds_pick_a_whole_kind(self):
        found = self.save(kinds=["table"])
        self.assertEqual(found["resolved"], ["table:public.clients", "table:public.orgs"])

    def test_a_view_needs_a_filter(self):
        with self.assertRaisesRegex(ValueError, "needs nodes"):
            self.save()

    def test_bad_settings_are_refused(self):
        for body in ({"level": "moon"}, {"layout": "spiral"}, {"risk": "maybe"}, {"overlays": {"sparkle": True}}):
            with self.subTest(body), self.assertRaises(ValueError):
                self.save(kinds=["table"], **body)

    def test_a_view_can_show_a_proposal(self):
        explore.save_proposal(self.target, "Reminders", "", [REMINDERS])
        found = self.save(nodes=["table:public.reminders"], proposal="reminders")
        self.assertEqual(found["proposal"], "reminders")
        self.assertEqual(found["resolved"], ["table:public.reminders"])

    def test_a_part_that_has_gone_is_reported(self):
        record = views.validate({"title": "V", "nodes": ["module:src/data"]}, {"module:src/data"})
        found = views.resolve(record, {"nodes": [], "edges": []}, [], {"modules": []})
        self.assertEqual((found["resolved"], found["missing"]), ([], ["module:src/data"]))

    def test_a_view_outlives_a_rebuild(self):
        self.save(nodes=["module:src/data"])
        write(self.repo, "src/data/orgs.ts", "export const changed = 1\n")
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        self.assertEqual(explore.view_rows(self.target)[0]["resolved"], ["module:src/data"])


class Summary(Repo):
    def test_it_holds_all_three_and_survives_being_empty(self):
        self.assertEqual(explore.summary(self.target), {"proposals": [], "use_cases": [], "views": []})
        explore.save_proposal(self.target, "P", "", [REMINDERS])
        explore.save_use_case(self.target, {"title": "U"})
        explore.save_view(self.target, {"title": "V", "kinds": ["table"]})
        found = explore.summary(self.target)
        self.assertEqual((len(found["proposals"]), len(found["use_cases"]), len(found["views"])), (1, 1, 1))
        json.dumps(found)

    def test_an_item_can_be_deleted(self):
        explore.save_view(self.target, {"title": "V", "kinds": ["table"]})
        explore.delete_item(self.target, "views", "v")
        self.assertEqual(explore.view_rows(self.target), [])
        with self.assertRaises(KeyError):
            explore.delete_item(self.target, "views", "v")


if __name__ == "__main__":
    unittest.main()
