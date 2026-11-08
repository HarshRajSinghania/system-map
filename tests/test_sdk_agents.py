import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import agents, system  # noqa: E402
from core.sources import TreeSource  # noqa: E402


def package(*names: str, dev: bool = False) -> str:
    return json.dumps({"devDependencies" if dev else "dependencies": {name: "1.0.0" for name in names}})


OPENAI_AGENTS = """import { Agent, handoff } from "@openai/agents";

export const billing = new Agent({ name: "billing", instructions: "Handles invoices.", model: "gpt-4.1" });
export const support = Agent.create({ name: "support", handoffs: [billing] });
export const triage = new Agent({
  name: "triage",
  instructions: "Routes each request.",
  handoffs: [support, handoff(billing)],
});
"""
OPENAI_MAIN = """import { run } from "@openai/agents";
import { triage } from "./agents";

export const go = () => run(triage, "hello");
"""
ANTHROPIC_CLIENT = 'import Anthropic from "@anthropic-ai/sdk";\nexport const client = new Anthropic();\n'


def line_of(text: str, needle: str) -> int:
    return text[: text.index(needle)].count("\n") + 1


class Fixture(unittest.TestCase):
    def build(self, files: dict[str, str], settings=None):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        repo = Path(tmp.name)
        for name, text in files.items():
            path = repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        joined = system.build(TreeSource(repo), [], settings)
        self.nodes = {node["id"]: node for node in joined["nodes"]}
        self.edges = {(e["source"], e["kind"], e["target"]): e for e in joined["edges"]}
        self.joined = joined
        return joined

    def agent_ids(self) -> set[str]:
        return {node_id for node_id, node in self.nodes.items() if node["kind"] == "agent"}

    def links(self, kind: str) -> set[tuple[str, str]]:
        return {(source, target) for source, found, target in self.edges if found == kind}


class OpenAIAgents(Fixture):
    FILES = {"package.json": package("@openai/agents"), "src/agents.ts": OPENAI_AGENTS, "src/main.ts": OPENAI_MAIN}

    def test_new_and_create_each_make_an_agent_with_the_sdk_and_line(self):
        self.build(self.FILES)
        self.assertEqual(self.agent_ids(), {"agent:billing", "agent:support", "agent:triage"})
        node = self.nodes["agent:support"]
        self.assertEqual((node["source"], node["sdk"], node["status"], node["layer"]), ("sdk", "@openai/agents", "built", "facts"))
        self.assertEqual((node["name"], node["label"], node["jobs"], node["asks_you"], node["path"]), ("support", "support", [], [], "src/agents.ts"))
        self.assertEqual(node["evidence"], [f"src/agents.ts:{line_of(OPENAI_AGENTS, 'Agent.create')}"])

    def test_a_literal_instruction_is_the_description(self):
        self.build(self.FILES)
        self.assertEqual(self.nodes["agent:billing"]["description"], "Handles invoices.")
        self.assertEqual(self.nodes["agent:support"]["description"], "")

    def test_handoffs_plain_or_wrapped_link_agents_with_the_line(self):
        self.build(self.FILES)
        self.assertEqual(
            self.links("hands_off_to"),
            {("agent:support", "agent:billing"), ("agent:triage", "agent:support"), ("agent:triage", "agent:billing")},
        )
        edge = self.edges[("agent:triage", "hands_off_to", "agent:billing")]
        self.assertEqual(edge["evidence"], [f"src/agents.ts:{line_of(OPENAI_AGENTS, 'handoff(billing)')}"])

    def test_run_in_code_no_agent_owns_starts_the_agent(self):
        self.build(self.FILES)
        starts = [(source, target) for source, target in self.links("starts")]
        self.assertEqual([target for _, target in starts], ["agent:triage"])
        self.assertTrue(starts[0][0].startswith("module:"))
        edge = self.edges[(starts[0][0], "starts", "agent:triage")]
        self.assertEqual(edge["evidence"], [f"src/main.ts:{line_of(OPENAI_MAIN, 'run(triage')}"])

    def test_a_run_inside_an_agent_s_own_code_starts_nothing(self):
        files = dict(self.FILES)
        files["src/agents.ts"] = OPENAI_AGENTS + 'export const nested = new Agent({ name: "nested", instructions: String(run(billing, "x")) });\n'
        files["src/agents.ts"] = 'import { run } from "@openai/agents";\n' + files["src/agents.ts"]
        self.build(files)
        self.assertIn("agent:nested", self.nodes)
        self.assertNotIn("agent:billing", {target for _, target in self.links("starts")})

    def test_a_model_prefix_and_no_model_link_to_the_providers_the_project_has(self):
        files = dict(self.FILES)
        files["src/agents.ts"] = OPENAI_AGENTS + 'export const writer = new Agent({ name: "writer", model: "anthropic/claude-sonnet-4" });\n'
        files["src/claude.ts"] = ANTHROPIC_CLIENT
        self.build(files)
        models = {(source, target) for source, target in self.links("uses_model")}
        self.assertEqual(
            models,
            {
                ("agent:billing", "service:openai"),  # a plain model name: OpenAI
                ("agent:support", "service:openai"),  # no model: OpenAI
                ("agent:triage", "service:openai"),
                ("agent:writer", "service:anthropic"),
            },
        )

    def test_a_provider_the_project_does_not_have_is_not_linked(self):
        files = dict(self.FILES)
        files["src/agents.ts"] = 'import { Agent } from "@openai/agents";\nexport const writer = new Agent({ name: "writer", model: "anthropic/claude-sonnet-4" });\n'
        self.build(files)
        self.assertEqual(self.links("uses_model"), set())

    def test_imports_under_another_name_and_a_namespace_count(self):
        files = {
            "package.json": package("@openai/agents"),
            "src/a.ts": 'import { Agent as Bot } from "@openai/agents";\nexport const a = new Bot({ name: "alpha" });\n',
            "src/b.ts": 'import * as sdk from "@openai/agents";\nexport const b = new sdk.Agent({ name: "beta" });\n',
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), {"agent:alpha", "agent:beta"})

    def test_a_constant_name_counts_even_from_another_file(self):
        files = {
            "package.json": package("@openai/agents"),
            "src/names.ts": 'export const NAME = "billing";\n',
            "src/a.ts": 'import { Agent } from "@openai/agents";\nimport { NAME } from "./names";\nexport const a = new Agent({ name: NAME });\n',
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), {"agent:billing"})


class NotAgents(Fixture):
    def agents_with(self, name_source: str, extra: str = "") -> set[str]:
        code = f'import {{ Agent }} from "@openai/agents";\n{extra}\nexport const a = new Agent({{ name: {name_source} }});\n'
        self.build({"package.json": package("@openai/agents"), "src/a.ts": code})
        return self.agent_ids()

    def test_a_template_with_a_hole_adds_nothing(self):
        self.assertEqual(self.agents_with("`agent-${process.env.TENANT}`"), set())

    def test_a_template_without_a_hole_is_a_literal(self):
        self.assertEqual(self.agents_with("`plain`"), {"agent:plain"})

    def test_a_variable_adds_nothing(self):
        self.assertEqual(self.agents_with("title", "const title = process.env.NAME;"), set())

    def test_a_call_adds_nothing(self):
        self.assertEqual(self.agents_with("makeName()", "const makeName = () => 'x';"), set())

    def test_a_constant_that_holds_a_template_with_a_hole_adds_nothing(self):
        self.assertEqual(self.agents_with("NAME", "const NAME = `a-${Date.now()}`;"), set())

    def test_an_agent_class_that_is_not_from_the_sdk_adds_nothing(self):
        files = {
            "package.json": package("@openai/agents"),
            "src/agent.ts": 'export class Agent {\n  constructor(public config: { name: string }) {}\n}\n',
            "src/a.ts": 'import { Agent } from "./agent";\nexport const a = new Agent({ name: "local" });\n',
            "src/b.ts": 'class Agent {\n  constructor(public config: { name: string }) {}\n}\nexport const b = new Agent({ name: "inline" });\n',
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), set())

    def test_an_agent_from_another_package_adds_nothing(self):
        files = {
            "package.json": package("@openai/agents"),
            "src/a.ts": 'import { Agent } from "other-agents";\nexport const a = new Agent({ name: "other" });\n',
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), set())

    def test_an_import_of_types_only_adds_nothing(self):
        files = {
            "package.json": package("@openai/agents"),
            "src/a.ts": 'import type { Agent } from "@openai/agents";\nexport const a = new Agent({ name: "typed" });\n',
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), set())

    def test_a_config_that_is_not_an_object_literal_adds_nothing(self):
        files = {
            "package.json": package("@openai/agents"),
            "src/a.ts": 'import { Agent } from "@openai/agents";\nconst config = { name: "hidden" };\nexport const a = new Agent(config);\n',
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), set())

    def test_new_agent_in_a_comment_or_string_adds_nothing(self):
        code = 'import { Agent } from "@openai/agents";\n// new Agent({ name: "commented" })\nexport const s = \'new Agent({ name: "quoted" })\';\n'
        self.build({"package.json": package("@openai/agents"), "src/a.ts": code})
        self.assertEqual(self.agent_ids(), set())


class Listing(Fixture):
    def test_an_sdk_in_code_but_not_in_package_json_is_not_read(self):
        self.build({"package.json": package("react"), "src/agents.ts": OPENAI_AGENTS})
        self.assertEqual(self.agent_ids(), set())

    def test_no_package_json_is_not_read(self):
        self.build({"src/agents.ts": OPENAI_AGENTS})
        self.assertEqual(self.agent_ids(), set())

    def test_a_dev_dependency_is_listed(self):
        self.build({"package.json": package("@openai/agents", dev=True), "src/agents.ts": OPENAI_AGENTS})
        self.assertEqual(len(self.agent_ids()), 3)

    def test_it_needs_no_settings(self):
        self.build({"package.json": package("@openai/agents"), "src/agents.ts": OPENAI_AGENTS}, None)
        self.assertEqual(len(self.agent_ids()), 3)


class NoSdk(Fixture):
    LISTED = {
        "package.json": package("react"),
        "src/registry.ts": 'export const AGENTS = [\n  { name: "mail", handlers: { "mail.read": 1 } },\n];\n',
        "src/other.ts": OPENAI_AGENTS,
    }
    SETTINGS = {"list": "src/registry.ts"}

    def test_a_project_without_an_sdk_has_no_sdk_agents_with_or_without_settings(self):
        self.build(self.LISTED)
        self.assertEqual(self.agent_ids(), set())
        self.build(self.LISTED, self.SETTINGS)
        self.assertEqual(self.agent_ids(), {"agent:mail"})
        self.assertNotIn("sdk", self.nodes["agent:mail"])

    def test_rows_of_other_agents_have_no_sdk_key(self):
        self.build(self.LISTED, self.SETTINGS)
        row = agents.rows(self.joined)[0]
        self.assertNotIn("sdk", row)
        self.assertEqual(row["source"], "list")

    def test_rows_of_an_sdk_agent_carry_the_sdk(self):
        self.build({"package.json": package("@openai/agents"), "src/agents.ts": OPENAI_AGENTS})
        rows = {row["name"]: row for row in agents.rows(self.joined)}
        self.assertEqual(rows["triage"]["sdk"], "@openai/agents")
        self.assertEqual(rows["triage"]["source"], "sdk")
        self.assertEqual({link["node"] for link in rows["triage"]["hands_off_to"]}, {"agent:support", "agent:billing"})

    def test_no_code_at_all_is_fine(self):
        self.build({"package.json": package("@openai/agents"), "README.md": "hi\n"})
        self.assertEqual(self.agent_ids(), set())


class Merge(Fixture):
    FILES = {
        "package.json": package("@openai/agents"),
        "src/registry.ts": 'export const AGENTS = [\n  { name: "billing", label: "Billing desk", handlers: { "bill.send": 1 } },\n];\n',
        "src/agents.ts": OPENAI_AGENTS,
    }

    def test_a_listed_agent_and_an_sdk_agent_with_one_name_are_one_agent_and_the_listed_one_wins(self):
        self.build(self.FILES, {"list": "src/registry.ts"})
        billing = self.nodes["agent:billing"]
        self.assertEqual((billing["source"], billing["label"], billing["jobs"]), ("list", "Billing desk", ["bill.send"]))
        self.assertNotIn("sdk", billing)
        self.assertEqual([n for n in self.joined["nodes"] if n["id"] == "agent:billing"], [billing])
        self.assertEqual(self.agent_ids(), {"agent:billing", "agent:support", "agent:triage"})

    def test_links_into_the_listed_agent_stay(self):
        self.build(self.FILES, {"list": "src/registry.ts"})
        self.assertIn(("agent:triage", "hands_off_to", "agent:billing"), self.edges)

    def test_listed_and_sdk_agents_sit_side_by_side(self):
        files = dict(self.FILES, **{"src/registry.ts": 'export const AGENTS = [\n  { name: "mail", handlers: { "mail.read": 1 } },\n];\n'})
        self.build(files, {"list": "src/registry.ts"})
        self.assertEqual(self.agent_ids(), {"agent:mail", "agent:billing", "agent:support", "agent:triage"})

    def test_a_marked_module_with_the_name_wins_too(self):
        files = {"package.json": package("@openai/agents"), "src/agents.ts": OPENAI_AGENTS, "src/triage/index.ts": "export const x = 1;\n"}
        self.build(files)
        marked = [node_id for node_id, node in self.nodes.items() if node["kind"] == "module" and node["name"] == "triage"]
        self.assertEqual(len(marked), 1)
        self.build(files, {"modules": marked})
        triage = self.nodes["agent:triage"]
        self.assertEqual(triage["source"], "module")
        self.assertNotIn("sdk", triage)




if __name__ == "__main__":
    unittest.main()
