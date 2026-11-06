"""The system model on disk, split into small files.

Everything an agent or the UI needs lives in files, so nothing large has to pass
through a chat. The layout is:

    repos/<repo-key>/
      manifest.json                  the current version, its commit and counts
      versions/<version>/
        overview.md                  the one file meant to be read first
        tables/<schema>.<name>.json  one table each; parsers write these
        findings.json                rule checks over the tables
        system.json                  areas, modules, routes, jobs, services, plans
        imports.json                 file-level links, for checking against a compiler
        risk.json                    churn, complexity and test reach, per file
        types.json, externals.json
      coverage.json                  the last coverage report loaded; it outlives a rebuild
      reads/<node>/<id>.json         agent notes; each one cites evidence
      intent/plan_status.json        statuses a person set; these beat derived ones
      intent/agents.json             where a person said the agents are, and the home region
      intent/regions.json            where a person said each service runs
      intent/agents-draft.json       agent settings the Design chat drafted; a person uses them
      intent/proposals/<id>.json     what-ifs. Agents write drafts, and a person accepts them
      intent/use_cases/<id>.json     what someone needs to do, mapped to its parts
      intent/views/<id>.json         saved filters that the app draws
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

from . import coverage, extractors, findings, risk, system, worktrees
from . import read as build_read
from .extractors import drizzle, plans, typescript
from .sources import canonical_root, git, open_source

SCHEMA_VERSION = 6
#: The most a tool hands back inline. Larger answers go to a slice file. This fits any
#: one table, and sits well under the 20,000 chars proven to reach a model whole.
DEFAULT_BUDGET_CHARS = 12000
#: Past this the overview stops being a cheap first read, so it is a hard limit.
OVERVIEW_LIMIT_CHARS = 6000
KEEP_VERSIONS = 5
PLAN_STATUSES = ("built", "partial", "planned", "unclear")
INTENT_KINDS = ("proposals", "use_cases", "views")
#: Agent settings a person may give, and what each must be.
AGENT_SETTINGS = {
    "list": str,
    "jobs_key": str,
    "hand_off_keys": list,
    "model_calls": list,
    "asks_you_calls": list,
    "modules": list,
    "home_region": str,
}
#: The settings a build reads. The home region only matters at load, so it never forces a rebuild.
AGENT_BUILD_KEYS = ("list", "jobs_key", "hand_off_keys", "model_calls", "asks_you_calls", "modules")
CODE_NAME = re.compile(r"[A-Za-z_$][\w$]*")
REGION = re.compile(r"[\w][\w .-]{0,39}")


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


def _map_inputs(source) -> dict[str, str]:
    """Ids of everything the system map reads beyond the migrations."""
    read = set(findings.code_files(source)) | set(typescript.code_files(source)) | set(plans.plan_files(source))
    read |= {path for root in system.SQL_ROOTS for path in source.list_files(root, (".sql",))}
    read |= {path for path in ("tsconfig.json", "jsconfig.json", "package.json") if path in source.blobs}
    read |= set(typescript.browser_files(source))
    return {path: source.blobs[path] for path in read}


def _hash(value: object) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True).encode()).hexdigest()[:12]


def _fingerprint(source, agent_settings: dict | None = None) -> tuple[str, dict[str, str], str]:
    """Hash the ids of every input, without reading a single file. Agent settings count too."""
    if not extractors.extractor_for(source) and not typescript.detect(source):
        raise ValueError(f"{source.root} has no code or schema that System Map can read.")
    inputs = extractors.inputs(source)
    map_hash = _hash(_map_inputs(source))
    parts = [_builder_id(), inputs, map_hash] + ([agent_settings] if agent_settings else [])
    return _hash(parts), inputs, map_hash


def build(repo_path: Path, root: Path | None = None, ref: str | None = None) -> dict:
    """Write a new version of the Facts. Reads and slices are left alone."""
    repo_root = canonical_root(repo_path)
    source = open_source(repo_root, ref)
    target = repo_dir(repo_root, root)
    saved = load_agent_settings(target)
    agent_settings = {key: saved[key] for key in AGENT_BUILD_KEYS if key in saved}
    version, inputs, map_hash = _fingerprint(source, agent_settings)

    previous = read_manifest(target) if (target / "manifest.json").is_file() else None
    if previous and previous.get("version") == version and previous.get("schema_version") == SCHEMA_VERSION:
        previous["commit"], previous["unchanged"] = source.commit, True
        _write_json(target / "manifest.json", {k: v for k, v in previous.items() if k != "unchanged"})
        return previous

    extraction = extractors.extract(source)
    schema = drizzle.read(source)
    found = findings.find(extraction.nodes, findings.code_tokens(source, extraction.usage_text, set(schema.files)), schema.fields)
    joined = system.build(source, extraction.nodes, agent_settings)
    joined["risk"] = risk.build(source, joined)
    versions = target / "versions"
    staging = versions / f".staging-{os.getpid()}-{time.time_ns()}"
    try:
        hashes = _write_version(staging, extraction, found, joined)
        counts = _counts(extraction, found, joined)
        manifest = {
            "schema_version": SCHEMA_VERSION,
            "repo": str(repo_root),
            "repo_key": repo_key(repo_root),
            "ref": source.ref,
            "commit": source.commit,
            "engine": extraction.engine,
            "read": build_read.summary(source, extraction, joined),
            "version": version,
            "built_at": int(time.time()),
            "counts": counts,
            "stats": extraction.stats,
            "inputs": inputs,
            "map_inputs": map_hash,
            "facts": {f"versions/{version}/{relative}": digest for relative, digest in hashes.items()},
        }
        overview = render_overview(manifest, extraction.nodes, found, joined)
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


def refresh_all(root: Path | None = None) -> list[str]:
    """Rebuild every known model. A build with nothing new costs almost nothing.

    Runs when the backend starts, so an app update carries models to its new format
    and its new parser without anyone asking.
    """
    base = (root or data_root()) / "repos"
    done = []
    for path in sorted(base.iterdir()) if base.is_dir() else []:
        if not (path / "manifest.json").is_file():
            continue
        try:
            manifest = read_manifest(path)
            ref = manifest.get("ref")
            build(Path(manifest["repo"]), root, None if ref in (None, "working tree") else ref)
            for leftover in ("facts", "overview.md"):
                target = path / leftover
                if target.is_dir():
                    shutil.rmtree(target, ignore_errors=True)
                elif target.exists():
                    target.unlink()
            done.append(path.name)
        except (KeyError, ValueError, OSError):
            continue
    return done


def _write_version(folder: Path, extraction: extractors.Extraction, found: list[dict], joined: dict) -> dict[str, str]:
    hashes: dict[str, str] = {}
    folder.mkdir(parents=True, exist_ok=True)
    for node in extraction.nodes:
        path = folder / "tables" / f"{node['schema']}.{node['name']}.json"
        _write_json(path, node)
        hashes[path.relative_to(folder).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    _write_json(folder / "findings.json", found)
    _write_json(folder / "types.json", extraction.types)
    _write_json(folder / "externals.json", extraction.externals)
    kept = ("nodes", "edges", "code_root", "routes_dir", "route_style", "drizzle")
    _write_json(folder / "system.json", {key: joined[key] for key in kept})
    _write_json(
        folder / "imports.json",
        {"imports": joined["imports"], "table_calls": joined["table_calls"], "complexity": joined["complexity"]},
    )
    _write_json(folder / "risk.json", joined["risk"])
    for name in ("system.json", "risk.json"):
        hashes[name] = hashlib.sha256((folder / name).read_bytes()).hexdigest()
    return hashes


def _counts(extraction: extractors.Extraction, found: list[dict], joined: dict) -> dict:
    nodes = extraction.nodes
    kinds: dict[str, int] = {}
    for node in joined["nodes"]:
        kinds[node["kind"]] = kinds.get(node["kind"], 0) + 1
    return {
        "system": kinds,
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


def render_overview(manifest: dict, nodes: list[dict], found: list[dict], joined: dict | None = None) -> str:
    """One line per table: enough to choose what to open next, and no more."""
    counts = manifest["counts"]["findings"]
    listed = (joined or {}).get("nodes", [])
    largest = sorted((n for n in listed if n["kind"] == "area"), key=lambda n: -n["lines"])
    areas = [f"{n['path']} ({n['files']} files)" for n in largest]
    unbuilt = [f"{n['id']} ({n['status']})" for n in listed if n["kind"] == "plan" and n["status"] in ("planned", "partial")]
    head = [
        f"# System map: {Path(manifest['repo']).name}",
        "",
        f"{manifest['ref']} at {str(manifest['commit'])[:10] if manifest['commit'] else 'no commit'}. {manifest['counts']['tables']} tables. "
        f"Findings: {counts['high']} high, {counts['medium']} medium, {counts['low']} low, {counts['info']} info.",
        "Open any id with `node`. See rule checks with `findings`, and what is not built with `plan`.",
        "",
    ]
    if manifest.get("read"):
        head += [build_read.tell(manifest["read"]), ""]
    if areas:
        head += ["Areas: " + ", ".join(areas), ""]
    if unbuilt:
        head += ["Not fully built: " + ", ".join(unbuilt), ""]
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


def _project_names(known: list[dict]) -> str:
    """Name projects the way a person would, using the key only where two share a name."""
    names = [Path(manifest["repo"]).name for manifest in known]
    shown = [m["repo_key"] if names.count(Path(m["repo"]).name) > 1 else Path(m["repo"]).name for m in known]
    return ", ".join(sorted(shown))


def resolve_repo(repo: str | None, root: Path | None = None, folder: Path | None = None) -> Path:
    """Pick a model by repo path, key or name.

    With no name, `folder` picks: a session's tools run in its project, or in a worktree of
    it, so this is the project being worked on. With one model, that one is the default.
    """
    known = repos(root)
    base = (root or data_root()) / "repos"
    if repo:
        wanted = {repo}
        if repo.startswith(("/", "~")):
            wanted.add(str(canonical_root(Path(repo))))
        for manifest in known:
            if wanted & {manifest["repo"], manifest["repo_key"], Path(manifest["repo"]).name}:
                return base / manifest["repo_key"]
        raise KeyError(f"no model for {repo!r}; build one first")
    if folder is not None:
        here = str(canonical_root(folder))
        for manifest in known:
            if manifest["repo"] == here:
                return base / manifest["repo_key"]
    if len(known) == 1:
        return base / known[0]["repo_key"]
    if not known:
        raise KeyError("no model yet; build one first")
    raise KeyError(f"several projects have models, so name one with `repo`: {_project_names(known)}")


def check_folder(path: Path) -> Path:
    """Refuse a folder that can't become a project, in words a person can act on."""
    try:
        path = path.expanduser()
    except RuntimeError:  # `~someone` with no such person.
        raise ValueError("Give the full path, starting with / or ~.") from None
    if not path.is_absolute():
        raise ValueError("Give the full path, starting with / or ~.")
    if not path.is_dir():
        raise ValueError(f"{path} isn't a folder on this machine.")
    return path


def _project_status(fresh: dict) -> str:
    if fresh.get("missing"):
        return "missing"
    if fresh.get("error"):
        return "unknown"
    if fresh.get("stale") or fresh.get("map_stale"):
        return "stale"
    return "behind" if fresh.get("commits_behind") else "current"


def project_rows(root: Path | None = None) -> list[dict]:
    """One short row per project: what it is, how current it is, and what it holds."""
    base = (root or data_root()) / "repos"
    rows = []
    for manifest in repos(root):
        target = base / manifest["repo_key"]
        fresh = freshness(target)
        repo = Path(manifest["repo"])
        rows.append(
            {
                "repo": manifest["repo"],
                "repo_key": manifest["repo_key"],
                "name": repo.name,
                "parent": repo.parent.name,
                "ref": manifest["ref"],
                "commit": manifest["commit"],
                "built_at": manifest["built_at"],
                "tables": manifest["counts"]["tables"],
                "status": _project_status(fresh),
                "behind": fresh.get("commits_behind", 0),
                "intent": {kind: sum(1 for _ in (target / "intent" / kind).glob("*.json")) for kind in INTENT_KINDS},
            }
        )
    return rows


def remove_project(key: str, root: Path | None = None) -> dict:
    """Delete one project's app data for good. Its repo is never touched.

    The folder comes from the list of known models, never from the caller's text.
    """
    base = ((root or data_root()) / "repos").resolve()
    for manifest in repos(root):
        target = base / manifest["repo_key"]
        if manifest["repo_key"] == key and target.resolve().parent == base:
            shutil.rmtree(target)
            return {"removed": key}
    raise KeyError(f"no project {key!r}")


def freshness(target: Path) -> dict:
    """Compare a model with the tip of the branch it was built from.

    A commit only makes the model stale when it changes a file the Facts came from.
    """
    manifest = read_manifest(target)
    repo = Path(manifest["repo"])
    if not repo.is_dir():
        return {"ref": manifest["ref"], "stale": False, "map_stale": False, "commits_behind": 0, "missing": True}
    try:
        source = open_source(repo, manifest["ref"] if manifest["commit"] else None)
    except (ValueError, OSError) as error:
        return {"ref": manifest["ref"], "stale": False, "map_stale": False, "commits_behind": 0, "error": str(error)}
    behind = 0
    if source.commit and source.commit != manifest["commit"]:
        count = git(repo, "rev-list", "--count", f"{manifest['commit']}..{source.commit}")
        behind = int(count) if count and count.isdigit() else 0
    now, then = extractors.inputs(source), manifest["inputs"]
    changed = sorted(path for path in set(now) | set(then) if now.get(path) != then.get(path))
    return {
        "map_stale": _hash(_map_inputs(source)) != manifest.get("map_inputs"),
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
                # Row level security is a Postgres idea, so SQLite has no answer to give.
                "rls": None if shard["schema"] == "main" else shard["rls"],
            }
        )
    return rows


def graph(target: Path) -> dict:
    """Everything the diagram draws: tables, outside stubs, and foreign key lines."""
    folder = current(target)
    shards = [json.loads(path.read_text(encoding="utf-8")) for path in sorted((folder / "tables").glob("*.json"))]
    return graph_of(shards, json.loads((folder / "externals.json").read_text(encoding="utf-8")))


def graph_of(shards: list[dict], externals: list[dict]) -> dict:
    tables, edges = [], []
    for shard in shards:
        foreign = {c for k in shard["constraints"] if k["kind"] == "foreign_key" for c in k["columns"]}
        primary = {c for k in shard["constraints"] if k["kind"] == "primary_key" for c in k["columns"]}
        tables.append(
            {
                "id": shard["id"],
                "name": shard["name"],
                "status": shard["status"],
                "rls": None if shard["schema"] == "main" else shard["rls"],
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
    for external in externals:
        tables.append(
            {"id": external["id"], "name": f"{external['schema']}.{external['name']}", "status": "external", "rls": None, "columns": []}
        )
    return {"tables": tables, "edges": edges}


def _plan_overrides(target: Path) -> dict[str, dict]:
    path = target / "intent" / "plan_status.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}


def load_system(target: Path) -> dict:
    """The system's nodes and edges, with any status or region a person has set."""
    joined = json.loads((current(target) / "system.json").read_text(encoding="utf-8"))
    overrides = _plan_overrides(target)
    for node in joined["nodes"]:
        override = overrides.get(node["id"])
        if override:
            node["derived_status"] = node["status"]
            node["status"] = override["status"]
            node["status_source"] = "you"
    _join_regions(joined, load_regions(target), load_agent_settings(target).get("home_region"))
    return joined


def _same_region(one: str, other: str) -> bool:
    return one.strip().casefold() == other.strip().casefold()


def _join_regions(joined: dict, regions: dict[str, dict], home: str | None) -> None:
    """Put each region a person set on its service, and mark agents whose model runs elsewhere."""
    by_id = {node["id"]: node for node in joined["nodes"]}
    for node_id, tag in regions.items():
        if node_id in by_id:
            by_id[node_id]["region"] = tag["region"]
            by_id[node_id]["region_source"] = "you"
    joined["home_region"] = home
    for node in joined["nodes"]:
        if node["kind"] == "agent":
            node["leaves_region"] = []
    if not home:
        return
    for edge in joined["edges"]:
        region = regions.get(edge["target"], {}).get("region")
        agent = by_id.get(edge["source"])
        if edge["kind"] == "uses_model" and region and agent and not _same_region(region, home):
            edge["leaves_region"] = True
            agent["leaves_region"].append(edge["target"])


def load_agent_settings(target: Path) -> dict:
    path = target / "intent" / "agents.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}


def _check_agent_settings(target: Path, settings: dict) -> dict:
    """Keep only well-formed settings, or say what is wrong."""
    kept = {}
    for key, value in settings.items():
        if key not in AGENT_SETTINGS:
            raise ValueError(f"unknown agent setting {key!r}; use {', '.join(AGENT_SETTINGS)}")
        kind = AGENT_SETTINGS[key]
        if value is None or value == "" or value == []:
            continue
        if not isinstance(value, kind) or (kind is list and not all(isinstance(item, str) for item in value)):
            raise ValueError(f"{key} must be {'a list of names' if kind is list else 'text'}")
        if key in ("jobs_key", "hand_off_keys", "model_calls", "asks_you_calls"):
            for name in [value] if kind is str else value:
                if not CODE_NAME.fullmatch(name):
                    raise ValueError(f"{name!r} in {key} is not a name in code")
        kept[key] = value.strip() if kind is str else list(dict.fromkeys(value))
    if "home_region" in kept and not REGION.fullmatch(kept["home_region"]):
        raise ValueError("home_region must be 1 to 40 letters, digits, spaces, dots or dashes")
    manifest = read_manifest(target)
    if "list" in kept:
        if kept["list"].startswith("/") or ".." in kept["list"].split("/"):
            raise ValueError("list must be a path inside the repo")
        source = open_source(Path(manifest["repo"]), manifest["commit"] or None)
        if kept["list"] not in source.blobs:
            raise ValueError(f"no file {kept['list']!r} at {manifest['ref']}")
    if "modules" in kept:
        known = {node["id"]: node["name"] for node in load_system(target)["nodes"] if node["kind"] == "module"}
        unknown = [item for item in kept["modules"] if item not in known]
        if unknown:
            raise ValueError(f"not a module: {', '.join(unknown)}")
        names = [known[item] for item in kept["modules"]]
        twice = sorted({name for name in names if names.count(name) > 1})
        if twice:
            raise ValueError(f"two marked modules are both named {', '.join(twice)}. An agent is named after its module, so mark one")
    return kept


def set_agent_settings(target: Path, settings: dict) -> dict:
    """Record where the agents are, then rebuild so the map shows them. Never touches the repo.

    An empty dict clears them. Only the home region changing costs no rebuild.
    """
    kept = _check_agent_settings(target, settings)
    path = target / "intent" / "agents.json"
    if kept:
        _write_json(path, kept)
    elif path.is_file():
        path.unlink()
    manifest = read_manifest(target)
    ref = manifest.get("ref")
    rebuilt = build(Path(manifest["repo"]), target.parents[1], None if ref in (None, "working tree") else ref)
    return {"settings": kept, "version": rebuilt["version"]}


def load_regions(target: Path) -> dict[str, dict]:
    path = target / "intent" / "regions.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}


def set_region(target: Path, node_id: str, region: str | None) -> dict:
    """Record where a service runs, or clear it with None. No rebuild, and never the repo."""
    if not any(n["id"] == node_id and n["kind"] == "service" for n in load_system(target)["nodes"]):
        raise KeyError(f"no service {node_id!r}")
    regions = load_regions(target)
    if region is None:
        regions.pop(node_id, None)
    else:
        region = region.strip()
        if not REGION.fullmatch(region):
            raise ValueError("a region is 1 to 40 letters, digits, spaces, dots or dashes")
        regions[node_id] = {"region": region, "set_at": int(time.time())}
    _write_json(target / "intent" / "regions.json", regions)
    return {"id": node_id, "region": region}


def region_findings(joined: dict) -> list[dict]:
    """One finding per agent whose model runs outside the home region, citing each call."""
    by_id = {node["id"]: node for node in joined["nodes"]}
    found = []
    for node in joined["nodes"]:
        leaving = node.get("leaves_region") or []
        if node["kind"] != "agent" or not leaving:
            continue
        evidence: list[str] = []
        for edge in joined["edges"]:
            if edge["source"] == node["id"] and edge.get("leaves_region"):
                evidence += [item for item in edge["evidence"] if item not in evidence]
        places = sorted({by_id[service]["region"] for service in leaving})
        names = ", ".join(sorted(by_id[service]["name"] for service in leaving))
        found.append(
            {
                "id": f"agent-leaves-region:{node['name']}",
                "check": "agent-leaves-region",
                "severity": "medium",
                "node": node["id"],
                "title": f"{node['label']} can send data to {', '.join(places)}",
                "detail": f"Your home region is {joined['home_region']}. {node['label']} uses {names}, which you set as {', '.join(places)}.",
                "evidence": evidence[:5],
            }
        )
    return found


def set_plan_status(target: Path, node_id: str, status: str | None) -> dict:
    """Record a person's status for a plan, or clear it with None. Never touches the repo."""
    if not any(n["id"] == node_id and n["kind"] == "plan" for n in load_system(target)["nodes"]):
        raise KeyError(f"no plan {node_id!r}")
    if status is not None and status not in PLAN_STATUSES:
        raise ValueError(f"status must be one of {', '.join(PLAN_STATUSES)}")
    overrides = _plan_overrides(target)
    if status is None:
        overrides.pop(node_id, None)
    else:
        overrides[node_id] = {"status": status, "set_at": int(time.time())}
    _write_json(target / "intent" / "plan_status.json", overrides)
    return {"id": node_id, "status": status}


def plan_items(target: Path, status: str | None = None) -> list[dict]:
    """Plans, worst first: what is left comes before what is done."""
    order = {name: rank for rank, name in enumerate(("planned", "partial", "unclear", "built"))}
    found = [n for n in load_system(target)["nodes"] if n["kind"] == "plan" and (not status or n["status"] == status)]
    return sorted(found, key=lambda n: (order.get(n["status"], 9), n["name"]))


def _links(joined: dict, node_id: str, limit: int = 40) -> dict:
    """What a node connects to, by direction and kind, heaviest first."""
    links: dict[str, list[dict]] = {}
    for edge in sorted(joined["edges"], key=lambda e: -e["count"]):
        if edge["source"] == node_id:
            key, other = f"out_{edge['kind']}", edge["target"]
        elif edge["target"] == node_id:
            key, other = f"in_{edge['kind']}", edge["source"]
        else:
            continue
        group = links.setdefault(key, [])
        if len(group) < limit:
            entry = {"node": other, "count": edge["count"], "evidence": edge["evidence"][:1]}
            if "access" in edge:
                entry["access"] = edge["access"]
            group.append(entry)
    return links


def load_findings(target: Path) -> list[dict]:
    """The build's rule checks, and the region checks, which follow a person's tags live."""
    built = json.loads((current(target) / "findings.json").read_text(encoding="utf-8"))
    return built + region_findings(load_system(target))


def load_coverage(target: Path) -> dict | None:
    path = target / "coverage.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else None


def set_coverage(target: Path, report: str | None = None, commit: str | None = None) -> dict:
    """Load a coverage report. Omit `report` to look for one in the repo's own folder.

    The numbers belong to the commit the tests ran on, so that is recorded too, and read
    from the folder holding the report if it is a checkout of this repo.
    """
    manifest = read_manifest(target)
    repo = Path(manifest["repo"])
    path = Path(report).expanduser() if report else coverage.find_report(repo)
    if path is None or not path.is_file():
        raise ValueError(f"no coverage report at {report or repo / coverage.REPORTS[0]}")
    source = open_source(repo, manifest["commit"] or None)
    parsed = coverage.parse(path.read_text(encoding="utf-8", errors="replace"))
    files, unmatched = coverage.match_paths(parsed, set(source.blobs))
    if not files:
        raise ValueError(f"no file in {path} is in this repo")
    if commit is None and canonical_root(path.parent) == repo:
        commit = git(path.parent, "rev-parse", "HEAD")
    record = {
        "report": str(path),
        "commit": commit,
        "loaded_at": int(time.time()),
        "files": files,
        "unmatched": len(unmatched),
        "lines_total": sum(row["lines_total"] for row in files.values()),
        "lines_hit": sum(row["lines_hit"] for row in files.values()),
        "branches_total": sum(row["branches_total"] for row in files.values()),
        "branches_hit": sum(row["branches_hit"] for row in files.values()),
    }
    _write_json(target / "coverage.json", record)
    return {key: value for key, value in record.items() if key != "files"} | {"file_count": len(files)}


def _coverage_drift(target: Path, record: dict | None) -> int | None:
    """How many reported files have changed between the report and the model."""
    manifest = read_manifest(target)
    if not record or not record.get("commit") or not manifest["commit"]:
        return None
    changed = git(Path(manifest["repo"]), "diff", "--name-only", record["commit"], manifest["commit"])
    if changed is None:
        return None
    return len(set(changed.split()) & set(record["files"]))


def load_risk(target: Path) -> dict:
    """Every file, module and area, worst first, with any coverage report joined in."""
    facts = json.loads((current(target) / "risk.json").read_text(encoding="utf-8"))
    record = load_coverage(target)
    ranked = risk.rank(facts, record)
    if ranked["coverage"]:
        ranked["coverage"]["files_changed_since"] = _coverage_drift(target, record)
    names = {node["id"]: node for node in load_system(target)["nodes"]}
    for row in ranked["modules"] + ranked["areas"]:
        node = names.get(row["id"], {})
        row["name"] = node.get("name", row["id"])
        row["path"] = node.get("path", row["id"])
    return ranked


def _risk_of(target: Path, node_id: str) -> dict | None:
    """One module or area's risk, with the files that drive it."""
    if not node_id.startswith(("module:", "area:")):
        return None
    ranked = load_risk(target)
    level = "modules" if node_id.startswith("module:") else "areas"
    row = next((item for item in ranked[level] if item["id"] == node_id), None)
    if row is None:
        return None
    key = "module" if level == "modules" else "area"
    files = [item for item in ranked["files"] if item[key] == node_id and item["score"] > 0][:5]
    keep = ("path", "commits", "complexity", "tests", "covered", "score")
    return {**row, "worst_files": [{name: item[name] for name in keep} for item in files], "window_days": ranked["window_days"]}


def worktree_state(target: Path) -> dict:
    """Live: what each worktree is changing, joined to this model."""
    manifest = read_manifest(target)
    tables = {row["id"] for row in table_index(target)}
    model = worktrees.Model.of(load_system(target), tables)
    return worktrees.snapshot(Path(manifest["repo"]), manifest["commit"], manifest["ref"], model)


def _shard_path(target: Path, node_id: str) -> Path:
    match = re.fullmatch(r"table:([\w$-]+)\.([\w$-]+)", node_id)
    if not match:
        raise KeyError(f"bad node id {node_id!r}; expected table:<schema>.<name>")
    return current(target) / "tables" / f"{match.group(1)}.{match.group(2)}.json"


def load_node(target: Path, node_id: str) -> dict:
    joined = load_system(target)
    if not node_id.startswith("table:"):
        node = next((n for n in joined["nodes"] if n["id"] == node_id), None)
        if node is None:
            raise KeyError(f"no node {node_id!r}")
        found = {**node, "links": _links(joined, node_id), "reads": load_notes(target, node_id)}
        risky = _risk_of(target, node_id)
        return {**found, "risk": risky} if risky else found
    path = _shard_path(target, node_id)
    if not path.is_file():
        raise KeyError(f"no node {node_id!r}")
    shard = json.loads(path.read_text(encoding="utf-8"))
    shard["reads"] = load_notes(target, node_id)
    shard["findings"] = [f for f in load_findings(target) if f["node"] == node_id]
    shard["links"] = _links(joined, node_id)
    return shard


def _note_dir(target: Path, node_id: str) -> Path:
    return target / "reads" / re.sub(r"[^\w.-]", "_", node_id)


def load_notes(target: Path, node_id: str) -> list[dict]:
    directory = _note_dir(target, node_id)
    if not directory.is_dir():
        return []
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted(directory.glob("*.json"))]


def check_evidence(source, evidence: list, ref: str) -> None:
    """Each entry must be a path or path:line that names a file in `source`."""
    for item in evidence:
        if not isinstance(item, str):
            raise ValueError("evidence must be a list of path or path:line")
        relative = item.rsplit(":", 1)[0] if re.search(r":\d+$", item) else item
        if relative not in source.blobs:
            raise ValueError(f"evidence {item!r} is not a file at {ref}")


def add_note(target: Path, node_id: str, text: str, evidence: list[str]) -> dict:
    """Save an agent's note. Every evidence entry must name a file at the model's commit."""
    load_node(target, node_id)
    if not text.strip():
        raise ValueError("a note needs text")
    if not evidence:
        raise ValueError("a note needs at least one evidence entry, as path or path:line")
    manifest = read_manifest(target)
    check_evidence(open_source(Path(manifest["repo"]), manifest["commit"]), evidence, manifest["ref"])
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
    for node in load_system(target)["nodes"]:
        if needle in node["id"].lower() or needle in node["name"].lower():
            hits.append({"id": node["id"], "matched": [node["kind"]]})
    return hits[:limit]


def neighbors(target: Path, node_id: str) -> dict:
    """What a node links to. A table also lists its foreign keys both ways."""
    if not node_id.startswith("table:"):
        return {"id": node_id, "links": load_node(target, node_id)["links"]}
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
    return {"id": node_id, "outgoing": outgoing, "incoming": incoming, "links": shard["links"]}


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
