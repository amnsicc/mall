import { build } from 'vite'
import { gzipSync } from 'node:zlib'
import { mkdir, writeFile } from 'node:fs/promises'

const measurements = []
for (const mode of ['full', 'on-demand']) {
  const result = await build({
    build: { write: false },
    plugins: mode === 'full' ? [{
      name: 'lab-full-import', enforce: 'pre',
      transform(code, id) {
        if (!id.replaceAll('\\', '/').endsWith('/src/main.js')) return
        return `import ElementPlus from 'element-plus';\nimport 'element-plus/dist/index.css';\n${code.replace("app.mount('#app')", "app.use(ElementPlus)\napp.mount('#app')")}`
      },
    }] : [],
  })
  const output = (Array.isArray(result) ? result : [result]).flatMap((item) => item.output)
  const metric = { mode, jsBytes: 0, cssBytes: 0, jsGzipBytes: 0, cssGzipBytes: 0 }
  for (const item of output) {
    const kind = item.fileName.endsWith('.js') ? 'js' : item.fileName.endsWith('.css') ? 'css' : null
    if (!kind) continue
    const content = item.type === 'chunk' ? item.code : item.source
    metric[`${kind}Bytes`] += Buffer.byteLength(content)
    metric[`${kind}GzipBytes`] += gzipSync(content).length
  }
  measurements.push(metric)
}
await mkdir('reports', { recursive: true })
await writeFile('reports/bundle-measurements.json', JSON.stringify({ date: new Date().toISOString(), scope: 'all JS/CSS chunks, excluding images; identical source, full adds global registration and full CSS', measurements }, null, 2) + '\n')
console.table(measurements)
