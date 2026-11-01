---
name: system-map
description: Read and add to a repo's system model through the system-map tools. Use for questions about data models, tables, constraints or how parts of a system connect, before reading source files.
---

# System Map

The model is split into small files, so you can answer design questions without
loading the whole system into your context.

## Reading

Go from small to large, and stop as soon as you can answer:

1. `overview`: the index. It shows the commit and whether the model is stale.
2. `search`: find node ids by table, column or foreign key target.
3. `node` or `neighbors`: one table or its links.
4. `export_all`: only for a job that truly needs the whole schema.

If a result says `inline: false`, it was too large to return. It gives you a file
path. Read that file in parts. Do not ask for it again with a bigger budget.

If `overview` reports `stale: true`, say so before relying on the model. Rebuild it
with `build` when the answer depends on recent commits.

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
