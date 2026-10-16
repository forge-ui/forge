"use client";

import { useState } from "react";
import {
  ThinkingTrace,
  StreamingAnswer,
  ApprovalCard,
  ToolChips,
  AgentTaskRows,
  ChatInputBar,
  ContextCards,
  RecommendationCard,
  AgentDiffTable,
  AgentCodeBlock,
  InsightCards,
  CommandSearch,
  AgentFlowchart,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { StreamingAnswerDemo } from "./_streaming-demo";

const TASKS = [
  {
    id: "1",
    title: "已验证供应商资料",
    status: "completed" as const,
    meta: "12 家供应商",
    children: [
      { label: "已核对税务编号和联系人", value: "12/12", status: "completed" as const },
      { label: "已标记过期资料", value: "2", status: "failed" as const },
    ],
  },
  {
    id: "2",
    title: "生成补货任务清单",
    status: "running" as const,
    meta: "7 种商品",
    children: [
      { label: "读取收银导出数据", value: "3 个文件", status: "running" as const },
      { label: "评估缺货风险", value: "68%" },
    ],
  },
  {
    id: "3",
    title: "起草供应商邮件",
    status: "failed" as const,
    meta: "2 条消息",
  },
];

export default function AgentCasePage() {
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [approval, setApproval] = useState<Record<string, string[]> | null>(null);
  const [recommendation, setRecommendation] = useState("waffle");
  const [accepted, setAccepted] = useState(false);
  const [insightPrompt, setInsightPrompt] = useState("");
  const [command, setCommand] = useState("");
  const recommendationDetails: Record<string, { title: string; body: string }> = { waffle: { title: "要帮你提交这笔补货订单吗？", body: "向华丰食品补订华夫甜筒，交货周期为 7 天。" }, vanilla: { title: "改用马达加斯加香草", body: "将本次补货方案调整为马达加斯加香草，提交前需复核库存。" }, full: { title: "为全部商品补货", body: "为全部商品生成补货草稿，提交前需复核数量与供应商。" } };

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="智能体"
        hint="展示智能体的思考、回答、工具调用、任务和审批过程。"
      />

      <Section title="ThinkingTrace" description="展示分步、推理、搜索和工具运行过程，点击标题可折叠。">
        <SubSection title="分步、推理、搜索与工具运行" stack>
          <div className="grid gap-6 md:grid-cols-2">
            <ThinkingTrace variant="steps" settled />
            <ThinkingTrace variant="reasoning" settled />
            <ThinkingTrace variant="search" query="华夫甜筒供应商对比" settled />
            <ThinkingTrace variant="coding" settled />
          </div>
        </SubSection>
      </Section>

      <Section title="StreamingAnswer" description="增量正文自然淡入；支持停止、重播、来源与追问。">
        <SubSection title="流式淡入 · 交互示例" stack>
          <StreamingAnswerDemo />
        </SubSection>
        <SubSection title="附带来源" stack>
          <StreamingAnswer
            text="开心果口味增长最快，本月销量提升 23%，利润率比香草高 8 个百分点。"
            sources={[
              { name: "销量数据", domain: "scoopdata.io" },
              { name: "趋势指标", domain: "trends.google.com" },
              { name: "购物篮分析", domain: "marketbasket.io" },
            ]}
            followUps={["冬季哪些口味最畅销", "对比意式冰淇淋与软冰淇淋的利润率"]}
            onFollowUp={(text) => setFollowUp(text)}
          />
          {followUp && <p className="text-sm text-fg-grey-700">已选择： {followUp}</p>}
        </SubSection>
      </Section>

      <Section title="ApprovalCard" description="选择答案后点击继续，可返回修改；最后一步确认提交。">
        <SubSection title="三个问题" stack>
          <div className="max-w-lg">
            <ApprovalCard
              onSubmitted={setApproval}
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
                {
                  id: "mixins",
                  prompt: "我们应该准备哪些配料？",
                  type: "check",
                  options: [
                    { id: "chips", label: "巧克力碎" },
                    { id: "waffle", label: "华夫碎" },
                    { id: "sprinkles", label: "彩糖" },
                  ],
                },
                {
                  id: "market",
                  prompt: "我们应该先进入哪个市场？",
                  options: [
                    { id: "trucks", label: "流动餐车" },
                    { id: "grocery", label: "商超冷柜" },
                    { id: "shops", label: "冰淇淋门店" },
                  ],
                },
              ]}
            />
            {approval && <p role="status" className="mt-3 text-sm text-fg-grey-700">已提交 {Object.values(approval).filter(value => value.length > 0).length} / 3 题答案，仅保存在本地示例中。</p>}
          </div>
        </SubSection>
      </Section>

      <Section title="ToolChips" description="点行展开工具细节。">
        <SubSection title="运行" stack>
          <ToolChips
            summary="4 次工具调用，2 条消息"
            items={[
              {
                id: "think",
                kind: "think",
                label: "思考中",
                chip: "正在安排生产计划…",
                detail: [
                  { text: "周末需求带动开心果口味销量，优先安排生产。" },
                  { text: "按当前批次产能，晚间还有两个冷冻作业时段。" },
                ],
              },
              {
                id: "write",
                kind: "write",
                label: "写入 204 行",
                chip: "ChurnSchedule.tsx",
                mono: true,
                detail: [
                  { text: "+ const windows = slots.filter((s) => s.temp <= -12)", tone: "add" },
                  { text: "+ return schedule(windows, { hero: \"pistachio\" })", tone: "add" },
                ],
              },
              {
                id: "run",
                kind: "run",
                label: "重新构建并验证",
                chip: "npm run freeze",
                mono: true,
                detail: [{ text: "✓ 构建完成，用时 1.2 秒" }, { text: "✓ 34 项检查通过" }],
              },
            ]}
            diffs={[
              { file: "flavors.css", add: 13 },
              { file: "ChurnSchedule.tsx", add: 74, del: 41 },
              { file: "menu.ts", add: 8, del: 2 },
            ]}
          />
        </SubSection>
      </Section>

      <Section title="AgentTaskRows" description="展示任务列表和紧凑摘要两种样式。">
        <SubSection title="列表" stack>
          <AgentTaskRows tasks={TASKS} />
        </SubSection>
        <SubSection title="摘要" stack>
          <AgentTaskRows tasks={TASKS} variant="capsules" />
        </SubSection>
      </Section>

      <Section title="ChatInputBar" description="使用加号添加附件与工具，输入 @ 引用对象，输入 / 选择命令。">
        <SubSection title="消息输入" stack>
          <ChatInputBar multiline sendOnEnter
            value={prompt}
            onChange={setPrompt}
            onSend={(message) => setSent((current) => [...current, message])}
            sources={[
              { id: "sales", kind: "tool", label: "销量数据", description: "销售与流失指标", connected: true },
              { id: "flavors", kind: "skill", label: "口味档案", description: "26 个品牌，含标签和链接" },
            ]}
            defaultSelectedSources={[
              { id: "flavors", kind: "skill", label: "口味档案", description: "26 个品牌，含标签和链接" },
            ]}
            commands={[
              { id: "plan", label: "plan", description: "起草新口味上市计划" },
              { id: "forecast", label: "forecast", description: "预测夏季需求" },
            ]}
            models={[
              { id: "fast", label: "Forge Fast" },
              { id: "think", label: "Forge Think" },
            ]}
            model="fast"
          />
          {sent.length > 0 && (
            <ul className="text-sm text-fg-grey-700">
              {sent.map((item) => (
                <li key={item}>已发送： {item}</li>
              ))}
            </ul>
          )}
        </SubSection>
      </Section>

      <Section title="ContextCards" description="检索块。">
        <SubSection title="知识片段" stack>
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
              {
                id: "2",
                title: "季节需求数据",
                body: "第四季度销量：开心果 +18%、香草 +6%、坚果巧克力 -11%；下架周销量不足 40 份的口味。",
                sourceKind: "CSV",
                sourceLabel: "销量变化导出.csv",
                charCount: 1250,
              },
            ]}
          />
        </SubSection>
      </Section>

      <Section title="RecommendationCard" description="主建议 + 备选。">
        <SubSection title="补货" stack>
          <div className="max-w-lg">
            <RecommendationCard
              title={recommendationDetails[recommendation].title}
              body={recommendationDetails[recommendation].body}
              acceptLabel={accepted ? "已接受建议" : "接受建议"}
              onAccept={() => setAccepted(true)}
              onSelectAlternative={id => { setRecommendation(id); setAccepted(false); }}
              alternatives={[
                { id: "vanilla", label: "改用马达加斯加香草", confidence: "review" },
                { id: "full", label: "为全部商品补货", confidence: "none" },
              ]}
            />
            <p role="status" className="mt-3 text-sm text-fg-grey-700">{accepted ? `已接受“${recommendationDetails[recommendation].title}”，仅更新本地示例，没有提交采购订单。` : recommendation !== "waffle" ? `已选择“${recommendationDetails[recommendation].title}”，请确认后接受。` : "选择建议或备选方案，体验确认反馈；不会提交订单。"}</p>
          </div>
        </SubSection>
      </Section>

      <Section title="AgentDiffTable" description="选择需要应用的变更，再点击应用。">
        <SubSection title="口味排期" stack>
          <div className="max-w-2xl">
            <AgentDiffTable
              title="口味排期"
              columns={[
                { key: "flavor", label: "口味" },
                { key: "scoops", label: "每周销量" },
                { key: "action", label: "操作" },
              ]}
              rows={[
                { id: "pistachio", change: "keep", cells: { flavor: "开心果", scoops: "186", action: "保留周末时段" } },
                { id: "rocky", change: "remove", cells: { flavor: "坚果巧克力", scoops: "28", action: "从冷柜下架" } },
                { id: "mint", change: "add", cells: { flavor: "薄荷巧克力", scoops: "94", action: "添加周六时段" } },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="AgentCodeBlock" description="切换代码与差异视图，支持复制代码。">
        <SubSection title="补货评估" stack>
          <div className="max-w-2xl">
            <AgentCodeBlock
              filename="lib/reorder.ts"
              lines={[
                "export async function scoreStockout(sku: string) {",
                "  const velocity = await readVelocity(sku);",
                "  return velocity.weekend > 80 ? 'reorder' : 'hold';",
                "}",
              ]}
              diff={[
                { old: 1, cur: 1, type: "ctx", pieces: [{ text: "export async function scoreStockout(sku: string) {" }] },
                { old: 2, cur: null, type: "del", pieces: [{ text: "  const velocity = await readVelocity(sku);", change: "del" }] },
                { old: null, cur: 2, type: "add", pieces: [{ text: "  const velocity = await readVelocity(sku, { window: 'weekend' });", change: "add" }] },
                { old: 3, cur: 3, type: "ctx", pieces: [{ text: "  return velocity.weekend > 80 ? 'reorder' : 'hold';" }] },
                { old: 4, cur: 4, type: "ctx", pieces: [{ text: "}" }] },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="InsightCards" description="左右翻页，点建议问句。">
        <SubSection title="季节口味组合" stack>
          <div className="max-w-lg">
            <InsightCards
              onAsk={question => setInsightPrompt(question)}
              cards={[
                {
                  id: "weekend",
                  title: "周末销售速度",
                  body: "薄荷巧克力在周六的销量已接近开心果。",
                  prompt: "调整周末冷柜库存",
                  chart: { kind: "spark", series: [{ name: "薄荷", values: [42, 48, 61, 74, 88, 94] }] },
                },
                {
                  id: "mix",
                  title: "口味组合",
                  body: "坚果巧克力口味的周销量已低于 40 份。",
                  prompt: "下架坚果巧克力口味",
                  chart: { kind: "bars", values: [86, 72, 54, 28, 41] },
                },
              ]}
            />
            {insightPrompt && <p role="status" className="mt-3 text-sm text-fg-grey-700">已生成追问草稿：{insightPrompt}</p>}
          </div>
        </SubSection>
      </Section>

      <Section title="CommandSearch" description="输入过滤命令。">
        <SubSection title="配色" stack>
          <div className="max-w-lg">
            <CommandSearch
              onSelect={item => setCommand(item.label)}
              items={[
                { id: "plan", label: "起草新口味上市计划", hint: "/plan", group: "计划" },
                { id: "compare", label: "对比薄荷巧克力与去年夏季的销量", hint: "/compare", group: "计划" },
                { id: "pos", label: "打开收银导出数据", hint: "CSV", group: "数据" },
                { id: "reorder", label: "安排开心果补货", hint: "工作流", group: "工作流" },
              ]}
            />
            {command && <p role="status" className="mt-3 text-sm text-fg-grey-700">已选择命令：{command}（本地演示）</p>}
          </div>
        </SubSection>
      </Section>

      <Section title="AgentFlowchart" description="点节点看选中态。">
        <SubSection title="补货" stack>
          <div className="max-w-lg">
            <AgentFlowchart
              title="补货流程"
              nodes={[
                { id: "spike", kind: "trigger", title: "周末收银数据峰值", body: "薄荷巧克力销量超过 80 份。" },
                { id: "check", kind: "condition", title: "是否存在缺货风险？", body: "交货周期超过 5 天。" },
                { id: "draft", kind: "action", title: "起草补货单", body: "华丰食品，交货周期 7 天。" },
              ]}
              edges={[
                { from: "spike", to: "check", label: "继续检查" },
                { from: "check", to: "draft", label: "有缺货风险时" },
              ]}
            />
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
