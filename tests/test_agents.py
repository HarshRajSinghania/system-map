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
    "src/agents/sorter/pick.ts": 'export function pick() {\n  return { agent: "mail" };\n}\nexport const later = { agent: "billing" };\n',
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

    def test_the_first_exported_list_that_holds_agents_is_read(self):
        registry = self.repo / "src" / "agents" / "registry.ts"
        registry.write_text('export const AGENT_NAMES = ["mail", "sorter"] as const;\n' + registry.read_text())
        _, nodes, _ = self.build()
        self.assertEqual(sorted(n for n in nodes if n.startswith("agent:")), ["agent:digest", "agent:mail", "agent:reader", "agent:sorter"])

    def test_a_list_can_be_the_default_export(self):
        registry = self.repo / "src" / "agents" / "registry.ts"
        registry.write_text(registry.read_text().replace("export const AGENTS: readonly AgentDefinition[] =", "export default"))
        _, nodes, _ = self.build()
        self.assertIn("agent:sorter", nodes)

    def test_a_job_key_that_cant_be_read_is_kept_as_written(self):
        reader = self.repo / "src" / "agents" / "handlers" / "reader.ts"
        reader.write_text(reader.read_text().replace("[READ_KIND]: run", "[READ_KIND]: run, [Kinds.Later]: run"))
        _, nodes, _ = self.build()
        self.assertEqual(nodes["agent:reader"]["jobs"], ["doc.read", "Kinds.Later"])

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
        # pick.ts hands off to "billing", which is not on the list.
        _, nodes, edges = self.build()
        self.assertNotIn("agent:billing", nodes)
        self.assertFalse([key for key in edges if key[2] == "agent:billing"])


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

    def test_an_agent_written_in_the_list_reaches_the_files_it_names(self):
        (self.repo / "src" / "agents" / "mail").mkdir()
        (self.repo / "src" / "agents" / "mail" / "read.ts").write_text('import { summarize } from "../ai";\nexport const readMail = () => summarize();\n')
        registry = self.repo / "src" / "agents" / "registry.ts"
        text = registry.read_text().replace('import { sorterAgent } from "./handlers/sorter";\n', 'import { sorterAgent } from "./handlers/sorter";\nimport { readMail } from "./mail/read";\n')
        registry.write_text(text.replace('description: "Reads your email.", handlers: {}', 'description: "Reads your email.", handlers: { "mail.read": readMail }'))
        _, nodes, edges = self.build({**SETTINGS, "model_calls": []})
        self.assertEqual(nodes["agent:mail"]["jobs"], ["mail.read"])
        self.assertEqual(edges[("agent:mail", "uses_model", "service:anthropic")]["evidence"], ["src/agents/ai.ts:1"])
        self.assertFalse([key for key in edges if key[0] == "agent:digest" and key[1] == "uses_model"])

    def test_a_helper_an_agent_in_the_list_shares_belongs_to_nobody(self):
        # mail, written in the list, names retry from shared.ts, which sorter and reader import too.
        registry = self.repo / "src" / "agents" / "registry.ts"
        text = registry.read_text().replace('import { sorterAgent } from "./handlers/sorter";\n', 'import { sorterAgent } from "./handlers/sorter";\nimport { retry } from "./shared";\n')
        registry.write_text(text.replace('description: "Reads your email.", handlers: {}', 'description: "Reads your email.", handlers: { "mail.retry": retry }'))
        _, _, edges = self.build()
        self.assertNotIn(("agent:mail", "hands_off_to", "agent:sorter"), edges)
        self.assertIn(("module:src/agents", "starts", "agent:sorter"), edges)

    def mail_uses(self, handlers: str, imports: str, extra: dict[str, str]) -> dict:
        """Build with mail, written in the list, given these handlers, imports and files."""
        for name, text in extra.items():
            path = self.repo / "src" / "agents" / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        registry = self.repo / "src" / "agents" / "registry.ts"
        text = imports + registry.read_text()
        registry.write_text(text.replace('description: "Reads your email.", handlers: {}', f'description: "Reads your email.", handlers: {handlers}'))
        return self.build({**SETTINGS, "model_calls": []})[2]

    # talk.ts uses a model, and no agent but mail could claim it.
    TALK = {"talk.ts": 'import Anthropic from "@anthropic-ai/sdk";\nexport const talk = () => new Anthropic();\n'}

    def test_a_key_named_like_an_import_does_not_pull_it_in(self):
        edges = self.mail_uses("{}", 'import { talk as description } from "./talk";\n', self.TALK)
        self.assertNotIn(("agent:mail", "uses_model", "service:anthropic"), edges)

    def test_a_member_named_like_an_import_does_not_pull_it_in(self):
        edges = self.mail_uses('{ "mail.x": (ctx) => ctx.talk() }', 'import { talk } from "./talk";\n', self.TALK)
        self.assertNotIn(("agent:mail", "uses_model", "service:anthropic"), edges)

    def test_a_name_used_as_a_value_pulls_it_in(self):
        edges = self.mail_uses('{ "mail.x": talk }', 'import { talk } from "./talk";\n', self.TALK)
        self.assertEqual(edges[("agent:mail", "uses_model", "service:anthropic")]["evidence"], ["src/agents/talk.ts:1"])

    def test_a_spread_and_either_branch_of_a_choice_count(self):
        hand = 'export const {name} = {{ x: () => ({{ agent: "reader" }}) }};\n'
        for handlers, imports, name in (
            ("{ ...mailHandlers }", 'import { mailHandlers } from "./mail/all";\n', "mailHandlers"),
            ('{ "mail.x": QUICK ? fast : slow }', 'import { fast } from "./mail/all";\nconst QUICK = true;\nconst slow = 1;\n', "fast"),
            ('{ "mail.x": QUICK ? slow : fast }', 'import { fast } from "./mail/all";\nconst QUICK = true;\nconst slow = 1;\n', "fast"),
        ):
            with self.subTest(handlers=handlers):
                self.setUp()
                edges = self.mail_uses(handlers, imports, {"mail/all.ts": hand.format(name=name)})
                self.assertIn(("agent:mail", "hands_off_to", "agent:reader"), edges)

    def test_an_import_a_file_of_several_agents_uses_through_its_own_code_is_shared(self):
        # pair.ts holds alpha and beta, which both run `run`, which calls help from helper.ts.
        # sorter.ts imports helper.ts too, so helper.ts belongs to no one.
        handlers = self.repo / "src" / "agents" / "handlers"
        (self.repo / "src" / "agents" / "helper.ts").write_text('export const help = () => ({ agent: "mail" });\n')
        (handlers / "pair.ts").write_text(
            'import { help } from "../helper";\n'
            "const run = (ctx) => help(ctx);\n"
            'export const alphaAgent = { name: "alpha", handlers: { x: run } };\n'
            'export const betaAgent = { name: "beta", handlers: { y: run } };\n'
        )
        sorter = handlers / "sorter.ts"
        sorter.write_text('import { help } from "../helper";\n' + sorter.read_text())
        registry = self.repo / "src" / "agents" / "registry.ts"
        text = registry.read_text().replace("  readerAgent,\n", "  readerAgent,\n  alphaAgent,\n  betaAgent,\n")
        registry.write_text('import { alphaAgent, betaAgent } from "./handlers/pair";\n' + text)
        _, nodes, edges = self.build()
        self.assertIn("agent:alpha", nodes)
        # sorter hands off to mail through pick.ts anyway; helper.ts must not be its evidence.
        self.assertNotIn("src/agents/helper.ts:1", edges[("agent:sorter", "hands_off_to", "agent:mail")]["evidence"])
        self.assertEqual(edges[("module:src/agents", "starts", "agent:mail")]["evidence"], ["src/agents/helper.ts:1"])

    def test_the_walk_stops_at_the_list(self):
        # mail's handler imports the list, which imports a model helper no agent names.
        (self.repo / "src" / "agents" / "mail").mkdir()
        (self.repo / "src" / "agents" / "mail" / "read.ts").write_text('import { AGENTS } from "../registry";\nexport const readMail = () => AGENTS;\n')
        registry = self.repo / "src" / "agents" / "registry.ts"
        text = 'import { summarize } from "./ai";\nimport { readMail } from "./mail/read";\n' + registry.read_text()
        text = text.replace('  { name: "digest", handlers: {} },\n', "")  # Alone in the list, so no other agent's file is the list.
        registry.write_text(text.replace('description: "Reads your email.", handlers: {}', 'description: "Reads your email.", handlers: { "mail.read": readMail }'))
        _, _, edges = self.build({**SETTINGS, "model_calls": []})
        self.assertFalse([key for key in edges if key[0] == "agent:mail" and key[1] == "uses_model"])

    def test_the_walk_stops_at_another_agents_file(self):
        # sorter.ts imports reader.ts, whose model is reader's, not sorter's.
        sorter = self.repo / "src" / "agents" / "handlers" / "sorter.ts"
        sorter.write_text('import { readerAgent } from "./reader";\n' + sorter.read_text())
        _, _, edges = self.build({**SETTINGS, "model_calls": []})
        self.assertIn(("agent:reader", "uses_model", "service:anthropic"), edges)
        self.assertNotIn(("agent:sorter", "uses_model", "service:anthropic"), edges)

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

    def test_a_call_in_either_branch_of_a_choice_counts(self):
        self.assertEqual(self.lines("const y = ready ? ask(x) : later\n"), [1])
        self.assertEqual(self.lines("unsure ? await ctx.ask({ q: 1 }) : null;\n"), [1])
        self.assertEqual(self.lines("unsure ? ctx.ask(x) : fallback\n"), [1])
        self.assertEqual(self.lines("const y = unsure\n  ? await ctx.ask(x)\n  : auto\n"), [2])
        self.assertEqual(self.lines("const y = sure ? auto : ctx.ask(x);\n"), [1])
        self.assertEqual(self.lines("const y = cond ?\n  ask(x)\n  : fallback\n"), [2])
        self.assertEqual(self.lines("const y = a ?\n  b ? c :\n  ask(x)\n  : d\n"), [3])

    def test_a_definition_or_a_typed_signature_does_not(self):
        self.assertEqual(self.lines("interface Q {\n  ask(p: string): Promise<string>;\n  ask2(): void\n}\n"), [])
        self.assertEqual(self.lines("interface Q {\n  ask(p: string): Promise<string>\n}\n"), [])
        self.assertEqual(self.lines("interface Q {\n  other(): void; ask(p: string): Promise<string>;\n}\n"), [])
        self.assertEqual(self.lines("type Ctx = { ask(q: string): Promise<string> }\n"), [])
        self.assertEqual(self.lines("type Ctx = { ask(q: string): string, other(): void }\n"), [])
        self.assertEqual(self.lines("const o = {\n  ask(p) {\n    return p\n  },\n}\n"), [])
        self.assertEqual(self.lines("async function ask(p) {}\n"), [])
        self.assertEqual(self.lines("interface Q {\n  other(): Promise<string>\n  ask(p: string): Promise<string>\n}\n"), [])

    def test_abstract_override_and_generator_members_are_not_calls(self):
        self.assertEqual(self.lines("abstract class A {\n  abstract ask(q: string): Promise<string>;\n}\n"), [])
        self.assertEqual(self.lines("class B extends A {\n  override ask(q: string): Promise<string> {\n    return q\n  }\n}\n"), [])
        self.assertEqual(self.lines("class C {\n  *ask(q: string): Generator<string> {\n    yield q\n  }\n}\n"), [])
        for word in ("async", "static", "private"):
            self.assertEqual(self.lines(f"class C {{\n  {word} *ask(q: string): AsyncGenerator<string> {{\n    yield q\n  }}\n}}\n"), [], word)
        self.assertEqual(self.lines("const n = x * ask(y)\n"), [1])
        self.assertEqual(self.lines("function* g() {\n  yield* ask(y)\n}\n"), [2])


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


CALLS = {**SETTINGS, "hand_off_calls": ["queueAgent"]}
#: Code that starts agents by a call that names one as its first argument.
CALL_FILES = {
    "src/web/queue.ts": 'export const READER = "reader";\nexport function queueAgent(name: string, id: string) {}\n',
    "src/web/route.ts": """import { queueAgent, READER } from "./queue";

const MAIL = "mail";

export async function post(id: string, jobs: any) {
  await queueAgent("sorter", id);
  await jobs.queueAgent(READER, id);
  queueAgent(MAIL, id);
  queueAgent(`digest-${id}`, id);
  queueAgent(id, "digest");
  queueAgent("billing", id);
  // queueAgent("digest", id)
  const tip = 'queueAgent("digest", id)';
  return tip;
}
""",
    "src/web/route.test.ts": 'import { queueAgent } from "./queue";\nqueueAgent("digest", "1");\n',
}


class HandOffCalls(Fixture):
    """An agent started by a call that names it as the first argument."""

    def setUp(self):
        super().setUp()
        for name, text in CALL_FILES.items():
            (self.repo / name).parent.mkdir(parents=True, exist_ok=True)
            (self.repo / name).write_text(text)
        reader = self.repo / "src/agents/handlers/reader.ts"
        reader.write_text(FILES["src/agents/handlers/reader.ts"].replace("  return [summarize()", '  queueAgent("digest", "x");\n  return [summarize()'))

    def call_line(self, needle: str) -> str:
        text = CALL_FILES["src/web/route.ts"]
        return f"src/web/route.ts:{text[: text.index(needle)].count(chr(10)) + 1}"

    def test_a_call_outside_the_agents_starts_the_agent_it_names(self):
        _, _, edges = self.build(CALLS)
        web = {target for source, target in self.links(edges, "starts") if source == "module:src/web"}
        self.assertEqual(web, {"agent:sorter", "agent:reader", "agent:mail"})
        self.assertEqual(edges[("module:src/web", "starts", "agent:sorter")]["evidence"], [self.call_line('queueAgent("sorter"')])

    def test_a_call_inside_an_agent_hands_off(self):
        _, _, edges = self.build(CALLS)
        self.assertIn(("agent:reader", "hands_off_to", "agent:digest"), edges)
        line = (FILES["src/agents/handlers/reader.ts"][: FILES["src/agents/handlers/reader.ts"].index("  return [summarize()")]).count("\n") + 1
        self.assertEqual(edges[("agent:reader", "hands_off_to", "agent:digest")]["evidence"], [f"src/agents/handlers/reader.ts:{line}"])

    def test_a_constant_counts_and_a_template_a_variable_or_another_name_does_not(self):
        _, _, edges = self.build(CALLS)
        self.assertEqual(edges[("module:src/web", "starts", "agent:reader")]["evidence"], [self.call_line("jobs.queueAgent(READER")])
        self.assertEqual(edges[("module:src/web", "starts", "agent:mail")]["evidence"], [self.call_line("queueAgent(MAIL")])
        self.assertNotIn(("module:src/web", "starts", "agent:digest"), edges)
        self.assertFalse([key for key in edges if key[2] == "agent:billing"])

    def test_a_definition_a_comment_a_string_and_a_test_add_nothing(self):
        _, _, edges = self.build(CALLS)
        self.assertNotIn(("module:src/web", "starts", "agent:digest"), edges)
        self.assertFalse([key for key in edges if key[0] == "module:src/web" and key[2] == "agent:digest"])

    def test_with_no_hand_off_calls_nothing_changes(self):
        _, _, before = self.build(SETTINGS)
        _, _, empty = self.build({**SETTINGS, "hand_off_calls": []})
        self.assertEqual(before, empty)
        self.assertFalse([key for key in before if key[0] == "module:src/web"])
        self.assertNotIn(("agent:reader", "hands_off_to", "agent:digest"), before)

    def test_only_the_first_argument_names_the_agent(self):
        sites = files_of(self.repo, {"a.ts": 'queueAgent(id, "reader", "mail")\nqueueAgent()\n'})
        sites.load(["a.ts"])
        found = agents._hand_offs(sites, {**agents.DEFAULTS, **CALLS}, {"reader", "mail"}, "a.ts", 0, len(sites.cache["a.ts"][0]))
        self.assertEqual(found, [])


class Marked(Fixture):
    def test_a_marked_module_is_an_agent(self):
        _, nodes, _ = self.build({"modules": ["module:src/desk"], "hand_off_keys": ["p_agent"]})
        desk = nodes["agent:desk"]
        self.assertEqual((desk["status"], desk["source"], desk["evidence"]), ("built", "module", ["src/desk"]))

    def test_a_marked_module_hands_off_instead_of_starting(self):
        _, _, edges = self.build({**SETTINGS, "modules": ["module:src/desk"]})
        self.assertIn(("agent:desk", "hands_off_to", "agent:sorter"), edges)
        self.assertNotIn(("module:src/desk", "starts", "agent:sorter"), edges)

    def test_two_marked_modules_with_one_name_make_one_agent(self):
        for name in ("src/a/mail/x.ts", "src/b/mail/y.ts"):
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("export const x = 1\n")
        joined, _, _ = self.build({"modules": ["module:src/a/mail", "module:src/b/mail"]})
        found = [n for n in joined["nodes"] if n["kind"] == "agent"]
        self.assertEqual([(n["id"], n["path"]) for n in found], [("agent:mail", "src/a/mail")])

    def test_an_unknown_module_is_ignored(self):
        joined, _, _ = self.build({"modules": ["module:src/nope"]})
        self.assertFalse([n for n in joined["nodes"] if n["kind"] == "agent"])


def files_of(root: Path, texts: dict[str, str]) -> "agents._Files":
    for name, text in texts.items():
        (root / name).parent.mkdir(parents=True, exist_ok=True)
        (root / name).write_text(text)
    return agents._Files(TreeSource(root), set(texts), [])


class Reading(unittest.TestCase):
    """Small parts of the reader, each on its own files."""

    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)

    def test_a_constant_is_followed_through_re_exports(self):
        files = files_of(
            self.root,
            {
                "a.ts": 'export const A = "x"\n',
                "b.ts": 'export * from "./a"\n',
                "c.ts": 'export { A as B } from "./a"\n',
                "d.ts": 'import { A } from "./b"\nimport { B } from "./c"\n',
            },
        )
        self.assertEqual((files.const("A", "d.ts"), files.const("B", "d.ts")), ("x", "x"))
        self.assertIsNone(files.const("C", "d.ts"))

    def test_the_newest_definition_of_a_sql_function_wins(self):
        bodies = agents._sql_functions(
            {
                "supabase/migrations/002_b.sql": "CREATE OR REPLACE FUNCTION public.f() RETURNS void AS $$ SELECT 'new' $$;",
                "supabase/migrations/001_a.sql": "CREATE FUNCTION public.f() RETURNS void AS $$ SELECT 'old' $$;",
                "supabase/setup.sql": "CREATE FUNCTION f() RETURNS void AS $body$ SELECT 'setup' $body$;",
            }
        )
        self.assertEqual(bodies["f"].strip(), "SELECT 'new'")

    def test_a_cron_command_ends_at_its_own_bracket(self):
        text = "SELECT cron.schedule('a', '* * * * *', 'SELECT q(''x'')'); SELECT 2;"
        start = text.index("'* * * * *'") + len("'* * * * *'")
        self.assertEqual(system.cron_command(text, start), ", 'SELECT q(''x'')'")
        open_ended = "SELECT cron.schedule('a', '* * * * *', 'SELECT q(" + "x" * 500
        self.assertEqual(len(system.cron_command(open_ended, start)), 400)

    def test_a_job_scheduled_again_is_all_the_newest_migration(self):
        files = {
            "supabase/migrations/001_a.sql": "SELECT cron.schedule('nightly', '0 1 * * *', 'SELECT q(''reader'', ''/api/old'')');",
            "supabase/migrations/005_b.sql": "SELECT cron.schedule('nightly', '0 5 * * *', 'SELECT q(''mail'', ''/api/new'')');",
            "supabase/setup.sql": "SELECT cron.schedule('nightly', '0 9 * * *', 'SELECT q(''setup'')');",
        }
        for name, text in files.items():
            (self.root / name).parent.mkdir(parents=True, exist_ok=True)
            (self.root / name).write_text(text)
        nodes, edges, commands = system.job_nodes(TreeSource(self.root))
        self.assertIn("'mail'", commands["job:nightly"])
        self.assertNotIn("'reader'", commands["job:nightly"])
        self.assertEqual((nodes[0]["schedule"], nodes[0]["evidence"]), ("0 5 * * *", ["supabase/migrations/005_b.sql:1"]))
        self.assertEqual([edge["target"] for edge in edges], ["route:/api/new"])

    def test_a_migrations_folder_at_the_top_of_the_repo_counts_too(self):
        files = {
            "migrations/001_a.sql": "SELECT cron.schedule('nightly', '0 1 * * *', 'SELECT q(''reader'')');\nCREATE FUNCTION f() RETURNS void AS $$ SELECT 'old' $$;",
            "migrations/005_b.sql": "SELECT cron.schedule('nightly', '0 5 * * *', 'SELECT q(''mail'')');\nCREATE OR REPLACE FUNCTION f() RETURNS void AS $$ SELECT 'new' $$;",
            # Sorts after `migrations/` by name, so only the migration check keeps it from winning.
            "supabase/setup.sql": "CREATE FUNCTION f() RETURNS void AS $$ SELECT 'setup' $$;",
        }
        for name, text in files.items():
            (self.root / name).parent.mkdir(parents=True, exist_ok=True)
            (self.root / name).write_text(text)
        nodes, _, commands = system.job_nodes(TreeSource(self.root))
        self.assertEqual((nodes[0]["schedule"], nodes[0]["evidence"]), ("0 5 * * *", ["migrations/005_b.sql:1"]))
        self.assertIn("'mail'", commands["job:nightly"])
        self.assertEqual(agents._sql_functions(system.sql_files(TreeSource(self.root)))["f"].strip(), "SELECT 'new'")


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
        self.assertEqual((found["jobs_key"], found["hand_off_keys"], found["hand_off_calls"], found["model_calls"]), ("handlers", ["agent"], [], []))

    def test_nothing_to_point_at_is_none(self):
        self.assertIsNone(agents.settings_of({"model_calls": ["x"]}))


if __name__ == "__main__":
    unittest.main()
