---
name: system-map
description: Read and add to a repo's system model through the system-map tools. Use for questions about data models, how parts of a system connect, what a change touches, what is not built yet, where code is risky, or whether other worktrees are changing the same thing, before reading source files.
---

# System Map

The model is split into small files, so you can answer design questions without
loading the whole system into your context.

## Reading

Go from small to large, and stop as soon as you can answer:

1. `overview`: the index. It shows the commit, the areas, and what is not fully built.
2. `search`: find node ids by name, column or foreign key target.
3. `node` or `neighbors`: one thing and its links. Ids look like `table:public.users`,
   `module:src/agents/inbox`, `area:src/agents`, `route:/desk`, `job:renewals`,
   `service:anthropic` and `plan:inbox`.
4. `plan`: what the specs promise and what does not exist yet. Filter by status.
5. `findings`: rule checks, such as a foreign key with no index. Filter by node or severity.
6. `risk`: code that changes often, has many paths and few tests, worst first.
7. `worktrees`: what each worktree is changing, live, and where two collide. Pass a node id
   to see only who is working on it.
8. `export_all`: only for a job that truly needs the whole schema.

Before you change a table or module, check `worktrees` with its id. If another worktree is on
it, say so before you start.

If a result says `inline: false`, it was too large to return. It gives you a file
path. Read that file in parts. Do not ask for it again with a bigger budget.

If `overview` reports `stale` or `map_stale` as true, say so before relying on the model.
Rebuild it with `build` when the answer depends on recent commits.

A plan's status comes from checking what its spec names against the code. `status_source`
says where it came from, and `you` means a person set it, so do not argue with that. Links
come from imports and direct table calls, so they do not show runtime wiring.

`risk` shows `coverage: null` until a report is loaded, and then `covered` is null too. Its
judgment rests on whether any test reaches the code through imports, which is weaker, so say
so. Browser tests are not counted, so a screen at 0% may still have them.

In `worktrees`, `high` means a real trial merge conflicted, or two worktrees change one table.
A merge is only tried on commits, so `merge: uncommitted` means nobody knows yet.

## Loading coverage

The app never runs tests. To load real numbers, run the repo's tests with coverage in a scratch
copy, so the repo does not change. Then call `coverage` with the report's path and the commit it
ran on.

## Writing

Facts come from parsers. Never edit files under `facts/`.

Save what you learn with `note`, on the node it belongs to. Each note needs evidence
as a repo path or `path:line`. A note outlives this chat, so write it for a reader who
has none of this conversation.

For long jobs, keep your working results in files and carry only their paths in the
conversation. When you hand work to a sub-agent, give it node ids and paths, not the
content.

## Replying

Name nodes by id, cite `path:line`, and do not paste table dumps into chat.
