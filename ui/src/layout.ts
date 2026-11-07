// Kept apart from graphView so only the map loads dagre, not the side panel.
import dagre from '@dagrejs/dagre'
import { CARD_HEIGHT, CARD_WIDTH } from './graphView.ts'
import type { Band, MapView } from './graphView.ts'

export interface Placed {
  x: number
  y: number
}

export interface BandBox extends Band {
  x: number
  y: number
  width: number
  height: number
}

/** Room between a band's dashed edge and the cards inside it. */
const BAND_PAD = 10

/**
 * Where each card goes, left to right or top down. A band's members are laid out together,
 * as one cluster, so nothing else lands inside its box.
 */
export function layoutView(view: MapView, direction: 'LR' | 'TB'): { places: Map<string, Placed>; bands: BandBox[] } {
  const bands = (view.bands ?? []).filter((band) => band.members.length > 0)
  const layout = new dagre.graphlib.Graph({ multigraph: true, compound: bands.length > 0 })
  layout.setGraph({ rankdir: direction, nodesep: 14, ranksep: 70, marginx: 16, marginy: 16 })
  layout.setDefaultEdgeLabel(() => ({}))
  for (const card of view.cards) layout.setNode(card.id, { width: CARD_WIDTH, height: CARD_HEIGHT })
  for (const band of bands) {
    layout.setNode(band.id, {})
    for (const member of band.members) layout.setParent(member, band.id)
  }
  for (const line of view.lines) {
    if (line.source !== line.target) layout.setEdge(line.source, line.target, {}, line.id)
  }
  dagre.layout(layout)
  const places = new Map<string, Placed>()
  for (const card of view.cards) {
    const placed = layout.node(card.id)
    places.set(card.id, { x: placed.x - CARD_WIDTH / 2, y: placed.y - CARD_HEIGHT / 2 })
  }
  const boxes = bands.map((band) => {
    const spots = band.members.map((id) => places.get(id)).filter((spot): spot is Placed => Boolean(spot))
    const left = Math.min(...spots.map((spot) => spot.x)) - BAND_PAD
    const top = Math.min(...spots.map((spot) => spot.y)) - BAND_PAD
    const right = Math.max(...spots.map((spot) => spot.x + CARD_WIDTH)) + BAND_PAD
    const bottom = Math.max(...spots.map((spot) => spot.y + CARD_HEIGHT)) + BAND_PAD
    return { ...band, x: left, y: top, width: right - left, height: bottom - top }
  })
  return { places, bands: boxes }
}

/** The width and height a laid-out picture takes, bands included. */
export function extent(placed: { places: Map<string, Placed>; bands: BandBox[] }): { width: number; height: number } {
  const rects = [
    ...[...placed.places.values()].map((spot) => ({ x: spot.x, y: spot.y, width: CARD_WIDTH, height: CARD_HEIGHT })),
    ...placed.bands,
  ]
  if (rects.length === 0) return { width: 0, height: 0 }
  const left = Math.min(...rects.map((rect) => rect.x))
  const top = Math.min(...rects.map((rect) => rect.y))
  const right = Math.max(...rects.map((rect) => rect.x + rect.width))
  const bottom = Math.max(...rects.map((rect) => rect.y + rect.height))
  return { width: right - left, height: bottom - top }
}

/** Top down must read this much bigger to win, so a near tie doesn't flip the picture on a resize. */
const TOP_DOWN_GAIN = 1.15

function fitIn(placed: { places: Map<string, Placed>; bands: BandBox[] }, width: number, height: number): number {
  const size = extent(placed)
  return Math.min(1, width / Math.max(size.width, 1), height / Math.max(size.height, 1))
}

/**
 * Lay the picture out both ways, and keep the one this box shows larger. A long chain left to
 * right shrinks to nothing on a squarer canvas, so top down wins there. Left to right stays
 * otherwise, and whenever both fit at full size.
 */
export function readableLayout(view: MapView, width: number, height: number): ReturnType<typeof layoutView> & { direction: 'LR' | 'TB' } {
  const across = layoutView(view, 'LR')
  if (width <= 0 || height <= 0) return { ...across, direction: 'LR' }
  const down = layoutView(view, 'TB')
  return fitIn(down, width, height) > fitIn(across, width, height) * TOP_DOWN_GAIN ? { ...down, direction: 'TB' } : { ...across, direction: 'LR' }
}
