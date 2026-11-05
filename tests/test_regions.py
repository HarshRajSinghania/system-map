import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import store  # noqa: E402
from helpers import commit_all, git  # noqa: E402
from test_agents import FILES, SETTINGS, line_of  # noqa: E402

ANTHROPIC = "service:anthropic"
GEMINI = "service:us-central1-aiplatform.googleapis.com"


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

    def nodes(self):
        return {node["id"]: node for node in store.load_system(self.target)["nodes"]}

    def agent_findings(self):
        return {f["node"]: f for f in store.load_findings(self.target) if f["check"] == "agent-leaves-region"}


class Settings(Fixture):
    def test_saving_settings_rebuilds_with_agents(self):
        self.assertNotIn("agent:sorter", self.nodes())
        store.set_agent_settings(self.target, SETTINGS)
        self.assertEqual(self.nodes()["agent:sorter"]["kind"], "agent")
        self.assertEqual(store.load_agent_settings(self.target)["list"], "src/agents/registry.ts")

    def test_new_settings_make_a_new_version_and_the_same_ones_do_not(self):
        before = store.read_manifest(self.target)["version"]
        first = store.set_agent_settings(self.target, SETTINGS)["version"]
        again = store.set_agent_settings(self.target, SETTINGS)["version"]
        self.assertNotEqual(before, first)
        self.assertEqual(first, again)

    def test_the_home_region_alone_does_not_rebuild(self):
        first = store.set_agent_settings(self.target, SETTINGS)["version"]
        second = store.set_agent_settings(self.target, {**SETTINGS, "home_region": "Canada"})["version"]
        self.assertEqual(first, second)

    def test_clearing_settings_removes_the_agents(self):
        store.set_agent_settings(self.target, SETTINGS)
        store.set_agent_settings(self.target, {})
        self.assertFalse([n for n in self.nodes().values() if n["kind"] == "agent"])
        self.assertEqual(store.load_agent_settings(self.target), {})

    def test_settings_survive_a_rebuild(self):
        store.set_agent_settings(self.target, SETTINGS)
        store.build(self.repo, self.data)
        self.assertIn("agent:sorter", self.nodes())

    def test_two_marked_modules_with_one_name_are_refused(self):
        for name in ("src/a/mail/x.ts", "src/b/mail/y.ts"):
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("export const x = 1\n")
        commit_all(self.repo)
        store.build(self.repo, self.data)
        with self.assertRaisesRegex(ValueError, "both named mail"):
            store.set_agent_settings(self.target, {"modules": ["module:src/a/mail", "module:src/b/mail"]})
        self.assertEqual(store.load_agent_settings(self.target), {})

    def test_bad_settings_are_refused_and_nothing_is_saved(self):
        cases = [
            {"colour": "red"},
            {"list": "src/nope.ts"},
            {"list": "../outside.ts"},
            {"model_calls": ["a b"]},
            {"model_calls": "model"},
            {"modules": ["module:src/nope"]},
            {"home_region": "x" * 41},
        ]
        for settings in cases:
            with self.assertRaises(ValueError, msg=settings):
                store.set_agent_settings(self.target, settings)
        self.assertEqual(store.load_agent_settings(self.target), {})


class Regions(Fixture):
    def setUp(self):
        super().setUp()
        store.set_agent_settings(self.target, {**SETTINGS, "home_region": "Canada"})

    def test_a_tag_lands_on_its_service(self):
        store.set_region(self.target, ANTHROPIC, " US ")
        service = self.nodes()[ANTHROPIC]
        self.assertEqual((service["region"], service["region_source"]), ("US", "you"))

    def test_every_agent_using_a_service_elsewhere_leaves_the_region(self):
        store.set_region(self.target, ANTHROPIC, "US")
        nodes = self.nodes()
        leaving = {name: nodes[f"agent:{name}"]["leaves_region"] for name in ("sorter", "reader", "mail", "digest")}
        self.assertEqual(leaving, {"sorter": [ANTHROPIC], "reader": [ANTHROPIC], "mail": [], "digest": []})

    def test_a_service_in_the_home_region_does_not_leave_it(self):
        store.set_region(self.target, ANTHROPIC, "canada")
        store.set_region(self.target, GEMINI, "Canada")
        self.assertEqual(self.nodes()["agent:sorter"]["leaves_region"], [])
        self.assertEqual(self.agent_findings(), {})

    def test_one_finding_per_agent_cites_the_call(self):
        store.set_region(self.target, ANTHROPIC, "US")
        found = self.agent_findings()
        self.assertEqual(set(found), {"agent:sorter", "agent:reader"})
        call = line_of("src/agents/handlers/sorter.ts", "ctx.model(")
        self.assertEqual(found["agent:sorter"]["evidence"], [f"src/agents/handlers/sorter.ts:{call}"])
        self.assertEqual(found["agent:reader"]["evidence"], ["src/agents/ai.ts:1"])
        self.assertEqual((found["agent:sorter"]["title"], found["agent:sorter"]["severity"]), ("Sorter can send data to US", "medium"))

    def test_two_services_elsewhere_make_one_finding(self):
        store.set_region(self.target, ANTHROPIC, "US")
        store.set_region(self.target, GEMINI, "EU")
        found = self.agent_findings()
        self.assertEqual(found["agent:sorter"]["title"], "Sorter can send data to EU, US")
        self.assertEqual(sorted(self.nodes()["agent:sorter"]["leaves_region"]), [ANTHROPIC, GEMINI])

    def test_clearing_the_tag_removes_both_without_a_rebuild(self):
        version = store.read_manifest(self.target)["version"]
        store.set_region(self.target, ANTHROPIC, "US")
        store.set_region(self.target, ANTHROPIC, None)
        self.assertEqual(self.nodes()["agent:sorter"]["leaves_region"], [])
        self.assertEqual(self.agent_findings(), {})
        self.assertEqual(store.read_manifest(self.target)["version"], version)

    def test_no_home_region_means_nothing_leaves(self):
        store.set_region(self.target, ANTHROPIC, "US")
        store.set_agent_settings(self.target, SETTINGS)
        self.assertEqual(self.nodes()["agent:sorter"]["leaves_region"], [])
        self.assertEqual(self.agent_findings(), {})

    def test_a_tag_survives_a_rebuild(self):
        store.set_region(self.target, ANTHROPIC, "US")
        (self.repo / "src" / "agents" / "more.ts").write_text("export const more = 1\n")
        commit_all(self.repo)
        store.build(self.repo, self.data)
        self.assertEqual(self.nodes()[ANTHROPIC]["region"], "US")

    def test_only_services_and_short_names_can_be_tagged(self):
        with self.assertRaises(KeyError):
            store.set_region(self.target, "module:src/desk", "US")
        for bad in ("", "   ", "x" * 41, "US; drop"):
            with self.assertRaises(ValueError, msg=bad):
                store.set_region(self.target, ANTHROPIC, bad)

    def test_tags_are_kept_in_the_app_data(self):
        store.set_region(self.target, ANTHROPIC, "US")
        saved = json.loads((self.target / "intent" / "regions.json").read_text())
        self.assertEqual(saved[ANTHROPIC]["region"], "US")


class Repo(Fixture):
    def test_settings_and_tags_never_touch_the_repo(self):
        store.set_agent_settings(self.target, {**SETTINGS, "home_region": "Canada"})
        store.set_region(self.target, ANTHROPIC, "US")
        store.set_region(self.target, ANTHROPIC, None)
        store.set_agent_settings(self.target, {})
        self.assertEqual(git(self.repo, "status", "--porcelain"), "")


if __name__ == "__main__":
    unittest.main()
