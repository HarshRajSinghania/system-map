"""Looking for set-aside files must never touch a good one, whichever writer made it."""
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import agent_drafts, explore, store  # noqa: E402
from helpers import commit_all, git  # noqa: E402
from test_agent_drafts import EVIDENCE  # noqa: E402
from test_agents import FILES, SETTINGS  # noqa: E402

ORGS = "supabase/migrations/20260101000001_orgs.sql"
#: One saved file of each kind, as a path under the project's data folder.
EVERY_KIND = (
    "coverage.json",
    "intent/agents.json",
    "intent/agents-draft.json",
    "intent/plan_status.json",
    "intent/regions.json",
)
EVERY_FOLDER = ("reads/table_public.orgs", "intent/proposals", "intent/use_cases", "intent/views")


def build_with_every_saved_file(repo: Path, data: Path) -> Path:
    """A project holding one good saved file of each kind, written by the app's own writers."""
    files = {**FILES, ORGS: "CREATE TABLE public.orgs (id uuid PRIMARY KEY);\n"}
    for name, text in files.items():
        path = repo / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)
    git(repo, "init", "-q", "-b", "main")
    commit_all(repo)
    store.build(repo, data)
    target = store.repo_dir(repo, data)
    store.set_agent_settings(target, SETTINGS)
    store.set_region(target, "service:anthropic", "US")
    store.set_plan_status(target, "plan:mail", "built")
    report = repo.parent / "run" / "lcov.info"
    report.parent.mkdir(parents=True)
    report.write_text("SF:src/desk/start.ts\nDA:1,1\nDA:2,0\nend_of_record\n")
    store.set_coverage(target, str(report), "HEAD")
    store.add_note(target, "table:public.orgs", "The root of every account.", [f"{ORGS}:1"])
    agent_drafts.save(target, SETTINGS, EVIDENCE)
    explore.save_proposal(
        target, "Reminders", "", [{"op": "add_table", "table": "reminders", "columns": [{"name": "id", "type": "uuid", "primary": True}], "rls": True}]
    )
    explore.save_use_case(target, {"title": "Case"})
    explore.save_view(target, {"title": "V", "kinds": ["table"]})
    return target


def saved_files(target: Path) -> dict[str, bytes]:
    """Every saved file under the project's data folder, by path, with its bytes."""
    names = list(EVERY_KIND)
    names += [p.relative_to(target).as_posix() for folder in EVERY_FOLDER for p in sorted((target / folder).glob("*.json"))]
    return {name: (target / name).read_bytes() for name in names if (target / name).is_file()}


class GoodFilesStay(unittest.TestCase):
    def test_the_sweep_leaves_every_good_file_alone_byte_for_byte(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = build_with_every_saved_file(Path(tmp) / "repo", Path(tmp) / "data")
            before = saved_files(target)
            for name in EVERY_KIND:  # the test would prove nothing if a writer had left one out
                self.assertIn(name, before)
            for folder in EVERY_FOLDER:
                self.assertTrue([name for name in before if name.startswith(folder + "/")], folder)
            self.assertEqual(store.set_aside(target), [])
            self.assertEqual(store.set_aside(target), [])
            self.assertEqual(saved_files(target), before)
            self.assertFalse((target / "unreadable").exists())


if __name__ == "__main__":
    unittest.main()
