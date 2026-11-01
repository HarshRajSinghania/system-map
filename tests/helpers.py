import subprocess
from pathlib import Path


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
