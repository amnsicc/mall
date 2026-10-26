<script setup>
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import { products as catalog } from '@/data/products'
import { useProductFilter } from '@/composables/useProductFilter'
import { useProductDraft } from '@/composables/useProductDraft'

const cartCount = ref(0)
const products = ref(catalog)
const { keyword, query, search, resetFilters, category, priceMax, desc, categories, sorted } = useProductFilter(products)
const { selectedId, toggleSelect } = useProductDraft(keyword, search, products)
function addToCart() { cartCount.value++ }
</script>

<template>
  <section>
    <header class="page-header">
      <div><p class="label">WEEK 07 · PRODUCT LIST</p><h1>本周精选</h1></div>
      <p class="cart-count">购物车 {{ cartCount }} 件</p>
    </header>
    <SearchBar v-model:keyword="keyword" v-model:category="category" v-model:price-max="priceMax"
      v-model:desc="desc" :categories="categories" @search="search" @reset="resetFilters" />
    <p class="result-tip">输入框“{{ keyword || '（空）' }}” · 已提交“{{ query || '（空）' }}” · 共 {{ sorted.length }} 件</p>
    <div class="product-grid">
      <ProductCard v-for="product in sorted" :key="product.id" :goods="product"
        :class="{ selected: product.id === selectedId }" @click="toggleSelect(product.id)" @add="addToCart" />
    </div>
    <p v-if="sorted.length === 0" class="empty">没有找到相关商品</p>
  </section>
</template>

<style scoped src="@/assets/product-list.css"></style>
