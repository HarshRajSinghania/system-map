import { Btn } from '@kirocrew/app-sdk/ui'
import { Chevron, Dropdown } from './Menu'
import { MUTED } from './parts'
import { builtAgo } from './projects'
import type { StatusView } from './projects'

/** How current the model is, in one place, with Rebuild beside it. */
export function StatusChip({
  status,
  detail,
  commit,
  builtAt,
  busy,
  result,
  onRebuild,
}: {
  status: StatusView
  /** A sharper reason than the status gives on its own. */
  detail?: string
  commit: string
  builtAt: number
  busy: boolean
  result: string | null
  onRebuild: () => void
}) {
  const label = busy ? 'Rebuilding' : status.label
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span role="status" style={{ ...MUTED, fontSize: 13 }} data-testid="rebuild-result">
        {!busy && result}
      </span>
      {status.rebuild && !busy && (
        <Btn primary onClick={onRebuild}>
          Rebuild
        </Btn>
      )}
      <Dropdown
        width={270}
        align="right"
        label="Model status"
        trigger={(props) => (
          <button type="button" className="sm-plain sm-chip" data-testid="status-chip" {...props}>
            <span className="sm-dot" data-tone={busy ? 'muted' : status.tone} />
            {label}
            <Chevron />
          </button>
        )}
      >
        {() => (
          <div style={{ padding: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 2, overflowWrap: 'anywhere' }}>{detail ?? status.detail}</div>
            <div style={{ ...MUTED, marginBottom: 10 }}>
              <span className="sm-mono">{commit.slice(0, 7)}</span>, built {builtAgo(builtAt, Date.now() / 1000)}
            </div>
            {status.label !== 'Folder missing' && (
              <Btn primary={status.rebuild} disabled={busy} onClick={onRebuild} autoFocus>
                {busy ? 'Rebuilding' : 'Rebuild'}
              </Btn>
            )}
          </div>
        )}
      </Dropdown>
    </span>
  )
}
