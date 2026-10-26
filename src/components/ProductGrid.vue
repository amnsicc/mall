<script setup>
import ProductCard from './ProductCard.vue'
import { useViewScroll } from '@/composables/useViewScroll'
defineProps({ goods: { type: Array, required: true }, selectedId: Number })
const emit = defineEmits(['select', 'add'])
const { viewport, rememberScroll } = useViewScroll()
</script>
<template>
  <div ref="viewport" class="product-grid view-scroll" @scroll="rememberScroll">
    <ProductCard v-for="p in goods" :key="p.id" :goods="p" :class="{ selected: p.id === selectedId }"
      @click="emit('select', p.id)" @add="emit('add', $event)">
      <template #title><h2 class="product-title">{{ p.name }}</h2></template>
    </ProductCard>
  </div>
</template>
<style scoped>
.view-scroll { max-height: 720px; overflow: auto; padding: 4px; }
.product-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.product-title { font: 600 22px Georgia, 'Songti SC', serif; margin: 0 0 24px; overflow-wrap: anywhere; }
@media (max-width: 960px) { .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .product-grid { grid-template-columns: 1fr; } }
</style>
