"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDownLinear,
  CheckCircleLinear,
  CodeLinear,
  CopyLinear,
  DangerTriangleLinear,
  DislikeLinear,
  DocumentTextLinear,
  DownloadMinimalisticLinear,
  GalleryLinear,
  LikeLinear,
  RefreshLinear,
  StarsLinear,
  WidgetLinear,
} from "../../../icons";
import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";

type Locale = "zh" | "en";
const pick = (locale: Locale, zh: string, en: string) => (locale === "en" ? en : zh);

/* ───────────────────────── Conversation ───────────────────────── */

export type ConversationProps = {
  children: ReactNode;
  /** Change this when new content arrives (message count, streamed length…) to keep following the latest reply. */
  followKey?: unknown;
  locale?: Locale;
  latestLabel?: string;
  motion?: MotionPreference;
  className?: string;
};

/**
 * Scroll container for a message list. Follows new content while the reader is at the bottom,
 * stops following when they scroll up, and offers a button back to the latest message.
 */
export function Conversation({ children, followKey, locale = "zh", latestLabel, motion = "auto", className }: ConversationProps) {
  const reduced = useReducedMotion(motion);
  const scroller = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const following = useRef(true);

  const toBottom = useCallback((smooth: boolean) => {
    const node = scroller.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: smooth && !reduced ? "smooth" : "auto" });
  }, [reduced]);

  useLayoutEffect(() => {
    if (following.current) toBottom(false);
  }, [followKey, children, toBottom]);

  useEffect(() => {
    const node = scroller.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => { if (following.current) toBottom(false); });
    for (const child of Array.from(node.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [toBottom]);

  const onScroll = () => {
    const node = scroller.current;
    if (!node) return;
    const bottom = node.scrollHeight - node.scrollTop - node.clientHeight < 24;
    following.current = bottom;
    setAtBottom(bottom);
  };

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
      <div ref={scroller} onScroll={onScroll} role="log" aria-live="polite" className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 p-4">{children}</div>
      </div>
      {!atBottom && (
        <button
          type="button"
          onClick={() => { following.current = true; setAtBottom(true); toBottom(true); }}
          className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-fg-grey-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-fg text-fg-black shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)] hover:bg-fg-grey-50"
        >
          <ArrowDownLinear size={14} color="currentColor" />
          {latestLabel ?? pick(locale, "回到最新", "Jump to latest")}
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── AgentMessage ───────────────────────── */

export type AgentMessageRole = "user" | "assistant";

export type AgentMessageProps = {
  role: AgentMessageRole;
  children: ReactNode;
  name?: string;
  avatar?: ReactNode;
  time?: string;
  /** Rendered under assistant content, usually MessageActions. */
  actions?: ReactNode;
  className?: string;
};

/** One turn in a conversation: user text as a right-aligned bubble, assistant output full width. */
export function AgentMessage({ role, children, name, avatar, time, actions, className }: AgentMessageProps) {
  if (role === "user") {
    return (
      <div className={cn("flex justify-end", className)} data-role="user">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-fg-grey-100 px-4 py-2.5 text-sm leading-6 tracking-fg text-fg-black">{children}</div>
      </div>
    );
  }
  return (
    <div className={cn("flex gap-3", className)} data-role="assistant">
      <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-fg-blue-50 text-fg-blue">
        {avatar ?? <StarsLinear size={16} color="currentColor" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {(name || time) && (
          <div className="flex items-baseline gap-2 text-sm tracking-fg">
            {name && <span className="font-semibold text-fg-black">{name}</span>}
            {time && <span className="text-xs text-fg-grey-700">{time}</span>}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-3 text-sm leading-6 tracking-fg text-fg-black">{children}</div>
        {actions}
      </div>
    </div>
  );
}

/* ───────────────────────── MessageActions ───────────────────────── */

export type MessageFeedback = "up" | "down" | null;

export type MessageActionsProps = {
  /** Text copied by the copy action; omit to hide copy. */
  copyText?: string;
  onRetry?: () => void;
  onFeedback?: (value: MessageFeedback) => void;
  feedback?: MessageFeedback;
  locale?: Locale;
  labels?: Partial<Record<"copy" | "copied" | "retry" | "up" | "down", string>>;
  className?: string;
};

/** Copy, regenerate and thumbs feedback for an assistant reply. Each action renders only when wired. */
export function MessageActions({ copyText, onRetry, onFeedback, feedback: controlled, locale = "zh", labels = {}, className }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [local, setLocal] = useState<MessageFeedback>(null);
  const feedback = controlled === undefined ? local : controlled;
  const text = { copy: pick(locale, "复制", "Copy"), copied: pick(locale, "已复制", "Copied"), retry: pick(locale, "重新生成", "Regenerate"), up: pick(locale, "有帮助", "Helpful"), down: pick(locale, "没帮助", "Not helpful"), ...labels };
  const button = "inline-flex size-8 items-center justify-center rounded-lg text-fg-grey-700 transition-colors hover:bg-fg-grey-100 hover:text-fg-black aria-pressed:text-fg-blue";

  const vote = (value: Exclude<MessageFeedback, null>) => {
    const next = feedback === value ? null : value;
    if (controlled === undefined) setLocal(next);
    onFeedback?.(next);
  };

  return (
    <div className={cn("-ml-1.5 flex items-center gap-0.5", className)}>
      {copyText !== undefined && (
        <button type="button" aria-label={copied ? text.copied : text.copy} title={copied ? text.copied : text.copy} className={button}
          onClick={async () => { try { await navigator.clipboard.writeText(copyText); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); } }}>
          {copied ? <CheckCircleLinear size={16} color="currentColor" /> : <CopyLinear size={16} color="currentColor" />}
        </button>
      )}
      {onRetry && (
        <button type="button" aria-label={text.retry} title={text.retry} className={button} onClick={onRetry}>
          <RefreshLinear size={16} color="currentColor" />
        </button>
      )}
      {onFeedback && (
        <>
          <button type="button" aria-label={text.up} title={text.up} aria-pressed={feedback === "up"} className={button} onClick={() => vote("up")}>
            <LikeLinear size={16} color="currentColor" />
          </button>
          <button type="button" aria-label={text.down} title={text.down} aria-pressed={feedback === "down"} className={button} onClick={() => vote("down")}>
            <DislikeLinear size={16} color="currentColor" />
          </button>
        </>
      )}
    </div>
  );
}

/* ───────────────────────── PromptSuggestions ───────────────────────── */

export type PromptSuggestionsProps = {
  suggestions: string[];
  onSelect: (text: string, index: number) => void;
  label?: string;
  className?: string;
};

/** Starter prompts or follow-ups as wrapping chips. */
export function PromptSuggestions({ suggestions, onSelect, label, className }: PromptSuggestionsProps) {
  if (!suggestions.length) return null;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <span className="text-xs font-semibold tracking-fg text-fg-grey-700">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button key={suggestion} type="button" onClick={() => onSelect(suggestion, index)}
            className="rounded-full border border-fg-grey-200 bg-white px-3 py-1.5 text-left text-sm tracking-fg text-fg-black transition-colors hover:border-fg-blue hover:text-fg-blue">
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── ArtifactCard ───────────────────────── */

export type ArtifactKind = "document" | "code" | "table" | "image" | "file";
export type ArtifactStatus = "generating" | "ready" | "error";

export type ArtifactCardProps = {
  title: string;
  kind?: ArtifactKind;
  /** Short line under the title, e.g. "Markdown · 2.4 KB". */
  meta?: string;
  status?: ArtifactStatus;
  onOpen?: () => void;
  onDownload?: () => void;
  locale?: Locale;
  labels?: Partial<Record<"open" | "download" | "generating" | "error", string>>;
  className?: string;
};

const ARTIFACT_ICON: Record<ArtifactKind, typeof DocumentTextLinear> = { document: DocumentTextLinear, code: CodeLinear, table: WidgetLinear, image: GalleryLinear, file: DocumentTextLinear };

/** A file, document or other output the agent produced, with open and download actions. */
export function ArtifactCard({ title, kind = "document", meta, status = "ready", onOpen, onDownload, locale = "zh", labels = {}, className }: ArtifactCardProps) {
  const Icon = ARTIFACT_ICON[kind];
  const text = { open: pick(locale, "打开", "Open"), download: pick(locale, "下载", "Download"), generating: pick(locale, "生成中…", "Generating…"), error: pick(locale, "生成失败", "Failed"), ...labels };
  const ready = status === "ready";
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border border-fg-grey-200 bg-white p-3", className)} data-artifact-status={status}>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", status === "error" ? "bg-fg-red-50 text-fg-red" : "bg-fg-blue-50 text-fg-blue")}>
        {status === "error" ? <DangerTriangleLinear size={20} color="currentColor" /> : <Icon size={20} color="currentColor" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold tracking-fg text-fg-black">{title}</span>
        <span className={cn("truncate text-xs tracking-fg", status === "error" ? "text-fg-red" : "text-fg-grey-700")}>
          {status === "generating" ? text.generating : status === "error" ? text.error : meta}
        </span>
      </div>
      {ready && onOpen && (
        <button type="button" onClick={onOpen} className="rounded-full px-3 py-1.5 text-sm font-semibold tracking-fg text-fg-blue hover:bg-fg-blue-50">{text.open}</button>
      )}
      {ready && onDownload && (
        <button type="button" aria-label={text.download} title={text.download} onClick={onDownload} className="inline-flex size-8 items-center justify-center rounded-lg text-fg-grey-700 hover:bg-fg-grey-100 hover:text-fg-black">
          <DownloadMinimalisticLinear size={16} color="currentColor" />
        </button>
      )}
    </div>
  );
}
