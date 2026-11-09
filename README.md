# 微商城

《Web 前端框架技术》课程项目，已完成第 09 周 Element Plus、第 10 周 Axios 与 json-server 的案例、课后扩展和实验记录，保留第 06–08 周功能。

## 功能

- 课程名片与 Vue Router 路由
- 可复用商品卡片与 Props 传值
- 商品列表、库存状态和购物车计数
- 商品收藏与取消收藏
- 关键词、分类、价格组合筛选与价格排序
- 回车搜索、商品单选高亮与本地草稿恢复
- 一键重置筛选，刷新后保留选中状态
- SearchBar 的 defineModel 双向同步与 defineEmits 载荷校验
- 卡片插槽、网格/列表动态视图、KeepAlive 与滚动恢复
- v-focus 搜索框自动聚焦
- Hash 路由、商品动态详情、props 版详情、404 兜底
- 共享购物车、数量调整、库存上限与金额汇总
- 后台嵌套布局、模拟登录、导航守卫、登录后返回原地址
- 未保存管理备注的离开确认（取消时 return false 阻止导航）
- 假期云逛街商品统计页（`/holiday`）

## 运行

```powershell
pnpm install
pnpm dev
```

另开一个终端运行 `pnpm mock`，启动端口 3001 的教学后端。为与浏览器验收记录保持一致，前端使用 `pnpm dev --host 127.0.0.1 --port 4173 --strictPort`，打开 <http://127.0.0.1:4173/#/products>。

环境要求：Node.js `^22.18.0 || >=24.12.0`、pnpm。商品数据来自 `db.json`，新增、修改和删除通过真实 HTTP 写入该文件，重启后保留。Vite 将 `/api` 代理到本机后端。

教学账号：**admin / 123456**，也支持 student / 123456。这是本机模拟认证；明文演示用户表和 mock token 不用于生产。`pnpm preview` 仅预览静态构建，完整接口演示请使用上述开发服务器；正式部署需要另配 API 反向代理或 CORS。

## 给老师演示

| 地址 | 演示内容 |
| --- | --- |
| `/#/products` | API 商品列表、加载骨架、错误与重试、搜索草稿与提交分离、组合筛选、排序、收藏、网格/列表、选中恢复 |
| `/#/products/1` | 动态详情、路由参数切换、props 版详情与 404 |
| `/#/cart` | 加购、数量、库存约束、金额；会话共享购物车 |
| `/#/login` | 必填校验、密码显示/隐藏、错误账号、登录后返回原页 |
| `/#/admin/products` | Element Plus 布局与菜单、服务端分页/筛选、共用新增编辑弹窗、校验、确认删除、落库、退出与守卫、备注离开确认 |
| `/#/admin/orders` | 课后订单表格、状态与分页（静态教学数据） |
| `/#/ui-lab` | 按需导入、按钮/输入框/选择器、消息 API、全局绿色与局部蓝色主题 |

顾客导航仅保留商品与购物车，页面背景为白色。课程名片 `/#/course`、假期清单 `/#/holiday` 与后台保留独立访问，不插入购物导航。
旧 `/list` 地址仍可访问，会转换到新的 Hash 路由。购物车在当前应用会话内共享，刷新后重置；草稿与选中状态保存在 localStorage。

## 验证

```powershell
pnpm test
pnpm build
```

Node 测试覆盖筛选和购物车，并用独立内存 HTTP 服务验证登录、Bearer、分页、CRUD、错误结构与 401，不修改正式商品数据。

```powershell
# 保持 4173 前端运行，先停止 pnpm mock，释放 3001 端口
pnpm test:e2e
```

浏览器脚本自行启动和停止测试后端，使用本机 Edge/Chrome；可通过 `BROWSER_PATH` 指定浏览器，通过 `APP_URL` 指定前端。脚本会新增再删除自己的验收商品，更新证据截图；不要同时手工编辑测试商品。结束后重新运行 `pnpm mock`。

浏览器检查包括真实 CRUD 文件落库、服务端分页、三次网络节流、停服务与重试、代理缺失、受控 CORS 和 401，以及 1440/390/319px 视口；预期故障与异常控制台错误分别记录。

实验材料：

- [第 09 周报告](reports/week09-lab.md)：实际全量/按需构建体积、表单与组件实验、问题和解决方法。
- [第 10 周报告](reports/week10-debugging.md)：代理与真实 CORS 实验、三次弱网、停后端重试、服务端分页、Pinia 预习及 token 职责。
- [浏览器检查记录](reports/browser-verification.json)、[截图目录](reports/evidence)、[构建体积原始记录](reports/bundle-measurements.json)。

`pnpm measure:bundles` 可复测当前版本体积，历史报告保留案例 1 的实际测量值。

商品图片来源见 [IMAGE_SOURCES.md](./IMAGE_SOURCES.md)。

## AI 使用说明

使用 Codex 辅助实现组件、数据流、接口和验证脚本，按教师课件及配套源码逐项检查。实验数字、接口状态和截图来自本机实际运行。
