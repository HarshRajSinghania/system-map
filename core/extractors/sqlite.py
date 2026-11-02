"""Read a SQLite schema by asking real SQLite.

Python ships with SQLite, so the repo's schema runs in a database held in memory, and SQLite
says what exists. Any syntax SQLite accepts reads correctly, with no parser to get wrong.

Repo SQL is treated as data. Only schema statements run, attaching a file is refused, the
database never touches disk, and a time limit stops a statement that would run forever.

The schema can be in any `.sql` file, including the ones Prisma and Drizzle generate, or inside
code, as with `db.exec("CREATE TABLE ...")`.
"""
from __future__ import annotations

import re
import sqlite3
import time
from collections import Counter

from ..sources import package_dependencies
from . import drizzle, postgres, typescript

ENGINE = "sqlite"
SCHEMA = "main"
#: Packages that ship with the app and talk to SQLite. A dev dependency proves nothing, since
#: test tools often use SQLite in projects that run on something else.
DRIVERS = {"better-sqlite3", "sqlite3", "sqlite", "@libsql/client", "libsql"}
#: Imports that mean SQLite with no driver package. Hosted SQLite, as on D1, has none.
DRIVER_IMPORTS = re.compile(rf"""["'](?:node:sqlite|bun:sqlite|{drizzle.CORE})["']""")
PRISMA_SQLITE = re.compile(r"""provider\s*=\s*["']sqlite["']""")
DATABASE_FILE = re.compile(r"\.(db|sqlite|sqlite3)$")
#: Past this many files, reading them all to look for a driver stops being cheap.
SCAN_CODE_LIMIT = 400
TIME_LIMIT_SECONDS = 5

SKIP_SQL = re.compile(r"(^|/)(node_modules|dist|build|coverage|\.next|tests?|__tests__|fixtures?|examples?)/")
SEED_FILE = re.compile(r"(^|/)[^/]*seed[^/]*\.sql$", re.I)
SCHEMA_FILE = re.compile(r"(^|/)schema\.sql$", re.I)
CREATE_TABLE = re.compile(r"\bCREATE\s+(?:TEMP(?:ORARY)?\s+)?(?:VIRTUAL\s+)?TABLE\b", re.I)
SCHEMA_VERB = re.compile(r"\s*(?:--[^\n]*\n\s*|/\*.*?\*/\s*)*(CREATE|ALTER|DROP)\b", re.I | re.S)
NAME = r"""(?:\w+\.)?["'`\[]?(\w+)"""
CREATED = re.compile(
    rf"CREATE\s+(?:TEMP(?:ORARY)?\s+)?(?:UNIQUE\s+)?(?:VIRTUAL\s+)?(TABLE|VIEW|TRIGGER|INDEX)\s+(?:IF\s+NOT\s+EXISTS\s+)?{NAME}",
    re.I,
)
ALTERED = re.compile(rf"ALTER\s+TABLE\s+{NAME}\s+ADD\s+(?:COLUMN\s+)?[\"'`\[]?(\w+)", re.I)
TRIGGER = re.compile(
    rf"CREATE\s+(?:TEMP(?:ORARY)?\s+)?TRIGGER\s+(?:IF\s+NOT\s+EXISTS\s+)?{NAME}\s+(BEFORE|AFTER|INSTEAD\s+OF)?\s*(DELETE|INSERT|UPDATE)(?:\s+OF\s+(.+?))?\s+ON\s",
    re.I | re.S,
)


def _is_postgres_project(source) -> bool:
    """Supabase is Postgres, whatever else a project happens to depend on."""
    return bool(source.list_files("supabase/migrations/", (".sql",)))


def detect(source) -> bool:
    if _is_postgres_project(source):
        return False
    if package_dependencies(source)["runtime"] & DRIVERS:
        return True
    if "prisma/schema.prisma" in source.blobs:
        if PRISMA_SQLITE.search(source.read_many(["prisma/schema.prisma"])["prisma/schema.prisma"]):
            return True
    if postgres.detect(source):
        return False
    if any(DATABASE_FILE.search(path) for path in source.blobs):
        return True
    paths = typescript.code_files(source)
    if len(paths) > SCAN_CODE_LIMIT:
        return False
    return any(DRIVER_IMPORTS.search(text) for text in source.read_many(paths).values())


def sql_files(source) -> list[str]:
    """Every `.sql` file that could hold schema, with a schema file ahead of any migrations."""
    found = [path for path in source.list_files("", (".sql",)) if not SKIP_SQL.search(path) and not SEED_FILE.search(path)]
    return sorted(found, key=lambda path: (not SCHEMA_FILE.search(path), path))


def inputs(source) -> dict[str, str]:
    return {path: source.blobs[path] for path in sql_files(source)}


def statements(text: str) -> list[tuple[int, int, str]]:
    """Split SQL with SQLite's own rule, so a trigger's body stays whole. Lines count from 1."""
    found = []
    buffer = ""
    start = 0
    for number, line in enumerate(text.split("\n"), 1):
        if not buffer.strip():
            start, buffer = number, ""
        buffer += line + "\n"
        if sqlite3.complete_statement(buffer):
            found.append((start, number, buffer))
            buffer = ""
    if buffer.strip():
        found.append((start, start + buffer.count("\n"), buffer))
    return found


def code_schema(source) -> list[tuple[str, int, str]]:
    """`CREATE TABLE` held in strings in code, as (file, first line, SQL)."""
    found = []
    paths = [path for path in typescript.code_files(source) if not typescript.TEST_FILE.search(path)]
    for path, text in source.read_many(paths).items():
        masked = typescript.mask_code(text)
        for literal in typescript.STRING_LITERAL.finditer(masked):
            body = literal.group(0)[1:-1]
            if CREATE_TABLE.search(body):
                found.append((path, masked.count("\n", 0, literal.start()) + 1, body))
    return found


def _allow(action: int, *_details) -> int:
    return sqlite3.SQLITE_DENY if action in (sqlite3.SQLITE_ATTACH, sqlite3.SQLITE_DETACH) else sqlite3.SQLITE_OK


def open_database() -> sqlite3.Connection:
    """A database that lives and dies in memory, and can't reach a file."""
    connection = sqlite3.connect(":memory:")
    connection.set_authorizer(_allow)
    deadline = time.monotonic() + TIME_LIMIT_SECONDS
    connection.set_progress_handler(lambda: time.monotonic() > deadline, 10000)
    return connection


class Replay:
    """Run schema statements in order, and remember where each thing was made."""

    def __init__(self) -> None:
        self.connection = open_database()
        self.applied = 0
        self.ignored = 0
        self.failed: list[tuple[str, int, str]] = []
        self.unknown: Counter = Counter()
        self.made: dict[tuple[str, str], tuple[str, int, str]] = {}
        self.added: dict[tuple[str, str], str] = {}
        self.usage: list[str] = []
        #: `file:line` of Drizzle schema that needs its code to run before it can be known.
        self.drizzle_unread: list[str] = []

    def run(self, path: str, line: int, text: str) -> None:
        for start, _end, statement in statements(text):
            self.one(path, line + start - 1, statement)

    def one(self, path: str, line: int, statement: str) -> bool:
        if not SCHEMA_VERB.match(statement):
            if statement.strip(" \n;"):
                self.ignored += 1
            return False
        try:
            self.connection.executescript(statement)
        except sqlite3.Error:
            self.failed.append((path, line, statement))
            return False
        self.applied += 1
        made = CREATED.search(statement)
        if made:
            self.made[(made.group(1).lower(), made.group(2).lower())] = (path, line, statement)
            if made.group(1).lower() in ("view", "trigger"):
                self.usage.append(statement)
        added = ALTERED.search(statement)
        if added:
            self.added[(added.group(1).lower(), added.group(2).lower())] = f"{path}:{line}"
        return True

    def retry(self) -> None:
        """Run what failed once more, since a file can name a table a later file makes."""
        waiting, self.failed = self.failed, []
        for path, line, statement in waiting:
            self.one(path, line, statement)
        for _path, _line, statement in self.failed:
            self.unknown[" ".join(statement.split()[:3]).upper()] += 1


def _source_of(replay: Replay, table: str) -> tuple[str, int, str]:
    return replay.made.get(("table", table.lower()), ("", 0, ""))


def _column_source(replay: Replay, table: str, column: str) -> str:
    path, line, text = _source_of(replay, table)
    added = replay.added.get((table.lower(), column.lower()))
    if added:
        return added
    pattern = re.compile(rf"""^\s*["'`\[]?{re.escape(column)}\b""", re.I)
    for offset, row in enumerate(text.split("\n")):
        if offset and pattern.match(row):
            return f"{path}:{line + offset}"
    return f"{path}:{line}"


def _checks(sql: str) -> list[str]:
    """The body of each CHECK, by walking its brackets. SQLite has no pragma for these."""
    found = []
    for match in re.finditer(r"\bCHECK\s*\(", sql, re.I):
        depth, quote = 1, None
        at = match.end()
        while at < len(sql) and depth:
            letter = sql[at]
            if quote:
                quote = None if letter == quote else quote
            elif letter in "'\"":
                quote = letter
            elif letter in "()":
                depth += 1 if letter == "(" else -1
            at += 1
        found.append(" ".join(sql[match.end() : at - 1].split()))
    return found


def _rows(connection: sqlite3.Connection, pragma: str, name: str) -> list[tuple]:
    quoted = name.replace('"', '""')
    return connection.execute(f'PRAGMA {pragma}("{quoted}")').fetchall()


def _constraints(replay: Replay, name: str, sql: str, columns: list[tuple]) -> tuple[list[dict], list[dict]]:
    connection = replay.connection
    source = lambda column: _column_source(replay, name, column)  # noqa: E731
    constraints: list[dict] = []
    keyed = sorted((row for row in columns if row[5]), key=lambda row: row[5])
    if keyed:
        constraints.append(
            {"name": f"{name}_pkey", "kind": "primary_key", "columns": [row[1] for row in keyed], "source": source(keyed[0][1])}
        )
    groups: dict[int, list[tuple]] = {}
    for row in _rows(connection, "foreign_key_list", name):
        groups.setdefault(row[0], []).append(row)
    for rows in groups.values():
        rows.sort(key=lambda row: row[1])
        first = rows[0]
        origin = [row[3] for row in rows]
        constraints.append(
            {
                "name": f"{name}_{'_'.join(origin)}_fkey",
                "kind": "foreign_key",
                "columns": origin,
                "references": f"{SCHEMA}.{first[2]}",
                "reference_columns": [row[4] for row in rows if row[4]] or ["id"],
                "on_delete": first[6].lower(),
                "on_update": first[5].lower(),
                "source": source(origin[0]),
            }
        )
    indexes: list[dict] = []
    for _seq, index, unique, origin, partial in _rows(connection, "index_list", name):
        names = [row[2] for row in _rows(connection, "index_info", index) if row[2]]
        if origin == "pk" or not names:
            continue
        if origin == "u":
            constraints.append({"name": f"{name}_{'_'.join(names)}_key", "kind": "unique", "columns": names, "source": source(names[0])})
            continue
        path, line, _text = replay.made.get(("index", index.lower()), _source_of(replay, name))
        indexes.append({"name": index, "unique": bool(unique), "columns": names, "partial": bool(partial), "source": f"{path}:{line}"})
    every = [row[1] for row in columns]
    path, line, _text = _source_of(replay, name)
    for number, expression in enumerate(_checks(sql), 1):
        used = [column for column in every if re.search(rf"\b{re.escape(column)}\b", expression)]
        constraints.append(
            {
                "name": f"{name}_{used[0]}_check" if len(used) == 1 else f"{name}_check{number}",
                "kind": "check",
                "columns": used if len(used) == 1 else [],
                "expression": expression,
                "source": f"{path}:{line}",
            }
        )
    return constraints, indexes


def _triggers(replay: Replay, name: str) -> list[dict]:
    found = []
    rows = replay.connection.execute("SELECT name, sql FROM sqlite_master WHERE type = 'trigger' AND tbl_name = ?", (name,))
    for trigger, sql in rows.fetchall():
        match = TRIGGER.search(sql or "")
        path, line, _text = replay.made.get(("trigger", trigger.lower()), ("", 0, ""))
        found.append(
            {
                "name": trigger,
                "timing": " ".join((match.group(2) or "before").lower().split()) if match else "before",
                "events": [match.group(3).lower()] if match else [],
                "function": None,
                "columns": [item.strip(' "`[]') for item in match.group(4).split(",")] if match and match.group(4) else [],
                "when": None,
                "source": f"{path}:{line}",
            }
        )
    return found


def table_shard(replay: Replay, name: str, sql: str) -> dict:
    """One table in the model's own shape, from what SQLite reports."""
    columns = [row for row in _rows(replay.connection, "table_xinfo", name) if row[6] != 1]
    constraints, indexes = _constraints(replay, name, sql, columns)
    keyed = [row for row in columns if row[5]]
    path, line, _text = _source_of(replay, name)
    return {
        "id": f"table:{SCHEMA}.{name}",
        "kind": "table",
        "status": "built",
        "layer": "facts",
        "name": name,
        "schema": SCHEMA,
        "source": f"{path}:{line}",
        "evidence": [f"{path}:{line}"],
        "rls": False,
        "rls_source": None,
        "columns": [
            {
                "name": row[1],
                "type": row[2] or "BLOB",
                # A primary key can't be relied on to hold NULL, even where SQLite would allow it.
                "nullable": not row[3] and not row[5],
                "default": row[4],
                "identity": len(keyed) == 1 and row[5] > 0 and row[2].upper() == "INTEGER",
                "generated": row[6] in (2, 3),
                "source": _column_source(replay, name, row[1]),
            }
            for row in columns
        ],
        "constraints": constraints,
        "indexes": indexes,
        "policies": [],
        "triggers": _triggers(replay, name),
    }


def replay_source(source) -> Replay:
    replay = Replay()
    files = sql_files(source)
    for path, text in sorted(source.read_many(files).items(), key=lambda item: files.index(item[0])):
        replay.run(path, 1, text.replace("--> statement-breakpoint", ""))
    for path, line, text in code_schema(source):
        replay.run(path, line, text)
    # SQL is what the database ran, so a Drizzle schema only speaks when there is none.
    if not any(kind == "table" for kind, _name in replay.made):
        schema = drizzle.read(source)
        replay.drizzle_unread = schema.unread
        for path, line, text in schema.statements:
            replay.run(path, line, text)
    replay.retry()
    return replay


def extract(source) -> dict:
    replay = replay_source(source)
    rows = replay.connection.execute(
        "SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite\\_%' ESCAPE '\\' ORDER BY name"
    ).fetchall()
    shadow = {name for name, sql in rows if sql and re.match(r"\s*CREATE\s+VIRTUAL", sql, re.I)}
    shards = [table_shard(replay, name, sql or "") for name, sql in rows if not any(name.startswith(f"{parent}_") for parent in shadow)]
    known = {shard["name"] for shard in shards}
    externals: dict[str, dict] = {}
    for shard in shards:
        for constraint in shard["constraints"]:
            target = constraint.get("references", "").removeprefix(f"{SCHEMA}.")
            if constraint["kind"] == "foreign_key" and target not in known:
                externals.setdefault(
                    target,
                    {
                        "id": f"table:{SCHEMA}.{target}",
                        "kind": "table",
                        "status": "external",
                        "layer": "facts",
                        "name": target,
                        "schema": SCHEMA,
                        "evidence": [constraint["source"]],
                    },
                )
    used = {path for path, _line, _text in replay.made.values()}
    replay.connection.close()
    return {
        "nodes": shards,
        "externals": list(externals.values()),
        "types": [],
        "stats": {
            "statements_applied": replay.applied,
            "statements_ignored": replay.ignored,
            "statements_unknown": sum(replay.unknown.values()),
            "unknown": dict(replay.unknown.most_common()),
            "drizzle_unread": replay.drizzle_unread,
            "files": len(used),
        },
        "inputs": {path: source.blobs[path] for path in sorted(used)},
        "usage_text": "\n".join(replay.usage),
        "engine": ENGINE,
    }


def tables_at(text: str, lines: set[int] | None) -> set[str]:
    """Tables whose statements sit on these lines, so one edit doesn't mark a whole file."""
    found = set()
    for start, end, statement in statements(text):
        made = CREATED.search(statement) or re.search(rf"(?:ALTER|DROP)\s+TABLE\s+(?:IF\s+EXISTS\s+)?{NAME}", statement, re.I)
        if not made or (lines is not None and lines.isdisjoint(range(start, end + 1))):
            continue
        if len(made.groups()) == 2 and made.group(1).lower() != "table":
            continue
        found.add(f"{SCHEMA}.{made.group(made.lastindex).lower()}")
    return found


def differences(shards: list[dict], truth: sqlite3.Connection) -> list[str]:
    """Hold the model to SQLite's own answers, reading them fresh from `truth`."""
    found: list[str] = []
    names = [row[0] for row in truth.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite\\_%' ESCAPE '\\'")]
    tables = {shard["name"]: shard for shard in shards}
    found += [f"missing table {name}" for name in names if name not in tables]
    found += [f"extra table {name}" for name in tables if name not in names]
    for name in names:
        shard = tables.get(name)
        if not shard:
            continue
        columns = [row for row in _rows(truth, "table_xinfo", name) if row[6] != 1]
        modelled = {column["name"]: column for column in shard["columns"]}
        if [row[1] for row in columns] != [column["name"] for column in shard["columns"]]:
            found.append(f"{name}: columns differ")
        for _cid, column, kind, not_null, default, key, hidden in columns:
            row = modelled.get(column)
            if row and (
                row["type"] != (kind or "BLOB")
                or row["default"] != default
                or row["nullable"] != (not not_null and not key)
                or row["generated"] != (hidden in (2, 3))
            ):
                found.append(f"{name}.{column}: differs")
        keys = sorted((row for row in columns if row[5]), key=lambda row: row[5])
        modelled_keys = [row["columns"] for row in shard["constraints"] if row["kind"] == "primary_key"]
        if [row[1] for row in keys] != (modelled_keys[0] if modelled_keys else []):
            found.append(f"{name}: primary key differs")
        groups: dict[int, list[tuple]] = {}
        for row in _rows(truth, "foreign_key_list", name):
            groups.setdefault(row[0], []).append(row)
        wanted = []
        for rows in groups.values():
            rows.sort(key=lambda item: item[1])
            wanted.append((rows[0][2], rows[0][6].lower(), rows[0][5].lower(), tuple(row[3] for row in rows), tuple(row[4] for row in rows if row[4]) or ("id",)))
        got = sorted(
            (row["references"].removeprefix(f"{SCHEMA}."), row["on_delete"], row["on_update"], tuple(row["columns"]), tuple(row["reference_columns"]))
            for row in shard["constraints"]
            if row["kind"] == "foreign_key"
        )
        if sorted(wanted) != got:
            found.append(f"{name}: foreign keys differ")
        indexes = _rows(truth, "index_list", name)
        unique = sorted(tuple(row[2] for row in _rows(truth, "index_info", item[1])) for item in indexes if item[3] == "u")
        if unique != sorted(tuple(row["columns"]) for row in shard["constraints"] if row["kind"] == "unique"):
            found.append(f"{name}: unique rules differ")
        # The model leaves out an index with no plain column, and the expressions in any other.
        made = [(item[1], tuple(row[2] for row in _rows(truth, "index_info", item[1]) if row[2]), bool(item[2]), bool(item[4])) for item in indexes if item[3] == "c"]
        if sorted(row for row in made if row[1]) != sorted((row["name"], tuple(row["columns"]), row["unique"], row["partial"]) for row in shard["indexes"]):
            found.append(f"{name}: indexes differ")
        sql = truth.execute("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?", (name,)).fetchone()[0] or ""
        if sorted(_checks(sql)) != sorted(row["expression"] for row in shard["constraints"] if row["kind"] == "check"):
            found.append(f"{name}: checks differ")
    return found

