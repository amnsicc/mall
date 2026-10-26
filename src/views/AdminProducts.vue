<script setup>
import { computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { products } from '@/data/products'
const note = ref('')
const savedNote = ref('')
const dirty = computed(() => note.value !== savedNote.value)
function save() { savedNote.value = note.value }
onBeforeRouteLeave(() => {
  if (!dirty.value || !localStorage.getItem('token')) return true
  return window.confirm('备注尚未保存，确认离开并放弃修改吗？')
})
</script>
<template>
  <section>
    <h2>商品管理</h2>
    <div class="table-scroll"><table>
      <thead><tr><th>商品</th><th>分类</th><th>价格</th><th>库存</th></tr></thead>
      <tbody><tr v-for="p in products" :key="p.id">
        <td><RouterLink :to="{ name: 'detail', params: { id: p.id } }">{{ p.name }}</RouterLink></td>
        <td>{{ p.category }}</td><td>¥ {{ p.price }}</td><td>{{ p.stock }}</td>
      </tr></tbody>
    </table></div>
    <form class="note-form" @submit.prevent="save">
      <label for="admin-note">本次管理备注 <span>{{ dirty ? '未保存' : '已保存' }}</span></label>
      <textarea id="admin-note" v-model="note" rows="3" />
      <button :disabled="!dirty">保存备注</button>
    </form>
  </section>
</template>
<style scoped>
h2 { font-size: 24px; margin: 0 0 24px; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; }
th { background: #f7f7f7; color: #666; font-weight: 500; }
td, th { padding: 14px 10px; border-bottom: 1px solid #ddd; white-space: nowrap; }
a { color: #333; text-underline-offset: 4px; }
.note-form { display: grid; justify-items: start; gap: 12px; margin-top: 32px; }
label { width: 100%; font-size: 14px; }
label span { margin-left: 12px; color: #777; font-size: 12px; }
textarea { width: 100%; resize: vertical; font: inherit; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 8px 16px; background: #202020; color: #fff; border: 0; border-radius: 4px; font: inherit; cursor: pointer; }
button:disabled { opacity: .45; cursor: not-allowed; }
</style>
