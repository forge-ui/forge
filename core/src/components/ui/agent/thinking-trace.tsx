"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useEffect, useRef, useState } from "react";
import {
  AltArrowDownLinear,
  CheckCircleLinear,
  CodeLinear,
  LightbulbLinear,
  LinkLinear,
  MagniferLinear,
  StarsLinear,
} from "solar-icon-set";
import { cn } from "../../../lib/utils";

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
  const list = rows ?? DEFAULT_ROWS[variant];
  const labels = LABELS[variant];
  const [visible, setVisible] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const shown = settled || !play ? list.length : visible;
  const working = !settled && play && shown < list.length;

  useEffect(() => {
    if (settled || !play) return;
    if (visible >= list.length) return;
    const t = setTimeout(() => setVisible((n) => n + 1), 700);
    return () => clearTimeout(t);
  }, [settled, play, visible, list.length]);

  const settledRef = useRef(false);
  useEffect(() => {
    if (working || settledRef.current) return;
    settledRef.current = true;
    onSettled?.();
  }, [working, onSettled]);

  return (
    <div className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-fit items-center gap-2 rounded-lg px-1.5 py-1 text-left text-fg-grey-700 hover:bg-fg-grey-100"
      >
        <StarsLinear size={16} color="var(--fg-violet)" />
        <span className={cn("font-medium", working && "forge-shimmer")}>
          {working ? (activeLabel ?? labels.active) : (doneLabel ?? labels.done)}
        </span>
        <span className={cn("transition-transform", expanded ? "rotate-180" : "rotate-0")}>
          <AltArrowDownLinear size={12} color="var(--fg-grey-500)" />
        </span>
      </button>

      {expanded && (
        <div className="ml-2 flex flex-col gap-0.5 border-l border-fg-grey-200 pl-3">
          {variant === "search" && query && (
            <p className="flex items-center gap-1.5 py-1 text-xs text-fg-grey-500">
              <MagniferLinear size={12} color="var(--fg-grey-500)" />
              {query}
            </p>
          )}
          {list.slice(0, shown).map((row, i) => (
            <ThinkingRowView key={`${row.primary}-${i}`} variant={variant} row={row} last={i === shown - 1 && working} />
          ))}
        </div>
      )}
    </div>
  );
}

function ThinkingRowView({
  variant,
  row,
  last,
}: {
  variant: ThinkingVariant;
  row: ThinkingRow;
  last: boolean;
}) {
  const icon =
    variant === "search" ? (
      <LinkLinear size={14} color="var(--fg-grey-500)" />
    ) : variant === "coding" ? (
      <CodeLinear size={14} color="var(--fg-grey-500)" />
    ) : last ? (
      <LightbulbLinear size={14} color="var(--fg-violet)" />
    ) : (
      <CheckCircleLinear size={14} color="var(--fg-green-500)" />
    );

  const body = (
    <>
      {icon}
      <span className={cn("min-w-0 flex-1 text-fg-black", row.mono && "font-mono text-xs")}>
        {row.primary}
      </span>
      {row.secondary && (
        <span className={cn("text-xs text-fg-grey-500", row.mono && "font-mono")}>
          {row.secondary}
        </span>
      )}
      {row.add !== undefined && (
        <span className="text-xs font-medium text-fg-green-500">+{row.add}</span>
      )}
      {row.del !== undefined && row.del > 0 && (
        <span className="text-xs font-medium text-fg-red">−{row.del}</span>
      )}
    </>
  );

  if (row.href) {
    return (
      <a
        href={row.href}
        target="_blank"
        rel="noreferrer"
        className="forge-fade-up flex min-h-7 items-center gap-2 rounded-lg px-1.5 py-0.5 hover:bg-fg-grey-100"
      >
        {body}
      </a>
    );
  }

  return (
    <div className="forge-fade-up flex min-h-7 items-center gap-2 rounded-lg px-1.5 py-0.5">
      {body}
    </div>
  );
}
