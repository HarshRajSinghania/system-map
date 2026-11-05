import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  filterAgents,
  filterCounts,
  fromForm,
  handsOffTo,
  markModule,
  modelLabel,
  modelsOf,
  nodeLabel,
  openSavedViewLayer,
  regionTone,
  showAgentOnLayer,
  startsFrom,
  toForm,
  toggleAgentsLayer,
} from '../src/agentRows.ts'
import type { AgentModel, AgentRow } from '../src/model.ts'

function model(extra: Partial<AgentModel>): AgentModel {
  return { node: 'service:anthropic', name: 'Anthropic', region: null, leaves: false, evidence: 'a.ts:1', ...extra }
}

function agent(name: string, extra: Partial<AgentRow> = {}): AgentRow {
  return {
    id: `agent:${name}`,
    name,
    label: name[0].toUpperCase() + name.slice(1),
    description: '',
    status: 'built',
    jobs: [],
    path: `src/agents/${name}.ts`,
    module: 'module:src/agents',
    source: 'list',
    evidence: [`src/agents/${name}.ts:1`],
    asks_you: [],
    leaves_region: [],
    starts: [],
    hands_off_to: [],
    handed_by: [],
    models: [],
    ...extra,
  }
}

const rows = [
  agent('triage', { asks_you: ['t.ts:9'], models: [model({ leaves: true, region: 'US' })], leaves_region: ['service:anthropic'], starts: [{ node: 'module:src/data/units', evidence: 'u.ts:88' }], hands_off_to: [{ node: 'agent:intake', evidence: 't.ts:111' }] }),
  agent('intake', { models: [model({ node: 'service:gemini', name: 'Gemini', region: 'Canada' })], handed_by: [{ node: 'agent:triage', evidence: 't.ts:111' }] }),
  agent('renewals', { asks_you: ['r.ts:5'], starts: [{ node: 'job:renewals', evidence: 'm.sql:347' }] }),
  agent('inbox', { status: 'planned' }),
]

test('each filter counts the agents it keeps', () => {
  assert.deepEqual(filterCounts(rows), { all: 4, model: 2, leaves: 1, asks: 2, planned: 1 })
})

test('a filter keeps only its agents', () => {
  assert.deepEqual(filterAgents(rows, 'model').map((row) => row.name), ['triage', 'intake'])
  assert.deepEqual(filterAgents(rows, 'leaves').map((row) => row.name), ['triage'])
  assert.deepEqual(filterAgents(rows, 'planned').map((row) => row.name), ['inbox'])
  assert.equal(filterAgents(rows, 'all').length, 4)
})

test('a node is named by what it is', () => {
  assert.equal(nodeLabel('agent:intake', rows), 'Intake')
  assert.equal(nodeLabel('agent:gone', rows), 'gone')
  assert.equal(nodeLabel('job:book-review', rows), 'book-review job')
  assert.equal(nodeLabel('module:src/data/units', rows), 'data/units')
  assert.equal(nodeLabel('route:/desk', rows), '/desk')
})

test('work comes from what starts an agent and from agents that hand it work', () => {
  assert.deepEqual(startsFrom(rows[0], rows), ['data/units'])
  assert.deepEqual(startsFrom(rows[1], rows), ['Triage'])
  assert.deepEqual(startsFrom(rows[3], rows), [])
  assert.deepEqual(handsOffTo(rows[0], rows), ['Intake'])
})

test('a model shows once, with its region when one is set', () => {
  const twice = agent('x', { models: [model({ evidence: 'a.ts:1' }), model({ evidence: 'b.ts:2' })] })
  assert.deepEqual(modelsOf(twice).map((item) => item.evidence), ['a.ts:1'])
  assert.equal(modelLabel(model({ region: 'US' })), 'Anthropic · US')
  assert.equal(modelLabel(model({})), 'Anthropic')
})

test('a model is outside, inside or not yet placed', () => {
  assert.equal(regionTone(model({ leaves: true, region: 'US' }), 'Canada'), 'leaves')
  assert.equal(regionTone(model({ region: ' canada ' }), 'Canada'), 'home')
  assert.equal(regionTone(model({ region: 'Canada' }), null), 'unknown')
  assert.equal(regionTone(model({}), 'Canada'), 'unknown')
})

test('the form starts from what is saved, then the defaults', () => {
  const form = toForm({ list: 'src/agents/registry.ts', model_calls: ['claude', 'readQuote'], modules: ['module:src/mail'] }, { jobs_key: 'handlers', hand_off_keys: ['agent'] })
  assert.deepEqual(form, {
    list: 'src/agents/registry.ts',
    jobs_key: 'handlers',
    hand_off_keys: 'agent',
    model_calls: 'claude, readQuote',
    asks_you_calls: '',
    modules: 'src/mail',
    home_region: '',
  })
})

test('the form saves lists, module ids and leaves empty fields out', () => {
  const settings = fromForm({
    list: ' src/agents/registry.ts ',
    jobs_key: '',
    hand_off_keys: 'agent, p_agent agent',
    model_calls: 'claude,readQuote',
    asks_you_calls: ' ',
    modules: 'src/mail, module:src/desk',
    home_region: ' Canada ',
  })
  assert.deepEqual(settings, {
    list: 'src/agents/registry.ts',
    hand_off_keys: ['agent', 'p_agent'],
    model_calls: ['claude', 'readQuote'],
    modules: ['module:src/mail', 'module:src/desk'],
    home_region: 'Canada',
  })
})

test('turning the Agents layer off goes back to where the map was', () => {
  const on = toggleAgentsLayer({ on: false, focus: 'area:src/agents', before: null })
  assert.deepEqual(on, { on: true, focus: null, before: 'area:src/agents', closeSavedView: true })
  const picked = { ...on, focus: 'agent:triage' }
  assert.deepEqual(toggleAgentsLayer(picked), { on: false, focus: 'area:src/agents', before: null, closeSavedView: false })
})

test('showing an agent turns the layer on, and off goes back to the map, not elsewhere', () => {
  const fromMap = showAgentOnLayer({ on: false, focus: 'module:src/desk', before: null }, 'agent:triage', true)
  assert.deepEqual(fromMap, { on: true, focus: 'agent:triage', before: 'module:src/desk' })
  assert.equal(toggleAgentsLayer(fromMap).focus, 'module:src/desk')
  const fromTab = showAgentOnLayer({ on: false, focus: 'module:src/desk', before: null }, 'agent:triage', false)
  assert.equal(fromTab.before, null)
  const again = showAgentOnLayer(fromMap, 'agent:intake', false)
  assert.equal(again.before, 'module:src/desk')
})

test('a saved view turns the layer off, so the button never shows on over it', () => {
  assert.deepEqual(openSavedViewLayer(), { on: false, focus: null, before: null })
  const on = toggleAgentsLayer({ on: false, focus: null, before: null })
  assert.equal(on.closeSavedView, true)
})

test('marking a module keeps the rest of the settings and adds it once', () => {
  const settings = markModule({ list: 'a.ts', modules: ['module:src/a'] }, 'module:src/a')
  assert.deepEqual(settings, { list: 'a.ts', modules: ['module:src/a'] })
  assert.deepEqual(markModule({}, 'module:src/b').modules, ['module:src/b'])
})
