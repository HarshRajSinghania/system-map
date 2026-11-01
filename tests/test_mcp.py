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

    def test_plan_answers_what_is_not_built(self):
        spec = self.repo / "docs" / "specs" / "next.md"
        spec.parent.mkdir(parents=True)
        spec.write_text("# Next\n`src/a/x.ts` `src/a/y.ts` `src/a/z.ts`\n")
        (self.repo / "src" / "a").mkdir(parents=True)
        (self.repo / "src" / "a" / "w.ts").write_text("export {}")
        store.build(self.repo, self.data)
        value = json.loads(self.tool("plan")["content"][0]["text"])
        item = json.loads(value["text"])[0]
        self.assertEqual((item["id"], item["status"], item["missing"]), ("plan:next", "planned", 3))
        self.assertEqual(item["not_found"][0], "src/a/x.ts")

    def code_repo(self):
        """A repo with history, so risk has something to say."""
        for name, text in (("src/core/a.ts", "export const a = (b: boolean) => (b ? 1 : 2)\n"), ("src/core/b.ts", "export const b = 1\n")):
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        for args in (["init", "-q", "-b", "main"], ["add", "-A"], ["-c", "user.name=t", "-c", "user.email=t@e.c", "commit", "-qm", "one"]):
            subprocess.run(["git", "-C", str(self.repo), *args], check=True)
        store.build(self.repo, self.data, "main")

    def test_risk_lists_rows_and_says_where_coverage_stands(self):
        self.code_repo()
        value = json.loads(self.tool("risk", all=True, level="files")["content"][0]["text"])
        body = json.loads(value["text"])
        self.assertIsNone(body["coverage"])
        self.assertEqual({row["path"] for row in body["files"]}, {"src/core/a.ts", "src/core/b.ts"})

    def test_risk_refuses_an_unknown_level(self):
        self.assertTrue(self.tool("risk", level="planets")["isError"])

    def test_coverage_loads_a_report_for_risk_to_use(self):
        self.code_repo()
        report = self.repo.parent / "lcov.info"
        report.write_text("SF:src/core/a.ts\nDA:1,0\nDA:2,0\nend_of_record\n")
        reply = json.loads(self.tool("coverage", report=str(report), commit="abc")["content"][0]["text"])
        self.assertEqual((reply["lines_total"], reply["file_count"]), (2, 1))
        body = json.loads(json.loads(self.tool("risk", all=True, level="files")["content"][0]["text"])["text"])
        self.assertEqual(body["coverage"]["commit"], "abc")

    def test_worktrees_answers_for_one_node(self):
        self.code_repo()
        tree = self.repo.parent / "tree"
        subprocess.run(["git", "-C", str(self.repo), "worktree", "add", "-q", "-b", "feat", str(tree), "main"], check=True)
        (tree / "src" / "core" / "b.ts").write_text("export const b = 2\n")
        whole = json.loads(json.loads(self.tool("worktrees")["content"][0]["text"])["text"])
        self.assertEqual(len(whole["worktrees"]), 2)
        one = json.loads(json.loads(self.tool("worktrees", node="module:src/core")["content"][0]["text"])["text"])
        self.assertEqual(one["worktrees"], ["feat"])

    def test_overview_points_at_risk_and_overlaps(self):
        self.code_repo()
        value = json.loads(self.tool("overview")["content"][0]["text"])
        self.assertEqual(value["hot_and_untested"], [])
        self.assertEqual(value["worktree_overlaps"], [])

    def read(self, name, **arguments):
        value = json.loads(self.tool(name, **arguments)["content"][0]["text"])
        return json.loads(value["text"]) if value.get("inline") else value

    def test_a_proposal_comes_back_with_its_diff_and_limits(self):
        changes = [{"op": "add_table", "table": "orgs", "columns": [{"name": "id", "type": "uuid"}]}]
        body = self.read("propose", title="Again", changes=changes, dry_run=True)
        self.assertEqual(body["counts"]["refused"], 1)
        self.assertEqual(self.read("proposals"), [])

    def test_a_saved_proposal_can_be_read_back(self):
        changes = [{"op": "add_column", "table": "orgs", "column": {"name": "tier", "type": "text"}}]
        saved = self.read("propose", title="Tier", why="Sort them", changes=changes)
        self.assertEqual(saved["id"], "tier")
        self.assertEqual(self.read("proposals")[0]["diff"]["changed"], 1)
        self.assertEqual(self.read("proposals", id="tier")["why"], "Sort them")

    def test_an_agent_cannot_accept_a_proposal(self):
        names = [tool["name"] for tool in self.talk({"jsonrpc": "2.0", "id": 1, "method": "tools/list"})[0]["result"]["tools"]]
        self.assertFalse([name for name in names if "status" in name or "accept" in name])
        schema = next(tool for tool in self.talk({"jsonrpc": "2.0", "id": 1, "method": "tools/list"})[0]["result"]["tools"] if tool["name"] == "propose")
        self.assertNotIn("status", schema["inputSchema"]["properties"])

    def test_a_malformed_proposal_is_an_error_result(self):
        self.assertTrue(self.tool("propose", title="Bad", changes=[{"op": "nope"}])["isError"])

    def test_a_use_case_comes_back_with_its_gaps(self):
        body = self.read("use_case", title="Find a client", tables=["ghosts", "users"])
        self.assertEqual(body["gaps"][0]["check"], "no_table")
        self.assertEqual(self.read("use_cases")[0]["title"], "Find a client")

    def test_a_view_refuses_what_the_model_does_not_hold(self):
        self.assertTrue(self.tool("save_view", title="V", nodes=["table:public.ghosts"])["isError"])
        self.assertEqual(self.read("save_view", title="V", nodes=["table:public.users"])["resolved"], ["table:public.users"])

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
