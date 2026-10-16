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
import { PageHeading, Section, SubSection } from "../_shared";
import { DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

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
} from "@forge-ui-official/core";`;

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

function AgentApi({
  id,
  name,
  descriptions,
}: {
  id: string;
  name: "ThinkingTrace" | "StreamingAnswer" | "ApprovalCard" | "ToolChips" | "AgentTaskRows" | "ContextCards" | "RecommendationCard" | "AgentDiffTable" | "AgentCodeBlock" | "InsightCards" | "CommandSearch" | "AgentFlowchart";
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
        hint="展示智能体的思考、回答、工具调用、任务和审批过程。"
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

      <Section title="例子" description="回答、确认、工具、任务和流程各留一个。">
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

      <Section title="API">
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
