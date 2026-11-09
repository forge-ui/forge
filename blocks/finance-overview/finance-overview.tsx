"use client";

import type { ComponentProps } from "react";
import { ChartMetricRow, CreditCard, GroupedBarChart, Panel, WalletGoalCard, cn, type GroupedBarChartProps, type WalletGoalCardProps } from "@forge-ui-official/core";
import { WalletBoldDuotone } from "@forge-ui-official/core/icons";

export type FinanceAccount = ComponentProps<typeof CreditCard> & { id: string; name: string; balance: string };
export const defaultFinanceAccounts: FinanceAccount[] = [
  { id: "operating", name: "日常经营账户", balance: "¥326,800", holderName: "知行科技", cardNumber: "6829", expiry: "12/28", theme: "blue", variant: "flat" },
  { id: "reserve", name: "企业储备账户", balance: "¥140,000", holderName: "知行科技", cardNumber: "3056", expiry: "08/29", theme: "dark", variant: "flat" },
];
export const defaultFinanceGoals: (WalletGoalCardProps & { id: string })[] = [
  { id: "reserve", title: "年度经营储备", date: "2026 年 12 月 31 日", amount: "¥160,000 / ¥200,000", progress: 80, progressColor: "blue" },
  { id: "product", title: "产品研发基金", date: "2026 年 12 月 15 日", amount: "¥84,000 / ¥120,000", progress: 70, progressColor: "green" },
  { id: "team", title: "团队成长预算", date: "2026 年 12 月 31 日", amount: "¥36,000 / ¥60,000", progress: 60, progressColor: "purple" },
];
export const defaultFinanceTrend: GroupedBarChartProps = {
  data: [
    { label: "10/25", values: [14200, 8200] }, { label: "10/26", values: [16800, 9400] },
    { label: "10/27", values: [15300, 8800] }, { label: "10/28", values: [20400, 12000] },
    { label: "10/29", values: [18600, 11200] }, { label: "10/30", values: [21500, 12300] },
    { label: "10/31", values: [21800, 12900] },
  ],
  series: [{ label: "收入", value: "¥128,600", colorClass: "bg-fg-blue" }, { label: "支出", value: "¥74,800", colorClass: "bg-fg-yellow" }],
  yAxisLabels: ["¥22k", "¥16.5k", "¥11k", "¥5.5k", "0"],
  heightClass: "h-44",
};

export interface FinanceOverviewProps {
  title?: string;
  description?: string;
  periodLabel?: string;
  accounts?: FinanceAccount[];
  trend?: GroupedBarChartProps;
  goals?: (WalletGoalCardProps & { id: string })[];
  className?: string;
}

export function FinanceOverview({ title = "财务概览", description = "知行科技 · 账户与资金计划", periodLabel = "2026.10.25 — 10.31", accounts = defaultFinanceAccounts, trend = defaultFinanceTrend, goals = defaultFinanceGoals, className }: FinanceOverviewProps) {
  return <section className={cn("@container flex min-w-0 flex-col gap-5", className)}>
    <header className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold text-fg-black">{title}</h2><p className="mt-1 text-sm text-fg-grey-700">{description}</p></div><span className="text-sm text-fg-grey-700">{periodLabel}</span></header>
    <div className="grid min-w-0 grid-cols-1 gap-4 @min-[840px]:grid-cols-2">
      <Panel title="我的账户" subtitle={`${accounts.length} 个企业账户`} className="min-w-0 justify-start"><div className="grid grid-cols-1 gap-4 @min-[840px]:grid-cols-2">{accounts.map(({ id, name, balance, ...card }) => <div key={id} className="flex min-w-0 flex-col gap-3"><div className="flex flex-wrap items-center gap-2 text-sm"><WalletBoldDuotone size={18} className="shrink-0 text-fg-blue" /><span className="text-fg-grey-700">{name}</span><span className="ml-auto whitespace-nowrap font-semibold tabular-nums">{balance}</span></div><CreditCard {...card} width="full" /></div>)}</div></Panel>
      <Panel title="收入与支出" subtitle="按日统计 · 人民币" className="min-w-0"><ChartMetricRow series={trend.series} /><div className="@container min-w-0"><GroupedBarChart {...trend} heightClass={cn(trend.heightClass ?? "h-56", "min-h-44 min-w-0 grid-cols-[44px_minmax(0,1fr)] @max-[480px]:grid-cols-[32px_minmax(0,1fr)] @max-[480px]:gap-2 @max-[480px]:[&>div:last-child]:gap-1 [&>div:last-child>div]:min-w-0 @max-[480px]:[&>div:last-child>div>div]:gap-1 @max-[480px]:[&>div:last-child>div>div>span]:w-2 @max-[480px]:[&>div:last-child>div>div:last-child]:text-[10px]")} /></div></Panel>
    </div>
    <Panel title="储蓄目标" subtitle="为接下来的投入提前规划" className="min-w-0"><div className="grid min-w-0 grid-cols-1 gap-4 @min-[960px]:grid-cols-3">{goals.map(({ id, ...goal }) => <WalletGoalCard key={id} {...goal} />)}</div></Panel>
  </section>;
}
