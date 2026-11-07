"""System Map's HTTP backend: serves the model to the dashboard pages.

Stdlib only. The gateway starts it, binds it to loopback and proxies it at
`/apps/system-map/api/...`. It reads the model and lists folder names. Every POST writes only
to the app's own data, except one that opens the computer's folder window. No route writes to
a repo.

Any local program can reach a loopback port, so every request except `/health` must carry the
gateway's signature, made with the app's secret (the App Kit's "Reverse Proxy Authentication").
"""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import re
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core import agents, explore, folder_window, folders, store  # noqa: E402

PORT = int(os.environ.get("PORT", 9100))
#: The page and the side panel both poll, so one answer serves both for this long.
WORKTREE_TTL_SECONDS = 5
_worktree_cache: dict[str, tuple[float, dict]] = {}
_worktree_lock = threading.Lock()
#: Every POST, and the rebuild on start, holds this. GETs never wait for it.
_writes = threading.Lock()
#: No route needs more than a few kilobytes.
MAX_BODY_BYTES = 1 << 20

#: The gateway hands the backend its per-app secret in this variable.
SECRET_ENV = "KIROCREW_PROXY_SECRET"
#: A signature is good for this many seconds either side of now.
MAX_SKEW_SECONDS = 60
#: The gateway's health probe calls the backend directly, with no signature.
OPEN_PATHS = frozenset({"/health"})
#: Nonces kept for the replay check. When full, new requests are refused rather than letting
#: an old nonce go while it could still be replayed.
NONCE_LIMIT = 4096
_STAMP = re.compile(r"[0-9]{1,12}")
_NONCE = re.compile(r"[0-9a-f]{32}")
_nonces: dict[str, int] = {}
_nonce_lock = threading.Lock()


def _mac(secret: str, message: str) -> bytes:
    return hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest().encode()


def _matches(expected: bytes, given: str) -> bool:
    # Bytes, not str: compare_digest raises on a str with a non-ASCII character.
    return hmac.compare_digest(expected, given.encode("utf-8", "surrogatepass"))


def _fresh(stamp: str, now: float) -> bool:
    return bool(_STAMP.fullmatch(stamp)) and abs(now - int(stamp)) <= MAX_SKEW_SECONDS


def _first_use(nonce: str, expires: int, now: float) -> bool:
    with _nonce_lock:
        for seen, until in list(_nonces.items()):
            if until < now:
                del _nonces[seen]
        if nonce in _nonces or len(_nonces) >= NONCE_LIMIT:
            return False
        _nonces[nonce] = expires
        return True


def signed(headers, method: str, target: str, body: bytes, secret: str, now: float | None = None) -> bool:
    """True when the gateway signed this exact request with the app's secret.

    Every gateway sends a v1 signature. Newer ones also send v2, bound to a one-time nonce. When
    any v2 header is there, v2 must pass and its nonce must be new, so a replay can't fall back to
    v1. `target` is the request-target as it came on the wire, query included.
    """
    if not secret:
        return False
    now = time.time() if now is None else now
    digest = hashlib.sha256(body).hexdigest()
    v2, nonce = headers.get("X-KiroCrew-Proxy-V2"), headers.get("X-KiroCrew-Proxy-Nonce")
    if v2 is not None or nonce is not None:
        stamp, _, mac = (v2 or "").partition(":")
        if not (nonce and _NONCE.fullmatch(nonce) and _fresh(stamp, now) and mac):
            return False
        if not _matches(_mac(secret, f"v2:{stamp}:{nonce}:{method}:{target}:{digest}"), mac):
            return False
        return _first_use(nonce, int(stamp) + MAX_SKEW_SECONDS, now)
    stamp, _, mac = (headers.get("X-KiroCrew-Proxy") or "").partition(":")
    return _fresh(stamp, now) and bool(mac) and _matches(_mac(secret, f"{stamp}:{method}:{target}:{digest}"), mac)


def unsigned_allowed() -> bool:
    """Only `ui/dev` runs unsigned, and only when asked. A backend the gateway starts never does.

    The gateway gives every app backend `KIROCREW_APP_NAME` and `KIROCREW_SPAWN_INSTANCE`, so
    either one turns the flag off. `KIROCREW_SPAWNED` can't decide it: every shell under Kiro Crew
    inherits it, an agent's included, and those must still be able to run `ui/dev`.
    """
    gateway = os.environ.get("KIROCREW_APP_NAME") or os.environ.get("KIROCREW_SPAWN_INSTANCE")
    return os.environ.get("SYSTEM_MAP_UNSIGNED") == "1" and not gateway


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
    def _body(self) -> bytes | None:
        """The request body, or None after a 400 or 413 for a length that is bad or too big."""
        given = self.headers.get("Content-Length") or "0"
        if not (given.isascii() and given.isdigit()):
            self._json(400, {"error": "Content-Length must be a whole number."})
            return None
        if int(given) > MAX_BODY_BYTES:
            self._json(413, {"error": f"The request is over {MAX_BODY_BYTES} bytes."})
            return None
        return self.rfile.read(int(given))

    def _allowed(self, body: bytes) -> bool:
        """Answer 401 and return False unless the gateway sent this request."""
        if urlparse(self.path).path in OPEN_PATHS or unsigned_allowed():
            return True
        if signed(self.headers, self.command, self.path, body, os.environ.get(SECRET_ENV, "")):
            return True
        self._json(401, {"error": "This request did not come through Kiro Crew."})
        return False

    def do_GET(self):
        body = self._body()
        if body is None or not self._allowed(body):
            return
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
        raw = self._body()
        if raw is None or not self._allowed(raw):
            return
        try:
            body = json.loads(raw or b"{}")
        except ValueError:  # bad JSON, or bytes that aren't UTF-8
            self._json(400, {"error": "bad JSON"})
            return
        if not isinstance(body, dict):
            self._json(400, {"error": "The body must be a JSON object."})
            return
        # Writes take turns, so two builds can't race. Reads go on meanwhile.
        with _writes:
            self._post(urlparse(self.path).path, body)

    def _post(self, route: str, body: dict) -> None:
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


class Server(ThreadingHTTPServer):
    """One thread per request, so a long build doesn't hold up reads.

    A second copy still fails on bind, so the gateway can see a port clash.
    """

    allow_reuse_address = not sys.platform.startswith("win")
    daemon_threads = True


def refresh_all() -> None:
    """Rebuild every model on start, taking the write turn like any build."""
    with _writes:
        store.refresh_all()


if __name__ == "__main__":
    threading.Thread(target=refresh_all, daemon=True).start()
    Server(("127.0.0.1", PORT), Handler).serve_forever()
