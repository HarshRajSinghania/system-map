import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  draftErrorFor,
  draftFinds,
  draftRows,
  draftSettings,
  filterAgents,
  filterCounts,
  FIND_AGENTS_MESSAGE,
  fromForm,
  handsOffTo,
  markedSettings,
  markModule,
  modelLabel,
  modelsOf,
  nodeLabel,
  regionTone,
  sdkLine,
  SETTING_HELP,
  SETTING_KEYS,
  setupKey,
  showAgentOnLayer,
  staleLine,
  startsFrom,
  toForm,
  toggleAgentsLayer,
} from '../src/agentRows.ts'
import type { AgentDraft, AgentModel, AgentRow } from '../src/model.ts'

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

test('an SDK agent says which package made it, and no other agent does', () => {
  for (const sdk of ['@openai/agents', '@mastra/core', '@anthropic-ai/claude-agent-sdk']) {
    assert.equal(sdkLine(agent('helper', { source: 'sdk', sdk, jobs: [], status: 'built' })), `From ${sdk}`)
  }
  assert.equal(sdkLine(agent('triage')), null)
  assert.equal(sdkLine(agent('mail', { source: 'module' })), null)
})

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
  const form = toForm({ list: 'src/agents/registry.ts', hand_off_calls: ['queueAgent'], model_calls: ['claude', 'readQuote'], modules: ['module:src/mail'] }, { jobs_key: 'handlers', hand_off_keys: ['agent'] })
  assert.deepEqual(form, {
    list: 'src/agents/registry.ts',
    jobs_key: 'handlers',
    hand_off_keys: 'agent',
    hand_off_calls: 'queueAgent',
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
    hand_off_calls: ' queueAgent, startAgent ',
    model_calls: 'claude,readQuote',
    asks_you_calls: ' ',
    modules: 'src/mail, module:src/desk',
    home_region: ' Canada ',
  })
  assert.deepEqual(settings, {
    list: 'src/agents/registry.ts',
    hand_off_keys: ['agent', 'p_agent'],
    hand_off_calls: ['queueAgent', 'startAgent'],
    model_calls: ['claude', 'readQuote'],
    modules: ['module:src/mail', 'module:src/desk'],
    home_region: 'Canada',
  })
})

test('an empty hand-off calls field is left out, and the field sits after hand-off keys', () => {
  const form = toForm({ list: 'a.ts' }, {})
  assert.equal(form.hand_off_calls, '')
  assert.equal(fromForm(form).hand_off_calls, undefined)
  assert.equal(SETTING_KEYS.indexOf('hand_off_calls'), SETTING_KEYS.indexOf('hand_off_keys') + 1)
})

test('every setting the form saves has a field, a label and help, in one order', () => {
  assert.deepEqual(SETTING_KEYS, Object.keys(toForm({}, {})))
  assert.deepEqual(Object.keys(SETTING_HELP), SETTING_KEYS)
  assert.match(SETTING_HELP.hand_off_calls, /first argument/)
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

test('marking a module keeps the rest of the settings and adds it once', () => {
  const settings = markModule({ list: 'a.ts', modules: ['module:src/a'] }, 'module:src/a')
  assert.deepEqual(settings, { list: 'a.ts', modules: ['module:src/a'] })
  assert.deepEqual(markModule({}, 'module:src/b').modules, ['module:src/b'])
})

function draft(extra: Partial<AgentDraft> = {}): AgentDraft {
  return {
    id: '1a2b',
    settings: { list: 'src/agents/registry.ts', model_calls: ['claude', 'readQuote'] },
    evidence: { list: ['src/agents/registry.ts:12'], model_calls: ['src/agents/types.ts:30', 'src/quote.ts:4'] },
    note: 'Read the registry.',
    commit: 'f1051a351475af9e',
    ref: 'origin/main',
    drafted_at: 1,
    count: 2,
    agents: [],
    ...extra,
  }
}

test('using a draft keeps the saved home region only when the draft has none', () => {
  assert.equal(draftSettings(draft(), { home_region: 'Canada' }).home_region, 'Canada')
  assert.equal(draftSettings(draft({ settings: { list: 'a.ts', home_region: 'EU' } }), { home_region: 'Canada' }).home_region, 'EU')
  assert.deepEqual(draftSettings(draft(), {}), draft().settings)
})

test('a draft shows what each setting becomes, what it was, and its evidence', () => {
  const saved = { list: 'src/agents/registry.ts', model_calls: ['claude'], modules: ['module:src/mail'], home_region: 'Canada' }
  const rows = draftRows(draft(), ['model_calls', 'modules'], saved)
  assert.deepEqual(
    rows.map((row) => [row.label, row.value, row.was, row.changed]),
    [
      ['Agent list', 'src/agents/registry.ts', null, false],
      ['Model calls', 'claude, readQuote', 'claude', true],
      ['Agent modules', null, 'src/mail', true],
    ],
  )
  assert.deepEqual(rows[1].evidence, ['src/agents/types.ts:30', 'src/quote.ts:4'])
  assert.deepEqual(rows[2].evidence, [])
})

test('a new setting has nothing it was, and a home region in the draft shows', () => {
  const rows = draftRows(draft({ settings: { list: 'a.ts', home_region: 'Canada' }, evidence: { home_region: ['CLAUDE.md:42'] } }), ['list', 'home_region'], {})
  assert.deepEqual(
    rows.map((row) => [row.key, row.value, row.was]),
    [
      ['list', 'a.ts', null],
      ['home_region', 'Canada', null],
    ],
  )
  assert.deepEqual(rows[1].evidence, ['CLAUDE.md:42'])
})

test('the card counts what the draft finds, and says when the code has moved', () => {
  assert.equal(draftFinds(draft({ count: 9 })), 'With these, System Map finds 9 agents:')
  assert.equal(draftFinds(draft({ count: 1 })), 'With these, System Map finds 1 agent:')
  assert.equal(draftFinds(draft({ count: 0 })), 'With these, System Map finds no agents.')
  assert.equal(staleLine(draft()), 'Drafted at f1051a3. The code has changed since, so check it first.')
  assert.equal(staleLine(draft({ commit: null })), 'Drafted before the last build. The code has changed since, so check it first.')
})

test('Mark as agent on a form opened from a draft keeps the draft as edited', () => {
  const saved = { list: 'old.ts', home_region: 'Canada' }
  const form = { ...toForm(draftSettings(draft(), saved), {}), asks_you_calls: 'addTask' }
  assert.deepEqual(markedSettings(saved, 'module:src/mail', form), {
    list: 'src/agents/registry.ts',
    model_calls: ['claude', 'readQuote'],
    asks_you_calls: ['addTask'],
    modules: ['module:src/mail'],
    home_region: 'Canada',
  })
  assert.deepEqual(markedSettings(saved, 'module:src/mail', null), { ...saved, modules: ['module:src/mail'] })
})

test('the settings form starts again when the saved settings change, and per draft', () => {
  assert.notEqual(setupKey(null, { list: 'a.ts' }), setupKey(null, { list: 'b.ts' }))
  assert.equal(setupKey(null, { list: 'a.ts' }), setupKey(null, { list: 'a.ts' }))
  assert.equal(setupKey('1a2b', { list: 'a.ts' }), setupKey('1a2b', { list: 'b.ts' }))
  assert.notEqual(setupKey('1a2b', {}), setupKey('3c4d', {}))
})

test('an error shows only on the draft it came back with', () => {
  const error = { id: '1a2b', text: 'Could not use the draft.' }
  assert.equal(draftErrorFor(error, '1a2b'), 'Could not use the draft.')
  assert.equal(draftErrorFor(error, '3c4d'), null)
  assert.equal(draftErrorFor({ id: null, text: 'x' }, '1a2b'), null)
  assert.equal(draftErrorFor(null, '1a2b'), null)
})

test('Find my agents asks the chat to follow the skill and save a draft', () => {
  assert.match(FIND_AGENTS_MESSAGE, /Find my agents steps/)
  assert.match(FIND_AGENTS_MESSAGE, /`draft_agents`/)
  assert.match(FIND_AGENTS_MESSAGE, /save the draft/)
})
