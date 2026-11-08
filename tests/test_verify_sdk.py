import contextlib
import io
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import verify  # noqa: E402
from core.__main__ import main  # noqa: E402

OPENAI = "@openai/agents"
CLAUDE = "@anthropic-ai/claude-agent-sdk"


def node(name: str, sdk: str, at: str, source: str = "sdk") -> dict:
    return {"id": f"agent:{name}", "kind": "agent", "name": name, "source": source, "sdk": sdk, "evidence": [at]}


def hand_off(source: str, target: str, at: str) -> dict:
    return {"source": f"agent:{source}", "kind": "hands_off_to", "target": f"agent:{target}", "evidence": [at]}


def truth_agent(name: str, sdk: str, path: str, line: int) -> dict:
    return {"sdk": sdk, "name": name, "path": path, "line": line}


class CompareSdkAgents(unittest.TestCase):
    def setUp(self):
        self.nodes = [node("triage", OPENAI, "a.ts:5"), node("billing", OPENAI, "a.ts:2"), node("linter", CLAUDE, "q.ts:9")]
        self.edges = [hand_off("triage", "billing", "a.ts:7")]
        self.truth = {
            "agents": [truth_agent("billing", OPENAI, "a.ts", 2), truth_agent("triage", OPENAI, "a.ts", 5), truth_agent("linter", CLAUDE, "q.ts", 9)],
            "hand_offs": [{"from": "triage", "to": "billing", "path": "a.ts", "line": 7}],
            "unreadable": [],
        }

    def test_the_same_agents_and_hand_offs_match_with_no_difference(self):
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(found["differences"], [])
        self.assertEqual(found["agents_matched"], {OPENAI: 2, CLAUDE: 1})
        self.assertEqual(found["hand_offs_matched"], 1)

    def test_an_agent_only_the_model_found_is_reported_with_its_line(self):
        self.nodes.append(node("ghost", OPENAI, "b.ts:3"))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(found["differences"], [{"what": "agent", "only_in": "model", "item": [OPENAI, "ghost"], "at": "b.ts:3"}])

    def test_an_agent_only_the_compiler_found_is_reported_with_its_line(self):
        self.truth["agents"].append(truth_agent("missed", OPENAI, "c.ts", 4))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(found["differences"], [{"what": "agent", "only_in": "compiler", "item": [OPENAI, "missed"], "at": "c.ts:4"}])

    def test_the_same_name_under_another_sdk_is_two_differences(self):
        self.truth["agents"][2]["sdk"] = OPENAI
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual([(d["only_in"], tuple(d["item"])) for d in found["differences"]], [("model", (CLAUDE, "linter")), ("compiler", (OPENAI, "linter"))])

    def test_a_hand_off_on_one_side_only_is_a_difference(self):
        self.edges.append(hand_off("billing", "triage", "a.ts:3"))
        self.truth["hand_offs"].append({"from": "triage", "to": "linter", "path": "a.ts", "line": 8})
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(
            [(d["only_in"], d["item"], d["at"]) for d in found["differences"]],
            [("model", ["billing", "triage"], "a.ts:3"), ("compiler", ["triage", "linter"], "a.ts:8")],
        )

    def test_listed_agents_and_their_links_are_not_compared(self):
        self.nodes.append(node("listed", OPENAI, "x.ts:1", source="settings"))
        self.edges.append(hand_off("triage", "listed", "a.ts:9"))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(found["differences"], [])

    def test_two_truth_agents_with_one_name_count_once(self):
        self.truth["agents"].append(truth_agent("billing", OPENAI, "other.ts", 1))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(found["differences"], [])
        self.assertEqual(found["agents_matched"][OPENAI], 2)

    def test_a_compiler_only_agent_in_a_test_file_is_a_skip_not_a_difference(self):
        self.truth["agents"].append(truth_agent("probe", OPENAI, "src/a.test.ts", 4))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(found["differences"], [])
        self.assertEqual(found["skipped"], [{"what": "agent", "only_in": "compiler", "item": [OPENAI, "probe"], "at": "src/a.test.ts:4", "why": "in a test file"}])

    def test_a_compiler_only_agent_outside_the_code_root_is_a_skip(self):
        self.truth["agents"].append(truth_agent("demo", OPENAI, "scripts/demo.ts", 2))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth, "src/")
        self.assertEqual(found["differences"], [])
        self.assertEqual([(s["item"], s["why"]) for s in found["skipped"]], [([OPENAI, "demo"], "outside the code root (src/)")])

    def test_outside_the_root_is_a_difference_when_there_is_no_code_root(self):
        self.truth["agents"].append(truth_agent("demo", OPENAI, "scripts/demo.ts", 2))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(len(found["differences"]), 1)
        self.assertEqual(found["skipped"], [])

    def test_a_model_only_agent_in_a_test_file_is_still_a_difference(self):
        self.nodes.append(node("ghost", OPENAI, "src/b.test.ts:3"))
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(len(found["differences"]), 1)
        self.assertEqual(found["skipped"], [])

    def test_unreadable_names_are_passed_on_and_are_not_differences(self):
        self.truth["unreadable"] = [{"path": "d.ts", "line": 6, "why": "name is not a string literal type (string)"}]
        found = verify.compare_sdk_agents(self.nodes, self.edges, self.truth)
        self.assertEqual(found["differences"], [])
        self.assertEqual(found["unreadable"], self.truth["unreadable"])


class TruthFile(unittest.TestCase):
    def run_verify(self, text: str) -> tuple[int, str, str]:
        with tempfile.TemporaryDirectory() as folder:
            truth = Path(folder) / "truth.json"
            truth.write_text(text, encoding="utf-8")
            out, err = io.StringIO(), io.StringIO()
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
                code = main(["verify-sdk", folder, str(truth)])
        return code, out.getvalue(), err.getvalue()

    def test_an_empty_truth_file_is_named_plainly_with_no_traceback(self):
        code, out, err = self.run_verify("")
        self.assertEqual(code, 2)
        self.assertIn("is empty", err)
        self.assertIn("scripts/sdk_truth.mjs", err)
        self.assertNotIn("Traceback", err)
        self.assertEqual(out, "")

    def test_a_truth_file_that_is_not_json_is_named_plainly_with_no_traceback(self):
        code, _, err = self.run_verify('{"agents": [')
        self.assertEqual(code, 2)
        self.assertIn("is not valid JSON", err)
        self.assertNotIn("Traceback", err)


TYPESCRIPT = ROOT / "ui" / "node_modules" / "typescript"
MASTRA_TYPES = 'export declare class Agent { constructor(config: { name: string; id?: string }); }\n'
OPENAI_TYPES = (
    "export declare class Agent {\n"
    "  constructor(config: { name: string });\n"
    "  static create<T extends { name: string }>(config: T): Agent;\n"
    "}\n"
)


@unittest.skipUnless(TYPESCRIPT.exists(), "needs ui/node_modules; run npm install in ui")
class CompilerTruth(unittest.TestCase):
    """scripts/sdk_truth.mjs on a folder with stand-ins for the SDK packages."""

    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.root = Path(folder.name)
        self.package("@mastra/core", MASTRA_TYPES)
        self.package("@openai/agents-core", OPENAI_TYPES)
        self.package("@openai/agents", "export * from '@openai/agents-core'\n")

    def package(self, name: str, types: str) -> None:
        self.write(f"node_modules/{name}/package.json", '{"name": "%s", "version": "1.0.0", "types": "index.d.ts"}' % name)
        self.write(f"node_modules/{name}/index.d.ts", types)

    def write(self, path: str, text: str) -> None:
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")

    def truth(self) -> dict:
        done = subprocess.run(["node", str(ROOT / "scripts" / "sdk_truth.mjs"), str(self.root)], capture_output=True, text=True, timeout=120)
        self.assertEqual(done.returncode, 0, done.stderr)
        return json.loads(done.stdout)

    def test_static_create_is_read_through_an_import_and_a_namespace(self):
        self.write(
            "src/a.ts",
            "import { Agent } from '@openai/agents'\nimport * as sdk from '@openai/agents'\n"
            "export const one = Agent.create({ name: 'One' })\nexport const two = sdk.Agent.create({ name: 'Two' })\n"
            "const holder = { make: (config: { name: string }) => config }\nholder.make({ name: 'Three' })\n",
        )
        names = [(item["name"], item["line"]) for item in self.truth()["agents"]]
        self.assertEqual(names, [("One", 3), ("Two", 4)])


if __name__ == "__main__":
    unittest.main()
