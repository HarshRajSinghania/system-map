import { Badge, Btn } from '@kirocrew/app-sdk/ui'
import type { CSSProperties } from 'react'
import { draftFinds, draftRows, staleLine, STATUS_LABEL } from './agentRows'
import type { AgentDraft, AgentSettingKey, AgentSettings } from './model'
import { MONO, MUTED } from './parts'

const CELL: CSSProperties = { padding: '5px 8px', textAlign: 'left', verticalAlign: 'top' }
const HEAD: CSSProperties = { ...CELL, fontSize: 12, fontWeight: 600, color: 'var(--muted, #71717a)' }

/** Settings the Design chat drafted, what they find, and the person's three choices. */
export function AgentDraftCard({
  draft,
  changed,
  stale,
  saved,
  busy,
  error,
  onUse,
  onEdit,
  onDrop,
}: {
  draft: AgentDraft
  changed: AgentSettingKey[]
  stale: boolean
  saved: AgentSettings
  busy: boolean
  error: string | null
  onUse: () => void
  onEdit: () => void
  onDrop: () => void
}) {
  const rows = draftRows(draft, changed, saved)
  return (
    <section data-testid="agent-draft" style={{ border: '1px solid var(--accent, #2563eb)', borderRadius: 8, padding: 12, background: 'var(--card, #fff)', fontSize: 13, maxWidth: 820 }}>
      <strong style={{ fontSize: 14 }}>Drafted by the Design chat</strong>
      {stale && (
        <p data-testid="agent-draft-stale" style={{ margin: '4px 0 0', color: 'var(--warn-text, #b45309)' }}>
          {staleLine(draft)}
        </p>
      )}
      {draft.note && <p style={{ margin: '6px 0 0' }}>{draft.note}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border, #e4e4e7)' }}>
            <th style={HEAD}>Setting</th>
            <th style={HEAD}>Value</th>
            <th style={HEAD}>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} style={{ borderBottom: '1px solid var(--border, #e4e4e7)' }}>
              <td style={{ ...CELL, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {row.label} {row.changed && <Badge variant="aim">changed</Badge>}
              </td>
              <td style={{ ...CELL, overflowWrap: 'anywhere' }}>
                {row.value === null ? <span style={MUTED}>none</span> : <span style={row.key === 'home_region' ? undefined : MONO}>{row.value}</span>}
                {row.was !== null && <div style={{ ...MUTED, fontSize: 12 }}>was {row.was}</div>}
              </td>
              <td style={{ ...CELL, ...MONO, ...MUTED, fontSize: 12, overflowWrap: 'anywhere' }}>
                {row.evidence.length ? row.evidence.map((line) => <div key={line}>{line}</div>) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: '0 0 4px', fontWeight: 600 }} data-testid="agent-draft-finds">
        {draftFinds(draft)}
      </p>
      {draft.agents.length > 0 && (
        <p style={{ margin: 0 }}>
          {draft.agents.map((agent) => (agent.status === 'built' ? agent.label : `${agent.label} (${STATUS_LABEL[agent.status]})`)).join(', ')}
        </p>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
        <Btn primary disabled={busy} onClick={onUse}>
          {busy ? 'Saving…' : 'Use these'}
        </Btn>
        <Btn disabled={busy} onClick={onEdit}>
          Edit first
        </Btn>
        <Btn disabled={busy} onClick={onDrop}>
          Drop
        </Btn>
        {error && <span style={{ color: 'var(--danger, #dc2626)' }}>{error}</span>}
      </div>
    </section>
  )
}
