<script setup>
import { useRoute } from 'vue-router'
import ProductDetailView from '@/components/ProductDetailView.vue'
import { useProductDetail } from '@/composables/useProductDetail'
const route = useRoute()
const { detail, state, error, load } = useProductDetail(() => route.params.id)
</script>
<template>
  <ProductDetailView :detail="detail" :state="state" :error="error" @retry="load" />
</template>
