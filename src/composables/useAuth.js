import { ref } from 'vue'

const token = ref(typeof localStorage === 'undefined' ? '' : localStorage.getItem('token') || '')
export function setSession(value) {
  token.value = value
  if (value) localStorage.setItem('token', value)
  else localStorage.removeItem('token')
}
export function useAuth() { return { token, setSession } }
