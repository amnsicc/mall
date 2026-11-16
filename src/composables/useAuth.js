import { storeToRefs } from 'pinia'
import { pinia } from '../stores/index.js'
import { useUserStore } from '../stores/user.js'

export function setSession(value) {
  useUserStore(pinia).setSession(value)
}
export function useAuth() {
  const user = useUserStore(pinia)
  return { ...storeToRefs(user), setSession }
}
