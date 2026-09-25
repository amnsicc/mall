import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('路由和导航包含假期商品页', async () => {
  const [router, app] = await Promise.all([
    read('../src/router/index.js'),
    read('../src/App.vue'),
  ])

  assert.match(router, /path:\s*['"]\/holiday['"]/)
  assert.match(router, /HolidayProducts\.vue/)
  assert.match(app, /to="\/holiday"/)
})

test('假期商品页使用 ref、v-for 并复用 ProductCard', async () => {
  const page = await read('../src/views/HolidayProducts.vue')

  assert.match(page, /ref\(/)
  assert.match(page, /v-for=/)
  assert.match(page, /<ProductCard/)
  assert.match(page, /calculateTotal/)
})

test('商品卡片按数据展示类别和数量', async () => {
  const card = await read('../src/components/ProductCard.vue')

  assert.match(card, /goods\.category/)
  assert.match(card, /goods\.quantity/)
})
