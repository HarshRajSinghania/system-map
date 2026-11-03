import { Badge, Btn } from '@kirocrew/app-sdk/ui'
import type { ReactNode } from 'react'
import './chrome'

export interface Layer {
  key: string
  label: string
  on: boolean
  title: string
  /** Nothing to draw yet. The title says why. */
  disabled?: boolean
  onToggle: () => void
}

/** What to draw over the map. These change the picture, not the view, so they live on it. */
export function Layers({ layers }: { layers: Layer[] }) {
  return (
    <div className="sm-layers" role="group" aria-label="Map layers">
      <span className="sm-layers-label">Layers</span>
      {layers.map((layer) => (
        <button key={layer.key} type="button" className="sm-plain sm-layer" aria-pressed={layer.on} title={layer.title} disabled={layer.disabled} onClick={layer.onToggle}>
          {layer.label}
        </button>
      ))}
    </div>
  )
}

/** Sits on a canvas, above the picture. */
export function CanvasTools({ children }: { children: ReactNode }) {
  return <div className="sm-tools">{children}</div>
}

/** Says when the picture isn't today's system, with the way back. */
export function Showing({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }} data-testid="showing">
      <Badge variant="aim">Showing: {title}</Badge>
      <Btn onClick={onBack}>Back to today</Btn>
    </span>
  )
}
