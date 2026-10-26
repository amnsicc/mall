<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <section><RouterLink to="/products">返回商品列表</RouterLink><h1>商品 {{ route.params.id }}</h1><p>商品详情</p></section>
</template>
