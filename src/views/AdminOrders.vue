<script setup>
import { computed, ref } from 'vue'
const page = ref(1)
const pageSize = ref(5)
const orders = [
  { id: '20261109001', product: '机械 Key', amount: 199, status: '已完成', createdAt: '2026-11-09 09:10' },
  { id: '20261109002', product: '无线 Mouse', amount: 99, status: '待发货', createdAt: '2026-11-09 09:20' },
  { id: '20261109003', product: '办公 Key', amount: 149, status: '待付款', createdAt: '2026-11-09 09:30' },
  { id: '20261109004', product: '便携扩展坞', amount: 229, status: '已完成', createdAt: '2026-11-09 09:40' },
  { id: '20261109005', product: '蓝牙 Mouse', amount: 119, status: '待发货', createdAt: '2026-11-09 09:50' },
  { id: '20261109006', product: '桌面扩展坞', amount: 299, status: '待付款', createdAt: '2026-11-09 10:00' },
]
const paged = computed(() => orders.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
</script>
<template>
  <section class="admin-page"><header class="admin-heading"><h2>订单管理</h2></header>
    <el-table :data="paged" border stripe>
      <el-table-column prop="id" label="订单号" min-width="160" />
      <el-table-column prop="product" label="商品" min-width="140" />
      <el-table-column label="金额" width="100"><template #default="{ row }">¥ {{ row.amount }}</template></el-table-column>
      <el-table-column label="状态" width="110"><template #default="{ row }"><el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status }}</el-tag></template></el-table-column>
      <el-table-column prop="createdAt" label="下单时间" min-width="180" />
    </el-table>
    <div class="admin-pagination"><el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="orders.length" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next" @size-change="page = 1" /></div>
  </section>
</template>
