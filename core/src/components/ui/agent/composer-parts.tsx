"use client";

import { AnimatePresence, motion as animated } from "motion/react";
import { useState } from "react";
import {
  AltArrowDownLinear,
  AltArrowUpLinear,
  ArrowUpLinear,
  ChatRoundLineLinear,
  CheckCircleLinear,
  DangerTriangleLinear,
  PauseLinear,
  PenLinear,
  PlayBoldDuotone,
  PlusLinear,
  RefreshLinear,
  TrashBinMinimalisticLinear,
} from "../../../icons";
import { Collapse, Spinner, fieldInput, iconAction } from "../../../internal/agent-kit";
import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { FileTypeIcon } from "../forms/file-upload";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";

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
  motion?: MotionPreference;
  className?: string;
};

/** Messages written while the agent is still answering, waiting their turn above the composer. */
export function PromptQueue({ items, onRemove, onEdit, onSendNow, onMove, locale = "zh", motion = "auto", className }: PromptQueueProps) {
  const reduced = useReducedMotion(motion);
  const [editing, setEditing] = useState<string>();
  const [draft, setDraft] = useState("");
  if (!items.length) return null;
  return (
    <section aria-label={pick(locale, "排队中的消息", "Queued messages")} className={cn("flex flex-col gap-1 rounded-2xl bg-fg-grey-50 p-2 tracking-fg outline outline-1 outline-offset-[-1px] outline-fg-grey-200", className)}>
      <p className="px-2 pt-0.5 text-xs font-medium text-fg-grey-700">{pick(locale, `排队中 ${items.length} 条 · 当前回答结束后依次发送`, `${items.length} queued · sent after the current reply`)}</p>
      <ol className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <animated.li
              key={item.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              className="group flex min-w-0 items-center gap-2 rounded-xl bg-background py-1 pl-3 pr-1 text-sm text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
            >
              <span className="w-4 shrink-0 text-center text-xs tabular-nums text-fg-grey-500">{index + 1}</span>
              {editing === item.id ? (
                <form className="flex min-w-0 flex-1 items-center gap-1 py-0.5" onSubmit={event => { event.preventDefault(); if (draft.trim()) onEdit?.(item.id, draft.trim()); setEditing(undefined); }}>
                  <input autoFocus value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Escape") setEditing(undefined); }} aria-label={pick(locale, "编辑消息", "Edit message")} className={cn(fieldInput, "py-1.5")} />
                  <button type="submit" aria-label={pick(locale, "保存", "Save")} className={iconAction}><CheckCircleLinear size={16} color="var(--fg-green-500)" /></button>
                </form>
              ) : (
                <span className="min-w-0 flex-1 truncate py-1" title={item.text}>{item.text}{item.attachments ? <span className="ml-1.5 rounded-md bg-fg-grey-100 px-1.5 py-0.5 text-xs text-fg-grey-700">+{item.attachments}</span> : null}</span>
              )}
              {editing !== item.id && (
                <span className="flex shrink-0 items-center opacity-70 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {onMove && <button type="button" aria-label={pick(locale, "上移", "Move up")} disabled={index === 0} onClick={() => onMove(item.id, -1)} className={iconAction}><AltArrowUpLinear size={14} /></button>}
                  {onMove && <button type="button" aria-label={pick(locale, "下移", "Move down")} disabled={index === items.length - 1} onClick={() => onMove(item.id, 1)} className={iconAction}><AltArrowDownLinear size={14} /></button>}
                  {onEdit && <button type="button" aria-label={pick(locale, "编辑", "Edit")} onClick={() => { setEditing(item.id); setDraft(item.text); }} className={iconAction}><PenLinear size={14} /></button>}
                  {onSendNow && <button type="button" aria-label={pick(locale, "下一条就发", "Send next")} title={pick(locale, "下一条就发", "Send next")} onClick={() => onSendNow(item.id)} className={iconAction}><ArrowUpLinear size={14} /></button>}
                  {onRemove && <button type="button" aria-label={pick(locale, "移除", "Remove")} onClick={() => onRemove(item.id)} className={cn(iconAction, "hover:text-fg-red")}><TrashBinMinimalisticLinear size={14} /></button>}
                </span>
              )}
            </animated.li>
          ))}
        </AnimatePresence>
      </ol>
    </section>
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
  motion?: MotionPreference;
  className?: string;
};

const pillButton = "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium tracking-fg text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-100 disabled:opacity-50";

/** Everything a running agent needs in one bar: stop, resume, retry, dismiss, and a note to steer it. */
export function RunControls({ status, activity, startedAt, duration, error, onStop, onResume, onRetry, onDismiss, onSteer, locale = "zh", motion = "auto", className }: RunControlsProps) {
  const running = status === "running" || status === "stopping";
  const elapsed = useElapsed(startedAt, running);
  const time = duration ?? elapsed;
  const [note, setNote] = useState("");
  const [steering, setSteering] = useState(false);
  const word = status === "running" ? activity ?? pick(locale, "正在处理", "Working")
    : status === "stopping" ? pick(locale, "正在停止…", "Stopping…")
      : status === "stopped" ? pick(locale, "已停止，可以从这里继续", "Stopped — resume from here")
        : status === "failed" ? error ?? pick(locale, "运行失败", "Run failed")
          : pick(locale, "已完成", "Done");

  return (
    <section data-status={status} className={cn("flex flex-col rounded-2xl bg-background tracking-fg outline outline-1 outline-offset-[-1px]", status === "failed" ? "outline-fg-red-200" : "outline-fg-grey-200", className)}>
      <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1.5 py-2 pl-4 pr-2">
        {running ? <Spinner size={14} />
          : status === "failed" ? <DangerTriangleLinear size={16} color="var(--fg-red)" className="shrink-0" />
            : status === "done" ? <CheckCircleLinear size={16} color="var(--fg-green-500)" className="shrink-0" />
              : <PauseLinear size={16} color="var(--fg-grey-700)" className="shrink-0" />}
        <span role="status" key={word} className={cn("forge-fade-up min-w-[8rem] flex-1 truncate text-sm font-medium", status === "failed" ? "text-fg-red" : "text-fg-black", status === "running" && "forge-text-shimmer")}>{word}</span>
        {time !== undefined && <span className="shrink-0 tabular-nums text-xs text-fg-grey-500">{formatDuration(time, locale)}</span>}
        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          {running && onSteer && <button type="button" onClick={() => setSteering(value => !value)} aria-expanded={steering} className={cn(pillButton, steering && "bg-fg-grey-100")}><ChatRoundLineLinear size={14} />{pick(locale, "插一句", "Steer")}</button>}
          {running && onStop && <button type="button" disabled={status === "stopping"} onClick={onStop} className={pillButton}><span className="size-2.5 rounded-[3px] bg-fg-black" />{pick(locale, "停止", "Stop")}</button>}
          {status === "stopped" && onResume && <button type="button" onClick={onResume} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-medium text-accent-foreground hover:opacity-90"><PlayBoldDuotone size={14} />{pick(locale, "继续", "Resume")}</button>}
          {(status === "failed" || status === "stopped") && onRetry && <button type="button" onClick={onRetry} className={pillButton}><RefreshLinear size={14} />{pick(locale, "重试", "Retry")}</button>}
          {!running && onDismiss && <button type="button" aria-label={pick(locale, "关闭", "Dismiss")} onClick={onDismiss} className={iconAction}><PlusLinear size={16} className="rotate-45" /></button>}
        </span>
      </div>
      <Collapse open={running && steering && Boolean(onSteer)} motion={motion}>
        <form className="flex items-center gap-2 border-t border-fg-grey-200 px-3 py-2.5" onSubmit={event => { event.preventDefault(); if (!note.trim()) return; onSteer?.(note.trim()); setNote(""); setSteering(false); }}>
          <input autoFocus value={note} onChange={event => setNote(event.target.value)} placeholder={pick(locale, "补充一句，它下一步会看到", "Add a note for its next step")} aria-label={pick(locale, "补充说明", "Steering note")} className={cn(fieldInput, "py-2")} />
          <button type="submit" disabled={!note.trim()} className="inline-flex h-9 shrink-0 items-center rounded-full bg-accent px-3.5 text-xs font-medium text-accent-foreground disabled:opacity-50">{pick(locale, "发送", "Send")}</button>
        </form>
      </Collapse>
    </section>
  );
}

/* ───────────────────────── AttachmentList ───────────────────────── */

export type AttachmentKind = "image" | "document" | "sheet" | "file";

export type AttachmentItem = {
  id: string;
  /** File name; its extension picks the file-type icon. */
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

/** Files attached to a message: file-type icons or thumbnails, upload progress, errors with retry. */
export function AttachmentList({ items, onRemove, onRetry, onOpen, locale = "zh", className }: AttachmentListProps) {
  if (!items.length) return null;
  return (
    <ul aria-label={pick(locale, "附件", "Attachments")} className={cn("flex flex-wrap gap-2 tracking-fg", className)}>
      {items.map(item => {
        const uploading = item.progress !== undefined && item.progress < 100 && !item.error;
        return (
          <li key={item.id} className={cn("forge-fade-up group relative flex w-60 max-w-full items-center gap-2.5 overflow-hidden rounded-xl bg-background py-2 pl-2 pr-1.5 outline outline-1 outline-offset-[-1px]", item.error ? "bg-fg-red-50 outline-fg-red-200" : "outline-fg-grey-200")}>
            <button type="button" disabled={!onOpen} onClick={() => onOpen?.(item.id)} aria-label={pick(locale, `打开 ${item.name}`, `Open ${item.name}`)} className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg enabled:hover:opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element -- core does not depend on Next.js images */}
              {item.previewUrl ? <img src={item.previewUrl} alt="" className="size-full object-cover" /> : <FileTypeIcon fileName={item.name} dim={uploading} className="size-9" />}
            </button>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-fg-black" title={item.name}>{item.name}</span>
              <span className={cn("truncate text-xs", item.error ? "text-fg-red" : "text-fg-grey-500")}>
                {item.error ?? (uploading ? pick(locale, `上传中 ${Math.round(item.progress ?? 0)}%`, `Uploading ${Math.round(item.progress ?? 0)}%`) : item.size !== undefined ? formatSize(item.size) : "")}
              </span>
            </span>
            {item.error && onRetry && <button type="button" aria-label={pick(locale, `重试上传 ${item.name}`, `Retry ${item.name}`)} onClick={() => onRetry(item.id)} className={iconAction}><RefreshLinear size={14} /></button>}
            {onRemove && <button type="button" aria-label={pick(locale, `移除 ${item.name}`, `Remove ${item.name}`)} onClick={() => onRemove(item.id)} className={iconAction}><PlusLinear size={16} className="rotate-45" /></button>}
            {uploading && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-fg-grey-100"><span className="block h-full bg-accent transition-[width] duration-300" style={{ width: `${item.progress}%` }} /></span>}
          </li>
        );
      })}
    </ul>
  );
}
