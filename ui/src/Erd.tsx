import dagre from '@dagrejs/dagre'
import { useTheme } from '@kirocrew/app-sdk'
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import type { Edge, Node, NodeProps } from '@xyflow/react'
import { memo, useMemo } from 'react'
import { INSPECTOR_ROOM, MIN_ZOOM, useFrame } from './flow'
import type { Rect } from './flow'
import type { Graph, GraphColumn, GraphTable } from './model'
import { MONO, MUTED } from './parts'

export type Density = 'names' | 'keys' | 'columns'

const WIDTH: Record<Density, number> = { names: 210, keys: 240, columns: 240 }
const HEADER = 34
const ROW = 20

interface CardData extends Record<string, unknown> {
  table: GraphTable
  columns: GraphColumn[]
  hidden: number
  flags: number
  working: number
  focused: boolean
  width: number
  large: boolean
}

type CardNode = Node<CardData, 'table'>

const PROPOSAL_MARK: Record<string, { color: string; dashed: boolean }> = {
  proposed: { color: 'var(--accent, #2563eb)', dashed: true },
  changed: { color: 'var(--warn-text, #b45309)', dashed: false },
  removed: { color: 'var(--danger, #dc2626)', dashed: true },
}

const TableCard = memo(function TableCard({ data }: NodeProps<CardNode>) {
  const { table, columns, hidden, flags, working, focused, width, large } = data
  const external = table.status === 'external'
  const mark = PROPOSAL_MARK[table.status]
  const edge = mark?.color ?? 'var(--border-strong, #a1a1aa)'
  return (
    <div
      style={{
        width,
        borderRadius: 8,
        overflow: 'hidden',
        background: 'var(--card, #fff)',
        color: 'var(--text, #18181b)',
        border: `${mark ? 2 : 1}px ${external || mark?.dashed ? 'dashed' : 'solid'} ${focused ? 'var(--accent, #2563eb)' : edge}`,
        boxShadow: focused ? '0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))' : undefined,
        fontSize: 12,
      }}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Right} isConnectable={false} />
      <div
        style={{
          height: HEADER,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          padding: '0 10px',
          fontSize: large ? 16 : 13,
          fontWeight: 600,
          background: columns.length ? 'var(--bg-hover, #f4f4f5)' : undefined,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{table.name}</span>
        <span style={{ display: 'flex', gap: 6, fontWeight: 400, fontSize: 11, flexShrink: 0 }}>
          {mark && <span style={{ color: mark.color, fontWeight: 600 }}>{table.status}</span>}
          {working > 0 && (
            <span style={{ fontWeight: working > 1 ? 600 : 400, color: working > 1 ? 'var(--warn-text, #b45309)' : 'var(--accent, #2563eb)' }}>{working} at work</span>
          )}
          {flags > 0 && <span style={{ color: 'var(--warn-text, #b45309)' }}>{flags}</span>}
          {table.rls === false && <span style={{ color: 'var(--danger, #dc2626)' }}>no RLS</span>}
          {external && <span style={MUTED}>outside</span>}
        </span>
      </div>
      {columns.map((column) => (
        <div
          key={column.name}
          style={{ height: ROW, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}
        >
          <span style={{ width: 16, color: 'var(--accent, #2563eb)', fontWeight: 600, fontSize: 10 }}>
            {column.primary ? 'PK' : column.foreign ? 'FK' : column.proposed ? 'new' : ''}
          </span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: column.proposed ? 600 : undefined }}>{column.name}</span>
          <span style={{ ...MUTED, ...MONO, fontSize: 11, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {column.type}
          </span>
        </div>
      ))}
      {hidden > 0 && <div style={{ ...MUTED, height: ROW, padding: '0 10px', lineHeight: `${ROW}px` }}>+{hidden} more</div>}
    </div>
  )
})

const NODE_TYPES = { table: TableCard }

function shownColumns(table: GraphTable, density: Density): GraphColumn[] {
  if (density === 'names') return []
  return density === 'columns' ? table.columns : table.columns.filter((column) => column.primary || column.foreign)
}

function cardHeight(table: GraphTable, density: Density): number {
  if (density === 'names') return HEADER + 2
  const shown = shownColumns(table, density).length
  return HEADER + shown * ROW + (shown < table.columns.length ? ROW : 0) + 2
}

/** Place every table left to right, so foreign keys read from child to parent. */
function placeTables(graph: Graph, density: Density): Map<string, { x: number; y: number }> {
  const width = WIDTH[density]
  const layout = new dagre.graphlib.Graph({ multigraph: true })
  const tight = density === 'names'
  layout.setGraph({ rankdir: 'LR', nodesep: tight ? 12 : 24, ranksep: tight ? 70 : 110, marginx: 16, marginy: 16 })
  layout.setDefaultEdgeLabel(() => ({}))
  const known = new Set(graph.tables.map((table) => table.id))
  for (const table of graph.tables) layout.setNode(table.id, { width, height: cardHeight(table, density) })
  for (const edge of graph.edges) {
    if (edge.source !== edge.target && known.has(edge.target)) layout.setEdge(edge.source, edge.target, {}, edge.id)
  }
  dagre.layout(layout)
  const places = new Map<string, { x: number; y: number }>()
  for (const table of graph.tables) {
    const placed = layout.node(table.id)
    places.set(table.id, { x: placed.x - width / 2, y: placed.y - cardHeight(table, density) / 2 })
  }
  return places
}

/** A table, the tables it touches, and only the lines that touch it. */
function neighborhood(graph: Graph, id: string): Graph {
  const edges = graph.edges.filter((edge) => edge.source === id || edge.target === id)
  const ids = new Set([id, ...edges.flatMap((edge) => [edge.source, edge.target])])
  return { tables: graph.tables.filter((table) => ids.has(table.id)), edges }
}

const RULES: [string, string][] = [
  ['cascade', 'var(--danger, #dc2626)'],
  ['set null', 'var(--warn-text, #b45309)'],
  ['no action', 'var(--border-strong, #a1a1aa)'],
]

function edgeColor(rule: string): string {
  return (RULES.find(([name]) => name === rule) ?? RULES[2])[1]
}

function Legend() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '4px 8px',
        fontSize: 11,
        borderRadius: 6,
        background: 'var(--card, #fff)',
        border: '1px solid var(--border, #e4e4e7)',
        color: 'var(--text, inherit)',
      }}
    >
      <span style={MUTED}>On delete</span>
      {RULES.map(([name, color]) => (
        <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 14, height: 2, background: color }} />
          {name}
        </span>
      ))}
    </div>
  )
}

function Diagram({
  graph,
  selected,
  flagged,
  working,
  density,
  onSelect,
}: {
  graph: Graph
  selected: string | null
  flagged: Map<string, number>
  working: Map<string, number>
  density: Density
  onSelect: (id: string | null) => void
}) {
  const { mode } = useTheme()
  // A selected table gets its own layout: it and its neighbors, large enough to read.
  const scope = useMemo(() => (selected ? neighborhood(graph, selected) : graph), [graph, selected])
  const shape: Density = selected && density === 'names' ? 'keys' : density
  const places = useMemo(() => placeTables(scope, shape), [scope, shape])

  const nodes = useMemo<CardNode[]>(
    () =>
      scope.tables.map((table) => {
        const columns = shownColumns(table, shape)
        return {
          id: table.id,
          type: 'table',
          position: places.get(table.id) ?? { x: 0, y: 0 },
          width: WIDTH[shape],
          height: cardHeight(table, shape),
          data: {
            table,
            columns,
            hidden: shape === 'names' ? 0 : table.columns.length - columns.length,
            flags: flagged.get(table.id) ?? 0,
            working: working.get(table.id) ?? 0,
            focused: table.id === selected,
            width: WIDTH[shape],
            large: shape === 'names',
          },
        }
      }),
    [scope, shape, places, flagged, working, selected],
  )

  const edges = useMemo<Edge[]>(
    () =>
      scope.edges.map((edge) => {
        const color = edgeColor(edge.on_delete)
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          selectable: false,
          markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color },
          style: { stroke: color, strokeWidth: selected ? 2 : 1, opacity: 0.8 },
        }
      }),
    [scope, selected],
  )

  const rects = useMemo<Rect[]>(
    () =>
      scope.tables.map((table) => ({
        ...(places.get(table.id) ?? { x: 0, y: 0 }),
        width: WIDTH[shape],
        height: cardHeight(table, shape),
      })),
    [scope, places, shape],
  )
  useFrame(rects, selected ? INSPECTOR_ROOM : 0)

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      colorMode={mode}
      minZoom={MIN_ZOOM}
      maxZoom={1.5}
      nodesConnectable={false}
      onNodeClick={(_event, node) => onSelect(node.id)}
      onPaneClick={() => onSelect(null)}
    >
      <Background gap={24} size={1} />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable style={{ width: 120, height: 80 }} />
      <Panel position="top-left">
        <Legend />
      </Panel>
    </ReactFlow>
  )
}

export function Erd(props: {
  graph: Graph
  selected: string | null
  flagged: Map<string, number>
  working: Map<string, number>
  density: Density
  onSelect: (id: string | null) => void
}) {
  return (
    <div className="system-map-flow" style={{ position: 'absolute', inset: 0 }} data-testid="erd">
      <ReactFlowProvider>
        <Diagram {...props} />
      </ReactFlowProvider>
    </div>
  )
}
