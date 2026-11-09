"use client";

import { useState, type Key } from "react";
import { Button, ButtonGroup, CellImageText, CellMuted, CellText, DataTable, IconButton, PlusIcon, StatusBadge, ToolbarSearchInput, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";
import { DownloadMinimalisticLinear, EyeLinear } from "@forge-ui-official/core/icons";

export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export interface InvoiceRecord {
  id: string;
  customer: string;
  email: string;
  avatar: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
}

export const defaultInvoices: InvoiceRecord[] = [
  { id: "INV-2026-1031", customer: "陈思远", email: "siyuan@yuanshan.design", avatar: "/images/blocks/people/chen-siyuan.jpg", amount: 128000, issuedAt: "2026-10-31", dueAt: "2026-11-30", status: "pending" },
  { id: "INV-2026-1028", customer: "苏晚晴", email: "wanqing@shiguang.shop", avatar: "/images/blocks/people/su-wanqing.jpg", amount: 43000, issuedAt: "2026-10-28", dueAt: "2026-11-10", status: "paid" },
  { id: "INV-2026-1019", customer: "许知夏", email: "zhixia@qingshi.build", avatar: "/images/blocks/people/xu-zhixia.jpg", amount: 42000, issuedAt: "2026-10-19", dueAt: "2026-10-31", status: "overdue" },
  { id: "INV-2026-1015", customer: "林悦", email: "linyue@muhe.art", avatar: "/images/blocks/people/lin-yue.jpg", amount: 36800, issuedAt: "2026-10-15", dueAt: "2026-10-30", status: "paid" },
  { id: "INV-2026-1012", customer: "周予安", email: "yuan@yunfan.tech", avatar: "/images/blocks/people/zhou-yuan.jpg", amount: 58000, issuedAt: "2026-10-12", dueAt: "2026-11-12", status: "pending" },
  { id: "INV-2026-1008", customer: "江雨桐", email: "yutong@xingyu.media", avatar: "/images/blocks/people/jiang-yutong.jpg", amount: 92000, issuedAt: "2026-10-08", dueAt: "2026-11-08", status: "paid" },
  { id: "INV-2026-1102", customer: "顾承泽", email: "chengze@chengze.office", avatar: "/images/blocks/people/gu-chengze.jpg", amount: 27500, issuedAt: "2026-11-02", dueAt: "2026-12-02", status: "draft" },
];

const statusMeta: Record<InvoiceStatus, { label: string; color: StatusBadgeColor }> = {
  paid: { label: "已付款", color: "green" },
  pending: { label: "待付款", color: "yellow" },
  overdue: { label: "已逾期", color: "red" },
  draft: { label: "草稿", color: "grey" },
};
const filters: { label: string; value: InvoiceStatus | "all" }[] = [{ label: "全部", value: "all" }, { label: "待付款", value: "pending" }, { label: "已付款", value: "paid" }, { label: "已逾期", value: "overdue" }, { label: "草稿", value: "draft" }];

export interface InvoicesTableProps {
  invoices?: InvoiceRecord[];
  onCreate?: () => void;
  onOpen?: (invoice: InvoiceRecord) => void;
  onDownload?: (invoice: InvoiceRecord) => void;
  className?: string;
}

export function InvoicesTable({ invoices = defaultInvoices, onCreate, onOpen, onDownload, className }: InvoicesTableProps) {
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const status = filters[filter].value;
  const visible = invoices.filter(invoice => (status === "all" || invoice.status === status) && `${invoice.id} ${invoice.customer}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const outstanding = invoices.filter(invoice => invoice.status === "pending" || invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);

  const columns: ColumnDef<InvoiceRecord>[] = [
    { key: "id", header: "发票号", minWidth: 130, render: invoice => <CellText>{invoice.id}</CellText> },
    { key: "customer", header: "付款方", minWidth: 210, render: invoice => <CellImageText src={invoice.avatar} title={invoice.customer} subtitle={invoice.email} rounded="full" /> },
    { key: "amount", header: "金额", minWidth: 110, valueKind: "number", render: invoice => <CellText>¥{invoice.amount.toLocaleString("zh-CN")}</CellText> },
    { key: "issuedAt", header: "开票日期", minWidth: 110, render: invoice => <CellMuted>{invoice.issuedAt}</CellMuted> },
    { key: "dueAt", header: "到期日", minWidth: 110, render: invoice => <CellMuted>{invoice.dueAt}</CellMuted> },
    { key: "status", header: "状态", minWidth: 90, render: invoice => <StatusBadge {...statusMeta[invoice.status]} variant="soft" /> },
    { key: "actions", header: "", minWidth: 80, render: invoice => <div className="flex gap-1"><IconButton variant="ghost" color="grey" size="sm" aria-label={`下载${invoice.id}`} onClick={() => onDownload?.(invoice)}><DownloadMinimalisticLinear size={16} /></IconButton><IconButton variant="ghost" color="grey" size="sm" aria-label={`查看${invoice.id}`} onClick={() => onOpen?.(invoice)}><EyeLinear size={16} /></IconButton></div> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="-mx-1 min-w-0 fg-scrollbar-hidden overflow-x-auto px-1 pb-1"><ButtonGroup ariaLabel="发票状态" shape="pill" items={filters.map(item => ({ label: item.label }))} activeIndex={filter} onChange={setFilter} /></div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <ToolbarSearchInput className="w-full sm:w-60" value={query} onChange={setQuery} placeholder="搜索发票号或付款方" />
        <Button iconLeft={<PlusIcon size={16} />} onClick={onCreate}>新建发票</Button>
      </div>
    </div>
    <DataTable<InvoiceRecord>
      columns={columns}
      rows={visible}
      getRowKey={invoice => invoice.id}
      showCheckbox
      selectedRowKeys={selected}
      onSelectedRowKeysChange={setSelected}
      footerLeft={<p className="text-sm text-fg-grey-700">共 {visible.length} 张发票 · 待收 ¥{outstanding.toLocaleString("zh-CN")}</p>}
      emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有符合条件的发票。</p>}
    />
  </section>;
}
