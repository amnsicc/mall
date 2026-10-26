<script setup>
import { useCart } from '@/composables/useCart'
defineProps({ detail: Object, state: String, error: String })
defineEmits(['retry'])
const { addToCart, cartCount } = useCart()
</script>
<template>
  <section class="detail-page">
    <RouterLink class="back-link" to="/products">返回商品列表</RouterLink>
    <div v-if="state === 'loading'" class="detail-loading" role="status">
      <div class="skeleton-image" /><div><div class="skeleton-line" /><p>正在加载商品…</p></div>
    </div>
    <div v-else-if="state === 'fail'" class="detail-error" role="alert">
      <h1>商品不存在</h1><p>{{ error }}</p><button @click="$emit('retry')">重试</button>
    </div>
    <div v-else-if="detail" class="detail-content">
      <img class="detail-image" :src="detail.img" :alt="detail.name" />
      <div class="detail-info">
        <p class="detail-category">{{ detail.category }}</p><h1>{{ detail.name }}</h1>
        <p class="detail-price">¥ {{ detail.price }}</p>
        <p>{{ detail.stock ? `现货 ${detail.stock} 件` : '暂时缺货' }}</p>
        <button class="primary-button" :disabled="!detail.stock" @click="addToCart(detail)">
          {{ detail.stock ? '加入购物车' : '无货' }}
        </button>
        <RouterLink class="cart-link" to="/cart">购物车 {{ cartCount }} 件</RouterLink>
        <nav class="detail-nav" aria-label="商品切换">
          <RouterLink v-if="detail.id > 1" :to="{ name: $route.name, params: { id: detail.id - 1 }, query: $route.query }">上一件</RouterLink>
          <RouterLink v-if="detail.id < 6" :to="{ name: $route.name, params: { id: detail.id + 1 }, query: $route.query }">下一件</RouterLink>
          <RouterLink :to="{ name: $route.name === 'detail-props' ? 'detail' : 'detail-props', params: { id: detail.id } }">
            {{ $route.name === 'detail-props' ? '普通详情' : 'Props 详情' }}
          </RouterLink>
        </nav>
      </div>
    </div>
  </section>
</template>
<style scoped>
.back-link { display: inline-block; margin-bottom: 28px; }
a { color: #555; text-underline-offset: 4px; }
.detail-content, .detail-loading { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 40px; align-items: start; }
.detail-image { width: 100%; aspect-ratio: 1; object-fit: contain; background: #f7f7f7; border-radius: 6px; }
.detail-category { color: #777; font-size: 13px; margin-top: 0; }
h1 { font-size: 32px; margin: 12px 0 24px; overflow-wrap: anywhere; }
.detail-price { font-size: 28px; font-weight: 700; color: #c43d2f; }
button { min-height: 40px; padding: 0 20px; border: 1px solid #333; border-radius: 6px; background: #fff; font: inherit; cursor: pointer; }
.primary-button { background: #202020; color: #fff; }
button:disabled { opacity: .45; cursor: not-allowed; }
.cart-link { display: inline-block; margin: 16px; }
.detail-nav { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 28px; padding-top: 20px; border-top: 1px solid #ddd; }
.skeleton-image { aspect-ratio: 1; background: #eee; border-radius: 6px; }
.skeleton-line { height: 36px; background: #eee; margin: 16px 0; }
.detail-error { padding-block: 32px; border-block: 1px solid #ddd; }
@media (max-width: 640px) { .detail-content, .detail-loading { grid-template-columns: 1fr; gap: 24px; } }
</style>
