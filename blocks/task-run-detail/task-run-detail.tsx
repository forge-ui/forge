"use client";

import { useState } from "react";
import { Button, HistoryItem, Modal, Panel, StatusBadge, StreamingAnswer, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { CopyLinear, DocumentTextLinear, DownloadMinimalisticLinear, EyeLinear } from "@forge-ui-official/core/icons";

export interface TaskArtifact {
  id: string;
  name: string;
  type: string;
  size: string;
  lines: number;
  content: string;
}

export interface TaskRunDetailData {
  id: string;
  prompt: string;
  status: { label: string; color: StatusBadgeColor };
  summary: { label: string; value: string }[];
  events: { id: string; time: string; title: string; detail: string; color: "green" | "blue" | "gray" | "red" }[];
  result: string;
  artifacts: TaskArtifact[];
  usage: string;
}

export const defaultTaskRunDetail: TaskRunDetailData = {
  id: "task-b230497d",
  prompt: "起草客户回访话术，覆盖退换货、物流延迟与发票三类场景，输出 Markdown 文档。",
  status: { label: "已完成", color: "green" },
  summary: [
    { label: "自主智能体", value: "客服助手" },
    { label: "运行时", value: "Deep Agents" },
    { label: "人工确认", value: "危险操作才问" },
    { label: "创建", value: "2026-11-09 10:52" },
    { label: "耗时", value: "2 分 18 秒" },
  ],
  events: [
    { id: "e1", time: "10:52:04", title: "已接收", detail: "运行时 Deep Agents 接收任务", color: "green" },
    { id: "e2", time: "10:52:06", title: "检索知识库", detail: "命中《售后服务规范》《物流异常处理》等 4 篇", color: "green" },
    { id: "e3", time: "10:53:41", title: "生成文档", detail: "写入 客服回访话术手册.md（15 行）", color: "green" },
    { id: "e4", time: "10:54:22", title: "已完成", detail: "任务成功，产出 1 个文档", color: "green" },
  ],
  result: "文档已完成并保存为「客服回访话术手册.md」，覆盖三类场景的开场白、核心话术、常见异议应对与结束语。",
  artifacts: [
    { id: "f1", name: "客服回访话术手册.md", type: "Markdown", size: "1.8 KB", lines: 15, content: "## 退换货回访\n\n**开场白**：您好，我是知行科技的客服小知，想跟您确认一下退换货的处理进度。\n\n**核心话术**：我们已收到您寄回的商品，退款会在 1–3 个工作日原路返回。\n\n## 物流延迟回访\n\n**开场白**：非常抱歉让您久等了，您的包裹因天气原因延迟。\n\n**常见异议**：如客户要求补偿，可提供 20 元无门槛券，不承诺具体到货时间。\n\n## 发票回访\n\n电子发票已发送至您的邮箱，如需纸质发票请告知寄送地址。" },
  ],
  usage: "工具调用 4 次 · 输入 12.6k / 输出 2.1k tokens · ¥0.21",
};

export interface TaskRunDetailProps {
  task?: TaskRunDetailData;
  onDownload?: (artifact: TaskArtifact) => void;
  className?: string;
}

export function TaskRunDetail({ task = defaultTaskRunDetail, onDownload, className }: TaskRunDetailProps) {
  const [previewing, setPreviewing] = useState<TaskArtifact | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(artifact: TaskArtifact) {
    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(artifact.id);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex flex-col gap-2"><div className="flex flex-wrap items-center gap-2"><span className="text-sm text-fg-grey-700">任务状态</span><StatusBadge {...task.status} variant="soft" /><span className="font-mono text-xs text-fg-grey-500">{task.id}</span></div><p className="text-lg font-semibold leading-8 text-fg-black">{task.prompt}</p></div>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Panel variant="template" title="概要">
        <dl className="flex flex-col gap-3 text-sm">{task.summary.map(item => <div key={item.label} className="flex justify-between gap-4"><dt className="text-fg-grey-700">{item.label}</dt><dd className="text-right font-medium text-fg-black">{item.value}</dd></div>)}</dl>
      </Panel>
      <Panel variant="template" title="执行过程">
        <div className="flex flex-col gap-1">{task.events.map((event, index) => <HistoryItem key={event.id} variant="regular" color={event.color} title={`${event.time}  ${event.title}`} description={event.detail} showConnector={index < task.events.length - 1} />)}</div>
      </Panel>
    </div>
    <Panel variant="template" title="结果与产物">
      <div><p className="text-xs text-fg-grey-700">摘要</p><p className="mt-1 text-sm leading-6 text-fg-black">{task.result}</p></div>
      <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">{task.artifacts.map(artifact => <li key={artifact.id} className="flex flex-col gap-3 rounded-card border border-fg-grey-200 bg-fg-grey-50 p-4">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white text-fg-blue"><DocumentTextLinear size={20} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{artifact.name}</p><p className="text-xs text-fg-grey-700">{artifact.type} · {artifact.size} · {artifact.lines} 行</p></div></div>
        <p className="line-clamp-3 text-xs leading-5 text-fg-grey-700">{artifact.content.replace(/[#*]/g, "")}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" iconLeft={<EyeLinear size={16} />} onClick={() => setPreviewing(artifact)}>预览</Button>
          <Button size="sm" variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => onDownload?.(artifact)}>下载</Button>
          <Button size="sm" variant="tertiary" iconLeft={<CopyLinear size={16} />} onClick={() => copy(artifact)}>{copied === artifact.id ? "已复制" : "复制"}</Button>
        </div>
      </li>)}</ul>
      <p className="text-xs text-fg-grey-500">用量：{task.usage}</p>
    </Panel>
    <Modal open={previewing !== null} onOpenChange={open => { if (!open) setPreviewing(null); }} title={previewing?.name ?? "产物预览"}>
      {previewing && <StreamingAnswer text={previewing.content} format="markdown" streaming />}
    </Modal>
  </section>;
}
