<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
function logout() {
  localStorage.removeItem('token')
  router.replace({ name: 'login', query: { from: route.fullPath } })
}
</script>
<template>
  <section class="admin-layout">
    <aside class="admin-sidebar">
      <h1>商城后台</h1>
      <nav aria-label="后台导航">
        <RouterLink to="/admin/products">商品管理</RouterLink>
        <RouterLink to="/admin/orders">订单管理</RouterLink>
      </nav>
      <button type="button" @click="logout">退出登录</button>
    </aside>
    <div class="admin-content"><RouterView /></div>
  </section>
</template>
<style scoped>
.admin-layout { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 32px; }
.admin-sidebar { border-right: 1px solid #ddd; padding-right: 24px; }
h1 { font-size: 20px; margin: 0 0 24px; }
nav { display: grid; gap: 8px; }
a { padding: 10px 12px; border-radius: 4px; color: #555; text-decoration: none; font-size: 14px; }
a.router-link-active { color: #c43d2f; background: #fff1ed; }
button { margin-top: 28px; padding: 8px 12px; background: #fff; border: 1px solid #ccc; border-radius: 4px; font: inherit; cursor: pointer; }
.admin-content { min-width: 0; }
@media (max-width: 640px) { .admin-layout { grid-template-columns: 1fr; gap: 24px; } .admin-sidebar { border-right: 0; border-bottom: 1px solid #ddd; padding: 0 0 20px; } nav { display: flex; flex-wrap: wrap; } button { margin-top: 12px; } }
</style>
