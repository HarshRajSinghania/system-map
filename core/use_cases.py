"""A use case: what someone needs to do, mapped to the parts that do it.

The mapping comes from a person or an agent. The checking comes from the model: does each
part exist, does code read and write the tables, do tests reach the path, and can the schema
hold what is needed. What fails is a gap, with its evidence.
"""
from __future__ import annotations

import re

from . import limits

ROUTE = re.compile(r"^/")
NEEDS = ("field", "value", "optional", "duplicate", "has_many")
#: Below this share of lines, tests on a path count as thin.
THIN_BELOW = 0.5


def _strings(value: object, what: str) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list) or not all(isinstance(item, str) and item for item in value):
        raise ValueError(f"{what} must be a list of names")
    return value


def _check_need(need: dict) -> dict:
    if not isinstance(need, dict) or need.get("need") not in NEEDS:
        raise ValueError(f"need must be one of {', '.join(NEEDS)}: {need!r}")
    required = {
        "field": ("table", "column"),
        "value": ("table", "column", "value"),
        "optional": ("table", "column"),
        "duplicate": ("table", "columns"),
        "has_many": ("parent", "child"),
    }[need["need"]]
    for name in required:
        if not need.get(name):
            raise ValueError(f"{need['need']} needs {name}")
    return need


def validate(body: dict) -> dict:
    title = str(body.get("title") or "").strip()
    if not title:
        raise ValueError("a use case needs a title")
    routes = _strings(body.get("routes"), "routes")
    bad = [route for route in routes if not ROUTE.match(route.replace("route:", ""))]
    if bad:
        raise ValueError(f"a route is a path that starts with /: {bad[0]}")
    tables = body.get("tables") or []
    if not isinstance(tables, list):
        raise ValueError("tables must be a list")
    for table in tables:
        if not (isinstance(table, str) or (isinstance(table, dict) and table.get("table"))):
            raise ValueError(f"a table is a name, or an object with table and access: {table!r}")
    return {
        "title": title,
        "actor": str(body.get("actor") or ""),
        "goal": str(body.get("goal") or ""),
        "routes": [route.replace("route:", "") for route in routes],
        "tables": tables,
        "modules": _strings(body.get("modules"), "modules"),
        "needs": [_check_need(need) for need in body.get("needs") or []],
        "evidence": _strings(body.get("evidence"), "evidence"),
    }


def _gap(check: str, severity: str, node: str, title: str, detail: str, evidence: list[str] | None = None) -> dict:
    return {"check": check, "severity": severity, "node": node, "title": title, "detail": detail, "evidence": evidence or []}


def _edges(system: dict, kind: str, target: str | None = None, source: str | None = None) -> list[dict]:
    return [
        edge
        for edge in system["edges"]
        if edge["kind"] == kind and (target is None or edge["target"] == target) and (source is None or edge["source"] == source)
    ]


def _tests_for(paths: list[str], reach: dict[str, list[str]]) -> list[str]:
    found: set[str] = set()
    for path in paths:
        found.update(reach.get(path, []))
    return sorted(found)


def _module_row(module_id: str, ranked: dict) -> dict | None:
    return next((row for row in ranked["modules"] if row["id"] == module_id), None)


def _files_of(module_id: str, ranked: dict) -> list[str]:
    return [row["path"] for row in ranked["files"] if row["module"] == module_id]


def _route(path: str, system: dict, nodes: dict, ranked: dict, reach: dict) -> tuple[dict, list[dict]]:
    node_id = f"route:{path}"
    node = nodes.get(node_id)
    if node is None:
        return {"id": node_id, "kind": "route", "exists": False}, [_gap("no_route", "high", node_id, f"{path} does not exist", "No route file makes this page.")]
    modules = [edge["target"] for edge in _edges(system, "renders", source=node_id)]
    paths = list(node["evidence"])
    for module in modules:
        paths += _files_of(module, ranked)
    unit = _tests_for(paths, reach)
    browser = node.get("browser_tests", [])
    rows = [row for row in (_module_row(module, ranked) for module in modules) if row]
    covered = [row["covered"] for row in rows if row["covered"] is not None]
    part = {
        "id": node_id,
        "kind": "route",
        "exists": True,
        "tests": len(unit),
        "test_files": unit[:5],
        "browser_tests": browser,
        "covered": round(sum(covered) / len(covered), 4) if covered else None,
    }
    gaps = []
    if not unit and not browser:
        gaps.append(_gap("no_tests", "medium", node_id, f"No test reaches {path}", "No unit test imports its code, and no browser test opens it.", node["evidence"][:1]))
    elif not browser and part["covered"] is not None and part["covered"] < THIN_BELOW:
        gaps.append(_gap("thin_tests", "low", node_id, f"Tests on {path} are thin", f"They run {round(part['covered'] * 100)}% of the code it renders, and no browser test opens it.", node["evidence"][:1]))
    return part, gaps


def _table(entry: str | dict, system: dict, tables: dict) -> tuple[dict, list[dict]]:
    name = entry if isinstance(entry, str) else entry["table"]
    wanted = "read" if isinstance(entry, str) else entry.get("access", "read")
    key = limits.qualified(name.replace("table:", ""))
    node_id = f"table:{key}"
    table = tables.get(key)
    if table is None:
        return {"id": node_id, "kind": "table", "exists": False}, [_gap("no_table", "high", node_id, f"{key.removeprefix('public.')} does not exist", "No migration creates this table.")]
    calls = _edges(system, "uses_table", target=node_id)
    writers = [edge for edge in calls if edge.get("access") == "write"]
    part = {
        "id": node_id,
        "kind": "table",
        "exists": True,
        "access": wanted,
        "modules": len(calls),
        "writers": [edge["source"] for edge in writers][:5],
        "readers": [edge["source"] for edge in calls if edge.get("access") != "write"][:5],
        "proposed": table.get("status") == "proposed",
    }
    gaps = []
    if part["proposed"]:
        return part, gaps
    if not calls:
        gaps.append(_gap("no_code", "medium", node_id, f"No code calls {table['name']}", "It exists, but no module reads or writes it directly.", [table["source"]]))
    elif wanted == "write" and not writers:
        gaps.append(_gap("no_writer", "medium", node_id, f"No code writes {table['name']}", "This use case needs to write it, and modules only read it.", calls[0]["evidence"][:1]))
    return part, gaps


def _module(module_id: str, nodes: dict, ranked: dict, reach: dict) -> tuple[dict, list[dict]]:
    if module_id not in nodes:
        return {"id": module_id, "kind": "module", "exists": False}, [_gap("no_module", "high", module_id, f"{module_id.split(':', 1)[-1]} does not exist", "No code lives there.")]
    row = _module_row(module_id, ranked)
    tests = _tests_for(_files_of(module_id, ranked), reach)
    part = {"id": module_id, "kind": "module", "exists": True, "tests": len(tests), "test_files": tests[:5], "covered": row["covered"] if row else None}
    gaps = []
    if not tests:
        gaps.append(_gap("no_tests", "medium", module_id, f"No test reaches {module_id.split(':', 1)[-1]}", "No unit test imports its code."))
    return part, gaps


def evaluate(use_case: dict, system: dict, tables: dict, types: dict, ranked: dict, reach: dict) -> dict:
    """Check each mapped part, and every need, against the model."""
    nodes = {node["id"]: node for node in system["nodes"]}
    parts, gaps = [], []
    for path in use_case["routes"]:
        part, found = _route(path, system, nodes, ranked, reach)
        parts.append(part)
        gaps += found
    for entry in use_case["tables"]:
        part, found = _table(entry, system, tables)
        parts.append(part)
        gaps += found
    for module_id in use_case["modules"]:
        part, found = _module(module_id, nodes, ranked, reach)
        parts.append(part)
        gaps += found
    for need in use_case["needs"]:
        for limit in limits.check_need(need, tables, types):
            gaps.append(_gap(limit["check"], limit["severity"], limit["node"], limit["title"], limit["detail"], limit["evidence"]))
    worst = {gap["severity"] for gap in gaps}
    state = "missing" if "high" in worst else "gaps" if gaps else "ready"
    return {**use_case, "parts": parts, "gaps": gaps, "state": state}
