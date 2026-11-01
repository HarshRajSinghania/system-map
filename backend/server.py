"""System Map's HTTP backend: serves the model to the dashboard pages.

Stdlib only. The gateway starts it, binds it to loopback and proxies it at
`/apps/system-map/api/...`. Everything here reads the model, except `POST build`.
"""
from __future__ import annotations

import json
import os
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core import store  # noqa: E402
from core.sources import git  # noqa: E402

PORT = int(os.environ.get("PORT", 9100))


def worktrees(repo_root: Path) -> list[dict]:
    """Each worktree of a repo, with how many files it has uncommitted."""
    listing = git(repo_root, "worktree", "list", "--porcelain") or ""
    found: list[dict] = []
    for block in listing.split("\n\n"):
        fields = dict(line.split(" ", 1) for line in block.splitlines() if " " in line)
        if "worktree" not in fields:
            continue
        path = Path(fields["worktree"])
        changed = git(path, "status", "--porcelain") or ""
        found.append(
            {
                "path": str(path),
                "branch": fields.get("branch", "").replace("refs/heads/", ""),
                "readable": git(path, "rev-parse", "HEAD") is not None,
                "uncommitted_files": len([line for line in changed.splitlines() if line.strip()]),
            }
        )
    return found


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)
        path, query = url.path, parse_qs(url.query)
        repo = (query.get("repo") or [None])[0]
        try:
            if path == "/health":
                self._json(200, {"status": "ok"})
            elif path.endswith("/repos"):
                self._json(200, {"repos": store.repos(), "data_root": str(store.data_root())})
            elif path.endswith("/overview"):
                target = store.resolve_repo(repo)
                keep = ("repo", "repo_key", "ref", "commit", "version", "built_at", "counts", "stats")
                manifest = store.read_manifest(target)
                self._json(
                    200,
                    {
                        "manifest": {k: manifest[k] for k in keep},
                        "freshness": store.freshness(target),
                        "tables": store.table_index(target),
                    },
                )
            elif path.endswith("/graph"):
                self._json(200, store.graph(store.resolve_repo(repo)))
            elif path.endswith("/findings"):
                self._json(200, {"findings": store.load_findings(store.resolve_repo(repo))})
            elif path.endswith("/node"):
                self._json(200, store.load_node(store.resolve_repo(repo), query["id"][0]))
            elif path.endswith("/neighbors"):
                self._json(200, store.neighbors(store.resolve_repo(repo), query["id"][0]))
            elif path.endswith("/worktrees"):
                manifest = store.read_manifest(store.resolve_repo(repo))
                self._json(200, {"worktrees": worktrees(Path(manifest["repo"]))})
            else:
                self._json(404, {"error": f"not found: {path}", "seen_path": self.path})
        except KeyError as error:
            self._json(404, {"error": str(error).strip("'\"")})

    def do_POST(self):
        length = int(self.headers.get("Content-Length") or 0)
        try:
            body = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self._json(400, {"error": "bad JSON"})
            return
        if not urlparse(self.path).path.endswith("/build"):
            self._json(404, {"error": "not found"})
            return
        try:
            repo_path = body.get("repo_path")
            if not repo_path:
                repo_path = store.read_manifest(store.resolve_repo(body.get("repo")))["repo"]
            manifest = store.build(Path(str(repo_path)).expanduser())
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
