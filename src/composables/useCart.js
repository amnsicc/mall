import { computed, ref } from 'vue'

const records = ref({})
const quantities = ref({})
const items = computed(() => Object.values(records.value).filter((p) => quantities.value[p.id] > 0)
  .map((product) => ({ ...product, quantity: quantities.value[product.id] })))
const cartCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
function setQuantity(id, quantity) {
  const product = records.value[id]
  if (!product || !Number.isInteger(quantity)) return
  const next = Math.min(product.stock, Math.max(0, quantity))
  if (next === 0) delete quantities.value[id]
  else quantities.value[id] = next
}
function addToCart(product) {
  records.value[product.id] = { ...product }
  setQuantity(product.id, (quantities.value[product.id] || 0) + 1)
}
function syncCatalog(products) {
  // Refresh prices and stock from the server, and remove deleted products from this session's cart.
  records.value = Object.fromEntries(products.map((p) => [p.id, { ...p }]))
  for (const id of Object.keys(quantities.value)) {
    if (!records.value[id]) delete quantities.value[id]
    else setQuantity(id, quantities.value[id])
  }
}
export function useCart() { return { items, cartCount, total, addToCart, setQuantity, syncCatalog } }
