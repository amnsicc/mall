import request from './request.js'

export async function getProducts(params = {}) {
  const data = await request.get('/products', { params })
  if (!Array.isArray(data)) throw new Error('商品接口返回格式错误，请检查 /api 代理')
  return data
}
export function getProduct(id) { return request.get(`/products/${encodeURIComponent(id)}`) }
export function createProduct(payload) { return request.post('/products', payload) }
export function updateProduct(id, payload) { return request.put(`/products/${encodeURIComponent(id)}`, payload) }
export function deleteProduct(id) { return request.delete(`/products/${encodeURIComponent(id)}`) }
export async function getCategories() {
  const products = await getProducts()
  return [...new Set(products.map((p) => p.category))]
}
export async function getProductPage({ page = 1, pageSize = 5, keyword = '', category = 'all' } = {}) {
  // json-server 0.17 accepts regex in name_like; escape it so a search term stays literal.
  const literal = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const result = await request.get('/products', {
    params: { _page: page, _limit: pageSize, _sort: 'id', _order: 'desc',
      ...(literal ? { name_like: literal } : {}), ...(category !== 'all' ? { category } : {}) },
    keepHeaders: true,
  })
  return { items: result.data, total: Number(result.headers['x-total-count'] ?? result.data.length) }
}
