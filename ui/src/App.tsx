import { ChatEmbed, useAppApi } from '@kirocrew/app-sdk'
import { Badge, Btn, Card, CardTitle, Input, PageHeader } from '@kirocrew/app-sdk/ui'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Erd } from './Erd'
import type { Density } from './Erd'
import { ExploreView } from './Explore'
import type { Tab } from './Explore'
import { Findings } from './Findings'
import { Inspector } from './Inspector'
import { PlanBoard, PlanHint } from './Plan'
import { RiskView } from './Risk'
import { SystemMap } from './SystemMap'
import { WorktreesView } from './Worktrees'
import { BASE, useActiveRepo, useLive, useNode, useOverview, useProposal, useVersioned, withRepo } from './model'
import type { ExploreData, Finding, Graph, NodeInfo, Overlap, Overview, Plan, PlanStatus, Proposal, ProposalRow, Risk, SavedView, SystemGraph, WorktreeState } from './model'
import { graphOnly, overlapsOn, tablesAtWork, withProposal } from './overlay'
import { MUTED, SystemTree, TableList } from './parts'

const SLOT_NAME = 'system-map-design'
const GAP = 12
const CHECK_WORKTREES_MS = 20000
const CHECK_EXPLORE_MS = 8000
const DENSITIES: [Density, string][] = [
  ['names', 'Names'],
  ['keys', 'Keys'],
  ['columns', 'Columns'],
]
const COLUMN: CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, overflow: 'hidden', padding: 12 }

type View = 'map' | 'data' | 'plan' | 'risk' | 'worktrees' | 'findings' | 'explore'

const VIEWS: [View, string][] = [
  ['map', 'Map'],
  ['data', 'Data model'],
  ['plan', 'Plan'],
  ['risk', 'Risk'],
  ['worktrees', 'Worktrees'],
  ['findings', 'Findings'],
  ['explore', 'Explore'],
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
  const risk = useVersioned<Risk>('/risk', repo, stamp)
  const live = useLive<WorktreeState>('/worktrees', repo, CHECK_WORKTREES_MS)
  const worktrees = live.value
  const explore = useLive<ExploreData>('/explore', repo, CHECK_EXPLORE_MS)
  const [tab, setTab] = useState<Tab>('whatif')
  const [openProposal, setOpenProposal] = useState<string | null>(null)
  const [proposalTick, setProposalTick] = useState(0)
  const proposal = useProposal(openProposal, repo, proposalTick)
  const [drawn, setDrawn] = useState(false)
  const [savedView, setSavedView] = useState<SavedView | null>(null)
  const [view, setView] = useState<View>('map')
  const [selected, setSelected] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(null)
  const [showPlans, setShowPlans] = useState(true)
  const [showRisk, setShowRisk] = useState(false)
  const [showWork, setShowWork] = useState(true)
  const [coverageError, setCoverageError] = useState<string | null>(null)
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

  const atWork = useMemo(() => tablesAtWork(worktrees), [worktrees])
  const unbuilt = plans.filter((plan) => plan.status === 'planned' || plan.status === 'partial').length
  const collisions = (worktrees?.counts.high ?? 0) + (worktrees?.counts.medium ?? 0)
  const hotUntested = risk?.modules.filter((row) => row.hot && row.untested).length ?? 0
  const drafts = explore.value?.proposals.filter((row) => row.status === 'draft').length ?? 0
  const viewCounts: Partial<Record<View, number>> = { findings: findings.length, plan: unbuilt, risk: hotUntested, worktrees: collisions, explore: drafts }
  const overlaid: Proposal | null = drawn ? proposal : null
  const shownSystem = useMemo(() => (system ? withProposal(system, overlaid) : null), [system, overlaid])
  const shownGraph = useMemo(() => {
    const base = overlaid?.graph ?? graph
    return base && savedView?.level === 'data' ? graphOnly(base, savedView.resolved) : base
  }, [graph, overlaid, savedView])

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
  const askRisk = (id: string) => {
    chat.send(`Use the system-map tools. Look at ${id} and its risk. Say what is most likely to break, and which tests would help most.`)
  }
  const askOverlap = (row: Overlap) => {
    chat.send(`Use the system-map tools. Worktrees ${row.a} and ${row.b} overlap. Check \`worktrees\`, say what will collide, and how to avoid it.`)
  }
  const runCoverage = () => {
    chat.send("Run this repo's tests with coverage, in a scratch copy so the repo does not change. Then load the report with the system-map `coverage` tool, giving the commit it ran on.")
  }
  const loadCoverage = async () => {
    setCoverageError(null)
    try {
      await api.post(`${BASE}/coverage`, { repo: overview?.manifest.repo_key })
      setTick((value) => value + 1)
    } catch (caught) {
      setCoverageError(String(caught))
    }
  }
  const drawProposal = (level: 'map' | 'data') => {
    setDrawn(true)
    setSavedView(null)
    setFocus(null)
    // In a diagram of every table, one new table is too small to read, so open on it.
    const first = [...(proposal?.diff.added ?? []), ...(proposal?.diff.changed ?? [])].find((row) => row.id.startsWith('table:'))
    setSelected(level === 'data' ? (first?.id ?? null) : null)
    setView(level)
  }
  const setProposalStatus = async (id: string, status: ProposalRow['status']) => {
    await api.post(`${BASE}/proposal-status`, { repo: overview?.manifest.repo_key, id, status })
    setProposalTick((value) => value + 1)
    await explore.refresh()
  }
  const deleteIntent = async (kind: 'proposals' | 'use_cases' | 'views', id: string) => {
    await api.post(`${BASE}/intent-delete`, { repo: overview?.manifest.repo_key, kind, id })
    if (kind === 'proposals') {
      setOpenProposal(null)
      setDrawn(false)
    }
    await explore.refresh()
  }
  const openSavedView = (saved: SavedView) => {
    setSavedView(saved)
    setShowRisk(saved.overlays.risk)
    setShowWork(saved.overlays.worktrees)
    setShowPlans(saved.overlays.plans)
    setOpenProposal(saved.proposal)
    setDrawn(saved.proposal !== null)
    setFocus(null)
    setSelected(null)
    setView(saved.level)
  }
  const clearOverlays = () => {
    setDrawn(false)
    setSavedView(null)
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
  /** From a list, a table opens in the data model and anything else on the map. */
  const openNode = (id: string) => {
    if (id.startsWith('table:')) showTable(id)
    else showOnMap(id)
  }
  /** A selection belongs to one repo, so changing repo clears it. */
  const openRepo = (next: string) => {
    setSelected(null)
    setFocus(null)
    setRebuilt(null)
    setOpenProposal(null)
    clearOverlays()
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
  const showing = overlaid?.title ?? savedView?.title

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
              {showing && (view === 'map' || view === 'data') && (
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }} data-testid="showing">
                  <Badge variant="aim">Showing: {showing}</Badge>
                  <Btn onClick={clearOverlays}>Back to today</Btn>
                </span>
              )}
              <span style={{ flex: 1 }} />
              {view === 'data' &&
                DENSITIES.map(([value, label]) => (
                  <Btn key={value} primary={density === value} onClick={() => setDensity(value)}>
                    {label}
                  </Btn>
                ))}
              {view === 'map' && (
                <>
                  <PlanHint count={unbuilt} on={showPlans} onToggle={() => setShowPlans((value) => !value)} />
                  <Btn primary={showRisk} onClick={() => setShowRisk((value) => !value)} title="Mark hot and untested code on the map">
                    Risk on map
                  </Btn>
                  <Btn primary={showWork} onClick={() => setShowWork((value) => !value)} title="Show what each worktree is changing">
                    Worktrees on map
                  </Btn>
                </>
              )}
              <span style={{ width: 8 }} />
              {VIEWS.map(([value, label]) => (
                <Btn key={value} primary={view === value} onClick={() => setView(value)}>
                  {viewCounts[value] === undefined ? label : `${label} ${viewCounts[value]}`}
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
                  <TableList tables={overview.tables} selected={selected} flagged={flagged} working={atWork} onSelect={showTable} />
                )}
              </Card>
              <Card style={{ ...COLUMN, padding: 0, position: 'relative' }} data-testid="canvas">
                {view === 'map' && shownSystem && (
                  <SystemMap
                    system={shownSystem}
                    focus={focus}
                    tables={overview.manifest.counts.tables}
                    showPlans={showPlans}
                    inspecting={inspected !== null}
                    risk={showRisk ? risk : null}
                    worktrees={showWork ? worktrees : null}
                    only={savedView?.level === 'map' ? savedView.resolved : null}
                    layout={savedView?.layout ?? 'left-right'}
                    onFocus={(id) => {
                      setSavedView(null)
                      setFocus(id)
                    }}
                    onOpenTables={() => setView('data')}
                  />
                )}
                {view === 'data' && shownGraph && (
                  <Erd graph={shownGraph} selected={selected} flagged={flagged} working={atWork} density={density} onSelect={setSelected} />
                )}
                {view === 'explore' && explore.value && (
                  <ExploreView
                    data={explore.value}
                    proposal={proposal}
                    shownProposal={drawn ? openProposal : null}
                    canAsk={chat.slot !== null}
                    tab={tab}
                    onTab={setTab}
                    onSend={chat.send}
                    onOpenProposal={setOpenProposal}
                    onDrawProposal={drawProposal}
                    onStatus={(id, status) => void setProposalStatus(id, status)}
                    onDelete={(kind, id) => void deleteIntent(kind, id)}
                    onOpenView={openSavedView}
                    onNode={openNode}
                  />
                )}
                {view === 'plan' && <PlanBoard plans={plans} onShow={showOnMap} onAsk={askPlan} onStatus={(id, status) => void setPlanStatus(id, status)} />}
                {view === 'risk' && risk && (
                  <RiskView
                    risk={risk}
                    canAsk={chat.slot !== null}
                    error={coverageError}
                    onShow={showOnMap}
                    onAsk={askRisk}
                    onLoad={() => void loadCoverage()}
                    onRun={runCoverage}
                  />
                )}
                {view === 'worktrees' && worktrees && (
                  <WorktreesView state={worktrees} checkedAt={live.checkedAt} canAsk={chat.slot !== null} onShow={openNode} onAsk={askOverlap} />
                )}
                {view === 'findings' && <Findings findings={findings} onShow={showTable} onAsk={askFinding} />}
                {node && inspected && (
                  <Inspector
                    node={node}
                    work={worktrees?.by_node[inspected] ?? []}
                    overlaps={overlapsOn(inspected, worktrees)}
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
