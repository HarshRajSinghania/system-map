import { useTheme } from '@kirocrew/app-sdk'
import { Background, Controls, Handle, MarkerType, MiniMap, Panel, Position, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import type { Edge, Node, NodeProps } from '@xyflow/react'
import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'
import { INSPECTOR_ROOM, MINIMAP_WIDTH, MIN_ZOOM, frameBox, useCanvasHeight, useCanvasWidth, useFrame } from './flow'
import { CanvasTools } from './Layers'
import type { Rect } from './flow'
import { CARD_HEIGHT, CARD_WIDTH, GROUP_JOBS, GROUP_ROUTES, GROUP_TABLES, buildView, savedView, trailFor } from './graphView'
import type { Card, Line } from './graphView'
import { layoutView, readableLayout } from './layout'
import type { BandBox } from './layout'
import type { Risk, SystemGraph, WorktreeState } from './model'
import { bandOf, riskIndex, worktreesOn } from './overlay'
import type { RiskBand } from './overlay'
import { MUTED } from './parts'

const WIDTH = CARD_WIDTH
const HEIGHT = CARD_HEIGHT

const KIND_LABEL: Record<string, string> = {
  module: 'module',
  area: 'area',
  route: 'route',
  job: 'job',
  agent: 'agent',
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
  empty: 'var(--warn-text, #b45309)',
}

/** What a card says for a status, where the model's word is not the one to show. */
const STATUS_TEXT: Record<string, string> = { empty: 'no jobs' }

const LINE_STYLE: Record<string, { color: string; dashed?: boolean; label: string }> = {
  imports: { color: 'var(--border-strong, #a1a1aa)', label: 'imports' },
  renders: { color: 'var(--muted, #71717a)', label: 'renders' },
  uses_table: { color: 'var(--accent, #2563eb)', label: 'uses table' },
  uses_service: { color: 'var(--warn-text, #b45309)', label: 'uses service' },
  calls: { color: 'var(--text, #18181b)', label: 'calls' },
  touches: { color: 'var(--danger, #dc2626)', dashed: true, label: 'plan touches' },
  starts: { color: 'var(--text, #18181b)', label: 'starts' },
  hands_off_to: { color: 'var(--accent, #2563eb)', label: 'hands off' },
  uses_model: { color: 'var(--warn-text, #b45309)', dashed: true, label: 'uses model' },
  leaves_region: { color: 'var(--danger, #dc2626)', label: 'leaves region' },
}

const BAND_TONE: Record<BandBox['tone'], string> = {
  home: 'var(--ok, #15803d)',
  away: 'var(--danger, #dc2626)',
  unknown: 'var(--muted, #71717a)',
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
  /** The picture runs top down, so lines meet a card at its top and bottom. */
  down: boolean
}

type CardNode = Node<CardData, 'card'>

const SystemCard = memo(function SystemCard({ data }: NodeProps<CardNode>) {
  const { card, focused, work, band, down } = data
  const proposed = card.status === 'proposed'
  const planned = card.kind === 'plan' || proposed || (card.kind === 'agent' && card.status !== undefined)
  const outside = card.kind === 'service'
  const crowded = work.length > 1
  const accent = proposed ? 'var(--accent, #2563eb)' : planned ? STATUS_COLOR[card.status ?? 'unclear'] : crowded ? 'var(--warn-text, #b45309)' : undefined
  const line = focused ? 'var(--accent, #2563eb)' : (accent ?? (card.strong ? 'var(--text, #18181b)' : 'var(--border-strong, #a1a1aa)'))
  const weight = focused || crowded ? 2 : card.strong ? 1.5 : 1
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
        border: `${weight}px ${planned || outside ? 'dashed' : 'solid'} ${line}`,
        boxShadow: [band ? `inset 5px 0 0 ${BAND[band].color}` : '', focused ? '0 0 0 3px var(--accent-subtle, rgba(37,99,235,.2))' : ''].filter(Boolean).join(', ') || undefined,
      }}
    >
      <Handle type="target" position={down ? Position.Top : Position.Left} isConnectable={false} />
      <Handle type="source" position={down ? Position.Bottom : Position.Right} isConnectable={false} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.title}</span>
        {planned && <span style={{ fontSize: 11, color: accent, flexShrink: 0 }}>{STATUS_TEXT[card.status ?? ''] ?? card.status}</span>}
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
        {work.length === 0 && card.badge && <span style={{ fontSize: 11, flexShrink: 0, color: 'var(--info, #2563eb)' }}>{card.badge}</span>}
      </div>
    </div>
  )
})

interface BandData extends Record<string, unknown> {
  band: BandBox
}

type BandNode = Node<BandData, 'band'>

/** A dashed box around the services that run in one region, named on its edge. */
const RegionBand = memo(function RegionBand({ data }: NodeProps<BandNode>) {
  const color = BAND_TONE[data.band.tone]
  return (
    <div data-testid={data.band.id} style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 14, border: `1.5px dashed ${color}`, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', top: -9, left: 12, padding: '0 4px', fontSize: 11, fontWeight: 600, lineHeight: '16px', color, background: 'var(--bg, #fff)' }}>{data.band.label}</span>
    </div>
  )
})

const NODE_TYPES = { card: SystemCard, band: RegionBand }

function lineWidth(count: number): number {
  return Math.min(4, 1 + Math.log2(count) / 2)
}

function toEdge(line: Line): Edge {
  const style = line.leaves ? LINE_STYLE.leaves_region : (LINE_STYLE[line.kind] ?? LINE_STYLE.imports)
  return {
    id: line.id,
    source: line.source,
    target: line.target,
    selectable: false,
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: style.color },
    style: {
      stroke: style.color,
      strokeWidth: lineWidth(line.count),
      strokeDasharray: style.dashed || line.proposed ? '6 4' : undefined,
      opacity: line.kind === 'imports' ? 0.55 : 0.85,
    },
  }
}

function Legend({ kinds, top, risk }: { kinds: Set<string>; top: boolean; risk: boolean }) {
  const shown = Object.entries(LINE_STYLE).filter(([kind]) => kinds.has(kind))
  const canvas = useCanvasWidth()
  return (
    <div
      data-testid="legend"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2px 10px',
        width: 'max-content',
        // Clear of the zoom buttons, and of the minimap when there is one.
        maxWidth: Math.max(120, canvas - (canvas < MINIMAP_WIDTH ? 130 : 290)),
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

function Trail({ system, focus, agents, onFocus }: { system: SystemGraph; focus: string | null; agents: boolean; onFocus: (id: string | null) => void }) {
  const trail = trailFor(system, focus, agents)
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
  only,
  layout,
  agents,
  tools,
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
  only: string[] | null
  layout: 'left-right' | 'top-down'
  agents: boolean
  tools?: ReactNode
  onFocus: (id: string | null) => void
  onOpenTables: () => void
}) {
  const { mode } = useTheme()
  const canvasWidth = useCanvasWidth()
  const canvasHeight = useCanvasHeight()
  const canvasWide = canvasWidth >= MINIMAP_WIDTH
  // The agents picture is the same whatever is focused, so a click there only moves the highlight.
  const viewFocus = agents ? null : focus
  const view = useMemo(
    () => (only ? savedView(system, only, tables) : buildView(system, viewFocus, tables, showPlans, agents)),
    [system, only, viewFocus, tables, showPlans, agents],
  )
  // The agents picture picks the direction the canvas shows larger. Other views keep theirs, and
  // don't lay out again on every resize.
  const fitting = agents && !only
  const box = frameBox(canvasWidth, canvasHeight, inspecting ? INSPECTOR_ROOM : 0)
  const boxWidth = fitting ? box.width : 0
  const boxHeight = fitting ? box.height : 0
  const placed = useMemo(() => {
    if (fitting) return readableLayout(view, boxWidth, boxHeight)
    const direction = layout === 'top-down' ? 'TB' : 'LR'
    return { ...layoutView(view, direction), direction }
  }, [view, layout, fitting, boxWidth, boxHeight])
  const down = placed.direction === 'TB'
  const places = placed.places
  const rows = useMemo(() => riskIndex(risk), [risk])
  const byNode = worktrees?.by_node

  const nodes = useMemo<(CardNode | BandNode)[]>(
    () => [
      ...placed.bands.map<BandNode>((band) => ({
        id: band.id,
        type: 'band',
        position: { x: band.x, y: band.y },
        width: band.width,
        height: band.height,
        zIndex: -1,
        selectable: false,
        draggable: false,
        focusable: false,
        data: { band },
      })),
      ...view.cards.map<CardNode>((card) => ({
        id: card.id,
        type: 'card',
        position: places.get(card.id) ?? { x: 0, y: 0 },
        width: WIDTH,
        height: HEIGHT,
        data: { card, focused: card.id === focus, work: byNode ? worktreesOn(card.id, byNode) : [], band: bandOf(rows.get(card.id)), down },
      })),
    ],
    [view, placed, places, focus, rows, byNode, down],
  )
  const edges = useMemo(() => view.lines.map(toEdge), [view])
  const rects = useMemo<Rect[]>(
    () => [
      ...view.cards.map((card) => ({ ...(places.get(card.id) ?? { x: 0, y: 0 }), width: WIDTH, height: HEIGHT })),
      ...placed.bands.map((band) => ({ x: band.x, y: band.y, width: band.width, height: band.height })),
    ],
    [view, places, placed],
  )
  useFrame(rects, inspecting ? INSPECTOR_ROOM : 0, agents && !only ? 'top' : 'center')
  const kinds = useMemo(() => new Set(view.lines.map((line) => (line.leaves ? 'leaves_region' : line.kind))), [view])

  const open = (id: string) => {
    if (id.startsWith('band:')) return
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
      {canvasWide && <MiniMap pannable zoomable style={{ width: 120, height: 80 }} />}
      <Panel position="top-left">
        <CanvasTools>
          <Trail system={system} focus={focus} agents={agents && !only} onFocus={onFocus} />
          {tools}
        </CanvasTools>
      </Panel>
      <Panel position="bottom-center">
        <Legend kinds={kinds} top={(view.hidden ?? 0) > 0} risk={risk !== null} />
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
  only: string[] | null
  layout: 'left-right' | 'top-down'
  /** The Agents layer: draw the agents picture in place of today's map. */
  agents?: boolean
  tools?: ReactNode
  onFocus: (id: string | null) => void
  onOpenTables: () => void
}) {
  return (
    <div className="system-map-flow" style={{ position: 'absolute', inset: 0 }} data-testid="map">
      <ReactFlowProvider>
        <Diagram {...props} agents={props.agents ?? false} />
      </ReactFlowProvider>
    </div>
  )
}
