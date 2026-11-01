"""What a schema will refuse, what a change breaks, and what a schema cannot hold.

These are the limits of a design, found by rules over the model. Each has a kind:

    refused         Postgres says no
    breaks          it runs, but something stops working, or it fails once rows exist
    cannot_support  the schema can't hold what is needed
    advice          worth knowing before you start

This is a floor. When a limit says refused, Postgres refuses, and `scripts/try_proposal.sh`
holds every rule to a real server. When it stays silent, Postgres may still refuse for a
reason the model does not hold, such as a function that names a column.
"""
from __future__ import annotations

import copy
import re

from . import findings
from .extractors.postgres import normal_type
from .proposals import TABLE_OPS, apply, qualified, reference_of

INTEGERS = {"smallint", "integer", "bigint"}
NUMBERS = INTEGERS | {"numeric", "real", "double precision"}
TEXTS = {"text", "character varying", "varchar", "character", "char", "name"}
TIMES = {"date", "timestamp without time zone", "timestamp with time zone"}
#: Types Postgres always has. Anything else must be an enum in the model.
BUILT_IN = NUMBERS | TEXTS | TIMES | {
    "boolean", "uuid", "json", "jsonb", "bytea", "interval", "time without time zone", "time with time zone",
    "inet", "cidr", "macaddr", "money", "tsvector", "tsquery", "xml", "oid", "bit", "point",
    # Extensions add these, and the model doesn't read extensions. Passing them keeps
    # "refused" true: this rule may miss a bad type, but it never invents one.
    "citext", "vector", "ltree", "hstore", "geometry", "geography", "cube",
}  # fmt: skip


def _base(type_name: str) -> str:
    return re.sub(r"\(.*\)", "", normal_type(type_name)).strip()


def _limit(check: str, kind: str, severity: str, node: str, title: str, detail: str, evidence: list[str], change: int | None = None) -> dict:
    return {"check": check, "kind": kind, "severity": severity, "node": node, "title": title, "detail": detail, "evidence": evidence, "change": change}


def _column(table: dict, name: str) -> dict | None:
    return next((column for column in table["columns"] if column["name"] == name), None)


def _is_unique(table: dict, name: str) -> bool:
    """True when Postgres would accept this one column as a foreign key target."""
    if any(c["kind"] in ("primary_key", "unique") and c["columns"] == [name] for c in table["constraints"]):
        return True
    return any(index["unique"] and not index["partial"] and index["columns"] == [name] for index in table["indexes"])


def can_reference(child: str, parent: str) -> bool:
    """Can a foreign key column of type `child` point at a key of type `parent`?"""
    child, parent = _base(child), _base(parent)
    if child == parent or (child in INTEGERS and parent in INTEGERS) or (child in TEXTS and parent in TEXTS):
        return True
    if child in TIMES and parent in TIMES:
        return True
    return child in INTEGERS and parent == "numeric"


def can_cast(old: str, new: str) -> bool:
    """Will `ALTER COLUMN TYPE` work with no USING clause?"""
    old, new = _base(old), _base(new)
    if old == new or new in TEXTS:
        return True
    if old in NUMBERS and new in NUMBERS:
        return True
    return old in TIMES and new in TIMES


def _known_type(type_name: str, types: dict[str, dict]) -> bool:
    base = _base(type_name).removesuffix("[]").strip()
    return base in BUILT_IN or qualified(base) in types


def _check_type(type_name: str, types: dict, node: str, index: int) -> list[dict]:
    if _known_type(type_name, types):
        return []
    return [_limit("no_such_type", "refused", "high", node, f"Type {type_name} does not exist", "It is not built in, and no migration creates it.", [], index)]


def _check_reference(column: dict, key: str, tables: dict, node: str, index: int, own: list[dict] | None = None) -> list[dict]:
    """Postgres checks a foreign key target when the statement runs."""
    target = reference_of(column)
    if not target:
        return []
    table_key, name = target
    label = f"{table_key.removeprefix('public.')}.{name}"
    if table_key == key and own is not None:
        columns = own
        unique = any(item["name"] == name and (item.get("primary") or item.get("unique")) for item in own)
        source: list[str] = []
    elif table_key in tables:
        columns = tables[table_key]["columns"]
        unique = _is_unique(tables[table_key], name)
        source = [tables[table_key]["source"]]
    else:
        return [_limit("fk_no_target", "refused", "high", node, f"{table_key.removeprefix('public.')} does not exist", f"{column['name']} points at a table no migration creates.", [], index)]
    found = next((item for item in columns if item["name"] == name), None)
    if found is None:
        return [_limit("fk_no_column", "refused", "high", node, f"{label} does not exist", f"{column['name']} points at a column that is not there.", source, index)]
    if not unique:
        return [_limit("fk_not_unique", "refused", "high", node, f"{label} is not unique", "A foreign key can only point at a primary key or a unique column.", source, index)]
    if not can_reference(column["type"], found["type"]):
        return [
            _limit(
                "fk_type_mismatch",
                "refused",
                "high",
                node,
                f"{column['name']} is {column['type']}, but {label} is {found['type']}",
                "A foreign key needs matching types.",
                [found.get("source", "")] if found.get("source") else [],
                index,
            )
        ]
    return []


def _foreign_keys_on(tables: dict, key: str, name: str | None = None, own: bool = False) -> list[tuple[dict, dict]]:
    """Foreign keys that point at this table, or one of its columns. `own` keeps its own."""
    found = []
    for other_key, table in tables.items():
        for constraint in table["constraints"]:
            if constraint["kind"] != "foreign_key" or constraint.get("references") != key or (other_key == key and not own):
                continue
            if name is None or name in constraint.get("reference_columns", []):
                found.append((table, constraint))
    return found


NAME = r'"?[A-Za-z_][\w$]*"?'
FROM_TABLE = re.compile(rf"\b(?:from|join)\s+((?:{NAME}\s*\.\s*)?{NAME})(?!\s*\()(?:\s+(?:as\s+)?({NAME}))?", re.I)
NOT_AN_ALIAS = {"where", "on", "join", "inner", "left", "right", "full", "cross", "using", "group", "order", "limit", "union"}
REFERENCE = re.compile(rf"(?<![\w$.\"])(?:({NAME})\s*\.\s*)?({NAME})(?!\s*\()(?![\w$])")


def _split_selects(text: str) -> tuple[str, list[str]]:
    """Cut out each `(SELECT ...)`, leaving the text around them and a list of their bodies."""
    outer, groups, at = [], [], 0
    while at < len(text):
        if text[at] == "(" and re.match(r"\s*select\b", text[at + 1 :], re.I):
            depth, end = 0, at
            while end < len(text):
                depth += text[end] == "("
                depth -= text[end] == ")"
                if depth == 0:
                    break
                end += 1
            groups.append(text[at + 1 : end])
            at = end + 1
        else:
            outer.append(text[at])
            at += 1
    return "".join(outer), groups


def _clean(name: str) -> str:
    return name.replace('"', "").replace(" ", "").lower()


def _scan(text: str, scopes: list[dict[str, str]], tables: dict, found: set) -> None:
    """Add every table and column this text names. An inner name hides an outer one, as in SQL."""
    outer, groups = _split_selects(text)
    for group in groups:
        names: dict[str, str] = {}
        body, _ = _split_selects(group)
        for match in FROM_TABLE.finditer(body):
            key = qualified(_clean(match.group(1)))
            found.add((key, None))
            names[key.split(".", 1)[1]] = key
            alias = match.group(2)
            if alias and _clean(alias) not in NOT_AN_ALIAS:
                names[_clean(alias)] = key
        _scan(group, [names, *scopes], tables, found)
    for match in REFERENCE.finditer(outer):
        qualifier, name = match.group(1), _clean(match.group(2))
        for scope in scopes:
            keys = [scope[_clean(qualifier)]] if qualifier and _clean(qualifier) in scope else [] if qualifier else list(dict.fromkeys(scope.values()))
            hits = [key for key in keys if key in tables and _column(tables[key], name)]
            if hits:
                found.update((key, name) for key in hits)
                break


def column_refs(expression: str | None, owner: str, tables: dict, extra: dict[str, str] | None = None) -> set[tuple[str, str | None]]:
    """The tables and columns a policy or trigger expression really depends on.

    Names are read in scope, because `u.id` in a subquery on users is not this table's id.
    """
    if not expression:
        return set()
    found: set[tuple[str, str | None]] = set()
    scope = {owner.split(".", 1)[1]: owner, **(extra or {})}
    _scan(re.sub(r"'(?:[^']|'')*'", "''", expression), [scope], tables, found)
    return found


def dependents(tables: dict) -> dict[tuple[str, str | None], list[dict]]:
    """Which policies and triggers depend on each table and column. Postgres tracks these."""
    found: dict[tuple[str, str | None], list[dict]] = {}

    def add(ref: tuple[str, str | None], kind: str, item: dict, owner: str) -> None:
        found.setdefault(ref, []).append({"kind": kind, "name": item["name"], "source": item["source"], "owner": owner})

    for owner, table in tables.items():
        for policy in table["policies"]:
            refs = column_refs(policy.get("using"), owner, tables) | column_refs(policy.get("with_check"), owner, tables)
            for ref in refs:
                add(ref, "policy", policy, owner)
        pair = {"new": owner, "old": owner}
        for trigger in table["triggers"]:
            refs = {(owner, column) for column in trigger.get("columns", [])} | column_refs(trigger.get("when"), owner, tables, pair)
            for ref in refs:
                add(ref, "trigger", trigger, owner)
    return found


#: Check expressions that only compile for one family of types, with `{col}` for the column.
CHECK_BINDS = (
    (r"\bjsonb_\w+\(\s*{col}\b", "jsonb"),
    (r"\b{col}\s*(?:>=|<=|>|<)\s*-?\d", "number"),
    (r"\b{col}\s+between\s+-?\d", "number"),
    (r"\b{col}\s*<@", "array"),
    (r"\bcardinality\(\s*{col}\b", "array"),
)


def _fits(family: str, type_name: str) -> bool:
    base = _base(type_name)
    return {"jsonb": base == "jsonb", "number": base in NUMBERS, "array": base.endswith("[]")}[family]


def _check_on_type(table: dict, name: str, new_type: str) -> dict | None:
    """The check that would stop compiling if this column took a new type."""
    for constraint in table["constraints"]:
        expression = constraint.get("expression") or ""
        if constraint["kind"] != "check":
            continue
        for pattern, family in CHECK_BINDS:
            if re.search(pattern.format(col=re.escape(name)), expression, re.I) and not _fits(family, new_type):
                return constraint
    return None


def _check_add_table(change: dict, key: str, tables: dict, types: dict, index: int) -> list[dict]:
    node = f"table:{key}"
    if key in tables:
        return [_limit("table_exists", "refused", "high", node, f"{key.removeprefix('public.')} already exists", "Change the table that is there, or pick a new name.", [tables[key]["source"]], index)]
    names = [column["name"] for column in change["columns"]]
    repeated = sorted({name for name in names if names.count(name) > 1})
    if repeated:
        return [_limit("column_exists", "refused", "high", node, f"Column {repeated[0]} is listed twice", "Each column needs its own name.", [], index)]
    found: list[dict] = []
    for column in change["columns"]:
        found += _check_type(column["type"], types, node, index)
        found += _check_reference(column, key, tables, node, index, change["columns"])
    return found


def _check_add_column(change: dict, key: str, tables: dict, types: dict, index: int) -> list[dict]:
    column = change["column"]
    table = tables[key]
    node = table["id"]
    if _column(table, column["name"]):
        return [_limit("column_exists", "refused", "high", node, f"{table['name']}.{column['name']} already exists", "Change the column that is there, or pick a new name.", [_column(table, column["name"])["source"]], index)]
    found = _check_type(column["type"], types, node, index) + _check_reference(column, key, tables, node, index)
    if column.get("nullable") is False and column.get("default") is None and not column.get("primary"):
        found.append(
            _limit(
                "not_null_no_default",
                "breaks",
                "medium",
                node,
                f"{table['name']}.{column['name']} needs a default",
                "It is not null with no default, so this fails as soon as the table has a row.",
                [table["source"]],
                index,
            )
        )
    return found


def _check_fk_types(new_type: str, column: dict, key: str, table: dict, tables: dict, node: str, index: int) -> list[dict]:
    """A new type has to stay compatible with each foreign key, in both directions."""
    name = column["name"]
    for constraint in table["constraints"]:
        if constraint["kind"] == "foreign_key" and name in constraint["columns"] and not can_reference(new_type, column["type"]):
            return [_limit("type_breaks_fk", "refused", "high", node, f"{name} is a foreign key to {constraint['references']}", f"{new_type} would not match the key it points at.", [constraint["source"]], index)]
    for other, constraint in _foreign_keys_on(tables, key, name, own=True):
        child = _column(other, constraint["columns"][0])
        if child and not can_reference(child["type"], new_type):
            return [_limit("type_breaks_fk", "refused", "high", node, f"{other['name']}.{child['name']} points at {name}", f"It is {child['type']}, which would not match {new_type}.", [constraint["source"]], index)]
    return []


def _check_change_column(change: dict, key: str, tables: dict, index: int) -> list[dict]:
    table = tables[key]
    name = change["column"]
    node = table["id"]
    column = _column(table, name)
    if column is None:
        return [_limit("no_such_column", "refused", "high", node, f"{table['name']}.{name} does not exist", "There is no column by that name.", [table["source"]], index)]
    found: list[dict] = []
    if "type" in change and not change.get("using") and not can_cast(column["type"], change["type"]):
        found.append(_limit("no_cast", "refused", "high", node, f"{column['type']} can't become {change['type']} on its own", "Postgres needs a USING clause to say how each value converts.", [column["source"]], index))
    if "type" in change:
        for item in dependents(tables).get((key, name), [])[:1]:
            found.append(_limit(f"type_in_{item['kind']}", "refused", "high", node, f"{item['kind'].title()} {item['name']} uses {name}", f"Postgres won't change the type of a column a {item['kind']} depends on.", [item["source"]], index))
        check = _check_on_type(table, name, change["type"])
        if check:
            found.append(_limit("type_in_check", "refused", "high", node, f"Check {check['name']} needs {name} as it is", f"It would stop compiling with {change['type']}.", [check["source"]], index))
        found += _check_fk_types(change["type"], column, key, table, tables, node, index)
    primary = any(c["kind"] == "primary_key" and name in c["columns"] for c in table["constraints"])
    if change.get("nullable") is True and primary:
        found.append(_limit("null_in_key", "refused", "high", node, f"{table['name']}.{name} is in the primary key", "A key column can't hold nulls.", [column["source"]], index))
    if change.get("nullable") is False and column["nullable"]:
        found.append(_limit("not_null_on_rows", "breaks", "medium", node, f"Rows with no {name} would stop this", "Setting not null fails if any row holds a null.", [column["source"]], index))
    return found


def _check_drop_column(change: dict, key: str, tables: dict, code: dict[str, list[str]], index: int) -> list[dict]:
    table = tables[key]
    name = change["column"]
    node = table["id"]
    column = _column(table, name)
    if column is None:
        return [_limit("no_such_column", "refused", "high", node, f"{table['name']}.{name} does not exist", "There is no column by that name.", [table["source"]], index)]
    found: list[dict] = []
    for other, constraint in _foreign_keys_on(tables, key, name):
        found.append(_limit("column_has_fks", "refused", "high", node, f"{other['name']}.{constraint['columns'][0]} points at {name}", "Postgres won't drop a column another table's foreign key needs.", [constraint["source"]], index))
    for item in dependents(tables).get((key, name), []):
        found.append(_limit(f"column_in_{item['kind']}", "refused", "high", node, f"{item['kind'].title()} {item['name']} uses {name}", f"Postgres won't drop a column a {item['kind']} depends on.", [item["source"]], index))
    gone =[item["name"] for item in table["indexes"] if name in item["columns"]]
    gone += [item["name"] for item in table["constraints"] if name in item.get("columns", []) and item["kind"] != "foreign_key"]
    if gone:
        found.append(_limit("takes_rules_with_it", "breaks", "medium", node, f"Dropping {name} also removes {', '.join(sorted(set(gone)))}", "These go with the column, with no warning.", [column["source"]], index))
    uses = code.get(f"{key}.{name}", [])
    if uses:
        found.append(_limit("code_uses_column", "breaks", "high", node, f"Code still names {table['name']}.{name}", f"{len(uses)} places name it.", uses[:3], index))
    return found


def _check_drop_table(key: str, tables: dict, joined: dict, index: int) -> list[dict]:
    table = tables[key]
    node = table["id"]
    found = [
        _limit("table_has_fks", "refused", "high", node, f"{other['name']}.{constraint['columns'][0]} points at {table['name']}", "Postgres won't drop a table another table's foreign key needs.", [constraint["source"]], index)
        for other, constraint in _foreign_keys_on(tables, key)
    ]
    seen = {}
    for ref, items in dependents(tables).items():
        if ref[0] == key:
            for item in items:
                if item["owner"] != key:
                    seen[item["name"]] = item
    for item in seen.values():
        found.append(_limit("table_in_policy", "refused", "high", node, f"{item['kind'].title()} {item['name']} on {item['owner'].removeprefix('public.')} uses {table['name']}", f"Postgres won't drop a table another table's {item['kind']} depends on.", [item["source"]], index))
    users = [edge for edge in joined["edges"] if edge["kind"] == "uses_table" and edge["target"] == node]
    if users:
        evidence = [edge["evidence"][0] for edge in users if edge["evidence"]]
        found.append(_limit("code_uses_table", "breaks", "high", node, f"{len(users)} modules still call {table['name']}", "Their queries will fail.", evidence[:3], index))
    return found


def _check_add_index(change: dict, key: str, tables: dict, index: int) -> list[dict]:
    table = tables[key]
    node = table["id"]
    missing = [name for name in change["columns"] if not _column(table, name)]
    if missing:
        return [_limit("no_such_column", "refused", "high", node, f"{table['name']}.{missing[0]} does not exist", "An index can only list columns that are there.", [table["source"]], index)]
    name = change.get("name") or f"{table['name']}_{'_'.join(change['columns'])}_idx"
    taken = {item["name"] for other in tables.values() for item in other["indexes"]}
    if name in taken:
        return [_limit("index_exists", "refused", "high", node, f"Index {name} already exists", "Index names are unique across a schema.", [table["source"]], index)]
    if change.get("unique"):
        return [_limit("unique_on_rows", "breaks", "medium", node, f"Duplicates would stop this index", "A unique index fails if rows already repeat.", [table["source"]], index)]
    return []


def _check_enum(change: dict, types: dict, index: int) -> list[dict]:
    key = qualified(change["type"])
    node = f"type:{key}"
    kind = types.get(key)
    if kind is None:
        return [_limit("no_such_type", "refused", "high", node, f"Type {change['type']} does not exist", "No migration creates this enum.", [], index)]
    if change["value"] in kind["labels"]:
        return [_limit("value_exists", "refused", "high", node, f"{change['type']} already has {change['value']}", "An enum value can only be added once.", [kind["source"]], index)]
    return []


def check_change(change: dict, index: int, tables: dict, types: dict, joined: dict, code: dict) -> list[dict]:
    """Check one change against the schema as it stands just before that change."""
    op = change["op"]
    if op == "add_enum_value":
        return _check_enum(change, types, index)
    if "table" not in change:
        return []
    key = qualified(change["table"])
    if op == "add_table":
        return _check_add_table(change, key, tables, types, index)
    if key not in tables:
        label = key.removeprefix("public.")
        return [_limit("no_such_table", "refused", "high", f"table:{key}", f"{label} does not exist", "No migration creates this table.", [], index)]
    if op == "add_column":
        return _check_add_column(change, key, tables, types, index)
    if op == "change_column":
        return _check_change_column(change, key, tables, index)
    if op == "drop_column":
        return _check_drop_column(change, key, tables, code, index)
    if op == "drop_table":
        return _check_drop_table(key, tables, joined, index)
    return _check_add_index(change, key, tables, index)


def _new_findings(before: list[dict], after: dict[str, dict], changed: set[str]) -> list[dict]:
    """Rule checks that fail after the change and did not fail before it."""
    known = {finding["id"] for table in before for finding in findings.check_table(table)}
    found = []
    for key in sorted(changed):
        if key not in after:
            continue
        for finding in findings.check_table(after[key]):
            if finding["id"] not in known:
                found.append(_limit(finding["check"], "advice", finding["severity"], finding["node"], finding["title"], finding["detail"], [item for item in finding["evidence"] if item != "proposal"]))
    return found


def check_all(changes: list[dict], tables: dict[str, dict], types: dict[str, dict], joined: dict, code: dict) -> tuple[list[dict], dict[str, dict]]:
    """Run changes in order on a working copy, as Postgres would.

    A refused change is not applied, because Postgres would not apply it either, so a later
    change sees the same schema a real server would. Returns the limits and the final schema.
    """
    before = copy.deepcopy(tables)
    found: list[dict] = []
    for index, change in enumerate(changes):
        limits = check_change(change, index, tables, types, joined, code)
        found += limits
        if change["op"] in TABLE_OPS and not any(limit["kind"] == "refused" for limit in limits):
            apply(tables, types, change)
    changed = {key for key, table in tables.items() if before.get(key) != table}
    return found + _new_findings(list(before.values()), tables, changed), tables


#: `column IN ('a', 'b')`, the shape a list of allowed values takes.
IN_LIST = re.compile(r"^\(*\s*\"?(\w+)\"?(?:::\w+)?\s+IN\s*\(((?:\s*'[^']*'(?:::\w+)?\s*,?)+)\)\s*\)*$", re.I)


def allowed_values(table: dict, column: str) -> tuple[list[str], str] | None:
    """The fixed list of values a column may hold, from an enum or a check."""
    for constraint in table["constraints"]:
        if constraint["kind"] == "check" and constraint.get("columns") == [column]:
            match = IN_LIST.match((constraint.get("expression") or "").strip())
            if match and match.group(1) == column:
                return re.findall(r"'([^']*)'", match.group(2)), constraint["source"]
    return None


def _need_table(need: dict, tables: dict) -> tuple[str, dict | None]:
    key = qualified(need["table"])
    return key, tables.get(key)


def check_need(need: dict, tables: dict, types: dict) -> list[dict]:
    """Test one thing a use case needs against the data model."""
    kind = need.get("need")
    if kind == "has_many":
        return _check_has_many(need, tables)
    key, table = _need_table(need, tables)
    node = f"table:{key}"
    if table is None:
        return [_limit("no_such_table", "cannot_support", "high", node, f"There is no {key.removeprefix('public.')} table", "A use case needs it, and no migration creates it.", [])]
    if kind == "duplicate":
        return _check_duplicate(need, table)
    name = need["column"]
    column = _column(table, name)
    if column is None:
        return [_limit("no_such_column", "cannot_support", "high", node, f"{table['name']} has no {name}", "A use case needs this, and nothing stores it.", [table["source"]])]
    if kind == "optional" and not column["nullable"]:
        return [_limit("must_have_value", "cannot_support", "high", node, f"{table['name']}.{name} can't be empty", "It is not null, so every row must hold a value.", [column["source"]])]
    if kind == "value":
        return _check_value(need, table, column, types, node)
    return []


def _check_value(need: dict, table: dict, column: dict, types: dict, node: str) -> list[dict]:
    value, name = need["value"], column["name"]
    kind = types.get(qualified(_base(column["type"])))
    if kind is not None:
        if value in kind["labels"]:
            return []
        return [_limit("value_not_allowed", "cannot_support", "high", node, f"{table['name']}.{name} can't hold {value}", f"It allows {', '.join(kind['labels'])}.", [kind["source"]])]
    allowed = allowed_values(table, name)
    if allowed and value not in allowed[0]:
        return [_limit("value_not_allowed", "cannot_support", "high", node, f"{table['name']}.{name} can't hold {value}", f"A check allows only {', '.join(allowed[0])}.", [allowed[1]])]
    return []


def _check_duplicate(need: dict, table: dict) -> list[dict]:
    """Can two rows repeat these columns? A key over the same columns says no."""
    wanted = set(need["columns"])
    found = []
    rules = [(c["name"], c["columns"], c["source"]) for c in table["constraints"] if c["kind"] in ("primary_key", "unique")]
    rules += [(i["name"], i["columns"], i["source"]) for i in table["indexes"] if i["unique"] and not i["partial"]]
    for name, columns, source in rules:
        if set(columns) <= wanted:
            found.append(_limit("must_be_unique", "cannot_support", "high", table["id"], f"{table['name']} can't repeat {', '.join(columns)}", f"{name} keeps it unique.", [source]))
    return found


def _check_has_many(need: dict, tables: dict) -> list[dict]:
    """One parent, many children. The foreign key has to live on the child, and not be unique."""
    parent_key, child_key = qualified(need["parent"]), qualified(need["child"])
    parent, child = tables.get(parent_key), tables.get(child_key)
    missing = [key for key, table in ((parent_key, parent), (child_key, child)) if table is None]
    if missing:
        name = missing[0].removeprefix("public.")
        return [_limit("no_such_table", "cannot_support", "high", f"table:{missing[0]}", f"There is no {name} table", "A use case needs it, and no migration creates it.", [])]
    links = [c for c in child["constraints"] if c["kind"] == "foreign_key" and c.get("references") == parent_key]
    free = [c for c in links if not _is_unique(child, c["columns"][0]) or len(c["columns"]) > 1]
    if free:
        return []
    if links:
        return [_limit("only_one", "cannot_support", "high", child["id"], f"Each {parent['name']} row can have only one {child['name']} row", f"{links[0]['columns'][0]} is unique.", [links[0]["source"]])]
    backward = [c for c in parent["constraints"] if c["kind"] == "foreign_key" and c.get("references") == child_key]
    if backward:
        return [_limit("only_one", "cannot_support", "high", parent["id"], f"Each {parent['name']} row points at only one {child['name']} row", f"{backward[0]['columns'][0]} sits on {parent['name']}, so it holds one. Many needs a new table.", [backward[0]["source"]])]
    return [_limit("no_link", "cannot_support", "high", child["id"], f"Nothing links {child['name']} to {parent['name']}", "No foreign key joins them directly.", [child["source"]])]
