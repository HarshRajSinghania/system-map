import assert from 'node:assert/strict'
import { test } from 'node:test'
import { columnsFor, fitTabs } from '../src/fit.ts'

const WIDTHS = [50, 100, 60, 60, 100, 90, 80]
const WHOLE = WIDTHS.reduce((sum, width) => sum + width, 0) + 6 * 16

test('every tab shows when there is room', () => {
  assert.deepEqual(fitTabs(WIDTHS, WHOLE, 60, 0, 16), { visible: [0, 1, 2, 3, 4, 5, 6], hidden: [] })
})

test('tabs that do not fit go under More, in order', () => {
  const fit = fitTabs(WIDTHS, 360, 60, 0, 16)
  assert.deepEqual(fit.visible, [0, 1, 2])
  assert.deepEqual(fit.hidden, [3, 4, 5, 6])
})

test('the open tab stays in view', () => {
  const fit = fitTabs(WIDTHS, 360, 60, 6, 16)
  assert.ok(fit.visible.includes(6))
  assert.ok(!fit.hidden.includes(6))
  assert.equal(fit.visible.length + fit.hidden.length, WIDTHS.length)
})

test('what shows always fits beside More', () => {
  for (let available = 200; available < WHOLE; available += 7) {
    for (let active = 0; active < WIDTHS.length; active += 1) {
      const { visible } = fitTabs(WIDTHS, available, 60, active, 16)
      const used = visible.reduce((sum, index) => sum + WIDTHS[index], 0) + 16 * (visible.length - 1)
      assert.ok(used <= available - 60 - 16, `used ${used} of ${available} with tab ${active}`)
      assert.ok(visible.includes(active))
    }
  }
})

test('a tab that is wider than the row still shows when it is open', () => {
  assert.deepEqual(fitTabs([500, 40], 200, 60, 0, 16).visible, [0])
})

test('a view with a list has it beside the canvas and the chat', () => {
  assert.equal(columnsFor(1400, true), '220px minmax(0, 1fr) minmax(320px, 26%)')
  assert.equal(columnsFor(900, true), '170px minmax(0, 1fr) 260px')
})

test('a view with no list gives that room to the canvas', () => {
  assert.equal(columnsFor(1400, false), 'minmax(0, 1fr) minmax(320px, 26%)')
  assert.equal(columnsFor(900, false), 'minmax(0, 1fr) 260px')
})

test('a narrow page has no list, whatever the view wants', () => {
  assert.equal(columnsFor(700, true), 'minmax(0, 1fr) 240px')
  assert.equal(columnsFor(500, true), 'minmax(0, 1fr)')
})

test('columns change exactly at each width', () => {
  assert.equal(columnsFor(1100, true), '220px minmax(0, 1fr) minmax(320px, 26%)')
  assert.equal(columnsFor(1099, true), '170px minmax(0, 1fr) 260px')
  assert.equal(columnsFor(760, true), '170px minmax(0, 1fr) 260px')
  assert.equal(columnsFor(759, true), 'minmax(0, 1fr) 240px')
  assert.equal(columnsFor(560, true), 'minmax(0, 1fr) 240px')
  assert.equal(columnsFor(559, true), 'minmax(0, 1fr)')
})
