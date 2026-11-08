"""Find a project's agents, and how each one connects.

An agent is a named unit of work in code. This finds agents only in the list a person points
at, or in modules a person marks. It never guesses. From each agent's own files it reads who
it hands work to, which model it uses and when it asks a person. From the rest of the code,
and the SQL schedules, it reads what starts each one.
"""
from __future__ import annotations

import re

from .extractors import typescript as ts
from .sources import is_migration

#: Services that are models. Names come from `SERVICE_PACKAGES`, hosts from URLs the code calls.
AI_SERVICE_NAMES = frozenset({"Anthropic", "OpenAI", "Google AI", "Google Vertex AI"})
AI_HOSTS = re.compile(
    r"(^|[.-])(api\.anthropic\.com|api\.openai\.com|openai\.azure\.com|aiplatform\.googleapis\.com"
    r"|generativelanguage\.googleapis\.com|api\.mistral\.ai|api\.cohere\.(ai|com)|bedrock-runtime\.[\w-]+\.amazonaws\.com)$"
)

DEFAULTS: dict = {"list": "", "jobs_key": "handlers", "hand_off_keys": ["agent"], "hand_off_calls": [], "model_calls": [], "asks_you_calls": [], "modules": []}

IDENT = r"[A-Za-z_$][\w$]*"
#: `export const AGENTS: readonly Agent[] =` or `export default`, before the `[`.
LIST = re.compile(rf"\bexport\s+(?:(?:const|let|var)\s+{IDENT}\s*(?::[^=;]*)?=|default)\s*")
#: A word before `name(` that makes it a definition, not a call.
NOT_CALLS = {"function", "async", "get", "set", "static", "public", "private", "protected", "abstract", "override", "declare", "accessor"}
NAME = re.compile(rf"(?<![\w$])({IDENT})(?![\w$])")
#: After a member's `)`: a return type, then the end of the member or the start of its body.
SIGNATURE = re.compile(r"\s*:\s*[A-Za-z_$][\w$.]*\s*(?:<[^;{()]*>)?\s*(?:\[\])*\s*[;{},\n]")
DATED = re.compile(r"^\d{4}-\d{2}-\d{2}-")
#: How far back a call looks for the word or mark before it.
LOOK_BACK = 400
#: A method's body, right after its `)`.
BLOCK = re.compile(r"\s*\{")
SQL_CALL = re.compile(r"\b(?:SELECT|PERFORM)\s+(?:\"?\w+\"?\.)?\"?(\w+)\"?\s*\(", re.I)
SQL_FUNCTION = re.compile(r"\bCREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:\"?\w+\"?\.)?\"?(\w+)\"?\s*\(", re.I)
SQL_BODY = re.compile(r"\bAS\s+(\$\w*\$)", re.I)
OPEN, CLOSE = "([{", ")]}"


def is_ai_service(node: dict) -> bool:
    return node.get("kind") == "service" and (node["name"] in AI_SERVICE_NAMES or bool(AI_HOSTS.search(node["name"])))


def suggestions(nodes: list[dict], edges: list[dict]) -> list[str]:
    """Modules that call a model: where to look when nothing points at agents yet."""
    ai = {node["id"] for node in nodes if is_ai_service(node)}
    return sorted({edge["source"] for edge in edges if edge["kind"] == "uses_service" and edge["target"] in ai and edge["source"].startswith("module:")})


ROW_KEYS = ("id", "name", "label", "description", "status", "jobs", "path", "module", "source", "evidence", "asks_you")
#: Only an agent an SDK declares has these, so other rows stay as they were.
OPTIONAL_ROW_KEYS = ("sdk",)


def rows(joined: dict) -> list[dict]:
    """Each agent with its links, in list order: enough for a table row or one agent's detail."""
    by_id = {node["id"]: node for node in joined["nodes"]}

    def links(node_id: str, kind: str, outgoing: bool) -> list[dict]:
        mine, other = ("source", "target") if outgoing else ("target", "source")
        return [{"node": edge[other], "evidence": edge["evidence"][0]} for edge in joined["edges"] if edge["kind"] == kind and edge[mine] == node_id]

    found = []
    for node in joined["nodes"]:
        if node["kind"] != "agent":
            continue
        models = []
        for edge in joined["edges"]:
            if edge["kind"] == "uses_model" and edge["source"] == node["id"]:
                service = by_id.get(edge["target"], {})
                models.append(
                    {
                        "node": edge["target"],
                        "name": service.get("name", edge["target"]),
                        "region": service.get("region"),
                        "leaves": bool(edge.get("leaves_region")),
                        "evidence": edge["evidence"][0],
                    }
                )
        found.append(
            {key: node.get(key) for key in ROW_KEYS}
            | {key: node[key] for key in OPTIONAL_ROW_KEYS if key in node}
            | {
                "leaves_region": node.get("leaves_region", []),
                "starts": links(node["id"], "starts", False),
                "hands_off_to": links(node["id"], "hands_off_to", True),
                "handed_by": links(node["id"], "hands_off_to", False),
                "models": models,
            }
        )
    return found


def settings_of(raw: dict | None) -> dict | None:
    """Fill in the defaults. None when nothing points at agents, so a build finds none."""
    if not raw or not (raw.get("list") or raw.get("modules")):
        return None
    return {**DEFAULTS, **{key: value for key, value in raw.items() if value is not None}}


def _line(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _close(code: str, at: int) -> int:
    """The bracket that closes the one at `at`. Strings are already blank in `code`."""
    depth = 0
    for index in range(at, len(code)):
        char = code[index]
        if char in OPEN:
            depth += 1
        elif char in CLOSE:
            depth -= 1
            if depth == 0:
                return index
    return len(code) - 1


def _items(code: str, open_at: int, close_at: int) -> list[tuple[int, int]]:
    """The top-level, comma-separated parts between two brackets, without leading space."""
    parts, depth, start = [], 0, open_at + 1
    for index in range(open_at + 1, close_at):
        char = code[index]
        if char in OPEN:
            depth += 1
        elif char in CLOSE:
            depth -= 1
        elif char == "," and depth == 0:
            parts.append((start, index))
            start = index + 1
    parts.append((start, close_at))
    found = []
    for start, end in parts:
        lead = len(code[start:end]) - len(code[start:end].lstrip())
        if code[start + lead : end].strip():
            found.append((start + lead, end))
    return found


def _quote_end(code: str, at: int) -> int:
    """Where the string opening at `at` closes. A template's `${...}` holes are skipped."""
    index = at + 1
    while index < len(code):
        if code[at] == "`" and code.startswith("${", index):
            index = _close(code, index + 1) + 1
            continue
        if code[index] == code[at]:
            return index
        index += 1
    return len(code) - 1


def _literal(text: str, code: str, start: int, end: int) -> str | None:
    """A value that is one string, as written. A template's `${...}` holes become `…`."""
    value = code[start:end]
    first = start + len(value) - len(value.lstrip())
    last = start + len(re.sub(r"\s+as\s+const\s*$", "", value.rstrip()))
    if first >= last or code[first] not in "\"'`" or _quote_end(code, first) != last - 1:
        return None
    body = text[first + 1 : last - 1]
    return re.sub(r"\$\{[^}]*\}", "…", body) if code[first] == "`" else body


def _ident(code: str, start: int, end: int) -> str | None:
    match = re.fullmatch(rf"\s*({IDENT})\s*", code[start:end])
    return match.group(1) if match else None


def _props(text: str, code: str, open_at: int) -> dict[str, tuple[int, int]]:
    """An object literal's own properties: key -> where its value starts and ends.

    A computed key keeps its brackets, as in `[DONE]`. A shorthand or a method gives its
    whole part as the value.
    """
    found: dict[str, tuple[int, int]] = {}
    for start, end in _items(code, open_at, _close(code, open_at)):
        if code.startswith("...", start):
            continue
        if code[start] == "[":
            stop = _close(code, start)
            key, after = f"[{text[start + 1 : stop].strip()}]", stop + 1
        elif code[start] in "\"'`":
            stop = _quote_end(code, start)
            key, after = text[start + 1 : stop], stop + 1
        else:
            match = re.match(IDENT, code[start:end])
            if not match:
                continue
            key, after = match.group(0), start + match.end()
        rest = code[after:end]
        colon = len(rest) - len(rest.lstrip())
        found[key] = (after + colon + 1, end) if rest.lstrip().startswith(":") else (start, end)
    return found


class _Files:
    """Code files, read once, each as written, without comments, and without strings too."""

    def __init__(self, source, every: set[str], aliases: list[tuple[str, str]]):
        self.source, self.every, self.aliases = source, every, aliases
        self.cache: dict[str, tuple[str, str, str]] = {}
        # Lookups a file with many calls would repeat: imports, declarations and their blocks.
        self.origins: dict[tuple[str, str], list[tuple[str, str]]] = {}
        self.declared: dict[tuple[str, str], list[tuple[int, int]]] = {}
        self.blocks: dict[tuple[str, int], tuple[int, int] | None] = {}

    def load(self, paths) -> None:
        """Read many files in one go, which costs one git process."""
        missing = [path for path in paths if path not in self.cache and path in self.every]
        for path, text in self.source.read_many(missing).items():
            self.put(path, text)

    def put(self, path: str, text: str) -> None:
        """Keep a file already read."""
        self.cache[path] = (text, ts.mask_code(text), ts.mask_code(text, strings=True))

    def get(self, path: str) -> tuple[str, str, str] | None:
        self.load([path])
        return self.cache.get(path)

    def origin(self, name: str, path: str) -> list[tuple[str, str]]:
        """Where a file gets `name` from: (file, the name there), through imports and re-exports."""
        if (name, path) not in self.origins:
            self.origins[(name, path)] = self._origin(name, path)
        return self.origins[(name, path)]

    def _origin(self, name: str, path: str) -> list[tuple[str, str]]:
        entry = self.get(path)
        if not entry:
            return []
        masked = entry[1]
        found = []
        for pattern in (ts.IMPORT_NAMES, re.compile(r"""(?:^|[\s;}])export\s+(\{[^}]*\})\s+from\s*(["'])([^"'\n]+)\2""")):
            for match in pattern.finditer(masked):
                for block in re.findall(r"\{([^}]*)\}", match.group(1)):
                    for item in filter(None, (part.strip() for part in block.split(","))):
                        real, _, local = re.sub(r"^type\s+", "", item).partition(" as ")
                        if (local.strip() or real.strip()) == name:
                            target = ts.resolve(match.group(3), path, self.every, self.aliases)
                            if target:
                                found.append((target, real.strip()))
        for match in re.finditer(r"""(?:^|[\s;}])export\s+\*\s+from\s*(["'])([^"'\n]+)\1""", masked):
            target = ts.resolve(match.group(2), path, self.every, self.aliases)
            if target:
                found.append((target, name))
        return found

    def bindings(self, path: str) -> dict[str, str]:
        """Each name a file imports from another repo file, and that file."""
        entry = self.get(path)
        if not entry:
            return {}
        found: dict[str, str] = {}
        for match in ts.IMPORT_NAMES.finditer(entry[1]):
            target = ts.resolve(match.group(3), path, self.every, self.aliases)
            if not target:
                continue
            clause = re.sub(r"^type\s+", "", match.group(1).strip())
            for block in re.findall(r"\{([^}]*)\}", clause):
                for item in filter(None, (part.strip() for part in block.split(","))):
                    real, _, local = re.sub(r"^type\s+", "", item).partition(" as ")
                    found[(local.strip() or real.strip())] = target
            for part in re.sub(r"\{[^}]*\}", "", clause).split(","):
                part = part.strip()
                name = part[5:].strip() if part.startswith("* as ") else part
                if re.fullmatch(IDENT, name):
                    found[name] = target
        return found

    def _block(self, path: str, at: int) -> tuple[int, int] | None:
        """The innermost `{ … }` around `at`, or None at the top of the file."""
        if (path, at) not in self.blocks:
            code, depth, found = self.cache[path][2], 0, None
            for index in range(at - 1, -1, -1):
                if code[index] == "}":
                    depth += 1
                elif code[index] == "{":
                    if depth == 0:
                        found = (index, _close(code, index))
                        break
                    depth -= 1
            self.blocks[(path, at)] = found
        return self.blocks[(path, at)]

    def const(self, name: str, path: str, hops: int = 3, at: int | None = None) -> str | None:
        """The string a constant holds, here or where it is imported from.

        `at` is where the name is used. Only a declaration in scope there counts: one at the top
        of the file, or one in a block that holds `at`, the innermost first. So a parameter never
        takes the value of a constant in another function. Without `at`, as for a name another
        file imports, only the top of the file counts.
        """
        entry = self.get(path)
        if not entry:
            return None
        text, _, code = entry
        if (name, path) not in self.declared:
            pattern = re.compile(rf"\b(?:const|let|var)\s+{re.escape(name)}\s*(?::[^=;]*)?=")
            self.declared[(name, path)] = [(match.start(), match.end()) for match in pattern.finditer(code)]
        seen = []
        for start, value_at in self.declared[(name, path)]:
            block = self._block(path, start)
            if block is None:
                seen.append((len(code) + 1, value_at))
            elif at is not None and block[0] < at <= block[1]:
                seen.append((block[1] - block[0], value_at))
        if seen:
            value_at = min(seen)[1]
            line_end = min(i for i in (code.find("\n", value_at), code.find(";", value_at), len(code)) if i >= 0)
            return _literal(text, code, value_at, line_end)
        if hops:
            for target, real in self.origin(name, path):
                value = self.const(real, target, hops - 1)
                if value is not None:
                    return value
        return None

    def object(self, name: str, path: str, hops: int = 3) -> tuple[str, int, int] | None:
        """Where `name` is set to an object literal: (file, where it is declared, its `{`)."""
        entry = self.get(path)
        if not entry:
            return None
        code = entry[2]
        match = re.search(rf"\b(?:const|let|var)\s+{re.escape(name)}\s*(?::[^=;]*)?=\s*", code)
        if match and code.startswith("{", match.end()):
            return path, match.start(), match.end()
        if hops:
            for target, real in self.origin(name, path):
                found = self.object(real, target, hops - 1)
                if found:
                    return found
        return None

    def value(self, path: str, start: int, end: int) -> str | None:
        """A value that is a string, or a constant that holds one."""
        text, _, code = self.cache[path]
        literal = _literal(text, code, start, end)
        if literal is not None:
            return literal
        name = _ident(code, start, end)
        return self.const(name, path, at=start) if name else None


class _Edges:
    def __init__(self):
        self.found: dict[tuple[str, str, str], dict] = {}

    def add(self, source: str, target: str, kind: str, evidence: str) -> None:
        if source == target:
            return
        entry = self.found.setdefault((source, target, kind), {"source": source, "target": target, "kind": kind, "count": 0, "evidence": []})
        entry["count"] += 1
        if len(entry["evidence"]) < 3 and evidence not in entry["evidence"]:
            entry["evidence"].append(evidence)


def _listed(files: _Files, settings: dict) -> list[dict]:
    """Each agent in the first exported list that holds any, read from its object literal."""
    path = settings["list"]
    entry = files.get(path) if path else None
    if not entry:
        return []
    code = entry[2]
    for match in LIST.finditer(code):
        if not code.startswith("[", match.end()):
            continue
        found = []
        for start, end in _items(code, match.end(), _close(code, match.end())):
            if code[start] == "{":
                where = (path, start, start)
            else:
                name = _ident(code, start, end)
                where = files.object(name, path) if name else None
            agent = _read_agent(files, settings, *where) if where else None
            if agent:
                found.append(agent)
        if found:
            return found
    return []


def _read_agent(files: _Files, settings: dict, path: str, declared: int, brace: int) -> dict | None:
    text, _, code = files.cache[path]
    props = _props(text, code, brace)
    if "name" not in props:
        return None
    name = files.value(path, *props["name"])
    if not name:
        return None
    label = files.value(path, *props["label"]) if "label" in props else None
    description = files.value(path, *props["description"]) if "description" in props else None
    return {
        "name": name,
        "label": label or name,
        "description": description or "",
        "jobs": _jobs(files, settings, path, props.get(settings["jobs_key"])),
        "path": path,
        "line": _line(text, declared),
        "span": (brace, _close(code, brace) + 1),
        "source": "list",
    }


def _jobs(files: _Files, settings: dict, path: str, where: tuple[int, int] | None) -> list[str]:
    """The kinds of job an agent handles: the keys of its jobs object."""
    if not where:
        return []
    text, _, code = files.cache[path]
    start = where[0] + len(code[where[0] : where[1]]) - len(code[where[0] : where[1]].lstrip())
    if not code.startswith("{", start):
        name = _ident(code, *where)
        found = files.object(name, path) if name else None
        if not found:
            return []
        path, _, start = found
        text, _, code = files.cache[path]
    jobs = []
    for key in _props(text, code, start):
        if key.startswith("["):
            inner = key[1:-1]
            value = inner[1:-1] if inner[:1] in "\"'`" and inner[-1:] == inner[:1] else files.const(inner, path, at=start)
            # A key that can't be read, such as `[Kind.Read]`, is still a job: keep it as written.
            jobs.append(value or inner)
        else:
            jobs.append(key)
    return jobs


def _marked(files: _Files, settings: dict, nodes: dict[str, dict], code_root: str, paths: list[str]) -> list[dict]:
    """Each module a person marked as an agent. A second module with the same name is left out,
    since an agent's id is its name. Saving settings refuses that case first."""
    found = []
    seen: set[str] = set()
    for node_id in settings["modules"]:
        node = nodes.get(node_id)
        if not node or node["kind"] != "module" or node["name"] in seen:
            continue
        seen.add(node["name"])
        own = [path for path in paths if ts.module_of(path, code_root)[1] == node["path"] and not ts.TEST_FILE.search(path)]
        found.append(
            {
                "name": node["name"],
                "label": node["name"],
                "description": "",
                "jobs": [],
                "path": node["path"],
                "line": None,
                "files": own,
                "source": "module",
            }
        )
    return found


def _names_used(code: str, start: int, end: int) -> set[str]:
    """Names this stretch of code uses as values. A key before `:`, right after `{` or `,`, is not
    one, nor is a member after a single `.`. A spread, `...x`, and either branch of a choice are."""
    found = set()
    for match in NAME.finditer(code, start, end):
        lead = code[max(start, match.start() - 200) : match.start()]
        if lead.endswith(".") and not lead.endswith("..."):
            continue
        before = lead.rstrip()
        if (not before or before[-1] in "{,") and code[match.end() : end].lstrip().startswith(":"):
            continue
        found.add(match.group(1))
    return found


def _regions(files: _Files, agents: list[dict], imports: dict[str, set[str]], list_file: str) -> dict[str, list[tuple[str, int, int]]]:
    """Where each agent's own code is: its file and what that file imports, but nothing shared.

    A file two agents import belongs to neither. Where two agents are defined in one file, or
    an agent is written in the list itself, each gets only its own object, and the files that
    the names in it are imported from.
    """
    defined: dict[str, int] = {}
    for agent in agents:
        if agent["source"] == "list":
            defined[agent["path"]] = defined.get(agent["path"], 0) + 1
    def keep(target: str) -> bool:
        return target not in defined and target != list_file and target.endswith(ts.CODE_SUFFIXES) and not ts.TEST_FILE.search(target)

    # First, what each agent could call its own. Then a file more than one could claim is taken out.
    could: dict[str, list[str]] = {}
    spans: dict[str, tuple[str, int, int]] = {}
    named: dict[str, set[str]] = {}
    for agent in agents:
        if agent["source"] == "module":
            continue
        path = agent["path"]
        if defined[path] > 1 or path == list_file:
            start, end = agent["span"]
            spans[agent["name"]] = (path, start, end)
            bound = files.bindings(path)
            found = {bound[name] for name in _names_used(files.cache[path][2], start, end) if name in bound}
            named.setdefault(path, set()).update(found)
        else:
            found = set(imports.get(path, ()))
        could[agent["name"]] = sorted(target for target in found if keep(target))
    claims: dict[str, int] = {}
    for targets in could.values():
        for target in targets:
            claims[target] = claims.get(target, 0) + 1
    # A file that holds several agents may use an import through its own code, for any of them.
    # Such an import, which no object there names, counts as one more claim, so it stays shared.
    for path, names in named.items():
        for target in imports.get(path, ()):
            if keep(target) and target not in names:
                claims[target] = claims.get(target, 0) + 1
    regions: dict[str, list[tuple[str, int, int]]] = {}
    for agent in agents:
        if agent["source"] == "module":
            files.load(agent["files"])
            regions[agent["name"]] = [(path, 0, len(files.cache[path][0])) for path in agent["files"] if path in files.cache]
            continue
        path = agent["path"]
        mine = [target for target in could[agent["name"]] if claims[target] == 1]
        files.load([path, *mine])
        head = [spans[agent["name"]]] if agent["name"] in spans else [(path, 0, len(files.cache[path][0]))]
        regions[agent["name"]] = head + [(target, 0, len(files.cache[target][0])) for target in mine if target in files.cache]
    return regions


def _hand_offs(files: _Files, settings: dict, names: set[str], path: str, start: int, end: int) -> list[tuple[str, int]]:
    """Agents this stretch of code hands work to, with the line of each: a hand-off key's value,
    or the first argument of a hand-off call."""
    text, masked, code = files.cache[path]
    found = []
    keys = "|".join(re.escape(key) for key in settings["hand_off_keys"])
    for match in re.finditer(rf"(?<![\w$])(?:{keys})\s*:\s*", masked[:end]) if keys else ():
        if match.start() < start or code[match.start()] != masked[match.start()]:
            continue  # Inside a string.
        rest = code[match.end() : end]
        stop = match.end() + min((i for i in (rest.find(","), rest.find("}"), rest.find("\n"), rest.find(")")) if i >= 0), default=len(rest))
        value = files.value(path, match.end(), stop)
        if value in names:
            found.append((value, _line(text, match.start())))
    for open_at, line in _call_sites(files, settings["hand_off_calls"], path, start, end):
        arguments = _items(code, open_at, _close(code, open_at))
        value = files.value(path, *arguments[0]) if arguments else None
        if value in names:
            found.append((value, line))
    return found


def _calls(files: _Files, call_names: list[str], path: str, start: int, end: int) -> list[int]:
    """Lines that call one of these names. A definition of the name is not a call."""
    return [line for _, line in _call_sites(files, call_names, path, start, end)]


def _before(code: str, at: int) -> str:
    """The code just before `at`. Only its end matters, so a short window does, unless that is all space."""
    window = code[max(0, at - LOOK_BACK) : at]
    return code[:at] if at > LOOK_BACK and not window.strip() else window


def _call_sites(files: _Files, call_names: list[str], path: str, start: int, end: int) -> list[tuple[int, int]]:
    """Each call to one of these names, plain or as `name?.()`: where its `(` is, and its line.

    Each call reads only a little way around it, so a file with many calls stays quick.
    """
    names = "|".join(re.escape(name) for name in call_names)
    if not names:
        return []
    text, _, code = files.cache[path]
    sites = []
    line, counted = _line(text, start), start
    for match in re.compile(rf"(?<![\w$])(?:{names})\s*(?:<[^()]*?>)?\s*(?:\?\.\s*)?\(").finditer(code, start, end):
        at = match.start()
        before = _before(code, at).rstrip()
        # A generator's `*` sits between the word and the name, as in `async *name()`.
        if before.endswith("*"):
            before = before[:-1].rstrip()
        if not before.endswith("."):
            word = re.search(r"([\w$]+)\s*$", before)
            if word and word.group(1) in NOT_CALLS:
                continue
        close = _close(code, match.end() - 1)
        if BLOCK.match(code, close + 1):
            continue  # A method's body follows.
        # Only a name where a member starts can be a typed signature, as in an interface:
        # `name(x): Type;`. After `.`, `await`, `?` or `=` it is a call, whatever follows.
        # A generator member, `*name()`, starts there too. A new line starts a member unless
        # the line before ends a choice's `?` or `:`.
        lead = _before(code, at).rstrip(" \t")
        if lead.endswith("*"):
            lead = lead[:-1].rstrip(" \t")
        member = not lead or lead[-1] in "{;," or (lead[-1] == "\n" and not lead.rstrip().endswith(("?", ":")))
        if member and SIGNATURE.match(code, close + 1):
            continue
        line, counted = line + text.count("\n", counted, at), at
        sites.append((match.end() - 1, line))
    return sites


def _ai_uses(files: _Files, path: str, services: dict[str, str]) -> list[tuple[str, int]]:
    """The models this one file talks to directly: by package, or by a URL it calls."""
    entry = files.get(path)
    if not entry:
        return []
    masked = entry[1]
    found = []
    for specifier, line in ts.import_specifiers(masked):
        package = ts.package_of(specifier)
        name = ts.service_for_package(package) if package else None
        if name in AI_SERVICE_NAMES and name in services:
            found.append((services[name], line))
    for host, line in ts.url_hosts(masked):
        if host in services and AI_HOSTS.search(host):
            found.append((services[host], line))
    return found


def _sql_functions(sql: dict[str, str]) -> dict[str, str]:
    """Each SQL function's body. A later migration's definition wins."""
    bodies: dict[str, str] = {}
    for path in sorted(sql, key=lambda p: (1 if is_migration(p) else 0, p)):
        text = sql[path]
        for match in SQL_FUNCTION.finditer(text):
            header_end = text.find(";", match.end())
            body = SQL_BODY.search(text, match.end(), header_end if header_end >= 0 else len(text))
            if not body:
                continue
            close = text.find(body.group(1), body.end())
            bodies[match.group(1).lower()] = text[body.end() : close if close >= 0 else len(text)]
    return bodies


def find(source, project, settings: dict, nodes: list[dict], job_calls: dict[str, str], sql: dict[str, str], sdks: list[str] = ()) -> tuple[list[dict], list[dict]]:
    """Agent nodes, and their links: what starts each one, hand-offs and the models it uses.

    Listed and marked agents come first. The agents of the SDKs the project lists are added
    beside them. An SDK agent with the name of a listed or marked agent is the same agent, and
    the listed one is the person's word, so its node is left out. Links into it stay, aimed at
    the listed agent: a `starts`, or another agent's hand-off. Only its own outgoing links go.
    """
    every = set(source.list_files())
    config = next((name for name in ("tsconfig.json", "jsconfig.json") if name in every), None)
    aliases = ts.read_tsconfig_paths(source.read_many([config]).get(config) if config else None)
    files = _Files(source, every, aliases)
    paths = ts.code_files(source)
    found, edges, owned = _own_agents(files, paths, project, settings, nodes, job_calls, sql)
    if not sdks:
        return found, edges
    from . import sdk_agents  # It reads this module's helpers, so it can't be imported above.

    sdk_found, sdk_edges = sdk_agents.read(files, project, nodes, paths, list(sdks), owned)
    names = {node["name"] for node in found}
    left_out = {node["id"] for node in sdk_found if node["name"] in names}
    sdk_found = [node for node in sdk_found if node["id"] not in left_out]
    sdk_edges = [edge for edge in sdk_edges if edge["source"] not in left_out]
    return found + sdk_found, sorted(edges + sdk_edges, key=lambda e: (e["source"], e["kind"], e["target"]))


def _own_agents(files: _Files, paths: list[str], project, settings: dict, nodes: list[dict], job_calls: dict[str, str], sql: dict[str, str]) -> tuple[list[dict], list[dict], set[str]]:
    """The listed and marked agents, their links, and the files their code is in."""
    by_id = {node["id"]: node for node in nodes}
    source = files.source

    agents = _listed(files, settings)
    listed = {agent["name"] for agent in agents}
    agents += [agent for agent in _marked(files, settings, by_id, project.code_root, paths) if agent["name"] not in listed]
    if not agents:
        return [], [], set()
    names = {agent["name"] for agent in agents}
    regions = _regions(files, agents, project.imports, settings["list"])
    services = {node["name"]: node["id"] for node in nodes if is_ai_service(node)}
    plans = set()
    for node in nodes:
        if node["kind"] == "plan":
            stem = node["id"].split(":", 1)[1]
            # The spec's file name, without a date in front, or its title, with or without any part in
            # brackets, such as `(agent)`.
            plans |= {_slug(DATED.sub("", stem)), _slug(node["name"]), _slug(re.sub(r"\s*\([^)]*\)", "", node["name"]))}
    plans.discard("")
    edges = _Edges()

    found = []
    for agent in agents:
        node_id = f"agent:{agent['name']}"
        asks: list[str] = []
        for path, start, end in regions[agent["name"]]:
            for target, line in _hand_offs(files, settings, names, path, start, end):
                edges.add(node_id, f"agent:{target}", "hands_off_to", f"{path}:{line}")
            for line in _calls(files, settings["model_calls"], path, start, end):
                for service in sorted(services.values()):
                    edges.add(node_id, service, "uses_model", f"{path}:{line}")
            asks += [f"{path}:{line}" for line in _calls(files, settings["asks_you_calls"], path, start, end)]
        # Only whole files lead on through their imports: an agent that shares its file with
        # others can't claim what that file imports for them all. The walk stops at the list,
        # and at other agents' own files, whose models are theirs.
        whole = [path for path, start, end in regions[agent["name"]] if start == 0 and end == len(files.cache[path][0])]
        theirs = {other["path"] for other in agents if other["source"] == "list" and other["name"] != agent["name"]} | {settings["list"]}
        reach, queue = set(), list(whole)
        while queue:
            path = queue.pop()
            if path in reach or ts.TEST_FILE.search(path) or (path in theirs and path not in whole):
                continue
            reach.add(path)
            queue += [target for target in project.imports.get(path, ()) if target.endswith(ts.CODE_SUFFIXES)]
        files.load(sorted(reach))
        for path in sorted(reach):
            for service, line in _ai_uses(files, path, services):
                edges.add(node_id, service, "uses_model", f"{path}:{line}")

        status = "built" if agent["jobs"] or agent["source"] == "module" else ("planned" if {_slug(agent["name"]), _slug(agent["label"])} & plans else "empty")
        module = agent["path"] if agent["source"] == "module" else ts.module_of(agent["path"], project.code_root)[1]
        found.append(
            {
                "id": node_id,
                "kind": "agent",
                "status": status,
                "layer": "facts",
                "name": agent["name"],
                "label": agent["label"],
                "description": agent["description"],
                "jobs": agent["jobs"],
                "path": agent["path"],
                "module": f"module:{module}",
                "source": agent["source"],
                "asks_you": asks[:5],
                "evidence": [f"{agent['path']}:{agent['line']}" if agent["line"] else agent["path"]],
            }
        )

    functions = _sql_functions(sql)
    for job_id, call in sorted(job_calls.items()):
        reached = call + "".join(functions.get(name.lower(), "") for name in SQL_CALL.findall(call))
        for name in sorted(names):
            if f"'{name}'" in reached:
                edges.add(job_id, f"agent:{name}", "starts", by_id[job_id]["evidence"][0])

    owned = {path for spans in regions.values() for path, _, _ in spans} | {settings["list"]}
    keys = settings["hand_off_keys"] + settings["hand_off_calls"]
    others = [path for path in paths if path not in owned and not ts.TEST_FILE.search(path)]
    # Read the rest in one go, and only mask a file that names a hand-off key or call at all.
    for path, text in source.read_many([path for path in others if path not in files.cache]).items():
        if any(key in text for key in keys):
            files.put(path, text)
    for path in others:
        if path not in files.cache:
            continue
        text = files.cache[path][0]
        if not any(key in text for key in keys):
            continue
        module = f"module:{ts.module_of(path, project.code_root)[1]}"
        for target, line in _hand_offs(files, settings, names, path, 0, len(text)):
            edges.add(module, f"agent:{target}", "starts", f"{path}:{line}")

    return found, sorted(edges.found.values(), key=lambda e: (e["source"], e["kind"], e["target"])), owned
