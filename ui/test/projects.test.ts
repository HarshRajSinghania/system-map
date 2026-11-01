import assert from 'node:assert/strict'
import { test } from 'node:test'
import { plainError } from '../src/errors.ts'
import {
  builtAgo,
  chatSlotName,
  filterProjects,
  hasSideList,
  readListOpen,
  readView,
  recentToAdd,
  removalWarning,
  rowHint,
  rowStatus,
  statusOf,
  statusView,
  VIEWS,
  writeListOpen,
  writeView,
} from '../src/projects.ts'
import type { Project } from '../src/projects.ts'

function project(extra: Partial<Project>): Project {
  return {
    repo: '/home/me/code/app',
    repo_key: 'app-1',
    name: 'app',
    parent: 'code',
    ref: 'origin/main',
    commit: 'abc',
    built_at: 100,
    tables: 12,
    status: 'current',
    behind: 0,
    intent: { proposals: 0, use_cases: 0, views: 0 },
    ...extra,
  }
}

function memory(start: Record<string, string> = {}) {
  const values = new Map(Object.entries(start))
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => void values.set(key, value) }
}

test('status follows what the backend says about a row', () => {
  const fresh = { ref: 'main', stale: false, map_stale: false, commits_behind: 0 }
  assert.equal(statusOf(fresh), 'current')
  assert.equal(statusOf({ ...fresh, commits_behind: 2 }), 'behind')
  assert.equal(statusOf({ ...fresh, stale: true }), 'stale')
  assert.equal(statusOf({ ...fresh, map_stale: true }), 'stale')
  assert.equal(statusOf({ ...fresh, missing: true, commits_behind: 2 }), 'missing')
  assert.equal(statusOf({ ...fresh, error: 'no ref' }), 'unknown')
})

test('only an out of date model offers a rebuild up front', () => {
  assert.equal(statusView('stale', 0, 'main').rebuild, true)
  for (const status of ['current', 'behind', 'missing', 'unknown'] as const) {
    assert.equal(statusView(status, 1, 'main').rebuild, false)
  }
})

test('the chip says how far behind, in one or many commits', () => {
  assert.equal(statusView('behind', 3, 'main').label, '3 behind')
  assert.match(statusView('behind', 1, 'main').detail, /^1 commit behind/)
  assert.match(statusView('behind', 3, 'main').detail, /^3 commits behind/)
})

test('a row shows tables when current, and its status when not', () => {
  assert.equal(rowStatus(project({})), '12 tables')
  assert.equal(rowStatus(project({ tables: 1 })), '1 table')
  assert.equal(rowStatus(project({ status: 'stale' })), 'Out of date')
  assert.equal(rowStatus(project({ status: 'missing' })), 'Folder missing')
})

test('two folders with one name also show their parent', () => {
  const home = project({ repo_key: 'a', parent: 'code' })
  const work = project({ repo_key: 'b', parent: 'work' })
  const other = project({ repo_key: 'c', name: 'other' })
  const all = [home, work, other]
  assert.equal(rowHint(home, all), 'code')
  assert.equal(rowHint(work, all), 'work')
  assert.equal(rowHint(other, all), null)
})

test('the filter matches a name or a path, in any case', () => {
  const rows = [project({ name: 'Billing', repo: '/srv/Billing' }), project({ name: 'mobile', repo: '/home/me/work/mobile' })]
  assert.deepEqual(filterProjects(rows, 'bill').map((row) => row.name), ['Billing'])
  assert.deepEqual(filterProjects(rows, 'WORK').map((row) => row.name), ['mobile'])
  assert.equal(filterProjects(rows, '   ').length, 2)
  assert.equal(filterProjects(rows, 'nope').length, 0)
})

test('recent folders leave out projects, repeats and trailing slashes', () => {
  const rows = [project({ repo: '/home/me/code/app' })]
  const found = recentToAdd(['/home/me/code/app/', '/home/me/code/next/', '/home/me/code/next', '/srv/tool'], rows)
  assert.deepEqual(found, [
    { path: '/home/me/code/next', name: 'next', parent: 'code' },
    { path: '/srv/tool', name: 'tool', parent: 'srv' },
  ])
})

test('the remove warning counts only what exists', () => {
  assert.equal(removalWarning({ proposals: 0, use_cases: 0, views: 0 }), '')
  assert.equal(removalWarning({ proposals: 1, use_cases: 0, views: 0 }), '1 proposal')
  assert.equal(removalWarning({ proposals: 2, use_cases: 0, views: 1 }), '2 proposals and 1 saved view')
  assert.equal(removalWarning({ proposals: 2, use_cases: 1, views: 3 }), '2 proposals, 1 use case and 3 saved views')
})

test('built time reads in the largest unit', () => {
  assert.equal(builtAgo(100, 120), 'just now')
  assert.equal(builtAgo(0, 300), '5m ago')
  assert.equal(builtAgo(0, 7200), '2h ago')
  assert.equal(builtAgo(0, 172800), '2d ago')
  assert.equal(builtAgo(500, 100), 'just now')
})

test('each project remembers its own view', () => {
  const store = memory()
  writeView(store, 'one', 'risk')
  writeView(store, 'two', 'data')
  assert.equal(readView(store, 'one'), 'risk')
  assert.equal(readView(store, 'two'), 'data')
  assert.equal(readView(store, 'three'), 'map')
  assert.equal(readView(store, null), 'map')
})

test('a view that no longer exists opens the map', () => {
  assert.equal(readView(memory({ 'system-map.view.one': 'gone' }), 'one'), 'map')
})

test('only the views a list can steer have one', () => {
  assert.deepEqual(VIEWS.filter(hasSideList), ['map', 'data'])
})

test('the side list starts open', () => {
  assert.equal(readListOpen(memory()), true)
})

test('the side list stays hidden until it is shown again', () => {
  const store = memory()
  writeListOpen(store, false)
  assert.equal(readListOpen(store), false)
  writeListOpen(store, true)
  assert.equal(readListOpen(store), true)
})

test('each project gets its own chat', () => {
  assert.notEqual(chatSlotName('one-1'), chatSlotName('two-2'))
  assert.equal(chatSlotName('one-1'), 'system-map-design-one-1')
})

test('a 400 or 404 from the backend keeps its own words', () => {
  const caught = new Error('API 400: {"error": "/tmp/x isn\'t a git repo."}')
  assert.equal(plainError(caught, 'add this project'), "/tmp/x isn't a git repo.")
})

test('the host error shape works the same way', () => {
  const caught = Object.assign(new Error('API 404: x'), { status: 404, body: '{"error":"no project"}' })
  assert.equal(plainError(caught, 'remove it'), 'no project')
})

test('no failure shows raw response text', () => {
  const cases = [
    new Error('API 500: Traceback (most recent call last): boom'),
    new Error('API 400: <html>nope</html>'),
    new Error('API 403: {"error":"forbidden: /apps/x"}'),
    new TypeError('Failed to fetch'),
    'text',
    null,
    undefined,
  ]
  for (const caught of cases) {
    const shown = plainError(caught, 'load this project')
    assert.doesNotMatch(shown, /API \d|Traceback|<html>|Error:|forbidden|fetch/)
    assert.match(shown, /^Couldn't load this project/)
  }
})

test('each failure says what to do next', () => {
  assert.match(plainError(new Error('API 403: x'), 'do it'), /permissions/)
  assert.match(plainError(new Error('API 502: x'), 'do it'), /Try again/)
  assert.match(plainError(new TypeError('Failed to fetch'), 'do it'), /connected/)
})
