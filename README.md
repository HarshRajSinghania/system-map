# System Map

A live map of your system, as a [Kiro Crew](https://github.com/kirodotdev/KiroCrew) app. Every view reads one model built from your repo. Agents read that model in small slices, so a design chat does not fill up with the whole system.

Status: spike. It covers Postgres migrations only. The model may change without notice.

## Layout

| Path | Job |
|---|---|
| `core/` | The model and extractors. Imports nothing from Kiro Crew. |
| `mcp_server/` | Tools that agents use. Stdlib only. |
| `backend/` | HTTP API for the dashboard pages. Stdlib only. |
| `ui/` | The app page and the chat side panel tab. |
| `skills/system-map/` | How agents should read and write the model. |

## Install from a local clone

The backend needs third-party apps turned on in **Settings → Security → Third-party apps**.

```bash
(cd ui && npm install && npm run build)
kirocrew app install "$PWD"
kirocrew app enable system-map
kirocrew restart
```

The restart gives agent sessions the tools. It stops any work running in your sessions.

## Build a model

```bash
python3 -m core build /path/to/repo
python3 -m core stats /path/to/repo
```

To write to the installed app's data folder, set `SYSTEM_MAP_DATA` to `<kiro crew home>/apps/system-map/data`.

## Checks

```bash
python3 -m unittest discover -s tests
(cd ui && npm run build)
```

## License

Apache-2.0
