"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { AnimatePresence, motion as animated } from "motion/react";
import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  CheckCircleLinear,
  ClockCircleLinear,
  DangerTriangleLinear,
  AltArrowDownLinear,
  CodeLinear,
  DocumentTextLinear,
  LightbulbLinear,
  PlayBoldDuotone,
} from "../../../icons";
import { cn } from "../../../lib/utils";

export type ToolChipKind = "think" | "write" | "run" | "read" | "edit";

export type ToolChipDetail = {
  text: string;
  tone?: "add" | "del" | "plain";
};

export type ToolChipItem = {
  id: string;
  kind: ToolChipKind;
  label: string;
  chip: string;
  mono?: boolean;
  detail?: ToolChipDetail[];
  status?: "pending" | "running" | "complete" | "error" | "cancelled";
};

export type ToolDiffChip = {
  file: string;
  add: number;
  del?: number;
};

const KIND_ICON: Record<ToolChipKind, typeof LightbulbLinear> = {
  think: LightbulbLinear,
  write: DocumentTextLinear,
  read: DocumentTextLinear,
  edit: CodeLinear,
  run: PlayBoldDuotone,
};

export function ToolChips({
  items,
  locale = "zh", motion = "auto", state, result, actions,
  size = "md",
  defaultOpen = true,
  diffs = [],
  summary,
  className = "",
}: {
  items: ToolChipItem[];
  locale?: "zh" | "en";
  motion?: MotionPreference;
  state?: "idle" | "running" | "success" | "error" | "cancelled";
  result?: ReactNode;
  actions?: ReactNode;
  /** sm drops the card around the group and tightens rows, for side panels. */
  size?: "md" | "sm";
  /** Whether the list starts expanded. A later change applies until the reader toggles it. */
  defaultOpen?: boolean;
  diffs?: ToolDiffChip[];
  summary?: string;
  className?: string;
}) {
  const reduced = useReducedMotion(motion);
  const [toggled, setToggled] = useState<boolean>();
  const open = toggled ?? defaultOpen;
  const small = size === "sm";
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  return (
    <div className={cn("flex flex-col text-sm", small ? "gap-1" : "gap-2", state && !small && "rounded-xl border border-fg-grey-200 bg-background p-4", className)} data-tool-state={state} data-size={size} data-motion={reduced ? "none" : motion}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setToggled(!open)}
        className={cn("flex w-fit items-center gap-1.5 rounded-lg py-1 text-xs text-fg-grey-700 hover:bg-fg-grey-100", small ? "-ml-1.5 px-1.5" : "px-1.5")}
      >
        <AltArrowDownLinear
          size={12}
          color="var(--fg-grey-500)"
          className={cn("transition-transform", !open && "-rotate-90")}
        />
        {summary ?? (locale === "zh" ? `${items.length} 次工具调用` : `${items.length} tool calls`)}
        {state && <span role="status">{(locale === "zh" ? { idle: "准备调用", running: "正在执行", success: "已完成", error: "执行失败", cancelled: "已停止" } : { idle: "Ready", running: "Running", success: "Completed", error: "Failed", cancelled: "Stopped" })[state]}</span>}
      </button>

      <AnimatePresence initial={false}>{open && (
        <animated.div initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }} className={cn("flex flex-col overflow-hidden", small ? "gap-0" : "gap-1")}>
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            const expanded = openRows[item.id];
            return (
              <div key={item.id} className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={Boolean(expanded)}
                  onClick={() => setOpenRows((current) => ({ ...current, [item.id]: !current[item.id] }))}
                  className={cn("flex items-center gap-2 rounded-lg text-left hover:bg-fg-grey-100", small ? "-ml-1.5 min-h-7 px-1.5 text-[13px]" : "min-h-8 px-1.5")}
                >
                  {item.status === "complete" ? <CheckCircleLinear size={small ? 14 : 16} color="var(--fg-green-500)" /> : item.status === "error" ? <DangerTriangleLinear size={small ? 14 : 16} color="var(--fg-red)" /> : item.status ? <ClockCircleLinear size={small ? 14 : 16} color="var(--fg-grey-500)" /> : <Icon size={14} color="var(--fg-grey-700)" />}
                  <span className={cn("text-fg-black", small ? "shrink-0" : "font-medium")}>{item.label}</span>
                  {item.chip && <span
                    className={cn(
                      "rounded-md bg-fg-grey-100 px-1.5 py-0.5 text-xs text-fg-grey-700",
                      item.mono && "font-mono",
                      small && "min-w-0 truncate",
                    )}
                  >
                    {item.chip}
                  </span>}
                  {item.status && !(small && item.status === "complete") && <span className="ml-auto text-xs text-fg-grey-500">{(locale === "zh" ? { pending: "等待", running: "进行中", complete: "完成", error: "失败", cancelled: "已停止" } : { pending: "Pending", running: "Running", complete: "Done", error: "Failed", cancelled: "Stopped" })[item.status]}</span>}
                </button>
                {expanded && item.detail && (
                  <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-fg-grey-200 pl-3">
                    {item.detail.map((line) => (
                      <p
                        key={line.text}
                        className={cn(
                          "text-xs leading-5",
                          item.kind === "think" ? "whitespace-pre-wrap" : "font-mono",
                          line.tone === "add" && "text-fg-green-500",
                          line.tone === "del" && "text-fg-red",
                          !line.tone || line.tone === "plain" ? "text-fg-grey-700" : null,
                        )}
                      >
                        {line.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {diffs.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {diffs.map((diff) => (
                <span
                  key={diff.file}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-fg-grey-100 px-2 py-1 font-mono text-xs text-fg-grey-700"
                >
                  {diff.file}
                  <span className="text-fg-green-500">+{diff.add}</span>
                  {(diff.del ?? 0) > 0 && <span className="text-fg-red">−{diff.del}</span>}
                </span>
              ))}
            </div>
          )}
          {result && <div role="status" className="mt-2 text-sm text-fg-black">{result}</div>}
        </animated.div>
      )}</AnimatePresence>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
