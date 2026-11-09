<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const form = reactive({ username: '', password: '' })
const formRef = ref()
const busy = ref(false)
const error = ref('')
const rules = {
  username: [{ required: true, whitespace: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
async function login() {
  try { await formRef.value.validate() } catch { return }
  busy.value = true
  error.value = ''
  try {
    localStorage.setItem('token', 'course-demo-token')
    const target = route.query.from
    const destination = typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') && !target.startsWith('/login') ? target : '/admin/products'
    await router.replace(destination)
  } catch { error.value = '登录失败，请重试' }
  finally { busy.value = false }
}
</script>
<template>
  <section class="login-page">
    <p>微商城 · 后台</p><h1>登录</h1>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="login">
      <el-form-item label="用户名" prop="username"><el-input v-model.trim="form.username" autocomplete="username" /></el-form-item>
      <el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" show-password autocomplete="current-password" /></el-form-item>
      <el-button type="primary" native-type="submit" :loading="busy">登录</el-button>
    </el-form>
    <RouterLink to="/products">返回商城</RouterLink>
  </section>
</template>
<style scoped>
.login-page { max-width: 360px; margin: 32px auto; }
.login-page > p { color: #777; font-size: 13px; }
h1 { margin: 12px 0 28px; font-size: 32px; }
.el-form { margin: 24px 0; }
.el-button { width: 100%; }
a { color: #666; }
</style>
