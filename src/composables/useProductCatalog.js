import { onActivated, onMounted, ref } from 'vue'
import { api } from '@/api'
import { useCart } from './useCart'

export function useProductCatalog() {
  const products = ref([])
  const loading = ref(true)
  const error = ref('')
  const { syncCatalog } = useCart()
  let requestId = 0
  let initialized = false
  async function load() {
    const current = ++requestId
    loading.value = true
    error.value = ''
    try {
      const result = await api.getProducts()
      if (current !== requestId) return
      products.value = result
      syncCatalog(result)
    } catch { if (current === requestId) error.value = '商品加载失败，请稍后重试。' }
    finally { if (current === requestId) { loading.value = false; initialized = true } }
  }
  onMounted(load)
  onActivated(() => { if (initialized) load() })
  return { products, loading, error, load }
}
