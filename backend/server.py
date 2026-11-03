"""System Map's HTTP backend: serves the model to the dashboard pages.

Stdlib only. The gateway starts it, binds it to loopback and proxies it at
`/apps/system-map/api/...`. It reads the model and lists folder names. Every POST writes only
to the app's own data, except one that opens the computer's folder window. No route writes to
a repo.
"""
from __future__ import annotations

import json
import os
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core import agents, explore, folder_window, folders, store  # noqa: E402

PORT = int(os.environ.get("PORT", 9100))
#: The page and the side panel both poll, so one answer serves both for this long.
WORKTREE_TTL_SECONDS = 5
_worktree_cache: dict[str, tuple[float, dict]] = {}
_worktree_lock = threading.Lock()


def worktree_state(target: Path) -> dict:
    """What each worktree is changing. It runs many git commands, so a few seconds of reuse helps."""
    key = str(target)
    with _worktree_lock:
        found = _worktree_cache.get(key)
        if found and time.monotonic() - found[0] < WORKTREE_TTL_SECONDS:
            return found[1]
        state = store.worktree_state(target)
        _worktree_cache[key] = (time.monotonic(), state)
        return state


def agent_state(target: Path) -> dict:
    """The agents and their links, the settings that found them, and where to look when there are none."""
    joined = store.load_system(target)
    return {
        "agents": agents.rows(joined),
        "settings": store.load_agent_settings(target),
        "defaults": agents.DEFAULTS,
        "home_region": joined.get("home_region"),
        "suggestions": agents.suggestions(joined["nodes"], joined["edges"]),
    }


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)
        path, query = url.path, parse_qs(url.query)
        repo = (query.get("repo") or [None])[0]
        try:
            if path == "/health":
                self._json(200, {"status": "ok"})
            elif path.endswith("/repos"):
                self._json(200, {"repos": store.project_rows(), "data_root": str(store.data_root())})
            elif path.endswith("/workspaces"):
                folder = (query.get("folder") or [None])[0]
                self._json(200, folders.workspaces(Path(folder)) if folder else folders.default_workspaces())
            elif path.endswith("/folder-window"):
                self._json(200, folder_window.read())
            elif path.endswith("/browse"):
                self._json(200, folders.browse(Path((query.get("path") or ["~"])[0])))
            elif path.endswith("/overview"):
                target = store.resolve_repo(repo)
                keep = ("repo", "repo_key", "ref", "commit", "engine", "read", "version", "built_at", "counts", "stats", "code_root")
                manifest = store.read_manifest(target)
                self._json(
                    200,
                    {
                        "manifest": {k: manifest[k] for k in keep if k in manifest},
                        "freshness": store.freshness(target),
                        "tables": store.table_index(target),
                    },
                )
            elif path.endswith("/graph"):
                self._json(200, store.graph(store.resolve_repo(repo)))
            elif path.endswith("/system"):
                self._json(200, store.load_system(store.resolve_repo(repo)))
            elif path.endswith("/plan"):
                self._json(200, {"plans": store.plan_items(store.resolve_repo(repo))})
            elif path.endswith("/findings"):
                self._json(200, {"findings": store.load_findings(store.resolve_repo(repo))})
            elif path.endswith("/agents"):
                self._json(200, agent_state(store.resolve_repo(repo)))
            elif path.endswith("/node"):
                self._json(200, store.load_node(store.resolve_repo(repo), query["id"][0]))
            elif path.endswith("/neighbors"):
                self._json(200, store.neighbors(store.resolve_repo(repo), query["id"][0]))
            elif path.endswith("/worktrees"):
                self._json(200, worktree_state(store.resolve_repo(repo)))
            elif path.endswith("/risk"):
                self._json(200, store.load_risk(store.resolve_repo(repo)))
            elif path.endswith("/explore"):
                self._json(200, explore.summary(store.resolve_repo(repo)))
            elif path.endswith("/proposal"):
                self._json(200, explore.read_proposal(store.resolve_repo(repo), query["id"][0]))
            else:
                self._json(404, {"error": f"not found: {path}", "seen_path": self.path})
        except KeyError as error:
            self._json(404, {"error": str(error).strip("'\"")})
        except (ValueError, OSError) as error:
            self._json(400, {"error": str(error)})

    def do_POST(self):
        length = int(self.headers.get("Content-Length") or 0)
        try:
            body = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self._json(400, {"error": "bad JSON"})
            return
        route = urlparse(self.path).path
        if route.endswith("/folder-window"):
            start = body.get("start")
            self._json(200, folder_window.open_window(start if isinstance(start, str) else None))
            return
        if route.endswith("/folder-window-close"):
            self._json(200, folder_window.close())
            return
        if route.endswith("/default-folder"):
            try:
                self._json(200, {"default_folder": folders.set_default_folder(Path(str(body.get("folder", ""))))})
            except (ValueError, OSError) as error:
                self._json(400, {"error": str(error)})
            return
        if route.endswith("/repo-remove"):
            try:
                self._json(200, store.remove_project(str(body.get("repo", ""))))
            except KeyError as error:
                self._json(404, {"error": str(error).strip("'\"")})
            except OSError as error:
                self._json(400, {"error": str(error)})
            return
        if route.endswith("/plan-status"):
            try:
                target = store.resolve_repo(body.get("repo"))
                self._json(200, store.set_plan_status(target, str(body.get("id", "")), body.get("status")))
            except KeyError as error:
                self._json(404, {"error": str(error).strip("'\"")})
            except ValueError as error:
                self._json(400, {"error": str(error)})
            return
        if route.endswith(("/agents/settings", "/regions")):
            try:
                target = store.resolve_repo(body.get("repo"))
                if route.endswith("/regions"):
                    region = body.get("region")
                    self._json(200, store.set_region(target, str(body.get("id", "")), None if region is None else str(region)))
                else:
                    settings = body.get("settings")
                    if not isinstance(settings, dict):
                        raise ValueError("settings must be an object")
                    self._json(200, store.set_agent_settings(target, settings))
            except KeyError as error:
                self._json(404, {"error": str(error).strip("'\"")})
            except (ValueError, OSError) as error:
                self._json(400, {"error": str(error)})
            return
        if route.endswith(("/coverage", "/proposal-status", "/intent-delete")):
            try:
                target = store.resolve_repo(body.get("repo"))
                if route.endswith("/coverage"):
                    self._json(200, store.set_coverage(target, body.get("report"), body.get("commit")))
                elif route.endswith("/proposal-status"):
                    self._json(200, explore.set_status(target, str(body.get("id", "")), str(body.get("status", ""))))
                else:
                    self._json(200, explore.delete_item(target, str(body.get("kind", "")), str(body.get("id", ""))))
            except KeyError as error:
                self._json(404, {"error": str(error).strip("'\"")})
            except (ValueError, OSError) as error:
                self._json(400, {"error": str(error)})
            return
        if not route.endswith("/build"):
            self._json(404, {"error": "not found"})
            return
        try:
            repo_path = body.get("repo_path")
            if repo_path:
                path = store.check_folder(Path(str(repo_path)))
            else:
                path = Path(store.read_manifest(store.resolve_repo(body.get("repo")))["repo"])
            manifest = store.build(path.expanduser())
        except (KeyError, ValueError, OSError) as error:
            self._json(400, {"error": str(error).strip("'\"")})
            return
        keys = ("repo_key", "ref", "commit", "version", "counts", "unchanged")
        self._json(200, {k: manifest[k] for k in keys if k in manifest})

    def _json(self, code: int, data: object) -> None:
        payload = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *args):
        pass


class Server(HTTPServer):
    """Let a second copy fail on bind, so the gateway can see a port clash."""

    allow_reuse_address = not sys.platform.startswith("win")


if __name__ == "__main__":
    threading.Thread(target=store.refresh_all, daemon=True).start()
    Server(("127.0.0.1", PORT), Handler).serve_forever()
