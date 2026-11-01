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
- `SegmentedControl` is listed in the SDK docs. This app uses `Btn` with `primary` instead.
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
- `/api/recent-projects` isn't in the app docs. It fills Add project when the host allows it,
  and a refusal just leaves the path field.
- Removing a project deletes its app data for good. It never touches the repo.

## Host components

Use only names listed in the host's vendor stubs, `kirocrew-ui.mjs` and `kirocrew-app-sdk.mjs`.
Naming any other export fails the whole app at load. `IconButton` is in the app kit's source,
but not in the stub.

## App icon

- `assets/icon.svg` is the source. `assets/icon.png` is that file drawn at 512x512, and it is
  what `iconPath` points at.
- The sidebar draws the image at 16px with an 8px radius, so it crops to a circle. Judge an
  icon at that size, in light and dark.
- A `ui.pages[].icon` name only works for built-in apps. `iconPathDark` gives the dark theme
  its own image.

## App Store

- Kiro Crew accepts no new built-in apps. An app lives in its own public GitHub repo.
- A listing starts with an App Store listing request issue on the Kiro Crew repo. A
  maintainer writes the catalog entry.
- `ui/dist` must be committed. The store also needs a 512x512 icon, a hero image and a
  screenshot.
