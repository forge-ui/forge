"use client";

import { useState } from "react";
import {
  AltArrowDownLinear,
  AltArrowUpLinear,
  ArrowUpLinear,
  ChatRoundLineLinear,
  CheckCircleLinear,
  DangerTriangleLinear,
  DocumentTextLinear,
  FileTextLinear,
  GalleryLinear,
  PauseLinear,
  PenLinear,
  PlayBoldDuotone,
  PlusLinear,
  RefreshLinear,
  TrashBinMinimalisticLinear,
} from "../../../icons";
import { cn } from "../../../lib/utils";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";

const iconButton = "flex size-6 shrink-0 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-100 hover:text-fg-black disabled:opacity-40";

/* ───────────────────────── PromptQueue ───────────────────────── */

export type QueuedPrompt = { id: string; text: string; attachments?: number };

export type PromptQueueProps = {
  items: QueuedPrompt[];
  onRemove?: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
  /** Sends this one next, ahead of the rest. */
  onSendNow?: (id: string) => void;
  onMove?: (id: string, direction: -1 | 1) => void;
  locale?: AgentLocale;
  className?: string;
};

/** Messages written while the agent is still answering, waiting their turn above the composer. */
export function PromptQueue({ items, onRemove, onEdit, onSendNow, onMove, locale = "zh", className }: PromptQueueProps) {
  const [editing, setEditing] = useState<string>();
  const [draft, setDraft] = useState("");
  if (!items.length) return null;
  return (
    <div aria-label={pick(locale, "排队中的消息", "Queued messages")} className={cn("flex flex-col gap-1 rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-1.5 tracking-fg", className)}>
      <p className="px-1.5 text-[11px] font-medium text-fg-grey-700">{pick(locale, `排队中 ${items.length} 条 · 当前回答结束后依次发送`, `${items.length} queued · sent after the current reply`)}</p>
      <ol className="flex flex-col gap-1">
        {items.map((item, index) => (
          <li key={item.id} className="group flex min-w-0 items-center gap-1.5 rounded-lg bg-background px-2 py-1.5 text-[13px] text-fg-black">
            <span className="w-4 shrink-0 text-center tabular-nums text-[11px] text-fg-grey-500">{index + 1}</span>
            {editing === item.id ? (
              <form className="flex min-w-0 flex-1 gap-1" onSubmit={event => { event.preventDefault(); if (draft.trim()) onEdit?.(item.id, draft.trim()); setEditing(undefined); }}>
                <input autoFocus value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Escape") setEditing(undefined); }} aria-label={pick(locale, "编辑消息", "Edit message")} className="min-w-0 flex-1 rounded-md border border-fg-grey-200 px-2 py-0.5 text-[13px] outline-none focus:border-accent" />
                <button type="submit" aria-label={pick(locale, "保存", "Save")} className={iconButton}><CheckCircleLinear size={14} /></button>
              </form>
            ) : (
              <span className="min-w-0 flex-1 truncate" title={item.text}>{item.text}{item.attachments ? <span className="ml-1 text-fg-grey-500">+{item.attachments}</span> : null}</span>
            )}
            {editing !== item.id && (
              <span className="flex shrink-0 items-center opacity-60 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {onMove && <button type="button" aria-label={pick(locale, "上移", "Move up")} disabled={index === 0} onClick={() => onMove(item.id, -1)} className={iconButton}><AltArrowUpLinear size={12} /></button>}
                {onMove && <button type="button" aria-label={pick(locale, "下移", "Move down")} disabled={index === items.length - 1} onClick={() => onMove(item.id, 1)} className={iconButton}><AltArrowDownLinear size={12} /></button>}
                {onEdit && <button type="button" aria-label={pick(locale, "编辑", "Edit")} onClick={() => { setEditing(item.id); setDraft(item.text); }} className={iconButton}><PenLinear size={12} /></button>}
                {onSendNow && <button type="button" aria-label={pick(locale, "下一条就发", "Send next")} title={pick(locale, "下一条就发", "Send next")} onClick={() => onSendNow(item.id)} className={iconButton}><ArrowUpLinear size={12} /></button>}
                {onRemove && <button type="button" aria-label={pick(locale, "移除", "Remove")} onClick={() => onRemove(item.id)} className={iconButton}><TrashBinMinimalisticLinear size={12} /></button>}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────────────────── RunControls ───────────────────────── */

export type RunStatus = "running" | "stopping" | "stopped" | "failed" | "done";

export type RunControlsProps = {
  status: RunStatus;
  /** What the agent is doing now, e.g. "正在核对 3 张发票". */
  activity?: string;
  startedAt?: number | Date;
  duration?: number;
  /** Shown when failed. */
  error?: string;
  onStop?: () => void;
  /** Continue a stopped run from where it stopped. */
  onResume?: () => void;
  onRetry?: () => void;
  onDismiss?: () => void;
  /** Steer while it works: the note is picked up at the agent's next step. */
  onSteer?: (note: string) => void;
  locale?: AgentLocale;
  className?: string;
};

/** Everything a running agent needs in one strip: stop, resume, retry, dismiss, and a note to steer it. */
export function RunControls({ status, activity, startedAt, duration, error, onStop, onResume, onRetry, onDismiss, onSteer, locale = "zh", className }: RunControlsProps) {
  const running = status === "running" || status === "stopping";
  const elapsed = useElapsed(startedAt, running);
  const time = duration ?? elapsed;
  const [note, setNote] = useState("");
  const [steering, setSteering] = useState(false);
  const word = status === "running" ? activity ?? pick(locale, "正在处理", "Working")
    : status === "stopping" ? pick(locale, "正在停止…", "Stopping…")
      : status === "stopped" ? pick(locale, "已停止", "Stopped")
        : status === "failed" ? error ?? pick(locale, "运行失败", "Run failed")
          : pick(locale, "已完成", "Done");
  const button = "inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-fg-black hover:bg-fg-grey-100 disabled:opacity-50";

  return (
    <div data-status={status} className={cn("flex flex-col gap-1.5 rounded-xl border bg-background px-2.5 py-1.5 tracking-fg", status === "failed" ? "border-fg-red-200" : "border-fg-grey-200", className)}>
      <div className="flex min-w-0 items-center gap-2 text-[13px]">
        {running ? <span aria-hidden="true" className="size-3 shrink-0 animate-spin rounded-full border-[1.5px] border-fg-grey-300 border-t-accent" />
          : status === "failed" ? <DangerTriangleLinear size={14} color="var(--fg-red)" className="shrink-0" />
            : status === "done" ? <CheckCircleLinear size={14} color="var(--fg-green-500)" className="shrink-0" />
              : <PauseLinear size={14} color="var(--fg-grey-700)" className="shrink-0" />}
        <span role="status" className={cn("min-w-0 flex-1 truncate", status === "failed" ? "text-fg-red" : "text-fg-black", status === "running" && "forge-text-shimmer")}>{word}</span>
        {time !== undefined && <span className="shrink-0 tabular-nums text-xs text-fg-grey-500">{formatDuration(time, locale)}</span>}
        <span className="flex shrink-0 items-center">
          {running && onSteer && <button type="button" onClick={() => setSteering(value => !value)} aria-expanded={steering} className={button}><ChatRoundLineLinear size={14} />{pick(locale, "插一句", "Steer")}</button>}
          {running && onStop && <button type="button" disabled={status === "stopping"} onClick={onStop} className={button}><span className="size-2.5 rounded-[2px] bg-fg-black" />{pick(locale, "停止", "Stop")}</button>}
          {status === "stopped" && onResume && <button type="button" onClick={onResume} className={button}><PlayBoldDuotone size={14} />{pick(locale, "继续", "Resume")}</button>}
          {(status === "failed" || status === "stopped") && onRetry && <button type="button" onClick={onRetry} className={button}><RefreshLinear size={14} />{pick(locale, "重试", "Retry")}</button>}
          {!running && onDismiss && <button type="button" aria-label={pick(locale, "关闭", "Dismiss")} onClick={onDismiss} className={cn(button, "px-1.5")}><PlusLinear size={14} className="rotate-45" /></button>}
        </span>
      </div>
      {running && steering && onSteer && (
        <form className="flex gap-1.5 pb-1" onSubmit={event => { event.preventDefault(); if (!note.trim()) return; onSteer(note.trim()); setNote(""); setSteering(false); }}>
          <input autoFocus value={note} onChange={event => setNote(event.target.value)} placeholder={pick(locale, "补充一句，它下一步会看到", "Add a note for its next step")} aria-label={pick(locale, "补充说明", "Steering note")} className="min-w-0 flex-1 rounded-lg border border-fg-grey-200 px-2.5 py-1 text-[13px] text-fg-black outline-none placeholder:text-fg-grey-500 focus:border-accent" />
          <button type="submit" disabled={!note.trim()} className={cn(button, "bg-fg-grey-100")}>{pick(locale, "发送", "Send")}</button>
        </form>
      )}
    </div>
  );
}

/* ───────────────────────── AttachmentList ───────────────────────── */

export type AttachmentKind = "image" | "document" | "sheet" | "file";

export type AttachmentItem = {
  id: string;
  name: string;
  /** Bytes. */
  size?: number;
  kind?: AttachmentKind;
  /** Thumbnail for images. */
  previewUrl?: string;
  /** Upload progress from 0 to 100; omit when done. */
  progress?: number;
  error?: string;
};

export type AttachmentListProps = {
  items: AttachmentItem[];
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  onOpen?: (id: string) => void;
  locale?: AgentLocale;
  className?: string;
};

const formatSize = (bytes: number) => bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : bytes >= 1024 ? `${Math.round(bytes / 1024)} KB` : `${bytes} B`;
const KIND_ICON = { image: GalleryLinear, document: DocumentTextLinear, sheet: FileTextLinear, file: FileTextLinear } as const;

/** Files attached to a message: thumbnails or type icons, upload progress, errors with retry. */
export function AttachmentList({ items, onRemove, onRetry, onOpen, locale = "zh", className }: AttachmentListProps) {
  if (!items.length) return null;
  return (
    <ul aria-label={pick(locale, "附件", "Attachments")} className={cn("flex flex-wrap gap-1.5 tracking-fg", className)}>
      {items.map(item => {
        const Icon = KIND_ICON[item.kind ?? "file"];
        const uploading = item.progress !== undefined && item.progress < 100 && !item.error;
        return (
          <li key={item.id} className={cn("group relative flex max-w-56 items-center gap-2 overflow-hidden rounded-lg border bg-background py-1 pl-1 pr-2 text-xs", item.error ? "border-fg-red-200" : "border-fg-grey-200")}>
            <button type="button" disabled={!onOpen} onClick={() => onOpen?.(item.id)} className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-fg-grey-100 text-fg-grey-700 enabled:hover:opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element -- core does not depend on Next.js images */}
              {item.previewUrl ? <img src={item.previewUrl} alt="" className="size-full object-cover" /> : <Icon size={16} />}
            </button>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-fg-black" title={item.name}>{item.name}</span>
              <span className={cn("truncate text-[11px]", item.error ? "text-fg-red" : "text-fg-grey-500")}>
                {item.error ?? (uploading ? pick(locale, `上传中 ${Math.round(item.progress ?? 0)}%`, `Uploading ${Math.round(item.progress ?? 0)}%`) : item.size !== undefined ? formatSize(item.size) : "")}
              </span>
            </span>
            {item.error && onRetry && <button type="button" aria-label={pick(locale, `重试上传 ${item.name}`, `Retry ${item.name}`)} onClick={() => onRetry(item.id)} className={iconButton}><RefreshLinear size={12} /></button>}
            {onRemove && <button type="button" aria-label={pick(locale, `移除 ${item.name}`, `Remove ${item.name}`)} onClick={() => onRemove(item.id)} className={iconButton}><PlusLinear size={14} className="rotate-45" /></button>}
            {uploading && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-fg-grey-100"><span className="block h-full bg-accent transition-[width]" style={{ width: `${item.progress}%` }} /></span>}
          </li>
        );
      })}
    </ul>
  );
}
