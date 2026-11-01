import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import store  # noqa: E402


class McpServerTests(unittest.TestCase):
    """Drive the real server over stdio, the way an agent's MCP client does."""

    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        base = Path(tmp.name)
        self.repo = base / "repo"
        (self.repo / "supabase" / "migrations").mkdir(parents=True)
        (self.repo / "supabase" / "migrations" / "001.sql").write_text(
            "CREATE TABLE public.orgs (id uuid PRIMARY KEY);\n"
            "CREATE TABLE public.users (id uuid PRIMARY KEY, org_id uuid REFERENCES public.orgs(id));\n"
        )
        self.data = base / "data"
        store.build(self.repo, self.data)

    def talk(self, *messages):
        env = {**os.environ, "SYSTEM_MAP_DATA": str(self.data), "PYTHONDONTWRITEBYTECODE": "1"}
        done = subprocess.run(
            [sys.executable, str(ROOT / "mcp_server" / "server.py")],
            input="\n".join(json.dumps(m) for m in messages) + "\n",
            capture_output=True,
            text=True,
            env=env,
            timeout=20,
            check=True,
        )
        return [json.loads(line) for line in done.stdout.splitlines()]

    def tool(self, name, **arguments):
        reply = self.talk(
            {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": name, "arguments": arguments}}
        )[0]["result"]
        return reply

    def test_handshake_and_tool_list(self):
        replies = self.talk(
            {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}},
            {"jsonrpc": "2.0", "method": "notifications/initialized"},
            {"jsonrpc": "2.0", "id": 2, "method": "tools/list"},
        )
        self.assertEqual(len(replies), 2)
        self.assertEqual(replies[0]["result"]["serverInfo"]["name"], "system-map")
        self.assertIn("overview", [t["name"] for t in replies[1]["result"]["tools"]])

    def test_overview_is_the_cheap_first_read(self):
        value = json.loads(self.tool("overview")["content"][0]["text"])
        self.assertIn("orgs | 1 | 0", value["text"])
        self.assertEqual(value["facts_changed_since_build"], [])
        self.assertIn("stale", value["freshness"])

    def test_findings_filter_by_node_and_severity(self):
        value = json.loads(self.tool("findings", severity="high")["content"][0]["text"])
        found = json.loads(value["text"])
        self.assertEqual({f["check"] for f in found}, {"rls_off"})
        value = json.loads(self.tool("findings", node="table:public.orgs", severity="high")["content"][0]["text"])
        self.assertEqual(len(json.loads(value["text"])), 1)

    def test_findings_obey_the_budget(self):
        value = json.loads(self.tool("findings", budget_chars=20)["content"][0]["text"])
        self.assertFalse(value["inline"])
        self.assertTrue(Path(value["path"]).is_file())

    def test_node_over_budget_returns_a_path_not_the_body(self):
        value = json.loads(self.tool("node", id="table:public.users", budget_chars=50)["content"][0]["text"])
        self.assertFalse(value["inline"])
        self.assertTrue(Path(value["path"]).is_file())

    def test_a_note_without_evidence_is_refused(self):
        reply = self.tool("note", id="table:public.orgs", text="x", evidence=[])
        self.assertTrue(reply["isError"])

    def test_unknown_node_is_an_error_result(self):
        self.assertTrue(self.tool("node", id="table:public.nope")["isError"])

    def test_results_are_compact(self):
        text = self.tool("node", id="table:public.users")["content"][0]["text"]
        self.assertNotIn('\\n  "', text)
        self.assertNotIn('": ', text)

    def test_export_all_returns_a_path_when_over_budget(self):
        tables = 80
        migration = self.repo / "supabase" / "migrations" / "002.sql"
        migration.write_text(
            "\n".join(f"CREATE TABLE public.t{i} (id uuid PRIMARY KEY, note text);" for i in range(tables))
        )
        store.build(self.repo, self.data)
        value = json.loads(self.tool("export_all")["content"][0]["text"])
        self.assertFalse(value["inline"])
        self.assertTrue(Path(value["path"]).is_file())


if __name__ == "__main__":
    unittest.main()
