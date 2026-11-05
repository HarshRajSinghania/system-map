import { shortPath } from './graphView.ts'
import type { AgentModel, AgentRow, AgentSettings, AgentStatus } from './model'

export type AgentFilter = 'all' | 'model' | 'leaves' | 'asks' | 'planned'

export const AGENT_FILTERS: { key: AgentFilter; label: string; title: string }[] = [
  { key: 'all', label: 'All', title: 'Every agent' },
  { key: 'model', label: 'Use a model', title: 'Agents that call a model' },
  { key: 'leaves', label: 'Can leave region', title: 'Agents whose model runs outside your home region' },
  { key: 'asks', label: 'Asks you', title: 'Agents that wait for a person' },
  { key: 'planned', label: 'Planned', title: 'Agents a spec names that have no jobs yet' },
]

const KEEPS: Record<AgentFilter, (row: AgentRow) => boolean> = {
  all: () => true,
  model: (row) => row.models.length > 0,
  leaves: (row) => row.leaves_region.length > 0,
  asks: (row) => row.asks_you.length > 0,
  planned: (row) => row.status === 'planned',
}

export const STATUS_LABEL: Record<AgentStatus, string> = { built: 'built', planned: 'planned', empty: 'no jobs' }

export function filterAgents(rows: AgentRow[], filter: AgentFilter): AgentRow[] {
  return rows.filter(KEEPS[filter])
}

export function filterCounts(rows: AgentRow[]): Record<AgentFilter, number> {
  const counts = {} as Record<AgentFilter, number>
  for (const { key } of AGENT_FILTERS) counts[key] = rows.filter(KEEPS[key]).length
  return counts
}

/** What a node is called here: an agent by its label, anything else by its own name. */
export function nodeLabel(id: string, rows: AgentRow[]): string {
  const at = id.indexOf(':')
  const kind = id.slice(0, at)
  const rest = id.slice(at + 1)
  if (kind === 'agent') return rows.find((row) => row.id === id)?.label ?? rest
  if (kind === 'job') return `${rest} job`
  if (kind === 'module') return shortPath(rest)
  return rest
}

/** Where an agent's work comes from: what starts it, then the agents that hand it work. */
export function startsFrom(row: AgentRow, rows: AgentRow[]): string[] {
  return [...new Set([...row.starts, ...row.handed_by].map((link) => nodeLabel(link.node, rows)))]
}

export function handsOffTo(row: AgentRow, rows: AgentRow[]): string[] {
  return [...new Set(row.hands_off_to.map((link) => nodeLabel(link.node, rows)))]
}

/** Each model once, with the first line that proves it. */
export function modelsOf(row: AgentRow): AgentModel[] {
  const seen = new Map<string, AgentModel>()
  for (const model of row.models) if (!seen.has(model.node)) seen.set(model.node, model)
  return [...seen.values()]
}

export type RegionTone = 'leaves' | 'home' | 'unknown'

/** Whether a model runs outside the home region, inside it, or nobody has said. */
export function regionTone(model: AgentModel, home: string | null): RegionTone {
  if (model.leaves) return 'leaves'
  if (model.region && home && model.region.trim().toLowerCase() === home.trim().toLowerCase()) return 'home'
  return 'unknown'
}

export function modelLabel(model: AgentModel): string {
  return model.region ? `${model.name} · ${model.region}` : model.name
}

/** Where the map is, as far as the Agents layer cares. */
export interface LayerFocus {
  on: boolean
  focus: string | null
  /** Where the map was when the layer went on, to go back to. */
  before: string | null
}

/** Turning the layer on remembers where the map was and closes a saved view. Off goes back there. */
export function toggleAgentsLayer(state: LayerFocus): LayerFocus & { closeSavedView: boolean } {
  if (state.on) return { on: false, focus: state.before, before: null, closeSavedView: false }
  return { on: true, focus: null, before: state.focus, closeSavedView: true }
}

/** Showing an agent turns the layer on and opens it. From another view there is no map place to go back to. */
export function showAgentOnLayer(state: LayerFocus, id: string, fromMap: boolean): LayerFocus {
  return { on: true, focus: id, before: state.on ? state.before : fromMap ? state.focus : null }
}

/** The settings form holds text. Lists are written with commas. */
export interface AgentForm {
  list: string
  jobs_key: string
  hand_off_keys: string
  model_calls: string
  asks_you_calls: string
  modules: string
  home_region: string
}

export function toForm(settings: AgentSettings, defaults: AgentSettings): AgentForm {
  const list = (value: string[] | undefined) => (value ?? []).join(', ')
  return {
    list: settings.list ?? '',
    jobs_key: settings.jobs_key ?? defaults.jobs_key ?? '',
    hand_off_keys: list(settings.hand_off_keys ?? defaults.hand_off_keys),
    model_calls: list(settings.model_calls),
    asks_you_calls: list(settings.asks_you_calls),
    modules: list((settings.modules ?? []).map((id) => id.replace(/^module:/, ''))),
    home_region: settings.home_region ?? '',
  }
}

function names(text: string): string[] {
  return [...new Set(text.split(/[\s,]+/).filter(Boolean))]
}

/** What to save. Empty fields are left out, so the backend's defaults apply. */
export function fromForm(form: AgentForm): AgentSettings {
  const settings: AgentSettings = {}
  const text = (value: string) => value.trim()
  if (text(form.list)) settings.list = text(form.list)
  if (text(form.jobs_key)) settings.jobs_key = text(form.jobs_key)
  if (names(form.hand_off_keys).length) settings.hand_off_keys = names(form.hand_off_keys)
  if (names(form.model_calls).length) settings.model_calls = names(form.model_calls)
  if (names(form.asks_you_calls).length) settings.asks_you_calls = names(form.asks_you_calls)
  const modules = names(form.modules).map((path) => `module:${path.replace(/^module:/, '')}`)
  if (modules.length) settings.modules = modules
  if (text(form.home_region)) settings.home_region = text(form.home_region)
  return settings
}

/** The settings with one more module marked as an agent. */
export function markModule(settings: AgentSettings, moduleId: string): AgentSettings {
  return { ...settings, modules: [...new Set([...(settings.modules ?? []), moduleId])] }
}
