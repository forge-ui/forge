"use client";

import { useState, type ReactNode } from "react";
import { AnchoredPanel } from "../../../internal/anchored-panel";
import { AltArrowDownLinear, PlusLinear, StarsLinear } from "../../../icons";
import { AgentCard, SoftBadge, iconAction, type AgentTone } from "../../../internal/agent-kit";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { formatCost, formatDuration, formatTokens, pick, type AgentLocale } from "./agent-utils";

const popover = "forge-fade-up z-30 rounded-2xl bg-background p-4 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200";

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-xs text-fg-grey-500">{label}</span>
      <span className="text-base font-semibold tabular-nums tracking-fg text-fg-black">{value}</span>
    </div>
  );
}

/* ───────────────────────── ContextUsage ───────────────────────── */

export type ContextSegmentKind = "system" | "tools" | "memory" | "files" | "chat" | "other";

export type ContextSegment = {
  id: string;
  label: string;
  tokens: number;
  kind?: ContextSegmentKind;
  /** Files and memories can be taken out of the context. */
  removable?: boolean;
};

export type ContextUsageProps = {
  segments: ContextSegment[];
  /** The model's context window in tokens. */
  limit: number;
  /** Spend so far in this conversation. */
  cost?: number;
  currency?: string;
  onRemove?: (id: string) => void;
  /** Summarise older turns to free room. */
  onCompact?: () => void;
  /** inline: a small ring for the composer toolbar that opens the breakdown. */
  variant?: "card" | "inline";
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const KIND_COLOR: Record<ContextSegmentKind, string> = {
  system: "bg-fg-grey-400",
  tools: "bg-fg-green-400",
  memory: "bg-fg-cyan-400",
  files: "bg-fg-yellow-400",
  chat: "bg-accent",
  other: "bg-fg-grey-300",
};

const KIND_LABEL: Record<ContextSegmentKind, { zh: string; en: string }> = {
  system: { zh: "系统", en: "System" },
  tools: { zh: "工具", en: "Tools" },
  memory: { zh: "记忆", en: "Memory" },
  files: { zh: "文件", en: "Files" },
  chat: { zh: "对话", en: "Chat" },
  other: { zh: "其他", en: "Other" },
};

function usageTone(ratio: number): AgentTone {
  return ratio > 0.9 ? "red" : ratio > 0.7 ? "yellow" : "blue";
}

function ContextBody({ segments, limit, cost, currency, onRemove, onCompact, locale }: Omit<ContextUsageProps, "variant" | "className" | "size"> & { locale: AgentLocale }) {
  const used = segments.reduce((sum, segment) => sum + segment.tokens, 0);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-fg-grey-100" aria-hidden="true">
        {segments.map(segment => <span key={segment.id} className={cn("h-full border-r-2 border-background transition-[width] duration-500 last:border-r-0", KIND_COLOR[segment.kind ?? "other"])} style={{ width: `${(segment.tokens / Math.max(limit, used)) * 100}%` }} />)}
      </div>
      <ul className="flex flex-col gap-0.5">
        {segments.map(segment => (
          <li key={segment.id} className="group flex min-h-8 min-w-0 items-center gap-2.5 rounded-lg px-1.5 hover:bg-fg-grey-50">
            <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-[3px]", KIND_COLOR[segment.kind ?? "other"])} />
            <span className="min-w-0 flex-1 truncate text-sm text-fg-black">{segment.label}</span>
            <span className="shrink-0 text-xs text-fg-grey-500">{pick(locale, KIND_LABEL[segment.kind ?? "other"].zh, KIND_LABEL[segment.kind ?? "other"].en)}</span>
            <span className="w-12 shrink-0 text-right text-xs tabular-nums text-fg-grey-700">{formatTokens(segment.tokens)}</span>
            {onRemove && (segment.removable
              ? <button type="button" aria-label={pick(locale, `移出上下文：${segment.label}`, `Remove ${segment.label}`)} onClick={() => onRemove(segment.id)} className={cn(iconAction, "size-6 opacity-0 focus:opacity-100 group-hover:opacity-100")}><PlusLinear size={14} className="rotate-45" /></button>
              : <span className="size-6 shrink-0" />)}
          </li>
        ))}
      </ul>
      {(cost !== undefined || onCompact) && (
        <div className="flex items-center justify-between gap-3 border-t border-fg-grey-200 pt-3">
          {cost !== undefined ? <span className="text-xs text-fg-grey-500">{pick(locale, "本次对话花费", "Spent in this chat")} <span className="font-medium tabular-nums text-fg-black">{formatCost(cost, currency)}</span></span> : <span />}
          {onCompact && <Button size="sm" variant="tertiary" color="grey" onClick={onCompact}>{pick(locale, "压缩早期对话", "Compact")}</Button>}
        </div>
      )}
    </div>
  );
}

/** What fills the model's context: a bar by part, files you can take out, and compacting older turns. */
export function ContextUsage({ variant = "card", locale = "zh", size = "md", className, ...props }: ContextUsageProps) {
  const [open, setOpen] = useState(false);
  const used = props.segments.reduce((sum, segment) => sum + segment.tokens, 0);
  const ratio = Math.min(1, used / Math.max(1, props.limit));
  const percent = Math.round(ratio * 100);
  const summary = `${formatTokens(used)} / ${formatTokens(props.limit)}`;

  if (variant === "card") {
    return (
      <AgentCard size={size} className={className} title={pick(locale, "上下文", "Context")} subtitle={summary} action={<SoftBadge tone={usageTone(ratio)}>{pick(locale, `已用 ${percent}%`, `${percent}% used`)}</SoftBadge>}>
        <ContextBody {...props} locale={locale} />
      </AgentCard>
    );
  }

  const tone = ratio > 0.9 ? "var(--fg-red)" : ratio > 0.7 ? "var(--fg-yellow-500)" : "var(--accent)";
  return (
    <div className={cn("relative inline-flex tracking-fg", className)}>
      <AnchoredPanel open={open} onOpenChange={setOpen} side="top" align="start" label={pick(locale, "上下文", "Context")} trigger={
      <button type="button" aria-label={pick(locale, `上下文已用 ${percent}%`, `Context ${percent}% used`)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium tabular-nums text-fg-grey-700 hover:bg-fg-grey-100">
        <span aria-hidden="true" className="size-4 rounded-full" style={{ background: `conic-gradient(${tone} ${ratio * 360}deg, var(--fg-grey-200) 0deg)`, mask: "radial-gradient(circle, transparent 4.5px, black 5px)", WebkitMask: "radial-gradient(circle, transparent 4.5px, black 5px)" }} />
        {percent}%
      </button>}>
        <div className={cn(popover, "w-80 max-w-[calc(100vw-2rem)]")}>
          <div className="mb-3 flex items-baseline justify-between"><span className="text-sm font-medium text-fg-black">{pick(locale, "上下文", "Context")}</span><span className="text-xs tabular-nums text-fg-grey-500">{summary}</span></div>
          <ContextBody {...props} locale={locale} />
        </div>
      </AnchoredPanel>
    </div>
  );
}

/* ───────────────────────── TraceWaterfall ───────────────────────── */

export type TraceSpan = {
  id: string;
  name: string;
  kind: "llm" | "tool" | "agent" | "other";
  /** Milliseconds from the start of the run. */
  start: number;
  /** Milliseconds; omit while running. */
  duration?: number;
  depth?: number;
  tokens?: number;
  cost?: number;
  status?: "ok" | "error" | "running";
};

export type TraceWaterfallProps = {
  spans: TraceSpan[];
  /** Milliseconds since the start, for spans still running. */
  now?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  title?: ReactNode;
  currency?: string;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const SPAN_COLOR: Record<TraceSpan["kind"], string> = { llm: "bg-fg-green-400", tool: "bg-fg-cyan-400", agent: "bg-accent", other: "bg-fg-grey-400" };
const SPAN_LABEL: Record<TraceSpan["kind"], { zh: string; en: string }> = { llm: { zh: "模型", en: "LLM" }, tool: { zh: "工具", en: "Tool" }, agent: { zh: "子智能体", en: "Agent" }, other: { zh: "其他", en: "Other" } };

/** Where the time and money of a run go: every model call, tool call and sub-agent as a bar on one timeline. */
export function TraceWaterfall({ spans, now, selectedId, onSelect, title, currency, locale = "zh", size = "md", className }: TraceWaterfallProps) {
  const end = (span: TraceSpan) => span.start + (span.duration ?? Math.max(0, (now ?? span.start) - span.start));
  const total = Math.max(1, now ?? 0, ...spans.map(end));
  const tokens = spans.reduce((sum, span) => sum + (span.tokens ?? 0), 0);
  const cost = spans.reduce((sum, span) => sum + (span.cost ?? 0), 0);
  const kinds = (Object.keys(SPAN_COLOR) as TraceSpan["kind"][]).filter(kind => spans.some(span => span.kind === kind));
  return (
    <AgentCard
      size={size}
      className={className}
      title={title ?? pick(locale, "调用耗时", "Trace")}
      action={<span className="flex gap-3 text-xs text-fg-grey-700">{kinds.map(kind => <span key={kind} className="flex items-center gap-1.5"><span className={cn("size-2 rounded-[3px]", SPAN_COLOR[kind])} />{pick(locale, SPAN_LABEL[kind].zh, SPAN_LABEL[kind].en)}</span>)}</span>}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-fg-grey-50 px-4 py-3">
          <Stat label={pick(locale, "总耗时", "Total")} value={formatDuration(total, locale)} />
          <Stat label="Tokens" value={tokens ? formatTokens(tokens) : "—"} />
          <Stat label={pick(locale, "花费", "Cost")} value={cost ? formatCost(cost, currency) : "—"} />
        </div>
        <ul className="flex flex-col">
          {spans.map(span => {
            const left = (span.start / total) * 100;
            const width = Math.max(0.8, ((end(span) - span.start) / total) * 100);
            return (
              <li key={span.id}>
                <button type="button" aria-pressed={selectedId === span.id} onClick={() => onSelect?.(span.id)} className="grid w-full grid-cols-[minmax(0,9rem)_minmax(0,1fr)_3.5rem] items-center gap-3 rounded-lg px-1.5 py-1.5 text-left hover:bg-fg-grey-50 aria-pressed:bg-accent-soft">
                  <span className={cn("truncate text-sm", span.status === "error" ? "text-fg-red" : "text-fg-black", span.kind === "tool" && "font-mono text-xs")} style={{ paddingLeft: (span.depth ?? 0) * 14 }}>{span.name}</span>
                  <span className="relative h-2.5 rounded-full bg-fg-grey-100">
                    <span className={cn("absolute inset-y-0 rounded-full transition-[width] duration-500", span.status === "error" ? "bg-fg-red" : SPAN_COLOR[span.kind], span.status === "running" && "forge-pulse-dot")} style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }} />
                  </span>
                  <span className="text-right text-xs tabular-nums text-fg-grey-500">{span.duration !== undefined ? formatDuration(span.duration, locale) : "…"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </AgentCard>
  );
}

/* ───────────────────────── AgentTree ───────────────────────── */

export type TreeAgentStatus = "running" | "waiting" | "done" | "failed" | "idle";

export type TreeAgent = {
  id: string;
  name: string;
  role?: string;
  status: TreeAgentStatus;
  /** What it is doing right now. */
  activity?: string;
  cost?: number;
  duration?: number;
  children?: TreeAgent[];
};

export type AgentTreeProps = {
  root: TreeAgent;
  selectedId?: string;
  onSelect?: (id: string) => void;
  currency?: string;
  locale?: AgentLocale;
  className?: string;
};

const TREE_STATUS: Record<TreeAgentStatus, { zh: string; en: string; tone: AgentTone }> = {
  running: { zh: "运行中", en: "Running", tone: "blue" },
  waiting: { zh: "等你", en: "Needs you", tone: "yellow" },
  done: { zh: "完成", en: "Done", tone: "green" },
  failed: { zh: "失败", en: "Failed", tone: "red" },
  idle: { zh: "待命", en: "Idle", tone: "grey" },
};

const branchCost = (agent: TreeAgent): number => (agent.cost ?? 0) + (agent.children ?? []).reduce((sum, child) => sum + branchCost(child), 0);

function TreeNode({ agent, root, selectedId, onSelect, currency, locale }: { agent: TreeAgent; root?: boolean; selectedId?: string; onSelect?: (id: string) => void; currency?: string; locale: AgentLocale }) {
  const [folded, setFolded] = useState(false);
  const children = agent.children ?? [];
  const total = branchCost(agent);
  const selected = selectedId === agent.id;
  return (
    <li className={cn("@container relative flex flex-col", !root && "before:absolute before:-left-4 before:top-6 before:h-px before:w-4 before:bg-fg-grey-200")}>
      <div className={cn("flex min-w-0 items-center gap-3 rounded-2xl bg-background px-3 py-2.5 outline outline-1 outline-offset-[-1px] transition-colors", selected ? "outline-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "outline-fg-grey-200 hover:outline-fg-grey-300")}>
        <button type="button" onClick={() => onSelect?.(agent.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl", root ? "bg-accent text-accent-foreground" : "bg-accent-soft text-accent")}><StarsLinear size={16} /></span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex min-w-0 items-baseline gap-2"><span className="min-w-0 truncate text-sm font-medium text-fg-black">{agent.name}</span>{agent.role && <span className="hidden shrink-0 text-xs text-fg-grey-500 @[22rem]:inline">{agent.role}</span>}</span>
            {agent.activity && <span key={agent.activity} className={cn("forge-fade-up truncate text-xs text-fg-grey-700", agent.status === "running" && "forge-text-shimmer")}>{agent.activity}</span>}
          </span>
          <span className="flex shrink-0 flex-col items-end gap-0.5">
            <SoftBadge tone={TREE_STATUS[agent.status].tone}>{pick(locale, TREE_STATUS[agent.status].zh, TREE_STATUS[agent.status].en)}</SoftBadge>
            {(total > 0 || agent.duration !== undefined) && (
              <span className="text-xs tabular-nums text-fg-grey-500" title={children.length ? pick(locale, "含子智能体", "Including sub-agents") : undefined}>
                {[total > 0 ? formatCost(total, currency) : "", agent.duration !== undefined ? formatDuration(agent.duration, locale) : ""].filter(Boolean).join(" · ")}
              </span>
            )}
          </span>
        </button>
        {children.length > 0 && (
          <button type="button" aria-label={folded ? pick(locale, "展开", "Expand") : pick(locale, "折叠", "Collapse")} aria-expanded={!folded} onClick={() => setFolded(value => !value)} className={iconAction}>
            <AltArrowDownLinear size={14} className={cn("transition-transform", folded && "-rotate-90")} />
          </button>
        )}
      </div>
      {children.length > 0 && !folded && (
        <ul className="relative ml-7 flex flex-col gap-2 pl-4 pt-2 before:absolute before:bottom-6 before:left-0 before:top-0 before:w-px before:bg-fg-grey-200">
          {children.map(child => <TreeNode key={child.id} agent={child} selectedId={selectedId} onSelect={onSelect} currency={currency} locale={locale} />)}
        </ul>
      )}
    </li>
  );
}

/** Who started whom: an orchestrator and its sub-agents as a live tree, with status, time and cost rolling up each branch. */
export function AgentTree({ root, selectedId, onSelect, currency, locale = "zh", className }: AgentTreeProps) {
  return <ul aria-label={pick(locale, "智能体", "Agents")} className={cn("flex flex-col tracking-fg", className)}><TreeNode root agent={root} selectedId={selectedId} onSelect={onSelect} currency={currency} locale={locale} /></ul>;
}

/* ───────────────────────── AgentLanes ───────────────────────── */

export type LaneBlock = {
  id: string;
  laneId: string;
  title: string;
  /** Milliseconds from the start of the window. */
  start: number;
  /** Omit while it is still running; it then grows to `now`. */
  end?: number;
  status: "running" | "waiting" | "done" | "failed";
};

export type AgentLanesProps = {
  lanes: { id: string; name: string; icon?: ReactNode }[];
  blocks: LaneBlock[];
  /** Milliseconds since the start of the window. */
  now: number;
  onSelect?: (id: string) => void;
  title?: ReactNode;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const LANE_STYLE: Record<LaneBlock["status"], string> = {
  running: "bg-accent-soft text-accent outline-accent",
  waiting: "bg-fg-yellow-50 text-fg-yellow-700 outline-fg-yellow-200",
  done: "bg-fg-grey-50 text-fg-grey-700 outline-fg-grey-200",
  failed: "bg-fg-red-50 text-fg-red outline-fg-red-200",
};

/** Where every agent is right now: one lane per agent, tasks as blocks growing into "now". */
export function AgentLanes({ lanes, blocks, now, onSelect, title, locale = "zh", size = "md", className }: AgentLanesProps) {
  const span = Math.max(1, now, ...blocks.map(block => block.end ?? now));
  const position = (value: number) => `${(value / span) * 100}%`;
  return (
    <AgentCard size={size} className={className} title={title ?? pick(locale, "协作时间线", "Timeline")}>
      <div className="flex flex-col gap-2">
        {lanes.map(lane => (
          <div key={lane.id} className="flex items-center gap-3">
            <span className="flex w-24 shrink-0 items-center gap-2 text-sm font-medium text-fg-black">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">{lane.icon ?? <StarsLinear size={12} />}</span>
              <span className="truncate">{lane.name}</span>
            </span>
            <div className="relative h-8 min-w-0 flex-1 rounded-lg bg-fg-grey-50">
              {blocks.filter(block => block.laneId === lane.id).map(block => (
                <button
                  key={block.id}
                  type="button"
                  title={block.title}
                  onClick={() => onSelect?.(block.id)}
                  className={cn("absolute inset-y-1 truncate rounded-md px-2 text-left text-xs font-medium outline outline-1 outline-offset-[-1px] transition-[width] duration-500", LANE_STYLE[block.status])}
                  style={{ left: position(block.start), width: `max(1.5rem, ${position((block.end ?? now) - block.start)})` }}
                >
                  {block.title}
                </button>
              ))}
              <span aria-hidden="true" className="absolute -inset-y-1 w-px bg-fg-red" style={{ left: position(now) }} />
            </div>
          </div>
        ))}
        <div className="flex gap-3 text-xs text-fg-grey-500">
          <span className="w-24 shrink-0" />
          <span className="flex flex-1 justify-between tabular-nums"><span>0</span><span>{formatDuration(span / 2, locale)}</span><span className="text-fg-red">{pick(locale, "现在", "Now")}</span></span>
        </div>
      </div>
    </AgentCard>
  );
}
