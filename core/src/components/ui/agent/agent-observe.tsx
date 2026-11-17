"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AltArrowDownLinear, AltArrowRightLinear, PlusLinear, StarsLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { formatCost, formatDuration, formatTokens, pick, type AgentLocale } from "./agent-utils";

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
  className?: string;
};

const KIND_COLOR: Record<ContextSegmentKind, string> = {
  system: "bg-fg-grey-500",
  tools: "bg-fg-violet-400",
  memory: "bg-fg-cyan-400",
  files: "bg-fg-yellow-400",
  chat: "bg-accent",
  other: "bg-fg-grey-300",
};

const KIND_LABEL: Record<ContextSegmentKind, { zh: string; en: string }> = {
  system: { zh: "系统提示", en: "System" },
  tools: { zh: "工具", en: "Tools" },
  memory: { zh: "记忆", en: "Memory" },
  files: { zh: "文件", en: "Files" },
  chat: { zh: "对话", en: "Chat" },
  other: { zh: "其他", en: "Other" },
};

function ContextCard({ segments, limit, cost, currency, onRemove, onCompact, locale }: Omit<ContextUsageProps, "variant" | "className"> & { locale: AgentLocale }) {
  const used = segments.reduce((sum, segment) => sum + segment.tokens, 0);
  const ratio = Math.min(1, used / Math.max(1, limit));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-semibold text-fg-black">{pick(locale, "上下文", "Context")}</span>
        <span className="tabular-nums text-xs text-fg-grey-700">{formatTokens(used)} / {formatTokens(limit)} · {Math.round(ratio * 100)}%</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-fg-grey-100" aria-hidden="true">
        {segments.map(segment => <span key={segment.id} className={cn("h-full border-r border-background last:border-r-0", KIND_COLOR[segment.kind ?? "other"])} style={{ width: `${(segment.tokens / Math.max(limit, used)) * 100}%` }} />)}
      </div>
      <ul className="flex flex-col gap-1 text-xs">
        {segments.map(segment => (
          <li key={segment.id} className="group flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-sm", KIND_COLOR[segment.kind ?? "other"])} />
            <span className="min-w-0 flex-1 truncate text-fg-grey-900">{segment.label}<span className="ml-1 text-fg-grey-500">{pick(locale, KIND_LABEL[segment.kind ?? "other"].zh, KIND_LABEL[segment.kind ?? "other"].en)}</span></span>
            <span className="shrink-0 tabular-nums text-fg-grey-700">{formatTokens(segment.tokens)}</span>
            {segment.removable && onRemove && <button type="button" aria-label={pick(locale, `移出上下文：${segment.label}`, `Remove ${segment.label}`)} onClick={() => onRemove(segment.id)} className="flex size-5 shrink-0 items-center justify-center rounded text-fg-grey-500 opacity-0 hover:bg-fg-grey-100 hover:text-fg-black focus:opacity-100 group-hover:opacity-100"><PlusLinear size={12} className="rotate-45" /></button>}
          </li>
        ))}
      </ul>
      {(cost !== undefined || onCompact) && (
        <div className="flex items-center justify-between gap-2 border-t border-fg-grey-100 pt-2 text-xs">
          {cost !== undefined ? <span className="text-fg-grey-700">{pick(locale, "本次对话花费", "Spent in this chat")} <span className="tabular-nums text-fg-black">{formatCost(cost, currency)}</span></span> : <span />}
          {onCompact && <Button size="sm" variant="tertiary" color="grey" onClick={onCompact}>{pick(locale, "压缩早期对话", "Compact")}</Button>}
        </div>
      )}
    </div>
  );
}

/** What fills the model's context: a bar by part, files you can take out, and compacting older turns. */
export function ContextUsage({ variant = "card", locale = "zh", className, ...props }: ContextUsageProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  if (variant === "card") return <div className={cn("rounded-xl border border-fg-grey-200 bg-background p-3 tracking-fg", className)}><ContextCard {...props} locale={locale} /></div>;

  const used = props.segments.reduce((sum, segment) => sum + segment.tokens, 0);
  const ratio = Math.min(1, used / Math.max(1, props.limit));
  const tone = ratio > 0.9 ? "var(--fg-red)" : ratio > 0.7 ? "var(--fg-yellow-500)" : "var(--accent)";
  return (
    <div ref={root} className={cn("relative inline-flex tracking-fg", className)}>
      <button type="button" aria-expanded={open} aria-label={pick(locale, `上下文已用 ${Math.round(ratio * 100)}%`, `Context ${Math.round(ratio * 100)}% used`)} onClick={() => setOpen(value => !value)} className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs tabular-nums text-fg-grey-700 hover:bg-fg-grey-100">
        <span aria-hidden="true" className="size-3.5 rounded-full" style={{ background: `conic-gradient(${tone} ${ratio * 360}deg, var(--fg-grey-200) 0deg)`, mask: "radial-gradient(circle, transparent 3.5px, black 4px)", WebkitMask: "radial-gradient(circle, transparent 3.5px, black 4px)" }} />
        {Math.round(ratio * 100)}%
      </button>
      {open && <div className="absolute bottom-full left-0 z-30 mb-1.5 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-fg-grey-200 bg-background p-3 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)]"><ContextCard {...props} locale={locale} /></div>}
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
  currency?: string;
  locale?: AgentLocale;
  className?: string;
};

const SPAN_COLOR: Record<TraceSpan["kind"], string> = { llm: "bg-fg-violet-400", tool: "bg-fg-cyan-400", agent: "bg-accent", other: "bg-fg-grey-400" };
const SPAN_LABEL: Record<TraceSpan["kind"], { zh: string; en: string }> = { llm: { zh: "模型", en: "LLM" }, tool: { zh: "工具", en: "Tool" }, agent: { zh: "子智能体", en: "Agent" }, other: { zh: "其他", en: "Other" } };

/** Where the time and money of a run go: every model call, tool call and sub-agent as a bar on one timeline. */
export function TraceWaterfall({ spans, now, selectedId, onSelect, currency, locale = "zh", className }: TraceWaterfallProps) {
  const end = (span: TraceSpan) => span.start + (span.duration ?? Math.max(0, (now ?? span.start) - span.start));
  const total = Math.max(1, now ?? 0, ...spans.map(end));
  const tokens = spans.reduce((sum, span) => sum + (span.tokens ?? 0), 0);
  const cost = spans.reduce((sum, span) => sum + (span.cost ?? 0), 0);
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 rounded-xl border border-fg-grey-200 bg-background p-3 tracking-fg", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-grey-700">
        <span>{pick(locale, "总耗时", "Total")} <span className="tabular-nums text-fg-black">{formatDuration(total, locale)}</span></span>
        {tokens > 0 && <span>Tokens <span className="tabular-nums text-fg-black">{formatTokens(tokens)}</span></span>}
        {cost > 0 && <span>{pick(locale, "花费", "Cost")} <span className="tabular-nums text-fg-black">{formatCost(cost, currency)}</span></span>}
        <span className="ml-auto flex gap-3">
          {(Object.keys(SPAN_COLOR) as TraceSpan["kind"][]).filter(kind => spans.some(span => span.kind === kind)).map(kind => <span key={kind} className="flex items-center gap-1"><span className={cn("size-2 rounded-sm", SPAN_COLOR[kind])} />{pick(locale, SPAN_LABEL[kind].zh, SPAN_LABEL[kind].en)}</span>)}
        </span>
      </div>
      <ul className="flex flex-col">
        {spans.map(span => {
          const left = (span.start / total) * 100;
          const width = Math.max(0.6, ((end(span) - span.start) / total) * 100);
          return (
            <li key={span.id}>
              <button type="button" aria-pressed={selectedId === span.id} onClick={() => onSelect?.(span.id)} className="grid w-full grid-cols-[minmax(0,10rem)_minmax(0,1fr)_4rem] items-center gap-2 rounded-md px-1 py-1 text-left text-xs hover:bg-fg-grey-50 aria-pressed:bg-fg-blue-50">
                <span className={cn("truncate", span.status === "error" ? "text-fg-red" : "text-fg-black")} style={{ paddingLeft: (span.depth ?? 0) * 12 }}>{span.name}</span>
                <span className="relative h-3 rounded-sm bg-fg-grey-50">
                  <span className={cn("absolute inset-y-0 rounded-sm", SPAN_COLOR[span.kind], span.status === "running" && "animate-pulse", span.status === "error" && "bg-fg-red")} style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }} />
                </span>
                <span className="text-right tabular-nums text-fg-grey-700">{span.duration !== undefined ? formatDuration(span.duration, locale) : "…"}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
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

const TREE_STATUS: Record<TreeAgentStatus, { zh: string; en: string; dot: string }> = {
  running: { zh: "运行中", en: "Running", dot: "bg-accent animate-pulse" },
  waiting: { zh: "等你", en: "Needs you", dot: "bg-fg-yellow-500" },
  done: { zh: "完成", en: "Done", dot: "bg-fg-green-500" },
  failed: { zh: "失败", en: "Failed", dot: "bg-fg-red" },
  idle: { zh: "待命", en: "Idle", dot: "bg-fg-grey-300" },
};

const branchCost = (agent: TreeAgent): number => (agent.cost ?? 0) + (agent.children ?? []).reduce((sum, child) => sum + branchCost(child), 0);

function TreeNode({ agent, depth, selectedId, onSelect, currency, locale }: { agent: TreeAgent; depth: number; selectedId?: string; onSelect?: (id: string) => void; currency?: string; locale: AgentLocale }) {
  const [folded, setFolded] = useState(false);
  const children = agent.children ?? [];
  const total = branchCost(agent);
  return (
    <li className="flex flex-col">
      <div className={cn("flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-1.5", selectedId === agent.id ? "border-accent bg-fg-blue-50" : "border-fg-grey-200 bg-background")}>
        {children.length > 0 ? (
          <button type="button" aria-label={folded ? pick(locale, "展开", "Expand") : pick(locale, "折叠", "Collapse")} aria-expanded={!folded} onClick={() => setFolded(value => !value)} className="flex size-5 shrink-0 items-center justify-center rounded text-fg-grey-700 hover:bg-fg-grey-100">
            {folded ? <AltArrowRightLinear size={12} /> : <AltArrowDownLinear size={12} />}
          </button>
        ) : <span className="w-5 shrink-0" />}
        <button type="button" onClick={() => onSelect?.(agent.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", TREE_STATUS[agent.status].dot)} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] text-fg-black">{agent.name}{agent.role && <span className="ml-1.5 text-xs text-fg-grey-500">{agent.role}</span>}</span>
            {agent.activity && <span className={cn("truncate text-xs text-fg-grey-700", agent.status === "running" && "forge-text-shimmer")}>{agent.activity}</span>}
          </span>
          {agent.duration !== undefined && <span className="shrink-0 tabular-nums text-xs text-fg-grey-500">{formatDuration(agent.duration, locale)}</span>}
          {total > 0 && <span className="shrink-0 tabular-nums text-xs text-fg-grey-700" title={children.length ? pick(locale, "含子智能体", "Including sub-agents") : undefined}>{formatCost(total, currency)}</span>}
        </button>
      </div>
      {children.length > 0 && !folded && (
        <ul className="ml-[18px] flex flex-col gap-1.5 border-l border-fg-grey-200 pl-3 pt-1.5">
          {children.map(child => <TreeNode key={child.id} agent={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} currency={currency} locale={locale} />)}
        </ul>
      )}
    </li>
  );
}

/** Who started whom: an orchestrator and its sub-agents as a live tree, with status, time and cost rolling up each branch. */
export function AgentTree({ root, selectedId, onSelect, currency, locale = "zh", className }: AgentTreeProps) {
  return <ul aria-label={pick(locale, "智能体", "Agents")} className={cn("flex flex-col tracking-fg", className)}><TreeNode agent={root} depth={0} selectedId={selectedId} onSelect={onSelect} currency={currency} locale={locale} /></ul>;
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
  locale?: AgentLocale;
  className?: string;
};

const LANE_STYLE: Record<LaneBlock["status"], string> = {
  running: "bg-fg-blue-100 text-fg-blue-800 border-accent",
  waiting: "bg-fg-yellow-50 text-fg-yellow-900 border-fg-yellow-400",
  done: "bg-fg-grey-100 text-fg-grey-900 border-fg-grey-300",
  failed: "bg-fg-red-50 text-fg-red border-fg-red-200",
};

/** Where every agent is right now: one lane per agent, tasks as blocks growing into "now". */
export function AgentLanes({ lanes, blocks, now, onSelect, locale = "zh", className }: AgentLanesProps) {
  const span = Math.max(1, now, ...blocks.map(block => block.end ?? now));
  const position = (value: number) => `${(value / span) * 100}%`;
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 rounded-xl border border-fg-grey-200 bg-background p-3 tracking-fg", className)}>
      {lanes.map(lane => (
        <div key={lane.id} className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2">
          <span className="flex min-w-0 items-center gap-1.5 truncate text-xs text-fg-black">{lane.icon ?? <StarsLinear size={12} className="text-accent" />}{lane.name}</span>
          <div className="relative h-7 rounded-md bg-fg-grey-50">
            {blocks.filter(block => block.laneId === lane.id).map(block => (
              <button
                key={block.id}
                type="button"
                title={block.title}
                onClick={() => onSelect?.(block.id)}
                className={cn("absolute inset-y-0.5 truncate rounded border-l-2 px-1.5 text-left text-[11px]", LANE_STYLE[block.status], block.status === "running" && "animate-pulse")}
                style={{ left: position(block.start), width: `max(1.25rem, calc(${position((block.end ?? now) - block.start)}))` }}
              >
                {block.title}
              </button>
            ))}
            <span aria-hidden="true" className="absolute inset-y-0 w-px bg-fg-red" style={{ left: position(now) }} />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-2 text-[11px] text-fg-grey-500">
        <span />
        <span className="flex justify-between tabular-nums"><span>0</span><span>{formatDuration(span / 2, locale)}</span><span>{pick(locale, "现在", "Now")}</span></span>
      </div>
    </div>
  );
}
