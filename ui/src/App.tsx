import { ChatEmbed, useAppApi, useChatLauncher } from '@kirocrew/app-sdk'
import { Card, CardTitle, PageHeader, StatCard } from '@kirocrew/app-sdk/ui'
import { useEffect, useState } from 'react'
import { BASE, NodeDetail, TableList, useNode, useOverview } from './model'

const SLOT_NAME = 'system-map-design'

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
    open().catch((caught: unknown) => live && setError(String(caught)))
    return () => {
      live = false
    }
  }, [api, repo])

  return { slot, error }
}

function BuildModel({ message, onBuilt }: { message: string; onBuilt: () => void }) {
  const api = useAppApi()
  const [path, setPath] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const build = async () => {
    setBusy(true)
    setError(null)
    try {
      await api.post(`${BASE}/build`, { repo_path: path.trim() })
      onBuilt()
    } catch (caught) {
      setError(String(caught))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardTitle>Build a model</CardTitle>
      <p style={{ fontSize: 13, opacity: 0.7 }}>{message}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          aria-label="Repo path"
          placeholder="/path/to/repo"
          value={path}
          onChange={(event) => setPath(event.target.value)}
          style={{ flex: 1, padding: '4px 8px', fontSize: 13, background: 'transparent', color: 'inherit', border: '1px solid currentColor', borderRadius: 4 }}
        />
        <button disabled={busy || !path.trim()} onClick={() => void build()}>
          {busy ? 'Building' : 'Build'}
        </button>
      </div>
      {error && <p style={{ fontSize: 13 }}>{error}</p>}
    </Card>
  )
}

export default function SystemMap() {
  const { overview, error, refresh } = useOverview()
  const [selected, setSelected] = useState<string | null>(null)
  const node = useNode(selected)
  const { slot, error: slotError } = useDesignSlot(overview ? overview.manifest.repo : null)
  const { openChat } = useChatLauncher()

  const ask = () => {
    if (!node) return
    openChat({
      autoSend: false,
      message: `Using the system-map tools, look at node ${node.id} and tell me what to watch out for.`,
    })
  }

  return (
    <>
      <PageHeader title="System Map" subtitle={overview ? overview.manifest.repo : 'One model of your system'} />
      <div style={{ padding: '0 24px 32px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {error && <BuildModel message={error} onBuilt={() => void refresh()} />}
        {overview && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 20 }}>
              <StatCard label="Tables" value={String(overview.tables.length)} accent />
              <StatCard label="Commit" value={overview.manifest.commit.slice(0, 7)} />
              <StatCard
                label="Freshness"
                value={overview.freshness.stale ? `${overview.freshness.commits_behind} behind` : 'Current'}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr) minmax(320px, 1fr)', gap: 14 }}>
              <Card>
                <CardTitle>Tables</CardTitle>
                <TableList tables={overview.tables} selected={selected} onSelect={setSelected} />
              </Card>
              <Card>
                <CardTitle>{node ? node.name : 'Pick a table'}</CardTitle>
                {node && <NodeDetail node={node} />}
                {node && (
                  <button onClick={ask} style={{ marginTop: 12 }}>
                    Ask about this table
                  </button>
                )}
              </Card>
              <Card>
                <CardTitle>Design chat</CardTitle>
                {slotError && <p style={{ fontSize: 13 }}>Chat is not available: {slotError}</p>}
                {slot && (
                  <div style={{ height: 480 }}>
                    <ChatEmbed slotKey={slot} frameless startAtBottom placeholder="Ask about the system" />
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  )
}
