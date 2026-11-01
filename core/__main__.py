"""Command line for the model.

    python3 -m core build <repo> [ref]
    python3 -m core stats <repo>
    python3 -m core verify <repo> <catalog.json>
    python3 -m core verify-sqlite <repo>
    python3 -m core verify-code <repo> <truth.json>
    python3 -m core coverage <repo> [report] [commit]
    python3 -m core risk <repo>
    python3 -m core worktrees <repo>
    python3 -m core verify-risk <repo> <truth.json> <coverage-summary.json>
    python3 -m core proposal-sql <changes.json> <folder>
    python3 -m core verify-proposal <repo> <changes.json> <results.json>
"""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

from . import explore, proposals, risk, store, verify
from .extractors import sqlite
from .sources import open_source


def build(repo_root: Path, ref: str | None) -> int:
    manifest = store.build(repo_root, ref=ref)
    keys = ("repo_key", "ref", "commit", "version", "counts", "stats", "unchanged")
    print(json.dumps({k: manifest[k] for k in keys if k in manifest}, indent=2))
    return 0


def stats(repo_root: Path) -> int:
    folder = store.current(store.repo_dir(repo_root))
    files = sorted((folder / "tables").glob("*.json"), key=lambda p: p.stat().st_size)
    sizes = [p.stat().st_size for p in files]
    print(
        json.dumps(
            {
                "tables": len(files),
                "facts_chars_total": sum(sizes),
                "facts_chars_median": sizes[len(sizes) // 2],
                "facts_chars_largest": sizes[-1],
                "largest": files[-1].stem,
                "overview_chars": (folder / "overview.md").stat().st_size,
                "findings_chars": (folder / "findings.json").stat().st_size,
            },
            indent=2,
        )
    )
    return 0


def check(repo_root: Path, catalog: Path) -> int:
    diffs = verify.verify(repo_root, catalog)
    target = store.repo_dir(repo_root)
    manifest = store.read_manifest(target)
    source = open_source(Path(manifest["repo"]), manifest["commit"])
    folder = store.current(target)
    shards = [json.loads(p.read_text(encoding="utf-8")) for p in sorted((folder / "tables").glob("*.json"))]
    contents = source.read_many(sorted(manifest["inputs"]))
    bad_lines = verify.source_lines_name_their_facts(shards, contents.__getitem__)
    print(json.dumps({"differences": len(diffs), "by_kind": Counter(d["what"] for d in diffs), "bad_source_lines": len(bad_lines)}, indent=2))
    for diff in diffs[:40]:
        print(json.dumps(diff))
    for bad in bad_lines[:20]:
        print(json.dumps(bad))
    return 1 if diffs or bad_lines else 0


def check_code(repo_root: Path, truth_path: Path) -> int:
    """Compare imports, table calls and routes with the compiler's answer."""
    target = store.repo_dir(repo_root)
    manifest = store.read_manifest(target)
    folder = store.current(target)
    model = json.loads((folder / "imports.json").read_text(encoding="utf-8"))
    truth = json.loads(truth_path.read_text(encoding="utf-8"))
    diffs = verify.compare_imports(model["imports"], truth["imports"])
    diffs += verify.compare_table_calls(model["table_calls"], truth["tableCalls"])
    source = open_source(Path(manifest["repo"]), manifest["commit"])
    tree_file = "src/routeTree.gen.ts"
    routes = 0
    if tree_file in source.blobs:
        tree = verify.route_tree_paths(source.read_many([tree_file])[tree_file])
        routes = len(tree)
        diffs += verify.compare_routes(store.load_system(target)["nodes"], tree)
    edges = sum(len(found) for found in model["imports"].values())
    print(json.dumps({"import_links": edges, "routes_in_tree": routes, "differences": len(diffs), "by_kind": Counter(d["what"] for d in diffs)}, indent=2))
    for diff in diffs[:40]:
        print(json.dumps(diff))
    return 1 if diffs else 0


def load_coverage(repo_root: Path, report: str | None, commit: str | None) -> int:
    print(json.dumps(store.set_coverage(store.repo_dir(repo_root), report, commit), indent=2))
    return 0


def show_risk(repo_root: Path) -> int:
    ranked = store.load_risk(store.repo_dir(repo_root))
    print(json.dumps({"coverage": ranked["coverage"], "test_files": ranked["test_files"]}, indent=2))
    keep = ("commits", "complexity", "cover", "hot", "untested", "score")
    for level, name in (("modules", "id"), ("files", "path")):
        print(f"\n{level}: hot and untested")
        for row in risk.worst(ranked, level):
            print(row[name], {key: row[key] for key in keep})
    return 0


def show_worktrees(repo_root: Path) -> int:
    state = store.worktree_state(store.repo_dir(repo_root))
    for item in state["worktrees"]:
        print(f"{item['name']}: +{item['ahead']} -{item['behind']}, {len(item['files'])} files, {len(item['modules'])} modules")
    print(json.dumps(state["counts"]))
    for row in state["overlaps"]:
        print(f"[{row['severity']}] {row['summary']}")
    return 0


def check_risk(repo_root: Path, truth_path: Path, summary_path: Path) -> int:
    """Compare complexity with the compiler, churn with git, and coverage with the test runner."""
    target = store.repo_dir(repo_root)
    manifest = store.read_manifest(target)
    folder = store.current(target)
    truth = json.loads(truth_path.read_text(encoding="utf-8"))["complexity"]
    ours = json.loads((folder / "imports.json").read_text(encoding="utf-8"))["complexity"]
    complexity = verify.compare_complexity(ours, truth)
    facts = json.loads((folder / "risk.json").read_text(encoding="utf-8"))
    churn = verify.compare_churn(facts, Path(manifest["repo"]), manifest["commit"])
    record = store.load_coverage(target)
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    tested = verify.compare_coverage(record["files"], summary) if record else []
    print(json.dumps({"complexity": complexity["summary"], "churn_differences": len(churn), "coverage_differences": len(tested)}, indent=2))
    for diff in (complexity["worst"] + churn + tested)[:30]:
        print(json.dumps(diff))
    return 1 if churn or tested or not complexity["summary"]["close_enough"] else 0


def proposal_sql(changes_path: Path, folder: Path) -> int:
    """Write one SQL file per change, for `scripts/try_proposal.sh` to run."""
    folder.mkdir(parents=True, exist_ok=True)
    changes = [proposals.validate(change) for change in json.loads(changes_path.read_text(encoding="utf-8"))]
    written = 0
    for index, change in enumerate(changes):
        statements = proposals.to_sql(change)
        if statements:
            (folder / f"{index:03}.sql").write_text("\n".join(statements) + "\n", encoding="utf-8")
            written += 1
    print(f"wrote {written} files to {folder}")
    return 0


def check_proposal(repo_root: Path, changes_path: Path, results_path: Path) -> int:
    """Compare each change's verdict with what a real Postgres did."""
    target = store.repo_dir(repo_root)
    changes = [proposals.validate(change) for change in json.loads(changes_path.read_text(encoding="utf-8"))]
    found = explore.evaluate(target, {"changes": changes}, live=False)["limits"]
    refused = {limit["change"] for limit in found if limit["kind"] == "refused"}
    results = json.loads(results_path.read_text(encoding="utf-8"))
    diffs = [
        {"change": row["change"], "op": changes[row["change"]]["op"], "model": "refused" if row["change"] in refused else "accepted", "postgres": row["error"] or "accepted"}
        for row in results
        if (row["change"] in refused) == row["accepted"]
    ]
    print(json.dumps({"changes": len(results), "refused_by_postgres": sum(1 for row in results if not row["accepted"]), "differences": len(diffs)}, indent=2))
    for diff in diffs:
        print(json.dumps(diff))
    return 1 if diffs else 0


def check_sqlite(repo_root: Path) -> int:
    """Load the repo's schema into a separate real SQLite, and compare it with the model."""
    source = open_source(repo_root)
    shards = sqlite.extract(source)["nodes"]
    truth = sqlite.replay_source(source).connection
    found = sqlite.differences(shards, truth)
    for line in found:
        print(line)
    print(f"{len(shards)} tables, {len(found)} differences")
    return 1 if found else 0


def main(argv: list[str]) -> int:
    if len(argv) == 3 and argv[0] == "proposal-sql":
        return proposal_sql(Path(argv[1]), Path(argv[2]))
    if len(argv) == 4 and argv[0] == "verify-proposal":
        return check_proposal(Path(argv[1]).expanduser(), Path(argv[2]), Path(argv[3]))
    if len(argv) >= 2 and argv[0] == "build":
        return build(Path(argv[1]).expanduser(), argv[2] if len(argv) > 2 else None)
    if len(argv) == 2 and argv[0] == "stats":
        return stats(Path(argv[1]).expanduser())
    if len(argv) == 3 and argv[0] == "verify":
        return check(Path(argv[1]).expanduser(), Path(argv[2]))
    if len(argv) == 2 and argv[0] == "verify-sqlite":
        return check_sqlite(Path(argv[1]).expanduser())
    if len(argv) == 3 and argv[0] == "verify-code":
        return check_code(Path(argv[1]).expanduser(), Path(argv[2]))
    if len(argv) >= 2 and argv[0] == "coverage":
        return load_coverage(Path(argv[1]).expanduser(), argv[2] if len(argv) > 2 else None, argv[3] if len(argv) > 3 else None)
    if len(argv) == 2 and argv[0] == "risk":
        return show_risk(Path(argv[1]).expanduser())
    if len(argv) == 2 and argv[0] == "worktrees":
        return show_worktrees(Path(argv[1]).expanduser())
    if len(argv) == 4 and argv[0] == "verify-risk":
        return check_risk(Path(argv[1]).expanduser(), Path(argv[2]), Path(argv[3]))
    print(__doc__, file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
