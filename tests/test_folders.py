import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import unittest
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import folders, store  # noqa: E402
from core.sources import canonical_root  # noqa: E402
from helpers import commit_all, git  # noqa: E402


def make_repo(path: Path) -> Path:
    path.mkdir(parents=True)
    git(path, "init", "-q")
    (path / "a.txt").write_text("a\n")
    commit_all(path)
    return path


class Tree(unittest.TestCase):
    """A real folder of repos, so git itself is what these checks answer to."""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.base = Path(self._tmp.name).resolve()
        self.code = self.base / "code"
        self.code.mkdir()


def make_project(path: Path, code: bool = True) -> Path:
    """A folder with a `package.json` and no git."""
    (path / "lib").mkdir(parents=True)
    (path / "package.json").write_text('{"name": "x"}\n')
    if code:
        (path / "lib" / "a.ts").write_text("export const a = 1\n")
    return path


class ProjectsWithNoGit(Tree):
    def rows(self, folder: Path | None = None) -> dict[str, dict]:
        return {row["name"]: row for row in folders.workspaces(folder or self.code)["repos"]}

    def test_a_package_json_makes_a_workspace(self):
        make_project(self.code / "loose")
        self.assertEqual(sorted(self.rows()), ["loose"])

    def test_a_folder_with_neither_stays_out(self):
        (self.code / "notes" / "lib").mkdir(parents=True)
        (self.code / "notes" / "lib" / "a.ts").write_text("export const a = 1\n")
        self.assertEqual(self.rows(), {})

    def test_each_row_says_whether_it_has_git(self):
        make_project(self.code / "loose")
        make_repo(self.code / "shop")
        rows = self.rows()
        self.assertFalse(rows["loose"]["git"])
        self.assertTrue(rows["shop"]["git"])

    def test_a_project_one_folder_down_shows(self):
        make_project(self.code / "group" / "loose")
        self.assertEqual(sorted(self.rows()), ["loose"])

    def test_two_folders_down_is_past_the_walk(self):
        make_project(self.code / "a" / "b" / "loose")
        self.assertEqual(self.rows(), {})

    def test_packages_inside_a_project_get_no_row(self):
        project = make_project(self.code / "loose")
        make_project(project / "packages")
        make_project(project / "api")
        self.assertEqual(sorted(self.rows()), ["loose"])

    def test_a_repo_inside_a_project_still_shows(self):
        project = make_project(self.code / "loose")
        make_repo(project / "shop")
        self.assertEqual(sorted(self.rows()), ["loose", "shop"])

    def test_a_repo_keeps_its_packages_out(self):
        make_project(make_repo(self.code / "shop") / "ui")
        self.assertEqual(sorted(self.rows()), ["shop"])

    def test_the_picked_folder_never_hides_what_it_holds(self):
        (self.code / "package.json").write_text("{}\n")
        make_project(self.code / "loose")
        make_repo(self.code / "shop")
        self.assertEqual(sorted(self.rows()), ["loose", "shop"])

    def test_the_picked_folder_can_be_the_project(self):
        project = make_project(self.code / "loose")
        self.assertEqual(sorted(self.rows(project)), ["loose"])

    def test_node_modules_stays_out(self):
        make_project(self.code / "node_modules" / "left-pad")
        self.assertEqual(self.rows(), {})

    def test_a_hidden_folder_stays_out(self):
        make_project(self.code / ".cache")
        self.assertEqual(self.rows(), {})

    def test_a_package_json_folder_is_no_project(self):
        (self.code / "odd" / "package.json").mkdir(parents=True)
        self.assertEqual(self.rows(), {})

    def test_it_sorts_by_when_its_package_json_changed(self):
        old, new = make_project(self.code / "old"), make_project(self.code / "new")
        os.utime(old / "package.json", (1000, 1000))
        os.utime(new / "package.json", (2000, 2000))
        rows = folders.workspaces(self.code)["repos"]
        self.assertEqual([row["name"] for row in rows], ["new", "old"])
        self.assertEqual(rows[0]["touched"], 2000)

    def test_a_row_builds_under_its_own_key(self):
        make_project(self.code / "loose")
        row = self.rows()["loose"]
        manifest = store.build(Path(row["path"]), self.base / "data")
        self.assertEqual(manifest["repo_key"], row["key"])

    def test_a_project_with_no_code_gets_the_builds_own_words(self):
        project = make_project(self.code / "empty", code=False)
        with self.assertRaisesRegex(ValueError, "no code or schema"):
            store.build(project, self.base / "data")


class FindWorkspaces(Tree):
    def names(self) -> list[str]:
        return [row["name"] for row in folders.workspaces(self.code)["repos"]]

    def test_a_worktree_folds_into_its_main_repo(self):
        main = make_repo(self.code / "shop")
        git(main, "worktree", "add", "-q", "-b", "one", str(self.code / "shop-one"))
        git(main, "worktree", "add", "-q", "-b", "two", str(self.code / "shop-two"))
        rows = folders.workspaces(self.code)["repos"]
        self.assertEqual([(row["name"], row["worktrees"]) for row in rows], [("shop", 2)])

    def test_a_worktree_outside_the_folder_still_counts(self):
        main = make_repo(self.code / "shop")
        git(main, "worktree", "add", "-q", "-b", "away", str(self.base / "elsewhere"))
        self.assertEqual(folders.workspaces(self.code)["repos"][0]["worktrees"], 1)

    def test_a_worktree_can_lead_to_a_repo_outside_the_folder(self):
        main = make_repo(self.base / "outside" / "shop")
        git(main, "worktree", "add", "-q", "-b", "here", str(self.code / "shop-here"))
        rows = folders.workspaces(self.code)["repos"]
        self.assertEqual([row["path"] for row in rows], [str(main)])

    def test_a_removed_worktree_stops_counting(self):
        main = make_repo(self.code / "shop")
        git(main, "worktree", "add", "-q", "-b", "gone", str(self.code / "shop-gone"))
        subprocess.run(["rm", "-rf", str(self.code / "shop-gone")], check=True)
        self.assertEqual(folders.workspaces(self.code)["repos"][0]["worktrees"], 0)

    def test_a_relative_worktree_link_counts(self):
        main = make_repo(self.code / "shop")
        git(main, "worktree", "add", "-q", "-b", "near", str(self.code / "shop-near"))
        link = main / ".git" / "worktrees" / "shop-near" / "gitdir"
        link.write_text("../../../../shop-near/.git\n")
        self.assertEqual(folders.workspaces(self.code)["repos"][0]["worktrees"], 1)

    def test_every_worktree_count_matches_git(self):
        one = make_repo(self.code / "one")
        two = make_repo(self.code / "two")
        git(one, "worktree", "add", "-q", "-b", "x", str(self.code / "one-x"))
        git(two, "worktree", "add", "-q", "-b", "y", str(self.base / "two-y"))
        git(two, "worktree", "add", "-q", "-b", "z", str(self.code / "two-z"))
        for row in folders.workspaces(self.code)["repos"]:
            listed = git(Path(row["path"]), "worktree", "list", "--porcelain").count("worktree ")
            self.assertEqual(row["worktrees"], listed - 1, row["name"])

    def test_the_main_repo_is_the_one_a_build_would_use(self):
        main = make_repo(self.code / "shop")
        git(main, "worktree", "add", "-q", "-b", "side", str(self.code / "shop-side"))
        plain = self.code / "plain"
        plain.mkdir()
        self.assertEqual(folders.main_repo(main), canonical_root(main))
        self.assertEqual(folders.main_repo(self.code / "shop-side"), canonical_root(self.code / "shop-side"))
        self.assertIsNone(folders.main_repo(plain))

    def test_the_key_is_the_one_a_build_writes(self):
        main = make_repo(self.code / "shop")
        (main / "a.ts").write_text("export const a = 1\n")
        commit_all(main)
        built = store.build(main, self.base / "data")
        self.assertEqual(folders.workspaces(self.code)["repos"][0]["key"], built["repo_key"])

    def test_a_worktree_of_a_bare_repo_stands_alone(self):
        bare = self.base / "bare.git"
        make_repo(self.base / "seed")
        git(self.base, "clone", "-q", "--bare", str(self.base / "seed"), str(bare))
        git(bare, "worktree", "add", "-q", "-b", "here", str(self.code / "here"))
        self.assertEqual(self.names(), ["here"])
        self.assertEqual(folders.main_repo(self.code / "here"), canonical_root(self.code / "here"))

    def test_a_submodule_is_part_of_the_repo_around_it(self):
        seed = make_repo(self.base / "lib")
        main = make_repo(self.code / "shop")
        git(main, "-c", "protocol.file.allow=always", "submodule", "add", "-q", str(seed), "lib")
        self.assertEqual(self.names(), ["shop"])
        self.assertIsNone(folders.main_repo(main / "lib"))

    def test_a_repo_one_folder_down_is_found(self):
        make_repo(self.code / "group" / "shop")
        self.assertEqual(self.names(), ["shop"])

    def test_a_repo_three_folders_down_is_not(self):
        make_repo(self.code / "one" / "two" / "three")
        self.assertEqual(self.names(), [])

    def test_nothing_inside_a_repo_is_a_workspace(self):
        make_repo(self.code / "shop")
        make_repo(self.code / "shop" / "packages")
        self.assertEqual(self.names(), ["shop"])

    def test_hidden_folders_and_dependencies_stay_out(self):
        make_repo(self.code / ".hidden")
        make_repo(self.code / "node_modules" / "pkg")
        make_repo(self.code / "shop")
        self.assertEqual(self.names(), ["shop"])

    def test_the_folder_can_be_a_repo_itself(self):
        make_repo(self.code / "shop")
        self.assertEqual([row["name"] for row in folders.workspaces(self.code / "shop")["repos"]], ["shop"])

    def test_the_latest_touched_comes_first(self):
        old = make_repo(self.code / "old")
        new = make_repo(self.code / "new")
        os.utime(old / ".git" / "index", (1000, 1000))
        os.utime(new / ".git" / "index", (2000, 2000))
        self.assertEqual(self.names(), ["new", "old"])

    def test_a_worktree_counts_toward_when_a_repo_was_touched(self):
        old = make_repo(self.code / "old")
        new = make_repo(self.code / "new")
        git(old, "worktree", "add", "-q", "-b", "side", str(self.code / "old-side"))
        os.utime(old / ".git" / "index", (1000, 1000))
        os.utime(new / ".git" / "index", (2000, 2000))
        os.utime(old / ".git" / "worktrees" / "old-side" / "index", (3000, 3000))
        self.assertEqual(self.names(), ["old", "new"])

    def test_a_huge_folder_stops_and_says_so(self):
        for name in ("a", "b", "c"):
            (self.code / name).mkdir()
        with mock.patch.object(folders, "MAX_FOLDERS", 2):
            self.assertTrue(folders.workspaces(self.code)["truncated"])
        self.assertFalse(folders.workspaces(self.code)["truncated"])

    def test_a_folder_that_isnt_there_is_refused_in_words(self):
        with self.assertRaisesRegex(ValueError, "isn't a folder"):
            folders.workspaces(self.code / "nope")

    def test_a_relative_path_is_refused(self):
        with self.assertRaisesRegex(ValueError, "full path"):
            folders.workspaces(Path("code"))

    def test_a_home_that_doesnt_exist_is_refused_in_words(self):
        with self.assertRaisesRegex(ValueError, "full path"):
            folders.workspaces(Path("~nobody-here/code"))

    def test_an_unreadable_folder_is_skipped(self):
        make_repo(self.code / "shop")
        locked = self.code / "locked"
        locked.mkdir()
        locked.chmod(0)
        self.addCleanup(locked.chmod, 0o755)
        self.assertEqual(self.names(), ["shop"])


class Browse(Tree):
    def test_it_lists_folders_and_no_files(self):
        (self.code / "b").mkdir()
        (self.code / "A").mkdir()
        (self.code / ".hidden").mkdir()
        (self.code / "note.txt").write_text("x")
        found = folders.browse(self.code)
        self.assertEqual([row["name"] for row in found["dirs"]], ["A", "b"])
        self.assertEqual(found["parent"], str(self.base))

    def test_the_top_has_no_parent(self):
        self.assertIsNone(folders.browse(Path("/"))["parent"])

    def test_a_folder_that_isnt_there_is_refused_in_words(self):
        with self.assertRaisesRegex(ValueError, "isn't a folder"):
            folders.browse(self.code / "nope")

    @unittest.skipIf(os.geteuid() == 0, "root reads everything")
    def test_an_unreadable_folder_is_refused_in_words(self):
        locked = self.code / "locked"
        locked.mkdir()
        locked.chmod(0)
        self.addCleanup(locked.chmod, 0o755)
        with self.assertRaisesRegex(ValueError, "can't read"):
            folders.browse(locked)


class Tilde(unittest.TestCase):
    def test_a_path_under_home_shortens(self):
        with mock.patch.object(Path, "home", return_value=Path("/home/me")):
            self.assertEqual(folders.tilde("/home/me/code"), "~/code")
            self.assertEqual(folders.tilde("/home/me"), "~")

    def test_a_path_that_only_starts_the_same_stays_whole(self):
        with mock.patch.object(Path, "home", return_value=Path("/home/me")):
            self.assertEqual(folders.tilde("/home/meg/code"), "/home/meg/code")


class DefaultFolder(Tree):
    def setUp(self):
        super().setUp()
        self.data = self.base / "data"

    def test_nothing_is_saved_at_first(self):
        self.assertIsNone(folders.default_folder(self.data))
        self.assertIsNone(folders.default_workspaces(self.data)["folder"])

    def test_a_saved_folder_comes_back(self):
        make_repo(self.code / "shop")
        folders.set_default_folder(self.code, self.data)
        reply = folders.default_workspaces(self.data)
        self.assertEqual(reply["folder"], str(self.code))
        self.assertEqual([row["name"] for row in reply["repos"]], ["shop"])

    def test_a_home_path_saves_as_the_real_path(self):
        with mock.patch.dict(os.environ, {"HOME": str(self.base)}):
            saved = folders.set_default_folder(Path("~/code"), self.data)
        self.assertEqual(saved, str(self.code))

    def test_a_folder_that_isnt_there_wont_save(self):
        with self.assertRaises(ValueError):
            folders.set_default_folder(self.code / "nope", self.data)
        self.assertIsNone(folders.default_folder(self.data))

    def test_a_removed_folder_is_a_state_not_an_error(self):
        gone = self.code / "gone"
        gone.mkdir()
        folders.set_default_folder(gone, self.data)
        gone.rmdir()
        self.assertTrue(folders.default_workspaces(self.data)["missing"])

    def test_a_broken_settings_file_counts_as_none_saved(self):
        self.data.mkdir()
        for text in ("not json", "[]", '{"default_folder": 3}'):
            (self.data / "settings.json").write_text(text)
            self.assertIsNone(folders.default_folder(self.data), text)

    def test_saving_never_writes_to_the_folder(self):
        make_repo(self.code / "shop")
        before = sorted(str(path) for path in self.code.rglob("*"))
        folders.set_default_folder(self.code, self.data)
        folders.workspaces(self.code)
        self.assertEqual(sorted(str(path) for path in self.code.rglob("*")), before)


class Routes(unittest.TestCase):
    """Run the real backend process and call it over HTTP."""

    @classmethod
    def setUpClass(cls):
        cls._tmp = tempfile.TemporaryDirectory()
        base = Path(cls._tmp.name).resolve()
        cls.code = base / "code"
        make_repo(cls.code / "shop")
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            cls.port = probe.getsockname()[1]
        cls.server = subprocess.Popen(
            [sys.executable, str(ROOT / "backend" / "server.py")],
            env={
                **os.environ,
                "PORT": str(cls.port),
                "SYSTEM_MAP_DATA": str(base / "data"),
                "SYSTEM_MAP_NO_WINDOW": "1",
                "PYTHONDONTWRITEBYTECODE": "1",
            },
        )
        deadline = time.time() + 10
        while time.time() < deadline:
            try:
                cls.call("/health")
                return
            except OSError:
                time.sleep(0.05)
        raise RuntimeError("backend did not start")

    @classmethod
    def tearDownClass(cls):
        cls.server.terminate()
        cls.server.wait(timeout=5)
        cls._tmp.cleanup()

    @classmethod
    def call(cls, path, body=None):
        data = None if body is None else json.dumps(body).encode()
        with urllib.request.urlopen(urllib.request.Request(f"http://127.0.0.1:{cls.port}{path}", data=data), timeout=5) as reply:
            return json.load(reply)

    def failure(self, path, body=None):
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.call(path, body)
        return caught.exception.code, json.load(caught.exception)

    def test_the_default_folder_round_trip(self):
        self.assertIsNone(self.call("/workspaces")["folder"])
        self.assertEqual(self.call("/default-folder", {"folder": str(self.code)})["default_folder"], str(self.code))
        self.assertEqual([row["name"] for row in self.call("/workspaces")["repos"]], ["shop"])

    def test_workspaces_for_a_named_folder(self):
        reply = self.call(f"/workspaces?folder={urllib.parse.quote(str(self.code))}")
        self.assertEqual(reply["repos"][0]["name"], "shop")

    def test_browse(self):
        reply = self.call(f"/browse?path={urllib.parse.quote(str(self.code))}")
        self.assertEqual([row["name"] for row in reply["dirs"]], ["shop"])

    def test_a_bad_folder_gets_words_not_a_dropped_connection(self):
        for path in ("/workspaces?folder=/no/such/place", "/browse?path=/no/such/place"):
            code, reply = self.failure(path)
            self.assertEqual(code, 400)
            self.assertIn("isn't a folder", reply["error"])

    def test_with_no_window_to_open_the_page_is_told(self):
        self.assertEqual(self.call("/folder-window", {"start": str(self.code)})["status"], "unavailable")
        self.assertEqual(self.call("/folder-window")["status"], "unavailable")
        self.assertEqual(self.call("/folder-window-close", {})["status"], "unavailable")

    def test_a_bad_default_folder_is_refused(self):
        code, reply = self.failure("/default-folder", {"folder": "relative"})
        self.assertEqual(code, 400)
        self.assertIn("full path", reply["error"])
        self.assertEqual(self.failure("/default-folder", {})[0], 400)
