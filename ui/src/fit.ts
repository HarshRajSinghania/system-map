// How the page fits the room it has.

/** Below this the canvas needs the room, and the host's own side panel can hold a chat. */
export const SHOW_CHAT = 560
/** Below this the canvas needs the list's room too. */
export const SHOW_LIST = 760
const WIDE = 1100

/** Columns by the width the page really has, which depends on the host's sidebar and panel. */
export function columnsFor(width: number, list: boolean): string {
  const wide = width >= WIDE
  const side = list && width >= SHOW_LIST ? (wide ? '220px' : '170px') : null
  const chat = wide ? 'minmax(320px, 26%)' : width >= SHOW_LIST ? '260px' : width >= SHOW_CHAT ? '240px' : null
  return [side, 'minmax(0, 1fr)', chat].filter(Boolean).join(' ')
}

export interface Fit {
  visible: number[]
  hidden: number[]
}

/** Which tabs fit in a row. The rest go under More, but the open one always stays in view. */
export function fitTabs(widths: number[], available: number, moreWidth: number, active: number, gap: number): Fit {
  const all = widths.map((_, index) => index)
  const total = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, widths.length - 1)
  if (total <= available) return { visible: all, hidden: [] }

  const room = available - moreWidth - gap
  const visible: number[] = []
  let used = 0
  for (const index of all) {
    const next = used + (visible.length ? gap : 0) + widths[index]
    if (next > room) break
    visible.push(index)
    used = next
  }

  // Swap the open tab in for the last ones that fit, so it is never hidden.
  if (active >= 0 && !visible.includes(active)) {
    while (visible.length > 0 && used + gap + widths[active] > room) {
      const dropped = visible.pop() as number
      used -= widths[dropped] + (visible.length ? gap : 0)
    }
    visible.push(active)
  }
  return { visible, hidden: all.filter((index) => !visible.includes(index)) }
}
