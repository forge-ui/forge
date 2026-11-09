"use client";

import { useState } from "react";
import { Button, Checkbox, Panel, PlusIcon, StatusBadge, cn } from "@forge-ui-official/core";

export interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
}

export interface WorkspaceRole {
  id: string;
  name: string;
  description: string;
  members: number;
  system?: boolean;
  permissions: string[];
}

export const defaultPermissionTree: PermissionNode[] = [
  { id: "workspace", label: "工作区", children: [{ id: "projects", label: "项目" }, { id: "tasks", label: "我的任务" }, { id: "automations", label: "自动化" }] },
  { id: "agents", label: "智能体", children: [{ id: "apps", label: "应用智能体" }, { id: "autonomous", label: "自主智能体" }, { id: "runtimes", label: "运行时" }, { id: "channels", label: "消息渠道" }] },
  { id: "platform", label: "平台", children: [{ id: "knowledge", label: "知识库" }, { id: "tools", label: "工具" }, { id: "models", label: "模型" }] },
  { id: "admin", label: "系统设置", children: [{ id: "users", label: "用户管理" }, { id: "roles", label: "角色权限" }, { id: "billing", label: "账单" }] },
];

export const defaultWorkspaceRoles: WorkspaceRole[] = [
  { id: "admin", name: "管理员", description: "管理全部资源与系统设置", members: 2, system: true, permissions: ["projects", "tasks", "automations", "apps", "autonomous", "runtimes", "channels", "knowledge", "tools", "models", "users", "roles", "billing"] },
  { id: "builder", name: "智能体开发者", description: "创建与发布智能体，维护知识库和工具", members: 6, permissions: ["projects", "tasks", "apps", "autonomous", "runtimes", "knowledge", "tools"] },
  { id: "operator", name: "业务人员", description: "使用已发布的智能体处理日常工作", members: 18, permissions: ["projects", "tasks", "apps"] },
  { id: "auditor", name: "审计员", description: "只读查看运行记录与用量", members: 1, permissions: ["tasks", "runtimes", "billing"] },
];

export interface SettingsRolesProps {
  tree?: PermissionNode[];
  roles?: WorkspaceRole[];
  onSave?: (role: WorkspaceRole) => void;
  className?: string;
}

export function SettingsRoles({ tree = defaultPermissionTree, roles = defaultWorkspaceRoles, onSave, className }: SettingsRolesProps) {
  const [items, setItems] = useState(roles);
  const [activeId, setActiveId] = useState(roles[1]?.id ?? roles[0].id);
  const [draft, setDraft] = useState<Set<string>>(new Set(roles.find(role => role.id === activeId)?.permissions));
  const active = items.find(role => role.id === activeId) ?? items[0];
  const dirty = active.permissions.length !== draft.size || active.permissions.some(id => !draft.has(id));

  function select(role: WorkspaceRole) {
    setActiveId(role.id);
    setDraft(new Set(role.permissions));
  }

  function toggle(ids: string[], value: boolean) {
    setDraft(current => {
      const next = new Set(current);
      ids.forEach(id => value ? next.add(id) : next.delete(id));
      return next;
    });
  }

  function save() {
    const next = { ...active, permissions: [...draft] };
    setItems(current => current.map(role => role.id === active.id ? next : role));
    onSave?.(next);
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]", className)}>
    <Panel variant="template" title="角色" action={<Button size="sm" variant="tertiary" iconLeft={<PlusIcon size={16} />}>新建</Button>}>
      <ul className="flex flex-col gap-2">{items.map(role => <li key={role.id}><Button variant="unstyled" type="button" aria-current={role.id === active.id ? "true" : undefined} className={cn("flex w-full flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-colors", role.id === active.id ? "border-fg-blue bg-fg-blue-50/50" : "border-fg-grey-200 hover:bg-fg-grey-50")} onClick={() => select(role)}>
        <span className="flex w-full items-center justify-between gap-2"><span className="text-sm font-semibold text-fg-black">{role.name}</span>{role.system && <StatusBadge label="系统" color="grey" variant="soft" />}</span>
        <span className="text-xs text-fg-grey-700">{role.members} 名成员 · {role.permissions.length} 项权限</span>
      </Button></li>)}</ul>
    </Panel>
    <Panel variant="template" title={`${active.name} 的菜单权限`} subtitle={active.description} action={<div className="flex gap-2"><Button size="sm" variant="tertiary" disabled={!dirty} onClick={() => setDraft(new Set(active.permissions))}>撤销</Button><Button size="sm" disabled={!dirty || active.system} onClick={save}>保存</Button></div>}>
      {active.system && <p className="rounded-xl bg-fg-grey-50 px-4 py-3 text-sm text-fg-grey-700">系统角色拥有全部权限，不能修改。</p>}
      <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">{tree.map(group => {
        const ids = (group.children ?? []).map(child => child.id);
        const count = ids.filter(id => draft.has(id)).length;
        return <li key={group.id} className="rounded-card border border-fg-grey-200 p-4">
          <label className="flex items-center justify-between gap-3 border-b border-fg-grey-200 pb-3"><span className="flex items-center gap-2 text-sm font-semibold text-fg-black"><Checkbox color="blue" checked={count === ids.length} disabled={active.system} onChange={value => toggle(ids, value)} />{group.label}</span><span className="text-xs tabular-nums text-fg-grey-500">{count} / {ids.length}</span></label>
          <ul className="flex flex-col gap-2 pt-3">{(group.children ?? []).map(child => <li key={child.id}><label className="flex items-center gap-2 pl-6 text-sm text-fg-grey-900"><Checkbox color="blue" checked={draft.has(child.id)} disabled={active.system} onChange={value => toggle([child.id], value)} />{child.label}</label></li>)}</ul>
        </li>;
      })}</ul>
    </Panel>
  </div>;
}
