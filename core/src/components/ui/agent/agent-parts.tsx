"use client";

import { Fragment, type ReactNode } from "react";
import { AltArrowDownLinear, LightbulbLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { ArtifactCard } from "./agent-conversation";
import { StreamingAnswer, type StreamingSource } from "./streaming-answer";
import { ToolChips, type ToolChipItem } from "./tool-chips";

/**
 * Structural copy of the AI SDK (v5–v7) UIMessage part shapes, so Forge renders `useChat` messages
 * without depending on the `ai` package. Unknown part types are ignored.
 */
export type AgentToolState = "input-streaming" | "input-available" | "approval-requested" | "approval-responded" | "output-available" | "output-error" | "output-denied";

/** AI SDK tool approval (v6+): present on approval states, and on outputs of approved calls. */
export type AgentToolApproval = { id: string; approved?: boolean; reason?: string; requestReason?: string; isAutomatic?: boolean };

/** Same shape as `addToolApprovalResponse` from `useChat`, so it can be passed straight through. */
export type AgentToolApprovalResponse = { id: string; approved: boolean; reason?: string };

export type AgentToolPart = {
  type: `tool-${string}` | "dynamic-tool";
  toolCallId: string;
  toolName?: string;
  state: AgentToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  approval?: AgentToolApproval;
};

export type AgentMessagePart =
  | { type: "text"; text: string; state?: "streaming" | "done" }
  | { type: "reasoning"; text: string; state?: "streaming" | "done" }
  | AgentToolPart
  | { type: "source-url"; sourceId: string; url: string; title?: string }
  | { type: "source-document"; sourceId: string; title: string; filename?: string }
  | { type: "file"; mediaType: string; url: string; filename?: string }
  | { type: "step-start" }
  | { type: string; [key: string]: unknown };

export type AgentPartsProps = {
  parts: AgentMessagePart[];
  /** `useChat` status; "streaming" keeps the last text part animating. */
  status?: "submitted" | "streaming" | "ready" | "error";
  /** Generative UI: render a tool result with your own component, keyed by tool name. Return null to fall back. */
  renderTool?: Record<string, (part: AgentToolPart) => ReactNode>;
  onOpenFile?: (part: { url: string; filename?: string; mediaType: string }) => void;
  /** Answer a tool approval request; pass `addToolApprovalResponse` from `useChat`. Without it the request shows as waiting. */
  onToolApproval?: (response: AgentToolApprovalResponse) => void;
  locale?: "zh" | "en";
  className?: string;
};

const toolName = (part: AgentToolPart) => part.toolName ?? part.type.replace(/^tool-/, "");
const isTool = (part: AgentMessagePart): part is AgentToolPart => typeof part.type === "string" && (part.type.startsWith("tool-") || part.type === "dynamic-tool");
const preview = (value: unknown, length = 48) => {
  if (value === undefined) return "";
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > length ? text.slice(0, length - 1) + "…" : text;
};
const lines = (value: unknown) => (typeof value === "string" ? value : JSON.stringify(value, null, 2) ?? "").split("\n").slice(0, 40).map(text => ({ text }));
const STATUS: Record<AgentToolState, NonNullable<ToolChipItem["status"]>> = { "input-streaming": "pending", "input-available": "running", "approval-requested": "pending", "approval-responded": "running", "output-available": "complete", "output-error": "error", "output-denied": "cancelled" };
const needsAnswer = (part: AgentToolPart) => part.state === "approval-requested" && part.approval !== undefined && !part.approval.isAutomatic;
const isRunning = (part: AgentToolPart) => part.state === "input-streaming" || part.state === "input-available" || part.state === "approval-requested" || (part.state === "approval-responded" && part.approval?.approved !== false);
const detailFor = (part: AgentToolPart, locale: "zh" | "en"): ToolChipItem["detail"] => {
  if (part.state === "output-error") return [{ text: part.errorText ?? "error", tone: "del" }];
  if (part.state === "output-denied" || (part.state === "approval-responded" && part.approval?.approved === false)) return [{ text: (locale === "en" ? "Denied" : "已拒绝") + (part.approval?.reason ? `: ${part.approval.reason}` : "") }];
  return part.output === undefined ? undefined : lines(part.output);
};

function ToolApprovalRequest({ part, onAnswer, locale }: { part: AgentToolPart; onAnswer?: (response: AgentToolApprovalResponse) => void; locale: "zh" | "en" }) {
  const id = part.approval?.id ?? part.toolCallId;
  const input = preview(part.input, 120);
  return (
    <div role="group" aria-label={locale === "en" ? `Approve ${toolName(part)}` : `确认调用 ${toolName(part)}`} className="flex flex-col gap-3 rounded-xl border border-fg-grey-200 bg-background p-4 text-sm">
      <p className="font-semibold text-fg-black">{locale === "en" ? `Allow ${toolName(part)} to run?` : `允许执行 ${toolName(part)} 吗？`}</p>
      {part.approval?.requestReason && <p className="text-fg-grey-700">{part.approval.requestReason}</p>}
      {input && <code className="block overflow-x-auto whitespace-pre rounded-lg bg-fg-grey-100 px-3 py-2 font-mono text-xs text-fg-grey-900">{input}</code>}
      {onAnswer ? (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onAnswer({ id, approved: true })}>{locale === "en" ? "Allow" : "允许"}</Button>
          <Button size="sm" color="grey" variant="tertiary" onClick={() => onAnswer({ id, approved: false })}>{locale === "en" ? "Deny" : "拒绝"}</Button>
        </div>
      ) : (
        <p role="status" className="text-xs text-fg-grey-700">{locale === "en" ? "Waiting for approval" : "等待确认"}</p>
      )}
    </div>
  );
}

function Reasoning({ text, streaming, locale }: { text: string; streaming: boolean; locale: "zh" | "en" }) {
  return (
    <details open={streaming} className="group rounded-xl text-sm">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs text-fg-grey-700 hover:bg-fg-grey-100">
        <LightbulbLinear size={14} color="currentColor" />
        {streaming ? (locale === "en" ? "Thinking…" : "思考中…") : (locale === "en" ? "Thought process" : "思考过程")}
        <AltArrowDownLinear size={12} color="currentColor" className="transition-transform group-open:rotate-180" />
      </summary>
      <p className="ml-2 mt-1 whitespace-pre-wrap border-l border-fg-grey-200 pl-3 text-xs leading-5 text-fg-grey-700">{text}</p>
    </details>
  );
}

/**
 * Render the parts of one assistant message: text as a streaming answer (Markdown), reasoning as a
 * collapsible trace, consecutive tool calls as one ToolChips group (or your component via renderTool),
 * sources under the answer and files as artifact cards.
 */
export function AgentParts({ parts, status = "ready", renderTool = {}, onOpenFile, onToolApproval, locale = "zh", className }: AgentPartsProps) {
  const sources: StreamingSource[] = parts.flatMap(part =>
    part.type === "source-url" ? [{ name: String(part.title ?? part.url), href: String(part.url), domain: (() => { try { return new URL(String(part.url)).hostname; } catch { return undefined; } })() }]
      : part.type === "source-document" ? [{ name: String(part.title) }] : []);
  const lastText = parts.map(part => part.type).lastIndexOf("text");
  const blocks: ReactNode[] = [];
  let tools: AgentToolPart[] = [];

  const flushTools = (key: string) => {
    if (!tools.length) return;
    const items = tools.map(part => ({ id: part.toolCallId, kind: "run" as const, label: toolName(part), chip: preview(part.input), mono: true, status: STATUS[part.state] ?? "pending", detail: detailFor(part, locale) }));
    const running = tools.some(isRunning);
    const failed = tools.some(part => part.state === "output-error");
    const denied = tools.every(part => STATUS[part.state] === "cancelled" || (part.state === "approval-responded" && part.approval?.approved === false));
    blocks.push(<ToolChips key={key} items={items} locale={locale} state={running ? "running" : failed ? "error" : denied ? "cancelled" : "success"} />);
    tools = [];
  };

  parts.forEach((part, index) => {
    if (isTool(part)) {
      if (needsAnswer(part)) { flushTools(`tools-${index}`); blocks.push(<ToolApprovalRequest key={part.toolCallId} part={part} onAnswer={onToolApproval} locale={locale} />); return; }
      const custom = part.state === "output-available" ? renderTool[toolName(part)]?.(part) : undefined;
      if (custom) { flushTools(`tools-${index}`); blocks.push(<Fragment key={part.toolCallId}>{custom}</Fragment>); }
      else tools.push(part);
      return;
    }
    flushTools(`tools-${index}`);
    if (part.type === "text") {
      const live = index === lastText && status === "streaming" && part.state !== "done";
      blocks.push(<StreamingAnswer key={index} text={String(part.text)} format="markdown" status={live ? "streaming" : "complete"} duration={live ? undefined : 0} locale={locale} sources={index === lastText && sources.length ? sources : undefined} />);
    } else if (part.type === "reasoning") {
      blocks.push(<Reasoning key={index} text={String(part.text)} streaming={part.state === "streaming"} locale={locale} />);
    } else if (part.type === "file") {
      const file = part as { url: string; filename?: string; mediaType: string };
      blocks.push(<ArtifactCard key={index} title={file.filename ?? file.url} meta={file.mediaType} kind={file.mediaType.startsWith("image/") ? "image" : "file"} locale={locale} onOpen={onOpenFile ? () => onOpenFile(file) : undefined} />);
    }
  });
  flushTools("tools-end");

  return <div className={cn("flex min-w-0 flex-col gap-3", className)}>{blocks}</div>;
}
