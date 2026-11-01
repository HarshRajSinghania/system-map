import { Badge } from '@kirocrew/app-sdk/ui'
import type { CSSProperties, ReactNode } from 'react'
import { shortPath } from './graphView'
import type { Overlap, Worktree, WorktreeState } from './model'
import { ASK, MONO, MUTED, SeverityBadge } from './parts'

const CARD: CSSProperties = {
  padding: 10,
  borderRadius: 8,
  background: 'var(--card, #fff)',
  border: '1px solid var(--border, #e4e4e7)',
  fontSize: 13,
}
const LINK: CSSProperties = { background: 'transparent', border: 0, padding: 0, cursor: 'pointer', fontSize: 12, color: 'var(--accent, #2563eb)', textAlign: 'left', overflowWrap: 'anywhere' }
const FILES: CSSProperties = { ...MONO, margin: '2px 0 0', paddingLeft: 14, fontSize: 11, overflowWrap: 'anywhere' }
const SHOWN_FILES = 6

function nodeName(id: string): string {
  return shortPath(id.replace(/^(module|table|route|plan|job):(public\.)?/, ''))
}

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 6 }}>
      <span style={{ ...MUTED, fontSize: 12 }}>{title}</span>
      {children}
    </div>
  )
}

function Nodes({ ids, onShow }: { ids: string[]; onShow: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 10px' }}>
      {ids.map((id) => (
        <button key={id} style={LINK} onClick={() => onShow(id)}>
          {nodeName(id)}
        </button>
      ))}
    </div>
  )
}

function FileList({ files }: { files: string[] }) {
  return (
    <ul style={FILES}>
      {files.slice(0, SHOWN_FILES).map((file) => (
        <li key={file}>{file}</li>
      ))}
      {files.length > SHOWN_FILES && <li style={MUTED}>and {files.length - SHOWN_FILES} more</li>}
    </ul>
  )
}

const MERGE_NOTE: Partial<Record<Overlap['merge'], string>> = {
  uncommitted: 'Uncommitted work, so no trial merge yet',
  unknown: 'Git could not try this merge',
}

/** A small overlap takes one line, so it never pushes a collision out of view. */
function OverlapLine({ row, canAsk, onAsk }: { row: Overlap; canAsk: boolean; onAsk: (row: Overlap) => void }) {
  const note = MERGE_NOTE[row.merge]
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 13 }} title={row.files.join('\n')} data-testid={`overlap-${row.severity}`}>
      <SeverityBadge severity={row.severity} />
      <span style={{ flex: 1, overflowWrap: 'anywhere' }}>
        {row.summary}
        {note && <span style={MUTED}>. {note}</span>}
      </span>
      <button style={ASK} onClick={() => onAsk(row)} disabled={!canAsk}>
        Ask
      </button>
    </div>
  )
}

function OverlapCard({ row, canAsk, onShow, onAsk }: { row: Overlap; canAsk: boolean; onShow: (id: string) => void; onAsk: (row: Overlap) => void }) {
  const shared = row.files.filter((file) => !row.conflicts.includes(file))
  const note = MERGE_NOTE[row.merge]
  return (
    <div style={CARD} data-testid={`overlap-${row.severity}`}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <SeverityBadge severity={row.severity} />
        <span style={{ flex: 1, fontWeight: 600, overflowWrap: 'anywhere' }}>{row.summary}</span>
        <button style={ASK} onClick={() => onAsk(row)} disabled={!canAsk}>
          Ask
        </button>
      </div>
      {row.conflicts.length > 0 && (
        <Part title="Conflicts in a trial merge">
          <FileList files={row.conflicts} />
        </Part>
      )}
      {row.schema.length > 0 && (
        <Part title="Both change these tables">
          <Nodes ids={row.schema} onShow={onShow} />
        </Part>
      )}
      {row.schema_and_code.length > 0 && (
        <Part title="One changes these tables, the other their code">
          <Nodes ids={row.schema_and_code} onShow={onShow} />
        </Part>
      )}
      {row.code.length > 0 && (
        <Part title="Both change code that uses these tables">
          <Nodes ids={row.code} onShow={onShow} />
        </Part>
      )}
      {shared.length > 0 && (
        <Part title="Also share">
          <FileList files={shared} />
        </Part>
      )}
      {row.modules.length > 0 && (
        <Part title="Same modules">
          <Nodes ids={row.modules} onShow={onShow} />
        </Part>
      )}
      {note && <p style={{ ...MUTED, margin: '6px 0 0', fontSize: 12 }}>{note}</p>}
    </div>
  )
}

function WorktreeCard({ tree, onShow }: { tree: Worktree; onShow: (id: string) => void }) {
  const other = tree.other_nodes.filter((id) => !id.startsWith('job:'))
  return (
    <div style={CARD} data-testid="worktree">
      <p style={{ margin: 0, fontWeight: 600, overflowWrap: 'anywhere' }}>{tree.name}</p>
      <p style={{ ...MUTED, ...MONO, margin: '2px 0 4px', fontSize: 11, overflowWrap: 'anywhere' }}>{tree.path}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Badge variant="muted">{tree.ahead} ahead</Badge>
        {tree.behind > 0 && <Badge variant="muted">{tree.behind} behind</Badge>}
        {tree.uncommitted_files > 0 && <Badge variant="warn">{tree.uncommitted_files} uncommitted</Badge>}
        <Badge variant="muted">{tree.files.length} files</Badge>
      </div>
      {tree.tables_schema.length > 0 && (
        <Part title="Changes these tables">
          <Nodes ids={tree.tables_schema} onShow={onShow} />
        </Part>
      )}
      {tree.modules.length > 0 && (
        <Part title="Modules">
          <Nodes ids={tree.modules} onShow={onShow} />
        </Part>
      )}
      {tree.tables_code.length > 0 && (
        <Part title="Code that uses">
          <Nodes ids={tree.tables_code} onShow={onShow} />
        </Part>
      )}
      {other.length > 0 && (
        <Part title="Routes and plans">
          <Nodes ids={other} onShow={onShow} />
        </Part>
      )}
    </div>
  )
}

export function WorktreesView({
  state,
  checkedAt,
  canAsk,
  onShow,
  onAsk,
}: {
  state: WorktreeState
  checkedAt: number | null
  canAsk: boolean
  onShow: (id: string) => void
  onAsk: (row: Overlap) => void
}) {
  const { high, medium } = state.counts
  const serious = high + medium
  const minor = state.overlaps.length - serious
  const working = state.worktrees.filter((tree) => tree.files.length > 0)
  const idle = state.worktrees.length - working.length
  const headline = serious === 0 ? 'No collisions ahead.' : `${serious} collision${serious === 1 ? '' : 's'} ahead.`
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: 16, gap: 12, color: 'var(--text, inherit)', overflow: 'hidden' }}>
      <p style={{ margin: 0, fontSize: 14 }} data-testid="worktree-summary">
        <strong>{headline}</strong>{' '}
        <span style={{ ...MUTED, fontSize: 13 }}>
          {working.length} of {state.worktrees.length} worktrees have changes{minor ? `, with ${minor} smaller overlap${minor === 1 ? '' : 's'}` : ''}.
          {checkedAt ? ` Checked ${new Date(checkedAt).toLocaleTimeString()}.` : ''}
        </span>
      </p>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {serious > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {state.overlaps
              .filter((row) => row.severity === 'high' || row.severity === 'medium')
              .map((row) => (
                <OverlapCard key={`${row.a}|${row.b}`} row={row} canAsk={canAsk} onShow={onShow} onAsk={onAsk} />
              ))}
          </section>
        )}
        <section>
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 13 }}>Worktrees with changes</p>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {working.map((tree) => (
              <WorktreeCard key={tree.path} tree={tree} onShow={onShow} />
            ))}
          </div>
          {working.length === 0 && <p style={{ ...MUTED, fontSize: 13 }}>No worktree has changes.</p>}
          {idle > 0 && <p style={{ ...MUTED, fontSize: 12, marginBottom: 0 }}>{idle} more with nothing to merge.</p>}
        </section>
        {minor > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>Smaller overlaps</p>
            {state.overlaps
              .filter((row) => row.severity === 'low' || row.severity === 'info')
              .map((row) => (
                <OverlapLine key={`${row.a}|${row.b}`} row={row} canAsk={canAsk} onAsk={onAsk} />
              ))}
          </section>
        )}
      </div>
    </div>
  )
}
