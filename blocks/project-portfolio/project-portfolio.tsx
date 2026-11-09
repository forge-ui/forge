"use client";

import { useState } from "react";
import { Button, ButtonGroup, DataTable, Panel, PlusIcon, ProgressBar, StatusBadge, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";

export type PortfolioStatus = "planned" | "active" | "paused" | "done";

export interface PortfolioProject {
  id: string;
  name: string;
  owner: string;
  status: PortfolioStatus;
  done: number;
  total: number;
  attention: number;
  updatedAt: string;
}

export const defaultPortfolioProjects: PortfolioProject[] = [
  { id: "p1", name: "客户工作台升级", owner: "张宁", status: "active", done: 18, total: 24, attention: 2, updatedAt: "11-09" },
  { id: "p2", name: "品牌官网改版", owner: "林悦", status: "active", done: 7, total: 15, attention: 1, updatedAt: "11-08" },
  { id: "p3", name: "售后智能客服上线", owner: "周予安", status: "active", done: 11, total: 12, attention: 0, updatedAt: "11-08" },
  { id: "p4", name: "门店会员系统", owner: "陈思远", status: "planned", done: 0, total: 20, attention: 0, updatedAt: "11-06" },
  { id: "p5", name: "内容中台", owner: "江雨桐", status: "paused", done: 6, total: 18, attention: 3, updatedAt: "11-02" },
  { id: "p6", name: "数据看板定制", owner: "许知夏", status: "done", done: 14, total: 14, attention: 0, updatedAt: "10-28" },
];

const statusMeta: Record<PortfolioStatus, { label: string; color: StatusBadgeColor; bar: "gray" | "blue" | "yellow" | "green" }> = {
  planned: { label: "计划中", color: "grey", bar: "gray" },
  active: { label: "进行中", color: "blue", bar: "blue" },
  paused: { label: "已暂停", color: "yellow", bar: "yellow" },
  done: { label: "已完成", color: "green", bar: "green" },
};
const filters: { label: string; value: PortfolioStatus | "all" }[] = [{ label: "全部", value: "all" }, { label: "进行中", value: "active" }, { label: "计划中", value: "planned" }, { label: "已暂停", value: "paused" }, { label: "已完成", value: "done" }];

function Ring({ value, color }: { value: number; color: string }) {
  return <span className="relative grid size-12 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${color} ${value * 3.6}deg, var(--fg-grey-100) 0deg)` }}><span className="grid size-9 place-items-center rounded-full bg-white text-[11px] font-semibold tabular-nums text-fg-black">{value}%</span></span>;
}

const ringColor: Record<PortfolioStatus, string> = { planned: "var(--fg-grey-300)", active: "var(--fg-blue)", paused: "var(--fg-yellow-500)", done: "var(--fg-green-500)" };

export interface ProjectPortfolioProps {
  projects?: PortfolioProject[];
  onCreate?: () => void;
  onOpen?: (project: PortfolioProject) => void;
  className?: string;
}

export function ProjectPortfolio({ projects = defaultPortfolioProjects, onCreate, onOpen, className }: ProjectPortfolioProps) {
  const [filter, setFilter] = useState(0);
  const [view, setView] = useState(0);
  const status = filters[filter].value;
  const visible = projects.filter(project => status === "all" || project.status === status);
  const done = projects.reduce((sum, project) => sum + project.done, 0);
  const total = projects.reduce((sum, project) => sum + project.total, 0);
  const attention = projects.reduce((sum, project) => sum + project.attention, 0);
  const percent = (project: PortfolioProject) => Math.round((project.done / project.total) * 100);
  const columns: ColumnDef<PortfolioProject>[] = [
    { key: "name", header: "项目", minWidth: 200, render: project => <span className="text-sm font-semibold text-fg-black">{project.name}</span> },
    { key: "status", header: "状态", minWidth: 90, render: project => <StatusBadge label={statusMeta[project.status].label} color={statusMeta[project.status].color} variant="soft" /> },
    { key: "progress", header: "进度", minWidth: 180, render: project => <ProgressBar value={percent(project)} color={statusMeta[project.status].bar} label={`${project.done}/${project.total} 任务`} size="sm" /> },
    { key: "owner", header: "负责人", minWidth: 80, render: project => <span className="text-sm text-fg-grey-900">{project.owner}</span> },
    { key: "updatedAt", header: "更新", minWidth: 80, render: project => <span className="text-sm text-fg-grey-700">{project.updatedAt}</span> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Panel variant="template" title="整体进度"><p className="text-3xl font-semibold tabular-nums text-fg-black">{done}<span className="text-lg text-fg-grey-500"> / {total}</span></p><ProgressBar value={Math.round((done / total) * 100)} color="blue" label={`已完成任务 ${Math.round((done / total) * 100)}%`} size="sm" /><p className="text-xs text-fg-grey-700">剩余 {total - done} 项任务未完成</p></Panel>
      <Panel variant="template" title="项目进展"><ul className="flex flex-col gap-2">{(Object.keys(statusMeta) as PortfolioStatus[]).map(key => { const count = projects.filter(project => project.status === key).length; return <li key={key} className="grid grid-cols-[56px_minmax(0,1fr)_24px] items-center gap-3 text-xs"><span className="text-fg-grey-700">{statusMeta[key].label}</span><span className="h-1.5 overflow-hidden rounded-full bg-fg-grey-100"><span className="block h-full rounded-full" style={{ width: `${(count / projects.length) * 100}%`, background: ringColor[key] }} /></span><span className="text-right tabular-nums text-fg-black">{count}</span></li>; })}</ul></Panel>
      <Panel variant="template" title="需要关注"><p className="text-3xl font-semibold tabular-nums text-fg-black">{attention}</p><p className="text-xs text-fg-grey-700">待审核、受阻与失败的任务</p><ul className="flex flex-col gap-1 text-sm">{projects.filter(project => project.attention).map(project => <li key={project.id} className="flex justify-between"><span className="truncate text-fg-grey-900">{project.name}</span><span className="tabular-nums text-fg-red">{project.attention}</span></li>)}</ul></Panel>
    </div>
    <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="fg-scrollbar-hidden -mx-1 min-w-0 overflow-x-auto px-1 pb-1"><ButtonGroup ariaLabel="项目状态" shape="pill" items={filters.map(item => ({ label: item.label }))} activeIndex={filter} onChange={setFilter} /></div>
      <div className="flex items-center gap-3"><ButtonGroup ariaLabel="显示方式" shape="pill" items={[{ label: "卡片" }, { label: "表格" }]} activeIndex={view} onChange={setView} /><Button iconLeft={<PlusIcon size={16} />} onClick={onCreate}>新建项目</Button></div>
    </div>
    {view === 0 ? <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map(project => <li key={project.id}><Button variant="unstyled" type="button" className="flex h-full w-full flex-col gap-4 rounded-card border border-fg-grey-200 bg-white p-5 text-left transition-shadow hover:shadow-elevated" onClick={() => onOpen?.(project)}>
      <span className="flex w-full items-start justify-between gap-3"><span className="min-w-0 text-base font-semibold text-fg-black">{project.name}</span><StatusBadge label={statusMeta[project.status].label} color={statusMeta[project.status].color} variant="soft" /></span>
      <span className="flex w-full items-center gap-4"><Ring value={percent(project)} color={ringColor[project.status]} /><span className="flex-1 text-sm text-fg-grey-700">{project.done} / {project.total} 任务{project.attention > 0 && <span className="ml-2 text-fg-red">· {project.attention} 项需关注</span>}</span></span>
      <span className="flex w-full justify-between border-t border-fg-grey-200 pt-3 text-xs text-fg-grey-700"><span>{project.owner}</span><span>更新 {project.updatedAt}</span></span>
    </Button></li>)}</ul> : <DataTable<PortfolioProject> columns={columns} rows={visible} getRowKey={project => project.id} />}
  </section>;
}
