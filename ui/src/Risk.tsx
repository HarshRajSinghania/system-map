import { Badge, Btn } from '@kirocrew/app-sdk/ui'
import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { shortPath } from './graphView'
import type { Risk, RiskRow } from './model'
import { percent } from './overlay'
import { ASK, MONO, MUTED } from './parts'

type Level = 'modules' | 'files'
type Sort = 'score' | 'commits' | 'complexity' | 'cover' | 'lines'

const COLUMNS: { key: Sort; label: string; title: string }[] = [
  { key: 'commits', label: 'Commits', title: 'Commits that changed it in the window' },
  { key: 'complexity', label: 'Paths', title: 'Places the code can take a second path' },
  { key: 'cover', label: 'Tests', title: 'Share of lines tests run. With no report, how much of it any test reaches.' },
  { key: 'lines', label: 'Lines', title: 'Lines of code' },
]

const CELL: CSSProperties = { padding: '5px 8px', textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }
const HEAD: CSSProperties = { background: 'transparent', border: 0, padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--muted, #71717a)' }
const NAME: CSSProperties = { background: 'transparent', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', fontSize: 13, color: 'var(--accent, #2563eb)' }

function Meter({ share }: { share: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 52, height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--border, #e4e4e7)' }}>
        <span style={{ display: 'block', height: '100%', width: `${Math.round(share * 100)}%`, background: 'var(--accent, #2563eb)' }} />
      </span>
      <span style={{ minWidth: 32, textAlign: 'right' }}>{percent(share)}</span>
    </span>
  )
}

function Flag({ row }: { row: RiskRow }) {
  if (row.hot && row.untested) return <Badge variant="err">Hot, untested</Badge>
  if (row.hot) return <Badge variant="warn">Hot</Badge>
  if (row.untested) return <Badge variant="muted">Untested</Badge>
  return null
}

function reachLabel(row: RiskRow, level: Level): string {
  return level === 'files' ? `${row.tests ?? 0} reach it` : `${row.reached_files ?? 0} of ${row.files ?? 0} files`
}

function CoverageLine({ risk, canAsk, error, onLoad, onRun }: { risk: Risk; canAsk: boolean; error: string | null; onLoad: () => void; onRun: () => void }) {
  const report = risk.coverage
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 }}>
      {report ? (
        <>
          <Badge variant="muted">{percent(report.lines_hit / report.lines_total)} of lines run by tests</Badge>
          <span style={MUTED}>
            {report.commit ? `Report from ${report.commit.slice(0, 7)}` : 'Report from an unknown commit'}
            {report.files_changed_since ? `, ${report.files_changed_since} files changed since` : ''}
          </span>
        </>
      ) : (
        <span style={MUTED}>No coverage report yet. Showing which tests reach each file through imports.</span>
      )}
      <span style={{ flex: 1 }} />
      {error && <span style={{ color: 'var(--danger, #dc2626)' }}>{error}</span>}
      <Btn onClick={onLoad}>{report ? 'Reload report' : 'Load report'}</Btn>
      <Btn onClick={onRun} disabled={!canAsk}>
        Run tests in chat
      </Btn>
    </div>
  )
}

export function RiskView({
  risk,
  canAsk,
  error,
  onShow,
  onAsk,
  onLoad,
  onRun,
}: {
  risk: Risk
  canAsk: boolean
  error: string | null
  onShow: (id: string) => void
  onAsk: (id: string) => void
  onLoad: () => void
  onRun: () => void
}) {
  const [level, setLevel] = useState<Level>('modules')
  const [onlyWorst, setOnlyWorst] = useState(true)
  const [hideScreens, setHideScreens] = useState(false)
  const [sort, setSort] = useState<Sort>('score')
  const reported = risk.coverage !== null

  const pool = useMemo(() => risk[level].filter((row) => level === 'modules' || !hideScreens || !row.ui), [risk, level, hideScreens])
  const worst = pool.filter((row) => row.hot && row.untested)

  const rows = useMemo(() => {
    // With nothing that bad, an empty list says less than the ranking does.
    const chosen = onlyWorst && worst.length > 0 ? worst : pool
    if (sort === 'score') return chosen
    const sign = sort === 'cover' ? 1 : -1
    return [...chosen].sort((a, b) => sign * (a[sort] - b[sort]))
    // `worst` is derived from `pool`, so `pool` covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, onlyWorst, sort])

  const noun = level === 'modules' ? 'module' : 'file'

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: 16, gap: 10, color: 'var(--text, inherit)' }}>
      <p style={{ margin: 0, fontSize: 14 }} data-testid="risk-summary">
        <strong>{risk.test_files === 0 ? 'No tests yet.' : worst.length === 0 ? 'Nothing busy is short of tests.' : `${worst.length} busy ${noun}${worst.length === 1 ? ' has' : 's have'} little test cover.`}</strong>{' '}
        <span style={{ ...MUTED, fontSize: 13 }}>
          Busy means more commits than three in four others, over {risk.window_days} days. Little cover means under half.
        </span>
      </p>
      {risk.test_files === 0 && (
        <p style={{ ...MUTED, margin: 0, fontSize: 13 }} data-testid="no-tests">
          This project has no tests yet, so everything counts as untested. The list below is ranked by how complex and busy each part is.
        </p>
      )}
      {!risk.history_known && <p style={{ ...MUTED, margin: 0, fontSize: 13 }}>No git history here, so commits are not counted.</p>}
      {risk.shallow && <p style={{ ...MUTED, margin: 0, fontSize: 13 }}>This is a shallow clone, so commits are undercounted.</p>}
      <CoverageLine risk={risk} canAsk={canAsk} error={error} onLoad={onLoad} onRun={onRun} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Btn primary={level === 'modules'} onClick={() => setLevel('modules')}>
          Modules
        </Btn>
        <Btn primary={level === 'files'} onClick={() => setLevel('files')}>
          Files
        </Btn>
        <span style={{ width: 8 }} />
        {worst.length > 0 && (
          <Btn primary={onlyWorst} onClick={() => setOnlyWorst((value) => !value)}>
            Hot and untested only
          </Btn>
        )}
        {level === 'files' && (
          <Btn primary={hideScreens} onClick={() => setHideScreens((value) => !value)} title="Browser tests cover screens, and they are not in this report">
            Hide screens
          </Btn>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }} data-testid="risk-table">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border, #e4e4e7)' }}>
              <th style={{ ...CELL, textAlign: 'left' }}>
                <button style={HEAD} onClick={() => setSort('score')} title="Commits, times paths, times what tests miss">
                  {level === 'modules' ? 'Module' : 'File'}, worst first
                </button>
              </th>
              {COLUMNS.map((column) => (
                <th key={column.key} style={CELL}>
                  <button style={{ ...HEAD, color: sort === column.key ? 'var(--text, inherit)' : HEAD.color }} title={column.title} onClick={() => setSort(column.key)}>
                    {column.label}
                  </button>
                </th>
              ))}
              <th style={CELL} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.path} style={{ borderBottom: '1px solid var(--border, #e4e4e7)' }}>
                <td style={{ ...CELL, textAlign: 'left', whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                  <button
                    onClick={() => onShow(row.id ?? row.module ?? '')}
                    title={level === 'files' ? 'Show its module on the map' : 'Show on the map'}
                    style={level === 'files' ? { ...NAME, ...MONO } : NAME}
                  >
                    {shortPath(row.path)}
                  </button>{' '}
                  <Flag row={row} />
                </td>
                <td style={CELL}>{row.commits}</td>
                <td style={CELL}>{row.complexity}</td>
                <td style={CELL}>{reported ? <Meter share={row.covered ?? 0} /> : <span style={MUTED}>{reachLabel(row, level)}</span>}</td>
                <td style={CELL}>{row.lines}</td>
                <td style={CELL}>
                  <button style={ASK} onClick={() => onAsk(row.id ?? row.path)} disabled={!canAsk}>
                    Ask
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p style={{ ...MUTED, fontSize: 13 }}>Nothing to show here.</p>}
      </div>
    </div>
  )
}
