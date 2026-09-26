import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

test('独立版 holiday.js 可直接运行并输出统计结果', () => {
  const source = readFileSync('holiday-assignment/holiday-standalone.js', 'utf8')
  const result = spawnSync(process.execPath, ['holiday-assignment/holiday-standalone.js'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  })

  assert.match(source, /const printReport = \(items\) =>/)
  assert.match(source, /printReport\(products\)/)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /总花费：¥475\.60/)
  assert.match(result.stdout, /平均单价：¥45\.49/)
  assert.match(result.stdout, /数码：¥188\.00/)
})
