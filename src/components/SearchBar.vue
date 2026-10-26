<script setup>
defineProps({ categories: { type: Array, required: true } })
const keyword = defineModel('keyword', { type: String, default: '' })
const category = defineModel('category', { type: String, default: 'all' })
const priceMax = defineModel('priceMax', { type: Number, default: Infinity })
const desc = defineModel('desc', { type: Boolean, default: false })
const emit = defineEmits({
  'do-search': (value) => typeof value === 'string',
  'do-reset': () => true,
})

function doReset() {
  keyword.value = ''
  category.value = 'all'
  priceMax.value = Infinity
  desc.value = false
  emit('do-reset')
}
</script>

<template>
  <form class="toolbar" @submit.prevent="keyword && emit('do-search', keyword)">
    <input v-focus v-model.trim="keyword" type="search" aria-label="搜索商品" placeholder="输入后按回车搜索" />
    <button class="search-button" type="submit" :disabled="!keyword">搜索</button>
    <button type="button" @click="doReset">重置筛选</button>
    <select v-model="category" aria-label="商品分类">
      <option v-for="item in categories" :key="item" :value="item">{{ item === 'all' ? '全部分类' : item }}</option>
    </select>
    <label class="filter-field">价格上限
      <input :value="Number.isFinite(priceMax) ? priceMax : 300" type="range" min="0" max="300" step="10"
        @input="priceMax = Number($event.target.value) >= 300 ? Infinity : Number($event.target.value)" />
      <span>{{ priceMax === Infinity ? '不限' : `¥${priceMax}` }}</span>
    </label>
    <label class="filter-field"><input v-model="desc" type="checkbox" />价格降序</label>
  </form>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 20px; }
input[type='search'] { flex: 1 1 220px; min-width: 0; }
input[type='search'], select, button { height: 40px; padding: 0 12px; border: 1px solid #c6c1b8; border-radius: 6px; background: #fff; color: #252525; font: inherit; }
button { cursor: pointer; }
button:hover { border-color: #c43d2f; }
.search-button { background: #202020; color: #fff; border-color: #202020; }
.search-button:disabled { opacity: .45; cursor: not-allowed; }
input:focus-visible, select:focus-visible, button:focus-visible { outline: 2px solid #c43d2f; outline-offset: 2px; }
.filter-field { display: inline-flex; align-items: center; gap: 8px; color: #666; font-size: 13px; }
.filter-field input { accent-color: #c43d2f; }
.filter-field input[type='range'] { width: 120px; }
.filter-field span { min-width: 42px; }
@media (max-width: 560px) { input[type='search'] { flex-basis: 100%; } }
</style>
