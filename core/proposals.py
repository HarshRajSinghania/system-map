"""A what-if: structured changes laid over the model, without touching code.

A proposal is an ordered list of changes. Each one is a plain dict with an `op`, so a parser
can check it, draw it, and write its SQL. Proposals live in app data and never reach a repo.
"""
from __future__ import annotations

import copy
import re
from contextvars import ContextVar

from .extractors import typescript

TABLE_OPS = ("add_table", "add_column", "change_column", "drop_column", "drop_table", "add_index", "add_enum_value")
SYSTEM_OPS = ("add_module", "add_route", "add_job", "add_service")
OPS = TABLE_OPS + SYSTEM_OPS
IDENT = re.compile(r"^[A-Za-z_][A-Za-z0-9_$]*$")
QUALIFIED = re.compile(r"^(?:[A-Za-z_][A-Za-z0-9_$]*\.)?[A-Za-z_][A-Za-z0-9_$]*$")
#: Only plain type names reach the SQL, so a proposal cannot smuggle a statement in.
TYPE_NAME = re.compile(r"^[A-Za-z_][\w. ]*(\(\s*\d+(\s*,\s*\d+)?\s*\))?(\[\])?$")
#: A default or USING clause is an expression, so it is held to one safe shape.
EXPRESSION = re.compile(r"^[^;]*$")


#: The schema a bare table name means: `public` on Postgres, `main` on SQLite.
_default_schema: ContextVar[str] = ContextVar("default_schema", default="public")


def use_schema(schema: str) -> None:
    _default_schema.set(schema)


def qualified(name: str) -> str:
    return name if "." in name else f"{_default_schema.get()}.{name}"


def _need(change: dict, *fields: str) -> None:
    for name in fields:
        if change.get(name) in (None, "", []):
            raise ValueError(f"{change.get('op')} needs {name}")


def _name(value: str, what: str, pattern: re.Pattern = IDENT) -> None:
    if not isinstance(value, str) or not pattern.match(value):
        raise ValueError(f"bad {what}: {value!r}")


def _check_expression(value: object, what: str) -> None:
    if value is not None and (not isinstance(value, str) or not EXPRESSION.match(value)):
        raise ValueError(f"bad {what}: {value!r}")


def _check_column(column: dict) -> None:
    if not isinstance(column, dict):
        raise ValueError(f"a column must be an object: {column!r}")
    _need({"op": "column", **column}, "name", "type")
    _name(column["name"], "column name")
    _name(column["type"], "type", TYPE_NAME)
    _check_expression(column.get("default"), "default")
    if column.get("references"):
        _name(column["references"].split("(")[0], "reference", QUALIFIED)


def validate(change: dict) -> dict:
    """Refuse a change that is malformed. Whether it would work is a limit, not an error."""
    if not isinstance(change, dict) or change.get("op") not in OPS:
        raise ValueError(f"op must be one of {', '.join(OPS)}: {change!r}")
    op = change["op"]
    if op == "add_table":
        _need(change, "table", "columns")
        for column in change["columns"]:
            _check_column(column)
    elif op == "add_column":
        _need(change, "table", "column")
        _check_column(change["column"])
    elif op == "change_column":
        _need(change, "table", "column")
        _name(change["column"], "column name")
        if "type" in change:
            _name(change["type"], "type", TYPE_NAME)
        _check_expression(change.get("default"), "default")
        _check_expression(change.get("using"), "using")
    elif op == "drop_column":
        _need(change, "table", "column")
        _name(change["column"], "column name")
    elif op == "drop_table":
        _need(change, "table")
    elif op == "add_index":
        _need(change, "table", "columns")
        for column in change["columns"]:
            _name(column, "column name")
    elif op == "add_enum_value":
        _need(change, "type", "value")
        _name(change["type"], "type", QUALIFIED)
        if "'" in str(change["value"]):
            raise ValueError("an enum value can't hold a quote")
    elif op == "add_module":
        _need(change, "path")
    elif op == "add_route":
        _need(change, "path")
    elif op == "add_job":
        _need(change, "name", "schedule")
    elif op == "add_service":
        _need(change, "name")
    if "table" in change:
        _name(change["table"], "table name", QUALIFIED)
    return change


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:60] or "proposal"


def reference_of(column: dict) -> tuple[str, str] | None:
    """Split a column's `references` into a table and a column, which defaults to id."""
    target = column.get("references")
    if not target:
        return None
    match = re.fullmatch(r"([^()]+?)(?:\(\s*([^()]+?)\s*\))?", target)
    return qualified(match.group(1)), (match.group(2) or "id")


def _shard_column(column: dict, source: str) -> dict:
    return {
        "name": column["name"],
        "type": column["type"],
        "nullable": bool(column.get("nullable", True)) and not column.get("primary"),
        "default": column.get("default"),
        "generated": False,
        "identity": False,
        "source": source,
    }


def _column_constraints(table: dict, column: dict, source: str) -> None:
    name = column["name"]
    if column.get("primary"):
        table["constraints"].append({"name": f"{table['name']}_pkey", "kind": "primary_key", "columns": [name], "source": source})
    if column.get("unique"):
        table["constraints"].append({"name": f"{table['name']}_{name}_key", "kind": "unique", "columns": [name], "source": source})
    target = reference_of(column)
    if target:
        table["constraints"].append(
            {
                "name": f"{table['name']}_{name}_fkey",
                "kind": "foreign_key",
                "columns": [name],
                "references": target[0],
                "reference_columns": [target[1]],
                "on_delete": column.get("on_delete", "no action"),
                "on_update": "no action",
                "source": source,
            }
        )
    if column.get("index"):
        table["indexes"].append({"name": f"{table['name']}_{name}_idx", "columns": [name], "unique": False, "partial": False, "source": source})


def apply(tables: dict[str, dict], types: dict[str, dict], change: dict, source: str = "proposal") -> None:
    """Lay one table change over a working copy of the schema."""
    op = change["op"]
    if op == "add_enum_value":
        types[qualified(change["type"])]["labels"].append(change["value"])
        return
    key = qualified(change["table"])
    if op == "add_table":
        schema, name = key.split(".", 1)
        table = {
            "id": f"table:{key}",
            "kind": "table",
            "status": "proposed",
            "layer": "intent",
            "name": name,
            "schema": schema,
            "source": source,
            "rls": bool(change.get("rls", False)),
            "rls_source": source if change.get("rls") else None,
            "columns": [_shard_column(column, source) for column in change["columns"]],
            "constraints": [],
            "indexes": [],
            "policies": [],
            "triggers": [],
            "evidence": [],
        }
        for column in change["columns"]:
            _column_constraints(table, column, source)
        tables[key] = table
    elif op == "drop_table":
        tables.pop(key, None)
    elif op == "add_column":
        tables[key]["columns"].append(_shard_column(change["column"], source))
        _column_constraints(tables[key], change["column"], source)
    elif op == "drop_column":
        table = tables[key]
        name = change["column"]
        table["columns"] = [column for column in table["columns"] if column["name"] != name]
        table["constraints"] = [item for item in table["constraints"] if name not in item.get("columns", [])]
        table["indexes"] = [item for item in table["indexes"] if name not in item["columns"]]
    elif op == "change_column":
        column = next(item for item in tables[key]["columns"] if item["name"] == change["column"])
        for field in ("type", "nullable", "default"):
            if field in change:
                column[field] = change[field]
    elif op == "add_index":
        name = change.get("name") or f"{tables[key]['name']}_{'_'.join(change['columns'])}_idx"
        tables[key]["indexes"].append(
            {"name": name, "columns": list(change["columns"]), "unique": bool(change.get("unique")), "partial": False, "source": source}
        )


def _quote(name: str) -> str:
    return ".".join(f'"{part}"' for part in name.split("."))


def _column_sql(column: dict) -> str:
    parts = [f'"{column["name"]}"', column["type"]]
    if column.get("primary"):
        parts.append("PRIMARY KEY")
    elif column.get("nullable") is False:
        parts.append("NOT NULL")
    if column.get("default") is not None:
        parts.append(f"DEFAULT {column['default']}")
    if column.get("unique"):
        parts.append("UNIQUE")
    target = reference_of(column)
    if target:
        parts.append(f'REFERENCES {_quote(target[0])} ("{target[1]}")')
        if column.get("on_delete"):
            parts.append(f"ON DELETE {column['on_delete'].upper()}")
    return " ".join(parts)


def _index_sql(table: str, name: str, columns: list[str], unique: bool = False) -> str:
    listed = ", ".join(f'"{column}"' for column in columns)
    return f'CREATE {"UNIQUE " if unique else ""}INDEX "{name}" ON {_quote(table)} ({listed});'


def to_sql(change: dict) -> list[str]:
    """The statements one change becomes. Empty for a change with no SQL."""
    op = change["op"]
    if op not in TABLE_OPS:
        return []
    if op == "add_enum_value":
        return [f"ALTER TYPE {_quote(qualified(change['type']))} ADD VALUE '{change['value']}';"]
    key = qualified(change["table"])
    table = _quote(key)
    short = key.split(".", 1)[1]
    if op == "add_table":
        body = ",\n  ".join(_column_sql(column) for column in change["columns"])
        found = [f"CREATE TABLE {table} (\n  {body}\n);"]
        if change.get("rls"):
            found.append(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
        found += [_index_sql(key, f"{short}_{column['name']}_idx", [column["name"]]) for column in change["columns"] if column.get("index")]
        return found
    if op == "drop_table":
        return [f"{'DROP'} TABLE {table};"]
    if op == "add_column":
        found = [f"ALTER TABLE {table} ADD COLUMN {_column_sql(change['column'])};"]
        if change["column"].get("index"):
            found.append(_index_sql(key, f"{short}_{change['column']['name']}_idx", [change["column"]["name"]]))
        return found
    if op == "drop_column":
        return [f'ALTER TABLE {table} {"DROP"} COLUMN "{change["column"]}";']
    if op == "add_index":
        name = change.get("name") or f"{short}_{'_'.join(change['columns'])}_idx"
        return [_index_sql(key, name, change["columns"], bool(change.get("unique")))]
    column = f'"{change["column"]}"'
    found = []
    if "type" in change:
        using = f" USING {change['using']}" if change.get("using") else ""
        found.append(f"ALTER TABLE {table} ALTER COLUMN {column} TYPE {change['type']}{using};")
    if "nullable" in change:
        found.append(f"ALTER TABLE {table} ALTER COLUMN {column} {'DROP' if change['nullable'] else 'SET'} NOT NULL;")
    if "default" in change:
        action = f"SET DEFAULT {change['default']}" if change["default"] is not None else f"{'DROP'} DEFAULT"
        found.append(f"ALTER TABLE {table} ALTER COLUMN {column} {action};")
    return found


def _new_node(node_id: str, kind: str, name: str, **fields) -> dict:
    return {"id": node_id, "kind": kind, "name": name, "status": "proposed", "layer": "intent", "evidence": [], **fields}


def _edge(source: str, target: str, kind: str) -> dict:
    return {"source": source, "target": target, "kind": kind, "count": 1, "evidence": [], "proposed": True}


def _table_id(name: str) -> str:
    return f"table:{qualified(name.replace('table:', ''))}"


def overlay(changes: list[dict], system: dict) -> dict:
    """The nodes and edges a proposal adds to the system, for drawing."""
    known = {node["id"]: node for node in system["nodes"]}
    root = system.get("code_root", "")
    nodes: dict[str, dict] = {}
    edges: list[dict] = []

    def add(node: dict) -> None:
        if node["id"] not in known:
            nodes.setdefault(node["id"], node)

    for change in changes:
        op = change["op"]
        if op == "add_module":
            path = change["path"].rstrip("/")
            area, module = typescript.module_of(f"{path}/x.ts", root)
            area_id = f"area:{area}"
            if area_id != f"area:{module}":
                add(_new_node(area_id, "area", area.rsplit("/", 1)[-1], path=area, area=None, files=0, lines=0, test_files=0))
            node_id = f"module:{path}"
            add(_new_node(node_id, "module", path.rsplit("/", 1)[-1], path=path, area=area_id, files=0, lines=0, test_files=0))
            edges += [_edge(node_id, _table_id(table), "uses_table") for table in change.get("uses_tables", [])]
            edges += [_edge(node_id, target, "imports") for target in change.get("imports", [])]
            edges += [_edge(node_id, f"service:{slug(name)}", "uses_service") for name in change.get("services", [])]
        elif op == "add_route":
            path = change["path"]
            add(_new_node(f"route:{path}", "route", path, path=path, route_kind="api" if path.startswith("/api") else "page"))
            if change.get("renders"):
                edges.append(_edge(f"route:{path}", change["renders"], "renders"))
        elif op == "add_job":
            add(_new_node(f"job:{change['name']}", "job", change["name"], schedule=change["schedule"]))
            if change.get("calls"):
                edges.append(_edge(f"job:{change['name']}", f"route:{change['calls']}", "calls"))
        elif op == "add_service":
            add(_new_node(f"service:{slug(change['name'])}", "service", change["name"]))
    return {"nodes": list(nodes.values()), "edges": edges}


def _column_changes(before: dict, after: dict) -> list[str]:
    old = {column["name"]: column for column in before["columns"]}
    new = {column["name"]: column for column in after["columns"]}
    found = [f"adds column {name}" for name in new if name not in old]
    found += [f"removes column {name}" for name in old if name not in new]
    found += [f"changes column {name}" for name in new if name in old and old[name] != new[name]]
    indexes = {index["name"] for index in after["indexes"]} - {index["name"] for index in before["indexes"]}
    return found + [f"adds index {name}" for name in sorted(indexes)]


def diff(before: dict[str, dict], after: dict[str, dict], lay: dict, system: dict) -> dict:
    """What a proposal adds, changes and removes, and what it touches today."""
    added = [{"id": after[key]["id"], "kind": "table", "name": after[key]["name"]} for key in after if key not in before]
    added += [{"id": node["id"], "kind": node["kind"], "name": node["name"]} for node in lay["nodes"]]
    removed = [{"id": before[key]["id"], "kind": "table", "name": before[key]["name"]} for key in before if key not in after]
    changed = []
    for key in before:
        if key in after and before[key] != after[key]:
            changed.append({"id": before[key]["id"], "kind": "table", "name": before[key]["name"], "what": _column_changes(before[key], after[key])})
    moved = {row["id"] for row in removed + changed}
    touched: dict[str, dict] = {}
    for edge in system["edges"]:
        if edge["kind"] == "uses_table" and edge["target"] in moved:
            row = touched.setdefault(edge["source"], {"id": edge["source"], "because": [], "access": "read"})
            row["because"].append(edge["target"])
            if edge.get("access") == "write":
                row["access"] = "write"
            row.setdefault("evidence", edge["evidence"][:1])
    for key, table in before.items():
        for constraint in table["constraints"]:
            target = f"table:{constraint.get('references')}"
            if constraint["kind"] == "foreign_key" and target in moved and table["id"] not in moved:
                row = touched.setdefault(table["id"], {"id": table["id"], "because": [], "access": "foreign key"})
                row["because"].append(target)
                row.setdefault("evidence", [constraint["source"]])
    return {"added": added, "changed": changed, "removed": removed, "touched": list(touched.values())}


def working_copy(tables: list[dict], types: list[dict]) -> tuple[dict[str, dict], dict[str, dict]]:
    return (
        {f"{table['schema']}.{table['name']}": copy.deepcopy(table) for table in tables},
        {kind["name"]: copy.deepcopy(kind) for kind in types},
    )
