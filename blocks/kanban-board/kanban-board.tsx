"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import { Avatar, Button, PlusIcon, TextField, cn } from "@forge-ui-official/core";
import { CalendarMinimalisticLinear, ChatRoundLinear, CheckCircleBold, PaperclipLinear } from "@forge-ui-official/core/icons";

export type KanbanPriority = "high" | "medium" | "low";

export interface KanbanTask {
  id: string;
  title: string;
  project: string;
  due: string;
  priority: KanbanPriority;
  assignee: { name: string; avatar: string };
  comments?: number;
  attachments?: number;
  subtasks?: { done: number; total: number };
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

const people = {
  zhang: { name: "张宁", avatar: "/images/team/edward-allen.png" },
  lin: { name: "林悦", avatar: "/images/blocks/people/lin-yue.jpg" },
  chen: { name: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg" },
  xu: { name: "许知夏", avatar: "/images/blocks/people/xu-zhixia.jpg" },
};

export const defaultKanbanColumns: KanbanColumn[] = [
  { id: "todo", title: "待开始", tasks: [
    { id: "t1", title: "整理客户访谈结论", project: "客户工作台升级", due: "今天", priority: "high", assignee: people.lin, comments: 3 },
    { id: "t2", title: "确定订单页信息架构", project: "客户工作台升级", due: "明天", priority: "medium", assignee: people.zhang, attachments: 2 },
    { id: "t3", title: "准备第二阶段评审材料", project: "交付管理", due: "11月11日", priority: "low", assignee: people.zhang, comments: 1 },
  ] },
  { id: "doing", title: "进行中", tasks: [
    { id: "t4", title: "订单搜索与状态筛选", project: "客户工作台升级", due: "11月4日", priority: "high", assignee: people.chen, subtasks: { done: 2, total: 4 }, comments: 5 },
    { id: "t5", title: "高保真首页设计", project: "品牌官网改版", due: "今天", priority: "medium", assignee: people.lin, subtasks: { done: 1, total: 2 }, attachments: 6 },
  ] },
  { id: "review", title: "待验收", tasks: [
    { id: "t6", title: "支付回调验收清单", project: "客户工作台升级", due: "11月6日", priority: "high", assignee: people.xu, comments: 2 },
  ] },
  { id: "done", title: "已完成", tasks: [
    { id: "t7", title: "需求梳理与方案评审", project: "客户工作台升级", due: "10月21日", priority: "medium", assignee: people.zhang },
    { id: "t8", title: "核心流程与交互设计", project: "客户工作台升级", due: "10月25日", priority: "medium", assignee: people.lin },
  ] },
];

const priorityMeta: Record<KanbanPriority, { label: string; ring: string }> = {
  high: { label: "高优先级", ring: "border-fg-red" },
  medium: { label: "中优先级", ring: "border-fg-yellow-500" },
  low: { label: "低优先级", ring: "border-fg-blue" },
};

export interface KanbanBoardProps {
  columns?: KanbanColumn[];
  onMove?: (taskId: string, toColumnId: string) => void;
  onAdd?: (columnId: string, title: string) => void;
  className?: string;
}

export function KanbanBoard({ columns = defaultKanbanColumns, onMove, onAdd, className }: KanbanBoardProps) {
  const [board, setBoard] = useState(columns);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const doneId = board.at(-1)?.id;

  function move(taskId: string, toColumnId: string) {
    setBoard(current => {
      const task = current.flatMap(column => column.tasks).find(item => item.id === taskId);
      if (!task) return current;
      return current.map(column => ({ ...column, tasks: column.id === toColumnId ? [...column.tasks.filter(item => item.id !== taskId), task] : column.tasks.filter(item => item.id !== taskId) }));
    });
    onMove?.(taskId, toColumnId);
  }

  function drop(event: DragEvent, columnId: string) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    if (taskId) move(taskId, columnId);
    setDragging(null);
    setOver(null);
  }

  function add(event: FormEvent, columnId: string) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setBoard(current => current.map(column => column.id === columnId ? { ...column, tasks: [...column.tasks, { id: `t-${Date.now()}`, title, project: "未分组", due: "未设置", priority: "low", assignee: people.zhang }] } : column));
    onAdd?.(columnId, title);
    setDraft("");
    setAdding(null);
  }

  return <div className={cn("fg-scrollbar-hidden -mx-1 overflow-x-auto px-1 pb-2", className)}>
    <div className="grid auto-cols-[minmax(232px,1fr)] grid-flow-col gap-4">
      {board.map(column => <section key={column.id} aria-label={column.title} onDragOver={event => { event.preventDefault(); setOver(column.id); }} onDragLeave={() => setOver(current => current === column.id ? null : current)} onDrop={event => drop(event, column.id)} className={cn("flex flex-col gap-3 rounded-card p-2 transition-colors", over === column.id && dragging ? "bg-fg-blue-50" : "bg-transparent")}>
        <header className="flex items-center justify-between px-1"><h3 className="text-sm font-semibold text-fg-black">{column.title}<span className="ml-2 text-fg-grey-500">{column.tasks.length}</span></h3></header>
        <ul className="flex min-h-16 flex-col gap-3">
          {column.tasks.map(task => {
            const done = column.id === doneId;
            return <li key={task.id} draggable onDragStart={event => { event.dataTransfer.setData("text/plain", task.id); event.dataTransfer.effectAllowed = "move"; setDragging(task.id); }} onDragEnd={() => { setDragging(null); setOver(null); }} className={cn("flex cursor-grab flex-col gap-3 rounded-card border border-fg-grey-200 bg-white p-4 active:cursor-grabbing", dragging === task.id && "opacity-50")}>
              <div className="flex items-start gap-2">
                {done ? <CheckCircleBold size={20} className="mt-px shrink-0 text-fg-green-500" /> : <span title={priorityMeta[task.priority].label} className={cn("mt-0.5 size-4 shrink-0 rounded-full border-2", priorityMeta[task.priority].ring)} />}
                <p className={cn("text-sm font-semibold", done ? "text-fg-grey-500 line-through" : "text-fg-black")}>{task.title}</p>
              </div>
              {task.subtasks && <div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-fg-grey-100"><div className="h-full rounded-full bg-fg-blue" style={{ width: `${(task.subtasks.done / task.subtasks.total) * 100}%` }} /></div><span className="text-xs text-fg-grey-700">{task.subtasks.done}/{task.subtasks.total}</span></div>}
              <div className="flex items-center justify-between gap-2 text-xs text-fg-grey-700">
                <span className="truncate">{task.project}</span>
                <span className="flex shrink-0 items-center gap-1"><CalendarMinimalisticLinear size={14} />{task.due}</span>
              </div>
              <div className="flex items-center justify-between border-t border-fg-grey-100 pt-3">
                <div className="flex items-center gap-3 text-xs text-fg-grey-700">{task.comments ? <span className="flex items-center gap-1"><ChatRoundLinear size={14} />{task.comments}</span> : null}{task.attachments ? <span className="flex items-center gap-1"><PaperclipLinear size={14} />{task.attachments}</span> : null}</div>
                <Avatar src={task.assignee.avatar} alt={task.assignee.name} size="sm" />
              </div>
            </li>;
          })}
        </ul>
        {adding === column.id
          ? <form className="flex flex-col gap-2" onSubmit={event => add(event, column.id)}><TextField shape="pill" autoFocus aria-label="任务标题" value={draft} onChange={setDraft} placeholder="输入任务标题后回车" /><div className="flex gap-2"><Button type="submit" size="sm" disabled={!draft.trim()}>添加</Button><Button type="button" size="sm" variant="tertiary" onClick={() => { setAdding(null); setDraft(""); }}>取消</Button></div></form>
          : <Button variant="unstyled" type="button" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-fg-grey-700 transition-colors hover:bg-fg-grey-100" onClick={() => { setAdding(column.id); setDraft(""); }}><PlusIcon size={16} />添加任务</Button>}
      </section>)}
    </div>
  </div>;
}
