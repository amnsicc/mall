import test from 'node:test'
import assert from 'node:assert/strict'
import jsonServer from 'json-server'

test('HTTP API contract: auth, Bearer header, server pagination, PUT fields, delete, errors and 401', async () => {
  const memory = new Map()
  globalThis.localStorage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) }
  const app = jsonServer.create()
  const products = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}`, category: i % 2 ? 'mouse' : 'keyboard', price: 100 + i, stock: 5, img: '/img/mouse.jpg' }))
  let bearer
  app.use((req, res, next) => {
    bearer = req.headers.authorization
    if (req.path === '/unauthorized') return res.status(401).json({ message: 'expired' })
    if (req.path === '/products' && req.query.invalidShape) return res.type('html').send('<html>Vite fallback</html>')
    next()
  })
  app.use(jsonServer.bodyParser)
  app.use(jsonServer.router({ products, users: [{ id: 1, username: 'admin', password: '123456', nickname: '管理员', role: 'admin' }] }))
  const server = await new Promise((resolve) => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)) })
  const { default: request } = await import('../src/api/request.js')
  const { api } = await import('../src/api/index.js')
  const original = request.defaults.baseURL
  request.defaults.baseURL = `http://127.0.0.1:${server.address().port}`
  try {
    await assert.rejects(api.login({ username: 'admin', password: 'wrong' }), /用户名或密码错误/)
    assert.equal(localStorage.getItem('token'), null)
    assert.equal((await api.login({ username: 'admin', password: '123456' })).token, 'mock-token-1')
    const result = await api.getProductPage({ page: 2, pageSize: 5 })
    await assert.rejects(api.getProducts({ invalidShape: 1 }), /商品接口返回格式错误/)
    assert.equal(result.total, 12)
    assert.equal(result.items.length, 5)
    assert.equal(bearer, 'Bearer mock-token-1')
    assert.equal((await api.getProductPage({ keyword: '[', pageSize: 5 })).total, 0)
    const created = await api.saveProduct({ name: 'Created', price: 20, category: 'hub', stock: 7, img: '/img/hub.png' })
    assert.ok(created.id)
    const updated = await api.saveProduct({ ...created, price: 30 })
    assert.equal(updated.stock, 7)
    assert.equal(updated.img, '/img/hub.png')
    assert.equal((await api.getProduct(created.id)).price, 30)
    await api.deleteProduct(created.id)
    await assert.rejects(api.getProduct(created.id), (err) => err.response.status === 404)
    await assert.rejects(request.get('/unauthorized'), (err) => err.response.status === 401)
    assert.equal(localStorage.getItem('token'), null)
  } finally {
    request.defaults.baseURL = original
    await new Promise((resolve) => server.close(resolve))
  }
})
