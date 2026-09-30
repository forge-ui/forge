# @forge-ui-official/core

Forge 的 React 组件包源码。这里保留 package 边界，供 workspace 开发和 npm 发布使用；完整文档、组件展示和模板示例在仓库根目录的 `src/app`。

## 目录

```txt
src/components/      组件与 AppLayout
src/internal/        发布包内的拆分实现（非公共深入口）
src/styles/tokens.css 设计 token 与 Tailwind v4 theme
src/assets/          组件依赖的内联资源
src/lib/             工具函数
src/index.ts         包导出入口
```

## 组件设计原则

- 组件默认服务后台业务页面，不是一次性 demo。字号、字重、颜色、圆角、边框、阴影和间距要保持克制、紧凑、可扫描。
- Card、table、chart、rail、profile 等组件默认自适应父级 grid / flex 容器，不在组件内部写死业务宽度。
- 固定尺寸只用于明确的组件变体或 showcase 场景；生产式页面优先通过父级 `minmax`、`clamp`、grid tracks 和 truncation 控制密度。
- 组件内部优先使用 Forge token 和语义 class，不引入 Tailwind 默认色系来绕过设计系统。
- 如果业务页面需要反复覆盖同一类组件的字号、颜色、宽度或状态样式，应回到 `core` 扩组件或 token，而不是在页面里手搓局部样式。

## AppLayout 侧栏分组

`menuSections` 按数组顺序渲染任意多个侧栏分组，沿用菜单项的选中高亮、子菜单展开、收窄图标模式和移动端抽屉。空 `items` 分组会被跳过；`label` 省略或传空字符串时，只渲染菜单项，不渲染标题行。

```tsx
import { AppLayout, type AppLayoutMenuSection } from "@forge-ui-official/core";

const menuSections: AppLayoutMenuSection[] = [
  { label: "工作区", items: [{ label: "总览", href: "/workspace" }] },
  { label: "智能体", items: [{ label: "智能体列表", href: "/agents" }] },
  { label: "平台", items: [{ label: "设置", href: "/settings" }] },
];

<AppLayout menuSections={menuSections}>页面内容</AppLayout>;
```

优先级为 `sidebarSlot`、`menuSections`、旧的 `menuItems` 与 `favoriteItems`。不传 `menuSections` 时仍使用默认的「主菜单」和「常用项目」；旧的分组标题传空字符串时也不占位。

## StreamingAnswer 流式回答

默认使用 `500ms` 线性淡入，新到达的内容平滑出现，已显示内容保持稳定。纯文本模式为默认值；传 `format="markdown"` 可渲染标题、列表、链接、表格和代码块。

```tsx
import { StreamingAnswer } from "@forge-ui-official/core";

<StreamingAnswer
  key={message.id}
  text={message.text}
  status={message.status}
  format="markdown"
  onDone={() => showMessageActions(message.id)}
/>;
```

宿主负责接收流并追加 `text`，通过 `status` 告诉组件接收进度：

- `streaming`：仍在接收。网络暂停、暂时没有新文字时也保持此状态。
- `complete`：接收完毕。组件展示剩余缓冲并等待最后一批淡入结束，随后调用一次 `onDone`，显示追问。
- `stopped`：保留已经显示的内容，停止继续呈现，不调用 `onDone`。宿主同时取消网络请求。

每条新回答或重播使用新的 React `key`。不传 `status` 时，`streaming` 仍可播放预先准备好的完整文本；两者都省略则直接显示静态回答。

`animation="blur"` 可切换为模糊渐显；`duration` 调整动画毫秒数。`motion="auto"` 遵循系统减弱动态效果偏好，`motion="none"` 或 `duration={0}` 直接显示收到的文本。来源、追问及其回调保留原有用法。

Markdown 渲染通过运行时依赖 `streamdown` 提供。样式包含在 Forge 的 `styles.css`，消费方沿用现有 Forge CSS 接入即可。演示地址：`/prototype/streaming?variant=fade`；组件参数见 `/components/agent`。

## 开发

仓库工具链要求 Node.js `>=22.13.0`，并由根目录 `packageManager` 固定 pnpm 版本。

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
pnpm core:test
pnpm core:check
pnpm core:audit
pnpm core:check-package
pnpm core:check-consumer
```

## 组件审计

```bash
pnpm core:audit            # 默认范围：core/src/components + core/src/internal（发布门禁）
pnpm core:audit:showcase   # 额外审计 showcase/sample 源（仅 review warning，不影响退出码）
```

showcase 范围覆盖 `src/app/cases`、`src/app/components`；不扫描 `dist` / `node_modules`。`forge-app-design` 样例已经拆到独立插件仓维护。

语义 alias 说明：

- 已确认的 orange → fg-red 等兼容映射由精确的“文件路径 + 对象路径 + class 值”allowlist 管理，默认审计会报告批准数量但不产生 warning。
- 新增、重复或已经失效的 alias 都会成为 error；必须先人工判断语义，再有意更新 allowlist。
- `fixed-width-review` / `width-fixed-review`：组件内部显式 fixed API 的映射表（如 ChartCard 的 `fixedWidthClasses`，只在 `width="fixed"` 时生效）不告警；业务页面/样例里的 `width="fixed"`、`w-96` 等硬编码宽度仍会被提示。

## P1/P2 验证命令

```bash
pnpm core:audit
pnpm core:check
pnpm core:build
pnpm core:check-package
pnpm core:check-consumer
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
pnpm core:audit
pnpm core:check
pnpm core:build
pnpm core:check-package
pnpm core:check-consumer
```

发布检查清单：

- 确认 `core/package.json` 版本号已递增，且根目录 `package.json` /
  lockfile 没有被无关依赖变更污染。
- `pnpm core:check` 必须完成源码/测试类型检查、lint、交互回归、alias gate 与组件审计，并保持默认审计 `0 error / 0 warning`。
- `pnpm core:build` 必须通过。
- `pnpm core:check-package` 必须通过导出快照、关键拆分入口、文件集合和 raw/gzip 体积门禁。
- `pnpm core:check-consumer` 必须从真实 tarball 安装到临时 Next.js 15 / 16 项目，并通过深入口、SSR、Tailwind `@source` 和生产构建验证。
- 发布后用 canonical starter 消费 npm 包验证：
  `/Users/hesong/Desktop/forge-starter-canonical`，执行 `pnpm install`、
  `pnpm typecheck`、`pnpm build`。
- 不把 npm token 写入仓库或全局 npmrc。短期手动发布可用临时 npmrc；
  长期优先迁移到 npm trusted publishing。
