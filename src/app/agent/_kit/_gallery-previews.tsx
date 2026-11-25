"use client";

import type { ReactNode } from "react";
import { AgentMessage, AgentWelcome, CitedAnswer, Reasoning, StreamingAnswer, ThinkingIndicator, ToolCall, ToolCallGroup } from "@aideui/core";
import { StarsLinear } from "@aideui/core/icons";

// Gallery thumbnails drawn at card width, for components whose full demo does not read when
// shrunk: a panel that opens on a button, a block that starts folded, a stream that waits for a click.
export const GALLERY_PREVIEWS: Partial<Record<string, () => ReactNode>> = {
  "agent-panel": () => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-fg-grey-200 bg-background shadow-[0_8px_24px_-14px_rgba(77,84,100,0.35)]">
      <div className="flex h-9 items-center gap-1.5 border-b border-fg-grey-200 px-3 text-xs font-semibold text-fg-black"><StarsLinear size={14} color="var(--accent)" />Forge Agent</div>
      <div className="flex flex-col gap-2 p-3 text-xs">
        <AgentMessage role="user">本周退款最多的是哪款？</AgentMessage>
        <p className="text-fg-black">秋季连帽外套，本周退款 18 笔，主要是尺码偏小。</p>
      </div>
    </div>
  ),
  "tool-call": () => (
    <ToolCallGroup count={3} status="error" defaultOpen>
      <ToolCall variant="row" size="sm" name="search_orders" summary="本月退款" status="success" duration={1240} />
      <ToolCall variant="row" size="sm" name="get_customer" summary="C-20931" status="success" duration={620} />
      <ToolCall variant="row" size="sm" name="export_excel" summary="退款明细" status="error" openOnError={false} />
    </ToolCallGroup>
  ),
  reasoning: () => (
    <Reasoning
      size="sm"
      status="done"
      duration={3200}
      open
      steps={[
        { id: "1", label: "读取本月退款单", status: "done" },
        { id: "2", label: "按原因归类", status: "done", detail: "尺码不符 41%，质量问题 23%" },
        { id: "3", label: "对比上月", status: "done" },
      ]}
    />
  ),
  "thinking-indicator": () => (
    <div className="flex flex-col gap-3">
      <AgentMessage role="user">华东区本周退款怎么样？</AgentMessage>
      <ThinkingIndicator label="查询订单" size="sm" />
    </div>
  ),
  "streaming-answer": () => (
    <StreamingAnswer size="sm" format="markdown" text={"开心果口味增长最快，本月销量提升了 **23%**，周末销量占一半以上。"} sources={[{ name: "销量数据", domain: "scoopdata.io" }, { name: "趋势指标", domain: "trends.google.com" }]} />
  ),
  "cited-answer": () => (
    <CitedAnswer size="sm" defaultSourcesOpen={false} text="本月退款 128 笔，比上月多 18%[1]。多出来的主要是尺码不符，占 41%[2]。" sources={[{ id: 1, title: "11 月退款单汇总", domain: "订单中心" }, { id: 2, title: "客服工单分类", domain: "客服系统" }]} />
  ),
  "agent-welcome": () => (
    <AgentWelcome size="sm" title="你好，我是运营助手" description="能查订单和退款、生成报表，改数据前都会先问你。" />
  ),
};
