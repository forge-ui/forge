"use client";

import { useState, type FormEvent, type Key } from "react";
import { Button, DataTable, Modal, PlusIcon, ProgressBar, TextField, cn, type ColumnDef } from "@forge-ui-official/core";

export interface SavingsGoal {
  id: string;
  title: string;
  note: string;
  target: number;
  saved: number;
  dueAt: string;
  color: "blue" | "purple" | "green" | "red" | "cyan" | "yellow";
}

export const defaultSavingsGoals: SavingsGoal[] = [
  { id: "g1", title: "年度经营储备", note: "覆盖 3 个月运营成本", target: 200000, saved: 160000, dueAt: "2026-12-31", color: "blue" },
  { id: "g2", title: "产品研发基金", note: "第二阶段研发投入", target: 120000, saved: 84000, dueAt: "2026-12-15", color: "purple" },
  { id: "g3", title: "团队成长预算", note: "培训与行业大会", target: 60000, saved: 36000, dueAt: "2026-12-31", color: "green" },
  { id: "g4", title: "办公室扩租", note: "新增 20 个工位", target: 150000, saved: 37500, dueAt: "2027-03-31", color: "red" },
  { id: "g5", title: "设备更新", note: "设计与测试设备", target: 48000, saved: 40800, dueAt: "2026-11-30", color: "cyan" },
  { id: "g6", title: "年终团建", note: "全员两天行程", target: 30000, saved: 16500, dueAt: "2026-12-20", color: "yellow" },
];

const dot: Record<SavingsGoal["color"], string> = { blue: "bg-fg-blue", purple: "bg-fg-violet", green: "bg-fg-green-500", red: "bg-fg-red", cyan: "bg-fg-cyan-500", yellow: "bg-fg-yellow" };

export interface SavingsGoalsTableProps {
  goals?: SavingsGoal[];
  onCreate?: (goal: SavingsGoal) => void;
  className?: string;
}

export function SavingsGoalsTable({ goals = defaultSavingsGoals, onCreate, className }: SavingsGoalsTableProps) {
  const [rows, setRows] = useState(goals);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: "", target: "", dueAt: "" });
  const saved = rows.reduce((sum, goal) => sum + goal.saved, 0);
  const target = rows.reduce((sum, goal) => sum + goal.target, 0);

  const columns: ColumnDef<SavingsGoal>[] = [
    { key: "title", header: "目标", minWidth: 200, render: goal => <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-fg-grey-50"><span className={cn("size-3 rounded", dot[goal.color])} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{goal.title}</p><p className="truncate text-xs text-fg-grey-700">{goal.note}</p></div></div> },
    { key: "target", header: "目标金额", minWidth: 110, valueKind: "number", render: goal => <span className="text-sm tabular-nums text-fg-black">¥{goal.target.toLocaleString("zh-CN")}</span> },
    { key: "progress", header: "进度", minWidth: 200, render: goal => { const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100)); return <ProgressBar value={percent} color={goal.color} label={`已存 ¥${goal.saved.toLocaleString("zh-CN")} · ${percent}%`} size="sm" />; } },
    { key: "dueAt", header: "截止日期", minWidth: 110, render: goal => <span className="text-sm text-fg-grey-700">{goal.dueAt}</span> },
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    const amount = Number(draft.target);
    if (!draft.title.trim() || !(amount > 0)) return;
    const goal: SavingsGoal = { id: `g-${Date.now()}`, title: draft.title.trim(), note: "新建目标", target: amount, saved: 0, dueAt: draft.dueAt || "未设置", color: "blue" };
    setRows(current => [goal, ...current]);
    onCreate?.(goal);
    setDraft({ title: "", target: "", dueAt: "" });
    setCreating(false);
  }

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-fg-grey-700">已存 <span className="font-semibold tabular-nums text-fg-black">¥{saved.toLocaleString("zh-CN")}</span> / 目标 ¥{target.toLocaleString("zh-CN")}</p>
      <Button iconLeft={<PlusIcon size={16} />} onClick={() => setCreating(true)}>新建目标</Button>
    </div>
    <DataTable<SavingsGoal> columns={columns} rows={rows} getRowKey={goal => goal.id} showCheckbox selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} footerLeft={<p className="text-sm text-fg-grey-700">共 {rows.length} 个目标{selected.size ? `，已选 ${selected.size} 个` : ""}</p>} />
    <Modal open={creating} onOpenChange={setCreating} title="新建储蓄目标">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <TextField label="目标名称" shape="pill" value={draft.title} onChange={value => setDraft({ ...draft, title: value })} placeholder="例如：年度经营储备" />
        <TextField label="目标金额（元）" shape="pill" inputMode="decimal" value={draft.target} onChange={value => setDraft({ ...draft, target: value })} placeholder="100000" />
        <TextField label="截止日期" type="date" shape="pill" value={draft.dueAt} onChange={value => setDraft({ ...draft, dueAt: value })} />
        <div className="flex justify-end gap-3"><Button type="button" variant="tertiary" onClick={() => setCreating(false)}>取消</Button><Button type="submit" disabled={!draft.title.trim() || !(Number(draft.target) > 0)}>创建</Button></div>
      </form>
    </Modal>
  </section>;
}
