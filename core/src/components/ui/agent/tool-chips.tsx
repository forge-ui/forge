"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useState } from "react";
import {
  AltArrowDownLinear,
  CodeLinear,
  DocumentTextLinear,
  LightbulbLinear,
  PlayBoldDuotone,
} from "solar-icon-set";
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
  diffs = [],
  summary,
  className = "",
}: {
  items: ToolChipItem[];
  diffs?: ToolDiffChip[];
  summary?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-fit items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs text-fg-grey-700 hover:bg-fg-grey-100"
      >
        <AltArrowDownLinear
          size={12}
          color="var(--fg-grey-500)"
        />
        {summary ?? `${items.length} tool calls`}
      </button>

      {open && (
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            const expanded = openRows[item.id];
            return (
              <div key={item.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setOpenRows((current) => ({ ...current, [item.id]: !current[item.id] }))}
                  className="flex min-h-8 items-center gap-2 rounded-lg px-1.5 text-left hover:bg-fg-grey-100"
                >
                  <Icon size={14} color="var(--fg-grey-700)" />
                  <span className="font-medium text-fg-black">{item.label}</span>
                  <span
                    className={cn(
                      "rounded-md bg-fg-grey-100 px-1.5 py-0.5 text-xs text-fg-grey-700",
                      item.mono && "font-mono",
                    )}
                  >
                    {item.chip}
                  </span>
                </button>
                {expanded && item.detail && (
                  <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-fg-grey-200 pl-3">
                    {item.detail.map((line) => (
                      <p
                        key={line.text}
                        className={cn(
                          "font-mono text-xs leading-5",
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
        </div>
      )}
    </div>
  );
}
