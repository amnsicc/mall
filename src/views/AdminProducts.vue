<script setup>
import { computed, nextTick, onMounted, onScopeDispose, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { api } from '@/api'
const list = ref([])
const keyword = ref('')
const category = ref('all')
const page = ref(1)
const pageSize = ref(5)
const categories = ref([])
const loading = ref(false)
const error = ref('')
const total = ref(0)
const paged = computed(() => list.value)
let version = 0
async function load() {
  const current = ++version
  loading.value = true
  error.value = ''
  try {
    const [result, options] = await Promise.all([
      api.getProductPage({ page: page.value, pageSize: pageSize.value, keyword: keyword.value, category: category.value }),
      api.getCategories(),
    ])
    if (current !== version) return
    list.value = result.items
    total.value = result.total
    categories.value = options
    const lastPage = Math.max(1, Math.ceil(total.value / pageSize.value))
    if (page.value > lastPage) { page.value = lastPage; return }
  } catch { if (current === version) error.value = '商品加载失败，请检查服务后重试。' }
  finally { if (current === version) loading.value = false }
}
let timer
watch([keyword, category], () => {
  version++
  clearTimeout(timer)
  timer = setTimeout(() => { if (page.value !== 1) page.value = 1; else load() }, 200)
})
watch(pageSize, () => { if (page.value !== 1) page.value = 1; else load() })
watch(page, load)
onScopeDispose(() => { clearTimeout(timer); version++ })
onMounted(load)

const dialog = ref(false)
const formRef = ref()
const saving = ref(false)
const form = reactive({})
const title = computed(() => form.id != null ? '编辑商品' : '新增商品')
const rules = {
  name: [{ required: true, whitespace: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ validator: (_rule, value, done) => done(Number.isFinite(value) && value > 0 ? undefined : new Error('价格必须大于 0')), trigger: 'change' }],
}
async function openForm(row) {
  for (const key of Object.keys(form)) delete form[key]
  Object.assign(form, row ? { ...row } : { name: '', category: '', price: 0, stock: 0, img: '/img/keyboard.jpg' })
  dialog.value = true
  await nextTick()
  formRef.value?.clearValidate()
}
async function submit() {
  try { await formRef.value.validate() } catch { return }
  saving.value = true
  try {
    await api.saveProduct({ ...form, name: form.name.trim() })
    dialog.value = false
    ElMessage.success('保存成功')
    await load()
  } catch { ElMessage.error('保存失败，请稍后重试') }
  finally { saving.value = false }
}
async function askDelete(row) {
  try { await ElMessageBox.confirm(`确定删除“${row.name}”？此操作不可恢复。`, '删除确认', { type: 'warning', confirmButtonText: '确定删除', cancelButtonText: '取消' }) }
  catch { return }
  try { await api.deleteProduct(row.id); ElMessage.success('删除成功'); await load() }
  catch { ElMessage.error('删除失败，请稍后重试') }
}
const note = ref('')
const savedNote = ref('')
onBeforeRouteLeave(async () => {
  if (note.value === savedNote.value || !localStorage.getItem('token')) return true
  try { await ElMessageBox.confirm('备注尚未保存，确认离开并放弃修改吗？', '离开确认', { confirmButtonText: '离开', cancelButtonText: '继续编辑' }); return true }
  catch { return false }
})
</script>
<template>
  <section class="admin-page">
    <header class="admin-heading"><h2>商品管理</h2><el-button type="primary" :icon="Plus" @click="openForm()">新增商品</el-button></header>
    <div class="admin-toolbar">
      <el-input v-model="keyword" clearable placeholder="搜索商品名称" aria-label="搜索商品名称" />
      <el-select v-model="category" aria-label="商品分类"><el-option label="全部分类" value="all" /><el-option v-for="c in categories" :key="c" :label="c" :value="c" /></el-select>
      <el-button :icon="Refresh" :loading="loading" @click="load">刷新</el-button>
    </div>
    <el-alert v-if="error" class="admin-error" :title="error" type="error" :closable="false"><el-button @click="load">重试</el-button></el-alert>
    <el-table v-loading="loading" :data="paged" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="商品名称" min-width="160" />
      <el-table-column prop="category" label="分类" width="110" />
      <el-table-column label="价格" width="100"><template #default="{ row }">¥ {{ row.price }}</template></el-table-column>
      <el-table-column prop="stock" label="库存" width="80" />
      <el-table-column label="操作" width="170"><template #default="{ row }">
        <el-button size="small" @click="openForm(row)">编辑</el-button><el-button size="small" type="danger" @click="askDelete(row)">删除</el-button>
      </template></el-table-column>
      <template #empty><el-empty description="没有匹配的商品" /></template>
    </el-table>
    <div class="admin-pagination"><el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="total" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next" /></div>
    <div class="note-form"><label for="admin-note">本次管理备注 · {{ note === savedNote ? '已保存' : '未保存' }}</label>
      <el-input id="admin-note" v-model="note" type="textarea" :rows="2" /><el-button :disabled="note === savedNote" @click="savedNote = note">保存备注</el-button>
    </div>
    <el-dialog v-model="dialog" :title="title" width="min(520px, calc(100% - 32px))" :close-on-click-modal="false" :close-on-press-escape="!saving" :show-close="!saving" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
        <el-form-item label="商品名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="分类" prop="category"><el-select v-model="form.category" filterable allow-create default-first-option><el-option v-for="c in categories" :key="c" :label="c" :value="c" /></el-select></el-form-item>
        <el-form-item label="价格" prop="price"><el-input-number v-model="form.price" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="库存" prop="stock"><el-input-number v-model="form.stock" :min="0" :precision="0" /></el-form-item>
        <el-form-item label="图片路径" prop="img"><el-input v-model="form.img" /></el-form-item>
      </el-form>
      <template #footer><el-button :disabled="saving" @click="dialog = false">取消</el-button><el-button type="primary" :loading="saving" @click="submit">保存</el-button></template>
    </el-dialog>
  </section>
</template>
