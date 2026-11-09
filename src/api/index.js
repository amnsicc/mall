import * as product from './product'

export const api = {
  ...product,
  saveProduct(form) {
    const { id, ...payload } = form
    // PUT replaces the record: always preserve stock and image, even if the form hides them.
    const complete = { name: payload.name, category: payload.category, price: payload.price,
      stock: payload.stock ?? 0, img: payload.img || '/img/keyboard.jpg' }
    return id == null ? product.createProduct(complete) : product.updateProduct(id, complete)
  },
}
