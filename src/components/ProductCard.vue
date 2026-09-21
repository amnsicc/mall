<script setup>
import { ref } from 'vue'

defineProps({
  goods: { type: Object, required: true },
})

const isFavorite = ref(false)
const favoriteCount = ref(0)

function toggleFavorite(event) {
  event.stopPropagation()
  isFavorite.value = !isFavorite.value
  favoriteCount.value = isFavorite.value ? 1 : 0
}
</script>

<template>
  <article class="product-card">
    <div class="image-wrap">
      <img :src="goods.img" :alt="goods.name" />
      <span :class="{ on: goods.stock > 0 }">
        {{ goods.stock > 0 ? '现货' : '缺货' }}
      </span>
    </div>
    <div class="product-info">
      <p class="category">数码配件</p>
      <h2>{{ goods.name }}</h2>
      <div class="product-bottom">
        <p class="price">¥ {{ goods.price }}</p>
        <p class="stock">库存 {{ goods.stock }}</p>
      </div>
      <div class="favorite-row">
        <button
          type="button"
          :class="{ active: isFavorite }"
          :aria-pressed="isFavorite"
          @click="toggleFavorite($event)"
        >
          <span aria-hidden="true">{{ isFavorite ? '♥' : '♡' }}</span>
          {{ isFavorite ? '取消收藏' : '收藏' }}
        </button>
        <p v-if="favoriteCount > 0">收藏 {{ favoriteCount }}</p>
        <p v-if="favoriteCount === 0">暂未收藏</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid #dedbd5;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgb(45 39 32 / 12%);
}

.image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #ece9e3;
}

img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.image-wrap span {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 5px 9px;
  border-radius: 4px;
  background: #302f2c;
  color: #fff;
  font-size: 12px;
}

.image-wrap span.on {
  background: #287a4b;
}

.product-info {
  padding: 20px;
}

.category {
  margin: 0 0 8px;
  color: #8a857d;
  font-size: 12px;
}

h2 {
  margin: 0 0 24px;
  font-family: Georgia, "Songti SC", serif;
  font-size: 22px;
}

.product-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.price,
.stock {
  margin: 0;
}

.price {
  color: #c43d2f;
  font-size: 22px;
  font-weight: 800;
}

.stock {
  color: #777169;
  font-size: 13px;
}

.favorite-row {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #ebe8e2;
}

button {
  min-width: 104px;
  height: 34px;
  border: 1px solid #c6c1b8;
  border-radius: 6px;
  background: #fff;
  color: #4d4943;
  cursor: pointer;
}

button:hover,
button.active {
  border-color: #c43d2f;
  color: #c43d2f;
}

.favorite-row p {
  margin: 0;
  color: #777169;
  font-size: 12px;
}
</style>
