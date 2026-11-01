"""Compare the model with what a real Postgres says.

`scripts/replay_catalog.sh` applies every migration to a throwaway server and writes its
catalog as JSON. This module reports each place the model and that catalog disagree.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from . import store

DELETE_RULES = {"a": "no action", "r": "restrict", "c": "cascade", "n": "set null", "d": "set default"}
COMMANDS = {"r": "select", "a": "insert", "w": "update", "d": "delete", "*": "all"}
CONSTRAINT_KINDS = {"p": "primary_key", "u": "unique", "f": "foreign_key", "c": "check", "x": "exclude"}
TYPE_ALIASES = {
    "int": "integer",
    "int4": "integer",
    "int8": "bigint",
    "int2": "smallint",
    "bool": "boolean",
    "timestamptz": "timestamp with time zone",
    "timestamp": "timestamp without time zone",
    "timetz": "time with time zone",
    "time": "time without time zone",
    "varchar": "character varying",
    "decimal": "numeric",
    "float8": "double precision",
    "float4": "real",
    "serial": "integer",
    "bigserial": "bigint",
}


def normal_type(text: str) -> str:
    value = " ".join(text.lower().replace('"', "").split())
    value = value.replace("public.", "").replace("extensions.", "")
    value = re.sub(r"\s*,\s*", ",", value)
    array = value.endswith("[]")
    base = value[:-2] if array else value
    match = re.fullmatch(r"([a-z0-9_ ]+?)\s*(\(.*\))?", base)
    if match:
        base = TYPE_ALIASES.get(match.group(1), match.group(1)) + (match.group(2) or "")
    return base + ("[]" if array else "")


def _index_column(text: str) -> str:
    value = text.lower().replace('"', "").replace(" ", "")
    value = re.sub(r"::[a-z_ ]+(\[\])?", "", value)
    return value


def _compare_sets(diffs: list[dict], table: str, what: str, model: set, real: set) -> None:
    for item in sorted(model - real, key=str):
        diffs.append({"table": table, "what": what, "only_in": "model", "item": item})
    for item in sorted(real - model, key=str):
        diffs.append({"table": table, "what": what, "only_in": "postgres", "item": item})


def _compare_table(diffs: list[dict], shard: dict, real: dict) -> None:
    label = f"{shard['schema']}.{shard['name']}"
    if shard["rls"] != real["rls"]:
        diffs.append({"table": label, "what": "rls", "model": shard["rls"], "postgres": real["rls"]})

    _compare_sets(
        diffs,
        label,
        "column",
        {(c["name"], normal_type(c["type"]), c["nullable"]) for c in shard["columns"]},
        {(c["name"], normal_type(c["type"]), c["nullable"]) for c in real["columns"] or []},
    )
    _compare_sets(
        diffs,
        label,
        "default",
        {c["name"] for c in shard["columns"] if c["default"] or c["generated"]},
        {c["name"] for c in real["columns"] or [] if c["has_default"]},
    )
    _compare_sets(
        diffs,
        label,
        "constraint",
        {(c["name"], c["kind"], tuple(c.get("columns", []))) for c in shard["constraints"] if c["kind"] != "check"},
        {
            (c["name"], CONSTRAINT_KINDS[c["kind"]], tuple(c["columns"] or []))
            for c in real["constraints"] or []
            if c["kind"] != "c"
        },
    )
    _compare_sets(
        diffs,
        label,
        "check",
        {c["name"] for c in shard["constraints"] if c["kind"] == "check"},
        {c["name"] for c in real["constraints"] or [] if c["kind"] == "c"},
    )
    _compare_sets(
        diffs,
        label,
        "foreign_key",
        {
            (c["name"], c["references"], tuple(c["reference_columns"]), c["on_delete"], c["on_update"])
            for c in shard["constraints"]
            if c["kind"] == "foreign_key"
        },
        {
            (
                c["name"],
                c["references"],
                tuple(c["reference_columns"]),
                DELETE_RULES[c["on_delete"]],
                DELETE_RULES[c["on_update"]],
            )
            for c in real["constraints"] or []
            if c["kind"] == "f"
        },
    )
    _compare_sets(
        diffs,
        label,
        "index",
        {
            (i["name"], i["unique"], i["partial"], tuple(_index_column(c) for c in i["columns"]))
            for i in shard["indexes"]
        },
        {
            (i["name"], i["unique"], i["partial"], tuple(_index_column(c) for c in i["columns"]))
            for i in real["indexes"] or []
            if not i["constraint"]
        },
    )
    _compare_sets(
        diffs,
        label,
        "policy",
        {(p["name"], p["command"], tuple(sorted(p["roles"]))) for p in shard["policies"]},
        {(p["name"], COMMANDS[p["command"]], tuple(sorted(p["roles"]))) for p in real["policies"] or []},
    )
    _compare_sets(
        diffs,
        label,
        "trigger",
        {(t["name"], t["timing"], tuple(sorted(t["events"])), t["function"]) for t in shard["triggers"]},
        {(t["name"], t["timing"], tuple(sorted(t["events"])), t["function"]) for t in real["triggers"] or []},
    )


def compare(shards: list[dict], types: list[dict], catalog: dict, schemas: tuple[str, ...] = ("public",)) -> list[dict]:
    diffs: list[dict] = []
    real = {f"{t['schema']}.{t['name']}": t for t in catalog["tables"] if t["schema"] in schemas}
    model = {f"{s['schema']}.{s['name']}": s for s in shards}
    _compare_sets(diffs, "*", "table", set(model), set(real))
    for key in sorted(set(model) & set(real)):
        _compare_table(diffs, model[key], real[key])
    _compare_sets(
        diffs,
        "*",
        "enum",
        {(t["name"], tuple(t["labels"])) for t in types},
        {(t["name"], tuple(t["labels"])) for t in catalog.get("types") or []},
    )
    return diffs


def compare_imports(model: dict[str, list[str]], truth: dict[str, list[str]]) -> list[dict]:
    """Every place the text reader and the compiler disagree about a file's imports."""
    diffs = []
    for path in sorted(set(model) | set(truth)):
        ours, theirs = set(model.get(path, [])), set(truth.get(path, []))
        for item in sorted(ours - theirs):
            diffs.append({"file": path, "what": "import", "only_in": "model", "item": item})
        for item in sorted(theirs - ours):
            diffs.append({"file": path, "what": "import", "only_in": "compiler", "item": item})
    return diffs


def compare_table_calls(model: dict[str, list[dict]], truth: dict[str, list[dict]]) -> list[dict]:
    """Compare which tables each file calls, and whether each call reads or writes."""
    diffs = []
    for path in sorted(set(model) | set(truth)):
        ours = sorted((c["table"], c["access"]) for c in model.get(path, []))
        theirs = sorted((c["table"], c["access"]) for c in truth.get(path, []))
        if ours != theirs:
            diffs.append({"file": path, "what": "table_call", "model": ours, "compiler": theirs})
    return diffs


def route_tree_paths(text: str) -> set[str]:
    """Read every full path from a TanStack `routeTree.gen.ts`."""
    block = re.search(r"interface FileRoutesByFullPath \{(.*?)\n\}", text, re.S)
    keys = re.findall(r"""^\s*'([^']+)':""", block.group(1), re.M) if block else []
    return {key.rstrip("/") or "/" for key in keys}


def compare_routes(nodes: list[dict], tree: set[str]) -> list[dict]:
    ours = {node["path"] for node in nodes if node["kind"] == "route"}
    diffs: list[dict] = []
    _compare_sets(diffs, "*", "route", ours, tree)
    return diffs


def verify(repo_root: Path, catalog_path: Path) -> list[dict]:
    target = store.repo_dir(repo_root)
    folder = store.current(target)
    shards = [json.loads(p.read_text(encoding="utf-8")) for p in sorted((folder / "tables").glob("*.json"))]
    types = json.loads((folder / "types.json").read_text(encoding="utf-8"))
    return compare(shards, types, json.loads(catalog_path.read_text(encoding="utf-8")))


def source_lines_name_their_facts(shards: list[dict], read_file) -> list[dict]:
    """Check that each fact's `path:line` really names that fact."""
    bad: list[dict] = []
    cache: dict[str, list[str]] = {}

    def check(name: str, source: str) -> None:
        path, _, line = source.rpartition(":")
        lines = cache.setdefault(path, read_file(path).splitlines())
        number = int(line)
        text = lines[number - 1].lower() if 0 < number <= len(lines) else ""
        if name.lower() not in text:
            bad.append({"fact": name, "source": source, "line": text.strip()[:100]})

    for shard in shards:
        check(shard["name"], shard["source"])
        for column in shard["columns"]:
            check(column["name"], column["source"])
        for index in shard["indexes"]:
            check(index["name"], index["source"])
        for policy in shard["policies"]:
            check(policy["name"], policy["source"])
        for trigger in shard["triggers"]:
            check(trigger["name"], trigger["source"])
    return bad
