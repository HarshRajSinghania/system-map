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

## Updating an installed app

Library, then the app's Details, then Sync reloads its files from the source folder. The
backend restarts and upgrades models. A new tool reaches new sessions only.

## Reaching the backend

- The page reaches the backend through `useAppApi` at `/apps/system-map/api/...`, with that
  path listed in `permissions.api`.
- The backend runs in the gateway's sandbox wrapper. It can still read repos and run git.

## App Store

- Kiro Crew accepts no new built-in apps. An app lives in its own public GitHub repo.
- A listing starts with an App Store listing request issue on the Kiro Crew repo. A
  maintainer writes the catalog entry.
- `ui/dist` must be committed. The store also needs a 512x512 icon, a hero image and a
  screenshot.
