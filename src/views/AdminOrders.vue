<template>
  <section><h2>订单管理</h2><div class="empty-orders"><p>暂无订单</p><RouterLink to="/admin/products">查看商品管理</RouterLink></div></section>
</template>
<style scoped>
h2 { font-size: 24px; margin: 0 0 24px; }
.empty-orders { padding: 40px 0; border-block: 1px solid #ddd; color: #777; }
a { color: #333; text-underline-offset: 4px; }
</style>
