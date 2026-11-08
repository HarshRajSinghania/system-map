"""Find the agents an agent SDK's own code declares.

A project built on an SDK names its agents in code: `new Agent({ name })`, or a key of the
`agents` option of a `query` call. This reads those, only when the root package.json lists the
SDK, and only what the code states: a literal or constant name, and agents it can follow by
import. It never guesses. Hand-offs, what starts each agent and the model it uses come from the
same code. Python SDK code is not read.
"""
from __future__ import annotations

import re

from . import agents as base
from .extractors import typescript as ts
from .sources import package_dependencies

OPENAI, MASTRA, CLAUDE = "@openai/agents", "@mastra/core", "@anthropic-ai/claude-agent-sdk"
#: Each SDK as package.json names it, and the module its agent class or `query` is imported from.
IMPORTS = {OPENAI: "@openai/agents", MASTRA: "@mastra/core/agent", CLAUDE: "@anthropic-ai/claude-agent-sdk"}
#: The model a model-less agent uses: the SDK's own provider.
DEFAULT_SERVICE = {OPENAI: "OpenAI", CLAUDE: "Anthropic"}
#: The part of a `provider/model` string before the slash.
PREFIX_SERVICE = {"openai": "OpenAI", "anthropic": "Anthropic"}
PREFIX = re.compile(r"""["'`](openai|anthropic)/""")
#: What an agent's description is read from, first one that is a string.
DESCRIBED = ("description", "instructions")
#: What a template's hole becomes in a string. A name or description with it is not a plain string.
HOLE = "…"
GENERATE = re.compile(rf"(?<![\w$.])({base.IDENT})\s*\??\.\s*(?:generate|stream)\s*\(")

Where = tuple[int, int]


def listed(source) -> list[str]:
    """The SDKs the root package.json lists, as dependencies or dev dependencies."""
    deps = package_dependencies(source)
    return [package for package in IMPORTS if package in deps["runtime"] | deps["dev"]]


def _imports(masked: str, specifier: str) -> tuple[dict[str, str], set[str]]:
    """What a file imports from one module: each name there as it is called here, and the
    namespaces. An import of types only gives nothing."""
    named: dict[str, str] = {}
    spaces: set[str] = set()
    for match in ts.IMPORT_NAMES.finditer(masked):
        clause = match.group(1).strip()
        if match.group(3) != specifier or clause.startswith("type "):
            continue
        for block in re.findall(r"\{([^}]*)\}", clause):
            for item in filter(None, (part.strip() for part in block.split(","))):
                if not item.startswith("type "):
                    real, _, local = item.partition(" as ")
                    named[local.strip() or real.strip()] = real.strip()
        for part in re.sub(r"\{[^}]*\}", "", clause).split(","):
            if part.strip().startswith("* as "):
                spaces.add(part.strip()[5:].strip())
    return named, spaces


def _heads(named: dict[str, str], spaces: set[str], real: str) -> list[str]:
    """How a file writes an imported name in code, as patterns: `Agent`, or `sdk.Agent`."""
    return [re.escape(local) for local, name in named.items() if name == real] + [rf"{re.escape(space)}\s*\.\s*{real}" for space in sorted(spaces)]


def _calls(code: str, heads: list[str], new: bool = False, member: str = "") -> list[tuple[int, int]]:
    """Each call of an imported name, as `new Name(` or `Name(`: where it starts and its `(`.
    A name after a `.` is another object's, not the import."""
    if not heads:
        return []
    lead = r"new\s+" if new else ""
    pattern = re.compile(rf"(?<![\w$.]){lead}(?:{'|'.join(heads)}){member}\s*(?:<[^()]*?>)?\s*\(")
    return [(match.start(), match.end() - 1) for match in pattern.finditer(code)]


def _providers(masked: str) -> dict[str, str]:
    """The model functions a file imports from an AI SDK provider, such as `openai`: name -> service."""
    found = {}
    for match in ts.IMPORT_NAMES.finditer(masked):
        service = ts.service_for_package(match.group(3)) if match.group(3).startswith("@ai-sdk/") else None
        for block in re.findall(r"\{([^}]*)\}", match.group(1)) if service else ():
            for item in filter(None, (part.strip() for part in block.split(","))):
                real, _, local = item.partition(" as ")
                found[local.strip() or real.strip()] = service
    return found


def _strip(code: str, where: Where) -> int:
    """Where a value really starts, past the space before it."""
    value = code[where[0] : where[1]]
    return where[0] + len(value) - len(value.lstrip())


class _Run:
    """What the readers share: files, the agents found so far, and the links."""

    def __init__(self, files: base._Files, project, nodes: list[dict], paths: list[str], sdks: list[str], owned: set[str]):
        self.files, self.project, self.owned, self.sdks = files, project, owned, sdks
        self.services = {node["name"]: node["id"] for node in nodes if base.is_ai_service(node)}
        self.found: dict[str, dict] = {}
        self.edges = base._Edges()
        # Where an agent is: the variable that holds it, the start of its `new`, and its span.
        self.variables: dict[tuple[str, str], str | None] = {}
        self.inline: dict[tuple[str, int], str] = {}
        self.spans: dict[str, list[Where]] = {}
        # Where a file declares a name as a variable, and which of those hold an agent.
        self.declared: dict[tuple[str, str], list[tuple[int, Where | None]]] = {}
        self.held: set[tuple[str, int]] = set()
        self.expressions: dict[str, list[tuple[int, int, str]]] = {}
        # What is linked once every agent is known: each agent's `model` and `handoffs`.
        self.models: dict[str, tuple[str, Where | None]] = {}
        self.hand_offs: list[tuple[str, str, Where]] = []
        self.paths = sorted(path for path in paths if not ts.TEST_FILE.search(path))
        specifiers = [IMPORTS[sdk] for sdk in sdks]
        unread = [path for path in self.paths if path not in files.cache]
        for path, text in files.source.read_many(unread).items():
            if any(specifier in text for specifier in specifiers) or (MASTRA in sdks and GENERATE.search(text)):
                files.put(path, text)

    def importers(self, sdk: str):
        """Each file that imports from the SDK's module: its path, and what it imports."""
        for path in self.paths:
            entry = self.files.cache.get(path)
            if entry and IMPORTS[sdk] in entry[0]:
                named, spaces = _imports(entry[1], IMPORTS[sdk])
                if named or spaces:
                    yield path, named, spaces

    def plain(self, path: str, where: Where | None) -> str | None:
        """A string, or a constant that holds one, but not a template with a hole in it."""
        value = self.files.value(path, *where) if where else None
        return value if value and HOLE not in value else None

    def add(self, sdk: str, name: str, path: str, line: int, props: dict[str, Where]) -> bool:
        """Keep an agent, unless one has the name already. False if it was not kept."""
        if name in self.found:
            return False
        description = next(filter(None, (self.plain(path, props.get(key)) for key in DESCRIBED)), "")
        module = ts.module_of(path, self.project.code_root)[1]
        self.found[name] = {
            "id": f"agent:{name}",
            "kind": "agent",
            "status": "built",
            "layer": "facts",
            "name": name,
            "label": name,
            "description": description,
            "jobs": [],
            "path": path,
            "module": f"module:{module}",
            "source": "sdk",
            "sdk": sdk,
            "asks_you": [],
            "evidence": [f"{path}:{line}"],
        }
        return True

    def declarations(self, name: str, path: str) -> list[tuple[int, tuple[int, int] | None]]:
        """Each place a file declares `name` as a variable: where, and the block it is in."""
        if (name, path) not in self.declared:
            code, token = self.files.cache[path][2], re.escape(name)
            pattern = re.compile(rf"\b(?:const|let|var)\s+(?:{token}(?![\w$])|[{{\[][^=;]*?(?<![\w$.]){token}(?![\w$])[^=;]*?[}}\]]\s*=)")
            starts = [match.start() for match in pattern.finditer(code) if (path, match.start()) not in self.held]
            self.declared[(name, path)] = [(start, self.files._block(path, start)) for start in starts]
        return self.declared[(name, path)]

    def is_parameter(self, name: str, path: str, block_start: int) -> bool:
        """Whether the function whose body opens at `block_start` takes `name` as a parameter."""
        code, token = self.files.cache[path][2], rf"(?<![\w$.]){re.escape(name)}(?![\w$])"
        tail = code[max(0, block_start - 400) : block_start]
        if re.search(rf"{token}\s*=>\s*$", tail):
            return True
        match = re.search(r"\(([^()]*)\)\s*(?::[^(){};]*?)?\s*(?:=>)?\s*$", tail)
        if not match:
            return False
        keyword = re.search(r"(\w+)\s*$", tail[: match.start()])
        if keyword and keyword.group(1) in ("if", "while", "switch", "with"):
            return False
        if keyword and keyword.group(1) == "for":
            return bool(re.search(rf"\b(?:const|let|var)\s+{token}", match.group(1)))
        return self.in_list(name, match.group(1))

    @staticmethod
    def in_list(name: str, params: str) -> bool:
        """Whether a parameter list binds `name`, not as a type or a default value."""
        token = rf"(?<![\w$.]){re.escape(name)}(?![\w$])"
        return any(not params[: found.start()].rstrip().endswith((":", "=")) for found in re.finditer(token, params))

    def arrows(self, path: str) -> list[tuple[int, int, str]]:
        """Each arrow function with an expression for a body: where the body starts and ends, and its parameters."""
        if path not in self.expressions:
            code, found = self.files.cache[path][2], []
            for arrow in re.finditer(r"=>\s*", code):
                if code.startswith("{", arrow.end()):
                    continue
                head = re.search(r"\(([^()]*)\)\s*(?::[^(){};]*?)?\s*$", code[max(0, arrow.start() - 400) : arrow.start()]) or re.search(r"([\w$]+)\s*$", code[max(0, arrow.start() - 80) : arrow.start()])
                depth, index = 0, arrow.end()
                while index < len(code):
                    if code[index] in "([{":
                        depth += 1
                    elif code[index] in ")]}":
                        if depth == 0:
                            break
                        depth -= 1
                    elif code[index] in ",;" and depth == 0:
                        break
                    index += 1
                found.append((arrow.end(), index, head.group(1) if head else ""))
            self.expressions[path] = found
        return self.expressions[path]

    def shadowed(self, name: str, path: str, at: int) -> bool:
        """Whether a function or block around `at` declares `name` again, as a parameter or a
        variable of its own. The variable that holds an agent is not such a declaration."""
        if any(start <= at < end and self.in_list(name, params) for start, end, params in self.arrows(path)):
            return True
        declarations = self.declarations(name, path)
        block = self.files._block(path, at)
        while block:
            if any(where == block for _, where in declarations) or self.is_parameter(name, path, block[0]):
                return True
            block = self.files._block(path, block[0])
        return False

    def lookup(self, name: str, path: str, at: int | None = None, hops: int = 3) -> str | None:
        """The agent a variable holds in this file, or in the file it is imported from. `at` is
        where the name is used: a name declared again around it is not the agent."""
        if at is not None and self.shadowed(name, path, at):
            return None
        if (path, name) in self.variables:
            return self.variables[(path, name)]
        for target, real in self.files.origin(name, path) if hops else ():
            found = self.lookup(real, target, None, hops - 1)
            if found:
                return found
        return None

    def agent_at(self, path: str, where: Where) -> str | None:
        """The agent a stretch of code names: a variable, or a `new Agent(…)` written there."""
        name = base._ident(self.files.cache[path][2], *where)
        return self.lookup(name, path, where[0]) if name else self.inline.get((path, where[0]))

    def starts(self, sdk: str, path: str, at: int, name: str | None) -> None:
        """Code that no agent owns starts an agent of this SDK."""
        if not name or name not in self.found or self.found[name]["sdk"] != sdk or path in self.owned:
            return
        if any(start <= at < end for start, end in self.spans.get(path, ())):
            return
        module = f"module:{ts.module_of(path, self.project.code_root)[1]}"
        self.edges.add(module, f"agent:{name}", "starts", f"{path}:{base._line(self.files.cache[path][0], at)}")


def _define_class(run: _Run, sdk: str, create: bool) -> None:
    """Each `new Agent({ name })`, and with `create`, each `Agent.create({ name })`."""
    for path, named, spaces in run.importers(sdk):
        text, _, code = run.files.cache[path]
        heads = _heads(named, spaces, "Agent")
        sites = _calls(code, heads, new=True) + (_calls(code, heads, member=r"\s*\.\s*create") if create else [])
        for start, paren in sorted(sites):
            arguments = base._items(code, paren, base._close(code, paren))
            if not arguments or code[arguments[0][0]] != "{":
                continue
            props = base._props(text, code, arguments[0][0])
            name = run.plain(path, props.get("name"))
            if not name:
                continue
            # A second agent of the SDK with a name is the same agent: it keeps the first one's
            # node, but a variable that holds it, its code and its hand-offs still count.
            kept = run.add(sdk, name, path, base._line(text, start), props)
            if not kept and run.found[name]["sdk"] != sdk:
                continue
            run.spans.setdefault(path, []).append((start, base._close(code, paren) + 1))
            run.inline[(path, start)] = name
            held = re.search(rf"(?:const|let|var)\s+({base.IDENT})\s*(?::[^=;]*)?=\s*$", code[max(0, start - 200) : start])
            if held:
                # Two variables of one name in a file leave it unclear which is meant.
                run.held.add((path, max(0, start - 200) + held.start()))
                key = (path, held.group(1))
                run.variables[key] = None if key in run.variables else name
            if kept:
                run.models[name] = (path, props.get("model"))
            if "handoffs" in props:
                run.hand_offs.append((name, path, props["handoffs"]))


def _object(run: _Run, path: str, where: Where | None) -> tuple[str, int] | None:
    """The object literal a value is, or a variable set to one here or in an import: (file, its `{`)."""
    if not where:
        return None
    code = run.files.cache[path][2]
    start = _strip(code, where)
    if code.startswith("{", start):
        return path, start
    name = base._ident(code, *where)
    found = run.files.object(name, path) if name else None
    return (found[0], found[2]) if found else None


def _members(run: _Run, place: tuple[str, int] | None) -> dict[str, Where]:
    """The properties of the object literal at `place`."""
    return base._props(*run.files.cache[place[0]][::2], place[1]) if place else {}


def _key_name(run: _Run, path: str, key: str, at: int) -> str | None:
    """An `agents` key as a name: as written, or a computed key that is a string or a constant."""
    if not key.startswith("["):
        return key
    inner = key[1:-1]
    return inner[1:-1] if inner[:1] in "\"'`" and inner[-1:] == inner[:1] else run.files.const(inner, path, at=at)


def _define_query(run: _Run) -> None:
    """Each key of `options.agents` in a `query({ … })` call. The module that makes the call starts them."""
    for path, named, spaces in run.importers(CLAUDE):
        code = run.files.cache[path][2]
        for start, paren in _calls(code, _heads(named, spaces, "query")):
            arguments = base._items(code, paren, base._close(code, paren))
            call = _object(run, path, arguments[0]) if arguments else None
            options = _object(run, call[0], _members(run, call).get("options")) if call else None
            listing = _object(run, options[0], _members(run, options).get("agents")) if options else None
            for key, where in _members(run, listing).items():
                home = listing[0]
                name = _key_name(run, home, key, listing[1])
                body = _object(run, home, where)
                props = _members(run, body) if body and body[0] == home else {}
                line = base._line(run.files.cache[home][0], _strip(run.files.cache[home][2], where))
                if name and (run.add(CLAUDE, name, home, line, props) or run.found[name]["sdk"] == CLAUDE):
                    run.models.setdefault(name, (home, None))
                    run.starts(CLAUDE, path, start, name)


def _model_services(run: _Run, sdk: str, path: str, where: Where | None) -> list[str]:
    """The providers a `model` value names: an `openai/` or `anthropic/` prefix in a string, or a
    call of a provider function from `@ai-sdk/…`. No `model` is the SDK's own provider, as is a
    plain model name where that SDK has one."""
    default = DEFAULT_SERVICE.get(sdk)
    if not where:
        return [default] if default else []
    _, masked, code = run.files.cache[path]
    found = {PREFIX_SERVICE[prefix] for prefix in PREFIX.findall(masked[where[0] : where[1]])}
    const = run.plain(path, where)
    if const and (match := re.match(r"(openai|anthropic)/", const)):
        found.add(PREFIX_SERVICE[match.group(1)])
    for local, service in _providers(masked).items():
        if re.search(rf"(?<![\w$.]){re.escape(local)}\s*\(", code[where[0] : where[1]]):
            found.add(service)
    if not found and default and const and "/" not in const:
        found.add(default)
    return sorted(found)


def _link_models(run: _Run) -> None:
    """A `uses_model` link from each agent to its provider's service, when the project has one."""
    for name, (path, where) in sorted(run.models.items()):
        node = run.found[name]
        text = run.files.cache[path][0]
        line = base._line(text, _strip(run.files.cache[path][2], where)) if where else int(node["evidence"][0].rsplit(":", 1)[1])
        evidence = f"{path}:{line}" if where else node["evidence"][0]
        for service in _model_services(run, node["sdk"], path, where):
            if service in run.services:
                run.edges.add(node["id"], run.services[service], "uses_model", evidence)


def _link_hand_offs(run: _Run) -> None:
    """Each agent in an OpenAI agent's `handoffs`, plain or as `handoff(x)`."""
    for name, path, where in sorted(run.hand_offs):
        text, masked, code = run.files.cache[path]
        start = _strip(code, where)
        if not code.startswith("[", start):
            continue
        named, spaces = _imports(masked, IMPORTS[OPENAI])
        calls = dict(_calls(code, _heads(named, spaces, "handoff")))
        for first, last in base._items(code, start, base._close(code, start)):
            item = (first, last)
            if first in calls:
                arguments = base._items(code, calls[first], base._close(code, calls[first]))
                item = arguments[0] if arguments else item
            target = run.agent_at(path, item)
            if target and run.found[target]["sdk"] == OPENAI:
                run.edges.add(f"agent:{name}", f"agent:{target}", "hands_off_to", f"{path}:{base._line(text, first)}")


def _link_runs(run: _Run) -> None:
    """What starts an agent: `run(agent, …)`, or `agent.generate(…)` and `agent.stream(…)`."""
    if OPENAI in run.sdks:
        for path, named, spaces in run.importers(OPENAI):
            code = run.files.cache[path][2]
            for start, paren in _calls(code, _heads(named, spaces, "run")):
                arguments = base._items(code, paren, base._close(code, paren))
                run.starts(OPENAI, path, start, run.agent_at(path, arguments[0]) if arguments else None)
    if MASTRA in run.sdks:
        for path in run.paths:
            for match in GENERATE.finditer(run.files.cache[path][2]) if path in run.files.cache else ():
                run.starts(MASTRA, path, match.start(), run.lookup(match.group(1), path, match.start(1)))


def read(files: base._Files, project, nodes: list[dict], paths: list[str], sdks: list[str], owned: set[str]) -> tuple[list[dict], list[dict]]:
    """Agent nodes the listed SDKs declare, and their links. `owned` are files whose code an
    agent already owns, which start nothing here."""
    run = _Run(files, project, nodes, paths, sdks, owned)
    if OPENAI in sdks:
        _define_class(run, OPENAI, create=True)
    if MASTRA in sdks:
        _define_class(run, MASTRA, create=False)
    if CLAUDE in sdks:
        _define_query(run)
    _link_hand_offs(run)
    _link_runs(run)
    _link_models(run)
    return list(run.found.values()), list(run.edges.found.values())
