#!/usr/bin/env python3
"""Hold the limit rules to a real Postgres, across a whole schema.

Usage: scripts/sweep_limits.py <repo> <ref> <migrations-dir> <work-dir> [bootstrap.sql]

For every table, it tries a drop. For every column, it tries a drop, three new types, and both
null rules. Each one runs alone and is rolled back, then its verdict is compared with the
rule's. Needs a model of <repo>, built first with `python3 -m core build`.

It fails only if a rule says refused and Postgres accepts. The rules are a floor, so a miss
is printed and allowed. On the first repo, the 3 misses come from a policy on a table outside
the model, and from functions that take a table's row.
"""
from __future__ import annotations

import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import explore, limits, proposals, store  # noqa: E402

NEW_TYPES = ("text", "uuid", "bigint")


def every_change(shards: list[dict]) -> list[dict]:
    changes = []
    for table in shards:
        name = f"{table['schema']}.{table['name']}"
        changes.append({"op": "drop_table", "table": name})
        for column in table["columns"]:
            changes.append({"op": "drop_column", "table": name, "column": column["name"]})
            changes += [{"op": "change_column", "table": name, "column": column["name"], "type": kind} for kind in NEW_TYPES]
            changes.append({"op": "change_column", "table": name, "column": column["name"], "nullable": True})
            changes.append({"op": "change_column", "table": name, "column": column["name"], "nullable": False})
    return changes


def verdicts(target: Path, changes: list[dict]) -> list[list[dict]]:
    """The rule's answer for each change, each alone against today's schema."""
    shards, type_rows, system, _ = explore._model(target)
    tables, types = proposals.working_copy(shards, type_rows)
    return [limits.check_change(change, index, tables, types, system, {}) for index, change in enumerate(changes)]


def main(argv: list[str]) -> int:
    if len(argv) < 4:
        print(__doc__, file=sys.stderr)
        return 2
    repo, ref, migrations, work = Path(argv[0]), argv[1], argv[2], Path(argv[3])
    bootstrap = argv[4] if len(argv) > 4 else ""
    target = store.repo_dir(repo)
    shards, _, _, _ = explore._model(target)
    changes = every_change(shards)
    folder = work / "changes"
    folder.mkdir(parents=True, exist_ok=True)
    for index, change in enumerate(changes):
        (folder / f"{index:05}.sql").write_text("\n".join(proposals.to_sql(change)) + "\nrollback;\n", encoding="utf-8")
    subprocess.run(["bash", str(ROOT / "scripts" / "try_proposal.sh"), str(repo), ref, migrations, str(work), str(folder), bootstrap], check=True)
    results = json.loads((work / "results.json").read_text(encoding="utf-8"))
    said = verdicts(target, changes)

    wrong = []
    warned = 0
    for change, limit_list, result in zip(changes, said, results):
        refused = [limit for limit in limit_list if limit["kind"] == "refused"]
        # Migrations can seed rows. Then a rule that only warns about rows has it right.
        if "contains null values" in result["error"] and any(limit["check"] == "not_null_on_rows" for limit in limit_list):
            warned += 1
            continue
        if bool(refused) == result["accepted"]:
            wrong.append(
                {
                    "change": change,
                    "model": refused[0]["check"] if refused else "accepted",
                    "postgres": (result["error"].split("ERROR:", 1)[-1].strip().split("\n")[0] if result["error"] else "accepted"),
                }
            )
    refused_count = sum(1 for result in results if not result["accepted"])
    false_refusals = sum(1 for row in wrong if row["postgres"] == "accepted")
    summary = {"changes": len(results), "refused_by_postgres": refused_count, "warned_about_rows": warned, "differences": len(wrong), "said_refused_but_accepted": false_refusals}
    print(json.dumps(summary, indent=2))
    (work / "differences.json").write_text(json.dumps(wrong, indent=1), encoding="utf-8")
    shapes = Counter((row["model"], row["change"]["op"], row["postgres"].split('"')[0][:60]) for row in wrong)
    for shape, count in shapes.most_common(24):
        print(count, shape)
    # A miss is allowed: the rules are a floor. Saying refused when Postgres accepts is not.
    return 1 if false_refusals else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
