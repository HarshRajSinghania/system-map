"""Replay hard SQL on real Postgres, and hold the parser to what Postgres says."""
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

from core import verify  # noqa: E402
from core.extractors.postgres import extract  # noqa: E402
from core.sources import GitSource  # noqa: E402
from helpers import commit_all, git, write_migration  # noqa: E402

PGBIN = Path(os.environ.get("PGBIN", "/usr/lib/postgresql/16/bin"))

FIRST = """
CREATE TYPE public.mood AS ENUM ('good', 'bad');
CREATE TYPE "Odd Type" AS ENUM ('x');

CREATE TABLE orgs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (char_length(slug) < 40),
  size numeric(10, 2) NOT NULL DEFAULT 0 CHECK (size >= 0),
  created timestamptz NOT NULL DEFAULT now(),
  tags text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org uuid NOT NULL REFERENCES orgs (id) ON DELETE CASCADE ON UPDATE CASCADE,
  boss bigint REFERENCES users ON DELETE SET NULL,
  mood mood DEFAULT 'good',
  email varchar(200),
  "Odd Name" int,
  low int, high int,
  total int GENERATED ALWAYS AS (low + high) STORED,
  note text CHECK (note <> 'a;b'),
  CONSTRAINT users_range CHECK (low < high),
  CHECK (low > 0),
  UNIQUE (org, email)
);

CREATE TABLE pairs (
  a int,
  b int,
  org uuid,
  PRIMARY KEY (a, b)
);
CREATE TABLE refs (
  a int,
  b int,
  FOREIGN KEY (a, b) REFERENCES pairs (a, b) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX users_email_lower ON users (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS users_org ON public.users USING btree (org, created_at_never_real_guard);
"""
FIRST = FIRST.replace(", created_at_never_real_guard", "")

SECOND = """
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orgs ALTER COLUMN size DROP DEFAULT, ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'a' CHECK (kind IN ('a', 'b'));
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS kind int;
ALTER TABLE orgs RENAME COLUMN created TO born;

CREATE ROLE reader NOLOGIN;
CREATE POLICY "Read own" ON orgs FOR SELECT TO reader USING (slug IS NOT NULL);
CREATE POLICY tmp ON orgs FOR DELETE USING (true);
DROP POLICY tmp ON orgs;
CREATE POLICY writer ON orgs FOR UPDATE USING (true) WITH CHECK (size > 0);
ALTER POLICY writer ON orgs RENAME TO editor;

CREATE FUNCTION touch() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.note := 'CREATE TABLE ghost (id int);';
  RETURN NEW;
END $$;
CREATE TRIGGER users_touch BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE FUNCTION touch();
CREATE TRIGGER users_gone AFTER DELETE ON users FOR EACH ROW EXECUTE FUNCTION touch();
DROP TRIGGER users_gone ON users;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_note_len') THEN
    ALTER TABLE users ADD CONSTRAINT users_note_len CHECK (char_length(note) < 100);
    ALTER TABLE users ADD COLUMN guarded int NOT NULL DEFAULT 1;
  END IF;
END $$;

DO $$ BEGIN
  CREATE TYPE public.late AS ENUM ('one');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE users DROP CONSTRAINT users_low_check;
ALTER TABLE pairs RENAME TO couples;
ALTER TABLE couples ALTER COLUMN org TYPE text USING org::text;
ALTER TABLE users ALTER COLUMN mood SET NOT NULL;
ALTER TABLE users DROP COLUMN "Odd Name";
ALTER TABLE refs ADD CONSTRAINT refs_a UNIQUE (a);
ALTER TABLE refs RENAME CONSTRAINT refs_a TO refs_a_unique;
ALTER TYPE mood ADD VALUE IF NOT EXISTS 'meh';
CREATE INDEX gone ON refs (a);
DROP INDEX gone;
CREATE TABLE temporary_thing (id int);
DROP TABLE temporary_thing;
"""


@unittest.skipUnless((PGBIN / "initdb").exists() and shutil.which("psql"), "needs local Postgres binaries")
class Replay(unittest.TestCase):
    def test_the_model_matches_real_postgres(self):
        with tempfile.TemporaryDirectory(prefix="smap") as tmp:
            base = Path(tmp)
            repo = base / "r"
            repo.mkdir()
            git(repo, "init", "-q", "-b", "main")
            write_migration(repo, "001.sql", FIRST)
            write_migration(repo, "002.sql", SECOND)
            commit_all(repo)
            done = subprocess.run(
                [str(ROOT / "scripts" / "replay_catalog.sh"), str(repo), "main", "supabase/migrations", str(base / "w")],
                capture_output=True,
                text=True,
                env={**os.environ, "PGPORT": "54337"},
                timeout=90,
            )
            self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
            catalog = json.loads((base / "w" / "catalog.json").read_text())
            found = extract(GitSource(repo, "main"))
            diffs = verify.compare(found["nodes"], found["types"], catalog)
            self.assertEqual(diffs, [])
            self.assertEqual(found["stats"]["statements_unknown"], 0)


if __name__ == "__main__":
    unittest.main()
