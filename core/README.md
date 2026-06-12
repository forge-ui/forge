# @forge-ui-official/core

Forge 的 React 组件包源码。这里保留 package 边界，供 workspace 开发和 npm 发布使用；完整文档、组件展示和模板示例在仓库根目录的 `src/app`。

## 目录

```txt
src/components/      组件与 AppLayout
src/styles/tokens.css 设计 token 与 Tailwind v4 theme
src/assets/          组件依赖的内联资源
src/lib/             工具函数
src/index.ts         包导出入口
```

## 开发

从仓库根目录执行：

```bash
pnpm install
pnpm dev
pnpm build
```

组件包单独命令：

```bash
pnpm core:build
pnpm core:typecheck
pnpm core:audit
```

## 组件审计

```bash
pnpm core:audit            # 默认范围：core/src/components（发布门禁，error 时退出码非 0）
pnpm core:audit:showcase   # 额外审计 showcase/sample 源（仅 review warning，不影响退出码）
```

showcase 范围覆盖 `src/app/cases`、`src/app/components`、`plugins/forge-app-design/samples`；不扫描 `dist` / `node_modules`。

warning 分类说明：

- `semantic-alias-review`（orange → fg-red）：Figma 源把该样式命名为 orange，但其色值等于 Forge Red 500，且 tokens.css 没有 fg-orange 色阶，保留 alias 以维持与 Figma 的视觉一致。保持为 warning（而非 error）是为了让新增的 orange → fg-* 映射在 review 时被人工确认，同时不让已确认的历史 alias 卡住发布门禁。
- `fixed-width-review` / `width-fixed-review`：组件内部显式 fixed API 的映射表（如 ChartCard 的 `fixedWidthClasses`，只在 `width="fixed"` 时生效）不告警；业务页面/样例里的 `width="fixed"`、`w-96` 等硬编码宽度仍会被提示。

## P1/P2 验证命令

```bash
pnpm core:audit
pnpm core:typecheck
pnpm core:build
pnpm typecheck
```

## 手动 smoke 验证

核心 card / layout 改动后，用以下路由做手动截图 smoke（验证卡片自适应父级宽度、grid/布局行为）：

- `/components/card`
- `/components/chart`
- `/components/map`
- `/cases/table`
- `/templates/dashboard-builder/light-sidebar`
- `/templates/dashboards/crm`

## 发布

`package.json` 只发布 `dist/`：

```json
{
  "files": ["dist"]
}
```

发布前先从仓库根目录执行：

```bash
pnpm core:build
```
