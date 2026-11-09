<script setup>
import { ref } from 'vue'
const name = ref('')
const category = ref('all')
function notify() { ElMessage.success('组件与消息接口均已加载') }
</script>
<template>
  <section class="ui-lab">
    <h1>组件实验</h1>
    <div class="controls">
      <el-button>默认按钮</el-button>
      <el-button type="primary" @click="notify">显示消息</el-button>
      <el-button type="danger" disabled>禁用按钮</el-button>
      <el-input v-model="name" placeholder="商品名称" aria-label="商品名称" style="width: 220px" />
      <el-select v-model="category" aria-label="分类" style="width: 160px"><el-option label="全部分类" value="all" /></el-select>
    </div>
    <div class="brand-panel"><el-button type="primary">局部主题</el-button></div>
  </section>
</template>
<style scoped>
.controls { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.brand-panel { --el-color-primary: #185fa5; margin-top: 24px; }
h1 { font-size: 24px; margin: 0 0 24px; }
</style>
