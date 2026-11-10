"use client";

import { Fragment, type ReactNode } from "react";
import { AltArrowDownLinear, LightbulbLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { ArtifactCard } from "./agent-conversation";
import { StreamingAnswer, type StreamingSource } from "./streaming-answer";
import { ToolChips, type ToolChipItem } from "./tool-chips";

/**
 * Structural copy of the AI SDK (v5) UIMessage part shapes, so Forge renders `useChat` messages
 * without depending on the `ai` package. Unknown part types are ignored.
 */
export type AgentToolState = "input-streaming" | "input-available" | "output-available" | "output-error";

export type AgentToolPart = {
  type: `tool-${string}` | "dynamic-tool";
  toolCallId: string;
  toolName?: string;
  state: AgentToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
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
const STATUS: Record<AgentToolState, NonNullable<ToolChipItem["status"]>> = { "input-streaming": "pending", "input-available": "running", "output-available": "complete", "output-error": "error" };

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
export function AgentParts({ parts, status = "ready", renderTool = {}, onOpenFile, locale = "zh", className }: AgentPartsProps) {
  const sources: StreamingSource[] = parts.flatMap(part =>
    part.type === "source-url" ? [{ name: String(part.title ?? part.url), href: String(part.url), domain: (() => { try { return new URL(String(part.url)).hostname; } catch { return undefined; } })() }]
      : part.type === "source-document" ? [{ name: String(part.title) }] : []);
  const lastText = parts.map(part => part.type).lastIndexOf("text");
  const blocks: ReactNode[] = [];
  let tools: AgentToolPart[] = [];

  const flushTools = (key: string) => {
    if (!tools.length) return;
    const items = tools.map(part => ({ id: part.toolCallId, kind: "run" as const, label: toolName(part), chip: preview(part.input), mono: true, status: STATUS[part.state], detail: part.state === "output-error" ? [{ text: part.errorText ?? "error", tone: "del" as const }] : part.output === undefined ? undefined : lines(part.output) }));
    const running = tools.some(part => part.state === "input-streaming" || part.state === "input-available");
    const failed = tools.some(part => part.state === "output-error");
    blocks.push(<ToolChips key={key} items={items} locale={locale} state={running ? "running" : failed ? "error" : "success"} />);
    tools = [];
  };

  parts.forEach((part, index) => {
    if (isTool(part)) {
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
