"""The system model on disk, split into small files.

Everything an agent or the UI needs lives in files, so nothing large has to pass
through a chat. The layout is:

    repos/<repo-key>/
      manifest.json                  the current version, its commit and counts
      versions/<version>/
        overview.md                  the one file meant to be read first
        tables/<schema>.<name>.json  one table each; parsers write these
        findings.json                rule checks over the tables
        types.json, externals.json
      reads/<node>/<id>.json         agent notes; each one cites evidence
      slices/<hash>.md               answers too large to return inline

A build writes a new version, then swaps `manifest.json`. That swap is one atomic file
replace, so a reader sees the old model or the new one, never half of either.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import time
from pathlib import Path

from . import extractors, findings
from .sources import canonical_root, git, open_source

SCHEMA_VERSION = 2
#: The most a tool hands back inline. Larger answers go to a slice file.
DEFAULT_BUDGET_CHARS = 4000
#: Past this the overview stops being a cheap first read, so it is a hard limit.
OVERVIEW_LIMIT_CHARS = 6000
KEEP_VERSIONS = 5


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
    return (root or data_root()) / "repos" / repo_key(canonical_root(repo_root))


def read_manifest(target: Path) -> dict:
    return json.loads((target / "manifest.json").read_text(encoding="utf-8"))


def current(target: Path) -> Path:
    """The folder of the version the manifest points at."""
    return target / "versions" / read_manifest(target)["version"]


def _write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(f"{path.name}.{os.getpid()}.tmp")
    temp.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temp.replace(path)


def _builder_id() -> str:
    """Hash this package's own code, so a better parser replaces older Facts."""
    package = Path(__file__).resolve().parent
    digest = hashlib.sha256()
    for path in sorted(package.rglob("*.py")):
        digest.update(path.relative_to(package).as_posix().encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()


def _fingerprint(source) -> tuple[str, dict[str, str]]:
    """Hash the ids of every input, without reading a single file."""
    extractor = next((e for e in extractors.EXTRACTORS if e.detect(source)), None)
    if extractor is None:
        raise ValueError(f"no extractor knows how to read {source.root}")
    inputs = extractor.inputs(source)
    code = {path: source.blobs[path] for path in findings.code_files(source)}
    payload = json.dumps([_builder_id(), inputs, code], sort_keys=True).encode()
    return hashlib.sha256(payload).hexdigest()[:12], inputs


def build(repo_path: Path, root: Path | None = None, ref: str | None = None) -> dict:
    """Write a new version of the Facts. Reads and slices are left alone."""
    repo_root = canonical_root(repo_path)
    source = open_source(repo_root, ref)
    target = repo_dir(repo_root, root)
    version, inputs = _fingerprint(source)

    previous = read_manifest(target) if (target / "manifest.json").is_file() else None
    if previous and previous.get("version") == version and previous.get("schema_version") == SCHEMA_VERSION:
        previous["commit"], previous["unchanged"] = source.commit, True
        _write_json(target / "manifest.json", {k: v for k, v in previous.items() if k != "unchanged"})
        return previous

    extraction = extractors.extract(source)
    found = findings.find(extraction.nodes, findings.code_tokens(source, extraction.usage_text))
    versions = target / "versions"
    staging = versions / f".staging-{os.getpid()}-{time.time_ns()}"
    try:
        hashes = _write_version(staging, extraction, found)
        counts = _counts(extraction, found)
        manifest = {
            "schema_version": SCHEMA_VERSION,
            "repo": str(repo_root),
            "repo_key": repo_key(repo_root),
            "ref": source.ref,
            "commit": source.commit,
            "version": version,
            "built_at": int(time.time()),
            "counts": counts,
            "stats": extraction.stats,
            "inputs": inputs,
            "facts": {f"versions/{version}/{relative}": digest for relative, digest in hashes.items()},
        }
        overview = render_overview(manifest, extraction.nodes, found)
        (staging / "overview.md").write_text(overview, encoding="utf-8")
        final = versions / version
        if final.exists():
            shutil.rmtree(staging)
        else:
            staging.rename(final)
    except BaseException:
        shutil.rmtree(staging, ignore_errors=True)
        raise
    _write_json(target / "manifest.json", manifest)
    _prune(versions, version)
    return manifest


def _write_version(folder: Path, extraction: extractors.Extraction, found: list[dict]) -> dict[str, str]:
    hashes: dict[str, str] = {}
    for node in extraction.nodes:
        path = folder / "tables" / f"{node['schema']}.{node['name']}.json"
        _write_json(path, node)
        hashes[path.relative_to(folder).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    _write_json(folder / "findings.json", found)
    _write_json(folder / "types.json", extraction.types)
    _write_json(folder / "externals.json", extraction.externals)
    return hashes


def _counts(extraction: extractors.Extraction, found: list[dict]) -> dict:
    nodes = extraction.nodes
    return {
        "tables": len(nodes),
        "columns": sum(len(n["columns"]) for n in nodes),
        "constraints": sum(len(n["constraints"]) for n in nodes),
        "indexes": sum(len(n["indexes"]) for n in nodes),
        "policies": sum(len(n["policies"]) for n in nodes),
        "triggers": sum(len(n["triggers"]) for n in nodes),
        "types": len(extraction.types),
        "externals": len(extraction.externals),
        "findings": findings.tally(found),
    }


def _prune(versions: Path, keep: str) -> None:
    old = [p for p in versions.iterdir() if p.is_dir() and not p.name.startswith(".") and p.name != keep]
    for path in sorted(old, key=lambda p: p.stat().st_mtime)[: max(0, len(old) - (KEEP_VERSIONS - 1))]:
        shutil.rmtree(path, ignore_errors=True)


def render_overview(manifest: dict, nodes: list[dict], found: list[dict]) -> str:
    """One line per table: enough to choose what to open next, and no more."""
    counts = manifest["counts"]["findings"]
    head = [
        f"# System map: {Path(manifest['repo']).name}",
        "",
        f"{manifest['ref']} at {str(manifest['commit'])[:10]}. {manifest['counts']['tables']} tables. "
        f"Findings: {counts['high']} high, {counts['medium']} medium, {counts['low']} low, {counts['info']} info.",
        "Open one with `node('table:<schema>.<name>')`. See rule checks with `findings`.",
        "",
    ]
    rows = ["name | cols | fk | idx | policies | rls"]
    names = []
    for node in sorted(nodes, key=lambda n: (n["schema"], n["name"])):
        fks = sum(1 for c in node["constraints"] if c["kind"] == "foreign_key")
        label = node["name"] if node["schema"] == "public" else f"{node['schema']}.{node['name']}"
        names.append(label)
        rows.append(
            f"{label} | {len(node['columns'])} | {fks} | {len(node['indexes'])} "
            f"| {len(node['policies'])} | {'yes' if node['rls'] else 'NO'}"
        )
    text = "\n".join(head + rows) + "\n"
    if len(text) <= OVERVIEW_LIMIT_CHARS:
        return text
    room = OVERVIEW_LIMIT_CHARS - len("\n".join(head)) - 80
    shown: list[str] = []
    for name in names:
        if sum(len(n) + 2 for n in shown) + len(name) > room:
            break
        shown.append(name)
    return "\n".join(head) + ", ".join(shown) + f"\n\n{len(names) - len(shown)} more. Use `search`.\n"


def repos(root: Path | None = None) -> list[dict]:
    base = (root or data_root()) / "repos"
    found = []
    if base.is_dir():
        for path in sorted(base.iterdir()):
            if (path / "manifest.json").is_file():
                manifest = read_manifest(path)
                if manifest.get("schema_version") == SCHEMA_VERSION:
                    found.append(manifest)
    return found


def resolve_repo(repo: str | None, root: Path | None = None) -> Path:
    """Pick a model by repo path or key. With one model, that is the default."""
    known = repos(root)
    if repo:
        wanted = {repo}
        if repo.startswith(("/", "~")):
            wanted.add(str(canonical_root(Path(repo))))
        for manifest in known:
            if wanted & {manifest["repo"], manifest["repo_key"], Path(manifest["repo"]).name}:
                return (root or data_root()) / "repos" / manifest["repo_key"]
        raise KeyError(f"no model for {repo!r}; build one first")
    if len(known) == 1:
        return (root or data_root()) / "repos" / known[0]["repo_key"]
    if not known:
        raise KeyError("no model yet; build one first")
    raise KeyError("several models exist; name a repo: " + ", ".join(m["repo_key"] for m in known))


def freshness(target: Path) -> dict:
    """Compare a model with the tip of the branch it was built from.

    A commit only makes the model stale when it changes a file the Facts came from.
    """
    manifest = read_manifest(target)
    repo = Path(manifest["repo"])
    try:
        source = open_source(repo, manifest["ref"] if manifest["commit"] else None)
        extractor = next(e for e in extractors.EXTRACTORS if e.detect(source))
    except (ValueError, StopIteration, OSError) as error:
        return {"ref": manifest["ref"], "stale": False, "commits_behind": 0, "error": str(error)}
    behind = 0
    if source.commit and source.commit != manifest["commit"]:
        count = git(repo, "rev-list", "--count", f"{manifest['commit']}..{source.commit}")
        behind = int(count) if count and count.isdigit() else 0
    now, then = extractor.inputs(source), manifest["inputs"]
    changed = sorted(path for path in set(now) | set(then) if now.get(path) != then.get(path))
    return {
        "ref": manifest["ref"],
        "model_commit": manifest["commit"],
        "tip_commit": source.commit,
        "commits_behind": behind,
        "stale": bool(changed),
        "changed_inputs": changed[:20],
    }


def table_index(target: Path) -> list[dict]:
    """One short row per table, for a list view."""
    rows = []
    for path in sorted((current(target) / "tables").glob("*.json")):
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


def graph(target: Path) -> dict:
    """Everything the diagram draws: tables, outside stubs, and foreign key lines."""
    folder = current(target)
    tables, edges = [], []
    for path in sorted((folder / "tables").glob("*.json")):
        shard = json.loads(path.read_text(encoding="utf-8"))
        foreign = {c for k in shard["constraints"] if k["kind"] == "foreign_key" for c in k["columns"]}
        primary = {c for k in shard["constraints"] if k["kind"] == "primary_key" for c in k["columns"]}
        tables.append(
            {
                "id": shard["id"],
                "name": shard["name"],
                "status": shard["status"],
                "rls": shard["rls"],
                "columns": [
                    {
                        "name": c["name"],
                        "type": c["type"],
                        "nullable": c["nullable"],
                        "primary": c["name"] in primary,
                        "foreign": c["name"] in foreign,
                    }
                    for c in shard["columns"]
                ],
            }
        )
        for constraint in shard["constraints"]:
            if constraint["kind"] == "foreign_key":
                edges.append(
                    {
                        "id": f"{shard['id']}:{constraint['name']}",
                        "source": shard["id"],
                        "target": f"table:{constraint['references']}",
                        "columns": constraint["columns"],
                        "on_delete": constraint["on_delete"],
                    }
                )
    externals = json.loads((folder / "externals.json").read_text(encoding="utf-8"))
    for external in externals:
        tables.append(
            {"id": external["id"], "name": f"{external['schema']}.{external['name']}", "status": "external", "rls": None, "columns": []}
        )
    return {"tables": tables, "edges": edges}


def load_findings(target: Path) -> list[dict]:
    return json.loads((current(target) / "findings.json").read_text(encoding="utf-8"))


def _shard_path(target: Path, node_id: str) -> Path:
    match = re.fullmatch(r"table:([\w$-]+)\.([\w$-]+)", node_id)
    if not match:
        raise KeyError(f"bad node id {node_id!r}; expected table:<schema>.<name>")
    return current(target) / "tables" / f"{match.group(1)}.{match.group(2)}.json"


def load_node(target: Path, node_id: str) -> dict:
    path = _shard_path(target, node_id)
    if not path.is_file():
        raise KeyError(f"no node {node_id!r}")
    shard = json.loads(path.read_text(encoding="utf-8"))
    shard["reads"] = load_notes(target, node_id)
    shard["findings"] = [f for f in load_findings(target) if f["node"] == node_id]
    return shard


def _note_dir(target: Path, node_id: str) -> Path:
    return target / "reads" / re.sub(r"[^\w.-]", "_", node_id)


def load_notes(target: Path, node_id: str) -> list[dict]:
    directory = _note_dir(target, node_id)
    if not directory.is_dir():
        return []
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted(directory.glob("*.json"))]


def add_note(target: Path, node_id: str, text: str, evidence: list[str]) -> dict:
    """Save an agent's note. Every evidence entry must name a file at the model's commit."""
    if not _shard_path(target, node_id).is_file():
        raise KeyError(f"no node {node_id!r}")
    if not text.strip():
        raise ValueError("a note needs text")
    if not evidence:
        raise ValueError("a note needs at least one evidence entry, as path or path:line")
    manifest = read_manifest(target)
    source = open_source(Path(manifest["repo"]), manifest["commit"])
    for item in evidence:
        relative = item.rsplit(":", 1)[0] if re.search(r":\d+$", item) else item
        if relative not in source.blobs:
            raise ValueError(f"evidence {item!r} is not a file at {manifest['ref']}")
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
    changed = []
    for relative, expected in read_manifest(target)["facts"].items():
        path = target / relative
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            changed.append(relative)
    return changed


def search(target: Path, query: str, limit: int = 20) -> list[dict]:
    """Find tables by table, column or constraint target. Returns ids, not bodies."""
    needle = query.lower()
    hits = []
    for path in sorted((current(target) / "tables").glob("*.json")):
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
    for path in sorted((current(target) / "tables").glob("*.json")):
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
