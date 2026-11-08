import { Badge, Btn, Input } from '@kirocrew/app-sdk/ui'
import { useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AgentDraftCard } from './AgentDraft'
import { AGENT_FILTERS, draftErrorFor, draftSettings, filterAgents, filterCounts, FIND_OFF, fromForm, handsOffTo, markedSettings, modelLabel, modelsOf, nodeLabel, regionTone, sdkLine, SETTING_HELP, SETTING_KEYS, SETTING_LABELS, setupKey, startsFrom, STATUS_LABEL, toForm } from './agentRows'
import type { AgentFilter, AgentForm, DraftError, RegionTone } from './agentRows'
import type { AgentDraft, AgentDraftState, AgentModel, AgentRow, AgentSettings, AgentState, AgentStatus } from './model'
import { MONO, MUTED } from './parts'

const CELL: CSSProperties = { padding: '6px 8px', textAlign: 'left', verticalAlign: 'top' }
const HEAD: CSSProperties = { ...CELL, fontSize: 12, fontWeight: 600, color: 'var(--muted, #71717a)', whiteSpace: 'nowrap' }
const NAME: CSSProperties = { background: 'transparent', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text, inherit)' }
const BOX: CSSProperties = { padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-strong, #a1a1aa)', background: 'var(--card, #fff)', fontSize: 12, overflowWrap: 'anywhere' }
const TONE: Record<RegionTone, 'err' | 'ok' | 'muted'> = { leaves: 'err', home: 'ok', unknown: 'muted' }
const STATUS_TONE: Record<AgentStatus, string> = { built: 'var(--ok, #15803d)', planned: 'var(--danger, #dc2626)', empty: 'var(--warn-text, #b45309)' }

function Status({ status }: { status: AgentStatus }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_TONE[status] }} />
      {STATUS_LABEL[status]}
    </span>
  )
}

function ModelChips({ models, home }: { models: AgentModel[]; home: string | null }) {
  if (models.length === 0) return <span style={MUTED}>none</span>
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4 }}>
      {models.map((model) => (
        <Badge key={model.node} variant={TONE[regionTone(model, home)]} title={model.leaves ? 'Runs outside your home region' : model.region ? undefined : 'No region set. Set one on the service in the Map.'}>
          {modelLabel(model)}
        </Badge>
      ))}
    </span>
  )
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span style={{ ...MUTED, fontSize: 11 }}>{title}</span>
      {children}
    </div>
  )
}

/** What goes in, the agent, and what comes out, with the models it uses below. */
function InOut({ row, rows, home }: { row: AgentRow; rows: AgentRow[]; home: string | null }) {
  const inputs = startsFrom(row, rows)
  const outputs = handsOffTo(row, rows)
  const arrow = <span style={{ ...MUTED, alignSelf: 'center' }}>→</span>
  return (
    <div data-testid="agent-in-out" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto auto minmax(0, 1fr)', gap: 6, margin: '10px 0' }}>
      <Column title="Starts from">{inputs.length ? inputs.map((label) => <span key={label} style={BOX}>{label}</span>) : <span style={MUTED}>nothing found</span>}</Column>
      {arrow}
      <span style={{ ...BOX, alignSelf: 'center', fontWeight: 600, border: '2px solid var(--accent, #2563eb)' }}>{row.label}</span>
      {arrow}
      <Column title="Then">
        {outputs.map((label) => (
          <span key={label} style={BOX}>
            {label}
          </span>
        ))}
        {row.asks_you.length > 0 && <span style={{ ...BOX, border: '1px solid var(--info, #2563eb)', background: 'var(--bg-elevated, #fff)' }}>Asks you</span>}
        {outputs.length === 0 && row.asks_you.length === 0 && <span style={MUTED}>nothing found</span>}
      </Column>
      <div style={{ gridColumn: '1 / -1' }}>
        <Column title="Uses model">
          <ModelChips models={modelsOf(row)} home={home} />
        </Column>
      </div>
    </div>
  )
}

function Detail({ row, rows, home, canAsk, onShow, onAsk }: { row: AgentRow; rows: AgentRow[]; home: string | null; canAsk: boolean; onShow: (id: string) => void; onAsk: (row: AgentRow) => void }) {
  const sdk = sdkLine(row)
  const evidence = [...row.evidence, ...modelsOf(row).map((model) => model.evidence), ...row.asks_you, ...row.hands_off_to.map((link) => link.evidence)]
  return (
    <div data-testid="agent-detail" style={{ fontSize: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
        <strong style={{ fontSize: 15 }}>{row.label}</strong>
        <Status status={row.status} />
      </div>
      {sdk && (
        <p style={{ ...MUTED, margin: '4px 0 0', fontSize: 12 }}>
          {sdk}
          {row.evidence[0] && <span style={{ ...MONO, marginLeft: 8, overflowWrap: 'anywhere' }}>{row.evidence[0]}</span>}
        </p>
      )}
      {row.description && <p style={{ margin: '6px 0 0' }}>{row.description}</p>}
      <InOut row={row} rows={rows} home={home} />
      {row.jobs.length > 0 && (
        <>
          <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>Jobs ({row.jobs.length})</p>
          <p style={{ ...MONO, fontSize: 12, margin: 0, overflowWrap: 'anywhere' }}>{row.jobs.join('  ')}</p>
        </>
      )}
      <p style={{ margin: '10px 0 4px', fontWeight: 600 }}>Evidence</p>
      <ul style={{ ...MONO, ...MUTED, fontSize: 12, margin: 0, paddingLeft: 14, overflowWrap: 'anywhere' }}>
        {[...new Set(evidence)].slice(0, 8).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Btn onClick={() => onShow(row.id)}>Show on map</Btn>
        <Btn onClick={() => onAsk(row)} disabled={!canAsk}>
          Ask
        </Btn>
      </div>
    </div>
  )
}

const FIELDS: { key: keyof AgentForm; help: string }[] = SETTING_KEYS.map((key) => ({ key, help: SETTING_HELP[key] }))

/** Sends the fixed message to the Design chat, which drafts the settings. */
function FindButton({ canAsk, onFind }: { canAsk: boolean; onFind: () => void }) {
  return (
    <Btn onClick={onFind} disabled={!canAsk} title={canAsk ? 'The Design chat reads your code and drafts these settings for you to check' : FIND_OFF}>
      Find my agents
    </Btn>
  )
}

function Setup({
  state,
  start,
  saving,
  error,
  canAsk,
  onFind,
  onSave,
  onCancel,
}: {
  state: AgentState
  /** Settings to fill the form with, when not the saved ones. */
  start?: AgentSettings
  saving: boolean
  error: string | null
  canAsk: boolean
  onFind: () => void
  onSave: (settings: AgentSettings) => Promise<boolean>
  onCancel?: () => void
}) {
  const [form, setForm] = useState<AgentForm>(() => toForm(start ?? state.settings, state.defaults))
  const save = async (settings: AgentSettings) => {
    if ((await onSave(settings)) && onCancel) onCancel()
  }
  return (
    <div data-testid="agent-setup" style={{ maxWidth: 640, fontSize: 13 }}>
      {state.agents.length === 0 && !state.settings.list && (
        <>
          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600 }}>No agents yet.</p>
          <p style={{ ...MUTED, margin: '0 0 12px' }}>Point System Map at the file that lists your agents, or mark a module as one. Nothing is written to your repo.</p>
        </>
      )}
      {state.agents.length === 0 && state.settings.list && (
        <>
          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600 }} data-testid="agents-not-found">
            No agents found in <span style={MONO}>{state.settings.list}</span>.
          </p>
          <p style={{ ...MUTED, margin: '0 0 12px' }}>It needs an exported list of objects that each have a name. Check the file, or mark a module instead.</p>
        </>
      )}
      {state.agents.length === 0 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <FindButton canAsk={canAsk} onFind={onFind} />
          <span style={MUTED} data-testid="find-agents-why">
            {canAsk ? 'The Design chat reads your code and drafts these settings for you to check.' : FIND_OFF}
          </span>
        </div>
      )}
      {state.agents.length === 0 && state.suggestions.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>These modules call a model</p>
          {state.suggestions.map((id) => (
            <div key={id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0' }}>
              <span style={{ ...MONO, fontSize: 12, flex: 1 }}>{nodeLabel(id, [])}</span>
              <Btn disabled={saving} onClick={() => void save(markedSettings(state.settings, id, start ? form : null))}>
                Mark as agent
              </Btn>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, auto) minmax(0, 1fr)', gap: '8px 12px', alignItems: 'start' }}>
        {FIELDS.map((field) => (
          <label key={field.key} style={{ display: 'contents' }}>
            <span style={{ paddingTop: 6, fontWeight: 600 }}>{SETTING_LABELS[field.key]}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Input value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} style={field.key === 'home_region' ? undefined : MONO} />
              <span style={{ ...MUTED, fontSize: 11 }}>{field.help}</span>
            </span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14 }}>
        <Btn primary disabled={saving} onClick={() => void save(fromForm(form))}>
          {saving ? 'Saving…' : 'Save and rebuild'}
        </Btn>
        {onCancel && <Btn onClick={onCancel}>Cancel</Btn>}
        {error && <span style={{ color: 'var(--danger, #dc2626)' }}>{error}</span>}
      </div>
    </div>
  )
}

export function AgentsView({
  state,
  draft,
  canAsk,
  saving,
  error,
  draftError,
  onShow,
  onAsk,
  onSave,
  onFind,
  onDraft,
}: {
  state: AgentState
  draft: AgentDraftState | null
  canAsk: boolean
  saving: boolean
  error: string | null
  draftError: DraftError | null
  onShow: (id: string) => void
  onAsk: (row: AgentRow) => void
  onSave: (settings: AgentSettings) => Promise<boolean>
  onFind: () => void
  /** Use or drop the draft with this id. Resolves to whether it worked. */
  onDraft: (action: 'use' | 'drop', id: string) => Promise<boolean>
}) {
  const [filter, setFilter] = useState<AgentFilter>('all')
  const [picked, setPicked] = useState<string | null>(null)
  /** Which settings the form is open on: the saved ones, or a draft as it was when opened. */
  const [editing, setEditing] = useState<{ from: 'settings' } | { from: 'draft'; draft: AgentDraft } | null>(null)
  const rows = state.agents
  const counts = useMemo(() => filterCounts(rows), [rows])
  const shown = useMemo(() => filterAgents(rows, filter), [rows, filter])
  const chosen = shown.find((row) => row.id === picked) ?? shown[0] ?? null
  const home = state.home_region
  const drafted = draft?.draft ?? null
  const opened = editing?.from === 'draft' ? editing.draft : null

  // Saving the form opened from a draft saves those settings, then that draft is done with.
  const saveDraftEdit = async (settings: AgentSettings) => {
    const saved = await onSave(settings)
    if (saved && opened) await onDraft('drop', opened.id)
    return saved
  }
  const card =
    draft && drafted && !opened ? (
      <div style={{ flexShrink: 0, maxHeight: '50%', overflowY: 'auto', marginBottom: rows.length === 0 || editing ? 16 : 0 }}>
        <AgentDraftCard
          draft={drafted}
          changed={draft.changed}
          stale={draft.stale}
          saved={state.settings}
          busy={saving}
          error={draftErrorFor(draftError, drafted.id)}
          onUse={() => void onDraft('use', drafted.id)}
          onEdit={() => setEditing({ from: 'draft', draft: drafted })}
          onDrop={() => void onDraft('drop', drafted.id)}
        />
      </div>
    ) : null

  if (rows.length === 0 || editing) {
    const close = rows.length || opened ? () => setEditing(null) : undefined
    return (
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: 16, color: 'var(--text, inherit)' }}>
        {card}
        <Setup
          key={setupKey(opened?.id ?? null, state.settings)}
          state={state}
          start={opened ? draftSettings(opened, state.settings) : undefined}
          saving={saving}
          error={error}
          canAsk={canAsk}
          onFind={onFind}
          onSave={opened ? saveDraftEdit : onSave}
          onCancel={close}
        />
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: 16, gap: 10, color: 'var(--text, inherit)' }}>
      {card}
      <p style={{ margin: 0, fontSize: 14 }} data-testid="agents-summary">
        <strong>
          {rows.length} agent{rows.length === 1 ? '' : 's'}. {counts.model} use{counts.model === 1 ? 's' : ''} a model, and {counts.asks} ask{counts.asks === 1 ? 's' : ''} you first.
        </strong>{' '}
        <span style={{ ...MUTED, fontSize: 13 }}>
          {counts.leaves > 0 ? `${counts.leaves} can send data outside ${home}.` : home ? `Your home region is ${home}.` : 'Set a home region to see where data goes.'}
        </span>
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {AGENT_FILTERS.map((item) => (
          <Btn key={item.key} primary={filter === item.key} title={item.title} onClick={() => setFilter(item.key)}>
            {item.label} {counts[item.key]}
          </Btn>
        ))}
        <span style={{ flex: 1 }} />
        {!canAsk && (
          <span style={{ ...MUTED, fontSize: 12 }} data-testid="find-agents-why">
            {FIND_OFF}
          </span>
        )}
        <FindButton canAsk={canAsk} onFind={onFind} />
        <Btn onClick={() => setEditing({ from: 'settings' })}>Agent settings</Btn>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} data-testid="agents-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border, #e4e4e7)' }}>
                <th style={HEAD}>Agent</th>
                <th style={HEAD}>Status</th>
                <th style={HEAD}>Starts from</th>
                <th style={HEAD}>Model</th>
                <th style={HEAD}>Asks you</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.id} onClick={() => setPicked(row.id)} style={{ borderBottom: '1px solid var(--border, #e4e4e7)', cursor: 'pointer', background: row.id === chosen?.id ? 'var(--accent-subtle, rgba(37,99,235,.12))' : undefined }}>
                  <td style={CELL}>
                    <button style={NAME} aria-pressed={row.id === chosen?.id} onClick={() => setPicked(row.id)}>
                      {row.label}
                    </button>
                  </td>
                  <td style={CELL}>
                    <Status status={row.status} />
                  </td>
                  <td style={{ ...CELL, ...MUTED }}>{startsFrom(row, rows).join(', ') || '—'}</td>
                  <td style={CELL}>
                    <ModelChips models={modelsOf(row)} home={home} />
                  </td>
                  <td style={CELL}>{row.asks_you.length > 0 ? 'Yes' : <span style={MUTED}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {shown.length === 0 && <p style={{ ...MUTED, fontSize: 13 }}>No agents here. Pick All to see every agent.</p>}
        </div>
        {chosen && (
          <aside style={{ width: 320, flexShrink: 0, overflowY: 'auto', paddingLeft: 16, borderLeft: '1px solid var(--border, #e4e4e7)' }}>
            <Detail row={chosen} rows={rows} home={home} canAsk={canAsk} onShow={onShow} onAsk={onAsk} />
          </aside>
        )}
      </div>
    </div>
  )
}
