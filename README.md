# System Map

A live map of your system, as a [Kiro Crew](https://github.com/kirodotdev/KiroCrew) app. Every view reads one model built from your repo's main branch. Agents read that model in small slices, so a design chat does not fill up with the whole system.

Status: early. It reads TypeScript projects, TanStack file routes, Postgres migrations, `cron.schedule` jobs, specs in `docs/specs`, agents you point it at, git history and worktrees, and coverage reports from Vitest, Jest or anything that writes lcov. The model format may change, and the app upgrades it when it starts.

## What it does

- **Map.** Your system at three levels: areas, the modules in an area, then one module with what it touches. Links come from real imports and table calls.
- **Plan.** What your specs promise and what does not exist yet. It looks up what each spec names, so a status shows its evidence. You can override any status.
- **Data model.** A diagram of every table and foreign key. Click a table to see only it and its neighbors.
- **Risk.** Code that changes often, has many paths and few tests, worst first. It works from imports alone, and a coverage report gives it real numbers.
- **Worktrees.** What each worktree is changing, live, and where two of them collide. A conflict comes from a real trial merge, and two worktrees on one table raise a warning. The Map, the Data model and the chat side panel show it too.
- **Findings.** Rule checks such as a table without row level security or a foreign key with no index. Each one cites its file and line.
- **Agents.** Point it at the list of your agents, and it shows what starts each one, who it hands work to, which models it uses, and where it waits for a person. It never guesses: an agent comes from the list you name or a module you mark.
  - **Agents layer:** the same picture on the Map, with the models in one dashed band per region.
  - **Regions:** say where each service runs, and set a home region. An agent whose model runs elsewhere becomes a finding, with the line that calls it.
- **Explore.** Think about what the system could be, with nothing touching your repo.
  - **What if:** describe a change, and the Design chat drafts a proposal. You get a diff against today, what Postgres will refuse, what breaks, draft SQL, and which use case gaps it closes. Draw it on the Map or in the Data model, then go back to today.
  - **Use cases:** map what someone needs to do to its routes, tables and tests. Gaps show what is missing, untested, or more than the schema can hold.
  - **Views:** ask for a picture in chat, and the app draws and keeps it.
- **Design chat.** A chat beside the map, and an Ask button on everything.
- **Agent tools.** Any session can read the model through MCP tools.

## What it reads

| Part | Read from |
|---|---|
| Postgres | Migrations in `supabase/migrations`, `db/migrations` or `migrations` |
| SQLite | Any `.sql` file, including what Prisma and Drizzle generate, `CREATE TABLE` inside code, or a Drizzle schema in TypeScript. Real SQLite reads it, in memory |
| Routes | Next.js App Router and Pages Router, TanStack and Remix file routes |
| Code | TypeScript and JavaScript, with `paths` and `baseUrl` from `tsconfig.json` or `jsconfig.json` |
| Plans | `docs/specs`, `docs/plans`, `specs`, and a `BRIEF`, `PLAN`, `ROADMAP`, `PRD`, `SPEC` or `TODO` file at the top of the repo |
| Agents | The exported list you name in the Agents tab, or modules you mark. Hand-offs, model calls and calls that ask a person are found by the names you give there. Jobs start an agent when their `cron.schedule` command, or the SQL function it calls, names it |

A project needs no git history, though Risk has no churn without it, and there are no worktrees. Add project lists git repos and any folder with a `package.json`. Use a full path for anything else.

Each build records what it read, and the status menu shows it. If a build finds something it can't read, it names it: a Prisma schema with no SQL migrations, a Drizzle schema for anything but SQLite, any part of a Drizzle schema that only running it could answer, MySQL, MongoDB, or a Next.js app in a subfolder.

A Drizzle schema is read as text and never run. SQL files win where a project has both, since they are what the database ran. Code links to Drizzle tables either way.

## Layout

| Path | Job |
|---|---|
| `core/` | The model and extractors. Imports nothing from Kiro Crew. |
| `core/extractors/` | One module per stack. Each reads a repo into Facts. |
| `mcp_server/` | Tools that agents use. Stdlib only. |
| `backend/` | HTTP API for the dashboard pages. Stdlib only. |
| `ui/` | The app page and the chat side panel tab. |
| `skills/system-map/` | How agents should read and write the model. |
| `scripts/` | Replay migrations and try proposals on a throwaway Postgres, and hold the readers to the compiler and to `drizzle-kit`. |
| `docs/` | Context rules, platform notes and the backlog. |

## Install from a local clone

```bash
(cd ui && npm install && npm run build)
kirocrew app install "$PWD"
kirocrew app enable system-map
kirocrew restart
```

The backend needs you to trust this app when Kiro Crew asks. The restart gives agent sessions the tools, and it stops any work running in your sessions.

Then open System Map from Apps and add a project. Use the project menu in the header to add, switch or remove projects. One is open at a time, and each keeps its own view and design chat.

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

## Prove a SQLite model

Load the schema into a separate real SQLite, then compare every table with its pragmas:

```bash
python3 -m core verify-sqlite <repo>
```

## Prove a Drizzle model

Have the tool write its SQL in a copy of the project, then compare that with the reader. Use `generate`, because `export` ignores `casing`:

```bash
(cd <copy> && npx drizzle-kit generate --name proof)
python3 -m core verify-drizzle <repo> <copy>/drizzle/0000_proof.sql
```

To try every form the reader knows against the real tool, give the sweep any `node_modules` with `drizzle-kit` and `drizzle-orm` installed. The same seed gives the same schemas:

```bash
scripts/sweep_drizzle.py <node_modules> /tmp/sweep [rounds] [tables] [seed]
```

## Prove routes against Next.js

Run `next build` in a copy of the app, then compare the routes Next wrote down:

```bash
python3 -m core verify-routes <repo> <copy>/.next/app-path-routes-manifest.json <copy>/.next/server/pages-manifest.json
```

## Prove a model against the TypeScript compiler

Ask the real compiler what a checkout imports and which tables it calls, then compare. This also checks routes against TanStack's generated route tree:

```bash
node scripts/ts_truth.mjs <checkout> /tmp/truth.json
python3 -m core verify-code <repo> /tmp/truth.json
```

## Prove risk against real tools

Compare each number with the tool that owns it: paths with the compiler, commits with git's log, and coverage with the test runner's own summary:

```bash
python3 -m core coverage <repo> <report> [commit]
python3 -m core verify-risk <repo> /tmp/truth.json <coverage-summary.json>
```

Paths are counted from text, so screen copy can fool them a little. They must stay within 0.5% of the compiler.

## Prove limits against real Postgres

The rules that say what Postgres will refuse are a floor. When one says refused, Postgres refuses. When they stay silent, Postgres may still refuse for a reason the model does not hold, such as a function that takes a table's row.

Run one proposal on a throwaway server, with one file of changes as JSON:

```bash
python3 -m core proposal-sql changes.json /tmp/changes
scripts/try_proposal.sh <repo> origin/main supabase/migrations /tmp/try /tmp/changes [bootstrap.sql]
python3 -m core verify-proposal <repo> changes.json /tmp/try/results.json
```

Or hold every rule to a whole schema. This tries a drop, three new types and both null rules on every column, and a drop on every table. It fails only if a rule says refused and Postgres accepts:

```bash
scripts/sweep_limits.py <repo> origin/main supabase/migrations /tmp/sweep [bootstrap.sql]
```

## Load a coverage report

The app never runs your tests, since that would run your code in its backend. Run them yourself, then press Load report on the Risk view, or use the `coverage` tool. Without a report, Risk still shows which tests reach each file. Run tests in chat asks the Design chat to do this in a scratch copy.

With Vitest, list every source file in `coverage.include`, or a file no test loads will be missing from the report. System Map counts a missing file as 0%.

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
