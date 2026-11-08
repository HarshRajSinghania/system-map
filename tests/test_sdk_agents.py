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
MASTRA_AGENTS = """import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const writer = new Agent({ id: "writer", name: "writer", instructions: "Writes drafts.", model: openai("gpt-4o") });
export const editor = new Agent({ id: "editor", name: "editor", description: "Edits drafts.", model: "anthropic/claude-sonnet-4" });
export const reader = new Agent({ id: "reader", name: "reader", model: "google/gemini-2.5-flash" });
"""
MASTRA_JOB = """import { writer, editor } from "./agents";

export async function work() {
  await writer.generate("write");
  const out = await editor.stream("edit");
  return out;
}
"""
CLAUDE_REVIEW = """import { query } from "@anthropic-ai/claude-agent-sdk";

export async function review() {
  for await (const message of query({
    prompt: "review",
    options: {
      agents: {
        linter: { description: "Lints the change.", prompt: "Lint.", model: "haiku" },
        "test-runner": { description: "Runs the tests.", prompt: "Run." },
      },
    },
  })) {
    console.log(message);
  }
}
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

    def test_hand_offs_follow_a_variable_whose_agent_has_a_name_found_in_another_file(self):
        # b.ts declares the same two names as a.ts, so its nodes are the first file's, but its own
        # variables and `handoffs` still link them.
        head = 'import { Agent } from "@openai/agents";\n'
        files = {
            "package.json": package("@openai/agents"),
            "src/a.ts": head + 'export const one = new Agent({ name: "one" });\nexport const two = new Agent({ name: "two" });\n',
            "src/b.ts": head
            + 'const one = new Agent({ name: "one" });\nconst two = new Agent({ name: "two", handoffs: [one] });\n'
            + 'const lead = new Agent({ name: "lead", handoffs: [one, two] });\n',
        }
        self.build(files)
        self.assertEqual(self.links("hands_off_to"), {("agent:two", "agent:one"), ("agent:lead", "agent:one"), ("agent:lead", "agent:two")})
        self.assertEqual(self.nodes["agent:one"]["evidence"], ["src/a.ts:2"])


class HeldHandoff(Fixture):
    HEAD = 'import { Agent, handoff } from "@openai/agents";\nconst one = new Agent({ name: "one" });\nconst two = new Agent({ name: "two" });\n'

    def hand_offs(self, body: str, head: str | None = None) -> set[tuple[str, str]]:
        self.build({"package.json": package("@openai/agents"), "src/a.ts": (head or self.HEAD) + body})
        return self.links("hands_off_to")

    def test_a_handoff_held_in_a_variable_and_listed_links_its_first_argument(self):
        body = 'const toOne = handoff(one, { toolNameOverride: "x" });\nconst toTwo = handoff<unknown>(two);\nnew Agent({ name: "lead", handoffs: [toOne, toTwo] });\n'
        links = self.hand_offs(body)
        self.assertEqual(links, {("agent:lead", "agent:one"), ("agent:lead", "agent:two")})
        edge = self.edges[("agent:lead", "hands_off_to", "agent:one")]
        self.assertEqual(edge["evidence"], [f"src/a.ts:{line_of(self.HEAD + body, 'handoffs: [toOne')}"])

    def test_a_held_handoff_inside_a_function_counts_there(self):
        body = 'export function build() {\n  const toOne = handoff(one);\n  return new Agent({ name: "lead", handoffs: [toOne] });\n}\n'
        self.assertEqual(self.hand_offs(body), {("agent:lead", "agent:one")})

    def test_a_variable_that_is_not_a_handoff_call_adds_nothing(self):
        self.assertEqual(self.hand_offs('const other = makeIt(one);\nnew Agent({ name: "lead", handoffs: [other] });\n'), set())

    def test_a_handoff_that_is_not_from_the_sdk_adds_nothing(self):
        head = self.HEAD.replace(", handoff }", " }") + "const handoff = (x) => x;\n"
        self.assertEqual(self.hand_offs('const toOne = handoff(one);\nnew Agent({ name: "lead", handoffs: [toOne] });\n', head), set())


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

    def test_only_a_listed_sdk_is_read(self):
        files = {
            "package.json": package("@openai/agents"),
            "src/agents.ts": OPENAI_AGENTS,
            "src/mastra.ts": MASTRA_AGENTS,
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), {"agent:billing", "agent:support", "agent:triage"})


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

    def test_an_ai_sdk_provider_package_alone_gives_the_service(self):
        # Criterion 6 holds except for this: `@ai-sdk/openai` is a provider whatever agent SDK is used.
        code = 'import { openai } from "@ai-sdk/openai";\nexport const model = openai("gpt-4o");\n'
        self.build({"package.json": package("@ai-sdk/openai"), "src/model.ts": code})
        self.assertIn("service:openai", self.nodes)
        self.assertEqual(self.agent_ids(), set())

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

    def test_a_start_of_the_listed_agent_stays_and_its_own_outgoing_links_go(self):
        files = dict(self.FILES, **{"src/main.ts": 'import { run } from "@openai/agents";\nimport { billing } from "./agents";\nexport const go = () => run(billing, "hi");\n'})
        files["src/agents.ts"] = OPENAI_AGENTS.replace("model: \"gpt-4.1\"", "handoffs: [support], model: \"gpt-4.1\"")
        self.build(files, {"list": "src/registry.ts"})
        starts = {(source, target) for source, target in self.links("starts")}
        self.assertEqual({target for _, target in starts}, {"agent:billing"})
        self.assertTrue(next(iter(starts))[0].startswith("module:"))
        self.assertNotIn(("agent:billing", "hands_off_to", "agent:support"), self.edges)

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


class Mastra(Fixture):
    FILES = {
        "package.json": package("@mastra/core", "@ai-sdk/openai"),
        "src/agents.ts": MASTRA_AGENTS,
        "src/job.ts": MASTRA_JOB,
        "src/claude.ts": ANTHROPIC_CLIENT,
    }

    def test_each_new_agent_from_mastra_is_an_agent(self):
        self.build(self.FILES)
        self.assertEqual(self.agent_ids(), {"agent:writer", "agent:editor", "agent:reader"})
        node = self.nodes["agent:editor"]
        self.assertEqual((node["source"], node["sdk"], node["description"]), ("sdk", "@mastra/core", "Edits drafts."))
        self.assertEqual(node["evidence"], [f"src/agents.ts:{line_of(MASTRA_AGENTS, 'new Agent({ id: \"editor\"')}"])
        self.assertEqual(self.nodes["agent:writer"]["description"], "Writes drafts.")

    def test_generate_and_stream_start_the_agent_from_the_module(self):
        self.build(self.FILES)
        starts = {target for _, target in self.links("starts")}
        self.assertEqual(starts, {"agent:writer", "agent:editor"})
        source = next(source for source, target in self.links("starts") if target == "agent:writer")
        self.assertEqual(self.edges[(source, "starts", "agent:writer")]["evidence"], [f"src/job.ts:{line_of(MASTRA_JOB, 'writer.generate')}"])
        self.assertEqual(self.edges[(source, "starts", "agent:editor")]["evidence"], [f"src/job.ts:{line_of(MASTRA_JOB, 'editor.stream')}"])

    def test_models_by_provider_function_and_prefix(self):
        self.build(self.FILES)
        self.assertEqual(
            self.links("uses_model"),
            {("agent:writer", "service:openai"), ("agent:editor", "service:anthropic")},
        )
        edge = self.edges[("agent:writer", "uses_model", "service:openai")]
        self.assertEqual(edge["evidence"], [f"src/agents.ts:{line_of(MASTRA_AGENTS, 'model: openai')}"])

    def test_with_no_model_there_is_no_model_link(self):
        code = 'import { Agent } from "@mastra/core/agent";\nexport const a = new Agent({ id: "a", name: "a" });\n'
        self.build({"package.json": package("@mastra/core"), "src/a.ts": code, "src/c.ts": ANTHROPIC_CLIENT})
        self.assertEqual(self.agent_ids(), {"agent:a"})
        self.assertEqual(self.links("uses_model"), set())

    def test_a_provider_the_project_does_not_have_is_not_linked(self):
        files = {k: v for k, v in self.FILES.items() if k != "src/claude.ts"}
        self.build(files)
        self.assertEqual(self.links("uses_model"), {("agent:writer", "service:openai")})

    def test_a_template_name_and_a_local_agent_class_add_nothing(self):
        files = {
            "package.json": package("@mastra/core"),
            "src/a.ts": 'import { Agent } from "@mastra/core/agent";\nconst id = "x";\nexport const a = new Agent({ id, name: `n-${id}` });\n',
            "src/b.ts": 'class Agent {\n  constructor(public config: unknown) {}\n}\nexport const b = new Agent({ name: "local" });\n',
        }
        self.build(files)
        self.assertEqual(self.agent_ids(), set())

    def test_a_call_on_something_that_is_not_an_agent_starts_nothing(self):
        files = dict(self.FILES, **{"src/job.ts": 'import { client } from "./claude";\nexport const f = () => client.generate("x");\n'})
        self.build(files)
        self.assertEqual(self.links("starts"), set())

    def test_the_sdk_not_in_package_json_is_not_read(self):
        self.build(dict(self.FILES, **{"package.json": package("@ai-sdk/openai")}))
        self.assertEqual(self.agent_ids(), set())


class ClaudeAgentSdk(Fixture):
    FILES = {"package.json": package("@anthropic-ai/claude-agent-sdk"), "src/review.ts": CLAUDE_REVIEW}

    def test_each_key_of_options_agents_is_an_agent(self):
        self.build(self.FILES)
        self.assertEqual(self.agent_ids(), {"agent:linter", "agent:test-runner"})
        node = self.nodes["agent:linter"]
        self.assertEqual((node["source"], node["sdk"], node["status"], node["description"]), ("sdk", "@anthropic-ai/claude-agent-sdk", "built", "Lints the change."))
        self.assertEqual(node["evidence"], [f"src/review.ts:{line_of(CLAUDE_REVIEW, 'linter:')}"])
        self.assertEqual(self.nodes["agent:test-runner"]["evidence"], [f"src/review.ts:{line_of(CLAUDE_REVIEW, 'test-runner')}"])

    def test_the_module_that_makes_the_call_starts_each_one(self):
        self.build(self.FILES)
        sources = {source for source, _ in self.links("starts")}
        self.assertEqual(len(sources), 1)
        self.assertTrue(sources.pop().startswith("module:"))
        self.assertEqual({target for _, target in self.links("starts")}, {"agent:linter", "agent:test-runner"})
        edge = next(e for (_, kind, target), e in self.edges.items() if kind == "starts" and target == "agent:linter")
        self.assertEqual(edge["evidence"], [f"src/review.ts:{line_of(CLAUDE_REVIEW, 'query(')}"])

    def test_each_agent_uses_anthropic(self):
        self.build(self.FILES)
        self.assertEqual(self.links("uses_model"), {("agent:linter", "service:anthropic"), ("agent:test-runner", "service:anthropic")})

    def test_options_and_agents_can_be_constants_in_the_file(self):
        code = (
            'import { query } from "@anthropic-ai/claude-agent-sdk";\n'
            'const agents = { fixer: { description: "Fixes.", prompt: "Fix." } };\n'
            'const options = { agents };\n'
            'export const go = () => query({ prompt: "x", options });\n'
        )
        self.build({"package.json": package("@anthropic-ai/claude-agent-sdk"), "src/a.ts": code})
        self.assertEqual(self.agent_ids(), {"agent:fixer"})

    def test_agents_from_a_call_or_a_computed_variable_key_add_nothing(self):
        code = (
            'import { query } from "@anthropic-ai/claude-agent-sdk";\n'
            "const key = process.env.KEY;\n"
            'export const a = () => query({ prompt: "x", options: { agents: makeAgents() } });\n'
            'export const b = () => query({ prompt: "x", options: { agents: { [key]: { description: "d", prompt: "p" } } } });\n'
        )
        self.build({"package.json": package("@anthropic-ai/claude-agent-sdk"), "src/a.ts": code})
        self.assertEqual(self.agent_ids(), set())

    def test_a_computed_key_that_is_a_constant_counts(self):
        code = (
            'import { query } from "@anthropic-ai/claude-agent-sdk";\n'
            'const KEY = "scribe";\n'
            'export const a = () => query({ prompt: "x", options: { agents: { [KEY]: { description: "d", prompt: "p" } } } });\n'
        )
        self.build({"package.json": package("@anthropic-ai/claude-agent-sdk"), "src/a.ts": code})
        self.assertEqual(self.agent_ids(), {"agent:scribe"})

    def test_a_query_that_is_not_from_the_sdk_adds_nothing(self):
        code = 'import { query } from "./db";\nexport const a = () => query({ options: { agents: { fixer: { description: "d" } } } });\n'
        self.build({"package.json": package("@anthropic-ai/claude-agent-sdk"), "src/a.ts": code, "src/db.ts": "export const query = (x: unknown) => x;\n"})
        self.assertEqual(self.agent_ids(), set())

    def test_a_query_without_agents_adds_nothing(self):
        code = 'import { query } from "@anthropic-ai/claude-agent-sdk";\nexport const a = () => query({ prompt: "x", options: { model: "opus" } });\n'
        self.build({"package.json": package("@anthropic-ai/claude-agent-sdk"), "src/a.ts": code})
        self.assertEqual(self.agent_ids(), set())

    def test_the_sdk_not_in_package_json_is_not_read(self):
        self.build(dict(self.FILES, **{"package.json": package("react")}))
        self.assertEqual(self.agent_ids(), set())

    def test_two_calls_that_name_one_agent_make_one_agent_started_by_both(self):
        files = dict(self.FILES, **{"src/second/review.ts": CLAUDE_REVIEW})
        self.build(files)
        self.assertEqual(self.agent_ids(), {"agent:linter", "agent:test-runner"})
        self.assertEqual(self.nodes["agent:linter"]["path"], "src/review.ts")
        self.assertEqual(len({source for source, target in self.links("starts") if target == "agent:linter"}), 2)


class Scope(Fixture):
    """A name used where a function or block declares it again is not the agent variable."""

    MASTRA_A = 'import { Agent } from "@mastra/core/agent";\nexport const agent = new Agent({ name: "w", id: "w" });\n'
    OPENAI_A = 'import { Agent } from "@openai/agents";\nexport const agent = new Agent({ name: "w" });\n'

    def mastra(self, use: str) -> set[tuple[str, str]]:
        files = {"package.json": package("@mastra/core"), "src/a.ts": self.MASTRA_A, "src/b.ts": 'import { agent } from "./a";\n' + use}
        self.build(files)
        return self.links("starts")

    def openai(self, use: str) -> set[tuple[str, str]]:
        files = {"package.json": package("@openai/agents"), "src/a.ts": self.OPENAI_A, "src/b.ts": 'import { run } from "@openai/agents";\nimport { agent } from "./a";\n' + use}
        self.build(files)
        return self.links("starts")

    def test_a_function_that_does_not_redeclare_the_name_still_starts_the_agent(self):
        for links in (self.mastra('export function g() { return agent.generate("q"); }\n'), self.openai('export function g() { return run(agent, "q"); }\n')):
            self.assertEqual({target for _, target in links}, {"agent:w"})

    def test_a_parameter_of_that_name_is_not_the_agent_for_mastra(self):
        self.assertEqual(self.mastra('export function g(agent: any) { return agent.generate("q"); }\n'), set())

    def test_a_parameter_of_that_name_is_not_the_agent_for_openai(self):
        self.assertEqual(self.openai('export function g(agent: any) { return run(agent, "q"); }\n'), set())
        self.assertEqual(self.openai('export const g = (agent) => run(agent, "q");\n'), set())
        self.assertEqual(self.openai('export const g = ({ agent }: { agent: any }) => { return run(agent, "q"); };\n'), set())

    def test_a_local_constant_of_that_name_in_the_same_function_is_not_the_agent(self):
        self.assertEqual(self.mastra('export function g() { const agent = make(); return agent.generate("q"); }\n'), set())
        self.assertEqual(self.openai('export function g() {\n  const { agent } = make();\n  return run(agent, "q");\n}\n'), set())

    def test_a_declaration_in_another_function_does_not_hide_the_agent(self):
        use = 'function other(agent: any) { return 1; }\nexport function g() { return agent.generate("q"); }\n'
        self.assertEqual({target for _, target in self.mastra(use)}, {"agent:w"})

    def test_a_name_declared_in_a_block_that_does_not_hold_the_use_does_not_hide_it(self):
        use = 'export function g(flag: boolean) {\n  if (flag) { const agent = make(); agent.go(); }\n  return agent.generate("q");\n}\n'
        self.assertEqual({target for _, target in self.mastra(use)}, {"agent:w"})

    def test_a_local_variable_that_holds_the_agent_is_still_the_agent(self):
        code = 'import { Agent } from "@mastra/core/agent";\nexport function g() {\n  const local = new Agent({ name: "x", id: "x" });\n  return local.generate("q");\n}\n'
        self.build({"package.json": package("@mastra/core"), "src/b.ts": code})
        self.assertEqual({target for _, target in self.links("starts")}, {"agent:x"})

    def test_a_parameter_named_like_an_agent_is_not_a_hand_off(self):
        code = (
            'import { Agent } from "@openai/agents";\nimport { agent } from "./a";\n'
            'export const make = (agent: any) => new Agent({ name: "lead", handoffs: [agent] });\n'
        )
        self.build({"package.json": package("@openai/agents"), "src/a.ts": self.OPENAI_A, "src/b.ts": code})
        self.assertEqual(self.links("hands_off_to"), set())
        control = code.replace("(agent: any)", "()")
        self.build({"package.json": package("@openai/agents"), "src/a.ts": self.OPENAI_A, "src/b.ts": control})
        self.assertEqual(self.links("hands_off_to"), {("agent:lead", "agent:w")})


if __name__ == "__main__":
    unittest.main()
