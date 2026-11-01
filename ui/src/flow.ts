import { getViewportForBounds, useReactFlow, useStore } from '@xyflow/react'
import flowCss from '@xyflow/react/dist/style.css?inline'
import { useEffect, useRef } from 'react'

export const MIN_ZOOM = 0.05
export const INSPECTOR_ROOM = 370
/** The tools over the top of a canvas, and the legend along its foot. */
const TOP_ROOM = 88
const BOTTOM_ROOM = 44
/** Below this a canvas has no room for the minimap. */
export const MINIMAP_WIDTH = 560

const STYLE_ID = 'system-map-flow-css'
const THEME_CSS = `
.system-map-flow .react-flow {
  --xy-background-color: transparent;
  --xy-edge-stroke: var(--border-strong, #a1a1aa);
  --xy-controls-button-background-color: var(--card, #fff);
  --xy-controls-button-background-color-hover: var(--bg-hover, #f4f4f5);
  --xy-controls-button-color: var(--text, #18181b);
  --xy-controls-button-border-color: var(--border, #e4e4e7);
  --xy-minimap-background-color: var(--card, #fff);
  --xy-minimap-node-background-color: var(--border-strong, #a1a1aa);
  --xy-attribution-background-color: transparent;
}
.system-map-flow .react-flow__handle { opacity: 0; pointer-events: none; min-width: 1px; min-height: 1px; }
.system-map-flow .react-flow__node { cursor: pointer; }
`

// At import, not in an effect: React Flow checks for its styles as it mounts.
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = flowCss + THEME_CSS
  document.head.appendChild(style)
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Frame these rects, using sizes we already know, so the camera never waits on a measure.
 * `room` keeps space free on the right for the inspector.
 */
/** How wide the canvas is, for what it has room to show. */
export function useCanvasWidth(): number {
  return useStore((state) => state.width)
}

export function useFrame(rects: Rect[], room: number) {
  const flow = useReactFlow()
  const width = useStore((state) => state.width)
  const height = useStore((state) => state.height)
  const moved = useRef(false)

  useEffect(() => {
    if (!width || !height || rects.length === 0) return
    const left = Math.min(...rects.map((rect) => rect.x))
    const top = Math.min(...rects.map((rect) => rect.y))
    const right = Math.max(...rects.map((rect) => rect.x + rect.width))
    const bottom = Math.max(...rects.map((rect) => rect.y + rect.height))
    const free = Math.min(room, width * 0.5)
    const view = getViewportForBounds(
      { x: left, y: top, width: right - left, height: bottom - top },
      width - free,
      Math.max(120, height - TOP_ROOM - BOTTOM_ROOM),
      MIN_ZOOM,
      1,
      0.05,
    )
    void flow.setViewport({ ...view, y: view.y + TOP_ROOM }, { duration: moved.current ? 200 : 0 })
    moved.current = true
  }, [flow, rects, room, width, height])
}
