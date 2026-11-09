"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Breadcrumbs, Button, DataTable, PageTitleToolbar, StatusBadge, TextField, type ColumnDef } from "@forge-ui-official/core";

export type RuntimeStatus = "online" | "offline" | "unknown";

export interface AgentRuntime {
  id: string;
  name: string;
  kind: string;
  description: string;
  status: RuntimeStatus;
  installed: boolean;
  version?: string;
  connection?: string;
  lastHealthAt?: string;
  lastError?: string;
}

export const defaultRuntimes: AgentRuntime[] = [
  { id: "codex", name: "Codex", kind: "Codex", description: "OpenAI Codex CLI (`codex exec`). Install codex and run discover to go online.", status: "online", installed: true, version: "codex-cli 0.146.0", connection: "codex", lastHealthAt: "2026/11/9 15:02:35" },
  { id: "deep-agents", name: "Deep Agents", kind: "Deep Agents", description: "LangChain deep-runtime HTTP worker", status: "online", installed: true, connection: "http://127.0.0.1:8791", lastHealthAt: "2026/11/9 15:02:35" },
  { id: "dsh", name: "DeepSeek Harness", kind: "DeepSeek Harness", description: "DeepSeek Harness headless CLI; uses the configured headless profile.", status: "online", installed: true, version: "0.2.0-rc.2", connection: "dsh", lastHealthAt: "2026/11/9 15:02:35" },
  { id: "grok-bot", name: "Grok Bot", kind: "Grok Bot", description: "把任务 POST 到该智能体自己的 webhook，由 Grok Bot 执行后回调工场。不启动本地 grok CLI，也不选择执行电脑。", status: "online", installed: true, version: "webhook", lastHealthAt: "2026/11/9 15:02:35" },
  { id: "grok-build", name: "Grok Build", kind: "Grok Build", description: "External Grok Build CLI (headless). Install grok and discover to go online.", status: "offline", installed: true, version: "grok 1.0.52 (0920c8169e27)", connection: "grok", lastHealthAt: "2026/11/9 15:01:12", lastError: "登录已过期，请在执行电脑上重新运行 grok login" },
  { id: "opencode", name: "OpenCode", kind: "OpenCode", description: "OpenCode CLI (`opencode run`). Install: npm i -g opencode-ai, then discover.", status: "unknown", installed: false, connection: "opencode" },
];

const statusLabel: Record<RuntimeStatus, string> = { online: "在线", offline: "离线", unknown: "未知" };
const statusColor: Record<RuntimeStatus, "green" | "red" | "grey"> = { online: "green", offline: "red", unknown: "grey" };

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function now() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

export interface RuntimeListProps {
  runtimes?: AgentRuntime[];
  defaultRuntimeId?: string;
  className?: string;
}

export function RuntimeList({ runtimes = defaultRuntimes, defaultRuntimeId = "deep-agents", className = "" }: RuntimeListProps) {
  const [items, setItems] = useState(runtimes);
  const [search, setSearch] = useState("");
  const [checking, setChecking] = useState<string | "all" | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  function check(id: string | "all") {
    setChecking(id);
    timer.current = window.setTimeout(() => {
      setItems(current => current.map(runtime => id === "all" || runtime.id === id ? { ...runtime, lastHealthAt: runtime.installed ? now() : runtime.lastHealthAt } : runtime));
      setChecking(null);
    }, 900);
  }

  const query = search.trim().toLowerCase();
  const filtered = items.filter(runtime => `${runtime.name} ${runtime.kind} ${runtime.description} ${runtime.connection ?? ""}`.toLowerCase().includes(query));
  const busy = checking !== null;
  const columns: ColumnDef<AgentRuntime>[] = [
    {
      key: "name", header: "名称", width: "w-[30%]",
      render: runtime => <div className="min-w-0 whitespace-normal">
        <div className="break-words font-medium text-fg-black">{runtime.name}{runtime.id === defaultRuntimeId ? <span className="ml-2 text-xs font-normal text-fg-grey-500">默认</span> : null}</div>
        <p className="mt-1 break-words text-xs text-fg-grey-500">{runtime.description}</p>
      </div>,
    },
    { key: "kind", header: "类型", width: "w-[14%]", render: runtime => <span className="text-sm text-fg-grey-700">{runtime.kind}</span> },
    {
      key: "status", header: "状态", width: "w-[30%]",
      render: runtime => <div className="flex flex-col items-start gap-1 whitespace-normal">
        <StatusBadge label={runtime.installed ? statusLabel[runtime.status] : "未安装"} color={runtime.installed ? statusColor[runtime.status] : "grey"} />
        {runtime.version ? <span className="break-all text-xs text-fg-grey-500">{runtime.version}</span> : null}
        <span className="whitespace-nowrap text-xs text-fg-grey-500">最后检测：{checking === runtime.id || (checking === "all" && runtime.installed) ? "检测中…" : runtime.lastHealthAt ?? "尚未检测"}</span>
        {runtime.lastError && runtime.installed ? <p className="break-words text-xs text-fg-red-600">{runtime.lastError}</p> : null}
      </div>,
    },
    { key: "connection", header: "连接", width: "w-[18%]", render: runtime => <span className="whitespace-normal break-all font-mono text-xs text-fg-grey-600">{runtime.connection ?? "—"}</span> },
    { key: "actions", header: "操作", width: "w-[8%]", render: runtime => <Button color="blue" variant="tertiary" size="sm" disabled={busy} aria-label={`检查 ${runtime.name}`} onClick={() => check(runtime.id)}>检查</Button> },
  ];

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-6 ${className}`}>
    <PageTitleToolbar
      title="运行时"
      subtitle="支持 Deep Agents、Grok Build、Codex、OpenCode、DeepSeek Harness（DSH）和 Grok Bot。探测后可在自主智能体里选择引擎。Grok Bot 只是引擎表里的一行，webhook 写在智能体上。"
      breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "智能体", href: "#apps" }, { label: "运行时" }]} />}
      askAi={{ placeholder: "问问运行时…", suggestions: ["Grok Build 为什么离线？", "OpenCode 怎么安装？"], onSend: () => "Grok Build 最近一次检测返回登录过期，在执行电脑上运行 grok login 后点「检查」即可。OpenCode 用 npm i -g opencode-ai 安装，再点「探测本机运行时」。" }}
      actions={<div className="flex flex-wrap items-center gap-2">
        <Button color="blue" variant="secondary" disabled={busy}>刷新</Button>
        <Button color="blue" disabled={busy} onClick={() => check("all")}>{checking === "all" ? "探测中…" : "探测本机运行时"}</Button>
      </div>}
      className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0 [&>div:first-child]:sm:min-w-48 [&>div:last-child]:sm:flex-wrap"
    />
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:max-w-sm"><TextField color="blue" aria-label="搜索运行时" placeholder="搜索名称、类型或连接" value={search} onChange={setSearch} /></div>
        <span className="text-sm text-fg-grey-500">共 {filtered.length} 个运行时</span>
      </div>
      <DataTable color="blue" columns={columns} rows={filtered} getRowKey={runtime => runtime.id} tableMinWidth={1000}
        emptyState={<div className="flex flex-col items-center gap-3 py-4 text-sm text-fg-grey-600">
          <p>没有匹配的运行时</p>
          <Button color="blue" variant="tertiary" size="sm" onClick={() => setSearch("")}>清除搜索</Button>
        </div>} />
    </section>
  </div>;
}
