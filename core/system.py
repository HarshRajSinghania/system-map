"""Join the extractors into one system: areas, modules, routes, jobs, services and plans.

The result is two lists, nodes and edges. Every view and every agent tool reads them.
"""
from __future__ import annotations

import re

from .extractors import plans, typescript

CRON_SCHEDULE = re.compile(r"cron\.schedule\(\s*'([\w-]+)'\s*,\s*'([^']+)'")
API_PATH = re.compile(r"/api/[\w-]+")
SQL_ROOTS = ("supabase/", "db/", "migrations/")
#: How many area-to-area lines to keep for each pair is decided by the UI, not here.


def job_nodes(source) -> tuple[list[dict], list[dict]]:
    """Scheduled jobs from `cron.schedule` calls, in any SQL file that is not a test."""
    paths = [
        path
        for root in SQL_ROOTS
        for path in source.list_files(root, (".sql",))
        if "/tests/" not in path and "/test/" not in path
    ]
    contents = source.read_many(paths)
    nodes: dict[str, dict] = {}
    edges: list[dict] = []
    # Migrations first, so the evidence points at the file that really runs.
    for path in sorted(paths, key=lambda p: (0 if "/migrations/" in p else 1, p)):
        text = contents.get(path, "")
        for match in CRON_SCHEDULE.finditer(text):
            name = match.group(1)
            node_id = f"job:{name}"
            if node_id in nodes:
                continue
            line = text.count("\n", 0, match.start()) + 1
            evidence = f"{path}:{line}"
            nodes[node_id] = {
                "id": node_id,
                "kind": "job",
                "status": "built",
                "layer": "facts",
                "name": name,
                "schedule": match.group(2),
                "evidence": [evidence],
            }
            call = text[match.end() : match.end() + 400]
            for url in sorted(set(API_PATH.findall(call))):
                edges.append({"source": node_id, "target": f"route:{url}", "kind": "calls", "count": 1, "evidence": [evidence]})
    return list(nodes.values()), edges


def plan_edges(plan: dict, module_for) -> list[dict]:
    """Link a plan to the modules and files it names that do exist."""
    seen: dict[str, dict] = {}
    for claim in plan["claims"]:
        target = module_for(claim["where"]) if claim["found"] else None
        if target and target not in seen:
            seen[target] = {
                "source": plan["id"],
                "target": target,
                "kind": "touches",
                "count": 1,
                "evidence": [claim["source"]],
            }
        elif target:
            seen[target]["count"] += 1
    return list(seen.values())


def build(source, tables: list[dict]) -> dict:
    known = {table["name"] for table in tables if table["schema"] == "public"}
    project = typescript.scan(source, known) if typescript.detect(source) else None
    nodes: list[dict] = []
    edges: list[dict] = []
    if project:
        stats = project.nodes.pop("stats")
        nodes += list(project.nodes.values())
        edges += list(project.edges.values())
        modules = {node["path"]: node["id"] for node in nodes if node["kind"] == "module"}
        root = project.code_root

        def module_for(path: str) -> str | None:
            if not path or (root and not path.startswith(root)):
                return None
            found = typescript.module_of(path if path.endswith(typescript.CODE_SUFFIXES) else f"{path}/x.ts", root)[1]
            return modules.get(found)

    else:
        stats = {"code_files": 0}

        def module_for(path: str) -> str | None:
            return None

    jobs, job_edges = job_nodes(source)
    nodes += jobs
    known_nodes = {node["id"] for node in nodes}
    edges += [edge for edge in job_edges if edge["target"] in known_nodes]
    found_plans = plans.extract(source)
    for plan in found_plans:
        edges += plan_edges(plan, module_for)
    nodes += found_plans
    return {
        "nodes": nodes,
        "edges": edges,
        "stats": stats,
        "imports": {path: sorted(targets) for path, targets in project.imports.items()} if project else {},
        "table_calls": dict(project.table_calls) if project else {},
    }
