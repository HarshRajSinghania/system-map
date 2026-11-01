import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GROUP_JOBS, GROUP_ROUTES, GROUP_TABLES, buildView, savedView, shortPath, trailFor } from '../src/graphView.ts'
import type { SystemEdge, SystemGraph, SystemNode } from '../src/model.ts'

function node(id: string, kind: string, extra: Partial<SystemNode> = {}): SystemNode {
  return { id, kind, name: id.split(/[:/]/).pop() ?? id, status: 'built', evidence: [], ...extra }
}

function area(path: string): SystemNode {
  return node(`area:${path}`, 'area', { path, files: 1, lines: 1 })
}

function module(path: string, parent: string): SystemNode {
  return node(`module:${path}`, 'module', { path, area: `area:${parent}`, files: 1, lines: 1 })
}

function edge(source: string, target: string, kind: string, count = 1): SystemEdge {
  return { source, target, kind, count, evidence: [] }
}

const system: SystemGraph = {
  nodes: [
    area('src/a'),
    area('src/b'),
    area('src/routes'),
    module('src/a/one', 'src/a'),
    module('src/a/two', 'src/a'),
    module('src/b/three', 'src/b'),
    module('src/routes', 'src/routes'),
    node('route:/desk', 'route', { name: '/desk', path: '/desk', route_kind: 'page', evidence: ['src/routes/desk.tsx'] }),
    node('job:nightly', 'job', { schedule: '0 1 * * *' }),
    node('service:stripe', 'service', { status: 'external' }),
    node('plan:next', 'plan', { status: 'partial', found: 1, missing: 3 }),
    node('plan:done', 'plan', { status: 'built', found: 5, missing: 0 }),
  ],
  edges: [
    edge('module:src/a/one', 'module:src/b/three', 'imports', 2),
    edge('module:src/a/two', 'module:src/b/three', 'imports', 2),
    edge('module:src/b/three', 'module:src/a/one', 'imports', 1),
    edge('module:src/a/one', 'module:src/a/two', 'imports', 5),
    edge('module:src/a/one', 'table:public.users', 'uses_table'),
    edge('module:src/b/three', 'service:stripe', 'uses_service'),
    edge('route:/desk', 'module:src/a/one', 'renders'),
    edge('job:nightly', 'route:/desk', 'calls'),
    edge('plan:next', 'module:src/a/two', 'touches'),
    edge('plan:done', 'module:src/a/one', 'touches'),
  ],
}

const ids = (view: { cards: { id: string }[] }) => view.cards.map((card) => card.id).sort()
const line = (view: { lines: { source: string; target: string; kind: string; count: number }[] }, source: string, target: string) =>
  view.lines.find((item) => item.source === source && item.target === target)

test('the top level shows areas, groups, services and unbuilt plans', () => {
  const view = buildView(system, null, 33, true)
  assert.deepEqual(ids(view), ['area:src/a', 'area:src/b', GROUP_JOBS, GROUP_ROUTES, GROUP_TABLES, 'plan:next', 'service:stripe'].sort())
})

test('the routes folder folds into the Routes group', () => {
  assert.ok(!ids(buildView(system, null, 33, true)).includes('area:src/routes'))
})

test('links between two areas add up', () => {
  assert.equal(line(buildView(system, null, 33, true), 'area:src/a', 'area:src/b')?.count, 4)
})

test('thin import links are hidden at the top only', () => {
  const top = buildView(system, null, 33, true)
  assert.equal(line(top, 'area:src/b', 'area:src/a'), undefined)
})

test('a link inside an area is not drawn at the top', () => {
  assert.ok(buildView(system, null, 33, true).lines.every((item) => item.source !== item.target))
})

test('plans can be switched off', () => {
  assert.ok(!ids(buildView(system, null, 33, false)).includes('plan:next'))
})

test('a built plan stays off the map until you open what it touches', () => {
  assert.ok(!ids(buildView(system, null, 33, true)).includes('plan:done'))
  assert.ok(ids(buildView(system, 'module:src/a/one', 33, true)).includes('plan:done'))
})

test('an open area shows its modules and what they use, not other areas', () => {
  const view = buildView(system, 'area:src/a', 33, true)
  const shown = ids(view)
  assert.ok(shown.includes('module:src/a/one'))
  assert.ok(shown.includes('module:src/a/two'))
  assert.ok(shown.includes(GROUP_TABLES))
  assert.ok(shown.includes('plan:next'))
  assert.ok(!shown.includes('area:src/b'))
  assert.equal(line(view, 'module:src/a/one', 'module:src/a/two')?.count, 5)
})

test('a neighborhood shows direct links, with nothing rolled up', () => {
  const shown = ids(buildView(system, 'module:src/a/one', 33, true))
  assert.ok(shown.includes('table:public.users'))
  assert.ok(shown.includes('module:src/b/three'))
  assert.ok(shown.includes('route:/desk'))
  assert.ok(!shown.includes('module:src/a/nope'))
})

test('opening Routes lists each route', () => {
  assert.ok(ids(buildView(system, GROUP_ROUTES, 33, true)).includes('route:/desk'))
})

test('the routes folder opens as the Routes group', () => {
  assert.deepEqual(ids(buildView(system, 'area:src/routes', 33, true)), ids(buildView(system, GROUP_ROUTES, 33, true)))
})

test('a job links to the route it calls', () => {
  assert.ok(line(buildView(system, GROUP_JOBS, 33, true), 'job:nightly', GROUP_ROUTES))
})

test('a repo with no routes, tables or jobs shows no empty groups', () => {
  const bare: SystemGraph = { nodes: [area('src/a')], edges: [] }
  assert.deepEqual(ids(buildView(bare, null, 0, true)), ['area:src/a'])
})

test('the trail walks down from the top', () => {
  assert.deepEqual(trailFor(system, null).map((step) => step.label), ['System'])
  assert.deepEqual(trailFor(system, 'module:src/a/one').map((step) => step.id), [null, 'area:src/a', 'module:src/a/one'])
  assert.deepEqual(trailFor(system, 'route:/desk').map((step) => step.label), ['System', 'Routes', '/desk'])
  assert.deepEqual(trailFor(system, 'table:public.users').map((step) => step.label), ['System', 'users'])
})

const withIdea: SystemGraph = {
  nodes: [
    ...system.nodes,
    node('module:src/a/idea', 'module', { path: 'src/a/idea', area: 'area:src/a', status: 'proposed' }),
    node('route:/idea', 'route', { path: '/idea', status: 'proposed' }),
  ],
  edges: [...system.edges, { ...edge('route:/idea', 'module:src/a/idea', 'renders'), proposed: true }, { ...edge('module:src/a/idea', 'table:public.users', 'uses_table'), proposed: true }],
}

test('something proposed gets its own card at the top, and never hides in a group', () => {
  const shown = ids(buildView(withIdea, null, 33, true))
  assert.ok(shown.includes('module:src/a/idea'))
  assert.ok(shown.includes('route:/idea'))
})

test('a proposed card and its lines say so', () => {
  const view = buildView(withIdea, null, 33, true)
  assert.equal(view.cards.find((card) => card.id === 'route:/idea')?.status, 'proposed')
  assert.equal(line(view, 'route:/idea', 'module:src/a/idea')?.kind, 'renders')
  assert.equal(view.lines.find((item) => item.source === 'route:/idea')?.proposed, true)
})

test('a saved view shows only what it names, and the links between them', () => {
  const view = savedView(system, ['module:src/a/one', 'module:src/b/three', 'table:public.users'], 33)
  assert.deepEqual(ids(view), ['module:src/a/one', 'module:src/b/three', 'table:public.users'])
  assert.equal(line(view, 'module:src/a/one', 'module:src/b/three')?.count, 2)
  assert.ok(line(view, 'module:src/a/one', 'table:public.users'))
  assert.equal(view.lines.length, 3)
})

test('a saved view cannot draw what the model does not hold', () => {
  assert.deepEqual(ids(savedView(system, ['module:src/nope'], 33)), [])
})

test('short paths drop the code root', () => {
  assert.equal(shortPath('src/agents/inbox'), 'agents/inbox')
})
