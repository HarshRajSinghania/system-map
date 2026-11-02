"""Find the workspaces in a folder, and remember which folder is the default.

A workspace is a git repo, or a folder with a `package.json`, since a project needs no git. A
repo's worktrees fold into it, since a build maps them to the main checkout anyway. This reads
only folder names, git's own bookkeeping files and whether a `package.json` is there. It runs no
git command, so a folder holding hundreds of repos still answers at once.
"""
from __future__ import annotations

import json
import os
from pathlib import Path

from .store import _write_json, check_folder, data_root, repo_key

#: A repo often sits one folder down, as in `<folder>/<group>/<repo>`.
MAX_DEPTH = 2
#: Keeps a walk of something huge, such as `/`, from running on.
MAX_FOLDERS = 2000
#: Folders full of other people's code. A repo inside one is never the person's own.
SKIP = {"node_modules", "__pycache__", "venv", "dist", "build", "target", "vendor"}


def tilde(path: Path | str) -> str:
    """Write a path the short way a person would."""
    text, home = str(path), str(Path.home())
    if text == home:
        return "~"
    return f"~{text[len(home):]}" if text.startswith(f"{home}{os.sep}") else text


def main_repo(folder: Path) -> Path | None:
    """The main checkout behind a folder, or None when the folder isn't a workspace.

    Reads what `git rev-parse --git-common-dir` would answer. A submodule also has a `.git`
    file, but it belongs to the repo around it.
    """
    marker = folder / ".git"
    try:
        if marker.is_dir():
            return folder
        text = marker.read_text().strip()
        if not text.startswith("gitdir:"):
            return None
        git_dir = (folder / text.removeprefix("gitdir:").strip()).resolve()
        if git_dir.parent.name != "worktrees":
            return None
        common = git_dir.parent.parent
        if common.name != ".git":
            return folder  # A worktree of a bare repo has no main checkout to fold into.
        return common.parent if common.parent.is_dir() else None
    except (OSError, UnicodeDecodeError):
        return None


def _is_project(folder: Path) -> bool:
    """A folder with no git that a build could still read."""
    try:
        return (folder / "package.json").is_file()
    except OSError:
        return False


def _modified(path: Path) -> float:
    """When a file last changed, or 0 if it isn't there."""
    try:
        return path.stat().st_mtime
    except OSError:
        return 0.0


def _changed_at(git_dir: Path) -> float:
    """When git last touched this checkout's index, or 0 for a repo with no commits staged."""
    return _modified(git_dir / "index")


def _worktrees(main: Path) -> list[Path]:
    """The git dirs of a repo's live worktrees. A pruned one's checkout is gone."""
    live = []
    try:
        entries = list((main / ".git" / "worktrees").iterdir())
    except OSError:
        return live
    for entry in entries:
        try:
            # Git can store this path relative to the entry, and joining keeps an absolute one.
            if (entry / (entry / "gitdir").read_text().strip()).exists():
                live.append(entry)
        except (OSError, UnicodeDecodeError):
            continue
    return live


def _row(main: Path) -> dict:
    worktrees = _worktrees(main)
    has_git = (main / ".git").exists()
    return {
        "path": str(main),
        "name": main.name,
        "key": repo_key(main),
        "git": has_git,
        "worktrees": len(worktrees),
        "touched": max([_changed_at(main / ".git"), *(_changed_at(entry) for entry in worktrees)]) if has_git else _modified(main / "package.json"),
    }


def _subfolders(folder: Path) -> list[Path]:
    """Folders a person would call their own. Hidden ones and unreadable ones stay out."""
    found = []
    try:
        with os.scandir(folder) as entries:
            for entry in entries:
                try:
                    if entry.name.startswith(".") or not entry.is_dir():
                        continue
                except OSError:
                    continue
                found.append(Path(entry.path))
    except OSError:
        pass
    return sorted(found, key=lambda path: path.name.lower())


def workspaces(folder: Path) -> dict:
    """Every workspace in a folder, most recently touched first."""
    folder = check_folder(folder)
    found: dict[str, dict] = {}
    pending = [(folder, 0, False)]
    checked = 0
    truncated = False
    while pending:
        here, depth, in_project = pending.pop()
        main = main_repo(here)
        if main is not None:
            found.setdefault(str(main), _row(main))
            continue  # Nothing inside a repo is a workspace of its own.
        # The picked folder holds projects, so it only counts as one if nothing else turns up.
        project = depth > 0 and not in_project and _is_project(here)
        if project:
            found[str(here)] = _row(here)
        if depth >= MAX_DEPTH:
            continue
        # The walk goes on below a project with no git, since a repo can sit in there. Its own
        # packages stay out, as with a repo.
        for child in _subfolders(here):
            if child.name in SKIP:
                continue
            if checked >= MAX_FOLDERS:
                truncated = True
                break
            checked += 1
            pending.append((child, depth + 1, in_project or project))
    if not found and _is_project(folder):
        found[str(folder)] = _row(folder)
    rows = sorted(found.values(), key=lambda row: (-row["touched"], row["name"].lower()))
    return {"folder": str(folder), "display": tilde(folder), "repos": rows, "truncated": truncated}


def browse(path: Path) -> dict:
    """One folder's subfolders, for picking a folder from inside the page."""
    folder = check_folder(path).resolve()
    if not os.access(folder, os.R_OK | os.X_OK):
        raise ValueError(f"System Map can't read {tilde(folder)}.")
    parent = folder.parent
    return {
        "path": str(folder),
        "display": tilde(folder),
        "parent": None if parent == folder else str(parent),
        "dirs": [{"name": child.name, "path": str(child)} for child in _subfolders(folder)],
    }


def _settings_path(root: Path | None = None) -> Path:
    return (root or data_root()) / "settings.json"


def default_folder(root: Path | None = None) -> str | None:
    """The saved default folder. A file that can't be read counts as none saved."""
    try:
        saved = json.loads(_settings_path(root).read_text()).get("default_folder")
    except (OSError, ValueError, AttributeError):
        return None
    return saved if isinstance(saved, str) and saved else None


def set_default_folder(path: Path, root: Path | None = None) -> str:
    folder = str(check_folder(path).resolve())
    _write_json(_settings_path(root), {"default_folder": folder})
    return folder


def default_workspaces(root: Path | None = None) -> dict:
    """The saved folder's workspaces. A folder since moved or removed is a state, not an error."""
    saved = default_folder(root)
    if saved is None:
        return {"folder": None, "display": None, "repos": [], "truncated": False}
    if not Path(saved).is_dir():
        return {"folder": saved, "display": tilde(saved), "repos": [], "truncated": False, "missing": True}
    return workspaces(Path(saved))
