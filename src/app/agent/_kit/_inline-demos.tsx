"use client";

import { useEffect, useRef, useState } from "react";
import {
  AgentCodeBlock,
  AgentDiffTable,
  AgentFlowchart,
  ButtonGroup,
  CommandSearch,
  ContextCards,
  InsightCards,
  RecommendationCard,
  StreamingAnswer,
  ToolCall,
  ToolCallGroup,
  type ToolCallStatus,
} from "@aideui/core";
import { StreamingAnswerDemo } from "./_streaming-demo";
import { CODE_DIFF, CODE_LINES, DIFF_ROWS } from "./_agent-data";

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

const TOOL_STATES = ["成功", "运行中", "失败重试", "待确认"] as const;

/** One ToolCall per state; retry and approval play through to their result. */
export function ToolCallStatesDemo() {
  const [state, setState] = useState(0);
  const [run, setRun] = useState<{ status: ToolCallStatus; startedAt?: number; note?: string }>({ status: "success" });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const later = (next: typeof run, delay: number) => { clearTimeout(timer.current); timer.current = setTimeout(() => setRun(next), delay); };
  const pick = (index: number) => {
    clearTimeout(timer.current);
    setState(index);
    const now = Date.now();
    setRun([{ status: "success" as const }, { status: "running" as const, startedAt: now }, { status: "error" as const }, { status: "awaiting-approval" as const }][index]);
  };
  const retry = () => { setRun({ status: "running", startedAt: Date.now() }); later({ status: "success", note: "重试成功" }, 1400); };
  const approve = () => { setRun({ status: "running", startedAt: Date.now() }); later({ status: "success", note: "已发起退款" }, 1200); };
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="max-w-full overflow-x-auto"><div className="w-fit"><ButtonGroup ariaLabel="调用状态" shape="pill" color="black" items={TOOL_STATES.map(label => ({ label }))} activeIndex={state} onChange={pick} /></div></div>
      {state < 3 ? (
        <ToolCall
          name="export_excel"
          summary="11 月退款明细"
          status={run.status}
          startedAt={run.startedAt}
          duration={run.status === "success" ? 2310 : undefined}
          args={{ month: "2026-11", type: "refund" }}
          result={run.status === "success" ? { file: "退款明细-11月.xlsx", rows: 128 } : undefined}
          error={run.status === "error" ? "导出服务超时（30 秒）" : undefined}
          onRetry={retry}
        />
      ) : (
        <ToolCall
          name="create_refund"
          title="发起退款"
          summary="订单 1024 · ¥860"
          status={run.status}
          startedAt={run.startedAt}
          args={{ orderId: "1024", amount: 860 }}
          result={run.status === "success" ? { refundId: "RF-3381" } : undefined}
          approvalReason="金额超过 500 元，需要你确认。"
          onApprove={approve}
          onDeny={() => setRun({ status: "denied", note: "已拒绝，没有改动" })}
        />
      )}
      <p role="status" className="text-xs text-fg-grey-700">{run.note ?? (run.status === "error" ? "点“重试”看失败后的恢复" : run.status === "awaiting-approval" ? "点“允许”或“拒绝”看结果" : " ")}</p>
      <div className="flex flex-col gap-2 border-t border-fg-grey-200 pt-4">
        <span className="text-xs font-semibold text-fg-grey-700">分组调用：一轮里的多次调用折成一行，点开看每一次</span>
        <ToolCallGroup count={3} status="error">
          <ToolCall variant="row" name="search_orders" summary="本月退款" status="success" duration={1240} args={{ month: "2026-11" }} result={{ total: 128 }} />
          <ToolCall variant="row" name="get_customer" summary="C-20931" status="success" duration={620} args={{ id: "C-20931" }} result={{ name: "华东分公司" }} />
          <ToolCall variant="row" name="export_excel" summary="退款明细" status="error" error="导出服务超时（30 秒）" onRetry={retry} />
        </ToolCallGroup>
      </div>
    </div>
  );
}
