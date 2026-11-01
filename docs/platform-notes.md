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

So after a first install the server is declared but not mounted. The docs for Claude
sessions say the array is read per spawn, so a new session is not enough on its own. The
source says gateway boot rebuilds the spec, so a restart should mount it. That is not yet
confirmed by a run.

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
