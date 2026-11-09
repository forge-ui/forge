"use client";

import { useState, type FormEvent, type Key } from "react";
import { Avatar, Button, CellImageText, CellMuted, CellText, DataTable, IconButton, Modal, PlusIcon, StatusBadge, TextField, ToolbarSearchInput, cn, type ColumnDef } from "@forge-ui-official/core";
import { DownloadMinimalisticLinear, LetterLinear, PhoneLinear } from "@forge-ui-official/core/icons";

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  orders: number;
  spent: number;
  online: boolean;
  createdAt: string;
}

export const defaultCustomers: CustomerRecord[] = [
  { id: "c-1001", name: "陈思远", email: "siyuan@yuanshan.design", avatar: "/images/blocks/people/chen-siyuan.jpg", phone: "138 1024 5521", orders: 124, spent: 48600, online: true, createdAt: "2026-10-29" },
  { id: "c-1002", name: "林悦", email: "linyue@muhe.art", avatar: "/images/blocks/people/lin-yue.jpg", phone: "139 6620 1834", orders: 45, spent: 12800, online: false, createdAt: "2026-10-24" },
  { id: "c-1003", name: "许知夏", email: "zhixia@qingshi.build", avatar: "/images/blocks/people/xu-zhixia.jpg", phone: "137 2290 6618", orders: 98, spent: 36400, online: true, createdAt: "2026-10-12" },
  { id: "c-1004", name: "周予安", email: "yuan@yunfan.tech", avatar: "/images/blocks/people/zhou-yuan.jpg", phone: "136 5512 0087", orders: 31, spent: 9200, online: false, createdAt: "2026-09-21" },
  { id: "c-1005", name: "苏晚晴", email: "wanqing@shiguang.shop", avatar: "/images/blocks/people/su-wanqing.jpg", phone: "135 8841 2290", orders: 154, spent: 61200, online: true, createdAt: "2026-09-21" },
  { id: "c-1006", name: "沈清和", email: "qinghe@shiguang.shop", avatar: "/images/blocks/people/shen-qinghe.jpg", phone: "186 2310 7745", orders: 43, spent: 15300, online: true, createdAt: "2026-09-08" },
  { id: "c-1007", name: "陆景行", email: "jingxing@qiaochuan.cn", avatar: "/images/blocks/people/lu-jingxing.jpg", phone: "189 0172 3368", orders: 12, spent: 2400, online: false, createdAt: "2026-08-19" },
  { id: "c-1008", name: "江雨桐", email: "yutong@xingyu.media", avatar: "/images/blocks/people/jiang-yutong.jpg", phone: "158 7720 4419", orders: 76, spent: 22900, online: true, createdAt: "2026-08-02" },
];

export interface NewCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface CustomersTableProps {
  customers?: CustomerRecord[];
  pageSize?: number;
  onCreate?: (customer: NewCustomer) => void;
  onExport?: (customers: CustomerRecord[]) => void;
  onContact?: (customer: CustomerRecord, channel: "email" | "phone") => void;
  className?: string;
}

export function CustomersTable({ customers = defaultCustomers, pageSize = 8, onCreate, onExport, onContact, className }: CustomersTableProps) {
  const [rows, setRows] = useState(customers);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<NewCustomer>({ name: "", email: "", phone: "" });
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = rows.filter(customer => `${customer.name} ${customer.email} ${customer.phone}`.toLocaleLowerCase().includes(keyword));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: ColumnDef<CustomerRecord>[] = [
    { key: "name", header: "客户", minWidth: 240, render: customer => customer.avatar ? <CellImageText src={customer.avatar} title={customer.name} subtitle={customer.email} rounded="full" /> : <div className="flex items-center gap-3"><Avatar initials={customer.name.slice(0, 1)} alt={customer.name} size="sm" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{customer.name}</p><p className="truncate text-xs text-fg-grey-700">{customer.email || "未填写邮箱"}</p></div></div> },
    { key: "phone", header: "手机号", minWidth: 140, render: customer => <CellMuted>{customer.phone}</CellMuted> },
    { key: "orders", header: "订单数", minWidth: 80, valueKind: "number", render: customer => <CellText>{customer.orders.toLocaleString("zh-CN")}</CellText> },
    { key: "spent", header: "累计消费", minWidth: 120, valueKind: "number", render: customer => <CellText>¥{customer.spent.toLocaleString("zh-CN")}</CellText> },
    { key: "status", header: "状态", minWidth: 90, render: customer => <StatusBadge label={customer.online ? "在线" : "离线"} color={customer.online ? "green" : "grey"} variant="soft" /> },
    { key: "createdAt", header: "注册日期", minWidth: 110, render: customer => <CellMuted>{customer.createdAt}</CellMuted> },
    { key: "contact", header: "联系", minWidth: 88, render: customer => <div className="flex items-center gap-1">
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`给${customer.name}发邮件`} onClick={() => onContact?.(customer, "email")}><LetterLinear size={16} /></IconButton>
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`致电${customer.name}`} onClick={() => onContact?.(customer, "phone")}><PhoneLinear size={16} /></IconButton>
    </div> },
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    const created: CustomerRecord = { id: `c-${Date.now()}`, name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.trim(), avatar: "", orders: 0, spent: 0, online: false, createdAt: new Date().toISOString().slice(0, 10) };
    setRows(current => [created, ...current]);
    onCreate?.(draft);
    setDraft({ name: "", email: "", phone: "" });
    setCreating(false);
    setPage(1);
  }

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <ToolbarSearchInput className="w-full sm:w-72" value={query} onChange={value => { setQuery(value); setPage(1); }} placeholder="搜索姓名、邮箱或手机号" />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => onExport?.(filtered)}>导出</Button>
        <Button iconLeft={<PlusIcon size={16} />} onClick={() => setCreating(true)}>新增客户</Button>
      </div>
    </div>
    <DataTable<CustomerRecord>
      columns={columns}
      rows={visible}
      getRowKey={customer => customer.id}
      showCheckbox
      selectedRowKeys={selected}
      onSelectedRowKeysChange={setSelected}
      showPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setPage}
      paginationLabel={filtered.length ? `显示第 ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} 条，共 ${filtered.length} 位客户` : "没有找到匹配的客户"}
      emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有找到匹配的客户，请换个关键词。</p>}
    />
    <Modal open={creating} onOpenChange={setCreating} title="新增客户">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <TextField label="客户姓名" shape="pill" required value={draft.name} onChange={value => setDraft({ ...draft, name: value })} placeholder="请输入客户姓名" />
        <TextField label="邮箱" type="email" shape="pill" value={draft.email} onChange={value => setDraft({ ...draft, email: value })} placeholder="name@company.com" />
        <TextField label="手机号" type="tel" shape="pill" value={draft.phone} onChange={value => setDraft({ ...draft, phone: value })} placeholder="138 0000 0000" />
        <div className="flex justify-end gap-3 pt-2"><Button type="button" variant="tertiary" onClick={() => setCreating(false)}>取消</Button><Button type="submit" disabled={!draft.name.trim()}>保存客户</Button></div>
      </form>
    </Modal>
  </section>;
}
