"use client";

import { useState, type Key } from "react";
import { Button, CellImageText, CellRating, CellText, DataTable, IconButton, Modal, PlusIcon, StatusBadge, ToolbarSearchInput, cn, type ColumnDef } from "@forge-ui-official/core";
import { ChatRoundLinear, DownloadMinimalisticLinear, EyeLinear, LetterLinear } from "@forge-ui-official/core/icons";

export interface SellerRecord {
  id: string;
  store: string;
  owner: string;
  avatar: string;
  rating: number;
  products: number;
  revenue: number;
  balance: number;
  joinedAt: string;
}

export const defaultSellers: SellerRecord[] = [
  { id: "s-01", store: "远山设计旗舰店", owner: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg", rating: 4.9, products: 124, revenue: 286400, balance: 32800, joinedAt: "2024-03-12" },
  { id: "s-02", store: "木禾生活馆", owner: "林悦", avatar: "/images/blocks/people/lin-yue.jpg", rating: 4.8, products: 145, revenue: 198200, balance: 21600, joinedAt: "2024-06-28" },
  { id: "s-03", store: "青石数码", owner: "许知夏", avatar: "/images/blocks/people/xu-zhixia.jpg", rating: 4.6, products: 766, revenue: 412900, balance: 48100, joinedAt: "2023-11-04" },
  { id: "s-04", store: "云帆电子", owner: "周予安", avatar: "/images/blocks/people/zhou-yuan.jpg", rating: 4.4, products: 99, revenue: 92000, balance: 9200, joinedAt: "2025-01-17" },
  { id: "s-05", store: "拾光好物", owner: "苏晚晴", avatar: "/images/blocks/people/su-wanqing.jpg", rating: 4.7, products: 451, revenue: 175000, balance: 17500, joinedAt: "2024-09-09" },
  { id: "s-06", store: "桥川户外", owner: "陆景行", avatar: "/images/blocks/people/lu-jingxing.jpg", rating: 4.0, products: 12, revenue: 20400, balance: 2040, joinedAt: "2025-08-21" },
  { id: "s-07", store: "星屿影音", owner: "江雨桐", avatar: "/images/blocks/people/jiang-yutong.jpg", rating: 4.5, products: 46, revenue: 122300, balance: 12230, joinedAt: "2025-04-02" },
  { id: "s-08", store: "承泽办公", owner: "顾承泽", avatar: "/images/blocks/people/gu-chengze.jpg", rating: 3.8, products: 72, revenue: 56700, balance: 5670, joinedAt: "2025-10-15" },
];

export interface SellersTableProps {
  sellers?: SellerRecord[];
  pageSize?: number;
  onAdd?: () => void;
  onExport?: (sellers: SellerRecord[]) => void;
  onMessage?: (seller: SellerRecord, channel: "email" | "chat") => void;
  className?: string;
}

export function SellersTable({ sellers = defaultSellers, pageSize = 8, onAdd, onExport, onMessage, className }: SellersTableProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [viewing, setViewing] = useState<SellerRecord | null>(null);
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = sellers.filter(seller => `${seller.store} ${seller.owner}`.toLocaleLowerCase().includes(keyword));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const money = (value: number) => `¥${value.toLocaleString("zh-CN")}`;

  const columns: ColumnDef<SellerRecord>[] = [
    { key: "store", header: "店铺", minWidth: 220, render: seller => <CellImageText src={seller.avatar} title={seller.store} subtitle={seller.owner} rounded="full" /> },
    { key: "rating", header: "评分", minWidth: 80, render: seller => <CellRating score={seller.rating.toFixed(1)} /> },
    { key: "products", header: "商品数", minWidth: 80, valueKind: "number", render: seller => <CellText>{seller.products}</CellText> },
    { key: "revenue", header: "累计营收", minWidth: 120, valueKind: "number", render: seller => <CellText>{money(seller.revenue)}</CellText> },
    { key: "balance", header: "待结算", minWidth: 110, valueKind: "number", render: seller => <CellText>{money(seller.balance)}</CellText> },
    { key: "joinedAt", header: "入驻日期", minWidth: 110, render: seller => <CellText>{seller.joinedAt}</CellText> },
    { key: "actions", header: "操作", minWidth: 120, render: seller => <div className="flex items-center gap-1">
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`给${seller.store}发邮件`} onClick={() => onMessage?.(seller, "email")}><LetterLinear size={16} /></IconButton>
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`联系${seller.store}`} onClick={() => onMessage?.(seller, "chat")}><ChatRoundLinear size={16} /></IconButton>
      <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`查看${seller.store}`} onClick={() => setViewing(seller)}><EyeLinear size={16} /></IconButton>
    </div> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <ToolbarSearchInput className="w-full sm:w-72" value={query} onChange={value => { setQuery(value); setPage(1); }} placeholder="搜索店铺或店主" />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => onExport?.(filtered)}>导出</Button>
        <Button iconLeft={<PlusIcon size={16} />} onClick={onAdd}>邀请商家</Button>
      </div>
    </div>
    <DataTable<SellerRecord>
      columns={columns}
      rows={visible}
      getRowKey={seller => seller.id}
      showCheckbox
      selectedRowKeys={selected}
      onSelectedRowKeysChange={setSelected}
      showPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setPage}
      paginationLabel={filtered.length ? `显示第 ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} 家，共 ${filtered.length} 家商家` : "没有找到匹配的商家"}
      emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有找到匹配的商家。</p>}
    />
    <Modal open={viewing !== null} onOpenChange={open => { if (!open) setViewing(null); }} title={viewing?.store ?? "商家详情"}>
      {viewing && <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-sm">
        <dt className="text-fg-grey-700">店主</dt><dd className="text-fg-black">{viewing.owner}</dd>
        <dt className="text-fg-grey-700">评分</dt><dd><StatusBadge label={`${viewing.rating.toFixed(1)} 分`} color={viewing.rating >= 4.5 ? "green" : viewing.rating >= 4 ? "blue" : "yellow"} variant="soft" /></dd>
        <dt className="text-fg-grey-700">在售商品</dt><dd className="text-fg-black">{viewing.products} 件</dd>
        <dt className="text-fg-grey-700">累计营收</dt><dd className="font-semibold text-fg-black">{money(viewing.revenue)}</dd>
        <dt className="text-fg-grey-700">待结算</dt><dd className="text-fg-black">{money(viewing.balance)}</dd>
        <dt className="text-fg-grey-700">入驻日期</dt><dd className="text-fg-black">{viewing.joinedAt}</dd>
      </dl>}
    </Modal>
  </section>;
}
