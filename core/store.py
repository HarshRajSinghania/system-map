"""The system model on disk, split into small files.

Everything an agent or the UI needs lives in files, so nothing large has to pass
through a chat. The layout is:

    repos/<repo-key>/
      manifest.json             commit, counts, a hash for every Facts file
      overview.md               the one file meant to be read first
      facts/tables/<name>.json  one table each; parsers write these
      reads/<node>/<id>.json    agent notes; each one cites evidence
      slices/<hash>.md          answers too large to return inline
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import time
from pathlib import Path

from .migrations import parse_migrations

SCHEMA_VERSION = 1
#: The most a tool hands back inline. Larger answers go to a slice file.
DEFAULT_BUDGET_CHARS = 4000
#: Past this the overview stops being a cheap first read, so it is a hard limit.
OVERVIEW_LIMIT_CHARS = 6000


def data_root() -> Path:
    """Find the app's data directory.

    `SYSTEM_MAP_DATA` wins. Otherwise use the gateway's layout, and fall back to
    the installed app tree, where this file sits at `<app>/core/store.py`.
    """
    explicit = os.environ.get("SYSTEM_MAP_DATA")
    if explicit:
        return Path(explicit)
    home = os.environ.get("KIROCREW_HOME")
    if home:
        return Path(home) / "apps" / os.environ.get("KIROCREW_APP_NAME", "system-map") / "data"
    return Path(__file__).resolve().parents[1] / "data"


def repo_key(repo_root: Path) -> str:
    resolved = str(repo_root.resolve())
    digest = hashlib.sha256(resolved.encode()).hexdigest()[:8]
    return f"{repo_root.resolve().name}-{digest}"


def repo_dir(repo_root: Path, root: Path | None = None) -> Path:
    return (root or data_root()) / "repos" / repo_key(repo_root)


def git(repo_root: Path, *args: str) -> str | None:
    try:
        done = subprocess.run(
            ["git", "-C", str(repo_root), *args],
            capture_output=True,
            text=True,
            timeout=20,
            check=True,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    return done.stdout.strip()


def _write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temp.replace(path)


def find_migrations(repo_root: Path) -> Path | None:
    for candidate in ("supabase/migrations", "db/migrations", "migrations"):
        path = repo_root / candidate
        if path.is_dir() and any(path.glob("*.sql")):
            return path
    return None


def build(repo_root: Path, root: Path | None = None) -> dict:
    """Rebuild the Facts layer for a repo. Reads and slices are left alone."""
    repo_root = repo_root.resolve()
    target = repo_dir(repo_root, root)
    migrations = find_migrations(repo_root)
    if migrations is None:
        raise ValueError(f"no SQL migrations found under {repo_root}")

    schema = parse_migrations(migrations, repo_root)
    facts = target / "facts" / "tables"
    if facts.exists():
        for stale in facts.glob("*.json"):
            stale.unlink()

    hashes: dict[str, str] = {}
    for table in schema.tables.values():
        shard = table.to_shard()
        path = facts / f"{table.schema}.{table.name}.json"
        _write_json(path, shard)
        hashes[path.relative_to(target).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()

    manifest = {
        "schema_version": SCHEMA_VERSION,
        "repo": str(repo_root),
        "repo_key": repo_key(repo_root),
        "commit": git(repo_root, "rev-parse", "HEAD"),
        "branch": git(repo_root, "rev-parse", "--abbrev-ref", "HEAD"),
        "built_at": int(time.time()),
        "counts": {
            "tables": len(schema.tables),
            "statements": schema.statements,
            "skipped_statements": schema.skipped,
        },
        "facts": hashes,
    }
    _write_json(target / "manifest.json", manifest)
    overview = render_overview(manifest, [t.to_shard() for t in schema.tables.values()])
    if len(overview) > OVERVIEW_LIMIT_CHARS:
        raise ValueError(f"overview is {len(overview)} chars, over {OVERVIEW_LIMIT_CHARS}")
    (target / "overview.md").write_text(overview, encoding="utf-8")
    return manifest


def render_overview(manifest: dict, shards: list[dict]) -> str:
    """One line per table: enough to choose what to open next, and no more."""
    lines = [
        f"# System map: {Path(manifest['repo']).name}",
        "",
        f"Commit {str(manifest['commit'])[:10]} on {manifest['branch']}. "
        f"{manifest['counts']['tables']} tables. "
        f"Open one with `node('table:<schema>.<name>')`.",
        "",
        "name | cols | fk | idx | policies | rls",
    ]
    for shard in sorted(shards, key=lambda s: (s["schema"], s["name"])):
        fks = sum(1 for c in shard["constraints"] if c["kind"] == "foreign_key")
        prefix = "" if shard["schema"] == "public" else f"{shard['schema']}."
        lines.append(
            f"{prefix}{shard['name']} | {len(shard['columns'])} | {fks} | {len(shard['indexes'])} "
            f"| {len(shard['policies'])} | {'yes' if shard['rls'] else 'NO'}"
        )
    return "\n".join(lines) + "\n"


def repos(root: Path | None = None) -> list[dict]:
    base = (root or data_root()) / "repos"
    found = []
    if base.is_dir():
        for path in sorted(base.iterdir()):
            manifest = path / "manifest.json"
            if manifest.is_file():
                found.append(json.loads(manifest.read_text(encoding="utf-8")))
    return found


def resolve_repo(repo: str | None, root: Path | None = None) -> Path:
    """Pick a model by repo path or key. With one model, that is the default."""
    known = repos(root)
    if repo:
        for manifest in known:
            if repo in (manifest["repo"], manifest["repo_key"], Path(manifest["repo"]).name):
                return (root or data_root()) / "repos" / manifest["repo_key"]
        raise KeyError(f"no model for {repo!r}; build one first")
    if len(known) == 1:
        return (root or data_root()) / "repos" / known[0]["repo_key"]
    if not known:
        raise KeyError("no model yet; build one first")
    raise KeyError("several models exist; name a repo: " + ", ".join(m["repo_key"] for m in known))


def staleness(target: Path) -> dict:
    """Compare a model's commit with its repo's current one."""
    manifest = json.loads((target / "manifest.json").read_text(encoding="utf-8"))
    head = git(Path(manifest["repo"]), "rev-parse", "HEAD")
    behind = None
    if head and manifest["commit"] and head != manifest["commit"]:
        count = git(Path(manifest["repo"]), "rev-list", "--count", f"{manifest['commit']}..{head}")
        behind = int(count) if count and count.isdigit() else None
    return {
        "model_commit": manifest["commit"],
        "repo_commit": head,
        "stale": head is not None and head != manifest["commit"],
        "commits_behind": behind if behind is not None else 0,
    }


def table_index(target: Path) -> list[dict]:
    """One short row per table, for a list view."""
    rows = []
    for path in sorted((target / "facts" / "tables").glob("*.json")):
        shard = json.loads(path.read_text(encoding="utf-8"))
        rows.append(
            {
                "id": shard["id"],
                "name": shard["name"],
                "columns": len(shard["columns"]),
                "foreign_keys": sum(1 for c in shard["constraints"] if c["kind"] == "foreign_key"),
                "policies": len(shard["policies"]),
                "rls": shard["rls"],
            }
        )
    return rows


def _shard_path(target: Path, node_id: str) -> Path:
    match = re.fullmatch(r"table:([\w$-]+)\.([\w$-]+)", node_id)
    if not match:
        raise KeyError(f"bad node id {node_id!r}; expected table:<schema>.<name>")
    return target / "facts" / "tables" / f"{match.group(1)}.{match.group(2)}.json"


def load_node(target: Path, node_id: str) -> dict:
    path = _shard_path(target, node_id)
    if not path.is_file():
        raise KeyError(f"no node {node_id!r}")
    shard = json.loads(path.read_text(encoding="utf-8"))
    shard["reads"] = load_notes(target, node_id)
    return shard


def _note_dir(target: Path, node_id: str) -> Path:
    return target / "reads" / re.sub(r"[^\w.-]", "_", node_id)


def load_notes(target: Path, node_id: str) -> list[dict]:
    directory = _note_dir(target, node_id)
    if not directory.is_dir():
        return []
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted(directory.glob("*.json"))]


def add_note(target: Path, node_id: str, text: str, evidence: list[str]) -> dict:
    """Save an agent's note. Every evidence entry must point at a real repo file."""
    if not _shard_path(target, node_id).is_file():
        raise KeyError(f"no node {node_id!r}")
    if not text.strip():
        raise ValueError("a note needs text")
    if not evidence:
        raise ValueError("a note needs at least one evidence entry, as path or path:line")
    manifest = json.loads((target / "manifest.json").read_text(encoding="utf-8"))
    repo_root = Path(manifest["repo"])
    for item in evidence:
        relative = item.rsplit(":", 1)[0] if re.search(r":\d+$", item) else item
        resolved = (repo_root / relative).resolve()
        if repo_root not in resolved.parents or not resolved.is_file():
            raise ValueError(f"evidence {item!r} is not a file in {repo_root}")
    note = {
        "node": node_id,
        "layer": "reads",
        "text": text.strip(),
        "evidence": evidence,
        "commit": manifest["commit"],
        "created_at": int(time.time()),
    }
    digest = hashlib.sha256(json.dumps(note, sort_keys=True).encode()).hexdigest()[:12]
    path = _note_dir(target, node_id) / f"{note['created_at']}-{digest}.json"
    _write_json(path, note)
    return {"path": str(path), "note": note}


def verify_facts(target: Path) -> list[str]:
    """List Facts files that no longer match the hash the parser recorded."""
    manifest = json.loads((target / "manifest.json").read_text(encoding="utf-8"))
    changed = []
    for relative, expected in manifest["facts"].items():
        path = target / relative
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            changed.append(relative)
    return changed


def search(target: Path, query: str, limit: int = 20) -> list[dict]:
    """Find tables by table, column or constraint target. Returns ids, not bodies."""
    needle = query.lower()
    hits = []
    for path in sorted((target / "facts" / "tables").glob("*.json")):
        shard = json.loads(path.read_text(encoding="utf-8"))
        matched = []
        if needle in shard["name"].lower():
            matched.append("table")
        matched += [f"column {c['name']}" for c in shard["columns"] if needle in c["name"].lower()]
        matched += [
            f"fk to {c['references']}"
            for c in shard["constraints"]
            if c["kind"] == "foreign_key" and needle in c["references"].lower()
        ]
        if matched:
            hits.append({"id": shard["id"], "matched": matched[:5]})
    return hits[:limit]


def neighbors(target: Path, node_id: str) -> dict:
    """Tables this one points at, and tables that point at it."""
    shard = load_node(target, node_id)
    me = f"{shard['schema']}.{shard['name']}"
    incoming = []
    for path in sorted((target / "facts" / "tables").glob("*.json")):
        other = json.loads(path.read_text(encoding="utf-8"))
        for constraint in other["constraints"]:
            if constraint["kind"] == "foreign_key" and constraint["references"] == me:
                incoming.append(
                    {"table": other["id"], "columns": constraint["columns"], "on_delete": constraint["on_delete"]}
                )
    outgoing = [
        {"table": f"table:{c['references']}", "columns": c["columns"], "on_delete": c["on_delete"]}
        for c in shard["constraints"]
        if c["kind"] == "foreign_key"
    ]
    return {"id": node_id, "outgoing": outgoing, "incoming": incoming}


def fit(target: Path, name: str, text: str, budget: int = DEFAULT_BUDGET_CHARS) -> dict:
    """Return text inline when it fits. Otherwise save it and return a pointer."""
    if len(text) <= budget:
        return {"inline": True, "chars": len(text), "text": text}
    digest = hashlib.sha256(text.encode()).hexdigest()[:12]
    path = target / "slices" / f"{name}-{digest}.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return {
        "inline": False,
        "chars": len(text),
        "path": str(path),
        "head": text[:600],
        "note": "Too large to return here. Read the file at this path, in parts if you can.",
    }
