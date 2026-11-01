"""Where extractors read a repo from.

A model describes the main branch, so `GitSource` reads files at a ref and never
depends on what a checkout has open. `TreeSource` covers a folder with no git.
"""
from __future__ import annotations

import hashlib
import subprocess
from pathlib import Path, PurePosixPath


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


def canonical_root(path: Path) -> Path:
    """Map a repo folder or any of its worktrees to the main checkout."""
    path = path.expanduser().resolve()
    common = git(path, "rev-parse", "--path-format=absolute", "--git-common-dir")
    if not common:
        return path
    common_dir = Path(common)
    return common_dir.parent if common_dir.name == ".git" else path


def default_ref(repo_root: Path) -> str | None:
    """Pick the repo's main branch, or None when the folder is not a git repo."""
    head = git(repo_root, "symbolic-ref", "--short", "refs/remotes/origin/HEAD")
    if head:
        return head
    for candidate in ("origin/main", "origin/master", "main", "master", "HEAD"):
        if git(repo_root, "rev-parse", "--verify", "--quiet", candidate):
            return candidate
    return None


class GitSource:
    def __init__(self, repo_root: Path, ref: str):
        self.root = repo_root
        self.ref = ref
        self.commit = git(repo_root, "rev-parse", ref)
        if not self.commit:
            raise ValueError(f"cannot resolve {ref!r} in {repo_root}")
        self._blobs: dict[str, str] | None = None

    @property
    def blobs(self) -> dict[str, str]:
        """Every file at the ref, mapped to its content id."""
        if self._blobs is None:
            listing = git(self.root, "ls-tree", "-r", "--full-tree", self.commit) or ""
            self._blobs = {}
            for line in listing.splitlines():
                meta, path = line.split("\t", 1)
                parts = meta.split()
                if parts[1] == "blob":
                    self._blobs[path] = parts[2]
        return self._blobs

    def list_files(self, prefix: str = "", suffixes: tuple[str, ...] = ()) -> list[str]:
        return sorted(
            path
            for path in self.blobs
            if path.startswith(prefix) and (not suffixes or path.endswith(suffixes))
        )

    def read_many(self, paths: list[str]) -> dict[str, str]:
        """Read many files in one git process."""
        if not paths:
            return {}
        request = "".join(f"{self.commit}:{path}\n" for path in paths).encode()
        done = subprocess.run(
            ["git", "-C", str(self.root), "cat-file", "--batch"],
            input=request,
            capture_output=True,
            timeout=120,
            check=True,
        )
        out, at, found = done.stdout, 0, {}
        for path in paths:
            end = out.index(b"\n", at)
            header = out[at:end].split()
            at = end + 1
            if header[-1] == b"missing":
                continue
            size = int(header[2])
            found[path] = out[at : at + size].decode("utf-8", "replace")
            at += size + 1
        return found


class TreeSource:
    """A plain folder: for a repo with no git, and for tests."""

    def __init__(self, root: Path):
        self.root = root.resolve()
        self.ref = "working tree"
        self.commit = None

    @property
    def blobs(self) -> dict[str, str]:
        found = {}
        for path in self.root.rglob("*"):
            relative = path.relative_to(self.root)
            if path.is_file() and not {".git", "node_modules"} & set(relative.parts):
                found[PurePosixPath(relative).as_posix()] = hashlib.sha1(path.read_bytes()).hexdigest()
        return found

    def list_files(self, prefix: str = "", suffixes: tuple[str, ...] = ()) -> list[str]:
        return sorted(
            path
            for path in self.blobs
            if path.startswith(prefix) and (not suffixes or path.endswith(suffixes))
        )

    def read_many(self, paths: list[str]) -> dict[str, str]:
        return {path: (self.root / path).read_text(encoding="utf-8", errors="replace") for path in paths}


def open_source(repo_root: Path, ref: str | None = None) -> GitSource | TreeSource:
    resolved = ref or default_ref(repo_root)
    return GitSource(repo_root, resolved) if resolved else TreeSource(repo_root)
