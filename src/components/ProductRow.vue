<script setup>
import { useViewScroll } from '@/composables/useViewScroll'
defineProps({ goods: { type: Array, required: true }, selectedId: Number })
defineEmits(['select', 'add'])
const { viewport, rememberScroll } = useViewScroll()
</script>
<template>
  <ul ref="viewport" class="product-rows view-scroll" @scroll="rememberScroll">
    <template v-for="(item, index) in goods" :key="item.id">
      <slot name="row" :item="item" :index="index" :row="item" :loading="false">
        <li>{{ item.name }}</li>
      </slot>
    </template>
  </ul>
</template>
<style scoped>
.product-rows { display: grid; gap: 16px; max-height: 720px; overflow: auto; margin: 0; padding: 4px; list-style: none; }
:deep(.product-card) { display: grid; grid-template-columns: 180px minmax(0, 1fr); }
:deep(.image-wrap) { height: 100%; aspect-ratio: auto; min-height: 190px; }
@media (max-width: 560px) { :deep(.product-card) { grid-template-columns: 100px minmax(0, 1fr); } :deep(.product-info) { padding: 12px; } :deep(h2) { font-size: 18px; } }
</style>
