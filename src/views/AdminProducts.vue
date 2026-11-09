<script setup>
import { computed, ref, watch } from 'vue'
import { products } from '@/data/products'
const list = ref(products.map((p) => ({ ...p })))
const keyword = ref('')
const category = ref('all')
const page = ref(1)
const pageSize = ref(5)
const categories = computed(() => [...new Set(list.value.map((p) => p.category))])
const filtered = computed(() => list.value.filter((p) => p.name.toLowerCase().includes(keyword.value.trim().toLowerCase()) && (category.value === 'all' || p.category === category.value)))
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
watch([keyword, category, pageSize], () => { page.value = 1 })
</script>
<template>
  <section class="admin-page">
    <header class="admin-heading"><h2>商品管理</h2><span>{{ filtered.length }} 件商品</span></header>
    <div class="admin-toolbar">
      <el-input v-model="keyword" clearable placeholder="搜索商品名称" aria-label="搜索商品名称" />
      <el-select v-model="category" aria-label="商品分类"><el-option label="全部分类" value="all" /><el-option v-for="c in categories" :key="c" :label="c" :value="c" /></el-select>
    </div>
    <el-table :data="paged" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="商品名称" min-width="160" />
      <el-table-column prop="category" label="分类" width="110" />
      <el-table-column label="价格" width="100"><template #default="{ row }">¥ {{ row.price }}</template></el-table-column>
      <el-table-column prop="stock" label="库存" width="80" />
      <el-table-column label="操作" width="100"><template #default="{ row }"><el-link :href="`#/products/${row.id}`">查看</el-link></template></el-table-column>
      <template #empty><el-empty description="没有匹配的商品" /></template>
    </el-table>
    <div class="admin-pagination"><el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="filtered.length" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next" /></div>
  </section>
</template>
