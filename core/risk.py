"""Where a change is most likely to hurt: code that changes often, has many paths, and few tests.

Three facts for each file, each from a tool that does not guess:

    commits     git history, in a window ending at the model's commit, so one commit always
                gives one answer
    complexity  how many paths the code can take, from `typescript.decision_points`
    tests       which test files reach it by following imports, read from the code. A coverage
                report, if one is loaded, gives the real number on top of that

`rank` joins them when they are read, so loading a report needs no rebuild.
"""
from __future__ import annotations

from collections import Counter, defaultdict

from .extractors import typescript
from .sources import git, run_git

WINDOW_DAYS = 90
#: Hot means busier than three quarters of its peers, and more than a passing change.
HOT_SHARE = 0.75
MIN_HOT_COMMITS = 3
#: Below this share of its lines run by tests, code counts as untested.
TESTED_FROM = 0.5
DAY = 86400


def _number(text: str) -> int:
    return int(text) if text.isdigit() else 0  # Git prints `-` for a binary file.


def parse_log(raw: str) -> list[dict]:
    """Read `git log --numstat -z`, newest first, giving each file its name of today."""
    commits, renamed = [], {}
    for chunk in raw.split("\x01")[1:]:
        sha, _, body = chunk.partition("\0")
        fields = body.lstrip("\n").split("\0")
        changed: dict[str, tuple[int, int]] = {}
        at = 0
        while at < len(fields) and fields[at]:
            added, deleted, path = fields[at].split("\t", 2)
            if path:
                at += 1
            else:
                old, path = fields[at + 1], fields[at + 2]
                at += 3
                renamed[old] = renamed.get(path, path)
            changed[renamed.get(path, path)] = (_number(added), _number(deleted))
        commits.append({"sha": sha, "files": changed})
    return commits


def history(source, days: int = WINDOW_DAYS) -> dict:
    """Every commit in the window ending at the model's commit, and the files it changed."""
    if not source.commit:
        return {"known": False, "commits": [], "since": None, "shallow": False}
    stamp = int(git(source.root, "show", "-s", "--format=%ct", source.commit) or 0)
    since = stamp - days * DAY
    done = run_git(source.root, "log", source.commit, "--no-merges", "--numstat", "-z", "-M", f"--since=@{since}", "--format=%x01%H")
    if done is None or done.returncode != 0:
        return {"known": False, "commits": [], "since": since, "shallow": False}
    shallow = git(source.root, "rev-parse", "--is-shallow-repository") == "true"
    return {"known": True, "commits": parse_log(done.stdout), "since": since, "shallow": shallow}


def test_reach(imports: dict[str, list[str]]) -> tuple[Counter, Counter]:
    """For each file, how many tests import it, and how many reach it through imports."""
    direct: Counter[str] = Counter()
    reached: Counter[str] = Counter()
    for test in imports:
        if not typescript.TEST_FILE.search(test):
            continue
        direct.update(set(imports[test]))
        seen: set[str] = set()
        stack = list(imports[test])
        while stack:
            path = stack.pop()
            if path not in seen:
                seen.add(path)
                stack += imports.get(path, [])
        reached.update(seen)
    return direct, reached


def tests_by_file(imports: dict[str, list[str]]) -> dict[str, list[str]]:
    """For each file, the test files that reach it through imports."""
    found: dict[str, list[str]] = defaultdict(list)
    for test in sorted(imports):
        if not typescript.TEST_FILE.search(test):
            continue
        seen: set[str] = set()
        stack = list(imports[test])
        while stack:
            path = stack.pop()
            if path not in seen:
                seen.add(path)
                stack += imports.get(path, [])
        for path in seen:
            found[path].append(test)
    return found


def build(source, joined: dict) -> dict:
    """The Facts behind every risk view. They are per file, so nothing here needs a rerun."""
    root = joined["code_root"]
    log = history(source)
    direct, reached = test_reach(joined["imports"])
    files: dict[str, dict] = {}
    for path, complexity in joined["complexity"].items():
        area, module = typescript.module_of(path, root)
        files[path] = {
            "module": f"module:{module}",
            "area": f"area:{area}",
            "lines": joined["lines"][path],
            "complexity": complexity,
            "commits": 0,
            "added": 0,
            "deleted": 0,
            "tests_direct": direct[path],
            "tests": reached[path],
        }
    groups: dict[str, set[str]] = defaultdict(set)
    for commit in log["commits"]:
        for path, (added, deleted) in commit["files"].items():
            row = files.get(path)
            if row:
                row["commits"] += 1
                row["added"] += added
                row["deleted"] += deleted
                groups[row["module"]].add(commit["sha"])
                groups[row["area"]].add(commit["sha"])
    return {
        "window_days": WINDOW_DAYS,
        "since": log["since"],
        "history_known": log["known"],
        "shallow": log["shallow"],
        "test_files": sum(1 for path in joined["imports"] if typescript.TEST_FILE.search(path)),
        "files": files,
        "commits_by_node": {key: len(value) for key, value in groups.items()},
    }


def _share(hit: int, total: int) -> float | None:
    return round(hit / total, 4) if total else None


def _file_row(path: str, facts: dict, report: dict | None) -> dict:
    numbers = report.get(path) if report is not None else None
    row = {"path": path, **facts, "ui": path.endswith((".tsx", ".jsx")), "in_report": numbers is not None}
    if report is None:
        row["covered"] = None
        row["branches"] = None
        row["cover"] = 1.0 if facts["tests"] else 0.0
    elif numbers is None:
        row["covered"] = row["branches"] = row["cover"] = 0.0
    else:
        row["covered"] = _share(numbers["lines_hit"], numbers["lines_total"])
        row["branches"] = _share(numbers["branches_hit"], numbers["branches_total"])
        # A file of only types has no lines to run, so there is nothing for a test to miss.
        row["cover"] = 1.0 if row["covered"] is None else row["covered"]
    return row


def _group_row(key: str, rows: list[dict], commits: int, report: dict | None) -> dict:
    lines = sum(row["lines"] for row in rows)
    row = {
        "id": key,
        "files": len(rows),
        "lines": lines,
        "complexity": sum(row["complexity"] for row in rows),
        "commits": commits,
        "reached_files": sum(1 for row in rows if row["tests"]),
        "covered": None,
        "branches": None,
    }
    if report is None:
        row["cover"] = _share(sum(item["lines"] for item in rows if item["tests"]), lines) or 0.0
        return row
    # A file the report leaves out ran no tests, so it counts as all missed.
    found = [report.get(item["path"]) for item in rows]
    hit = sum(numbers["lines_hit"] for numbers in found if numbers)
    total = sum(numbers["lines_total"] if numbers else item["lines"] for item, numbers in zip(rows, found))
    branches = [numbers for numbers in found if numbers]
    row["covered"] = _share(hit, total)
    row["branches"] = _share(sum(n["branches_hit"] for n in branches), sum(n["branches_total"] for n in branches))
    row["cover"] = 1.0 if row["covered"] is None else row["covered"]
    return row


def _hot_line(rows: list[dict]) -> int:
    busy = sorted(row["commits"] for row in rows if row["commits"])
    if not busy:
        return MIN_HOT_COMMITS
    return max(busy[int(len(busy) * HOT_SHARE)], MIN_HOT_COMMITS)


def _judge(rows: list[dict]) -> list[dict]:
    """Score each row, worst first: how often it changes, by how branchy, by how bare."""
    line = _hot_line(rows)
    for row in rows:
        row["hot"] = row["commits"] >= line
        # Code with no paths, such as a file of re-exports, has nothing a test could miss.
        row["untested"] = row["cover"] < TESTED_FROM and row["complexity"] > 0
        row["score"] = round(row["commits"] * row["complexity"] * (1 - row["cover"]), 1)
    return sorted(rows, key=lambda row: (-row["score"], -row["commits"], row.get("path") or row["id"]))


def rank(facts: dict, coverage: dict | None = None) -> dict:
    """Join the Facts with a coverage report, if there is one, into ranked lists."""
    report = coverage["files"] if coverage else None
    files = [_file_row(path, row, report) for path, row in facts["files"].items()]
    by_group: dict[str, list[dict]] = defaultdict(list)
    for row in files:
        by_group[row["module"]].append(row)
        by_group[row["area"]].append(row)
    groups = [_group_row(key, rows, facts["commits_by_node"].get(key, 0), report) for key, rows in by_group.items()]
    meta = {key: facts[key] for key in ("window_days", "since", "history_known", "shallow", "test_files")}
    return {
        **meta,
        "coverage": {key: value for key, value in coverage.items() if key != "files"} if coverage else None,
        "files": _judge(files),
        "modules": _judge([row for row in groups if row["id"].startswith("module:")]),
        "areas": _judge([row for row in groups if row["id"].startswith("area:")]),
    }


def worst(ranked: dict, level: str = "modules", limit: int = 15) -> list[dict]:
    """What to look at first: hot and untested, worst first."""
    return [row for row in ranked[level] if row["hot"] and row["untested"]][:limit]
