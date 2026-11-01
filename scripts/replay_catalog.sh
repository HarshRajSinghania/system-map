#!/usr/bin/env bash
# Apply a repo's migrations to a throwaway Postgres and write its real catalog.
#
# Usage: scripts/replay_catalog.sh <repo> <ref> <migrations-dir> <work-dir> [bootstrap.sql]
#
# <work-dir> gets catalog.json and schema.sql. The server listens on a socket in that
# folder only, and stops when this script ends. [bootstrap.sql] is a repo path, read at
# <ref>, for anything the migrations expect to exist already.
set -euo pipefail

REPO="$1"; REF="$2"; MIGRATIONS="$3"; WORK="$4"; BOOTSTRAP="${5:-}"
HERE="$(cd "$(dirname "$0")" && pwd)"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
PGPORT="${PGPORT:-54331}"

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
count=0
for file in $(ls "$TREE/$MIGRATIONS"/*.sql | sort); do
  psql_run -f "$file" >/dev/null 2>"$WORK/last_error.txt" || { echo "failed on $file"; cat "$WORK/last_error.txt"; exit 1; }
  count=$((count + 1))
done

psql_run -qAt -f "$HERE/catalog.sql" > "$WORK/catalog.json"
pg_dump -d app --schema-only --no-owner --no-privileges -n public > "$WORK/schema.sql"
echo "applied $count migrations; wrote $WORK/catalog.json"
