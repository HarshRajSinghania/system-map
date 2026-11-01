import { Badge, Btn, Input } from '@kirocrew/app-sdk/ui'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { shortPath } from './graphView'
import type { DiffRow, ExploreData, Limit, LimitKind, Proposal, ProposalRow, SavedView, UseCase, UseCasePart } from './model'
import { percent } from './overlay'
import { ASK, MONO, MUTED, SeverityBadge } from './parts'

export type Tab = 'whatif' | 'cases' | 'views'

const TABS: [Tab, string][] = [
  ['whatif', 'What if'],
  ['cases', 'Use cases'],
  ['views', 'Views'],
]

const PROMPTS: Record<Tab, { placeholder: string; ask: (text: string) => string }> = {
  whatif: {
    placeholder: 'What if we sent weekly reminders?',
    ask: (text) => `Use the system-map tools. Draft a proposal with \`propose\` for this idea, using the real schema, and fix what its limits show: ${text}`,
  },
  cases: {
    placeholder: 'A customer sees which invoices are due this week',
    ask: (text) => `Use the system-map tools. Map this use case with \`use_case\`, to the routes, tables and modules it needs, naming parts that do not exist yet: ${text}`,
  },
  views: {
    placeholder: 'Show everything around the users table',
    ask: (text) => `Use the system-map tools. Save this as a view with \`save_view\`: ${text}`,
  },
}

const LIMIT_GROUPS: { kind: LimitKind; title: string }[] = [
  { kind: 'refused', title: 'Postgres will refuse' },
  { kind: 'cannot_support', title: "The schema can't hold" },
  { kind: 'breaks', title: 'This breaks' },
  { kind: 'advice', title: 'Worth knowing' },
]

const STATUS_BADGE: Record<string, 'ok' | 'muted' | 'aim'> = { accepted: 'ok', dropped: 'muted', draft: 'aim' }
const STATE: Record<UseCase['state'], { variant: 'ok' | 'warn' | 'err'; label: string }> = {
  ready: { variant: 'ok', label: 'Ready' },
  gaps: { variant: 'warn', label: 'Has gaps' },
  missing: { variant: 'err', label: 'Missing parts' },
}

const ROW: CSSProperties = { padding: 10, borderRadius: 8, background: 'var(--card, #fff)', border: '1px solid var(--border, #e4e4e7)', fontSize: 13 }
const PICK: CSSProperties = { ...ROW, display: 'block', width: '100%', boxSizing: 'border-box', textAlign: 'left', cursor: 'pointer', color: 'var(--text, inherit)' }
const NOTE: CSSProperties = { ...MUTED, ...MONO, fontSize: 11, overflowWrap: 'anywhere' }

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

function nodeName(id: string): string {
  return shortPath(id.replace(/^(module|table|route|plan|job|area|service):(public\.)?/, ''))
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 12 }}>
      <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 13 }}>{title}</p>
      {children}
    </section>
  )
}

function LimitRow({ limit }: { limit: Pick<Limit, 'severity' | 'title' | 'detail' | 'evidence'> }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 13 }} data-testid="limit">
      <SeverityBadge severity={limit.severity} />
      <div style={{ minWidth: 0 }}>
        <div style={{ overflowWrap: 'anywhere' }}>{limit.title}</div>
        <div style={{ ...MUTED, fontSize: 12 }}>{limit.detail}</div>
        {limit.evidence.length > 0 && <div style={NOTE}>{limit.evidence.join('  ')}</div>}
      </div>
    </div>
  )
}

function DiffList({ title, rows, onShow, note }: { title: string; rows: DiffRow[]; onShow: (id: string) => void; note?: (row: DiffRow) => string }) {
  if (rows.length === 0) return null
  return (
    <Group title={`${title} (${rows.length})`}>
      {rows.map((row) => (
        <div key={row.id} style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 13, marginBottom: 2 }}>
          <button style={{ ...ASK, fontSize: 13, textAlign: 'left', overflowWrap: 'anywhere' }} onClick={() => onShow(row.id)}>
            {row.name ?? nodeName(row.id)}
          </button>
          {note && <span style={{ ...MUTED, fontSize: 12 }}>{note(row)}</span>}
        </div>
      ))}
    </Group>
  )
}

function ProposalDetail({
  proposal,
  shown,
  canAsk,
  onBack,
  onDraw,
  onNode,
  onAsk,
  onStatus,
  onDelete,
}: {
  proposal: Proposal
  shown: boolean
  canAsk: boolean
  onBack: () => void
  onDraw: (level: 'map' | 'data') => void
  onNode: (id: string) => void
  onAsk: () => void
  onStatus: (status: ProposalRow['status']) => void
  onDelete: () => void
}) {
  const sql = proposal.sql.flatMap((row) => row.sql)
  return (
    <div data-testid="proposal-detail">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Btn onClick={onBack}>Back</Btn>
        <strong style={{ fontSize: 14, overflowWrap: 'anywhere' }}>{proposal.title}</strong>
        <Badge variant={STATUS_BADGE[proposal.status]}>{proposal.status}</Badge>
        <span style={{ flex: 1 }} />
        <Btn primary={shown} onClick={() => onDraw('map')}>
          Show on map
        </Btn>
        <Btn onClick={() => onDraw('data')}>Show in data model</Btn>
        <Btn onClick={onAsk} disabled={!canAsk}>
          Ask
        </Btn>
      </div>
      {proposal.why && <p style={{ ...MUTED, fontSize: 13, margin: '6px 0 0' }}>{proposal.why}</p>}
      {proposal.closes.map((row) => (
        <p key={row.id} style={{ fontSize: 13, margin: '8px 0 0' }} data-testid="closes">
          Closes {row.before - row.after} of {plural(row.before, 'gap')} in <strong>{row.title}</strong>.
        </p>
      ))}
      {LIMIT_GROUPS.map(({ kind, title }) => {
        const limits = proposal.limits.filter((limit) => limit.kind === kind)
        if (limits.length === 0) return null
        return (
          <Group key={kind} title={`${title} (${limits.length})`}>
            {limits.map((limit, index) => (
              <LimitRow key={index} limit={limit} />
            ))}
          </Group>
        )
      })}
      <DiffList title="Adds" rows={proposal.diff.added} onShow={onNode} note={(row) => row.kind ?? ''} />
      <DiffList title="Changes" rows={proposal.diff.changed} onShow={onNode} note={(row) => (row.what ?? []).join(', ')} />
      <DiffList title="Removes" rows={proposal.diff.removed} onShow={onNode} />
      <DiffList title="Touches today" rows={proposal.diff.touched} onShow={onNode} note={(row) => row.access ?? ''} />
      {proposal.limits_checked === false && (
        <p style={{ ...MUTED, fontSize: 13 }} data-testid="limits-note">
          Limits check Postgres only, so this hasn't been checked against this project's database.
        </p>
      )}
      {sql.length > 0 && (
        <Group title="Draft SQL">
          <pre style={{ ...MONO, fontSize: 11, margin: 0, padding: 8, borderRadius: 6, background: 'var(--bg-hover, #f4f4f5)', overflowX: 'auto' }}>{sql.join('\n')}</pre>
        </Group>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {proposal.status !== 'accepted' && (
          <Btn primary onClick={() => onStatus('accepted')}>
            Accept
          </Btn>
        )}
        {proposal.status !== 'dropped' && <Btn onClick={() => onStatus('dropped')}>Drop</Btn>}
        {proposal.status !== 'draft' && <Btn onClick={() => onStatus('draft')}>Back to draft</Btn>}
        <span style={{ flex: 1 }} />
        <Btn danger onClick={onDelete}>
          Delete
        </Btn>
      </div>
      <p style={{ ...MUTED, fontSize: 12, marginBottom: 0 }}>This stays in System Map. Nothing here changes your repo.</p>
    </div>
  )
}

function ProposalList({ rows, onOpen }: { rows: ProposalRow[]; onOpen: (id: string) => void }) {
  if (rows.length === 0) return <p style={{ ...MUTED, fontSize: 13 }}>No proposals yet. Describe a change above, and the Design chat drafts one.</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((row) => {
        const stopped = row.limits.refused + row.limits.cannot_support
        return (
          <button key={row.id} style={PICK} onClick={() => onOpen(row.id)} data-testid={`proposal-${row.id}`}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <strong style={{ flex: 1, overflowWrap: 'anywhere' }}>{row.title}</strong>
              {stopped > 0 && <Badge variant="err">{plural(stopped, 'blocker')}</Badge>}
              {row.limits.breaks > 0 && <Badge variant="warn">{row.limits.breaks} breaks</Badge>}
              <Badge variant={STATUS_BADGE[row.status]}>{row.status}</Badge>
            </span>
            <span style={{ ...MUTED, fontSize: 12 }}>
              {row.diff.added} added, {row.diff.changed} changed, {row.diff.removed} removed, {row.diff.touched} touched
            </span>
          </button>
        )
      })}
    </div>
  )
}

function partNote(part: UseCasePart): string {
  if (!part.exists) return 'missing'
  if (part.kind === 'table') return `${part.writers?.length ?? 0} write, ${part.readers?.length ?? 0} read`
  const browser = part.browser_tests?.length ?? 0
  const unit = part.tests ?? 0
  const words = [`${plural(unit, 'unit test')}`, browser ? plural(browser, 'browser test') : '']
  if (part.covered !== undefined && part.covered !== null) words.push(`${percent(part.covered)} of lines`)
  return words.filter(Boolean).join(', ')
}

function UseCaseCard({ item, canAsk, onShow, onAsk, onDelete }: { item: UseCase; canAsk: boolean; onShow: (id: string) => void; onAsk: () => void; onDelete: () => void }) {
  return (
    <div style={ROW} data-testid={`use-case-${item.id}`}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <strong style={{ flex: 1, overflowWrap: 'anywhere' }}>{item.title}</strong>
        <Badge variant={STATE[item.state].variant}>{STATE[item.state].label}</Badge>
        <button style={ASK} onClick={onAsk} disabled={!canAsk}>
          Ask
        </button>
        <button style={{ ...ASK, color: 'var(--muted, #71717a)' }} onClick={onDelete}>
          Delete
        </button>
      </div>
      {(item.actor || item.goal) && <p style={{ ...MUTED, fontSize: 12, margin: '2px 0 0' }}>{[item.actor, item.goal].filter(Boolean).join(': ')}</p>}
      {item.gaps.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {item.gaps.map((gap, index) => (
            <LimitRow key={index} limit={gap} />
          ))}
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 12 }}>
        <tbody>
          {item.parts.map((part) => (
            <tr key={part.id}>
              <td style={{ padding: '2px 8px 2px 0', ...MUTED }}>{part.kind}</td>
              <td style={{ padding: '2px 8px 2px 0', overflowWrap: 'anywhere' }}>
                {part.exists ? (
                  <button style={{ ...ASK, textAlign: 'left' }} onClick={() => onShow(part.id)}>
                    {nodeName(part.id)}
                  </button>
                ) : (
                  nodeName(part.id)
                )}
              </td>
              <td style={{ padding: '2px 0', ...MUTED, textAlign: 'right' }}>{partNote(part)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ViewList({ rows, onOpen, onDelete }: { rows: SavedView[]; onOpen: (view: SavedView) => void; onDelete: (id: string) => void }) {
  if (rows.length === 0) return <p style={{ ...MUTED, fontSize: 13 }}>No views yet. Ask for a picture above, and the Design chat saves it here.</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((view) => (
        <div key={view.id} style={{ ...ROW, display: 'flex', gap: 8, alignItems: 'center' }} data-testid={`view-${view.id}`}>
          <button style={{ ...ASK, flex: 1, fontSize: 13, textAlign: 'left', overflowWrap: 'anywhere' }} onClick={() => onOpen(view)}>
            {view.title}
          </button>
          <span style={{ ...MUTED, fontSize: 12 }}>
            {plural(view.resolved.length, 'part')}
            {view.missing.length ? `, ${view.missing.length} gone` : ''}
          </span>
          <button style={{ ...ASK, color: 'var(--muted, #71717a)' }} onClick={() => onDelete(view.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export function ExploreView({
  data,
  proposal,
  shownProposal,
  canAsk,
  tab,
  onTab,
  onSend,
  onOpenProposal,
  onDrawProposal,
  onStatus,
  onDelete,
  onOpenView,
  onNode,
}: {
  data: ExploreData
  proposal: Proposal | null
  shownProposal: string | null
  canAsk: boolean
  tab: Tab
  onTab: (tab: Tab) => void
  onSend: (message: string) => void
  onOpenProposal: (id: string | null) => void
  onDrawProposal: (level: 'map' | 'data') => void
  onStatus: (id: string, status: ProposalRow['status']) => void
  onDelete: (kind: 'proposals' | 'use_cases' | 'views', id: string) => void
  onOpenView: (view: SavedView) => void
  onNode: (id: string) => void
}) {
  const [text, setText] = useState('')
  const prompt = PROMPTS[tab]
  const send = () => {
    if (!text.trim()) return
    onSend(prompt.ask(text.trim()))
    setText('')
  }
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: 16, gap: 10, color: 'var(--text, inherit)' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TABS.map(([value, label]) => (
          <Btn key={value} primary={tab === value} onClick={() => onTab(value)}>
            {label}
          </Btn>
        ))}
      </div>
      <form
        style={{ display: 'flex', gap: 8 }}
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <Input aria-label="Describe it" placeholder={prompt.placeholder} value={text} onChange={(event) => setText(event.target.value)} style={{ flex: 1 }} />
        <Btn primary type="submit" disabled={!canAsk || !text.trim()}>
          Send to chat
        </Btn>
      </form>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {tab === 'whatif' &&
          (proposal ? (
            <ProposalDetail
              proposal={proposal}
              shown={shownProposal === proposal.id}
              canAsk={canAsk}
              onBack={() => onOpenProposal(null)}
              onDraw={onDrawProposal}
              onNode={onNode}
              onAsk={() => onSend(`Use the system-map tools. Read proposal ${proposal.id}, say what stands in the way, and how to get past it.`)}
              onStatus={(status) => onStatus(proposal.id, status)}
              onDelete={() => onDelete('proposals', proposal.id)}
            />
          ) : (
            <ProposalList rows={data.proposals} onOpen={onOpenProposal} />
          ))}
        {tab === 'cases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.use_cases.length === 0 && <p style={{ ...MUTED, fontSize: 13 }}>No use cases yet. Describe one above, and the Design chat maps it to the system.</p>}
            {data.use_cases.map((item) => (
              <UseCaseCard
                key={item.id}
                item={item}
                canAsk={canAsk}
                onShow={onNode}
                onAsk={() => onSend(`Use the system-map tools. Look at use case ${item.id}, and propose what would close its gaps.`)}
                onDelete={() => onDelete('use_cases', item.id)}
              />
            ))}
          </div>
        )}
        {tab === 'views' && <ViewList rows={data.views} onOpen={onOpenView} onDelete={(id) => onDelete('views', id)} />}
      </div>
    </div>
  )
}
