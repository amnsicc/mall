import { ref, watch } from 'vue'

export function useProductDraft(keyword, search, products) {
  const selectedId = ref(null)
  const storageKey = 'product-filter-draft'
  const raw = localStorage.getItem(storageKey)
  if (raw !== null) {
    let draft
    try { draft = JSON.parse(raw) } catch { draft = { keyword: raw } }
    keyword.value = typeof draft?.keyword === 'string' ? draft.keyword : ''
    selectedId.value = draft?.selectedId ?? null
    search(keyword.value)
  }
  // Catalog arrives asynchronously; normalize the stored ID only after products arrive.
  watch(products, (items) => {
    if (!items.length || selectedId.value == null) return
    selectedId.value = items.find((p) => String(p.id) === String(selectedId.value))?.id ?? null
  })
  // Save the input draft, not the query, so unfinished edits survive refresh.
  watch([keyword, selectedId], ([value, id]) => {
    localStorage.setItem(storageKey, JSON.stringify({ keyword: value, selectedId: id }))
  })
  function toggleSelect(id) {
    selectedId.value = selectedId.value === id ? null : id
  }
  return { selectedId, toggleSelect }
}
