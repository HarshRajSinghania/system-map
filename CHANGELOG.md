# Changelog

What changed in each release of System Map. Each release has a git tag, `v<version>`, on the
commit that set the version in `app.json`. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Security
- The backend refuses every call the gateway didn't sign, except `/health`. It checks the
  gateway's `X-KiroCrew-Proxy` signature, and the replay-proof v2 signature whenever one is sent.
  With no app secret it refuses everything. `ui/dev` opts out with `SYSTEM_MAP_UNSIGNED=1`, which
  a backend that Kiro Crew starts ignores.

### Fixed
- The MCP tools check each call's arguments against the tool's schema and say what to fix. A
  wrong type no longer ends the tool server for every session, and a fault no tool expected is
  reported as an internal error.
- The backend refuses a bad `Content-Length`, a body over 1 MiB, and a body that isn't a JSON
  object, with words instead of a dropped connection.
- A build no longer holds up the page's reads. Writes still take turns.
- The review rounds on the Agents tab and layer after 0.9.0: agent reader faults, the Agents view's
  should-fix findings, turning the Agents layer off goes back to where you were, and opening a
  saved view turns the layer off.

### Added
- Contract tests for the store listing and the host: the manifest against the host's own parser,
  and each built bundle against what the host page provides.
- This changelog, and tags for every release.

### Changed
- The MCP server reports the app's version, read from `app.json`.
- The README now covers installing from the store with the trust step, what you need, the first
  run, each view, where data lives and what the app asks for, and troubleshooting. The proof
  recipes moved under Development.

## [0.9.0] - 2026-11-04

### Added
- The Agents tab. Point System Map at your list of agents, and it shows what starts each one, who
  it hands work to, which models it uses, and where it waits for a person.
- The Agents layer on the Map, with each region's models in a dashed band.
- Regions for services and a home region for the project. An agent whose model runs elsewhere
  becomes a finding, with the line that calls it.
- The `agents` MCP tool.

## [0.8.1] - 2026-11-02

0.8.0 was never released.

### Added
- Drizzle schemas for SQLite are read as text, never run, and held to `drizzle-kit`.
- Add project lists projects with no git.

## [0.7.1] - 2026-11-01

### Fixed
- The Design chat opens on its first message, so an unused project leaves no empty session.

## [0.7.0] - 2026-11-01

### Added
- Pick a project from your default folder. System Map finds the workspaces in a folder and keeps
  a default.
- Browse opens the computer's own folder window.

### Fixed
- A click on a project row reaches it.
- The side list shows only where it steers the canvas.

## [0.6.0] - 2026-11-01

### Added
- Next.js and SQLite projects. Routes are held to `next build`, and SQL in strings to the
  TypeScript compiler.
- Each build says what it read, and small projects show properly.

## [0.5.0] - 2026-11-01

### Added
- Projects. The backend manages them, the header is built around one open project, and agent
  tools find their own.
- The Explore view: what-ifs, use cases and saved views.
- Plain error messages, and a guard against stale replies.
- The app icon.

## [0.4.0] - 2026-11-01

### Added
- The Risk and Worktrees views, also shown on the Map.
- What-ifs are checked against the model and real Postgres.

## [0.3.0] - 2026-11-01

### Added
- Hot, untested code, and where worktrees collide, found from git and a trial merge.

## [0.2.0] - 2026-11-01

### Added
- The Map and Plan views: modules, routes, jobs, services and plans.

## [0.1.0] - 2026-11-01

### Added
- The Data model view: a diagram, findings and a full-height chat, proved against real Postgres.
- The page can build a project's first model.

## [0.0.1] - 2026-11-01

### Added
- The first spike: model files, MCP tools, the backend and the app page.
