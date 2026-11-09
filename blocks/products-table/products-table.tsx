"use client";

import { useState, type Key } from "react";
import { Button, ButtonGroup, CellImageText, CellMuted, CellText, CellTextSubtitle, ConfirmationDialog, DataTable, IconButton, PlusIcon, StatusBadge, ToolbarSearchInput, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";
import { DownloadMinimalisticLinear, PenLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export type ProductStatus = "published" | "low-stock" | "sold-out" | "draft";

export interface ProductRecord {
  id: string;
  sku: string;
  name: string;
  variants: string;
  category: string;
  stock: number;
  price: number;
  status: ProductStatus;
  addedDate: string;
  addedTime: string;
  image: string;
}

export const defaultProducts: ProductRecord[] = [
  { id: "p-302012", sku: "302012", name: "知行智能手表 E2", variants: "3 个规格", category: "智能穿戴", stock: 204, price: 1299, status: "published", addedDate: "2026-10-29", addedTime: "10:00", image: "/images/blocks/products/smartwatch.jpg" },
  { id: "p-302011", sku: "302011", name: "降噪头戴耳机 G1 Pro", variants: "2 个规格", category: "影音", stock: 18, price: 899, status: "low-stock", addedDate: "2026-10-24", addedTime: "14:30", image: "/images/blocks/products/headphones.jpg" },
  { id: "p-302002", sku: "302002", name: "通勤双肩包", variants: "4 个规格", category: "箱包", stock: 132, price: 459, status: "published", addedDate: "2026-10-12", addedTime: "09:20", image: "/images/blocks/products/backpack.jpg" },
  { id: "p-301901", sku: "301901", name: "无线静音鼠标", variants: "2 个规格", category: "电脑外设", stock: 401, price: 129, status: "published", addedDate: "2026-09-21", addedTime: "16:45", image: "/images/blocks/products/mouse.jpg" },
  { id: "p-301900", sku: "301900", name: "矮轴机械键盘", variants: "3 个规格", category: "电脑外设", stock: 0, price: 599, status: "sold-out", addedDate: "2026-09-21", addedTime: "11:10", image: "/images/blocks/products/keyboard.jpg" },
  { id: "p-301881", sku: "301881", name: "游戏手柄 S", variants: "1 个规格", category: "游戏", stock: 47, price: 349, status: "draft", addedDate: "2026-09-08", addedTime: "15:00", image: "/images/blocks/products/gamepad.jpg" },
  { id: "p-301643", sku: "301643", name: "旗舰手机 X5", variants: "4 个规格", category: "手机", stock: 9, price: 5999, status: "low-stock", addedDate: "2026-08-19", addedTime: "10:30", image: "/images/blocks/products/phone-dark.jpg" },
  { id: "p-301600", sku: "301600", name: "经典腕表", variants: "2 个规格", category: "智能穿戴", stock: 76, price: 1899, status: "published", addedDate: "2026-08-02", addedTime: "13:15", image: "/images/blocks/products/watch.jpg" },
];

const statusMeta: Record<ProductStatus, { label: string; color: StatusBadgeColor }> = {
  published: { label: "已上架", color: "green" },
  "low-stock": { label: "库存不足", color: "yellow" },
  "sold-out": { label: "已售罄", color: "red" },
  draft: { label: "草稿", color: "grey" },
};

const filters: { label: string; value: ProductStatus | "all" }[] = [
  { label: "全部商品", value: "all" },
  { label: "已上架", value: "published" },
  { label: "库存不足", value: "low-stock" },
  { label: "已售罄", value: "sold-out" },
  { label: "草稿", value: "draft" },
];

export interface ProductsTableProps {
  products?: ProductRecord[];
  pageSize?: number;
  onAdd?: () => void;
  onEdit?: (product: ProductRecord) => void;
  onDelete?: (product: ProductRecord) => void;
  onExport?: (products: ProductRecord[]) => void;
  className?: string;
}

export function ProductsTable({ products = defaultProducts, pageSize = 8, onAdd, onEdit, onDelete, onExport, className }: ProductsTableProps) {
  const [rows, setRows] = useState(products);
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<ProductRecord | null>(null);
  const status = filters[filter].value;
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = rows.filter(product => (status === "all" || product.status === status) && `${product.name} ${product.sku} ${product.category}`.toLocaleLowerCase().includes(keyword));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const price = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`;

  const columns: ColumnDef<ProductRecord>[] = [
    { key: "sku", header: "SKU", minWidth: 80, render: product => <CellText>{product.sku}</CellText> },
    { key: "product", header: "商品", minWidth: 200, render: product => <CellImageText src={product.image} title={product.name} subtitle={product.variants} /> },
    { key: "category", header: "分类", minWidth: 96, render: product => <CellMuted>{product.category}</CellMuted> },
    { key: "stock", header: "库存", minWidth: 72, valueKind: "number", render: product => <CellText>{product.stock.toLocaleString("zh-CN")}</CellText> },
    { key: "price", header: "售价", minWidth: 110, valueKind: "number", render: product => <CellText>{price(product.price)}</CellText> },
    { key: "status", header: "状态", minWidth: 100, render: product => <StatusBadge {...statusMeta[product.status]} variant="soft" /> },
    { key: "added", header: "上架时间", minWidth: 104, render: product => <CellTextSubtitle title={product.addedDate} subtitle={product.addedTime} /> },
    { key: "actions", header: "操作", minWidth: 88, render: product => <div className="flex items-center gap-1">
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`编辑${product.name}`} onClick={() => onEdit?.(product)}><PenLinear size={16} /></IconButton>
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`删除${product.name}`} onClick={() => setPendingDelete(product)}><TrashBinMinimalisticLinear size={16} /></IconButton>
    </div> },
  ];

  function confirmDelete() {
    if (!pendingDelete) return;
    setRows(current => current.filter(product => product.id !== pendingDelete.id));
    setSelected(new Set());
    onDelete?.(pendingDelete);
    setPendingDelete(null);
  }

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="-mx-1 min-w-0 fg-scrollbar-hidden overflow-x-auto px-1 pb-1"><ButtonGroup ariaLabel="商品状态" shape="pill" items={filters.map(item => ({ label: item.label }))} activeIndex={filter} onChange={index => { setFilter(index); setPage(1); }} /></div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <ToolbarSearchInput className="w-full sm:w-64" value={query} onChange={value => { setQuery(value); setPage(1); }} placeholder="搜索商品名称或 SKU" />
        <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => onExport?.(filtered)}>导出</Button>
        <Button iconLeft={<PlusIcon size={16} />} onClick={onAdd}>新增商品</Button>
      </div>
    </div>
    <DataTable<ProductRecord>
      columns={columns}
      rows={visible}
      getRowKey={product => product.id}
      showCheckbox
      selectedRowKeys={selected}
      onSelectedRowKeysChange={setSelected}
      showPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setPage}
      paginationLabel={filtered.length ? `显示第 ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} 条，共 ${filtered.length} 条${selected.size ? `，已选 ${selected.size} 条` : ""}` : "没有符合条件的商品"}
      emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有符合条件的商品，请调整筛选或搜索。</p>}
    />
    {pendingDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <ConfirmationDialog title={`删除「${pendingDelete.name}」？`} description="删除后商品将从列表中移除，此操作无法撤销。" confirmLabel="删除" cancelLabel="取消" color="red" onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />
    </div>}
  </section>;
}
