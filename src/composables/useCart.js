import { storeToRefs } from 'pinia'
import { pinia } from '../stores/index.js'
import { useCartStore } from '../stores/cart.js'

// Preserve the existing component contract while all state belongs to the cart store.
export function useCart() {
  const cart = useCartStore(pinia)
  const { items, totalCount, totalPrice } = storeToRefs(cart)
  return {
    items,
    cartCount: totalCount,
    total: totalPrice,
    addToCart: cart.add,
    setQuantity: cart.setCount,
    syncCatalog: cart.syncCatalog,
  }
}
