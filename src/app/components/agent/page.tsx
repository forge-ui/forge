"use client";

import Link from "next/link";
import {
  ThinkingTrace,
  StreamingAnswer,
  ApprovalCard,
  ToolChips,
  AgentTaskRows,
  PromptBar,
  ContextCards,
  RecommendationCard,
  AgentDiffTable,
  AgentCodeBlock,
  InsightCards,
  CommandSearch,
  AgentFlowchart,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  ThinkingTrace,
  StreamingAnswer,
  ApprovalCard,
  ToolChips,
  AgentTaskRows,
  PromptBar,
  ContextCards,
  RecommendationCard,
  AgentDiffTable,
  AgentCodeBlock,
  InsightCards,
  CommandSearch,
  AgentFlowchart,
} from "@forge-ui-official/core";`;

const THINKING_PROPS: ApiTableRow[] = [
  { attr: "variant", type: "'steps' | 'reasoning' | 'search' | 'coding'", defaultValue: "'steps'", description: "痕迹类型。" },
  { attr: "rows", type: "ThinkingRow[]", defaultValue: "内置示例", description: "覆盖默认步骤。" },
  { attr: "settled", type: "boolean", defaultValue: "false", description: "直接显示完成态。" },
  { attr: "play", type: "boolean", defaultValue: "true", description: "自动逐条展开。" },
  { attr: "onSettled", type: "() => void", defaultValue: "—", description: "全部展开后回调。" },
];

const STREAM_PROPS: ApiTableRow[] = [
  { attr: "text", type: "string", defaultValue: "—", description: "回答正文。" },
  { attr: "streaming", type: "boolean", defaultValue: "false", description: "按词揭示；真实流式由宿主改 text。" },
  { attr: "sources", type: "StreamingSource[]", defaultValue: "[]", description: "行内来源列表。" },
  { attr: "followUps", type: "string[]", defaultValue: "[]", description: "完成后的追问。" },
];

const APPROVAL_PROPS: ApiTableRow[] = [
  { attr: "questions", type: "ApprovalQuestion[]", defaultValue: "—", description: "HITL 问题栈。" },
  { attr: "onSubmitted", type: "(answers) => void", defaultValue: "—", description: "全部答完或发送。" },
];

const TASK_PROPS: ApiTableRow[] = [
  { attr: "tasks", type: "AgentTask[]", defaultValue: "—", description: "任务及子状态。" },
  { attr: "variant", type: "'list' | 'capsules'", defaultValue: "'list'", description: "列表或胶囊。" },
];

const PROMPT_PROPS: ApiTableRow[] = [
  { attr: "onSend", type: "(message: string) => void", defaultValue: "—", description: "发送回调。" },
  { attr: "sources", type: "PromptSource[]", defaultValue: "[]", description: "@ 来源。" },
  { attr: "commands", type: "PromptCommand[]", defaultValue: "[]", description: "/ 命令。" },
  { attr: "models", type: "PromptModel[]", defaultValue: "[]", description: "模型列表。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "—", description: "发送按钮强调色。不传时用 bg-accent。" },
  { attr: "showAttach / showDictate", type: "boolean", defaultValue: "true", description: "附件与语音芯片。没有真实管线时是占位；Ask 壳会关掉。" },
];

const DIFF_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "变更标题。" },
  { attr: "columns", type: "AgentDiffColumn[]", defaultValue: "—", description: "列定义。" },
  { attr: "rows", type: "AgentDiffRow[]", defaultValue: "—", description: "keep / remove / add 行。" },
  { attr: "onApply", type: "(ids: string[]) => void", defaultValue: "—", description: "应用已勾选变更。" },
];

const CODE_PROPS: ApiTableRow[] = [
  { attr: "filename", type: "string", defaultValue: "—", description: "文件名。" },
  { attr: "lines", type: "string[]", defaultValue: "—", description: "完整代码。" },
  { attr: "diff", type: "AgentCodeDiffRow[]", defaultValue: "—", description: "统一 diff 行。" },
];

const INSIGHT_PROPS: ApiTableRow[] = [
  { attr: "cards", type: "InsightCard[]", defaultValue: "—", description: "洞察页。" },
  { attr: "onAsk", type: "(prompt, card) => void", defaultValue: "—", description: "点击建议问句。" },
];

const SEARCH_PROPS: ApiTableRow[] = [
  { attr: "items", type: "CommandSearchItem[]", defaultValue: "—", description: "可搜索命令。" },
  { attr: "onSelect", type: "(item) => void", defaultValue: "—", description: "选中命令。" },
];

const FLOW_PROPS: ApiTableRow[] = [
  { attr: "nodes", type: "AgentFlowNode[]", defaultValue: "—", description: "trigger / action / condition。" },
  { attr: "edges", type: "AgentFlowEdge[]", defaultValue: "[]", description: "节点连线。" },
];

const DIFF_ROWS = [
  { id: "pistachio", change: "keep" as const, cells: { flavor: "Pistachio", scoops: "186", action: "Keep weekend window" } },
  { id: "rocky", change: "remove" as const, cells: { flavor: "Rocky Road", scoops: "28", action: "Retire from freezer" } },
  { id: "mint", change: "add" as const, cells: { flavor: "Mint Chip", scoops: "94", action: "Add Saturday slot" } },
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

export default function AgentSpecPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Agent"
        hint="AI 原语：思考痕迹、流式回答、工具调用、HITL 审批、任务行、Prompt Bar、检索卡片、建议卡、diff、代码、洞察、命令搜索和流程图。IM 气泡仍用 ChatBubble / ChatInputBar。"
      />

      <Section title="Import" description="一律从 @forge-ui-official/core 引入。">
        <SubSection title="Usage" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
      </Section>

      <Section title="ThinkingTrace" description="可展开 traces。Steps / Reasoning / Search / Coding。">
        <SubSection title="Steps" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>settled</InlineCode> 跳过动画，直接显示完成态。
          </p>
          <PreviewBlock code={`<ThinkingTrace variant="steps" settled />`} minHeight={200}>
            <div className="w-full max-w-lg">
              <ThinkingTrace variant="steps" settled />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={THINKING_PROPS} />
        </SubSection>
      </Section>

      <Section title="StreamingAnswer" description="流式正文 + 来源 + follow-up。">
        <SubSection title="Usage" stack>
          <PreviewBlock
            code={`<StreamingAnswer
  text="Pistachio is your fastest-growing flavor."
  sources={[{ name: "Scoop Data", domain: "scoopdata.io" }]}
  followUps={["Which flavors sell best in winter"]}
/>`}
            minHeight={220}
          >
            <div className="w-full max-w-lg">
              <StreamingAnswer
                text="Pistachio is your fastest-growing flavor — sales are up 23% this month."
                sources={[
                  { name: "Scoop Data", domain: "scoopdata.io" },
                  { name: "Trends Index", domain: "trends.google.com" },
                ]}
                followUps={["Which flavors sell best in winter"]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={STREAM_PROPS} />
        </SubSection>
      </Section>

      <Section title="ApprovalCard" description="行动前的 human-in-the-loop 选择题。">
        <SubSection title="Usage" stack>
          <PreviewBlock
            code={`<ApprovalCard questions={[{ id: "n", prompt: "How many flavors?", options: [...] }]} />`}
            minHeight={260}
          >
            <div className="w-full max-w-lg">
              <ApprovalCard
                questions={[
                  {
                    id: "count",
                    prompt: "How many flavors should we launch?",
                    options: [
                      { id: "three", label: "Three (core line)" },
                      { id: "five", label: "Five (full case)" },
                      { id: "one", label: "Just one hero" },
                    ],
                  },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={APPROVAL_PROPS} />
        </SubSection>
      </Section>

      <Section title="ToolChips" description="工具调用与文件 diff 摘要。">
        <SubSection title="Usage" stack>
          <PreviewBlock
            code={`<ToolChips items={[{ id: "1", kind: "write", label: "Write 204 lines", chip: "schedule.tsx" }]} />`}
            minHeight={180}
          >
            <div className="w-full max-w-lg">
              <ToolChips
                summary="2 tool calls"
                items={[
                  {
                    id: "think",
                    kind: "think",
                    label: "Thinking",
                    chip: "Planning the churn schedule…",
                    detail: [{ text: "Weekend demand carries pistachio." }],
                  },
                  {
                    id: "write",
                    kind: "write",
                    label: "Write 204 lines",
                    chip: "ChurnSchedule.tsx",
                    mono: true,
                    detail: [{ text: "+ return schedule(windows)", tone: "add" }],
                  },
                ]}
                diffs={[{ file: "ChurnSchedule.tsx", add: 74, del: 41 }]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
      </Section>

      <Section title="AgentTaskRows" description="Agent 任务状态，和业务 TaskCard 分开。">
        <SubSection title="List" stack>
          <PreviewBlock code={`<AgentTaskRows tasks={tasks} />`} minHeight={200}>
            <div className="w-full max-w-lg">
              <AgentTaskRows
                tasks={[
                  {
                    id: "1",
                    title: "Verified vendor records",
                    status: "completed",
                    meta: "12 suppliers",
                    children: [
                      { label: "Matched tax IDs", value: "12/12", status: "completed" },
                      { label: "Flagged stale records", value: "2", status: "failed" },
                    ],
                  },
                  {
                    id: "2",
                    title: "Draft supplier emails",
                    status: "running",
                    meta: "2 messages",
                  },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={TASK_PROPS} />
        </SubSection>
      </Section>

      <Section title="PromptBar" description="@ 来源、/ 命令、模型选择。不替换 ChatInputBar。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<PromptBar sources={...} commands={...} models={...} />`} minHeight={200}>
            <div className="w-full max-w-lg">
              <PromptBar
                sources={[{ id: "sales", label: "Scoop Data", description: "Sales & churn metrics", connected: true }]}
                commands={[{ id: "plan", label: "plan", description: "Draft a launch plan" }]}
                models={[
                  { id: "fast", label: "Forge Fast" },
                  { id: "think", label: "Forge Think" },
                ]}
                model="fast"
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={PROMPT_PROPS} />
        </SubSection>
      </Section>

      <Section title="ContextCards" description="检索片段及其来源。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<ContextCards chunks={chunks} total={32} />`} minHeight={200}>
            <div className="w-full max-w-lg">
              <ContextCards
                total={32}
                chunks={[
                  {
                    id: "1",
                    title: "Vendor onboarding rule",
                    body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
                    sourceKind: "PDF",
                    sourceLabel: "Dairy Onboarding SOP.pdf",
                    charCount: 290,
                  },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
      </Section>

      <Section title="RecommendationCard" description="建议 + 置信度 + Accept / 备选。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<RecommendationCard title="Want me to place this restock order?" body="..." />`} minHeight={240}>
            <div className="w-full max-w-lg">
              <RecommendationCard
                title="Want me to place this restock order?"
                body="Reorder waffle cones from Cone King with lead time 7 days."
                alternatives={[
                  { id: "vanilla", label: "Switch to Vanilla Madagascar", confidence: "review" },
                  { id: "full", label: "Full restock across every SKU", confidence: "none" },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
      </Section>

      <Section title="AgentDiffTable" description="Agent 提议的表格变更。不替代 DataTable。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<AgentDiffTable title="Flavor schedule" columns={...} rows={...} />`} minHeight={280}>
            <div className="w-full max-w-2xl">
              <AgentDiffTable
                title="Flavor schedule"
                columns={[
                  { key: "flavor", label: "Flavor" },
                  { key: "scoops", label: "Weekly scoops" },
                  { key: "action", label: "Action" },
                ]}
                rows={DIFF_ROWS}
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={DIFF_PROPS} />
        </SubSection>
      </Section>

      <Section title="AgentCodeBlock" description="代码 listing + 统一 diff。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<AgentCodeBlock filename="lib/reorder.ts" lines={...} diff={...} />`} minHeight={280}>
            <div className="w-full max-w-2xl">
              <AgentCodeBlock filename="lib/reorder.ts" lines={CODE_LINES} diff={CODE_DIFF} />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={CODE_PROPS} />
        </SubSection>
      </Section>

      <Section title="InsightCards" description="带 spark / bars / segments 的洞察轮播。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<InsightCards cards={[{ title, body, chart }]} />`} minHeight={280}>
            <div className="w-full max-w-lg">
              <InsightCards
                cards={[
                  {
                    id: "weekend",
                    title: "Weekend velocity",
                    body: "Mint chip now tracks pistachio on Saturdays.",
                    prompt: "Rebalance weekend freezers",
                    chart: { kind: "spark", series: [{ name: "Mint", values: [42, 48, 61, 74, 88, 94], tone: "violet" }] },
                  },
                  {
                    id: "mix",
                    title: "Flavor mix",
                    body: "Rocky road dropped below the 40-scoop floor.",
                    prompt: "Retire rocky road",
                    chart: { kind: "bars", values: [86, 72, 54, 28, 41] },
                  },
                  {
                    id: "share",
                    title: "Share of scoop",
                    body: "Pistachio still owns the seasonal line.",
                    chart: {
                      kind: "segments",
                      items: [
                        { label: "Pistachio", pct: 46, tone: "violet" },
                        { label: "Mint", pct: 31, tone: "green" },
                        { label: "Other", pct: 23, tone: "yellow" },
                      ],
                    },
                  },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={INSIGHT_PROPS} />
        </SubSection>
      </Section>

      <Section title="CommandSearch" description="命令过滤。不替代 ToolbarSearchInput。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<CommandSearch items={[{ id, label, group }]} />`} minHeight={280}>
            <div className="w-full max-w-lg">
              <CommandSearch
                items={[
                  { id: "plan", label: "Draft a flavor launch plan", hint: "/plan", group: "Planning" },
                  { id: "compare", label: "Compare mint chip to last summer", hint: "/compare", group: "Planning" },
                  { id: "pos", label: "Open POS export", hint: "CSV", group: "Data" },
                  { id: "reorder", label: "Queue pistachio reorder", hint: "workflow", group: "Workflow" },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={SEARCH_PROPS} />
        </SubSection>
      </Section>

      <Section title="AgentFlowchart" description="可选中的工作流节点，不做拖拽画布。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={`<AgentFlowchart nodes={...} edges={...} />`} minHeight={360}>
            <div className="w-full max-w-lg">
              <AgentFlowchart
                title="Restock workflow"
                nodes={[
                  { id: "spike", kind: "trigger", title: "POS weekend spike", body: "Mint chip crosses 80 scoops." },
                  { id: "check", kind: "condition", title: "Stockout risk?", body: "Lead time longer than 5 days." },
                  { id: "draft", kind: "action", title: "Draft reorder", body: "Cone King, 7-day lead time." },
                ]}
                edges={[
                  { from: "spike", to: "check", label: "always" },
                  { from: "check", to: "draft", label: "if at risk" },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={FLOW_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/agent" className="text-xs text-fg-grey-700 hover:underline">
        看交互变体 →
      </Link>
    </div>
  );
}
