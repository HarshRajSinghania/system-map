import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GROUP_ROUTES, GROUP_TABLES, buildView } from '../src/graphView.ts'
import type { SystemEdge, SystemGraph, SystemNode } from '../src/model.ts'
import { readLines } from '../src/projects.ts'
import type { BuildRead } from '../src/projects.ts'

function node(id: string, kind: string, extra: Partial<SystemNode> = {}): SystemNode {
  return { id, kind, name: id.split(/[:/]/).pop() ?? id, status: 'built', evidence: [], ...extra }
}

const area = (path: string) => node(`area:${path}`, 'area', { path, files: 1, lines: 1 })
const module = (path: string, parent: string) => node(`module:${path}`, 'module', { path, area: `area:${parent}`, files: 1, lines: 1 })
const edge = (source: string, target: string, kind: string, count = 1): SystemEdge => ({ source, target, kind, count, evidence: [] })

const small: SystemGraph = {
  routes_dir: 'app',
  nodes: [
    area('app'),
    area('lib'),
    area('components'),
    module('app', 'app'),
    module('app/api', 'app'),
    module('app/listings', 'app'),
    module('lib', 'lib'),
    module('components', 'components'),
    node('route:/', 'route', { evidence: ['app/page.tsx'] }),
    node('route:/listings/[slug]', 'route', { evidence: ['app/listings/[slug]/page.tsx'] }),
  ],
  edges: [
    edge('module:app', 'module:lib', 'imports'),
    edge('module:app/listings', 'module:components', 'imports'),
    edge('module:components', 'module:lib', 'imports'),
    edge('module:lib', 'table:main.listings', 'uses_table', 4),
  ],
}

test('everything under the routes folder folds into Routes', () => {
  const view = buildView(small, null, 4, true)
  const ids = view.cards.map((card) => card.id)
  assert.ok(ids.includes(GROUP_ROUTES))
  assert.ok(!ids.includes('area:app'))
  assert.ok(!ids.includes('module:app/listings'))
})

test('a small project keeps its thin links', () => {
  const view = buildView(small, null, 4, true)
  const joined = view.lines.map((line) => `${line.source} > ${line.target}`)
  assert.ok(joined.includes(`${GROUP_ROUTES} > area:lib`), joined.join(', '))
  assert.ok(joined.includes(`${GROUP_ROUTES} > area:components`))
  assert.ok(joined.includes('area:components > area:lib'))
  assert.ok(joined.includes(`area:lib > ${GROUP_TABLES}`))
  assert.equal(view.hidden, 0)
})

test('a crowded project still hides thin links, and says how many', () => {
  const nodes = [...small.nodes]
  const edges = [...small.edges]
  for (let index = 0; index < 30; index += 1) {
    nodes.push(node(`area:x${index}`, 'area', { path: `x${index}`, files: 1, lines: 1 }), module(`x${index}`, `x${index}`))
    edges.push(edge(`module:x${index}`, 'module:lib', 'imports'))
  }
  const view = buildView({ ...small, nodes, edges }, null, 4, true)
  assert.ok((view.hidden ?? 0) >= 30)
  assert.ok(!view.lines.some((line) => line.source === 'area:x1'))
})

test('a project from before routes_dir still finds its routes folder', () => {
  const older: SystemGraph = {
    nodes: [area('src/routes'), area('src/lib'), module('src/routes', 'src/routes'), module('src/lib', 'src/lib'), node('route:/', 'route', { evidence: ['src/routes/index.tsx'] })],
    edges: [],
  }
  const ids = buildView(older, null, 0, true).cards.map((card) => card.id)
  assert.ok(ids.includes(GROUP_ROUTES))
  assert.ok(!ids.includes('area:src/routes'))
})

function read(extra: Partial<BuildRead> = {}): BuildRead {
  return { engine: 'sqlite', schema_files: ['db/schema.sql'], tables: 4, route_style: 'Next.js App Router', routes: 5, code_files: 21, links: 26, plans: 1, git: true, unread: [], ...extra }
}

test('the status menu says what a build read', () => {
  assert.deepEqual(readLines(read()), ['4 tables from SQLite', '5 routes, Next.js App Router', '21 code files, 26 links'])
})

test('it says when something was not found', () => {
  assert.deepEqual(readLines(read({ tables: 0, engine: null, routes: 0, route_style: '' })).slice(0, 2), ['No tables found', 'No routes found'])
})

test('it uses singular words for one of something', () => {
  assert.deepEqual(readLines(read({ tables: 1, routes: 1, code_files: 1, links: 1 })), ['1 table from SQLite', '1 route, Next.js App Router', '1 code file, 1 link'])
})

test('it says what no git history costs', () => {
  assert.ok(readLines(read({ git: false })).includes('No git history, so no churn or worktrees'))
})
