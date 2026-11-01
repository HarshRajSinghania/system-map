import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from core import coverage, risk, store, verify  # noqa: E402
from core.extractors import typescript  # noqa: E402
from core.sources import GitSource, TreeSource  # noqa: E402
from helpers import commit_all, git, write_migration  # noqa: E402

TYPESCRIPT = ROOT / "ui" / "node_modules" / "typescript"


def write(root: Path, name: str, text: str) -> None:
    path = root / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


def commit_dated(repo: Path, when: int, message: str = "change") -> None:
    git(repo, "add", "-A")
    done = subprocess.run(
        ["git", "-C", str(repo), "-c", "user.name=t", "-c", "user.email=t@example.com", "commit", "-q", "--allow-empty", "-m", message],
        env={**os.environ, "GIT_COMMITTER_DATE": f"{when} +0000", "GIT_AUTHOR_DATE": f"{when} +0000"},
    )
    done.check_returncode()


class Temp(unittest.TestCase):
    def setUp(self):
        self.folder = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.folder, ignore_errors=True)
        self.repo = self.folder / "repo"
        self.repo.mkdir()
        git(self.repo, "init", "-q")


class DecisionPoints(unittest.TestCase):
    def count(self, text: str) -> int:
        return typescript.decision_points(text)

    def test_each_kind_of_branch_counts_once(self):
        self.assertEqual(self.count("if (a) {}"), 1)
        self.assertEqual(self.count("while (a) {}"), 1)
        self.assertEqual(self.count("for (const a of b) {}"), 1)
        self.assertEqual(self.count("for await (const a of b) {}"), 1)
        self.assertEqual(self.count("try {} catch (e) {}"), 1)
        self.assertEqual(self.count("const a = b ? 1 : 2"), 1)
        self.assertEqual(self.count("a && b || c ?? d"), 3)
        self.assertEqual(self.count("a ||= b"), 1)

    def test_a_switch_counts_its_cases_and_not_itself(self):
        self.assertEqual(self.count("switch (a) {\n  case 1:\n  case 2:\n  default:\n}"), 2)

    def test_optional_syntax_is_not_a_branch(self):
        self.assertEqual(self.count("a?.b"), 0)
        self.assertEqual(self.count("function f(a?: string) {}"), 0)
        self.assertEqual(self.count("type T = { a?: string }"), 0)

    def test_words_in_comments_and_strings_are_not_code(self):
        self.assertEqual(self.count("// if (a) b && c"), 0)
        self.assertEqual(self.count('const a = "if (b) c && d ? e : f"'), 0)
        self.assertEqual(self.count("const a = `if (b) ${c && d}`"), 1)

    def test_method_calls_named_like_keywords_do_not_count(self):
        self.assertEqual(self.count("p.catch(() => 1)"), 0)
        self.assertEqual(self.count("list.for(x)"), 0)

    def test_screen_text_is_not_a_branch(self):
        self.assertEqual(self.count("<p>Looks for new work if ready</p>"), 0)


class MatchesTheCompiler(Temp):
    @unittest.skipUnless(TYPESCRIPT.is_dir(), "needs ui/node_modules")
    def test_the_text_count_tracks_the_compiler_on_a_mixed_file(self):
        write(
            self.repo,
            "src/a.tsx",
            """export function A({ b, c }: { b?: string; c: number[] }) {
  if (!b) return null
  for (const item of c) { if (item > 1 && item < 3) continue }
  try { run() } catch { stop() }
  return <div>{b ? <p>Sure?</p> : null}{c.length > 0 && <span>{b ?? 'none'}</span>}</div>
}
""",
        )
        out = self.folder / "truth.json"
        subprocess.run(["node", str(ROOT / "scripts" / "ts_truth.mjs"), str(self.repo), str(out)], check=True, capture_output=True)
        truth = json.loads(out.read_text())["complexity"]
        self.assertEqual(truth["src/a.tsx"], typescript.decision_points((self.repo / "src/a.tsx").read_text()))


class History(Temp):
    def test_a_commit_counts_once_a_file_and_its_lines_add_up(self):
        write(self.repo, "src/a.ts", "1\n2\n")
        write(self.repo, "src/b.ts", "1\n")
        commit_all(self.repo)
        write(self.repo, "src/a.ts", "1\n3\n4\n")
        commit_all(self.repo)
        log = risk.history(GitSource(self.repo, "HEAD"))
        newest, oldest = log["commits"]
        self.assertEqual(newest["files"], {"src/a.ts": (2, 1)})
        self.assertEqual(oldest["files"], {"src/a.ts": (2, 0), "src/b.ts": (1, 0)})
        self.assertTrue(log["known"])

    def test_a_rename_keeps_the_file_its_history(self):
        write(self.repo, "src/old.ts", "".join(f"line {n}\n" for n in range(20)))
        commit_all(self.repo)
        git(self.repo, "mv", "src/old.ts", "src/new.ts")
        commit_all(self.repo)
        write(self.repo, "src/new.ts", (self.repo / "src/new.ts").read_text() + "more\n")
        commit_all(self.repo)
        log = risk.history(GitSource(self.repo, "HEAD"))
        self.assertEqual([sorted(commit["files"]) for commit in log["commits"]], [["src/new.ts"]] * 3)

    def test_a_chain_of_renames_ends_at_the_name_of_today(self):
        write(self.repo, "a.ts", "".join(f"line {n}\n" for n in range(20)))
        commit_all(self.repo)
        git(self.repo, "mv", "a.ts", "b.ts")
        commit_all(self.repo)
        git(self.repo, "mv", "b.ts", "c.ts")
        commit_all(self.repo)
        log = risk.history(GitSource(self.repo, "HEAD"))
        self.assertEqual([sorted(commit["files"]) for commit in log["commits"]], [["c.ts"]] * 3)

    def test_a_merge_commit_is_not_a_change(self):
        write(self.repo, "a.ts", "1\n")
        commit_all(self.repo)
        git(self.repo, "checkout", "-q", "-b", "side")
        write(self.repo, "b.ts", "1\n")
        commit_all(self.repo)
        git(self.repo, "checkout", "-q", "-")
        write(self.repo, "c.ts", "1\n")
        commit_all(self.repo)
        git(self.repo, "merge", "-q", "--no-edit", "side")
        self.assertEqual(len(risk.history(GitSource(self.repo, "HEAD"))["commits"]), 3)

    def test_a_binary_file_counts_as_a_change_with_no_lines(self):
        (self.repo / "logo.png").write_bytes(bytes(range(256)))
        commit_all(self.repo)
        self.assertEqual(risk.history(GitSource(self.repo, "HEAD"))["commits"][0]["files"], {"logo.png": (0, 0)})

    def test_the_window_is_counted_back_from_the_commit_not_from_today(self):
        stamp = 1_700_000_000
        write(self.repo, "a.ts", "1\n")
        commit_dated(self.repo, stamp - 200 * risk.DAY)
        write(self.repo, "a.ts", "2\n")
        commit_dated(self.repo, stamp - 10 * risk.DAY)
        write(self.repo, "b.ts", "3\n")
        commit_dated(self.repo, stamp)
        log = risk.history(GitSource(self.repo, "HEAD"))
        self.assertEqual(len(log["commits"]), 2)
        self.assertEqual(log["since"], stamp - risk.WINDOW_DAYS * risk.DAY)

    def test_a_folder_with_no_git_says_so(self):
        write(self.repo, "a.ts", "1\n")
        log = risk.history(TreeSource(self.repo))
        self.assertEqual(log["commits"], [])
        self.assertFalse(log["known"])

    def test_churn_matches_gits_own_log_for_every_file(self):
        write(self.repo, "src/a.ts", "".join(f"line {n}\n" for n in range(20)))
        write(self.repo, "src/b.ts", "1\n")
        commit_all(self.repo)
        git(self.repo, "mv", "src/a.ts", "src/c.ts")
        commit_all(self.repo)
        write(self.repo, "src/b.ts", "2\n")
        commit_all(self.repo)
        source = GitSource(self.repo, "HEAD")
        joined = {"code_root": "src/", "imports": {}, "complexity": {"src/c.ts": 0, "src/b.ts": 0}, "lines": {"src/c.ts": 20, "src/b.ts": 1}}
        facts = risk.build(source, joined)
        self.assertEqual(facts["files"]["src/c.ts"]["commits"], 2)
        self.assertEqual(verify.compare_churn(facts, self.repo, source.commit), [])


class TestReach(unittest.TestCase):
    IMPORTS = {
        "src/a.test.ts": ["src/a.ts"],
        "src/b.spec.ts": ["src/a.ts", "src/b.ts"],
        "src/a.ts": ["src/deep.ts"],
        "src/deep.ts": ["src/a.ts"],
        "src/alone.ts": ["src/deep.ts"],
    }

    def test_direct_and_indirect_reach_are_kept_apart(self):
        direct, reached = risk.test_reach(self.IMPORTS)
        self.assertEqual(direct["src/a.ts"], 2)
        self.assertEqual(direct["src/deep.ts"], 0)
        self.assertEqual(reached["src/deep.ts"], 2)
        self.assertEqual(reached["src/b.ts"], 1)

    def test_a_file_no_test_reaches_counts_zero(self):
        self.assertEqual(risk.test_reach(self.IMPORTS)[1]["src/alone.ts"], 0)

    def test_an_import_cycle_ends(self):
        self.assertEqual(risk.test_reach({"a.test.ts": ["a.ts"], "a.ts": ["b.ts"], "b.ts": ["a.ts"]})[1]["b.ts"], 1)


ISTANBUL = {
    "/work/here/src/a.ts": {
        "path": "/work/here/src/a.ts",
        "statementMap": {
            "0": {"start": {"line": 1, "column": 0}, "end": {"line": 1, "column": 9}},
            "1": {"start": {"line": 1, "column": 10}, "end": {"line": 1, "column": 19}},
            "2": {"start": {"line": 2, "column": 0}, "end": {"line": 2, "column": 9}},
            "3": {"start": {"line": 3, "column": 0}, "end": {"line": 3, "column": 9}},
        },
        "s": {"0": 0, "1": 4, "2": 1, "3": 0},
        "branchMap": {},
        "b": {"0": [1, 0], "1": [2]},
        "fnMap": {},
        "f": {},
    }
}
LCOV = """TN:
SF:src/a.ts
FN:1,run
DA:1,4
DA:2,1
DA:3,0
BRDA:1,0,0,1
BRDA:1,0,1,0
BRDA:2,1,0,-
end_of_record
SF:src/b.ts
DA:1,0
end_of_record
"""


class Reports(unittest.TestCase):
    def test_lines_follow_istanbuls_rule_of_the_busiest_statement(self):
        self.assertEqual(
            coverage.parse(json.dumps(ISTANBUL))["/work/here/src/a.ts"],
            {"lines_total": 3, "lines_hit": 2, "branches_total": 3, "branches_hit": 2},
        )

    def test_lcov_gives_the_same_shape(self):
        files = coverage.parse(LCOV)
        self.assertEqual(files["src/a.ts"], {"lines_total": 3, "lines_hit": 2, "branches_total": 3, "branches_hit": 1})
        self.assertEqual(files["src/b.ts"]["lines_hit"], 0)

    def test_anything_else_is_refused(self):
        for text in ("<html>", "", '{"a": 1}', "{broken"):
            with self.subTest(text), self.assertRaises(ValueError):
                coverage.parse(text)

    def test_paths_from_another_folder_find_their_repo_files(self):
        known = {"src/a.ts", "src/b.ts", "a.ts"}
        matched, unmatched = coverage.match_paths(
            {"/ci/run/src/a.ts": {"n": 1}, "/ci/run/src/b.ts": {"n": 2}, "/ci/run/vendor/c.ts": {"n": 3}}, known
        )
        self.assertEqual(sorted(matched), ["src/a.ts", "src/b.ts"])
        self.assertEqual(unmatched, ["/ci/run/vendor/c.ts"])

    def test_relative_paths_match_too(self):
        self.assertEqual(sorted(coverage.match_paths({"src/a.ts": {}}, {"src/a.ts"})[0]), ["src/a.ts"])

    def test_a_shorter_name_does_not_steal_a_longer_match(self):
        matched, _ = coverage.match_paths({"/x/src/a.ts": {"n": 1}, "/x/src/b.ts": {"n": 2}}, {"src/a.ts", "src/b.ts", "a.ts", "b.ts"})
        self.assertEqual(sorted(matched), ["src/a.ts", "src/b.ts"])

    def test_totals_match_the_runners_summary(self):
        files, _ = coverage.match_paths(coverage.parse(json.dumps(ISTANBUL)), {"src/a.ts"})
        summary = {
            "total": {},
            "/work/here/src/a.ts": {"lines": {"total": 3, "covered": 2}, "branches": {"total": 3, "covered": 2}},
        }
        self.assertEqual(verify.compare_coverage(files, summary), [])
        summary["/work/here/src/a.ts"]["lines"]["covered"] = 3
        self.assertEqual(len(verify.compare_coverage(files, summary)), 1)


def facts_for(rows: dict[str, dict], commits: dict[str, int] | None = None) -> dict:
    files = {}
    for path, row in rows.items():
        files[path] = {
            "module": row.get("module", "module:src/m"),
            "area": row.get("area", "area:src/m"),
            "lines": row.get("lines", 100),
            "complexity": row.get("complexity", 10),
            "commits": row.get("commits", 1),
            "added": 0,
            "deleted": 0,
            "tests_direct": row.get("tests", 0),
            "tests": row.get("tests", 0),
        }
    return {
        "window_days": 90,
        "since": 0,
        "history_known": True,
        "shallow": False,
        "test_files": 1,
        "files": files,
        "commits_by_node": commits or {},
    }


class Ranking(unittest.TestCase):
    def report(self, **files) -> dict:
        return {
            "commit": "abc",
            "files": {
                path.replace("_", "/") + ".ts": {"lines_total": total, "lines_hit": hit, "branches_total": 0, "branches_hit": 0}
                for path, (hit, total) in files.items()
            },
        }

    def test_score_is_commits_by_complexity_by_what_tests_miss(self):
        ranked = risk.rank(facts_for({"src/a.ts": {"commits": 4, "complexity": 10}}), self.report(src_a=(25, 100)))
        self.assertEqual(ranked["files"][0]["score"], 30.0)

    def test_the_worst_comes_first(self):
        ranked = risk.rank(facts_for({"src/calm.ts": {"commits": 1}, "src/busy.ts": {"commits": 9}}))
        self.assertEqual([row["path"] for row in ranked["files"]], ["src/busy.ts", "src/calm.ts"])

    def test_with_no_report_any_test_that_reaches_a_file_counts(self):
        ranked = risk.rank(facts_for({"src/a.ts": {"tests": 2}, "src/b.ts": {"tests": 0}}))
        rows = {row["path"]: row for row in ranked["files"]}
        self.assertEqual(rows["src/a.ts"]["cover"], 1.0)
        self.assertIsNone(rows["src/a.ts"]["covered"])
        self.assertTrue(rows["src/b.ts"]["untested"])
        self.assertIsNone(ranked["coverage"])

    def test_a_report_beats_reach(self):
        ranked = risk.rank(facts_for({"src/a.ts": {"tests": 3}}), self.report(src_a=(1, 100)))
        self.assertTrue(ranked["files"][0]["untested"])
        self.assertEqual(ranked["files"][0]["covered"], 0.01)

    def test_a_file_the_report_leaves_out_ran_no_tests(self):
        ranked = risk.rank(facts_for({"src/a.ts": {"lines": 100}, "src/b.ts": {"lines": 300}}), self.report(src_a=(100, 100)))
        rows = {row["path"]: row for row in ranked["files"]}
        self.assertFalse(rows["src/b.ts"]["in_report"])
        self.assertEqual(rows["src/b.ts"]["cover"], 0.0)
        self.assertEqual(ranked["modules"][0]["covered"], 0.25)

    def test_a_file_of_only_types_has_nothing_to_miss(self):
        ranked = risk.rank(facts_for({"src/a.ts": {"commits": 9}}), self.report(src_a=(0, 0)))
        self.assertEqual(ranked["files"][0]["score"], 0)
        self.assertFalse(ranked["files"][0]["untested"])

    def test_a_file_with_no_paths_is_not_untested(self):
        ranked = risk.rank(facts_for({"src/index.ts": {"commits": 9, "complexity": 0}}), self.report(src_index=(0, 5)))
        self.assertFalse(ranked["files"][0]["untested"])

    def test_a_module_counts_each_commit_once(self):
        facts = facts_for({"src/a.ts": {"commits": 5}, "src/b.ts": {"commits": 5}}, {"module:src/m": 6})
        self.assertEqual(risk.rank(facts)["modules"][0]["commits"], 6)

    def test_hot_needs_more_than_a_passing_change(self):
        ranked = risk.rank(facts_for({"src/a.ts": {"commits": 2}, "src/b.ts": {"commits": 1}}, {"module:src/m": 2}))
        self.assertFalse(any(row["hot"] for row in ranked["files"]))

    def test_hot_means_busier_than_most_peers(self):
        rows = {f"src/f{n}.ts": {"commits": n} for n in range(1, 13)}
        hot = [row["path"] for row in risk.rank(facts_for(rows))["files"] if row["hot"]]
        self.assertEqual(sorted(hot), ["src/f10.ts", "src/f11.ts", "src/f12.ts"])

    def test_worst_keeps_only_the_hot_and_untested(self):
        rows = {f"src/f{n}.ts": {"commits": n, "tests": 0} for n in range(1, 13)}
        rows["src/f12.ts"]["tests"] = 1
        found = [row["path"] for row in risk.worst(risk.rank(facts_for(rows)), "files")]
        self.assertEqual(found, ["src/f11.ts", "src/f10.ts"])

    def test_areas_and_modules_are_ranked_apart(self):
        ranked = risk.rank(facts_for({"src/a/x/one.ts": {"module": "module:src/a/x", "area": "area:src/a"}}))
        self.assertEqual([row["id"] for row in ranked["modules"]], ["module:src/a/x"])
        self.assertEqual([row["id"] for row in ranked["areas"]], ["area:src/a"])

    def test_screens_are_marked_so_they_can_be_set_aside(self):
        ranked = risk.rank(facts_for({"src/a.tsx": {}, "src/b.ts": {}}))
        self.assertEqual({row["path"]: row["ui"] for row in ranked["files"]}, {"src/a.tsx": True, "src/b.ts": False})


class EndToEnd(Temp):
    def setUp(self):
        super().setUp()
        self.data = self.folder / "data"
        write_migration(self.repo, "20260101000000_base.sql", "create table a (id int primary key);\n")
        write(self.repo, "src/lib/a.ts", "export const a = (b: number) => (b > 1 ? 1 : 2)\n")
        write(self.repo, "src/lib/a.test.ts", 'import { a } from "./a"\na(1)\n')
        write(self.repo, "src/lib/lonely.ts", "export function f(a: boolean) {\n  if (a) return 1\n  return 2\n}\n")
        commit_all(self.repo)
        write(self.repo, "src/lib/lonely.ts", "export function f(a: boolean) {\n  if (a) return 3\n  return 2\n}\n")
        commit_all(self.repo)
        store.build(self.repo, self.data, "HEAD")
        self.target = store.repo_dir(self.repo, self.data)

    def write_report(self, covered: int = 2) -> Path:
        report = self.folder / "run" / "coverage" / "lcov.info"
        report.parent.mkdir(parents=True)
        report.write_text(f"SF:src/lib/lonely.ts\nDA:1,1\nDA:2,{covered}\nDA:3,0\nDA:4,0\nend_of_record\n")
        return report

    def test_the_facts_are_written_with_the_model(self):
        facts = json.loads((store.current(self.target) / "risk.json").read_text())
        row = facts["files"]["src/lib/lonely.ts"]
        self.assertEqual((row["commits"], row["complexity"], row["tests"]), (2, 1, 0))
        self.assertEqual(facts["files"]["src/lib/a.ts"]["tests"], 1)
        self.assertEqual(facts["test_files"], 1)
        self.assertNotIn("src/lib/a.test.ts", facts["files"])

    def test_a_hash_covers_the_risk_facts(self):
        self.assertEqual(store.verify_facts(self.target), [])
        (store.current(self.target) / "risk.json").write_text("{}")
        self.assertEqual(store.verify_facts(self.target), [f"versions/{store.read_manifest(self.target)['version']}/risk.json"])

    def test_loading_a_report_needs_no_rebuild(self):
        version = store.read_manifest(self.target)["version"]
        loaded = store.set_coverage(self.target, str(self.write_report()), "HEAD")
        self.assertEqual((loaded["lines_hit"], loaded["lines_total"], loaded["file_count"]), (2, 4, 1))
        self.assertEqual(store.read_manifest(self.target)["version"], version)
        ranked = store.load_risk(self.target)
        self.assertEqual(next(row for row in ranked["files"] if row["path"] == "src/lib/lonely.ts")["covered"], 0.5)
        self.assertEqual(ranked["coverage"]["lines_hit"], 2)

    def test_a_report_outlives_a_rebuild(self):
        store.set_coverage(self.target, str(self.write_report()), "HEAD")
        write(self.repo, "src/lib/lonely.ts", "export const f = 1\n")
        commit_all(self.repo)
        store.build(self.repo, self.data, "HEAD")
        self.assertIsNotNone(store.load_risk(self.target)["coverage"])

    def test_the_load_says_how_many_files_have_moved_on(self):
        store.set_coverage(self.target, str(self.write_report()), git(self.repo, "rev-parse", "HEAD~1"))
        self.assertEqual(store.load_risk(self.target)["coverage"]["files_changed_since"], 1)

    def test_a_report_with_no_known_commit_says_nothing_about_drift(self):
        store.set_coverage(self.target, str(self.write_report()))
        self.assertIsNone(store.load_risk(self.target)["coverage"]["files_changed_since"])

    def test_a_report_in_a_checkout_takes_that_commit(self):
        write(self.repo, "coverage/lcov.info", "SF:src/lib/lonely.ts\nDA:1,1\nend_of_record\n")
        loaded = store.set_coverage(self.target)
        self.assertEqual(loaded["commit"], git(self.repo, "rev-parse", "HEAD"))

    def test_no_report_is_a_clear_error(self):
        with self.assertRaisesRegex(ValueError, "no coverage report"):
            store.set_coverage(self.target)

    def test_a_report_for_another_repo_is_refused(self):
        report = self.folder / "other.info"
        report.write_text("SF:other/thing.ts\nDA:1,1\nend_of_record\n")
        with self.assertRaisesRegex(ValueError, "no file in"):
            store.set_coverage(self.target, str(report))
        self.assertIsNone(store.load_coverage(self.target))

    def test_a_module_node_carries_its_risk_and_worst_files(self):
        node = store.load_node(self.target, "module:src/lib")
        self.assertEqual(node["risk"]["commits"], 2)
        self.assertEqual(node["risk"]["worst_files"][0]["path"], "src/lib/lonely.ts")

    def test_other_nodes_carry_no_risk(self):
        self.assertNotIn("risk", store.load_node(self.target, "table:public.a"))

    def test_rows_are_named_for_the_ui(self):
        row = store.load_risk(self.target)["modules"][0]
        self.assertEqual((row["name"], row["path"]), ("lib", "src/lib"))

    def test_a_shallow_clone_says_so(self):
        clone = self.folder / "shallow"
        subprocess.run(["git", "clone", "-q", "--depth", "1", f"file://{self.repo}", str(clone)], check=True)
        self.assertTrue(risk.history(GitSource(clone, "HEAD"))["shallow"])


if __name__ == "__main__":
    unittest.main()
