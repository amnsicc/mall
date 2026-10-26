<script setup>
import { useCart } from '@/composables/useCart'
const { items, cartCount, total, setQuantity } = useCart()
</script>
<template>
  <section>
    <header class="cart-heading"><h1>购物车</h1><span>{{ cartCount }} 件商品</span></header>
    <div v-if="!items.length" class="empty-cart"><p>购物车还是空的</p><RouterLink to="/products">去挑选商品</RouterLink></div>
    <ul v-else class="cart-items">
      <li v-for="item in items" :key="item.id">
        <img :src="item.img" :alt="item.name" />
        <div class="cart-info"><RouterLink :to="{ name: 'detail', params: { id: item.id } }">{{ item.name }}</RouterLink><p>¥ {{ item.price }}</p></div>
        <div class="quantity-control">
          <button :aria-label="`减少${item.name}`" @click="setQuantity(item.id, item.quantity - 1)">-</button>
          <output :aria-label="`${item.name}数量`">{{ item.quantity }}</output>
          <button :aria-label="`增加${item.name}`" :disabled="item.quantity >= item.stock" @click="setQuantity(item.id, item.quantity + 1)">+</button>
        </div>
        <strong>¥ {{ item.price * item.quantity }}</strong>
        <button class="remove-button" :aria-label="`移除${item.name}`" @click="setQuantity(item.id, 0)">移除</button>
      </li>
    </ul>
    <footer v-if="items.length" class="cart-total">合计 <strong>¥ {{ total }}</strong><RouterLink to="/products">继续选购</RouterLink></footer>
  </section>
</template>
<style scoped>
.cart-heading, .cart-total { display: flex; align-items: center; gap: 20px; justify-content: space-between; flex-wrap: wrap; }
h1 { font-size: 32px; margin: 0 0 24px; }
.cart-items { list-style: none; padding: 0; margin: 0; }
li { display: flex; align-items: center; flex-wrap: wrap; gap: 20px; padding: 20px 0; border-bottom: 1px solid #ddd; }
img { width: 90px; height: 80px; object-fit: contain; background: #f7f7f7; }
.cart-info { flex: 1; min-width: 120px; }
a { color: #252525; text-underline-offset: 4px; }
.cart-info p, strong { color: #c43d2f; }
.quantity-control { display: flex; align-items: center; gap: 12px; }
.quantity-control button { width: 32px; height: 32px; border: 1px solid #ccc; background: #fff; cursor: pointer; }
output { min-width: 20px; text-align: center; }
.remove-button { border: 0; background: none; color: #666; cursor: pointer; }
.cart-total { padding-top: 24px; }
.cart-total strong { font-size: 24px; }
.empty-cart { padding-block: 40px; border-block: 1px solid #ddd; }
</style>
