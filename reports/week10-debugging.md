# 第 10 周排错记录与实验说明

日期：2026-11-09。

## 一页排错记录：代理缺失后返回 HTML

**症状**：在独立测试开发服务器上移除 `/api` 代理后，商品页无法显示数据，控制台曾出现 `products.value.map is not a function`。

**第一步，复现**：保留正常运行的开发服务，用另一端口启动同一项目但不配置代理。访问商品页，确认问题可重复，不在未记录条件下反复修改正式配置。

**第二步，看 Network**：检查 `/api/products` 的请求地址、状态码、Content-Type 和响应内容。不能把成功状态码直接当作业务成功：Vite 的页面回退可能返回 HTML，实际需要的是 JSON 商品数组。正常代理应该把请求转发到 `http://127.0.0.1:3001/products`。

**第三步，看 Console 并修复**：跟踪到 `useProductFilter` 的 `.map()`，确认数据形状错误。恢复代理，并在 `api.getProducts()` 中检查 `Array.isArray(data)`；不符合接口契约就抛错，页面 catch 显示可读错误与重试入口，不再把 HTML 放进响应式商品数组。

**验证**：正常代理返回 15 条商品；移除代理时进入错误态；恢复代理后正常加载。额外的 HTTP 测试专门返回 HTML，确认 API 拒绝错误结构。具体响应状态与原始控制台记录见 [browser-verification.json](./browser-verification.json)。

## 跨域证据的准确解释

删除 Vite 代理与浏览器 CORS 拒绝是两个问题。json-server 默认中间件可能允许跨域，不能为了报告而声称直连它必然报 CORS。

本次分别做了：

1. 在 4174 端口的临时 Vite 服务移除代理，记录实际 `/api/products` 响应和错误页面，随后关闭临时服务。
2. 使用 3002 端口的临时受控 HTTP 服务，明确不发送 `Access-Control-Allow-Origin`；从 4173 页面发起 fetch，浏览器实际拒绝跨源读取。保存错误日志和对应实验记录图。
3. 回到正常 4173 代理服务验证数据恢复。正式配置没有遗留故障，3002/4174 测试服务会退出。

证据：[无代理页面](./evidence/proxy-disabled.png)、[CORS 实际记录](./evidence/cors-record.png)、[代理恢复](./evidence/proxy-restored.png)。CORS 图是实际日志的报告视图，不伪装成商城原生报错截图。

## 弱网与断服务实验

使用本机 Edge 的 Chromium DevTools Protocol 实施真实网络节流：800ms 延迟、下载与上传各 64,000 bytes/s、禁用缓存。该档位为自定义设置，不冒称浏览器 Slow 4G 预设。

先加载应用模块，再通过购物车返回商品页触发真实 `/api/products` 请求。这样可以观察数据请求的骨架屏，不把 Vite 开发脚本下载时间混作接口耗时。连续三次测量商品请求的 `responseEnd`，具体数字保存在 [browser-verification.json](./browser-verification.json)。结束后撤销限速和禁用缓存。

| 次数 | 接口耗时（ms） | 页面操作至响应完成（ms） | HTTP 状态 |
| --- | ---: | ---: | ---: |
| 1 | 836 | 856 | 200 |
| 2 | 835 | 852 | 200 |
| 3 | 833 | 849 | 200 |

真正停止测试自己启动的 json-server，商品页进入错误态；重启服务后点击重试恢复，不需要刷新整页。证据：[弱网加载](./evidence/weak-network-loading.png)、[停止后端](./evidence/backend-off-error.png)。

## 数据层与服务端分页

- 只在 `src/api/request.js` 创建一个 Axios 实例，统一 `/api`、8 秒超时、Bearer、响应处理和错误继续 reject。
- 后台分页使用 `_page/_limit`、名称匹配和分类参数，读取 `X-Total-Count`。普通调用返回数据本身，分页调用显式保留响应头。
- 使用固定的 `json-server@0.17.4`，与上述分页协议一致。不要直接升级到 beta 版本后仍照抄旧分页参数。
- POST 返回 201，新增数据写入 db.json；PUT 完整提交名称、分类、价格、库存、图片；DELETE 后刷新仍不在。
- `ProductDetail.vue` 和 `ProductDetailProps.vue` 的调用接口保持原样。后台页面的额外变化来自课后服务端分页要求，不能把它称作「字节完全未改」。
- 浏览器中的 401 采用受控响应注入验证，因为课堂 json-server 本身不提供真实鉴权；HTTP 集成测试也验证 401 继续 reject 并清除 token。

## Pinia 预习与 localStorage 三处职责

当前资料目录尚未提供第 11 周讲义，预习采用 [Pinia 官方 Getting Started](https://pinia.vuejs.org/getting-started)。Pinia 的 store 用于跨组件共享状态；state 保存数据、getters 派生值、actions 执行业务动作。后续适合将用户会话和购物车迁入 store，不应把所有局部弹窗开关都迁进去。

当前 token 的三处核心职责为：

| 位置 | 职责 |
| --- | --- |
| `src/composables/useAuth.js` | 统一读写 token，提供响应式会话状态；登录和退出通过这里执行 |
| `src/api/request.js` | 请求前读取 token 并设置 Authorization，401 时调用统一清理 |
| `src/router/index.js` | 每次导航读取 token，拦截受保护页面 |

此外，`useProductDraft.js` 存储搜索草稿与选中 ID；后台离开守卫也会读取 token。以上「三处」是认证链路的三项职责，不代表项目只有三条 localStorage 语句。

## AI 使用与教学边界

使用 Codex 辅助实现与排错，以实际请求、文件落库、自动测试和截图验证。开发用户 `admin / 123456`、mock token 和明文用户表只用于本机教学；没有宣称接入真实认证服务。Vite 代理仅用于开发，部署时需要服务端反向代理或正确的 CORS 配置。
