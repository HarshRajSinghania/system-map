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

/** Dagre's gap between cards in a rank, and between ranks. */
const NODE_SEP = 14
const RANK_SEP = 70

/** Room between a band's dashed edge and the cards inside it. */
const BAND_PAD = 10

/**
 * Where each card goes, left to right or top down. A band's members are laid out together,
 * as one cluster, so nothing else lands inside its box.
 */
export function layoutView(view: MapView, direction: 'LR' | 'TB'): { places: Map<string, Placed>; bands: BandBox[] } {
  const bands = (view.bands ?? []).filter((band) => band.members.length > 0)
  const layout = new dagre.graphlib.Graph({ multigraph: true, compound: bands.length > 0 })
  layout.setGraph({ rankdir: direction, nodesep: NODE_SEP, ranksep: RANK_SEP, marginx: 16, marginy: 16 })
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
  return { places, bands: bandBoxes(bands, places) }
}

/** A dashed box around each band's members, wherever they were placed. */
function bandBoxes(bands: Band[], places: Map<string, Placed>): BandBox[] {
  return bands.map((band) => {
    const spots = band.members.map((id) => places.get(id)).filter((spot): spot is Placed => Boolean(spot))
    const left = Math.min(...spots.map((spot) => spot.x)) - BAND_PAD
    const top = Math.min(...spots.map((spot) => spot.y)) - BAND_PAD
    const right = Math.max(...spots.map((spot) => spot.x + CARD_WIDTH)) + BAND_PAD
    const bottom = Math.max(...spots.map((spot) => spot.y + CARD_HEIGHT)) + BAND_PAD
    return { ...band, x: left, y: top, width: right - left, height: bottom - top }
  })
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
  const goDown = fitIn(down, width, height) > fitIn(across, width, height) * TOP_DOWN_GAIN
  const plain = goDown ? { ...down, direction: 'TB' as const } : { ...across, direction: 'LR' as const }
  const plainFit = fitIn(plain, width, height)
  if (plainFit >= 1) return plain
  // One crowded rank can shrink the whole picture. Wrapping it must read clearly bigger to win.
  const bestWrap = (base: Laid, direction: 'LR' | 'TB') => {
    let best: { laid: Laid; fit: number } | null = null
    for (const limit of wrapLimits(view, base, direction)) {
      const laid = wrapRanks(base, direction, limit)
      const fit = fitIn(laid, width, height)
      if (!best || fit > best.fit) best = { laid, fit }
    }
    return best
  }
  const wrapAcross = bestWrap(across, 'LR')
  const wrapDown = bestWrap(down, 'TB')
  const pick = wrapDown && (!wrapAcross || wrapDown.fit > wrapAcross.fit * TOP_DOWN_GAIN) ? { ...wrapDown, direction: 'TB' as const } : wrapAcross && { ...wrapAcross, direction: 'LR' as const }
  return pick && pick.fit > plainFit * WRAP_GAIN ? { ...pick.laid, direction: pick.direction } : plain
}

/** A wrapped picture must read this much bigger than the plain one to win. */
const WRAP_GAIN = 1.25
/** Fewest cards a wrapped column or row holds. */
const MIN_CHUNK = 4

type Laid = ReturnType<typeof layoutView>

/** Ranks as lists of card ids, in order along the rank, with the rank's coordinate. */
function ranksOf(places: Map<string, Placed>, direction: 'LR' | 'TB'): string[][] {
  const along = direction === 'LR' ? 'x' : 'y'
  const across = direction === 'LR' ? 'y' : 'x'
  const byRank = new Map<number, string[]>()
  for (const [id, spot] of places) {
    const key = Math.round(spot[along])
    byRank.set(key, [...(byRank.get(key) ?? []), id])
  }
  return [...byRank.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, ids]) => ids.sort((a, b) => (places.get(a)?.[across] ?? 0) - (places.get(b)?.[across] ?? 0)))
}

/** The chunk sizes worth trying: the crowded rank cut in 2 to 8 parts, never under the minimum. */
function wrapLimits(view: MapView, base: Laid, direction: 'LR' | 'TB'): number[] {
  const banded = new Set((view.bands ?? []).flatMap((band) => band.members))
  const longest = Math.max(0, ...ranksOf(base.places, direction).filter((ids) => !ids.some((id) => banded.has(id))).map((ids) => ids.length))
  const limits = new Set<number>()
  for (let parts = 2; parts <= 8; parts++) {
    const size = Math.ceil(longest / parts)
    if (size >= MIN_CHUNK && size < longest) limits.add(size)
  }
  return [...limits].sort((a, b) => b - a)
}

/**
 * Cut every rank longer than `limit` into chunks, side by side along the rank direction, and push
 * the later ranks on so none overlap. Ranks that hold a band member stay whole.
 */
function wrapRanks(base: Laid, direction: 'LR' | 'TB', limit: number): Laid {
  const along = direction === 'LR' ? 'x' : 'y'
  const across = direction === 'LR' ? 'y' : 'x'
  const depth = direction === 'LR' ? CARD_WIDTH : CARD_HEIGHT
  const banded = new Set(base.bands.flatMap((band) => band.members))
  const places = new Map<string, Placed>()
  let shift = 0
  for (const ids of ranksOf(base.places, direction)) {
    const spots = ids.map((id) => base.places.get(id) as Placed)
    if (ids.length <= limit || ids.some((id) => banded.has(id))) {
      ids.forEach((id, index) => places.set(id, { ...spots[index], [along]: spots[index][along] + shift }))
      continue
    }
    // Chunks reuse the first chunk's slots, centred where the whole rank sat.
    const slots = spots.map((spot) => spot[across])
    const centre = (slots[0] + slots[slots.length - 1]) / 2
    const used = (slots[0] + slots[limit - 1]) / 2
    ids.forEach((id, index) => {
      const chunk = Math.floor(index / limit)
      places.set(id, {
        ...spots[index],
        [along]: spots[index][along] + shift + chunk * (depth + RANK_SEP),
        [across]: slots[index % limit] + centre - used,
      })
    })
    shift += (Math.ceil(ids.length / limit) - 1) * (depth + RANK_SEP)
  }
  return { places, bands: bandBoxes(base.bands, places) }
}
