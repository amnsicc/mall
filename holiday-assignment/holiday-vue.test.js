import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('假期商品路由保留且旧导航入口已移除', async () => {
  const [router, app] = await Promise.all([
    read('../src/router/index.js'),
    read('../src/App.vue'),
  ])

  assert.match(router, /path:\s*['"]\/holiday['"]/)
  assert.match(router, /HolidayProducts\.vue/)
  assert.doesNotMatch(app, /<nav|课程名片|商品列表|假期商品/)
})

test('假期商品页使用 ref、v-for 并复用 ProductCard', async () => {
  const page = await read('../src/views/HolidayProducts.vue')

  assert.match(page, /ref\(/)
  assert.match(page, /v-for=/)
  assert.match(page, /<ProductCard/)
  assert.match(page, /calculateTotal/)
})

test('商品卡片展示类别且不显示估价标签和数量', async () => {
  const card = await read('../src/components/ProductCard.vue')

  assert.match(card, /goods\.category/)
  assert.doesNotMatch(card, /浏览数量|数量 \{\{|估价|sourceUrl|查看京东来源/)
})

test('页面使用纯白背景且不显示多余说明句', async () => {
  const [styles, page] = await Promise.all([
    read('../src/assets/main.css'),
    read('../src/views/HolidayProducts.vue'),
  ])

  assert.match(styles, /background:\s*#fff;/)
  assert.doesNotMatch(page, /从京东浏览了 10 件商品/)
  assert.match(page, />商品清单</)
  assert.doesNotMatch(
    page,
    /京东来源|浏览商品|HOLIDAY WINDOW SHOPPING|假期云逛街清单|2026-09-26/,
  )
})
