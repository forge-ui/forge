# Dashboards Templates — 设计文档

## 目标

在 forge 模板站新增一组 SaaS 控制台样板 `templates/dashboards/*`，对照 Protask UI Kit 的 10 张截图做高保真还原（不是可证伪的 100% 像素，但视觉一致），全部用 `@forge-ui/react` 现成组件 + 极少量 div 装饰拼装，不抽业务专用组件、不做交互后端。

## 范围

10 张截图来自 `~/Downloads/Protask UI Kit/`，覆盖 5 个业务 × 2-3 个版本：

| Page slug | 业务 | 侧栏配色 | Profile 位置 | 关键组件 |
|-----------|------|----------|--------------|----------|
| project-1 | Project | 紫底栏 | topbar | bubble-chart, image-stat-card 大头像, event-card 甘特, line-chart-stat-card, data-table, contact-item |
| project-2 | Project | 浅底栏 | topbar | progress-stat-card, smooth-line-chart, pie-chart, project-card, contact-item, full-calendar |
| analytics | Analytics | 浅底栏 | topbar | 4× progress-stat-card, bar-chart, progress-card, map-card, chart-list-item, data-table ×2 |
| crm | CRM | 紫底栏 | topbar | highlight-card, line-chart-stat-card ×2, bar-chart, meter-chart, data-table, activity-card |
| ecommerce-1 | E-Commerce | 蓝底栏 | sidebar | highlight-card, line-chart-stat-card, image-stat-card 头像组, bar-upside-down-chart, 蓝 product 卡, map-card, data-table |
| ecommerce-2 | E-Commerce | 浅底栏 | sidebar | progress-stat-card, line/bar mini, smooth-line-chart, bubble-chart, map-card, product-row, category-row, data-table |
| ecommerce-3 | E-Commerce | 浅底栏 | sidebar | 4× 渐变 stat-card, half-donut-chart Target, bar-chart, pie-chart, product-row, data-table |
| finance-1 | Finance | 紫底栏 | topbar | balance-card, line-chart-stat-card ×2, credit-card, bar-upside-down-chart, progress-card, list-item, donut-chart |
| finance-2 | Finance | 浅底栏 | sidebar | credit-card stack, line-chart-stat-card ×2, bar-upside-down-chart, data-table, dashed-half-donut-chart |
| finance-3 | Finance | 蓝底栏 | sidebar | balance-card, credit-card list, progress-card, currency-converter, bar-upside-down-chart, data-table, contact-item, multilayer-donut-chart |

**不做**：内层 CRUD 详情页、变体切换 UI、Playwright 视觉回归、多断点适配（仅 desktop 浅色）、暗色主题、token 对照表逐页登记。

## 路由结构（方案 X：扁平）

```
src/app/templates/(dashboards)/dashboards/
├── _shared/
│   ├── shell-violet.tsx     # 紫底栏 + topbar profile
│   ├── shell-light.tsx      # 浅底栏 + topbar profile
│   ├── shell-light-sb.tsx   # 浅底栏 + sidebar profile
│   ├── shell-blue.tsx       # 蓝底栏 + sidebar profile
│   ├── mock-data.ts         # 共享 mock：projects, leads, transactions, cards, charts, regions
│   └── index.ts
├── project-1/page.tsx
├── project-2/page.tsx
├── analytics/page.tsx
├── crm/page.tsx
├── ecommerce-1/page.tsx
├── ecommerce-2/page.tsx
├── ecommerce-3/page.tsx
├── finance-1/page.tsx
├── finance-2/page.tsx
└── finance-3/page.tsx
```

`(dashboards)` 路由组只为命名分组，不放 `layout.tsx`（10 页 shell 不同）。每页 import 对应的 `Shell*` 组件包裹自身内容。

## Shell variant 抽象

每个 shell 是一个 `(props: { menuItems, favoriteItems?, profile, teamName, teamAvatar?, teamMemberCount?, children })` 的 client component，内部 `<AppLayout>` 写死该变体的 `mode/accent/profilePosition/notifications/messages` 等样式参数。

页面只关心：选哪个 shell、传什么 menu、传什么内容。改导航行为只动 4 个 shell 文件。

## Mock 数据策略

- 头像：`https://i.pravatar.cc/150?u=<key>`（截图 demo 容忍外链）
- 产品/分类图：`https://placehold.co/...`
- 国旗：emoji 或 placehold
- 数字、文案、状态色直接对照截图抄，能复用就放 `mock-data.ts`

## 工作流

1. spec 文档落盘 + commit
2. 建目录骨架，写 4 个 shell variant + mock-data 骨架
3. **PoC: finance-3** —— 最复杂页（多层 donut + currency-converter + 双向柱 + 卡片列表 + 表格 + 蓝侧栏 sidebar-profile，几乎踩遍所有难点）
4. PoC 浏览器对照截图复核 → 列 capability gap 清单
5. 按难度递减铺剩余 9 页：project-1 → ecommerce-1 → project-2 → analytics → crm → ecommerce-2 → ecommerce-3 → finance-1 → finance-2
6. 每页做完起 dev server `pnpm dev --port 3456 --hostname 0.0.0.0` 浏览器自检
7. 全部完成后更新 `templates/page.tsx` 的 examples 入口卡，链接 `/templates/dashboards/project-2` 作为代表

## 验收

- 每页能在浏览器打开、视觉对照截图无明显偏差（结构、配色、间距、字号大体一致）
- 所有非平凡内容均用 `@forge-ui/react` 现成组件 + 极少 div 装饰
- 不引入新业务组件、不引入新依赖

## 风险与应对

- **图表细节差异**（曲线/grid/tooltip）：已知 forge-ui chart 不一定支持原图全部细节。PoC 跑完先列差距，能用 props 调齐则调，调不齐就近似处理。
- **复杂卡片**（Team of the Month、Top Product 蓝卡、Finance 渐变卡）：承认要 image-stat-card / 现成卡 + 一层 div 装饰组合，不强行套单组件。
- **甘特活动条**（project-1 Daily Activity）：用 `event-card` + grid 列定位拼，时间刻度用 div 列头。
