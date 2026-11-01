"""A saved view: a filter over the model, with overlays, that the app draws.

An agent writes one when you ask for a picture. A view only picks from what the model holds,
so it cannot show a part that does not exist. It resolves when it is read, so it stays
current as the code changes, and anything that has gone is reported as missing.
"""
from __future__ import annotations

LEVELS = ("map", "data")
LAYOUTS = ("left-right", "top-down")
RISK_FILTERS = ("hot", "hot_untested")
OVERLAYS = ("risk", "worktrees", "plans")


def _strings(value: object, what: str) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list) or not all(isinstance(item, str) and item for item in value):
        raise ValueError(f"{what} must be a list of strings")
    return value


def validate(body: dict, known: set[str], proposal_nodes: set[str] | None = None) -> dict:
    """Refuse a view that names something the model does not hold."""
    title = str(body.get("title") or "").strip()
    if not title:
        raise ValueError("a view needs a title")
    level = body.get("level") or "map"
    layout = body.get("layout") or "left-right"
    risk_filter = body.get("risk")
    if level not in LEVELS:
        raise ValueError(f"level must be one of {', '.join(LEVELS)}")
    if layout not in LAYOUTS:
        raise ValueError(f"layout must be one of {', '.join(LAYOUTS)}")
    if risk_filter is not None and risk_filter not in RISK_FILTERS:
        raise ValueError(f"risk must be one of {', '.join(RISK_FILTERS)}")
    overlays = body.get("overlays") or {}
    unknown = sorted(set(overlays) - set(OVERLAYS)) if isinstance(overlays, dict) else ["not an object"]
    if unknown:
        raise ValueError(f"overlays can only be {', '.join(OVERLAYS)}: {unknown[0]}")

    nodes = _strings(body.get("nodes"), "nodes")
    kinds = _strings(body.get("kinds"), "kinds")
    around = body.get("around")
    area = body.get("area")
    if not (nodes or kinds or around or area or risk_filter):
        raise ValueError("a view needs nodes, around, area, kinds or risk")
    allowed = known | (proposal_nodes or set())
    for item in [*nodes, *filter(None, [around, area])]:
        if item not in allowed:
            raise ValueError(f"no node {item!r}. A view can only show what the model holds")
    return {
        "title": title,
        "note": str(body.get("note") or ""),
        "level": level,
        "layout": layout,
        "nodes": nodes,
        "around": around,
        "area": area,
        "kinds": kinds,
        "risk": risk_filter,
        "overlays": {name: bool(overlays.get(name)) for name in OVERLAYS},
        "proposal": body.get("proposal"),
    }


def _around(node_id: str, edges: list[dict], depth: int = 1) -> set[str]:
    found = {node_id}
    for _ in range(depth):
        ring = set(found)
        for edge in edges:
            if edge["source"] in ring or edge["target"] in ring:
                found |= {edge["source"], edge["target"]}
    return found


def resolve(view: dict, system: dict, tables: list[str], ranked: dict, keys: list[dict] | None = None) -> dict:
    """Turn a view's filter into the nodes to draw today.

    On the data level, a table's neighbours are the tables its foreign keys `keys` reach.
    """
    known = {node["id"]: node for node in system["nodes"]}
    all_ids = set(known) | set(tables)
    named = set(view["nodes"])
    if view["around"]:
        named |= _around(view["around"], keys or [] if view["level"] == "data" else system["edges"])
    if view["area"]:
        named |= {node["id"] for node in system["nodes"] if node.get("area") == view["area"]}
    if view["kinds"]:
        chosen = {node["id"] for node in system["nodes"] if node["kind"] in view["kinds"]}
        if "table" in view["kinds"]:
            chosen |= set(tables)
        named = named & chosen if named else chosen
    if view["risk"]:
        rows = [row for row in ranked["modules"] if row["hot"] and (view["risk"] == "hot" or row["untested"])]
        wanted = {row["id"] for row in rows}
        named = {item for item in named if not item.startswith("module:") or item in wanted} if named else wanted
    return {**view, "resolved": sorted(named & all_ids), "missing": sorted(named - all_ids)}
