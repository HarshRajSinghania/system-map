import { ChatEmbed, useAppApi } from '@kirocrew/app-sdk'
import { Badge, Btn, Card, CardTitle, Input, PageHeader } from '@kirocrew/app-sdk/ui'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Erd } from './Erd'
import type { Density } from './Erd'
import { Findings } from './Findings'
import { BASE, useActiveRepo, useNode, useOverview, useVersioned, withRepo } from './model'
import type { Finding, Graph, Overview } from './model'
import { MUTED, NodeDetail, TableList } from './parts'

const SLOT_NAME = 'system-map-design'
const GAP = 12
const DENSITIES: [Density, string][] = [
  ['names', 'Names'],
  ['keys', 'Keys'],
  ['columns', 'Columns'],
]
const COLUMN: CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, overflow: 'hidden', padding: 12 }

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
  const { stale, commits_behind: behind, ref, changed_inputs: changed = [] } = overview.freshness
  if (stale) return <Badge variant="warn">{changed.length} schema files changed on {ref}</Badge>
  if (behind > 0) return <Badge variant="muted">Schema current, {behind} commits behind {ref}</Badge>
  return <Badge variant="ok">Current with {ref}</Badge>
}

export default function SystemMap() {
  const api = useAppApi()
  const { repos, active: repo, loaded, choose, reload } = useActiveRepo()
  const { overview, error, refresh } = useOverview(repo)
  const version = overview?.manifest.version
  const graph = useVersioned<Graph>('/graph', repo, version)
  const findings = useVersioned<{ findings: Finding[] }>('/findings', repo, version)?.findings ?? []
  const [selected, setSelected] = useState<string | null>(null)
  const node = useNode(selected, repo)
  const [view, setView] = useState<'diagram' | 'findings'>('diagram')
  const [density, setDensity] = useState<Density>('names')
  const [adding, setAdding] = useState(false)
  const [rebuilt, setRebuilt] = useState<string | null>(null)
  const { ref, height } = useFillHeight()
  const chat = useDesignSlot(overview ? overview.manifest.repo : null)

  const flagged = useMemo(() => {
    const counts = new Map<string, number>()
    for (const finding of findings) {
      if (finding.severity !== 'info') counts.set(finding.node, (counts.get(finding.node) ?? 0) + 1)
    }
    return counts
  }, [findings])

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

  const askTable = () => {
    if (node) chat.send(`Use the system-map tools. Look at ${node.id} and tell me what to watch out for.`)
  }
  const askFinding = (finding: Finding) => {
    chat.send(`Use the system-map tools. Check finding ${finding.id} on ${finding.node}, read its evidence, and propose a fix.`)
  }
  const showNode = (id: string) => {
    setView('diagram')
    setSelected(id)
  }
  /** A selected table belongs to one repo, so changing repo clears it. */
  const openRepo = (next: string) => {
    setSelected(null)
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

  return (
    <>
      <PageHeader title="System Map" subtitle={overview ? overview.manifest.repo : 'One model of your system'} actions={actions} />
      <div ref={ref} style={{ height, display: 'flex', flexDirection: 'column', gap: GAP, padding: '0 16px', minHeight: 0 }}>
        {showBuild && (
          <BuildModel
            message={overview ? null : nothingBuilt ? 'Point System Map at a repo with SQL migrations.' : error}
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
              <Badge variant="muted">{overview.manifest.counts.tables} tables</Badge>
              <Badge variant="muted">{overview.manifest.counts.columns} columns</Badge>
              <span style={{ flex: 1 }} />
              {view === 'diagram' &&
                DENSITIES.map(([value, label]) => (
                  <Btn key={value} primary={density === value} onClick={() => setDensity(value)}>
                    {label}
                  </Btn>
                ))}
              <span style={{ width: 8 }} />
              <Btn primary={view === 'diagram'} onClick={() => setView('diagram')}>
                Diagram
              </Btn>
              <Btn primary={view === 'findings'} onClick={() => setView('findings')}>
                Findings {findings.length}
              </Btn>
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
                <CardTitle>Tables</CardTitle>
                <TableList tables={overview.tables} selected={selected} flagged={flagged} onSelect={showNode} />
              </Card>
              <Card style={{ ...COLUMN, padding: 0, position: 'relative' }} data-testid="canvas">
                {view === 'diagram' && graph && (
                  <Erd graph={graph} selected={selected} flagged={flagged} density={density} onSelect={setSelected} />
                )}
                {view === 'findings' && <Findings findings={findings} onShow={showNode} onAsk={askFinding} />}
                {view === 'diagram' && node && (
                  <div
                    data-testid="inspector"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bottom: 12,
                      width: 340,
                      maxWidth: '60%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      padding: 12,
                      borderRadius: 8,
                      background: 'var(--card, #fff)',
                      border: '1px solid var(--border, #e4e4e7)',
                      boxShadow: '0 4px 16px rgba(0,0,0,.12)',
                      zIndex: 5,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: 'var(--text, inherit)' }}>{node.name}</span>
                      <Btn primary onClick={askTable} disabled={!chat.slot}>
                        Ask
                      </Btn>
                      <Btn onClick={() => setSelected(null)} aria-label="Close">
                        Close
                      </Btn>
                    </div>
                    <div style={{ overflowY: 'auto', minHeight: 0, flex: 1 }}>
                      <NodeDetail node={node} onAsk={askFinding} />
                    </div>
                  </div>
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
