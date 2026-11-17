"use client";

import Link from "next/link";
import { CompleteApiReference } from "../_complete-api-reference";
import { componentLabel } from "../_labels";
import {
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
} from "@forge-ui-official/core";
import { StreamingAnswerDemo } from "../../cases/agent/_streaming-demo";
import { ApprovalPartsDemo, ArtifactDemo, ConversationDemo, PartsDemo } from "./_conversation-demo";
import {
  AgentPlanDemo,
  AgentTrailDemo,
  ApprovalDemo,
  AutonomyDemo,
  AwayDemo,
  CheckpointsDemo,
  CitedAnswerDemo,
  ComposerPartsDemo,
  ContextDemo,
  HarnessCardsDemo,
  InboxDemo,
  LedgerDemo,
  PanelDemo,
  QuestionDemo,
  ReasoningDemo,
  ThinkingIndicatorDemo,
  ToolCallDemo,
  TraceDemo,
  TreeDemo,
  WelcomeDemo,
} from "./_kit-demos";
import { PageHeading, Section, SubSection } from "../_shared";
import { DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";
import type apiData from "../_agent-api-data.json";

const CODE_IMPORT = `import {
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

const CODE_CONVERSATION = `<Conversation followKey={messages.length}>
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

const CODE_PARTS = `// AI SDK v5：const { messages, status } = useChat();
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

const CODE_APPROVAL_PARTS = `// AI SDK 7：服务端 streamText({ toolApproval: { createPurchaseOrder: "user-approval" } })
const { messages, status, addToolApprovalResponse } = useChat();

<AgentParts parts={message.parts} status={status} onToolApproval={addToolApprovalResponse} />`;

const CODE_ARTIFACT = `<ArtifactCard title="十一月运营周报.md" kind="document" meta="Markdown · 4.2 KB" onOpen={open} onDownload={download} />
<ArtifactCard title="周报.md" status="generating" />
<ArtifactCard title="渠道对账.xlsx" kind="table" status="error" />`;

const CONVERSATION_ROWS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "消息列表。" },
  { attr: "followKey", type: "unknown", defaultValue: "—", description: "有新内容时变化（消息数、流式长度）。读者停在底部时自动跟随；上翻后停止跟随并出现“回到最新”。" },
  { attr: "latestLabel", type: "string", defaultValue: "回到最新", description: "回到底部按钮的文字。" },
  { attr: "locale / motion / className", type: "'zh' | 'en' / 'auto' | 'none' / string", defaultValue: "'zh' / 'auto'", description: "语言、动效偏好和外层类名。" },
];
const MESSAGE_ROWS: ApiTableRow[] = [
  { attr: "role", type: "'user' | 'assistant'", defaultValue: "—", description: "用户消息是右侧气泡；助手回复整宽显示，带头像。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "消息内容；助手回复通常放 AgentParts。" },
  { attr: "name / time / avatar", type: "string / string / ReactNode", defaultValue: "—", description: "助手名称、时间和头像。" },
  { attr: "actions", type: "ReactNode", defaultValue: "—", description: "回复下方的操作，通常是 MessageActions。" },
];
const ACTIONS_ROWS: ApiTableRow[] = [
  { attr: "copyText", type: "string", defaultValue: "—", description: "传了才显示复制按钮。" },
  { attr: "onRetry", type: "() => void", defaultValue: "—", description: "传了才显示重新生成。" },
  { attr: "onFeedback / feedback", type: "(value: 'up' | 'down' | null) => void / MessageFeedback", defaultValue: "—", description: "传了才显示有帮助、没帮助；再点一次取消。传 feedback 时受控。" },
  { attr: "versions", type: "{ current: number; total: number; onChange }", defaultValue: "—", description: "重新生成过的回答显示“2/3”和上一版、下一版；current 从 0 开始。" },
  { attr: "onEdit", type: "() => void", defaultValue: "—", description: "传了才显示编辑，通常放在用户消息上，编辑后重发。" },
  { attr: "feedbackReasons / onFeedbackReason", type: "string[] / (reason: string) => void", defaultValue: "—", description: "点了没帮助后给出原因选项，例如“数据不对”“太长”。" },
  { attr: "labels / locale", type: "Partial<Record<'copy' | 'copied' | 'retry' | 'up' | 'down' | 'edit' | 'previous' | 'next', string>> / 'zh' | 'en'", defaultValue: "'zh'", description: "按钮文字和无障碍名称。" },
];
const SUGGESTION_ROWS: ApiTableRow[] = [
  { attr: "suggestions", type: "string[]", defaultValue: "—", description: "推荐提问，空数组时不渲染。" },
  { attr: "onSelect", type: "(text: string, index: number) => void", defaultValue: "—", description: "点了某个提问。" },
  { attr: "label", type: "string", defaultValue: "—", description: "上方小标题。" },
];
const ARTIFACT_ROWS: ApiTableRow[] = [
  { attr: "title / meta", type: "string", defaultValue: "—", description: "文件名和一行说明（格式、大小）。" },
  { attr: "kind", type: "'document' | 'code' | 'table' | 'image' | 'file'", defaultValue: "'document'", description: "决定图标。" },
  { attr: "status", type: "'generating' | 'ready' | 'error'", defaultValue: "'ready'", description: "生成中和失败时隐藏打开、下载。" },
  { attr: "onOpen / onDownload", type: "() => void", defaultValue: "—", description: "传了才显示对应按钮。" },
];
const PARTS_ROWS: ApiTableRow[] = [
  { attr: "parts", type: "AgentMessagePart[]", defaultValue: "—", description: "AI SDK UIMessage 的 parts。text 用 Markdown 流式显示，reasoning 可折叠，连续的 tool-* 合成一组，source-url 挂在回答下，file 显示为产物卡片；未知类型忽略。" },
  { attr: "status", type: "'submitted' | 'streaming' | 'ready' | 'error'", defaultValue: "'ready'", description: "useChat 的 status；streaming 时最后一段文本逐字显示。" },
  { attr: "renderTool", type: "Record<string, (part: AgentToolPart) => ReactNode>", defaultValue: "{}", description: "按工具名把完成的工具调用换成自己的组件（生成式界面）；返回 null 时仍显示工具记录。" },
  { attr: "onOpenFile", type: "(file: { url; filename?; mediaType }) => void", defaultValue: "—", description: "点产物卡片的打开。" },
  { attr: "onToolApproval", type: "(response: { id; approved; reason? }) => void", defaultValue: "—", description: "工具需要确认（AI SDK 6 起的 approval-requested）时显示允许、拒绝；直接传 useChat 的 addToolApprovalResponse。不传时只显示“等待确认”。被拒绝的调用在工具组里标为已停止。" },
];

const THINKING_PROPS: ApiTableRow[] = [
  { attr: "variant", type: "'steps' | 'reasoning' | 'search' | 'coding'", defaultValue: "'steps'", description: "处理过程的展示类型。" },
  { attr: "rows", type: "ThinkingRow[]", defaultValue: "内置示例", description: "覆盖默认步骤。" },
  { attr: "settled", type: "boolean", defaultValue: "false", description: "直接显示完成态。" },
  { attr: "play", type: "boolean", defaultValue: "true", description: "自动逐条展开。" },
  { attr: "onSettled", type: "() => void", defaultValue: "—", description: "全部展开后回调。" },
];

const STREAM_PROPS: ApiTableRow[] = [
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

const APPROVAL_PROPS: ApiTableRow[] = [
  { attr: "questions", type: "ApprovalQuestion[]", defaultValue: "—", description: "需要用户逐项确认的问题列表。" },
  { attr: "onSubmitted", type: "(answers) => void", defaultValue: "—", description: "全部答完或发送。" },
];

const TASK_PROPS: ApiTableRow[] = [
  { attr: "tasks", type: "AgentTask[]", defaultValue: "—", description: "任务及子状态。" },
  { attr: "variant", type: "'list' | 'capsules'", defaultValue: "'list'", description: "列表或胶囊。" },
];

const DIFF_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "变更标题。" },
  { attr: "columns", type: "AgentDiffColumn[]", defaultValue: "—", description: "列定义。" },
  { attr: "rows", type: "AgentDiffRow[]", defaultValue: "—", description: "未变化、删除和新增的数据行。" },
  { attr: "onApply", type: "(ids: string[]) => void", defaultValue: "—", description: "应用已勾选变更。" },
];

const CODE_PROPS: ApiTableRow[] = [
  { attr: "filename", type: "string", defaultValue: "—", description: "文件名。" },
  { attr: "lines", type: "string[]", defaultValue: "—", description: "完整代码。" },
  { attr: "diff", type: "AgentCodeDiffRow[]", defaultValue: "—", description: "用于展示代码修改差异的数据行。" },
];

const INSIGHT_PROPS: ApiTableRow[] = [
  { attr: "cards", type: "InsightCard[]", defaultValue: "—", description: "洞察页。" },
  { attr: "onAsk", type: "(prompt, card) => void", defaultValue: "—", description: "点击建议问句。" },
];

const SEARCH_PROPS: ApiTableRow[] = [
  { attr: "items", type: "CommandSearchItem[]", defaultValue: "—", description: "可搜索命令。" },
  { attr: "onSelect", type: "(item) => void", defaultValue: "—", description: "选中命令。" },
  { attr: "items[].icon / shortcut", type: "ReactNode / string", defaultValue: "—", description: "可选图标和快捷键提示；实际快捷键由应用处理。" },
  { attr: "locale", type: "'zh' | 'en'", defaultValue: "'zh'", description: "默认提示文字的语言，支持单独覆盖文案。" },
  { attr: "color / motion", type: "'blue' | 'purple' | 'black' / 'auto' | 'none'", defaultValue: "'blue' / 'auto'", description: "选中反馈的主题与动效偏好。" },
  { attr: "autoFocus", type: "boolean", defaultValue: "false", description: "挂载时聚焦搜索框，可用于弹窗内搜索。" },
];

const FLOW_PROPS: ApiTableRow[] = [
  { attr: "nodes", type: "AgentFlowNode[]", defaultValue: "—", description: "触发、操作和条件节点。" },
  { attr: "edges", type: "AgentFlowEdge[]", defaultValue: "[]", description: "节点连线。" },
];

const DIFF_ROWS = [
  { id: "pistachio", change: "keep" as const, cells: { flavor: "开心果", scoops: "186", action: "保留周末时段" } },
  { id: "rocky", change: "remove" as const, cells: { flavor: "坚果巧克力", scoops: "28", action: "从冷柜下架" } },
  { id: "mint", change: "add" as const, cells: { flavor: "薄荷巧克力", scoops: "94", action: "添加周六时段" } },
];

const CODE_LINES = [
  "export async function scoreStockout(sku: string) {",
  "  const velocity = await readVelocity(sku);",
  "  return velocity.weekend > 80 ? 'reorder' : 'hold';",
  "}",
];

const CODE_DIFF = [
  { old: 1, cur: 1, type: "ctx" as const, pieces: [{ text: "export async function scoreStockout(sku: string) {" }] },
  { old: 2, cur: null, type: "del" as const, pieces: [{ text: "  const velocity = await readVelocity(sku);", change: "del" as const }] },
  { old: null, cur: 2, type: "add" as const, pieces: [{ text: "  const velocity = await readVelocity(sku, { window: 'weekend' });", change: "add" as const }] },
  { old: 3, cur: 3, type: "ctx" as const, pieces: [{ text: "  return velocity.weekend > 80 ? 'reorder' : 'hold';" }] },
  { old: 4, cur: 4, type: "ctx" as const, pieces: [{ text: "}" }] },
];

const CODE_THINKING = `<ThinkingTrace variant="steps" settled />`;

const CODE_STREAM = `<StreamingAnswer
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

const CODE_APPROVAL = `<ApprovalCard questions={[{ id: "n", prompt: "我们应该推出几种口味？", options: [...] }]} />`;

const CODE_TOOLS = `<ToolChips items={[{ id: "1", kind: "write", label: "写入 204 行", chip: "schedule.tsx" }]} />`;

const CODE_TASKS = `<AgentTaskRows tasks={tasks} />`;

const CODE_CONTEXT = `<ContextCards chunks={chunks} total={32} />`;

const CODE_RECOMMEND = `<RecommendationCard title="要帮你提交这笔补货订单吗？" body="..." />`;

const CODE_DIFF_TABLE = `<AgentDiffTable title="口味排期" columns={...} rows={...} />`;

const CODE_CODE_BLOCK = `<AgentCodeBlock filename="lib/reorder.ts" lines={...} diff={...} />`;

const CODE_INSIGHT = `<InsightCards cards={[{ title, body, chart }]} />`;

const CODE_SEARCH = `<CommandSearch items={[{ id, label, group }]} />`;

const CODE_FLOW = `<AgentFlowchart nodes={...} edges={...} />`;


const KIT_CODE = {
  reasoning: `<Reasoning status={thinking ? "thinking" : "done"} startedAt={startedAt} duration={duration}
  steps={[{ id: "1", label: "读取本月退款单", sources: [{ title: "退款单列表", domain: "订单中心" }] }]} />`,
  indicator: `<ThinkingIndicator phases={["读取页面", "查询订单", "整理回答"]} startedAt={startedAt} />`,
  toolCall: `<ToolCallGroup count={3} status="error">
  <ToolCall variant="row" name="search_orders" status="success" duration={1240} args={args} result={result} />
  <ToolCall variant="row" name="export_excel" status="error" error="导出服务超时" onRetry={retry} />
</ToolCallGroup>
<ToolCall name="create_refund" title="发起退款" status="awaiting-approval" approvalReason="金额超过 500 元" onApprove={allow} onDeny={deny} />`,
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
  welcome: `<AgentWelcome title="你好，我是运营助手" description="改数据前都会先问你。" capabilities={capabilities} onPick={send} />`,
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

function AgentApi({
  id,
  name,
  descriptions,
}: {
  id: string;
  name: keyof typeof apiData;
  descriptions?: ApiTableRow[];
}) {
  return (
    <div id={`api-${id}`} className="flex scroll-mt-24 flex-col gap-2">
      <h3 className="text-sm font-semibold tracking-fg text-fg-black">{componentLabel(name)}</h3>
      {descriptions ? (
        <CompleteApiReference name={name} descriptions={descriptions} />
      ) : (
        <CompleteApiReference name={name} />
      )}
    </div>
  );
}

export default function AgentSpecPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="智能体"
        hint="智能体界面的整套组件：对话与输入、思考与工具、提问与确认、回答与引用、运行、治理、运营和观测；可以直接渲染 AI SDK 的消息。"
      />

      <p className="text-sm leading-6 text-fg-grey-700">
        消息输入、智能体提及、附件和生成控制请查看
        <Link href="/components/chat-input-bar" className="ml-1 text-fg-blue underline underline-offset-4">消息输入栏</Link>。
      </p>

      <Section title="用法" description="从已经展开的思考步骤开始。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample
            id="thinkingtrace"
            title="ThinkingTrace"
            summary="步骤直接停在完成态，方便看清整段推理。"
            code={CODE_THINKING}
            minHeight={200}
          >
            <div className="w-full max-w-lg">
              <ThinkingTrace variant="steps" settled />
            </div>
          </DocExample>
        </SubSection>
      </Section>


      <Section title="思考与工具" description="思考、等待和工具调用都由宿主驱动：状态、计时和展开都跟着你给的数据走。">
        <ExampleGrid>
          <DocExample id="reasoning" title="Reasoning" summary="思考中实时计时，结束后折成“思考了 3.2 秒 · 3 步”。点“重新思考”看完整过程。" code={KIT_CODE.reasoning} minHeight={220}><ReasoningDemo /></DocExample>
          <DocExample id="thinkingindicator" title="ThinkingIndicator" summary="第一个字出来前的等待：固定文案，或按阶段轮换并计时。" code={KIT_CODE.indicator} minHeight={120}><ThinkingIndicatorDemo /></DocExample>
        </ExampleGrid>
        <DocExample id="toolcall" title="ToolCall / ToolCallGroup" summary="一次调用一行：状态、计时、摘要，展开看参数和结果；失败可重试，需要确认时就地允许或拒绝。" code={KIT_CODE.toolCall} minHeight={300}><ToolCallDemo /></DocExample>
      </Section>

      <Section title="提问与确认" description="智能体缺信息时先问，改数据前先确认。答完、确认完都折成一行结果。">
        <ExampleGrid>
          <DocExample id="question" title="Question" summary="一次问几件事：数字键选择、回车继续，可多选、可补充文字。" code={KIT_CODE.question} minHeight={300}><QuestionDemo /></DocExample>
          <DocExample id="approval" title="Approval" summary="风险等级、改动明细、“仅这次 / 本次对话都允许”，拒绝时可以说明原因，倒计时在指针悬停时暂停。" code={KIT_CODE.approval} minHeight={300}><ApprovalDemo /></DocExample>
        </ExampleGrid>
        <DocExample id="choicecard" title="ChoiceCard / ConfirmCard" summary="Forge Agent 运行时（服务端会话、候选校验、签名确认、保存回执）用的两张卡，是 Question 和 Approval 的简写。" code={KIT_CODE.harness} minHeight={240}><HarnessCardsDemo /></DocExample>
      </Section>

      <Section title="回答与引用" description="回答里的每个结论都能回到出处。">
        <DocExample id="citedanswer" title="CitedAnswer" summary="指向角标会高亮它支撑的那句话和下方来源，并预览原文摘录。" code={KIT_CODE.cited} minHeight={220}><CitedAnswerDemo /></DocExample>
      </Section>

      <Section title="输入与面板" description="输入框周围的东西：运行控制、排队消息、附件，以及空状态和侧边面板。">
        <ExampleGrid>
          <DocExample id="runcontrols" title="RunControls / PromptQueue / AttachmentList" summary="运行中可以停止、插一句；停下后继续或重试。回答没结束时写的消息先排队，可调序、编辑、提前发。" code={KIT_CODE.composer} minHeight={320}><ComposerPartsDemo /></DocExample>
          <DocExample id="agentwelcome" title="AgentWelcome" summary="空对话：它是谁、能做什么，点能力卡直接开始。" code={KIT_CODE.welcome} minHeight={320}><WelcomeDemo /></DocExample>
        </ExampleGrid>
        <DocExample id="agentpanel" title="AgentPanel" summary="右侧面板：历史对话、新对话、消息区和输入框；宽屏时页面让出面板宽度。" code={KIT_CODE.panel} minHeight={120}><PanelDemo /></DocExample>
      </Section>

      <Section title="运行" description="多步任务：先给计划、跑起来看轨迹、随时回到检查点。">
        <ExampleGrid>
          <DocExample id="agentplan" title="AgentPlan" summary="执行前可改名、调序、删改步骤；执行时逐步计时，失败的一步可以从这里重试。" code={KIT_CODE.plan} minHeight={360}><AgentPlanDemo /></DocExample>
          <DocExample id="agenttrail" title="AgentTrail / RunProgress" summary="当前做到第几步、在做什么、子步骤和计时；等你确认的一步就地放审批。" code={KIT_CODE.trail} minHeight={360}><AgentTrailDemo /></DocExample>
        </ExampleGrid>
        <DocExample id="agentcheckpoints" title="AgentCheckpoints" summary="像 git 一样回到任意一步重来，放弃的尝试淡出但保留。" code={KIT_CODE.checkpoints} minHeight={200}><CheckpointsDemo /></DocExample>
      </Section>

      <Section title="治理" description="智能体改过什么、能自己做多少，都摆在明面上。">
        <ExampleGrid>
          <DocExample id="changeledger" title="ChangeLedger" summary="每项改动有前后对比和撤销；撤销前列出会一并撤销的后续改动，发出去的邮件标为不可撤销。" code={KIT_CODE.ledger} minHeight={360}><LedgerDemo /></DocExample>
          <DocExample id="autonomyselector" title="AutonomySelector" summary="谨慎、平衡、放手三档，真实操作按“自己做 / 先问你”分好。" code={KIT_CODE.autonomy} minHeight={260}><AutonomyDemo /></DocExample>
        </ExampleGrid>
      </Section>

      <Section title="运营" description="后台任务多了以后：哪些在跑、哪些等你、离开时发生了什么。">
        <ExampleGrid>
          <DocExample id="agentinbox" title="AgentInbox / RunningNow" summary="待你处理排在最前，运行中实时计时，展开看最近几步并就地处理。" code={KIT_CODE.inbox} minHeight={380}><InboxDemo /></DocExample>
          <DocExample id="awaysummary" title="AwaySummary" summary="回来时先看这张：离开多久、要你处理的、没做成的、做完的。" code={KIT_CODE.away} minHeight={320}><AwayDemo /></DocExample>
        </ExampleGrid>
      </Section>

      <Section title="观测" description="上下文、耗时、花费和多智能体协作。">
        <ExampleGrid>
          <DocExample id="contextusage" title="ContextUsage" summary="上下文被什么占着：可以把文件移出去，或压缩早期对话。" code={KIT_CODE.context} minHeight={320}><ContextDemo /></DocExample>
          <DocExample id="agenttree" title="AgentTree / AgentLanes" summary="谁派了谁、每个在做什么、花费按分支汇总；泳道看每个智能体的时间线。" code={KIT_CODE.tree} minHeight={380}><TreeDemo /></DocExample>
        </ExampleGrid>
        <DocExample id="tracewaterfall" title="TraceWaterfall" summary="一次运行的时间和钱花在哪：模型调用、工具和子智能体按时间排开。" code={KIT_CODE.trace} minHeight={280}><TraceDemo /></DocExample>
      </Section>

      <Section title="例子" description="早期的展示组件：分步思考动画、推荐卡、变更审核表、洞察卡等，适合静态页面和演示。">
        <ExampleGrid>
          <DocExample
            id="streaminganswer"
            title="StreamingAnswer"
            summary="回答带上来源和后续追问，也可以按接收进度逐段淡入。"
            code={CODE_STREAM}
            minHeight={360}
          >
            <div className="flex w-full max-w-3xl flex-col gap-8">
              <div className="w-full max-w-lg">
                <StreamingAnswer
                  text="开心果口味增长最快，本月销量提升了 23%。"
                  sources={[
                    { name: "销量数据", domain: "scoopdata.io" },
                    { name: "趋势指标", domain: "trends.google.com" },
                  ]}
                  followUps={["冬季哪些口味最畅销"]}
                />
              </div>
              <StreamingAnswerDemo />
            </div>
          </DocExample>

          <DocExample id="approvalcard" title="ApprovalCard" summary="把选项列出来，等用户选定后再继续。" code={CODE_APPROVAL} minHeight={260}>
            <div className="w-full max-w-lg">
              <ApprovalCard
                questions={[
                  {
                    id: "count",
                    prompt: "我们应该推出几种口味？",
                    options: [
                      { id: "three", label: "三项推荐" },
                      { id: "five", label: "五项推荐" },
                      { id: "one", label: "单项重点推荐" },
                    ],
                  },
                ]}
              />
            </div>
          </DocExample>

          <DocExample id="toolchips" title="ToolChips" summary="一次调用里同时看到思考、写入和文件增删。" code={CODE_TOOLS} minHeight={180}>
            <div className="w-full max-w-lg">
              <ToolChips
                summary="调用工具 2 次"
                items={[
                  {
                    id: "think",
                    kind: "think",
                    label: "思考中",
                    chip: "正在安排生产计划…",
                    detail: [{ text: "周末需求带动了开心果口味的销量。" }],
                  },
                  {
                    id: "write",
                    kind: "write",
                    label: "写入 204 行",
                    chip: "ChurnSchedule.tsx",
                    mono: true,
                    detail: [{ text: "+ return schedule(windows)", tone: "add" }],
                  },
                ]}
                diffs={[{ file: "ChurnSchedule.tsx", add: 74, del: 41 }]}
              />
            </div>
          </DocExample>

          <DocExample id="agenttaskrows" title="AgentTaskRows" summary="任务带上完成、失败和进行中的子项。" code={CODE_TASKS} minHeight={200}>
            <div className="w-full max-w-lg">
              <AgentTaskRows
                tasks={[
                  {
                    id: "1",
                    title: "已验证供应商资料",
                    status: "completed",
                    meta: "12 家供应商",
                    children: [
                      { label: "已核对税务编号", value: "12/12", status: "completed" },
                      { label: "已标记过期资料", value: "2", status: "failed" },
                    ],
                  },
                  {
                    id: "2",
                    title: "起草供应商邮件",
                    status: "running",
                    meta: "2 条消息",
                  },
                ]}
              />
            </div>
          </DocExample>

          <DocExample id="contextcards" title="ContextCards" summary="检索到的段落带上来源文件和字数。" code={CODE_CONTEXT} minHeight={200}>
            <div className="w-full max-w-lg">
              <ContextCards
                total={32}
                chunks={[
                  {
                    id: "1",
                    title: "供应商准入规则",
                    body: "新增乳制品供应商前，须核验冷链认证，才可加入补货流程。",
                    sourceKind: "PDF",
                    sourceLabel: "乳品供应商入驻流程.pdf",
                    charCount: 290,
                  },
                ]}
              />
            </div>
          </DocExample>

          <DocExample id="recommendationcard" title="RecommendationCard" summary="主建议下面列出可以替换的备选方案。" code={CODE_RECOMMEND} minHeight={240}>
            <div className="w-full max-w-lg">
              <RecommendationCard
                title="要帮你提交这笔补货订单吗？"
                body="向华丰食品补订华夫甜筒，交货周期为 7 天。"
                alternatives={[
                  { id: "vanilla", label: "改用马达加斯加香草", confidence: "review" },
                  { id: "full", label: "为全部商品补货", confidence: "none" },
                ]}
              />
            </div>
          </DocExample>

          <DocExample id="agentdifftable" title="AgentDiffTable" summary="保留、删除和新增的行放在同一张审核表里。" code={CODE_DIFF_TABLE} minHeight={280}>
            <div className="w-full max-w-2xl">
              <AgentDiffTable
                title="口味排期"
                columns={[
                  { key: "flavor", label: "口味" },
                  { key: "scoops", label: "每周销量" },
                  { key: "action", label: "操作" },
                ]}
                rows={DIFF_ROWS}
              />
            </div>
          </DocExample>

          <DocExample id="agentcodeblock" title="AgentCodeBlock" summary="文件名下面同时给出完整代码和增删行。" code={CODE_CODE_BLOCK} minHeight={280}>
            <div className="w-full max-w-2xl">
              <AgentCodeBlock filename="lib/reorder.ts" lines={CODE_LINES} diff={CODE_DIFF} />
            </div>
          </DocExample>

          <DocExample id="insightcards" title="InsightCards" summary="每张卡用一句摘要配上折线、柱状或占比。" code={CODE_INSIGHT} minHeight={280}>
            <div className="w-full max-w-lg">
              <InsightCards
                cards={[
                  {
                    id: "weekend",
                    title: "周末销售速度",
                    body: "薄荷巧克力在周六的销量已接近开心果。",
                    prompt: "调整周末冷柜库存",
                    chart: { kind: "spark", series: [{ name: "薄荷", values: [42, 48, 61, 74, 88, 94], tone: "violet" }] },
                  },
                  {
                    id: "mix",
                    title: "口味组合",
                    body: "坚果巧克力口味的周销量已低于 40 份。",
                    prompt: "下架坚果巧克力口味",
                    chart: { kind: "bars", values: [86, 72, 54, 28, 41] },
                  },
                  {
                    id: "share",
                    title: "销量占比",
                    body: "开心果仍是当季主力口味。",
                    chart: {
                      kind: "segments",
                      items: [
                        { label: "开心果", pct: 46, tone: "violet" },
                        { label: "薄荷", pct: 31, tone: "green" },
                        { label: "其他", pct: 23, tone: "yellow" },
                      ],
                    },
                  },
                ]}
              />
            </div>
          </DocExample>

          <DocExample id="commandsearch" title="CommandSearch" summary="命令按规划、数据和流程分组，输入后即时筛选。" code={CODE_SEARCH} minHeight={280}>
            <div className="w-full max-w-lg">
              <CommandSearch
                items={[
                  { id: "plan", label: "起草项目计划", hint: "/plan", group: "规划" },
                  { id: "compare", label: "对比上季度数据", hint: "/compare", group: "规划" },
                  { id: "pos", label: "打开销售报表", hint: "CSV", group: "数据" },
                  { id: "reorder", label: "创建采购任务", hint: "/task", group: "流程" },
                ]}
              />
            </div>
          </DocExample>

          <DocExample id="agentflowchart" title="AgentFlowchart" summary="触发、条件和动作连成一条补货流程。" code={CODE_FLOW} minHeight={360}>
            <div className="w-full max-w-lg">
              <AgentFlowchart
                title="补货流程"
                nodes={[
                  { id: "spike", kind: "trigger", title: "周末收银数据峰值", body: "薄荷巧克力销量超过 80 份。" },
                  { id: "check", kind: "condition", title: "是否存在缺货风险？", body: "交货周期超过 5 天。" },
                  { id: "draft", kind: "action", title: "起草补货单", body: "华丰食品，交货周期 7 天。" },
                ]}
                edges={[
                  { from: "spike", to: "check", label: "始终执行" },
                  { from: "check", to: "draft", label: "存在缺货风险时" },
                ]}
              />
            </div>
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="对话" description="把模型回复直接渲染成 Forge 组件：消息、操作、推荐提问、产物，以及 AI SDK 消息的适配。">
        <DocExample id="conversation" title="Conversation" summary="可以输入或点推荐提问；新回复自动跟随，上翻后出现“回到最新”。" code={CODE_CONVERSATION} minHeight={460}>
          <ConversationDemo />
        </DocExample>
        <DocExample id="agentparts" title="AgentParts" summary="一条 AI SDK 消息里的思考、两次工具调用、回答、来源和文件；打开开关后库存查询换成自定义卡片。" code={CODE_PARTS} minHeight={420}>
          <PartsDemo />
        </DocExample>
        <DocExample id="toolapproval" title="AgentParts 工具确认" summary="会改数据的工具先让用户允许或拒绝，再继续执行。" code={CODE_APPROVAL_PARTS} minHeight={300}>
          <ApprovalPartsDemo />
        </DocExample>
        <DocExample id="artifactcard" title="ArtifactCard" summary="生成中、已完成和失败三种状态。" code={CODE_ARTIFACT} minHeight={260}>
          <ArtifactDemo />
        </DocExample>
      </Section>

      <Section title="API">
        <AgentApi id="conversation" name="Conversation" descriptions={CONVERSATION_ROWS} />
        <AgentApi id="agentmessage" name="AgentMessage" descriptions={MESSAGE_ROWS} />
        <AgentApi id="messageactions" name="MessageActions" descriptions={ACTIONS_ROWS} />
        <AgentApi id="promptsuggestions" name="PromptSuggestions" descriptions={SUGGESTION_ROWS} />
        <AgentApi id="artifactcard" name="ArtifactCard" descriptions={ARTIFACT_ROWS} />
        <AgentApi id="agentparts" name="AgentParts" descriptions={PARTS_ROWS} />
        <AgentApi id="reasoning" name="Reasoning" />
        <AgentApi id="thinkingindicator" name="ThinkingIndicator" />
        <AgentApi id="toolcall" name="ToolCall" />
        <AgentApi id="toolcallgroup" name="ToolCallGroup" />
        <AgentApi id="question" name="Question" />
        <AgentApi id="approval" name="Approval" />
        <AgentApi id="choicecard" name="ChoiceCard" />
        <AgentApi id="confirmcard" name="ConfirmCard" />
        <AgentApi id="citation" name="Citation" />
        <AgentApi id="citedanswer" name="CitedAnswer" />
        <AgentApi id="runcontrols" name="RunControls" />
        <AgentApi id="promptqueue" name="PromptQueue" />
        <AgentApi id="attachmentlist" name="AttachmentList" />
        <AgentApi id="agentwelcome" name="AgentWelcome" />
        <AgentApi id="agentpanel" name="AgentPanel" />
        <AgentApi id="agentplan" name="AgentPlan" />
        <AgentApi id="agenttrail" name="AgentTrail" />
        <AgentApi id="runprogress" name="RunProgress" />
        <AgentApi id="agentcheckpoints" name="AgentCheckpoints" />
        <AgentApi id="changeledger" name="ChangeLedger" />
        <AgentApi id="autonomyselector" name="AutonomySelector" />
        <AgentApi id="agentinbox" name="AgentInbox" />
        <AgentApi id="runningnow" name="RunningNow" />
        <AgentApi id="awaysummary" name="AwaySummary" />
        <AgentApi id="contextusage" name="ContextUsage" />
        <AgentApi id="tracewaterfall" name="TraceWaterfall" />
        <AgentApi id="agenttree" name="AgentTree" />
        <AgentApi id="agentlanes" name="AgentLanes" />
        <AgentApi id="thinkingtrace" name="ThinkingTrace" descriptions={THINKING_PROPS} />
        <AgentApi id="streaminganswer" name="StreamingAnswer" descriptions={STREAM_PROPS} />
        <AgentApi id="approvalcard" name="ApprovalCard" descriptions={APPROVAL_PROPS} />
        <AgentApi id="toolchips" name="ToolChips" />
        <AgentApi id="agenttaskrows" name="AgentTaskRows" descriptions={TASK_PROPS} />
        <AgentApi id="contextcards" name="ContextCards" />
        <AgentApi id="recommendationcard" name="RecommendationCard" />
        <AgentApi id="agentdifftable" name="AgentDiffTable" descriptions={DIFF_PROPS} />
        <AgentApi id="agentcodeblock" name="AgentCodeBlock" descriptions={CODE_PROPS} />
        <AgentApi id="insightcards" name="InsightCards" descriptions={INSIGHT_PROPS} />
        <AgentApi id="commandsearch" name="CommandSearch" descriptions={SEARCH_PROPS} />
        <AgentApi id="agentflowchart" name="AgentFlowchart" descriptions={FLOW_PROPS} />
      </Section>
    </div>
  );
}
