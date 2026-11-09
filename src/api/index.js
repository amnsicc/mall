import { products } from '../data/products.js'
const records = products.map((p) => ({ ...p }))

// The course uses local mock data this week; real HTTP requests come next week.
export const api = {
  async getProducts() { return records.map((p) => ({ ...p })) },
  async getCategories() { return [...new Set(records.map((p) => p.category))] },
  async saveProduct(form) {
    if (form.id != null) {
      const index = records.findIndex((p) => String(p.id) === String(form.id))
      if (index < 0) throw new Error('商品不存在')
      records[index] = { ...form }
    } else {
      records.unshift({ ...form, id: Math.max(...records.map((p) => Number(p.id))) + 1 })
    }
  },
  async deleteProduct(id) {
    const index = records.findIndex((p) => String(p.id) === String(id))
    if (index >= 0) records.splice(index, 1)
  },
  async getProduct(id) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const product = products.find((item) => String(item.id) === String(id))
    if (!product) throw new Error(`商品不存在：${id}`)
    return { ...product }
  },
}
