"use client";

import { useState } from "react";
import { ButtonGroup, Panel, ProgressBar, SmoothLineChart, StatCard, StatusBadge, cn } from "@forge-ui-official/core";

export interface UsageBreakdown {
  id: string;
  name: string;
  amount: number;
  change: number;
  color: string;
}

export interface AgentUsageData {
  month: string;
  budget: number;
  spent: number;
  forecast: number;
  daily: number[];
  tasks: number;
  runs: number;
  tokens: string;
  byProject: UsageBreakdown[];
  byModel: UsageBreakdown[];
  alerts: { id: string; title: string; detail: string; tone: "yellow" | "red" }[];
}

export const defaultAgentUsage: AgentUsageData = {
  month: "11 月",
  budget: 3000,
  spent: 1862.4,
  forecast: 2910,
  daily: [42, 58, 61, 72, 55, 48, 66, 81, 94, 78],
  tasks: 186,
  runs: 1285,
  tokens: "48.3M",
  byProject: [
    { id: "p1", name: "客户工作台升级", amount: 712.6, change: 24, color: "bg-fg-blue" },
    { id: "p2", name: "售后客服", amount: 498.2, change: -8, color: "bg-fg-violet" },
    { id: "p3", name: "经营分析", amount: 386.0, change: 102, color: "bg-fg-green-500" },
    { id: "p4", name: "内部办公", amount: 265.6, change: 12, color: "bg-fg-yellow" },
  ],
  byModel: [
    { id: "m1", name: "通用大模型 · 旗舰", amount: 1024.5, change: 18, color: "bg-fg-blue" },
    { id: "m2", name: "通用大模型 · 轻量", amount: 512.3, change: -4, color: "bg-fg-violet" },
    { id: "m3", name: "代码模型", amount: 248.1, change: 36, color: "bg-fg-green-500" },
    { id: "m4", name: "向量模型", amount: 77.5, change: 6, color: "bg-fg-yellow" },
  ],
  alerts: [
    { id: "a1", title: "经营分析昨日成本 ¥94.2", detail: "通常一次约 ¥18，本次读取了全部 1,286 条客户记录", tone: "yellow" },
    { id: "a2", title: "代码模型用量较上月 +36%", detail: "编程助手批量生成测试导致，可改用轻量模型", tone: "yellow" },
    { id: "a3", title: "月底预计接近预算上限", detail: "按当前速度预计 ¥2,910，仅剩 ¥90 余量，可调高预算或限制高成本任务", tone: "red" },
  ],
};

export interface AgentUsageProps {
  usage?: AgentUsageData;
  className?: string;
}

export function AgentUsage({ usage = defaultAgentUsage, className }: AgentUsageProps) {
  const [view, setView] = useState(0);
  const breakdown = view === 0 ? usage.byProject : usage.byModel;
  const max = Math.max(...breakdown.map(item => item.amount));
  const used = Math.round((usage.spent / usage.budget) * 100);
  const money = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Panel variant="template" title={`${usage.month}已花费`} action={<StatusBadge label={`预计 ${money(usage.forecast)}`} color={usage.forecast > usage.budget * 0.95 ? "yellow" : "green"} variant="soft" />}>
        <div className="flex flex-wrap items-end gap-3"><p className="text-4xl font-semibold tabular-nums text-fg-black">{money(usage.spent)}</p><p className="pb-1 text-sm text-fg-grey-700">/ 预算 {money(usage.budget)}</p></div>
        <ProgressBar value={used} color={used > 85 ? "red" : "blue"} label={`已使用 ${used}%`} size="sm" />
        <SmoothLineChart series={[{ data: usage.daily, color: "blue", fillArea: true }]} accent="blue" showYAxis yAxisLabels={["¥100", "¥50", "¥0"]} xAxisLabels={usage.daily.map((_, index) => `${index + 1}日`)} height="h-48" />
      </Panel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
        <StatCard title="任务" value={usage.tasks} animateValue subtitle="本月发起" theme="white" width="full" density="compact" />
        <StatCard title="运行次数" value={usage.runs} animateValue subtitle="含重试" theme="white" width="full" density="compact" />
        <StatCard title="Token" value={usage.tokens} subtitle="输入 + 输出" theme="white" width="full" density="compact" />
      </div>
    </div>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2">
      <Panel variant="template" title="花在哪里" action={<ButtonGroup ariaLabel="分组方式" shape="pill" items={[{ label: "按项目" }, { label: "按模型" }]} activeIndex={view} onChange={setView} />}>
        <ul className="flex flex-col gap-4">{breakdown.map(item => <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2">
          <span className="flex min-w-0 items-center gap-2 text-sm text-fg-black"><span className={cn("size-2.5 shrink-0 rounded-full", item.color)} /><span className="truncate">{item.name}</span></span>
          <span className="text-sm font-semibold tabular-nums text-fg-black">{money(item.amount)} <span className={cn("ml-1 text-xs font-medium", item.change > 0 ? "text-fg-red" : "text-fg-green-500")}>{item.change > 0 ? "+" : ""}{item.change}%</span></span>
          <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-fg-grey-100"><span className={cn("block h-full rounded-full transition-[width] duration-500", item.color)} style={{ width: `${(item.amount / max) * 100}%` }} /></span>
        </li>)}</ul>
      </Panel>
      <Panel variant="template" title="值得关注" subtitle="自动发现的异常用量">
        <ul className="flex flex-col gap-3">{usage.alerts.map(alert => <li key={alert.id} className={cn("rounded-xl border p-4", alert.tone === "red" ? "border-fg-red-200 bg-fg-red-50" : "border-fg-yellow-200 bg-fg-yellow-50")}><p className="text-sm font-semibold text-fg-black">{alert.title}</p><p className="mt-1 text-xs leading-5 text-fg-grey-700">{alert.detail}</p></li>)}</ul>
      </Panel>
    </div>
  </section>;
}
