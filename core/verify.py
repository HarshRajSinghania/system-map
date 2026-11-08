"""Compare the model with what a real Postgres says.

`scripts/replay_catalog.sh` applies every migration to a throwaway server and writes its
catalog as JSON. This module reports each place the model and that catalog disagree.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from . import store
from .extractors.postgres import normal_type
from .sources import run_git

DELETE_RULES = {"a": "no action", "r": "restrict", "c": "cascade", "n": "set null", "d": "set default"}
COMMANDS = {"r": "select", "a": "insert", "w": "update", "d": "delete", "*": "all"}
CONSTRAINT_KINDS = {"p": "primary_key", "u": "unique", "f": "foreign_key", "c": "check", "x": "exclude"}
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


def compare_sdk_agents(nodes: list[dict], edges: list[dict], truth: dict) -> dict:
    """Compare the SDK agents and hand-offs the model found with the compiler's answer.

    Agents are compared by (sdk, name), hand-offs by (from, to). Returns what matched, what
    differs, and what the compiler could not read (which is not a difference).
    """
    ours = {(node["sdk"], node["name"]): node["evidence"][0] for node in nodes if node.get("kind") == "agent" and node.get("source") == "sdk"}
    theirs: dict[tuple[str, str], str] = {}
    for agent in truth["agents"]:
        theirs.setdefault((agent["sdk"], agent["name"]), f"{agent['path']}:{agent['line']}")
    names = {node["id"]: node["name"] for node in nodes if node.get("kind") == "agent" and node.get("source") == "sdk"}
    linked = {
        (names[edge["source"]], names[edge["target"]]): edge["evidence"][0]
        for edge in edges
        if edge["kind"] == "hands_off_to" and edge["source"] in names and edge["target"] in names
    }
    cited = {(item["from"], item["to"]): f"{item['path']}:{item['line']}" for item in truth.get("hand_offs", [])}
    diffs = []
    for what, found, real in (("agent", ours, theirs), ("hand_off", linked, cited)):
        for key in sorted(found.keys() - real.keys()):
            diffs.append({"what": what, "only_in": "model", "item": list(key), "at": found[key]})
        for key in sorted(real.keys() - found.keys()):
            diffs.append({"what": what, "only_in": "compiler", "item": list(key), "at": real[key]})
    matched: dict[str, int] = {}
    for sdk, _ in ours.keys() & theirs.keys():
        matched[sdk] = matched.get(sdk, 0) + 1
    return {
        "agents_matched": dict(sorted(matched.items())),
        "hand_offs_matched": len(linked.keys() & cited.keys()),
        "unreadable": truth.get("unreadable", []),
        "differences": diffs,
    }


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


#: Text can't always tell a `?` in screen copy from a real one, so this count is held to a limit.
COMPLEXITY_TOLERANCE = 0.005


def compare_complexity(model: dict[str, int], truth: dict[str, int]) -> dict:
    """How far the text count of code paths sits from the syntax tree's count."""
    files = sorted(set(model) | set(truth))
    gaps = [
        {"file": path, "model": model.get(path, 0), "compiler": truth.get(path, 0)}
        for path in files
        if model.get(path, 0) != truth.get(path, 0)
    ]
    off = sum(abs(row["model"] - row["compiler"]) for row in gaps)
    total = sum(truth.values())
    return {
        "summary": {
            "files": len(files),
            "exact": len(files) - len(gaps),
            "model_total": sum(model.values()),
            "compiler_total": total,
            "paths_off": off,
            "share_off": round(off / total, 4) if total else 0,
            "close_enough": off <= total * COMPLEXITY_TOLERANCE,
        },
        "worst": sorted(gaps, key=lambda row: -abs(row["model"] - row["compiler"]))[:10],
    }


def _names_of(repo_root: Path, commit: str, since: int) -> dict[str, set[str]]:
    """Each file's older names, from git's list of renames."""
    done = run_git(repo_root, "log", commit, "--no-merges", "-M", "--diff-filter=R", "--name-status", "-z", f"--since=@{since}", "--format=")
    fields = [item for item in (done.stdout if done else "").replace("\n", "").split("\0") if item]
    older: dict[str, set[str]] = {}
    for at in range(0, len(fields) - 2, 3):
        older.setdefault(fields[at + 2], set()).add(fields[at + 1])
    return older


def compare_churn(facts: dict, repo_root: Path, commit: str) -> list[dict]:
    """Ask git for each file's log under every name it has had, and compare the counts.

    `--follow` would treat a copy as the same file, and so count another file's history.
    """
    since = facts["since"]
    older = _names_of(repo_root, commit, since)
    diffs = []
    for path, row in facts["files"].items():
        names, stack = {path}, [path]
        while stack:
            for name in older.get(stack.pop(), ()):
                if name not in names:
                    names.add(name)
                    stack.append(name)
        done = run_git(repo_root, "log", commit, "--no-merges", "--full-history", f"--since=@{since}", "--format=%H", "--", *sorted(names))
        real = len(done.stdout.split()) if done else None
        if real != row["commits"]:
            diffs.append({"file": path, "what": "commits", "model": row["commits"], "git": real})
    return diffs


def _suffixes(path: str) -> list[str]:
    parts = path.lstrip("/").split("/")
    return ["/".join(parts[start:]) for start in range(len(parts))]


def compare_coverage(model: dict[str, dict], summary: dict) -> list[dict]:
    """Compare each file's numbers with the test runner's own summary."""
    diffs = []
    for path, row in summary.items():
        ours = next((model[key] for key in _suffixes(path) if key in model), None)
        if path == "total" or ours is None:
            continue
        real = (row["lines"]["total"], row["lines"]["covered"], row["branches"]["total"], row["branches"]["covered"])
        mine = (ours["lines_total"], ours["lines_hit"], ours["branches_total"], ours["branches_hit"])
        if real != mine:
            diffs.append({"file": path, "what": "coverage", "model": mine, "runner": real})
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


#: Next lists these in its manifests, but they are its own or are generated files, not routes.
NEXT_INTERNAL = {"/_not-found", "/_global-error", "/_app", "/_document", "/_error", "/404", "/500"}
NEXT_GENERATED = re.compile(r"/(icon|apple-icon|favicon|opengraph-image|twitter-image|sitemap|robots|manifest)(\.\w+)?(/|$)")


def compare_next_routes(model: set[str], truth: set[str]) -> list[str]:
    """Hold the routes in the model to the ones `next build` wrote down."""
    # An intercepting route, such as `/feed/(..)photo/[id]`, shows another route's URL.
    kept = {url for url in truth if url not in NEXT_INTERNAL and not NEXT_GENERATED.search(url) and "(." not in url}
    return [f"Next has {url}, and the model doesn't" for url in sorted(kept - model)] + [
        f"the model has {url}, and Next doesn't" for url in sorted(model - kept)
    ]
