"use client";

import { useState, type CSSProperties } from "react";
import { Breadcrumbs, Button, ConfirmationDialog, Modal, PageTitleToolbar, StatusBadge } from "@forge-ui-official/core";
import { DocumentTextLinear } from "@forge-ui-official/core/icons";

export type ArtifactCategory = "document" | "code" | "data" | "image";

export interface TaskEvent {
  id: string;
  at: string;
  type: string;
  message: string;
}

export interface TaskArtifact {
  name: string;
  category: ArtifactCategory;
  format: string;
  content: string;
}

export interface TaskRunDetailData {
  id: string;
  goal: string;
  status: "succeeded" | "failed" | "running";
  agent: string;
  approval: string;
  createdAt: string;
  updatedAt: string;
  sourceItem?: string;
  sourceProject?: string;
  knowledge: string[];
  events: TaskEvent[];
  summary: string;
  artifacts: TaskArtifact[];
  usage: { toolCalls: number; tokens: number };
}

const report = `# 订单服务超时排查报告

## 结论
11 月 8 日 23:40–00:25 的超时由库存服务连接池耗尽引起，订单服务本身无异常。

## 证据
- 库存服务连接池使用率在 23:38 达到 100%，等待队列峰值 412。
- 同时段夜间对账任务提前启动，占用 60% 连接。
- 订单服务 P99 从 320ms 升至 8.4s，错误码均为下游超时。

## 处置
1. 对账任务改到 02:00 后执行。
2. 库存服务连接池上限从 50 调到 80，并加使用率告警。
`;

const actions = `# 处置建议

| 优先级 | 动作 | 负责人 | 期限 |
| --- | --- | --- | --- |
| P0 | 调整对账任务的执行时间 | 陈思远 | 11/10 |
| P1 | 连接池扩容并压测 | 周远 | 11/12 |
| P2 | 补充连接池使用率告警 | 运维值班 | 11/12 |
`;

const metrics = `time,requests,timeouts,p99_ms
23:30,1820,4,320
23:40,1956,212,6120
23:50,2011,486,8410
00:00,1874,397,7930
00:10,1640,128,3260
00:20,1502,9,410
`;

export const defaultTaskRun: TaskRunDetailData = {
  id: "task-6caa643d-1fd7-4d28-8a29-d703c0a56086",
  goal: "排查订单服务 11 月 8 日夜间的超时告警，给出根因与处置建议",
  status: "succeeded",
  agent: "ops-analyst@3",
  approval: "危险操作才问",
  createdAt: "2026/11/09 09:14",
  updatedAt: "2026/11/09 09:21",
  sourceItem: "W-128",
  sourceProject: "订单中心稳定性治理",
  knowledge: ["运维值班手册", "订单服务架构说明"],
  events: [
    { id: "e1", at: "2026/11/09 09:14", type: "created", message: "任务已由运行时接收" },
    { id: "e2", at: "2026/11/09 09:14", type: "running", message: "Deep Agents 适配器已启动" },
    { id: "e3", at: "2026/11/09 09:15", type: "knowledge_read", message: "检索「运维值班手册」：订单超时处置流程（3 段）" },
    { id: "e4", at: "2026/11/09 09:16", type: "tool_call", message: "查询告警记录：order-service 23:30–00:30，共 37 条" },
    { id: "e5", at: "2026/11/09 09:18", type: "tool_call", message: "拉取链路指标：库存服务连接池使用率与等待队列" },
    { id: "e6", at: "2026/11/09 09:20", type: "artifact", message: "写入 3 个产物：排查报告、处置建议、超时请求统计" },
    { id: "e7", at: "2026/11/09 09:21", type: "finished", message: "任务成功完成" },
  ],
  summary: "超时由库存服务连接池耗尽引起：夜间对账任务提前启动，占用了 60% 的连接。建议把对账改到 02:00 后执行，并把连接池上限调到 80。",
  artifacts: [
    { name: "排查报告", category: "document", format: "markdown", content: report },
    { name: "处置建议", category: "document", format: "markdown", content: actions },
    { name: "超时请求统计", category: "data", format: "csv", content: metrics },
  ],
  usage: { toolCalls: 6, tokens: 18_342 },
};

const statusMeta = { succeeded: { label: "已完成", color: "green" as const }, failed: { label: "失败", color: "red" as const }, running: { label: "运行中", color: "blue" as const } };
const categoryMeta: Record<ArtifactCategory, { label: string; className: string }> = {
  document: { label: "文档", className: "bg-fg-blue-50 text-fg-blue-700" },
  code: { label: "代码", className: "bg-fg-violet-50 text-fg-violet-700" },
  data: { label: "数据", className: "bg-fg-yellow-50 text-fg-yellow-800" },
  image: { label: "图片", className: "bg-fg-cyan-50 text-fg-cyan-700" },
};

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function byteSize(content: string) {
  const bytes = new TextEncoder().encode(content).length;
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

function lineCount(content: string) {
  return content.trimEnd().split("\n").length;
}

function download(artifact: TaskArtifact) {
  const url = URL.createObjectURL(new Blob([artifact.content], { type: artifact.format === "csv" ? "text/csv" : "text/markdown" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${artifact.name}.${artifact.format === "csv" ? "csv" : "md"}`;
  link.click();
  URL.revokeObjectURL(url);
}

function ArtifactList({ artifacts }: { artifacts: TaskArtifact[] }) {
  const [preview, setPreview] = useState<TaskArtifact | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const groups = (Object.keys(categoryMeta) as ArtifactCategory[]).map(category => ({ category, items: artifacts.filter(item => item.category === category) })).filter(group => group.items.length);

  async function copy(artifact: TaskArtifact) {
    await navigator.clipboard?.writeText(artifact.content).catch(() => undefined);
    setCopied(artifact.name);
  }

  return <div className="flex flex-col gap-5">
    {copied ? <div className="rounded-xl border border-fg-green-200 bg-fg-green-50 px-3 py-2 text-xs text-fg-green-800">已复制「{copied}」的全文</div> : null}
    {groups.map(group => <div key={group.category} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryMeta[group.category].className}`}>{categoryMeta[group.category].label}</span>
        <span className="text-xs text-fg-grey-500">{group.items.length} 个</span>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {group.items.map(artifact => <li key={artifact.name} className="flex w-full min-w-0 flex-col rounded-2xl border border-fg-grey-200 bg-fg-grey-50 p-4">
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-0.5 shrink-0 text-fg-grey-500" aria-hidden><DocumentTextLinear size={18} /></span>
            <div className="min-w-0">
              <div className="truncate font-medium text-fg-black">{artifact.name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-fg-grey-500">
                <StatusBadge label={artifact.format === "markdown" ? "Markdown" : artifact.format.toUpperCase()} color="grey" />
                <span>{byteSize(artifact.content)}</span>
                <span>{lineCount(artifact.content)} 行</span>
              </div>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-xs leading-5 text-fg-grey-600">{artifact.content.replace(/[#|*-]/g, " ").replace(/\s+/g, " ").trim()}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button color="blue" size="sm" onClick={() => setPreview(artifact)}>预览</Button>
            <Button color="blue" variant="secondary" size="sm" onClick={() => download(artifact)}>下载</Button>
            <Button color="blue" variant="tertiary" size="sm" onClick={() => void copy(artifact)}>复制</Button>
          </div>
        </li>)}
      </ul>
    </div>)}
    <Modal open={preview !== null} onOpenChange={open => { if (!open) setPreview(null); }} title={preview?.name ?? "产物"} width="w-[min(92vw,760px)]">
      {preview ? <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg-grey-500">
          <span>{preview.format === "markdown" ? "Markdown" : preview.format.toUpperCase()}</span><span>·</span><span>{byteSize(preview.content)}</span><span>·</span><span>{lineCount(preview.content)} 行</span>
          <div className="ml-auto flex gap-2">
            <Button color="blue" variant="secondary" size="sm" onClick={() => download(preview)}>下载</Button>
            <Button color="blue" variant="tertiary" size="sm" onClick={() => void copy(preview)}>复制</Button>
          </div>
        </div>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-fg-grey-50 p-4 font-mono text-xs leading-6 text-fg-grey-900">{preview.content}</pre>
      </div> : null}
    </Modal>
  </div>;
}

export interface TaskRunDetailProps {
  task?: TaskRunDetailData;
  className?: string;
}

export function TaskRunDetail({ task = defaultTaskRun, className = "" }: TaskRunDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const meta = statusMeta[task.status];
  const rows = [["自主智能体", task.agent], ["人工确认", task.approval], ["创建", task.createdAt], ["更新", task.updatedAt]];

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-6 ${className}`}>
    <div className="flex flex-col gap-3">
      <PageTitleToolbar
        title={task.goal}
        breadcrumbs={<Breadcrumbs color="blue" className="flex-wrap gap-y-1" items={[{ label: "工作台", href: "#overview" }, { label: "智能体", href: "#apps" }, { label: "自主智能体", href: "#autonomous" }, { label: task.goal }]} />}
        askAi={{ placeholder: "问问这个任务…", suggestions: ["总结一下根因", "处置建议谁来跟进？"], onSend: () => "根因是库存服务连接池耗尽：夜间对账任务提前启动占用了 60% 连接。处置建议里 P0 由陈思远在 11/10 前调整对账时间。" }}
        actions={<div className="flex flex-wrap gap-2">
          <Button color="blue" variant="secondary" onClick={() => setConfirmDelete(true)}>删除</Button>
          <Button color="blue" variant="secondary">返回</Button>
        </div>}
        className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0 [&>div:first-child]:sm:min-w-48 [&>div:last-child]:sm:flex-wrap"
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-fg-grey-700">任务状态</span>
        <StatusBadge label={meta.label} color={meta.color} />
        <span className="text-xs text-fg-grey-500">{task.id}</span>
        {task.sourceItem ? <a href="#work-items" className="text-sm text-fg-blue-600 hover:underline">来源任务 {task.sourceItem}</a> : null}
        {task.sourceProject ? <a href="#projects" className="text-sm text-fg-blue-600 hover:underline">来源项目 {task.sourceProject}</a> : null}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <section className="rounded-2xl border border-fg-grey-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-fg-black">概要</h2>
        <dl className="flex flex-col gap-2 text-sm">
          {rows.map(([label, value]) => <div key={label} className="flex justify-between gap-2"><dt className="text-fg-grey-600">{label}</dt><dd className="text-right text-fg-black">{value}</dd></div>)}
        </dl>
        {task.knowledge.length ? <>
          <h3 className="mb-2 mt-5 text-sm font-semibold text-fg-black">知识库授权</h3>
          <ul className="flex flex-col gap-1 text-sm text-fg-grey-700">
            {task.knowledge.map(name => <li key={name}>{name}<span className="ml-1 text-xs text-fg-grey-500">只读</span></li>)}
          </ul>
        </> : null}
      </section>
      <section className="rounded-2xl border border-fg-grey-200 bg-white p-4 lg:col-span-2">
        <h2 className="mb-3 text-sm font-semibold text-fg-black">执行过程</h2>
        <ol className="flex flex-col gap-3">
          {task.events.map(event => <li key={event.id} className="flex gap-3 text-sm">
            <span className="w-36 shrink-0 text-xs text-fg-grey-500">{event.at}</span>
            <span className="min-w-0"><span className="font-medium text-fg-black">{event.type}</span><span className="mt-0.5 block text-fg-grey-700">{event.message}</span></span>
          </li>)}
        </ol>
      </section>
    </div>

    <section className="rounded-2xl border border-fg-grey-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-fg-black">结果与产物</h2>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-1 text-xs font-medium text-fg-grey-600">摘要</h3>
          <p className="text-sm leading-6 text-fg-black">{task.summary}</p>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-xs font-medium text-fg-grey-600">产物</h3>
            <span className="text-xs text-fg-grey-500">按类型分组 · 打开独立预览页阅读全文</span>
          </div>
          <ArtifactList artifacts={task.artifacts} />
        </div>
        <p className="text-xs text-fg-grey-500">用量：tool_calls={task.usage.toolCalls} · tokens={task.usage.tokens}</p>
      </div>
    </section>

    {confirmDelete ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <ConfirmationDialog title="删除任务？" description={`确定删除「${task.goal}」？记录与产物将移除且不可恢复。`} color="red" confirmLabel="删除" cancelLabel="取消" onCancel={() => setConfirmDelete(false)} onConfirm={() => setConfirmDelete(false)} />
    </div> : null}
  </div>;
}
