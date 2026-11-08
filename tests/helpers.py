import base64
import hashlib
import hmac
import json
import secrets
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


def principal_claim(
    kind: str,
    method: str,
    target: str,
    body: bytes,
    secret: str = PROXY_SECRET,
    issued_at: int | None = None,
    request_id: str | None = None,
    owner_id: str | None = None,
) -> str:
    """The gateway's `X-KiroCrew-Principal` value, from Kiro Crew's `apps/proxy_auth.py`.

    `<claim>.<mac>`: the claim is canonical JSON (sorted keys, no spaces) of
    `{version: 1, kind, ownerId, issuedAt, requestId}` in unpadded base64url. The mac is
    HMAC-SHA256 over these lines joined by newlines: `kirocrew-proxy-principal-v1`, issuedAt,
    method, target, sha256(body), claim. Only `owner-session` has an owner id.
    """
    issued_at = int(time.time()) if issued_at is None else issued_at
    if owner_id is None:
        owner_id = "owner-1" if kind == "owner-session" else ""
    claim = {
        "version": 1,
        "kind": kind,
        "ownerId": owner_id,
        "issuedAt": issued_at,
        "requestId": request_id or secrets.token_hex(16),
    }
    text = base64.urlsafe_b64encode(json.dumps(claim, sort_keys=True, separators=(",", ":")).encode()).decode().rstrip("=")
    message = "\n".join(("kirocrew-proxy-principal-v1", str(issued_at), method, target, hashlib.sha256(body).hexdigest(), text))
    return f"{text}.{hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()}"


def signed_request(url: str, data: bytes | None = None, method: str | None = None, principal: str | None = "owner-session") -> Request:
    """A request to a test backend that carries the gateway's signature.

    It also carries a principal claim of kind `principal`, a person in the dashboard unless a test
    says otherwise. `principal=None` sends no claim.
    """
    parts = urlsplit(url)
    target = parts.path + (f"?{parts.query}" if parts.query else "")
    method = method or ("GET" if data is None else "POST")
    headers = {"X-KiroCrew-Proxy": proxy_signature(method, target, data or b"")}
    if principal:
        headers["X-KiroCrew-Principal"] = principal_claim(principal, method, target, data or b"")
    return Request(url, data=data, method=method, headers=headers)


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
