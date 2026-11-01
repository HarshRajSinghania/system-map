import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import store, worktrees  # noqa: E402
from core.extractors import postgres  # noqa: E402
from helpers import commit_all, git, write_migration  # noqa: E402

BASE = """
create table public.clients (id uuid primary key, name text);
create table public.notes (id uuid primary key, body text);
"""
USES_CLIENTS = 'export const load = (db) => db.from("clients").select("*")\n'


def write(root: Path, name: str, text: str) -> None:
    path = root / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


class TablesChanged(unittest.TestCase):
    def test_each_kind_of_change_names_its_table(self):
        cases = {
            "create table public.a (id int);": "public.a",
            "create table if not exists b (id int);": "public.b",
            "alter table only public.c add column x int;": "public.c",
            "create index i on public.d (x);": "public.d",
            "create unique index if not exists i on e (x);": "public.e",
            'create policy "p" on public.f for select using (true);': "public.f",
            'drop policy if exists "p" on g;': "public.g",
            "create trigger t before update on public.h for each row execute function f();": "public.h",
            "drop trigger if exists t on i;": "public.i",
            "alter policy p on public.j rename to q;": "public.j",
        }
        for sql, table in cases.items():
            with self.subTest(sql):
                self.assertEqual(postgres.tables_changed(sql), {table})

    def test_the_drop_form_counts(self):
        keyword = "DROP" + " TABLE"
        self.assertEqual(postgres.tables_changed(f"{keyword} if exists public.gone;"), {"public.gone"})

    def test_a_guarded_change_inside_a_do_block_counts(self):
        sql = """do $$ begin
  if not exists (select 1 from pg_tables where tablename = 'x') then
    alter table public.clients add column y int;
  end if;
end $$;"""
        self.assertEqual(postgres.tables_changed(sql), {"public.clients"})

    def test_data_and_comments_do_not_count(self):
        self.assertEqual(postgres.tables_changed("-- alter table a add b int\ninsert into c values (1);\nselect 1;"), set())


class Repo(unittest.TestCase):
    def setUp(self):
        self.folder = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.folder, ignore_errors=True)
        self.repo = self.folder / "repo"
        self.repo.mkdir()
        self.data = self.folder / "data"
        git(self.repo, "init", "-q", "-b", "main")
        write_migration(self.repo, "20260101000000_base.sql", BASE)
        write(self.repo, "src/lib/one/a.ts", USES_CLIENTS)
        write(self.repo, "src/lib/one/b.ts", 'export const notes = (db) => db.from("notes").select("*")\n')
        write(self.repo, "src/lib/two/c.ts", "export const c = 1\n")
        write(self.repo, "src/routes/desk.tsx", 'import { c } from "../lib/two/c"\nexport const Route = c\n')
        write(self.repo, "docs/specs/mail.md", "# Mail\n\nAdd `src/mail/a.ts`, `src/mail/b.ts`, `src/mail/c.ts`.\n")
        write(self.repo, "shared.md", "\n".join(f"line {n}" for n in range(30)) + "\n")
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        self.target = store.repo_dir(self.repo, self.data)

    def worktree(self, name: str) -> Path:
        path = self.folder / name
        git(self.repo, "worktree", "add", "-q", "-b", name, str(path), "main")
        return path

    def edit_line(self, path: Path, line: int, text: str) -> None:
        lines = (path / "shared.md").read_text().splitlines()
        lines[line] = text
        (path / "shared.md").write_text("\n".join(lines) + "\n")

    def state(self) -> dict:
        return store.worktree_state(self.target)

    def only_overlap(self) -> dict:
        overlaps = self.state()["overlaps"]
        self.assertEqual(len(overlaps), 1, overlaps)
        return overlaps[0]


class Reading(Repo):
    def test_a_worktree_is_listed_with_its_branch(self):
        path = self.worktree("feat-a")
        rows = {row["name"]: row for row in self.state()["worktrees"]}
        self.assertEqual(rows["feat-a"]["path"], str(path.resolve()))
        self.assertEqual(rows["feat-a"]["files"], [])
        self.assertEqual(self.state()["overlaps"], [])

    def test_a_detached_worktree_goes_by_its_folder(self):
        path = self.folder / "loose"
        git(self.repo, "worktree", "add", "-q", "--detach", str(path), "main")
        self.assertIn("loose", {row["name"] for row in self.state()["worktrees"]})

    def test_a_worktree_whose_folder_has_gone_is_left_out(self):
        path = self.worktree("feat-a")
        shutil.rmtree(path)
        self.assertNotIn("feat-a", {row["name"] for row in self.state()["worktrees"]})

    def test_committed_changes_map_to_their_module_and_tables(self):
        path = self.worktree("feat-a")
        write(path, "src/lib/one/a.ts", USES_CLIENTS + "// more\n")
        commit_all(path)
        row = next(item for item in self.state()["worktrees"] if item["name"] == "feat-a")
        self.assertEqual(row["ahead"], 1)
        self.assertEqual(row["modules"], ["module:src/lib/one"])
        self.assertEqual(row["tables_code"], ["table:public.clients"])

    def test_uncommitted_and_new_files_count(self):
        path = self.worktree("feat-a")
        write(path, "src/lib/two/c.ts", "export const c = 2\n")
        write(path, "src/lib/two/new.ts", "export const n = 1\n")
        row = next(item for item in self.state()["worktrees"] if item["name"] == "feat-a")
        self.assertEqual(row["files"], ["src/lib/two/c.ts", "src/lib/two/new.ts"])
        self.assertEqual(row["uncommitted_files"], 2)
        self.assertEqual(row["ahead"], 0)

    def test_a_name_with_a_space_survives(self):
        path = self.worktree("feat-a")
        write(path, "src/lib/two/odd name.ts", "export const n = 1\n")
        row = next(item for item in self.state()["worktrees"] if item["name"] == "feat-a")
        self.assertEqual(row["files"], ["src/lib/two/odd name.ts"])

    def test_a_first_changed_file_keeps_its_first_letter(self):
        path = self.worktree("feat-a")
        write(path, "src/lib/two/c.ts", "export const c = 3\n")
        self.assertEqual(worktrees.uncommitted(str(path)), {"src/lib/two/c.ts"})

    def test_a_route_file_marks_its_route_and_a_spec_its_plan(self):
        path = self.worktree("feat-a")
        write(path, "src/routes/desk.tsx", "export const Route = 2\n")
        write(path, "docs/specs/mail.md", "# Mail\n\nChanged.\n")
        state = self.state()
        self.assertEqual(state["by_node"]["route:/desk"], ["feat-a"])
        self.assertEqual(state["by_node"]["plan:mail"], ["feat-a"])

    def test_new_code_calling_a_table_counts(self):
        path = self.worktree("feat-a")
        write(path, "src/lib/two/c.ts", 'export const c = (db) => db.from("notes").select("*")\n')
        self.assertEqual(self.state()["by_node"]["table:public.notes"], ["feat-a"])

    def test_a_from_call_on_something_else_is_not_a_table(self):
        path = self.worktree("feat-a")
        write(path, "src/lib/two/c.ts", 'export const c = Array.from("abc")\n')
        self.assertNotIn("table:public.abc", self.state()["by_node"])

    def test_a_branch_merged_by_squash_is_finished(self):
        path = self.worktree("feat-a")
        write(path, "src/lib/two/c.ts", "export const c = 2\n")
        commit_all(path)
        write(self.repo, "src/lib/two/c.ts", "export const c = 2\n")
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        row = next(item for item in self.state()["worktrees"] if item["name"] == "feat-a")
        self.assertEqual(row["files"], [])

    def test_commits_behind_are_counted(self):
        self.worktree("feat-a")
        write(self.repo, "other.md", "new\n")
        commit_all(self.repo)
        store.build(self.repo, self.data, "main")
        row = next(item for item in self.state()["worktrees"] if item["name"] == "feat-a")
        self.assertEqual(row["behind"], 1)


class Overlaps(Repo):
    def test_two_worktrees_on_one_table_raise_a_warning(self):
        for name in ("feat-a", "feat-b"):
            path = self.worktree(name)
            write_migration(path, f"2026010200000{name[-1]}_{name}.sql", f"alter table public.clients add column {name[-1]}x int;\n")
        row = self.only_overlap()
        self.assertEqual(row["severity"], "high")
        self.assertEqual(row["schema"], ["table:public.clients"])
        self.assertEqual(row["summary"], "feat-a and feat-b both change clients")
        self.assertEqual(self.state()["by_node"]["table:public.clients"], ["feat-a", "feat-b"])
        self.assertEqual(self.state()["counts"]["high"], 1)

    def test_a_schema_change_under_code_that_uses_the_table_is_medium(self):
        schema = self.worktree("feat-a")
        write_migration(schema, "20260102000001_x.sql", "alter table public.clients add column x int;\n")
        code = self.worktree("feat-b")
        write(code, "src/lib/one/a.ts", USES_CLIENTS + "// more\n")
        row = self.only_overlap()
        self.assertEqual(row["severity"], "medium")
        self.assertEqual(row["schema_and_code"], ["table:public.clients"])

    def test_two_changes_to_code_on_one_table_are_low(self):
        first = self.worktree("feat-a")
        write(first, "src/lib/two/c.ts", USES_CLIENTS)
        second = self.worktree("feat-b")
        write(second, "src/lib/one/a.ts", USES_CLIENTS + "// more\n")
        row = self.only_overlap()
        self.assertEqual(row["severity"], "low")
        self.assertEqual(row["code"], ["table:public.clients"])

    def test_a_real_conflict_is_high_and_names_the_files(self):
        for name, text in (("feat-a", "left"), ("feat-b", "right")):
            path = self.worktree(name)
            self.edit_line(path, 5, text)
            commit_all(path)
        row = self.only_overlap()
        self.assertEqual(row["severity"], "high")
        self.assertEqual(row["conflicts"], ["shared.md"])
        self.assertEqual(row["merge"], "conflict")

    def test_one_file_that_merges_clean_is_low(self):
        for name, line in (("feat-a", 2), ("feat-b", 25)):
            path = self.worktree(name)
            self.edit_line(path, line, name)
            commit_all(path)
        row = self.only_overlap()
        self.assertEqual(row["severity"], "low")
        self.assertEqual((row["files"], row["conflicts"], row["merge"]), (["shared.md"], [], "clean"))

    def test_uncommitted_work_is_not_called_clean(self):
        for name, line in (("feat-a", 2), ("feat-b", 25)):
            self.edit_line(self.worktree(name), line, name)
        row = self.only_overlap()
        self.assertEqual(row["merge"], "uncommitted")
        self.assertEqual(row["uncommitted"], ["shared.md"])

    def test_one_module_alone_is_only_information(self):
        first = self.worktree("feat-a")
        write(first, "src/lib/one/new1.ts", "export const a = 1\n")
        second = self.worktree("feat-b")
        write(second, "src/lib/one/new2.ts", "export const b = 1\n")
        row = self.only_overlap()
        self.assertEqual(row["severity"], "info")
        self.assertIn("module:src/lib/one", row["modules"])

    def test_two_worktrees_apart_do_not_overlap(self):
        write(self.worktree("feat-a"), "src/lib/one/new.ts", "export const a = 1\n")
        write(self.worktree("feat-b"), "src/lib/two/new.ts", "export const b = 1\n")
        self.assertEqual(self.state()["overlaps"], [])

    def test_the_worst_overlap_comes_first(self):
        conflict_a = self.worktree("a")
        self.edit_line(conflict_a, 5, "left")
        commit_all(conflict_a)
        conflict_b = self.worktree("b")
        self.edit_line(conflict_b, 5, "right")
        commit_all(conflict_b)
        side = self.worktree("c")
        self.edit_line(side, 25, "far away")
        commit_all(side)
        self.assertEqual([row["severity"] for row in self.state()["overlaps"]], ["high", "low", "low"])


class ReadOnly(Repo):
    def test_a_conflict_check_leaves_the_repo_as_it_was(self):
        for name, text in (("feat-a", "left"), ("feat-b", "right")):
            path = self.worktree(name)
            self.edit_line(path, 5, text)
            commit_all(path)
        before = git(self.repo, "count-objects", "-v")
        refs = git(self.repo, "for-each-ref")
        status = git(self.repo, "status", "--porcelain")
        self.assertEqual(self.state()["counts"]["high"], 1)
        self.assertEqual(git(self.repo, "count-objects", "-v"), before)
        self.assertEqual(git(self.repo, "for-each-ref"), refs)
        self.assertEqual(git(self.repo, "status", "--porcelain"), status)


if __name__ == "__main__":
    unittest.main()
