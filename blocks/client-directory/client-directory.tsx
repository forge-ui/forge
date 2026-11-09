"use client";

import { useState, type Key } from "react";
import { Avatar, Button, ButtonGroup, CellImageText, CellMuted, CellText, DataTable, IconButton, Panel, PlusIcon, ToolbarSearchInput, cn, type ColumnDef } from "@forge-ui-official/core";
import { EyeLinear, LetterLinear, PhoneLinear } from "@forge-ui-official/core/icons";

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
  phone: string;
  projects: number;
  since: string;
}

export const defaultClients: ClientRecord[] = [
  { id: "cl1", name: "陈思远", email: "siyuan@yuanshan.design", avatar: "/images/blocks/people/chen-siyuan.jpg", company: "远山设计", phone: "138 1024 5521", projects: 4, since: "2024-03-12" },
  { id: "cl2", name: "苏晚晴", email: "wanqing@shiguang.shop", avatar: "/images/blocks/people/su-wanqing.jpg", company: "拾光好物", phone: "135 8841 2290", projects: 3, since: "2024-06-28" },
  { id: "cl3", name: "许知夏", email: "zhixia@qingshi.build", avatar: "/images/blocks/people/xu-zhixia.jpg", company: "青石建筑", phone: "137 2290 6618", projects: 2, since: "2025-01-17" },
  { id: "cl4", name: "宋知意", email: "zhiyi@zhiyi.edu", avatar: "/images/blocks/people/song-zhiyi.jpg", company: "知意教育", phone: "135 2210 6634", projects: 1, since: "2026-10-14" },
  { id: "cl5", name: "江雨桐", email: "yutong@xingyu.media", avatar: "/images/blocks/people/jiang-yutong.jpg", company: "星屿传媒", phone: "158 7720 4419", projects: 2, since: "2025-04-02" },
  { id: "cl6", name: "顾承泽", email: "chengze@chengze.office", avatar: "/images/blocks/people/gu-chengze.jpg", company: "承泽办公", phone: "139 1022 8841", projects: 1, since: "2025-10-15" },
];

export interface ClientDirectoryProps {
  clients?: ClientRecord[];
  onAdd?: () => void;
  onOpen?: (client: ClientRecord) => void;
  className?: string;
}

export function ClientDirectory({ clients = defaultClients, onAdd, onOpen, className }: ClientDirectoryProps) {
  const [view, setView] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const visible = clients.filter(client => `${client.name} ${client.company} ${client.email}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  const columns: ColumnDef<ClientRecord>[] = [
    { key: "name", header: "联系人", minWidth: 210, render: client => <CellImageText src={client.avatar} title={client.name} subtitle={client.email} rounded="full" /> },
    { key: "company", header: "公司", minWidth: 130, render: client => <div className="flex items-center gap-2"><Avatar initials={client.company.slice(0, 1)} size="sm" /><CellText>{client.company}</CellText></div> },
    { key: "phone", header: "电话", minWidth: 130, render: client => <CellMuted>{client.phone}</CellMuted> },
    { key: "projects", header: "合作项目", minWidth: 90, valueKind: "number", render: client => <CellText>{client.projects} 个</CellText> },
    { key: "since", header: "合作起始", minWidth: 110, render: client => <CellMuted>{client.since}</CellMuted> },
    { key: "open", header: "", minWidth: 48, render: client => <IconButton variant="ghost" color="grey" size="sm" aria-label={`查看${client.name}`} onClick={() => onOpen?.(client)}><EyeLinear size={16} /></IconButton> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <ToolbarSearchInput className="w-full sm:w-72" value={query} onChange={setQuery} placeholder="搜索客户、公司或邮箱" />
      <div className="flex flex-wrap items-center gap-3">
        <ButtonGroup ariaLabel="显示方式" shape="pill" items={[{ label: "表格" }, { label: "卡片" }]} activeIndex={view} onChange={setView} />
        <Button iconLeft={<PlusIcon size={16} />} onClick={onAdd}>新增客户</Button>
      </div>
    </div>
    {view === 0
      ? <DataTable<ClientRecord> columns={columns} rows={visible} getRowKey={client => client.id} showCheckbox selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} footerLeft={<p className="text-sm text-fg-grey-700">共 {visible.length} 位客户</p>} emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有找到匹配的客户。</p>} />
      : <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{visible.map(client => <li key={client.id}><Panel variant="template" className="h-full items-center text-center">
        <Avatar src={client.avatar} alt={client.name} size="xl" />
        <div><p className="text-base font-semibold text-fg-black">{client.name}</p><p className="text-sm text-fg-grey-700">{client.company}</p></div>
        <dl className="grid w-full grid-cols-2 gap-3 rounded-2xl bg-fg-grey-50 p-3 text-sm"><div><dt className="text-xs text-fg-grey-700">合作项目</dt><dd className="mt-1 font-semibold text-fg-black">{client.projects} 个</dd></div><div><dt className="text-xs text-fg-grey-700">合作起始</dt><dd className="mt-1 font-semibold text-fg-black">{client.since.slice(0, 7)}</dd></div></dl>
        <div className="flex gap-2"><IconButton variant="tertiary" size="sm" aria-label={`给${client.name}发邮件`}><LetterLinear size={16} /></IconButton><IconButton variant="tertiary" size="sm" aria-label={`致电${client.name}`}><PhoneLinear size={16} /></IconButton><Button size="sm" variant="tertiary" onClick={() => onOpen?.(client)}>查看</Button></div>
      </Panel></li>)}</ul>}
  </section>;
}
