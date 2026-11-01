"""System Map's MCP server: a stdlib-only stdio server, so it needs no install step.

Design rule: a tool returns a small slice or a pointer, never a whole model. Anything
over budget is written to a file and the tool returns its path.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core import explore, risk, store  # noqa: E402

PROTOCOL_VERSION = "2025-06-18"
BUDGET = {"type": "integer", "description": f"Most chars to return inline. Default {store.DEFAULT_BUDGET_CHARS}."}
REPO = {"type": "string", "description": "Repo path or key. Optional when one model exists."}

TOOLS = [
    {
        "name": "overview",
        "description": (
            "Start here. Returns the short index of a repo's system model: the commit, whether it is "
            "stale, one line per table, the riskiest modules, and any worktrees that overlap."
        ),
        "inputSchema": {"type": "object", "properties": {"repo": REPO}},
    },
    {
        "name": "plan",
        "description": (
            "Answer 'what is not built?'. Lists each plan from the repo's specs, worst first, with "
            "its status and what it names that does not exist yet. Filter by status."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "status": {"type": "string", "enum": ["planned", "partial", "unclear", "built"]},
                "repo": REPO,
                "budget_chars": BUDGET,
            },
        },
    },
    {
        "name": "risk",
        "description": (
            "Answer 'where is a change most likely to hurt?'. Lists code that changes often, has many "
            "paths and few tests, worst first, with commits, complexity and coverage for each."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "level": {"type": "string", "enum": ["modules", "files"], "description": "Default modules."},
                "all": {"type": "boolean", "description": "Every row, not only the hot and untested."},
                "limit": {"type": "integer", "description": "Most rows to return. Default 15."},
                "repo": REPO,
                "budget_chars": BUDGET,
            },
        },
    },
    {
        "name": "worktrees",
        "description": (
            "Live: what each git worktree is changing, and where two of them collide. A conflict comes "
            "from a real trial merge. Two worktrees on one table raise a warning. Pass a node id to see "
            "only who is working on it. Check this before changing something others may be changing."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "node": {"type": "string", "description": "Only this node, for example table:public.users."},
                "repo": REPO,
                "budget_chars": BUDGET,
            },
        },
    },
    {
        "name": "coverage",
        "description": (
            "Load a test coverage report (coverage-final.json or lcov.info) so `risk` uses real numbers. "
            "Omit `report` to read the one in the repo's coverage folder. Give `commit` if the tests ran "
            "somewhere other than a checkout of this repo. Never changes the repo."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "report": {"type": "string", "description": "Path to the report."},
                "commit": {"type": "string", "description": "The commit the tests ran on."},
                "repo": REPO,
            },
        },
    },
    {
        "name": "propose",
        "description": (
            "Save a what-if as a draft, or test one with dry_run. It never touches the repo. Returns "
            "a diff against today, its limits and its SQL. Each change has an op: add_table, add_column, "
            "change_column, drop_column, drop_table, add_index, add_enum_value, add_module, add_route, "
            "add_job, add_service. A column is {name, type, nullable, default, primary, unique, "
            "references, on_delete, index}. Only a person can accept a draft."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "why": {"type": "string"},
                "changes": {"type": "array", "items": {"type": "object"}},
                "id": {"type": "string", "description": "Update this draft instead of making a new one."},
                "dry_run": {"type": "boolean", "description": "Check it and save nothing."},
                "repo": REPO,
                "budget_chars": BUDGET,
            },
            "required": ["title", "changes"],
        },
    },
    {
        "name": "proposals",
        "description": "List what-if proposals, or read one by id with its diff, limits and SQL.",
        "inputSchema": {
            "type": "object",
            "properties": {"id": {"type": "string"}, "repo": REPO, "budget_chars": BUDGET},
        },
    },
    {
        "name": "use_case",
        "description": (
            "Save what someone needs to do, mapped to its routes, tables and modules, and get its gaps "
            "back. A part that does not exist yet is a gap, so name it anyway. needs tests the schema: "
            "{need: field|optional, table, column}, {need: value, table, column, value}, "
            "{need: duplicate, table, columns}, {need: has_many, parent, child}. tables takes a name, "
            "or {table, access: write}."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "actor": {"type": "string"},
                "goal": {"type": "string"},
                "routes": {"type": "array", "items": {"type": "string"}},
                "tables": {"type": "array"},
                "modules": {"type": "array", "items": {"type": "string"}},
                "needs": {"type": "array", "items": {"type": "object"}},
                "evidence": {"type": "array", "items": {"type": "string"}},
                "id": {"type": "string", "description": "Update this use case."},
                "repo": REPO,
            },
            "required": ["title"],
        },
    },
    {
        "name": "use_cases",
        "description": "List use cases with their parts and gaps: what is missing, untested or not supported.",
        "inputSchema": {
            "type": "object",
            "properties": {"id": {"type": "string"}, "repo": REPO, "budget_chars": BUDGET},
        },
    },
    {
        "name": "save_view",
        "description": (
            "Save a view the app can draw, when someone asks for a picture. It filters the model, so "
            "unknown ids are refused. Filter with nodes, around (a node and its neighbours), area, kinds "
            "or risk (hot, hot_untested). level is map or data. overlays can switch on risk, worktrees and "
            "plans. proposal lays a proposal over it. layout is left-right or top-down."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "note": {"type": "string"},
                "level": {"type": "string", "enum": ["map", "data"]},
                "layout": {"type": "string", "enum": ["left-right", "top-down"]},
                "nodes": {"type": "array", "items": {"type": "string"}},
                "around": {"type": "string"},
                "area": {"type": "string"},
                "kinds": {"type": "array", "items": {"type": "string"}},
                "risk": {"type": "string", "enum": ["hot", "hot_untested"]},
                "overlays": {"type": "object"},
                "proposal": {"type": "string"},
                "id": {"type": "string", "description": "Update this view."},
                "repo": REPO,
            },
            "required": ["title"],
        },
    },
    {
        "name": "node",
        "description": (
            "Read one node with its links and notes. Ids look like table:public.users, "
            "module:src/agents, area:src/agents, route:/desk, job:renewals, service:anthropic, plan:inbox."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {"id": {"type": "string"}, "repo": REPO, "budget_chars": BUDGET},
            "required": ["id"],
        },
    },
    {
        "name": "neighbors",
        "description": "List what a node links to and what links to it, for any kind of node.",
        "inputSchema": {
            "type": "object",
            "properties": {"id": {"type": "string"}, "repo": REPO, "budget_chars": BUDGET},
            "required": ["id"],
        },
    },
    {
        "name": "search",
        "description": "Find nodes by name, column or foreign key target, across every kind. Returns ids only.",
        "inputSchema": {
            "type": "object",
            "properties": {"query": {"type": "string"}, "repo": REPO, "limit": {"type": "integer"}},
            "required": ["query"],
        },
    },
    {
        "name": "findings",
        "description": (
            "List rule checks on the model, such as a foreign key with no index or a table "
            "without RLS. Filter by node or severity. Each finding cites file and line."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "node": {"type": "string", "description": "Only this node, for example table:public.users."},
                "severity": {"type": "string", "enum": ["high", "medium", "low", "info"]},
                "repo": REPO,
                "budget_chars": BUDGET,
            },
        },
    },
    {
        "name": "export_all",
        "description": (
            "Write every table in the model to one file and return its path. Use this for a job "
            "that needs the whole schema, then read the file in parts."
        ),
        "inputSchema": {"type": "object", "properties": {"repo": REPO}},
    },
    {
        "name": "note",
        "description": (
            "Save a finding on a node as a file. Needs at least one evidence entry, as a repo "
            "path or path:line. Notes never change Facts."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "id": {"type": "string"},
                "text": {"type": "string"},
                "evidence": {"type": "array", "items": {"type": "string"}},
                "repo": REPO,
            },
            "required": ["id", "text", "evidence"],
        },
    },
    {
        "name": "build",
        "description": "Rebuild the Facts layer for a repo from its migrations. Keeps notes.",
        "inputSchema": {
            "type": "object",
            "properties": {"repo_path": {"type": "string"}},
            "required": ["repo_path"],
        },
    },
]


def compact(value: object) -> str:
    """JSON for a model to read: no spaces, since every char is context."""
    return json.dumps(value, separators=(",", ":"))


def call(name: str, args: dict) -> object:
    budget = int(args.get("budget_chars") or store.DEFAULT_BUDGET_CHARS)
    if name == "build":
        manifest = store.build(Path(args["repo_path"]).expanduser())
        keys = ("repo_key", "ref", "commit", "version", "counts", "unchanged")
        return {k: manifest[k] for k in keys if k in manifest}

    target = store.resolve_repo(args.get("repo"))
    if name == "overview":
        state = store.worktree_state(target)
        return {
            "text": (store.current(target) / "overview.md").read_text(encoding="utf-8"),
            "freshness": store.freshness(target),
            "facts_changed_since_build": store.verify_facts(target),
            "model_dir": str(store.current(target)),
            "hot_and_untested": [row["id"] for row in risk.worst(store.load_risk(target), "modules", 5)],
            "worktree_overlaps": [row["summary"] for row in state["overlaps"] if row["severity"] in ("high", "medium")],
        }
    if name == "risk":
        ranked = store.load_risk(target)
        level = args.get("level") or "modules"
        if level not in ("modules", "files"):
            raise ValueError("level must be modules or files")
        limit = int(args.get("limit") or 15)
        rows = ranked[level][:limit] if args.get("all") else risk.worst(ranked, level, limit)
        keep = ("id", "path", "lines", "complexity", "commits", "covered", "branches", "tests", "reached_files", "hot", "untested", "score")
        meta = {key: ranked[key] for key in ("window_days", "history_known", "shallow", "test_files")}
        loaded = ranked["coverage"]
        meta["coverage"] = {key: loaded[key] for key in ("commit", "lines_hit", "lines_total", "files_changed_since")} if loaded else None
        body = {**meta, level: [{key: row[key] for key in keep if key in row} for row in rows]}
        return store.fit(target, "risk", compact(body), budget)
    if name == "worktrees":
        state = store.worktree_state(target)
        wanted = args.get("node")
        if wanted:
            names = state["by_node"].get(wanted, [])
            overlaps = [row for row in state["overlaps"] if row["a"] in names and row["b"] in names]
            return store.fit(target, "worktrees", compact({"node": wanted, "worktrees": names, "overlaps": overlaps}), budget)
        body = {key: state[key] for key in ("ref", "commit", "counts", "overlaps", "worktrees")}
        return store.fit(target, "worktrees", compact(body), budget)
    if name == "coverage":
        return store.set_coverage(target, args.get("report"), args.get("commit"))
    if name == "propose":
        found = explore.save_proposal(target, args["title"], args.get("why", ""), args["changes"], args.get("id"), bool(args.get("dry_run")))
        return store.fit(target, "proposal", compact(found), budget)
    if name == "proposals":
        if args.get("id"):
            found = explore.read_proposal(target, args["id"])
            keep = ("id", "title", "why", "status", "changes", "diff", "limits", "counts", "sql")
            return store.fit(target, "proposal", compact({key: found[key] for key in keep}), budget)
        return store.fit(target, "proposals", compact(explore.proposal_rows(target)), budget)
    if name == "use_case":
        body = {key: value for key, value in args.items() if key not in ("id", "repo")}
        return store.fit(target, "use-case", compact(explore.save_use_case(target, body, args.get("id"))), budget)
    if name == "use_cases":
        rows = explore.use_case_rows(target)
        chosen = [row for row in rows if row["id"] == args["id"]] if args.get("id") else rows
        return store.fit(target, "use-cases", compact(chosen), budget)
    if name == "save_view":
        body = {key: value for key, value in args.items() if key not in ("id", "repo")}
        return store.fit(target, "view", compact(explore.save_view(target, body, args.get("id"))), budget)
    if name == "findings":
        found = [
            finding
            for finding in store.load_findings(target)
            if (not args.get("node") or finding["node"] == args["node"])
            and (not args.get("severity") or finding["severity"] == args["severity"])
        ]
        return store.fit(target, "findings", compact(found), budget)
    if name == "plan":
        items = [
            {
                "id": plan["id"],
                "name": plan["name"],
                "status": plan["status"],
                "status_source": plan["status_source"],
                "found": plan["found"],
                "missing": plan["missing"],
                "not_found": [claim["claim"] for claim in plan["claims"] if not claim["found"]],
                "spec": plan["path"],
            }
            for plan in store.plan_items(target, args.get("status"))
        ]
        return store.fit(target, "plan", compact(items), budget)
    if name == "node":
        return store.fit(target, "node", compact(store.load_node(target, args["id"])), budget)
    if name == "neighbors":
        return store.fit(target, "neighbors", compact(store.neighbors(target, args["id"])), budget)
    if name == "search":
        return store.search(target, args["query"], int(args.get("limit") or 20))
    if name == "export_all":
        parts = [p.read_text(encoding="utf-8") for p in sorted((store.current(target) / "tables").glob("*.json"))]
        return store.fit(target, "all-tables", "\n".join(parts), budget)
    if name == "note":
        return store.add_note(target, args["id"], args["text"], list(args["evidence"]))
    raise KeyError(f"unknown tool {name!r}")


def respond(request: dict) -> dict | None:
    method, request_id = request.get("method"), request.get("id")
    if request_id is None:
        return None
    if method == "initialize":
        result: dict = {
            "protocolVersion": PROTOCOL_VERSION,
            "capabilities": {"tools": {}},
            "serverInfo": {"name": "system-map", "version": "0.4.0"},
        }
    elif method == "ping":
        result = {}
    elif method == "tools/list":
        result = {"tools": TOOLS}
    elif method == "tools/call":
        params = request.get("params") or {}
        try:
            value = call(params.get("name", ""), params.get("arguments") or {})
            text = value if isinstance(value, str) else compact(value)
            result = {"content": [{"type": "text", "text": text}]}
        except (KeyError, ValueError, OSError) as error:
            result = {"content": [{"type": "text", "text": str(error)}], "isError": True}
    else:
        return {"jsonrpc": "2.0", "id": request_id, "error": {"code": -32601, "message": f"no method {method}"}}
    return {"jsonrpc": "2.0", "id": request_id, "result": result}


def main() -> None:
    for line in sys.stdin:
        if not line.strip():
            continue
        try:
            reply = respond(json.loads(line))
        except json.JSONDecodeError:
            reply = {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "bad JSON"}}
        if reply is not None:
            sys.stdout.write(json.dumps(reply) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    main()
