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

from core import store  # noqa: E402


class BackendTests(unittest.TestCase):
    """Run the real backend process and call it over HTTP."""

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
        return urllib.request.urlopen(request, timeout=5)

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

    def test_build_refuses_a_folder_without_migrations(self):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post("/build", {"repo_path": str(self.data)})
        self.assertEqual(caught.exception.code, 400)


if __name__ == "__main__":
    unittest.main()
