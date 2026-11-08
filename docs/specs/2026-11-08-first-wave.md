---
title: First wave - CI, dist check, host tests, unread languages, backend errors, unreadable saved files
estimate: 285m
status: done
---
# First wave: CI, dist check, host tests, three gaps

**Problem.** Nothing runs the checks except a person, so a stale `ui/dist` or a Kiro Crew release that changes
the proxy contract reaches users first. The host-contract tests skip quietly when no Kiro Crew is installed.
Three user-facing gaps from the 2026-11-08 review ride along:
- A Python or Java repo maps as nearly empty, with no word about the code it skipped.
- A malformed coverage report drops the connection.
- One broken saved file breaks whole views.

**Assumptions.**
- CI is GitHub Actions on `ubuntu-24.04`, which ships Postgres 16. Kiro Crew is installed from its release
  wheel (`kirocrew-<v>-py3-none-any.whl`). The wheel holds `apps/proxy_auth.py`, `apps/manifest.py` and
  `static/dist` with the vendor stubs (checked on 0.12.0). Kiro Crew `main` has no wheel, so it is not tested.
- "Languages it doesn't read" means a fixed list of file endings. System Map still reads only TypeScript and
  JavaScript. This wave only names what it skipped.

## Acceptance criteria
CI and the dist check:
1. Every PR into `main`, push to `main`, and a daily schedule run two jobs. **Python:** all tests through
   `python3 tests/strict.py`. **UI:** `npm ci`, `npm test`, `npm run typecheck`, `npm run build`. Any failing
   step fails the check.
2. `tests/strict.py` exits non-zero if any test was skipped, and prints each skipped test and its reason.
   A unit test feeds it a suite with one skip and checks the exit code and the output.
3. After the UI build, CI fails if `git status --porcelain ui/dist` prints anything, and shows those files.
   The PR carries a red run from a throwaway commit that changes `ui/src` without rebuilding.
4. The checkout fetches tags, so the version and tag tests run rather than skip.

Host tests:
5. The Python job runs once per host: the floor (`minKiroCrewVersion` in `app.json`, today 0.12.0) and the
   latest Kiro Crew release. Each is installed from its wheel into a venv named by `KIROCREW_PYTHON`. If the two
   are the same version, it runs once.
6. Host signs, System Map checks. A request signed by the host's own `sign_proxy_request_v2` and
   `sign_proxy_principal_claim` reaches the real backend:
   - an `owner-session` claim on a person route gets 200;
   - an `agent-tool` claim gets 403;
   - the same request sent again is refused;
   - a claim from 61 s ago is refused.
7. System Map signs, host checks. Headers made by `tests/helpers.py` pass the host's own
   `verify_proxy_request`, `verify_proxy_request_v2` and `verify_proxy_principal_claim`. So the test signer
   can't drift from the host's.

Gap 1, languages it doesn't read:
8. A repo with TypeScript plus `core/a.py`, `core/b.py` and `scripts/c.py`:
   - `read.unread` has `{"what": "3 Python files it doesn't read", "where": "core/"}`;
   - the overview line ends `Not read: 3 Python files it doesn't read (core/).`
9. One `Main.java` at the root gives `{"what": "1 Java file it doesn't read", "where": ""}`.
10. The item also appears when the repo has tables. A TypeScript-only repo's `read.unread` is unchanged.

Gap 6, backend errors:
11. POST `/coverage` with an lcov line `DA:5`, or a short `BRDA:` line, gets
    400 `{"error": "Line 2 of the coverage report isn't valid lcov: DA:5"}`. The reply arrives, so curl does not
    exit 52.
12. Any other exception in a GET or POST route gets
    500 `{"error": "System Map hit a bug (RuntimeError). The details are in the app's log."}`.
    The traceback goes to stderr.

Gap 7, a saved file it can't read:
13. If `intent/regions.json` holds broken JSON, `/system` and `/findings` still return 200, with no regions:
    - the file moves to `unreadable/intent/regions.json.<UTC stamp>`;
    - its bytes are unchanged.
14. The same holds for every saved file: plan status, agent settings, regions, coverage, notes, proposals, use
    cases, views and the agent draft. One bad file in a folder doesn't hide the others.
15. `/overview` and the MCP `overview` list each set-aside file. The status chip shows
    `Couldn't read intent/regions.json, so it was set aside as unreadable/intent/regions.json.<stamp>.`
16. Two requests that both meet the same bad file both succeed, and one copy is kept.

**Out of scope.**
- Old-version data fixtures (C3).
- A real-gateway smoke test (C4) and browser E2E (C5).
- React component tests (C7).
- Kiro Crew `main`; macOS and Windows runners.
- Reading any new language.
- The 0.12.2 release.

## Design
- **Files:**
  - `.github/workflows/ci.yml` and `.nvmrc` (Node 26, as used here) are new.
  - `tests/strict.py`, `tests/test_strict.py` and `tests/test_host_signing.py` are new.
  - Changed: `core/read.py`, `core/coverage.py`, `backend/server.py`, `core/store.py`,
    `core/explore.py`, `core/agent_drafts.py`, `mcp_server/server.py`, `ui/src/StatusChip.tsx`,
    `ui/src/projects.ts`, `ui/dist/*`, the matching tests, README "Checks" and CHANGELOG.
- **Gap 1:** a table of endings goes in `core/read.py`: `.py` Python, `.java` Java, `.kt` Kotlin, `.go` Go,
  `.rb` Ruby, `.rs` Rust, `.cs` C#, `.php` PHP, `.swift` Swift, `.scala` Scala, `.ex`/`.exs` Elixir.
  - `_unread` counts tracked files per language, and the items come last, after the other explanations
    (Prisma, Drizzle config, nested Next.js, other databases), whatever the table count.
  - Files under a folder named `vendor`, `node_modules` or `site-packages`, at any depth, are not counted,
    for git repos and plain folders alike.
  - Order: most files first, then by name.
  - `where` is the top folder holding the most of them, with ties by name; `""` for the repo root.
- **Gap 6:** `_lcov` raises `ValueError` with the line number. `do_GET` and `do_POST` add a last `except
  Exception` that logs the traceback and returns the 500 above.
- **Gap 7:** one helper, `store.read_saved(target, path, default, keys=(), each_object=False)`, replaces
  each saved-file `json.loads`:
  - A file that isn't valid JSON (bad JSON, bad UTF-8, nested too deep) is set aside. So is one that is
    not an object, lacks a key in `keys`, or, with `each_object`, has a value that is not an object.
    It moves to `<project>/unreadable/<relative path>.<UTC stamp>` and the reader gets `default`.
  - The copy's name is reserved first (`O_CREAT|O_EXCL`, then `-2`, `-3`), so a kept copy is never
    overwritten. The bytes are read again just before the move, and a file fixed meanwhile is used.
  - A missing file or a directory gives `default`. Any other read or move error gives `default`, leaves
    the file in place and logs one line.
  - `store.set_aside(target)` reads every saved file first, then lists that folder. So the list is the
    same whichever view asked first.
  - Built model files (`versions/`) are out of this; a rebuild remakes them.
- **CI:**
  - Two Python matrix entries: `floor` and `latest`. The latest tag comes from
    `gh release view --repo kirodotdev/KiroCrew`.
  - One last job, `checks`, needs every other job and fails unless they all pass. It is the one name
    branch protection requires, so a breaking Kiro Crew release blocks PRs until it is fixed.
  - About 5 minutes per job.
- **Data:** no model schema change. A file it can't read is moved and kept, never deleted.
  One-way door: no.
- **Risks:**
  - CI may expose tests that lean on this machine (git identity, Postgres path). The CI task fixes those in
    the tests, not by skipping.
  - Moving a user's file is a write from a GET. It runs only on a file that is already broken.

**Decisions (my default first):**
- Gap 7: **set the file aside and carry on**, or stop with an error that names the file.
- The latest-release job **blocks PRs**, or only warns.

## Needs
- gate: `.github/workflows/ci.yml` (new)
- package: CI only. The Kiro Crew wheels from GitHub releases, `npm ci`, and Postgres from the runner image.
  Nothing is installed on this machine.
- setting: branch protection on `main` that requires only the `checks` job. It fails unless `python` (every
  version in its matrix) and `ui` succeeded, so the matrix can have one entry or two without a required name
  going missing. You set it, or I do it with `gh api` once you say so.

## Tasks
Sonnet sub-agents. Tasks 1-4 run at the same time. Task 5 starts after task 4, since both change
`backend/server.py`.

| # | Task | Owns files | Est. |
|---|---|---|---|
| 1 | CI workflow, strict runner, dist check, tags | `.github/workflows/ci.yml`, `.nvmrc`, `tests/strict.py`, `tests/test_strict.py`, README "Checks" | 60m |
| 2 | Host round-trip tests (6, 7) | `tests/test_host_signing.py` | 45m |
| 3 | Languages it doesn't read (8-10) | `core/read.py`, `tests/test_read.py` | 30m |
| 4 | Coverage error and the 500 reply (11, 12) | `core/coverage.py`, `backend/server.py`, `tests/test_backend.py` | 30m |
| 5 | Set aside unreadable saved files (13-16) | `core/store.py`, `core/explore.py`, `core/agent_drafts.py`, `backend/server.py`, `mcp_server/server.py`, `ui/src/StatusChip.tsx`, `ui/src/projects.ts`, `ui/test/projects.test.ts`, `ui/dist/*`, `tests/test_core.py` | 90m |
| 6 | Integrate, CHANGELOG, full local checks, review, PR | `CHANGELOG.md` | 30m |

**Estimate:** 285m, because the five task estimates add to 255m (four of them run side by side), plus 30m to
integrate and review. The red-then-green CI proof needs the branch pushed, and I'll ask before that push.
