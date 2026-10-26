# @forge-ui-official/core

Forge 的 React 组件包。面向后台业务页，基于 React 19 和 Tailwind v4。文档、组件展示和模板在 [forgeui.org](https://forgeui.org)，仓库说明见[根目录 README](https://github.com/forge-ui/forge)。

## 安装

```bash
pnpm add @forge-ui-official/core
pnpm add -D tailwindcss @tailwindcss/postcss
```

Peer dependencies：React 19、React DOM 19、Next.js 15 或以上、Tailwind CSS v4、`@solar-icons/react` ^2.3.2。

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";

/* app/globals.css 用第一行，src/app/globals.css 用第二行，只留一行 */
@source "../node_modules/@forge-ui-official/core/dist";
@source "../../node_modules/@forge-ui-official/core/dist";
```

```tsx
import { Button } from "@forge-ui-official/core";
```

## 目录

```txt
src/components/        组件与 AppLayout
src/internal/          发布包内的拆分实现，不是公共深入口
src/styles/tokens.css  设计 token 与 Tailwind v4 theme
src/assets/            组件依赖的内联资源
src/lib/               工具函数
src/index.ts           包导出入口
```

`package.json` 只发布 `dist/`，另外带上 `LICENSE` 和 `THIRD_PARTY_NOTICES.md`。

## 设计原则

- 组件默认服务后台业务页。字号、字重、颜色、圆角、边框、阴影和间距保持紧凑，方便扫读。
- Card、table、chart、rail、profile 默认跟着父级 grid 或 flex 走，不在组件内部写死业务宽度。
- 固定尺寸只用于明确的组件变体或 showcase。生产页面用父级 `minmax`、`clamp`、grid tracks 和 truncation 控制密度。
- 组件内部用 Forge token 和语义 class，不用 Tailwind 默认色绕过设计系统。
- 同一类字号、颜色、宽度或状态如果要在业务页反复覆盖，回到 `core` 扩组件或 token，不在页面里写局部样式。

## AppLayout

### 侧栏分组

`menuSections` 按数组顺序渲染任意多个侧栏分组，沿用菜单项的选中高亮、子菜单展开、收窄图标模式和移动端抽屉。空 `items` 的分组会跳过。`label` 省略或传空字符串时只渲染菜单项，不渲染标题行。

```tsx
import { AppLayout, type AppLayoutMenuSection } from "@forge-ui-official/core";

const menuSections: AppLayoutMenuSection[] = [
  { label: "工作区", items: [{ label: "总览", href: "/workspace" }] },
  { label: "智能体", items: [{ label: "智能体列表", href: "/agents" }] },
  { label: "平台", items: [{ label: "设置", href: "/settings" }] },
];

<AppLayout menuSections={menuSections}>页面内容</AppLayout>;
```

优先级是 `sidebarSlot`、`menuSections`，然后才是旧的 `menuItems` 和 `favoriteItems`。不传 `menuSections` 时仍使用默认的「主菜单」和「常用项目」。旧的分组标题传空字符串时也不占位。

侧栏动效内置在 `AppLayout`：宽度、分组和团队区域一起收展，菜单行高度不变，文字延迟淡入，角标和底部头像保持可见。顶部折叠按钮沿用 Solar 菜单图标，收展时是同一个按钮，键盘焦点保留，当前页背景在菜单之间移动。`motion="auto" | "none"`。关闭动效，或系统开启减少动态效果时，立即切换。不另加侧栏组件，原有宽度、路由和移动抽屉 API 不变。本地预览：`/prototype/sidebar-motion`。

个人菜单和导航名称跟随 `language`。单独使用 `ProfileDropdown`、`AppSwitcherDropdown` 或 `TeamSwitcherDropdown` 时可以传 `locale="en"`，默认中文。

### 应用切换

调用方控制当前应用，并处理跳转或数据切换。选中一个应用后菜单关闭。副标题默认是「当前应用」，用 `appSubtitle` 覆盖。旧的 `teamName`、`teamAvatar`、`teamSubtitle`、`teams` 仍然可用。团队操作默认隐藏，旧调用方可以显式设置 `showTeamActions`。

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

## 智能体界面

### StreamingAnswer

默认 `500ms` 线性淡入。新到的内容平滑出现，已经显示的内容保持稳定。默认是纯文本。`format="markdown"` 渲染标题、列表、链接、表格和代码块。Markdown 由运行时依赖 `streamdown` 提供，样式在 `styles.css` 里。

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

宿主负责收流并追加 `text`，用 `status` 表示进度：

- `streaming`：仍在接收。网络暂停、暂时没有新文字时也保持这个状态。
- `complete`：接收完毕。组件展示剩余缓冲，等最后一批淡入结束，然后调用一次 `onDone`。
- `stopped`：保留已经显示的内容，停止继续呈现，不调用 `onDone`。宿主同时取消网络请求。

每条新回答或重播使用新的 React `key`。不传 `status` 时，`streaming` 仍可播放预先准备好的完整文本。两者都省略则直接显示静态回答。

`animation="blur"` 改为模糊渐显。`duration` 是动画毫秒数。`motion="auto"` 遵循系统减少动态效果，`motion="none"` 或 `duration={0}` 直接显示收到的文本。来源、追问和对应回调保持原有用法。演示：`/prototype/streaming?variant=fade`。参数见 `/components/agent`。

### ChatInputBar

新接入用 `ChatInputBar`。它支持 `sources`（光标处的 @ 提及）、`commands`（斜杠命令）、`onAttach`、`onDictate`、模型选择和受控的生成状态。可选的 `permissions`、`permission`、`onPermissionChange`、`permissionMenuLabel` 与模型使用同一套受控选择。权限是否生效由调用方决定。所有布局共用一个加号菜单，放附件、提及和命令。`showAttachment` 控制附件动作是否和 `toggles` 一起出现。

`PromptBar` 及其旧类型已删除。要保留原来的键盘行为，改用带 `multiline` 和 `sendOnEnter` 的 `ChatInputBar`。

#### 状态和模型

`ChatInputBar` 使用 `ComposerStatus`（`idle | running | stopping`）和 `ComposerModel`（`{ id, label }`）。相关 props：`status`、`onStop`、`stopLabel`、`stoppingLabel`、`models`、`model`、`onModelChange`、`modelMenuLabel`、`sendDisabled`、`clearOnSend`、`sendOnEnter`、`inputLabel`。

调用方持有生成状态：等待响应前设为 `running`，请求取消时设为 `stopping`，取消完成后回到 `idle`。`disabled` 时仍可以停止。`running` 和 `stopping` 期间不能发送。`sendDisabled` 只阻止发送。`clearOnSend={false}` 时，受控调用方可以一直留着草稿，直到成功再清。模型选择是受控的，不会清空草稿。

多行时默认 Ctrl/Cmd+Enter 发送，除非打开 `sendOnEnter`。Shift+Enter 仍是换行。单行和多行共用同一个工具菜单。

```tsx
<ChatInputBar multiline status={status} onStop={cancelGeneration}
  models={models} model={model} onModelChange={setModel}
  value={draft} onChange={setDraft} onSend={sendMessage}
  clearOnSend={false} sendOnEnter />
```

#### 紧凑输入和提及

`density="compact"` 配合 `multiline`、`sendOnEnter`（Enter 发送，Shift+Enter 换行）和 `onAttach`。`sendDisabled` 时草稿仍可编辑。`sources` 提供插入到光标处的提及建议。按当前语言翻译 `sourcesLabel`、`emptySourcesLabel`、`inputLabel`、`attachLabel`、`sendLabel`。

把当前语言的文案传给 `sourcesLabel` 和 `commandsLabel`。更新这两个 props 会同时切换工具菜单分组标题和选择器标题（含无障碍名称）。默认是「提及」和「命令」。

```tsx
<ChatInputBar multiline sendOnEnter
  sourcesLabel={language === "zh-CN" ? "来源" : "Sources"}
  commandsLabel={language === "zh-CN" ? "指令" : "Commands"}
  sources={sources}
  commands={commands}
/>
```

`sources` 可以指定 `kind: "agent" | "skill" | "tool"`。选中后显示可移除的标签。智能体用 `avatarSrc` 设置头像，候选列表和标签里都会显示头像和名字。`icon` 自定义图标，`placeholder` 定制选中后的提示语。没有 `kind` 的对象仍插入普通 @ 文本。

`selectedSources`、`defaultSelectedSources`、`onSourcesChange` 控制已选对象，按 id 去重。`onSend(message, action, context)` 的第三个参数用 `context.sources` 给出完整对象。`clearOnSend` 控制发送后是否清空标签。空草稿按 Backspace 移除最后一个标签。移除按钮文案用 `removeSourceLabel`。

#### 只发送附件

附件队列由业务方管理。附件已经准备好时传 `hasAttachments`，没有文字也可以发送。上传中或失败时用 `sendDisabled` 阻止发送。这时 `onSend` 的 `message` 可以是空字符串，业务方从自己的队列读取附件，成功后再清空。只传 `attachments` 展示节点不会自动允许发送。

```tsx
<ChatInputBar
  attachments={<AttachmentQueue files={files} />}
  hasAttachments={files.length > 0}
  sendDisabled={files.some(file => file.state !== "success")}
  onSend={message => sendMessage({ message, files })}
/>
```

#### 快捷卡片

`quickActions` 配置 `id`、`label`、`kind`、`placeholder`、`icon` 和 `onClick`。`kind` 支持 image、note、event、voice、docs，分别使用动态插画、色带或折角。空会话默认展开卡片，已有消息时收起，可以从左侧加号的「快捷操作」再打开。传入 `hasMessages={messages.length > 0}` 跟随会话状态。未传时，首次发送后自动收起，清空会话后重新默认展开。`defaultQuickActionsOpen={false}` 关闭空会话的自动展开。

选择卡片会沉到输入框背后，输入框里显示可移除的操作标签，并切换提示语，不修改已有草稿。`onSend(message, action)` 的第二个参数是选中的操作，`onQuickActionChange` 监听选择和移除。移除按钮、Escape，或空草稿时的 Backspace，会恢复卡片。`quickActionsLabel`、`removeQuickActionLabel` 可改文案。动效遵循减少动态效果。输入框里的空白区域都可以点击聚焦，按钮、菜单和文本选择保持原有行为。

卡片插画、弹簧动画和选中切换由 Motion 驱动。语音、图片生成等业务能力由回调接入，不包含参考示例里的模拟录音或模拟转写。模型、权限、附件、提及、命令和停止生成继续用原有接口。

#### Ask AI

`ChatInputBar` 放进 AskAi 的 composer 插槽时，使用紧凑的自动增高输入框和工具菜单。紧凑菜单的无障碍名称用 `toolsMenuLabel`。已有的来源、命令、附件和模型文案仍然可用。

全屏消息应使用自然高度的内容。滚动、回复跟随、回到最新和浮动输入栏的留白由 core 负责。用 `currentSessionId` 在切换外部会话时重置跟随。插槽约定见仓库里的 [`docs/ask-ai-fullscreen-layout.md`](https://github.com/forge-ui/forge/blob/main/docs/ask-ai-fullscreen-layout.md)。

AskAi 管理自己内置的请求生命周期。应用如果有外部的生成或模型状态，可以把 `ChatInputBar` 通过 `AskAi.composer` 传入，插槽自己持有回调和状态。

`PageTitleToolbar` 的四种 preset 和旧的 `actions` API 都接受可选的 `askAi: AskAiProps`，与 PageHeader 一致。Ask AI 出现在其他操作之前，也可以是唯一的操作。不传则保持原布局。

```tsx
<PageTitleToolbar variant="overview" title="项目总览" breadcrumbItems={[]}
  askAi={{ onSend: async (message, request) => askAgent(message, request) }} />
```

### 文案

内置智能体界面的文字都可以用应用自己的翻译覆盖。默认值保持兼容，语言变化时更新 props。用户提供的标题、行、描述、文件数和选项也由应用翻译。

| 组件 | 翻译 props |
| --- | --- |
| AgentTaskRows | `statusLabels`（running / failed / completed 的部分映射） |
| AgentCodeBlock | `codeLabel`、`diffLabel`、`copyLabel`、`copiedLabel` |
| AgentFlowchart | `title`、`kindLabels`（trigger / action / condition 的部分映射）、`selectedLabel`、`nextLabel` |
| ContextCards | `allChunksLabel`、`charactersLabel` |
| CommandSearch | `placeholder`、`emptyLabel`、`groupLabel` |
| RecommendationCard | `confidenceLabel`、`confidenceLabels`（high / review / none 的部分映射，含 alternatives）、`alternativesLabel`、`acceptLabel` |
| AgentDiffTable | `toggleHint`、`applyLabel`、`appliedLabel`、`formatApplyLabel(count)`、`formatAppliedLabel(count)` |
| ChatInputBar | `sourcesLabel`、`commandsLabel`、`connectedLabel`、`attachLabel`、`dictateLabel`、`modelMenuLabel`、`placeholder`、`sendLabel`、`stopLabel`、`stoppingLabel` |
| ApprovalCard | `skipLabel`、`continueLabel`、`sendLabel`、`sentLabel`、`previousQuestionLabel`、`nextQuestionLabel` |
| InsightCards | `previousInsightLabel`、`nextInsightLabel` |
| ThinkingTrace | `activeLabel`、`doneLabel`、`rows` |
| StreamingAnswer | `sourcesLabel`、`followUpsLabel` |
| ToolChips | `summary` |

```tsx
<AgentTaskRows tasks={tasks} statusLabels={{ running: "运行中", failed: "失败", completed: "已完成" }} />
<AgentDiffTable title="变更" columns={columns} rows={rows}
  toggleHint="点击变更行切换是否应用"
  formatApplyLabel={count => `应用 ${count} 项变更`}
  formatAppliedLabel={count => `已应用 ${count} 项变更`} />
```

带数量的文案用 AgentDiffTable 的 formatter 控制词序和单复数。formatter 放在 client component 里。

`AgentTaskRows`、`ApprovalCard`、`ContextCards`、`RecommendationCard`、`InsightCards`、`AgentFlowchart`、`AgentDiffTable` 默认中文，传 `locale="en"` 切换内置英文。已有的文案覆盖参数优先。`DebitCard` 和 `CreditCard` 同样支持 `locale` 和标签覆盖。业务传入的任务、选项和内容仍由业务方翻译。

`ApprovalCard` 选中后留在当前题，通过「继续」前进，可以返回修改。「跳过」会清除当前题的答案。最后一题分别显示「提交」和「跳过并提交」。提交成功后播报结果并承接焦点。`skipSubmitLabel` 可覆盖最后一题的跳过按钮。

## 交互动效

`OtpInput`、`CalendarCard`、`LiquidTabs`、`AddMember` 从 core 根入口和同名 kebab-case 入口导出，沿用现有 Motion 依赖。样式在 `styles.css` 里，自动继承 Forge 主题。系统开启「减少动态效果」时停用位移和形变。示例：`/cases/motion#otpinput`。

```tsx
import { OtpInput, CalendarCard, LiquidTabs, AddMember } from "@forge-ui-official/core";

<OtpInput length={6} verify={checkCodeOnServer} onSuccess={finishSignIn} />
<CalendarCard value={date} onChange={setDate} locale="zh-CN" />
<LiquidTabs tabs={notificationTabs} value={tabId} onValueChange={setTabId} onSelect={openNotification} />
<AddMember members={members} selectedIds={ids} onSelectionChange={setIds} onAdd={addMembersToProject} />
```

四者都接受 `className` 和 `motion="auto" | "none"`。`none` 关闭动效，但保留当前交互状态。受控模式下，业务方要在对应的变更回调里更新传入值。

- **OtpInput**：2–10 位数字。支持粘贴、`one-time-code` 自动填充、`value` / `defaultValue`、`onChange`、`name` 和 `disabled`。填满时触发 `onComplete`。只有传入 `verify` 才会校验。Promise 未完成时锁定输入，返回 `true` 才触发 `onSuccess`。失败或异常时显示蛋壳裂开反馈；反馈结束后清空输入，传 `clearOnError={false}` 可保留内容供编辑。受控模式通过 `onChange("")` 通知业务方清空，最终值仍由业务方持有。组件内没有内置验证码。`inputLabel`、`hint`、`verifyingLabel`、`successLabel`、`errorLabel` 都可以替换。
- **CalendarCard**：`value` / `defaultDate` 是本地日期，`onChange` 返回新的 `Date`。未传日期时在客户端读取今天，SSR 不猜测用户时区。日期按钮支持方向键、Page Up/Down 翻月、Home/End 跳到月初或月末。月份选择器可用 Escape 关闭。导航范围是 1900–2100。月底翻月会截到有效日期，支持闰年。`locale` 控制日期语言，`labels` 控制按钮文案。没有 `value` 时自行保存选择。
- **LiquidTabs**：`tabs` 为 `{ id, label, items, disabled? }[]`，`items` 为 `{ id, title, subtitle?, time?, icon?, disabled? }[]`。`value` / `defaultValue`、`onValueChange` 控制活动标签。`onSelect(item, tabId)` 返回所选行和标签 ID。默认显示三个标签，其余从菜单切换。`visibleCount`、`rows`、`corner` 可调整。方向键、Home/End 切换标签，菜单支持上下方向键和 Escape。`label` / `moreLabel` / `emptyLabel` 可本地化。不内置业务通知。
- **AddMember**：`members` 为 `{ id, name, role?, avatar?, status?, disabled? }[]`，身份以稳定 `id` 为准。`selectedIds` / `defaultSelectedIds` 与 `onSelectionChange` 支持跨页、跨搜索多选。`open` / `defaultOpen` / `onOpenChange` 控制展开。`onAdd(ids)` 可以返回 Promise，成功后才显示成功，拒绝时保留选择供重试。`clearOnAdd={false}` 可在成功后保留选择。`accent="blue" | "purple" | "black"` 让面板跟随 Forge 主题，省略时保留原配色。`rows` / `search` / `disabled` 控制显示和可用状态。功能文案通过 `labels` 替换。组件只调用业务回调，不自行发送邀请。

### CalendarCard 外观

```tsx
import { CalendarCard, DropdownPanel, type ButtonColor } from "@forge-ui-official/core";

// 保留原来的 300px 双层红色卡片，字体继承应用。
<CalendarCard value={date} onChange={setDate} />

// 320px 表单日期面板，无需覆盖 .forge-calendar__*。
<DropdownPanel width="w-80" className="!items-stretch">
  <CalendarCard size="compact" variant="plain" color="blue"
    value={date} onChange={setDate} locale="zh-CN" />
</DropdownPanel>
```

| 属性 | 类型 | 默认值 | 行为 |
| --- | --- | --- | --- |
| `size` | `"default" \| "compact"` | `"default"` | default 保留原有尺寸。compact 的日期、星期、年月使用 14px / 20–24px token，大日期为 24px / 32px。日期点击区域高 32px，支持六行月份。 |
| `variant` | `"card" \| "plain"` | `"card"` | plain 去掉内外卡片的背景、边框、阴影和装饰留白，宽度随父容器。保留装饰日历、选中、hover 和键盘焦点。 |
| `color` | `ButtonColor` | `"red"` | purple、dark、blue、red、green、yellow、grey、black、blue-dark。选中日期和月份、今天的文字、焦点、进度条、日历顶栏、撕页、点和选中阴影共用主题 token。yellow 配深色选中文字，black 随明暗主题反转。 |

原有 `value`、`defaultDate`、`onChange`、`locale`、`labels`、`disabled`、`motion`、`className` 不变。默认模式把已有的非标准字号和行高留作组件兼容 token。compact 完整使用 core 的字号、字重和行高。两种模式都继承应用字体栈。`motion="none"` 和系统 reduced-motion 会同时关闭 JS 动效和 CSS 过渡。

`plain` 只负责日历内容的外观。弹层定位、打开关闭、确认、取消和焦点限制由业务或 Popover 管理。DropdownPanel 的共享菜单高亮不再套用到嵌入的 core Button 和 CalendarCard。业务升级后可以删掉用来改字体、两层卡片表面和红色的 `.forge-calendar__*` 覆盖。

示例：`/cases/motion#calendarcard`（默认），`/cases/motion#calendarcard-表单弹层`（compact + plain + blue）。

### TaskCard 进度

`TaskCard` 支持 `locale="zh" | "en"`（默认中文）和 `progressLabel`。百分比按整数显示，并限制在 0–100。无效数值显示 0。

## 组件交互融合

0.4.7 把 99 项交互收成 54 项现有组件增强和 45 项组合案例。默认中文，可以切换语言。正式总览是 `/components/interactions`。各示例也在原来的 `/components` 或 `/cases` 里。`/prototype/component-fusion` 用的是同一套实现。

完整说明：[API 用法与业务接入边界](https://github.com/forge-ui/forge/blob/main/docs/design/component-fusion-api-guide.md)。玻璃按钮的装饰背景只属于官网示例，npm 里的 Button 只有玻璃材质。磁吸按钮不带扩散光晕。

| 组件 | 用途 | 主要参数 |
| --- | --- | --- |
| `SelectOption` | 在原选择器里展示 Solar 图标、选项说明和选中反馈 | `options[].icon`、`options[].description`。已有的 `value` / `onChange`、`width`、单选和多选参数不变 |
| `TabBar` / `TabsContent` | 指示器与内容衔接，业务内容先退场再进入 | `TabsContent.transition`（默认 fade，可选 slide）、`direction`（forward / backward）、`motion` |
| `CommandSearch` / `Modal` | 搜索文档和命令，支持键盘选择并执行 | CommandSearch 的 `locale`、`color`、`motion`、`autoFocus`；item 的 `icon`、`shortcut`；Modal 的 `locale`、`closeLabel` |
| `Toggle` | 现有开关加入手柄回弹，可选拖动切换 | `draggable`（默认 false）、`checked` / `defaultChecked`、`onChange`、`motion`、`ariaLabel` |
| `Accordion` | 单项展开时衔接高度、正文和 Solar 箭头 | `items`、`value` / `defaultValue`、`onValueChange`、`motion`。公开参数不变 |
| `Pagination` | 按真实按钮位置移动选中背景，保留原分页样式 | `currentPage`、`totalPages`、`onPageChange`、`locale`（默认 zh）、`motion`（默认 auto） |
| `Button variant="hold"` | 鼠标、触摸或空格 / 回车持续按住后确认 | `onConfirm`、`holdDuration`（毫秒，默认 1200）、`disabled`、`holdLabels`、`confirmed`、`onUndo`、`locale`、`color` |
| `StatCard` / `LineChartStatCard` | 在原指标卡里逐位滚动数字 | `value`、`animateValue`（默认 false）、`locale`（默认 zh-CN）、`numberFormat` |
| `Toolbar` | 选中列表项目后切换为批量操作栏 | `selection={{ count, onClear, actions, label?, clearLabel? }}`、`locale` |

以上交互支持 `motion="auto" | "none"`。`auto` 遵循系统减少动态效果。Button、Toolbar、Pagination、CommandSearch、Modal 使用 zh / en。指标卡使用 Intl locale。SelectOption 的选项文案、TabBar 的标签、Toggle 的 `ariaLabel` 和 Accordion 的 items 由调用方提供。指标卡默认外观不变。数字值启用 `animateValue` 才逐位滚动，字符串和自定义节点保持原样。`numberFormat` 用于金额、小数等格式。

SelectOptionItem 只新增可选的 `icon: ReactNode` 和 `description: string`。菜单项和单选触发器可以显示图标和说明。图片模式提供 image 时仍以图片为先。选中标记使用 Solar CheckCircle。已有的 width、value / onChange、单选和多选不变。业务语言和数据映射仍由调用方管理。

TabsContent 默认仍是 `transition="fade"`。传 `transition="slide"` 后，当前内容约 140ms 退场，新内容约 300ms 入场，并衔接容器高度。同一时间只挂载一份业务 children，退出的内容立即 inert。快速切换以最终选择为准。减少动效时立即切换。`direction` 可指定 forward / backward。不传时，数字 `activeKey` 自动判断方向，字符串默认向前。表单和任务状态应放在宿主，避免切换 `activeKey` 导致重挂载后丢失。TabBar 沿用现有滑动指示器。

CommandSearch 默认中文，`locale="en"` 切换内置文案。已有的 placeholder、emptyLabel、groupLabel 覆盖优先。方向键循环选择，Home / End 跳到首尾，Enter 执行并避开输入法组词。活动项保持在滚动区域内。过滤后失效的 active descendant 会清除。`shortcut` 只展示快捷键，注册快捷键由宿主负责。官网里和 Modal 的组合展示本地文档以及创建、提醒操作，Cmd/Ctrl+K 只在当前示例内响应。每次打开聚焦搜索，关闭后焦点回到触发按钮。Modal 支持 locale / closeLabel，关闭图标使用 Solar。

Toggle 默认仍是点击或键盘切换。传 `draggable` 后，手柄随指针移动，越过轨道中点再松开才提交新值。pointercancel、丢失指针捕获和 Escape 会取消拖动。受控值由调用方更新。禁用状态不提交。开关尺寸、配色和 switch 语义不变。

Accordion 沿用单项展开和既有排版，在可反向的高度过渡上加入正文轻移和淡入。字符箭头改为 Solar 图标。收起时内容立即 inert。受控关闭会把内部焦点退回标题。方向键、Home、End 只在本级可用标题之间移动。不增加 FAQ 组件、编号或装饰卡片。

Pagination 新增 `locale` 和 `motion`，保留 `currentPage` / `totalPages` / `onPageChange` 的受控约定和原页码窗口。选中背景按实际按钮位置测量。父容器变窄时减少可见页码，保留 40px 点击区域。首尾边界禁用和 `aria-current="page"` 不变。页码对应的列表内容和数据请求仍由宿主处理。

Toolbar 不传 `selection` 时保留原结构。启用批量模式后要持续传入配置对象，用 `count={0}` 退出。动态增删 `selection` 会重建工具栏，不要拿它切换选中状态。`count` 为 0 时显示原来的 left / right 内容，大于 0 时显示批量操作。清空选择、Escape，以及操作完成后的数据更新，由宿主回调控制。正在退出的隐藏操作不可聚焦，也不可点击。官网示例把 ListGroup、Checkbox 和 Toolbar 组合在一起，展示选择、归档和撤销。

长按过程中失焦、松开、Escape 或变为禁用，都会取消当前操作。单击不会触发确认。hold 变体保留整面填色、过半抖动，以及完成后的撤销。文件退场属于业务示例，由 `onConfirm` / `onUndo` 驱动。传 `confirmed` 时由业务决定是否完成，不会提前宣告删除成功。

空文件夹、搜索无结果和加载失败是官网组合案例，复用 ListGroup、ToolbarSearchInput 和 Button，不增加公共 EmptyState 入口。空文件夹支持从实际模板按钮飞入纸张再创建项目。搜索清除后恢复列表。加载失败支持重试，成功后恢复。

另外这些能力按需打开，现有组件的默认呈现和受控约定保留：按钮与图标按钮效果、真实上传进度、日期区间的草稿确认、标签输入、可编辑评分、滑动页签、堆叠通知和滑动操作。聊天支持引用回复、反应和语音状态接口。图表支持真实累计面积、预测置信带、目标刻度和独立活动环。代码块支持嵌套折叠。组合案例里的模拟上传、登录、审批和队列只说明宿主怎么管状态，不代替业务后端。

### 边界

- `Datepicker` 使用 `inline` 加 `confirmSelection` 时，切换起止日期会保留草稿。外部日期值变化会替换草稿。相同时间戳的重新渲染不会丢掉正在编辑的内容。
- `ReviewItem variant="card"` 只在传入 `onMenuClick` 时显示菜单按钮，可用 `menuLabel` 设置名称。
- `SurfaceCard effect="tilt"` 的光斑默认继承 `--accent`，也可以用 `--forge-surface-accent` 单独指定。

## 开发

仓库工具链要求 Node.js `>=22.13.0`，pnpm 版本由根目录 `packageManager` 固定。命令从仓库根目录执行。

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

### 组件审计

```bash
pnpm core:audit            # 默认范围：core/src/components + core/src/internal（发布门禁）
pnpm core:audit:showcase   # 额外审计 showcase / sample 源，只产生 review warning，不影响退出码
```

showcase 范围覆盖 `src/app/cases` 和 `src/app/components`，不扫描 `dist` 和 `node_modules`。`forge-app-design` 样例已经拆到独立插件仓。

语义 alias：

- 已确认的 orange → fg-red 等兼容映射，由精确的「文件路径 + 对象路径 + class 值」allowlist 管理。默认审计会报告批准数量，但不产生 warning。
- 新增、重复或已经失效的 alias 都是 error。先判断语义，再有意更新 allowlist。
- `fixed-width-review` / `width-fixed-review`：组件内部显式 fixed API 的映射表（如 ChartCard 的 `fixedWidthClasses`，只在 `width="fixed"` 时生效）不告警。业务页和样例里的 `width="fixed"`、`w-96` 等硬编码宽度仍会被提示。

### 手动检查

核心 card 或 layout 改动后，用这些路由看卡片是否跟着父级宽度、grid 和布局走：

- `/components/card`
- `/components/chart`
- `/components/map`
- `/cases/table`
- `/templates/dashboard-builder/light-sidebar`
- `/templates/dashboards/crm`

## 发布

发布前从仓库根目录执行：

```bash
pnpm core:audit
pnpm core:check
pnpm core:build
pnpm core:check-package
pnpm core:check-consumer
pnpm typecheck
```

- `core/package.json` 的版本号已递增。根目录 `package.json` 和 lockfile 没有被无关依赖改动污染。
- `pnpm core:check` 完成源码和测试的类型检查、lint、交互回归、alias gate 和组件审计。默认审计保持 `0 error / 0 warning`。
- `pnpm core:build`、`pnpm core:check-package`、`pnpm core:check-consumer` 通过。`check-package` 覆盖导出快照、关键拆分入口、文件集合和 raw / gzip 体积。`check-consumer` 从真实 tarball 安装到临时的 Next.js 15 和 16 项目，并验证深入口、SSR、Tailwind `@source` 和生产构建。
- 发布后再用 Forge Starter 安装刚发布的 npm 包，执行 `pnpm install`、`pnpm typecheck`、`pnpm build`。
- 不把 npm token 写进仓库或全局 npmrc。短期可以手动用临时 npmrc 发布。长期优先用 npm trusted publishing。
