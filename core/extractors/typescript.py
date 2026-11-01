"""Read a TypeScript project: its modules, imports, routes, table use and services.

This works from text, so it needs no Node install. `scripts/ts_truth.mjs` asks the real
TypeScript compiler the same questions, and `core/verify.py` compares the two answers.
"""
from __future__ import annotations

import json
import posixpath
import re
from collections import defaultdict
from dataclasses import dataclass, field

from ..sources import package_dependencies

CODE_SUFFIXES = (".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs")
RESOLVE_SUFFIXES = (".ts", ".tsx", ".d.ts", ".js", ".jsx", ".mjs", ".cjs", ".json")
SKIP_DIRS = re.compile(r"(^|/)(node_modules|dist|build|coverage|\.next|\.output|\.vercel)/")
TEST_FILE = re.compile(r"\.(test|spec)\.\w+$|(^|/)__tests__/")
GENERATED = re.compile(r"(\.gen\.\w+|\.generated\.\w+|(^|/)database\.types\.ts|(^|/)supabase/types\.ts)$")

IMPORT_FROM = re.compile(r"""(?:^|[\s;}])import\s+(?:type\s+)?[\w$*{}\s,]+?\s+from\s*(["'])([^"'\n]+)\1""")
IMPORT_BARE = re.compile(r"""(?:^|[\s;}])import\s*(["'])([^"'\n]+)\1""")
EXPORT_FROM = re.compile(r"""(?:^|[\s;}])export\s+(?:type\s+)?(?:\*(?:\s+as\s+[\w$]+)?|\{[^}]*\})\s+from\s*(["'])([^"'\n]+)\1""")
DYNAMIC_IMPORT = re.compile(r"""\bimport\(\s*(["'`])([^"'`\n$]+)\1\s*\)""")
REQUIRE = re.compile(r"""\brequire\(\s*(["'])([^"'\n]+)\1\s*\)""")

BROWSER_ROOTS = ("e2e/", "tests/e2e/", "playwright/")
GOTO = re.compile(r"""\.goto\(\s*["'`](/[^"'`$]*)["'`]""")

TABLE_FROM = re.compile(r"""\.from\(\s*["'`]([\w-]+)["'`]""")
#: A whole string or template literal. Comments are already blank by this point.
STRING_LITERAL = re.compile(r"""`[^`]*`|"[^"\n]*"|'[^'\n]*'""")
#: How a query opens. All one case, because `Select a date` is a sentence.
SQL_START = re.compile(r"\s*(?:(SELECT|INSERT|UPDATE|DELETE|REPLACE|WITH)|(select|insert|update|delete|replace|with))\b")
SQL_TABLE = re.compile(r"""\b(from|join|into|update)\s+["'`\[]?([A-Za-z_]\w*)""", re.I)
NOT_TABLES = {"set", "select", "or", "only"}
NEXT_CONFIG = re.compile(r"^next\.config\.\w+$")
NEXT_ROUTE_FILE = re.compile(r"^(page|route)\.(tsx|ts|jsx|js)$")
NEXT_APP_DIRS = ("src/app/", "app/")
NEXT_PAGES_DIRS = ("src/pages/", "pages/")
NEXT_NOT_PAGES = {"_app", "_document", "_error", "404", "500"}
#: Folders that, sitting beside `src/`, mean the code does not all live in `src/`.
TOP_CODE_DIRS = ("app/", "pages/", "components/", "lib/")
ROOT_NAME = "root files"

FIRST_VERB = re.compile(r"\.(select|insert|upsert|update|delete)\s*[(<]")
WRITE_VERBS = {"insert", "upsert", "update", "delete"}

#: Packages that mean the code talks to an outside service.
SERVICE_PACKAGES = {
    "@anthropic-ai/sdk": "Anthropic",
    "openai": "OpenAI",
    "@google/generative-ai": "Google AI",
    "@google-cloud/vertexai": "Google Vertex AI",
    "@supabase/supabase-js": "Supabase",
    "@aws-sdk/": "AWS",
    "aws-sdk": "AWS",
    "firebase": "Firebase",
    "firebase-admin": "Firebase",
    "stripe": "Stripe",
    "@stripe/stripe-js": "Stripe",
    "resend": "Resend",
    "@sendgrid/mail": "SendGrid",
    "twilio": "Twilio",
    "@sentry/": "Sentry",
    "posthog-js": "PostHog",
    "@vercel/": "Vercel",
    "redis": "Redis",
    "ioredis": "Redis",
    "pg": "Postgres",
    "mongodb": "MongoDB",
}
URL_LITERAL = re.compile(r"""["'`]https://([A-Za-z0-9${}._-]+\.[a-z]{2,})(?:[/:"'`?])""")
URL_USE = re.compile(r"""\b(fetch|URL|Url|ENDPOINT|BASE|HOST)\b|=\s*["'`]https://|return\s+["'`]https://""")
LINK_ONLY_HOSTS = re.compile(r"(^|\.)(example\.\w+|w3\.org|schema\.org|github\.com|localhost)$")


#: Each place the code can take a second path. `?` needs care: `?.`, `??` and `x?:` are not one.
DECISION = re.compile(
    r"""(?<![.\w$])(?:if|while|for(?:\s+await)?|switch)\s*\(  # statements, with `switch` dropped below
    |(?<![.\w$])catch\b\s*[({]
    |(?<![.\w$])case\s[^:\n]*:
    |&&=?|\|\|=?|\?\?=?
    |(?<=[\w)\]"'`}])\s*\?(?![.?:=,)\]])(?=\s)
    """,
    re.X,
)


def mask_code(text: str, strings: bool = False) -> str:
    """Blank comments, keeping every offset and line. Strings stay, to read imports.

    With `strings` their contents go too, leaving only code. A quote only counts on its
    own line, except in a template string. So a stray quote inside a regex literal can
    only confuse the rest of that one line.
    """
    out = list(text)
    i, n = 0, len(text)
    quote = None
    depth = 0  # Open `${ ... }` holes inside a template string.
    while i < n:
        c = text[i]
        if quote:
            if c == "\\":
                if strings:
                    out[i : i + 2] = "  "[: len(out[i : i + 2])]
                i += 2
                continue
            if quote == "`" and text.startswith("${", i):
                depth += 1
                quote = None
                i += 2
                continue
            if c == quote or (c == "\n" and quote != "`"):
                quote = None
            elif strings and c != "\n":
                out[i] = " "
            i += 1
            continue
        if text.startswith("//", i):
            end = text.find("\n", i)
            end = n if end == -1 else end
            out[i:end] = " " * (end - i)
            i = end
        elif text.startswith("/*", i):
            end = text.find("*/", i + 2)
            end = n if end == -1 else end + 2
            for k in range(i, end):
                if out[k] != "\n":
                    out[k] = " "
            i = end
        elif c in "\"'`":
            quote = c
            i += 1
        elif c == "}" and depth:
            depth -= 1
            quote = "`"
            i += 1
        else:
            i += 1
    return "".join(out)


def _line(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def import_specifiers(masked: str) -> list[tuple[str, int]]:
    """Every module a file names, with the line it is on."""
    found: dict[tuple[str, int], None] = {}
    for pattern in (IMPORT_FROM, IMPORT_BARE, EXPORT_FROM, DYNAMIC_IMPORT, REQUIRE):
        for match in pattern.finditer(masked):
            found[(match.group(2), _line(masked, match.start(2)))] = None
    return list(found)


def read_tsconfig_paths(text: str | None) -> list[tuple[str, str]]:
    """Read `paths` from a tsconfig, which may hold comments and trailing commas."""
    if not text:
        return []
    clean = re.sub(r",(\s*[}\]])", r"\1", mask_code(text))
    try:
        options = json.loads(clean).get("compilerOptions", {})
    except json.JSONDecodeError:
        return []
    base = posixpath.normpath(options.get("baseUrl", "."))
    aliases = []
    for pattern, targets in (options.get("paths") or {}).items():
        for target in targets:
            aliases.append((pattern, posixpath.normpath(posixpath.join(base, target))))
    return aliases


def resolve(specifier: str, importer: str, files: set[str], aliases: list[tuple[str, str]]) -> str | None:
    """Map an import to a repo file. Packages and assets give None."""
    bare = specifier.split("?")[0]
    if bare.startswith("."):
        candidates = [posixpath.normpath(posixpath.join(posixpath.dirname(importer), bare))]
    else:
        candidates = []
        for pattern, target in aliases:
            if pattern.endswith("/*") and bare.startswith(pattern[:-1]):
                prefix = target[:-1].rstrip("/")
                rest = bare[len(pattern) - 1 :]
                candidates.append(f"{prefix}/{rest}" if prefix else rest)
            elif pattern == bare:
                candidates.append(target)
    for base in candidates:
        for path in _candidates(base):
            if path in files:
                return path
    return None


def _candidates(base: str) -> list[str]:
    found = [base] if base.endswith(RESOLVE_SUFFIXES) else []
    root, dot, suffix = base.rpartition(".")
    if dot and suffix in ("js", "jsx", "mjs", "cjs"):
        found += [f"{root}.ts", f"{root}.tsx"]
    found += [base + suffix for suffix in RESOLVE_SUFFIXES]
    found += [f"{base}/index{suffix}" for suffix in RESOLVE_SUFFIXES]
    return found


def package_of(specifier: str) -> str | None:
    if specifier.startswith((".", "/", "@/", "~/", "#")):
        return None
    parts = specifier.split("/")
    return "/".join(parts[:2]) if specifier.startswith("@") else parts[0]


def service_for_package(package: str) -> str | None:
    for prefix, name in SERVICE_PACKAGES.items():
        if package == prefix or (prefix.endswith("/") and package.startswith(prefix)):
            return name
    return None


def sql_uses(masked: str) -> list[dict]:
    """Tables named in SQL held in a string, as with `better-sqlite3` or `pg`.

    Only a string that opens like a query counts, so `Update from hosts` is not SQL. Callers
    keep the tables they know, so a function such as `json_each` never becomes a table.
    """
    uses = []
    for literal in STRING_LITERAL.finditer(masked):
        body = literal.group(0)[1:-1]
        opening = SQL_START.match(body)
        if not opening:
            continue
        verb = (opening.group(1) or opening.group(2)).upper()
        seen: set[tuple[str, str]] = set()
        for match in SQL_TABLE.finditer(body):
            keyword, table = match.group(1).upper(), match.group(2)
            if table.lower() in NOT_TABLES:
                continue
            writes = keyword in ("INTO", "UPDATE") or (keyword == "FROM" and verb == "DELETE")
            use = (table, "write" if writes else "read")
            if use not in seen:
                seen.add(use)
                uses.append({"table": table, "access": use[1], "line": _line(masked, literal.start() + 1 + match.start())})
    return uses


def table_uses(masked: str) -> list[dict]:
    """Every table the code reaches: `.from("x")` on a client, and SQL held in a string."""
    uses = sql_uses(masked)
    for match in TABLE_FROM.finditer(masked):
        before = masked[max(0, match.start() - 40) : match.start()]
        if re.search(r"storage\s*$", before):
            continue
        verb = FIRST_VERB.search(masked[match.end() : match.end() + 400])
        uses.append(
            {
                "table": match.group(1),
                "access": "write" if verb and verb.group(1) in WRITE_VERBS else "read",
                "line": _line(masked, match.start()),
            }
        )
    return uses


def decision_points(text: str) -> int:
    """How many extra paths a file has: branches, loops, catches, `&&`, `||`, `??` and `?:`."""
    return sum(1 for match in DECISION.finditer(mask_code(text, strings=True)) if not match.group(0).startswith("switch"))


def url_hosts(masked: str) -> list[tuple[str, int]]:
    """Hosts in URLs the code calls, not links it merely shows."""
    found = []
    for line_number, line in enumerate(masked.splitlines(), 1):
        if "https://" not in line or "href" in line or not URL_USE.search(line):
            continue
        for match in URL_LITERAL.finditer(line):
            host = re.sub(r"^.*\}-?\.?", "", match.group(1))
            if "." in host and not LINK_ONLY_HOSTS.search(host):
                found.append((host, line_number))
    return found


def next_app_route(file: str, app_dir: str) -> str | None:
    """Turn a page or route handler under `app/` into its URL, written the way Next writes it."""
    parts = file[len(app_dir) :].split("/")
    if not NEXT_ROUTE_FILE.match(parts.pop()):
        return None
    kept = []
    for part in parts:
        if part.startswith("_"):
            return None  # A private folder, which stays out of routing.
        if part.startswith("(") and part.endswith(")") or part.startswith("@"):
            continue  # A route group or a parallel slot, which leave the URL alone.
        if part.startswith("("):
            return None  # An intercepting route, which shows another route's URL.
        kept.append(part.replace("%5F", "_"))
    return "/" + "/".join(kept)


def next_pages_route(file: str, pages_dir: str) -> str | None:
    parts = file[len(pages_dir) :].rsplit(".", 1)[0].split("/")
    if parts[0] in NEXT_NOT_PAGES:
        return None
    if parts[-1] == "index":
        parts.pop()
    return "/" + "/".join(parts)


def route_path(file: str, routes_dir: str) -> str | None:
    """Turn a TanStack file route into its URL. Layouts and the root give their parent."""
    stem = file[len(routes_dir) :].rsplit(".", 1)[0]
    segments = re.split(r"[./]", stem)
    if segments[-1] == "__root":
        return None
    parts = []
    for segment in segments:
        if not segment or segment == "index" or segment.startswith("_"):
            continue
        parts.append(segment.rstrip("_").strip("[]"))
    return "/" + "/".join(parts)


def find_routes_dir(files: set[str]) -> str | None:
    for candidate in ("src/routes/", "app/routes/"):
        if any(f.startswith(candidate) and f.endswith(CODE_SUFFIXES) for f in files):
            return candidate
    return None


def uses_next(source) -> bool:
    if any(NEXT_CONFIG.match(path) for path in source.blobs):
        return True
    packages = package_dependencies(source)
    return "next" in packages["runtime"] | packages["dev"]


def route_readers(source, files: set[str]) -> list[tuple[str, object, str]]:
    """Each folder that holds routes, how to read a URL from a file there, and its style."""
    if uses_next(source):
        found = [(folder, next_app_route, "next-app") for folder in NEXT_APP_DIRS if any(f.startswith(folder) for f in files)]
        found += [(folder, next_pages_route, "next-pages") for folder in NEXT_PAGES_DIRS if any(f.startswith(folder) for f in files)]
        if found:
            return found
    folder = find_routes_dir(files)
    return [(folder, route_path, "file-routes")] if folder else []


def module_of(path: str, code_root: str) -> tuple[str, str]:
    """Return (area, module) for a file.

    An area is a folder under the code root. A module is the next folder down. Files
    sitting directly in an area, or directly in the root, form a module of their own.
    """
    parts = path[len(code_root) :].split("/") if code_root else path.split("/")
    prefix = code_root.rstrip("/")
    join = lambda *names: "/".join(filter(None, [prefix, *names]))  # noqa: E731
    if len(parts) == 1:
        return prefix or ".", prefix or "."
    area = join(parts[0])
    return area, (join(parts[0], parts[1]) if len(parts) > 2 else area)


@dataclass
class Project:
    code_root: str
    #: file -> resolved repo files it imports, for the check against the compiler.
    imports: dict[str, set[str]] = field(default_factory=lambda: defaultdict(set))
    nodes: dict[str, dict] = field(default_factory=dict)
    edges: dict[tuple[str, str, str], dict] = field(default_factory=dict)
    table_calls: dict[str, list[dict]] = field(default_factory=lambda: defaultdict(list))
    routes: dict[str, dict] = field(default_factory=dict)
    #: The folder routes live in, and how they are written there.
    routes_dir: str = ""
    route_style: str = ""
    #: file -> how many paths it has, and how long it is. Test files are left out.
    complexity: dict[str, int] = field(default_factory=dict)
    lines: dict[str, int] = field(default_factory=dict)
    unresolved: int = 0

    def edge(self, source: str, target: str, kind: str, evidence: str, access: str | None = None) -> None:
        if source == target:
            return
        entry = self.edges.setdefault(
            (source, target, kind),
            {"source": source, "target": target, "kind": kind, "count": 0, "evidence": []},
        )
        entry["count"] += 1
        if access:
            entry["access"] = "write" if access == "write" or entry.get("access") == "write" else "read"
        if len(entry["evidence"]) < 3:
            entry["evidence"].append(evidence)


def code_files(source) -> list[str]:
    return [
        path
        for path in source.list_files(code_root_of(source), CODE_SUFFIXES)
        if not SKIP_DIRS.search(path) and not GENERATED.search(path) and not path.endswith(".d.ts")
    ]


def detect(source) -> bool:
    return bool(code_files(source))


def browser_files(source) -> list[str]:
    """Browser test files, which sit outside the code root."""
    return [path for root in BROWSER_ROOTS for path in source.list_files(root, CODE_SUFFIXES) if TEST_FILE.search(path)]


def route_matches(route: str, url: str) -> bool:
    """Does a URL land on this route?

    `$name` and `[name]` match one part, `[...name]` one or more, and `[[...name]]` any number.
    """
    wanted = route.strip("/").split("/")
    given = [part for part in url.split("?")[0].split("#")[0].strip("/").split("/") if part]
    wanted = [part for part in wanted if part]
    for index, part in enumerate(wanted):
        if part.startswith("[[..."):
            return len(given) >= index
        if part.startswith("[..."):
            return len(given) > index
        if index >= len(given):
            return False
        if not (part.startswith("$") or part.startswith("[") or part == given[index]):
            return False
    return len(wanted) == len(given)


def browser_visits(source) -> dict[str, list[str]]:
    """Which URLs each browser test opens. A URL built at runtime can't be read here."""
    visits: dict[str, list[str]] = {}
    contents = source.read_many(browser_files(source))
    for path, text in contents.items():
        urls = sorted({match.group(1) for match in GOTO.finditer(mask_code(text))})
        if urls:
            visits[path] = urls
    return visits


def code_root_of(source) -> str:
    """`src/` when all the code lives there, and the repo root when any sits beside it."""
    if not source.list_files("src/", CODE_SUFFIXES):
        return ""
    return "" if any(source.list_files(folder, CODE_SUFFIXES) for folder in TOP_CODE_DIRS) else "src/"


def scan(source, known_tables: set[str], schema: str = "public") -> Project:
    """Read every code file once, and build modules and their links."""
    every = set(source.list_files())
    paths = code_files(source)
    root = code_root_of(source)
    project = Project(code_root=root)
    config = next((name for name in ("tsconfig.json", "jsconfig.json") if name in every), None)
    aliases = read_tsconfig_paths(source.read_many([config]).get(config) if config else None)
    contents = source.read_many(paths)
    readers = route_readers(source, set(paths))
    project.nodes, stats = _modules(paths, contents, root)

    for path in paths:
        area, module = module_of(path, root)
        is_test = bool(TEST_FILE.search(path))
        masked = mask_code(contents.get(path, ""))
        for specifier, line in import_specifiers(masked):
            target = resolve(specifier, path, every, aliases)
            if target is not None:
                project.imports[path].add(target)
                if not is_test and target in contents and not TEST_FILE.search(target):
                    other = module_of(target, root)[1]
                    project.edge(f"module:{module}", f"module:{other}", "imports", f"{path}:{line}")
                continue
            package = package_of(specifier)
            service = service_for_package(package) if package else None
            if service and not is_test:
                project.edge(f"module:{module}", _service(project, service, f"{path}:{line}"), "uses_service", f"{path}:{line}")
        if is_test:
            continue
        project.complexity[path] = decision_points(contents.get(path, ""))
        project.lines[path] = contents.get(path, "").count("\n") + 1
        for use in table_uses(masked):
            project.table_calls[path].append(use)
            if use["table"] in known_tables:
                project.edge(f"module:{module}", f"table:{schema}.{use['table']}", "uses_table", f"{path}:{use['line']}", use["access"])
        for host, line in url_hosts(masked):
            project.edge(f"module:{module}", _service(project, host, f"{path}:{line}"), "uses_service", f"{path}:{line}")

    for folder, reader, style in readers:
        _routes(project, paths, folder, root, reader, style)
    if readers:
        project.routes_dir = readers[0][0].rstrip("/")
        project.route_style = readers[0][2]
    project.nodes["stats"] = stats
    return project


def _service(project: Project, name: str, evidence: str) -> str:
    slug = re.sub(r"[^a-z0-9.]+", "-", name.lower()).strip("-")
    node_id = f"service:{slug}"
    project.nodes.setdefault(
        node_id,
        {"id": node_id, "kind": "service", "status": "external", "layer": "facts", "name": name, "evidence": [evidence]},
    )
    return node_id


def _modules(paths: list[str], contents: dict[str, str], root: str) -> tuple[dict[str, dict], dict]:
    nodes: dict[str, dict] = {}
    for path in paths:
        area, module = module_of(path, root)
        lines = contents.get(path, "").count("\n") + 1
        is_test = bool(TEST_FILE.search(path))
        for kind, key, parent in (("area", area, None), ("module", module, f"area:{area}")):
            node_id = f"{kind}:{key}"
            node = nodes.setdefault(
                node_id,
                {
                    "id": node_id,
                    "kind": kind,
                    "status": "built",
                    "layer": "facts",
                    "name": ROOT_NAME if key == "." else key.rsplit("/", 1)[-1],
                    "path": key,
                    "area": parent,
                    "files": 0,
                    "lines": 0,
                    "test_files": 0,
                    "evidence": [key],
                },
            )
            if is_test:
                node["test_files"] += 1
            else:
                node["files"] += 1
                node["lines"] += lines
    return nodes, {"code_files": len(paths)}


def _is_api(path: str, url: str, style: str) -> bool:
    if style == "next-app":
        return path.rsplit("/", 1)[-1].startswith("route.")
    return url.startswith("/api/") or url == "/api"


def _routes(project: Project, paths: list[str], routes_dir: str, root: str, reader, style: str) -> None:
    for path in paths:
        if not path.startswith(routes_dir) or TEST_FILE.search(path):
            continue
        url = reader(path, routes_dir)
        if url is None:
            continue
        node_id = f"route:{url}"
        node = project.nodes.setdefault(
            node_id,
            {
                "id": node_id,
                "kind": "route",
                "status": "built",
                "layer": "facts",
                "name": url,
                "path": url,
                "route_kind": "api" if _is_api(path, url, style) else "page",
                "evidence": [],
            },
        )
        node["evidence"].append(path)
        project.routes[url] = node
        for target in sorted(project.imports.get(path, ())):
            if target in paths and not target.startswith(routes_dir):
                project.edge(node_id, f"module:{module_of(target, root)[1]}", "renders", path)
