# System Map

A live map of your system, as a [Kiro Crew](https://github.com/kirodotdev/KiroCrew) app. Every view reads one model built from your repo's main branch. Agents read that model in small slices, so a design chat does not fill up with the whole system.

Status: early. It reads TypeScript projects, TanStack file routes, Postgres migrations, `cron.schedule` jobs and specs in `docs/specs`. The model format may change, and the app upgrades it when it starts.

## What it does

- **Map.** Your system at three levels: areas, the modules in an area, then one module with what it touches. Links come from real imports and table calls.
- **Plan.** What your specs promise and what does not exist yet. It looks up what each spec names, so a status shows its evidence. You can override any status.
- **Data model.** A diagram of every table and foreign key. Click a table to see only it and its neighbors.
- **Findings.** Rule checks such as a table without row level security or a foreign key with no index. Each one cites its file and line.
- **Design chat.** A chat beside the map, and an Ask button on everything.
- **Agent tools.** Any session can read the model through MCP tools.

## Layout

| Path | Job |
|---|---|
| `core/` | The model and extractors. Imports nothing from Kiro Crew. |
| `core/extractors/` | One module per stack. Each reads a repo into Facts. |
| `mcp_server/` | Tools that agents use. Stdlib only. |
| `backend/` | HTTP API for the dashboard pages. Stdlib only. |
| `ui/` | The app page and the chat side panel tab. |
| `skills/system-map/` | How agents should read and write the model. |
| `scripts/` | Replay migrations on a throwaway Postgres. |
| `docs/` | Context rules and platform notes. |

## Install from a local clone

```bash
(cd ui && npm install && npm run build)
kirocrew app install "$PWD"
kirocrew app enable system-map
kirocrew restart
```

The backend needs you to trust this app when Kiro Crew asks. The restart gives agent sessions the tools, and it stops any work running in your sessions.

Then open System Map from Apps and point it at a repo.

## Checks

```bash
python3 -m unittest discover -s tests
(cd ui && npm test && npm run typecheck && npm run build)
```

The replay test needs Postgres server binaries. Set `PGBIN` if they are not in `/usr/lib/postgresql/16/bin`. The compiler test needs `npm install` in `ui`. Each skips itself when its tool is missing.

## Prove a model against real Postgres

Replay a repo's migrations on a throwaway server, then compare it with the model:

```bash
scripts/replay_catalog.sh <repo> origin/main supabase/migrations /tmp/replay [bootstrap.sql]
python3 -m core build <repo>
python3 -m core verify <repo> /tmp/replay/catalog.json
```

`bootstrap.sql` is a repo path for anything the migrations expect to exist, such as a stub of Supabase's `auth` schema. The server listens on a socket only, and stops when the script ends.

## Prove a model against the TypeScript compiler

Ask the real compiler what a checkout imports and which tables it calls, then compare. This also checks routes against TanStack's generated route tree:

```bash
node scripts/ts_truth.mjs <checkout> /tmp/truth.json
python3 -m core verify-code <repo> /tmp/truth.json
```

## Run the page without Kiro Crew

`ui/dev` stands in for the host, so you can see and screenshot the page on its own:

```bash
SYSTEM_MAP_DATA=/tmp/model python3 -m core build <repo>
SYSTEM_MAP_DATA=/tmp/model PORT=9191 python3 backend/server.py &
(cd ui && npm run dev)
```

Open <http://127.0.0.1:5199>. Add `?theme=dark` or `?view=panel`.

## License

Apache-2.0
