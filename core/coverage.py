"""Read a test coverage report into plain numbers for each file.

Two formats are read: Istanbul's `coverage-final.json`, which Vitest and Jest write, and
`lcov.info`, which most other test runners can write. The numbers count the same way
Istanbul does, so a total here matches the total the test runner prints.
"""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

#: Where a test runner leaves a report, best first.
REPORTS = ("coverage/coverage-final.json", "coverage/lcov.info")


def _istanbul(report: dict) -> dict[str, dict]:
    files = {}
    for path, entry in report.items():
        lines: dict[int, int] = {}
        for key, count in entry["s"].items():
            place = entry["statementMap"].get(key)
            if place:
                line = place["start"]["line"]
                lines[line] = max(lines.get(line, 0), count)
        branches = [count for counts in entry["b"].values() for count in counts]
        files[path] = {
            "lines_total": len(lines),
            "lines_hit": sum(1 for count in lines.values() if count > 0),
            "branches_total": len(branches),
            "branches_hit": sum(1 for count in branches if count > 0),
        }
    return files


def _lcov(text: str) -> dict[str, dict]:
    files: dict[str, dict] = {}
    current: dict | None = None
    for line in text.splitlines():
        if line.startswith("SF:"):
            current = files.setdefault(line[3:], {"lines_total": 0, "lines_hit": 0, "branches_total": 0, "branches_hit": 0})
        elif current is None:
            continue
        elif line.startswith("DA:"):
            current["lines_total"] += 1
            current["lines_hit"] += int(line[3:].split(",")[1]) > 0
        elif line.startswith("BRDA:"):
            taken = line[5:].split(",")[3]
            current["branches_total"] += 1
            current["branches_hit"] += taken not in ("-", "0")
    return files


def parse(text: str) -> dict[str, dict]:
    """Numbers for each file in a report, in either format."""
    start = text.lstrip()[:1]
    if start == "{":
        try:
            report = json.loads(text)
            return _istanbul(report)
        except (json.JSONDecodeError, KeyError, TypeError, AttributeError) as error:
            raise ValueError(f"not an Istanbul coverage report: {error}") from error
    if "SF:" in text:
        return _lcov(text)
    raise ValueError("not a coverage report: expected coverage-final.json or lcov.info")


def _longest_match(path: str, known: set[str]) -> str | None:
    parts = path.lstrip("/").split("/")
    for start in range(len(parts)):
        candidate = "/".join(parts[start:])
        if candidate in known:
            return candidate
    return None


def match_paths(files: dict[str, dict], known: set[str]) -> tuple[dict[str, dict], list[str]]:
    """Turn a report's paths into repo paths.

    A report names files from wherever the tests ran, so the folder it ran in is found
    first, from the paths most files share. Anything outside it stays unmatched.
    """
    roots: Counter[str] = Counter()
    for path in files:
        found = _longest_match(path, known)
        if found:
            roots[path[: len(path) - len(found)]] += 1
    root = roots.most_common(1)[0][0] if roots else ""
    matched, unmatched = {}, []
    for path, numbers in files.items():
        relative = path[len(root) :] if path.startswith(root) else None
        if relative in known:
            matched[relative] = numbers
        else:
            unmatched.append(path)
    return matched, sorted(unmatched)


def find_report(folder: Path) -> Path | None:
    for relative in REPORTS:
        path = folder / relative
        if path.is_file():
            return path
    return None
