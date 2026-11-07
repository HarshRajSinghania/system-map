# Platform notes

What this app learned about Kiro Crew 0.11.0 while building on it.

## Install

- An agent session cannot install an app. The gateway refuses it, so a person must.
- A third-party app needs trust before its backend runs and its executable resources
  register. The gateway logs the refusal and the app stays listed.
- The scaffold's `npm install` fails. `@kirocrew/app-sdk` is listed as a peer dependency but
  is not on npm. The host supplies it at runtime, so this repo drops the peer dependency.

## MCP tools

A Claude Code session is given only the servers named in the agent spec's `tools` array.

```
app.json mcpServers
  -> _register_mcp_servers writes kirocrew.json mcpServers (no tools entry)
  -> a full agent rebuild adds @system-map:system-map to tools
  -> the session array includes the server
```

So after a first install the server is declared but not mounted. A new session does not
help, because the spec it reads still has no `tools` entry. Restart the gateway after the
first install: boot rebuilds the spec, and new sessions then get the tools. Both the gap
and the fix were confirmed in a live gateway. Tools appear as
`mcp__system-map_system-map__<tool>`.

## Seen working in a live dashboard

- The app opens from the sidebar as an installed app.
- A `contributes.panelTabs` tab appears in the chat side panel and reads the same model.
- `ChatEmbed` renders on a slot the app created with `POST /api/chat/slots`.

An installed app's buttons get no default styling, so use the SDK's own controls.

## Building the page

- Theme with the host's CSS variables, such as `--card`, `--text`, `--muted`, `--border`,
  `--accent`, `--danger` and `--warn-text`, and give each a fallback.
- `SegmentedControl` is in the host's stub, and the view switcher uses it.
- Library mode leaves `process.env.NODE_ENV` in bundled packages, and a browser has no
  `process`. Set it with Vite's `define`.
- `style-src` allows inline styles, so a bundled library's CSS can be injected as a `<style>`.
  Inject it at import. React Flow checks for it while mounting.
- React Flow's `fitView` queues behind a store update, and with controlled nodes it did not
  run here. This app works out the frame itself with `getViewportForBounds`.
- Agents can't log in to the dashboard, so `ui/dev` stands in for the host for screenshots.
  It proves layout and logic, not the host's own components.

## Reading git safely

- `git merge-tree --write-tree` needs git 2.38 or later. Below that, a merge reads as unknown.
- It writes objects into the repo. Setting `GIT_OBJECT_DIRECTORY` to a temporary folder, with
  the repo's own objects as `GIT_ALTERNATE_OBJECT_DIRECTORIES`, keeps the repo untouched.
- `git log -- path` drops side branches that left a file as it was. Compare with
  `--full-history`, or a real commit goes missing.
- `git log --follow` treats a copy as the same file, so it counts another file's history.

## Reading Postgres dependencies

- A policy depends on every column its expressions name, including columns of other tables
  read in a subquery. So a policy on one table can stop a column on another being dropped.
- Names need reading in scope. In `SELECT u.id FROM users u`, `id` is not this table's `id`.
- A trigger's `UPDATE OF col` and `WHEN` clause tie it to those columns too.
- A type change rebuilds checks. `jsonb_typeof(col)` stops compiling if `col` becomes text.
- Migrations can seed rows, so an empty replay is not always empty.
- Functions and policies on tables outside the model can block a change, and the model does not
  read those. That is why the rules are called a floor.

## Updating an installed app

Library, then the app's Details, then Sync reloads its files from the source folder. The
backend restarts and upgrades models. A new tool reaches new sessions only.

## Reaching the backend

- The page reaches the backend through `useAppApi` at `/apps/system-map/api/...`, with that
  path listed in `permissions.api`.
- The backend runs in the gateway's sandbox wrapper. It can still read repos and run git.

## More than one project

- An agent tool runs in its session's folder. With no `repo`, the tools use the model for that
  folder, and a worktree counts as its main repo.
- The app proxy strips the session key, and no documented API names a chat's project. So the
  side panel can't follow its chat. It names its project and offers the same menu.
- `/api/recent-projects` isn't in the app docs. Add project uses it to suggest a default folder
  when the host allows it, and a refusal just means no suggestion.
- Removing a project deletes its app data for good. It never touches the repo.
- A chat a page opens through `useAppApi` counts as the person's, with origin `user`, so it shows
  in their session list. No host option hides it. So the Design chat opens on its first message.
  `ChatEmbed` needs a chat to exist, so a plain box stands in until then.

## Picking a folder

- A web page can't get a folder's path. `showDirectoryPicker` gives a name and a handle, so the
  backend opens the computer's own window on the machine it runs on.
- The window can stay open for minutes. So the page starts it and polls, which keeps it clear of
  any proxy time limit. The server runs one thread per request, and writes take turns: a build
  holds up other POSTs, but never a read.
- On WSL, `powershell.exe` runs through Windows interop, even from the sandbox wrapper. Only the
  newer folder window reaches `\\wsl.localhost`. `wslpath` converts the path each way, and
  killing the process closes the window. A window from a background process can't take focus,
  so a hidden topmost owner keeps it above the browser.
- `/api/browse-dirs` needs the owner's dashboard session, so an app's token can't use it. The
  backend's own `/browse` route lists folders for the page instead.
- Set `SYSTEM_MAP_NO_WINDOW=1` to turn the window off, as the tests do. The page's list takes over.

## Reading a project

- SQLite runs in memory through Python's own `sqlite3`. Only schema statements run, attaching a
  file is refused, and a time limit stops a statement that never ends.
- A SQLite project is told apart by a driver it ships with, `node:sqlite`, `bun:sqlite`,
  `drizzle-orm/sqlite-core`, a Prisma schema, or a database file. A driver that is only a dev
  dependency proves nothing, and `supabase/migrations` always means Postgres.
- Next.js routes are held to `next build`, and SQL in strings is held to the TypeScript compiler.

## Host components

Use only names listed in the host's vendor stubs, `kirocrew-ui.mjs` and `kirocrew-app-sdk.mjs`.
Naming any other export fails the whole app at load. `IconButton` is in the app kit's source,
but not in the stub. `tests/test_contract.py` checks every built bundle against the stubs and the
host page's import map, using the Kiro Crew that the `kirocrew` launcher runs (or
`KIROCREW_PYTHON`). It also runs the host's own manifest parser. Both skip when no Kiro Crew is
installed.

The host wraps every page in `<main id="main-content" tabindex="-1">`, and `ui/dev` does too. A
click on anything that can't take focus moves focus to that `main`. So a popup that closes when
focus leaves must be focusable itself, or it closes before the click lands.

## App icon

- `assets/icon.svg` is the source. `assets/icon.png` is that file drawn at 512x512, and it is
  what `iconPath` points at.
- The sidebar draws the image at 16px with an 8px radius, so it crops to a circle. Judge an
  icon at that size, in light and dark.
- A `ui.pages[].icon` name only works for built-in apps. `iconPathDark` gives the dark theme
  its own image.

## Store art

- `assets/hero-*.svg` are the sources. Each PNG beside it is that file drawn at its exact store
  size: 1200x675 (16:9) for `heroImage` and `heroImageDark`, 1200x288 (25:6) for the two
  `heroImageDetail` fields. Any Playwright install draws one:
  `<node_modules>/.bin/playwright screenshot --viewport-size "1200, 675" file://$PWD/assets/hero-light.svg assets/hero-light.png`.
- The store needs raster art from a third-party app, and a raster can't follow the theme, so each
  image has a light and a dark copy. Commit them as plain files, not Git LFS.
- Chromium draws `system-ui` wider than it looks in a browser preview. Look at each PNG for text
  near an edge.
- The screenshots come from `ui/dev` at 1280x800, light and dark, over a made-up project. No real
  project may appear in them. Leave out the Worktrees tab: it prints each worktree's full folder
  path, which names the machine's user. The Map with the Agents layer is too small to read at
  that size.

## App Store

- Kiro Crew accepts no new built-in apps. An app lives in its own public GitHub repo.
- A listing starts with an App Store listing request issue on the Kiro Crew repo. A
  maintainer writes the catalog entry.
- `ui/dist` must be committed. The store also needs a 512x512 icon, a hero image and a
  screenshot.
