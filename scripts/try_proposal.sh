#!/usr/bin/env bash
# Run a proposal's changes on a throwaway Postgres, one transaction each, and say which ones
# it refuses. This is how the rules in core/limits.py are held to a real server.
#
# Usage: scripts/try_proposal.sh <repo> <ref> <migrations-dir> <work-dir> <changes-dir> [bootstrap.sql] [seed.sql]
#
# <changes-dir> holds numbered .sql files, one per change, from `python3 -m core proposal-sql`.
# <work-dir> gets results.json. [bootstrap.sql] is a repo path, read at <ref>. [seed.sql] is a
# path on disk, run after the migrations, for rules that only fail once rows exist.
# The server listens on a socket only, and stops when this script ends.
set -euo pipefail

REPO="$1"; REF="$2"; MIGRATIONS="$3"; WORK="$4"; CHANGES="$5"; BOOTSTRAP="${6:-}"; SEED="${7:-}"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
PGPORT="${PGPORT:-54332}"

mkdir -p "$WORK"
DATA="$(mktemp -d "$WORK/pg.XXXXXX")"
TREE="$(mktemp -d "$WORK/tree.XXXXXX")"
# A socket path must stay under about 100 bytes, so it cannot live in a deep folder.
SOCK="$(mktemp -d /tmp/smap.XXXXXX)"

stop() {
  "$PGBIN/pg_ctl" -D "$DATA/d" -m immediate stop >/dev/null 2>&1 || true
  rm -rf "$SOCK"
}
trap stop EXIT

git -C "$REPO" archive "$REF" "$MIGRATIONS" ${BOOTSTRAP:+"$BOOTSTRAP"} | tar -x -C "$TREE"

"$PGBIN/initdb" -D "$DATA/d" -U postgres --auth=trust >/dev/null
"$PGBIN/pg_ctl" -D "$DATA/d" -w -l "$DATA/log" -o "-p $PGPORT -k $SOCK -c listen_addresses=''" start >/dev/null

export PGHOST="$SOCK" PGPORT PGUSER=postgres
psql_run() { psql -v ON_ERROR_STOP=1 -q -d app "$@"; }
psql -q -d postgres -c "CREATE DATABASE app"

if [ -n "$BOOTSTRAP" ]; then psql_run -f "$TREE/$BOOTSTRAP" >/dev/null; fi
for file in $(ls "$TREE/$MIGRATIONS"/*.sql | sort); do
  psql_run -f "$file" >/dev/null
done
if [ -n "$SEED" ]; then psql_run -f "$SEED" >/dev/null; fi

{
  echo '['
  first=1
  for file in $(ls "$CHANGES"/*.sql | sort); do
    [ "$first" = 1 ] || echo ','
    first=0
    index="$(basename "$file" .sql)"
    if error="$(psql_run -1 -f "$file" 2>&1 >/dev/null)"; then
      printf '{"change": %d, "accepted": true, "error": ""}' "$((10#$index))"
    else
      printf '{"change": %d, "accepted": false, "error": %s}' "$((10#$index))" \
        "$(printf '%s' "$error" | python3 -c 'import json, sys; print(json.dumps(sys.stdin.read()[:300]))')"
    fi
  done
  echo ']'
} > "$WORK/results.json"
echo "tried $(ls "$CHANGES"/*.sql | wc -l) changes; wrote $WORK/results.json"
