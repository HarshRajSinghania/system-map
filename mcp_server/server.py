"""System Map's MCP server: a stdlib-only stdio server, so it needs no install step.

Design rule: a tool returns a small slice or a pointer, never a whole model. Anything
over budget is written to a file and the tool returns its path.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core import store  # noqa: E402

PROTOCOL_VERSION = "2025-06-18"
BUDGET = {"type": "integer", "description": f"Most chars to return inline. Default {store.DEFAULT_BUDGET_CHARS}."}
REPO = {"type": "string", "description": "Repo path or key. Optional when one model exists."}

TOOLS = [
    {
        "name": "overview",
        "description": (
            "Start here. Returns the short index of a repo's system model: the commit, whether "
            "it is stale, and one line per table. Open a single table with `node`."
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
        return {
            "text": (store.current(target) / "overview.md").read_text(encoding="utf-8"),
            "freshness": store.freshness(target),
            "facts_changed_since_build": store.verify_facts(target),
            "model_dir": str(store.current(target)),
        }
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
            "serverInfo": {"name": "system-map", "version": "0.2.0"},
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
