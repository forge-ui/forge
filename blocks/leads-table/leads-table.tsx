"use client";

import { useState, type Key, type ReactNode } from "react";
import { Avatar, AvatarGroup, Button, ButtonGroup, CellImageText, CellMuted, CellText, DataTable, IconButton, Panel, PlusIcon, SmoothLineChart, StatusBadge, ToolbarSearchInput, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";
import { CheckCircleBoldDuotone, CloseCircleBoldDuotone, DownloadMinimalisticLinear, EyeLinear, UsersGroupTwoRoundedBoldDuotone } from "@forge-ui-official/core/icons";

export type LeadTemperature = "new" | "hot" | "warm" | "cold" | "won" | "lost";

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  company: string;
  industry: string;
  status: LeadTemperature;
  source: string;
  owner: string;
}

export const defaultLeads: LeadRecord[] = [
  { id: "ld-01", name: "顾承泽", email: "chengze@chengze.office", avatar: "/images/blocks/people/gu-chengze.jpg", phone: "139 1022 8841", company: "承泽办公", industry: "办公服务", status: "new", source: "官网表单", owner: "张宁" },
  { id: "ld-02", name: "唐可欣", email: "kexin@kexin.studio", avatar: "/images/blocks/people/tang-kexin.jpg", phone: "137 6620 0912", company: "可欣工作室", industry: "设计", status: "warm", source: "展会", owner: "林悦" },
  { id: "ld-03", name: "宋知意", email: "zhiyi@zhiyi.edu", avatar: "/images/blocks/people/song-zhiyi.jpg", phone: "135 2210 6634", company: "知意教育", industry: "教育", status: "hot", source: "老客户推荐", owner: "张宁" },
  { id: "ld-04", name: "陆景行", email: "jingxing@qiaochuan.cn", avatar: "/images/blocks/people/lu-jingxing.jpg", phone: "189 0172 3368", company: "桥川咨询", industry: "咨询", status: "lost", source: "电话外呼", owner: "周予安" },
  { id: "ld-05", name: "江雨桐", email: "yutong@xingyu.media", avatar: "/images/blocks/people/jiang-yutong.jpg", phone: "158 7720 4419", company: "星屿传媒", industry: "传媒", status: "cold", source: "公众号", owner: "林悦" },
  { id: "ld-06", name: "沈清和", email: "qinghe@shiguang.shop", avatar: "/images/blocks/people/shen-qinghe.jpg", phone: "186 2310 7745", company: "拾光商业", industry: "零售", status: "won", source: "展会", owner: "张宁" },
  { id: "ld-07", name: "周予安", email: "yuan@yunfan.tech", avatar: "/images/blocks/people/zhou-yuan.jpg", phone: "136 5512 0087", company: "云帆科技", industry: "软件", status: "hot", source: "官网表单", owner: "周予安" },
  { id: "ld-08", name: "许知夏", email: "zhixia@qingshi.build", avatar: "/images/blocks/people/xu-zhixia.jpg", phone: "137 2290 6618", company: "青石建筑", industry: "建筑", status: "warm", source: "老客户推荐", owner: "林悦" },
];

const statusMeta: Record<LeadTemperature, { label: string; color: StatusBadgeColor }> = {
  new: { label: "新线索", color: "blue" },
  hot: { label: "高意向", color: "red" },
  warm: { label: "跟进中", color: "yellow" },
  cold: { label: "低意向", color: "cyan" },
  won: { label: "已成交", color: "green" },
  lost: { label: "已流失", color: "grey" },
};

const filters: { label: string; value: LeadTemperature | "all" }[] = [{ label: "全部", value: "all" }, { label: "新线索", value: "new" }, { label: "高意向", value: "hot" }, { label: "跟进中", value: "warm" }, { label: "已成交", value: "won" }];

function LeadMetric({ title, period, value, trend, direction = "up", note, icon, iconClassName, footer }: { title: string; period: string; value: string; trend: string; direction?: "up" | "down"; note: string; icon: ReactNode; iconClassName: string; footer: ReactNode }) {
  return <Panel variant="custom" className="flex h-48 min-w-0 flex-col justify-between overflow-hidden rounded-card border border-fg-grey-200 bg-background p-4">
    <div className="flex items-start gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1"><p className="truncate text-lg font-semibold text-fg-black">{title}</p><p className="text-sm font-medium text-fg-grey-700">{period}</p></div>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full bg-fg-grey-50", iconClassName)}>{icon}</span>
    </div>
    <div className="flex items-end gap-4">
      <div className="flex min-w-32 flex-1 flex-col gap-2">
        <p className="text-2xl font-semibold tabular-nums text-fg-black">{value}</p>
        <p className="flex items-center gap-1 text-sm"><span className={cn("font-bold", direction === "up" ? "text-fg-green-500" : "text-fg-red")}>{trend}</span><span className={direction === "up" ? "text-fg-green-500" : "text-fg-red"}>{direction === "up" ? "↑" : "↓"}</span><span className="font-medium text-fg-grey-700">{note}</span></p>
      </div>
      <div className="flex min-w-20 flex-1 items-end justify-end overflow-hidden">{footer}</div>
    </div>
  </Panel>;
}

export interface LeadsTableProps {
  leads?: LeadRecord[];
  pageSize?: number;
  onAdd?: () => void;
  onExport?: (leads: LeadRecord[]) => void;
  onOpen?: (lead: LeadRecord) => void;
  className?: string;
}

export function LeadsTable({ leads = defaultLeads, pageSize = 8, onAdd, onExport, onOpen, className }: LeadsTableProps) {
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const status = filters[filter].value;
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = leads.filter(lead => (status === "all" || lead.status === status) && `${lead.name} ${lead.company} ${lead.email}`.toLocaleLowerCase().includes(keyword));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const won = leads.filter(lead => lead.status === "won").length;
  const lost = leads.filter(lead => lead.status === "lost").length;

  const columns: ColumnDef<LeadRecord>[] = [
    { key: "name", header: "联系人", minWidth: 200, render: lead => <CellImageText src={lead.avatar} title={lead.name} subtitle={lead.email} rounded="full" /> },
    { key: "phone", header: "手机号", minWidth: 130, render: lead => <CellMuted>{lead.phone}</CellMuted> },
    { key: "company", header: "公司", minWidth: 130, render: lead => <div className="flex items-center gap-2"><Avatar initials={lead.company.slice(0, 1)} size="sm" /><div className="min-w-0"><p className="truncate text-sm font-medium text-fg-black">{lead.company}</p><p className="text-xs text-fg-grey-700">{lead.industry}</p></div></div> },
    { key: "status", header: "状态", minWidth: 96, render: lead => <StatusBadge {...statusMeta[lead.status]} variant="soft" /> },
    { key: "source", header: "来源", minWidth: 100, render: lead => <CellText>{lead.source}</CellText> },
    { key: "owner", header: "负责人", minWidth: 80, render: lead => <CellText>{lead.owner}</CellText> },
    { key: "open", header: "", minWidth: 48, render: lead => <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={`查看${lead.name}`} onClick={() => onOpen?.(lead)}><EyeLinear size={16} /></IconButton> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <LeadMetric title="线索总数" period="10 月 1 日至今" value={leads.length.toLocaleString("zh-CN")} trend="10%" note="本周 +3" icon={<UsersGroupTwoRoundedBoldDuotone size={20} />} iconClassName="text-fg-blue" footer={<AvatarGroup>{leads.slice(0, 3).map(lead => <Avatar key={lead.id} src={lead.avatar} alt={lead.name} size="md" />)}</AvatarGroup>} />
      <LeadMetric title="已成交" period="10 月 1 日至今" value={String(won)} trend="2%" note="转化率提升" icon={<CheckCircleBoldDuotone size={20} />} iconClassName="text-fg-green-500" footer={<SmoothLineChart series={[{ data: [52, 55, 53, 58, 57, 60, 62, 64], color: "var(--fg-green-500)", fillArea: true }]} height="h-16" yDomain={[48, 66]} />} />
      <LeadMetric title="已流失" period="10 月 1 日至今" value={String(lost)} trend="2%" direction="down" note="较上月减少" icon={<CloseCircleBoldDuotone size={20} />} iconClassName="text-fg-red" footer={<SmoothLineChart series={[{ data: [44, 47, 43, 41, 38, 35, 33, 31], color: "var(--fg-red)", fillArea: true }]} height="h-16" yDomain={[28, 50]} />} />
    </div>
    <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="-mx-1 min-w-0 fg-scrollbar-hidden overflow-x-auto px-1 pb-1"><ButtonGroup ariaLabel="线索状态" shape="pill" items={filters.map(item => ({ label: item.label }))} activeIndex={filter} onChange={index => { setFilter(index); setPage(1); }} /></div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <ToolbarSearchInput className="w-full sm:w-60" value={query} onChange={value => { setQuery(value); setPage(1); }} placeholder="搜索联系人或公司" />
        <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => onExport?.(filtered)}>导出</Button>
        <Button iconLeft={<PlusIcon size={16} />} onClick={onAdd}>新增线索</Button>
      </div>
    </div>
    <DataTable<LeadRecord>
      columns={columns}
      rows={visible}
      getRowKey={lead => lead.id}
      showCheckbox
      selectedRowKeys={selected}
      onSelectedRowKeysChange={setSelected}
      showPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setPage}
      paginationLabel={filtered.length ? `显示第 ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} 条，共 ${filtered.length} 条线索` : "没有符合条件的线索"}
      emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有符合条件的线索。</p>}
    />
  </section>;
}
