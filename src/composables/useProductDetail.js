import { onScopeDispose, ref, watch } from 'vue'
import { api } from '@/api'

export function useProductDetail(id) {
  const detail = ref(null)
  const state = ref('loading')
  const error = ref('')
  let requestId = 0
  async function load() {
    const current = ++requestId
    state.value = 'loading'
    error.value = ''
    try {
      const result = await api.getProduct(id())
      // A slower response for the previous URL must never overwrite the current product.
      if (current !== requestId) return
      detail.value = result
      state.value = 'ok'
    } catch (reason) {
      if (current !== requestId) return
      detail.value = null
      error.value = reason.message
      state.value = 'fail'
    }
  }
  watch(id, load, { immediate: true })
  onScopeDispose(() => { requestId++ })
  return { detail, state, error, load }
}
