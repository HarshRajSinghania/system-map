import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.extractors import typescript as ts  # noqa: E402
from core.sources import TreeSource  # noqa: E402


def specs(code: str) -> list[str]:
    return [name for name, _ in ts.import_specifiers(ts.mask_code(code))]


class Masking(unittest.TestCase):
    def test_comments_are_blanked_and_offsets_kept(self):
        code = "a // b\n/* c\nd */ e"
        masked = ts.mask_code(code)
        self.assertEqual(len(masked), len(code))
        self.assertEqual(masked.count("\n"), code.count("\n"))
        self.assertNotIn("b", masked)
        self.assertNotIn("d", masked)

    def test_a_url_in_a_string_is_not_a_comment(self):
        self.assertIn("https://x.io", ts.mask_code('const a = "https://x.io"'))

    def test_a_stray_quote_cannot_swallow_the_next_line(self):
        self.assertEqual(specs("const r = /['\"]/\nimport a from './a'"), ["./a"])

    def test_a_comment_marker_inside_a_template_hole_is_read(self):
        self.assertEqual(specs("const t = `x ${y} z`\n// import a from './a'\nimport b from './b'"), ["./b"])


class Imports(unittest.TestCase):
    def test_every_form(self):
        code = """
import a from './a'
import { b } from "./b"
import c, { d } from './c'
import * as e from './e'
import type { F } from './f'
import './g.css'
import {
  h,
  i,
} from './h'
export { j } from './j'
export * from './k'
export * as l from './l'
export type { M } from './m'
const n = () => import('./n')
const o = require('./o')
"""
        self.assertEqual(
            sorted(specs(code)),
            sorted(["./a", "./b", "./c", "./e", "./f", "./g.css", "./h", "./j", "./k", "./l", "./m", "./n", "./o"]),
        )

    def test_commented_imports_do_not_count(self):
        self.assertEqual(specs("// import a from './a'\n/* import b from './b' */"), [])

    def test_a_plain_export_has_no_source(self):
        self.assertEqual(specs("export const a = 1\nexport function b() {}\nexport default c"), [])

    def test_a_dynamic_import_built_at_runtime_is_left_out(self):
        self.assertEqual(specs("import(`./${name}`)"), [])

    def test_the_line_is_recorded(self):
        self.assertEqual(ts.import_specifiers(ts.mask_code("\n\nimport a from './a'")), [("./a", 3)])


class Resolving(unittest.TestCase):
    files = {"src/a.ts", "src/b/index.tsx", "src/c.tsx", "src/lib/d.ts", "src/e.json"}
    aliases = [("@/*", "src/*")]

    def check(self, specifier, importer="src/a.ts"):
        return ts.resolve(specifier, importer, self.files, self.aliases)

    def test_relative(self):
        self.assertEqual(self.check("./c"), "src/c.tsx")

    def test_a_folder_finds_its_index(self):
        self.assertEqual(self.check("./b"), "src/b/index.tsx")

    def test_the_parent_folder(self):
        self.assertEqual(self.check("../a", "src/lib/d.ts"), "src/a.ts")

    def test_an_alias(self):
        self.assertEqual(self.check("@/lib/d"), "src/lib/d.ts")

    def test_a_js_suffix_finds_the_ts_file(self):
        self.assertEqual(self.check("./c.js"), "src/c.tsx")

    def test_a_query_is_dropped(self):
        self.assertEqual(self.check("./e.json?raw"), "src/e.json")

    def test_a_package_is_not_a_file(self):
        self.assertIsNone(self.check("react"))

    def test_tsconfig_with_comments(self):
        text = '{\n // note\n "compilerOptions": {"paths": {"@/*": ["./src/*"]},},\n}'
        self.assertEqual(ts.read_tsconfig_paths(text), [("@/*", "src/*")])

    def test_package_names(self):
        self.assertEqual(ts.package_of("@a/b/c"), "@a/b")
        self.assertEqual(ts.package_of("lodash/get"), "lodash")
        self.assertIsNone(ts.package_of("./a"))


class Tables(unittest.TestCase):
    def uses(self, code):
        return [(u["table"], u["access"]) for u in ts.table_uses(ts.mask_code(code))]

    def test_read_and_write(self):
        self.assertEqual(self.uses('db.from("a").select("*")'), [("a", "read")])
        self.assertEqual(self.uses('db.from("a").insert({})'), [("a", "write")])
        self.assertEqual(self.uses('db.from("a").delete().eq("x", 1)'), [("a", "write")])

    def test_a_chain_on_new_lines(self):
        self.assertEqual(self.uses('db\n  .from("a")\n  .update({})'), [("a", "write")])

    def test_storage_is_not_a_table(self):
        self.assertEqual(self.uses('db.storage.from("bucket").upload(x)'), [])
        self.assertEqual(self.uses('db.storage\n  .from("bucket").upload(x)'), [])


class Services(unittest.TestCase):
    def test_packages(self):
        self.assertEqual(ts.service_for_package("@anthropic-ai/sdk"), "Anthropic")
        self.assertEqual(ts.service_for_package("@aws-sdk/client-s3"), "AWS")
        self.assertIsNone(ts.service_for_package("react"))

    def test_a_called_url_is_a_service(self):
        self.assertEqual(ts.url_hosts('export const API = "https://api.acme.io/v1"'), [("api.acme.io", 1)])
        self.assertEqual(ts.url_hosts('await fetch("https://api.acme.io/x")'), [("api.acme.io", 1)])

    def test_a_host_built_at_runtime_keeps_its_stable_end(self):
        self.assertEqual(ts.url_hosts('return `https://${loc}-ai.googleapis.com/v1`'), [("ai.googleapis.com", 1)])

    def test_links_are_not_services(self):
        self.assertEqual(ts.url_hosts('<a href="https://acme.io">x</a>'), [])
        self.assertEqual(ts.url_hosts('const text = "see https://acme.io for more"'), [])
        self.assertEqual(ts.url_hosts('const u = "https://example.com/a"'), [])


class Routes(unittest.TestCase):
    def path(self, name):
        return ts.route_path(f"src/routes/{name}", "src/routes/")

    def test_flat_names(self):
        cases = {
            "index.tsx": "/",
            "privacy.tsx": "/privacy",
            "api.agent-worker.ts": "/api/agent-worker",
            "_auth.desk.tsx": "/desk",
            "_auth.clients.$id.index.tsx": "/clients/$id",
            "_auth.quote-sets.$id_.edit.tsx": "/quote-sets/$id/edit",
            "_auth.quote-sets.$id.[client].tsx": "/quote-sets/$id/client",
            "auth_.reset.tsx": "/auth/reset",
            "_auth.tsx": "/",
        }
        for name, expected in cases.items():
            self.assertEqual(self.path(name), expected, name)

    def test_the_root_is_not_a_route(self):
        self.assertIsNone(self.path("__root.tsx"))

    def test_folders_work_like_dots(self):
        self.assertEqual(self.path("settings/profile.tsx"), "/settings/profile")


class Modules(unittest.TestCase):
    def test_levels(self):
        self.assertEqual(ts.module_of("src/agents/inbox/a.ts", "src/"), ("src/agents", "src/agents/inbox"))
        self.assertEqual(ts.module_of("src/agents/inbox/deep/a.ts", "src/"), ("src/agents", "src/agents/inbox"))
        self.assertEqual(ts.module_of("src/agents/a.ts", "src/"), ("src/agents", "src/agents"))
        self.assertEqual(ts.module_of("src/a.ts", "src/"), ("src", "src"))

    def test_no_code_root(self):
        self.assertEqual(ts.module_of("lib/x/a.ts", ""), ("lib", "lib/x"))
        self.assertEqual(ts.module_of("a.ts", ""), (".", "."))


class Scan(unittest.TestCase):
    def project(self, files):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        root = Path(tmp.name)
        for name, text in files.items():
            path = root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        return ts.scan(TreeSource(root), {"users"})

    def test_links_join_modules_tables_and_services(self):
        project = self.project(
            {
                "src/a/b/one.ts": 'import x from "../../c/two"\nimport { A } from "@anthropic-ai/sdk"\ndb.from("users").insert({})',
                "src/c/two.ts": "export const x = 1",
            }
        )
        edges = {(k[0], k[1], k[2]) for k in project.edges}
        self.assertIn(("module:src/a/b", "module:src/c", "imports"), edges)
        self.assertIn(("module:src/a/b", "service:anthropic", "uses_service"), edges)
        self.assertIn(("module:src/a/b", "table:public.users", "uses_table"), edges)

    def test_tests_count_but_do_not_link(self):
        project = self.project(
            {"src/a/one.ts": "export const x = 1", "src/a/one.test.ts": 'import { x } from "../b/two"', "src/b/two.ts": "export const y = 1"}
        )
        self.assertEqual(project.nodes["module:src/a"]["test_files"], 1)
        self.assertEqual(project.nodes["module:src/a"]["files"], 1)
        self.assertEqual(project.edges, {})

    def test_a_table_the_model_lacks_makes_no_link(self):
        project = self.project({"src/a/one.ts": 'db.from("ghosts").select()'})
        self.assertEqual(project.edges, {})

    def test_a_route_links_to_what_it_renders(self):
        project = self.project(
            {
                "src/routes/desk.tsx": 'import { Desk } from "../screens/desk/Desk"',
                "src/screens/desk/Desk.tsx": "export const Desk = 1",
            }
        )
        self.assertEqual(project.nodes["route:/desk"]["route_kind"], "page")
        self.assertIn(("route:/desk", "module:src/screens/desk", "renders"), project.edges)


if __name__ == "__main__":
    unittest.main()
