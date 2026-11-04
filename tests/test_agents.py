import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import agents, system  # noqa: E402
from core.sources import TreeSource  # noqa: E402

FILES = {
    "tsconfig.json": '{"compilerOptions": {"baseUrl": ".", "paths": {"@/*": ["./src/*"]}}}\n',
    "src/agents/registry.ts": """import type { AgentDefinition } from "./types";
import { readerAgent } from "./handlers/reader";
import { sorterAgent } from "./handlers/sorter";

/** Every agent the worker runs. */
export const AGENTS: readonly AgentDefinition[] = [
  sorterAgent,
  readerAgent,
  { name: "mail", label: "Mail", description: "Reads your email.", handlers: {} },
  { name: "digest", handlers: {} },
];
""",
    "src/agents/names.ts": 'export const SORTER = "sorter";\nexport const READ_KIND = "doc.read" as const;\n',
    "src/agents/types.ts": "export interface AgentDefinition {\n  name: string;\n  agent?: string;\n  model(x: unknown): Promise<unknown>;\n}\n",
    "src/agents/shared.ts": 'export const retry = () => ({ agent: "sorter" });\n',
    "src/agents/ai.ts": 'import Anthropic from "@anthropic-ai/sdk";\nexport const summarize = () => new Anthropic();\n',
    "src/agents/gemini.ts": 'const URL = "https://us-central1-aiplatform.googleapis.com/v1";\nexport const g = () => fetch(URL);\n',
    "src/agents/sorter/pick.ts": 'export function pick() {\n  return { agent: "mail" };\n}\n',
    "src/agents/handlers/sorter.ts": """import type { AgentDefinition } from "../types";
import { SORTER } from "../names";
import { pick } from "../sorter/pick";
import { retry } from "../shared";

const DONE = "sort.done";
const cost = 2;

export const sorterAgent: AgentDefinition = {
  name: SORTER,
  label: "Sorter",
  description: `Sorts each file, about ${cost} a file.`,
  handlers: {
    "sort.one": async (ctx) => {
      const kind = await ctx.model({ prompt: "x" });
      await ctx.enqueue({ agent: "reader", kind: "doc.read" });
      await ctx.ask({ title: "Which client?" });
      return [kind, pick(), retry()];
    },
    [DONE]: done,
  },
};

async function done() {}
""",
    "src/agents/handlers/reader.ts": """import type { AgentDefinition } from "../types";
import { READ_KIND } from "../names";
import { summarize } from "../ai";
import { retry } from "../shared";

// agent: "mail" is only a comment here.
const tip = 'hand off with { agent: "mail" }';

export const readerAgent: AgentDefinition = {
  name: "reader",
  label: "Reader",
  handlers: { [READ_KIND]: run },
};

async function run() {
  return [summarize(), tip, retry()];
}
""",
    "src/desk/start.ts": 'import { SORTER } from "@/agents/names";\nexport const go = (db: any) => db.rpc("enqueue", { p_agent: SORTER });\n',
    "supabase/migrations/20260101000000_jobs.sql": """CREATE OR REPLACE FUNCTION public.weekly_mail()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.queue('mail', 'mail.read');
END $$;
REVOKE ALL ON FUNCTION public.weekly_mail() FROM PUBLIC;
DO $$ BEGIN PERFORM cron.schedule('nightly', '0 3 * * *', 'SELECT public.queue(''reader'', ''mail.read'')'); END $$;
DO $$ BEGIN PERFORM cron.schedule('weekly', '0 8 * * 1', 'SELECT public.weekly_mail()'); END $$;
DO $$ BEGIN PERFORM cron.schedule('sorter', '* * * * *', 'SELECT 1'); END $$;
""",
    "docs/specs/mail.md": "# Mail\n\nAdd `src/mail/read.ts`.\n",
}

SETTINGS = {
    "list": "src/agents/registry.ts",
    "hand_off_keys": ["agent", "p_agent"],
    "model_calls": ["model"],
    "asks_you_calls": ["ask"],
}


def line_of(path: str, needle: str) -> int:
    text = FILES[path]
    return text[: text.index(needle)].count("\n") + 1


class Fixture(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.repo = Path(tmp.name)
        for name, text in FILES.items():
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)

    def build(self, settings=SETTINGS):
        joined = system.build(TreeSource(self.repo), [], settings)
        nodes = {node["id"]: node for node in joined["nodes"]}
        edges = {(e["source"], e["kind"], e["target"]): e for e in joined["edges"]}
        return joined, nodes, edges

    def links(self, edges, kind):
        return {(source, target) for source, found, target in edges if found == kind}


class NoSettings(Fixture):
    def test_no_settings_finds_no_agents(self):
        for settings in (None, {}, {"list": ""}, {"model_calls": ["model"]}):
            joined, nodes, _ = self.build(settings)
            self.assertFalse([n for n in joined["nodes"] if n["kind"] == "agent"], settings)

    def test_modules_that_call_a_model_are_suggested(self):
        joined, _, _ = self.build(None)
        self.assertEqual(agents.suggestions(joined["nodes"], joined["edges"]), ["module:src/agents"])


class Listed(Fixture):
    def test_each_listed_object_is_an_agent(self):
        _, nodes, _ = self.build()
        found = sorted(n["id"] for n in nodes.values() if n["kind"] == "agent")
        self.assertEqual(found, ["agent:digest", "agent:mail", "agent:reader", "agent:sorter"])

    def test_an_agent_carries_its_label_description_jobs_and_evidence(self):
        _, nodes, _ = self.build()
        sorter = nodes["agent:sorter"]
        self.assertEqual(sorter["label"], "Sorter")
        self.assertEqual(sorter["description"], "Sorts each file, about … a file.")
        self.assertEqual(sorter["jobs"], ["sort.one", "sort.done"])
        self.assertEqual(sorter["evidence"], [f"src/agents/handlers/sorter.ts:{line_of('src/agents/handlers/sorter.ts', 'export const sorterAgent')}"])
        self.assertEqual(sorter["module"], "module:src/agents/handlers")
        self.assertEqual((sorter["layer"], sorter["source"]), ("facts", "list"))

    def test_a_job_key_can_be_a_constant_from_another_file(self):
        _, nodes, _ = self.build()
        self.assertEqual(nodes["agent:reader"]["jobs"], ["doc.read"])

    def test_an_agent_written_in_the_list_points_at_the_list(self):
        _, nodes, _ = self.build()
        mail = nodes["agent:mail"]
        line = line_of("src/agents/registry.ts", '{ name: "mail"')
        self.assertEqual(mail["evidence"], [f"src/agents/registry.ts:{line}"])
        self.assertEqual((mail["label"], mail["description"]), ("Mail", "Reads your email."))

    def test_a_missing_label_falls_back_to_the_name(self):
        _, nodes, _ = self.build()
        self.assertEqual((nodes["agent:digest"]["label"], nodes["agent:digest"]["description"]), ("digest", ""))

    def test_status_comes_from_jobs_then_plans(self):
        _, nodes, _ = self.build()
        status = {name: nodes[f"agent:{name}"]["status"] for name in ("sorter", "reader", "mail", "digest")}
        self.assertEqual(status, {"sorter": "built", "reader": "built", "mail": "planned", "digest": "empty"})

    def test_a_dated_spec_or_a_spec_titled_after_the_agent_makes_it_planned(self):
        (self.repo / "docs" / "specs" / "2026-11-10-digest.md").write_text("# Weekly\n")
        _, nodes, _ = self.build()
        self.assertEqual(nodes["agent:digest"]["status"], "planned")
        (self.repo / "docs" / "specs" / "2026-11-10-digest.md").unlink()
        (self.repo / "docs" / "specs" / "next.md").write_text("# Digest (agent)\n")
        _, nodes, _ = self.build()
        self.assertEqual(nodes["agent:digest"]["status"], "planned")

    def test_a_spec_that_only_shares_a_word_does_not(self):
        (self.repo / "docs" / "specs" / "digest-emails.md").write_text("# Digest emails\n")
        _, nodes, _ = self.build()
        self.assertEqual(nodes["agent:digest"]["status"], "empty")

    def test_a_list_file_that_is_not_there_finds_none(self):
        joined, _, _ = self.build({**SETTINGS, "list": "src/nope.ts"})
        self.assertFalse([n for n in joined["nodes"] if n["kind"] == "agent"])


class HandOffs(Fixture):
    def test_a_literal_name_and_one_in_a_direct_import_count(self):
        _, _, edges = self.build()
        self.assertEqual(self.links(edges, "hands_off_to"), {("agent:sorter", "agent:reader"), ("agent:sorter", "agent:mail")})

    def test_evidence_is_the_line_that_hands_off(self):
        _, _, edges = self.build()
        line = line_of("src/agents/handlers/sorter.ts", 'agent: "reader"')
        self.assertEqual(edges[("agent:sorter", "hands_off_to", "agent:reader")]["evidence"], [f"src/agents/handlers/sorter.ts:{line}"])

    def test_strings_comments_and_shared_files_do_not_count(self):
        _, _, edges = self.build()
        self.assertNotIn(("agent:reader", "hands_off_to", "agent:mail"), edges)
        self.assertNotIn(("agent:reader", "hands_off_to", "agent:sorter"), edges)

    def test_only_listed_names_count(self):
        _, _, edges = self.build({**SETTINGS, "list": "src/agents/registry.ts"})
        self.assertFalse([key for key in edges if key[1] == "hands_off_to" and not key[2].startswith("agent:")])


class Models(Fixture):
    def test_a_model_call_links_to_every_model_the_project_uses(self):
        _, _, edges = self.build()
        targets = {target for source, kind, target in edges if source == "agent:sorter" and kind == "uses_model"}
        self.assertEqual(targets, {"service:anthropic", "service:us-central1-aiplatform.googleapis.com"})
        line = line_of("src/agents/handlers/sorter.ts", "ctx.model(")
        self.assertIn(f"src/agents/handlers/sorter.ts:{line}", edges[("agent:sorter", "uses_model", "service:anthropic")]["evidence"])

    def test_an_import_that_reaches_a_model_links_to_that_one(self):
        _, _, edges = self.build()
        targets = {target for source, kind, target in edges if source == "agent:reader" and kind == "uses_model"}
        self.assertEqual(targets, {"service:anthropic"})
        self.assertEqual(edges[("agent:reader", "uses_model", "service:anthropic")]["evidence"], ["src/agents/ai.ts:1"])

    def test_an_agent_sharing_its_file_does_not_take_that_files_imports(self):
        _, _, edges = self.build()
        for name in ("mail", "digest"):
            self.assertFalse([key for key in edges if key[0] == f"agent:{name}" and key[1] == "uses_model"], name)

    def test_one_agent_written_in_the_list_does_not_take_the_lists_imports(self):
        registry = self.repo / "src" / "agents" / "registry.ts"
        registry.write_text(registry.read_text().replace('  { name: "digest", handlers: {} },\n', ""))
        _, nodes, edges = self.build()
        self.assertNotIn("agent:digest", nodes)
        self.assertFalse([key for key in edges if key[0] == "agent:mail" and key[1] == "uses_model"])
        self.assertIn(("agent:reader", "uses_model", "service:anthropic"), edges)

    def test_a_definition_of_the_name_is_not_a_call(self):
        _, _, edges = self.build({**SETTINGS, "model_calls": ["model", "done"]})
        line = line_of("src/agents/handlers/sorter.ts", "async function done")
        evidence = edges[("agent:sorter", "uses_model", "service:anthropic")]["evidence"]
        self.assertNotIn(f"src/agents/handlers/sorter.ts:{line}", evidence)

    def test_no_model_calls_set_means_imports_only(self):
        _, _, edges = self.build({**SETTINGS, "model_calls": []})
        self.assertNotIn(("agent:sorter", "uses_model", "service:anthropic"), edges)


class Calls(unittest.TestCase):
    """What counts as a call to a name, read straight from one file."""

    def lines(self, text: str) -> list[int]:
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "a.ts").write_text(text)
            files = agents._Files(TreeSource(Path(tmp)), {"a.ts"}, [])
            files.load(["a.ts"])
            return agents._calls(files, ["ask"], "a.ts", 0, len(text))

    def test_a_call_that_opens_a_block_or_follows_a_comma_counts(self):
        self.assertEqual(self.lines("if (unsure) {\n  ask({ title: 'x' })\n}\n"), [2])
        self.assertEqual(self.lines("then(() => { ask(x) })\n"), [1])
        self.assertEqual(self.lines("f(a, ask(x))\n"), [1])
        self.assertEqual(self.lines("const y = ready ? ask(x) : later\n"), [1])

    def test_a_definition_or_a_typed_signature_does_not(self):
        self.assertEqual(self.lines("interface Q {\n  ask(p: string): Promise<string>;\n  ask2(): void\n}\n"), [])
        self.assertEqual(self.lines("interface Q {\n  ask(p: string): Promise<string>\n}\n"), [])
        self.assertEqual(self.lines("const o = {\n  ask(p) {\n    return p\n  },\n}\n"), [])
        self.assertEqual(self.lines("async function ask(p) {}\n"), [])


class AsksYou(Fixture):
    def test_a_call_to_an_asks_you_name_marks_the_agent(self):
        _, nodes, _ = self.build()
        line = line_of("src/agents/handlers/sorter.ts", "ctx.ask(")
        self.assertEqual(nodes["agent:sorter"]["asks_you"], [f"src/agents/handlers/sorter.ts:{line}"])
        self.assertEqual(nodes["agent:reader"]["asks_you"], [])


class Starts(Fixture):
    def test_a_job_starts_the_agent_its_command_or_function_names(self):
        _, _, edges = self.build()
        jobs = {(s, t) for s, t in self.links(edges, "starts") if s.startswith("job:")}
        self.assertEqual(jobs, {("job:nightly", "agent:reader"), ("job:weekly", "agent:mail")})

    def test_a_job_named_like_an_agent_does_not_start_it(self):
        _, _, edges = self.build()
        self.assertNotIn(("job:sorter", "starts", "agent:sorter"), edges)

    def test_a_name_that_is_part_of_a_longer_string_does_not_count(self):
        _, _, edges = self.build()
        self.assertNotIn(("job:nightly", "starts", "agent:mail"), edges)

    def test_code_outside_the_agents_starts_one_when_it_hands_off(self):
        _, _, edges = self.build()
        modules = {(s, t) for s, t in self.links(edges, "starts") if s.startswith("module:")}
        self.assertEqual(modules, {("module:src/desk", "agent:sorter"), ("module:src/agents", "agent:sorter")})
        self.assertEqual(edges[("module:src/desk", "starts", "agent:sorter")]["evidence"], ["src/desk/start.ts:2"])


class Marked(Fixture):
    def test_a_marked_module_is_an_agent(self):
        _, nodes, _ = self.build({"modules": ["module:src/desk"], "hand_off_keys": ["p_agent"]})
        desk = nodes["agent:desk"]
        self.assertEqual((desk["status"], desk["source"], desk["evidence"]), ("built", "module", ["src/desk"]))

    def test_a_marked_module_hands_off_instead_of_starting(self):
        _, _, edges = self.build({**SETTINGS, "modules": ["module:src/desk"]})
        self.assertIn(("agent:desk", "hands_off_to", "agent:sorter"), edges)
        self.assertNotIn(("module:src/desk", "starts", "agent:sorter"), edges)

    def test_an_unknown_module_is_ignored(self):
        joined, _, _ = self.build({"modules": ["module:src/nope"]})
        self.assertFalse([n for n in joined["nodes"] if n["kind"] == "agent"])


class Rows(Fixture):
    def test_a_row_carries_its_links_both_ways(self):
        joined, _, _ = self.build()
        found = {row["name"]: row for row in agents.rows(joined)}
        self.assertEqual(list(found), ["sorter", "reader", "mail", "digest"])
        self.assertEqual({link["node"] for link in found["sorter"]["hands_off_to"]}, {"agent:reader", "agent:mail"})
        self.assertEqual([link["node"] for link in found["reader"]["handed_by"]], ["agent:sorter"])
        self.assertEqual([link["node"] for link in found["reader"]["starts"]], ["job:nightly"])
        self.assertEqual({link["node"] for link in found["sorter"]["starts"]}, {"module:src/agents", "module:src/desk"})

    def test_a_row_names_each_model_with_its_region(self):
        joined, _, _ = self.build()
        reader = next(row for row in agents.rows(joined) if row["name"] == "reader")
        self.assertEqual(reader["models"], [{"node": "service:anthropic", "name": "Anthropic", "region": None, "leaves": False, "evidence": "src/agents/ai.ts:1"}])
        self.assertEqual(reader["leaves_region"], [])


class Settings(unittest.TestCase):
    def test_defaults_fill_in(self):
        found = agents.settings_of({"list": "a.ts"})
        self.assertEqual((found["jobs_key"], found["hand_off_keys"], found["model_calls"]), ("handlers", ["agent"], []))

    def test_nothing_to_point_at_is_none(self):
        self.assertIsNone(agents.settings_of({"model_calls": ["x"]}))


if __name__ == "__main__":
    unittest.main()
