import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => Number(items.value.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)))
  const isEmpty = computed(() => items.value.length === 0)

  function remove(id) {
    items.value = items.value.filter((item) => String(item.id) !== String(id))
  }

  function setCount(id, quantity) {
    const item = items.value.find((entry) => String(entry.id) === String(id))
    if (!item || !Number.isInteger(quantity)) return
    const next = Math.min(item.stock, Math.max(0, quantity))
    if (next === 0) remove(id)
    else item.quantity = next
  }

  function add(product) {
    const stock = Number(product.stock)
    const price = Number(product.price)
    if (!Number.isInteger(stock) || stock <= 0 || !Number.isFinite(price) || price < 0) return
    const item = items.value.find((entry) => String(entry.id) === String(product.id))
    if (item) {
      item.stock = stock
      setCount(item.id, item.quantity + 1)
      return
    }
    const { id, name, img, category } = product
    items.value.push({ id, name, img, category, price, stock, quantity: 1 })
  }

  function clear() { items.value = [] }

  function syncCatalog(products) {
    // Keep the add-time price snapshot while reconciling availability with the server.
    for (const item of [...items.value]) {
      const product = products.find((entry) => String(entry.id) === String(item.id))
      if (!product) remove(item.id)
      else {
        item.stock = product.stock
        setCount(item.id, item.quantity)
      }
    }
  }

  return { items, totalCount, totalPrice, isEmpty, add, setCount, remove, clear, syncCatalog }
}, { persist: true })
