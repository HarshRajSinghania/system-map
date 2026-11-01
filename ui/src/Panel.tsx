import { Btn } from '@kirocrew/app-sdk/ui'
import { useState } from 'react'
import { useActiveRepo, useNode, useOverview } from './model'
import { MUTED, NodeDetail, TableList } from './parts'

/** The chat side-panel tab: the same model as the page, in one narrow column. */
export default function SystemMapPanel() {
  const { active, loaded, repos } = useActiveRepo()
  const { overview, error } = useOverview(active)
  const [selected, setSelected] = useState<string | null>(null)
  const node = useNode(selected, active)

  if (error) return <p style={{ padding: 12, fontSize: 13 }}>{error}</p>
  if (loaded && repos.length === 0) {
    return <p style={{ padding: 12, fontSize: 13 }}>No model yet. Open System Map from Apps to build one.</p>
  }
  if (!overview) return <p style={{ padding: 12, fontSize: 13 }}>Loading</p>

  return (
    <div style={{ padding: 12, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <p style={{ ...MUTED, fontSize: 13, margin: '0 0 8px' }}>
        {overview.tables.length} tables at {overview.manifest.commit.slice(0, 7)}
        {overview.freshness.stale ? `, ${overview.freshness.commits_behind} behind` : ''}
      </p>
      {node ? (
        <div style={{ overflowY: 'auto', minHeight: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Btn onClick={() => setSelected(null)}>Back</Btn>
            <span style={{ fontWeight: 600 }}>{node.name}</span>
          </div>
          <NodeDetail node={node} />
        </div>
      ) : (
        <TableList tables={overview.tables} selected={selected} onSelect={setSelected} />
      )}
    </div>
  )
}
