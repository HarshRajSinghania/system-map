// Which tabs fit in a row. The rest go under More, but the open one always stays in view.

export interface Fit {
  visible: number[]
  hidden: number[]
}

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
