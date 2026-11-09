import request from './request.js'
import { setSession } from '../composables/useAuth.js'

// Development only: json-server exposes demo users, not a production authentication endpoint.
export async function login({ username, password }) {
  const users = await request.get('/users', { params: { username, password } })
  if (!users.length) throw new Error('用户名或密码错误')
  const { id, nickname, role } = users[0]
  const token = `mock-token-${id}`
  setSession(token)
  return { id, nickname, role, token }
}
export function logout() { setSession('') }
