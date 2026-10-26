import { computed, ref } from 'vue'
import { products } from '@/data/products'

const quantities = ref({})
const items = computed(() => products.filter((p) => quantities.value[p.id] > 0)
  .map((product) => ({ ...product, quantity: quantities.value[product.id] })))
const cartCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

function setQuantity(id, quantity) {
  const product = products.find((p) => p.id === Number(id))
  if (!product || !Number.isInteger(quantity)) return
  const next = Math.min(product.stock, Math.max(0, quantity))
  if (next === 0) delete quantities.value[product.id]
  else quantities.value[product.id] = next
}
function addToCart(product) {
  setQuantity(product.id, (quantities.value[product.id] || 0) + 1)
}
export function useCart() { return { items, cartCount, total, addToCart, setQuantity } }
