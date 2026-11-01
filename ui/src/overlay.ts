import { GROUP_JOBS, GROUP_ROUTES, GROUP_TABLES } from './graphView.ts'
import type { Overlap, Risk, RiskRow, WorktreeState } from './model'

export type RiskBand = 'hot-untested' | 'hot'

const GROUP_PREFIX: Record<string, string> = {
  [GROUP_TABLES]: 'table:',
  [GROUP_ROUTES]: 'route:',
  [GROUP_JOBS]: 'job:',
}

/** Which worktrees are at work on a card. A group counts everything inside it. */
export function worktreesOn(id: string, byNode: Record<string, string[]>): string[] {
  const names = new Set(byNode[id] ?? [])
  const prefix = GROUP_PREFIX[id]
  if (prefix) {
    for (const [node, list] of Object.entries(byNode)) {
      if (node.startsWith(prefix)) list.forEach((name) => names.add(name))
    }
  }
  return [...names].sort()
}

/** Every module and area by id, so a card can find its row. */
export function riskIndex(risk: Risk | null): Map<string, RiskRow> {
  return new Map([...(risk?.modules ?? []), ...(risk?.areas ?? [])].map((row) => [row.id ?? row.path, row]))
}

export function bandOf(row: RiskRow | undefined): RiskBand | null {
  if (!row?.hot) return null
  return row.untested ? 'hot-untested' : 'hot'
}

/** The overlaps a node is part of, worst first, as the server sorted them. */
export function overlapsOn(id: string, state: WorktreeState | null): Overlap[] {
  if (!state) return []
  return state.overlaps.filter((row) => [...row.schema, ...row.schema_and_code, ...row.code, ...row.modules].includes(id))
}

/** Tables with work on them, for the data model and its list. */
export function tablesAtWork(state: WorktreeState | null): Map<string, number> {
  const found = new Map<string, number>()
  for (const [node, names] of Object.entries(state?.by_node ?? {})) {
    if (node.startsWith('table:')) found.set(node, names.length)
  }
  return found
}

export function percent(share: number | null | undefined): string {
  return share === null || share === undefined ? 'none' : `${Math.round(share * 100)}%`
}
