import type { ApiTableRow } from "../../components/_api-table";

export const CODE_IMPORT = `import {
  ThinkingTrace,
  StreamingAnswer,
  ApprovalCard,
  ToolChips,
  AgentTaskRows,
  ContextCards,
  RecommendationCard,
  AgentDiffTable,
  AgentCodeBlock,
  InsightCards,
  CommandSearch,
  AgentFlowchart,
  Conversation,
  AgentMessage,
  MessageActions,
  PromptSuggestions,
  ArtifactCard,
  AgentParts,
} from "@forge-ui-official/core";`;

export const CODE_CONVERSATION = `<Conversation followKey={messages.length}>
  {messages.map(message => (
    <AgentMessage
      key={message.id}
      role={message.role}
      actions={message.role === "assistant" && (
        <MessageActions copyText={message.text} onRetry={() => regenerate(message.id)} onFeedback={value => rate(message.id, value)} />
      )}
    >
      {message.text}
    </AgentMessage>
  ))}
  <PromptSuggestions suggestions={["本周退款最多的商品是哪个？"]} onSelect={send} />
</Conversation>`;

export const CODE_PARTS = `// AI SDK v5：const { messages, status } = useChat();
{messages.map(message => (
  <AgentMessage key={message.id} role={message.role}>
    <AgentParts
      parts={message.parts}
      status={status}
      renderTool={{
        getInventory: part => <InventoryCard {...(part.output as Inventory)} />,
      }}
    />
  </AgentMessage>
))}`;

export const CODE_APPROVAL_PARTS = `// AI SDK 7：服务端 streamText({ toolApproval: { createPurchaseOrder: "user-approval" } })
export const { messages, status, addToolApprovalResponse } = useChat();

<AgentParts parts={message.parts} status={status} onToolApproval={addToolApprovalResponse} />`;

export const CODE_ARTIFACT = `<ArtifactCard title="十一月运营周报.md" kind="document" meta="Markdown · 4.2 KB" onOpen={open} onDownload={download} />
<ArtifactCard title="周报.md" status="generating" />
<ArtifactCard title="渠道对账.xlsx" kind="table" status="error" />`;

export const CONVERSATION_ROWS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "消息列表。" },
  { attr: "followKey", type: "unknown", defaultValue: "—", description: "有新内容时变化（消息数、流式长度）。读者停在底部时自动跟随；上翻后停止跟随并出现“回到最新”。" },
  { attr: "latestLabel", type: "string", defaultValue: "回到最新", description: "回到底部按钮的文字。" },
  { attr: "locale / motion / className", type: "'zh' | 'en' / 'auto' | 'none' / string", defaultValue: "'zh' / 'auto'", description: "语言、动效偏好和外层类名。" },
];
export const MESSAGE_ROWS: ApiTableRow[] = [
  { attr: "role", type: "'user' | 'assistant'", defaultValue: "—", description: "用户消息是右侧气泡；助手回复整宽显示，带头像。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "消息内容；助手回复通常放 AgentParts。" },
  { attr: "name / time / avatar", type: "string / string / ReactNode", defaultValue: "—", description: "助手名称、时间和头像。" },
  { attr: "actions", type: "ReactNode", defaultValue: "—", description: "回复下方的操作，通常是 MessageActions。" },
];
export const ACTIONS_ROWS: ApiTableRow[] = [
  { attr: "copyText", type: "string", defaultValue: "—", description: "传了才显示复制按钮。" },
  { attr: "onRetry", type: "() => void", defaultValue: "—", description: "传了才显示重新生成。" },
  { attr: "onFeedback / feedback", type: "(value: 'up' | 'down' | null) => void / MessageFeedback", defaultValue: "—", description: "传了才显示有帮助、没帮助；再点一次取消。传 feedback 时受控。" },
  { attr: "versions", type: "{ current: number; total: number; onChange }", defaultValue: "—", description: "重新生成过的回答显示“2/3”和上一版、下一版；current 从 0 开始。" },
  { attr: "onEdit", type: "() => void", defaultValue: "—", description: "传了才显示编辑，通常放在用户消息上，编辑后重发。" },
  { attr: "feedbackReasons / onFeedbackReason", type: "string[] / (reason: string) => void", defaultValue: "—", description: "点了没帮助后给出原因选项，例如“数据不对”“太长”。" },
  { attr: "labels / locale", type: "Partial<Record<'copy' | 'copied' | 'retry' | 'up' | 'down' | 'edit' | 'previous' | 'next', string>> / 'zh' | 'en'", defaultValue: "'zh'", description: "按钮文字和无障碍名称。" },
];
export const SUGGESTION_ROWS: ApiTableRow[] = [
  { attr: "suggestions", type: "string[]", defaultValue: "—", description: "推荐提问，空数组时不渲染。" },
  { attr: "onSelect", type: "(text: string, index: number) => void", defaultValue: "—", description: "点了某个提问。" },
  { attr: "label", type: "string", defaultValue: "—", description: "上方小标题。" },
];
export const ARTIFACT_ROWS: ApiTableRow[] = [
  { attr: "title / meta", type: "string", defaultValue: "—", description: "文件名和一行说明（格式、大小）。" },
  { attr: "kind", type: "'document' | 'code' | 'table' | 'image' | 'file'", defaultValue: "'document'", description: "决定图标。" },
  { attr: "status", type: "'generating' | 'ready' | 'error'", defaultValue: "'ready'", description: "生成中和失败时隐藏打开、下载。" },
  { attr: "onOpen / onDownload", type: "() => void", defaultValue: "—", description: "传了才显示对应按钮。" },
];
export const PARTS_ROWS: ApiTableRow[] = [
  { attr: "parts", type: "AgentMessagePart[]", defaultValue: "—", description: "AI SDK UIMessage 的 parts。text 用 Markdown 流式显示，reasoning 可折叠，连续的 tool-* 合成一组，source-url 挂在回答下，file 显示为产物卡片；未知类型忽略。" },
  { attr: "status", type: "'submitted' | 'streaming' | 'ready' | 'error'", defaultValue: "'ready'", description: "useChat 的 status；streaming 时最后一段文本逐字显示。" },
  { attr: "renderTool", type: "Record<string, (part: AgentToolPart) => ReactNode>", defaultValue: "{}", description: "按工具名把完成的工具调用换成自己的组件（生成式界面）；返回 null 时仍显示工具记录。" },
  { attr: "onOpenFile", type: "(file: { url; filename?; mediaType }) => void", defaultValue: "—", description: "点产物卡片的打开。" },
  { attr: "onToolApproval", type: "(response: { id; approved; reason? }) => void", defaultValue: "—", description: "工具需要确认（AI SDK 6 起的 approval-requested）时显示允许、拒绝；直接传 useChat 的 addToolApprovalResponse。不传时只显示“等待确认”。被拒绝的调用在工具组里标为已停止。" },
];

export const THINKING_PROPS: ApiTableRow[] = [
  { attr: "variant", type: "'steps' | 'reasoning' | 'search' | 'coding'", defaultValue: "'steps'", description: "处理过程的展示类型。" },
  { attr: "rows", type: "ThinkingRow[]", defaultValue: "内置示例", description: "覆盖默认步骤。" },
  { attr: "settled", type: "boolean", defaultValue: "false", description: "直接显示完成态。" },
  { attr: "play", type: "boolean", defaultValue: "true", description: "自动逐条展开。" },
  { attr: "onSettled", type: "() => void", defaultValue: "—", description: "全部展开后回调。" },
];

export const STREAM_PROPS: ApiTableRow[] = [
  { attr: "text", type: "string", defaultValue: "—", description: "完整正文，或持续追加的已接收正文。" },
  { attr: "streaming", type: "boolean", defaultValue: "false", description: "播放预先准备好的完整文本；接真实流时使用 status。" },
  { attr: "status", type: "'streaming' | 'complete' | 'stopped'", defaultValue: "—", description: "应用接收回答的状态。complete 等待正文呈现完毕；stopped 保留已显示内容。" },
  { attr: "format", type: "'plain' | 'markdown'", defaultValue: "'plain'", description: "纯文本保留字面内容与空白；markdown 支持标题、列表、链接、表格和代码块。" },
  { attr: "animation", type: "'fade' | 'blur'", defaultValue: "'fade'", description: "新增内容的线性淡入，或模糊渐显。" },
  { attr: "duration", type: "number", defaultValue: "500", description: "淡入时长，单位 ms；0 表示直接显示。" },
  { attr: "motion", type: "'auto' | 'none'", defaultValue: "'auto'", description: "auto 尊重系统减弱动态效果偏好；none 直接显示收到的内容。" },
  { attr: "sources", type: "StreamingSource[]", defaultValue: "[]", description: "行内来源列表。" },
  { attr: "followUps", type: "string[]", defaultValue: "[]", description: "完成后的追问。" },
  { attr: "onDone", type: "() => void", defaultValue: "—", description: "回答完成且最后一批淡入结束后回调一次，停止时不触发。" },
];

export const APPROVAL_PROPS: ApiTableRow[] = [
  { attr: "questions", type: "ApprovalQuestion[]", defaultValue: "—", description: "需要用户逐项确认的问题列表。" },
  { attr: "onSubmitted", type: "(answers) => void", defaultValue: "—", description: "全部答完或发送。" },
];

export const TASK_PROPS: ApiTableRow[] = [
  { attr: "tasks", type: "AgentTask[]", defaultValue: "—", description: "任务及子状态。" },
  { attr: "variant", type: "'list' | 'capsules'", defaultValue: "'list'", description: "列表或胶囊。" },
];

export const DIFF_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "变更标题。" },
  { attr: "columns", type: "AgentDiffColumn[]", defaultValue: "—", description: "列定义。" },
  { attr: "rows", type: "AgentDiffRow[]", defaultValue: "—", description: "未变化、删除和新增的数据行。" },
  { attr: "onApply", type: "(ids: string[]) => void", defaultValue: "—", description: "应用已勾选变更。" },
];

export const CODE_PROPS: ApiTableRow[] = [
  { attr: "filename", type: "string", defaultValue: "—", description: "文件名。" },
  { attr: "lines", type: "string[]", defaultValue: "—", description: "完整代码。" },
  { attr: "diff", type: "AgentCodeDiffRow[]", defaultValue: "—", description: "用于展示代码修改差异的数据行。" },
];

export const INSIGHT_PROPS: ApiTableRow[] = [
  { attr: "cards", type: "InsightCard[]", defaultValue: "—", description: "洞察页。" },
  { attr: "onAsk", type: "(prompt, card) => void", defaultValue: "—", description: "点击建议问句。" },
];

export const SEARCH_PROPS: ApiTableRow[] = [
  { attr: "items", type: "CommandSearchItem[]", defaultValue: "—", description: "可搜索命令。" },
  { attr: "onSelect", type: "(item) => void", defaultValue: "—", description: "选中命令。" },
  { attr: "items[].icon / shortcut", type: "ReactNode / string", defaultValue: "—", description: "可选图标和快捷键提示；实际快捷键由应用处理。" },
  { attr: "locale", type: "'zh' | 'en'", defaultValue: "'zh'", description: "默认提示文字的语言，支持单独覆盖文案。" },
  { attr: "color / motion", type: "'blue' | 'purple' | 'black' / 'auto' | 'none'", defaultValue: "'blue' / 'auto'", description: "选中反馈的主题与动效偏好。" },
  { attr: "autoFocus", type: "boolean", defaultValue: "false", description: "挂载时聚焦搜索框，可用于弹窗内搜索。" },
];

export const FLOW_PROPS: ApiTableRow[] = [
  { attr: "nodes", type: "AgentFlowNode[]", defaultValue: "—", description: "触发、操作和条件节点。" },
  { attr: "edges", type: "AgentFlowEdge[]", defaultValue: "[]", description: "节点连线。" },
];

export const DIFF_ROWS = [
  { id: "pistachio", change: "keep" as const, cells: { flavor: "开心果", scoops: "186", action: "保留周末时段" } },
  { id: "rocky", change: "remove" as const, cells: { flavor: "坚果巧克力", scoops: "28", action: "从冷柜下架" } },
  { id: "mint", change: "add" as const, cells: { flavor: "薄荷巧克力", scoops: "94", action: "添加周六时段" } },
];

export const CODE_LINES = [
  "export async function scoreStockout(sku: string) {",
  "  const velocity = await readVelocity(sku);",
  "  return velocity.weekend > 80 ? 'reorder' : 'hold';",
  "}",
];

export const CODE_DIFF = [
  { old: 1, cur: 1, type: "ctx" as const, pieces: [{ text: "export async function scoreStockout(sku: string) {" }] },
  { old: 2, cur: null, type: "del" as const, pieces: [{ text: "  const velocity = await readVelocity(sku);", change: "del" as const }] },
  { old: null, cur: 2, type: "add" as const, pieces: [{ text: "  const velocity = await readVelocity(sku, { window: 'weekend' });", change: "add" as const }] },
  { old: 3, cur: 3, type: "ctx" as const, pieces: [{ text: "  return velocity.weekend > 80 ? 'reorder' : 'hold';" }] },
  { old: 4, cur: 4, type: "ctx" as const, pieces: [{ text: "}" }] },
];

export const CODE_THINKING = `<ThinkingTrace variant="steps" settled />`;

export const CODE_STREAM = `<StreamingAnswer
  text="开心果口味增长最快，本月销量提升了 23%。"
  sources={[{ name: "销量数据", domain: "scoopdata.io" }]}
  followUps={["冬季哪些口味最畅销"]}
/>

<StreamingAnswer
  key={message.id}
  text={message.text}
  status={message.status}
  format="markdown"
  onDone={() => showMessageActions(message.id)}
/>`;

export const CODE_APPROVAL = `<ApprovalCard questions={[{ id: "n", prompt: "我们应该推出几种口味？", options: [...] }]} />`;

export const CODE_TOOLS = `<ToolChips items={[{ id: "1", kind: "write", label: "写入 204 行", chip: "schedule.tsx" }]} />`;

export const CODE_TASKS = `<AgentTaskRows tasks={tasks} />`;

export const CODE_CONTEXT = `<ContextCards chunks={chunks} total={32} />`;

export const CODE_RECOMMEND = `<RecommendationCard title="要帮你提交这笔补货订单吗？" body="..." />`;

export const CODE_DIFF_TABLE = `<AgentDiffTable title="口味排期" columns={...} rows={...} />`;

export const CODE_CODE_BLOCK = `<AgentCodeBlock filename="lib/reorder.ts" lines={...} diff={...} />`;

export const CODE_INSIGHT = `<InsightCards cards={[{ title, body, chart }]} />`;

export const CODE_SEARCH = `<CommandSearch items={[{ id, label, group }]} />`;

export const CODE_FLOW = `<AgentFlowchart nodes={...} edges={...} />`;


export const KIT_CODE = {
  reasoning: `<Reasoning status={thinking ? "thinking" : "done"} startedAt={startedAt} duration={duration}
  steps={[{ id: "1", label: "读取本月退款单", sources: [{ title: "退款单列表", domain: "订单中心" }] }]} />`,
  indicator: `<ThinkingIndicator phases={["读取页面", "查询订单", "整理回答"]} startedAt={startedAt} />`,
  toolCall: `// 一次调用：状态由宿主驱动，失败可重试，需要确认时就地允许或拒绝
<ToolCall name="export_excel" summary="11 月退款明细" status={status} startedAt={startedAt}
  args={args} result={result} error={error} onRetry={retry} />
<ToolCall name="create_refund" title="发起退款" status="awaiting-approval" approvalReason="金额超过 500 元"
  onApprove={allow} onDeny={deny} />

// 一轮里的多次调用折成一行
<ToolCallGroup count={3} status="error">
  <ToolCall variant="row" name="search_orders" status="success" duration={1240} />
  <ToolCall variant="row" name="export_excel" status="error" error="导出服务超时" onRetry={retry} />
</ToolCallGroup>`,
  question: `<Question
  questions={[
    { id: "range", title: "统计哪段时间？", options: [{ id: "month", label: "本月", recommended: true }] },
    { id: "split", title: "按什么拆分？", multiple: true, options },
  ]}
  answers={answers}
  onSubmit={setAnswers}
/>`,
  approval: `<Approval requester="财务助手" title="给 3 位客户退款，共 ¥2,460" risk="high"
  fields={[{ label: "金额", after: "¥2,460" }]} scopes={["once", "session"]} askDenyReason expiresIn={60}
  state={state} onApprove={scope => approve(scope)} onDeny={reason => deny(reason)} />`,
  harness: `<ChoiceCard title="找到两个张三，改哪一个？" options={candidates} answered={picked} onAnswer={reply} />
<ConfirmCard title="修改张三的角色" fields={[{ label: "角色", before: "成员", after: "管理员" }]} state={state} result={receipt} onConfirm={confirm} onCancel={cancel} />`,
  cited: `<CitedAnswer text="本月退款 128 笔，比上月多 18%[1]。主要原因是尺码不符[1][2]。" sources={[{ id: 1, title: "11 月退款单汇总", quote: "…" }]} />`,
  composer: `<RunControls status={status} activity="正在核对第 3 张发票" startedAt={startedAt} onStop={stop} onResume={resume} onRetry={retry} onSteer={note => steer(note)} />
<PromptQueue items={queue} onMove={move} onEdit={edit} onSendNow={sendNext} onRemove={remove} />
<AttachmentList items={files} onRemove={remove} onRetry={retryUpload} />`,
  composerBar: `<ChatInputBar
  quickActions={[{ id: "report", label: "生成报表", kind: "docs", placeholder: "要哪段时间、看哪些指标？" }, …]}
  hasMessages={messages.length > 0}
  onSend={send}
/>`,
  composerParts: `<Composer quickActions={quickActions} hasMessages={messages.length > 0} onSend={send}>
  <ComposerHeader><AttachmentList items={files} /></ComposerHeader>
  <ComposerInput />
  <ComposerToolbar>
    <ComposerAction label="快捷操作" toggleQuickActions />
    <ComposerAction label="联网搜索" showLabel active={search} onClick={toggleSearch} />
    <span className="ml-auto flex items-center gap-2">
      <ComposerModelMenu models={models} model={model} onModelChange={setModel} />
      <ComposerSend />
    </span>
  </ComposerToolbar>
</Composer>`,
  conversations: `<ConversationList items={sessions} currentId={current} onSelect={open} onNew={newChat}
  onRename={rename} onDelete={remove} onPin={pin} />`,
  inlineDiff: `<InlineDiff
  segments={[{ type: "same", text: "本月退款" }, { type: "change", id: "1", before: "比较多", after: "128 笔", reason: "用数字" }]}
  onApply={text => save(text)}
/>`,
  welcome: `<AgentWelcome title="你好，我是运营助手" description="改数据前都会先问你。" />
<ChatInputBar quickActions={quickActions} hasMessages={false} onSend={send} />`,
  panel: `<AgentPanel title="Forge Agent" open={open} onOpenChange={setOpen} sessions={sessions} onNewChat={newChat}
  empty={<AgentWelcome size="sm" title="有什么可以帮你？" />} composer={{ onSend: send }}>
  {turns}
</AgentPanel>`,
  plan: `<AgentPlan title="11 月退款分析" steps={steps} mode={mode} onChange={setSteps} onApprove={run} onRetryFrom={retryFrom} />`,
  trail: `<AgentTrail title="月末对账 · 11 月" steps={[
  { id: "3", title: "核对差异", status: "running", activity: "第 3 张发票", startedAt, substeps },
  { id: "4", title: "提交对账结果", status: "waiting", waiting: <Approval … /> },
]} />
<RunProgress steps={harnessSteps} />`,
  checkpoints: `<AgentCheckpoints checkpoints={points} currentId={current} onRewind={rewind} />`,
  ledger: `<ChangeLedger entries={entries} onUndo={(id, alsoUndone) => undo([id, ...alsoUndone])} />`,
  autonomy: `<AutonomySelector value={level} onChange={setLevel} actions={[{ id: "e", label: "退款、付款", risk: "high" }]} />`,
  inbox: `<RunningNow tasks={tasks} onOpen={open} />
<AgentInbox tasks={tasks} onApprove={approve} onReject={reject} onRetry={retry} onOpen={open} />`,
  away: `<AwaySummary awayFor={awayMs} items={[{ id: "1", title: "退款审批", kind: "needs-you", onAction: open }]} onDismiss={dismiss} />`,
  context: `<ContextUsage limit={128_000} cost={0.38} segments={segments} onRemove={remove} onCompact={compact} />
<ContextUsage variant="inline" limit={128_000} segments={segments} />`,
  trace: `<TraceWaterfall spans={[{ id: "1", name: "规划", kind: "llm", start: 0, duration: 2100, tokens: 1800, cost: 0.004 }]} onSelect={select} />`,
  tree: `<AgentTree root={{ id: "lead", name: "运营主管", status: "running", children: [...] }} onSelect={select} />
<AgentLanes lanes={lanes} blocks={blocks} now={elapsed} />`,
};

export const CHOOSE: { need: string; use: string; avoid: string }[] = [
  { need: "等模型的第一个字", use: "ThinkingIndicator", avoid: "Reasoning（还没有内容时）" },
  { need: "模型的思考过程", use: "Reasoning；演示页用 ThinkingTrace", avoid: "把工具调用写进思考步骤" },
  { need: "工具调用", use: "ToolCall / ToolCallGroup；AI SDK 消息直接用 AgentParts", avoid: "给最终用户看大段参数 JSON" },
  { need: "缺信息要用户选", use: "Question；运行时候选用 ChoiceCard", avoid: "开放问题（直接用文字问）" },
  { need: "改数据前确认", use: "Approval；运行时提案用 ConfirmCard", avoid: "只读查询（不需要确认）" },
  { need: "给建议和备选", use: "RecommendationCard", avoid: "需要用户确认执行时" },
  { need: "回答正文", use: "StreamingAnswer；每句要出处用 CitedAnswer", avoid: "把来源堆在正文里" },
  { need: "AI 改写一段文字", use: "InlineDiff", avoid: "表格改动（AgentDiffTable）、代码改动（AgentCodeBlock）" },
  { need: "输入框", use: "ChatInputBar；要自己排布用 Composer 系列", avoid: "评论、搜索框" },
  { need: "历史对话", use: "ConversationList（AgentPanel 已内置）", avoid: "普通导航菜单" },
  { need: "多步任务", use: "先 AgentPlan，执行中 AgentTrail", avoid: "单次工具调用" },
  { need: "撤销智能体的改动", use: "ChangeLedger；回到某一步用 AgentCheckpoints", avoid: "单次确认" },
  { need: "后台任务", use: "AgentInbox、顶栏 RunningNow、回来时 AwaySummary", avoid: "一次对话里的步骤" },
  { need: "上下文、耗时、花费", use: "ContextUsage、TraceWaterfall、AgentTree / AgentLanes", avoid: "业务指标（用 StatCard 和图表）" },
];
