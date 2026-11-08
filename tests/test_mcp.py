import io
import json
import os
import subprocess
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
from test_agent_drafts import EVIDENCE  # noqa: E402
from test_agents import FILES, SETTINGS, line_of  # noqa: E402


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
        self.assertEqual(value["set_aside"], [])

    def test_overview_lists_a_saved_file_that_was_set_aside(self):
        regions = store.repo_dir(self.repo, self.data) / "intent" / "regions.json"
        regions.parent.mkdir(parents=True)
        regions.write_text("{broken")
        coverage = regions.parent.parent / "coverage.json"
        coverage.write_text('{"half": ')
        value = json.loads(self.tool("overview")["content"][0]["text"])  # nothing else was called first
        by_file = {item["file"]: item for item in value["set_aside"]}
        self.assertEqual(sorted(by_file), ["coverage.json", "intent/regions.json"])
        item = by_file["intent/regions.json"]
        self.assertRegex(item["kept_as"], r"^unreadable/intent/regions\.json\.\d{8}T\d{6}Z$")
        self.assertEqual((regions.parent.parent / item["kept_as"]).read_text(), "{broken")
        self.assertEqual((regions.parent.parent / by_file["coverage.json"]["kept_as"]).read_text(), '{"half": ')

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

    def agent_repo(self):
        """The agent fixture, built next to the schema repo, so `repo` names it."""
        repo = self.repo.parent / "agents-repo"
        for name, text in FILES.items():
            path = repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        git(repo, "init", "-q", "-b", "main")
        commit_all(repo)
        store.build(repo, self.data)
        return repo, store.repo_dir(repo, self.data)

    def test_agents_with_none_set_points_at_the_tab_and_suggests(self):
        repo, _ = self.agent_repo()
        value = json.loads(self.tool("agents", repo=str(repo))["content"][0]["text"])
        self.assertEqual((value["agents"], value["suggestions"]), ([], ["module:src/agents"]))
        self.assertIn("Agents tab", value["note"])
        self.assertIn("`draft_agents`", value["note"])

    def test_agents_lists_each_one_short(self):
        repo, target = self.agent_repo()
        store.set_agent_settings(target, {**SETTINGS, "home_region": "Canada"})
        store.set_region(target, "service:anthropic", "US")
        value = json.loads(self.tool("agents", repo=str(repo))["content"][0]["text"])
        body = json.loads(value["text"])
        sorter = next(row for row in body["agents"] if row["id"] == "agent:sorter")
        self.assertEqual(body["home_region"], "Canada")
        self.assertEqual(set(sorter["hands_off_to"]), {"agent:reader", "agent:mail"})
        self.assertIn("Anthropic (US)", sorter["models"])
        self.assertEqual((sorter["asks_you"], sorter["leaves_region"]), (True, ["service:anthropic"]))

    def test_one_agent_comes_with_its_evidence(self):
        repo, target = self.agent_repo()
        store.set_agent_settings(target, SETTINGS)
        value = json.loads(self.tool("agents", repo=str(repo), id="agent:reader")["content"][0]["text"])
        row = json.loads(value["text"])
        self.assertEqual(row["evidence"], [f"src/agents/handlers/reader.ts:{line_of('src/agents/handlers/reader.ts', 'export const readerAgent')}"])
        self.assertEqual(row["models"][0]["evidence"], "src/agents/ai.ts:1")
        self.assertTrue(self.tool("agents", repo=str(repo), id="agent:nope")["isError"])

    def test_agents_is_in_the_tool_list(self):
        reply = self.talk({"jsonrpc": "2.0", "id": 1, "method": "tools/list"})[0]
        self.assertIn("agents", [tool["name"] for tool in reply["result"]["tools"]])

    def call(self, request_id, name, **arguments):
        return {"jsonrpc": "2.0", "id": request_id, "method": "tools/call", "params": {"name": name, "arguments": arguments}}

    def test_arguments_are_held_to_the_tools_schema_and_the_server_lives_on(self):
        cases = [
            (self.call(1, "note", id="table:public.orgs", text="x", evidence="001.sql:1"), "evidence must be a list"),
            (self.call(2, "note", id="table:public.orgs", text="x", evidence=[1]), "each evidence entry must be text"),
            (self.call(3, "findings", budget_chars="lots"), "budget_chars must be a whole number"),
            (self.call(4, "risk", limit=True), "limit must be a whole number"),
            (self.call(5, "risk", all="yes"), "all must be true or false"),
            (self.call(6, "plan", status="done"), "status must be one of: planned, partial, unclear, built"),
            (self.call(7, "node"), "node needs id"),
            (self.call(8, "node", id=None), "node needs id"),
            ({"jsonrpc": "2.0", "id": 9, "method": "tools/call", "params": {"name": "overview", "arguments": ["x"]}}, "arguments must be an object"),
            ({"jsonrpc": "2.0", "id": 10, "method": "tools/call", "params": "overview"}, "params must be an object"),
        ]
        replies = self.talk(*[request for request, _ in cases], self.call(11, "overview"))
        self.assertEqual(len(replies), len(cases) + 1)
        for (request, wanted), reply in zip(cases, replies):
            with self.subTest(wanted=wanted):
                self.assertEqual(reply["id"], request["id"])
                self.assertTrue(reply["result"]["isError"])
                self.assertEqual(reply["result"]["content"][0]["text"], wanted)
        self.assertNotIn("isError", replies[-1]["result"])

    def test_a_null_optional_argument_counts_as_left_out(self):
        reply = self.tool("findings", node=None, severity=None, budget_chars=None)
        self.assertNotIn("isError", reply)

    def test_a_request_that_is_not_an_object_gets_an_error_and_the_server_lives_on(self):
        replies = self.talk([1], "x", {"jsonrpc": "2.0", "id": 2, "method": "ping"})
        self.assertEqual([reply["error"]["code"] for reply in replies[:2]], [-32600, -32600])
        self.assertEqual(replies[2], {"jsonrpc": "2.0", "id": 2, "result": {}})

    def test_a_dry_run_draft_shows_the_agents_and_saves_nothing(self):
        repo, target = self.agent_repo()
        body = self.read("draft_agents", repo=str(repo), settings=SETTINGS, evidence=EVIDENCE, dry_run=True)
        self.assertEqual((body["count"], body["saved"]), (4, False))
        self.assertEqual([row["id"] for row in body["agents"]], ["agent:sorter", "agent:reader", "agent:mail", "agent:digest"])
        self.assertIsNone(agent_drafts.load(target)["draft"])

    def test_a_draft_is_kept_for_a_person_and_changes_no_settings(self):
        repo, target = self.agent_repo()
        body = self.read("draft_agents", repo=str(repo), settings=SETTINGS, evidence=EVIDENCE, note="Read the registry.")
        self.assertTrue(body["saved"])
        self.assertEqual(agent_drafts.load(target)["draft"]["note"], "Read the registry.")
        self.assertEqual(store.load_agent_settings(target), {})

    def test_a_draft_with_no_evidence_is_an_error_result_saying_why(self):
        repo, target = self.agent_repo()
        reply = self.tool("draft_agents", repo=str(repo), settings=SETTINGS, evidence={})
        self.assertTrue(reply["isError"])
        self.assertIn("needs evidence", reply["content"][0]["text"])

    def test_settings_left_unwrapped_say_how_to_wrap_them(self):
        repo, _ = self.agent_repo()
        reply = self.tool("draft_agents", repo=str(repo), **SETTINGS)
        self.assertTrue(reply["isError"])
        self.assertIn('settings must be an object from each setting to its value, such as {"list"', reply["content"][0]["text"])
        reply = self.tool("draft_agents", repo=str(repo), settings="src/agents/registry.ts", evidence={})
        self.assertIn('settings must be an object from each setting to its value, such as {"list"', reply["content"][0]["text"])
        reply = self.tool("draft_agents", repo=str(repo), settings=SETTINGS)
        self.assertIn("evidence must be an object beside settings", reply["content"][0]["text"])

    def test_extra_arguments_cannot_use_or_drop_a_draft(self):
        repo, target = self.agent_repo()
        self.read("draft_agents", repo=str(repo), settings=SETTINGS, evidence=EVIDENCE, note="first")
        seen = agent_drafts.load(target)["draft"]["id"]
        for extra in ({"action": "use", "id": seen}, {"action": "drop", "id": seen}, {"use": True}, {"apply": True}):
            with self.subTest(extra=extra):
                self.tool("draft_agents", repo=str(repo), **extra)
                self.tool("agents", repo=str(repo), **extra)
                self.assertEqual(agent_drafts.load(target)["draft"]["id"], seen)
                self.assertEqual(store.load_agent_settings(target), {})

    def test_no_tool_can_use_or_drop_a_draft(self):
        tools = self.talk({"jsonrpc": "2.0", "id": 1, "method": "tools/list"})[0]["result"]["tools"]
        self.assertEqual([tool["name"] for tool in tools if "draft" in tool["name"]], ["draft_agents"])
        draft = next(tool for tool in tools if tool["name"] == "draft_agents")
        self.assertEqual(set(draft["inputSchema"]["properties"]), {"settings", "evidence", "note", "dry_run", "repo", "budget_chars"})
        self.assertIn("hand_off_calls", draft["description"])


class Faults(unittest.TestCase):
    """A fault no tool expected is reported as an internal error, and the next line still gets an answer."""

    def test_an_unexpected_fault_is_an_internal_error(self):
        from mcp_server import server

        line = json.dumps({"jsonrpc": "2.0", "id": 7, "method": "tools/call", "params": {"name": "overview", "arguments": {}}})
        with mock.patch.object(server, "call", side_effect=RuntimeError("boom")), mock.patch("sys.stderr", new_callable=io.StringIO) as err:
            reply = server.handle(line)
        self.assertEqual(reply, {"jsonrpc": "2.0", "id": 7, "error": {"code": -32603, "message": "internal error: RuntimeError: boom"}})
        self.assertIn("Traceback", err.getvalue())
        self.assertEqual(server.handle(json.dumps({"jsonrpc": "2.0", "id": 8, "method": "ping"}))["result"], {})


if __name__ == "__main__":
    unittest.main()
