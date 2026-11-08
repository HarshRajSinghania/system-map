---
title: Agents from SDKs (G2), phase 1
estimate: 340m
status: approved
---
# Agents from SDKs

**Problem.** A project built on an agent SDK shows no agents until someone writes settings, though the SDK's own
code already names each agent, its model and its hand-offs. Find my agents can draft settings, but the settings
only describe home-made agent lists, not an SDK's `new Agent({...})`.

**Assumptions.**
- Phase 1 reads three TypeScript SDKs whose agents are object literals: OpenAI Agents (`@openai/agents`), Mastra
  (`@mastra/core`) and the Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`). LangGraph builds agents as graph
  nodes, so it gets its own spec.
- A reader runs only when the root `package.json` lists the SDK. It needs no settings, and listed or marked agents
  still work beside it. Two agents with one name are one, and the listed one wins.
- A reader trusts only what the code states: a literal or constant `name`, and agents it can follow by import.
  It never guesses.
- Python SDK code is not read. System Map reads TypeScript and JavaScript only.

## Acceptance criteria
Core, on one small fixture per SDK:
1. OpenAI Agents: each `new Agent({ name })` or `Agent.create({ name })`, with `Agent` imported from the SDK, is an
   agent. Each agent in its `handoffs`, plain or as `handoff(x)`, is a hand-off. `run(agent, …)` in code no agent
   owns starts the agent.
2. Mastra: each `new Agent({ name })` from `@mastra/core` is an agent. `agent.generate(…)` or `agent.stream(…)`
   in code no agent owns starts it.
3. Claude Agent SDK: each key of `options.agents` in a `query({ … })` call is an agent. The module that makes the
   call starts each one.
4. Models: a `model` field links to its provider's service when the project has one: `openai(…)` or an `openai/`
   prefix to OpenAI, `anthropic(…)`, an `anthropic/` prefix or a Claude Agent SDK model to Anthropic. With no
   `model`, the SDK's own provider is used: OpenAI for OpenAI Agents, Anthropic for the Claude Agent SDK.
5. An agent whose `name` is a template, a variable, or a call adds nothing. Nor does an `Agent` that isn't
   imported from the SDK.
6. Each agent and link cites its `path:line`. With no SDK in `package.json`, every model is as it is today.

Proof, held to each SDK's own types:
7. `scripts/sdk_truth.mjs` uses the TypeScript compiler, with the SDK installed, to list every expression whose
   type is the SDK's agent, with its `name`. On each SDK's official examples, the reader's agents match it with
   zero differences, and every skip is named.

UI, checked in `ui/dev` in light and dark:
8. An SDK agent shows in the Agents tab and on the Agents layer like any other. Its detail says
   "From @openai/agents" (or its SDK), with the line.

**Out of scope.**
- LangGraph, and Python SDKs.
- Asks-you from an SDK's own approval hooks, and agent tools as a list.
- A setting to turn a reader off.

## Design
- New `core/sdk_agents.py`: one reader per SDK, sharing helpers from `core/agents.py` (`_Files`, `_props`,
  `_call_sites`, `const`). Each returns agents with `source: "sdk"` and `sdk: "<package>"`, plus edges.
- `core/agents.py` `find`: runs the readers whose package is listed, then merges by name. `settings_of` no longer
  returns None when an SDK is listed.
- `core/extractors/typescript.py`: the three SDK packages map to their provider's service.
- `scripts/sdk_truth.mjs`, after `scripts/ts_truth.mjs`.
- UI: `model.ts` (`source: 'sdk'`, `sdk`), the detail line in `Agents.tsx`.
- Data: two optional fields on agent nodes. `SCHEMA_VERSION` stays 6. One-way door: no.
- Risks:
  - A project that only imports an SDK's types gets no agents, since an agent needs a `new Agent` or `query` call.
  - SDK APIs move. Task 0 reads each SDK's current type files first, and the sweep pins the versions it ran.

## Needs
- package: `@openai/agents`, `@mastra/core`, `@anthropic-ai/claude-agent-sdk` and `typescript`, installed in a
  scratch folder only, for criterion 7. Nothing is added to the repo's own `package.json`.

## Tasks
| # | Task | Owns files | Est. |
|---|---|---|---|
| 0 | Read each SDK's current type files, and fix the field names above | none | 20m |
| 1 | Shared reader, merge, and OpenAI Agents | `core/sdk_agents.py`, `core/agents.py`, `core/extractors/typescript.py`, `tests/test_sdk_agents.py` | 90m |
| 2 | Mastra and Claude Agent SDK (after 1) | `core/sdk_agents.py`, `tests/test_sdk_agents.py` | 60m |
| 3 | Truth script and sweep (after 2) | `scripts/sdk_truth.mjs` | 75m |
| 4 | UI detail line | `ui/src/model.ts`, `ui/src/Agents.tsx`, `ui/src/agentRows.ts`, `ui/test/agentRows.test.ts` | 25m |
| 5 | Skill, docs and build | `skills/system-map/SKILL.md`, `README.md`, `CHANGELOG.md`, `docs/backlog.md`, `ui/dist` | 20m |

**Estimate:** 340m. The six tasks add up to 290m, plus 50m for review and fixes.
