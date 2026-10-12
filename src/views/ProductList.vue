<script setup>
import { computed, ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

const cartCount = ref(0)
const keyword = ref('')
const products = ref([
  { id: 1, name: '机械键盘', price: 199, stock: 5, img: '/img/keyboard.jpg' },
  { id: 2, name: '无线鼠标', price: 99, stock: 12, img: '/img/mouse.jpg' },
  { id: 3, name: 'USB-C 扩展坞', price: 159, stock: 0, img: '/img/hub.png' },
])

const filteredProducts = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(normalizedKeyword),
  )
})

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
      <span v-show="keyword">共 {{ filteredProducts.length }} 件结果</span>
    </div>

    <div v-if="filteredProducts.length > 0" class="product-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :goods="product"
        @click="addToCart"
      />
    </div>
    <p v-if="filteredProducts.length === 0" class="empty">没有找到相关商品</p>
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
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.toolbar input {
  width: min(360px, 100%);
  height: 40px;
  padding: 0 12px;
  border: 1px solid #c6c1b8;
  border-radius: 6px;
  background: #fff;
  color: #1d1d1b;
  outline: none;
}

.toolbar input:focus {
  border-color: #c43d2f;
}

.toolbar span {
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
