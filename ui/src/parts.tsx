import { Badge, SearchInput } from '@kirocrew/app-sdk/ui'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Finding, Severity, TableNode, TableRow } from './model'

export const MONO: CSSProperties = { fontFamily: 'var(--mono, ui-monospace, monospace)' }
export const MUTED: CSSProperties = { color: 'var(--muted, #71717a)' }

const SEVERITY_BADGE: Record<Severity, 'err' | 'warn' | 'muted' | 'aim'> = {
  high: 'err',
  medium: 'warn',
  low: 'muted',
  info: 'aim',
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge variant={SEVERITY_BADGE[severity]}>{severity}</Badge>
}

export function TableList({
  tables,
  selected,
  flagged,
  onSelect,
}: {
  tables: TableRow[]
  selected: string | null
  flagged?: Map<string, number>
  onSelect: (id: string) => void
}) {
  const [filter, setFilter] = useState('')
  const shown = tables.filter((table) => table.name.includes(filter.trim().toLowerCase()))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1, gap: 8 }}>
      <SearchInput
        aria-label="Filter tables"
        placeholder="Filter tables"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <div style={{ overflowY: 'auto', minHeight: 0, flex: 1 }}>
        {shown.map((table) => (
          <button
            key={table.id}
            onClick={() => onSelect(table.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
              width: '100%',
              padding: '4px 8px',
              border: 0,
              borderRadius: 6,
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
              color: 'var(--text, inherit)',
              background: table.id === selected ? 'var(--bg-hover, rgba(127,127,127,.2))' : 'transparent',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{table.name}</span>
            <span style={{ ...MUTED, display: 'flex', gap: 6, flexShrink: 0 }}>
              {flagged?.get(table.id) ? (
                <span title={`${flagged.get(table.id)} findings`} style={{ color: 'var(--warn-text, #b45309)' }}>
                  {flagged.get(table.id)}
                </span>
              ) : null}
              <span title={`${table.columns} columns`}>{table.columns}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{title}</p>
      {children}
    </div>
  )
}

const LIST: CSSProperties = { margin: 0, paddingLeft: 16 }

export function FindingList({ findings, onAsk }: { findings: Finding[]; onAsk?: (finding: Finding) => void }) {
  return (
    <>
      {findings.map((finding) => (
        <div key={finding.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
          <SeverityBadge severity={finding.severity} />
          <span style={{ flex: 1 }}>{finding.title}</span>
          {onAsk && (
            <button onClick={() => onAsk(finding)} style={ASK}>
              Ask
            </button>
          )}
        </div>
      ))}
    </>
  )
}

export const ASK: CSSProperties = {
  background: 'transparent',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  fontSize: 12,
  color: 'var(--accent, #2563eb)',
  flexShrink: 0,
}

export function NodeDetail({ node, onAsk }: { node: TableNode; onAsk?: (finding: Finding) => void }) {
  const keys = node.constraints.filter((c) => c.kind !== 'check')
  const checks = node.constraints.filter((c) => c.kind === 'check')
  return (
    <div style={{ fontSize: 13, color: 'var(--text, inherit)' }}>
      <p style={{ ...MUTED, ...MONO, fontSize: 12, margin: '0 0 8px', overflowWrap: 'anywhere' }}>{node.source}</p>
      {node.findings.length > 0 && (
        <Section title="Findings">
          <FindingList findings={node.findings} onAsk={onAsk} />
        </Section>
      )}
      <Section title={`Columns (${node.columns.length})`}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {node.columns.map((column) => (
              <tr key={column.name} title={column.source}>
                <td style={{ padding: '2px 8px 2px 0', overflowWrap: 'anywhere' }}>{column.name}</td>
                <td style={{ ...MUTED, ...MONO, fontSize: 12, padding: '2px 8px', overflowWrap: 'anywhere' }}>{column.type}</td>
                <td style={{ ...MUTED, fontSize: 12, padding: '2px 0', whiteSpace: 'nowrap' }}>
                  {column.nullable ? 'null' : 'not null'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      {keys.length > 0 && (
        <Section title="Keys">
          <ul style={LIST}>
            {keys.map((constraint) => (
              <li key={constraint.name} title={constraint.source}>
                {constraint.kind.replace('_', ' ')} ({constraint.columns.join(', ')})
                {constraint.references ? ` to ${constraint.references}, on delete ${constraint.on_delete}` : ''}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {checks.length > 0 && (
        <Section title="Checks">
          <ul style={LIST}>
            {checks.map((check) => (
              <li key={check.name} title={check.source} style={{ ...MONO, fontSize: 12, overflowWrap: 'anywhere' }}>
                {check.expression}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {node.indexes.length > 0 && (
        <Section title="Indexes">
          <ul style={LIST}>
            {node.indexes.map((index) => (
              <li key={index.name} title={index.source}>
                {index.name} ({index.columns.join(', ')}){index.unique ? ', unique' : ''}
                {index.partial ? ', partial' : ''}
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section title={`Row level security: ${node.rls ? 'on' : 'off'}`}>
        <ul style={LIST}>
          {node.policies.map((policy) => (
            <li key={policy.name} title={policy.source}>
              {policy.name}: {policy.command} for {policy.roles.join(', ')}
            </li>
          ))}
        </ul>
      </Section>
      {node.triggers.length > 0 && (
        <Section title="Triggers">
          <ul style={LIST}>
            {node.triggers.map((trigger) => (
              <li key={trigger.name} title={trigger.source}>
                {trigger.name}: {trigger.timing} {trigger.events.join(', ')}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {node.reads.length > 0 && (
        <Section title="Notes">
          {node.reads.map((note, index) => (
            <p key={index} style={{ margin: '0 0 6px' }}>
              {note.text}
            </p>
          ))}
        </Section>
      )}
    </div>
  )
}
