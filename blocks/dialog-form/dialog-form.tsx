"use client";

import { useState } from "react";
import { Breadcrumbs, Button, ConfirmationDialog, DataTable, Modal, PageTitleToolbar, PlusIcon, RadioWithLabel, SelectOption, StatusBadge, TextField, Toolbar, ToolbarSearchInput, type ColumnDef } from "@forge-ui-official/core";

export interface Department {
  id: string;
  parentId: string | null;
  name: string;
  leader: string;
  phone: string;
  email: string;
  sort: number;
  enabled: boolean;
  createdAt: string;
}

type DepartmentDraft = Omit<Department, "id" | "createdAt" | "sort"> & { sort: string };

export const defaultDepartments: Department[] = [
  { id: "d1", parentId: null, name: "知行科技", leader: "张宁", phone: "021-6488 0001", email: "office@zhixing.cn", sort: 0, enabled: true, createdAt: "2024-03-01" },
  { id: "d2", parentId: "d1", name: "产品研发中心", leader: "陈思远", phone: "021-6488 0102", email: "rd@zhixing.cn", sort: 1, enabled: true, createdAt: "2024-03-01" },
  { id: "d3", parentId: "d2", name: "前端组", leader: "周远", phone: "021-6488 0121", email: "fe@zhixing.cn", sort: 1, enabled: true, createdAt: "2024-05-12" },
  { id: "d4", parentId: "d2", name: "数据平台组", leader: "许知夏", phone: "021-6488 0135", email: "data@zhixing.cn", sort: 2, enabled: true, createdAt: "2025-01-08" },
  { id: "d5", parentId: "d1", name: "华东销售部", leader: "林悦", phone: "021-6488 0203", email: "sales-east@zhixing.cn", sort: 2, enabled: true, createdAt: "2024-04-18" },
  { id: "d6", parentId: "d1", name: "客户成功部", leader: "苏婉清", phone: "021-6488 0308", email: "cs@zhixing.cn", sort: 3, enabled: false, createdAt: "2025-06-20" },
];

const leaders = ["张宁", "陈思远", "周远", "许知夏", "林悦", "苏婉清"].map(name => ({ value: name, label: name }));
const emptyDraft: DepartmentDraft = { parentId: "d1", name: "", leader: "", phone: "", email: "", sort: "0", enabled: true };

function depth(list: Department[], item: Department): number {
  const parent = list.find(entry => entry.id === item.parentId);
  return parent ? depth(list, parent) + 1 : 0;
}

function ordered(list: Department[], parentId: string | null = null): Department[] {
  return list.filter(item => item.parentId === parentId).sort((left, right) => left.sort - right.sort).flatMap(item => [item, ...ordered(list, item.id)]);
}

function DepartmentDialog({ title, list, initial, onClose, onSave }: { title: string; list: Department[]; initial: DepartmentDraft; onClose: () => void; onSave: (draft: DepartmentDraft) => void }) {
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof DepartmentDraft, string>>>({});
  const set = <K extends keyof DepartmentDraft>(key: K) => (value: DepartmentDraft[K]) => { setDraft(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: undefined })); };

  function submit() {
    const next: typeof errors = {};
    if (!draft.name.trim()) next.name = "部门名称不能为空";
    if (!/^\d+$/.test(draft.sort)) next.sort = "显示顺序需为整数";
    if (draft.phone && !/^[\d\s-]{7,}$/.test(draft.phone)) next.phone = "请输入正确的电话";
    if (draft.email && !/^\S+@\S+\.\S+$/.test(draft.email)) next.email = "请输入正确的邮箱";
    setErrors(next);
    if (!Object.keys(next).length) onSave(draft);
  }

  return <Modal open onOpenChange={open => { if (!open) onClose(); }} title={title} width="w-[640px]" footer={<div className="flex justify-end gap-2"><Button color="grey" variant="tertiary" onClick={onClose}>取消</Button><Button color="blue" onClick={submit}>确定</Button></div>}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><SelectOption color="blue" label="上级部门" width="100%" className="w-full" value={draft.parentId ?? ""} onChange={value => set("parentId")(value || null)} options={[{ value: "", label: "无（顶级部门）" }, ...ordered(list).map(item => ({ value: item.id, label: `${"　".repeat(depth(list, item))}${item.name}` }))]} /></div>
      <TextField color="blue" inputClassName="h-6" label="部门名称 *" value={draft.name} onChange={set("name")} placeholder="如：华南销售部" state={errors.name ? "error" : "idle"} errorMessage={errors.name} />
      <TextField color="blue" inputClassName="h-6" label="显示顺序 *" inputMode="numeric" value={draft.sort} onChange={set("sort")} state={errors.sort ? "error" : "idle"} errorMessage={errors.sort} />
      <SelectOption color="blue" label="负责人" width="100%" className="w-full" value={draft.leader} placeholder="请选择负责人" onChange={set("leader")} options={leaders} />
      <TextField color="blue" inputClassName="h-6" label="联系电话" value={draft.phone} onChange={set("phone")} state={errors.phone ? "error" : "idle"} errorMessage={errors.phone} />
      <div className="sm:col-span-2"><TextField color="blue" inputClassName="h-6" label="邮箱" type="email" value={draft.email} onChange={set("email")} state={errors.email ? "error" : "idle"} errorMessage={errors.email} /></div>
      <div role="radiogroup" aria-label="状态" className="flex items-center gap-6 sm:col-span-2"><span className="text-sm font-medium text-fg-black">状态</span><RadioWithLabel color="blue" label="开启" checked={draft.enabled} onChange={() => set("enabled")(true)} /><RadioWithLabel color="blue" label="关闭" checked={!draft.enabled} onChange={() => set("enabled")(false)} /></div>
    </div>
  </Modal>;
}

export interface DialogFormProps {
  departments?: Department[];
  className?: string;
}

export function DialogForm({ departments = defaultDepartments, className = "" }: DialogFormProps) {
  const [list, setList] = useState(departments);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ title: string; id?: string; draft: DepartmentDraft } | null>(null);
  const [deleting, setDeleting] = useState<Department | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const rows = ordered(list).filter(item => !query.trim() || item.name.includes(query.trim()) || item.leader.includes(query.trim()));

  function save(draft: DepartmentDraft) {
    const value = { ...draft, sort: Number(draft.sort) };
    if (editing?.id) setList(current => current.map(item => item.id === editing.id ? { ...item, ...value } : item));
    else setList(current => [...current, { ...value, id: `d${current.length + 1}-${draft.name}`, createdAt: "2026-11-09" }]);
    setNotice(editing?.id ? `已更新「${draft.name}」` : `已新增「${draft.name}」`);
    setEditing(null);
  }

  const columns: ColumnDef<Department>[] = [
    { key: "name", header: "部门名称", width: "w-[28%]", render: row => <span className="whitespace-nowrap font-medium text-fg-black" style={{ paddingLeft: depth(list, row) * 20 }}>{row.name}</span> },
    { key: "leader", header: "负责人", width: "w-[12%]", render: row => row.leader || "—" },
    { key: "sort", header: "排序", width: "w-[8%]", render: row => <span className="tabular-nums">{row.sort}</span> },
    { key: "status", header: "状态", width: "w-[10%]", render: row => <StatusBadge label={row.enabled ? "开启" : "关闭"} color={row.enabled ? "green" : "grey"} /> },
    { key: "created", header: "创建时间", width: "w-[14%]", render: row => <span className="text-fg-grey-600">{row.createdAt}</span> },
    { key: "actions", header: "操作", width: "w-[28%]", render: row => <div className="flex flex-wrap gap-1">
      <Button color="blue" variant="tertiary" size="sm" onClick={() => setEditing({ title: "修改部门", id: row.id, draft: { ...row, sort: String(row.sort) } })}>修改</Button>
      <Button color="blue" variant="tertiary" size="sm" onClick={() => setEditing({ title: "新增下级部门", draft: { ...emptyDraft, parentId: row.id } })}>新增下级</Button>
      <Button color="red" variant="tertiary" size="sm" disabled={list.some(item => item.parentId === row.id)} onClick={() => setDeleting(row)}>删除</Button>
    </div> },
  ];

  return <div className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <PageTitleToolbar title="部门管理" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "系统管理", href: "#settings" }, { label: "部门管理" }]} />} actions={<Button color="blue" iconLeft={<PlusIcon size={16} />} onClick={() => setEditing({ title: "新增部门", draft: emptyDraft })}>新增部门</Button>} />
    <Toolbar left={<ToolbarSearchInput ariaLabel="搜索部门" placeholder="搜索部门或负责人" value={query} onChange={setQuery} />} right={notice ? <span className="text-sm text-fg-green-700">{notice}</span> : undefined} />
    <DataTable columns={columns} rows={rows} getRowKey={row => row.id} tableMinWidth={860} />
    {editing ? <DepartmentDialog key={editing.id ?? editing.title} title={editing.title} list={list} initial={editing.draft} onClose={() => setEditing(null)} onSave={save} /> : null}
    {deleting ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"><ConfirmationDialog title="删除部门？" description={`删除「${deleting.name}」后，部门下的成员会移到上级部门。`} color="red" confirmLabel="删除" cancelLabel="取消" onCancel={() => setDeleting(null)} onConfirm={() => { setList(current => current.filter(item => item.id !== deleting.id)); setNotice(`已删除「${deleting.name}」`); setDeleting(null); }} /></div> : null}
  </div>;
}
