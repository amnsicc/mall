import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({ baseURL: '/api', timeout: 8000 })
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
request.interceptors.response.use((response) => {
  // Pagination needs headers as well as data; normal callers still receive only data.
  if (response.config.keepHeaders) return { data: response.data, headers: response.headers }
  return response.data
}, (error) => {
  if (axios.isCancel(error)) return Promise.reject(error)
  ElMessage.error(error.response ? `请求失败（HTTP ${error.response.status}）` : '网络异常，请确认模拟后端已启动')
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    const from = location.hash.slice(1) || '/products'
    if (!from.startsWith('/login')) location.hash = '/login?from=' + encodeURIComponent(from)
  }
  return Promise.reject(error)
})
export default request
