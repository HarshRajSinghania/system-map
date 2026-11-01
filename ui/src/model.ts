import { useAppApi } from '@kirocrew/app-sdk'
import { useCallback, useEffect, useState } from 'react'

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
  error?: string
}

export interface Overview {
  manifest: {
    repo: string
    repo_key: string
    ref: string
    commit: string
    version: string
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
  evidence: string[]
}

export interface SystemGraph {
  nodes: SystemNode[]
  edges: SystemEdge[]
}

export interface Link {
  node: string
  count: number
  access?: string
  evidence: string[]
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

const CHOSEN_REPO = 'system-map.repo'

/** Which repo to show: the last one chosen here, or else the first model. */
export function useActiveRepo() {
  const api = useAppApi()
  const [repos, setRepos] = useState<{ repo: string; repo_key: string }[]>([])
  const [loaded, setLoaded] = useState(false)
  const [chosen, setChosen] = useState<string | null>(() => localStorage.getItem(CHOSEN_REPO))

  const reload = useCallback(async () => {
    try {
      const reply = await api.get<{ repos: { repo: string; repo_key: string }[] }>(`${BASE}/repos`)
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

  const choose = useCallback((key: string) => {
    localStorage.setItem(CHOSEN_REPO, key)
    setChosen(key)
  }, [])

  const active = repos.find((item) => item.repo_key === chosen)?.repo_key ?? repos[0]?.repo_key ?? null
  return { repos, active, loaded, choose, reload }
}

export function useOverview(repo: string | null) {
  const api = useAppApi()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!repo) {
      setOverview(null)
      return
    }
    try {
      setOverview(await api.get<Overview>(withRepo('/overview', repo)))
      setError(null)
    } catch (caught) {
      setOverview(null)
      setError(String(caught))
    }
  }, [api, repo])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { overview, error, refresh }
}

/** Load something that only changes when `version` does. */
export function useVersioned<T>(path: string, repo: string | null, version: string | undefined): T | null {
  const api = useAppApi()
  const [value, setValue] = useState<T | null>(null)
  useEffect(() => {
    if (!version) return
    let live = true
    api
      .get<T>(withRepo(path, repo))
      .then((reply) => {
        if (live) setValue(reply)
      })
      .catch(() => {
        if (live) setValue(null)
      })
    return () => {
      live = false
    }
  }, [api, path, repo, version])
  return value
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
  const [value, setValue] = useState<T | null>(null)
  const [checkedAt, setCheckedAt] = useState<number | null>(null)

  const refresh = useCallback(async () => {
    if (!repo) return
    try {
      setValue(await api.get<T>(withRepo(path, repo)))
      setCheckedAt(Date.now())
    } catch {
      setValue(null)
    }
  }, [api, path, repo])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, everyMs)
    return () => window.clearInterval(timer)
  }, [refresh, everyMs])

  return { value, checkedAt, refresh }
}

export function useNode<T = TableNode>(id: string | null, repo: string | null = null) {
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
  }, [api, id, repo])

  return node
}
