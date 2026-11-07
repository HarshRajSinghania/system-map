---
title: Hand-off calls (an agent started by name as a plain argument)
estimate: 170m
status: done
---
# Hand-off calls

**Problem.** An agent started by a call that names it as a plain argument, as in `queueAgent("reader", mail.id)`,
shows nothing starting it. Only a property named in `hand_off_keys`, as in `{ agent: "reader" }`, counts, and no
setting can fix that. Every Find my agents run on a real project hit this, and two of its nine agents showed no start.

**Assumptions.**
- A new setting, `hand_off_calls`: names of functions whose first argument names the agent. It sits beside
  `hand_off_keys` and works the same way. Empty by default, so nothing changes until a person or a draft sets it.
- Only the first argument counts. A call that names the agent in a later argument is out of scope.
- As with keys, the argument must be a string, or a constant that holds one. System Map never guesses a variable.

## Acceptance criteria
Core, on the slice 7 fixture repo with `hand_off_calls: ["queueAgent"]`:
1. A call `queueAgent("reader", …)` in a file no agent owns adds a `starts` link from that file's module to
   `agent:reader`, with that `path:line` as evidence.
2. The same call inside an agent's own code adds a `hands_off_to` link from that agent.
3. The first argument may be a string, or a constant that holds one, here or imported. A template with `${}`, a
   variable, or a name that isn't an agent adds nothing.
4. A definition of `queueAgent`, a call in a comment or a string, and a call in a test file add nothing.
5. With no `hand_off_calls`, every link and the model's version are the same as today.
6. A name in `hand_off_calls` that isn't a name in code is refused, as for `model_calls`.

Tools:
7. `draft_agents` takes `hand_off_calls` with evidence, its dry run finds the new links, and the draft card shows
   it as **Hand-off calls**. Its description lists the setting.
8. The skill's Find my agents steps say to look for calls that start an agent by name, and to cite one.

UI, checked in `ui/dev` in light and dark:
9. The settings form has a **Hand-off calls** field after **Hand-off keys**, with help text and an example. It
   saves a list and leaves an empty field out.

Real project:
10. On the real project from Find my agents' criterion 12, in a scratch data folder, add its enqueue function to
    `hand_off_calls`. The two agents with no start now show what starts them, and the other links stay the same.
    One fresh Find my agents run suggests the setting with evidence.

**Out of scope.**
- An agent named in any argument but the first, or through a variable.
- Readers for agent SDKs (G2).
- Agents started from SQL, beyond today's `cron.schedule` jobs.

## Design
- `core/store.py`: `hand_off_calls` joins `AGENT_SETTINGS`, `AGENT_BUILD_KEYS` and the code-name check.
- `core/agents.py`:
  - `DEFAULTS` gets `hand_off_calls: []`.
  - `_calls` splits into `_call_sites`, which also returns where each call's `(` is. `_calls` keeps its result.
  - `_hand_offs` reads the first argument at each hand-off call site with `files.value`, as it does for keys.
  - The pass over files no agent owns also reads a file that names a hand-off call.
- `mcp_server/server.py`: the `draft_agents` description lists `hand_off_calls`.
- `skills/system-map/SKILL.md`: one step in Find my agents.
- UI: `model.ts` (the setting's type), `agentRows.ts` (form, label, order), `Agents.tsx` (the field).
- Data: one more setting in `intent/agents.json`. The model's shape and `SCHEMA_VERSION` stay the same. One-way
  door: no.
- Risks:
  - A common name, such as `start`, links anything called `start("x")` where `x` is an agent. The setting is
    opt-in, the card shows what a draft finds, and each link cites its line.
  - A slower build on a big repo, since more files are read in the last pass. The real-project run times it.

## Needs
- none

## Tasks
| # | Task | Owns files | Est. |
|---|---|---|---|
| 1 | Setting and reader | `core/agents.py`, `core/store.py`, `tests/test_agents.py` | 60m |
| 2 | Tool and skill (after 1) | `mcp_server/server.py`, `skills/system-map/SKILL.md`, `tests/test_mcp.py`, `tests/test_agent_drafts.py` | 20m |
| 3 | Form field | `ui/src/model.ts`, `ui/src/agentRows.ts`, `ui/src/Agents.tsx`, `ui/test/agentRows.test.ts` | 25m |
| 4 | Real-project run (after 1 to 3) | none in the repo | 25m |
| 5 | Docs and build | `README.md`, `CHANGELOG.md`, `docs/backlog.md`, `ui/dist` | 15m |

**Estimate:** 170m. The five tasks add up to 145m, plus 25m for review and fixes.

## As built
- Task 1 also added two cases to `tests/test_regions.py`, where the settings checks are tested.
- Criterion 10, on the real project: the two agents with no start now show one, two others gain starts from
  real calls, and every earlier link stays. A rebuild took about 3 seconds before and after.
- One fresh run of the skill suggested the setting with evidence, found all 9 agents and made no failed call.
  It also put SQL functions in `hand_off_calls`, which only reads code, and cited a definition as evidence.
  The skill now says both.
