"use client";

import { useState } from "react";
import { Avatar, Button, ButtonGroup, Panel, PlusIcon, StatusBadge, ToolbarSearchInput, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { ChatRoundLinear, ListCheckLinear, ClockCircleLinear } from "@forge-ui-official/core/icons";

export type AgentState = "running" | "waiting" | "idle" | "failed";

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  tone: string;
  state: AgentState;
  description: string;
  tasks: number;
  lastRun: string;
  skills: string[];
}

export const defaultAgents: AgentProfile[] = [
  { id: "ag1", name: "研究助手", role: "市场与竞品研究", initials: "研", tone: "bg-fg-blue-50 text-fg-blue", state: "running", description: "汇总行业报告与竞品动态，每周一生成研究简报。", tasks: 12, lastRun: "2 分钟前", skills: ["网页检索", "报告摘要", "表格整理"] },
  { id: "ag2", name: "设计助手", role: "视觉与交互评审", initials: "设", tone: "bg-fg-violet-50 text-fg-violet", state: "waiting", description: "对照设计规范检查页面间距、字色与组件用法。", tasks: 5, lastRun: "18 分钟前", skills: ["规范检查", "截图对比"] },
  { id: "ag3", name: "客服助手", role: "工单分流与回复", initials: "客", tone: "bg-fg-green-50 text-fg-green-500", state: "running", description: "自动分类客户工单，起草回复并转交人工确认。", tasks: 48, lastRun: "刚刚", skills: ["意图识别", "知识库问答", "工单分派"] },
  { id: "ag4", name: "财务助手", role: "对账与发票", initials: "财", tone: "bg-fg-yellow-50 text-fg-yellow-600", state: "idle", description: "每日核对回款与发票状态，生成逾期提醒。", tasks: 3, lastRun: "今天 08:00", skills: ["银行对账", "发票识别"] },
  { id: "ag5", name: "数据助手", role: "经营报表", initials: "数", tone: "bg-fg-cyan-50 text-fg-cyan-600", state: "failed", description: "按周生成经营看板数据，本次因数据源授权过期而中断。", tasks: 1, lastRun: "1 小时前", skills: ["SQL 查询", "图表生成"] },
  { id: "ag6", name: "招聘助手", role: "简历筛选", initials: "招", tone: "bg-fg-red-50 text-fg-red", state: "idle", description: "根据岗位要求初筛简历并安排面试时间。", tasks: 0, lastRun: "昨天", skills: ["简历解析", "日程协调"] },
];

const stateMeta: Record<AgentState, { label: string; color: StatusBadgeColor }> = {
  running: { label: "运行中", color: "green" },
  waiting: { label: "等待确认", color: "yellow" },
  idle: { label: "空闲", color: "grey" },
  failed: { label: "执行失败", color: "red" },
};
const filters: { label: string; value: AgentState | "all" }[] = [{ label: "全部", value: "all" }, { label: "运行中", value: "running" }, { label: "等待确认", value: "waiting" }, { label: "空闲", value: "idle" }, { label: "执行失败", value: "failed" }];

export interface AgentDirectoryProps {
  agents?: AgentProfile[];
  onCreate?: () => void;
  onChat?: (agent: AgentProfile) => void;
  onAssign?: (agent: AgentProfile) => void;
  className?: string;
}

export function AgentDirectory({ agents = defaultAgents, onCreate, onChat, onAssign, className }: AgentDirectoryProps) {
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const state = filters[filter].value;
  const visible = agents.filter(agent => (state === "all" || agent.state === state) && `${agent.name} ${agent.role} ${agent.skills.join(" ")}`.includes(query.trim()));

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="-mx-1 min-w-0 fg-scrollbar-hidden overflow-x-auto px-1 pb-1"><ButtonGroup ariaLabel="智能体状态" shape="pill" items={filters.map(item => ({ label: item.label }))} activeIndex={filter} onChange={setFilter} /></div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <ToolbarSearchInput className="w-full sm:w-60" value={query} onChange={setQuery} placeholder="搜索智能体或技能" />
        <Button iconLeft={<PlusIcon size={16} />} onClick={onCreate}>新建智能体</Button>
      </div>
    </div>
    {visible.length ? <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{visible.map(agent => <li key={agent.id}><Panel variant="template" className="h-full">
      <div className="flex items-start gap-3">
        <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-semibold", agent.tone)}>{agent.initials}</span>
        <div className="min-w-0 flex-1"><p className="text-base font-semibold text-fg-black">{agent.name}</p><p className="text-sm text-fg-grey-700">{agent.role}</p></div>
        <StatusBadge {...stateMeta[agent.state]} variant="soft" />
      </div>
      <p className="text-sm leading-6 text-fg-grey-700">{agent.description}</p>
      <div className="flex flex-wrap gap-2">{agent.skills.map(skill => <span key={skill} className="rounded-full bg-fg-grey-50 px-2.5 py-1 text-xs font-medium text-fg-grey-700">{skill}</span>)}</div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-fg-grey-200 pt-4 text-xs text-fg-grey-700">
        <span className="flex items-center gap-1"><ListCheckLinear size={14} />{agent.tasks} 个任务</span>
        <span className="flex items-center gap-1"><ClockCircleLinear size={14} />{agent.lastRun}</span>
      </div>
      <div className="grid grid-cols-2 gap-3"><Button size="sm" variant="tertiary" iconLeft={<ChatRoundLinear size={16} />} onClick={() => onChat?.(agent)}>对话</Button><Button size="sm" onClick={() => onAssign?.(agent)}>分配任务</Button></div>
    </Panel></li>)}</ul> : <p className="rounded-card border border-dashed border-fg-grey-200 py-16 text-center text-sm text-fg-grey-700">没有符合条件的智能体</p>}
    <div className="flex items-center gap-2 text-xs text-fg-grey-500"><Avatar initials="张" size="sm" />由张宁管理 · 共 {agents.length} 个智能体</div>
  </section>;
}
