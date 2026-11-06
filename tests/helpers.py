import hashlib
import hmac
import subprocess
import time
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request

#: The secret a test backend gets, as the gateway would hand it over.
PROXY_SECRET = "test-proxy-secret"


def proxy_signature(method: str, target: str, body: bytes, secret: str = PROXY_SECRET, stamp: int | None = None) -> str:
    """The gateway's v1 `X-KiroCrew-Proxy` value, from the App Kit's rule:
    `<ts>:<hmac-sha256(secret, "<ts>:<method>:<target>:<sha256(body)>")>`."""
    stamp = int(time.time()) if stamp is None else stamp
    message = f"{stamp}:{method}:{target}:{hashlib.sha256(body).hexdigest()}"
    return f"{stamp}:{hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()}"


def proxy_v2(method: str, target: str, body: bytes, nonce: str, secret: str = PROXY_SECRET, stamp: int | None = None) -> str:
    """The gateway's `X-KiroCrew-Proxy-V2` value:
    `<ts>:<hmac-sha256(secret, "v2:<ts>:<nonce>:<method>:<target>:<sha256(body)>")>`."""
    stamp = int(time.time()) if stamp is None else stamp
    message = f"v2:{stamp}:{nonce}:{method}:{target}:{hashlib.sha256(body).hexdigest()}"
    return f"{stamp}:{hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()}"


def signed_request(url: str, data: bytes | None = None, method: str | None = None) -> Request:
    """A request to a test backend that carries the gateway's signature."""
    parts = urlsplit(url)
    target = parts.path + (f"?{parts.query}" if parts.query else "")
    method = method or ("GET" if data is None else "POST")
    header = proxy_signature(method, target, data or b"")
    return Request(url, data=data, method=method, headers={"X-KiroCrew-Proxy": header})


def git(repo: Path, *args: str) -> str:
    done = subprocess.run(
        ["git", "-C", str(repo), "-c", "user.name=t", "-c", "user.email=t@example.com", *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return done.stdout.strip()


def commit_all(repo: Path, message: str = "change") -> str:
    git(repo, "add", "-A")
    git(repo, "commit", "-q", "--allow-empty", "-m", message)
    return git(repo, "rev-parse", "HEAD")


def write_migration(repo: Path, name: str, sql: str) -> Path:
    path = repo / "supabase" / "migrations" / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(sql)
    return path
