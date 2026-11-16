import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // Adopt the Week 10 token on the first upgrade, then persist the complete session.
  const token = ref(typeof localStorage === 'undefined' ? '' : localStorage.getItem('token') || '')
  const profile = ref(null)
  const isLogin = computed(() => Boolean(token.value))

  function setSession(value) {
    token.value = value
    if (!value) profile.value = null
    if (typeof localStorage === 'undefined') return
    if (value) localStorage.setItem('token', value)
    else localStorage.removeItem('token')
  }

  async function login(credentials) {
    // Lazy import keeps the API → compatibility adapter → store dependency acyclic at startup.
    const auth = await import('../api/auth.js')
    const user = await auth.login(credentials)
    profile.value = { id: user.id, nickname: user.nickname, role: user.role }
    setSession(user.token)
    return user
  }

  function logout() { setSession('') }

  return { token, profile, isLogin, setSession, login, logout }
}, { persist: { afterHydrate: ({ store }) => store.setSession(store.token) } })
