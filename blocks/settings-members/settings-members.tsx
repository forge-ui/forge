"use client";

import { useState, type FormEvent, type Key } from "react";
import { Button, ButtonGroup, CellImageText, DataTable, Modal, Panel, PlusIcon, ProgressBar, SelectOption, TabBar, TextField, ToolbarSearchInput, cn, type ColumnDef } from "@forge-ui-official/core";

export type MemberRole = "owner" | "admin" | "member" | "viewer";

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: MemberRole;
  team: string;
  usage: number;
  invited?: boolean;
}

export const defaultWorkspaceMembers: WorkspaceMember[] = [
  { id: "m1", name: "张宁", email: "zhangning@zhixing.tech", avatar: "/images/team/edward-allen.png", role: "owner", team: "运营", usage: 68 },
  { id: "m2", name: "林悦", email: "linyue@zhixing.tech", avatar: "/images/blocks/people/lin-yue.jpg", role: "admin", team: "设计", usage: 42 },
  { id: "m3", name: "陈思远", email: "chensiyuan@zhixing.tech", avatar: "/images/blocks/people/chen-siyuan.jpg", role: "member", team: "研发", usage: 81 },
  { id: "m4", name: "许知夏", email: "xuzhixia@zhixing.tech", avatar: "/images/blocks/people/xu-zhixia.jpg", role: "member", team: "质量", usage: 23 },
  { id: "m5", name: "周予安", email: "zhouyuan@zhixing.tech", avatar: "/images/blocks/people/zhou-yuan.jpg", role: "member", team: "研发", usage: 55 },
  { id: "m6", name: "唐可欣", email: "tangkexin@zhixing.tech", avatar: "/images/blocks/people/tang-kexin.jpg", role: "viewer", team: "销售", usage: 6 },
  { id: "m7", name: "gu.chengze@partner.cn", email: "gu.chengze@partner.cn", avatar: "/images/blocks/people/gu-chengze.jpg", role: "member", team: "外部", usage: 0, invited: true },
];

export const defaultTeams = [
  { id: "t1", name: "研发", members: 12, lead: "陈思远" },
  { id: "t2", name: "设计", members: 5, lead: "林悦" },
  { id: "t3", name: "运营", members: 8, lead: "张宁" },
  { id: "t4", name: "销售", members: 9, lead: "唐可欣" },
];

const roleLabel: Record<MemberRole, string> = { owner: "所有者", admin: "管理员", member: "成员", viewer: "只读" };
const roleFilters: { label: string; value: MemberRole | "all" }[] = [{ label: "全部", value: "all" }, { label: "管理员", value: "admin" }, { label: "成员", value: "member" }, { label: "只读", value: "viewer" }];

export interface SettingsMembersProps {
  members?: WorkspaceMember[];
  seats?: number;
  onInvite?: (email: string, role: MemberRole) => void;
  className?: string;
}

export function SettingsMembers({ members = defaultWorkspaceMembers, seats = 10, onInvite, className }: SettingsMembersProps) {
  const [rows, setRows] = useState(members);
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [inviting, setInviting] = useState(false);
  const [invite, setInvite] = useState<{ email: string; role: MemberRole }>({ email: "", role: "member" });
  const role = roleFilters[filter].value;
  const visible = rows.filter(member => (role === "all" || member.role === role || (role === "admin" && member.role === "owner")) && `${member.name} ${member.email} ${member.team}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const used = rows.length;
  const admins = rows.filter(member => member.role === "owner" || member.role === "admin").length;

  const columns: ColumnDef<WorkspaceMember>[] = [
    { key: "name", header: "成员", minWidth: 230, render: member => <CellImageText src={member.avatar} title={member.invited ? "待接受邀请" : member.name} subtitle={member.email} rounded="full" /> },
    { key: "role", header: "角色", minWidth: 130, render: member => member.role === "owner" ? <span className="text-sm font-medium text-fg-black">所有者</span> : <SelectOption shape="pill" options={(["admin", "member", "viewer"] as MemberRole[]).map(value => ({ value, label: roleLabel[value] }))} value={member.role} onChange={value => setRows(current => current.map(item => item.id === member.id ? { ...item, role: value as MemberRole } : item))} /> },
    { key: "team", header: "团队", minWidth: 80, render: member => <span className="text-sm text-fg-grey-900">{member.team}</span> },
    { key: "usage", header: "本月用量", minWidth: 150, render: member => <ProgressBar value={member.usage} color={member.usage > 75 ? "yellow" : "blue"} label={`${member.usage}%`} size="sm" /> },
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)) return;
    setRows(current => [...current, { id: `m-${Date.now()}`, name: invite.email, email: invite.email, avatar: "/images/blocks/people/song-zhiyi.jpg", role: invite.role, team: "未分组", usage: 0, invited: true }]);
    onInvite?.(invite.email, invite.role);
    setInvite({ email: "", role: "member" });
    setInviting(false);
  }

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="fg-scrollbar-hidden overflow-x-auto border-b border-fg-grey-200"><TabBar color="blue" tabs={[{ label: "成员", active: tab === 0 }, { label: "团队", active: tab === 1 }]} onChange={setTab} /></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Panel variant="template"><p className="text-sm text-fg-grey-700">成员</p><p className="text-2xl font-semibold tabular-nums text-fg-black">{used}</p><p className="text-xs text-fg-grey-700">{rows.filter(member => member.invited).length} 人待接受邀请</p></Panel>
      <Panel variant="template"><p className="text-sm text-fg-grey-700">席位</p><p className="text-2xl font-semibold tabular-nums text-fg-black">{used} <span className="text-base font-medium text-fg-grey-500">/ {seats}</span></p><ProgressBar value={Math.round((used / seats) * 100)} color="blue" size="sm" /></Panel>
      <Panel variant="template"><p className="text-sm text-fg-grey-700">管理员</p><p className="text-2xl font-semibold tabular-nums text-fg-black">{admins}</p><p className="text-xs text-fg-grey-700">可邀请、移除与修改账单</p></Panel>
    </div>
    {tab === 0 ? <>
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <ButtonGroup ariaLabel="角色筛选" shape="pill" items={roleFilters.map(item => ({ label: item.label }))} activeIndex={filter} onChange={setFilter} />
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {selected.size > 0 && <Button variant="tertiary" onClick={() => { setRows(current => current.filter(member => member.role === "owner" || !selected.has(member.id))); setSelected(new Set()); }}>移除 {selected.size} 人</Button>}
          <ToolbarSearchInput className="w-full sm:w-60" value={query} onChange={setQuery} placeholder="搜索姓名、邮箱或团队" />
          <Button iconLeft={<PlusIcon size={16} />} disabled={used >= seats} onClick={() => setInviting(true)}>邀请成员</Button>
        </div>
      </div>
      <DataTable<WorkspaceMember> columns={columns} rows={visible} getRowKey={member => member.id} showCheckbox selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有匹配的成员。</p>} />
    </> : <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{defaultTeams.map(team => <li key={team.id}><Panel variant="template"><p className="text-base font-semibold text-fg-black">{team.name}</p><p className="text-sm text-fg-grey-700">{team.members} 名成员 · 负责人 {team.lead}</p></Panel></li>)}</ul>}
    <Modal open={inviting} onOpenChange={setInviting} title="邀请成员">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <TextField label="邮箱" type="email" shape="pill" value={invite.email} onChange={value => setInvite({ ...invite, email: value })} placeholder="name@company.com" />
        <SelectOption label="角色" shape="pill" options={(["admin", "member", "viewer"] as MemberRole[]).map(value => ({ value, label: roleLabel[value] }))} value={invite.role} onChange={value => setInvite({ ...invite, role: value as MemberRole })} />
        <p className="text-xs text-fg-grey-700">剩余 {seats - used} 个席位，邀请链接 7 天内有效。</p>
        <div className="flex justify-end gap-3"><Button type="button" variant="tertiary" onClick={() => setInviting(false)}>取消</Button><Button type="submit" disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email)}>发送邀请</Button></div>
      </form>
    </Modal>
  </section>;
}
