<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

const cartCount = ref(0)
const products = ref([
  { id: 1, name: '机械键盘', price: 199, stock: 5, img: '/img/keyboard.jpg' },
  { id: 2, name: '无线鼠标', price: 99, stock: 12, img: '/img/mouse.jpg' },
  { id: 3, name: 'USB-C 扩展坞', price: 159, stock: 0, img: '/img/hub.png' },
])

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

    <div v-if="products.length > 0" class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :goods="product"
        @click="addToCart"
      />
    </div>
    <p v-if="products.length === 0" class="empty">暂无商品，老板进货中……</p>
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
