import dagre from '@dagrejs/dagre'
import { useTheme } from '@kirocrew/app-sdk'
import { Background, Controls, Handle, MarkerType, MiniMap, Panel, Position, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import type { Edge, Node, NodeProps } from '@xyflow/react'
import { memo, useMemo } from 'react'
import { INSPECTOR_ROOM, MIN_ZOOM, useFrame } from './flow'
import type { Rect } from './flow'
import { GROUP_JOBS, GROUP_ROUTES, GROUP_TABLES, buildView, trailFor } from './graphView'
import type { Card, Line, MapView } from './graphView'
import type { Risk, SystemGraph, WorktreeState } from './model'
import { bandOf, riskIndex, worktreesOn } from './overlay'
import type { RiskBand } from './overlay'
import { MUTED } from './parts'

const WIDTH = 200
const HEIGHT = 58

const KIND_LABEL: Record<string, string> = {
  module: 'module',
  area: 'area',
  route: 'route',
  job: 'job',
  service: 'service',
  table: 'table',
  group: '',
  plan: 'plan',
}

const STATUS_COLOR: Record<string, string> = {
  planned: 'var(--danger, #dc2626)',
  partial: 'var(--warn-text, #b45309)',
  unclear: 'var(--muted, #71717a)',
  built: 'var(--ok, #15803d)',
}

const LINE_STYLE: Record<string, { color: string; dashed?: boolean; label: string }> = {
  imports: { color: 'var(--border-strong, #a1a1aa)', label: 'imports' },
  renders: { color: 'var(--muted, #71717a)', label: 'renders' },
  uses_table: { color: 'var(--accent, #2563eb)', label: 'uses table' },
  uses_service: { color: 'var(--warn-text, #b45309)', label: 'uses service' },
  calls: { color: 'var(--text, #18181b)', label: 'calls' },
  touches: { color: 'var(--danger, #dc2626)', dashed: true, label: 'plan touches' },
}

const BAND: Record<RiskBand, { color: string; label: string }> = {
  'hot-untested': { color: 'var(--danger, #dc2626)', label: 'hot, untested' },
  hot: { color: 'var(--warn-text, #b45309)', label: 'hot' },
}

interface CardData extends Record<string, unknown> {
  card: Card
  focused: boolean
  work: string[]
  band: RiskBand | null
}

type CardNode = Node<CardData, 'card'>

const SystemCard = memo(function SystemCard({ data }: NodeProps<CardNode>) {
  const { card, focused, work, band } = data
  const planned = card.kind === 'plan'
  const outside = card.kind === 'service'
  const crowded = work.length > 1
  const accent = planned ? STATUS_COLOR[card.status ?? 'unclear'] : crowded ? 'var(--warn-text, #b45309)' : undefined
  const line = focused ? 'var(--accent, #2563eb)' : (accent ?? 'var(--border-strong, #a1a1aa)')
  return (
    <div
      title={work.length ? `Worktrees here: ${work.join(', ')}` : undefined}
      style={{
        width: WIDTH,
        height: HEIGHT,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        padding: '0 12px',
        borderRadius: outside ? 29 : 8,
        background: card.kind === 'group' ? 'var(--bg-hover, #f4f4f5)' : 'var(--card, #fff)',
        color: 'var(--text, #18181b)',
        border: `${focused || crowded ? 2 : 1}px ${planned || outside ? 'dashed' : 'solid'} ${line}`,
        boxShadow: [band ? `inset 5px 0 0 ${BAND[band].color}` : '', focused ? '0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))' : ''].filter(Boolean).join(', ') || undefined,
      }}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Right} isConnectable={false} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.title}</span>
        {planned && <span style={{ fontSize: 11, color: accent, flexShrink: 0 }}>{card.status}</span>}
        {band && <span style={{ fontSize: 11, color: BAND[band].color, flexShrink: 0 }}>{BAND[band].label}</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'baseline' }}>
        <span style={{ ...MUTED, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {[KIND_LABEL[card.kind] && card.kind !== 'area' && card.kind !== 'plan' ? KIND_LABEL[card.kind] : '', card.subtitle].filter(Boolean).join(' · ')}
        </span>
        {work.length > 0 && (
          <span style={{ fontSize: 11, flexShrink: 0, fontWeight: crowded ? 600 : 400, color: crowded ? 'var(--warn-text, #b45309)' : 'var(--accent, #2563eb)' }}>
            {work.length} at work
          </span>
        )}
      </div>
    </div>
  )
})

const NODE_TYPES = { card: SystemCard }

function place(view: MapView): Map<string, { x: number; y: number }> {
  const layout = new dagre.graphlib.Graph({ multigraph: true })
  layout.setGraph({ rankdir: 'LR', nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 })
  layout.setDefaultEdgeLabel(() => ({}))
  for (const card of view.cards) layout.setNode(card.id, { width: WIDTH, height: HEIGHT })
  for (const line of view.lines) {
    if (line.source !== line.target) layout.setEdge(line.source, line.target, {}, line.id)
  }
  dagre.layout(layout)
  const places = new Map<string, { x: number; y: number }>()
  for (const card of view.cards) {
    const placed = layout.node(card.id)
    places.set(card.id, { x: placed.x - WIDTH / 2, y: placed.y - HEIGHT / 2 })
  }
  return places
}

function lineWidth(count: number): number {
  return Math.min(4, 1 + Math.log2(count) / 2)
}

function toEdge(line: Line): Edge {
  const style = LINE_STYLE[line.kind] ?? LINE_STYLE.imports
  return {
    id: line.id,
    source: line.source,
    target: line.target,
    selectable: false,
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: style.color },
    style: {
      stroke: style.color,
      strokeWidth: lineWidth(line.count),
      strokeDasharray: style.dashed ? '6 4' : undefined,
      opacity: line.kind === 'imports' ? 0.55 : 0.85,
    },
  }
}

function Legend({ kinds, top, risk }: { kinds: Set<string>; top: boolean; risk: boolean }) {
  const shown = Object.entries(LINE_STYLE).filter(([kind]) => kinds.has(kind))
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        whiteSpace: 'nowrap',
        padding: '4px 8px',
        fontSize: 11,
        borderRadius: 6,
        background: 'var(--card, #fff)',
        border: '1px solid var(--border, #e4e4e7)',
        color: 'var(--text, inherit)',
      }}
    >
      {shown.map(([kind, style]) => (
        <span key={kind} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 14, height: 0, borderTop: `2px ${style.dashed ? 'dashed' : 'solid'} ${style.color}` }} />
          {style.label}
        </span>
      ))}
      {risk &&
        Object.values(BAND).map((band) => (
          <span key={band.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 12, background: band.color }} />
            {band.label}
          </span>
        ))}
      {top && <span style={MUTED}>Thin links hidden</span>}
    </div>
  )
}

function Trail({ system, focus, onFocus }: { system: SystemGraph; focus: string | null; onFocus: (id: string | null) => void }) {
  const trail = trailFor(system, focus)
  return (
    <nav
      aria-label="Map level"
      style={{
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        padding: '4px 10px',
        fontSize: 13,
        borderRadius: 6,
        background: 'var(--card, #fff)',
        border: '1px solid var(--border, #e4e4e7)',
        color: 'var(--text, inherit)',
      }}
    >
      {trail.map((step, index) => {
        const last = index === trail.length - 1
        return (
          <span key={step.label} style={{ display: 'flex', gap: 6 }}>
            {index > 0 && <span style={MUTED}>/</span>}
            <button
              onClick={() => onFocus(step.id)}
              disabled={last}
              style={{
                background: 'transparent',
                border: 0,
                padding: 0,
                fontSize: 13,
                cursor: last ? 'default' : 'pointer',
                fontWeight: last ? 600 : 400,
                color: last ? 'var(--text, inherit)' : 'var(--accent, #2563eb)',
              }}
            >
              {step.label}
            </button>
          </span>
        )
      })}
    </nav>
  )
}

function Diagram({
  system,
  focus,
  tables,
  showPlans,
  inspecting,
  risk,
  worktrees,
  onFocus,
  onOpenTables,
}: {
  system: SystemGraph
  focus: string | null
  tables: number
  showPlans: boolean
  inspecting: boolean
  risk: Risk | null
  worktrees: WorktreeState | null
  onFocus: (id: string | null) => void
  onOpenTables: () => void
}) {
  const { mode } = useTheme()
  const view = useMemo(() => buildView(system, focus, tables, showPlans), [system, focus, tables, showPlans])
  const places = useMemo(() => place(view), [view])
  const rows = useMemo(() => riskIndex(risk), [risk])
  const byNode = worktrees?.by_node

  const nodes = useMemo<CardNode[]>(
    () =>
      view.cards.map((card) => ({
        id: card.id,
        type: 'card',
        position: places.get(card.id) ?? { x: 0, y: 0 },
        width: WIDTH,
        height: HEIGHT,
        data: { card, focused: card.id === focus, work: byNode ? worktreesOn(card.id, byNode) : [], band: bandOf(rows.get(card.id)) },
      })),
    [view, places, focus, rows, byNode],
  )
  const edges = useMemo(() => view.lines.map(toEdge), [view])
  const rects = useMemo<Rect[]>(
    () => view.cards.map((card) => ({ ...(places.get(card.id) ?? { x: 0, y: 0 }), width: WIDTH, height: HEIGHT })),
    [view, places],
  )
  useFrame(rects, inspecting ? INSPECTOR_ROOM : 0)
  const kinds = useMemo(() => new Set(view.lines.map((line) => line.kind)), [view])

  const open = (id: string) => {
    if (id === GROUP_TABLES) onOpenTables()
    else if (id !== GROUP_ROUTES && id !== GROUP_JOBS && id === focus) return
    else onFocus(id)
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      colorMode={mode}
      minZoom={MIN_ZOOM}
      maxZoom={1.5}
      nodesConnectable={false}
      onNodeClick={(_event, node) => open(node.id)}
    >
      <Background gap={24} size={1} />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable style={{ width: 120, height: 80 }} />
      <Panel position="top-left">
        <Trail system={system} focus={focus} onFocus={onFocus} />
      </Panel>
      <Panel position="bottom-center">
        <Legend kinds={kinds} top={focus === null} risk={risk !== null} />
      </Panel>
    </ReactFlow>
  )
}

export function SystemMap(props: {
  system: SystemGraph
  focus: string | null
  tables: number
  showPlans: boolean
  inspecting: boolean
  risk: Risk | null
  worktrees: WorktreeState | null
  onFocus: (id: string | null) => void
  onOpenTables: () => void
}) {
  return (
    <div className="system-map-flow" style={{ position: 'absolute', inset: 0 }} data-testid="map">
      <ReactFlowProvider>
        <Diagram {...props} />
      </ReactFlowProvider>
    </div>
  )
}
