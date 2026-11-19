"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import type { ReactNode } from "react";
import {
  CodeLinear,
  DocumentTextLinear,
  LightbulbLinear,
  PlayBoldDuotone,
} from "../../../icons";
import { cn } from "../../../lib/utils";
import { ToolCall, ToolCallGroup, type ToolCallStatus } from "./tool-call";

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
  const small = size === "sm";
  const words = (locale === "zh"
    ? { idle: "准备调用", running: "正在执行", success: "已完成", error: "执行失败", cancelled: "已停止" }
    : { idle: "Ready", running: "Running", success: "Completed", error: "Failed", cancelled: "Stopped" });

  return (
    <div className={cn("flex flex-col text-sm", small ? "gap-1" : "gap-2", state && !small && "rounded-xl bg-background p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200", className)} data-tool-state={state} data-size={size} data-motion={reduced ? "none" : motion}>
      <ToolCallGroup
        label={summary ?? (locale === "zh" ? `${items.length} 次工具调用` : `${items.length} tool calls`)}
        status={state ?? "success"}
        statusLabel={state ? words[state] : undefined}
        defaultOpen={defaultOpen}
        locale={locale}
        motion={motion}
      >
        {items.map((item) => {
          const Icon = KIND_ICON[item.kind];
          return (
            <ToolCall
              key={item.id}
              variant="row"
              size={size}
              locale={locale}
              motion={motion}
              name={item.label}
              title={<span className={cn(small ? "font-normal" : "font-medium")}>{item.label}</span>}
              summary={item.chip ? <span className={cn(item.mono && "font-mono")}>{item.chip}</span> : undefined}
              status={STATUS[item.status ?? "complete"]}
              openOnError={false}
              icon={item.status ? undefined : <Icon size={14} color="var(--fg-grey-700)" />}
              details={item.detail && (
                <div className="flex flex-col gap-0.5">
                  {item.detail.map((line) => (
                    <p key={line.text} className={cn("text-xs leading-5", item.kind === "think" ? "whitespace-pre-wrap" : "font-mono", line.tone === "add" ? "text-fg-green-500" : line.tone === "del" ? "text-fg-red" : "text-fg-grey-700")}>{line.text}</p>
                  ))}
                </div>
              )}
            />
          );
        })}
        {diffs.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {diffs.map((diff) => (
              <span key={diff.file} className="inline-flex items-center gap-1.5 rounded-lg bg-fg-grey-100 px-2 py-1 font-mono text-xs text-fg-grey-700">
                {diff.file}
                <span className="text-fg-green-500">+{diff.add}</span>
                {(diff.del ?? 0) > 0 && <span className="text-fg-red">−{diff.del}</span>}
              </span>
            ))}
          </div>
        )}
        {result && <div role="status" className="mt-2 text-sm text-fg-black">{result}</div>}
      </ToolCallGroup>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

// ToolChips step states, in ToolCall's terms; no status reads as a finished step shown by its kind.
const STATUS: Record<NonNullable<ToolChipItem["status"]>, ToolCallStatus> = {
  pending: "pending", running: "running", complete: "success", error: "error", cancelled: "denied",
};
