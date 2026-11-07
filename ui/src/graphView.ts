import type { SystemEdge, SystemGraph, SystemNode } from './model'

/** One box on the map. */
export interface Card {
  id: string
  kind: string
  title: string
  subtitle?: string
  status?: string
  /** A short flag beside the subtitle, such as `asks you`. */
  badge?: string
  /** Drawn darker, as the models are on the Agents layer. */
  strong?: boolean
}

/** One line on the map, after rolling many links up into one. */
export interface Line {
  id: string
  source: string
  target: string
  kind: string
  count: number
  proposed?: boolean
  /** A model call that leaves the home region. */
  leaves?: boolean
}

/** Services that run in one region, drawn inside one dashed box. */
export interface Band {
  id: string
  label: string
  /** home: the home region. away: another one. unknown: no home region is set. */
  tone: 'home' | 'away' | 'unknown'
  members: string[]
}

export interface MapView {
  cards: Card[]
  lines: Line[]
  /** Thin links left out, so the legend only mentions them when it is true. */
  hidden?: number
  bands?: Band[]
}

export const CARD_WIDTH = 200
export const CARD_HEIGHT = 58
/** Links that only the Agents layer draws. */
export const AGENT_LINKS = new Set(['starts', 'hands_off_to', 'uses_model'])

const UNBUILT = new Set(['planned', 'partial'])
export const GROUP_TABLES = 'group:tables'
export const GROUP_ROUTES = 'group:routes'
export const GROUP_JOBS = 'group:jobs'

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** The number a list shows beside a folder, and what it counts: code files, or test files if it has only tests. */
export function fileCount(node: SystemNode): { count: number; title: string } {
  const files = node.files ?? 0
  const tests = node.test_files ?? 0
  if (files === 0 && tests > 0) return { count: tests, title: count(tests, 'test file', 'test files') }
  return { count: files, title: count(files, 'file', 'files') }
}

/** Code files and lines. A folder of only tests has neither, so it counts its test files. */
function sizeOf(node: SystemNode): string {
  const files = node.files ?? 0
  const tests = node.test_files ?? 0
  if (files === 0 && tests > 0) return count(tests, 'test file', 'test files')
  return `${count(files, 'file', 'files')}, ${count(node.lines ?? 0, 'line', 'lines')}`
}

export function shortPath(path: string): string {
  if (path === '.') return 'root files'
  return path.replace(/^src\//, '')
}

function cardFor(node: SystemNode): Card {
  if (node.status === 'proposed') {
    return { id: node.id, kind: node.kind, title: node.kind === 'module' ? node.name : shortPath(node.path ?? node.name), subtitle: 'proposed', status: 'proposed' }
  }
  switch (node.kind) {
    case 'area':
      return { id: node.id, kind: 'area', title: shortPath(node.path ?? node.name), subtitle: sizeOf(node) }
    case 'module': {
      const top = node.area === `area:${node.path}`
      return {
        id: node.id,
        kind: 'module',
        title: top ? `${node.name} (top level)` : node.name,
        subtitle: sizeOf(node),
      }
    }
    case 'plan':
      return { id: node.id, kind: 'plan', title: node.name, subtitle: `${node.missing} of ${(node.found ?? 0) + (node.missing ?? 0)} missing`, status: node.status }
    case 'route':
      return { id: node.id, kind: 'route', title: node.name, subtitle: node.route_kind === 'api' ? 'API' : 'page' }
    case 'job':
      return { id: node.id, kind: 'job', title: node.name, subtitle: node.schedule }
    case 'service':
      return { id: node.id, kind: 'service', title: node.name, subtitle: 'outside' }
    case 'agent': {
      const jobs = node.jobs?.length ?? 0
      return {
        id: node.id,
        kind: 'agent',
        title: node.label ?? node.name,
        subtitle: `${jobs} ${jobs === 1 ? 'job' : 'jobs'}`,
        status: node.status === 'built' ? undefined : node.status,
        badge: node.asks_you?.length ? 'asks you' : undefined,
      }
    }
    default:
      return { id: node.id, kind: node.kind, title: node.name }
  }
}

function groupCards(system: SystemGraph, tables: number): Card[] {
  const routes = system.nodes.filter((node) => node.kind === 'route')
  const api = routes.filter((route) => route.route_kind === 'api').length
  const jobs = system.nodes.filter((node) => node.kind === 'job').length
  const cards: Card[] = []
  if (routes.length) cards.push({ id: GROUP_ROUTES, kind: 'group', title: 'Routes', subtitle: `${routes.length - api} pages, ${api} API` })
  if (tables) cards.push({ id: GROUP_TABLES, kind: 'group', title: 'Database', subtitle: `${tables} ${tables === 1 ? 'table' : 'tables'}` })
  if (jobs) cards.push({ id: GROUP_JOBS, kind: 'group', title: 'Scheduled jobs', subtitle: `${jobs} jobs` })
  return cards
}

function tableCard(id: string): Card {
  return { id, kind: 'table', title: id.replace(/^table:(public\.)?/, '') }
}

interface Rollup {
  byId: Map<string, SystemNode>
  /** The area whose modules stay separate. */
  open: string | null
  /** A group whose members stay separate. */
  expanded: string | null
  /** The folder of route files, which Routes already stands for. */
  routesDir: string | null
}

/** At the top level, links this thin are noise. Opening an area shows them all. */
const WEAK_IMPORTS = 3
/** With this few links nothing is crowded, and each one tells you something. */
const FEW_LINES = 24

function inRoutes(path: string | undefined, routesDir: string | null): boolean {
  return Boolean(path && routesDir && (path === routesDir || path.startsWith(`${routesDir}/`)))
}

function display(id: string, rollup: Rollup): string | null {
  if (id.startsWith('table:')) return GROUP_TABLES
  const node = rollup.byId.get(id)
  if (!node) return null
  // Something proposed stays its own card, so a what-if never hides inside a group.
  if (node.status === 'proposed') return id
  if ((node.kind === 'module' || node.kind === 'area') && inRoutes(node.path, rollup.routesDir)) return GROUP_ROUTES
  if (node.kind === 'module') return node.area === rollup.open ? id : (node.area ?? id)
  if (node.kind === 'route') return rollup.expanded === GROUP_ROUTES ? id : GROUP_ROUTES
  if (node.kind === 'job') return rollup.expanded === GROUP_JOBS ? id : GROUP_JOBS
  return id
}

function isHiddenPlan(node: SystemNode | undefined, showPlans: boolean): boolean {
  return node?.kind === 'plan' && (!showPlans || !UNBUILT.has(node.status))
}

/** Merge every link between two boxes into one line, adding up its count. */
function rollLines(system: SystemGraph, rollup: Rollup, showPlans: boolean, keep: (source: string, target: string) => boolean): Line[] {
  const merged = new Map<string, Line>()
  for (const edge of system.edges) {
    if (isHiddenPlan(rollup.byId.get(edge.source), showPlans)) continue
    const source = display(edge.source, rollup)
    const target = display(edge.target, rollup)
    if (!source || !target || source === target || !keep(source, target)) continue
    const id = `${source}|${target}|${edge.kind}`
    const line = merged.get(id)
    if (line) line.count += edge.count
    else merged.set(id, { id, source, target, kind: edge.kind, count: edge.count, proposed: edge.proposed })
  }
  return [...merged.values()]
}

function cardsFor(ids: Set<string>, rollup: Rollup, groups: Card[]): Card[] {
  const cards: Card[] = []
  for (const id of ids) {
    const group = groups.find((card) => card.id === id)
    const node = rollup.byId.get(id)
    if (group) cards.push(group)
    else if (node) cards.push(cardFor(node))
    else if (id.startsWith('table:')) cards.push(tableCard(id))
  }
  return cards
}

/** Everything at the top: areas, routes, the database, services, unbuilt plans. */
function systemLevel(system: SystemGraph, rollup: Rollup, tables: number, showPlans: boolean): MapView {
  const groups = groupCards(system, tables)
  const every = rollLines(system, rollup, showPlans, () => true)
  const lines = every.length <= FEW_LINES ? every : every.filter((line) => line.kind !== 'imports' || line.count >= WEAK_IMPORTS)
  const ids = new Set<string>(groups.map((card) => card.id))
  for (const node of system.nodes) {
    if (node.kind === 'area' && !inRoutes(node.path, rollup.routesDir)) ids.add(node.id)
    if (node.kind === 'service') ids.add(node.id)
    if (node.kind === 'plan' && !isHiddenPlan(node, showPlans)) ids.add(node.id)
    if (node.status === 'proposed') ids.add(node.id)
  }
  return { cards: cardsFor(ids, rollup, groups), lines: lines.filter((line) => ids.has(line.source) && ids.has(line.target)), hidden: every.length - lines.length }
}

/**
 * One area open: its modules, and the outside things they use. Links to other areas are
 * left to the top level, because here they would swamp the area's own shape.
 */
function areaLevel(system: SystemGraph, rollup: Rollup, tables: number, showPlans: boolean): MapView {
  const inside = new Set(system.nodes.filter((node) => node.area === rollup.open && node.kind === 'module').map((node) => node.id))
  const lines = rollLines(
    system,
    rollup,
    showPlans,
    (source, target) => (inside.has(source) || inside.has(target)) && !source.startsWith('area:') && !target.startsWith('area:'),
  )
  const ids = new Set<string>(inside)
  for (const line of lines) {
    ids.add(line.source)
    ids.add(line.target)
  }
  return { cards: cardsFor(ids, rollup, groupCards(system, tables)), lines }
}

/** One group open: each route or job, and the areas it reaches. */
function groupLevel(system: SystemGraph, rollup: Rollup, tables: number, showPlans: boolean): MapView {
  const kind = rollup.expanded === GROUP_ROUTES ? 'route' : 'job'
  const members = new Set(system.nodes.filter((node) => node.kind === kind).map((node) => node.id))
  const lines = rollLines(system, rollup, showPlans, (source, target) => members.has(source) || members.has(target))
  const ids = new Set<string>(members)
  for (const line of lines) {
    ids.add(line.source)
    ids.add(line.target)
  }
  return { cards: cardsFor(ids, rollup, groupCards(system, tables)), lines }
}

/** One thing and all it directly touches, with nothing rolled up. */
function neighborhood(system: SystemGraph, rollup: Rollup, focus: string): MapView {
  const lines: Line[] = []
  const ids = new Set<string>([focus])
  for (const edge of system.edges) {
    if (edge.source !== focus && edge.target !== focus) continue
    ids.add(edge.source)
    ids.add(edge.target)
    lines.push({ id: `${edge.source}|${edge.target}|${edge.kind}`, source: edge.source, target: edge.target, kind: edge.kind, count: edge.count })
  }
  return { cards: cardsFor(ids, rollup, []), lines }
}

/** A saved view: only the nodes it names, and the links between them, with nothing rolled up. */
export function savedView(system: SystemGraph, only: string[], tables: number): MapView {
  const byId = new Map(system.nodes.map((node) => [node.id, node]))
  const ids = new Set(only)
  const lines = new Map<string, Line>()
  for (const edge of system.edges) {
    if (!ids.has(edge.source) || !ids.has(edge.target)) continue
    const id = `${edge.source}|${edge.target}|${edge.kind}`
    lines.set(id, { id, source: edge.source, target: edge.target, kind: edge.kind, count: edge.count, proposed: edge.proposed })
  }
  const rollup: Rollup = { byId, open: null, expanded: null, routesDir: null }
  return { cards: cardsFor(ids, rollup, groupCards(system, tables)), lines: [...lines.values()] }
}

function routesFolder(system: SystemGraph): string | null {
  if (system.routes_dir) return system.routes_dir
  const route = system.nodes.find((node) => node.kind === 'route')
  const file = route?.evidence[0]
  return file ? file.slice(0, file.lastIndexOf('/')) : null
}

/** Today's map without agents, which only the Agents layer draws. */
function withoutAgents(system: SystemGraph): SystemGraph {
  const agents = new Set(system.nodes.filter((node) => node.kind === 'agent').map((node) => node.id))
  if (agents.size === 0) return system
  const keep = (edge: SystemEdge) => !AGENT_LINKS.has(edge.kind) && !agents.has(edge.source) && !agents.has(edge.target)
  return { ...system, nodes: system.nodes.filter((node) => !agents.has(node.id)), edges: system.edges.filter(keep) }
}

function sameRegion(one: string, other: string): boolean {
  return one.trim().toLowerCase() === other.trim().toLowerCase()
}

/** The Agents layer: each agent, what starts it, who it hands work to, and the models it uses, by region. */
export function agentsView(system: SystemGraph): MapView {
  const byId = new Map(system.nodes.map((node) => [node.id, node]))
  const agents = system.nodes.filter((node) => node.kind === 'agent').map((node) => node.id)
  const ids = new Set(agents)
  const lines = new Map<string, Line>()
  for (const edge of system.edges) {
    if (!AGENT_LINKS.has(edge.kind) || !(byId.has(edge.source) && byId.has(edge.target))) continue
    if (!agents.includes(edge.source) && !agents.includes(edge.target)) continue
    ids.add(edge.source)
    ids.add(edge.target)
    const id = `${edge.source}|${edge.target}|${edge.kind}`
    const found = lines.get(id)
    if (found) found.count += edge.count
    else lines.set(id, { id, source: edge.source, target: edge.target, kind: edge.kind, count: edge.count, leaves: edge.leaves_region || undefined })
  }
  const home = system.home_region ?? null
  // One band per region, whatever its case: "US" and "us" are one place, named as first written.
  const regions = new Map<string, { region: string; members: string[] }>()
  const cards = [...ids].map((id) => {
    const node = byId.get(id) as SystemNode
    if (node.kind !== 'service') return cardFor(node)
    if (node.region) {
      const key = node.region.trim().toLowerCase()
      const band = regions.get(key) ?? { region: node.region.trim(), members: [] }
      regions.set(key, { ...band, members: [...band.members, id] })
    }
    return { ...cardFor(node), subtitle: node.region ?? 'no region set', strong: true }
  })
  const bands: Band[] = [...regions].map(([key, { region, members }]) => {
    const tone = !home ? 'unknown' : sameRegion(region, home) ? 'home' : 'away'
    return { id: `band:${key}`, label: tone === 'home' ? `${region} · home` : region, tone, members }
  })
  return { cards, lines: [...lines.values()], bands }
}

export function buildView(system: SystemGraph, requested: string | null, tables: number, showPlans: boolean, showAgents = false): MapView {
  if (showAgents) return agentsView(system)
  system = withoutAgents(system)
  const byId = new Map(system.nodes.map((node) => [node.id, node]))
  const routesDir = routesFolder(system)
  // The routes folder and the Routes group are one thing.
  const focus = requested === `area:${routesDir}` ? GROUP_ROUTES : requested
  const open = focus?.startsWith('area:') ? focus : null
  const expanded = focus === GROUP_ROUTES || focus === GROUP_JOBS ? focus : null
  const rollup: Rollup = { byId, open, expanded, routesDir }
  if (!focus) return systemLevel(system, rollup, tables, showPlans)
  if (open) return areaLevel(system, rollup, tables, showPlans)
  if (expanded) return groupLevel(system, rollup, tables, showPlans)
  return neighborhood(system, rollup, focus)
}

/** The trail from the top of the map down to the focus. With the Agents layer, it starts at Agents. */
export function trailFor(system: SystemGraph, focus: string | null, agents = false): { id: string | null; label: string }[] {
  const trail: { id: string | null; label: string }[] = [{ id: null, label: agents ? 'Agents' : 'System' }]
  if (!focus) return trail
  if (agents) {
    const node = system.nodes.find((item) => item.id === focus)
    return node ? [...trail, { id: focus, label: node.label ?? node.name }] : trail
  }
  if (focus === GROUP_ROUTES || focus === `area:${routesFolder(system)}`) return [...trail, { id: focus, label: 'Routes' }]
  if (focus === GROUP_JOBS) return [...trail, { id: focus, label: 'Scheduled jobs' }]
  if (focus.startsWith('table:')) return [...trail, { id: focus, label: focus.replace(/^table:(public\.)?/, '') }]
  const node = system.nodes.find((item) => item.id === focus)
  if (!node) return trail
  if (node.kind === 'area') return [...trail, { id: focus, label: shortPath(node.path ?? node.name) }]
  if (node.kind === 'module') {
    const area = system.nodes.find((item) => item.id === node.area)
    return [
      ...trail,
      { id: node.area ?? null, label: shortPath(area?.path ?? '') },
      { id: focus, label: node.name },
    ]
  }
  if (node.kind === 'route') return [...trail, { id: GROUP_ROUTES, label: 'Routes' }, { id: focus, label: node.name }]
  if (node.kind === 'job') return [...trail, { id: GROUP_JOBS, label: 'Scheduled jobs' }, { id: focus, label: node.name }]
  return [...trail, { id: focus, label: node.name }]
}
