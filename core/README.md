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

### ChatInputBar language labels

Pass your current language translations to `sourcesLabel` and `commandsLabel`. Updating these props switches both tools menu group labels and picker titles (including accessible names). Defaults are `提及` and `命令`.

```tsx
<ChatInputBar multiline sendOnEnter
  sourcesLabel={language === "zh-CN" ? "来源" : "Sources"}
  commandsLabel={language === "zh-CN" ? "指令" : "Commands"}
  sources={sources}
  commands={commands}
/>
```

### Agent component translations

All built-in agent UI text can be overridden with the current application's translations. Defaults remain compatible; update the props when language changes. User-provided titles, rows, descriptions, file counts and options should also be translated by the application.

| Component | Translation props |
| --- | --- |
| AgentTaskRows | `statusLabels` (partial running/failed/completed map) |
| AgentCodeBlock | `codeLabel`, `diffLabel`, `copyLabel`, `copiedLabel` |
| AgentFlowchart | `title`, `kindLabels` (partial trigger/action/condition map), `selectedLabel`, `nextLabel` |
| ContextCards | `allChunksLabel`, `charactersLabel` |
| CommandSearch | `placeholder`, `emptyLabel`, `groupLabel` |
| RecommendationCard | `confidenceLabel`, `confidenceLabels` (partial high/review/none map, including alternatives), `alternativesLabel`, `acceptLabel` |
| AgentDiffTable | `toggleHint`, `applyLabel`, `appliedLabel`, `formatApplyLabel(count)`, `formatAppliedLabel(count)` |
| ChatInputBar | `sourcesLabel`, `commandsLabel`, `connectedLabel`, `attachLabel`, `dictateLabel`, `modelMenuLabel`, `placeholder`, `sendLabel`, `stopLabel`, `stoppingLabel` |
| ApprovalCard | `skipLabel`, `continueLabel`, `sendLabel`, `sentLabel`, `previousQuestionLabel`, `nextQuestionLabel` |
| InsightCards | `previousInsightLabel`, `nextInsightLabel` |
| ThinkingTrace | `activeLabel`, `doneLabel`, `rows` |
| StreamingAnswer | `sourcesLabel`, `followUpsLabel` |
| ToolChips | `summary` |

```tsx
<AgentTaskRows tasks={tasks} statusLabels={{ running: "运行中", failed: "失败", completed: "已完成" }} />
<AgentDiffTable title="变更" columns={columns} rows={rows}
  toggleHint="点击变更行切换是否应用"
  formatApplyLabel={count => `应用 ${count} 项变更`}
  formatAppliedLabel={count => `已应用 ${count} 项变更`} />
```

For count-bearing translations, use the AgentDiffTable formatters to control word order and pluralization. Supply client-side formatters inside a client component.

### Application switcher

```tsx
<AppLayout
  appName={currentApp.name}
  appIcon={currentApp.avatar}
  apps={apps.map(app => ({ ...app, active: app.id === currentApp.id }))}
  onAppChange={setCurrentApp}
>
  {children}
</AppLayout>
```

The consumer controls the active application and handles navigation or data changes. Selecting an application closes the menu. The subtitle defaults to “当前应用”; override it with `appSubtitle`. Legacy `teamName`, `teamAvatar`, `teamSubtitle`, and `teams` remain supported. Team actions are hidden by default; legacy consumers can explicitly set `showTeamActions`.

### AskAi compact composer and fullscreen scrolling

`ChatInputBar` composer slots inside AskAi use a compact auto-growing input and a tools menu. Translate the compact menu accessible name with `toolsMenuLabel`; existing source, command, attachment and model labels remain supported.

Fullscreen messages should contain naturally sized content; core owns scrolling, reply follow, jump-to-latest and the floating composer clearance. Use `currentSessionId` to reset follow when switching external conversations. See `docs/ask-ai-fullscreen-layout.md` in the source repository for the complete slot contract.

### PageTitleToolbar Ask AI

All four presets and the legacy `actions` API accept optional `askAi: AskAiProps`, matching PageHeader. Ask AI appears before other actions and can be the only action. Omit it to preserve the existing layout.

```tsx
<PageTitleToolbar variant="overview" title="项目总览" breadcrumbItems={[]}
  askAi={{ onSend: async (message, request) => askAgent(message, request) }} />
```

### ChatInputBar mentions and compact input

Use `density="compact"` with `multiline`, `sendOnEnter` for Enter-to-send (Shift+Enter retains a newline), and `onAttach` for the attachment action. `sendDisabled` keeps the draft editable; `clearOnSend={false}` lets async callers clear only after success. `sources` provides mention suggestions inserted at the caret. Translate `sourcesLabel`, `emptySourcesLabel`, `inputLabel`, `attachLabel` and `sendLabel` for the current language.

### Unified composer

`ChatInputBar` uses `ComposerStatus` (`idle | running | stopping`) and `ComposerModel` (`{ id, label }`). It supports `status`, `onStop`, `stopLabel`, `stoppingLabel`, `models`, `model`, `onModelChange`, `modelMenuLabel`, `sendDisabled`, `clearOnSend`, `sendOnEnter`, and `inputLabel`.

The caller owns generation state: set `running` before awaiting a response, set `stopping` when cancellation is requested, and return to `idle` after cancellation completes. Stop remains available while editing is `disabled`; sending is blocked during `running` and `stopping`. `sendDisabled` blocks only sending. `clearOnSend={false}` lets controlled callers retain drafts until success. Model selection is controlled and does not clear the draft.

Multiline ChatInputBar uses Ctrl/Cmd+Enter unless `sendOnEnter` is enabled. Shift+Enter remains a newline. Single-line and multiline layouts share the same tools menu. PromptBar and its legacy types have been removed; migrate to ChatInputBar with `multiline sendOnEnter` when retaining the former keyboard behavior.

AskAi owns its built-in request lifecycle. Applications with external generation/model state can pass ChatInputBar through `AskAi.composer`; the slot owns its callbacks and state.

```tsx
<ChatInputBar multiline status={status} onStop={cancelGeneration}
  models={models} model={model} onModelChange={setModel}
  value={draft} onChange={setDraft} onSend={sendMessage}
  clearOnSend={false} sendOnEnter />
```

Use ChatInputBar for new integrations. It supports `sources` for caret-aware @ mentions, `commands` for slash commands, `onAttach`, `onDictate`, model selection and controlled generation. Optional `permissions`, `permission`, `onPermissionChange`, and `permissionMenuLabel` use the same controlled selection contract as models. Permission enforcement belongs to the caller. All layouts use a shared plus menu for attachments, mentions and commands. `showAttachment` controls whether the attachment action is available alongside `toggles`.

## ChatInputBar 快捷卡片

`quickActions` 配置 `id`、`label`、`kind`、`placeholder`、`icon` 和 `onClick`。`kind` 支持 image、note、event、voice、docs，分别使用动态插画、色带或折角。空会话默认展开卡片，已有消息时收起，从左侧加号的“快捷操作”手动打开。传入 `hasMessages={messages.length > 0}` 可跟随会话状态切换；未传时，首次发送后自动收起。清空会话后会重新默认展开。`defaultQuickActionsOpen={false}` 可关闭空会话的自动展开。

选择卡片会沉入输入框背后，在输入框内显示可移除的操作标签并切换提示语；不会修改已有草稿。`onSend(message, action)` 的第二个参数提供选中操作，`onQuickActionChange` 监听选择与移除。移除按钮、Escape 或空草稿时的 Backspace 恢复卡片。`quickActionsLabel`、`removeQuickActionLabel` 可自定义语言。动态效果遵循减少动态效果设置。输入框内的空白区域均可点击聚焦，按钮、菜单及文本选择保持原有行为。

卡片插画、弹簧动画和选中切换通过 Motion 驱动。语音、图片生成等业务能力由回调接入，不包含参考示例中的模拟录音或模拟转写。模型、权限、附件、提及、命令及停止生成继续使用原有接口。


## 交互动效组件

`OtpInput`、`CalendarCard`、`LiquidTabs`、`AddMember` 均从 core 根入口及同名 kebab-case 组件入口导出，沿用现有 Motion 依赖。样式随 `styles.css` 提供，自动继承 Forge 主题；系统设置“减少动态效果”时停用位移和形变。交互示例：`/cases/motion#otpinput`。

```tsx
import { OtpInput, CalendarCard, LiquidTabs, AddMember } from "@forge-ui-official/core";

<OtpInput length={6} verify={checkCodeOnServer} onSuccess={finishSignIn} />
<CalendarCard value={date} onChange={setDate} locale="zh-CN" />
<LiquidTabs tabs={notificationTabs} value={tabId} onValueChange={setTabId} onSelect={openNotification} />
<AddMember members={members} selectedIds={ids} onSelectionChange={setIds} onAdd={addMembersToProject} />
```

- **OtpInput**：2–10 位数字，支持粘贴、`one-time-code` 自动填充、`value/defaultValue`、`onChange`、`name` 和 `disabled`。填满时触发 `onComplete`；只有传入 `verify` 才会校验，Promise 待定时锁定输入，返回 `true` 才触发 `onSuccess`。失败或异常显示蛋壳裂开反馈，保留内容供编辑重试。组件内没有内置验证码。`inputLabel`、`hint`、`verifyingLabel`、`successLabel`、`errorLabel` 均可替换。
- **CalendarCard**：`value/defaultDate` 为本地日期，`onChange` 返回新的 `Date`。未传日期时在客户端读取今天，SSR 不猜测用户时区。日期按钮支持方向键、Page Up/Down 翻月、Home/End 跳至月初/月末；月份选择器可用 Escape 关闭。导航范围为 1900–2100，月底翻月自动截到有效日期，支持闰年。`locale` 控制日期语言，`labels` 控制按钮文案；没有 `value` 时自行保存选择。
- **LiquidTabs**：`tabs` 为 `{ id, label, items, disabled? }[]`，其中 `items` 为 `{ id, title, subtitle?, time?, icon?, disabled? }[]`。`value/defaultValue`、`onValueChange` 控制活动标签；`onSelect(item, tabId)` 返回所选行及标签 ID。默认显示三个标签，其余从菜单切换；`visibleCount`、`rows`、`corner` 可调整。方向键、Home/End 切换标签，菜单支持上下方向键和 Escape。`label/moreLabel/emptyLabel` 可本地化，不内置业务通知。
- **AddMember**：`members` 为 `{ id, name, role?, avatar?, status?, disabled? }[]`，身份以稳定 `id` 为准。`selectedIds/defaultSelectedIds` 与 `onSelectionChange` 支持跨页、跨搜索多选；`open/defaultOpen/onOpenChange` 控制展开状态。`onAdd(ids)` 可返回 Promise，等待成功才显示成功，拒绝时保留选择供重试；`clearOnAdd={false}` 可在成功后保留选择。`rows/search/disabled` 控制显示和可用状态，所有功能文案可通过 `labels` 替换。只调用业务回调，不自行发送邀请。

四者均接受 `className` 和 `motion="auto" | "none"`，与其他交互动效组件使用同一动效偏好；`none` 关闭动效但保留当前交互状态。受控模式下，业务方需在对应变更回调里更新传入值。


`ChatInputBar.sources` 的对象可指定 `kind: "agent" | "skill" | "tool"`，选中后显示可移除的标签；智能体可通过 `avatarSrc` 设置头像，在候选列表和标签中显示头像与名字。`icon` 可自定义图标，`placeholder` 可定制选中后的提示语。未指定 kind 的对象继续插入普通 @ 文本。

`selectedSources/defaultSelectedSources/onSourcesChange` 控制已选对象，按 id 去重。`onSend(message, action, context)` 的第三个参数通过 `context.sources` 提供完整对象，业务方可据此调用智能体或工具。`clearOnSend` 控制发送后是否清空标签；空草稿按 Backspace 移除最后一个标签，移除按钮文案可通过 `removeSourceLabel` 设置。
