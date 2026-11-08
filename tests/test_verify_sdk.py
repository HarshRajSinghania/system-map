import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import verify  # noqa: E402

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


if __name__ == "__main__":
    unittest.main()
