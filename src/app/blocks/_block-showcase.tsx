"use client";

import { useState, type ReactNode } from "react";
import { ButtonGroup } from "@forge-ui-official/core";
import { PreviewFrame } from "./_preview-frame";
import { CopyButton } from "./_copy-button";

export function CodePanel({ source, label = "源码" }: { source: string; label?: string }) {
  return <div className="overflow-hidden rounded-2xl border border-fg-grey-200 bg-white"><div className="flex items-center justify-between gap-3 border-b border-fg-grey-200 px-4 py-3"><span className="text-sm font-medium text-fg-grey-700">{label}</span><CopyButton value={source} label={`复制${label}`} /></div><div className="fg-scrollbar-thin max-h-[640px] overflow-auto bg-fg-grey-50"><pre aria-label={label} className="w-max min-w-full py-4 font-mono text-[13px] leading-6 text-fg-grey-900"><code>{source.trimEnd().split("\n").map((line, index) => <span key={index} className="block pr-5"><span aria-hidden className="mr-4 inline-block w-12 border-r border-fg-grey-200 pr-3 text-right text-fg-grey-400 select-none">{index + 1}</span>{line || "\u00a0"}{"\n"}</span>)}</code></pre></div></div>;
}

export function BlockShowcase({ name, header }: { name: string; header: ReactNode }) {
  const [device, setDevice] = useState(0);
  return <div className="flex min-w-0 flex-col gap-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">{header}<div className="shrink-0"><ButtonGroup items={[{ label: "桌面" }, { label: "移动" }]} activeIndex={device} onChange={setDevice} ariaLabel="预览宽度" /></div></div>
    <section aria-label="页面组件预览" className="min-w-0 overflow-hidden rounded-3xl border border-fg-grey-200 bg-fg-grey-100"><PreviewFrame key={name} name={name} mobile={device === 1} /></section>
  </div>;
}
