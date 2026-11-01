"""Command line for the model.

    python3 -m core build <repo> [ref]
    python3 -m core stats <repo>
    python3 -m core verify <repo> <catalog.json>
    python3 -m core verify-code <repo> <truth.json>
"""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

from . import store, verify
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


def main(argv: list[str]) -> int:
    if len(argv) >= 2 and argv[0] == "build":
        return build(Path(argv[1]).expanduser(), argv[2] if len(argv) > 2 else None)
    if len(argv) == 2 and argv[0] == "stats":
        return stats(Path(argv[1]).expanduser())
    if len(argv) == 3 and argv[0] == "verify":
        return check(Path(argv[1]).expanduser(), Path(argv[2]))
    if len(argv) == 3 and argv[0] == "verify-code":
        return check_code(Path(argv[1]).expanduser(), Path(argv[2]))
    print(__doc__, file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
