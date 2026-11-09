"use client";

import { Avatar, AvatarGroup, Panel, ProgressBar, StatusBadge, cn } from "@forge-ui-official/core";
import { CheckCircleLinear, ClockCircleLinear } from "@forge-ui-official/core/icons";

export interface ProjectMember { id: string; name: string; role: string; avatar?: string }
export interface ProjectMilestone { id: string; title: string; owner: string; dueDate: string; completed: boolean }
export interface ProjectActivity { id: string; author: string; description: string; time: string; avatar?: string }

export const defaultProjectMembers: ProjectMember[] = [
  { id: "zhang", name: "张宁", role: "产品负责人", avatar: "/images/team/edward-allen.png" }, { id: "lin", name: "林悦", role: "体验设计师", avatar: "/images/protask/crm/linda-blair-avatar.png" },
  { id: "chen", name: "陈思远", role: "前端工程师", avatar: "/images/protask/crm/john-hoegan-avatar.png" }, { id: "zhou", name: "周予安", role: "后端工程师", avatar: "/images/team/edward-allen.png" },
  { id: "xu", name: "许知夏", role: "测试工程师", avatar: "/images/protask/crm/linda-blair-avatar.png" }, { id: "shen", name: "沈清和", role: "客户成功", avatar: "/images/protask/crm/john-hoegan-avatar.png" },
];
export const defaultProjectMilestones: ProjectMilestone[] = [
  { id: "research", title: "需求梳理与方案评审", owner: "张宁", dueDate: "10 月 21 日", completed: true },
  { id: "design", title: "核心流程与交互设计", owner: "林悦", dueDate: "10 月 25 日", completed: true },
  { id: "develop", title: "订单与客户模块联调", owner: "陈思远", dueDate: "11 月 4 日", completed: false },
  { id: "release", title: "全流程验收与上线", owner: "许知夏", dueDate: "11 月 12 日", completed: false },
];
export const defaultProjectActivities: ProjectActivity[] = [
  { id: "a1", author: "林悦", description: "更新了订单详情的交互方案", time: "10 月 31 日 16:40" },
  { id: "a2", author: "陈思远", description: "完成订单搜索与状态筛选", time: "10 月 31 日 15:20" },
  { id: "a3", author: "许知夏", description: "补充了支付回调验收清单", time: "10 月 31 日 11:05" },
  { id: "a4", author: "张宁", description: "确认第二阶段交付范围", time: "10 月 30 日 17:30" },
];

export interface ProjectOverviewProps {
  title?: string;
  description?: string;
  progress?: number;
  progressLabel?: string;
  deadline?: string;
  members?: ProjectMember[];
  milestones?: ProjectMilestone[];
  activities?: ProjectActivity[];
  className?: string;
}

export function ProjectOverview({ title = "客户工作台升级", description = "知行科技 · 第二阶段交付", progress = 75, progressLabel = "已完成 18 / 24 项任务", deadline = "2026 年 11 月 12 日", members = defaultProjectMembers, milestones = defaultProjectMilestones, activities = defaultProjectActivities, className }: ProjectOverviewProps) {
  const completion = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  const owner = members.find(member => member.role.includes("负责人"));
  return <section className={cn("@container flex min-w-0 flex-col gap-5", className)}>
    <header><h2 className="text-2xl font-semibold text-fg-black">{title}</h2><p className="mt-1 text-sm text-fg-grey-700">{description}</p></header>
    <div className="grid min-w-0 grid-cols-1 gap-4 @min-[760px]:grid-cols-3">
      <Panel title="交付进度" subtitle={`计划交付：${deadline}`} className="@min-[760px]:col-span-2"><div className="flex items-end justify-between gap-3"><span className="text-3xl font-semibold tabular-nums text-fg-black">{completion}%</span><span className="text-sm text-fg-grey-700">{progressLabel}</span></div><ProgressBar value={completion} color="blue" /></Panel>
      <Panel title="项目成员" subtitle="产品与交付团队"><div className="flex items-center justify-start"><AvatarGroup>{members.map(member => <span key={member.id} title={`${member.name} · ${member.role}`} className="rounded-full border-2 border-white"><Avatar src={member.avatar} initials={member.name.slice(0, 1)} alt={member.name} size="sm" /></span>)}</AvatarGroup></div><p className="text-xs leading-5 text-fg-grey-700">{members.length} 人{owner ? ` · 负责人 ${owner.name}` : "协作"}</p></Panel>
    </div>
    <div className="grid min-w-0 grid-cols-1 gap-4 @min-[840px]:grid-cols-2">
      <Panel title="交付里程碑" subtitle={`${milestones.filter(item => item.completed).length} / ${milestones.length} 个里程碑已完成`}><ul className="divide-y divide-fg-grey-100">{milestones.map(item => <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className={item.completed ? "text-fg-green-500" : "text-fg-grey-500"}>{item.completed ? <CheckCircleLinear size={20} /> : <ClockCircleLinear size={20} />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-fg-black">{item.title}</p><p className="mt-1 text-xs text-fg-grey-700">{item.owner} · {item.dueDate}</p></div><StatusBadge label={item.completed ? "已完成" : "进行中"} color={item.completed ? "green" : "blue"} variant="soft" /></li>)}</ul></Panel>
      <Panel title="最近活动" subtitle="项目成员的最新进展"><ol className="divide-y divide-fg-grey-100">{activities.map(activity => <li key={activity.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"><Avatar src={activity.avatar ?? members.find(member => member.name === activity.author)?.avatar} initials={activity.author.slice(0, 1)} alt={activity.author} size="sm" /><div className="min-w-0"><p className="text-sm leading-5 text-fg-black"><span className="font-semibold">{activity.author}</span> {activity.description}</p><p className="mt-1 text-xs text-fg-grey-500">{activity.time}</p></div></li>)}</ol></Panel>
    </div>
  </section>;
}
