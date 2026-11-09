"use client";

import { useState, type Key } from "react";
import { Button, CellImageText, CellText, ConfirmationDialog, DataTable, IconButton, PlusIcon, StatusBadge, ToolbarSearchInput, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";
import { DocumentTextBoldDuotone, DownloadMinimalisticLinear, EyeLinear, PenLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export type DealStatus = "paid" | "pending" | "overdue";

export interface DealRecord {
  id: string;
  title: string;
  invoice: string;
  amount: number;
  client: string;
  company: string;
  avatar: string;
  payment: string;
  status: DealStatus;
}

export const defaultDeals: DealRecord[] = [
  { id: "d-01", title: "客户工作台升级", invoice: "INV-23064", amount: 128000, client: "陈思远", company: "远山设计", avatar: "/images/blocks/people/chen-siyuan.jpg", payment: "对公转账", status: "paid" },
  { id: "d-02", title: "门店会员系统", invoice: "INV-23065", amount: 86000, client: "苏晚晴", company: "拾光好物", avatar: "/images/blocks/people/su-wanqing.jpg", payment: "分期付款", status: "pending" },
  { id: "d-03", title: "工地巡检小程序", invoice: "INV-23066", amount: 42000, client: "许知夏", company: "青石建筑", avatar: "/images/blocks/people/xu-zhixia.jpg", payment: "对公转账", status: "overdue" },
  { id: "d-04", title: "品牌官网改版", invoice: "INV-23067", amount: 36800, client: "林悦", company: "木禾文化", avatar: "/images/blocks/people/lin-yue.jpg", payment: "支付宝", status: "paid" },
  { id: "d-05", title: "数据看板定制", invoice: "INV-23068", amount: 58000, client: "周予安", company: "云帆科技", avatar: "/images/blocks/people/zhou-yuan.jpg", payment: "对公转账", status: "pending" },
  { id: "d-06", title: "内容中台", invoice: "INV-23069", amount: 92000, client: "江雨桐", company: "星屿传媒", avatar: "/images/blocks/people/jiang-yutong.jpg", payment: "分期付款", status: "paid" },
  { id: "d-07", title: "合同管理系统", invoice: "INV-23070", amount: 27500, client: "陆景行", company: "桥川咨询", avatar: "/images/blocks/people/lu-jingxing.jpg", payment: "微信支付", status: "overdue" },
];

const statusMeta: Record<DealStatus, { label: string; color: StatusBadgeColor }> = {
  paid: { label: "已回款", color: "green" },
  pending: { label: "待回款", color: "yellow" },
  overdue: { label: "已逾期", color: "red" },
};

export interface DealsTableProps {
  deals?: DealRecord[];
  onAdd?: () => void;
  onOpen?: (deal: DealRecord) => void;
  onEdit?: (deal: DealRecord) => void;
  onExport?: (deals: DealRecord[]) => void;
  className?: string;
}

export function DealsTable({ deals = defaultDeals, onAdd, onOpen, onEdit, onExport, className }: DealsTableProps) {
  const [rows, setRows] = useState(deals);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<DealRecord | null>(null);
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = rows.filter(deal => `${deal.title} ${deal.client} ${deal.company} ${deal.invoice}`.toLocaleLowerCase().includes(keyword));
  const totals = (Object.keys(statusMeta) as DealStatus[]).map(status => ({ status, amount: rows.filter(deal => deal.status === status).reduce((sum, deal) => sum + deal.amount, 0) }));

  const columns: ColumnDef<DealRecord>[] = [
    { key: "title", header: "商机", minWidth: 200, render: deal => <div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-fg-blue-50 text-fg-blue"><DocumentTextBoldDuotone size={20} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{deal.title}</p><p className="text-xs text-fg-grey-700">{deal.invoice}</p></div></div> },
    { key: "amount", header: "金额", minWidth: 110, valueKind: "number", render: deal => <CellText>¥{deal.amount.toLocaleString("zh-CN")}</CellText> },
    { key: "client", header: "客户", minWidth: 170, render: deal => <CellImageText src={deal.avatar} title={deal.client} subtitle={deal.company} rounded="full" /> },
    { key: "payment", header: "付款方式", minWidth: 100, render: deal => <CellText>{deal.payment}</CellText> },
    { key: "status", header: "状态", minWidth: 96, render: deal => <StatusBadge {...statusMeta[deal.status]} variant="soft" /> },
    { key: "actions", header: "操作", minWidth: 120, render: deal => <div className="flex items-center gap-1">
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`查看${deal.title}`} onClick={() => onOpen?.(deal)}><EyeLinear size={16} /></IconButton>
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`编辑${deal.title}`} onClick={() => onEdit?.(deal)}><PenLinear size={16} /></IconButton>
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`删除${deal.title}`} onClick={() => setPendingDelete(deal)}><TrashBinMinimalisticLinear size={16} /></IconButton>
    </div> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {totals.map(total => <div key={total.status} className="flex items-center justify-between rounded-card border border-fg-grey-200 bg-white p-4"><dt className="flex items-center gap-2 text-sm text-fg-grey-700"><StatusBadge {...statusMeta[total.status]} variant="soft" /></dt><dd className="text-xl font-semibold tabular-nums text-fg-black">¥{total.amount.toLocaleString("zh-CN")}</dd></div>)}
    </dl>
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <ToolbarSearchInput className="w-full sm:w-72" value={query} onChange={setQuery} placeholder="搜索商机、客户或发票号" />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => onExport?.(filtered)}>导出</Button>
        <Button iconLeft={<PlusIcon size={16} />} onClick={onAdd}>新建商机</Button>
      </div>
    </div>
    <DataTable<DealRecord>
      columns={columns}
      rows={filtered}
      getRowKey={deal => deal.id}
      showCheckbox
      selectedRowKeys={selected}
      onSelectedRowKeysChange={setSelected}
      footerLeft={<p className="text-sm text-fg-grey-700">共 {filtered.length} 个商机{selected.size ? `，已选 ${selected.size} 个` : ""}</p>}
      emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有找到匹配的商机。</p>}
    />
    {pendingDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <ConfirmationDialog title={`删除商机「${pendingDelete.title}」？`} description="关联的发票与跟进记录会一并归档，此操作无法撤销。" confirmLabel="删除" cancelLabel="取消" color="red" onConfirm={() => { setRows(current => current.filter(deal => deal.id !== pendingDelete.id)); setPendingDelete(null); }} onCancel={() => setPendingDelete(null)} />
    </div>}
  </section>;
}
