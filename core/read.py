"""What a build read, and what it found but couldn't read.

An empty map looks like a broken app unless it says why, so every build records this. A project
the app can't fully read then shows what is missing, by name, with the file that gave it away.
"""
from __future__ import annotations

import re
from pathlib import PurePosixPath

from .extractors import drizzle, typescript
from .sources import package_dependencies

ROUTE_STYLES = {"next-app": "Next.js App Router", "next-pages": "Next.js Pages Router", "file-routes": "file routes"}
NESTED_NEXT = re.compile(r"^.+/next\.config\.\w+$")
CREATE_TABLE = re.compile(r"\bCREATE\s+TABLE\b", re.I)
#: Packages for databases the app has no reader for yet.
OTHER_DATABASES = {
    "mysql2": "MySQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "mongoose": "MongoDB",
}
#: File endings of languages the app doesn't read. It only names them, so a skipped repo isn't silent.
UNREAD_LANGUAGES = {
    ".py": "Python",
    ".java": "Java",
    ".kt": "Kotlin",
    ".go": "Go",
    ".rb": "Ruby",
    ".rs": "Rust",
    ".cs": "C#",
    ".php": "PHP",
    ".swift": "Swift",
    ".scala": "Scala",
    ".ex": "Elixir",
    ".exs": "Elixir",
}


#: Folders of other people's code, wherever they sit. Their files aren't the project's languages.
THIRD_PARTY = {"vendor", "node_modules", "site-packages"}


def _unread_languages(source) -> list[dict]:
    """One item per language the app doesn't read: most files first, then by name.
    Files under a vendor, node_modules or site-packages folder at any depth don't count."""
    folders: dict[str, dict[str, int]] = {}
    for path in source.blobs:
        if THIRD_PARTY & set(path.split("/")[:-1]):
            continue
        language = UNREAD_LANGUAGES.get(PurePosixPath(path).suffix.lower())
        if language:
            top = path.split("/", 1)[0] + "/" if "/" in path else ""
            counts = folders.setdefault(language, {})
            counts[top] = counts.get(top, 0) + 1
    found = []
    for language in sorted(folders, key=lambda name: (-sum(folders[name].values()), name)):
        counts = folders[language]
        where = min(counts, key=lambda top: (-counts[top], top))
        found.append({"what": f"{_count(sum(counts.values()), language + ' file')} it doesn't read", "where": where})
    return found


def _unread(source, extraction, tables: int) -> list[dict]:
    found: list[dict] = []
    skipped = extraction.stats.get("statements_unknown", 0)
    if skipped:
        found.append({"what": f"{skipped} SQL {'statement' if skipped == 1 else 'statements'} it couldn't read", "where": ""})
    unread = extraction.stats.get("drizzle_unread", [])
    if unread:
        found.append({"what": f"{_count(len(unread), 'part')} of a Drizzle schema it couldn't read", "where": unread[0]})
    if not tables:
        if "prisma/schema.prisma" in source.blobs:
            found.append({"what": "A Prisma schema with no SQL migrations", "where": "prisma/schema.prisma"})
        for path in source.blobs:
            if drizzle.CONFIG.match(path):
                found.append({"what": "A Drizzle schema with no SQL migrations", "where": path})
            elif NESTED_NEXT.match(path):
                found.append({"what": "A Next.js app in a subfolder", "where": path})
        packages = package_dependencies(source)["runtime"]
        for package in sorted(packages & set(OTHER_DATABASES)):
            found.append({"what": f"A {OTHER_DATABASES[package]} database", "where": f"package.json: {package}"})
    # Last, so the reason the map is empty comes before the languages it skipped.
    found.extend(_unread_languages(source))
    return found


def _count(number: int, word: str) -> str:
    return f"{number} {word}{'' if number == 1 else 's'}"


def summary(source, extraction, joined: dict) -> dict:
    tables = len(extraction.nodes)
    edges = joined["edges"]
    return {
        "engine": extraction.engine,
        "schema_files": sorted(extraction.inputs)[:20],
        "tables": tables,
        "route_style": ROUTE_STYLES.get(joined.get("route_style", ""), ""),
        "routes": sum(1 for node in joined["nodes"] if node["kind"] == "route"),
        "code_files": sum(1 for path in typescript.code_files(source) if not typescript.TEST_FILE.search(path)),
        "links": sum(1 for edge in edges if edge["kind"] in ("imports", "renders", "uses_table")),
        "plans": sum(1 for node in joined["nodes"] if node["kind"] == "plan"),
        "git": bool(source.commit),
        "unread": _unread(source, extraction, tables),
    }


def not_read(items: list[dict]) -> str:
    """The `Not read: ...` sentence, for `tell` and for a build that refuses a repo."""
    return "Not read: " + "; ".join(item["what"] + (f" ({item['where']})" if item["where"] else "") for item in items) + "."


def refusal(source) -> str:
    """Why a repo with no code or schema is refused, naming the languages it has that the app doesn't read."""
    message = f"{source.root} has no code or schema that System Map can read."
    languages = _unread_languages(source)
    return f"{message} {not_read(languages)}" if languages else message


def tell(read: dict) -> str:
    """One line for the overview, so an agent knows the model's reach before relying on it."""
    schema = f"{_count(read['tables'], 'table')} from {read['engine']}" if read["engine"] else "no schema"
    routes = f"{_count(read['routes'], 'route')} ({read['route_style']})" if read["routes"] else "no routes"
    parts = [schema, routes, f"{_count(read['code_files'], 'code file')}, {_count(read['links'], 'link')}"]
    if not read["git"]:
        parts.append("no git history, so risk has no churn and there are no worktrees")
    line = "Read: " + "; ".join(parts) + "."
    if read["unread"]:
        line += " " + not_read(read["unread"])
    return line
