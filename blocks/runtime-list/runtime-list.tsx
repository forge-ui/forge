"use client";

import { useEffect, useRef, useState } from "react";
import { Button, DataTable, StatusBadge, ToolbarSearchInput, cn, type ColumnDef, type StatusBadgeColor } from "@forge-ui-official/core";
import { RefreshLinear } from "@forge-ui-official/core/icons";

export type RuntimeState = "online" | "offline" | "missing" | "checking";

export interface AgentRuntime {
  id: string;
  name: string;
  description: string;
  kind: string;
  state: RuntimeState;
  endpoint: string;
  checkedAt: string;
  isDefault?: boolean;
}

export const defaultRuntimes: AgentRuntime[] = [
  { id: "deep-agents", name: "Deep Agents", description: "LangChain 深度智能体运行时，支持计划、子任务与文件读写。", kind: "Deep Agents", state: "online", endpoint: "http://deep-runtime:8791", checkedAt: "11-09 14:21", isDefault: true },
  { id: "codex", name: "Codex", description: "代码编写与评审，适合代码修复与测试补全。", kind: "Codex", state: "online", endpoint: "codex", checkedAt: "11-09 14:21" },
  { id: "claude-code", name: "Claude Code", description: "仓库级编码与重构，在隔离工作区内执行。", kind: "Claude Code", state: "offline", endpoint: "claude", checkedAt: "11-09 14:20" },
  { id: "opencode", name: "OpenCode", description: "开源编码运行时，支持多模型切换。", kind: "OpenCode", state: "missing", endpoint: "opencode", checkedAt: "11-09 14:20" },
  { id: "workflow", name: "工作流引擎", description: "执行可视化编排的工作流与定时自动化。", kind: "Workflow", state: "online", endpoint: "http://workflow:8080", checkedAt: "11-09 14:19" },
  { id: "sandbox", name: "代码沙箱", description: "隔离执行 Python 与 Shell 脚本，限制网络与文件访问。", kind: "Sandbox", state: "online", endpoint: "http://sandbox:9000", checkedAt: "11-09 14:19" },
];

const stateMeta: Record<RuntimeState, { label: string; color: StatusBadgeColor }> = {
  online: { label: "在线", color: "green" },
  offline: { label: "离线", color: "red" },
  missing: { label: "未安装", color: "grey" },
  checking: { label: "检查中", color: "blue" },
};

export interface RuntimeListProps {
  runtimes?: AgentRuntime[];
  check?: (runtime: AgentRuntime) => Promise<RuntimeState>;
  className?: string;
}

export function RuntimeList({ runtimes = defaultRuntimes, check, className }: RuntimeListProps) {
  const [rows, setRows] = useState(runtimes);
  const [query, setQuery] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(timer => window.clearTimeout(timer)), []);
  const visible = rows.filter(runtime => `${runtime.name} ${runtime.kind} ${runtime.endpoint}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const online = rows.filter(runtime => runtime.state === "online").length;

  function probe(targets: AgentRuntime[]) {
    const ids = new Set(targets.map(runtime => runtime.id));
    const previous = new Map(rows.map(runtime => [runtime.id, runtime.state]));
    setRows(current => current.map(runtime => ids.has(runtime.id) ? { ...runtime, state: "checking" } : runtime));
    targets.forEach((runtime, index) => {
      const finish = (state: RuntimeState) => setRows(current => current.map(item => item.id === runtime.id ? { ...item, state, checkedAt: "刚刚" } : item));
      if (check) { check(runtime).then(finish, () => finish("offline")); return; }
      timers.current.push(window.setTimeout(() => finish(previous.get(runtime.id) === "checking" ? "online" : previous.get(runtime.id) ?? "online"), 700 + index * 250));
    });
  }

  const columns: ColumnDef<AgentRuntime>[] = [
    { key: "name", header: "名称", minWidth: 260, render: runtime => <div className="min-w-0"><p className="flex items-center gap-2 text-sm font-semibold text-fg-black">{runtime.name}{runtime.isDefault && <span className="rounded-md bg-fg-grey-100 px-1.5 py-0.5 text-[11px] font-medium text-fg-grey-700">默认</span>}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-fg-grey-700">{runtime.description}</p></div> },
    { key: "kind", header: "类型", minWidth: 110, render: runtime => <span className="text-sm text-fg-grey-900">{runtime.kind}</span> },
    { key: "state", header: "状态", minWidth: 130, render: runtime => <div className="flex flex-col items-start gap-1"><StatusBadge {...stateMeta[runtime.state]} variant="soft" /><span className="text-xs text-fg-grey-500">检测 {runtime.checkedAt}</span></div> },
    { key: "endpoint", header: "连接", minWidth: 170, render: runtime => <span className="break-all font-mono text-xs text-fg-grey-700">{runtime.endpoint}</span> },
    { key: "action", header: "操作", minWidth: 80, render: runtime => <Button size="sm" variant="tertiary" disabled={runtime.state === "checking"} onClick={() => probe([runtime])}>检查</Button> },
  ];

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <ToolbarSearchInput className="w-full sm:w-72" value={query} onChange={setQuery} placeholder="搜索名称、类型或连接" />
      <div className="flex flex-wrap items-center gap-3"><span className="text-sm text-fg-grey-700">{online} / {rows.length} 在线</span><Button iconLeft={<RefreshLinear size={16} />} disabled={rows.some(runtime => runtime.state === "checking")} onClick={() => probe(rows)}>探测全部运行时</Button></div>
    </div>
    <DataTable<AgentRuntime> columns={columns} rows={visible} getRowKey={runtime => runtime.id} emptyState={<p className="py-10 text-center text-sm text-fg-grey-700">没有找到匹配的运行时。</p>} />
  </section>;
}
