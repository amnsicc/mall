<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductFilter } from '@/composables/useProductFilter'

const cartCount = ref(0)
const products = ref([
  { id: 1, name: '机械 Key', price: 199, stock: 5, category: 'keyboard', img: '/img/keyboard.jpg' },
  { id: 2, name: '无线 Mouse', price: 99, stock: 12, category: 'mouse', img: '/img/mouse.jpg' },
  { id: 3, name: 'USB-C 扩展坞', price: 159, stock: 0, category: 'hub', img: '/img/hub.png' },
  { id: 4, name: '罗技 mouse', price: 159, stock: 20, category: 'mouse', img: '/img/mouse.jpg' },
  { id: 5, name: '微软 key', price: 159, stock: 0, category: 'keyboard', img: '/img/keyboard.jpg' },
  { id: 6, name: 'Type C Mouse', price: 159, stock: 30, category: 'mouse', img: '/img/mouse.jpg' },
])

const { keyword, category, priceMax, desc, categories, sorted } =
  useProductFilter(products)

function addToCart() {
  cartCount.value++
}
</script>

<template>
  <section>
    <header class="page-header">
      <div>
        <p class="label">WEEK 03 · PRODUCT LIST</p>
        <h1>本周精选</h1>
      </div>
      <p v-show="cartCount > 0" class="cart-count">购物车 {{ cartCount }} 件</p>
    </header>

    <div class="toolbar">
      <input v-model="keyword" type="search" placeholder="搜索商品" />

      <select v-model="category" aria-label="商品分类">
        <option v-for="item in categories" :key="item" :value="item">
          {{ item === 'all' ? '全部分类' : item }}
        </option>
      </select>

      <label class="filter-field">
        价格上限
        <input v-model.number="priceMax" type="range" min="0" max="300" step="10" />
        <span>{{ priceMax === Infinity || priceMax >= 300 ? '不限' : `¥${priceMax}` }}</span>
      </label>

      <label class="filter-field">
        <input v-model="desc" type="checkbox" />
        价格降序
      </label>
    </div>

    <p class="result-tip">共 {{ sorted.length }} 件结果</p>

    <div v-if="sorted.length > 0" class="product-grid">
      <ProductCard
        v-for="product in sorted"
        :key="product.id"
        :goods="product"
        @click="addToCart"
      />
    </div>
    <p v-if="sorted.length === 0" class="empty">没有找到相关商品</p>
  </section>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.label {
  margin: 0 0 10px;
  color: #c43d2f;
  font-size: 12px;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-family: Georgia, "Songti SC", serif;
  font-size: clamp(36px, 6vw, 58px);
}

.cart-count {
  flex: none;
  margin: 0;
  padding: 10px 14px;
  border-radius: 6px;
  background: #1d1d1b;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.toolbar > input,
.toolbar select {
  width: min(360px, 100%);
  height: 40px;
  padding: 0 12px;
  border: 1px solid #c6c1b8;
  border-radius: 6px;
  background: #fff;
  color: #1d1d1b;
  outline: none;
}

.toolbar select {
  width: auto;
}

.toolbar > input:focus,
.toolbar select:focus {
  border-color: #c43d2f;
}

.filter-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #777169;
  font-size: 13px;
  white-space: nowrap;
}

.filter-field input[type='range'] {
  width: 140px;
  accent-color: #c43d2f;
}

.filter-field input[type='checkbox'] {
  accent-color: #c43d2f;
}

.filter-field span {
  min-width: 42px;
}

.result-tip {
  margin: -12px 0 16px;
  color: #777169;
  font-size: 13px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.empty {
  padding: 80px 24px;
  border: 1px dashed #b8b2a8;
  text-align: center;
}

@media (max-width: 820px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
