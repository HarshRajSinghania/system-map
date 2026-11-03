import { Badge, Btn, Input } from '@kirocrew/app-sdk/ui'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { shortPath } from './graphView'
import type { Link, NodeInfo, NodeRisk, Overlap, Plan, TableNode } from './model'
import { percent } from './overlay'
import { MONO, MUTED, NodeDetail, SeverityBadge } from './parts'

const SECTIONS: { key: string; title: string }[] = [
  { key: 'in_starts', title: 'Starts from' },
  { key: 'in_hands_off_to', title: 'Handed work by' },
  { key: 'out_hands_off_to', title: 'Hands off to' },
  { key: 'out_uses_model', title: 'Uses model' },
  { key: 'out_starts', title: 'Starts agents' },
  { key: 'in_uses_model', title: 'Agents that use it' },
  { key: 'in_renders', title: 'Routes that render it' },
  { key: 'out_uses_table', title: 'Tables it uses' },
  { key: 'in_uses_table', title: 'Used by' },
  { key: 'out_uses_service', title: 'Outside services' },
  { key: 'in_uses_service', title: 'Used by' },
  { key: 'out_imports', title: 'Imports' },
  { key: 'in_imports', title: 'Imported by' },
  { key: 'out_renders', title: 'Renders' },
  { key: 'out_calls', title: 'Calls' },
  { key: 'in_calls', title: 'Called by' },
  { key: 'in_touches', title: 'Plans that touch it' },
  { key: 'out_touches', title: 'Touches' },
]

function label(id: string): string {
  return shortPath(id.replace(/^(module|area|route|job|service|plan|table|agent):(public\.)?/, ''))
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{title}</p>
      {children}
    </div>
  )
}

function LinkRow({ link, onOpen }: { link: Link; onOpen: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }} title={link.evidence[0]}>
      <button
        onClick={() => onOpen(link.node)}
        style={{
          background: 'transparent',
          border: 0,
          padding: 0,
          fontSize: 13,
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--accent, #2563eb)',
          overflowWrap: 'anywhere',
        }}
      >
        {label(link.node)}
      </button>
      {link.access && <span style={{ ...MUTED, fontSize: 11 }}>{link.access === 'write' ? 'writes' : 'reads'}</span>}
      <span style={{ ...MUTED, fontSize: 11, marginLeft: 'auto' }}>{link.count}</span>
    </div>
  )
}

function Links({ node, onOpen }: { node: NodeInfo; onOpen: (id: string) => void }) {
  return (
    <>
      {SECTIONS.map(({ key, title }) => {
        const links = node.links?.[key]
        if (!links?.length) return null
        return (
          <Section key={key} title={`${title} (${links.length})`}>
            {links.map((link) => (
              <LinkRow key={link.node} link={link} onOpen={onOpen} />
            ))}
          </Section>
        )
      })}
    </>
  )
}

function Facts({ node }: { node: NodeInfo }) {
  const rows: [string, string | number | undefined][] = [
    ['Path', node.path],
    ['Files', node.files],
    ['Lines', node.lines],
    ['Test files', node.test_files],
    ['Schedule', node.schedule],
    ['Jobs', node.jobs?.join(', ')],
    ['Status', node.status],
  ]
  const shown = rows.filter(([, value]) => value !== undefined && value !== '')
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
      <tbody>
        {shown.map(([name, value]) => (
          <tr key={name}>
            <td style={{ ...MUTED, padding: '1px 8px 1px 0', whiteSpace: 'nowrap' }}>{name}</td>
            <td style={{ overflowWrap: 'anywhere' }}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PlanClaims({ node }: { node: NodeInfo }) {
  const claims = (node as unknown as Plan).claims ?? []
  const missing = claims.filter((claim) => !claim.found)
  if (missing.length === 0) return null
  return (
    <Section title={`Not found (${missing.length})`}>
      <ul style={{ ...MONO, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: 'anywhere' }}>
        {missing.map((claim) => (
          <li key={claim.claim} title={claim.source}>
            {claim.claim}
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Where an agent waits for a person, and where its models may send data. */
function AgentFacts({ node }: { node: NodeInfo }) {
  const asks = node.asks_you ?? []
  const leaves = node.leaves_region ?? []
  return (
    <>
      {node.description && <p style={{ margin: '0 0 12px' }}>{node.description}</p>}
      {leaves.length > 0 && (
        <Section title="Leaves your home region">
          <p style={{ margin: 0, color: 'var(--danger, #dc2626)' }}>{leaves.map(label).join(', ')}</p>
        </Section>
      )}
      <Section title={`Asks you (${asks.length})`}>
        {asks.length === 0 ? (
          <p style={{ ...MUTED, margin: 0 }}>No call that leaves work for a person was found.</p>
        ) : (
          <ul style={{ ...MONO, margin: 0, paddingLeft: 14, fontSize: 12, overflowWrap: 'anywhere' }}>
            {asks.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}

/** Where a service runs. A person sets it; nothing reads it from config. */
function RegionField({ node, onRegion }: { node: NodeInfo; onRegion: (id: string, region: string | null) => Promise<string | null> }) {
  const [value, setValue] = useState(node.region ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const save = async (region: string | null) => {
    setSaving(true)
    setError(await onRegion(node.id, region))
    setSaving(false)
  }
  const unchanged = value.trim() === (node.region ?? '')
  return (
    <Section title="Region">
      <div style={{ display: 'flex', gap: 6 }}>
        <Input aria-label={`Region of ${node.name}`} placeholder="Where it runs, such as US" value={value} onChange={(event) => setValue(event.target.value)} style={{ flex: 1, minWidth: 0 }} />
        <Btn disabled={saving || !value.trim() || unchanged} onClick={() => void save(value.trim())}>
          Save
        </Btn>
        {node.region && (
          <Btn disabled={saving} onClick={() => void save(null)}>
            Clear
          </Btn>
        )}
      </div>
      <p style={{ ...MUTED, fontSize: 11, margin: '4px 0 0' }}>You set this. Agents that use it are checked against your home region.</p>
      {error && <p style={{ color: 'var(--danger, #dc2626)', margin: '4px 0 0' }}>{error}</p>}
    </Section>
  )
}

function RiskFacts({ risk }: { risk: NodeRisk }) {
  const tested = risk.covered === null ? `${risk.reached_files ?? 0} of ${risk.files ?? 0} files reached` : `${percent(risk.covered)} of lines`
  const flag = risk.hot && risk.untested ? 'Hot and untested' : risk.hot ? 'Hot' : risk.untested ? 'Untested' : null
  return (
    <Section title={flag ? `Risk: ${flag}` : 'Risk'}>
      <p style={{ margin: '0 0 4px' }}>
        {risk.commits} commits in {risk.window_days} days, {risk.complexity} paths, tests: {tested}.
      </p>
      {risk.worst_files.length > 0 && (
        <ul style={{ ...MONO, margin: 0, paddingLeft: 14, fontSize: 11, overflowWrap: 'anywhere' }}>
          {risk.worst_files.map((file) => (
            <li key={file.path} title={`${file.commits} commits, ${file.complexity} paths`}>
              {shortPath(file.path)}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function WorkOnIt({ names, overlaps }: { names: string[]; overlaps: Overlap[] }) {
  if (names.length === 0) return null
  return (
    <Section title={`Worktrees on it (${names.length})`}>
      <ul style={{ margin: 0, paddingLeft: 14, overflowWrap: 'anywhere' }}>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      {overlaps.map((row) => (
        <p key={`${row.a}|${row.b}`} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', margin: '6px 0 0' }}>
          <SeverityBadge severity={row.severity} />
          <span>{row.summary}</span>
        </p>
      ))}
    </Section>
  )
}

export function Inspector({
  node,
  work,
  overlaps,
  onAsk,
  onOpen,
  onClose,
  canAsk,
  onAskFinding,
  onRegion,
}: {
  node: NodeInfo
  work: string[]
  overlaps: Overlap[]
  onAsk: () => void
  onOpen: (id: string) => void
  onClose: () => void
  canAsk: boolean
  onAskFinding: Parameters<typeof NodeDetail>[0]['onAsk']
  /** Save where a service runs, or clear it. Resolves to a problem to show, or null. */
  onRegion?: (id: string, region: string | null) => Promise<string | null>
}) {
  const isTable = node.id.startsWith('table:')
  return (
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
        boxSizing: 'border-box',
        borderRadius: 8,
        background: 'var(--card, #fff)',
        border: '1px solid var(--border, #e4e4e7)',
        boxShadow: '0 4px 16px rgba(0,0,0,.12)',
        zIndex: 5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14, color: 'var(--text, inherit)', overflowWrap: 'anywhere' }}>{node.label ?? node.name}</span>
        {!isTable && <Badge variant="muted">{node.kind}</Badge>}
        <Btn primary onClick={onAsk} disabled={!canAsk}>
          Ask
        </Btn>
        <Btn onClick={onClose} aria-label="Close">
          Close
        </Btn>
      </div>
      <div style={{ overflowY: 'auto', minHeight: 0, flex: 1, fontSize: 13, color: 'var(--text, inherit)' }}>
        <WorkOnIt names={work} overlaps={overlaps} />
        {node.kind === 'agent' && <AgentFacts node={node} />}
        {node.kind === 'service' && onRegion && <RegionField key={`${node.id}|${node.region ?? ''}`} node={node} onRegion={onRegion} />}
        {node.risk && <RiskFacts risk={node.risk} />}
        {isTable ? <NodeDetail node={node as unknown as TableNode} onAsk={onAskFinding} /> : <Facts node={node} />}
        {!isTable && <PlanClaims node={node} />}
        <Links node={node} onOpen={onOpen} />
        {!isTable && (
          <p style={{ ...MUTED, ...MONO, fontSize: 11, margin: 0, overflowWrap: 'anywhere' }}>{node.evidence?.join('  ')}</p>
        )}
      </div>
    </div>
  )
}
