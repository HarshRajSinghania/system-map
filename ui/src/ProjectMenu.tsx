import { SearchInput } from '@kirocrew/app-sdk/ui'
import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Chevron, Dropdown } from './Menu'
import { MUTED } from './parts'
import { AddProject, ManageProjects } from './ProjectDialogs'
import { filterProjects, rowHint, rowStatus, statusView } from './projects'
import type { Project } from './projects'

const optionId = (key: string) => `system-map-project-${key}`

function MenuBody({
  projects,
  activeKey,
  close,
  onPick,
  onAdd,
  onManage,
}: {
  projects: Project[]
  activeKey: string
  close: () => void
  onPick: (key: string) => void
  onAdd: () => void
  onManage: () => void
}) {
  const [query, setQuery] = useState('')
  const rows = filterProjects(projects, query)
  const [cursor, setCursor] = useState(() => Math.max(0, rows.findIndex((row) => row.repo_key === activeKey)))
  const at = Math.min(cursor, rows.length - 1)

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (rows.length === 0) return
      setCursor((at + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length)
    } else if (event.key === 'Enter' && rows[at]) {
      event.preventDefault()
      close()
      onPick(rows[at].repo_key)
    }
  }

  return (
    <>
      <SearchInput
        autoFocus
        role="combobox"
        aria-label="Find a project"
        aria-expanded
        aria-controls="system-map-project-list"
        aria-activedescendant={rows[at] ? optionId(rows[at].repo_key) : undefined}
        placeholder="Find a project"
        value={query}
        onKeyDown={onKeyDown}
        onChange={(event) => {
          setQuery(event.target.value)
          setCursor(0)
        }}
      />
      <ul id="system-map-project-list" className="sm-list" role="listbox" aria-label="Projects">
        {rows.map((row, index) => {
          const hint = rowHint(row, projects)
          return (
            <li
              key={row.repo_key}
              id={optionId(row.repo_key)}
              role="option"
              className="sm-row"
              aria-selected={row.repo_key === activeKey}
              data-active={index === at}
              title={row.repo}
              onMouseEnter={() => setCursor(index)}
              onClick={() => {
                close()
                onPick(row.repo_key)
              }}
            >
              <span className="sm-dot" data-tone={statusView(row.status, row.behind, row.ref).tone} />
              <span className="sm-ellipsis" style={{ fontWeight: 600 }}>
                {row.name}
              </span>
              {hint && (
                <span className="sm-ellipsis" style={{ ...MUTED, fontSize: 12 }}>
                  {hint}
                </span>
              )}
              <span style={{ ...MUTED, fontSize: 12, marginLeft: 'auto', whiteSpace: 'nowrap', paddingLeft: 8 }}>{rowStatus(row)}</span>
            </li>
          )
        })}
      </ul>
      {rows.length === 0 && <p style={{ ...MUTED, margin: 0, padding: '8px 9px' }}>No project matches that.</p>}
      <div className="sm-rule" />
      <button type="button" className="sm-plain sm-row" onClick={onAdd}>
        Add project
      </button>
      <button type="button" className="sm-plain sm-row" onClick={onManage}>
        Manage projects
      </button>
    </>
  )
}

/** The open project's name, with a menu to change it, plus the dialogs that menu opens. */
export function useProjectMenu({
  projects,
  activeKey,
  compact = false,
  onPick,
  onReload,
}: {
  projects: Project[]
  activeKey: string
  compact?: boolean
  onPick: (key: string) => void
  onReload: () => void
}) {
  const active = projects.find((row) => row.repo_key === activeKey)
  const [dialog, setDialog] = useState<'add' | 'manage' | null>(null)
  const closeDialog = () => setDialog(null)

  const menu = (
    <Dropdown
      width={340}
      label="Projects"
      block={compact}
      trigger={(props) => (
        <button
          type="button"
          className={`sm-plain sm-project sm-focus${compact ? ' sm-compact' : ''}`}
          title={active?.repo}
          aria-label={`Project: ${active?.name ?? ''}. Change project`}
          data-testid="project-menu"
          {...props}
        >
          <span className="sm-ellipsis">{active?.name}</span>
          <Chevron />
        </button>
      )}
    >
      {(close) => (
        <MenuBody
          projects={projects}
          activeKey={activeKey}
          close={close}
          onPick={onPick}
          onAdd={() => {
            close()
            setDialog('add')
          }}
          onManage={() => {
            close()
            setDialog('manage')
          }}
        />
      )}
    </Dropdown>
  )

  const dialogs = (
    <>
      <AddProject
        open={dialog === 'add'}
        projects={projects}
        onClose={closeDialog}
        onBuilt={(key) => {
          closeDialog()
          onReload()
          onPick(key)
        }}
      />
      <ManageProjects
        open={dialog === 'manage'}
        projects={projects}
        onClose={closeDialog}
        onBuilt={onReload}
        onRemoved={(key) => {
          const next = projects.find((row) => row.repo_key !== key)
          if (!next) closeDialog()
          if (key === activeKey && next) onPick(next.repo_key)
          onReload()
        }}
      />
    </>
  )

  return { menu, dialogs }
}
