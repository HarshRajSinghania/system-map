"""Extractors turn a repo into Facts.

Each schema extractor is a module with `detect(source)` and `extract(source)`, and the
rest of the app reads only the `Extraction` it returns. Code and plans have their own
readers in this package, joined by `core/system.py`.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from . import postgres, sqlite

#: SQLite goes first, because its test is stricter: a driver the app ships with.
EXTRACTORS = [sqlite, postgres]


@dataclass
class Extraction:
    #: One dict per node: a table today, more kinds later.
    nodes: list[dict] = field(default_factory=list)
    #: Things nodes point at that the repo does not define, such as auth.users.
    externals: list[dict] = field(default_factory=list)
    #: Enum and other named types.
    types: list[dict] = field(default_factory=list)
    #: What the extractor read, and how much it could not use.
    stats: dict = field(default_factory=dict)
    #: path -> content id, for every file the Facts came from.
    inputs: dict[str, str] = field(default_factory=dict)
    #: SQL text that uses columns: function bodies, policies, triggers.
    usage_text: str = ""
    engine: str | None = None


def extractor_for(source):
    return next((extractor for extractor in EXTRACTORS if extractor.detect(source)), None)


def inputs(source) -> dict[str, str]:
    """The files the Facts come from, by content id."""
    extractor = extractor_for(source)
    return extractor.inputs(source) if extractor else {}


def extract(source) -> Extraction:
    extractor = extractor_for(source)
    return Extraction(**extractor.extract(source)) if extractor else Extraction()
