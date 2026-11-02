"""Read a Drizzle schema for SQLite without running it.

A Drizzle schema is TypeScript, so SQLite has nothing to read. This walks the text of each
`sqliteTable(...)` and writes the SQL that `drizzle-kit generate` would. That SQL then goes
through the same real SQLite as any other schema, so the model has one shape and SQLite
stays the judge of it.

Each column keeps its line's distance from the table's first line, so evidence lands on the
line in the `.ts` file.

Only running the code could answer some things, such as a table made in a loop. Those are
counted in `unread`, by file and line, and never guessed.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from functools import lru_cache

from . import typescript

CORE = "drizzle-orm/sqlite-core"
CONFIG = re.compile(r"^drizzle\.config\.\w+$")
CASING = re.compile(r"""\bcasing\s*:\s*["'](\w+)["']""")
WORDS = re.compile(r"[0-9a-z]+|[A-Z]+(?![a-z])|[A-Z][0-9a-z]+")
IMPORT = re.compile(rf"""\bimport\s+([^;"']+?)\s+from\s*["']{CORE}["']""")
CALL = re.compile(r"(?<![\w$.])((?:[\w$]+\.)?[\w$]+)\s*\(")
HEAD = re.compile(r"\s*((?:[\w$]+\.)?[\w$]+)\s*")
METHOD = re.compile(r"\s*\.\s*([\w$]+)\s*")
DECLARED = re.compile(r"\b(?:const|let|var)\s+([\w$]+)[^=;]*=\s*$")
OBJECT = re.compile(r"\b(?:const|let|var)\s+([\w$]+)\s*(?::[^=]+)?=\s*\{")
PROPERTY = re.compile(r"""\s*(?:([\w$]+)|"([^"]+)"|'([^']+)')\s*:""")
SPREAD = re.compile(r"\s*\.\.\.\s*(?:[\w$]+\.)*([\w$]+)\s*")
CALLBACK = re.compile(r"\s*(?:\(\s*([\w$]+)[^)]*\)|([\w$]+))\s*(?::[^=]+)?=>\s*\(?\s*\{")
EXTRAS_BODY = re.compile(r"=>\s*(?:\(\s*|\{\s*return\s+)?([\[{])")
KEYED = re.compile(r"\s*[\w$]+\s*:")
FIELD = re.compile(r"(?:[\w$]+\.)*([\w$]+)\.([\w$]+)")
REFERENCE = re.compile(r"=>\s*(?:[\w$]+\.)*([\w$]+)\.([\w$]+)")
TEMPLATE = re.compile(r"\bsql\s*`")
LENGTH = re.compile(r"\blength\s*:\s*(\d+)")
AUTO_INCREMENT = re.compile(r"\bautoIncrement\s*:\s*true\b")
STORED = re.compile(r"""\bmode\s*:\s*["']stored["']""")
NUMBER = re.compile(r"-?\d+(?:\.\d+)?")
ESCAPE = re.compile(r"\\(.)", re.S)
ESCAPES = {"n": "\n", "t": "\t", "r": "\r"}
#: Calls that change no SQL, because they only run in the app or only shape its types.
NO_SQL = {"$type", "$default", "$defaultFn", "$onUpdate", "$onUpdateFn"}
#: Drizzle's column makers, and the SQL type each one writes.
BUILDERS = {"integer": "integer", "int": "integer", "text": "text", "real": "real", "blob": "blob", "numeric": "numeric"}
CLOSERS = {"(": ")", "[": "]", "{": "}"}


def _end(bare: str, at: int) -> int:
    """Where the bracket at `at` closes, or -1. Strings are blank, so only code counts."""
    stack = []
    for index in range(at, len(bare)):
        letter = bare[index]
        if letter in CLOSERS:
            stack.append(CLOSERS[letter])
        elif letter in ")]}":
            if not stack or stack.pop() != letter:
                return -1
            if not stack:
                return index
    return -1


def _past_type(bare: str, at: int) -> int:
    """Step past a `<...>` type when a call follows it, as in `$type<A, B>()`. Else stay."""
    depth = 0
    for index in range(at, len(bare)):
        letter = bare[index]
        if letter == "<":
            depth += 1
        elif letter == ">" and bare[index - 1] != "=":
            depth -= 1
            if not depth:
                after = index + 1
                while bare[after:after + 1].isspace():
                    after += 1
                return after if bare[after:after + 1] == "(" else at
    return at


def _parts(bare: str, start: int, end: int) -> list[tuple[int, int]]:
    """The comma separated pieces between two offsets, as spans."""
    found, first, index = [], start, start
    while index < end:
        letter = bare[index]
        if letter in CLOSERS:
            close = _end(bare, index)
            if close < 0:
                break
            index = close + 1
        elif letter == "<" and (bare[index - 1].isalnum() or bare[index - 1] in "_$") and _past_type(bare, index) != index:
            index = _past_type(bare, index)
        else:
            if letter == ",":
                found.append((first, index))
                first = index + 1
            index += 1
    found.append((first, end))
    return [span for span in found if bare[span[0] : span[1]].strip()]


def _chain(bare: str, at: int) -> list[tuple[str, int, int]]:
    """Each `.name(...)` from here on, as its name and the span inside its brackets."""
    found = []
    while match := METHOD.match(bare, at):
        opening = _past_type(bare, match.end()) if bare[match.end() : match.end() + 1] == "<" else match.end()
        close = _end(bare, opening) if bare[opening : opening + 1] == "(" else -1
        if close < 0:
            break
        found.append((match.group(1), opening + 1, close))
        at = close + 1
    return found


def _literal(text: str) -> str | None:
    """The value of a plain string, or None for anything else."""
    text = text.strip()
    if len(text) < 2 or text[0] not in "\"'`" or text[-1] != text[0]:
        return None
    body = text[1:-1]
    if (text[0] == "`" and "${" in body) or re.search(rf"(?<!\\){text[0]}", body):
        return None
    return ESCAPE.sub(lambda match: ESCAPES.get(match.group(1), match.group(1)), body)


def _json(text: str) -> str | None:
    """A plain object or array literal, written as `JSON.stringify` writes it."""
    strict = re.sub(r"'((?:[^'\\]|\\.)*)'", lambda match: json.dumps(match.group(1)), text)
    strict = re.sub(r"([{,]\s*)([A-Za-z_$][\w$]*)\s*:", r'\1"\2":', strict)
    strict = re.sub(r",\s*([}\]])", r"\1", strict)
    try:
        return json.dumps(json.loads(strict), separators=(",", ":"), ensure_ascii=False)
    except ValueError:
        return None


def _cased(key: str, casing: str) -> str:
    """A column's name when it is given none, by Drizzle's own rule in `casing.ts`."""
    words = WORDS.findall(key)
    if casing == "snake_case":
        return "_".join(word.lower() for word in words)
    if casing == "camelCase":
        return "".join(word.lower() if index == 0 else word[0].upper() + word[1:] for index, word in enumerate(words))
    return key


def _quote(name: str) -> str:
    return f"`{name}`"


def _foreign_name(table: str, columns: list[str], target: str, targets: list[str]) -> str:
    """Drizzle's name for a foreign key. The tool keeps one per name: the last one it sees."""
    return "_".join([table, *columns, target, *targets, "fk"])


def _actions(text: str) -> str:
    """The `ON UPDATE` and `ON DELETE` of a foreign key, from an options object."""
    found = ""
    for option, clause in (("onUpdate", "ON UPDATE"), ("onDelete", "ON DELETE")):
        match = re.search(rf"""\b{option}\s*:\s*["']([\w ]+)["']""", text)
        if match:
            found += f" {clause} {match.group(1)}"
    return found


@dataclass
class File:
    path: str
    #: Comments are blank here, which is where text gets read from.
    code: str
    #: Strings are blank too, with the same offsets, so a search only ever finds code.
    bare: str
    #: Local name to Drizzle's name, as `import { text as t }` makes them differ.
    names: dict[str, str]
    #: Local names of `import * as core`.
    spaces: set[str]

    def line(self, at: int) -> int:
        return self.code.count("\n", 0, at) + 1

    def text(self, start: int, end: int) -> str:
        return self.code[start:end].strip()

    def real(self, written: str, spaces: set[str] | None = None) -> str | None:
        """What a written name is in Drizzle: `text`, `core.text` or `t.text`."""
        space, _, name = written.rpartition(".")
        if space:
            return name if space in self.spaces | (spaces or set()) else None
        return self.names.get(name)


@dataclass
class Column:
    key: str
    name: str
    type: str
    line: int
    file: File
    calls: list[tuple[str, int, int]]


@dataclass
class Table:
    name: str
    file: File
    line: int
    columns: list[Column] = field(default_factory=list)
    extras: tuple[int, int] | None = None
    #: A column made a key by `primaryKey({ columns: [t.a] })`. Drizzle adds no NOT NULL here.
    single_key: str = ""
    #: `foreignKey(...)` lines by name. They come after `.references()`, so they replace it.
    foreign: dict[str, str] = field(default_factory=dict)

    def column(self, key: str) -> Column | None:
        return next((column for column in self.columns if column.key == key), None)


def _parse_file(path: str, text: str) -> File:
    code = typescript.mask_code(text)
    names: dict[str, str] = {}
    spaces: set[str] = set()
    for match in IMPORT.finditer(code):
        clause = match.group(1)
        if clause.startswith("type "):
            continue
        spaces |= set(re.findall(r"\*\s+as\s+([\w$]+)", clause))
        for item in re.findall(r"\{([^}]*)\}", clause):
            for name in filter(None, (part.strip() for part in item.split(","))):
                real, _, local = name.partition(" as ")
                names[local.strip() or real.strip()] = real.strip()
    return File(path, code, typescript.mask_code(text, strings=True), names, spaces)


class Reader:
    """Two passes: learn every table and column, then write SQL that can refer to them."""

    def __init__(self, files: list[File], casing: str):
        self.casing = casing
        self.unread: list[str] = []
        #: Each const that holds a table, so `() => books.id` can be followed across files.
        self.named: dict[str, Table] = {}
        self.objects = {match.group(1): (file, match.end() - 1) for file in files for match in OBJECT.finditer(file.bare)}
        self.tables = [table for file in files for table in self._tables(file)]

    def note(self, file: File, at: int) -> None:
        self.unread.append(f"{file.path}:{file.line(at)}")

    def _tables(self, file: File) -> list[Table]:
        found = []
        for match in CALL.finditer(file.bare):
            name = file.real(match.group(1))
            if name == "sqliteTableCreator":
                self.note(file, match.start())
            elif name == "sqliteTable":
                table = self._table(file, match)
                if table:
                    found.append(table)
                else:
                    self.note(file, match.start())
        return found

    def _table(self, file: File, match: re.Match) -> Table | None:
        close = _end(file.bare, match.end() - 1)
        args = _parts(file.bare, match.end(), close) if close > 0 else []
        name = _literal(file.text(*args[0])) if args else None
        if name is None or len(args) < 2:
            return None
        table = Table(name, file, file.line(match.start()), extras=args[2] if len(args) > 2 else None)
        if not self._columns(file, *args[1], table):
            return None
        declared = DECLARED.search(file.bare[max(0, match.start() - 200) : match.start()])
        if declared:
            self.named[declared.group(1)] = table
        return table

    def _columns(self, file: File, start: int, end: int, table: Table, line: int | None = None) -> bool:
        """Read an object of columns, or the callback that returns one."""
        at = start + len(file.bare[start:end]) - len(file.bare[start:end].lstrip())
        spaces: set[str] = set()
        if file.bare[at:at + 1] != "{":
            callback = CALLBACK.match(file.bare, start, end)
            if not callback:
                return False
            spaces = {callback.group(1) or callback.group(2)}
            at = callback.end() - 1
        close = _end(file.bare, at)
        if close < 0:
            return False
        for span in _parts(file.bare, at + 1, close):
            self._column(file, *span, table, spaces, line)
        return True

    def _column(self, file: File, start: int, end: int, table: Table, spaces: set[str], line: int | None) -> None:
        spread = SPREAD.fullmatch(file.bare, start, end)
        if spread:
            found = self.objects.get(spread.group(1))
            here = line or file.line(spread.start(1))
            if not found or not self._columns(found[0], found[1], _end(found[0].bare, found[1]) + 1, table, here):
                self.note(file, spread.start(1))
            return
        key = PROPERTY.match(file.code, start, end)
        head = HEAD.match(file.bare, key.end(), end) if key else None
        kind = BUILDERS.get(file.real(head.group(1), spaces) or "") if head else None
        opening = _past_type(file.bare, head.end()) if head and file.bare[head.end() : head.end() + 1] == "<" else head.end() if head else -1
        close = _end(file.bare, opening) if kind and file.bare[opening : opening + 1] == "(" else -1
        if close < 0:
            self.note(file, key.start(key.lastindex) if key else start)
            return
        args = _parts(file.bare, opening + 1, close)
        first = file.text(*args[0]) if args else ""
        name = _literal(first)
        if args and name is None and not first.startswith("{"):
            self.note(file, key.start(key.lastindex))
            return
        options = " ".join(file.text(*span) for span in args)
        length = LENGTH.search(options) if kind == "text" else None
        table.columns.append(
            Column(
                key.group(key.lastindex),
                name if name is not None else _cased(key.group(key.lastindex), self.casing),
                f"{kind}({length.group(1)})" if length else kind,
                line or file.line(key.start(key.lastindex)),
                file,
                _chain(file.bare, close + 1),
            )
        )

    def _field(self, prefix: str, key: str, table: Table) -> tuple[Table, Column] | None:
        """A column named as `t.title` or `books.title`. Anything but a table means this one."""
        owner = self.named.get(prefix, table)
        column = owner.column(key)
        return (owner, column) if column else None

    def _fields(self, text: str, table: Table) -> list[tuple[Table, Column]] | None:
        """Every column in a list, or None if any of them can't be followed."""
        found = []
        for item in filter(None, (part.strip() for part in text.split(","))):
            match = FIELD.fullmatch(item)
            hit = self._field(match.group(1), match.group(2), table) if match else None
            if not hit:
                return None
            found.append(hit)
        return found

    def _template(self, file: File, start: int, end: int, table: Table, qualified: bool = False) -> str | None:
        """The SQL in a `sql` template, with each `${t.column}` written as the tool writes it."""
        match = TEMPLATE.search(file.bare, start, end)
        if not match:
            return None
        pieces, index, first = [], match.end(), match.end()
        while index < end:
            if file.bare.startswith("${", index):
                close = _end(file.bare, index + 1)
                hole = FIELD.fullmatch(file.text(index + 2, close)) if close > 0 else None
                hit = self._field(hole.group(1), hole.group(2), table) if hole else None
                if not hit:
                    return None
                pieces.append(file.code[first:index])
                pieces.append(f'"{hit[0].name}"."{hit[1].name}"' if qualified else f'"{hit[1].name}"')
                index = first = close + 1
            elif file.bare[index] == "`":
                return "".join(pieces) + file.code[first:index]
            else:
                index += 1
        return None

    def _default(self, file: File, start: int, end: int, table: Table) -> str | None:
        text = file.text(start, end)
        if TEMPLATE.match(text):
            return self._template(file, start, end, table)
        if text in ("true", "false") or NUMBER.fullmatch(text):
            return text
        if text == "null":  # `JSON.stringify(null)`, which is what the tool does with it.
            return "'null'"
        value = _literal(text)
        if value is None and text[:1] in ("{", "["):
            value = _json(text)
        return None if value is None else "'" + value.replace("'", "''") + "'"

    def _column_sql(self, column: Column, table: Table) -> tuple[str, tuple[int, str] | None]:
        """One column's line, and the unique index that `.unique()` asks for."""
        file = column.file
        primary = "PRIMARY KEY" if table.single_key == column.name else ""
        not_null, default, generated, unique = False, "", "", None
        references: dict[str, str] = {}
        for method, start, end in column.calls:
            args = _parts(file.bare, start, end)
            text = file.text(start, end)
            if method == "notNull":
                not_null = True
            elif method == "primaryKey":
                primary, not_null = "PRIMARY KEY AUTOINCREMENT" if AUTO_INCREMENT.search(text) else "PRIMARY KEY", True
            elif method == "unique":
                named = _literal(file.text(*args[0])) if args else None
                unique = (column.line, named or f"{table.name}_{column.name}_unique")
            elif method == "default":
                value = self._default(file, start, end, table)
                if value is None:
                    self.note(file, start)
                else:
                    default = f"DEFAULT {value}"
            elif method == "generatedAlwaysAs":
                body = self._template(file, start, end, table)
                if body is None:
                    self.note(file, start)
                else:
                    generated = f"GENERATED ALWAYS AS ({body}) {'STORED' if STORED.search(text) else 'VIRTUAL'}"
            elif method == "references":
                target = REFERENCE.search(text)
                owner = self.named.get(target.group(1)) if target else None
                other = owner.column(target.group(2)) if owner else None
                if other:
                    name = _foreign_name(table.name, [column.name], owner.name, [other.name])
                    references[name] = f"REFERENCES {_quote(owner.name)}({_quote(other.name)}){_actions(text)}"
                else:
                    self.note(file, start)
            elif method not in NO_SQL:
                self.note(file, start)
        kept = [clause for name, clause in references.items() if name not in table.foreign]
        words = [_quote(column.name), column.type, primary, generated, default, "NOT NULL" if not_null else "", *kept]
        return " ".join(word for word in words if word), unique

    def _index(self, method: str, name: str | None, chain: list, table: Table) -> str | None:
        """`CREATE INDEX` for `index`, `uniqueIndex` or `unique`, as they all end up as one."""
        file = table.file
        on = next((span for span in chain if span[0] == "on"), None)
        where = next((span for span in chain if span[0] == "where"), None)
        columns: list[str] = []
        for span in _parts(file.bare, on[1], on[2]) if on else []:
            hit = self._fields(file.text(*span), table) if not TEMPLATE.search(file.bare, *span) else None
            written = _quote(hit[0][1].name) if hit else self._template(file, *span, table)
            if written is None:
                return None
            columns.append(written)
        if not columns:
            return None
        if method == "unique" and not name:
            name = f"{table.name}_{'_'.join(column.strip('`') for column in columns)}_unique"
        if not name:
            return None
        statement = f"CREATE {'INDEX' if method == 'index' else 'UNIQUE INDEX'} {_quote(name)} ON {_quote(table.name)} ({','.join(columns)})"
        if where:
            condition = self._template(file, where[1], where[2], table, qualified=True)
            if condition is None:
                return None
            statement += f" WHERE {condition}"
        return statement + ";"

    def _extra(self, table: Table, start: int, end: int) -> tuple[str | None, tuple[int, str] | None] | None:
        """One item in a table's third argument, as a table line or a separate statement."""
        file = table.file
        keyed = KEYED.match(file.bare, start, end)
        head = HEAD.match(file.bare, keyed.end() if keyed else start, end)
        opening = head.end() if head else -1
        close = _end(file.bare, opening) if head and file.bare[opening : opening + 1] == "(" else -1
        if close < 0:
            return None
        method = file.real(head.group(1))
        line = file.line(head.start(1))
        args = _parts(file.bare, opening + 1, close)
        chain = _chain(file.bare, close + 1)
        if method in ("index", "uniqueIndex", "unique"):
            statement = self._index(method, _literal(file.text(*args[0])) if args else None, chain, table)
            return (None, (line, statement)) if statement else None
        whole = file.text(opening + 1, close)
        if method == "primaryKey":
            listed = re.search(r"\bcolumns\s*:\s*\[([^\]]*)\]", whole)
            found = self._fields(listed.group(1) if listed else whole, table)
            if not found:
                return None
            if len(found) == 1:
                table.single_key = found[0][1].name
                return (None, None)
            return ("PRIMARY KEY(" + ", ".join(_quote(item[1].name) for item in found) + ")", None)
        if method == "foreignKey":
            mine = re.search(r"\bcolumns\s*:\s*\[([^\]]*)\]", whole)
            theirs = re.search(r"\bforeignColumns\s*:\s*\[([^\]]*)\]", whole)
            here = self._fields(mine.group(1), table) if mine else None
            there = self._fields(theirs.group(1), table) if theirs else None
            if not here or not there:
                return None
            actions = ""
            for name, clause in (("onUpdate", "ON UPDATE"), ("onDelete", "ON DELETE")):
                call = next((span for span in chain if span[0] == name), None)
                value = _literal(file.text(call[1], call[2])) if call else None
                actions += f" {clause} {value}" if value else ""
            left = [item[1].name for item in here]
            right = [item[1].name for item in there]
            target = there[0][0].name
            named = re.search(r"""\bname\s*:\s*["']([^"']+)["']""", whole)
            key = named.group(1) if named else _foreign_name(table.name, left, target, right)
            table.foreign[key] = f"FOREIGN KEY ({','.join(map(_quote, left))}) REFERENCES {_quote(target)}({','.join(map(_quote, right))}){actions}"
            return (None, None)
        if method == "check" and len(args) == 2:
            name = _literal(file.text(*args[0]))
            body = self._template(file, *args[1], table, qualified=True)
            return (f'CONSTRAINT "{name}" CHECK({body})', None) if name and body else None
        return None

    def _extras(self, table: Table) -> tuple[list[str], list[tuple[int, str]]]:
        rows: list[str] = []
        statements: list[tuple[int, str]] = []
        if not table.extras:
            return rows, statements
        file = table.file
        start, end = table.extras
        body = EXTRAS_BODY.search(file.bare, start, end)
        close = _end(file.bare, body.start(1)) if body else -1
        if close < 0:
            self.note(file, start)
            return rows, statements
        for span in _parts(file.bare, body.start(1) + 1, close):
            done = self._extra(table, *span)
            if done is None:
                self.note(file, span[0] + len(file.bare[span[0] : span[1]]) - len(file.bare[span[0] : span[1]].lstrip()))
                continue
            rows += [done[0]] if done[0] else []
            statements += [done[1]] if done[1] else []
        return rows + list(table.foreign.values()), statements

    def statements(self, table: Table) -> list[tuple[str, int, str]]:
        """A table's `CREATE TABLE` and its indexes, each as (file, first line, SQL)."""
        file = table.file
        rows, indexes = self._extras(table)
        written = []
        for column in table.columns:
            sql, unique = self._column_sql(column, table)
            written.append((column.line - table.line, sql))
            if unique:
                indexes.insert(0, (unique[0], f"CREATE UNIQUE INDEX {_quote(unique[1])} ON {_quote(table.name)} ({_quote(column.name)});"))
        last = written[-1][0]
        written += [(last, row) for row in rows]
        lines: dict[int, list[str]] = {}
        for index, (offset, sql) in enumerate(written):
            lines.setdefault(offset, []).append(sql + ("," if index < len(written) - 1 else ""))
        body = [" ".join(lines.get(offset, [])) for offset in range(last + 1)]
        create = f"CREATE TABLE {_quote(table.name)} (" + "\n".join(body) + "\n);"
        return [(file.path, table.line, create)] + [(file.path, line, sql) for line, sql in indexes]


@dataclass
class Schema:
    #: (file, first line, SQL), the same shape `sqlite.code_schema` gives.
    statements: list[tuple[str, int, str]]
    #: `file:line` of everything that needs the code to run before it can be known.
    unread: list[str]
    #: Each const that holds a table: `{"table": its SQL name, "path": the file it is in}`.
    tables: dict[str, dict[str, str]] = field(default_factory=dict)
    #: Files that define the schema. They name every column, so that says nothing about use.
    files: list[str] = field(default_factory=list)
    #: (table, column) to the name code uses for it, as `max_guests` is `maxGuests`.
    fields: dict[tuple[str, str], str] = field(default_factory=dict)


def _casing(source) -> str:
    paths = [path for path in source.list_files() if CONFIG.match(path)]
    found = CASING.search(typescript.mask_code("\n".join(source.read_many(paths).values())))
    return found.group(1) if found else ""


@lru_cache(maxsize=1)
def read(source) -> Schema:
    """Every Drizzle table for SQLite in the repo. Code outside the code root counts too.

    A build asks three times, so the last answer is kept. A source is one read of one commit.
    """
    paths = [
        path
        for path in source.list_files("", typescript.CODE_SUFFIXES)
        if not typescript.SKIP_DIRS.search(path) and not typescript.TEST_FILE.search(path) and not path.endswith(".d.ts")
    ]
    files = [_parse_file(path, text) for path, text in source.read_many(paths).items() if CORE in text]
    if not files:
        return Schema([], [])
    reader = Reader(files, _casing(source))
    statements = []
    for table in reader.tables:
        if table.columns:
            statements += reader.statements(table)
        else:
            reader.note(table.file, table.file.code.find(table.name))
    tables = {name: {"table": table.name, "path": table.file.path} for name, table in reader.named.items()}
    fields = {(table.name, column.name): column.key for table in reader.tables for column in table.columns}
    return Schema(statements, reader.unread, tables, [file.path for file in files], fields)


def tables_at(text: str, lines: set[int] | None) -> set[str]:
    """Tables whose `sqliteTable(...)` sits on these lines, so one edit doesn't mark a whole file."""
    file = _parse_file("", text)
    found = set()
    for match in CALL.finditer(file.bare):
        close = _end(file.bare, match.end() - 1) if file.real(match.group(1)) == "sqliteTable" else -1
        args = _parts(file.bare, match.end(), close) if close > 0 else []
        name = _literal(file.text(*args[0])) if args else None
        if name is not None and (lines is None or not lines.isdisjoint(range(file.line(match.start()), file.line(close) + 1))):
            found.add(name)
    return found
