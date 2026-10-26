import { products } from '../data/products.js'

// The course uses local mock data this week; real HTTP requests come next week.
export const api = {
  async getProduct(id) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const product = products.find((item) => String(item.id) === String(id))
    if (!product) throw new Error(`商品不存在：${id}`)
    return { ...product }
  },
}
