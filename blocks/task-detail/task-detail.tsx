"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent } from "react";
import { Avatar, AvatarGroup, Button, Checkbox, IconButton, Panel, PlusIcon, ProgressBar, StatusBadge, TextField, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export interface TaskChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface TaskDetailData {
  title: string;
  project: string;
  status: { label: string; color: StatusBadgeColor };
  priority: { label: string; color: StatusBadgeColor };
  dueDate: string;
  owner: { name: string; avatar: string };
  description: string;
  members: { name: string; avatar: string }[];
  attachments: { id: string; name: string; size: string; icon: string }[];
  checklist: TaskChecklistItem[];
  activity: { id: string; title: string; detail: string; time: string }[];
}

export const defaultTaskDetail: TaskDetailData = {
  title: "订单搜索与状态筛选",
  project: "客户工作台升级",
  status: { label: "进行中", color: "blue" },
  priority: { label: "高优先级", color: "red" },
  dueDate: "2026-11-04",
  owner: { name: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg" },
  description: "为订单列表增加订单号、客户和公司的组合搜索，并支持按支付状态筛选。筛选结果需要保留在 URL 中，刷新后保持一致，导出时只导出当前筛选结果。",
  members: [
    { name: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg" },
    { name: "林悦", avatar: "/images/blocks/people/lin-yue.jpg" },
    { name: "许知夏", avatar: "/images/blocks/people/xu-zhixia.jpg" },
    { name: "张宁", avatar: "/images/team/edward-allen.png" },
  ],
  attachments: [
    { id: "f1", name: "订单筛选交互稿.fig", size: "4.2 MB", icon: "/images/file-icons/fig.svg" },
    { id: "f2", name: "接口字段说明.pdf", size: "860 KB", icon: "/images/file-icons/pdf.svg" },
  ],
  checklist: [
    { id: "c1", label: "确认搜索字段与匹配规则", done: true },
    { id: "c2", label: "完成筛选下拉与 URL 同步", done: true },
    { id: "c3", label: "空结果与错误状态", done: false },
    { id: "c4", label: "导出当前筛选结果", done: false },
  ],
  activity: [
    { id: "a1", title: "更新了任务状态", detail: "陈思远 将任务从「待开始」移到「进行中」", time: "10-31 16:40" },
    { id: "a2", title: "上传了附件", detail: "林悦 上传了「订单筛选交互稿.fig」", time: "10-30 11:05" },
    { id: "a3", title: "新增评论", detail: "许知夏：退款状态也需要支持筛选。", time: "10-29 18:20" },
  ],
};

export interface TaskDetailProps {
  task?: TaskDetailData;
  onChecklistChange?: (items: TaskChecklistItem[]) => void;
  className?: string;
}

export function TaskDetail({ task = defaultTaskDetail, onChecklistChange, className }: TaskDetailProps) {
  const [checklist, setChecklist] = useState(task.checklist);
  const [draft, setDraft] = useState("");
  const done = checklist.filter(item => item.done).length;
  const progress = checklist.length ? Math.round((done / checklist.length) * 100) : 0;

  function change(next: TaskChecklistItem[]) {
    setChecklist(next);
    onChecklistChange?.(next);
  }

  function add(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    change([...checklist, { id: `c-${Date.now()}`, label: draft.trim(), done: false }]);
    setDraft("");
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[300px_minmax(0,1fr)]", className)}>
    <div className="flex min-w-0 flex-col gap-4">
      <Panel variant="template" title="基本信息">
        <div className="flex items-center gap-3"><Avatar src={task.owner.avatar} alt={task.owner.name} size="md" /><div className="min-w-0"><p className="truncate text-base font-semibold text-fg-black">{task.title}</p><p className="text-sm text-fg-grey-700">{task.project}</p></div></div>
        <dl className="flex flex-col gap-3 text-sm">
          <div><dt className="text-fg-grey-700">状态</dt><dd className="mt-1 flex"><StatusBadge {...task.status} variant="soft" /></dd></div>
          <div><dt className="text-fg-grey-700">截止日期</dt><dd className="mt-1 font-medium text-fg-black">{task.dueDate}</dd></div>
          <div><dt className="text-fg-grey-700">负责人</dt><dd className="mt-1 font-medium text-fg-black">{task.owner.name}</dd></div>
        </dl>
      </Panel>
      <Panel variant="template" title="成员" action={<IconButton variant="tertiary" size="sm" aria-label="添加成员"><PlusIcon size={16} /></IconButton>}>
        <AvatarGroup>{task.members.map(member => <Avatar key={member.name} src={member.avatar} alt={member.name} size="md" />)}</AvatarGroup>
      </Panel>
      <Panel variant="template" title="附件">
        <ul className="flex flex-col gap-3">{task.attachments.map(file => <li key={file.id} className="flex items-center gap-3 rounded-xl border border-fg-grey-200 p-3"><img src={file.icon} alt="" className="size-9" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{file.name}</p><p className="text-xs text-fg-grey-700">{file.size}</p></div></li>)}</ul>
      </Panel>
    </div>
    <div className="flex min-w-0 flex-col gap-4">
      <Panel variant="template" title="进度">
        <p className="text-4xl font-semibold tabular-nums text-fg-black">{progress}%</p>
        <ProgressBar value={progress} color="blue" />
        <div className="flex flex-wrap gap-2"><StatusBadge {...task.priority} variant="soft" /><StatusBadge {...task.status} variant="soft" /></div>
      </Panel>
      <Panel variant="template" title="任务描述"><p className="text-sm leading-6 text-fg-grey-700">{task.description}</p></Panel>
      <Panel variant="template" title="检查清单" subtitle={`已完成 ${done} / ${checklist.length}`}>
        <ul className="flex flex-col gap-2">{checklist.map(item => <li key={item.id} className="flex items-center gap-3 rounded-xl border border-fg-grey-200 px-4 py-3">
          <Checkbox color="blue" checked={item.done} onChange={value => change(checklist.map(entry => entry.id === item.id ? { ...entry, done: value } : entry))} aria-label={item.label} />
          <span className={cn("flex-1 text-sm", item.done ? "text-fg-grey-500 line-through" : "text-fg-black")}>{item.label}</span>
          <IconButton variant="ghost" color="grey" size="sm" aria-label={`删除${item.label}`} onClick={() => change(checklist.filter(entry => entry.id !== item.id))}><TrashBinMinimalisticLinear size={16} /></IconButton>
        </li>)}</ul>
        <form className="flex gap-2" onSubmit={add}><TextField className="flex-1" shape="pill" aria-label="新的检查项" value={draft} onChange={setDraft} placeholder="添加检查项" /><Button type="submit" variant="tertiary" disabled={!draft.trim()}>添加</Button></form>
      </Panel>
      <Panel variant="template" title="最近动态">
        <ol className="flex flex-col divide-y divide-fg-grey-200">{task.activity.map(item => <li key={item.id} className="flex flex-wrap justify-between gap-2 py-3 first:pt-0 last:pb-0"><div><p className="text-sm font-semibold text-fg-black">{item.title}</p><p className="mt-1 text-sm text-fg-grey-700">{item.detail}</p></div><time className="text-xs text-fg-grey-500">{item.time}</time></li>)}</ol>
      </Panel>
    </div>
  </div>;
}
