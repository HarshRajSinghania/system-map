import { useAppApi } from '@kirocrew/app-sdk'
import { Badge, Btn, Input, Modal, SearchInput } from '@kirocrew/app-sdk/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import './chrome'
import { plainError } from './errors'
import { BASE } from './model'
import { MUTED } from './parts'
import { builtAgo, countOf, searchLabel, shortPath, splitWorkspaces, suggestFolder } from './projects'
import type { Project, Workspace, WorkspaceList } from './projects'

const WINDOW_POLL_MS = 600
const LIST_ID = 'system-map-workspace-list'
const optionId = (workspace: Workspace) => `system-map-workspace-${workspace.key}`

type Loaded = WorkspaceList & { suggested: boolean }

interface Listing {
  path: string
  display: string
  parent: string | null
  dirs: { name: string; path: string }[]
}

type WindowState =
  | { status: 'idle' | 'open' | 'cancelled' | 'unavailable' }
  | { status: 'picked'; path: string }
  | { status: 'failed'; message: string }

function FolderIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      style={{ ...MUTED, flex: 'none' }}
      aria-hidden="true"
    >
      <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )
}

/** The default folder's repos. With none saved, offers the folder most recent work sits in. */
function useWorkspaces(open: boolean) {
  const api = useAppApi()
  const [list, setList] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cleared on the way out, so the next open can't show the last folder for a moment.
    setList(null)
    setError(null)
    if (!open) return
    let live = true
    const load = async (): Promise<Loaded> => {
      const saved = await api.get<WorkspaceList>(`${BASE}/workspaces`)
      if (saved.folder !== null) return { ...saved, suggested: false }
      // This route isn't promised to apps, so a refusal just means nothing to suggest.
      const recent = await api.get<{ dirs?: unknown }>('/api/recent-projects').catch(() => ({ dirs: [] }))
      const dirs = Array.isArray(recent.dirs) ? recent.dirs.filter((dir): dir is string => typeof dir === 'string') : []
      const guess = suggestFolder(dirs)
      if (guess === null) return { ...saved, suggested: false }
      // A recent folder can be gone by now, which is no reason to stop.
      const offered = await api.get<WorkspaceList>(`${BASE}/workspaces?folder=${encodeURIComponent(guess)}`).catch(() => null)
      return offered ? { ...offered, suggested: true } : { ...saved, suggested: false }
    }
    load()
      .then((loaded) => {
        if (live) setList(loaded)
      })
      .catch((caught) => {
        if (live) setError(plainError(caught, 'read your default folder'))
      })
    return () => {
      live = false
    }
  }, [api, open])

  const saveDefault = useCallback(
    async (folder: string) => {
      setError(null)
      try {
        await api.post(`${BASE}/default-folder`, { folder })
        setList({ ...(await api.get<WorkspaceList>(`${BASE}/workspaces`)), suggested: false })
      } catch (caught) {
        setError(plainError(caught, 'save this folder'))
      }
    },
    [api],
  )

  return { list, error, saveDefault }
}

/** Opens the computer's folder window and waits for it. The backend owns the window. */
function useFolderWindow(open: boolean, onPicked: (path: string) => void, onUsePage: (note: string | null) => void) {
  const api = useAppApi()
  const [waiting, setWaiting] = useState(false)
  const waitingRef = useRef(false)
  const handlers = useRef({ onPicked, onUsePage })
  handlers.current = { onPicked, onUsePage }

  const wait = useCallback((next: boolean) => {
    waitingRef.current = next
    setWaiting(next)
  }, [])

  const closeWindow = useCallback(() => {
    if (!waitingRef.current) return
    wait(false)
    api.post(`${BASE}/folder-window-close`, {}).catch(() => undefined)
  }, [api, wait])

  useEffect(() => {
    if (!waiting) return
    const timer = window.setInterval(() => {
      api
        .get<WindowState>(`${BASE}/folder-window`)
        .then((state) => {
          if (!waitingRef.current || state.status === 'open') return
          wait(false)
          if (state.status === 'picked') handlers.current.onPicked(state.path)
          else if (state.status === 'failed') handlers.current.onUsePage(state.message)
        })
        .catch(() => {
          wait(false)
          handlers.current.onUsePage(null)
        })
    }, WINDOW_POLL_MS)
    return () => window.clearInterval(timer)
  }, [api, waiting, wait])

  // A window outliving the dialog that asked for it would lead nowhere.
  useEffect(() => (open ? closeWindow : undefined), [open, closeWindow])

  const openWindow = async (start: string | null) => {
    try {
      const state = await api.post<WindowState>(`${BASE}/folder-window`, { start })
      if (state.status === 'open') wait(true)
      else handlers.current.onUsePage(null)
    } catch {
      handlers.current.onUsePage(null)
    }
  }

  return { waiting, openWindow, closeWindow }
}

/** Pick a folder inside the page, for when there's no desktop to open a window on. */
function FolderList({
  start,
  note,
  onUse,
  onCancel,
}: {
  start: string | null
  note: string | null
  onUse: (path: string) => void
  onCancel: () => void
}) {
  const api = useAppApi()
  const [here, setHere] = useState<Listing | null>(null)
  const [error, setError] = useState<string | null>(null)

  const go = useCallback(
    async (path: string) => {
      setError(null)
      try {
        setHere(await api.get<Listing>(`${BASE}/browse?path=${encodeURIComponent(path)}`))
        return true
      } catch (caught) {
        setError(plainError(caught, 'open this folder'))
        return false
      }
    },
    [api],
  )

  useEffect(() => {
    void go(start ?? '~').then((found) => {
      if (!found && start !== null) void go('~')
    })
  }, [go, start])

  return (
    <div style={{ display: 'grid', gap: 12, padding: 16 }} data-testid="folder-list">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <button type="button" className="sm-plain sm-link" disabled={!here?.parent} onClick={() => here?.parent && void go(here.parent)}>
          ‹ Up
        </button>
        <span className="sm-mono sm-ellipsis" title={here?.path} data-testid="folder-list-path">
          {here && shortPath(here.display, 56)}
        </span>
      </div>
      <div className="sm-list sm-add-list">
        {here?.dirs.map((dir) => (
          <button key={dir.path} type="button" className="sm-plain sm-row" title={dir.path} onClick={() => void go(dir.path)}>
            <FolderIcon />
            <span className="sm-ellipsis" style={{ fontWeight: 600 }}>
              {dir.name}
            </span>
          </button>
        ))}
        {here?.dirs.length === 0 && <p style={{ ...MUTED, margin: 0, padding: '8px 9px' }}>No folders in here.</p>}
      </div>
      {(note ?? error) && (
        <p role="status" style={{ margin: 0, fontSize: 13 }}>
          {error ?? note}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Btn onClick={onCancel}>Cancel</Btn>
        <Btn primary disabled={!here} onClick={() => here && onUse(here.path)}>
          Use this folder
        </Btn>
      </div>
    </div>
  )
}

function WorkspaceRow({
  workspace,
  added,
  active,
  busy,
  now,
  onHover,
  onPick,
}: {
  workspace: Workspace
  added: boolean
  active: boolean
  busy: boolean
  now: number
  onHover: () => void
  onPick: () => void
}) {
  return (
    <li
      id={optionId(workspace)}
      role="option"
      className="sm-row"
      aria-selected={false}
      aria-disabled={busy}
      data-active={active && !busy}
      data-testid="workspace-row"
      title={workspace.path}
      onMouseEnter={onHover}
      onClick={() => {
        if (!busy) onPick()
      }}
    >
      <span className="sm-ellipsis" style={added ? MUTED : { fontWeight: 600 }}>
        {workspace.name}
      </span>
      {workspace.worktrees > 0 && <span style={{ ...MUTED, fontSize: 12, whiteSpace: 'nowrap' }}>{countOf(workspace.worktrees, 'worktree')}</span>}
      <span style={{ flex: 1 }} />
      <span className="sm-row-action">{added ? 'Open' : 'Add'}</span>
      {!added && workspace.touched > 0 && (
        <span style={{ ...MUTED, fontSize: 12, whiteSpace: 'nowrap' }}>{builtAgo(workspace.touched, now)}</span>
      )}
    </li>
  )
}

/** The repos in the default folder. One click adds a new one or opens an added one. */
function WorkspacePicker({
  list,
  projects,
  busy,
  onAdd,
  onOpen,
}: {
  list: Loaded
  projects: Project[]
  busy: boolean
  onAdd: (workspace: Workspace) => void
  onOpen: (workspace: Workspace) => void
}) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const movedByKey = useRef(false)
  const { toAdd, added } = splitWorkspaces(list.repos, projects, query)
  const rows = [...toAdd, ...added]
  const at = Math.min(cursor, rows.length - 1)
  const now = Date.now() / 1000
  const pick = (row: Workspace) => (added.includes(row) ? onOpen(row) : onAdd(row))

  useEffect(() => {
    if (!movedByKey.current) return
    movedByKey.current = false
    if (rows[at]) document.getElementById(optionId(rows[at]))?.scrollIntoView({ block: 'nearest' })
  })

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (rows.length === 0) return
      movedByKey.current = true
      setCursor((at + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length)
    } else if (event.key === 'Enter' && rows[at] && !busy) {
      event.preventDefault()
      pick(rows[at])
    }
  }

  const row = (workspace: Workspace, isAdded: boolean, index: number) => (
    <WorkspaceRow
      key={workspace.path}
      workspace={workspace}
      added={isAdded}
      active={index === at}
      busy={busy}
      now={now}
      onHover={() => setCursor(index)}
      onPick={() => pick(workspace)}
    />
  )

  return (
    <>
      <SearchInput
        autoFocus
        role="combobox"
        aria-label="Search workspaces"
        aria-expanded
        aria-controls={LIST_ID}
        aria-activedescendant={rows[at] ? optionId(rows[at]) : undefined}
        placeholder={searchLabel(list.repos, projects)}
        value={query}
        disabled={busy}
        onKeyDown={onKeyDown}
        onChange={(event) => {
          setQuery(event.target.value)
          setCursor(0)
        }}
      />
      <ul id={LIST_ID} className="sm-list sm-add-list" role="listbox" aria-label="Workspaces">
        {toAdd.map((workspace, index) => row(workspace, false, index))}
        {added.length > 0 && (
          <li role="presentation" className="sm-add-head">
            Already added
          </li>
        )}
        {added.map((workspace, index) => row(workspace, true, toAdd.length + index))}
      </ul>
      {rows.length === 0 && <p style={{ ...MUTED, margin: 0, padding: '0 9px' }}>No workspace matches that.</p>}
      {list.truncated && <p style={{ ...MUTED, margin: 0, fontSize: 12 }}>This folder is too big to search all of it. Pick a smaller one.</p>}
    </>
  )
}

export function AddProject({
  open,
  projects,
  onClose,
  onBuilt,
}: {
  open: boolean
  projects: Project[]
  onClose: () => void
  onBuilt: (key: string) => void
}) {
  const api = useAppApi()
  const { list, error: listError, saveDefault } = useWorkspaces(open)
  const [view, setView] = useState<'workspaces' | 'folders'>('workspaces')
  const [note, setNote] = useState<string | null>(null)
  const [typing, setTyping] = useState(false)
  const [path, setPath] = useState('')
  const [building, setBuilding] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const showFolders = (message: string | null) => {
    setNote(message)
    setView('folders')
  }
  const { waiting, openWindow, closeWindow } = useFolderWindow(open, (folder) => void saveDefault(folder), showFolders)

  useEffect(() => {
    if (!open) return
    setView('workspaces')
    setNote(null)
    setTyping(false)
    setPath('')
    setError(null)
    setBuilding(null)
  }, [open])

  const build = async (folder: string, saveSuggestion: boolean) => {
    setBuilding(folder)
    setError(null)
    try {
      if (saveSuggestion && list?.suggested && list.folder) await api.post(`${BASE}/default-folder`, { folder: list.folder })
      const reply = await api.post<{ repo_key: string }>(`${BASE}/build`, { repo_path: folder })
      onBuilt(reply.repo_key)
    } catch (caught) {
      setError(plainError(caught, 'add this project'))
    } finally {
      setBuilding(null)
    }
  }

  const browse = () => void openWindow(list?.folder ?? null)

  const empty = (message: string) => (
    <div className="sm-add-empty" data-testid="add-empty">
      <FolderIcon />
      <span>{message}</span>
      <Btn primary disabled={waiting} onClick={browse}>
        Browse…
      </Btn>
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} title={view === 'folders' ? 'Choose folder' : 'Add project'} maxWidth={520} dismissDisabled={building !== null}>
      {view === 'folders' ? (
        <FolderList
          start={list?.folder ?? null}
          note={note}
          onCancel={() => setView('workspaces')}
          onUse={(folder) => {
            setView('workspaces')
            void saveDefault(folder)
          }}
        />
      ) : (
        <div style={{ display: 'grid', gap: 12, padding: 16 }} data-testid="add-project">
          {list?.folder && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }} data-testid="default-folder">
              <FolderIcon />
              <span className="sm-mono sm-ellipsis" style={{ fontSize: 13 }} title={list.folder}>
                {list.display && shortPath(list.display)}
              </span>
              {list.suggested ? <Badge variant="aim">Suggested</Badge> : <span style={{ ...MUTED, fontSize: 12 }}>Default</span>}
              <span style={{ flex: 1 }} />
              <button type="button" className="sm-plain sm-link" disabled={waiting || building !== null} onClick={browse}>
                Browse…
              </button>
            </div>
          )}
          {waiting && (
            <div role="status" className="sm-notice" data-testid="window-open">
              <span style={{ flex: 1 }}>Pick a folder in the window that just opened.</span>
              <button
                type="button"
                className="sm-plain sm-link"
                onClick={() => {
                  closeWindow()
                  showFolders(null)
                }}
              >
                Pick here instead
              </button>
            </div>
          )}
          {list && list.folder === null && empty('Pick the folder that holds your projects')}
          {list?.missing && empty(`${list.display} isn't there any more`)}
          {list?.folder && !list.missing && list.repos.length === 0 && empty(`No repos in ${list.display}`)}
          {list?.folder && list.repos.length > 0 && (
            <WorkspacePicker
              key={list.folder}
              list={list}
              projects={projects}
              busy={building !== null}
              onAdd={(workspace) => void build(workspace.path, true)}
              onOpen={(workspace) => onBuilt(workspace.key)}
            />
          )}
          {typing ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (path.trim()) void build(path.trim(), false)
              }}
            >
              <label style={{ display: 'block', ...MUTED, fontSize: 12, marginBottom: 4 }} htmlFor="system-map-path">
                Full path to a repo
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  id="system-map-path"
                  placeholder="/path/to/repo"
                  value={path}
                  disabled={building !== null}
                  autoFocus
                  onChange={(event) => setPath(event.target.value)}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <Btn primary type="submit" disabled={building !== null || !path.trim()}>
                  Add
                </Btn>
              </div>
            </form>
          ) : (
            <button type="button" className="sm-plain sm-link" style={{ justifySelf: 'start' }} disabled={building !== null} onClick={() => setTyping(true)}>
              Use a full path
            </button>
          )}
          <div role="status" aria-live="polite" style={{ fontSize: 13, minHeight: 18 }} data-testid="add-status">
            {building !== null ? `Building ${building.split('/').pop()}. This can take a minute.` : (error ?? listError)}
          </div>
        </div>
      )}
    </Modal>
  )
}
