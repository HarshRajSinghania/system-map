"""Read a Postgres schema out of an ordered set of migration files.

This is a spike parser. It replays the statements that shape a schema and records
where each fact came from. It does not aim to parse all of Postgres: anything it
does not understand is skipped, and `skipped` counts those statements so a reader can
see how much was left out.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

IDENT = r'(?:"[^"]+"|[A-Za-z_][\w$]*)'
QUALIFIED = rf"(?:{IDENT}\.)?{IDENT}"


def _bare(name: str) -> str:
    """Drop the schema and quotes from a name: public."Users" -> Users."""
    return name.split(".")[-1].strip('"')


def _schema(name: str) -> str:
    parts = name.split(".")
    return parts[0].strip('"') if len(parts) > 1 else "public"


@dataclass
class Table:
    name: str
    schema: str
    source: str
    columns: dict[str, dict] = field(default_factory=dict)
    constraints: list[dict] = field(default_factory=list)
    indexes: list[dict] = field(default_factory=list)
    policies: dict[str, dict] = field(default_factory=dict)
    rls: bool = False
    rls_source: str | None = None

    def to_shard(self) -> dict:
        return {
            "id": f"table:{self.schema}.{self.name}",
            "kind": "table",
            "layer": "facts",
            "name": self.name,
            "schema": self.schema,
            "source": self.source,
            "rls": self.rls,
            "rls_source": self.rls_source,
            "columns": list(self.columns.values()),
            "constraints": self.constraints,
            "indexes": self.indexes,
            "policies": list(self.policies.values()),
        }


def strip_noise(sql: str) -> str:
    """Blank out comments and string bodies, keeping every line number intact.

    Strings and dollar-quoted bodies are blanked so a function body cannot be read
    as schema. Newlines stay, so a position still maps to the right source line.
    """
    out: list[str] = []
    i, n = 0, len(sql)

    def blank(segment: str) -> None:
        out.append("".join("\n" if c == "\n" else " " for c in segment))

    while i < n:
        c = sql[i]
        if sql.startswith("--", i):
            end = sql.find("\n", i)
            end = n if end == -1 else end
            blank(sql[i:end])
            i = end
        elif sql.startswith("/*", i):
            end = sql.find("*/", i + 2)
            end = n if end == -1 else end + 2
            blank(sql[i:end])
            i = end
        elif c == "'":
            j = i + 1
            while j < n:
                if sql[j] == "'":
                    if j + 1 < n and sql[j + 1] == "'":
                        j += 2
                        continue
                    break
                j += 1
            blank(sql[i : j + 1])
            out[-1] = "'" + out[-1][1:-1] + "'" if j - i >= 1 else out[-1]
            i = j + 1
        elif c == '"':
            end = sql.find('"', i + 1)
            end = n if end == -1 else end + 1
            out.append(sql[i:end])
            i = end
        elif c == "$":
            match = re.match(r"\$[A-Za-z_]*\$", sql[i:])
            if match:
                tag = match.group(0)
                end = sql.find(tag, i + len(tag))
                end = n if end == -1 else end + len(tag)
                blank(sql[i:end])
                i = end
            else:
                out.append(c)
                i += 1
        else:
            out.append(c)
            i += 1
    return "".join(out)


def split_top_level(body: str) -> list[str]:
    """Split on commas that are not inside parentheses."""
    parts: list[str] = []
    depth, start = 0, 0
    for i, c in enumerate(body):
        if c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
        elif c == "," and depth == 0:
            parts.append(body[start:i])
            start = i + 1
    parts.append(body[start:])
    return [p.strip() for p in parts if p.strip()]


def matching_paren(text: str, open_at: int) -> int:
    depth = 0
    for i in range(open_at, len(text)):
        if text[i] == "(":
            depth += 1
        elif text[i] == ")":
            depth -= 1
            if depth == 0:
                return i
    return -1


TABLE_CLAUSE = re.compile(
    r"^(?:constraint\s+\S+\s+)?(primary\s+key|foreign\s+key|unique|check|exclude)\b",
    re.I,
)
REFERENCES = re.compile(
    rf"references\s+({QUALIFIED})(?:\s*\(([^)]*)\))?(?:.*?on\s+delete\s+"
    r"(cascade|set\s+null|set\s+default|restrict|no\s+action))?",
    re.I | re.S,
)
COLUMN_TYPE_STOP = re.compile(
    r"\b(primary\s+key|not\s+null|null|unique|references|default|check|generated|"
    r"constraint|collate)\b",
    re.I,
)


def parse_column(text: str, source: str) -> tuple[dict, list[dict]]:
    match = re.match(rf"({IDENT})\s+(.*)$", text, re.S)
    name, rest = _bare(match.group(1)), match.group(2)
    stop = COLUMN_TYPE_STOP.search(rest)
    col_type = " ".join((rest[: stop.start()] if stop else rest).split())
    column = {
        "name": name,
        "type": col_type,
        "nullable": not re.search(r"\b(not\s+null|primary\s+key)\b", rest, re.I),
        "source": source,
    }
    constraints: list[dict] = []
    if re.search(r"\bprimary\s+key\b", rest, re.I):
        constraints.append({"kind": "primary_key", "columns": [name], "source": source})
    if re.search(r"\bunique\b", rest, re.I):
        constraints.append({"kind": "unique", "columns": [name], "source": source})
    if re.search(r"\bcheck\s*\(", rest, re.I):
        constraints.append({"kind": "check", "columns": [name], "source": source})
    ref = REFERENCES.search(rest)
    if ref:
        constraints.append(_foreign_key([name], ref, source))
    return column, constraints


def _foreign_key(columns: list[str], ref: re.Match, source: str) -> dict:
    return {
        "kind": "foreign_key",
        "columns": columns,
        "references": f"{_schema(ref.group(1))}.{_bare(ref.group(1))}",
        "reference_columns": [_bare(c.strip()) for c in (ref.group(2) or "").split(",") if c.strip()],
        "on_delete": " ".join((ref.group(3) or "no action").lower().split()),
        "source": source,
    }


def parse_table_clause(clause: str, source: str) -> dict | None:
    match = TABLE_CLAUSE.match(clause)
    if not match:
        return None
    kind = " ".join(match.group(1).lower().split()).replace(" ", "_")
    columns_match = re.search(r"\(([^()]*)\)", clause)
    columns = (
        [_bare(c.strip()) for c in columns_match.group(1).split(",") if c.strip()]
        if columns_match and kind != "check"
        else []
    )
    if kind == "foreign_key":
        ref = REFERENCES.search(clause)
        if ref:
            return _foreign_key(columns, ref, source)
    return {"kind": kind, "columns": columns, "source": source}


@dataclass
class Schema:
    tables: dict[str, Table] = field(default_factory=dict)
    skipped: int = 0
    statements: int = 0

    def table(self, name: str) -> Table | None:
        return self.tables.get(f"{_schema(name)}.{_bare(name)}")


def _line_of(text: str, position: int) -> int:
    return text.count("\n", 0, position) + 1


def _apply(schema: Schema, statement: str, source: str) -> None:
    text = statement.strip()
    schema.statements += 1

    create = re.match(rf"create\s+(?:unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?({QUALIFIED})\s*\(", text, re.I)
    if create:
        key = f"{_schema(create.group(1))}.{_bare(create.group(1))}"
        if key in schema.tables:
            return
        table = Table(name=_bare(create.group(1)), schema=_schema(create.group(1)), source=source)
        open_at = create.end() - 1
        close_at = matching_paren(text, open_at)
        for part in split_top_level(text[open_at + 1 : close_at]):
            clause = parse_table_clause(part, source)
            if clause:
                table.constraints.append(clause)
            elif re.match(rf"{IDENT}\s+\S", part, re.S) and not re.match(r"like\b", part, re.I):
                column, constraints = parse_column(part, source)
                table.columns[column["name"]] = column
                table.constraints.extend(constraints)
        schema.tables[key] = table
        return

    drop = re.match(rf"drop\s+table\s+(?:if\s+exists\s+)?({QUALIFIED})", text, re.I)
    if drop:
        schema.tables.pop(f"{_schema(drop.group(1))}.{_bare(drop.group(1))}", None)
        return

    alter = re.match(rf"alter\s+table\s+(?:if\s+exists\s+)?(?:only\s+)?({QUALIFIED})\s+(.*)$", text, re.I | re.S)
    if alter:
        _apply_alter(schema, alter.group(1), alter.group(2), source)
        return

    index = re.match(
        rf"create\s+(unique\s+)?index\s+(?:concurrently\s+)?(?:if\s+not\s+exists\s+)?({IDENT})\s+on\s+"
        rf"(?:only\s+)?({QUALIFIED})(?:\s+using\s+\w+)?\s*\((.*?)\)\s*(where\b.*)?$",
        text,
        re.I | re.S,
    )
    if index:
        table = schema.table(index.group(3))
        if table:
            name = _bare(index.group(2))
            table.indexes = [i for i in table.indexes if i["name"] != name]
            table.indexes.append(
                {
                    "name": name,
                    "unique": bool(index.group(1)),
                    "columns": [_bare(c.split()[0]) for c in split_top_level(index.group(4)) if c.split()],
                    "partial": bool(index.group(5)),
                    "source": source,
                }
            )
        return

    policy = re.match(rf"create\s+policy\s+({IDENT})\s+on\s+({QUALIFIED})(.*)$", text, re.I | re.S)
    if policy:
        table = schema.table(policy.group(2))
        if table:
            command = re.search(r"\bfor\s+(all|select|insert|update|delete)\b", policy.group(3), re.I)
            name = _bare(policy.group(1))
            table.policies[name] = {
                "name": name,
                "command": (command.group(1).lower() if command else "all"),
                "source": source,
            }
        return

    drop_policy = re.match(rf"drop\s+policy\s+(?:if\s+exists\s+)?({IDENT})\s+on\s+({QUALIFIED})", text, re.I)
    if drop_policy:
        table = schema.table(drop_policy.group(2))
        if table:
            table.policies.pop(_bare(drop_policy.group(1)), None)
        return

    schema.skipped += 1


def _apply_alter(schema: Schema, name: str, actions: str, source: str) -> None:
    table = schema.table(name)
    if table is None:
        schema.skipped += 1
        return
    for action in split_top_level(actions):
        lowered = " ".join(action.lower().split())
        if lowered.startswith("enable row level security"):
            table.rls, table.rls_source = True, source
        elif lowered.startswith("disable row level security"):
            table.rls, table.rls_source = False, source
        elif lowered.startswith("add column") or (
            lowered.startswith("add ") and not lowered.startswith("add constraint")
            and not TABLE_CLAUSE.match(action[3:].strip())
        ):
            definition = re.sub(r"^add\s+(column\s+)?(if\s+not\s+exists\s+)?", "", action, flags=re.I)
            column, constraints = parse_column(definition, source)
            table.columns[column["name"]] = column
            table.constraints.extend(constraints)
        elif lowered.startswith("add "):
            clause = parse_table_clause(re.sub(r"^add\s+", "", action, flags=re.I), source)
            if clause:
                table.constraints.append(clause)
        elif lowered.startswith("drop column"):
            match = re.search(rf"drop\s+column\s+(?:if\s+exists\s+)?({IDENT})", action, re.I)
            if match:
                gone = _bare(match.group(1))
                table.columns.pop(gone, None)
                table.constraints = [c for c in table.constraints if gone not in c.get("columns", [])]
        elif lowered.startswith("alter column") and "not null" in lowered:
            match = re.search(rf"alter\s+column\s+({IDENT})", action, re.I)
            column = table.columns.get(_bare(match.group(1))) if match else None
            if column:
                column["nullable"] = "drop not null" in lowered
        else:
            schema.skipped += 1


def statements_of(sql: str) -> list[tuple[int, str]]:
    """Split one file into (line, statement) pairs."""
    clean = strip_noise(sql)
    found: list[tuple[int, str]] = []
    start, depth = 0, 0
    for i, c in enumerate(clean):
        if c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
        elif c == ";" and depth == 0:
            statement = clean[start:i]
            if statement.strip():
                offset = len(statement) - len(statement.lstrip())
                found.append((_line_of(clean, start + offset), statement))
            start = i + 1
    return found


def parse_migrations(directory: Path, repo_root: Path) -> Schema:
    schema = Schema()
    for path in sorted(directory.glob("*.sql")):
        relative = path.relative_to(repo_root).as_posix()
        for line, statement in statements_of(path.read_text(encoding="utf-8", errors="replace")):
            _apply(schema, statement, f"{relative}:{line}")
    return schema
