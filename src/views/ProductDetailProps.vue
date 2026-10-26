<script setup>
import ProductDetailView from '@/components/ProductDetailView.vue'
import { useProductDetail } from '@/composables/useProductDetail'
const props = defineProps({ id: { type: String, required: true } })
const { detail, state, error, load } = useProductDetail(() => props.id)
</script>
<template>
  <ProductDetailView :detail="detail" :state="state" :error="error" @retry="load" />
</template>
