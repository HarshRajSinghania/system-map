import { useAppApi } from '@kirocrew/app-sdk'
import { Btn, Input, Modal } from '@kirocrew/app-sdk/ui'
import { useEffect, useState } from 'react'
import { plainError } from './errors'
import { BASE } from './model'
import { MUTED } from './parts'
import { builtAgo, countOf, recentToAdd, removalWarning, rowHint, statusView } from './projects'
import type { Project, RecentFolder } from './projects'

/** Folders KiroCrew has seen lately. The route isn't promised to apps, so a refusal just means none. */
function useRecentFolders(open: boolean, projects: Project[]): RecentFolder[] {
  const api = useAppApi()
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    let live = true
    api
      .get<{ dirs?: unknown }>('/api/recent-projects')
      .then((reply) => {
        if (live) setRecent(Array.isArray(reply.dirs) ? reply.dirs.filter((dir): dir is string => typeof dir === 'string') : [])
      })
      .catch(() => {
        if (live) setRecent([])
      })
    return () => {
      live = false
    }
  }, [api, open])

  return recentToAdd(recent, projects)
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
  const recent = useRecentFolders(open, projects)
  const [path, setPath] = useState('')
  const [building, setBuilding] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setPath('')
    setError(null)
    setBuilding(null)
  }, [open])

  const build = async (folder: string) => {
    setBuilding(folder)
    setError(null)
    try {
      const reply = await api.post<{ repo_key: string }>(`${BASE}/build`, { repo_path: folder })
      onBuilt(reply.repo_key)
    } catch (caught) {
      setError(plainError(caught, 'add this project'))
    } finally {
      setBuilding(null)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add project" maxWidth={520} dismissDisabled={building !== null}>
      <div style={{ display: 'grid', gap: 12, padding: 16 }} data-testid="add-project">
        {recent.length > 0 && (
          <div>
            <div style={{ ...MUTED, fontSize: 12, marginBottom: 4 }}>Recent projects</div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {recent.map((folder) => (
                <button
                  key={folder.path}
                  type="button"
                  className="sm-plain sm-row"
                  title={folder.path}
                  disabled={building !== null}
                  onClick={() => void build(folder.path)}
                >
                  <span className="sm-ellipsis" style={{ fontWeight: 600 }}>
                    {folder.name}
                  </span>
                  <span className="sm-ellipsis" style={{ ...MUTED, marginLeft: 'auto', fontSize: 12 }}>
                    {folder.parent}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (path.trim()) void build(path.trim())
          }}
        >
          <label style={{ display: 'block', ...MUTED, fontSize: 12, marginBottom: 4 }} htmlFor="system-map-path">
            Or type the full path to a git repo
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
        <div role="status" aria-live="polite" style={{ fontSize: 13, minHeight: 18 }} data-testid="add-status">
          {building !== null ? `Building ${building.split('/').pop()}. This can take a minute.` : error}
        </div>
      </div>
    </Modal>
  )
}

function ProjectRow({
  project,
  hint,
  onBuilt,
  onRemove,
}: {
  project: Project
  /** Set when two projects share a name, since a long path can hide what differs. */
  hint: string | null
  onBuilt: () => void
  onRemove: (key: string) => Promise<void>
}) {
  const api = useAppApi()
  const [confirming, setConfirming] = useState(false)
  const [working, setWorking] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const status = statusView(project.status, project.behind, project.ref)
  const saved = removalWarning(project.intent)

  const rebuild = async () => {
    setWorking('Rebuilding')
    setError(null)
    try {
      await api.post(`${BASE}/build`, { repo: project.repo_key })
      onBuilt()
    } catch (caught) {
      setError(plainError(caught, 'rebuild this project'))
    } finally {
      setWorking(null)
    }
  }

  const remove = async () => {
    setWorking('Removing')
    setError(null)
    try {
      await onRemove(project.repo_key)
    } catch (caught) {
      setError(plainError(caught, 'remove this project'))
      setWorking(null)
    }
  }

  return (
    <div className="sm-manage-row" data-testid="manage-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span className="sm-dot" data-tone={status.tone} />
        <span className="sm-ellipsis" style={{ fontWeight: 600 }} title={project.repo}>
          {project.name}
        </span>
        {hint && <span style={{ ...MUTED, fontSize: 12, whiteSpace: 'nowrap' }}>{hint}</span>}
        <span style={{ ...MUTED, fontSize: 12, whiteSpace: 'nowrap' }}>{status.label}</span>
        <span style={{ flex: 1 }} />
        <Btn disabled={working !== null || project.status === 'missing'} onClick={() => void rebuild()}>
          {working === 'Rebuilding' ? 'Rebuilding' : 'Rebuild'}
        </Btn>
        <Btn danger disabled={working !== null} onClick={() => setConfirming(true)}>
          Remove
        </Btn>
      </div>
      <div className="sm-mono sm-ellipsis" style={{ ...MUTED, marginTop: 4 }} title={project.repo}>
        {project.repo}
      </div>
      <div style={{ ...MUTED, fontSize: 12, marginTop: 2 }}>
        {countOf(project.tables, 'table')}, built {builtAgo(project.built_at, Date.now() / 1000)}
      </div>
      {confirming && (
        <div role="alert" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border, #e4e4e7)' }} data-testid="confirm-remove">
          <p style={{ margin: '0 0 8px' }}>
            Remove {project.name} from System Map? This deletes its model{saved ? ` and ${saved}` : ''} for good. The repo itself isn't touched.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn danger disabled={working !== null} onClick={() => void remove()} autoFocus>
              {working === 'Removing' ? 'Removing' : 'Remove project'}
            </Btn>
            <Btn disabled={working !== null} onClick={() => setConfirming(false)}>
              Keep it
            </Btn>
          </div>
        </div>
      )}
      {error && <p style={{ margin: '8px 0 0' }}>{error}</p>}
    </div>
  )
}

export function ManageProjects({
  open,
  projects,
  onClose,
  onBuilt,
  onRemoved,
}: {
  open: boolean
  projects: Project[]
  onClose: () => void
  onBuilt: () => void
  onRemoved: (key: string) => void
}) {
  const api = useAppApi()

  const remove = async (key: string) => {
    await api.post(`${BASE}/repo-remove`, { repo: key })
    onRemoved(key)
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage projects" maxWidth={620}>
      <div className="sm-manage" style={{ padding: 16, maxHeight: '60vh', overflowY: 'auto' }} data-testid="manage-projects">
        {projects.map((project) => (
          <ProjectRow key={project.repo_key} project={project} hint={rowHint(project, projects)} onBuilt={onBuilt} onRemove={remove} />
        ))}
        {projects.length === 0 && <p style={{ ...MUTED, margin: 0 }}>No projects yet.</p>}
      </div>
    </Modal>
  )
}
