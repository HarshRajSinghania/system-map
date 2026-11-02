"""Checks over the Facts. These are rules, not opinions, and every one cites a line.

`column_unused` is the one soft check: it means no code names the column, so it says
"possible" and asks a person to look.
"""
from __future__ import annotations

import re

SEVERITIES = ("high", "medium", "low", "info")
CODE_SUFFIXES = (".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".java", ".go", ".rb", ".cs", ".php")
GENERATED = re.compile(r"(^|/)(database\.types\.ts|supabase/types\.ts|[^/]*\.generated\.\w+)$")
NOT_CODE = re.compile(r"(^|/)(node_modules|dist|build|vendor)/|\.(test|spec)\.\w+$")
#: `seed.ts`, `seeds/a.ts`, `seed-db.js`, `seedData.ts`, `runSeed.ts`, but never `seedling.ts`.
SEED_FILE = re.compile(r"(?:^|[/._-]|(?<=[a-z]))[Ss]eed(?:s|ers?|ing)?(?=[/._-]|[A-Z]|$)")
TOKEN = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")


def code_files(source) -> list[str]:
    return [
        path
        for path in source.list_files("", CODE_SUFFIXES)
        if not GENERATED.search(path) and not NOT_CODE.search(path)
    ]


def code_tokens(source, usage_text: str, skip: set[str] | None = None) -> set[str]:
    """Every word in the code, plus words in SQL that uses columns.

    A schema written in code names every column, so `skip` leaves those files out. A seed
    file only writes sample rows, so a column it names can still go unused by the app.
    """
    tokens = set(TOKEN.findall(usage_text))
    paths = [path for path in code_files(source) if path not in (skip or set()) and not SEED_FILE.search(path)]
    for text in source.read_many(paths).values():
        tokens.update(TOKEN.findall(text))
    return tokens


def _finding(check: str, severity: str, node: dict, title: str, detail: str, evidence: list[str], key: str = "") -> dict:
    return {
        "id": f"{check}:{node['schema']}.{node['name']}{':' + key if key else ''}",
        "check": check,
        "severity": severity,
        "node": node["id"],
        "title": title,
        "detail": detail,
        "evidence": evidence,
    }


def _leading_columns(node: dict) -> list[list[str]]:
    """Column lists that can serve a lookup: indexes, plus keys and unique rules."""
    lists = [index["columns"] for index in node["indexes"] if not index["partial"]]
    lists += [c["columns"] for c in node["constraints"] if c["kind"] in ("primary_key", "unique")]
    return lists


def _covered(columns: list[str], lists: list[list[str]]) -> bool:
    wanted = set(columns)
    return any(set(found[: len(columns)]) == wanted for found in lists)


def check_table(node: dict) -> list[dict]:
    found = []
    label = node["name"]
    if node["schema"] == "public" and not node["rls"]:
        found.append(
            _finding(
                "rls_off",
                "high",
                node,
                f"{label} has no row level security",
                "Any role with table access can read every row.",
                [node["source"]],
            )
        )
    if node["rls"] and not node["policies"]:
        found.append(
            _finding(
                "rls_no_policy",
                "low",
                node,
                f"{label} has RLS on but no policies",
                "Clients get no rows. Only the service role can reach it. Check that this is meant.",
                [node["rls_source"] or node["source"]],
            )
        )
    constraints = node["constraints"]
    if not any(c["kind"] == "primary_key" for c in constraints):
        found.append(
            _finding(
                "no_primary_key",
                "medium",
                node,
                f"{label} has no primary key",
                "Rows have no stable identity, and replication needs one.",
                [node["source"]],
            )
        )
    lists = _leading_columns(node)
    for constraint in constraints:
        if constraint["kind"] != "foreign_key" or _covered(constraint["columns"], lists):
            continue
        columns = ", ".join(constraint["columns"])
        acts = constraint["on_delete"] in ("cascade", "set null", "set default")
        found.append(
            _finding(
                "fk_no_index",
                "medium" if acts else "low",
                node,
                f"{label}.{columns} has no index",
                f"Foreign key to {constraint['references']}, on delete {constraint['on_delete']}. "
                "A delete on the parent scans this whole table.",
                [constraint["source"]],
                columns,
            )
        )
    seen: dict[tuple, dict] = {}
    keyed = [c for c in constraints if c["kind"] in ("primary_key", "unique")]
    for index in node["indexes"]:
        if index["partial"]:
            continue
        shape = tuple(index["columns"])
        twin = seen.get(shape) or next((c for c in keyed if tuple(c["columns"]) == shape), None)
        if twin:
            found.append(
                _finding(
                    "index_duplicate",
                    "low",
                    node,
                    f"{index['name']} repeats {twin['name']}",
                    f"Both cover ({', '.join(shape)}). Each index slows writes.",
                    [index["source"], twin["source"]],
                    index["name"],
                )
            )
        else:
            seen[shape] = index
    return found


def check_unused(node: dict, tokens: set[str], fields: dict[tuple[str, str], str] | None = None) -> list[dict]:
    """`fields` gives a column's name in code, where that differs from its name in SQL."""
    found = []
    keys = {c for constraint in node["constraints"] for c in constraint.get("columns", [])}
    for column in node["columns"]:
        name = column["name"]
        if name in tokens or name in keys or (fields or {}).get((node["name"], name)) in tokens:
            continue
        found.append(
            _finding(
                "column_unused",
                "info",
                node,
                f"{node['name']}.{name} may be unused",
                "No code, function or policy names this column, outside seed files. Dynamic access would not show here.",
                [column["source"]],
                name,
            )
        )
    return found


def find(nodes: list[dict], tokens: set[str], fields: dict[tuple[str, str], str] | None = None) -> list[dict]:
    found = []
    for node in nodes:
        found += check_table(node)
        found += check_unused(node, tokens, fields)
    order = {severity: rank for rank, severity in enumerate(SEVERITIES)}
    return sorted(found, key=lambda f: (order[f["severity"]], f["check"], f["id"]))


def tally(findings: list[dict]) -> dict[str, int]:
    return {s: sum(1 for f in findings if f["severity"] == s) for s in SEVERITIES}
