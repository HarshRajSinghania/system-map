import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import agent_drafts, store  # noqa: E402
from helpers import commit_all, git  # noqa: E402
from test_agents import CALL_FILES, FILES, SETTINGS, line_of  # noqa: E402

ANTHROPIC = "service:anthropic"
SORTER = "src/agents/handlers/sorter.ts"
HAND_OFF = 'agent: "reader"'
EVIDENCE = {
    "list": [f"src/agents/registry.ts:{line_of('src/agents/registry.ts', 'export const AGENTS')}"],
    "hand_off_keys": [f"{SORTER}:{line_of(SORTER, HAND_OFF)}", "src/desk/start.ts:2"],
    "model_calls": [f"{SORTER}:{line_of(SORTER, 'ctx.model(')}"],
    "asks_you_calls": [f"{SORTER}:{line_of(SORTER, 'ctx.ask(')}"],
}
CANADA = {"home_region": "Canada"}
CANADA_EVIDENCE = {"home_region": ["docs/specs/mail.md"]}


class Fixture(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        base = Path(tmp.name)
        self.repo = base / "repo"
        for name, text in FILES.items():
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        git(self.repo, "init", "-q", "-b", "main")
        commit_all(self.repo)
        self.data = base / "data"
        store.build(self.repo, self.data)
        self.target = store.repo_dir(self.repo, self.data)
        self.draft_file = self.target / "intent" / "agents-draft.json"

    def save(self, settings=SETTINGS, evidence=EVIDENCE, **options):
        return agent_drafts.save(self.target, settings, evidence, **options)

    def shown(self):
        """The id of the draft on screen now."""
        return agent_drafts.load(self.target)["draft"]["id"]

    def use(self):
        return agent_drafts.use(self.target, self.shown())

    def drop(self):
        return agent_drafts.drop(self.target, self.shown())

    def model_agents(self):
        return [node["id"] for node in store.load_system(self.target)["nodes"] if node["kind"] == "agent"]


class Trying(Fixture):
    def test_a_dry_run_returns_the_agents_it_would_find(self):
        found = {row["id"]: row for row in self.save(dry_run=True)["agents"]}
        self.assertEqual(list(found), ["agent:sorter", "agent:reader", "agent:mail", "agent:digest"])
        sorter = found["agent:sorter"]
        self.assertEqual(sorted(sorter["hands_off_to"]), ["agent:mail", "agent:reader"])
        self.assertEqual((sorter["status"], sorter["asks_you"]), ("built", True))
        self.assertEqual({row: found[row]["status"] for row in ("agent:mail", "agent:digest")}, {"agent:mail": "planned", "agent:digest": "empty"})
        self.assertIn("job:nightly", found["agent:reader"]["starts"])

    def test_a_dry_run_writes_nothing(self):
        version = store.read_manifest(self.target)["version"]
        result = self.save(dry_run=True)
        self.assertFalse(result["saved"])
        self.assertFalse(self.draft_file.exists())
        self.assertEqual(store.load_agent_settings(self.target), {})
        self.assertEqual(store.read_manifest(self.target)["version"], version)
        self.assertEqual(self.model_agents(), [])

    def test_a_try_uses_the_drafts_home_region_then_the_saved_one(self):
        store.set_region(self.target, ANTHROPIC, "US")
        drafted = self.save({**SETTINGS, **CANADA}, {**EVIDENCE, **CANADA_EVIDENCE}, dry_run=True)
        self.assertEqual(drafted["agents"][0]["leaves_region"], [ANTHROPIC])
        store.set_agent_settings(self.target, CANADA)
        self.assertEqual(self.save(dry_run=True)["agents"][0]["leaves_region"], [ANTHROPIC])


class Saving(Fixture):
    def test_a_draft_keeps_settings_evidence_note_commit_and_what_it_found(self):
        self.save(note=" Read the registry. ")
        draft = json.loads(self.draft_file.read_text())
        self.assertEqual(draft["settings"], SETTINGS)
        self.assertEqual(draft["evidence"], EVIDENCE)
        self.assertEqual(draft["note"], "Read the registry.")
        self.assertEqual(draft["commit"], store.read_manifest(self.target)["commit"])
        self.assertEqual(draft["count"], 4)

    def test_a_draft_changes_neither_the_settings_nor_the_map(self):
        version = store.read_manifest(self.target)["version"]
        self.save()
        self.assertFalse((self.target / "intent" / "agents.json").exists())
        self.assertEqual(store.read_manifest(self.target)["version"], version)
        self.assertEqual(self.model_agents(), [])

    def test_a_new_draft_replaces_the_old_one(self):
        self.save(note="first")
        self.save({**SETTINGS, "asks_you_calls": ["addTask"]}, note="second")
        draft = agent_drafts.load(self.target)["draft"]
        self.assertEqual((draft["note"], draft["settings"]["asks_you_calls"]), ("second", ["addTask"]))

    def test_bad_drafts_are_refused_and_say_what_to_fix(self):
        no_model_evidence = {key: value for key, value in EVIDENCE.items() if key != "model_calls"}
        cases = [
            ({**SETTINGS, "colour": "red"}, EVIDENCE, "unknown agent setting 'colour'"),
            ({**SETTINGS, "list": "src/nope.ts"}, {**EVIDENCE, "list": ["src/agents/registry.ts:6"]}, "no file 'src/nope.ts'"),
            ({**SETTINGS, "home_region": "x" * 41}, {**EVIDENCE, "home_region": ["docs/specs/mail.md"]}, "home_region must be"),
            (SETTINGS, no_model_evidence, "None for model_calls"),
            (SETTINGS, {**EVIDENCE, "list": ["src/nope.ts:3"]}, "'src/nope.ts:3' is not a file"),
            (SETTINGS, {**EVIDENCE, "list": "src/agents/registry.ts:6"}, "evidence for list must be a list"),
            (SETTINGS, {**EVIDENCE, "list": [6]}, "a list of path or path:line"),
            (SETTINGS, {**EVIDENCE, "colour": ["src/agents/registry.ts"]}, "names no setting: colour"),
            ({"model_calls": ["model"]}, EVIDENCE, "needs a list or modules"),
            ("src/agents/registry.ts", EVIDENCE, "settings must be an object"),
            (SETTINGS, ["src/agents/registry.ts"], "evidence must be an object"),
        ]
        for settings, evidence, message in cases:
            with self.assertRaisesRegex(ValueError, message, msg=message):
                agent_drafts.save(self.target, settings, evidence)
        with self.assertRaisesRegex(ValueError, "note must be text"):
            self.save(note=3)
        self.assertFalse(self.draft_file.exists())

    def test_evidence_for_a_setting_left_empty_is_not_kept(self):
        self.save({**SETTINGS, "modules": []}, {**EVIDENCE, "modules": ["src/desk/start.ts"]})
        self.assertNotIn("modules", agent_drafts.load(self.target)["draft"]["evidence"])


class Loading(Fixture):
    def test_no_draft(self):
        self.assertEqual(agent_drafts.load(self.target), {"draft": None, "changed": [], "stale": False})

    def test_changed_lists_what_using_it_would_change(self):
        self.save()
        self.assertEqual(agent_drafts.load(self.target)["changed"], ["list", "hand_off_keys", "model_calls", "asks_you_calls"])
        store.set_agent_settings(self.target, {**SETTINGS, **CANADA})
        self.save({**SETTINGS, "asks_you_calls": ["addTask"]})
        # The draft has no home region, so using it keeps Canada: that is no change.
        self.assertEqual(agent_drafts.load(self.target)["changed"], ["asks_you_calls"])
        self.save({key: value for key, value in SETTINGS.items() if key != "hand_off_keys"})
        self.assertEqual(agent_drafts.load(self.target)["changed"], ["hand_off_keys"])

    def test_a_draft_from_an_older_model_is_stale(self):
        self.save()
        self.assertFalse(agent_drafts.load(self.target)["stale"])
        (self.repo / "src" / "agents" / "more.ts").write_text("export const more = 1\n")
        commit_all(self.repo)
        store.build(self.repo, self.data)
        self.assertTrue(agent_drafts.load(self.target)["stale"])


class NoGit(unittest.TestCase):
    """With no git there is no commit, so a draft goes stale when the code it was tried on changes."""

    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.repo, self.data = Path(tmp.name) / "repo", Path(tmp.name) / "data"
        for name, text in FILES.items():
            (self.repo / name).parent.mkdir(parents=True, exist_ok=True)
            (self.repo / name).write_text(text)
        store.build(self.repo, self.data)
        self.target = store.repo_dir(self.repo, self.data)
        agent_drafts.save(self.target, SETTINGS, EVIDENCE)

    def test_a_draft_goes_stale_when_the_code_changes(self):
        self.assertIsNone(store.read_manifest(self.target)["commit"])
        store.build(self.repo, self.data)
        self.assertFalse(agent_drafts.load(self.target)["stale"])
        (self.repo / "src" / "agents" / "more.ts").write_text("export const more = 1\n")
        store.build(self.repo, self.data)
        self.assertTrue(agent_drafts.load(self.target)["stale"])

    def test_a_draft_from_before_the_code_stamp_still_reads(self):
        path = self.target / "intent" / "agents-draft.json"
        older = json.loads(path.read_text())
        del older["code"]
        path.write_text(json.dumps(older))
        self.assertFalse(agent_drafts.load(self.target)["stale"])


class Using(Fixture):
    def test_using_saves_its_settings_rebuilds_and_deletes_it(self):
        self.save()
        self.use()
        self.assertEqual(store.load_agent_settings(self.target), SETTINGS)
        self.assertEqual(sorted(self.model_agents()), ["agent:digest", "agent:mail", "agent:reader", "agent:sorter"])
        self.assertFalse(self.draft_file.exists())

    def test_a_draft_with_no_home_region_keeps_the_saved_one(self):
        store.set_agent_settings(self.target, CANADA)
        self.save()
        self.use()
        self.assertEqual(store.load_agent_settings(self.target)["home_region"], "Canada")

    def test_a_drafts_home_region_wins(self):
        store.set_agent_settings(self.target, {"home_region": "EU"})
        self.save({**SETTINGS, **CANADA}, {**EVIDENCE, **CANADA_EVIDENCE})
        self.use()
        self.assertEqual(store.load_agent_settings(self.target)["home_region"], "Canada")

    def test_an_old_draft_is_checked_against_todays_model(self):
        self.save()
        (self.repo / "src" / "agents" / "registry.ts").unlink()
        commit_all(self.repo)
        store.build(self.repo, self.data)
        with self.assertRaisesRegex(ValueError, "no file 'src/agents/registry.ts'"):
            self.use()
        self.assertTrue(self.draft_file.exists())
        self.assertEqual(store.load_agent_settings(self.target), {})

    def test_dropping_deletes_only_the_draft(self):
        store.set_agent_settings(self.target, CANADA)
        self.save()
        self.assertEqual(self.drop(), {"dropped": True})
        self.assertFalse(self.draft_file.exists())
        self.assertEqual(store.load_agent_settings(self.target), CANADA)

    def test_using_or_dropping_needs_the_draft_the_person_saw(self):
        self.save(note="first")
        seen = agent_drafts.load(self.target)["draft"]["id"]
        self.save(note="second")
        for action in (agent_drafts.use, agent_drafts.drop):
            with self.assertRaisesRegex(ValueError, "saved a new draft since"):
                action(self.target, seen)
        self.assertEqual(store.load_agent_settings(self.target), {})
        newest = agent_drafts.load(self.target)["draft"]
        self.assertEqual(newest["note"], "second")
        agent_drafts.use(self.target, newest["id"])
        self.assertEqual(store.load_agent_settings(self.target), SETTINGS)

    def test_a_draft_saved_while_one_is_used_is_kept(self):
        self.save(note="first")
        seen = self.shown()
        rebuild = store.set_agent_settings

        def meanwhile(target, settings):
            result = rebuild(target, settings)
            self.save(note="second")
            return result

        with mock.patch.object(store, "set_agent_settings", side_effect=meanwhile):
            agent_drafts.use(self.target, seen)
        self.assertEqual(store.load_agent_settings(self.target), SETTINGS)
        self.assertEqual(agent_drafts.load(self.target)["draft"]["note"], "second")

    def test_no_draft_to_use_or_drop(self):
        for action in (agent_drafts.use, agent_drafts.drop):
            with self.assertRaises(KeyError):
                action(self.target, "1")


class HandOffCalls(Fixture):
    def test_a_draft_with_hand_off_calls_finds_what_they_start(self):
        for name, text in CALL_FILES.items():
            (self.repo / name).parent.mkdir(parents=True, exist_ok=True)
            (self.repo / name).write_text(text)
        commit_all(self.repo)
        store.build(self.repo, self.data)
        route = CALL_FILES["src/web/route.ts"]
        line = route[: route.index('queueAgent("sorter"')].count("\n") + 1
        call = f"src/web/route.ts:{line}"
        settings, evidence = {**SETTINGS, "hand_off_calls": ["queueAgent"]}, {**EVIDENCE, "hand_off_calls": [call]}
        found = {row["id"]: row for row in self.save(settings, evidence, dry_run=True)["agents"]}
        self.assertIn("module:src/web", found["agent:sorter"]["starts"])
        self.save(settings, evidence)
        self.assertIn("hand_off_calls", agent_drafts.load(self.target)["changed"])


class Repo(Fixture):
    def test_drafts_never_touch_the_repo(self):
        self.save(dry_run=True)
        self.save()
        self.use()
        self.save()
        self.drop()
        self.assertEqual(git(self.repo, "status", "--porcelain"), "")


if __name__ == "__main__":
    unittest.main()
