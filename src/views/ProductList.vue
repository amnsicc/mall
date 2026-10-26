<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import Panel from '@/components/Panel.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import ProductRow from '@/components/ProductRow.vue'
import { products as catalog } from '@/data/products'
import { useProductFilter } from '@/composables/useProductFilter'
import { useProductDraft } from '@/composables/useProductDraft'
import { useCart } from '@/composables/useCart'

const { cartCount, addToCart } = useCart()
const router = useRouter()
const view = ref('grid')
const views = { grid: ProductGrid, row: ProductRow }
const products = ref(catalog)
const { keyword, query, search, resetFilters, category, priceMax, desc, categories, sorted } = useProductFilter(products)
const { selectedId, toggleSelect } = useProductDraft(keyword, search, products)
function onCardClick(id) {
  toggleSelect(id)
  router.push(`/products/${id}`)
}
</script>

<template>
  <section>
    <SearchBar v-model:keyword="keyword" v-model:category="category" v-model:price-max="priceMax"
      v-model:desc="desc" :categories="categories" @do-search="search" @do-reset="resetFilters" />
    <p class="result-tip">{{ query ? `“${query}” · ` : '' }}共 {{ sorted.length }} 件商品</p>
    <Panel>
      <template #title>
        <h2 class="section-title">商品清单</h2>
        <div class="view-modes" role="group" aria-label="商品视图">
          <button :aria-pressed="view === 'grid'" @click="view = 'grid'">网格</button>
          <button :aria-pressed="view === 'row'" @click="view = 'row'">列表</button>
        </div>
      </template>
      <KeepAlive>
        <component :is="views[view]" :goods="sorted" :selected-id="selectedId" @select="onCardClick" @add="addToCart">
          <template #row="{ item, index }">
            <li :aria-label="`第 ${index + 1} 件商品`">
              <ProductCard :goods="item" :class="{ selected: item.id === selectedId }"
                @click="onCardClick(item.id)" @add="addToCart" />
            </li>
          </template>
        </component>
      </KeepAlive>
      <template #footer>
        <div class="list-footer">
          <span>当前分类：{{ category === 'all' ? '全部' : category }} · 购物车 {{ cartCount }} 件</span>
          <RouterLink :to="{ name: 'detail', params: { id: 1 } }">机械 Key</RouterLink>
          <button type="button" @click="router.push('/props/1')">Props 详情</button>
        </div>
      </template>
    </Panel>
    <p v-if="sorted.length === 0" class="empty">没有找到相关商品</p>
  </section>
</template>

<style scoped src="@/assets/product-list.css"></style>
