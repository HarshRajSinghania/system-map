"""Command line for the model: `python3 -m core build <repo>` or `stats <repo>`."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from . import store


def stats(repo_root: Path) -> dict:
    target = store.repo_dir(repo_root)
    files = sorted((target / "facts" / "tables").glob("*.json"), key=lambda p: p.stat().st_size)
    shards = [json.loads(p.read_text(encoding="utf-8")) for p in files]
    sizes = [p.stat().st_size for p in files]
    return {
        "tables": len(files),
        "facts_chars_total": sum(sizes),
        "facts_chars_median": sizes[len(sizes) // 2],
        "facts_chars_largest": sizes[-1],
        "largest": files[-1].stem,
        "overview_chars": (target / "overview.md").stat().st_size,
        "columns": sum(len(s["columns"]) for s in shards),
        "constraints": sum(len(s["constraints"]) for s in shards),
        "indexes": sum(len(s["indexes"]) for s in shards),
        "policies": sum(len(s["policies"]) for s in shards),
        "tables_without_rls": [s["name"] for s in shards if not s["rls"]],
        "tables_without_columns": [s["name"] for s in shards if not s["columns"]],
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2 or argv[0] not in ("build", "stats"):
        print("usage: python3 -m core build|stats <repo>", file=sys.stderr)
        return 2
    repo_root = Path(argv[1]).expanduser()
    if argv[0] == "build":
        manifest = store.build(repo_root)
        print(json.dumps({k: manifest[k] for k in ("repo_key", "commit", "branch", "counts")}, indent=2))
    else:
        print(json.dumps(stats(repo_root), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
