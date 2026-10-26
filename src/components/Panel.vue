<template>
  <section class="panel">
    <header><slot name="title">商品</slot></header>
    <slot />
    <footer v-if="$slots.footer"><slot name="footer" /></footer>
  </section>
</template>
<style scoped>
.panel { margin-top: 24px; }
header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
footer { padding-top: 16px; color: #666; font-size: 13px; }
</style>
