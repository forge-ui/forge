"use client";

import { Fragment, type ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { ArtifactCard } from "./agent-conversation";
import { StreamingAnswer, type StreamingSource } from "./streaming-answer";
import { Reasoning } from "./thinking";
import { ToolCall, ToolCallGroup, type ToolCallStatus } from "./tool-call";

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
  /** sm suits side panels: 14px answer text, tool calls as a plain list that folds once they finish. */
  size?: "md" | "sm";
  className?: string;
};

const toolName = (part: AgentToolPart) => part.toolName ?? part.type.replace(/^tool-/, "");
const isTool = (part: AgentMessagePart): part is AgentToolPart => typeof part.type === "string" && (part.type.startsWith("tool-") || part.type === "dynamic-tool");
// A lone argument reads better as its value than as JSON: {"slug":"DataTable"} → DataTable.
const soleValue = (value: unknown) => {
  const values = value && typeof value === "object" && !Array.isArray(value) ? Object.values(value) : [];
  return values.length === 1 && (typeof values[0] === "string" || typeof values[0] === "number") ? String(values[0]) : undefined;
};
const preview = (value: unknown, length = 48) => {
  if (value === undefined) return "";
  const text = typeof value === "string" ? value : soleValue(value) ?? JSON.stringify(value);
  return text.length > length ? text.slice(0, length - 1) + "…" : text;
};
const denied = (part: AgentToolPart) => part.state === "output-denied" || (part.state === "approval-responded" && part.approval?.approved === false);
// The model asked for a tool that does not exist; nothing ran, so it is not shown as a failure.
const unavailable = (part: AgentToolPart) => part.state === "output-error" && /unavailable tool|NoSuchTool/i.test(part.errorText ?? "");
const callStatus = (part: AgentToolPart): ToolCallStatus => {
  if (denied(part) || unavailable(part)) return "denied";
  switch (part.state) {
    case "input-streaming": return "pending";
    case "approval-requested": return "awaiting-approval";
    case "output-available": return "success";
    case "output-error": return "error";
    default: return "running";
  }
};
const needsAnswer = (part: AgentToolPart) => part.state === "approval-requested" && part.approval !== undefined && !part.approval.isAutomatic;

export function AgentParts({ parts, status = "ready", renderTool = {}, onOpenFile, onToolApproval, locale = "zh", size = "md", className }: AgentPartsProps) {
  const small = size === "sm";
  const sources: StreamingSource[] = parts.flatMap(part =>
    part.type === "source-url" ? [{ name: String(part.title ?? part.url), href: String(part.url), domain: (() => { try { return new URL(String(part.url)).hostname; } catch { return undefined; } })() }]
      : part.type === "source-document" ? [{ name: String(part.title) }] : []);
  const lastText = parts.map(part => part.type).lastIndexOf("text");
  const blocks: ReactNode[] = [];
  // Reasoning and tool calls between two pieces of visible output: a multi-step run alternates them,
  // and one line per part would bury the answer.
  type Thought = { thought: string; streaming: boolean; index: number };
  let work: (AgentToolPart | Thought)[] = [];
  const isThought = (entry: AgentToolPart | Thought): entry is Thought => "thought" in entry;

  const flushWork = (key: string) => {
    if (!work.length) return;
    const entries = work;
    work = [];
    const thoughts = entries.filter(isThought);
    const tools = entries.filter((entry): entry is AgentToolPart => !isThought(entry));
    if (!tools.length) {
      blocks.push(<Reasoning key={key} status={thoughts.some(entry => entry.streaming) ? "thinking" : "done"} text={thoughts.map(entry => entry.thought).join("\n\n")} doneLabel={locale === "en" ? "Thought process" : "思考过程"} locale={locale} size={small ? "sm" : "md"} />);
      return;
    }
    const running = tools.some(part => callStatus(part) === "running" || callStatus(part) === "pending") || thoughts.some(entry => entry.streaming);
    const failed = tools.some(part => part.state === "output-error" && !unavailable(part));
    blocks.push(
      <ToolCallGroup key={key} count={tools.length} status={running ? "running" : failed ? "error" : "success"} defaultOpen={small ? undefined : true} locale={locale}>
        {entries.map(entry => isThought(entry)
          ? <Reasoning key={`thought-${entry.index}`} status={entry.streaming ? "thinking" : "done"} text={entry.thought} doneLabel={locale === "en" ? "Thought" : "思考"} locale={locale} size="sm" />
          : <ToolCall key={entry.toolCallId} variant="row" name={toolName(entry)} summary={preview(entry.input) || undefined} status={callStatus(entry)} args={entry.input} error={unavailable(entry) ? undefined : entry.errorText ?? (denied(entry) && entry.approval?.reason ? entry.approval.reason : undefined)} result={unavailable(entry) ? (locale === "en" ? "No such tool; skipped." : "没有这个工具，已跳过。") : entry.output} locale={locale} size={small ? "sm" : "md"} />)}
      </ToolCallGroup>,
    );
  };

  parts.forEach((part, index) => {
    if (isTool(part)) {
      if (needsAnswer(part)) {
        flushWork(`work-${index}`);
        const id = part.approval?.id ?? part.toolCallId;
        blocks.push(
          <ToolCall
            key={part.toolCallId}
            name={toolName(part)}
            summary={preview(part.input) || undefined}
            status="awaiting-approval"
            args={part.input}
            approvalReason={part.approval?.requestReason}
            onApprove={onToolApproval && (() => onToolApproval({ id, approved: true }))}
            onDeny={onToolApproval && (() => onToolApproval({ id, approved: false }))}
            locale={locale}
            size={small ? "sm" : "md"}
          />,
        );
        return;
      }
      const custom = part.state === "output-available" ? renderTool[toolName(part)]?.(part) : undefined;
      if (custom) { flushWork(`work-${index}`); blocks.push(<Fragment key={part.toolCallId}>{custom}</Fragment>); }
      else work.push(part);
      return;
    }
    if (part.type === "reasoning") {
      // Some providers send an empty reasoning part with every step.
      if (String(part.text).trim()) work.push({ thought: String(part.text), streaming: part.state === "streaming", index });
    } else if (part.type === "text") {
      flushWork(`work-${index}`);
      const live = index === lastText && status === "streaming" && part.state !== "done";
      blocks.push(<StreamingAnswer key={index} text={String(part.text)} format="markdown" size={size} status={live ? "streaming" : "complete"} duration={live ? undefined : 0} locale={locale} sources={index === lastText && sources.length ? sources : undefined} />);
    } else if (part.type === "file") {
      flushWork(`work-${index}`);
      const file = part as { url: string; filename?: string; mediaType: string };
      blocks.push(<ArtifactCard key={index} title={file.filename ?? file.url} meta={file.mediaType} kind={file.mediaType.startsWith("image/") ? "image" : "file"} locale={locale} onOpen={onOpenFile ? () => onOpenFile(file) : undefined} />);
    }
  });
  flushWork("work-end");

  return <div className={cn("flex min-w-0 flex-col", small ? "gap-2" : "gap-3", className)}>{blocks}</div>;
}
