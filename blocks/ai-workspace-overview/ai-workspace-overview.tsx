"use client";

import { useState, type ReactNode } from "react";
import { ButtonGroup, Panel, ProgressBar, SmoothLineChart, StatCard, cn } from "@forge-ui-official/core";
import { BookBoldDuotone, ChatRoundLinear, KeyboardBoldDuotone, StarBoldDuotone, UserBoldDuotone, WidgetBoldDuotone } from "@forge-ui-official/core/icons";

export interface WorkspaceResource {
  id: string;
  title: string;
  value: number;
  progress: number;
  note: string;
  color: "blue" | "green" | "cyan" | "purple";
  icon: "apps" | "knowledge" | "tools" | "models";
}

export interface WorkspacePeriod {
  label: string;
  users: number;
  conversations: number;
  tokens: number;
  satisfaction: number;
  trend: { users: number[]; conversations: number[] };
}

export const defaultWorkspaceResources: WorkspaceResource[] = [
  { id: "apps", title: "应用智能体", value: 12, progress: 67, note: "已发布 8 · 未发布 4", color: "blue", icon: "apps" },
  { id: "knowledge", title: "知识库", value: 6, progress: 100, note: "文档 186 · 全部健康", color: "green", icon: "knowledge" },
  { id: "tools", title: "工具", value: 18, progress: 72, note: "自定义 13 · 工作流 5", color: "cyan", icon: "tools" },
  { id: "models", title: "模型", value: 4, progress: 50, note: "大语言 3 · 向量 1", color: "purple", icon: "models" },
];

const week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export const defaultWorkspacePeriods: WorkspacePeriod[] = [
  { label: "7 天", users: 186, conversations: 1240, tokens: 3.8, satisfaction: 96, trend: { users: [120, 142, 138, 165, 172, 151, 186], conversations: [140, 168, 175, 196, 210, 162, 189] } },
  { label: "30 天", users: 642, conversations: 5320, tokens: 16.2, satisfaction: 94, trend: { users: [420, 455, 470, 512, 548, 590, 642], conversations: [3100, 3420, 3680, 4010, 4460, 4890, 5320] } },
  { label: "90 天", users: 1286, conversations: 14860, tokens: 44.7, satisfaction: 93, trend: { users: [680, 760, 842, 930, 1040, 1160, 1286], conversations: [8200, 9100, 10120, 11240, 12460, 13580, 14860] } },
];

const resourceIcon: Record<WorkspaceResource["icon"], ReactNode> = {
  apps: <StarBoldDuotone size={20} />,
  knowledge: <BookBoldDuotone size={20} />,
  tools: <KeyboardBoldDuotone size={20} />,
  models: <WidgetBoldDuotone size={20} />,
};
const tone: Record<WorkspaceResource["color"], string> = { blue: "bg-fg-blue text-white", green: "bg-fg-green-500 text-white", cyan: "bg-fg-cyan-500 text-white", purple: "bg-fg-violet text-white" };

export interface AiWorkspaceOverviewProps {
  resources?: WorkspaceResource[];
  periods?: WorkspacePeriod[];
  className?: string;
}

export function AiWorkspaceOverview({ resources = defaultWorkspaceResources, periods = defaultWorkspacePeriods, className }: AiWorkspaceOverviewProps) {
  const [period, setPeriod] = useState(0);
  const current = periods[period];
  const metrics = [
    { title: "活跃用户", value: current.users, subtitle: "使用过任意智能体", icon: <UserBoldDuotone size={18} /> },
    { title: "对话次数", value: current.conversations, subtitle: "含群聊与渠道消息", icon: <ChatRoundLinear size={18} /> },
    { title: "Token 消耗（百万）", value: current.tokens, subtitle: "按模型计费口径", icon: <WidgetBoldDuotone size={18} /> },
    { title: "满意度（%）", value: current.satisfaction, subtitle: "点赞 / 全部反馈", icon: <StarBoldDuotone size={18} /> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-6", className)}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {resources.map(resource => <Panel key={resource.id} variant="template">
        <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-fg-grey-700">{resource.title}</p><span className={cn("grid size-9 place-items-center rounded-full", tone[resource.color])}>{resourceIcon[resource.icon]}</span></div>
        <p className="text-3xl font-semibold tabular-nums text-fg-black">{resource.value}</p>
        <ProgressBar value={resource.progress} color={resource.color} size="sm" />
        <p className="text-xs text-fg-grey-700">{resource.note}</p>
      </Panel>)}
    </div>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="text-lg font-semibold text-fg-black">监控统计</h2><p className="text-sm text-fg-grey-700">活跃用户、对话、Token 与满意度</p></div>
      <ButtonGroup ariaLabel="统计周期" shape="pill" items={periods.map(item => ({ label: item.label }))} activeIndex={period} onChange={setPeriod} />
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(metric => <StatCard key={metric.title} title={metric.title} value={metric.value} animateValue locale="zh-CN" subtitle={metric.subtitle} icon={metric.icon} theme="white" width="full" />)}
    </div>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Panel variant="template" title="用户趋势" subtitle={`近 ${current.label}活跃用户`}>
        <SmoothLineChart series={[{ data: current.trend.users, color: "blue", fillArea: true }]} accent="blue" showYAxis yAxisLabels={[String(Math.max(...current.trend.users)), String(Math.round(Math.max(...current.trend.users) / 2)), "0"]} xAxisLabels={week} height="h-52" />
      </Panel>
      <Panel variant="template" title="对话趋势" subtitle={`近 ${current.label}对话次数`}>
        <SmoothLineChart series={[{ data: current.trend.conversations, color: "purple", fillArea: true }]} accent="purple" showYAxis yAxisLabels={[String(Math.max(...current.trend.conversations)), String(Math.round(Math.max(...current.trend.conversations) / 2)), "0"]} xAxisLabels={week} height="h-52" />
      </Panel>
    </div>
  </section>;
}
