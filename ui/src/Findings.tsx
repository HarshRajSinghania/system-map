import { Btn } from '@kirocrew/app-sdk/ui'
import { useMemo, useState } from 'react'
import type { Finding, Severity } from './model'
import { ASK, MONO, MUTED, SeverityBadge } from './parts'

const LEVELS: Severity[] = ['high', 'medium', 'low', 'info']

export function Findings({
  findings,
  noSchema = false,
  onShow,
  onAsk,
}: {
  findings: Finding[]
  noSchema?: boolean
  onShow: (node: string) => void
  onAsk: (finding: Finding) => void
}) {
  const [level, setLevel] = useState<Severity | null>(null)
  const counts = useMemo(() => {
    const tally = new Map<Severity, number>()
    for (const finding of findings) tally.set(finding.severity, (tally.get(finding.severity) ?? 0) + 1)
    return tally
  }, [findings])
  const shown = level ? findings.filter((finding) => finding.severity === level) : findings

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: 16, fontSize: 13, color: 'var(--text, inherit)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Btn primary={level === null} onClick={() => setLevel(null)}>
          All {findings.length}
        </Btn>
        {LEVELS.filter((item) => counts.get(item)).map((item) => (
          <Btn key={item} primary={level === item} onClick={() => setLevel(item)}>
            {item} {counts.get(item)}
          </Btn>
        ))}
      </div>
      {shown.length === 0 && <p style={MUTED}>{noSchema ? "No schema was read, so the table rules didn't run." : 'No findings.'}</p>}
      {shown.map((finding) => (
        <div key={finding.id} style={{ padding: '10px 0', borderTop: '1px solid var(--border, #e4e4e7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SeverityBadge severity={finding.severity} />
            <span style={{ flex: 1, fontWeight: 600 }}>{finding.title}</span>
            <button style={ASK} onClick={() => onShow(finding.node)}>
              Show
            </button>
            <button style={ASK} onClick={() => onAsk(finding)}>
              Ask
            </button>
          </div>
          <p style={{ margin: '4px 0 0' }}>{finding.detail}</p>
          <p style={{ ...MUTED, ...MONO, fontSize: 12, margin: '4px 0 0', overflowWrap: 'anywhere' }}>
            {finding.evidence.join('  ')}
          </p>
        </div>
      ))}
    </div>
  )
}
