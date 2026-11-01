import { ChatEmbed, useAppApi, useChatLauncher } from '@kirocrew/app-sdk'
import { Card, CardTitle, PageHeader, StatCard } from '@kirocrew/app-sdk/ui'
import { useEffect, useState } from 'react'
import { NodeDetail, TableList, useNode, useOverview } from './model'

const SLOT_NAME = 'system-map-design'

function useDesignSlot() {
  const api = useAppApi()
  const [slot, setSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .post<{ key?: string; slot_key?: string; slot?: string; sid?: string; id?: string }>('/api/chat/slots', {
        name: SLOT_NAME,
      })
      .then((created: Record<string, string | undefined>) =>
        setSlot(created.key ?? created.slot_key ?? created.slot ?? created.sid ?? created.id ?? null),
      )
      .catch((caught: unknown) => setError(String(caught)))
  }, [api])

  return { slot, error }
}

export default function SystemMap() {
  const { overview, error, refresh } = useOverview()
  const [selected, setSelected] = useState<string | null>(null)
  const node = useNode(selected)
  const { slot, error: slotError } = useDesignSlot()
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
        {error && (
          <Card>
            <CardTitle>No model yet</CardTitle>
            <p style={{ fontSize: 13 }}>{error}</p>
            <button onClick={() => void refresh()}>Retry</button>
          </Card>
        )}
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
