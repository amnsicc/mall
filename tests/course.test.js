import test from 'node:test'
import assert from 'node:assert/strict'
import { ref } from 'vue'
import { readFileSync } from 'node:fs'
const products = JSON.parse(readFileSync(new URL('../db.json', import.meta.url))).products.slice(0, 6)
import { useProductFilter } from '../src/composables/useProductFilter.js'
import { useCart } from '../src/composables/useCart.js'

test('draft and submitted query stay separate; filters compose without mutating products', () => {
  const source = ref(products.map((p) => ({ ...p })))
  const original = JSON.stringify(source.value)
  const f = useProductFilter(source)
  f.keyword.value = ' MOUSE '
  assert.equal(f.sorted.value.length, 6)
  f.search()
  assert.equal(f.query.value, 'mouse')
  assert.equal(f.sorted.value.length, 3)
  f.category.value = 'keyboard'
  assert.equal(f.sorted.value.length, 0)
  f.category.value = 'mouse'
  f.priceMax.value = 100
  assert.deepEqual(f.sorted.value.map((p) => p.id), [2])
  f.priceMax.value = Infinity
  f.desc.value = true
  assert.deepEqual(f.sorted.value.map((p) => p.price), [159, 159, 99])
  assert.equal(JSON.stringify(source.value), original)
  f.resetFilters()
  assert.equal(f.keyword.value, '')
  assert.equal(f.query.value, '')
  assert.equal(f.category.value, 'all')
  assert.equal(f.priceMax.value, Infinity)
  assert.equal(f.desc.value, false)
  assert.equal(f.sorted.value.length, 6)
})

test('cart quantities respect stock, totals and removal', () => {
  const c = useCart()
  for (const p of products) c.setQuantity(p.id, 0)
  c.addToCart(products[2])
  assert.equal(c.cartCount.value, 0)
  c.addToCart(products[0])
  c.addToCart(products[1])
  assert.equal(c.cartCount.value, 2)
  assert.equal(c.total.value, 298)
  c.setQuantity(1, 999)
  assert.equal(c.items.value.find((p) => p.id === 1).quantity, 5)
  c.setQuantity(1, -1)
  assert.equal(c.cartCount.value, 1)
  c.setQuantity(2, 1.5)
  c.setQuantity(999, 1)
  assert.equal(c.cartCount.value, 1)
  c.setQuantity(2, 0)
  assert.equal(c.total.value, 0)
})

test('refreshing catalog reconciles cart prices, stock and removed products', () => {
  const c = useCart()
  c.addToCart(products[0])
  c.setQuantity(1, 4)
  c.syncCatalog([{ ...products[0], price: 300, stock: 2 }])
  assert.equal(c.cartCount.value, 2)
  assert.equal(c.total.value, 600)
  c.syncCatalog([])
  assert.equal(c.cartCount.value, 0)
})
