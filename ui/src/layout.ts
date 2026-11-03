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
