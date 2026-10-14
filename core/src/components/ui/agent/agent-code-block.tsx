"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, CopyLinear, DocumentTextLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { SurfaceCard } from "../surface-card";

export type AgentCodeDiffType = "ctx" | "add" | "del";

export type AgentCodePiece = {
  text: string;
  change?: "add" | "del";
};

export type AgentCodeDiffRow = {
  old: number | null;
  cur: number | null;
  type: AgentCodeDiffType;
  pieces: AgentCodePiece[];
};

export type AgentCodeFoldRange = {
  id: string;
  /** One-based header line; it stays visible while folded. */
  startLine: number;
  /** Last hidden line, inclusive. Ranges may nest but must not cross. */
  endLine: number;
  label?: string;
};

const KEYWORDS = new Set([
  "import", "from", "export", "default", "async", "function", "const", "let", "var",
  "await", "return", "if", "else", "for", "while", "new", "throw", "try", "catch",
  "null", "true", "false", "undefined",
]);
const TOKEN =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`|\b\d+(?:\.\d+)?\b|\b(?:import|from|export|default|async|function|const|let|var|await|return|if|else|for|while|new|throw|try|catch|null|true|false|undefined)\b|[A-Za-z_$][\w$]*(?=\s*\())/g;

function highlight(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    const token = match[0];
    if (index > last) nodes.push(text.slice(last, index));
    const color = /^["'`]/.test(token) || /^\d/.test(token)
      ? "text-fg-yellow-700"
      : KEYWORDS.has(token)
        ? "text-accent"
        : "font-medium text-fg-black";
    nodes.push(
      <span key={`${index}-${token}`} className={color}>
        {token}
      </span>,
    );
    last = index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function AgentCodeBlock({
  filename,
  lines,
  diff,
  view: controlledView,
  onViewChange,
  locale = "zh",
  codeLabel,
  diffLabel,
  copyLabel,
  copiedLabel,
  foldRanges = [],
  collapsedRangeIds,
  defaultCollapsedRangeIds = [],
  onCollapsedRangeIdsChange,
  className = "",
}: {
  filename: string;
  lines?: string[];
  diff?: AgentCodeDiffRow[];
  view?: "code" | "diff";
  onViewChange?: (view: "code" | "diff") => void;
  locale?: "zh" | "en";
  codeLabel?: string;
  diffLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  foldRanges?: AgentCodeFoldRange[];
  collapsedRangeIds?: string[];
  defaultCollapsedRangeIds?: string[];
  onCollapsedRangeIdsChange?: (ids: string[]) => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState<"code" | "diff">(diff && !lines ? "diff" : "code");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [localCollapsed, setLocalCollapsed] = useState(defaultCollapsedRangeIds);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(false);
  const regionId = useId();
  const zh = locale === "zh";
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; if (copyTimer.current) clearTimeout(copyTimer.current); };
  }, []);
  const view = controlledView ?? uncontrolled;
  const listing = lines ?? [];
  const ranges: AgentCodeFoldRange[] = [];
  for (const range of [...foldRanges].sort((a, b) => a.startLine - b.startLine || b.endLine - a.endLine)) {
    if (!range.id || !Number.isInteger(range.startLine) || !Number.isInteger(range.endLine)
      || range.startLine < 1 || range.endLine > listing.length || range.endLine <= range.startLine
      || ranges.some(other => other.id === range.id || other.startLine === range.startLine
        || (other.startLine < range.startLine && other.endLine >= range.startLine && other.endLine < range.endLine))) continue;
    ranges.push(range);
  }
  const folded = new Set(collapsedRangeIds ?? localCollapsed);
  function toggleRange(range: AgentCodeFoldRange) {
    const next = ranges.filter(item => item.id === range.id ? !folded.has(item.id) : folded.has(item.id)).map(item => item.id);
    if (collapsedRangeIds === undefined) setLocalCollapsed(next);
    onCollapsedRangeIdsChange?.(next);
  }
  const added = diff?.filter((row) => row.type === "add").length ?? 0;
  const removed = diff?.filter((row) => row.type === "del").length ?? 0;

  function setView(next: "code" | "diff") {
    if (controlledView === undefined) setUncontrolled(next);
    onViewChange?.(next);
  }

  async function copy() {
    const text = listing.join("\n");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (!alive.current) return;
      setCopyFailed(false);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      if (alive.current) { setCopied(false); setCopyFailed(true); }
    }
  }

  return (
    <SurfaceCard
      className={className}
      padding="none"
      title={
        <span className="inline-flex items-center gap-2">
          <DocumentTextLinear size={14} color="var(--fg-grey-700)" />
          <span className="font-mono text-xs">{filename}</span>
        </span>
      }
      action={
        <div className="flex items-center gap-2">
          {diff && listing.length > 0 && (
            <div className="inline-flex rounded-lg bg-fg-grey-50 p-0.5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
              {(["code", "diff"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-semibold",
                    view === option ? "bg-white text-fg-black" : "text-fg-grey-700",
                  )}
                >
                  {option === "code" ? (codeLabel ?? (zh ? "代码" : "Code")) : (diffLabel ?? (zh ? "差异" : "Diff"))}
                </button>
              ))}
            </div>
          )}
          {view === "diff" ? (
            <span className="text-xs font-medium">
              <span className="text-fg-green-500">+{added}</span>{" "}
              <span className="text-fg-red">−{removed}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => void copy()}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-fg-grey-700 hover:bg-fg-grey-100"
            >
              {copied ? <CheckCircleLinear size={14} color="var(--fg-green-500)" /> : <CopyLinear size={14} color="var(--fg-grey-700)" />}
              {copied ? (copiedLabel ?? (zh ? "已复制" : "Copied")) : (copyLabel ?? (zh ? "复制" : "Copy"))}
            </button>
          )}
        </div>
      }
    >
      {copyFailed && <p role="status" className="px-4 pt-3 text-xs text-fg-red">{zh ? "复制失败，请重试或手动选择代码。" : "Copy failed. Retry or select the code manually."}</p>}
      <pre id={regionId} className="overflow-x-auto p-4 font-mono text-xs leading-6 text-fg-black">
        {view === "diff" && diff
          ? diff.map((row, index) => (
              <div
                key={`${row.type}-${index}`}
                className={cn(
                  "flex gap-3",
                  row.type === "add" && "bg-fg-green-50",
                  row.type === "del" && "bg-fg-red-50",
                )}
              >
                <span className="w-8 shrink-0 text-right text-fg-grey-500">{row.type === "del" ? row.old : row.cur}</span>
                <span className={cn("w-3 shrink-0", row.type === "add" && "text-fg-green-500", row.type === "del" && "text-fg-red")}>
                  {row.type === "add" ? "+" : row.type === "del" ? "−" : " "}
                </span>
                <span>
                  {row.pieces.map((piece, pieceIndex) => (
                    <span
                      key={`${piece.text}-${pieceIndex}`}
                      className={cn(
                        piece.change === "add" && "bg-fg-green-100 text-fg-green-500",
                        piece.change === "del" && "bg-fg-red-100 text-fg-red",
                      )}
                    >
                      {highlight(piece.text)}
                    </span>
                  ))}
                </span>
              </div>
            ))
          : listing.map((line, index) => {
              const number = index + 1;
              if (ranges.some(range => folded.has(range.id) && number > range.startLine && number <= range.endLine)) return null;
              const range = ranges.find(item => item.startLine === number);
              return <div key={index} className="flex items-start gap-3" data-code-line={number}>
                <span className="w-8 shrink-0 text-right text-fg-grey-500">{number}</span>
                {range && <button type="button" aria-expanded={!folded.has(range.id)} aria-controls={regionId}
                  aria-label={`${folded.has(range.id) ? (zh ? "展开" : "Expand") : (zh ? "折叠" : "Collapse")} ${range.label ?? (zh ? `第 ${number} 行` : `line ${number}`)}`}
                  onClick={() => toggleRange(range)} className="inline-flex min-h-6 shrink-0 items-center gap-1 rounded px-1 text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-accent">
                  <AltArrowDownLinear size={14} className={folded.has(range.id) ? "-rotate-90" : ""} />
                  {folded.has(range.id) && <span>{range.endLine - range.startLine} {zh ? "行" : "lines"}</span>}
                </button>}
                <span>{highlight(line)}</span>
              </div>;
            })}
      </pre>
    </SurfaceCard>
  );
}
