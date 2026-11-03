import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import store  # noqa: E402
from helpers import commit_all, git  # noqa: E402
from test_agents import FILES, SETTINGS  # noqa: E402


class Served(unittest.TestCase):
    """Run the real backend process on `cls.data` and call it over HTTP."""

    @classmethod
    def serve(cls):
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            cls.port = probe.getsockname()[1]
        cls.server = subprocess.Popen(
            [sys.executable, str(ROOT / "backend" / "server.py")],
            env={**os.environ, "PORT": str(cls.port), "SYSTEM_MAP_DATA": str(cls.data), "PYTHONDONTWRITEBYTECODE": "1"},
        )
        deadline = time.time() + 10
        while time.time() < deadline:
            try:
                cls.get("/health")
                return
            except OSError:
                time.sleep(0.05)
        raise RuntimeError("backend did not start")

    @classmethod
    def tearDownClass(cls):
        cls.server.terminate()
        cls.server.wait(timeout=5)
        cls._tmp.cleanup()

    @classmethod
    def get(cls, path):
        with urllib.request.urlopen(f"http://127.0.0.1:{cls.port}{path}", timeout=5) as reply:
            return json.load(reply)

    def post(self, path, body):
        request = urllib.request.Request(
            f"http://127.0.0.1:{self.port}{path}", data=json.dumps(body).encode(), method="POST"
        )
        return urllib.request.urlopen(request, timeout=30)


class BackendTests(Served):
    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        base = Path(cls._tmp.name)
        cls.repo = base / "repo"
        (cls.repo / "supabase" / "migrations").mkdir(parents=True)
        (cls.repo / "supabase" / "migrations" / "001.sql").write_text(
            "CREATE TABLE public.orgs (id uuid PRIMARY KEY);\n"
            "CREATE TABLE public.users (id uuid PRIMARY KEY, org_id uuid REFERENCES public.orgs(id));\n"
        )
        subprocess.run(["git", "-C", str(cls.repo), "init", "-q"], check=True)
        cls.data = base / "data"
        store.build(cls.repo, cls.data)
        cls.serve()

    def test_overview_lists_tables(self):
        value = self.get("/overview")
        self.assertEqual([t["name"] for t in value["tables"]], ["orgs", "users"])
        self.assertNotIn("facts", value["manifest"])
        self.assertNotIn("inputs", value["manifest"])

    def test_graph_and_findings(self):
        self.assertEqual(len(self.get("/graph")["edges"]), 1)
        self.assertTrue(self.get("/findings")["findings"])

    def test_rebuild_with_no_path_uses_the_known_repo(self):
        reply = json.load(self.post("/build", {}))
        self.assertTrue(reply["unchanged"])

    def test_proxied_prefix_works_too(self):
        self.assertEqual(self.get("/apps/system-map/api/overview")["tables"][0]["name"], "orgs")

    def test_node_and_neighbors(self):
        self.assertEqual(self.get("/node?id=table:public.users")["name"], "users")
        self.assertEqual(len(self.get("/neighbors?id=table:public.orgs")["incoming"]), 1)

    def test_missing_node_is_a_404(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.get("/node?id=table:public.nope")
        self.assertEqual(caught.exception.code, 404)

    def test_worktrees_lists_the_repo(self):
        found = self.get("/worktrees")
        self.assertEqual(len(found["worktrees"]), 1)
        self.assertEqual(found["overlaps"], [])
        self.assertEqual(found["counts"]["high"], 0)

    def test_coverage_with_no_report_is_a_400_saying_why(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/coverage", {})
        self.assertEqual(caught.exception.code, 400)
        self.assertIn("no coverage report", json.load(caught.exception)["error"])

    def test_risk_reads_with_or_without_a_report(self):
        value = self.get("/risk")
        self.assertIsNone(value["coverage"])
        self.assertEqual(value["window_days"], 90)
        report = Path(self._tmp.name) / "lcov.info"
        report.write_text("SF:supabase/migrations/001.sql\nDA:1,1\nDA:2,0\nend_of_record\n")
        reply = json.load(self.post("/coverage", {"report": str(report), "commit": "abc"}))
        self.assertEqual((reply["lines_hit"], reply["lines_total"]), (1, 2))
        self.assertEqual(self.get("/risk")["coverage"]["commit"], "abc")

    def test_explore_starts_empty_and_a_status_needs_a_real_proposal(self):
        self.assertEqual(sorted(self.get("/explore")), ["proposals", "use_cases", "views"])
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/proposal-status", {"id": "ghost", "status": "accepted"})
        self.assertEqual(caught.exception.code, 404)

    def test_a_missing_proposal_is_a_404(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.get("/proposal?id=ghost")
        self.assertEqual(caught.exception.code, 404)

    def test_a_delete_needs_a_real_kind(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/intent-delete", {"kind": "tables", "id": "x"})
        self.assertEqual(caught.exception.code, 400)

    def test_build_refuses_a_folder_without_migrations(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/build", {"repo_path": str(self.data)})
        self.assertEqual(caught.exception.code, 400)


class AgentRoutes(Served):
    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        base = Path(cls._tmp.name)
        cls.repo = base / "repo"
        for name, text in FILES.items():
            path = cls.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        git(cls.repo, "init", "-q", "-b", "main")
        commit_all(cls.repo)
        cls.data = base / "data"
        store.build(cls.repo, cls.data)
        cls.serve()

    def setUp(self):
        self.post("/agents/settings", {"settings": {}})
        self.post("/regions", {"id": "service:anthropic", "region": None})

    def refused(self, path, body):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post(path, body)
        return caught.exception.code, json.load(caught.exception)["error"]

    def test_with_no_settings_there_are_suggestions(self):
        value = self.get("/agents")
        self.assertEqual((value["agents"], value["settings"], value["suggestions"]), ([], {}, ["module:src/agents"]))
        self.assertEqual(value["defaults"]["jobs_key"], "handlers")

    def test_saving_settings_shows_the_agents(self):
        reply = json.load(self.post("/agents/settings", {"settings": SETTINGS}))
        self.assertEqual(reply["settings"]["list"], "src/agents/registry.ts")
        rows = {row["name"]: row for row in self.get("/agents")["agents"]}
        self.assertEqual(list(rows), ["sorter", "reader", "mail", "digest"])
        self.assertEqual({link["node"] for link in rows["sorter"]["hands_off_to"]}, {"agent:reader", "agent:mail"})
        self.assertEqual(self.get("/node?id=agent:sorter")["label"], "Sorter")

    def test_bad_settings_are_a_400_saying_why(self):
        code, error = self.refused("/agents/settings", {"settings": {"list": "src/nope.ts"}})
        self.assertEqual(code, 400)
        self.assertIn("no file", error)
        self.assertEqual(self.refused("/agents/settings", {"settings": "x"})[0], 400)

    def test_a_region_marks_agents_and_adds_findings(self):
        self.post("/agents/settings", {"settings": {**SETTINGS, "home_region": "Canada"}})
        reply = json.load(self.post("/regions", {"id": "service:anthropic", "region": "US"}))
        self.assertEqual(reply, {"id": "service:anthropic", "region": "US"})
        state = self.get("/agents")
        self.assertEqual(state["home_region"], "Canada")
        sorter = next(row for row in state["agents"] if row["name"] == "sorter")
        self.assertEqual(sorter["leaves_region"], ["service:anthropic"])
        checks = {(f["check"], f["node"]) for f in self.get("/findings")["findings"]}
        self.assertIn(("agent-leaves-region", "agent:sorter"), checks)

    def test_only_a_service_takes_a_region(self):
        self.assertEqual(self.refused("/regions", {"id": "module:src/desk", "region": "US"})[0], 404)
        self.assertEqual(self.refused("/regions", {"id": "service:anthropic", "region": ""})[0], 400)

    def test_no_route_touches_the_repo(self):
        self.post("/agents/settings", {"settings": {**SETTINGS, "home_region": "Canada"}})
        self.post("/regions", {"id": "service:anthropic", "region": "US"})
        self.assertEqual(git(self.repo, "status", "--porcelain"), "")


if __name__ == "__main__":
    unittest.main()
