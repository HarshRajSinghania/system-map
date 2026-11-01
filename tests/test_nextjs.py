"""Read a Next.js project: its imports, routes, and the SQL in its code."""
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core.extractors import typescript  # noqa: E402
from core.sources import open_source  # noqa: E402


class Project(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)

    def write(self, *files: str, text: str = "export const x = 1\n") -> None:
        for name in files:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)

    def scan(self, tables=frozenset(), schema="public"):
        return typescript.scan(open_source(self.root), set(tables), schema)

    def routes(self):
        return sorted(self.scan().routes)

    def next_app(self, config='{"dependencies": {"next": "16.0.0"}}'):
        self.write("package.json", text=config)


class RootAlias(Project):
    TSCONFIG = '{"compilerOptions": {"paths": {"@/*": ["./*"]}}}'

    def test_an_alias_to_the_repo_root_resolves(self):
        self.write("tsconfig.json", text=self.TSCONFIG)
        self.write("lib/db.ts")
        self.write("app/page.tsx", text='import { x } from "@/lib/db"\n')
        project = self.scan()
        self.assertEqual(project.imports["app/page.tsx"], {"lib/db.ts"})
        self.assertIn(("module:app", "module:lib", "imports"), project.edges)

    def test_an_alias_into_src_still_resolves(self):
        self.write("tsconfig.json", text='{"compilerOptions": {"paths": {"@/*": ["./src/*"]}}}')
        self.write("src/lib/db.ts")
        self.write("src/app/page.tsx", text='import { x } from "@/lib/db"\n')
        self.assertEqual(self.scan().imports["src/app/page.tsx"], {"src/lib/db.ts"})

    def test_a_jsconfig_counts_too(self):
        self.write("jsconfig.json", text=self.TSCONFIG)
        self.write("lib/db.js")
        self.write("app/page.jsx", text='import { x } from "@/lib/db"\n')
        self.assertEqual(self.scan().imports["app/page.jsx"], {"lib/db.js"})

    def test_a_tsconfig_with_comments_works(self):
        self.write("tsconfig.json", text='{\n  // note\n  "compilerOptions": {"paths": {"@/*": ["./*"],},},\n}\n')
        self.write("lib/db.ts")
        self.write("app/page.tsx", text='import { x } from "@/lib/db"\n')
        self.assertEqual(self.scan().imports["app/page.tsx"], {"lib/db.ts"})


class CodeRoot(Project):
    def test_all_code_in_src_makes_src_the_root(self):
        self.write("src/lib/a.ts", "src/app/page.tsx")
        self.assertEqual(self.scan().code_root, "src/")

    def test_code_beside_src_is_not_lost(self):
        self.write("src/util/a.ts", "app/page.tsx", "lib/b.ts")
        project = self.scan()
        self.assertEqual(project.code_root, "")
        self.assertIn("module:lib", project.nodes)

    def test_files_at_the_top_are_named_for_people(self):
        self.write("middleware.ts", "app/page.tsx")
        self.assertEqual(self.scan().nodes["module:."]["name"], "root files")


class AppRouter(Project):
    def test_pages_and_handlers_become_routes(self):
        self.next_app()
        self.write("app/page.tsx", "app/host/page.tsx", "app/host/inbox/page.tsx", "app/api/quote/route.ts", "app/listings/[slug]/page.tsx")
        self.assertEqual(self.routes(), ["/", "/api/quote", "/host", "/host/inbox", "/listings/[slug]"])

    def test_src_app_works_too(self):
        self.next_app()
        self.write("src/app/page.tsx", "src/app/about/page.tsx")
        self.assertEqual(self.routes(), ["/", "/about"])

    def test_other_files_in_a_route_folder_are_not_routes(self):
        self.next_app()
        self.write("app/layout.tsx", "app/error.tsx", "app/loading.tsx", "app/not-found.tsx", "app/template.tsx", "app/default.tsx")
        self.write("app/listings/[slug]/BookingWidget.tsx", "app/listings/[slug]/actions.ts", "app/icon.svg", "app/sitemap.ts", "app/robots.ts")
        self.assertEqual(self.routes(), [])

    def test_route_groups_leave_the_url(self):
        self.next_app()
        self.write("app/(marketing)/about/page.tsx", "app/(shop)/(cart)/cart/page.tsx", "app/(home)/page.tsx")
        self.assertEqual(self.routes(), ["/", "/about", "/cart"])

    def test_catch_all_routes_keep_their_form(self):
        self.next_app()
        self.write("app/docs/[...slug]/page.tsx", "app/shop/[[...slug]]/page.tsx")
        self.assertEqual(self.routes(), ["/docs/[...slug]", "/shop/[[...slug]]"])

    def test_parallel_slots_leave_the_url(self):
        self.next_app()
        self.write("app/dash/page.tsx", "app/dash/@team/page.tsx", "app/dash/@team/members/page.tsx", "app/dash/@team/default.tsx")
        self.assertEqual(self.routes(), ["/dash", "/dash/members"])

    def test_private_folders_are_not_routes(self):
        self.next_app()
        self.write("app/_parts/page.tsx", "app/about/_notes/page.tsx", "app/about/page.tsx")
        self.assertEqual(self.routes(), ["/about"])

    def test_intercepting_routes_are_not_their_own_url(self):
        self.next_app()
        self.write("app/feed/page.tsx", "app/feed/(..)photo/[id]/page.tsx", "app/photo/[id]/page.tsx")
        self.assertEqual(self.routes(), ["/feed", "/photo/[id]"])

    def test_an_escaped_underscore_is_part_of_the_url(self):
        self.next_app()
        self.write("app/%5Fhealth/page.tsx")
        self.assertEqual(self.routes(), ["/_health"])

    def test_a_handler_is_an_api_route_wherever_it_sits(self):
        self.next_app()
        self.write("app/feed.xml/route.ts", "app/about/page.tsx")
        project = self.scan()
        self.assertEqual(project.routes["/feed.xml"]["route_kind"], "api")
        self.assertEqual(project.routes["/about"]["route_kind"], "page")

    def test_a_page_links_to_what_it_imports_outside_the_routes_folder(self):
        self.next_app()
        self.write("tsconfig.json", text=RootAlias.TSCONFIG)
        self.write("lib/db.ts")
        self.write("app/page.tsx", text='import { x } from "@/lib/db"\n')
        self.assertIn(("route:/", "module:lib", "renders"), self.scan().edges)

    def test_the_routes_folder_is_recorded(self):
        self.next_app()
        self.write("src/app/page.tsx")
        self.assertEqual(self.scan().routes_dir, "src/app")

    def test_an_app_folder_without_next_is_not_next(self):
        self.write("package.json", text='{"dependencies": {"express": "5.0.0"}}')
        self.write("app/page.tsx", "app/about/page.tsx")
        self.assertEqual(self.routes(), [])

    def test_a_next_config_is_enough_to_tell(self):
        self.write("next.config.ts", "app/page.tsx")
        self.assertEqual(self.routes(), ["/"])


class PagesRouter(Project):
    def test_pages_become_routes(self):
        self.next_app()
        self.write("pages/index.tsx", "pages/about.tsx", "pages/blog/index.tsx", "pages/blog/[slug].tsx", "pages/docs/[...slug].tsx", "pages/api/hello.ts")
        self.assertEqual(self.routes(), ["/", "/about", "/api/hello", "/blog", "/blog/[slug]", "/docs/[...slug]"])

    def test_special_files_are_not_routes(self):
        self.next_app()
        self.write("pages/_app.tsx", "pages/_document.tsx", "pages/_error.tsx", "pages/404.tsx", "pages/500.tsx", "pages/index.tsx")
        self.assertEqual(self.routes(), ["/"])

    def test_src_pages_works_too(self):
        self.next_app()
        self.write("src/pages/index.tsx")
        self.assertEqual(self.routes(), ["/"])

    def test_api_files_are_api_routes(self):
        self.next_app()
        self.write("pages/api/hello.ts", "pages/index.tsx")
        project = self.scan()
        self.assertEqual(project.routes["/api/hello"]["route_kind"], "api")
        self.assertEqual(project.routes["/"]["route_kind"], "page")


class OlderRouteShapes(Project):
    def test_tanstack_routes_read_as_before(self):
        self.write("src/routes/__root.tsx", "src/routes/index.tsx", "src/routes/clients/$id.tsx", "src/routes/_auth/login.tsx")
        self.assertEqual(self.routes(), ["/", "/clients/$id", "/login"])
        self.assertEqual(self.scan().routes_dir, "src/routes")


class RouteMatching(unittest.TestCase):
    def test_dynamic_parts_match_one_part(self):
        self.assertTrue(typescript.route_matches("/listings/[slug]", "/listings/loft-1"))
        self.assertTrue(typescript.route_matches("/clients/$id", "/clients/9"))
        self.assertFalse(typescript.route_matches("/listings/[slug]", "/listings"))
        self.assertFalse(typescript.route_matches("/listings/[slug]", "/listings/a/b"))

    def test_catch_all_needs_at_least_one_part(self):
        self.assertTrue(typescript.route_matches("/docs/[...slug]", "/docs/a"))
        self.assertTrue(typescript.route_matches("/docs/[...slug]", "/docs/a/b/c"))
        self.assertFalse(typescript.route_matches("/docs/[...slug]", "/docs"))

    def test_optional_catch_all_needs_none(self):
        self.assertTrue(typescript.route_matches("/shop/[[...slug]]", "/shop"))
        self.assertTrue(typescript.route_matches("/shop/[[...slug]]", "/shop/a/b"))
        self.assertFalse(typescript.route_matches("/shop/[[...slug]]", "/other"))

    def test_plain_routes_match_exactly(self):
        self.assertTrue(typescript.route_matches("/", "/"))
        self.assertTrue(typescript.route_matches("/about", "/about?x=1#y"))
        self.assertFalse(typescript.route_matches("/about", "/"))


class SqlInCode(Project):
    def tables(self, text: str) -> dict:
        found = {}
        for use in typescript.table_uses(typescript.mask_code(text)):
            found.setdefault(use["table"], set()).add(use["access"])
        return found

    def test_a_query_reads_its_tables(self):
        self.assertEqual(self.tables('db.prepare("SELECT * FROM listings WHERE id = ?").get(1)'), {"listings": {"read"}})

    def test_a_query_in_a_variable_counts(self):
        self.assertEqual(self.tables('const sql = `SELECT a FROM listings JOIN hosts ON 1`\ndb.prepare(sql)'), {"listings": {"read"}, "hosts": {"read"}})

    def test_lower_case_sql_counts(self):
        self.assertEqual(self.tables("db.exec('select * from listings')"), {"listings": {"read"}})

    def test_writes_are_writes(self):
        self.assertEqual(self.tables('p("INSERT INTO bookings (a) VALUES (?)")'), {"bookings": {"write"}})
        self.assertEqual(self.tables('p("UPDATE bookings SET a = 1")'), {"bookings": {"write"}})
        self.assertEqual(self.tables('p("DELETE FROM bookings")'), {"bookings": {"write"}})

    def test_a_write_can_read_another_table(self):
        self.assertEqual(self.tables('p("INSERT INTO a SELECT * FROM b")'), {"a": {"write"}, "b": {"read"}})

    def test_an_upsert_is_not_a_table_called_set(self):
        text = 'p("INSERT INTO a (x) VALUES (1) ON CONFLICT (x) DO UPDATE SET x = 2")'
        self.assertEqual(self.tables(text), {"a": {"write"}})

    def test_a_subquery_is_not_a_table(self):
        self.assertEqual(self.tables('p("SELECT * FROM (SELECT * FROM a) AS b")'), {"a": {"read"}})

    def test_a_quoted_table_counts(self):
        self.assertEqual(self.tables('p(`SELECT * FROM "listings"`)'), {"listings": {"read"}})

    def test_a_multi_line_query_finds_its_line(self):
        uses = typescript.table_uses(typescript.mask_code('const a = 1\nconst q = `\n  SELECT *\n  FROM listings\n`\n'))
        self.assertEqual(uses[0]["line"], 4)

    def test_ordinary_text_is_not_sql(self):
        for text in ('"Select a home from listings"', '"Update from hosts"', '"Delete from bookings?"', "`With love from hosts`", '"Choose from listings"'):
            self.assertEqual(self.tables(text), {}, text)

    def test_only_known_tables_become_links(self):
        self.next_app()
        self.write("lib/q.ts", text='db.prepare("SELECT * FROM listings JOIN json_each(?)").all()\ndb.prepare("SELECT * FROM mystery").all()\n')
        edges = self.scan({"listings"}, "main").edges
        self.assertIn(("module:lib", "table:main.listings", "uses_table"), edges)
        self.assertNotIn(("module:lib", "table:main.mystery", "uses_table"), edges)

    def test_supabase_calls_still_read(self):
        uses = typescript.table_uses(typescript.mask_code('db.from("clients").select("*")\ndb.from("notes").insert({})'))
        self.assertEqual([(use["table"], use["access"]) for use in uses], [("clients", "read"), ("notes", "write")])


if __name__ == "__main__":
    unittest.main()
