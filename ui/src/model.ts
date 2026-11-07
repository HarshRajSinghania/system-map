import { useAppApi } from '@kirocrew/app-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { plainError } from './errors'
import type { BuildRead, Project } from './projects'

export const BASE = '/apps/system-map/api'

export interface TableRow {
  id: string
  name: string
  columns: number
  foreign_keys: number
  policies: number
  rls: boolean
}

export interface Freshness {
  ref: string
  stale: boolean
  map_stale: boolean
  commits_behind: number
  changed_inputs?: string[]
  missing?: boolean
  error?: string
}

export interface Overview {
  manifest: {
    repo: string
    repo_key: string
    ref: string
    commit: string | null
    engine: string | null
    read?: BuildRead
    version: string
    built_at: number
    counts: {
      tables: number
      columns: number
      findings: Record<Severity, number>
    }
  }
  freshness: Freshness
  tables: TableRow[]
}

export type Severity = 'high' | 'medium' | 'low' | 'info'

export interface Finding {
  id: string
  check: string
  severity: Severity
  node: string
  title: string
  detail: string
  evidence: string[]
}

export interface Column {
  name: string
  type: string
  nullable: boolean
  default: string | null
  source: string
}

export interface Constraint {
  name: string
  kind: string
  columns: string[]
  references?: string
  on_delete?: string
  expression?: string
  source: string
}

export interface TableNode {
  id: string
  name: string
  schema: string
  source: string
  rls: boolean
  columns: Column[]
  constraints: Constraint[]
  indexes: { name: string; columns: string[]; unique: boolean; partial: boolean; source: string }[]
  policies: { name: string; command: string; roles: string[]; source: string }[]
  triggers: { name: string; timing: string; events: string[]; function: string | null; source: string }[]
  reads: { text: string; evidence: string[] }[]
  findings: Finding[]
}

export interface GraphColumn {
  name: string
  type: string
  nullable: boolean
  primary: boolean
  foreign: boolean
  proposed?: boolean
}

export interface GraphTable {
  id: string
  name: string
  status: string
  rls: boolean | null
  columns: GraphColumn[]
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  columns: string[]
  on_delete: string
}

export interface Graph {
  tables: GraphTable[]
  edges: GraphEdge[]
}

export type PlanStatus = 'built' | 'partial' | 'planned' | 'unclear'

export interface Claim {
  claim: string
  found: boolean
  where: string
  source: string
}

export interface SystemNode {
  id: string
  kind: string
  name: string
  status: string
  path?: string
  area?: string | null
  files?: number
  lines?: number
  test_files?: number
  route_kind?: string
  schedule?: string
  found?: number
  missing?: number
  evidence: string[]
  /** An agent's own name for itself, and what it says it does. */
  label?: string
  description?: string
  jobs?: string[]
  /** Lines where an agent waits for a person. */
  asks_you?: string[]
  leaves_region?: string[]
  /** Where a person said a service runs. */
  region?: string
}

export interface Plan extends SystemNode {
  status: PlanStatus
  status_source: string
  found: number
  missing: number
  claims: Claim[]
  path: string
}

export interface SystemEdge {
  source: string
  target: string
  kind: string
  count: number
  access?: string
  proposed?: boolean
  /** A model call to a service outside the home region. */
  leaves_region?: boolean
  evidence: string[]
}

export interface SystemGraph {
  nodes: SystemNode[]
  edges: SystemEdge[]
  routes_dir?: string
  home_region?: string | null
}

export interface Link {
  node: string
  count: number
  access?: string
  evidence: string[]
}

/** One link of an agent's, with the line that proves it. */
export interface AgentLink {
  node: string
  evidence: string
}

export interface AgentModel {
  node: string
  name: string
  region: string | null
  /** Runs outside the home region. */
  leaves: boolean
  evidence: string
}

export type AgentStatus = 'built' | 'planned' | 'empty'

export interface AgentRow {
  id: string
  name: string
  label: string
  description: string
  status: AgentStatus
  jobs: string[]
  path: string
  module: string
  source: 'list' | 'module'
  evidence: string[]
  /** Lines where it waits for a person. */
  asks_you: string[]
  leaves_region: string[]
  starts: AgentLink[]
  hands_off_to: AgentLink[]
  handed_by: AgentLink[]
  models: AgentModel[]
}

export interface AgentSettings {
  list?: string
  jobs_key?: string
  hand_off_keys?: string[]
  /** Functions whose first argument names the agent to start. */
  hand_off_calls?: string[]
  model_calls?: string[]
  asks_you_calls?: string[]
  modules?: string[]
  home_region?: string
}

export interface AgentState {
  agents: AgentRow[]
  settings: AgentSettings
  defaults: AgentSettings
  home_region: string | null
  /** Modules that call a model: where to look when nothing points at agents yet. */
  suggestions: string[]
}

export type AgentSettingKey = keyof AgentSettings

/** One agent that a draft's settings found, in short. */
export interface DraftAgent {
  id: string
  label: string
  status: AgentStatus
  starts: string[]
  hands_off_to: string[]
  models: string[]
  asks_you: boolean
  leaves_region: string[]
}

/** Agent settings the Design chat drafted. Only a person uses them. */
export interface AgentDraft {
  /** Using or dropping names this, so a person only acts on the draft they saw. */
  id: string
  settings: AgentSettings
  /** Each setting's `path:line` lines that show it. */
  evidence: Partial<Record<AgentSettingKey, string[]>>
  note: string
  commit: string | null
  ref: string
  drafted_at: number
  count: number
  agents: DraftAgent[]
}

export interface AgentDraftState {
  draft: AgentDraft | null
  /** The settings that using the draft would change. */
  changed: AgentSettingKey[]
  /** The model has moved on since the draft was made. */
  stale: boolean
}

export interface RiskRow {
  id?: string
  path: string
  name?: string
  module?: string
  area?: string
  files?: number
  lines: number
  complexity: number
  commits: number
  tests?: number
  reached_files?: number
  /** Share of lines the tests ran, from a report. Null when no report is loaded. */
  covered: number | null
  branches: number | null
  /** The share used to judge it: `covered`, or how much tests reach with no report. */
  cover: number
  hot: boolean
  untested: boolean
  score: number
  ui?: boolean
  in_report?: boolean
}

export interface CoverageInfo {
  report: string
  commit: string | null
  loaded_at: number
  lines_total: number
  lines_hit: number
  branches_total: number
  branches_hit: number
  unmatched: number
  files_changed_since: number | null
}

export interface Risk {
  window_days: number
  history_known: boolean
  shallow: boolean
  test_files: number
  coverage: CoverageInfo | null
  files: RiskRow[]
  modules: RiskRow[]
  areas: RiskRow[]
}

export interface NodeRisk extends RiskRow {
  window_days: number
  worst_files: Pick<RiskRow, 'path' | 'commits' | 'complexity' | 'tests' | 'covered' | 'score'>[]
}

export interface Worktree {
  path: string
  /** The path to show a person, with the home folder as `~`. */
  display_path?: string
  branch: string
  name: string
  head: string
  readable: boolean
  ahead: number
  behind: number
  uncommitted_files: number
  files: string[]
  modules: string[]
  tables_schema: string[]
  tables_code: string[]
  other_nodes: string[]
}

export interface Overlap {
  a: string
  b: string
  severity: Severity
  summary: string
  conflicts: string[]
  merge: 'clean' | 'conflict' | 'uncommitted' | 'unknown' | 'not needed'
  uncommitted: string[]
  files: string[]
  schema: string[]
  schema_and_code: string[]
  code: string[]
  modules: string[]
}

export interface WorktreeState {
  ref: string
  commit: string
  worktrees: Worktree[]
  overlaps: Overlap[]
  by_node: Record<string, string[]>
  counts: Record<Severity, number>
}

export type LimitKind = 'refused' | 'breaks' | 'cannot_support' | 'advice'

export interface Limit {
  check: string
  kind: LimitKind
  severity: Severity
  node: string
  title: string
  detail: string
  evidence: string[]
}

export interface DiffRow {
  id: string
  kind?: string
  name?: string
  what?: string[]
  because?: string[]
  access?: string
}

export interface ProposalRow {
  id: string
  title: string
  why: string
  status: 'draft' | 'accepted' | 'dropped'
  limits: Record<LimitKind, number>
  diff: { added: number; changed: number; removed: number; touched: number }
}

export interface Proposal extends Omit<ProposalRow, 'limits' | 'diff'> {
  limits: Limit[]
  counts: Record<LimitKind, number>
  diff: { added: DiffRow[]; changed: DiffRow[]; removed: DiffRow[]; touched: DiffRow[] }
  sql: { change: number; sql: string[] }[]
  limits_checked?: boolean
  overlay: { nodes: SystemNode[]; edges: SystemEdge[] }
  graph: Graph
  closes: { id: string; title: string; before: number; after: number }[]
}

export interface Gap {
  check: string
  severity: Severity
  node: string
  title: string
  detail: string
  evidence: string[]
}

export interface UseCasePart {
  id: string
  kind: string
  exists: boolean
  tests?: number
  test_files?: string[]
  browser_tests?: string[]
  covered?: number | null
  writers?: string[]
  readers?: string[]
}

export interface UseCase {
  id: string
  title: string
  actor: string
  goal: string
  parts: UseCasePart[]
  gaps: Gap[]
  state: 'ready' | 'gaps' | 'missing'
}

export interface SavedView {
  id: string
  title: string
  note: string
  level: 'map' | 'data'
  layout: 'left-right' | 'top-down'
  overlays: { risk: boolean; worktrees: boolean; plans: boolean }
  proposal: string | null
  resolved: string[]
  missing: string[]
}

export interface ExploreData {
  proposals: ProposalRow[]
  use_cases: UseCase[]
  views: SavedView[]
}

export type NodeInfo = SystemNode & { links?: Record<string, Link[]>; risk?: NodeRisk }

export function withRepo(path: string, repo: string | null): string {
  if (!repo) return `${BASE}${path}`
  return `${BASE}${path}${path.includes('?') ? '&' : '?'}repo=${encodeURIComponent(repo)}`
}

/** `failed` tells a load that went wrong from one that hasn't finished. */
export interface Loaded<T> {
  value: T | null
  failed: boolean
}

const CHOSEN_REPO = 'system-map.repo'
const CHOSEN_EVENT = 'system-map:project'

/** Which project to show: the last one chosen here, or else the first. The page and panel share it. */
export function useActiveRepo() {
  const api = useAppApi()
  const [repos, setRepos] = useState<Project[]>([])
  const [loaded, setLoaded] = useState(false)
  const [chosen, setChosen] = useState<string | null>(() => localStorage.getItem(CHOSEN_REPO))

  const reload = useCallback(async () => {
    try {
      const reply = await api.get<{ repos: Project[] }>(`${BASE}/repos`)
      setRepos(reply.repos)
    } catch {
      setRepos([])
    } finally {
      setLoaded(true)
    }
  }, [api])

  useEffect(() => {
    void reload()
  }, [reload])

  useEffect(() => {
    const follow = () => {
      setChosen(localStorage.getItem(CHOSEN_REPO))
      void reload()
    }
    window.addEventListener(CHOSEN_EVENT, follow)
    return () => window.removeEventListener(CHOSEN_EVENT, follow)
  }, [reload])

  const choose = useCallback((key: string) => {
    localStorage.setItem(CHOSEN_REPO, key)
    window.dispatchEvent(new Event(CHOSEN_EVENT))
  }, [])

  const active = repos.find((item) => item.repo_key === chosen)?.repo_key ?? repos[0]?.repo_key ?? null
  return { repos, active, loaded, choose, reload }
}

export function useOverview(repo: string | null) {
  const api = useAppApi()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const latest = useRef<string | null>(repo)
  latest.current = repo

  const refresh = useCallback(async () => {
    if (!repo) {
      setOverview(null)
      return
    }
    try {
      const reply = await api.get<Overview>(withRepo('/overview', repo))
      if (latest.current !== repo) return
      setOverview(reply)
      setError(null)
    } catch (caught) {
      if (latest.current !== repo) return
      setOverview(null)
      setError(plainError(caught, 'load this project'))
    }
  }, [api, repo])

  useEffect(() => {
    setError(null)
    void refresh()
  }, [refresh])

  // A reply belongs to the project it came from, so an old one never shows under a new name.
  return { overview: overview?.manifest.repo_key === repo ? overview : null, error, refresh }
}

/** Load something that only changes when `version` does. */
export function useVersioned<T>(path: string, repo: string | null, version: string | undefined): Loaded<T> {
  const api = useAppApi()
  const [held, setHeld] = useState<{ repo: string | null; value: T | null; failed: boolean }>({ repo, value: null, failed: false })
  useEffect(() => {
    if (!version) return
    let live = true
    api
      .get<T>(withRepo(path, repo))
      .then((reply) => {
        if (live) setHeld({ repo, value: reply, failed: false })
      })
      .catch(() => {
        if (live) setHeld({ repo, value: null, failed: true })
      })
    return () => {
      live = false
    }
  }, [api, path, repo, version])
  return held.repo === repo ? { value: held.value, failed: held.failed } : { value: null, failed: false }
}


/** Load one proposal with its diff and limits. Change `tick` to load it again. */
export function useProposal(id: string | null, repo: string | null, tick: number): Proposal | null {
  const api = useAppApi()
  const [proposal, setProposal] = useState<Proposal | null>(null)

  useEffect(() => {
    if (!id) {
      setProposal(null)
      return
    }
    let live = true
    api
      .get<Proposal>(withRepo(`/proposal?id=${encodeURIComponent(id)}`, repo))
      .then((value) => {
        if (live) setProposal(value)
      })
      .catch(() => {
        if (live) setProposal(null)
      })
    return () => {
      live = false
    }
  }, [api, id, repo, tick])

  return proposal
}

/** Load something that changes on its own, and keep it current while the page is in view. */
export function useLive<T>(path: string, repo: string | null, everyMs: number) {
  const api = useAppApi()
  const [held, setHeld] = useState<{ repo: string | null; value: T | null; failed: boolean }>({ repo, value: null, failed: false })
  const [checkedAt, setCheckedAt] = useState<number | null>(null)
  const latest = useRef<string | null>(repo)
  latest.current = repo

  /** Resolves to what it read, or null when it read nothing for this repo. */
  const refresh = useCallback(async (): Promise<T | null> => {
    if (!repo) return null
    try {
      const reply = await api.get<T>(withRepo(path, repo))
      if (latest.current !== repo) return null
      setHeld({ repo, value: reply, failed: false })
      setCheckedAt(Date.now())
      return reply
    } catch {
      if (latest.current === repo) setHeld({ repo, value: null, failed: true })
      return null
    }
  }, [api, path, repo])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, everyMs)
    return () => window.clearInterval(timer)
  }, [refresh, everyMs])

  const current = held.repo === repo
  return { value: current ? held.value : null, failed: current && held.failed, checkedAt, refresh }
}

/** Load one node. A new `version` loads it again, as after a rebuild or a region you set. */
export function useNode<T = TableNode>(id: string | null, repo: string | null = null, version?: string) {
  const api = useAppApi()
  const [node, setNode] = useState<T | null>(null)

  useEffect(() => {
    if (!id) {
      setNode(null)
      return
    }
    let live = true
    api
      .get<T>(withRepo(`/node?id=${encodeURIComponent(id)}`, repo))
      .then((value) => {
        if (live) setNode(value)
      })
      .catch(() => {
        if (live) setNode(null)
      })
    return () => {
      live = false
    }
  }, [api, id, repo, version])

  return node
}
