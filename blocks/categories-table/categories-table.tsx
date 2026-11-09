"use client";

import { useState, type FormEvent, type Key } from "react";
import { Button, CellImageText, CellMuted, CellText, ConfirmationDialog, DataTable, IconButton, Modal, PlusIcon, TextArea, TextField, cn, type ColumnDef } from "@forge-ui-official/core";
import { PenLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export interface CategoryRecord {
  id: string;
  name: string;
  description: string;
  image: string;
  sales: number;
  stock: number;
  updatedAt: string;
}

export const defaultCategories: CategoryRecord[] = [
  { id: "wearable", name: "智能穿戴", description: "手表、手环与健康监测设备", image: "/images/blocks/products/smartwatch.jpg", sales: 15020, stock: 901, updatedAt: "2026-10-29" },
  { id: "audio", name: "影音", description: "耳机、音箱与录音设备", image: "/images/blocks/products/headphones.jpg", sales: 10405, stock: 400, updatedAt: "2026-10-24" },
  { id: "phone", name: "手机", description: "旗舰与入门智能手机", image: "/images/blocks/products/phone.jpg", sales: 3245, stock: 132, updatedAt: "2026-10-12" },
  { id: "peripheral", name: "电脑外设", description: "键盘、鼠标与桌面配件", image: "/images/blocks/products/keyboard.jpg", sales: 11902, stock: 1201, updatedAt: "2026-09-21" },
  { id: "bags", name: "箱包", description: "通勤包、旅行箱与收纳", image: "/images/blocks/products/backpack.jpg", sales: 4901, stock: 451, updatedAt: "2026-09-21" },
  { id: "gaming", name: "游戏", description: "手柄、主机与游戏周边", image: "/images/blocks/products/gamepad.jpg", sales: 900, stock: 234, updatedAt: "2026-09-08" },
];

export interface CategoryDraft {
  name: string;
  description: string;
}

export interface CategoriesTableProps {
  categories?: CategoryRecord[];
  onSave?: (category: CategoryDraft, id?: string) => void;
  onDelete?: (category: CategoryRecord) => void;
  className?: string;
}

export function CategoriesTable({ categories = defaultCategories, onSave, onDelete, className }: CategoriesTableProps) {
  const [rows, setRows] = useState(categories);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [editing, setEditing] = useState<{ id?: string; draft: CategoryDraft } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CategoryRecord | null>(null);

  const columns: ColumnDef<CategoryRecord>[] = [
    { key: "name", header: "分类", minWidth: 280, render: category => <CellImageText src={category.image} title={category.name} subtitle={category.description} /> },
    { key: "sales", header: "销量", minWidth: 96, valueKind: "number", render: category => <CellText>{category.sales.toLocaleString("zh-CN")}</CellText> },
    { key: "stock", header: "库存", minWidth: 96, valueKind: "number", render: category => <CellText>{category.stock.toLocaleString("zh-CN")}</CellText> },
    { key: "updatedAt", header: "更新日期", minWidth: 120, render: category => <CellMuted>{category.updatedAt}</CellMuted> },
    { key: "actions", header: "操作", minWidth: 88, render: category => <div className="flex items-center gap-1">
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`编辑${category.name}`} onClick={() => setEditing({ id: category.id, draft: { name: category.name, description: category.description } })}><PenLinear size={16} /></IconButton>
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`删除${category.name}`} onClick={() => setPendingDelete(category)}><TrashBinMinimalisticLinear size={16} /></IconButton>
    </div> },
  ];

  function save(event: FormEvent) {
    event.preventDefault();
    if (!editing || !editing.draft.name.trim()) return;
    const draft = { name: editing.draft.name.trim(), description: editing.draft.description.trim() };
    setRows(current => editing.id
      ? current.map(category => category.id === editing.id ? { ...category, ...draft, updatedAt: new Date().toISOString().slice(0, 10) } : category)
      : [{ id: `category-${Date.now()}`, ...draft, image: "/images/blocks/products/watch.jpg", sales: 0, stock: 0, updatedAt: new Date().toISOString().slice(0, 10) }, ...current]);
    onSave?.(draft, editing.id);
    setEditing(null);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setRows(current => current.filter(category => category.id !== pendingDelete.id));
    onDelete?.(pendingDelete);
    setPendingDelete(null);
  }

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-fg-grey-700">共 {rows.length} 个分类{selected.size ? `，已选 ${selected.size} 个` : ""}</p>
      <Button iconLeft={<PlusIcon size={16} />} onClick={() => setEditing({ draft: { name: "", description: "" } })}>新增分类</Button>
    </div>
    <DataTable<CategoryRecord>
      columns={columns}
      rows={rows}
      getRowKey={category => category.id}
      showCheckbox
      selectedRowKeys={selected}
      onSelectedRowKeysChange={setSelected}
      emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">还没有分类，先新增一个吧。</p>}
    />
    <Modal open={editing !== null} onOpenChange={open => { if (!open) setEditing(null); }} title={editing?.id ? "编辑分类" : "新增分类"}>
      {editing && <form className="flex flex-col gap-4" onSubmit={save}>
        <TextField label="分类名称" shape="pill" required value={editing.draft.name} onChange={value => setEditing({ ...editing, draft: { ...editing.draft, name: value } })} placeholder="例如：智能穿戴" />
        <TextArea label="分类说明" rows={4} value={editing.draft.description} onChange={value => setEditing({ ...editing, draft: { ...editing.draft, description: value } })} placeholder="一句话说明这个分类包含哪些商品" />
        <div className="flex justify-end gap-3 pt-2"><Button type="button" variant="tertiary" onClick={() => setEditing(null)}>取消</Button><Button type="submit" disabled={!editing.draft.name.trim()}>保存</Button></div>
      </form>}
    </Modal>
    {pendingDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <ConfirmationDialog title={`删除「${pendingDelete.name}」分类？`} description="分类下的商品不会被删除，但需要重新归类。" confirmLabel="删除" cancelLabel="取消" color="red" onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>}
  </section>;
}
