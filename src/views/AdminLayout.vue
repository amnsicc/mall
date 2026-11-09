<script setup>
import { useRoute, useRouter } from 'vue-router'
import { Goods, Tickets } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/assets/admin.css'
import { api } from '@/api'
const route = useRoute()
const router = useRouter()
function logout() {
  api.logout()
  router.replace({ name: 'login', query: { from: route.fullPath } })
}
</script>
<template>
  <el-config-provider :locale="zhCn">
    <el-container class="admin-layout">
      <el-aside class="admin-sidebar" width="180px">
        <h1>商城后台</h1>
        <el-menu router :default-active="route.path" aria-label="后台导航">
          <el-menu-item index="/admin/products"><el-icon><Goods /></el-icon><span>商品管理</span></el-menu-item>
          <el-menu-item index="/admin/orders"><el-icon><Tickets /></el-icon><span>订单管理</span></el-menu-item>
        </el-menu>
        <el-button class="logout" @click="logout">退出登录</el-button>
      </el-aside>
      <el-container class="admin-body">
        <el-header class="admin-header">管理中心</el-header>
        <el-main><RouterView /></el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>
<style scoped>
.admin-layout { gap: 24px; background: #fff; }
.admin-sidebar { border-right: 1px solid #ddd; }
h1 { font-size: 20px; margin: 12px 16px 24px; }
.el-menu { border-right: 0; }
.logout { margin: 24px 16px; }
.admin-body { min-width: 0; }
.admin-header { display: flex; align-items: center; border-bottom: 1px solid #ddd; height: 48px; padding: 0 0 16px; font-size: 14px; color: #666; }
.el-main { padding: 24px 0 0; overflow: visible; }
@media (max-width: 640px) { .admin-layout { flex-direction: column; } .admin-sidebar { width: 100%; border-right: 0; border-bottom: 1px solid #ddd; } .el-menu { display: flex; flex-wrap: wrap; } h1 { margin: 0 0 12px; } .logout { margin: 12px 0; } }
</style>
