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

export interface Overview {
  manifest: { repo: string; commit: string; branch: string; counts: { tables: number } }
  freshness: { stale: boolean; commits_behind: number }
  tables: TableRow[]
}

export interface Column {
  name: string
  type: string
  nullable: boolean
  source: string
}

export interface Constraint {
  kind: string
  columns: string[]
  references?: string
  on_delete?: string
  source: string
}

export interface TableNode {
  id: string
  name: string
  source: string
  rls: boolean
  columns: Column[]
  constraints: Constraint[]
  indexes: { name: string; columns: string[]; unique: boolean }[]
  policies: { name: string; command: string }[]
  reads: { text: string; evidence: string[] }[]
}

export function useOverview() {
  const api = useAppApi()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setOverview(await api.get<Overview>(`${BASE}/overview`))
      setError(null)
    } catch (caught) {
      setError(String(caught))
    }
  }, [api])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { overview, error, refresh }
}

export function useNode(id: string | null) {
  const api = useAppApi()
  const [node, setNode] = useState<TableNode | null>(null)

  useEffect(() => {
    if (!id) {
      setNode(null)
      return
    }
    let live = true
    api
      .get<TableNode>(`${BASE}/node?id=${encodeURIComponent(id)}`)
      .then((value: TableNode) => live && setNode(value))
    return () => {
      live = false
    }
  }, [api, id])

  return node
}

const ROW: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 8,
  width: '100%',
  padding: '4px 8px',
  border: 0,
  borderRadius: 4,
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: 13,
  color: 'inherit',
}

export function TableList({
  tables,
  selected,
  onSelect,
}: {
  tables: TableRow[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  const [filter, setFilter] = useState('')
  const shown = tables.filter((t) => t.name.includes(filter.toLowerCase()))
  return (
    <div>
      <input
        aria-label="Filter tables"
        placeholder="Filter tables"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        style={{ width: '100%', padding: '4px 8px', marginBottom: 8, fontSize: 13, background: 'transparent', color: 'inherit', border: '1px solid currentColor', borderRadius: 4, opacity: 0.8 }}
      />
      {shown.map((table) => (
        <button
          key={table.id}
          onClick={() => onSelect(table.id)}
          style={{ ...ROW, background: table.id === selected ? 'rgba(127,127,127,0.25)' : 'transparent' }}
        >
          <span>{table.name}</span>
          <span style={{ opacity: 0.6 }}>{table.rls ? table.columns : `${table.columns}, no RLS`}</span>
        </button>
      ))}
    </div>
  )
}

export function NodeDetail({ node }: { node: TableNode }) {
  const keys = node.constraints.filter((c) => c.kind !== 'check')
  return (
    <div style={{ fontSize: 13 }}>
      <p style={{ opacity: 0.7, margin: '0 0 8px' }}>{node.source}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <tbody>
          {node.columns.map((column) => (
            <tr key={column.name}>
              <td style={{ padding: '2px 8px 2px 0' }}>{column.name}</td>
              <td style={{ padding: '2px 8px', opacity: 0.7 }}>{column.type}</td>
              <td style={{ padding: '2px 0', opacity: 0.7 }}>{column.nullable ? 'null' : 'not null'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Constraints</p>
      <ul style={{ margin: '0 0 12px', paddingLeft: 16 }}>
        {keys.map((constraint, index) => (
          <li key={index}>
            {constraint.kind} ({constraint.columns.join(', ')})
            {constraint.references ? ` to ${constraint.references}, on delete ${constraint.on_delete}` : ''}
          </li>
        ))}
      </ul>
      <p style={{ margin: 0 }}>
        {node.indexes.length} indexes, {node.policies.length} policies, RLS {node.rls ? 'on' : 'off'}
      </p>
    </div>
  )
}
