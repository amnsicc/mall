import { computed, ref } from 'vue'

export function useProductFilter(products) {
  const keyword = ref('')
  const category = ref('all')
  const priceMax = ref(Infinity)
  const desc = ref(false)
  const query = ref('')

  function search(value = keyword.value) {
    query.value = value.trim().toLowerCase()
  }

  const filtered = computed(() => {
    return products.value.filter(
      (product) =>
        product.name.toLowerCase().includes(query.value) &&
        (category.value === 'all' || product.category === category.value),
    )
  })

  const priced = computed(() =>
    filtered.value.filter((product) => product.price <= priceMax.value),
  )

  const sorted = computed(() =>
    [...priced.value].sort((a, b) =>
      desc.value ? b.price - a.price : a.price - b.price,
    ),
  )

  const categories = computed(() => [
    'all',
    ...new Set(products.value.map((product) => product.category)),
  ])

  return {
    keyword,
    query,
    search,
    category,
    priceMax,
    desc,
    categories,
    filtered,
    priced,
    sorted,
  }
}
