"use client";

import { useState } from "react";
import { ButtonGroup, CellTextSubtitle, DataTable, DonutChart, IconButton, Modal, Panel, ProgressBar, StatusBadge, ToolbarSearchInput, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";
import { EyeLinear } from "@forge-ui-official/core/icons";

export type TransactionStatus = "success" | "pending" | "canceled";

export interface TransactionRecord {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  status: TransactionStatus;
  dot: string;
}

export interface ExpenseCategory {
  label: string;
  note: string;
  amount: number;
  color: string;
}

export const defaultTransactions: TransactionRecord[] = [
  { id: "tx1", name: "办公室租金", category: "固定支出", amount: -42000, date: "2026-11-01", time: "09:00", status: "success", dot: "bg-fg-violet" },
  { id: "tx2", name: "远山设计 · 项目回款", category: "收入", amount: 128000, date: "2026-10-31", time: "16:20", status: "success", dot: "bg-fg-green-500" },
  { id: "tx3", name: "云服务器续费", category: "技术服务", amount: -6800, date: "2026-10-30", time: "11:05", status: "pending", dot: "bg-fg-blue" },
  { id: "tx4", name: "团队差旅 · 杭州", category: "差旅", amount: -3260, date: "2026-10-29", time: "18:40", status: "success", dot: "bg-fg-yellow" },
  { id: "tx5", name: "拾光好物 · 首付款", category: "收入", amount: 43000, date: "2026-10-28", time: "10:15", status: "pending", dot: "bg-fg-green-500" },
  { id: "tx6", name: "设计软件订阅", category: "技术服务", amount: -1980, date: "2026-10-27", time: "08:30", status: "success", dot: "bg-fg-blue" },
  { id: "tx7", name: "客户招待", category: "市场", amount: -860, date: "2026-10-25", time: "20:10", status: "canceled", dot: "bg-fg-red" },
];

export const defaultExpenseCategories: ExpenseCategory[] = [
  { label: "固定支出", note: "租金、物业、水电", amount: 42000, color: "bg-fg-violet" },
  { label: "技术服务", note: "云服务、软件订阅", amount: 8780, color: "bg-fg-blue" },
  { label: "差旅", note: "机票、住宿、交通", amount: 3260, color: "bg-fg-yellow" },
  { label: "市场", note: "活动、招待", amount: 860, color: "bg-fg-red" },
];

const statusMeta: Record<TransactionStatus, { label: string; color: StatusBadgeColor }> = {
  success: { label: "已完成", color: "green" },
  pending: { label: "处理中", color: "yellow" },
  canceled: { label: "已取消", color: "red" },
};
const filters = ["全部", "收入", "支出"];

export interface TransactionsTableProps {
  transactions?: TransactionRecord[];
  categories?: ExpenseCategory[];
  budget?: number;
  className?: string;
}

export function TransactionsTable({ transactions = defaultTransactions, categories = defaultExpenseCategories, budget = 80000, className }: TransactionsTableProps) {
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<TransactionRecord | null>(null);
  const money = (value: number) => `${value < 0 ? "-" : "+"}¥${Math.abs(value).toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`;
  const visible = transactions.filter(item => (filter === 0 || (filter === 1 ? item.amount > 0 : item.amount < 0)) && `${item.name} ${item.category}`.includes(query.trim()));
  const spent = categories.reduce((sum, item) => sum + item.amount, 0);
  const used = Math.min(100, Math.round((spent / budget) * 100));

  const columns: ColumnDef<TransactionRecord>[] = [
    { key: "name", header: "交易", minWidth: 200, render: item => <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-fg-grey-50"><span className={cn("size-3 rounded", item.dot)} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{item.name}</p><p className="text-xs text-fg-grey-700">{item.category}</p></div></div> },
    { key: "amount", header: "金额", minWidth: 120, valueKind: "number", render: item => <span className={cn("text-sm font-semibold tabular-nums", item.amount > 0 ? "text-fg-green-500" : "text-fg-black")}>{money(item.amount)}</span> },
    { key: "date", header: "时间", minWidth: 110, render: item => <CellTextSubtitle title={item.date} subtitle={item.time} /> },
    { key: "status", header: "状态", minWidth: 90, render: item => <StatusBadge {...statusMeta[item.status]} variant="soft" /> },
    { key: "view", header: "", minWidth: 48, render: item => <IconButton variant="ghost" color="grey" size="sm" aria-label={`查看${item.name}`} onClick={() => setViewing(item)}><EyeLinear size={16} /></IconButton> },
  ];

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[300px_minmax(0,1fr)]", className)}>
    <div className="flex min-w-0 flex-col gap-4">
      <Panel variant="template" title="本月支出" subtitle="按类别统计">
        <div className="flex justify-center"><DonutChart segments={categories.map(item => ({ label: item.label, value: item.amount, color: item.color }))} centerValue={`¥${(spent / 10000).toFixed(1)}万`} subtitle="支出合计" size="sm" /></div>
        <ul className="flex flex-col gap-3">{categories.map(item => <li key={item.label} className="flex items-center gap-3"><span className={cn("size-3 shrink-0 rounded", item.color)} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-fg-black">{item.label}</p><p className="text-xs text-fg-grey-700">{item.note}</p></div><span className="text-sm font-semibold tabular-nums text-fg-black">¥{item.amount.toLocaleString("zh-CN")}</span></li>)}</ul>
      </Panel>
      <Panel variant="template" title="月度预算" subtitle={`预算 ¥${budget.toLocaleString("zh-CN")}`}>
        <ProgressBar value={used} color={used > 90 ? "red" : "blue"} label={`已使用 ${used}%`} />
        <dl className="grid grid-cols-2 gap-3 text-center"><div><dt className="text-xs text-fg-grey-700">已支出</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-fg-black">¥{spent.toLocaleString("zh-CN")}</dd></div><div><dt className="text-xs text-fg-grey-700">剩余</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-fg-black">¥{Math.max(0, budget - spent).toLocaleString("zh-CN")}</dd></div></dl>
      </Panel>
    </div>
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <ButtonGroup ariaLabel="交易方向" shape="pill" items={filters.map(label => ({ label }))} activeIndex={filter} onChange={setFilter} />
        <ToolbarSearchInput className="w-full sm:w-64" value={query} onChange={setQuery} placeholder="搜索交易或类别" />
      </div>
      <DataTable<TransactionRecord> columns={columns} rows={visible} getRowKey={item => item.id} footerLeft={<p className="text-sm text-fg-grey-700">共 {visible.length} 笔交易</p>} emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有符合条件的交易。</p>} />
    </div>
    <Modal open={viewing !== null} onOpenChange={open => { if (!open) setViewing(null); }} title={viewing?.name ?? "交易详情"}>
      {viewing && <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-sm"><dt className="text-fg-grey-700">金额</dt><dd className="font-semibold tabular-nums text-fg-black">{money(viewing.amount)}</dd><dt className="text-fg-grey-700">类别</dt><dd className="text-fg-black">{viewing.category}</dd><dt className="text-fg-grey-700">时间</dt><dd className="text-fg-black">{viewing.date} {viewing.time}</dd><dt className="text-fg-grey-700">状态</dt><dd className="flex"><StatusBadge {...statusMeta[viewing.status]} variant="soft" /></dd></dl>}
    </Modal>
  </div>;
}
