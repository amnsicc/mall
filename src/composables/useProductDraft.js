import { ref, watch } from 'vue'

export function useProductDraft(keyword, search, products) {
  const selectedId = ref(null)
  const storageKey = 'product-filter-draft'
  const raw = localStorage.getItem(storageKey)
  if (raw !== null) {
    let draft
    try { draft = JSON.parse(raw) } catch { draft = { keyword: raw } }
    keyword.value = typeof draft?.keyword === 'string' ? draft.keyword : ''
    selectedId.value = products.value.some((p) => p.id === draft?.selectedId)
      ? draft.selectedId : null
    search(keyword.value)
  }
  // Save the input draft, not the query, so unfinished edits survive refresh.
  watch([keyword, selectedId], ([value, id]) => {
    localStorage.setItem(storageKey, JSON.stringify({ keyword: value, selectedId: id }))
  })
  function toggleSelect(id) {
    selectedId.value = selectedId.value === id ? null : id
  }
  return { selectedId, toggleSelect }
}
