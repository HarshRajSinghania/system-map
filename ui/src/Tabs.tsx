import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { fitTabs } from './fit'
import { Chevron, Dropdown, MenuList } from './Menu'

const GAP = 16
const MORE_WIDTH = 72

export interface TabItem<T extends string> {
  value: T
  label: string
  count?: number
  /** What the count is, in words. */
  counts?: string
}

export const TAB_PANEL_ID = 'system-map-view'

function tabTitle<T extends string>(item: TabItem<T>): string | undefined {
  return item.count === undefined ? undefined : `${item.count} ${item.counts ?? ''}`.trim()
}

function Face<T extends string>({ item }: { item: TabItem<T> }) {
  return (
    <>
      {item.label}
      {item.count !== undefined && <span className="sm-count">{item.count}</span>}
    </>
  )
}

/** The app's views. Tabs that don't fit go under More, and the open one always stays in view. */
export function Tabs<T extends string>({ items, value, onChange, label }: { items: TabItem<T>[]; value: T; onChange: (value: T) => void; label: string }) {
  const bar = useRef<HTMLDivElement>(null)
  const probe = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(Number.POSITIVE_INFINITY)
  const [widths, setWidths] = useState<number[]>([])
  const shape = items.map((item) => `${item.label}${item.count ?? ''}`).join('|')

  useLayoutEffect(() => {
    const measure = () => {
      setRoom(bar.current?.clientWidth ?? 0)
      setWidths([...(probe.current?.children ?? [])].map((child) => (child as HTMLElement).offsetWidth))
    }
    measure()
    const watcher = new ResizeObserver(measure)
    if (bar.current) watcher.observe(bar.current)
    return () => watcher.disconnect()
  }, [shape])

  const active = items.findIndex((item) => item.value === value)
  const fit = useMemo(
    () => (widths.length === items.length ? fitTabs(widths, room, MORE_WIDTH, active, GAP) : { visible: items.map((_, index) => index), hidden: [] }),
    [widths, room, active, items],
  )
  const visible = fit.visible.map((index) => items[index])
  const hidden = fit.hidden.map((index) => items[index])

  const pick = (next: T) => {
    onChange(next)
    requestAnimationFrame(() => list.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus())
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const at = visible.findIndex((item) => item.value === value)
    const count = visible.length
    const targets: Record<string, number> = { ArrowRight: (at + 1) % count, ArrowLeft: (at - 1 + count) % count, Home: 0, End: count - 1 }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    pick(visible[next].value)
  }

  return (
    <div ref={bar} className="sm-bar" style={{ position: 'relative', flex: 'none' }}>
      <div ref={probe} className="sm-tab-probe" aria-hidden="true">
        {items.map((item) => (
          <span key={item.value} className="sm-tab">
            <Face item={item} />
          </span>
        ))}
      </div>
      <div ref={list} className="sm-tabs" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {visible.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`system-map-tab-${item.value}`}
            className="sm-plain sm-tab"
            aria-selected={item.value === value}
            aria-controls={TAB_PANEL_ID}
            tabIndex={item.value === value ? 0 : -1}
            title={tabTitle(item)}
            onClick={() => onChange(item.value)}
          >
            <Face item={item} />
          </button>
        ))}
      </div>
      {hidden.length > 0 && (
        <Dropdown
          width={200}
          popup="menu"
          label="More views"
          trigger={(props) => (
            <button type="button" className="sm-plain sm-tab" {...props}>
              More <Chevron />
            </button>
          )}
        >
          {(close) => (
            <MenuList label="More views">
              {hidden.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="menuitem"
                  className="sm-plain sm-row"
                  title={tabTitle(item)}
                  onClick={() => {
                    close()
                    pick(item.value)
                  }}
                >
                  <Face item={item} />
                </button>
              ))}
            </MenuList>
          )}
        </Dropdown>
      )}
    </div>
  )
}
