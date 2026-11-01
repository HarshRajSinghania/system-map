import { Badge } from '@kirocrew/app-sdk/ui'
import type { CSSProperties } from 'react'
import type { Layer } from './Layers'
import type { Plan, PlanStatus } from './model'
import { ASK, MONO, MUTED } from './parts'

const COLUMNS: { status: PlanStatus; title: string; note: string }[] = [
  { status: 'planned', title: 'Not built', note: 'Most of what it names does not exist' },
  { status: 'partial', title: 'Partly built', note: 'Some of what it names exists' },
  { status: 'built', title: 'Built', note: 'What it names exists' },
  { status: 'unclear', title: 'Unclear', note: 'Names too little to judge' },
]

const SOURCE_LABEL: Record<string, string> = {
  derived: 'from the code',
  declared: 'from the spec',
  you: 'set by you',
}

const CARD: CSSProperties = {
  padding: 10,
  borderRadius: 8,
  background: 'var(--card, #fff)',
  border: '1px solid var(--border, #e4e4e7)',
  fontSize: 13,
}

function PlanCard({
  plan,
  onShow,
  onAsk,
  onStatus,
}: {
  plan: Plan
  onShow: (id: string) => void
  onAsk: (plan: Plan) => void
  onStatus: (id: string, status: PlanStatus | null) => void
}) {
  const missing = plan.claims.filter((claim) => !claim.found)
  return (
    <div style={CARD} data-testid={plan.id}>
      <p style={{ margin: 0, fontWeight: 600 }}>{plan.name}</p>
      <p style={{ ...MUTED, margin: '2px 0 6px', fontSize: 12 }}>
        {plan.found} found, {plan.missing} missing, {SOURCE_LABEL[plan.status_source]}
      </p>
      {missing.length > 0 && (
        <ul style={{ ...MONO, margin: '0 0 8px', paddingLeft: 14, fontSize: 11, overflowWrap: 'anywhere' }}>
          {missing.slice(0, 8).map((claim) => (
            <li key={claim.claim} title={claim.source}>
              {claim.claim}
            </li>
          ))}
          {missing.length > 8 && <li style={MUTED}>and {missing.length - 8} more</li>}
        </ul>
      )}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button style={ASK} onClick={() => onShow(plan.id)}>
          Show
        </button>
        <button style={ASK} onClick={() => onAsk(plan)}>
          Ask
        </button>
        <span style={{ flex: 1 }} />
        <select
          aria-label={`Status of ${plan.name}`}
          value={plan.status_source === 'you' ? plan.status : ''}
          onChange={(event) => onStatus(plan.id, (event.target.value || null) as PlanStatus | null)}
          style={{ fontSize: 11, background: 'transparent', color: 'var(--muted, #71717a)', border: 0 }}
        >
          <option value="">Auto</option>
          <option value="built">Mark built</option>
          <option value="partial">Mark partly built</option>
          <option value="planned">Mark not built</option>
        </select>
      </div>
    </div>
  )
}

export function PlanBoard({
  plans,
  onShow,
  onAsk,
  onStatus,
}: {
  plans: Plan[]
  onShow: (id: string) => void
  onAsk: (plan: Plan) => void
  onStatus: (id: string, status: PlanStatus | null) => void
}) {
  const left = plans.filter((plan) => plan.status === 'planned' || plan.status === 'partial').length
  const judged = plans.filter((plan) => plan.status !== 'unclear').length
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: 16, gap: 12, color: 'var(--text, inherit)' }}>
      <p style={{ margin: 0, fontSize: 14 }} data-testid="plan-summary">
        <strong>{judged === 0 ? 'Nothing here can be checked yet.' : left === 0 ? 'Everything planned is built.' : `${left} of ${judged} planned units ${left === 1 ? 'is' : 'are'} not finished.`}</strong>{' '}
        <span style={{ ...MUTED, fontSize: 13 }}>
          {judged === 0 ? 'These plans name no files, so the code can\'t confirm them.' : 'Read from the specs, checked against the code.'}
        </span>
      </p>
      {plans.length === 0 && <p style={MUTED}>No plans found. System Map looks in docs/specs, docs/plans and specs, and for a BRIEF, PLAN, ROADMAP, PRD, SPEC or TODO file at the top of the repo.</p>}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {COLUMNS.map((column) => {
          const items = plans.filter((plan) => plan.status === column.status)
          return (
            <section key={column.status} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, gap: 8 }}>
              <div>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center', fontWeight: 600, fontSize: 13 }}>
                  {column.title} <Badge variant="muted">{items.length}</Badge>
                </span>
                <span style={{ ...MUTED, fontSize: 11 }}>{column.note}</span>
              </div>
              <div style={{ overflowY: 'auto', minHeight: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onShow={onShow} onAsk={onAsk} onStatus={onStatus} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

/** The plans layer on the map, which counts what is left to build. */
export function PlanHint(count: number, on: boolean, onToggle: () => void): Layer {
  return { key: 'plans', label: count > 0 ? `Plans ${count}` : 'Plans', on, title: 'Show unfinished plans on the map', onToggle }
}
