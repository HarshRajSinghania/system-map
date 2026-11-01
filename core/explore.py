"""Proposals, use cases and saved views: the Intent layer's working files.

These live in `intent/` in app data, and a rebuild leaves them alone. Agents write drafts.
Only a person accepts or drops a proposal, so that stays out of the agent tools.
"""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

from . import limits, proposals, risk, store, use_cases, views
from .sources import open_source

KINDS = ("proposals", "use_cases", "views")
#: A person sets these. An agent can only write a draft.
PROPOSAL_STATUSES = ("draft", "accepted", "dropped")


def _folder(target: Path, kind: str) -> Path:
    if kind not in KINDS:
        raise ValueError(f"kind must be one of {', '.join(KINDS)}")
    return target / "intent" / kind


def _path(target: Path, kind: str, item_id: str) -> Path:
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", item_id or ""):
        raise KeyError(f"no {kind} {item_id!r}")
    return _folder(target, kind) / f"{item_id}.json"


def list_items(target: Path, kind: str) -> list[dict]:
    folder = _folder(target, kind)
    rows = [json.loads(path.read_text(encoding="utf-8")) for path in folder.glob("*.json")] if folder.is_dir() else []
    return sorted(rows, key=lambda row: (-row.get("updated_at", 0), row["id"]))


def get_item(target: Path, kind: str, item_id: str) -> dict:
    path = _path(target, kind, item_id)
    if not path.is_file():
        raise KeyError(f"no {kind} {item_id!r}")
    return json.loads(path.read_text(encoding="utf-8"))


def _save(target: Path, kind: str, body: dict, item_id: str | None) -> dict:
    now = int(time.time())
    if item_id:
        record = {**get_item(target, kind, item_id), **body, "updated_at": now}
    else:
        base = proposals.slug(body["title"])
        taken = {row["id"] for row in list_items(target, kind)}
        name, count = base, 1
        while name in taken:
            count += 1
            name = f"{base}-{count}"
        record = {"id": name, **body, "created_at": now, "updated_at": now}
    store._write_json(_path(target, kind, record["id"]), record)
    return record


def delete_item(target: Path, kind: str, item_id: str) -> dict:
    path = _path(target, kind, item_id)
    if not path.is_file():
        raise KeyError(f"no {kind} {item_id!r}")
    path.unlink()
    return {"id": item_id, "deleted": True}


def _model(target: Path) -> tuple[list[dict], list[dict], dict, dict]:
    folder = store.current(target)
    shards = [json.loads(path.read_text(encoding="utf-8")) for path in sorted((folder / "tables").glob("*.json"))]
    types = json.loads((folder / "types.json").read_text(encoding="utf-8"))
    code = json.loads((folder / "imports.json").read_text(encoding="utf-8"))
    return shards, types, store.load_system(target), code


def _code_uses(target: Path, changes: list[dict], code: dict) -> dict[str, list[str]]:
    """Where code names each column a proposal removes, in the files that call its table."""
    wanted = [(proposals.qualified(c["table"]), c["column"]) for c in changes if c["op"] == "drop_column"]
    if not wanted:
        return {}
    manifest = store.read_manifest(target)
    source = open_source(Path(manifest["repo"]), manifest["commit"] or None)
    found: dict[str, list[str]] = {}
    for key, column in wanted:
        short = key.removeprefix("public.")
        paths = [path for path, calls in code["table_calls"].items() if any(call["table"] == short for call in calls)]
        for path, text in source.read_many(paths).items():
            for number, line in enumerate(text.splitlines(), 1):
                if re.search(rf"\b{re.escape(column)}\b", line):
                    found.setdefault(f"{key}.{column}", []).append(f"{path}:{number}")
    return found


def _graph_rows(after: dict, before: dict, externals: list[dict]) -> dict:
    """The diagram's data with a proposal laid over it, each table marked by what happened."""
    drawn = list(after.values()) + [table for key, table in before.items() if key not in after]
    graph = store.graph_of(drawn, externals)
    old = {key: {column["name"] for column in table["columns"]} for key, table in before.items()}
    by_id = {table["id"]: key for key, table in {**before, **after}.items()}
    for row in graph["tables"]:
        key = by_id.get(row["id"])
        if key in before and key not in after:
            row["status"] = "removed"
        elif key in after and key not in before:
            row["status"] = "proposed"
        elif key in after and before[key] != after[key]:
            row["status"] = "changed"
        for column in row["columns"]:
            column["proposed"] = key in old and key in after and column["name"] not in old[key]
    return graph


def _advice(found: list[dict], moved: list[dict], ranked: dict, state: dict | None) -> list[dict]:
    """What is worth knowing about the parts a proposal reaches, from risk and worktrees."""
    rows = {row["id"]: row for row in ranked["modules"]}
    notes = []
    for item in moved:
        row = rows.get(item["id"])
        if row and row["hot"] and row["untested"]:
            notes.append(
                {"check": "touches_hot_code", "kind": "advice", "severity": "low", "node": item["id"], "title": f"{item['id'].split('/')[-1]} is hot and untested", "detail": f"{row['commits']} commits, with tests on {round(row['cover'] * 100)}% of it.", "evidence": item.get("evidence", []), "change": None}
            )
    names = (state or {}).get("by_node", {})
    for node in sorted({item["id"] for item in moved}):
        if names.get(node):
            notes.append(
                {"check": "worktree_on_it", "kind": "advice", "severity": "medium", "node": node, "title": f"{', '.join(names[node])} is changing {node.split(':', 1)[-1]}", "detail": "Merge that first, or this will collide with it.", "evidence": [], "change": None}
            )
    return found + notes


def evaluate(target: Path, body: dict, live: bool = True) -> dict:
    """Lay a proposal over the model, then return its diff, limits and SQL."""
    shards, type_rows, system, code = _model(target)
    changes = body["changes"]
    tables, types = proposals.working_copy(shards, type_rows)
    before, _ = proposals.working_copy(shards, type_rows)
    found, after = limits.check_all(changes, tables, types, system, _code_uses(target, changes, code))
    lay = proposals.overlay(changes, system)
    diff = proposals.diff(before, after, lay, system)
    ranked = store.load_risk(target)
    moved = diff["touched"] + diff["changed"] + diff["removed"]
    found = _advice(found, moved, ranked, store.worktree_state(target) if live else None)
    externals = json.loads((store.current(target) / "externals.json").read_text(encoding="utf-8"))
    return {
        **body,
        "diff": diff,
        "limits": found,
        "counts": {name: sum(1 for limit in found if limit["kind"] == name) for name in ("refused", "breaks", "cannot_support", "advice")},
        "sql": [{"change": index, "sql": proposals.to_sql(change)} for index, change in enumerate(changes)],
        "overlay": lay,
        "graph": _graph_rows(after, before, externals),
    }


def _changes(raw: object) -> list[dict]:
    if not isinstance(raw, list) or not raw:
        raise ValueError("a proposal needs a list of changes")
    return [proposals.validate(change) for change in raw]


def save_proposal(target: Path, title: str, why: str, raw: list, item_id: str | None = None, dry_run: bool = False) -> dict:
    """Save a draft, or with `dry_run` only say what it would do. Returns its diff and limits."""
    if not str(title or "").strip():
        raise ValueError("a proposal needs a title")
    body = {"title": title.strip(), "why": str(why or ""), "changes": _changes(raw)}
    if item_id and get_item(target, "proposals", item_id).get("status") != "draft":
        raise ValueError("only a person can change a proposal once it is accepted or dropped")
    manifest = store.read_manifest(target)
    body |= {"base_commit": manifest["commit"], "status": "draft"}
    result = evaluate(target, {"id": item_id or "(dry run)", **body})
    if not dry_run:
        record = _save(target, "proposals", body, item_id)
        result["id"] = record["id"]
    return {key: result[key] for key in ("id", "title", "status", "diff", "limits", "counts", "sql")}


def read_proposal(target: Path, item_id: str) -> dict:
    return evaluate(target, get_item(target, "proposals", item_id))


def set_status(target: Path, item_id: str, status: str) -> dict:
    """A person's call. No agent tool reaches this."""
    if status not in PROPOSAL_STATUSES:
        raise ValueError(f"status must be one of {', '.join(PROPOSAL_STATUSES)}")
    record = get_item(target, "proposals", item_id)
    store._write_json(_path(target, "proposals", item_id), {**record, "status": status, "updated_at": int(time.time())})
    return {"id": item_id, "status": status}


def proposal_rows(target: Path) -> list[dict]:
    """A short row for each proposal, cheap enough to poll."""
    rows = []
    for record in list_items(target, "proposals"):
        found = evaluate(target, record, live=False)
        counts = {name: len(found["diff"][name]) for name in ("added", "changed", "removed", "touched")}
        rows.append({"id": record["id"], "title": record["title"], "why": record["why"], "status": record["status"], "limits": found["counts"], "diff": counts})
    return rows


def _use_case_inputs(target: Path) -> tuple[dict, dict, dict, dict, dict]:
    shards, type_rows, system, code = _model(target)
    tables, types = proposals.working_copy(shards, type_rows)
    return system, tables, types, store.load_risk(target), risk.tests_by_file(code["imports"])


def save_use_case(target: Path, body: dict, item_id: str | None = None) -> dict:
    record = _save(target, "use_cases", use_cases.validate(body), item_id)
    system, tables, types, ranked, reach = _use_case_inputs(target)
    return use_cases.evaluate(record, system, tables, types, ranked, reach)


def use_case_rows(target: Path) -> list[dict]:
    records = list_items(target, "use_cases")
    if not records:
        return []
    system, tables, types, ranked, reach = _use_case_inputs(target)
    return [use_cases.evaluate(record, system, tables, types, ranked, reach) for record in records]


def _known_ids(target: Path) -> tuple[dict, list[str]]:
    system = store.load_system(target)
    return system, [row["id"] for row in store.table_index(target)]


def save_view(target: Path, body: dict, item_id: str | None = None) -> dict:
    system, tables = _known_ids(target)
    extra: set[str] = set()
    if body.get("proposal"):
        found = read_proposal(target, body["proposal"])
        extra = {row["id"] for row in found["diff"]["added"]}
    record = _save(target, "views", views.validate(body, {node["id"] for node in system["nodes"]} | set(tables), extra), item_id)
    return views.resolve(record, system, tables + sorted(extra), store.load_risk(target))


def view_rows(target: Path) -> list[dict]:
    records = list_items(target, "views")
    if not records:
        return []
    system, tables = _known_ids(target)
    ranked = store.load_risk(target)
    return [views.resolve(record, system, tables, ranked) for record in records]


def summary(target: Path) -> dict:
    return {"proposals": proposal_rows(target), "use_cases": use_case_rows(target), "views": view_rows(target)}
