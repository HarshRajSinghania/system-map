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

/** Load something that only changes when the model's version does. */
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

export function useNode(id: string | null, repo: string | null = null) {
  const api = useAppApi()
  const [node, setNode] = useState<TableNode | null>(null)

  useEffect(() => {
    if (!id) {
      setNode(null)
      return
    }
    let live = true
    api
      .get<TableNode>(withRepo(`/node?id=${encodeURIComponent(id)}`, repo))
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
