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

export interface BuildRead {
  engine: string | null
  schema_files: string[]
  tables: number
  route_style: string
  routes: number
  code_files: number
  links: number
  plans: number
  git: boolean
  unread: { what: string; where: string }[]
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

export function countOf(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

const ENGINES: Record<string, string> = { postgres: 'Postgres', sqlite: 'SQLite' }

/** What a build read, one fact a line, for the status menu. */
export function readLines(read: BuildRead): string[] {
  const lines = [
    read.tables ? `${countOf(read.tables, 'table')} from ${ENGINES[read.engine ?? ''] ?? read.engine}` : 'No tables found',
    read.routes ? `${countOf(read.routes, 'route')}, ${read.route_style}` : 'No routes found',
    `${countOf(read.code_files, 'code file')}, ${countOf(read.links, 'link')}`,
  ]
  if (!read.git) lines.push('No git history, so no churn or worktrees')
  return lines
}

/** The text a row shows beside its status dot. */
export function rowStatus(project: Project): string {
  return project.status === 'current' ? countOf(project.tables, 'table') : statusView(project.status, project.behind, project.ref).label
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

export interface Workspace {
  path: string
  name: string
  /** The project key a build of this repo would write, so a match means it's added already. */
  key: string
  /** False for a folder that shows only because it has a `package.json`. */
  git: boolean
  worktrees: number
  touched: number
}

export interface WorkspaceList {
  folder: string | null
  display: string | null
  repos: Workspace[]
  truncated: boolean
  missing?: boolean
}

function tidy(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/** The folder most recent work sits in, to offer as the default. A tie goes to the latest. */
export function suggestFolder(recent: string[]): string | null {
  const counts = new Map<string, number>()
  for (const raw of recent) {
    const path = tidy(raw)
    const cut = path.lastIndexOf('/')
    if (cut > 0) counts.set(path.slice(0, cut), (counts.get(path.slice(0, cut)) ?? 0) + 1)
  }
  let best: string | null = null
  let most = 0
  for (const [folder, count] of counts) {
    if (count > most) {
      best = folder
      most = count
    }
  }
  return best
}

/** Repos still to add, then repos already added, each narrowed to what was searched for. */
export function splitWorkspaces(rows: Workspace[], projects: Project[], query: string): { toAdd: Workspace[]; added: Workspace[] } {
  const wanted = query.trim().toLowerCase()
  const keys = new Set(projects.map((project) => project.repo_key))
  const hits = rows.filter((row) => row.name.toLowerCase().includes(wanted))
  return { toAdd: hits.filter((row) => !keys.has(row.key)), added: hits.filter((row) => keys.has(row.key)) }
}

/** A long path keeps its end, since that's the part that tells two folders apart. */
export function shortPath(path: string, room = 40): string {
  return path.length > room ? `…${path.slice(1 - room)}` : path
}

/** The search box says how many repos are left to add. */
export function searchLabel(rows: Workspace[], projects: Project[]): string {
  const left = splitWorkspaces(rows, projects, '').toAdd.length
  return left ? `Search ${countOf(left, 'workspace')}` : 'Search workspaces'
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

const LIST_KEY = 'system-map.side-list'

/** The side list steers the canvas, so only views it can steer have one. */
export function hasSideList(view: View): boolean {
  return view === 'map' || view === 'data'
}

/** Hiding the list is one choice for the browser, not one per project. */
export function readListOpen(store: Store): boolean {
  return store.getItem(LIST_KEY) !== 'hidden'
}

export function writeListOpen(store: Store, open: boolean): void {
  store.setItem(LIST_KEY, open ? 'shown' : 'hidden')
}

/** A design chat per project, so one project's talk never reaches another's. */
export function chatSlotName(repoKey: string): string {
  return `system-map-design-${repoKey}`
}

const chatKey = (repoKey: string) => `system-map.chat.${repoKey}`

/** Whether this browser has sent this project's chat anything. */
export function readChatStarted(store: Store, repoKey: string): boolean {
  return store.getItem(chatKey(repoKey)) === 'started'
}

export function writeChatStarted(store: Store, repoKey: string): void {
  store.setItem(chatKey(repoKey), 'started')
}

/** Whether the host's open chats hold a used one for this project. Anything else reads as no. */
export function slotHasMessages(rows: unknown, repoKey: string): boolean {
  if (!Array.isArray(rows)) return false
  const name = chatSlotName(repoKey)
  return rows.some((row: { key?: unknown; messages?: unknown }) => row?.key === name && typeof row.messages === 'number' && row.messages > 0)
}
