import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createServer as createHttpServer } from 'node:http'
import { createServer as createViteServer, loadConfigFromFile } from 'vite'
import { performance } from 'node:perf_hooks'

const origin = process.env.APP_URL || 'http://127.0.0.1:4173'
const output = 'reports/evidence'
await mkdir(output, { recursive: true })
let executablePath = process.env.BROWSER_PATH
if (!executablePath) {
  for (const candidate of ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe']) {
    try { await access(candidate); executablePath = candidate; break } catch {}
  }
}
const browser = await chromium.launch({ executablePath, headless: true })
const results = []
const diagnostics = { browser: await browser.version(), weakNetworkMs: [], expectedFailures: [] }
const unexpected = []
let mockProcess
let noProxy
let corsServer
let createdId
let expectedNetwork = false
const name = `验收商品-${Date.now()}`
function check(value, label) { assert.ok(value, label); results.push(label); console.log(`PASS ${label}`) }
async function waitBackend() {
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:3001/products')).ok) return } catch {} await new Promise((r) => setTimeout(r, 100)) }
  throw new Error('mock backend did not start')
}
async function startMock() {
  mockProcess = spawn(process.execPath, ['node_modules/json-server/lib/cli/bin.js', '--watch', 'db.json', '--host', '127.0.0.1', '--port', '3001'], { cwd: process.cwd(), stdio: 'ignore', windowsHide: true })
  await waitBackend()
}
async function stopMock() {
  if (!mockProcess) return
  const exited = new Promise((resolve) => mockProcess.once('exit', resolve))
  mockProcess.kill()
  await exited
  mockProcess = undefined
}
try {
  try { await fetch('http://127.0.0.1:3001/products'); throw new Error('Port 3001 is occupied. Stop the course mock server before running e2e; this test owns its backend.') }
  catch (error) { if (!String(error).includes('fetch failed')) throw error }
  await startMock()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', (e) => unexpected.push(e.message))
  page.on('console', (m) => {
    if (!['warning', 'error'].includes(m.type())) return
    if (expectedNetwork) diagnostics.expectedFailures.push(m.text())
    else unexpected.push(m.text())
  })
  const goto = async (path) => { await page.goto('about:blank'); await page.goto(`${origin}/#${path}`, { waitUntil: 'networkidle' }) }
  const screenshot = (label) => page.screenshot({ path: `${output}/${label}.png`, fullPage: true })
  const waitCards = () => page.waitForFunction(() => document.querySelectorAll('.product-card').length === 15 && !document.querySelector('.catalog-loading'))
  await goto('/products')
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await waitCards()
  check((await page.getByRole('navigation', { name: '主导航' }).getByRole('link').allTextContents()).join('|') === '商品|购物车 0', 'customer navigation stays separate from coursework/admin')
  check(!((await page.locator('body').innerText()).includes('WEEK 08')), 'no course week banner')
  check(await page.locator('.product-card img').evaluateAll((imgs) => imgs.every((i) => i.complete && i.naturalWidth > 0)), 'all API product images render')
  check(await page.getByRole('searchbox').evaluate((el) => document.activeElement === el), 'v-focus preserved')
  await page.getByRole('searchbox').fill('mouse')
  check(await page.locator('.product-card').count() === 15, 'draft does not filter before submission')
  await page.getByRole('searchbox').press('Enter')
  check(await page.locator('.product-card').count() === 6, 'keyword search filters server data')
  await page.getByLabel('商品分类', { exact: true }).selectOption('keyboard')
  check(await page.locator('.empty').isVisible(), 'combined filters show empty state')
  await page.getByRole('button', { name: '重置筛选' }).click()
  await page.locator('input[type=checkbox]').check()
  const prices = await page.locator('.product-card .price').allTextContents()
  check(prices[0].includes('299'), 'price sorting preserved')
  await page.getByRole('button', { name: '重置筛选' }).click()
  await page.locator('.product-grid').evaluate((el) => { el.scrollTop = 180 })
  await page.waitForTimeout(80)
  await page.getByRole('button', { name: '列表', exact: true }).click()
  check(await page.locator('.product-rows li').count() === 15, 'scoped slot renders row view')
  await page.getByRole('button', { name: '网格', exact: true }).click()
  await page.waitForTimeout(80)
  check(await page.locator('.product-grid').evaluate((el) => el.scrollTop) >= 170, 'KeepAlive restores scroll')
  await page.locator('.product-grid').evaluate((el) => { el.scrollTop = 0 })
  await page.locator('.add-button:not([disabled])').first().click()
  check(page.url().endsWith('/products'), 'add-to-cart does not navigate')
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '购物车 1', exact: true }).waitFor()
  check(true, 'cart accepts API products')
  await page.getByRole('searchbox').fill('mouse')
  await page.getByRole('searchbox').press('Enter')
  await page.locator('.product-card').first().click({ position: { x: 12, y: 12 } })
  await page.getByRole('heading', { name: '无线 Mouse', exact: true }).waitFor()
  await page.getByRole('link', { name: '下一件', exact: true }).click()
  await page.getByRole('heading', { name: 'USB-C 扩展坞', exact: true }).waitFor()
  check(true, 'detail updates when route ID changes')
  await page.reload({ waitUntil: 'networkidle' })
  check(await page.getByRole('heading', { name: 'USB-C 扩展坞', exact: true }).isVisible(), 'detail survives refresh')
  await goto('/products')
  check(await page.getByRole('searchbox').inputValue() === 'mouse' && await page.locator('.product-card.selected').count() === 1, 'async draft and highlight restoration')
  await page.getByRole('button', { name: '重置筛选' }).click()
  await goto('/props/1')
  check(await page.getByRole('heading', { name: '机械 Key', exact: true }).isVisible(), 'props detail supported')
  expectedNetwork = true
  await goto('/products/999')
  await page.getByRole('heading', { name: '商品不存在', exact: true }).waitFor()
  check(true, 'HTTP 404 detail becomes error state')
  expectedNetwork = false

  await goto('/admin/products')
  await page.getByRole('heading', { name: '登录', exact: true }).waitFor()
  check(page.url().includes('from='), 'guard redirects with original target')
  await page.getByRole('button', { name: '登录', exact: true }).click()
  await page.getByText('请输入用户名', { exact: true }).waitFor()
  await page.getByText('请输入密码', { exact: true }).waitFor()
  check(true, 'login requires username and password')
  await page.getByLabel('用户名', { exact: true }).fill('admin')
  await page.getByLabel('密码', { exact: true }).fill('000000')
  await page.getByRole('button', { name: '登录', exact: true }).click()
  await page.getByText('用户名或密码错误', { exact: true }).waitFor()
  check(await page.evaluate(() => localStorage.getItem('token')) === null, 'wrong password never stores token')
  await screenshot('login-wrong-password')
  await page.getByLabel('密码', { exact: true }).fill('123456')
  await page.getByRole('button', { name: '登录', exact: true }).click()
  await page.getByRole('heading', { name: '商品管理', exact: true }).waitFor()
  await page.waitForFunction(() => document.querySelectorAll('.el-table__body tbody tr').length === 5)
  check(page.url().endsWith('/admin/products'), 'login returns to protected page')
  check(await page.locator('.session-status').textContent() === '已登录', 'header reacts to login')
  let requestHeaders
  page.on('request', (r) => { if (r.url().includes('/api/products')) requestHeaders = r.headers() })
  await page.getByRole('button', { name: '刷新', exact: true }).click()
  await page.waitForTimeout(500)
  check(requestHeaders?.authorization === 'Bearer mock-token-1', 'Authorization Bearer auto-injected')
  diagnostics.authorization = requestHeaders.authorization
  check(await page.locator('.el-table__body tbody tr').count() === 5, 'server pagination renders five rows')
  await page.getByRole('button', { name: '下一页' }).click()
  await page.waitForResponse((r) => r.url().includes('_page=2') && r.status() === 200)
  check(true, 'pagination fetches page 2 from server')
  await page.getByPlaceholder('搜索商品名称').fill('不存在')
  await page.getByText('没有匹配的商品', { exact: true }).waitFor()
  check(true, 'filter resets page and shows empty state')
  await page.getByPlaceholder('搜索商品名称').fill('')
  await page.waitForFunction(() => document.querySelectorAll('.el-table__body tbody tr').length === 5)
  await page.getByRole('button', { name: '新增商品', exact: true }).click()
  let dialog = page.getByRole('dialog', { name: '新增商品' })
  await dialog.getByRole('button', { name: '保存', exact: true }).click()
  await dialog.getByText('请输入商品名称', { exact: true }).waitFor()
  await dialog.getByText('价格必须大于 0', { exact: true }).waitFor()
  check(true, 'product validation blocks empty name and zero price')
  await dialog.getByLabel('商品名称', { exact: true }).fill(name)
  await dialog.getByLabel('分类', { exact: true }).click()
  await page.getByRole('option', { name: 'hub', exact: true }).click()
  await dialog.getByLabel('价格', { exact: true }).fill('88')
  await dialog.getByLabel('库存', { exact: true }).fill('7')
  await dialog.getByLabel('图片路径', { exact: true }).fill('/img/hub.png')
  const post = page.waitForResponse((r) => r.url().endsWith('/api/products') && r.request().method() === 'POST')
  await dialog.getByRole('button', { name: '保存', exact: true }).click()
  const posted = await post
  const created = await posted.json()
  createdId = created.id
  check(posted.status() === 201, 'create uses POST and returns 201')
  let db = JSON.parse(await readFile('db.json', 'utf8'))
  check(db.products.some((p) => p.id === createdId && p.stock === 7), 'create persisted in db.json')
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByPlaceholder('搜索商品名称').fill(name)
  await page.getByRole('cell', { name, exact: true }).waitFor()
  const targetRow = page.getByRole('row').filter({ has: page.getByRole('cell', { name, exact: true }) })
  await targetRow.getByRole('button', { name: '编辑', exact: true }).click()
  dialog = page.getByRole('dialog', { name: '编辑商品' })
  await dialog.getByLabel('价格', { exact: true }).fill('99')
  await dialog.getByRole('button', { name: '保存', exact: true }).click()
  await dialog.waitFor({ state: 'hidden' })
  db = JSON.parse(await readFile('db.json', 'utf8'))
  const edited = db.products.find((p) => p.id === createdId)
  check(edited.price === 99 && edited.stock === 7 && edited.img === '/img/hub.png', 'PUT preserves hidden fields and persists price')
  await page.getByRole('button', { name: '新增商品', exact: true }).click()
  dialog = page.getByRole('dialog', { name: '新增商品' })
  check(await dialog.getByLabel('商品名称', { exact: true }).inputValue() === '' && await dialog.getByLabel('库存', { exact: true }).inputValue() === '0', 'new dialog clears previous edited values')
  check(await dialog.getByText('请输入商品名称', { exact: true }).count() === 0, 'old validation errors cleared')
  await dialog.getByRole('button', { name: '取消', exact: true }).click()
  await targetRow.getByRole('button', { name: '删除', exact: true }).click()
  await page.getByRole('button', { name: '取消', exact: true }).click()
  check(JSON.parse(await readFile('db.json', 'utf8')).products.some((p) => p.id === createdId), 'delete cancellation keeps record')
  await targetRow.getByRole('button', { name: '删除', exact: true }).click()
  await page.getByRole('button', { name: '确定删除', exact: true }).click()
  await page.getByText('没有匹配的商品', { exact: true }).waitFor()
  check(!JSON.parse(await readFile('db.json', 'utf8')).products.some((p) => p.id === createdId), 'DELETE persists to db.json')
  createdId = undefined

  await goto('/admin/orders')
  check(await page.locator('.el-table__body tbody tr').count() === 5, 'orders homework table and pagination')
  await page.getByRole('button', { name: '下一页' }).click()
  check(await page.locator('.el-table__body tbody tr').count() === 1, 'orders second page')
  await page.getByRole('button', { name: '退出登录', exact: true }).click()
  await page.getByRole('heading', { name: '登录', exact: true }).waitFor()
  check(await page.evaluate(() => localStorage.getItem('token')) === null, 'logout clears credentials')
  await goto('/admin/products')
  check(page.url().includes('/login'), 'guard blocks direct refresh after logout')

  // Real Chromium network throttling, not a fabricated setTimeout in application code.
  await goto('/products')
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: /^购物车/ }).click()
  await page.getByRole('heading', { name: '购物车', exact: true }).waitFor()
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 800, downloadThroughput: 64000, uploadThroughput: 64000, connectionType: 'cellular4g' })
  for (let i = 0; i < 3; i++) {
    const start = performance.now()
    const response = page.waitForResponse((r) => r.url().endsWith('/api/products') && r.status() === 200)
    await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '商品', exact: true }).click()
    await page.getByRole('status').waitFor()
    check(true, `weak network loading visible run ${i + 1}`)
    if (i === 0) await screenshot('weak-network-loading')
    const r = await response
    await r.finished()
    const timing = r.request().timing()
    diagnostics.weakNetworkMs.push({ run: i + 1, status: r.status(), requestMs: Math.round(timing.responseEnd), pageToResponseMs: Math.round(performance.now() - start) })
    await waitCards()
    await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: /^购物车/ }).click()
    await page.getByRole('heading', { name: '购物车', exact: true }).waitFor()
  }
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: false })
  await cdp.detach()
  expectedNetwork = true
  await stopMock()
  await goto('/products')
  await page.locator('.catalog-error').waitFor()
  await screenshot('backend-off-error')
  check(true, 'stopping real mock server shows error, not blank page')
  await startMock()
  await page.getByRole('button', { name: '重试', exact: true }).click()
  await waitCards()
  check(true, 'restart backend and retry without page refresh')
  expectedNetwork = false

  // Observe the actual missing-proxy result instead of incorrectly labelling every failure CORS.
  const loaded = await loadConfigFromFile({ command: 'serve', mode: 'development' })
  noProxy = await createViteServer({ ...loaded.config, configFile: false, server: { host: '127.0.0.1', port: 4174, strictPort: true } })
  await noProxy.listen()
  const probe = await browser.newPage()
  const probeErrors = []
  probe.on('console', (m) => { if (m.type() === 'error') probeErrors.push(m.text()) })
  await probe.goto('http://127.0.0.1:4174/#/products')
  await probe.locator('.catalog-error').waitFor()
  const badResponse = await probe.request.get('http://127.0.0.1:4174/api/products')
  diagnostics.noProxy = { status: badResponse.status(), contentType: badResponse.headers()['content-type'], errors: probeErrors }
  await probe.screenshot({ path: `${output}/proxy-disabled.png`, fullPage: true })
  check(true, 'missing-proxy failure captured on separate dev server')
  await probe.close()
  await noProxy.close(); noProxy = undefined
  corsServer = createHttpServer((_req, res) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ products: [] })) })
  await new Promise((resolve) => corsServer.listen(3002, '127.0.0.1', resolve))
  expectedNetwork = true
  const cors = await page.evaluate(async () => { try { await fetch('http://127.0.0.1:3002/products'); return 'unexpected success' } catch (e) { return e.message } })
  diagnostics.cors = { origin, target: 'http://127.0.0.1:3002/products', result: cors, reason: 'controlled server intentionally omits Access-Control-Allow-Origin' }
  check(cors !== 'unexpected success', 'actual CORS rejection verified against server without CORS headers')
  const evidencePage = await browser.newPage({ viewport: { width: 1200, height: 800 } })
  await evidencePage.setContent('<html lang="zh-CN"><meta charset="utf-8"><body style="font:16px monospace;padding:32px;background:white"><h1>CORS 实验实际记录</h1><pre style="white-space:pre-wrap" id="evidence"></pre></body></html>')
  await evidencePage.locator('#evidence').evaluate((el, data) => { el.textContent = JSON.stringify(data, null, 2) }, { ...diagnostics.cors, console: diagnostics.expectedFailures.filter((line) => line.includes('CORS') || line.includes('3002')) })
  await evidencePage.screenshot({ path: `${output}/cors-record.png`, fullPage: true })
  await evidencePage.close()
  await goto('/products')
  await screenshot('proxy-restored')
  expectedNetwork = false
  await new Promise((resolve) => corsServer.close(resolve)); corsServer = undefined

  await page.evaluate(() => localStorage.setItem('token', 'expired-demo-token'))
  await page.route('**/api/products*', (route) => route.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"expired"}' }))
  expectedNetwork = true
  await goto('/admin/products')
  await page.getByRole('heading', { name: '登录', exact: true }).waitFor()
  check(await page.evaluate(() => localStorage.getItem('token')) === null, 'HTTP 401 clears token and redirects')
  await page.unroute('**/api/products*')
  expectedNetwork = false

  for (const width of [1440, 390, 319]) {
    await page.setViewportSize({ width, height: 900 })
    for (const [label, path] of [['products', '/products'], ['detail', '/products/1'], ['login', '/login'], ['cart', '/cart']]) {
      await goto(path)
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label} no horizontal overflow ${width}px`)
      if (width !== 319) await screenshot(`${label}-${width}`)
    }
    await page.evaluate(() => localStorage.setItem('token', 'mock-token-1'))
    await goto('/admin/products')
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `admin no horizontal overflow ${width}px`)
    if (width !== 319) await screenshot(`admin-${width}`)
  }
  await goto('/ui-lab')
  check(await page.locator('.controls .el-button--primary').evaluate((el) => getComputedStyle(el).backgroundColor) === 'rgb(47, 158, 110)', 'global theme survives lazy-loaded Element Plus defaults')
  check(await page.locator('.brand-panel .el-button').evaluate((el) => getComputedStyle(el).backgroundColor) === 'rgb(24, 95, 165)', 'local theme overrides global theme')
  check(unexpected.length === 0, `no unexpected console errors or warnings: ${unexpected.join(' | ')}`)
  diagnostics.checks = results
  diagnostics.count = results.length
  diagnostics.unexpected = unexpected
  await writeFile('reports/browser-verification.json', JSON.stringify(diagnostics, null, 2) + '\n')
  console.log(`COMPLETE ${results.length} checks; reports/evidence`)
} finally {
  if (createdId) { try { await fetch(`http://127.0.0.1:3001/products/${createdId}`, { method: 'DELETE' }) } catch {} }
  await noProxy?.close()
  if (corsServer) await new Promise((resolve) => corsServer.close(resolve))
  await browser.close()
  await stopMock()
}
