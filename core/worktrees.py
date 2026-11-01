"""What each worktree is changing, and where two of them meet.

This reads live state, so it is worked out on request and never stored. Files are joined
to the model: a code file gives its module, a migration gives the tables it changes, and a
changed file that calls a table gives that table too.

Nothing here writes to the repo. The trial merge writes its objects to a temporary folder.
"""
from __future__ import annotations

import os
import re
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

from .extractors import postgres, sqlite, typescript
from .sources import git, run_git

SEVERITIES = ("high", "medium", "low", "info")
#: A query runs on below its `.from("x")` line, so an edit this close is an edit to the query.
QUERY_REACH_LINES = 12
HUNK = re.compile(r"^@@ -\S+ \+(\d+)(?:,(\d+))? @@", re.M)


def listing(repo_root: Path) -> list[dict]:
    """Each worktree git knows about. A folder that has gone is left out."""
    found = []
    for block in (git(repo_root, "worktree", "list", "--porcelain") or "").split("\n\n"):
        fields = dict(line.split(" ", 1) for line in block.splitlines() if " " in line)
        path = fields.get("worktree")
        if not path or "bare" in block.splitlines() or not Path(path).is_dir():
            continue
        branch = fields.get("branch", "").replace("refs/heads/", "")
        found.append({"path": path, "branch": branch, "head": fields.get("HEAD", ""), "name": branch or Path(path).name})
    return found


def _names(done) -> set[str]:
    return {name for name in (done.stdout.split("\0") if done and done.returncode == 0 else []) if name}


def uncommitted(path: str) -> set[str]:
    """Every file with uncommitted work, new files included."""
    done = run_git(Path(path), "status", "--porcelain", "-z", "--untracked-files=all")
    if not done or done.returncode != 0:
        return set()
    found, entries, at = set(), done.stdout.split("\0"), 0
    while at < len(entries) and entries[at]:
        entry = entries[at]
        found.add(entry[3:])
        # A rename lists its old name next, as an entry of its own.
        at += 2 if entry[0] in "RC" or entry[1] in "RC" else 1
    return found


def committed(path: str, commit: str) -> tuple[set[str], int, int, str]:
    """Files this branch changed that the main branch does not have yet.

    A file that now matches the main branch is left out, so a squash-merged branch counts
    as finished and not as a change. Returns the files, commits ahead and behind, and the
    commit the branch started from.
    """
    folder = Path(path)
    base = git(folder, "merge-base", "HEAD", commit)
    if not base:
        return set(), 0, 0, ""
    since_base = _names(run_git(folder, "diff", "--name-only", "--no-renames", "-z", base, "HEAD"))
    differs = _names(run_git(folder, "diff", "--name-only", "--no-renames", "-z", commit, "HEAD"))
    ahead = git(folder, "rev-list", "--count", f"{base}..HEAD") or "0"
    behind = git(folder, "rev-list", "--count", f"{base}..{commit}") or "0"
    return since_base & differs, int(ahead), int(behind), base


def changed_lines(folder: str, base: str, path: str) -> set[int] | None:
    """Lines of a file that differ from `base`. None means all of them, as in a new file."""
    done = run_git(Path(folder), "diff", "-U0", "--no-color", "--no-ext-diff", base, "--", path) if base else None
    if done is None or done.returncode != 0 or not done.stdout or "\nnew file mode" in done.stdout:
        return None
    lines: set[int] = set()
    for match in HUNK.finditer(done.stdout):
        start = int(match.group(1))
        count = int(match.group(2) or 1)
        # With nothing added, the edit sits between this line and the next.
        lines |= set(range(start, start + count)) if count else {start, start + 1}
    return lines


def tables_touched(text: str, lines: set[int] | None) -> set[str]:
    """Tables whose queries sit near a changed line.

    A file can call dozens of tables, so a change to the file is not a change to each.
    """
    found = set()
    for use in typescript.table_uses(typescript.mask_code(text)):
        reach = range(use["line"] - 1, use["line"] + QUERY_REACH_LINES + 1)
        if lines is None or not lines.isdisjoint(reach):
            # The caller keeps the ids that exist, which settles which schema this is.
            found |= {f"table:public.{use['table']}", f"table:main.{use['table']}"}
    return found


def trial_merge(repo_root: Path, left: str, right: str) -> list[str] | None:
    """The files two commits conflict in, by really merging them. None if git cannot say.

    `merge-tree` writes new objects, so they go to a temporary folder that is then
    deleted. The repo is left exactly as it was.
    """
    common = git(repo_root, "rev-parse", "--path-format=absolute", "--git-common-dir")
    if not common:
        return None
    with tempfile.TemporaryDirectory(prefix="system-map-") as folder:
        env = {**os.environ, "GIT_OBJECT_DIRECTORY": folder, "GIT_ALTERNATE_OBJECT_DIRECTORIES": str(Path(common) / "objects")}
        done = run_git(repo_root, "merge-tree", "--write-tree", "--name-only", "--no-messages", left, right, env=env)
    if done is None or done.returncode not in (0, 1):
        return None
    return [] if done.returncode == 0 else [line for line in done.stdout.splitlines()[1:] if line]


@dataclass
class Model:
    """The parts of the system model that files are joined to."""

    code_root: str
    #: node ids that exist, so only real tables and modules count.
    nodes: set[str]
    #: file -> routes, plans and jobs built from it.
    by_file: dict[str, set[str]]

    @classmethod
    def of(cls, system: dict, tables: set[str]) -> "Model":
        by_file: dict[str, set[str]] = {}
        for node in system["nodes"]:
            if node["kind"] not in ("route", "plan", "job"):
                continue
            where = [item.rsplit(":", 1)[0] for item in node["evidence"]]
            if node["kind"] == "plan":
                where.append(node["path"])
            for path in where:
                by_file.setdefault(path, set()).add(node["id"])
        return cls(system.get("code_root", ""), {node["id"] for node in system["nodes"]} | tables, by_file)


@dataclass
class Changes:
    name: str
    base: str = ""
    files: set[str] = field(default_factory=set)
    open_files: set[str] = field(default_factory=set)
    modules: set[str] = field(default_factory=set)
    #: Tables its migrations change, and tables that code it changed calls.
    schema: set[str] = field(default_factory=set)
    code: set[str] = field(default_factory=set)
    others: set[str] = field(default_factory=set)


def _is_code(path: str, root: str) -> bool:
    return (
        path.startswith(root)
        and path.endswith(typescript.CODE_SUFFIXES)
        and not path.endswith(".d.ts")
        and not typescript.SKIP_DIRS.search(path)
        and not typescript.GENERATED.search(path)
    )


def _read(folder: str, path: str) -> str | None:
    try:
        return (Path(folder) / path).read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None


def join(changes: Changes, folder: str, model: Model) -> None:
    """Find the nodes a worktree's changed files belong to."""
    root = model.code_root
    for path in sorted(changes.files):
        changes.others |= model.by_file.get(path, set())
        if path.endswith(".sql") and path.startswith(postgres.MIGRATION_DIRS):
            text = _read(folder, path)
            changes.schema |= {f"table:{name}" for name in postgres.tables_changed(text or "", path)}
        if path.endswith(".sql"):
            text = _read(folder, path)
            changes.schema |= {f"table:{name}" for name in sqlite.tables_at(text or "", changed_lines(folder, changes.base, path))} & model.nodes
        elif _is_code(path, root):
            area, module = typescript.module_of(path, root)
            changes.modules |= {f"module:{module}", f"area:{area}"}
            if not typescript.TEST_FILE.search(path):
                text = _read(folder, path) or ""
                changes.code |= tables_touched(text, changed_lines(folder, changes.base, path)) & model.nodes


def _count(number: int, word: str) -> str:
    return f"{number} {word}{'' if number == 1 else 's'}"


def _tables(ids: list[str]) -> str:
    names = [item.replace("table:public.", "").replace("table:main.", "").replace("table:", "") for item in ids]
    return names[0] if len(names) == 1 else f"{len(names)} tables"


def _sentence(a: str, b: str, row: dict) -> str:
    if row["conflicts"]:
        return f"{a} and {b} conflict in {_count(len(row['conflicts']), 'file')}"
    if row["schema"]:
        return f"{a} and {b} both change {_tables(row['schema'])}"
    if row["schema_and_code"]:
        return f"{a} and {b}: one changes {_tables(row['schema_and_code'])}, the other changes code that uses it"
    if row["files"]:
        clean = ", which merges clean" if row["merge"] == "clean" else ""
        return f"{a} and {b} share {_count(len(row['files']), 'file')}{clean}"
    if row["code"]:
        return f"{a} and {b} both change code that uses {_tables(row['code'])}"
    return f"{a} and {b} both work in {_count(len(row['modules']), 'module')}"


def compare(a: Changes, b: Changes, heads: dict[str, str], repo_root: Path) -> dict | None:
    """What two worktrees have in common, and how much it matters."""
    shared = a.files & b.files
    schema = a.schema & b.schema
    schema_and_code = ((a.schema & b.code) | (b.schema & a.code)) - schema
    code = (a.code & b.code) - schema - schema_and_code
    # An area is only a folder of modules, so two changes in one area are not near each other.
    modules = {item for item in a.modules & b.modules if item.startswith("module:")}
    if not (shared or schema or schema_and_code or code or modules):
        return None

    unsaved = sorted(shared & (a.open_files | b.open_files))
    conflicts = trial_merge(repo_root, heads[a.name], heads[b.name]) if shared else []
    if conflicts is None:
        merge = "unknown"
    elif conflicts:
        merge = "conflict"
    elif not shared:
        merge = "not needed"
    else:
        merge = "uncommitted" if unsaved else "clean"
    conflicts = conflicts or []

    if conflicts or schema:
        severity = "high"
    elif schema_and_code:
        severity = "medium"
    elif shared or code:
        severity = "low"
    else:
        severity = "info"
    row = {
        "a": a.name,
        "b": b.name,
        "severity": severity,
        "conflicts": conflicts,
        "merge": merge,
        "uncommitted": unsaved,
        "files": sorted(shared),
        "schema": sorted(schema),
        "schema_and_code": sorted(schema_and_code),
        "code": sorted(code),
        "modules": sorted(modules),
    }
    row["summary"] = _sentence(a.name, b.name, row)
    return row


def snapshot(repo_root: Path, commit: str, ref: str, model: Model) -> dict:
    """Every worktree's changes, the nodes they touch, and every overlap between them."""
    worktrees, states = [], []
    for item in listing(repo_root):
        readable = git(Path(item["path"]), "rev-parse", "HEAD") is not None
        changed, ahead, behind, base = committed(item["path"], commit) if readable else (set(), 0, 0, "")
        open_files = uncommitted(item["path"]) if readable else set()
        state = Changes(item["name"], base, changed | open_files, open_files)
        join(state, item["path"], model)
        states.append(state)
        worktrees.append(
            {
                **item,
                "readable": readable,
                "ahead": ahead,
                "behind": behind,
                "uncommitted_files": len(open_files),
                "files": sorted(state.files),
                "modules": sorted(node for node in state.modules if node.startswith("module:")),
                "tables_schema": sorted(state.schema),
                "tables_code": sorted(state.code - state.schema),
                "other_nodes": sorted(state.others),
            }
        )

    heads = {item["name"]: item["head"] for item in worktrees}
    overlaps = []
    for index, a in enumerate(states):
        for b in states[index + 1 :]:
            row = compare(a, b, heads, repo_root)
            if row:
                overlaps.append(row)
    overlaps.sort(key=lambda row: (SEVERITIES.index(row["severity"]), row["a"], row["b"]))

    by_node: dict[str, list[str]] = {}
    for state in states:
        for node in sorted(state.modules | state.schema | state.code | state.others):
            by_node.setdefault(node, []).append(state.name)
    return {
        "ref": ref,
        "commit": commit,
        "worktrees": worktrees,
        "overlaps": overlaps,
        "by_node": by_node,
        "counts": {name: sum(1 for row in overlaps if row["severity"] == name) for name in SEVERITIES},
    }
