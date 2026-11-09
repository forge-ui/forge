"use client";

import { useState } from "react";
import { Button, ButtonGroup, DataTable, Panel, SmoothLineChart, StatusBadge, cn, type ColumnDef } from "@forge-ui-official/core";
import { PlayBoldDuotone } from "@forge-ui-official/core/icons";

export type EvalResult = "pass" | "partial" | "fail";

export interface EvalCase {
  id: string;
  input: string;
  expected: string;
  output: string;
  result: EvalResult;
  latency: number;
}

export interface PromptEvalsData {
  prompt: string;
  version: string;
  metrics: { label: string; value: string; delta: string; positive: boolean }[];
  history: number[];
  change: { removed: string; added: string };
  cases: EvalCase[];
}

export const defaultPromptEvals: PromptEvalsData = {
  prompt: "售后问答助手 · 系统提示词",
  version: "v12",
  metrics: [
    { label: "通过率", value: "92%", delta: "+4%", positive: true },
    { label: "平均得分", value: "4.6", delta: "+0.3", positive: true },
    { label: "P50 延迟", value: "1.2s", delta: "-0.2s", positive: true },
    { label: "每百次成本", value: "¥1.84", delta: "+¥0.06", positive: false },
  ],
  history: [74, 78, 77, 81, 83, 82, 86, 85, 88, 88, 90, 92],
  change: { removed: "回答尽可能详细，覆盖所有可能情况。", added: "先给结论，再列出依据条款；不确定时说明需要人工确认。" },
  cases: [
    { id: "c1", input: "退货超过 7 天还能退吗？", expected: "说明质量问题可走换货", output: "可以走质量换货流程，需要提供照片（《售后服务规范》3.2）", result: "pass", latency: 1.1 },
    { id: "c2", input: "发票抬头开错了怎么办？", expected: "30 天内可重开", output: "开票 30 天内可在订单详情申请重开", result: "pass", latency: 0.9 },
    { id: "c3", input: "物流三天没更新", expected: "安抚并给出查询方式", output: "抱歉让您久等，已为您催件，可在订单页查看最新轨迹", result: "pass", latency: 1.3 },
    { id: "c4", input: "能不能赔我 100 元", expected: "不承诺具体金额", output: "可为您申请 20 元优惠券作为补偿", result: "partial", latency: 1.4 },
    { id: "c5", input: "我要投诉你们客服", expected: "转人工并记录", output: "已为您转接人工客服，工单号 ZX-20261109", result: "pass", latency: 1.0 },
    { id: "c6", input: "英文能回答吗 can you help", expected: "用英文回答", output: "可以，请问需要什么帮助？", result: "fail", latency: 1.2 },
  ],
};

const resultMeta: Record<EvalResult, { label: string; color: "green" | "yellow" | "red" }> = { pass: { label: "通过", color: "green" }, partial: { label: "部分", color: "yellow" }, fail: { label: "失败", color: "red" } };
const filters: { label: string; value: EvalResult | "all" }[] = [{ label: "全部", value: "all" }, { label: "通过", value: "pass" }, { label: "部分", value: "partial" }, { label: "失败", value: "fail" }];

export interface PromptEvalsProps {
  evals?: PromptEvalsData;
  onRun?: () => void;
  className?: string;
}

export function PromptEvals({ evals = defaultPromptEvals, onRun, className }: PromptEvalsProps) {
  const [filter, setFilter] = useState(0);
  const [running, setRunning] = useState(false);
  const value = filters[filter].value;
  const visible = evals.cases.filter(item => value === "all" || item.result === value);
  const columns: ColumnDef<EvalCase>[] = [
    { key: "input", header: "输入", minWidth: 180, render: item => <span className="text-sm text-fg-black">{item.input}</span> },
    { key: "expected", header: "期望", minWidth: 160, render: item => <span className="text-sm text-fg-grey-700">{item.expected}</span> },
    { key: "output", header: `${evals.version} 输出`, minWidth: 240, render: item => <span className="text-sm text-fg-grey-900">{item.output}</span> },
    { key: "result", header: "结果", minWidth: 80, render: item => <StatusBadge {...resultMeta[item.result]} variant="soft" /> },
    { key: "latency", header: "延迟", minWidth: 70, valueKind: "number", render: item => <span className="text-sm tabular-nums text-fg-grey-700">{item.latency}s</span> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="text-sm font-semibold text-fg-black">{evals.prompt}</span><StatusBadge label={`${evals.version} 当前`} color="blue" variant="soft" /></div><Button iconLeft={<PlayBoldDuotone size={16} />} disabled={running} onClick={() => { setRunning(true); onRun?.(); window.setTimeout(() => setRunning(false), 1600); }}>{running ? "评测中…" : "重新评测"}</Button></div>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{evals.metrics.map(metric => <Panel key={metric.label} variant="template"><p className="text-sm text-fg-grey-700">{metric.label}</p><p className="text-2xl font-semibold tabular-nums text-fg-black">{metric.value}</p><p className={cn("text-xs font-semibold", metric.positive ? "text-fg-green-500" : "text-fg-red")}>{metric.delta} 较 v11</p></Panel>)}</div>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Panel variant="template" title="各版本通过率" subtitle="最近 12 个版本 · 25 个测试用例">
        <SmoothLineChart series={[{ data: evals.history, color: "blue", fillArea: true }]} accent="blue" showYAxis yAxisLabels={["100%", "85%", "70%"]} yDomain={[70, 100]} xAxisLabels={evals.history.map((_, index) => `v${index + 1}`)} height="h-52" />
      </Panel>
      <Panel variant="template" title={`${evals.version} 改动`} subtitle="系统提示词差异">
        <div className="flex flex-col gap-2 font-mono text-xs leading-6"><p className="rounded-lg bg-fg-red-50 px-3 py-2 text-fg-red line-through decoration-fg-red/50">- {evals.change.removed}</p><p className="rounded-lg bg-fg-green-50 px-3 py-2 text-fg-green-600">+ {evals.change.added}</p></div>
      </Panel>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-semibold text-fg-black">测试用例 <span className="text-fg-grey-500">{evals.cases.length}</span></h2><ButtonGroup ariaLabel="结果筛选" shape="pill" items={filters.map(item => ({ label: item.label }))} activeIndex={filter} onChange={setFilter} /></div>
    <DataTable<EvalCase> columns={columns} rows={visible} getRowKey={item => item.id} emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有这类结果的用例。</p>} />
  </section>;
}
