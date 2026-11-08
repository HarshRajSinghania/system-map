"""Agent settings the Design chat drafts, for a person to use.

The chat reads the code and works out the settings. This module checks them, tries them on the
model's commit without writing a version, and keeps one draft per project. Only a person uses or
drops a draft: no agent tool does it, and the backend refuses any caller the gateway does not vouch
for as a dashboard session. Nothing here writes to a repo.
"""
from __future__ import annotations

import json
import time
from pathlib import Path

from . import agents, store, system
from .sources import open_source

#: How to shape a draft, for a caller that sent it some other way. The tool check uses these too.
SETTINGS_SHAPE = 'settings must be an object from each setting to its value, such as {"list": "src/agents/registry.ts"}'
EVIDENCE_SHAPE = (
    'evidence must be an object beside settings, from each setting to a list of path:line, '
    'such as {"list": ["src/agents/registry.ts:16"]}'
)


def _path(target: Path) -> Path:
    return target / "intent" / "agents-draft.json"


def _code(manifest: dict) -> str:
    """What the model's code was, as one stamp. A project with no git has no commit to compare."""
    return store._hash([manifest.get("inputs"), manifest.get("map_inputs")])


def _merged(settings: dict, saved: dict) -> dict:
    """What using a draft saves: its own settings, and the saved home region if it has none."""
    if "home_region" in settings or not saved.get("home_region"):
        return dict(settings)
    return {**settings, "home_region": saved["home_region"]}


def summary(rows: list[dict]) -> list[dict]:
    """One short line per agent: enough to see what a set of settings finds."""
    return [
        {
            "id": row["id"],
            "label": row["label"],
            "status": row["status"],
            "starts": [link["node"] for link in row["starts"] + row["handed_by"]],
            "hands_off_to": [link["node"] for link in row["hands_off_to"]],
            "models": [f"{model['name']} ({model['region']})" if model["region"] else model["name"] for model in row["models"]],
            "asks_you": bool(row["asks_you"]),
            "leaves_region": row["leaves_region"],
        }
        for row in rows
    ]


def try_settings(target: Path, settings: dict, source=None) -> list[dict]:
    """The agents these settings find at the model's commit, as rows. Writes no version."""
    if source is None:
        manifest = store.read_manifest(target)
        source = open_source(Path(manifest["repo"]), manifest["commit"] or None)
    folder = store.current(target) / "tables"
    tables = [json.loads(path.read_text(encoding="utf-8")) for path in sorted(folder.glob("*.json"))]
    joined = system.build(source, tables, {key: settings[key] for key in store.AGENT_BUILD_KEYS if key in settings})
    home = _merged(settings, store.load_agent_settings(target)).get("home_region")
    store._join_regions(joined, store.load_regions(target), home)
    return agents.rows(joined)


def save(target: Path, settings: object, evidence: object, note: object = "", dry_run: bool = False) -> dict:
    """Check a draft and try it. Unless it is a dry run, keep it in place of any draft before."""
    if not isinstance(settings, dict):
        raise ValueError(SETTINGS_SHAPE)
    if not isinstance(evidence, dict):
        raise ValueError(EVIDENCE_SHAPE)
    if not isinstance(note, str):
        raise ValueError("note must be text")
    kept = store._check_agent_settings(target, settings)
    if not (kept.get("list") or kept.get("modules")):
        raise ValueError("a draft needs a list or modules, or it finds no agents")
    unknown = sorted(set(evidence) - set(store.AGENT_SETTINGS))
    if unknown:
        raise ValueError(f"evidence names no setting: {', '.join(unknown)}")
    missing = [key for key in kept if not evidence.get(key)]
    if missing:
        raise ValueError(f"each setting needs evidence as path:line. None for {', '.join(missing)}")
    manifest = store.read_manifest(target)
    source = open_source(Path(manifest["repo"]), manifest["commit"] or None)
    for key in kept:
        if not isinstance(evidence[key], list):
            raise ValueError(f"evidence for {key} must be a list of path:line")
        store.check_evidence(source, evidence[key], manifest["ref"])
    found = summary(try_settings(target, kept, source))
    result = {"settings": kept, "count": len(found), "agents": found}
    if dry_run:
        return {**result, "saved": False}
    draft = {
        **result,
        "id": f"{time.time_ns():x}",
        "evidence": {key: list(dict.fromkeys(evidence[key])) for key in kept},
        "note": note.strip(),
        "commit": manifest["commit"],
        "code": _code(manifest),
        "ref": manifest["ref"],
        "drafted_at": int(time.time()),
    }
    store._write_json(_path(target), draft)
    return {**result, "saved": True}


def load(target: Path) -> dict:
    """The draft, which settings it would change, and whether the model has moved since."""
    path = _path(target)
    if not path.is_file():
        return {"draft": None, "changed": [], "stale": False}
    draft = json.loads(path.read_text(encoding="utf-8"))
    saved = store.load_agent_settings(target)
    after = _merged(draft["settings"], saved)
    changed = [key for key in store.AGENT_SETTINGS if after.get(key) != saved.get(key)]
    manifest = store.read_manifest(target)
    # A draft from before the code stamp has only its commit to go on.
    stale = draft["commit"] != manifest["commit"] or draft.get("code", _code(manifest)) != _code(manifest)
    return {"draft": draft, "changed": changed, "stale": stale}


def _read(target: Path, draft_id: str) -> dict:
    """The draft, if it is still the one the person saw. The chat may have saved a new one since."""
    path = _path(target)
    if not path.is_file():
        raise KeyError("no agent draft")
    draft = json.loads(path.read_text(encoding="utf-8"))
    if draft.get("id") != draft_id:
        raise ValueError("The Design chat saved a new draft since. Look at it first.")
    return draft


def _remove(target: Path, draft_id: str) -> None:
    """Delete the draft, unless the chat saved a new one meanwhile. That one waits for the person."""
    try:
        _read(target, draft_id)
    except (KeyError, ValueError):
        return
    _path(target).unlink(missing_ok=True)


def use(target: Path, draft_id: str) -> dict:
    """Save the draft's settings with today's checks, rebuild, then drop the draft."""
    draft = _read(target, draft_id)
    result = store.set_agent_settings(target, _merged(draft["settings"], store.load_agent_settings(target)))
    _remove(target, draft_id)
    return result


def drop(target: Path, draft_id: str) -> dict:
    _read(target, draft_id)
    _remove(target, draft_id)
    return {"dropped": True}
