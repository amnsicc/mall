<script setup>
import { useCart } from '@/composables/useCart'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
const { cartCount } = useCart()
const { token } = useAuth()
const route = useRoute()
</script>
<template>
  <header class="site-header">
    <RouterLink class="brand" to="/products">微商城</RouterLink>
    <nav aria-label="主导航">
      <RouterLink to="/products">商品</RouterLink>
      <RouterLink to="/cart">购物车 {{ cartCount }}</RouterLink>
    </nav>
    <span v-if="route.path.startsWith('/admin') || route.path === '/login'" class="session-status">{{ token ? '已登录' : '未登录' }}</span>
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
.session-status { margin-left: auto; color: #666; font-size: 13px; }

.brand {
  color: #1d1d1b;
  font-size: 20px;
  font-weight: 800;
  text-decoration: none;
}

main {
  width: min(1080px, 88vw);
  margin: 0 auto;
  padding: 28px 0 64px;
  background: #fff;
}

@media (max-width: 560px) {
  .site-header {
    padding: 0 20px;
  }
  main {
    width: calc(100% - 40px);
    padding-top: 24px;
  }
}
</style>
