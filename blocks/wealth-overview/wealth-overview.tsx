"use client";

import { type ComponentProps } from "react";
import { Button, CreditCard, LineChartStatCard, Panel, PlusIcon, ProgressBar, cn } from "@forge-ui-official/core";

export interface WealthMetric {
  id: string;
  title: string;
  value: string;
  trend: string;
  subtitle: string;
  color: "blue" | "red" | "green";
  series: number[];
}

export interface WealthGoal {
  id: string;
  title: string;
  saved: number;
  target: number;
  color: "blue" | "purple" | "green" | "red" | "cyan";
}

export const defaultWealthMetrics: WealthMetric[] = [
  { id: "assets", title: "总资产", value: "¥3,286,000", trend: "10%", subtitle: "较上月 +¥29.8万", color: "blue", series: [262, 271, 268, 280, 291, 302, 328] },
  { id: "cash", title: "现金余额", value: "¥466,800", trend: "6%", subtitle: "两个企业账户", color: "red", series: [41, 43, 40, 44, 45, 43, 46] },
  { id: "receivable", title: "待收款", value: "¥228,000", trend: "12%", subtitle: "4 张未结发票", color: "green", series: [18, 17, 20, 19, 22, 21, 23] },
];

export const defaultWealthCards: (ComponentProps<typeof CreditCard> & { id: string })[] = [
  { id: "c1", cardNumber: "6829", holderName: "知行科技", expiry: "12/28", theme: "blue" },
  { id: "c2", cardNumber: "3056", holderName: "知行科技", expiry: "08/29", theme: "dark" },
  { id: "c3", cardNumber: "1288", holderName: "知行科技", expiry: "05/27", theme: "yellow" },
];

export const defaultWealthGoals: WealthGoal[] = [
  { id: "g1", title: "年度经营储备", saved: 160000, target: 200000, color: "blue" },
  { id: "g2", title: "产品研发基金", saved: 84000, target: 120000, color: "purple" },
  { id: "g3", title: "设备更新", saved: 40800, target: 48000, color: "green" },
  { id: "g4", title: "办公室扩租", saved: 37500, target: 150000, color: "red" },
  { id: "g5", title: "团队成长预算", saved: 36000, target: 60000, color: "cyan" },
];

export interface WealthOverviewProps {
  metrics?: WealthMetric[];
  cards?: (ComponentProps<typeof CreditCard> & { id: string })[];
  goals?: WealthGoal[];
  onAddCard?: () => void;
  className?: string;
}

export function WealthOverview({ metrics = defaultWealthMetrics, cards = defaultWealthCards, goals = defaultWealthGoals, onAddCard, className }: WealthOverviewProps) {
  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map(metric => <LineChartStatCard key={metric.id} title={metric.title} value={metric.value} trend={metric.trend} subtitle={metric.subtitle} series={metric.series} chartColor={metric.color} theme="white" density="compact" size="wide" width="full" />)}
    </div>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <Panel variant="template" title="企业卡" subtitle={`${cards.length} 张卡片`}>
        <div className="flex flex-col gap-3">{cards.map(({ id, ...card }) => <CreditCard key={id} {...card} width="full" />)}</div>
        <Button variant="tertiary" className="w-full" iconLeft={<PlusIcon size={16} />} onClick={onAddCard}>申请新卡</Button>
      </Panel>
      <Panel variant="template" title="资金目标" subtitle="按完成度排序">
        <ul className="flex flex-col divide-y divide-fg-grey-200">{[...goals].sort((left, right) => right.saved / right.target - left.saved / left.target).map(goal => {
          const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          return <li key={goal.id} className="grid grid-cols-1 items-center gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{goal.title}</p><p className="text-xs tabular-nums text-fg-grey-700">¥{goal.saved.toLocaleString("zh-CN")} / ¥{goal.target.toLocaleString("zh-CN")}</p></div>
            <ProgressBar value={percent} color={goal.color} label={`${percent}%`} size="sm" />
          </li>;
        })}</ul>
      </Panel>
    </div>
  </section>;
}
