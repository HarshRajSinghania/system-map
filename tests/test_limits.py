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

from core import limits, proposals  # noqa: E402
from core.extractors import postgres  # noqa: E402
from core.sources import TreeSource  # noqa: E402
from helpers import commit_all, git, write_migration  # noqa: E402

PGBIN = Path(os.environ.get("PGBIN", "/usr/lib/postgresql/16/bin"))
GONE = "DROP"

BASE = """
create type public.stage as enum ('new', 'done');

create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  label text,
  rank integer,
  size bigint,
  stage public.stage not null default 'new',
  status text not null default 'open' check (status in ('open', 'closed')),
  note text
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs (id) on delete cascade,
  email text not null,
  nickname text,
  score text,
  created date,
  unique (org_id, email)
);
create index users_nickname_idx on public.users (nickname);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id),
  bio text
);

create table public.settings (
  owner uuid,
  value text
);
alter table public.orgs add constraint orgs_owner_key unique (label);
alter table public.orgs enable row level security;
create policy "orgs read" on public.orgs for select using (note is not null);

create table public.flags (id uuid primary key, live boolean);
create table public.audit (
  id uuid primary key,
  org_id uuid,
  amount integer check (amount >= 0),
  meta jsonb check (jsonb_typeof(meta) = 'object'),
  tags text[] check (tags <@ array['a', 'b']::text[]),
  rate integer check (rate between 1 and 10),
  state text,
  phase text,
  free text check (char_length(free) < 10)
);
alter table public.audit enable row level security;
create policy "audit read" on public.audit for select
  using (org_id in (select u.org_id from public.users u where u.id = current_setting('app.user')::uuid));
create policy "audit write" on public.audit for insert
  with check (exists (select 1 from public.flags f where f.live));
create function public.noop() returns trigger language plpgsql as $$ begin return new; end $$;
create trigger audit_state before update of state on public.audit
  for each row execute function public.noop();
create trigger audit_phase before update on public.audit
  for each row when (old.phase is distinct from new.phase) execute function public.noop();
"""
SEED = """
insert into public.orgs (id, code, label) values ('00000000-0000-0000-0000-000000000001', 'a', 'one');
insert into public.orgs (id, code, label) values ('00000000-0000-0000-0000-000000000002', 'b', 'two');
insert into public.users (id, org_id, email, nickname, score) values
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'a@x', null, '1'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', 'a@x', 'same', '2');
insert into public.settings (owner, value) values (null, 'x'), (null, 'x');
"""


def table_change(op: str, **fields) -> dict:
    return {"op": op, **fields}


def column(name: str, kind: str = "text", **fields) -> dict:
    return {"name": name, "type": kind, **fields}


#: Each row: a change, then the rule that should fire, or None when Postgres should accept it.
CASES = [
    (table_change("add_table", table="orgs", columns=[column("id", "uuid")]), "table_exists"),
    (table_change("add_table", table="t1", columns=[column("a"), column("a")]), "column_exists"),
    (table_change("add_table", table="t2", columns=[column("a", "nope")]), "no_such_type"),
    (table_change("add_table", table="t3", columns=[column("a", "uuid", references="ghosts")]), "fk_no_target"),
    (table_change("add_table", table="t4", columns=[column("a", "uuid", references="orgs(ghost)")]), "fk_no_column"),
    (table_change("add_table", table="t5", columns=[column("a", "text", references="users(nickname)")]), "fk_not_unique"),
    (table_change("add_table", table="t6", columns=[column("a", "text", references="orgs")]), "fk_type_mismatch"),
    (table_change("add_table", table="t7", columns=[column("a", "integer", references="orgs")]), "fk_type_mismatch"),
    (table_change("add_table", table="ok1", columns=[column("id", "uuid", primary=True, default="gen_random_uuid()"), column("org_id", "uuid", references="orgs", index=True)], rls=True), None),
    (table_change("add_table", table="ok2", columns=[column("id", "bigint", primary=True), column("parent", "integer", references="ok2")]), None),
    (table_change("add_table", table="ok3", columns=[column("id", "uuid", primary=True), column("code", "character varying(20)", references="orgs(code)")]), None),
    (table_change("add_table", table="ok4", columns=[column("day", "timestamptz"), column("tags", "text[]"), column("stage", "public.stage"), column("cost", "numeric(10,2)")]), None),
    (table_change("add_column", table="ghosts", column=column("a")), "no_such_table"),
    (table_change("add_column", table="orgs", column=column("code")), "column_exists"),
    (table_change("add_column", table="orgs", column=column("a", "nope")), "no_such_type"),
    (table_change("add_column", table="users", column=column("boss", "text", references="users")), "fk_type_mismatch"),
    (table_change("add_column", table="users", column=column("required", "text", nullable=False)), "not_null_no_default"),
    (table_change("add_column", table="users", column=column("with_default", "text", nullable=False, default="'x'")), None),
    (table_change("add_column", table="users", column=column("boss", "uuid", references="users", index=True)), None),
    (table_change("change_column", table="users", column="ghost", type="text"), "no_such_column"),
    (table_change("change_column", table="users", column="score", type="integer"), "no_cast"),
    (table_change("change_column", table="users", column="created", type="uuid"), "no_cast"),
    (table_change("change_column", table="orgs", column="rank", type="boolean"), "no_cast"),
    (table_change("change_column", table="orgs", column="note", type="uuid", using="null::uuid"), "type_in_policy"),
    (table_change("change_column", table="orgs", column="id", nullable=True), "null_in_key"),
    (table_change("change_column", table="users", column="nickname", nullable=False), "not_null_on_rows"),
    (table_change("change_column", table="users", column="score", type="integer", using="score::integer"), None),
    (table_change("change_column", table="orgs", column="rank", type="bigint"), None),
    (table_change("change_column", table="orgs", column="size", type="text"), None),
    (table_change("change_column", table="users", column="created", type="timestamptz"), None),
    (table_change("change_column", table="users", column="email", nullable=True), "null_in_unique_ok"),
    (table_change("change_column", table="orgs", column="label", default="'x'"), None),
    (table_change(f"{GONE.lower()}_column", table="users", column="ghost"), "no_such_column"),
    (table_change(f"{GONE.lower()}_column", table="orgs", column="id"), "column_has_fks"),
    (table_change(f"{GONE.lower()}_column", table="orgs", column="note"), "column_in_policy"),
    (table_change(f"{GONE.lower()}_column", table="users", column="nickname"), "takes_rules_with_it"),
    (table_change(f"{GONE.lower()}_column", table="profiles", column="bio"), None),
    (table_change(f"{GONE.lower()}_table", table="ghosts"), "no_such_table"),
    (table_change(f"{GONE.lower()}_table", table="users"), "table_has_fks"),
    (table_change(f"{GONE.lower()}_table", table="settings"), None),
    (table_change("add_index", table="orgs", columns=["ghost"]), "no_such_column"),
    (table_change("add_index", table="orgs", columns=["rank"], name="users_nickname_idx_2"), None),
    (table_change("add_index", table="orgs", columns=["rank"], name="users_nickname_idx_2"), "index_exists"),
    (table_change("add_enum_value", type="ghost", value="x"), "no_such_type"),
    (table_change("add_enum_value", type="stage", value="new"), "value_exists"),
    (table_change("add_enum_value", type="stage", value="later"), None),
    (table_change("add_index", table="users", columns=["org_id"], name="users_org_only", unique=True), "unique_on_rows_ok"),
    (table_change("add_index", table="users", columns=["email"], name="users_email_only", unique=True), "unique_on_rows"),
    # A policy on one table depends on columns of the table its subquery reads.
    (table_change(f"{GONE.lower()}_column", table="users", column="org_id"), "column_in_policy"),
    (table_change("change_column", table="users", column="org_id", type="text"), "type_in_policy"),
    (table_change(f"{GONE.lower()}_table", table="flags"), "table_in_policy"),
    # `u.id` in that subquery is users.id, so audit's own id is free to go.
    (table_change(f"{GONE.lower()}_column", table="audit", column="id"), None),
    (table_change(f"{GONE.lower()}_column", table="audit", column="state"), "column_in_trigger"),
    (table_change("change_column", table="audit", column="state", type="character varying(9)"), "type_in_trigger"),
    (table_change(f"{GONE.lower()}_column", table="audit", column="phase"), "column_in_trigger"),
    (table_change("change_column", table="audit", column="amount", type="text"), "type_in_check"),
    (table_change("change_column", table="audit", column="meta", type="text"), "type_in_check"),
    (table_change("change_column", table="audit", column="tags", type="text"), "type_in_check"),
    (table_change("change_column", table="audit", column="rate", type="text"), "type_in_check"),
    (table_change("change_column", table="audit", column="rate", type="bigint"), None),
    (table_change("change_column", table="audit", column="free", type="character varying(9)"), None),
    (table_change("change_column", table="profiles", column="user_id", type="text"), "type_breaks_fk"),
    (table_change("change_column", table="users", column="id", type="text"), "type_breaks_fk"),
]
#: Advice, not a verdict: Postgres accepts these. `unique_on_rows` fails only if rows repeat,
#: and in the first of its two cases they don't. The rule can't see rows, so it warns on both.
ACCEPTED = {None, "takes_rules_with_it", "null_in_unique_ok", "unique_on_rows_ok"}
#: What a use case needs, and a statement that shows whether the schema can hold it.
USER = "00000000-0000-0000-0000-000000000011"
NEED_CASES = [
    ({"need": "value", "table": "orgs", "column": "status", "value": "closed"}, "insert into public.orgs (status) values ('closed');"),
    ({"need": "value", "table": "orgs", "column": "status", "value": "paused"}, "insert into public.orgs (status) values ('paused');"),
    ({"need": "value", "table": "orgs", "column": "stage", "value": "done"}, "insert into public.orgs (stage) values ('done');"),
    ({"need": "value", "table": "orgs", "column": "stage", "value": "later"}, "insert into public.orgs (stage) values ('later');"),
    ({"need": "optional", "table": "users", "column": "nickname"}, f"update public.users set nickname = null where id = '{USER}';"),
    ({"need": "optional", "table": "users", "column": "email"}, f"update public.users set email = null where id = '{USER}';"),
    ({"need": "field", "table": "users", "column": "email"}, "select email from public.users;"),
    ({"need": "field", "table": "users", "column": "phone"}, "select phone from public.users;"),
    ({"need": "duplicate", "table": "users", "columns": ["nickname"]}, "update public.users set nickname = 'same';"),
    ({"need": "duplicate", "table": "users", "columns": ["org_id", "email"]}, "insert into public.users (org_id, email) select org_id, email from public.users limit 1;"),
    ({"need": "has_many", "parent": "orgs", "child": "users"}, "insert into public.users (org_id, email) select org_id, 'b@x' from public.users limit 1;"),
    (
        {"need": "has_many", "parent": "users", "child": "profiles"},
        f"insert into public.profiles (user_id) values ('{USER}'); insert into public.profiles (user_id) values ('{USER}');",
    ),
]


def schema(sql: str = BASE) -> tuple[dict, dict]:
    folder = Path(tempfile.mkdtemp())
    try:
        write_migration(folder, "001_base.sql", sql)
        extraction = postgres.extract(TreeSource(folder))
    finally:
        shutil.rmtree(folder, ignore_errors=True)
    return proposals.working_copy(extraction["nodes"], extraction["types"])


def rule_of(change: dict, tables: dict, types: dict) -> list[str]:
    return [limit["check"] for limit in limits.check_all([change], tables, types, {"edges": []}, {})[0]]


class Rules(unittest.TestCase):
    def test_each_rule_fires_on_its_own_case(self):
        tables, types = schema()
        for index, (change, expected) in enumerate(CASES):
            with self.subTest(index=index, change=change):
                found = [limit for limit in limits.check_change(change, index, tables, types, {"edges": []}, {})]
                kinds = [limit["check"] for limit in found]
                if expected in ACCEPTED:
                    self.assertFalse([limit for limit in found if limit["kind"] == "refused"], kinds)
                else:
                    self.assertIn(expected, kinds)
                if not any(limit["kind"] == "refused" for limit in found):
                    proposals.apply(tables, types, change)

    def test_a_later_change_sees_an_earlier_one(self):
        tables, types = schema()
        changes = [
            table_change("add_table", table="parents", columns=[column("id", "uuid", primary=True)]),
            table_change("add_table", table="kids", columns=[column("parent_id", "uuid", references="parents")]),
        ]
        found, after = limits.check_all(changes, tables, types, {"edges": []}, {})
        self.assertFalse([limit for limit in found if limit["kind"] == "refused"])
        self.assertIn("public.kids", after)

    def test_a_refused_change_is_not_applied(self):
        tables, types = schema()
        _, after = limits.check_all([table_change("add_table", table="bad", columns=[column("a", "nope")])], tables, types, {"edges": []}, {})
        self.assertNotIn("public.bad", after)

    def test_a_new_table_gets_the_same_rule_checks_as_the_rest(self):
        tables, types = schema()
        change = table_change("add_table", table="loose", columns=[column("org_id", "uuid", references="orgs", on_delete="cascade")])
        self.assertLessEqual({"rls_off", "no_primary_key", "fk_no_index"}, set(rule_of(change, tables, types)))

    def test_rule_checks_that_already_fail_are_not_blamed_on_the_change(self):
        tables, types = schema()
        found = rule_of(table_change("add_column", table="settings", column=column("more")), tables, types)
        self.assertNotIn("no_primary_key", found)
        self.assertNotIn("rls_off", found)

    def test_an_rls_table_with_no_policy_is_named(self):
        tables, types = schema()
        change = table_change("add_table", table="locked", columns=[column("id", "uuid", primary=True)], rls=True)
        self.assertIn("rls_no_policy", rule_of(change, tables, types))

    def test_code_that_names_a_column_counts_as_breaking(self):
        tables, types = schema()
        code = {"public.users.nickname": ["src/a.ts:4", "src/b.ts:9"]}
        change = table_change(f"{GONE.lower()}_column", table="users", column="nickname")
        found = limits.check_change(change, 0, tables, types, {"edges": []}, code)
        hit = next(limit for limit in found if limit["check"] == "code_uses_column")
        self.assertEqual((hit["kind"], hit["evidence"]), ("breaks", ["src/a.ts:4", "src/b.ts:9"]))

    def test_code_that_calls_a_table_counts_as_breaking(self):
        tables, types = schema()
        joined = {"edges": [{"kind": "uses_table", "target": "table:public.settings", "source": "module:src/a", "evidence": ["src/a.ts:1"]}]}
        found = limits.check_change(table_change(f"{GONE.lower()}_table", table="settings"), 0, tables, types, joined, {})
        self.assertEqual(found[0]["check"], "code_uses_table")

    def test_every_refusal_cites_where_to_look(self):
        tables, types = schema()
        found = limits.check_change(table_change("add_column", table="orgs", column=column("code")), 0, tables, types, {"edges": []}, {})
        self.assertRegex(found[0]["evidence"][0], r"001_base\.sql:\d+$")


class ColumnRefs(unittest.TestCase):
    def setUp(self):
        self.tables, _ = schema()

    def refs(self, expression: str, owner: str = "public.audit", extra: dict | None = None) -> set:
        return {ref for ref in limits.column_refs(expression, owner, self.tables, extra) if ref[1]}

    def test_a_plain_name_belongs_to_the_owner(self):
        self.assertEqual(self.refs("org_id = 1"), {("public.audit", "org_id")})

    def test_a_subquery_name_belongs_to_the_subquery(self):
        found = self.refs("org_id in (select u.org_id from public.users u where u.id = 'x')")
        self.assertEqual(found, {("public.audit", "org_id"), ("public.users", "org_id"), ("public.users", "id")})

    def test_a_plain_name_in_a_subquery_binds_to_the_inner_table_first(self):
        self.assertEqual(self.refs("exists (select 1 from public.users where id = 'x')"), {("public.users", "id")})

    def test_a_subquery_can_reach_out_by_table_name(self):
        self.assertIn(("public.audit", "state"), self.refs("exists (select 1 from public.users u where u.email = audit.state)"))

    def test_a_string_or_function_is_not_a_column(self):
        self.assertEqual(self.refs("'state' = state_of(1)"), set())

    def test_old_and_new_mean_the_owner(self):
        self.assertEqual(self.refs("new.state <> old.phase", extra={"new": "public.audit", "old": "public.audit"}), {("public.audit", "state"), ("public.audit", "phase")})

    def test_a_table_read_in_a_subquery_counts_even_with_no_column(self):
        self.assertIn(("public.flags", None), limits.column_refs("exists (select 1 from public.flags)", "public.audit", self.tables))


class Types(unittest.TestCase):
    def test_a_foreign_key_needs_a_type_that_matches(self):
        self.assertTrue(limits.can_reference("uuid", "uuid"))
        self.assertTrue(limits.can_reference("integer", "bigint"))
        self.assertTrue(limits.can_reference("varchar(20)", "text"))
        self.assertFalse(limits.can_reference("text", "uuid"))
        self.assertFalse(limits.can_reference("numeric", "integer"))

    def test_any_type_can_become_text_and_text_cannot_become_most_things(self):
        self.assertTrue(limits.can_cast("uuid", "text"))
        self.assertFalse(limits.can_cast("text", "uuid"))
        self.assertTrue(limits.can_cast("integer", "numeric(10,2)"))
        self.assertFalse(limits.can_cast("integer", "boolean"))


class Needs(unittest.TestCase):
    def setUp(self):
        self.tables, self.types = schema()

    def check(self, **need) -> list[str]:
        return [limit["check"] for limit in limits.check_need(need, self.tables, self.types)]

    def test_a_field_must_exist(self):
        self.assertEqual(self.check(need="field", table="users", column="email"), [])
        self.assertEqual(self.check(need="field", table="users", column="phone"), ["no_such_column"])
        self.assertEqual(self.check(need="field", table="ghosts", column="a"), ["no_such_table"])

    def test_an_optional_field_must_allow_null(self):
        self.assertEqual(self.check(need="optional", table="users", column="nickname"), [])
        self.assertEqual(self.check(need="optional", table="users", column="email"), ["must_have_value"])

    def test_a_value_must_fit_a_check(self):
        self.assertEqual(self.check(need="value", table="orgs", column="status", value="open"), [])
        self.assertEqual(self.check(need="value", table="orgs", column="status", value="paused"), ["value_not_allowed"])

    def test_a_value_must_fit_an_enum(self):
        self.assertEqual(self.check(need="value", table="orgs", column="stage", value="done"), [])
        self.assertEqual(self.check(need="value", table="orgs", column="stage", value="later"), ["value_not_allowed"])

    def test_a_free_text_column_takes_any_value(self):
        self.assertEqual(self.check(need="value", table="orgs", column="label", value="anything"), [])

    def test_duplicates_must_get_past_every_key(self):
        self.assertEqual(self.check(need="duplicate", table="users", columns=["nickname"]), [])
        self.assertEqual(self.check(need="duplicate", table="users", columns=["org_id", "email"]), ["must_be_unique"])

    def test_a_unique_index_blocks_duplicates_too(self):
        self.assertEqual(self.check(need="duplicate", table="orgs", columns=["code"]), ["must_be_unique"])

    def test_many_children_need_the_key_on_the_child(self):
        self.assertEqual(self.check(need="has_many", parent="orgs", child="users"), [])

    def test_a_unique_key_means_only_one_child(self):
        self.assertEqual(self.check(need="has_many", parent="users", child="profiles"), ["only_one"])

    def test_a_key_on_the_parent_means_only_one_child(self):
        self.assertEqual(self.check(need="has_many", parent="users", child="orgs"), ["only_one"])

    def test_no_key_at_all_is_a_gap(self):
        self.assertEqual(self.check(need="has_many", parent="settings", child="orgs"), ["no_link"])


class Malformed(unittest.TestCase):
    def test_a_bad_change_is_an_error_and_not_a_limit(self):
        bad = [
            {"op": "nope"},
            {"op": "add_table", "table": "t"},
            {"op": "add_column", "table": "t; select 1", "column": {"name": "a", "type": "text"}},
            {"op": "add_column", "table": "t", "column": {"name": "a b", "type": "text"}},
            {"op": "add_column", "table": "t", "column": {"name": "a", "type": "text; select 1"}},
            {"op": "add_column", "table": "t", "column": {"name": "a", "type": "text", "default": "1; select 1"}},
            {"op": "change_column", "table": "t", "column": "a", "using": "1; select 1"},
            {"op": "add_enum_value", "type": "s", "value": "it's"},
            "not a change",
        ]
        for change in bad:
            with self.subTest(change=change), self.assertRaises(ValueError):
                proposals.validate(change)

    def test_a_good_change_comes_back_as_it_was(self):
        change = table_change("add_column", table="public.users", column=column("a", "numeric(10,2)"))
        self.assertEqual(proposals.validate(change), change)


@unittest.skipUnless((PGBIN / "initdb").exists() and shutil.which("psql"), "needs Postgres server binaries")
class RealPostgres(unittest.TestCase):
    """Every verdict above, held to a real server: same answer for every change."""

    def test_postgres_agrees_with_every_rule(self):
        with tempfile.TemporaryDirectory(prefix="limits-") as folder:
            base = Path(folder)
            repo = base / "repo"
            repo.mkdir()
            git(repo, "init", "-q", "-b", "main")
            write_migration(repo, "001_base.sql", BASE)
            commit_all(repo)
            changes_dir = base / "changes"
            changes_dir.mkdir()
            for index, (change, _) in enumerate(CASES):
                (changes_dir / f"{index:03}.sql").write_text("\n".join(proposals.to_sql(proposals.validate(change))) + "\n")
            seed = base / "seed.sql"
            seed.write_text(SEED)
            subprocess.run(
                ["bash", str(ROOT / "scripts" / "try_proposal.sh"), str(repo), "main", "supabase/migrations", str(base / "work"), str(changes_dir), "", str(seed)],
                check=True,
                capture_output=True,
                text=True,
            )
            results = json.loads((base / "work" / "results.json").read_text())
            self.assertEqual(len(results), len(CASES))
            wrong = []
            for (change, expected), result in zip(CASES, results):
                refused = expected not in ACCEPTED
                if refused == result["accepted"]:
                    wrong.append({"change": change, "rule": expected, "postgres": result["error"] or "accepted"})
            self.assertEqual(wrong, [])

    def test_postgres_agrees_with_every_need(self):
        tables, types = schema()
        with tempfile.TemporaryDirectory(prefix="needs-") as folder:
            base = Path(folder)
            repo = base / "repo"
            repo.mkdir()
            git(repo, "init", "-q", "-b", "main")
            write_migration(repo, "001_base.sql", BASE)
            commit_all(repo)
            statements = base / "statements"
            statements.mkdir()
            for index, (_, sql) in enumerate(NEED_CASES):
                # Each one is undone, so no statement changes what the next one finds.
                (statements / f"{index:03}.sql").write_text(f"{sql}\nrollback;\n")
            seed = base / "seed.sql"
            seed.write_text(SEED)
            subprocess.run(
                ["bash", str(ROOT / "scripts" / "try_proposal.sh"), str(repo), "main", "supabase/migrations", str(base / "work"), str(statements), "", str(seed)],
                check=True,
                capture_output=True,
                text=True,
            )
            results = json.loads((base / "work" / "results.json").read_text())
            wrong = []
            for (need, sql), result in zip(NEED_CASES, results):
                blocked = bool(limits.check_need(need, tables, types))
                if blocked == result["accepted"]:
                    wrong.append({"need": need, "postgres": result["error"] or "accepted"})
            self.assertEqual(wrong, [])


if __name__ == "__main__":
    unittest.main()
