"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set. Plays rows in by itself and renders them with
 * Reasoning; for a live model run, drive Reasoning directly.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { Reasoning, type ReasoningStep } from "./thinking";

export type ThinkingVariant = "steps" | "reasoning" | "search" | "coding";

export type ThinkingRow = {
  primary: string;
  secondary?: string;
  mono?: boolean;
  add?: number;
  del?: number;
  href?: string;
};

const DEFAULT_ROWS: Record<ThinkingVariant, ThinkingRow[]> = {
  steps: [
    { primary: "Reading source briefs" },
    { primary: "Scanning supplier lists" },
    { primary: "Comparing tasting notes", secondary: "6 flavors" },
    { primary: "Writing the scoop report" },
  ],
  reasoning: [
    { primary: "Summer demand spikes for stone-fruit flavors — peach and apricot lead." },
    { primary: "Cone inventory should be checked before promoting a waffle-bowl special." },
  ],
  search: [
    { primary: "Joy Cone", secondary: "joycone.com", href: "https://joycone.com" },
    { primary: "WebstaurantStore", secondary: "webstaurantstore.com" },
    { primary: "The Konery", secondary: "thekonery.com" },
  ],
  coding: [
    { primary: "Read", secondary: "flavors.ts", mono: true },
    { primary: "Edit", secondary: "ChurnSchedule.tsx", mono: true, add: 74, del: 41 },
    { primary: "Run", secondary: "npm run freeze", mono: true },
  ],
};

const LABELS: Record<ThinkingVariant, { active: string; done: string }> = {
  steps: { active: "Thinking", done: "Thought for 4 seconds" },
  reasoning: { active: "Thinking", done: "Thought for 4 seconds" },
  search: { active: "Searching the web", done: "Searched the web" },
  coding: { active: "Running tools", done: "Ran 3 tools" },
};

export function ThinkingTrace({
  variant = "steps",
  locale = "zh", motion = "auto",
  rows,
  activeLabel,
  doneLabel,
  query,
  settled = false,
  play = true,
  onSettled,
  className = "",
}: {
  variant?: ThinkingVariant;
  locale?: "zh" | "en";
  motion?: MotionPreference;
  rows?: ThinkingRow[];
  activeLabel?: string;
  doneLabel?: string;
  query?: string;
  /** Skip the reveal animation and show the finished trace. */
  settled?: boolean;
  /** Auto-advance through rows. Turn off when the host drives visibility. */
  play?: boolean;
  onSettled?: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion(motion);
  const list = rows ?? (locale === "zh" ? {
    steps: [{ primary: "读取资料" }, { primary: "检索相关信息" }, { primary: "对比分析" }, { primary: "整理结果" }],
    reasoning: [{ primary: "整理问题与已知信息" }, { primary: "对比可行方案" }],
    search: [{ primary: "检索工作区文档" }, { primary: "核对来源" }],
    coding: [{ primary: "读取", secondary: "source.ts", mono: true }, { primary: "编辑", secondary: "component.tsx", mono: true }, { primary: "运行检查", secondary: "pnpm test", mono: true }],
  }[variant] : DEFAULT_ROWS[variant]);
  const labels = locale === "zh" ? { active: variant === "search" ? "正在搜索" : variant === "coding" ? "正在运行工具" : "正在思考", done: variant === "search" ? "搜索完成" : variant === "coding" ? "工具运行完成" : "思考完成" } : LABELS[variant];
  const [visible, setVisible] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const shown = settled || !play || reduced ? list.length : visible;
  const working = !settled && play && shown < list.length;

  useEffect(() => {
    if (settled || !play || reduced) return;
    if (visible >= list.length) return;
    const t = setTimeout(() => setVisible((n) => n + 1), 700);
    return () => clearTimeout(t);
  }, [settled, play, visible, list.length, reduced]);

  const settledRef = useRef(false);
  useEffect(() => {
    if (working || settledRef.current) return;
    settledRef.current = true;
    onSettled?.();
  }, [working, onSettled]);

  const steps: ReasoningStep[] = [
    ...(variant === "search" && query ? [{ id: "query", label: <span className="text-fg-grey-700">{locale === "zh" ? "搜索：" : "Search: "}{query}</span> }] : []),
    ...list.slice(0, shown).map((row, index) => ({
      id: `${index}-${row.primary}`,
      status: index === shown - 1 && working ? "running" as const : "done" as const,
      label: <span className={cn(row.mono && "font-mono text-xs")}>{row.primary}</span>,
      detail: (row.secondary && !row.href) || row.add !== undefined || (row.del ?? 0) > 0 ? (
        <span className="flex items-center gap-2">
          {row.secondary && !row.href && <span className={cn(row.mono && "font-mono")}>{row.secondary}</span>}
          {row.add !== undefined && <span className="font-medium text-fg-green-500">+{row.add}</span>}
          {row.del !== undefined && row.del > 0 && <span className="font-medium text-fg-red">−{row.del}</span>}
        </span>
      ) : undefined,
      sources: row.href ? [{ title: row.primary, href: row.href, domain: row.secondary }] : undefined,
    })),
  ];

  return (
    <Reasoning
      className={className}
      status={working ? "thinking" : "done"}
      steps={steps}
      label={activeLabel ?? labels.active}
      doneLabel={doneLabel ?? labels.done}
      open={expanded}
      onOpenChange={setExpanded}
      locale={locale}
      motion={motion}
    />
  );
}
