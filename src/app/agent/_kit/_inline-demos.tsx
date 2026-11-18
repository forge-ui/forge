"use client";

import {
  AgentCodeBlock,
  AgentDiffTable,
  AgentFlowchart,
  AgentTaskRows,
  ApprovalCard,
  CommandSearch,
  ContextCards,
  InsightCards,
  RecommendationCard,
  StreamingAnswer,
  ThinkingTrace,
  ToolChips,
} from "@forge-ui-official/core";
import { StreamingAnswerDemo } from "./_streaming-demo";
import { CODE_DIFF, CODE_LINES, DIFF_ROWS } from "./_agent-data";

export function ThinkingTraceDemo() {
  return <div className="w-full max-w-lg"><ThinkingTrace variant="steps" settled /></div>;
}

export function ToolChipsDemo() {
  return (
    <div className="w-full max-w-lg">
      <ToolChips
        summary="调用工具 2 次"
        items={[
          { id: "think", kind: "think", label: "思考中", chip: "正在安排生产计划…", detail: [{ text: "周末需求带动了开心果口味的销量。" }] },
          { id: "write", kind: "write", label: "写入 204 行", chip: "ChurnSchedule.tsx", mono: true, detail: [{ text: "+ return schedule(windows)", tone: "add" }] },
        ]}
        diffs={[{ file: "ChurnSchedule.tsx", add: 74, del: 41 }]}
      />
    </div>
  );
}

export function AgentTaskRowsDemo() {
  return (
    <div className="w-full max-w-lg">
      <AgentTaskRows
        tasks={[
          {
            id: "1", title: "已验证供应商资料", status: "completed", meta: "12 家供应商",
            children: [
              { label: "已核对税务编号", value: "12/12", status: "completed" },
              { label: "已标记过期资料", value: "2", status: "failed" },
            ],
          },
          { id: "2", title: "起草供应商邮件", status: "running", meta: "2 条消息" },
        ]}
      />
    </div>
  );
}

export function ApprovalCardDemo() {
  return (
    <div className="w-full max-w-lg">
      <ApprovalCard questions={[{ id: "count", prompt: "我们应该推出几种口味？", options: [{ id: "three", label: "三项推荐" }, { id: "five", label: "五项推荐" }, { id: "one", label: "单项重点推荐" }] }]} />
    </div>
  );
}

export function RecommendationDemo() {
  return (
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
  );
}

export function StreamingAnswerDocDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <div className="w-full max-w-lg">
        <StreamingAnswer text="开心果口味增长最快，本月销量提升了 23%。" sources={[{ name: "销量数据", domain: "scoopdata.io" }, { name: "趋势指标", domain: "trends.google.com" }]} followUps={["冬季哪些口味最畅销"]} />
      </div>
      <StreamingAnswerDemo />
    </div>
  );
}

export function ContextCardsDemo() {
  return (
    <div className="w-full max-w-lg">
      <ContextCards total={32} chunks={[{ id: "1", title: "供应商准入规则", body: "新增乳制品供应商前，须核验冷链认证，才可加入补货流程。", sourceKind: "PDF", sourceLabel: "乳品供应商入驻流程.pdf", charCount: 290 }]} />
    </div>
  );
}

export function InsightCardsDemo() {
  return (
    <div className="w-full max-w-lg">
      <InsightCards
        cards={[
          { id: "weekend", title: "周末销售速度", body: "薄荷巧克力在周六的销量已接近开心果。", prompt: "调整周末冷柜库存", chart: { kind: "spark", series: [{ name: "薄荷", values: [42, 48, 61, 74, 88, 94], tone: "violet" }] } },
          { id: "mix", title: "口味组合", body: "坚果巧克力口味的周销量已低于 40 份。", prompt: "下架坚果巧克力口味", chart: { kind: "bars", values: [86, 72, 54, 28, 41] } },
          { id: "share", title: "销量占比", body: "开心果仍是当季主力口味。", chart: { kind: "segments", items: [{ label: "开心果", pct: 46, tone: "violet" }, { label: "薄荷", pct: 31, tone: "green" }, { label: "其他", pct: 23, tone: "yellow" }] } },
        ]}
      />
    </div>
  );
}

export function AgentCodeBlockDemo() {
  return <div className="w-full max-w-2xl"><AgentCodeBlock filename="lib/reorder.ts" lines={CODE_LINES} diff={CODE_DIFF} /></div>;
}

export function AgentDiffTableDemo() {
  return (
    <div className="w-full max-w-2xl">
      <AgentDiffTable title="口味排期" columns={[{ key: "flavor", label: "口味" }, { key: "scoops", label: "每周销量" }, { key: "action", label: "操作" }]} rows={DIFF_ROWS} />
    </div>
  );
}

export function AgentFlowchartDemo() {
  return (
    <div className="w-full max-w-lg">
      <AgentFlowchart
        title="补货流程"
        nodes={[
          { id: "spike", kind: "trigger", title: "周末收银数据峰值", body: "薄荷巧克力销量超过 80 份。" },
          { id: "check", kind: "condition", title: "是否存在缺货风险？", body: "交货周期超过 5 天。" },
          { id: "draft", kind: "action", title: "起草补货单", body: "华丰食品，交货周期 7 天。" },
        ]}
        edges={[{ from: "spike", to: "check", label: "始终执行" }, { from: "check", to: "draft", label: "存在缺货风险时" }]}
      />
    </div>
  );
}

export function CommandSearchDemo() {
  return (
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
  );
}
