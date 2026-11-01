"""More than one project: which model a tool picks, what the menu shows, and removing one."""
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from core import store  # noqa: E402
from tests.helpers import commit_all, git, write_migration  # noqa: E402

SCHEMA = "CREATE TABLE public.orgs (id uuid PRIMARY KEY);\n"
MORE = "CREATE TABLE public.users (id uuid PRIMARY KEY);\n"


def make_repo(folder: Path, sql: str = SCHEMA) -> Path:
    write_migration(folder, "001.sql", sql)
    git(folder, "init", "-q")
    commit_all(folder, "first")
    return folder


class Scratch(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base = Path(tmp.name).resolve()
        self.data = self.base / "data"
        self.one = make_repo(self.base / "one")
        self.two = make_repo(self.base / "two", SCHEMA + MORE)
        store.build(self.one, self.data)
        store.build(self.two, self.data)


class ChoosingAModel(Scratch):
    def key(self, repo: Path) -> str:
        return store.repo_key(repo)

    def test_the_session_folder_picks_its_model(self):
        self.assertEqual(store.resolve_repo(None, self.data, folder=self.two).name, self.key(self.two))

    def test_a_subfolder_of_the_repo_picks_it_too(self):
        folder = self.two / "supabase" / "migrations"
        self.assertEqual(store.resolve_repo(None, self.data, folder=folder).name, self.key(self.two))

    def test_a_worktree_picks_its_main_repo(self):
        worktree = self.base / "two-feature"
        git(self.two, "worktree", "add", "-q", "-b", "feature", str(worktree))
        self.assertEqual(store.resolve_repo(None, self.data, folder=worktree).name, self.key(self.two))

    def test_a_named_repo_beats_the_folder(self):
        chosen = store.resolve_repo("one", self.data, folder=self.two)
        self.assertEqual(chosen.name, self.key(self.one))

    def test_with_no_match_the_error_names_the_projects(self):
        elsewhere = self.base / "elsewhere"
        elsewhere.mkdir()
        with self.assertRaises(KeyError) as caught:
            store.resolve_repo(None, self.data, folder=elsewhere)
        message = str(caught.exception)
        self.assertIn("one, two", message)
        self.assertNotIn(self.key(self.one), message)

    def test_two_projects_with_one_name_are_told_apart_by_key(self):
        twin = make_repo(self.base / "other" / "one")
        store.build(twin, self.data)
        with self.assertRaises(KeyError) as caught:
            store.resolve_repo(None, self.data)
        self.assertIn(self.key(twin), str(caught.exception))
        self.assertIn(self.key(self.one), str(caught.exception))

    def test_one_model_is_still_the_default(self):
        data = self.base / "single"
        store.build(self.one, data)
        elsewhere = self.base / "elsewhere"
        elsewhere.mkdir()
        self.assertEqual(store.resolve_repo(None, data, folder=elsewhere).name, self.key(self.one))


class ProjectRows(Scratch):
    def row(self, name: str) -> dict:
        return next(row for row in store.project_rows(self.data) if row["name"] == name)

    def test_a_row_says_what_the_project_is(self):
        row = self.row("two")
        self.assertEqual(row["repo"], str(self.two))
        self.assertEqual(row["parent"], self.base.name)
        self.assertEqual(row["tables"], 2)
        self.assertEqual(row["status"], "current")
        self.assertEqual(row["intent"], {"proposals": 0, "use_cases": 0, "views": 0})
        self.assertGreater(row["built_at"], 0)
        self.assertNotIn("facts", row)

    def test_a_commit_that_misses_the_model_is_behind(self):
        (self.one / "notes.txt").write_text("hello\n")
        commit_all(self.one, "notes")
        row = self.row("one")
        self.assertEqual(row["status"], "behind")
        self.assertEqual(row["behind"], 1)

    def test_a_new_migration_is_out_of_date(self):
        write_migration(self.one, "002.sql", MORE)
        commit_all(self.one, "more")
        self.assertEqual(self.row("one")["status"], "stale")

    def test_a_folder_that_is_gone_says_so(self):
        target = self.data / "repos" / store.repo_key(self.one)
        shutil.rmtree(self.one)
        self.assertEqual(self.row("one")["status"], "missing")
        self.assertTrue(store.freshness(target)["missing"])

    def test_a_row_counts_what_removing_it_would_delete(self):
        target = self.data / "repos" / store.repo_key(self.one)
        folder = target / "intent" / "proposals"
        folder.mkdir(parents=True)
        (folder / "a.json").write_text("{}")
        (folder / "b.json").write_text("{}")
        self.assertEqual(self.row("one")["intent"]["proposals"], 2)


class RemovingAProject(Scratch):
    def test_it_deletes_app_data_and_leaves_the_repo(self):
        key = store.repo_key(self.one)
        before = git(self.one, "rev-parse", "HEAD")
        store.remove_project(key, self.data)
        self.assertFalse((self.data / "repos" / key).exists())
        self.assertEqual(git(self.one, "rev-parse", "HEAD"), before)
        self.assertTrue((self.one / "supabase" / "migrations" / "001.sql").is_file())
        self.assertEqual([row["name"] for row in store.project_rows(self.data)], ["two"])

    def test_a_project_whose_folder_is_gone_can_be_removed(self):
        key = store.repo_key(self.one)
        shutil.rmtree(self.one)
        store.remove_project(key, self.data)
        self.assertFalse((self.data / "repos" / key).exists())

    def test_only_a_known_key_is_accepted(self):
        for bad in ("nope", "..", "../..", "", str(self.one), "one"):
            with self.assertRaises(KeyError):
                store.remove_project(bad, self.data)
        self.assertEqual(len(store.project_rows(self.data)), 2)


class CheckingAFolder(Scratch):
    def test_a_repo_passes(self):
        self.assertEqual(store.check_folder(self.one), self.one)

    def test_a_missing_folder_is_refused_in_plain_words(self):
        with self.assertRaisesRegex(ValueError, "isn't a folder"):
            store.check_folder(self.base / "nope")

    def test_a_plain_folder_is_refused_in_plain_words(self):
        plain = self.base / "plain"
        plain.mkdir()
        with self.assertRaisesRegex(ValueError, "isn't a git repo"):
            store.check_folder(plain)

    def test_a_relative_path_is_refused(self):
        with self.assertRaisesRegex(ValueError, "full path"):
            store.check_folder(Path("code/one"))


class ToolsInASession(Scratch):
    """Run the real tool server from the folder a session works in."""

    def overview(self, cwd: Path) -> dict:
        message = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "overview", "arguments": {}}}
        done = subprocess.run(
            [sys.executable, str(ROOT / "mcp_server" / "server.py")],
            input=json.dumps(message) + "\n",
            capture_output=True,
            text=True,
            env={**os.environ, "SYSTEM_MAP_DATA": str(self.data), "PYTHONDONTWRITEBYTECODE": "1"},
            cwd=cwd,
            timeout=20,
            check=True,
        )
        return json.loads(done.stdout.splitlines()[0])["result"]

    def test_a_tool_with_no_repo_uses_the_sessions_project(self):
        reply = self.overview(self.two)
        self.assertFalse(reply.get("isError", False))
        self.assertIn("two", reply["content"][0]["text"])
        self.assertIn("users", reply["content"][0]["text"])

    def test_a_tool_outside_every_project_names_them(self):
        elsewhere = self.base / "elsewhere"
        elsewhere.mkdir()
        reply = self.overview(elsewhere)
        self.assertTrue(reply["isError"])
        self.assertIn("one, two", reply["content"][0]["text"])


class BackendRoutes(unittest.TestCase):
    """Run the real backend over HTTP."""

    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.base = Path(tmp.name).resolve()
        self.data = self.base / "data"
        self.one = make_repo(self.base / "one")
        self.two = make_repo(self.base / "two")
        store.build(self.one, self.data)
        store.build(self.two, self.data)
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            self.port = probe.getsockname()[1]
        env = {**os.environ, "PORT": str(self.port), "SYSTEM_MAP_DATA": str(self.data), "PYTHONDONTWRITEBYTECODE": "1"}
        self.server = subprocess.Popen([sys.executable, str(ROOT / "backend" / "server.py")], env=env)
        self.addCleanup(self.stop)
        deadline = time.time() + 10
        while time.time() < deadline:
            try:
                self.get("/health")
                return
            except OSError:
                time.sleep(0.05)
        raise RuntimeError("backend did not start")

    def stop(self):
        self.server.terminate()
        self.server.wait(timeout=5)

    def get(self, path):
        with urllib.request.urlopen(f"http://127.0.0.1:{self.port}{path}", timeout=5) as reply:
            return json.load(reply)

    def post(self, path, body):
        request = urllib.request.Request(
            f"http://127.0.0.1:{self.port}{path}", data=json.dumps(body).encode(), method="POST"
        )
        return json.load(urllib.request.urlopen(request, timeout=10))

    def refused(self, path, body):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.post(path, body)
        return caught.exception.code, json.load(caught.exception)

    def test_repos_gives_short_rows(self):
        rows = self.get("/repos")["repos"]
        self.assertEqual([row["name"] for row in rows], ["one", "two"])
        self.assertEqual(rows[0]["status"], "current")
        self.assertNotIn("facts", rows[0])

    def test_build_refuses_a_plain_folder_and_saves_nothing(self):
        plain = self.base / "plain"
        plain.mkdir()
        code, reply = self.refused("/build", {"repo_path": str(plain)})
        self.assertEqual(code, 400)
        self.assertIn("isn't a git repo", reply["error"])
        self.assertEqual(len(self.get("/repos")["repos"]), 2)

    def test_build_refuses_a_missing_folder(self):
        code, reply = self.refused("/build", {"repo_path": str(self.base / "nope")})
        self.assertEqual(code, 400)
        self.assertIn("isn't a folder", reply["error"])

    def test_remove_takes_a_project_out(self):
        key = store.repo_key(self.one)
        reply = self.post("/repo-remove", {"repo": key})
        self.assertEqual(reply["removed"], key)
        self.assertEqual([row["name"] for row in self.get("/repos")["repos"]], ["two"])
        code, _ = self.refused("/repo-remove", {"repo": key})
        self.assertEqual(code, 404)
        self.assertTrue((self.one / "supabase").is_dir())

    def test_a_project_whose_folder_is_gone_still_opens(self):
        key = store.repo_key(self.one)
        shutil.rmtree(self.one)
        overview = self.get(f"/overview?repo={key}")
        self.assertTrue(overview["freshness"]["missing"])
        self.assertEqual(self.get(f"/worktrees?repo={key}")["worktrees"], [])
        self.assertEqual(self.get("/repos")["repos"][0]["status"], "missing")


if __name__ == "__main__":
    unittest.main()
