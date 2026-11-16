import test from 'node:test'
import assert from 'node:assert/strict'
import { ref } from 'vue'
import { readFileSync } from 'node:fs'
const products = JSON.parse(readFileSync(new URL('../db.json', import.meta.url))).products.slice(0, 6)
import { useProductFilter } from '../src/composables/useProductFilter.js'
import { useCart } from '../src/composables/useCart.js'
import { useCartStore } from '../src/stores/cart.js'
import { pinia } from '../src/stores/index.js'

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

test('refreshing catalog preserves the price snapshot and reconciles stock and removed products', () => {
  const c = useCart()
  c.addToCart(products[0])
  c.setQuantity(1, 4)
  c.syncCatalog([{ ...products[0], price: 300, stock: 2 }])
  assert.equal(c.cartCount.value, 2)
  assert.equal(c.total.value, products[0].price * 2)
  c.syncCatalog([])
  assert.equal(c.cartCount.value, 0)
})

test('Pinia cart validates quantities, merges mixed ID types and clears through actions', () => {
  const cart = useCartStore(pinia)
  cart.clear()
  cart.add(products[0])
  cart.add({ ...products[0], id: String(products[0].id), price: 999 })
  assert.equal(cart.items.length, 1)
  assert.equal(cart.totalCount, 2)
  assert.equal(cart.totalPrice, products[0].price * 2)
  for (const value of [undefined, NaN, Infinity, 1.5, '3']) cart.setCount(products[0].id, value)
  assert.equal(cart.totalCount, 2)
  cart.setCount(products[0].id, 999)
  assert.equal(cart.totalCount, products[0].stock)
  cart.remove(String(products[0].id))
  assert.equal(cart.isEmpty, true)
  cart.add(products[1])
  cart.clear()
  assert.equal(cart.totalCount, 0)
  assert.equal(cart.totalPrice, 0)
})
