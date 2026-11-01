import type { SystemGraph, SystemNode } from './model'

/** One box on the map. */
export interface Card {
  id: string
  kind: string
  title: string
  subtitle?: string
  status?: string
}

/** One line on the map, after rolling many links up into one. */
export interface Line {
  id: string
  source: string
  target: string
  kind: string
  count: number
  proposed?: boolean
}

export interface MapView {
  cards: Card[]
  lines: Line[]
}

const UNBUILT = new Set(['planned', 'partial'])
export const GROUP_TABLES = 'group:tables'
export const GROUP_ROUTES = 'group:routes'
export const GROUP_JOBS = 'group:jobs'

export function shortPath(path: string): string {
  return path.replace(/^src\//, '')
}

function cardFor(node: SystemNode): Card {
  if (node.status === 'proposed') {
    return { id: node.id, kind: node.kind, title: node.kind === 'module' ? node.name : shortPath(node.path ?? node.name), subtitle: 'proposed', status: 'proposed' }
  }
  switch (node.kind) {
    case 'area':
      return { id: node.id, kind: 'area', title: shortPath(node.path ?? node.name), subtitle: `${node.files} files, ${node.lines} lines` }
    case 'module': {
      const top = node.area === `area:${node.path}`
      return {
        id: node.id,
        kind: 'module',
        title: top ? `${node.name} (top level)` : node.name,
        subtitle: `${node.files} files, ${node.lines} lines`,
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

function display(id: string, rollup: Rollup): string | null {
  if (id.startsWith('table:')) return GROUP_TABLES
  const node = rollup.byId.get(id)
  if (!node) return null
  // Something proposed stays its own card, so a what-if never hides inside a group.
  if (node.status === 'proposed') return id
  if ((node.kind === 'module' || node.kind === 'area') && rollup.routesDir && node.path === rollup.routesDir) {
    return GROUP_ROUTES
  }
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
  const lines = rollLines(system, rollup, showPlans, () => true).filter((line) => line.kind !== 'imports' || line.count >= WEAK_IMPORTS)
  const ids = new Set<string>(groups.map((card) => card.id))
  for (const node of system.nodes) {
    if (node.kind === 'area' && node.path !== rollup.routesDir) ids.add(node.id)
    if (node.kind === 'service') ids.add(node.id)
    if (node.kind === 'plan' && !isHiddenPlan(node, showPlans)) ids.add(node.id)
    if (node.status === 'proposed') ids.add(node.id)
  }
  return { cards: cardsFor(ids, rollup, groups), lines: lines.filter((line) => ids.has(line.source) && ids.has(line.target)) }
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
  const route = system.nodes.find((node) => node.kind === 'route')
  const file = route?.evidence[0]
  return file ? file.slice(0, file.lastIndexOf('/')) : null
}

export function buildView(system: SystemGraph, requested: string | null, tables: number, showPlans: boolean): MapView {
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

/** The trail from the top of the map down to the focus. */
export function trailFor(system: SystemGraph, focus: string | null): { id: string | null; label: string }[] {
  const trail: { id: string | null; label: string }[] = [{ id: null, label: 'System' }]
  if (!focus) return trail
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
