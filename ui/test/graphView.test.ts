import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CARD_HEIGHT, CARD_WIDTH, GROUP_JOBS, GROUP_ROUTES, GROUP_TABLES, agentsView, buildView, savedView, shortPath, trailFor } from '../src/graphView.ts'
import { layoutView } from '../src/layout.ts'
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

test('a folder of only tests says how many test files it holds, and one reads as one', () => {
  const tested: SystemGraph = {
    nodes: [
      node('area:tests', 'area', { path: 'tests', files: 0, lines: 0, test_files: 1 }),
      node('area:e2e', 'area', { path: 'e2e', files: 0, lines: 0, test_files: 3 }),
      node('area:src/lib', 'area', { path: 'src/lib', files: 1, lines: 1, test_files: 2 }),
      node('area:src/app', 'area', { path: 'src/app', files: 2, lines: 40 }),
    ],
    edges: [],
  }
  const subtitles = new Map(buildView(tested, null, 0, true).cards.map((card) => [card.id, card.subtitle]))
  assert.equal(subtitles.get('area:tests'), '1 test file')
  assert.equal(subtitles.get('area:e2e'), '3 test files')
  assert.equal(subtitles.get('area:src/lib'), '1 file, 1 line')
  assert.equal(subtitles.get('area:src/app'), '2 files, 40 lines')
})

test('the routes folder folds into the Routes group', () => {
  assert.ok(!ids(buildView(system, null, 33, true)).includes('area:src/routes'))
})

test('links between two areas add up', () => {
  assert.equal(line(buildView(system, null, 33, true), 'area:src/a', 'area:src/b')?.count, 4)
})

test('with few links at the top, thin ones stay', () => {
  const top = buildView(system, null, 33, true)
  assert.ok(line(top, 'area:src/b', 'area:src/a'))
  assert.equal(top.hidden, 0)
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

const withAgents: SystemGraph = {
  home_region: 'Canada',
  nodes: [
    ...system.nodes,
    node('agent:triage', 'agent', { name: 'triage', label: 'Triage', jobs: ['triage.sort'], asks_you: ['t.ts:9'] }),
    node('agent:intake', 'agent', { name: 'intake', label: 'Quote intake', jobs: ['quote.read', 'quote.assemble'] }),
    node('agent:inbox', 'agent', { name: 'inbox', label: 'Inbox', status: 'planned', jobs: [] }),
    node('service:anthropic', 'service', { name: 'Anthropic', status: 'external', region: 'US' }),
    node('service:openai', 'service', { name: 'OpenAI', status: 'external', region: 'US' }),
    node('service:gemini', 'service', { name: 'Gemini', status: 'external', region: 'canada' }),
  ],
  edges: [
    ...system.edges,
    edge('module:src/a/one', 'agent:triage', 'starts'),
    edge('job:nightly', 'agent:intake', 'starts'),
    edge('agent:triage', 'agent:intake', 'hands_off_to'),
    { ...edge('agent:triage', 'service:anthropic', 'uses_model'), leaves_region: true },
    edge('agent:intake', 'service:gemini', 'uses_model'),
    { ...edge('agent:intake', 'service:openai', 'uses_model'), leaves_region: true },
  ],
}

test('with the Agents layer off, every level is exactly as it was without agents', () => {
  // The model before agents: the same services, and no agent or link to one.
  const before: SystemGraph = {
    ...withAgents,
    nodes: withAgents.nodes.filter((item) => item.kind !== 'agent'),
    edges: withAgents.edges.filter((item) => !item.source.startsWith('agent:') && !item.target.startsWith('agent:')),
  }
  for (const focus of [null, 'area:src/a', GROUP_JOBS, 'module:src/a/one', 'job:nightly', 'service:anthropic']) {
    assert.deepEqual(buildView(withAgents, focus, 33, true), buildView(before, focus, 33, true), String(focus))
  }
})

test('the agents picture shows each agent, what starts it, its hand-offs and its models', () => {
  const view = buildView(withAgents, 'module:src/a/one', 33, true, true)
  assert.deepEqual(ids(view), ['agent:inbox', 'agent:intake', 'agent:triage', 'job:nightly', 'module:src/a/one', 'service:anthropic', 'service:gemini', 'service:openai'])
  assert.equal(line(view, 'module:src/a/one', 'agent:triage')?.kind, 'starts')
  assert.equal(line(view, 'agent:triage', 'agent:intake')?.kind, 'hands_off_to')
  assert.equal(line(view, 'agent:triage', 'service:anthropic')?.leaves, true)
  assert.equal(line(view, 'agent:intake', 'service:gemini')?.leaves, undefined)
  assert.equal(view.lines.length, 6)
})

test('an agent card says its jobs, when it is not built, and when it asks you', () => {
  const cards = new Map(agentsView(withAgents).cards.map((card) => [card.id, card]))
  assert.deepEqual(cards.get('agent:triage'), { id: 'agent:triage', kind: 'agent', title: 'Triage', subtitle: '1 job', status: undefined, badge: 'asks you' })
  assert.equal(cards.get('agent:intake')?.subtitle, '2 jobs')
  assert.equal(cards.get('agent:inbox')?.status, 'planned')
  assert.equal(cards.get('service:anthropic')?.subtitle, 'US')
})

test('models stand out on the Agents layer, and only there', () => {
  assert.equal(agentsView(withAgents).cards.find((card) => card.id === 'service:anthropic')?.strong, true)
  assert.equal(buildView(withAgents, null, 33, true).cards.find((card) => card.id === 'service:anthropic')?.strong, undefined)
})

test('services fall into one band per region, named against the home region', () => {
  const bands = agentsView(withAgents).bands ?? []
  assert.deepEqual(
    bands.map((band) => [band.label, band.tone, band.members.sort()]),
    [
      ['US', 'away', ['service:anthropic', 'service:openai']],
      ['canada · home', 'home', ['service:gemini']],
    ],
  )
  const unknown = agentsView({ ...withAgents, home_region: null }).bands ?? []
  assert.deepEqual(unknown.map((band) => band.tone), ['unknown', 'unknown'])
})

test('one region written two ways is one band, named as first written', () => {
  const mixed = { ...withAgents, nodes: withAgents.nodes.map((item) => (item.id === 'service:openai' ? { ...item, region: ' us ' } : item)) }
  const bands = agentsView(mixed).bands ?? []
  assert.deepEqual(bands.map((band) => [band.label, band.members.length]), [
    ['US', 2],
    ['canada · home', 1],
  ])
})

test('a service with no region stays out of every band', () => {
  const plain = { ...withAgents, nodes: withAgents.nodes.map((item) => (item.id === 'service:openai' ? { ...item, region: undefined } : item)) }
  const view = agentsView(plain)
  assert.deepEqual(view.bands?.find((band) => band.label === 'US')?.members, ['service:anthropic'])
  assert.equal(view.cards.find((card) => card.id === 'service:openai')?.subtitle, 'no region set')
})

test('a band holds its members, and nothing else lands inside it', () => {
  for (const direction of ['LR', 'TB'] as const) {
    const { places, bands } = layoutView(agentsView(withAgents), direction)
    assert.equal(bands.length, 2)
    for (const band of bands) {
      for (const [id, spot] of places) {
        const inside = spot.x >= band.x && spot.y >= band.y && spot.x + CARD_WIDTH <= band.x + band.width && spot.y + CARD_HEIGHT <= band.y + band.height
        const touches = spot.x < band.x + band.width && spot.x + CARD_WIDTH > band.x && spot.y < band.y + band.height && spot.y + CARD_HEIGHT > band.y
        if (band.members.includes(id)) assert.ok(inside, `${id} in ${band.label}, ${direction}`)
        else assert.ok(!touches, `${id} clear of ${band.label}, ${direction}`)
      }
    }
    const [one, two] = bands
    const apart = one.x + one.width <= two.x || two.x + two.width <= one.x || one.y + one.height <= two.y || two.y + two.height <= one.y
    assert.ok(apart, `bands apart, ${direction}`)
  }
})

test('today’s map lays out with no bands', () => {
  assert.deepEqual(layoutView(buildView(system, null, 33, true), 'LR').bands, [])
})

test('with the Agents layer the trail starts at Agents', () => {
  assert.deepEqual(trailFor(withAgents, null, true), [{ id: null, label: 'Agents' }])
  assert.deepEqual(trailFor(withAgents, 'agent:intake', true), [
    { id: null, label: 'Agents' },
    { id: 'agent:intake', label: 'Quote intake' },
  ])
})
