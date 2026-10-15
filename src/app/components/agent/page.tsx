"use client";

import Link from "next/link";
import { CompleteApiReference } from "../_complete-api-reference";
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
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

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

      <Section title="导入组件" description="从 @forge-ui-official/core 导入所需组件。">
        <SubSection title="使用方法" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
      </Section>

      <Section title="ThinkingTrace" description="展开查看智能体的处理步骤和推理过程。">
        <SubSection title="步骤" stack>
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
          <CompleteApiReference name="ThinkingTrace" descriptions={THINKING_PROPS} />
        </SubSection>
      </Section>

      <Section title="StreamingAnswer" description="逐步显示回答正文、来源和后续建议。">
        <SubSection title="使用方法" stack>
          <PreviewBlock
            code={`<StreamingAnswer
  text="开心果口味增长最快，本月销量提升了 23%。"
  sources={[{ name: "销量数据", domain: "scoopdata.io" }]}
  followUps={["冬季哪些口味最畅销"]}
/>`}
            minHeight={220}
          >
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
          </PreviewBlock>
        </SubSection>
        <SubSection title="真实流接入" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            持续追加 <InlineCode>text</InlineCode>，接收结束后把 <InlineCode>status</InlineCode> 设为已完成（complete）。
            网络停顿时保持接收状态（streaming）；点击停止后由应用取消请求并设为已停止（stopped）。每条回答使用独立的 React key。
          </p>
          <CodeBlock code={`<StreamingAnswer
  key={message.id}
  text={message.text}
  status={message.status}
  format="markdown"
  onDone={() => showMessageActions(message.id)}
/>`} />
          <Link href="#interaction-086" className="text-sm text-fg-black underline underline-offset-4">
            查看交互案例：语言切换、停止、重播与网络停顿
          </Link>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="StreamingAnswer" descriptions={STREAM_PROPS} />
        </SubSection>
      </Section>

      <Section title="ApprovalCard" description="在执行操作前展示选项，交由用户确认。">
        <SubSection title="使用方法" stack>
          <PreviewBlock
            code={`<ApprovalCard questions={[{ id: "n", prompt: "我们应该推出几种口味？", options: [...] }]} />`}
            minHeight={260}
          >
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
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="ApprovalCard" descriptions={APPROVAL_PROPS} />
        </SubSection>
      </Section>

      <Section title="ToolChips" description="展示工具调用和文件修改摘要。">
        <SubSection title="使用方法" stack>
          <PreviewBlock
            code={`<ToolChips items={[{ id: "1", kind: "write", label: "写入 204 行", chip: "schedule.tsx" }]} />`}
            minHeight={180}
          >
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
          </PreviewBlock>
        </SubSection>
      <SubSection title="完整参数" stack><CompleteApiReference name="ToolChips" /></SubSection>
      </Section>

      <Section title="AgentTaskRows" description="展示智能体任务的运行状态、进度和结果。">
        <SubSection title="列表" stack>
          <PreviewBlock code={`<AgentTaskRows tasks={tasks} />`} minHeight={200}>
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
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="AgentTaskRows" descriptions={TASK_PROPS} />
        </SubSection>
      </Section>

      <Section title="ContextCards" description="展示检索到的内容片段及来源。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<ContextCards chunks={chunks} total={32} />`} minHeight={200}>
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
          </PreviewBlock>
        </SubSection>
      <SubSection title="完整参数" stack><CompleteApiReference name="ContextCards" /></SubSection>
      </Section>

      <Section title="RecommendationCard" description="展示建议及可信度，支持接受建议或选择备选方案。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<RecommendationCard title="要帮你提交这笔补货订单吗？" body="..." />`} minHeight={240}>
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
          </PreviewBlock>
        </SubSection>
      <SubSection title="完整参数" stack><CompleteApiReference name="RecommendationCard" /></SubSection>
      </Section>

      <Section title="AgentDiffTable" description="查看并审核智能体提出的表格修改。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<AgentDiffTable title="口味排期" columns={...} rows={...} />`} minHeight={280}>
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
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="AgentDiffTable" descriptions={DIFF_PROPS} />
        </SubSection>
      </Section>

      <Section title="AgentCodeBlock" description="展示代码和修改差异。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<AgentCodeBlock filename="lib/reorder.ts" lines={...} diff={...} />`} minHeight={280}>
            <div className="w-full max-w-2xl">
              <AgentCodeBlock filename="lib/reorder.ts" lines={CODE_LINES} diff={CODE_DIFF} />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="AgentCodeBlock" descriptions={CODE_PROPS} />
        </SubSection>
      </Section>

      <Section title="InsightCards" description="通过小型图表和摘要展示分析发现。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<InsightCards cards={[{ title, body, chart }]} />`} minHeight={280}>
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
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="InsightCards" descriptions={INSIGHT_PROPS} />
        </SubSection>
      </Section>

      <Section title="CommandSearch" description="搜索和选择可执行的命令。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<CommandSearch items={[{ id, label, group }]} />`} minHeight={280}>
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
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="CommandSearch" descriptions={SEARCH_PROPS} />
        </SubSection>

      </Section>

      <Section title="AgentFlowchart" description="查看流程节点并选择节点查看详情。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<AgentFlowchart nodes={...} edges={...} />`} minHeight={360}>
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
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <CompleteApiReference name="AgentFlowchart" descriptions={FLOW_PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
