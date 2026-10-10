# AskAi 全屏布局与消费方适配

本地变更基于 HEAD `b4765652ea4157ce2419757390d9e1e3345f8fa0`。不涉及 npm 发布、push 或部署。抽屉布局及其滚动逻辑未改。

## 布局契约

- `[data-ask-ai-fs-chat]` 占据侧栏之外的整个主区域。
- `[data-ask-ai-fs-scroll]` 是会话正文唯一的纵向滚动宿主，滚动条在主区域右边缘。会话侧栏仍独立滚动。
- `[data-ask-ai-fs-messages]` 只承载自然高度内容，不再承担滚动。按主区域可用宽度分档：小于 54rem 时正文上限 40rem（640px），达到 54rem 时上限 48rem（768px）；正文左右 gutter 各 24px。此宽度取代第一轮的 1040px，按用户后续要求对齐 Chrome 中的 ChatGPT 实测结果。输入区左右 gutter 至少各 16px。
- `[data-ask-ai-fs-composer-region]` 是滚动宿主上方的绝对定位浮动层，不再作为 flex 底部白色区域占位。主滚动宿主贯穿全高；仅输入框附近有局部渐隐。ResizeObserver 测量整个 composer region 的实际高度，将正文末尾 padding 和宿主 scroll-padding 设置为该高度加 20px，避免最后一条回复被遮挡。底部距离为 `max(1rem, env(safe-area-inset-bottom))`，桌面默认 16px。
- composer slot 保留自身输入框内部 padding，但不要再添加外部底部 padding/margin、fixed/sticky 定位或 safe-area 留白。
- 默认全屏输入框从一行开始，随内容增长，最多 192px；Shift+Enter 换行，Enter 发送，输入法 composing 时不发送。注入的 Forge PromptBar 在全屏会话中自动使用紧凑单行布局并随内容增高；抽屉和独立使用时保留原布局。其他自定义 composer 的输入高度与键盘行为仍由消费组件自己负责。
- 桌面会话栏默认展开；小于 768px 时默认收起，展开后覆盖左侧而不挤窄正文。

自动跟随由 core 管理：初次进入与 `currentSessionId` 变化时定位最新；距底部 48px 内继续跟随。用户上滚后暂停跟随，显示“回到最新”。正文 ResizeObserver 处理消费组件内部流式更新、展开卡片、异步内容尺寸变化；滚动宿主 ResizeObserver 处理 composer 增高与视口变化。禁止消费方同时执行另一个自动 scrollIntoView/scrollTop 循环。

## 消费方具体改法

使用受控 fullscreen 状态，抽屉仍可保留原包装。全屏消息根容器及其包裹层去掉 `h-full`、固定/max 高度、`flex-1`、`overflow-y-auto/scroll/hidden`；改为 `h-auto min-w-0` 和正常文档流。不能只隐藏 scrollbar；每一层有固定高度的纵向滚动容器都需适配。

```tsx
const [fullscreen, setFullscreen] = useState(false);

<AskAi
  fullscreen={fullscreen}
  onFullscreenChange={setFullscreen}
  currentSessionId={sessionId}
  onSend={send}
  messages={
    <div className={fullscreen
      ? "flex h-auto min-w-0 flex-col gap-6"
      : "h-full overflow-y-auto"}>
      <Transcript />
    </div>
  }
  composer={
    <div className={fullscreen ? "" : "pb-7"}>
      <PromptBar value={draft} onChange={setDraft} onSend={sendPrompt} />
    </div>
  }
/>
```

若 Transcript 内部也写死了滚动，将其改为接收布局模式（例如 `embedded`），全屏使用自然高度模式，抽屉使用原滚动模式。旧 `scrollRef` 的跟随/回到最新逻辑在全屏分支停用；需要观测位置时从自己的消息 DOM 使用 `closest('[data-ask-ai-fs-scroll]')` 找宿主，避免依赖 `[data-ask-ai-fs-messages]` 的旧滚动职责。外部会话切换务必传入变化的 `currentSessionId`。

`AgentTaskRows`、`Checklist`、`ApprovalCard`、`RecommendationCard` 在全屏正文内最大宽度 40rem（640px），抽屉和其他场景不限制。表格、代码、流程图没有套用这条限制，可使用整个正文宽度。消费方自定义确认/推荐卡可使用：

```tsx
<div data-ask-ai-response="compact"><CustomCard /></div>
```

数据表或代码块可在内部保留 `overflow-x-auto`；避免将其外壳设为固定高度的纵向滚动容器。core 不会用深层 `!important` 规则强行清除消费方滚动或 composer 留白。

## 本地验证

复用已运行 Chrome，通过本地 `/dev/ask-ai-fullscreen` 验收页实际点击、滚轮和键盘操作。验收页使用 core 源码 alias 与已有 Forge 组件，可切换旧 slot 包装作为反例、切换默认输入框、增长当前回复、追加回复和切换会话。

| 检查 | 结果 |
| --- | --- |
| `pnpm core:check` | 137 个组件测试 + 17 个脚本测试通过；typecheck、test typecheck、lint、license 检查通过 |
| `pnpm core:build` | JS 与 DTS 构建通过 |
| 组件审计 | 0 error；原有 `ask-ai-history.tsx:114 w-72` 提醒 1 条 |
| `pnpm exec tsc --noEmit` | showcase 类型检查通过 |
| 1440 × 900 | 主滚动区 1184px；正文、表格和输入框宽度 768px；任务/确认/推荐卡 640px；输入距底 16px |
| 390 × 844 | 主滚动区 390px；正文可用宽度约 331px，输入框 358px；无页面横向溢出；侧栏默认收起；输入距底 16px |
| 长对话 | 18 组回复、长代码及卡片；主区域只有一个纵向滚动宿主 |
| 上滚后追加回复 | scrollTop 保持 15634，没有拉回底部 |
| 回到最新后追加 | scrollTop 与最大可滚动距离相等，继续跟随 |
| 原消息尺寸增长 | 不增加消息节点时仍跟随 ResizeObserver；滚动距离浮点误差小于 1px |
| 默认输入框 | 5 行高度 120px，发送后回到 24px；底部距离仍 16px；Shift+Enter 和 Enter 验证通过 |
| 会话与退出 | 长/短会话切换定位最新，侧栏切换与退出全屏通过；已有抽屉回归测试通过 |

safe-area 公式已实现；本次 Chrome 不支持 `Emulation.setSafeAreaInsets`，未在物理刘海设备验证非零 inset。浏览器视口覆盖已恢复。

截图在 `artifacts/ask-ai-fullscreen/`：`before-wide.jpg`、`after-wide.jpg`、`before-narrow.jpg`、`after-narrow.jpg`、`after-wide-components.jpg`。修改前截图上的红色 Issue 标记是首次 SSR 直接打开全屏时的既有 hydration 错误；已通过 client snapshot 延后 portal 修复，并补充 SSR 回归测试，修改后截图无该提示。core 检查、构建及 showcase 类型检查的完整日志也保存在同目录。


## 后续：只对齐 ChatGPT 的宽度

2026-10-10 使用用户已运行的 Chrome 实测 ChatGPT；只读取布局与已有会话，没有发送测试消息。本轮只修改宽度及 gutter，不改变滚动、输入高度、底部距离或会话行为。

| 场景 | ChatGPT 实测 | Forge 当前 |
| --- | --- | --- |
| 1440px / 1920px 宽屏 | 正文与输入框 768px 上限 | 正文与输入框 768px 上限 |
| 主区域空间收窄 | 使用 640px 档位 | 主区域小于 54rem 使用 640px 档位 |
| 1024px，Forge 会话栏展开 | 不同应用侧栏宽度有差异，以主区域可用空间分档 | 正文与输入框 640px |
| 1024px，收起侧栏 | 正文可达 768px | 正文与输入框 768px |
| 390px 窄屏 | 正文约 331px（原生细滚动条宽度影响）；输入框 358px，左右各 16px | 正文约 331px（原生细滚动条宽度影响）；输入框 358px，左右各 16px |

宽度档位通过 main pane 的 CSS container query 实现，而不是只判断整个视口宽度，避免侧栏展开后正文仍硬套宽屏值。54rem 为 Forge 对上述实测行为采用的适配阈值，并非宣称照搬 ChatGPT 的内部断点。

最新截图：`artifacts/ask-ai-fullscreen/chatgpt-aligned-wide.jpg`、`chatgpt-aligned-narrow.jpg`；第一轮修改前后截图保留用于追溯。没有复制 ChatGPT 的个人历史记录或会话内容到交付材料。


## 后续：浮动底部输入区

按用户截图进一步调整：主区域滚动占据整个高度，输入框悬浮其上，透明外层不再形成通栏白色底座。输入框附近使用局部渐变与阴影。默认 composer 与通过 slot 注入的 Forge PromptBar 在全屏会话中均以约 52px 的紧凑高度开始；PromptBar 的多行增高上限 192px。通过内部 React context 限定作用域，不改变 PromptBar 的公开 API，也不改变抽屉与独立场景。

正文末尾安全占位由 core 根据 composer 实测高度维护（包括 safe-area/底部间距，再加 20px 消息间距）。消费方不要再自行添加输入框占位 spacer 或复制这段 padding；仍需移除消息容器的独立纵向滚动及 composer 外部底部 padding。

滚动宿主仍在主区域右边缘，使用原生 `scrollbar-width:thin` 轨道（WebKit fallback 为 6px，平台实际宽度可能不同），静止时透明，悬停/键盘焦点时显示；没有设置 overflow:hidden 或 scrollbar-width:none。窄屏正文 gutter 调整为 24px，在本次 390px Chrome 下正文约 331px，输入框 358px。

Chrome 实测：1440×900 时主滚动宿主高度 900px，空 PromptBar 高 52px，composer region 高 68px，正文末尾占位 88px；五行输入时 region 增至 180px，末尾占位同步为 200px。回到最新后最后一条消息底边 812px，输入框顶边 832px，保留 20px 间距。

最新截图：`artifacts/ask-ai-fullscreen/floating-composer-wide.jpg`、`floating-composer-narrow.jpg`。

## 完整 PromptBar 工具预览

验收页已传入 `sources`（项目资料/知识库）、`commands`（plan/summarize）、`models`（快速模式/深度思考）、`onAttach`、`onDictate`，补齐原组件的工具入口。来源与指令选择会插入输入内容，模型选择维护受控状态；附件与听写只触发本地提示，不上传文件或启用麦克风。

实测全部工具开启时：1440px 宽屏输入框仍约 52px，输入和工具同一行；390px 窄屏约 104px，输入与工具各一行。紧凑模式工具按钮减少水平 padding，确保整组工具不额外拆成第三行。模型菜单在窄屏位于 x=8..296、y=690..782，没有越过视口边界。独立/抽屉 PromptBar 的工具间距保持原样。

最新截图：`artifacts/ask-ai-fullscreen/full-tools-wide.jpg`、`full-tools-narrow.jpg`。本地预览为 `/dev/ask-ai-fullscreen`。

## 最终交互：加号菜单与 @ / 自动筛选

参考用户提供的 ChatGPT 菜单截图，全屏紧凑 PromptBar 将附件、来源和指令收进左侧“＋”（可访问名称“添加内容和工具”）；模型、发送/停止位于右侧。验收页按最新要求去掉语音/听写入口；共享 PromptBar 的可选接口保留，抽屉行为不变。宽窄屏均为一行初始约 52px 的输入框；长文本仍自动增高。抽屉及独立场景保留原附件/来源/指令工具栏。

- 点击“＋”：可视化选择已配置的附件入口、来源、指令。没有创建图像、搜索、研究等未配置的新能力。
- 输入 `@`：来源候选自动出现，并随后续文字按来源名称过滤，例如 `@知` 仅显示知识库。
- 输入 `/`：指令候选自动出现并按名称过滤，例如 `/pl` 仅显示 plan。
- 输入框 ArrowDown/ArrowUp 进入候选；菜单内上下键、Home/End 移动，Enter 选择。
- Escape 关闭当前候选并保留草稿，下一次编辑重新开始筛选；菜单关闭优先于退出全屏。
- 点击来源或指令写入草稿并返回输入框焦点；加号菜单点击外部或 Tab 离开时关闭。

本次检查：138 个组件测试、17 个脚本测试通过，core 构建及 showcase 类型检查通过。新的回归测试覆盖加号菜单、附件回调、键盘焦点、@ / 过滤和 Escape 后再次筛选。

最新截图：`artifacts/ask-ai-fullscreen/plus-menu-wide.jpg`、`plus-menu-narrow.jpg`，替代前一轮完整工具平铺预览。

## 无语音预览

验收页不再传入 `onDictate`，宽窄屏均没有麦克风入口。保留加号菜单、模型选择、发送/停止，以及 `@` / `/` 自动筛选。showcase 类型检查通过，并在用户现有 Chrome 中确认。截图：`artifacts/ask-ai-fullscreen/no-voice-wide.jpg`、`no-voice-narrow.jpg`。

## 验收页抽屉模式适配

退出全屏后，验收页消息 slot 使用 `min-h-0 flex-1 overflow-y-auto p-5`，composer 外层使用 `shrink-0 px-5 pb-5 pt-3`；全屏继续提供自然高度消息和无底部 padding 的 composer。验收按钮仅在全屏侧栏显示，抽屉 brand 为简单标题。共享 core 抽屉样式未修改。

## 最终抽屉输入框行为

按用户后续确认，AskAi 抽屉的 composer slot 也提供紧凑布局上下文。注入 PromptBar 时，附件、来源、指令统一进入加号菜单，支持 `@` / `/` 自动筛选；模型选择及发送/停止保留。独立 PromptBar 默认布局与 AskAi 内置无工具输入框不变。验收页不配置语音。最终 `core:check` 通过，浏览器已验证抽屉加号菜单。截图保存在本地 artifacts，不随代码提交。
