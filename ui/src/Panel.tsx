import { useState } from 'react'
import { NodeDetail, TableList, useNode, useOverview } from './model'

/** The chat side-panel tab: the same model as the page, in one narrow column. */
export default function SystemMapPanel() {
  const { overview, error } = useOverview()
  const [selected, setSelected] = useState<string | null>(null)
  const node = useNode(selected)

  if (error) return <p style={{ padding: 12, fontSize: 13 }}>{error}</p>
  if (!overview) return <p style={{ padding: 12, fontSize: 13 }}>Loading</p>

  return (
    <div style={{ padding: 12, overflowY: 'auto', height: '100%' }}>
      <p style={{ fontSize: 13, margin: '0 0 8px', opacity: 0.7 }}>
        {overview.tables.length} tables at {overview.manifest.commit.slice(0, 7)}
        {overview.freshness.stale ? `, ${overview.freshness.commits_behind} behind` : ''}
      </p>
      {node ? (
        <>
          <button onClick={() => setSelected(null)} style={{ marginBottom: 8 }}>
            Back
          </button>
          <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{node.name}</p>
          <NodeDetail node={node} />
        </>
      ) : (
        <TableList tables={overview.tables} selected={selected} onSelect={setSelected} />
      )}
    </div>
  )
}
