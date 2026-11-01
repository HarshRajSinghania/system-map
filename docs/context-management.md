# Context management

A system model is too large to carry in a chat. This note records what was measured
and the rules that follow from it.

## Measured

Test repo: a production app with 33 tables, 324 columns and 283 KB of migrations.

| Thing | Chars |
|---|---|
| `overview.md` | 1,433 |
| Median table, as a tool returns it | 4,043 |
| Largest table, as a tool returns it | 10,330 |
| All 24 findings, as a tool returns them | 8,587 |
| Every table, as stored | 185,133 |
| The whole system map (67 modules and areas, 497 links), as stored | 178,246 |

The migrations cover the data model only. The same repo has 3.4 MB in `src` and
433 KB in `docs`, so later layers will be far larger than the numbers above.

### Slices against the whole model

One question, asked in two fresh Claude Code runs on the same model: which tables have a
foreign key to `clients`, and what is each delete rule?

| Approach | New context tokens | Cost | Turns | Right answer |
|---|---:|---:|---:|---|
| Slices (`overview`, `search`, `neighbors`, `node`) | 12,802 | $0.0040 | 4 | Yes, 7 of 7 |
| Whole model (`export_all`, then read it) | 77,984 | $0.0167 | 3 | Yes, 7 of 7 |

Slices used about 6x less new context. The whole-model run would also carry that weight
on every later turn until compaction. This is one question on one repo, measured before
tables gained their policies and triggers, so treat the ratio as a direction, not a constant.

### Limits along the path

| Path | Limit | How we know |
|---|---|---|
| MCP tool result, Claude Code | 9,000 chars arrived whole. 60,000 and 120,000 were replaced by a "saved to file" pointer. | Measured. Exact cut-off not found. |
| Tool result in Kiro Crew's event stream | Cut to 8,000 chars (`MAX_TOOL_RESULT_CHARS`) for the host's record. The model is not cut there. | Read in source, then measured in a live session. |
| Injected context | 40,000 chars an entry, 50 pending a slot | App Kit docs |
| `ChatEmbed` transcript | Newest 200 rows, 500 with "load earlier" | App Kit docs |
| Long sessions | Older turns are compacted away. Files survive. | Kiro Crew docs |

## Rules

1. **Files are the memory, chat is the index.** The model, notes and long results live in
   files. A chat carries ids and paths.
2. **Read small to large.** `overview`, then `search`, then `node`. The `system-map` skill
   tells agents to stop as soon as they can answer.
3. **Every tool has a budget.** Results over 12,000 chars are written to a slice file and
   the tool returns the path and a 600-char head. That fits any one table, so a normal read
   never needs a second step. Staying well under the client's limit means we choose what
   happens to a large answer, not the client. Results are compact JSON, because indenting
   a table cost about 30% more for nothing.
4. **The overview has a hard limit of 6,000 chars.** Past that it lists names, then says how
   many more there are. Agents reach the rest with `search`.
5. **Send references, not content.** "Ask about this table" sends a node id. A sub-agent
   gets ids and paths, writes its results to files and returns a path.
6. **Findings go in notes, not chat.** A note is a file with evidence, so it outlives the
   chat, compaction and the session.
7. **Facts are checked, not trusted.** The manifest holds a hash for every Facts file, and
   `overview` reports any that changed since the build.

## Checked in a live gateway

| Question | Answer |
|---|---|
| Can a session's shell write to the app's data folder? | Yes. `python3 -m core build` wrote the model there. |
| Does the sandboxed backend reach repos outside its folder? | Yes. It built a model and ran git in all 7 worktrees of the test repo. |
| Where can session overlap data come from? | `git worktree list`. The docs say `/api/sessions` covers only an app's own sessions. |
| Does the model get more than 8,000 chars in a Kiro Crew session? | Yes. 9,000 and 20,000 chars both reached the model whole. The 8,000-char cut affects only what the host records. |
| Can the `note` tool write to the data folder from inside a session? | Yes. A live session wrote a note and got its path back. |
