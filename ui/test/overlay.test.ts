import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GROUP_ROUTES, GROUP_TABLES } from '../src/graphView.ts'
import type { Overlap, Risk, RiskRow, WorktreeState } from '../src/model.ts'
import { bandOf, overlapsOn, percent, riskIndex, tablesAtWork, worktreesOn } from '../src/overlay.ts'

const byNode = {
  'module:src/a': ['one', 'two'],
  'table:public.users': ['one'],
  'table:public.orgs': ['two'],
  'route:/desk': ['three'],
}

function row(extra: Partial<RiskRow>): RiskRow {
  return { path: 'src/a', lines: 1, complexity: 1, commits: 1, covered: null, branches: null, cover: 1, hot: false, untested: false, score: 0, ...extra }
}

function overlap(extra: Partial<Overlap>): Overlap {
  return {
    a: 'one',
    b: 'two',
    severity: 'low',
    summary: '',
    conflicts: [],
    merge: 'clean',
    uncommitted: [],
    files: [],
    schema: [],
    schema_and_code: [],
    code: [],
    modules: [],
    ...extra,
  }
}

function state(overlaps: Overlap[]): WorktreeState {
  return { ref: 'main', commit: 'abc', worktrees: [], overlaps, by_node: byNode, counts: { high: 0, medium: 0, low: 0, info: 0 } }
}

test('a card shows the worktrees on it', () => {
  assert.deepEqual(worktreesOn('module:src/a', byNode), ['one', 'two'])
  assert.deepEqual(worktreesOn('module:src/none', byNode), [])
})

test('the database card counts every table, each worktree once', () => {
  assert.deepEqual(worktreesOn(GROUP_TABLES, { ...byNode, 'table:public.more': ['one'] }), ['one', 'two'])
})

test('the routes card counts every route', () => {
  assert.deepEqual(worktreesOn(GROUP_ROUTES, byNode), ['three'])
})

test('hot and untested is the worst band, and calm code has none', () => {
  assert.equal(bandOf(row({ hot: true, untested: true })), 'hot-untested')
  assert.equal(bandOf(row({ hot: true })), 'hot')
  assert.equal(bandOf(row({ untested: true })), null)
  assert.equal(bandOf(undefined), null)
})

test('modules and areas are found by id', () => {
  const risk = { modules: [row({ id: 'module:src/a' })], areas: [row({ id: 'area:src' })] } as Risk
  assert.deepEqual([...riskIndex(risk).keys()], ['module:src/a', 'area:src'])
  assert.equal(riskIndex(null).size, 0)
})

test('a node finds the overlaps it is part of', () => {
  const on = overlap({ schema: ['table:public.users'] })
  const off = overlap({ code: ['table:public.orgs'] })
  assert.deepEqual(overlapsOn('table:public.users', state([on, off])), [on])
  assert.deepEqual(overlapsOn('table:public.users', null), [])
})

test('tables at work carry how many worktrees are on them', () => {
  assert.deepEqual([...tablesAtWork(state([])).entries()].sort(), [
    ['table:public.orgs', 1],
    ['table:public.users', 1],
  ])
})

test('a share reads as a percent, and nothing reads as none', () => {
  assert.equal(percent(0.496), '50%')
  assert.equal(percent(0), '0%')
  assert.equal(percent(null), 'none')
})
