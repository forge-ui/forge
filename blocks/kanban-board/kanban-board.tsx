"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Avatar, Breadcrumbs, Button, IconButton, KebabMenu, PageTitleToolbar, PlusIcon, ProgressBar, TextField } from "@forge-ui-official/core";
import { AltArrowDownLinear, AltArrowLeftLinear, ArrowLeftLinear, CalendarMinimalisticLinear, ClipboardListBoldDuotone, CodeLinear, BookBoldDuotone, CloseCircleLinear, CloseSquareLinear, MenuDotsLinear } from "@forge-ui-official/core/icons";

export type WorkItemStatus = "backlog" | "todo" | "in_progress" | "in_review" | "failed" | "done";
export type WorkItemPriority = "urgent" | "high" | "medium" | "low" | "none";

export interface BoardAssignee {
  name: string;
  avatar: string;
  agent?: boolean;
}

export interface WorkItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  priority: WorkItemPriority;
  assignee?: BoardAssignee;
  due?: string;
  working?: boolean;
  subtasks: { id: string; title: string; done: boolean }[];
  activity: { who: string; avatar: string; text: string; at: string }[];
}

export interface BoardProject {
  title: string;
  status: string;
  priority: string;
  lead: string;
  createdAt: string;
  description: string;
  resources: { name: string; kind: string; icon: "code" | "book" }[];
}

const agents = {
  coding: { name: "编程助手", avatar: "/images/blocks/agents/music-box-robot.webp", agent: true },
  office: { name: "办公助理", avatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp", agent: true },
  general: { name: "通用智能体", avatar: "/images/blocks/agents/observatory-robot.webp", agent: true },
  ops: { name: "运维分析", avatar: "/images/blocks/agents/lighthouse-lantern-room.webp", agent: true },
  lin: { name: "林悦", avatar: "/images/blocks/people/lin-yue.jpg" },
  chen: { name: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg" },
};

const created = (who: BoardAssignee, at: string) => ({ who: who.name, avatar: who.avatar, text: "创建了这个任务", at });

export const defaultBoardProject: BoardProject = {
  title: "官网改版上线",
  status: "进行中",
  priority: "高",
  lead: "编程助手",
  createdAt: "10月8日",
  description: "新版官网的页面、表单与埋点，月底前上线。会作为项目上下文提供给智能体，用于该项目下的每次运行。",
  resources: [{ name: "zhixing/website", kind: "代码仓库 · main", icon: "code" }, { name: "品牌规范与文案", kind: "知识库 · 18 篇文档", icon: "book" }],
};

export const defaultWorkItems: WorkItem[] = [
  { id: "w-21", code: "W-21", title: "整理新版导航的页面清单", description: "对照旧站统计访问量，列出保留、合并和下线的页面。", status: "backlog", priority: "low", assignee: agents.office, subtasks: [], activity: [created(agents.lin, "11月2日")] },
  { id: "w-22", code: "W-22", title: "准备上线公告草稿", description: "公众号与官网新闻各一版，突出新功能。", status: "backlog", priority: "none", subtasks: [], activity: [created(agents.lin, "11月3日")] },
  { id: "w-18", code: "W-18", title: "表单接入线索评分", description: "官网咨询表单提交后，自动写入线索并打分。", status: "todo", priority: "high", assignee: agents.coding, due: "11月14日", subtasks: [{ id: "s1", title: "表单字段对齐 CRM", done: true }, { id: "s2", title: "评分规则配置", done: false }, { id: "s3", title: "失败重试与告警", done: false }], activity: [created(agents.chen, "11月4日"), { who: "编程助手", avatar: agents.coding.avatar, text: "开始工作", at: "11月5日" }] },
  { id: "w-19", code: "W-19", title: "补齐产品页的结构化数据", description: "按 schema.org 补 Product 与 FAQ 标记。", status: "todo", priority: "medium", assignee: agents.general, subtasks: [], activity: [created(agents.chen, "11月4日")] },
  { id: "w-15", code: "W-15", title: "首页首屏改版", description: "新版主视觉、核心卖点与客户案例轮播。", status: "in_progress", priority: "urgent", assignee: agents.coding, due: "11月10日", working: true, subtasks: [{ id: "s4", title: "主视觉切图", done: true }, { id: "s5", title: "案例轮播组件", done: true }, { id: "s6", title: "移动端适配", done: false }], activity: [created(agents.lin, "10月28日"), { who: "编程助手", avatar: agents.coding.avatar, text: "开始工作", at: "11月8日" }] },
  { id: "w-16", code: "W-16", title: "埋点方案与事件命名", description: "统一页面浏览、按钮点击和表单提交的事件名。", status: "in_progress", priority: "medium", assignee: agents.chen, subtasks: [], activity: [created(agents.chen, "10月30日")] },
  { id: "w-14", code: "W-14", title: "价格页文案审校", description: "核对套餐价格、权益说明与合同条款一致。", status: "in_review", priority: "high", assignee: agents.office, due: "11月11日", subtasks: [], activity: [created(agents.lin, "10月27日"), { who: "办公助理", avatar: agents.office.avatar, text: "提交审核", at: "11月8日" }] },
  { id: "w-13", code: "W-13", title: "旧链接 301 跳转表", description: "导出旧站全部 URL，生成跳转映射并验证。", status: "failed", priority: "high", assignee: agents.ops, subtasks: [], activity: [created(agents.chen, "10月26日"), { who: "运维分析", avatar: agents.ops.avatar, text: "执行失败：旧站 sitemap 无法访问", at: "11月7日" }] },
  { id: "w-11", code: "W-11", title: "确定新版视觉规范", description: "颜色、字号与组件间距定稿。", status: "done", priority: "medium", assignee: agents.lin, subtasks: [], activity: [created(agents.lin, "10月20日")] },
  { id: "w-12", code: "W-12", title: "竞品官网信息架构调研", description: "整理 5 家竞品的导航与转化路径。", status: "done", priority: "low", assignee: agents.general, subtasks: [], activity: [created(agents.chen, "10月21日")] },
];

export interface BoardLane {
  id: string;
  name: string;
  tint: string;
}

export const defaultBoardLanes: BoardLane[] = [
  { id: "backlog", name: "待规划", tint: "bg-fg-grey-50" },
  { id: "todo", name: "待办", tint: "bg-fg-grey-50" },
  { id: "in_progress", name: "进行中", tint: "bg-fg-yellow-50" },
  { id: "in_review", name: "审核中", tint: "bg-fg-green-50" },
  { id: "failed", name: "失败", tint: "bg-fg-red-50" },
  { id: "done", name: "已完成", tint: "bg-fg-grey-50" },
];
const builtinLanes = new Set(defaultBoardLanes.map(lane => lane.id));
const ease = "cubic-bezier(.22,1,.36,1)";

const ring: Record<WorkItemPriority, string> = { urgent: "border-fg-red-500", high: "border-fg-yellow-500", medium: "border-fg-blue-500", low: "border-fg-cyan-600", none: "border-fg-grey-300" };
const fill: Record<WorkItemPriority, string> = { urgent: "border-fg-red-500 bg-fg-red-500", high: "border-fg-yellow-500 bg-fg-yellow-500", medium: "border-fg-blue-500 bg-fg-blue-500", low: "border-fg-cyan-600 bg-fg-cyan-600", none: "border-fg-grey-500 bg-fg-grey-500" };
const priorityLabels: Record<WorkItemPriority, string> = { urgent: "紧急", high: "高", medium: "中", low: "低", none: "无优先级" };

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function Face({ src, className }: { src: string; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />;
}

function CompleteToggle({ checked, priority, label, size = "md", onToggle }: { checked: boolean; priority: WorkItemPriority; label: string; size?: "sm" | "md" | "lg"; onToggle: () => void }) {
  const dimension = size === "lg" ? "size-6" : size === "sm" ? "size-4" : "size-5";
  return <button type="button" role="checkbox" aria-checked={checked} aria-label={`${checked ? "重新打开" : "完成"}：${label}`} onClick={event => { event.stopPropagation(); onToggle(); }} className={`${dimension} shrink-0 rounded-full border-2 transition-transform active:scale-90 ${checked ? fill[priority] : `bg-background ${ring[priority]}`}`}>
    {checked ? <svg viewBox="0 0 16 16" aria-hidden className={`mx-auto ${size === "sm" ? "size-2.5" : "size-3"} text-fg-white`}><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
  </button>;
}

function SidebarSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="flex flex-col gap-1"><div className="flex min-h-8 items-center justify-between gap-2"><h2 className="text-sm font-medium text-fg-black">{title}</h2>{action}</div>{children}</section>;
}

function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex min-h-8 items-center gap-2"><span className="w-16 shrink-0 text-sm text-fg-grey-700">{label}</span><div className="min-w-0 flex-1 text-sm text-fg-black">{children}</div></div>;
}

function TaskCard({ item, lanes, dragging, onPointerDown, onOpen, onToggle, onMove, onDelete, onSubtask }: { item: WorkItem; lanes: BoardLane[]; dragging?: boolean; onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void; onOpen: () => void; onToggle: () => void; onMove: (lane: string) => void; onDelete: () => void; onSubtask: (id: string) => void }) {
  const [subtasksOpen, setSubtasksOpen] = useState(false);
  const done = item.status === "done";
  const finished = item.subtasks.filter(subtask => subtask.done).length;
  const comments = item.activity.filter(entry => entry.text.startsWith("评论")).length;
  return <article data-task-id={item.id} onPointerDown={onPointerDown} style={dragging ? { height: 0, padding: 0, marginBottom: -12, overflow: "hidden", opacity: 0, pointerEvents: "none" } : { touchAction: "pan-y" }} className={`group relative shrink-0 cursor-grab select-none rounded-[10px] bg-background p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] ${done ? "opacity-65" : ""}`}>
    <div className="flex items-start gap-2">
      <span data-no-drag className="relative z-10 inline-flex pt-px"><CompleteToggle checked={done} priority={item.priority} label={item.title} onToggle={onToggle} /></span>
      <div className="min-w-0 flex-1">
        <button type="button" onClick={onOpen} className="flex w-full min-w-0 cursor-grab flex-col text-left after:absolute after:inset-0 after:content-['']">
          <span className={`block max-w-full truncate text-sm font-semibold leading-5 ${done ? "text-fg-grey-500 line-through" : "text-fg-black"}`}>{item.title}</span>
          <span className="mt-0.5 line-clamp-1 text-[13px] leading-5 text-fg-grey-700">{item.description}</span>
        </button>
        <div className="relative z-10 mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 text-xs leading-4 text-fg-grey-700">
          {item.assignee ? <span className="inline-flex items-center gap-1"><Face src={item.assignee.avatar} className="size-4" />{item.assignee.name}</span> : null}
          {item.due ? <span>{item.due}</span> : null}
          {item.subtasks.length ? <button type="button" data-no-drag aria-expanded={subtasksOpen} onClick={() => setSubtasksOpen(open => !open)} className="inline-flex items-center gap-1 rounded px-1 hover:bg-fg-grey-50"><ClipboardListBoldDuotone size={14} />{finished}/{item.subtasks.length}<span className={`transition-transform ${subtasksOpen ? "rotate-180" : ""}`}><AltArrowDownLinear size={12} /></span></button> : null}
          {comments ? <span>讨论 {comments}</span> : null}
          {item.working ? <span className="font-medium text-fg-blue-500">工作中</span> : null}
        </div>
        {subtasksOpen ? <div data-no-drag className="relative z-10 mt-2 flex flex-col gap-1.5 border-t border-fg-grey-100 pt-2">
          {item.subtasks.map(subtask => <label key={subtask.id} className="flex items-center gap-2 text-xs"><CompleteToggle size="sm" checked={subtask.done} priority={item.priority} label={subtask.title} onToggle={() => onSubtask(subtask.id)} /><span className={subtask.done ? "text-fg-grey-500 line-through" : "text-fg-black"}>{subtask.title}</span></label>)}
        </div> : null}
      </div>
      <span data-no-drag className="relative z-10 opacity-100 transition-opacity xl:opacity-0 xl:group-hover:opacity-100 xl:group-focus-within:opacity-100"><KebabMenu accent="blue" items={[...lanes.filter(lane => lane.id !== item.status).map(lane => ({ label: `移到「${lane.name}」`, onSelect: () => onMove(lane.id) })), { label: "删除任务", danger: true, onSelect: onDelete }]} /></span>
    </div>
  </article>;
}

function QuickAdd({ onAdd }: { onAdd: (title: string, description: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1.5 px-2 py-1.5 text-left text-sm text-fg-grey-500 hover:text-fg-grey-800"><PlusIcon size={14} />添加任务</button>;
  return <form className="flex shrink-0 flex-col gap-2.5 rounded-[10px] border border-fg-grey-300 bg-background p-3 focus-within:border-fg-grey-500" onSubmit={event => { event.preventDefault(); if (!title.trim()) return; onAdd(title.trim(), description.trim()); setTitle(""); setDescription(""); setOpen(false); }}>
    <input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="任务标题" className="border-0 bg-transparent p-0 text-sm font-semibold text-fg-black outline-none placeholder:text-fg-grey-500" />
    <input value={description} onChange={event => setDescription(event.target.value)} placeholder="添加描述" className="border-0 bg-transparent p-0 text-xs text-fg-grey-700 outline-none placeholder:text-fg-grey-500" />
    <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1 text-xs text-fg-grey-500"><CalendarMinimalisticLinear size={14} />日期</span><div className="ml-auto flex items-center gap-1"><Button color="blue" variant="tertiary" size="sm" type="button" onClick={() => setOpen(false)}>取消</Button><Button color="blue" size="sm" type="submit" disabled={!title.trim()}>添加任务</Button></div></div>
  </form>;
}

function TaskDialog({ item, project, lanes, onClose, onChange, onStep }: { item: WorkItem; project: string; lanes: BoardLane[]; onClose: () => void; onChange: (next: WorkItem) => void; onStep: (offset: number) => void }) {
  const [comment, setComment] = useState("");
  const [subtask, setSubtask] = useState("");
  const done = item.status === "done";
  const select = "w-full appearance-none rounded-lg bg-transparent px-2 py-1 text-sm text-fg-black outline-none hover:bg-fg-grey-50 focus:bg-fg-grey-50";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label={item.title} className="flex max-h-[calc(100%-32px)] w-[min(960px,100%)] flex-col overflow-hidden rounded-2xl bg-background shadow-2xl" onClick={event => event.stopPropagation()}>
      <div className="flex shrink-0 items-center gap-2 border-b border-fg-grey-200 px-4 py-3">
        <Button color="blue" variant="secondary" size="sm" iconLeft={<ArrowLeftLinear size={14} />} onClick={onClose}>返回看板</Button>
        <span className="min-w-0 flex-1 truncate text-xs text-fg-grey-600">工作台 / 工作区 / {project} / {item.title}</span>
        <IconButton variant="ghost" size="sm" aria-label="上一个任务" onClick={() => onStep(-1)}><span className="block rotate-90"><AltArrowLeftLinear size={16} /></span></IconButton>
        <IconButton variant="ghost" size="sm" aria-label="下一个任务" onClick={() => onStep(1)}><span className="block -rotate-90"><AltArrowLeftLinear size={16} /></span></IconButton>
        <IconButton variant="ghost" size="sm" aria-label="更多"><MenuDotsLinear size={16} /></IconButton>
        <IconButton variant="ghost" size="sm" aria-label="关闭" onClick={onClose}><CloseSquareLinear size={18} /></IconButton>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_240px] lg:overflow-hidden">
        <div className="flex min-h-0 flex-col gap-5 p-6 lg:overflow-y-auto">
          <div className="flex items-start gap-3">
            <span className="pt-2"><CompleteToggle size="lg" checked={done} priority={item.priority} label={item.title} onToggle={() => onChange({ ...item, status: done ? "todo" : "done" })} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-fg-grey-500">{lanes.find(lane => lane.id === item.status)?.name ?? item.status} · {done ? "已完成" : "待完成"}</p>
              <h2 className="mt-1 text-2xl font-semibold leading-8 tracking-fg text-fg-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-fg-grey-700">{item.description}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-9">
            {item.subtasks.map(entry => <div key={entry.id} className="flex items-center gap-2 text-sm"><CompleteToggle size="sm" checked={entry.done} priority={item.priority} label={entry.title} onToggle={() => onChange({ ...item, subtasks: item.subtasks.map(row => row.id === entry.id ? { ...row, done: !row.done } : row) })} /><span className={entry.done ? "text-fg-grey-500 line-through" : "text-fg-black"}>{entry.title}</span></div>)}
            <form className="flex items-center gap-2 text-sm text-fg-grey-500" onSubmit={event => { event.preventDefault(); if (!subtask.trim()) return; onChange({ ...item, subtasks: [...item.subtasks, { id: `${item.id}-s${item.subtasks.length}`, title: subtask.trim(), done: false }] }); setSubtask(""); }}>
              <PlusIcon size={14} /><input value={subtask} onChange={event => setSubtask(event.target.value)} placeholder="添加子任务" className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-fg-black outline-none placeholder:text-fg-grey-500" />
            </form>
          </div>
          <section className="flex flex-col gap-3 border-t border-fg-grey-200 pt-5">
            <div className="flex items-center justify-between"><h3 className="text-base font-semibold text-fg-black">动态</h3><span className="text-xs text-fg-grey-500">{item.activity.length} 条动态</span></div>
            <ul className="flex flex-col gap-3">
              {item.activity.map((entry, index) => <li key={`${entry.at}-${index}`} className="flex items-start gap-2 text-sm">
                <Face src={entry.avatar} className="size-6" />
                <p className="min-w-0 flex-1 leading-6"><span className="font-medium text-fg-black">{entry.who}</span> <span className="text-fg-grey-600">{entry.text}</span></p>
                <span className="shrink-0 text-xs leading-6 text-fg-grey-500">{entry.at}</span>
              </li>)}
            </ul>
          </section>
          <form className="flex flex-col gap-2 rounded-2xl border border-fg-grey-200 p-3 focus-within:border-fg-grey-400" onSubmit={event => { event.preventDefault(); if (!comment.trim()) return; onChange({ ...item, activity: [...item.activity, { who: "张宁", avatar: "/images/team/edward-allen.png", text: `评论：${comment.trim()}`, at: "刚刚" }] }); setComment(""); }}>
            <textarea value={comment} onChange={event => setComment(event.target.value)} rows={2} placeholder="留下评论，@ 提及智能体、成员或任务。回车发送，Shift+回车换行" className="resize-none border-0 bg-transparent p-0 text-sm text-fg-black outline-none placeholder:text-fg-grey-500" onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
            <div className="flex justify-end"><Button color="blue" size="sm" type="submit" disabled={!comment.trim()}>发送评论</Button></div>
          </form>
        </div>
        <aside className="flex flex-col gap-5 border-t border-fg-grey-200 p-5 lg:overflow-y-auto lg:border-l lg:border-t-0">
          <SidebarSection title="属性">
            <PropertyRow label="状态"><select aria-label="状态" className={select} value={item.status} onChange={event => onChange({ ...item, status: event.target.value })}>{lanes.map(lane => <option key={lane.id} value={lane.id}>{lane.name}</option>)}</select></PropertyRow>
            <PropertyRow label="负责人"><span className="inline-flex items-center gap-1.5 px-2">{item.assignee ? <><Face src={item.assignee.avatar} className="size-5" /><span className="truncate">{item.assignee.name}</span></> : <span className="text-fg-grey-500">未分配</span>}</span></PropertyRow>
            <PropertyRow label="项目"><span className="block truncate px-2">{project}</span></PropertyRow>
            <PropertyRow label="截止日期"><span className="inline-flex items-center gap-1 px-2 text-fg-blue-600"><CalendarMinimalisticLinear size={14} />{item.due ?? "日期"}</span></PropertyRow>
            <PropertyRow label="优先级"><select aria-label="优先级" className={select} value={item.priority} onChange={event => onChange({ ...item, priority: event.target.value as WorkItemPriority })}>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></PropertyRow>
          </SidebarSection>
          <SidebarSection title="执行日志" action={item.assignee?.agent ? <button type="button" className="text-xs text-fg-blue-600" onClick={() => onChange({ ...item, status: "in_progress", working: true, activity: [...item.activity, { who: item.assignee!.name, avatar: item.assignee!.avatar, text: "开始工作", at: "刚刚" }] })}>运行</button> : undefined}>
            <p className="text-xs leading-5 text-fg-grey-500">{item.assignee?.agent ? (item.working ? `${item.assignee.name}正在处理，完成后会把结果写回动态。` : "分配给智能体的任务可以直接运行。") : "分配给智能体后可以运行。"}</p>
          </SidebarSection>
          <SidebarSection title="唤醒" action={<button type="button" className="inline-flex items-center gap-1 text-xs text-fg-blue-600"><PlusIcon size={12} />新建</button>}>
            <p className="text-xs leading-5 text-fg-grey-500">条件满足时，让智能体继续处理这个任务。</p>
          </SidebarSection>
          <SidebarSection title="详情">
            <PropertyRow label="编号"><span className="px-2 text-fg-grey-500">{item.code}</span></PropertyRow>
            <PropertyRow label="创建者"><span className="px-2">{item.activity[0]?.who}</span></PropertyRow>
            <PropertyRow label="创建时间"><span className="px-2">{item.activity[0]?.at}</span></PropertyRow>
          </SidebarSection>
        </aside>
      </div>
    </div>
  </div>;
}

type DragPreview = { id: string; width: number; height: number; originX: number; originY: number; startX: number; startY: number; lane?: string; before?: string };
type PointerDrag = { id: string; x: number; y: number; offsetX: number; offsetY: number; width: number; height: number; clientX: number; clientY: number; moved: boolean };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function LaneEditor({ onSubmit, onCancel }: { onSubmit: (name: string) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  return <form data-no-drag className="flex w-[272px] shrink-0 flex-col gap-1 rounded-[20px] bg-fg-grey-50 p-3 motion-safe:animate-[kanban-lane-enter_220ms_cubic-bezier(.22,1,.36,1)]" onSubmit={event => { event.preventDefault(); if (name.trim()) onSubmit(name.trim()); }}>
    <TextField color="blue" label="状态名称" value={name} autoFocus placeholder="状态名称" onChange={setName} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); onCancel(); } }} onBlur={() => { if (!name.trim()) onCancel(); }} />
    <p className="px-2 text-xs text-fg-grey-500">回车创建，Esc 取消</p>
  </form>;
}

export interface KanbanBoardProps {
  project?: BoardProject;
  lanes?: BoardLane[];
  items?: WorkItem[];
  className?: string;
}

export function KanbanBoard({ project = defaultBoardProject, lanes: initialLanes = defaultBoardLanes, items: initialItems = defaultWorkItems, className = "" }: KanbanBoardProps) {
  const [lanes, setLanes] = useState(initialLanes);
  const [items, setItems] = useState(initialItems);
  const [openId, setOpenId] = useState<string | null>(null);
  const [resources, setResources] = useState(project.resources);
  const [preview, setPreview] = useState<DragPreview | null>(null);
  const [naming, setNaming] = useState<{ before?: string } | null>(null);
  const [enteringLane, setEnteringLane] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const board = useRef<HTMLDivElement>(null);
  const previewNode = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerDrag | null>(null);
  const tilt = useRef({ angle: 0, velocity: 0, sampleX: 0, previousX: 0, at: 0, speed: 0 });
  const suppressClick = useRef(false);
  const settling = useRef(false);
  const cardRects = useRef(new Map<string, { x: number; y: number; lane?: string }>());
  const laneRects = useRef(new Map<string, number>());
  const opened = items.find(item => item.id === openId);
  const closed = items.filter(item => item.status === "done").length;
  const order = useMemo(() => lanes.flatMap(lane => items.filter(item => item.status === lane.id).map(item => item.id)), [items, lanes]);
  const update = (next: WorkItem) => setItems(current => current.map(item => item.id === next.id ? next : item));

  const move = useCallback((id: string, lane: string, before?: string) => setItems(current => {
    const moving = current.find(item => item.id === id);
    if (!moving) return current;
    const rest = current.filter(item => item.id !== id);
    const next = { ...moving, status: lane, working: lane === "in_progress" ? moving.working : false };
    const index = before ? rest.findIndex(item => item.id === before) : -1;
    if (index >= 0) rest.splice(index, 0, next);
    else {
      const last = rest.map(item => item.status).lastIndexOf(lane);
      rest.splice(last + 1, 0, next);
    }
    return rest;
  }), []);

  // Cards and lanes glide to their new place whenever the layout changes (FLIP).
  useLayoutEffect(() => {
    const root = board.current;
    if (!root) return;
    const scroll = root.scrollLeft;
    const nextCards = new Map<string, { x: number; y: number; lane?: string }>();
    root.querySelectorAll<HTMLElement>("[data-task-id]").forEach(node => {
      const rect = node.getBoundingClientRect();
      const id = node.dataset.taskId!;
      const lane = node.closest<HTMLElement>("[data-lane]")?.dataset.lane;
      const position = { x: rect.left + scroll, y: rect.top, lane };
      const before = cardRects.current.get(id);
      nextCards.set(id, position);
      if (reduced || !before || id === preview?.id || before.lane !== lane) return;
      const dx = before.x - position.x, dy = before.y - position.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.5) node.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }], { duration: 240, easing: ease });
    });
    cardRects.current = nextCards;
    const nextLanes = new Map<string, number>();
    root.querySelectorAll<HTMLElement>("[data-lane-slot]").forEach(node => {
      const id = node.dataset.laneSlot!;
      const x = node.getBoundingClientRect().left + scroll;
      const before = laneRects.current.get(id);
      nextLanes.set(id, x);
      if (!reduced && before !== undefined && Math.abs(before - x) > 0.5) node.animate([{ transform: `translateX(${before - x}px)` }, { transform: "translateX(0)" }], { duration: 300, easing: ease });
    });
    laneRects.current = nextLanes;
  });

  const dropTarget = useCallback((x: number, y: number, id: string) => {
    const hit = document.elementFromPoint(x, y);
    const section = hit?.closest<HTMLElement>("[data-lane]");
    const placeholder = hit?.closest<HTMLElement>("[data-drag-placeholder]");
    if (placeholder) return { lane: section?.dataset.lane, before: placeholder.dataset.before || undefined };
    const cards = [...(section?.querySelectorAll<HTMLElement>("[data-task-id]") ?? [])].filter(card => card.dataset.taskId !== id);
    return { lane: section?.dataset.lane, before: cards.find(card => y < card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2)?.dataset.taskId };
  }, []);

  // While a card is lifted: follow the pointer, tilt with horizontal speed on a spring, auto-scroll near the edges.
  const activeId = preview?.id;
  useEffect(() => {
    if (!activeId) return;
    let frame = 0;
    const state = tilt.current;
    const tick = (now: number) => {
      const drag = pointer.current;
      const node = previewNode.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - state.at) / 1000));
      if (drag?.moved && !settling.current) {
        const speed = (state.sampleX - state.previousX) / dt;
        state.speed += (speed - state.speed) * (1 - Math.exp(-dt / 0.065));
        state.previousX = state.sampleX;
        const effective = Math.sign(state.speed) * Math.max(0, Math.abs(state.speed) - 20);
        const target = reduced ? 0 : 2.8 * Math.tanh(effective / 900);
        const force = -220 * (state.angle - target) - 27 * state.velocity;
        state.velocity += force / 0.8 * dt;
        state.angle += state.velocity * dt;
        if (node) node.style.transform = `translate3d(${drag.clientX - drag.offsetX}px, ${drag.clientY - drag.offsetY}px, 0) rotate(${state.angle}deg)`;
        const scroller = board.current;
        const bounds = scroller?.getBoundingClientRect();
        if (scroller && bounds) {
          if (drag.clientX < bounds.left + 48) scroller.scrollLeft -= Math.min(16, (bounds.left + 48 - drag.clientX) / 3);
          if (drag.clientX > bounds.right - 48) scroller.scrollLeft += Math.min(16, (drag.clientX - bounds.right + 48) / 3);
        }
        const next = dropTarget(drag.clientX, drag.clientY, drag.id);
        setPreview(current => !current || (current.lane === next.lane && current.before === next.before) ? current : { ...current, ...next });
      }
      state.at = now;
      frame = requestAnimationFrame(tick);
    };
    state.at = performance.now();
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeId, dropTarget, reduced]);

  useEffect(() => {
    const cancel = () => { pointer.current = null; settling.current = false; setPreview(null); };
    const pointerMove = (event: PointerEvent) => {
      const drag = pointer.current;
      if (!drag || settling.current) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 8) return;
      const started = !drag.moved;
      drag.moved = true;
      drag.clientX = event.clientX;
      drag.clientY = event.clientY;
      tilt.current.sampleX = event.clientX;
      if (started) {
        Object.assign(tilt.current, { angle: 0, velocity: 0, previousX: event.clientX, speed: 0 });
        setPreview({ id: drag.id, width: drag.width, height: drag.height, originX: drag.offsetX, originY: drag.offsetY, startX: event.clientX, startY: event.clientY, ...dropTarget(event.clientX, event.clientY, drag.id) });
      }
    };
    const pointerUp = async (event: PointerEvent) => {
      const drag = pointer.current;
      if (!drag) return;
      if (!drag.moved) { pointer.current = null; return; }
      suppressClick.current = true;
      requestAnimationFrame(() => { suppressClick.current = false; });
      settling.current = true;
      const target = dropTarget(event.clientX, event.clientY, drag.id);
      if (target.lane) move(drag.id, target.lane, target.before);
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const destination = board.current?.querySelector<HTMLElement>(`[data-task-id="${drag.id}"]`)?.getBoundingClientRect();
      const node = previewNode.current;
      if (destination && node && !reduced) {
        await node.animate([{ transform: node.style.transform }, { transform: `translate3d(${destination.left}px, ${destination.top}px, 0) rotate(0deg)` }], { duration: 160, easing: ease, fill: "forwards" }).finished.catch(() => undefined);
      }
      pointer.current = null;
      settling.current = false;
      setPreview(null);
    };
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape" && pointer.current?.moved) { event.preventDefault(); cancel(); } };
    const click = (event: MouseEvent) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } };
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", keydown);
    window.addEventListener("blur", cancel);
    window.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("click", click, true);
    };
  }, [dropTarget, move, reduced]);

  function startDrag(event: ReactPointerEvent<HTMLElement>, id: string) {
    if (event.button !== 0 || settling.current || (event.target as Element).closest("[data-no-drag], input, textarea, select")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = { id, x: event.clientX, y: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, width: rect.width, height: rect.height, clientX: event.clientX, clientY: event.clientY, moved: false };
  }

  function addLane(name: string, before?: string) {
    const id = `lane-${lanes.length + 1}-${name.length}`;
    setLanes(current => {
      const next = [...current];
      const index = before ? next.findIndex(lane => lane.id === before) : -1;
      next.splice(index < 0 ? next.length : index, 0, { id, name, tint: "bg-fg-grey-50" });
      return next;
    });
    setEnteringLane(id);
    setNaming(null);
  }

  const placeholder = (before?: string) => <div data-drag-placeholder data-before={before} aria-hidden className="shrink-0 rounded-[10px] border border-dashed border-fg-grey-300 bg-fg-grey-100" style={{ height: preview?.height }} />;
  const dragged = preview ? items.find(item => item.id === preview.id) : undefined;

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <style>{"@keyframes kanban-lane-enter{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}"}</style>
    <PageTitleToolbar
      title={project.title}
      breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "工作区", href: "#projects" }, { label: "项目", href: "#projects" }, { label: project.title }]} />}
      askAi={{ placeholder: "问问这个项目…", suggestions: ["哪些任务卡住了？", "这周还要完成什么？"], onSend: () => "「旧链接 301 跳转表」执行失败，原因是旧站 sitemap 无法访问；「价格页文案审校」在等你审核。本周到期的还有首页首屏改版（11 月 10 日）。" }}
      actions={<KebabMenu accent="blue" items={[{ label: "编辑项目" }, { label: "归档项目" }, { label: "删除项目", danger: true }]} />}
      className="flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0"
    />
    <div className="grid min-w-0 grid-cols-1 overflow-hidden rounded-3xl border border-fg-grey-200 bg-background xl:grid-cols-[minmax(0,1fr)_280px]">
      <div ref={board} className="fg-scrollbar-thin flex min-w-0 gap-4 overflow-x-auto p-5">
        {lanes.map((lane, index) => {
          const laneItems = items.filter(item => item.status === lane.id);
          const visibleCount = laneItems.filter(item => item.id !== preview?.id).length + (preview?.lane === lane.id ? 1 : 0);
          return <div key={lane.id} className="contents">
            {naming && naming.before === lane.id ? <LaneEditor onSubmit={name => addLane(name, lane.id)} onCancel={() => setNaming(null)} /> : null}
            <div data-lane-slot={lane.id} className={`group/lane relative flex shrink-0 ${enteringLane === lane.id ? "motion-safe:animate-[kanban-lane-enter_260ms_cubic-bezier(.22,1,.36,1)]" : ""}`} onAnimationEnd={() => setEnteringLane(current => current === lane.id ? null : current)}>
              {index > 0 && !preview && !naming ? <button type="button" aria-label={`在${lane.name}前添加列`} onClick={() => setNaming({ before: lane.id })} className="absolute -left-[10px] bottom-0 top-0 z-10 w-5 opacity-0 transition-opacity before:absolute before:bottom-0 before:left-1/2 before:top-0 before:w-px before:bg-fg-blue hover:opacity-100 focus-visible:opacity-100"><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-2.5 py-1.5 text-[13px] font-semibold text-fg-blue">添加列</span></button> : null}
              <section data-lane={lane.id} aria-label={lane.name} className={`flex h-[520px] w-[272px] flex-col gap-2 rounded-[20px] border p-2 sm:h-[720px] ${lane.tint} ${preview?.lane === lane.id ? "border-fg-blue-300" : "border-transparent"}`}>
                <div className="flex items-center gap-1 px-1">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg-black">{lane.name}</span>
                  <span className="shrink-0 text-sm text-fg-grey-500">{visibleCount}</span>
                  <KebabMenu accent="blue" items={[{ label: "在左侧添加列", onSelect: () => setNaming({ before: lane.id }) }, ...(builtinLanes.has(lane.id) ? [] : [{ label: "删除列", danger: true, onSelect: () => { setLanes(current => current.filter(entry => entry.id !== lane.id)); setItems(current => current.map(item => item.status === lane.id ? { ...item, status: "todo" } : item)); } }])]} />
                </div>
                <div className="fg-scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden px-0.5 pb-2 pt-0.5">
                  {visibleCount ? null : <p className="py-6 text-center text-sm text-fg-grey-500">无任务</p>}
                  {laneItems.map(item => <div key={item.id} className="contents">
                    {preview && preview.lane === lane.id && preview.before === item.id ? placeholder(item.id) : null}
                    <TaskCard item={item} lanes={lanes} dragging={preview?.id === item.id} onPointerDown={event => startDrag(event, item.id)} onOpen={() => setOpenId(item.id)} onToggle={() => move(item.id, item.status === "done" ? "todo" : "done")} onMove={target => move(item.id, target)} onDelete={() => setItems(current => current.filter(entry => entry.id !== item.id))} onSubtask={id => update({ ...item, subtasks: item.subtasks.map(entry => entry.id === id ? { ...entry, done: !entry.done } : entry) })} />
                  </div>)}
                  {preview && preview.lane === lane.id && !preview.before ? placeholder() : null}
                  <QuickAdd onAdd={(title, description) => setItems(current => [...current, { id: `w-${current.length + 30}`, code: `W-${current.length + 30}`, title, description, status: lane.id, priority: "none", subtasks: [], activity: [{ who: "张宁", avatar: "/images/team/edward-allen.png", text: "创建了这个任务", at: "刚刚" }] }])} />
                </div>
              </section>
            </div>
          </div>;
        })}
        {naming && !naming.before ? <LaneEditor onSubmit={name => addLane(name)} onCancel={() => setNaming(null)} /> : <div className="w-[272px] shrink-0"><button type="button" onClick={() => setNaming({})} className="flex w-full items-center gap-1.5 rounded-xl px-3 py-2 text-left text-sm text-fg-grey-500 hover:bg-fg-grey-50 hover:text-fg-grey-800"><PlusIcon size={14} />添加列</button></div>}
      </div>
      <aside aria-label="项目属性" className="flex flex-col gap-6 border-t border-fg-grey-200 p-5 xl:border-l xl:border-t-0">
        <SidebarSection title="属性">
          <PropertyRow label="状态"><span className="inline-flex items-center gap-1.5 px-2"><span className="size-2.5 rounded-full bg-fg-blue-500" />{project.status}</span></PropertyRow>
          <PropertyRow label="优先级"><span className="px-2">{project.priority}</span></PropertyRow>
          <PropertyRow label="负责人"><span className="inline-flex items-center gap-1.5 px-2"><Avatar initials={project.lead.slice(0, 1)} size="xs" color="blue" /><span className="truncate">{project.lead}</span></span></PropertyRow>
          <PropertyRow label="进度"><div className="flex items-center gap-2 px-2"><div className="min-w-0 flex-1"><ProgressBar value={items.length ? closed / items.length * 100 : 0} color="blue" size="sm" /></div><span className="shrink-0 text-xs text-fg-grey-700">{closed}/{items.length}</span></div></PropertyRow>
          <PropertyRow label="创建时间"><span className="px-2">{project.createdAt}</span></PropertyRow>
        </SidebarSection>
        <SidebarSection title="描述"><p className="whitespace-pre-wrap break-words text-sm leading-6 text-fg-black">{project.description}</p></SidebarSection>
        <SidebarSection title="资源">
          <ul className="flex flex-col gap-1">
            {resources.map(resource => <li key={resource.name} className="flex items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-fg-grey-50">
              <span className="text-fg-grey-600">{resource.icon === "code" ? <CodeLinear size={16} /> : <BookBoldDuotone size={16} />}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm text-fg-black">{resource.name}</span><span className="block truncate text-xs text-fg-grey-500">{resource.kind}</span></span>
              <button type="button" aria-label={`移除 ${resource.name}`} onClick={() => setResources(current => current.filter(entry => entry.name !== resource.name))} className="text-fg-grey-400 hover:text-fg-red"><CloseCircleLinear size={16} /></button>
            </li>)}
          </ul>
          <button type="button" className="flex items-center gap-1.5 px-1 py-1.5 text-sm text-fg-grey-500 hover:text-fg-grey-800"><PlusIcon size={14} />添加资源</button>
        </SidebarSection>
      </aside>
    </div>
    {preview && dragged ? <div ref={previewNode} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform [filter:drop-shadow(0_10px_16px_rgba(0,0,0,0.12))] [&_article]:outline [&_article]:outline-1 [&_article]:outline-fg-grey-300" style={{ width: preview.width, transformOrigin: `${preview.originX}px ${preview.originY}px`, transform: `translate3d(${preview.startX - preview.originX}px, ${preview.startY - preview.originY}px, 0)` }}>
      <TaskCard item={dragged} lanes={lanes} onOpen={() => undefined} onToggle={() => undefined} onMove={() => undefined} onDelete={() => undefined} onSubtask={() => undefined} /> {/* forge-check-disable-line 拖拽跟随预览：aria-hidden、不可交互 */}
    </div> : null}
    {opened ? <TaskDialog item={opened} project={project.title} lanes={lanes} onClose={() => setOpenId(null)} onChange={update} onStep={offset => { const index = order.indexOf(opened.id); setOpenId(order[(index + offset + order.length) % order.length]); }} /> : null}
  </div>;
}
