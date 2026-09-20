"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useState, type ReactNode } from "react";
import { CheckCircleLinear, CopyLinear, DocumentTextLinear } from "solar-icon-set";
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
        ? "text-fg-violet"
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
  className = "",
}: {
  filename: string;
  lines?: string[];
  diff?: AgentCodeDiffRow[];
  view?: "code" | "diff";
  onViewChange?: (view: "code" | "diff") => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState<"code" | "diff">(diff && !lines ? "diff" : "code");
  const [copied, setCopied] = useState(false);
  const view = controlledView ?? uncontrolled;
  const listing = lines ?? [];
  const added = diff?.filter((row) => row.type === "add").length ?? 0;
  const removed = diff?.filter((row) => row.type === "del").length ?? 0;

  function setView(next: "code" | "diff") {
    if (controlledView === undefined) setUncontrolled(next);
    onViewChange?.(next);
  }

  async function copy() {
    const text = listing.join("\n");
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
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
                  {option === "code" ? "Code" : "Diff"}
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
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      }
    >
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-fg-black">
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
          : listing.map((line, index) => (
              <div key={`${index}-${line}`} className="flex gap-3">
                <span className="w-8 shrink-0 text-right text-fg-grey-500">{index + 1}</span>
                <span>{highlight(line)}</span>
              </div>
            ))}
      </pre>
    </SurfaceCard>
  );
}
