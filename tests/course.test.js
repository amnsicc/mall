import test from 'node:test'
import assert from 'node:assert/strict'
import { ref } from 'vue'
import { products } from '../src/data/products.js'
import { useProductFilter } from '../src/composables/useProductFilter.js'
import { useCart } from '../src/composables/useCart.js'
import { api } from '../src/api/index.js'

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

test('mock API uses the same catalog as the list and rejects unknown IDs', async () => {
  const product = await api.getProduct('1')
  assert.deepEqual(product, products[0])
  product.name = 'changed response'
  assert.equal(products[0].name, '机械 Key')
  await assert.rejects(api.getProduct('999'), /商品不存在/)
  await assert.rejects(api.getProduct('1abc'), /商品不存在/)
})
