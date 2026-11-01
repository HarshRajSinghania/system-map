import { ChatEmbed, useAppApi } from '@kirocrew/app-sdk'
import { Badge, Btn, Card, CardTitle, Input, PageHeader } from '@kirocrew/app-sdk/ui'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Erd } from './Erd'
import type { Density } from './Erd'
import { Findings } from './Findings'
import { Inspector } from './Inspector'
import { PlanBoard, PlanHint } from './Plan'
import { SystemMap } from './SystemMap'
import { BASE, useActiveRepo, useNode, useOverview, useVersioned, withRepo } from './model'
import type { Finding, Graph, NodeInfo, Overview, Plan, PlanStatus, SystemGraph } from './model'
import { MUTED, SystemTree, TableList } from './parts'

const SLOT_NAME = 'system-map-design'
const GAP = 12
const DENSITIES: [Density, string][] = [
  ['names', 'Names'],
  ['keys', 'Keys'],
  ['columns', 'Columns'],
]
const COLUMN: CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, overflow: 'hidden', padding: 12 }

type View = 'map' | 'data' | 'plan' | 'findings'

const VIEWS: [View, string][] = [
  ['map', 'Map'],
  ['data', 'Data model'],
  ['plan', 'Plan'],
  ['findings', 'Findings'],
]

/** Open the app's own chat, pointed at the repo the model was built from. */
function useDesignSlot(repo: string | null) {
  const api = useAppApi()
  const [slot, setSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!repo) return
    let live = true
    const open = async () => {
      const created = await api.post<{ key: string }>('/api/chat/slots', { name: SLOT_NAME })
      await api.post(`/api/chat/slots/${encodeURIComponent(created.key)}/project`, { project: repo })
      if (live) setSlot(created.key)
    }
    open().catch((caught: unknown) => {
      if (live) setError(String(caught))
    })
    return () => {
      live = false
    }
  }, [api, repo])

  const send = useCallback(
    (message: string) => {
      if (slot) void api.post('/api/chat?ws=1', { message, slot, agent: '' })
    },
    [api, slot],
  )

  return { slot, error, send }
}

/** Fill the window below this element, whatever the host page around it does. */
function useFillHeight() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    const measure = () => {
      const top = ref.current?.getBoundingClientRect().top ?? 0
      setHeight(Math.max(420, window.innerHeight - top - 16))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return { ref, height }
}

function BuildModel({ message, onBuilt }: { message: string | null; onBuilt: (key: string) => void }) {
  const api = useAppApi()
  const [path, setPath] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const build = async () => {
    setBusy(true)
    setError(null)
    try {
      const reply = await api.post<{ repo_key: string }>(`${BASE}/build`, { repo_path: path.trim() })
      onBuilt(reply.repo_key)
    } catch (caught) {
      setError(String(caught))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardTitle>Build a model</CardTitle>
      {message && <p style={{ ...MUTED, fontSize: 13 }}>{message}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <Input
          aria-label="Repo path"
          placeholder="/path/to/repo"
          value={path}
          onChange={(event) => setPath(event.target.value)}
          style={{ flex: 1 }}
        />
        <Btn primary disabled={busy || !path.trim()} onClick={() => void build()}>
          {busy ? 'Building' : 'Build'}
        </Btn>
      </div>
      {error && <p style={{ fontSize: 13 }}>{error}</p>}
    </Card>
  )
}

function FreshnessBadge({ overview }: { overview: Overview }) {
  const { stale, map_stale: mapStale, commits_behind: behind, ref, changed_inputs: changed = [] } = overview.freshness
  if (stale) return <Badge variant="warn">{changed.length} schema files changed on {ref}</Badge>
  if (mapStale) return <Badge variant="warn">Code changed on {ref}. Rebuild to update.</Badge>
  if (behind > 0) return <Badge variant="muted">Current, {behind} commits behind {ref}</Badge>
  return <Badge variant="ok">Current with {ref}</Badge>
}

export default function SystemMapApp() {
  const api = useAppApi()
  const { repos, active: repo, loaded, choose, reload } = useActiveRepo()
  const { overview, error, refresh } = useOverview(repo)
  const version = overview?.manifest.version
  const [tick, setTick] = useState(0)
  const stamp = version ? `${version}:${tick}` : undefined
  const graph = useVersioned<Graph>('/graph', repo, stamp)
  const system = useVersioned<SystemGraph>('/system', repo, stamp)
  const plans = useVersioned<{ plans: Plan[] }>('/plan', repo, stamp)?.plans ?? []
  const findings = useVersioned<{ findings: Finding[] }>('/findings', repo, stamp)?.findings ?? []
  const [view, setView] = useState<View>('map')
  const [selected, setSelected] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(null)
  const [showPlans, setShowPlans] = useState(true)
  const [density, setDensity] = useState<Density>('names')
  const [adding, setAdding] = useState(false)
  const [rebuilt, setRebuilt] = useState<string | null>(null)
  const { ref, height } = useFillHeight()
  const chat = useDesignSlot(overview ? overview.manifest.repo : null)

  // The map inspects a single thing, not a whole area or group.
  const inspected = view === 'map' ? (focus && !/^(area|group):/.test(focus) ? focus : null) : view === 'data' ? selected : null
  const node = useNode<NodeInfo>(inspected, repo)

  const flagged = useMemo(() => {
    const counts = new Map<string, number>()
    for (const finding of findings) {
      if (finding.severity !== 'info') counts.set(finding.node, (counts.get(finding.node) ?? 0) + 1)
    }
    return counts
  }, [findings])

  const unbuilt = plans.filter((plan) => plan.status === 'planned' || plan.status === 'partial').length

  const rebuild = async () => {
    setRebuilt('Checking')
    try {
      const reply = await api.post<{ unchanged?: boolean }>(withRepo('/build', null), { repo: overview?.manifest.repo_key })
      setRebuilt(reply.unchanged ? 'No changes' : 'Rebuilt')
      await refresh()
    } catch (caught) {
      setRebuilt(String(caught))
    }
  }

  const askNode = () => {
    if (node) chat.send(`Use the system-map tools. Look at ${node.id} and tell me what to watch out for.`)
  }
  const askFinding = (finding: Finding) => {
    chat.send(`Use the system-map tools. Check finding ${finding.id} on ${finding.node}, read its evidence, and propose a fix.`)
  }
  const askPlan = (plan: Plan) => {
    chat.send(`Use the system-map tools. Look at ${plan.id}, say what is left to build, and propose the next step.`)
  }
  const setPlanStatus = async (id: string, status: PlanStatus | null) => {
    await api.post(`${BASE}/plan-status`, { repo: overview?.manifest.repo_key, id, status })
    setTick((value) => value + 1)
  }

  const showTable = (id: string) => {
    setView('data')
    setSelected(id)
  }
  const showOnMap = (id: string) => {
    setView('map')
    setFocus(id)
  }
  /** From the inspector, stay on the view you are on where you can. */
  const openLink = (id: string) => {
    if (view === 'data' && id.startsWith('table:')) setSelected(id)
    else showOnMap(id)
  }
  /** A selection belongs to one repo, so changing repo clears it. */
  const openRepo = (next: string) => {
    setSelected(null)
    setFocus(null)
    setRebuilt(null)
    choose(next)
  }

  const actions = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {rebuilt && <span style={{ ...MUTED, fontSize: 13 }}>{rebuilt}</span>}
      {repos.length > 1 && (
        <select
          aria-label="Repo"
          value={overview?.manifest.repo_key ?? ''}
          onChange={(event) => openRepo(event.target.value)}
          style={{ fontSize: 13, background: 'transparent', color: 'var(--text, inherit)' }}
        >
          {repos.map((item) => (
            <option key={item.repo_key} value={item.repo_key}>
              {item.repo.split('/').pop()}
            </option>
          ))}
        </select>
      )}
      <Btn onClick={() => setAdding((value) => !value)}>Add repo</Btn>
      {overview && <Btn onClick={() => void rebuild()}>Rebuild</Btn>}
    </div>
  )

  const nothingBuilt = loaded && repos.length === 0
  const showBuild = adding || nothingBuilt || (!overview && error !== null)
  const onLeftOfTree = view === 'map' || view === 'plan'

  return (
    <>
      <PageHeader title="System Map" subtitle={overview ? overview.manifest.repo : 'One model of your system'} actions={actions} />
      <div ref={ref} style={{ height, display: 'flex', flexDirection: 'column', gap: GAP, padding: '0 16px', minHeight: 0 }}>
        {showBuild && (
          <BuildModel
            message={overview ? null : nothingBuilt ? 'Point System Map at a repo.' : error}
            onBuilt={(key) => {
              setAdding(false)
              openRepo(key)
              void reload()
            }}
          />
        )}
        {overview && (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 }}>
              <FreshnessBadge overview={overview} />
              <Badge variant="muted">{overview.manifest.commit.slice(0, 7)}</Badge>
              <span style={{ flex: 1 }} />
              {view === 'data' &&
                DENSITIES.map(([value, label]) => (
                  <Btn key={value} primary={density === value} onClick={() => setDensity(value)}>
                    {label}
                  </Btn>
                ))}
              {view === 'map' && <PlanHint count={unbuilt} on={showPlans} onToggle={() => setShowPlans((value) => !value)} />}
              <span style={{ width: 8 }} />
              {VIEWS.map(([value, label]) => (
                <Btn key={value} primary={view === value} onClick={() => setView(value)}>
                  {value === 'findings' ? `${label} ${findings.length}` : value === 'plan' ? `${label} ${unbuilt}` : label}
                </Btn>
              ))}
            </div>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: 'grid',
                gap: GAP,
                gridTemplateColumns: '220px minmax(0, 1fr) minmax(320px, 26%)',
                gridTemplateRows: 'minmax(0, 1fr)',
              }}
            >
              <Card style={COLUMN}>
                <CardTitle>{onLeftOfTree ? 'Modules' : 'Tables'}</CardTitle>
                {onLeftOfTree ? (
                  <SystemTree nodes={system?.nodes ?? []} focus={focus} onSelect={showOnMap} />
                ) : (
                  <TableList tables={overview.tables} selected={selected} flagged={flagged} onSelect={showTable} />
                )}
              </Card>
              <Card style={{ ...COLUMN, padding: 0, position: 'relative' }} data-testid="canvas">
                {view === 'map' && system && (
                  <SystemMap
                    system={system}
                    focus={focus}
                    tables={overview.manifest.counts.tables}
                    showPlans={showPlans}
                    inspecting={inspected !== null}
                    onFocus={setFocus}
                    onOpenTables={() => setView('data')}
                  />
                )}
                {view === 'data' && graph && (
                  <Erd graph={graph} selected={selected} flagged={flagged} density={density} onSelect={setSelected} />
                )}
                {view === 'plan' && <PlanBoard plans={plans} onShow={showOnMap} onAsk={askPlan} onStatus={(id, status) => void setPlanStatus(id, status)} />}
                {view === 'findings' && <Findings findings={findings} onShow={showTable} onAsk={askFinding} />}
                {node && inspected && (
                  <Inspector
                    node={node}
                    canAsk={chat.slot !== null}
                    onAsk={askNode}
                    onAskFinding={askFinding}
                    onOpen={openLink}
                    onClose={() => (view === 'data' ? setSelected(null) : setFocus(null))}
                  />
                )}
              </Card>
              <Card style={COLUMN}>
                <CardTitle>Design chat</CardTitle>
                {chat.error && <p style={{ fontSize: 13 }}>Chat is not available: {chat.error}</p>}
                <div style={{ position: 'relative', flex: 1, minHeight: 0 }} data-testid="chat">
                  {chat.slot && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <ChatEmbed slotKey={chat.slot} frameless startAtBottom placeholder="Ask about the system" />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  )
}
