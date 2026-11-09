import request from './request'

export function getProducts(params = {}) { return request.get('/products', { params }) }
export function getProduct(id) { return request.get(`/products/${encodeURIComponent(id)}`) }
export function createProduct(payload) { return request.post('/products', payload) }
export function updateProduct(id, payload) { return request.put(`/products/${encodeURIComponent(id)}`, payload) }
export function deleteProduct(id) { return request.delete(`/products/${encodeURIComponent(id)}`) }
export async function getCategories() {
  const products = await getProducts()
  return [...new Set(products.map((p) => p.category))]
}
