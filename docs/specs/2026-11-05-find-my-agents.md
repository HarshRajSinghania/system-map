---
title: Find my agents (the Design chat drafts the agent settings)
estimate: 270m
status: done
---
# Find my agents

**Problem.** System Map finds agents only after a person types the agent settings: the list file, the model-call
names, the asks-you names and the keys. Most people don't know these names offhand. A model can read the code and
work them out, but System Map's backend has no model.

**Assumptions.**
- The Design chat does the reading, as it does for what-ifs. The backend only checks, tries and keeps the draft.
- A draft is a suggestion, like a proposal. Only a person uses it, and no MCP tool can.
- A draft may suggest the home region, with evidence such as a line in the docs that says where data must stay.
  Each service's region stays a person's to set, as in slice 7. A draft never sets one.
- One draft per project. A new draft replaces the old one.

## Acceptance criteria
Core, tested on the slice 7 fixture repo with three agents:
1. `draft_agents` with `dry_run` checks the settings, runs the agent reader on the model's commit, and returns
   the agents it would find: id, status, starts, hands off to, models and asks you. It writes nothing, and the
   model's version stays the same.
2. Without `dry_run`, it saves one draft in `intent/agents-draft.json`: the settings, their evidence, a note, the
   commit and that result. `intent/agents.json` and the map don't change.
3. It refuses, with what to fix:
   - an unknown setting
   - a value the settings form would refuse, including a bad home region
   - a setting with no evidence
   - evidence that isn't a file at the model's commit
4. `GET /agents/draft` returns the draft, the settings that differ from the saved ones, and whether the code has
   moved since it was drafted.
5. `POST /agents/draft` with `use` saves the draft's settings, rebuilds, and deletes the draft. A draft with no
   home region keeps the saved one. With `drop` it only deletes the draft.
6. Using a draft from an older commit still runs the form's checks at today's commit. A list file that's gone is
   refused.
7. After drafting, using or dropping, `git status` in the repo shows nothing new.

UI, checked in `ui/dev` in light and dark:
8. The Agents tab has a **Find my agents** button, above the form when there are no agents, and beside **Agent
   settings** when there are. It sends one fixed message to the Design chat. With no chat it's disabled, and its
   tooltip says why.
9. With a draft, a card sits at the top of the tab:
   - the title **Drafted by the Design chat**, and its note
   - each setting with its value and evidence, with changed ones marked
   - "With these, System Map finds N agents:" and their names
   - the buttons **Use these**, **Edit first** and **Drop**
   - if the code has moved: "Drafted at abc1234. The code has changed since, so check it first."
10. **Edit first** opens the settings form filled with the draft. Saving it saves those settings and deletes the
    draft. **Cancel** keeps the draft.
11. The card shows up within 8 seconds of the chat saving a draft, with no reload.

Real project:
12. Take a real project whose 9 agents were set by hand, and clear its settings in a scratch data folder. Give a
    fresh agent only the skill's **Find my agents** steps and the MCP server. In each of 3 runs, its draft finds
    the same 9 agents, and suggests the home region the project's docs give.

**Out of scope.**
- Each service's region.
- Readers for agent SDKs (G2).
- A model in the backend.
- **Find my agents** in the side panel.

## Design
- New `core/agent_drafts.py`:
  - `try_settings` runs `system.build` on the model's commit with the draft, using the tables already in the
    model, then joins regions with the draft's home region and returns `agents.rows`. It writes no version.
  - `save`, `load`, `use` and `drop` work on `intent/agents-draft.json`.
  - The checks reuse `store._check_agent_settings`. The evidence check moves out of `store.add_note` into a shared
    `store.check_evidence`.
- MCP: a new `draft_agents` tool takes `settings`, `evidence` (setting to `path:line` list), `note` and `dry_run`.
  It isn't auto-approved, like `propose`. The `agents` tool's empty note names it.
- Backend: `GET /agents/draft`, and `POST /agents/draft` with `{action: use | drop}`.
- Skill: a **Find my agents** section with the steps:
  1. Start from the `agents` suggestions.
  2. Find the list, or the modules to mark.
  3. Find the model-call names, the asks-you names and the keys.
  4. Suggest a home region only if the repo says where data must stay, and cite that line.
  5. Try with `dry_run`, and fix what the result shows.
  6. Save with evidence, and tell the person to look at the Agents tab.
- UI: `agentRows.ts` holds the pure logic (changed settings, the card's rows, the fixed message), with tests. A new
  `AgentDraft.tsx` holds the card. `Agents.tsx` gets the button and Edit first. `App.tsx` polls the draft every 8
  seconds, as Explore does.
- Data: two new files in System Map's own data folder, outside the model, so `SCHEMA_VERSION` stays 6. One-way
  door: no.
- Risks:
  - The chat reads repo code, and text in it could steer the chat. A draft can only hold what the form can, it
    passes the same checks, and only a person can use it.
  - A draft that looks right but misses an agent. The card lists every agent found before you use it, and
    criterion 12 measures it on a real project.
  - A slow try on a big repo, since it scans the code once. The real-project run times it.

## Needs
- none

## Tasks
| # | Task | Owns files | Est. |
|---|---|---|---|
| 1 | Draft store and try | `core/agent_drafts.py`, `core/store.py`, `tests/test_agent_drafts.py` | 60m |
| 2 | MCP tool and routes (after 1) | `mcp_server/server.py`, `backend/server.py`, `tests/test_mcp.py`, `tests/test_backend.py` | 35m |
| 3 | Skill steps and real-project runs (after 2) | `skills/system-map/SKILL.md` | 40m |
| 4 | Draft card logic and card | `ui/src/agentRows.ts`, `ui/src/AgentDraft.tsx`, `ui/src/model.ts`, `ui/test/agentRows.test.ts` | 60m |
| 5 | Wire up the button and card (after 2, 4) | `ui/src/Agents.tsx`, `ui/src/App.tsx` | 30m |
| 6 | Docs, version, build | `README.md`, `docs/backlog.md`, `app.json`, `ui/dist` | 15m |

**Estimate:** 270m. The six tasks add up to 240m, plus 30m for review and fixes.

## As built
- A draft must name a list or modules. Using one with neither would clear the agents.
- Each draft has an id. Use these, Drop and Edit first send the id of the draft on screen, and a newer one is
  refused, so a person never uses a draft they didn't see. The chat can save one between the page's checks.
- `agent_drafts.summary` shapes the short rows for both a draft and the `agents` tool.
- Criterion 12 took two rounds. Round one, on the first skill text, found all 9 agents each time, but one run
  suggested `ca-central-1` as the home region, and every run sent a call with the wrong shape. The skill now
  says to write the place in its own words and shows the call, and the errors say how to wrap settings and
  evidence. Round two, 3 fresh runs, found all 9 agents with Canada and no failed call, and each matched the
  hand-set settings exactly.
- Every run found the same gap: an agent named as a plain argument, as in `startJob("setup", …)`, is
  no hand-off. No setting can fix it, so it is a limit in the backlog.
- Not done here: the screen, since the tool can't open the dashboard. Its check is in the backlog.
