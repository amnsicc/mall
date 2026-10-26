<script setup>
import { useCart } from '@/composables/useCart'
const { cartCount } = useCart()
</script>
<template>
  <header class="site-header">
    <RouterLink class="brand" to="/products">微商城</RouterLink>
    <nav aria-label="主导航">
      <RouterLink to="/products">商品</RouterLink>
      <RouterLink to="/cart">购物车 {{ cartCount }}</RouterLink>
      <RouterLink to="/holiday">假期清单</RouterLink>
      <RouterLink to="/course">课程名片</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView v-slot="{ Component }">
      <KeepAlive include="ProductList"><component :is="Component" /></KeepAlive>
    </RouterView>
  </main>
</template>

<style scoped>
.site-header {
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 6vw;
  gap: 24px;
  flex-wrap: wrap;
  border-bottom: 1px solid #dedbd5;
  background: #fff;
}

nav { display: flex; flex-wrap: wrap; gap: 16px; padding-block: 12px; }
nav a { color: #666; text-decoration: none; font-size: 14px; }
nav a.router-link-active { color: #c43d2f; }

.brand {
  color: #1d1d1b;
  font-size: 20px;
  font-weight: 800;
  text-decoration: none;
}

main {
  width: min(1080px, 88vw);
  margin: 0 auto;
  padding: 56px 0 80px;
}

@media (max-width: 560px) {
  .site-header {
    padding: 0 20px;
  }
  main {
    width: calc(100% - 40px);
    padding-top: 36px;
  }
}
</style>
