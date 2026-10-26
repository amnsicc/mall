<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const username = ref('student')
function login() {
  if (!username.value.trim()) return
  localStorage.setItem('token', 'course-demo-token')
  const target = route.query.from
  // Accept only an internal target; the query is editable in the browser address bar.
  const destination = typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') && !target.startsWith('/login')
    ? target : '/admin/products'
  router.replace(destination)
}
</script>
<template>
  <section class="login-page">
    <p class="eyebrow">微商城 · 后台</p><h1>登录</h1>
    <form @submit.prevent="login">
      <label for="username">演示账号</label>
      <input id="username" v-model.trim="username" autocomplete="username" required />
      <button type="submit" :disabled="!username">模拟登录</button>
    </form>
    <RouterLink to="/products">返回商城</RouterLink>
  </section>
</template>
<style scoped>
.login-page { max-width: 360px; margin: 32px auto; }
.eyebrow { color: #777; font-size: 13px; }
h1 { margin: 12px 0 32px; font-size: 32px; }
form { display: grid; gap: 12px; margin-bottom: 24px; }
label { font-size: 14px; }
input, button { min-height: 44px; border: 1px solid #bbb; padding: 0 12px; border-radius: 6px; font: inherit; }
button { background: #202020; color: #fff; cursor: pointer; }
button:disabled { opacity: .45; }
a { color: #666; }
</style>
