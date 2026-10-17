# Ask AI 布局调整：待 core 发布

本次只修改 Forge core 及独立审阅页。用户明确要求：由 core 项目会话审查并发布 npm，之后再集成 Starter。不得据此自动发布、提交、推送或升级 Starter。

## 改动与接入契约

- 空会话：标题、说明、推荐问题形成三个层级。`landingTitle` 同时用于抽屉；`landingDescription` 配置抽屉说明。现有全屏欢迎区布局、输入栏和推荐问题行为保留。
- `headerLayout="session"`：面板左侧以当前会话标题为历史入口，长标题截断并保留 title；新建、全屏、关闭在右侧。默认仍为 `brand`，兼容旧用法。
- `panelMode="responsive"`：视口宽度 >=1440px 为非模态并排面板，宽 460px；低于断点回退原生模态 dialog。默认仍为 `modal`。
- `onDockedChange(docked)`：消费者必须在 true 时为主页面预留右侧 460px；关闭、全屏、窄屏和卸载时释放。示例不能只去掉遮罩而不让主页面重新排版。
- 并排模式不锁 body、不使主页面 inert、不因点击主页面关闭；Escape 仅在助手内或入口获得焦点时关闭。窄屏保留原生模态焦点约束。
- 不重新挂载输入框或会话来切换断点，保留草稿、消息和外部状态。

```tsx
const [docked, setDocked] = useState(false);

<div style={{ paddingRight: docked ? 460 : 0 }}>
  {/* 原有 AppLayout，保持首屏高度与内容面 gutter */}
</div>
<AskAi
  panelMode="responsive"
  onDockedChange={setDocked}
  headerLayout="session"
  landingTitle="有什么可以帮你？"
  landingDescription="查询当前页面的信息，或协助处理操作。"
  {...existingSessionAndComposerProps}
/>
```

Starter 后续接入：在 `AskAiProvider` 稳定宿主中预留并排空间，移除空会话 `suggestions.length === 0` 分支那段替代整个欢迎区的小字，恢复使用 Kit 欢迎区；保留现有输入栏、模型选择、业务建议、会话恢复与发送链路。全文读完本说明后再接入，不能把示例的本地回复替代业务 API。

## 审阅入口与范围

`/dev/ask-ai-panel` 是独立本地视觉审阅路由，不是官网全局 Ask AI，也不调用模型或写业务数据。

改动文件：

- `core/src/components/ui/ask-ai.tsx`
- `core/src/internal/ask-ai-history.tsx`
- `core/test/ask-ai.test.tsx`
- `core/scripts/package-api-snapshot.mjs`（API 签名更新）
- `src/app/dev/ask-ai-panel/page.tsx`
- 本说明

Forge 工作区已有大量其他未提交改动，不属于本次变更。Starter 的接入代码已经撤回，依赖版本未变。

## 由外到内设计审查

角色：Ask AI 壳级辅助面板；宿主业务页 chrome A/B/C 均可，面板自身不冒充正文 PageHeader。主对照：Kit AskAi / `/cases/page-header` 与 `/dev/ask-ai-fullscreen`；HeroUI 只作布局参考。

| 层 | 结构 | 判定 |
|---|---|---|
| S | 主页面与助手并排；窄屏单一模态；全屏沿用 Kit | 模式清晰，不新造抽屉或全屏层 |
| O | 主页面预留 460px，面板固定视口高度，内容独立滚动 | 主页面可点击和输入；面板输入栏留底边距 |
| N | 会话标题及工具 → 欢迎标题及说明 → 建议 → 输入栏 | 推荐问题内容与输入栏保留，欢迎层级加强 |
| C | Kit IconButton / PlusIcon、历史控件和 ChatInputBar | fg token；黑色主标题、grey-700 辅助说明 |

本轮未修改 Starter 业务页面，Starter 完整 M/R/H/L/C/V/F/D/E/Q 逐条审计留在 npm 集成后执行；本记录不声称 Starter 已完成验收。

## 验证记录

- 已在复用的 Chrome 实际验证：1920px 并排、1100px 模态、390px 模态（文档与视口均 390px，无横向溢出）。
- 并排时点击主页面按钮和输入，计数与文本均更新。
- 已输入助手草稿后缩窄窗口，草稿保留；发送后进入全屏，再退出，消息仍在。
- 历史菜单、新建会话、顶部动作已实际打开和点击。
- 浏览器日志无 error / warn。
- 截图：`tmp-audit/ask-ai-panel/wide.png`。技术验证不是用户视觉验收。

最终自动检查结果在本说明末尾补充。发布版本号由 core 会话决定；此处未变更版本、未 npm publish。

最终检查（2026-10-16）：

- core typecheck、typecheck:test：通过。
- 改动组件与测试 ESLint（--max-warnings=0）：通过；工具仍打印仓库既有的 Next pages 路径提示。
- core 全量回归：284/284 通过，其中 Ask AI 15/15。
- core build：通过。
- 包 API 快照已更新；check:package 通过：851464 B packed、3410490 B unpacked、488 files。
- core:audit：0 errors / 1 warning。warning 为历史菜单原有 `w-72` 固定宽度，未改菜单宽度。
- 浏览器宽屏、1100px、390px 主路径验证通过；`mobile.png` 同目录留档。
- Starter `git status` 与本轮开始一致：仅原有 next-env.d.ts 修改、.env.bak、tmp/。未升级依赖，未安装本地包。
- 未提交、未推送、未变更版本号、未发布 npm。core 发布会话应按精确文件范围审查，勿打包无关的官网工作区改动。

## 0.4.6 发布审查与复验（2026-10-16）

以下为独立发布副本的复验，以上 284 项结果属于迁移分支交接记录，不作为本次发布门禁证据。

- 基线：远端 main `54598df8`；仅提取本说明列出的六个文件，另递增 `core/package.json` 至 `0.4.6`。未合入迁移分支其他提交或官网修改。
- 审查修正：历史菜单宽度改为可随容器收缩，消除固定宽度告警；`onDockedChange` 不因回调函数身份变化而反复释放/占用宿主空间，并增加回归测试。
- API 快照由独立副本构建后重新生成，仅 AskAi/AskAiProps 及其传递引用入口签名变化。
- `pnpm core:check`：源码/测试类型、lint、168 项组件测试、17 项审计测试全部通过；组件审计 0 errors / 0 warnings；生产依赖许可证检查通过。
- `pnpm core:build`、`pnpm core:check-package`、根目录 `tsc --noEmit`：通过。包契约检查 464 files，744994 B packed，3014680 B unpacked。
- `pnpm core:check-consumer`：实际 tarball 安装至 Next 15.5.24 / 16.3.5，深入口、SSR、Tailwind 样式与生产构建通过。
- 复用现有 Chrome 验证独立副本：1440px 为非模态 460px 并排，主页面按钮与输入可操作；1439px 和 390px 回退模态；断点与全屏往返草稿保留；进入全屏释放预留，返回恢复；历史菜单 Escape 只关闭菜单；关闭面板释放预留与滚动锁。浏览器无 error。
- 未修改、安装或升级 forge-starter；Starter 消费验证由后续会话执行。本记录不代表用户视觉验收。
