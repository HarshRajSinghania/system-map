// What the project menu, status chip and view memory need, kept free of React so tests can reach it.

export type ProjectStatus = 'current' | 'behind' | 'stale' | 'missing' | 'unknown'

export interface Project {
  repo: string
  repo_key: string
  name: string
  parent: string
  ref: string
  commit: string
  built_at: number
  tables: number
  status: ProjectStatus
  behind: number
  intent: { proposals: number; use_cases: number; views: number }
}

export interface Freshness {
  ref: string
  stale: boolean
  map_stale: boolean
  commits_behind: number
  missing?: boolean
  error?: string
}

export const VIEWS = ['map', 'data', 'plan', 'risk', 'worktrees', 'findings', 'explore'] as const
export type View = (typeof VIEWS)[number]

export type Tone = 'ok' | 'warn' | 'err' | 'muted'

export interface StatusView {
  tone: Tone
  label: string
  detail: string
  /** Rebuilding is the next step, so offer it without opening anything. */
  rebuild: boolean
}

/** Read the same status the backend gives a project row. */
export function statusOf(fresh: Freshness): ProjectStatus {
  if (fresh.missing) return 'missing'
  if (fresh.error) return 'unknown'
  if (fresh.stale || fresh.map_stale) return 'stale'
  return fresh.commits_behind > 0 ? 'behind' : 'current'
}

export function statusView(status: ProjectStatus, behind: number, ref: string): StatusView {
  switch (status) {
    case 'current':
      return { tone: 'ok', label: 'Current', detail: `Current with ${ref}`, rebuild: false }
    case 'behind':
      return {
        tone: 'muted',
        label: `${behind} behind`,
        detail: `${behind} ${behind === 1 ? 'commit' : 'commits'} behind ${ref}, and none change the model`,
        rebuild: false,
      }
    case 'stale':
      return { tone: 'warn', label: 'Out of date', detail: `${ref} has changes the model doesn't show yet`, rebuild: true }
    case 'missing':
      return { tone: 'err', label: 'Folder missing', detail: 'The folder for this project is gone', rebuild: false }
    case 'unknown':
      return { tone: 'muted', label: "Can't check", detail: `Couldn't compare the model with ${ref}`, rebuild: false }
  }
}

/** The text a row shows beside its status dot. */
export function rowStatus(project: Project): string {
  return project.status === 'current' ? `${project.tables} tables` : statusView(project.status, project.behind, project.ref).label
}

/** Two folders can share a name. Those rows also say which folder they sit in. */
export function rowHint(project: Project, all: Project[]): string | null {
  const twins = all.filter((other) => other.name === project.name)
  return twins.length > 1 ? project.parent : null
}

export function filterProjects(rows: Project[], query: string): Project[] {
  const wanted = query.trim().toLowerCase()
  if (!wanted) return rows
  return rows.filter((row) => row.name.toLowerCase().includes(wanted) || row.repo.toLowerCase().includes(wanted))
}

export interface RecentFolder {
  path: string
  name: string
  parent: string
}

function tidy(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/** Folders the person has worked in lately, leaving out ones that are projects already. */
export function recentToAdd(recent: string[], rows: Project[]): RecentFolder[] {
  const added = new Set(rows.map((row) => tidy(row.repo)))
  const seen = new Set<string>()
  const found: RecentFolder[] = []
  for (const raw of recent) {
    const path = tidy(raw)
    if (added.has(path) || seen.has(path)) continue
    seen.add(path)
    const parts = path.split('/').filter(Boolean)
    found.push({ path, name: parts[parts.length - 1] ?? path, parent: parts[parts.length - 2] ?? '' })
  }
  return found
}

/** What removing a project deletes, in words. Empty when it holds no saved work. */
export function removalWarning(intent: Project['intent']): string {
  const parts = [
    [intent.proposals, 'proposal', 'proposals'],
    [intent.use_cases, 'use case', 'use cases'],
    [intent.views, 'saved view', 'saved views'],
  ] as const
  const named = parts.filter(([count]) => count > 0).map(([count, one, many]) => `${count} ${count === 1 ? one : many}`)
  if (named.length === 0) return ''
  if (named.length === 1) return named[0]
  return `${named.slice(0, -1).join(', ')} and ${named[named.length - 1]}`
}

export function builtAgo(builtAt: number, nowSeconds: number): string {
  const seconds = Math.max(0, nowSeconds - builtAt)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

type Store = Pick<Storage, 'getItem' | 'setItem'>

const viewKey = (repoKey: string) => `system-map.view.${repoKey}`

/** Each project remembers its own view. Anything unknown falls back to the map. */
export function readView(store: Store, repoKey: string | null): View {
  if (!repoKey) return 'map'
  const saved = store.getItem(viewKey(repoKey))
  return VIEWS.find((view) => view === saved) ?? 'map'
}

export function writeView(store: Store, repoKey: string, view: View): void {
  store.setItem(viewKey(repoKey), view)
}

/** A design chat per project, so one project's talk never reaches another's. */
export function chatSlotName(repoKey: string): string {
  return `system-map-design-${repoKey}`
}
