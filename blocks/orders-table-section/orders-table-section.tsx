"use client";

import { useState } from "react";
import { Avatar, Button, DataTable, IconButton, Modal, Pagination, Panel, StatusBadge, Toolbar, ToolbarSearchInput, ToolbarSelectDropdown, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";
import { DownloadLinear, EyeLinear } from "@forge-ui-official/core/icons";

export interface OrderRecord {
  id: string;
  customer: string;
  company: string;
  avatar?: string;
  amount: number;
  status: "paid" | "processing" | "refunded";
  date: string;
}

export const defaultOrders: OrderRecord[] = [
  { id: "ZX2026103106", customer: "陈思远", company: "远山设计", amount: 12800, status: "paid", date: "2026-10-31" },
  { id: "ZX2026103105", customer: "林悦", company: "木禾文化", amount: 6800, status: "paid", date: "2026-10-31" },
  { id: "ZX2026103004", customer: "周予安", company: "云帆科技", amount: 3200, status: "processing", date: "2026-10-30" },
  { id: "ZX2026103003", customer: "许知夏", company: "青石建筑", amount: 15800, status: "paid", date: "2026-10-30" },
  { id: "ZX2026102902", customer: "沈清和", company: "拾光商业", amount: 9800, status: "paid", date: "2026-10-29" },
  { id: "ZX2026102901", customer: "陆景行", company: "桥川咨询", amount: 2400, status: "refunded", date: "2026-10-29" },
];

const orderStatuses: Record<OrderRecord["status"], { label: string; color: StatusBadgeColor }> = {
  paid: { label: "已支付", color: "green" },
  processing: { label: "处理中", color: "blue" },
  refunded: { label: "已退款", color: "grey" },
};

export interface OrdersTableSectionProps {
  title?: string;
  description?: string;
  orders?: OrderRecord[];
  pageSize?: number;
  onViewOrder?: (order: OrderRecord) => void;
  onExport?: (orders: OrderRecord[]) => void;
  className?: string;
}

export function OrdersTableSection({ title = "订单列表", description = "知行科技 · 最近成交与待处理订单", orders = defaultOrders, pageSize = 6, onViewOrder, onExport, className }: OrdersTableSectionProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<OrderRecord | null>(null);
  const [feedback, setFeedback] = useState("");
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = orders.filter(order => (status === "all" || order.status === status) && `${order.id} ${order.customer} ${order.company}`.toLocaleLowerCase().includes(keyword));
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * size, currentPage * size);
  const currency = (amount: number) => `¥${amount.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const columns: ColumnDef<OrderRecord>[] = [
    { key: "id", header: "订单号", minWidth: 160, render: order => <span className="font-medium text-fg-black">{order.id}</span> },
    { key: "customer", header: "客户", minWidth: 190, render: order => <div className="flex items-center gap-3"><Avatar src={order.avatar} initials={order.customer.slice(0, 1)} alt={order.customer} size="sm" /><div><div className="font-semibold text-fg-black">{order.customer}</div><div className="text-xs text-fg-grey-500">{order.company}</div></div></div> },
    { key: "amount", header: "金额", minWidth: 120, valueKind: "number", render: order => <span className="font-semibold tabular-nums">{currency(order.amount)}</span> },
    { key: "status", header: "状态", minWidth: 100, render: order => <StatusBadge {...orderStatuses[order.status]} variant="soft" /> },
    { key: "date", header: "日期", minWidth: 130, render: order => <span className="text-fg-grey-700">{order.date}</span> },
    { key: "action", header: "操作", minWidth: 64, render: order => <IconButton variant="ghost" color="grey" size="sm" aria-label={`查看订单 ${order.id}`} onClick={() => onViewOrder ? onViewOrder(order) : setSelected(order)}><EyeLinear size={16} /></IconButton> },
  ];

  function exportOrders() {
    if (onExport) { onExport(filtered); return; }
    const csvCell = (value: string | number) => `"${String(value).replace(/^\s*[=+@-]|^[\t\r\n]/, "'$&").replace(/"/g, '""')}"`;
    const rows = [["订单号", "客户", "公司", "金额", "状态", "日期"], ...filtered.map(order => [order.id, order.customer, order.company, order.amount, orderStatuses[order.status].label, order.date])];
    const url = URL.createObjectURL(new Blob(["\uFEFF", rows.map(row => row.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "知行科技-订单.csv";
    link.click();
    URL.revokeObjectURL(url);
    setFeedback(`已导出 ${filtered.length} 条订单`);
  }

  return <Panel className={cn("min-w-0", className)} title={title} subtitle={description}>
    <Toolbar className="sm:flex-wrap" left={<ToolbarSearchInput className="sm:w-auto sm:max-w-none sm:flex-1 sm:basis-64" value={query} onChange={value => { setQuery(value); setPage(1); setFeedback(""); }} placeholder="搜索订单号、客户或公司" />} right={<div className="flex flex-wrap items-center gap-3"><ToolbarSelectDropdown placeholder="订单状态" value={status} options={[{ label: "全部状态", value: "all" }, ...Object.entries(orderStatuses).map(([value, item]) => ({ value, label: item.label }))]} onChange={value => { setStatus(value); setPage(1); setFeedback(""); }} /><Button size="sm" variant="tertiary" iconLeft={<DownloadLinear size={16} />} onClick={exportOrders} disabled={!filtered.length}>导出</Button></div>} />
    <div className="@container min-w-0">
      <div className="hidden @min-[900px]:block"><DataTable columns={columns} rows={visible} getRowKey={order => order.id} /></div>
      <ul aria-label="订单列表" className="divide-y divide-fg-grey-200 rounded-2xl border border-fg-grey-200 @min-[900px]:hidden">{visible.map(order => <li key={order.id} className="flex min-w-0 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3"><span className="min-w-0 break-all text-sm font-semibold text-fg-black">{order.id}</span><IconButton variant="ghost" color="grey" size="sm" aria-label={`查看订单 ${order.id}`} onClick={() => onViewOrder ? onViewOrder(order) : setSelected(order)}><EyeLinear size={16} /></IconButton></div>
        <div className="flex min-w-0 items-center gap-3"><Avatar src={order.avatar} initials={order.customer.slice(0, 1)} alt={order.customer} size="sm" /><div className="min-w-0 break-words"><p className="text-sm font-semibold text-fg-black">{order.customer}</p><p className="text-xs text-fg-grey-500">{order.company}</p></div></div>
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold tabular-nums">{currency(order.amount)}</span><StatusBadge {...orderStatuses[order.status]} variant="soft" /></div>
        <time dateTime={order.date} className="text-xs text-fg-grey-700">{order.date}</time>
      </li>)}</ul>
    </div>
    {!visible.length && <div className="py-10 text-center text-sm text-fg-grey-700">{orders.length ? "没有符合条件的订单，请调整搜索或筛选。" : "暂无订单记录。"}</div>}
    <footer className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-fg-grey-700" role="status">{feedback || `共 ${filtered.length} 条${filtered.length ? `，第 ${(currentPage - 1) * size + 1}–${Math.min(currentPage * size, filtered.length)} 条` : ""}`}</p><Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setPage} /></footer>
    <Modal open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }} title={selected ? `订单 ${selected.id}` : "订单详情"}>
      {selected && <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-sm"><dt className="text-fg-grey-700">客户</dt><dd>{selected.customer} · {selected.company}</dd><dt className="text-fg-grey-700">金额</dt><dd className="font-semibold">{currency(selected.amount)}</dd><dt className="text-fg-grey-700">状态</dt><dd><StatusBadge {...orderStatuses[selected.status]} variant="soft" /></dd><dt className="text-fg-grey-700">日期</dt><dd>{selected.date}</dd></dl>}
    </Modal>
  </Panel>;
}
