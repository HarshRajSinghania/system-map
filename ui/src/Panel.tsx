import { Btn } from '@kirocrew/app-sdk/ui'
import { useState } from 'react'
import { useActiveRepo, useLive, useNode, useOverview } from './model'
import type { WorktreeState } from './model'
import { tablesAtWork } from './overlay'
import { MUTED, NodeDetail, SeverityBadge, TableList } from './parts'

const CHECK_EVERY_MS = 30000

/** The chat side-panel tab: the same model as the page, in one narrow column. */
export default function SystemMapPanel() {
  const { active, loaded, repos } = useActiveRepo()
  const { overview, error } = useOverview(active)
  const [selected, setSelected] = useState<string | null>(null)
  const node = useNode(selected, active)
  const worktrees = useLive<WorktreeState>('/worktrees', active, CHECK_EVERY_MS).value
  const collisions = (worktrees?.overlaps ?? []).filter((row) => row.severity === 'high' || row.severity === 'medium')

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
      {collisions.map((row) => (
        <p
          key={`${row.a}|${row.b}`}
          data-testid="panel-collision"
          style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 13, margin: '0 0 8px', overflowWrap: 'anywhere' }}
        >
          <SeverityBadge severity={row.severity} />
          <span>{row.summary}</span>
        </p>
      ))}
      {node ? (
        <div style={{ overflowY: 'auto', minHeight: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Btn onClick={() => setSelected(null)}>Back</Btn>
            <span style={{ fontWeight: 600 }}>{node.name}</span>
          </div>
          <NodeDetail node={node} />
        </div>
      ) : (
        <TableList tables={overview.tables} selected={selected} working={tablesAtWork(worktrees)} onSelect={setSelected} />
      )}
    </div>
  )
}
