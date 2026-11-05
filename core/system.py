"""Join the extractors into one system: areas, modules, routes, jobs, services, plans and agents.

The result is two lists, nodes and edges. Every view and every agent tool reads them.
"""
from __future__ import annotations

import re

from . import agents
from .extractors import drizzle, plans, typescript

CRON_SCHEDULE = re.compile(r"cron\.schedule\(\s*'([\w-]+)'\s*,\s*'([^']+)'")
API_PATH = re.compile(r"/api/[\w-]+")
SQL_ROOTS = ("supabase/", "db/", "migrations/")
#: How many area-to-area lines to keep for each pair is decided by the UI, not here.


def sql_files(source) -> dict[str, str]:
    """Every SQL file that is not a test, with its text."""
    paths = [
        path
        for root in SQL_ROOTS
        for path in source.list_files(root, (".sql",))
        if "/tests/" not in path and "/test/" not in path
    ]
    return source.read_many(paths)


def cron_command(text: str, start: int) -> str:
    """What a `cron.schedule` call runs: from after its schedule to its closing bracket."""
    depth, quoted = 1, False
    for index in range(start, len(text)):
        char = text[index]
        if char == "'":
            quoted = not quoted  # A doubled quote flips twice, so it stays inside.
        elif not quoted and char == "(":
            depth += 1
        elif not quoted and char == ")":
            depth -= 1
            if depth == 0:
                return text[start:index]
    return text[start : start + 400]


def job_nodes(source, contents: dict[str, str] | None = None) -> tuple[list[dict], list[dict], dict[str, str]]:
    """Scheduled jobs from `cron.schedule` calls, in any SQL file that is not a test.

    Also returns what each job runs, so an agent it starts can be found.
    """
    contents = sql_files(source) if contents is None else contents
    nodes: dict[str, dict] = {}
    edges: list[dict] = []
    commands: dict[str, str] = {}
    # Migrations first, so the evidence points at the file that really runs.
    for path in sorted(contents, key=lambda p: (0 if "/migrations/" in p else 1, p)):
        text = contents.get(path, "")
        for match in CRON_SCHEDULE.finditer(text):
            name = match.group(1)
            node_id = f"job:{name}"
            if node_id in nodes:
                # A later migration that schedules it again replaces what it runs.
                if "/migrations/" in path:
                    commands[node_id] = cron_command(text, match.end())
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
            commands[node_id] = cron_command(text, match.end())
            call = text[match.end() : match.end() + 400]
            for url in sorted(set(API_PATH.findall(call))):
                edges.append({"source": node_id, "target": f"route:{url}", "kind": "calls", "count": 1, "evidence": [evidence]})
    return list(nodes.values()), edges, commands


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


def build(source, tables: list[dict], agent_settings: dict | None = None) -> dict:
    """Join everything. Agents are found only when `agent_settings` point at them."""
    schema = "main" if any(table["schema"] == "main" for table in tables) else "public"
    known = {table["name"] for table in tables if table["schema"] == schema}
    # Drizzle code names its tables through the schema, even where SQL files made them.
    project = typescript.scan(source, known, schema, drizzle.read(source).tables) if typescript.detect(source) else None
    nodes: list[dict] = []
    edges: list[dict] = []
    if project:
        stats = project.nodes.pop("stats")
        nodes += list(project.nodes.values())
        edges += list(project.edges.values())
        visits = typescript.browser_visits(source)
        for node in nodes:
            if node["kind"] == "route":
                node["browser_tests"] = sorted(path for path, urls in visits.items() if any(typescript.route_matches(node["path"], url) for url in urls))
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

    sql = sql_files(source)
    jobs, job_edges, commands = job_nodes(source, sql)
    nodes += jobs
    known_nodes = {node["id"] for node in nodes}
    edges += [edge for edge in job_edges if edge["target"] in known_nodes]
    found_plans = plans.extract(source)
    for plan in found_plans:
        edges += plan_edges(plan, module_for)
    nodes += found_plans
    settings = agents.settings_of(agent_settings)
    if project and settings:
        found_agents, agent_edges = agents.find(source, project, settings, nodes, commands, sql)
        nodes += found_agents
        edges += agent_edges
    return {
        "nodes": nodes,
        "edges": edges,
        "stats": stats,
        "imports": {path: sorted(targets) for path, targets in project.imports.items()} if project else {},
        "table_calls": dict(project.table_calls) if project else {},
        "complexity": dict(project.complexity) if project else {},
        "lines": dict(project.lines) if project else {},
        "code_root": project.code_root if project else "",
        "routes_dir": project.routes_dir if project else "",
        "route_style": project.route_style if project else "",
        "drizzle": project.drizzle if project else {},
    }
