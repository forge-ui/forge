"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { DataTable, Panel, SmoothLineChart, StatusBadge, TabBar, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";

export interface MemberProject {
  id: string;
  name: string;
  status: { label: string; color: StatusBadgeColor };
  budget: number;
  progress: number;
}

export interface MemberProfileData {
  name: string;
  handle: string;
  avatar: string;
  details: { label: string; value: string }[];
  stats: { title: string; value: string; trend: string; note: string; color: string; data: number[] }[];
  projects: MemberProject[];
  tasks: { id: string; title: string; due: string; status: { label: string; color: StatusBadgeColor } }[];
  activity: { id: string; text: string; time: string }[];
}

export const defaultMemberProfile: MemberProfileData = {
  name: "林悦",
  handle: "体验设计师 · 设计中心",
  avatar: "/images/blocks/people/lin-yue.jpg",
  details: [
    { label: "工号", value: "ZX-1024" },
    { label: "职位", value: "资深体验设计师" },
    { label: "参与项目", value: "6 个" },
    { label: "邮箱", value: "linyue@zhixing.tech" },
    { label: "手机号", value: "139 6620 1834" },
    { label: "最近在线", value: "1 小时前" },
    { label: "入职日期", value: "2023-03-12" },
  ],
  stats: [
    { title: "进行中", value: "8", trend: "5%", note: "本周 +2", color: "var(--fg-blue)", data: [3, 5, 4, 6, 5, 7, 8] },
    { title: "未开始", value: "4", trend: "12%", note: "本周 +1", color: "var(--fg-violet)", data: [6, 5, 5, 4, 5, 4, 4] },
    { title: "已完成", value: "36", trend: "8%", note: "本周 +5", color: "var(--fg-green-500)", data: [20, 23, 25, 28, 30, 33, 36] },
  ],
  projects: [
    { id: "p1", name: "客户工作台升级", status: { label: "进行中", color: "blue" }, budget: 280000, progress: 75 },
    { id: "p2", name: "品牌官网改版", status: { label: "进行中", color: "blue" }, budget: 120000, progress: 48 },
    { id: "p3", name: "门店会员系统", status: { label: "待启动", color: "grey" }, budget: 86000, progress: 0 },
    { id: "p4", name: "内容中台", status: { label: "有风险", color: "red" }, budget: 92000, progress: 32 },
    { id: "p5", name: "数据看板定制", status: { label: "已完成", color: "green" }, budget: 58000, progress: 100 },
  ],
  tasks: [
    { id: "t1", title: "高保真首页设计", due: "今天", status: { label: "进行中", color: "blue" } },
    { id: "t2", title: "订单详情交互稿", due: "11月4日", status: { label: "待评审", color: "yellow" } },
    { id: "t3", title: "设计规范色板更新", due: "11月8日", status: { label: "未开始", color: "grey" } },
  ],
  activity: [
    { id: "a1", text: "更新了订单详情的交互方案", time: "10-31 16:40" },
    { id: "a2", text: "评论了「品牌官网改版」首页视觉", time: "10-30 10:12" },
    { id: "a3", text: "完成了「数据看板定制」交付验收", time: "10-28 17:30" },
  ],
};

const tabs = ["项目", "任务", "动态"];

export interface MemberProfileProps {
  member?: MemberProfileData;
  className?: string;
}

export function MemberProfile({ member = defaultMemberProfile, className }: MemberProfileProps) {
  const [tab, setTab] = useState(0);
  const columns: ColumnDef<MemberProject>[] = [
    { key: "name", header: "项目", minWidth: 180, render: project => <span className="text-sm font-semibold text-fg-black">{project.name}</span> },
    { key: "status", header: "状态", minWidth: 96, render: project => <StatusBadge {...project.status} variant="soft" /> },
    { key: "progress", header: "进度", minWidth: 140, render: project => <div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-fg-grey-100"><div className="h-full rounded-full bg-fg-blue" style={{ width: `${project.progress}%` }} /></div><span className="text-xs tabular-nums text-fg-grey-700">{project.progress}%</span></div> },
    { key: "budget", header: "预算", minWidth: 110, valueKind: "number", render: project => <span className="text-sm tabular-nums text-fg-black">¥{project.budget.toLocaleString("zh-CN")}</span> },
  ];

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]", className)}>
    <Panel variant="custom" as="aside" className="overflow-hidden rounded-card border border-fg-grey-200 bg-background p-5">
      <div className="h-28 rounded-2xl bg-gradient-to-r from-fg-blue via-fg-violet-300 to-fg-yellow-100" />
      <div className="-mt-10 flex flex-col items-center gap-2 text-center">
        <img src={member.avatar} alt={member.name} className="size-20 rounded-full border-4 border-white object-cover" />
        <p className="text-xl font-semibold text-fg-black">{member.name}</p>
        <p className="text-sm text-fg-grey-700">{member.handle}</p>
      </div>
      <dl className="mt-5 flex flex-col gap-3 border-t border-fg-grey-200 pt-5">{member.details.map(item => <div key={item.label}><dt className="text-xs text-fg-grey-700">{item.label}</dt><dd className="mt-1 text-sm font-medium text-fg-black">{item.value}</dd></div>)}</dl>
    </Panel>
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{member.stats.map(stat => <div key={stat.title} className="flex flex-col gap-2 rounded-card border border-fg-grey-200 bg-background p-4">
        <p className="text-sm text-fg-grey-700">{stat.title}</p>
        <div className="flex items-end justify-between gap-3"><div><p className="text-2xl font-semibold tabular-nums text-fg-black">{stat.value}</p><p className="mt-1 text-xs"><span className="font-bold text-fg-green-500">{stat.trend} ↑</span><span className="ml-1 text-fg-grey-700">{stat.note}</span></p></div><div className="w-20"><SmoothLineChart series={[{ data: stat.data, color: stat.color }]} height="h-10" /></div></div>
      </div>)}</div>
      <div className="fg-scrollbar-hidden overflow-x-auto border-b border-fg-grey-200"><TabBar color="blue" tabs={tabs.map((label, index) => ({ label, active: index === tab }))} onChange={setTab} /></div>
      {tab === 0 && <DataTable<MemberProject> columns={columns} rows={member.projects} getRowKey={project => project.id} footerLeft={<p className="text-sm text-fg-grey-700">共 {member.projects.length} 个项目</p>} />}
      {tab === 1 && <Panel variant="template" title="手头任务"><ul className="flex flex-col divide-y divide-fg-grey-200">{member.tasks.map(task => <li key={task.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div><p className="text-sm font-semibold text-fg-black">{task.title}</p><p className="text-xs text-fg-grey-700">截止 {task.due}</p></div><StatusBadge {...task.status} variant="soft" /></li>)}</ul></Panel>}
      {tab === 2 && <Panel variant="template" title="最近动态"><ol className="flex flex-col divide-y divide-fg-grey-200">{member.activity.map(item => <li key={item.id} className="flex justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0"><span className="text-fg-black">{item.text}</span><time className="shrink-0 text-xs text-fg-grey-500">{item.time}</time></li>)}</ol></Panel>}
    </div>
  </div>;
}
