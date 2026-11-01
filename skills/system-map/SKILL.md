---
name: system-map
description: Read and add to a repo's system model through the system-map tools. Use for questions about data models, how parts of a system connect, what a change touches, what is not built yet, where code is risky, or whether other worktrees are changing the same thing, before reading source files. Also use to test a what-if idea, map a use case, or save a view.
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

The tools use this session's project. Pass `repo` with a project's name only to read a different one.

If `overview` reports `stale` or `map_stale` as true, say so before relying on the model.
Rebuild it with `build` when the answer depends on recent commits.

A plan's status comes from checking what its spec names against the code. `status_source`
says where it came from, and `you` means a person set it, so do not argue with that. Links
come from imports and direct table calls, so they do not show runtime wiring.

`risk` shows `coverage: null` until a report is loaded, and then `covered` is null too. Its
judgment rests on whether any test reaches the code through imports, which is weaker, so say
so. Browser tests are not in `risk`, so a screen at 0% may still have them. `use_cases` does
count them, for the routes they open.

In `worktrees`, `high` means a real trial merge conflicted, or two worktrees change one table.
A merge is only tried on commits, so `merge: uncommitted` means nobody knows yet.

## Exploring

**What if.** Read the tables you will change first, so a proposal starts from the real schema.
Use `propose` with `dry_run: true`, read its limits, fix what you can, then save it. Change
order matters, because each change sees the ones before it.

| Limit kind | Means |
|---|---|
| `refused` | Postgres says no. This is proven, so fix it |
| `cannot_support` | The schema can't hold what is needed |
| `breaks` | It runs, but something stops working, or it fails once rows exist |
| `advice` | Worth saying: new findings, hot code, a worktree already there |

Silence is not proof. The rules are a floor, so a clean proposal can still fail on something
the model does not hold. To be sure, run it on real Postgres with `scripts/try_proposal.sh`.

Only a person accepts a draft. Say what you drafted and where it stands. Never claim it is
accepted, and never apply a proposal to a repo unless you are asked to build it.

**Use cases.** Call `use_case` with the routes, tables and modules it takes. Name parts that do
not exist yet, because a missing part is the point. Put what the schema must hold in `needs`.

**Views.** When someone asks to see something, call `save_view`, then say it is in Explore.
Look ids up first with `search`. A view can't name a part the model does not hold.

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
