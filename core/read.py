"""What a build read, and what it found but couldn't read.

An empty map looks like a broken app unless it says why, so every build records this. A project
the app can't fully read then shows what is missing, by name, with the file that gave it away.
"""
from __future__ import annotations

import re

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


def _unread(source, extraction, tables: int) -> list[dict]:
    found: list[dict] = []
    skipped = extraction.stats.get("statements_unknown", 0)
    if skipped:
        found.append({"what": f"{skipped} SQL {'statement' if skipped == 1 else 'statements'} it couldn't read", "where": ""})
    unread = extraction.stats.get("drizzle_unread", [])
    if unread:
        found.append({"what": f"{_count(len(unread), 'part')} of a Drizzle schema it couldn't read", "where": unread[0]})
    if tables:
        return found
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


def tell(read: dict) -> str:
    """One line for the overview, so an agent knows the model's reach before relying on it."""
    schema = f"{_count(read['tables'], 'table')} from {read['engine']}" if read["engine"] else "no schema"
    routes = f"{_count(read['routes'], 'route')} ({read['route_style']})" if read["routes"] else "no routes"
    parts = [schema, routes, f"{_count(read['code_files'], 'code file')}, {_count(read['links'], 'link')}"]
    if not read["git"]:
        parts.append("no git history, so risk has no churn and there are no worktrees")
    line = "Read: " + "; ".join(parts) + "."
    if read["unread"]:
        line += " Not read: " + "; ".join(item["what"] + (f" ({item['where']})" if item["where"] else "") for item in read["unread"]) + "."
    return line
