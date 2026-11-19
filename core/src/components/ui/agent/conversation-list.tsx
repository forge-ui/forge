"use client";

import { AnimatePresence, motion as animated } from "motion/react";
import { useState } from "react";
import { MagniferLinear, PenLinear, PenNewSquareLinear, PinLinear, TrashBinMinimalisticLinear } from "../../../icons";
import { Spinner, fieldInput, iconAction } from "../../../internal/agent-kit";
import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { pick, type AgentLocale } from "./agent-utils";

export type ConversationItem = {
  id: string;
  title: string;
  /** Last activity; groups the list into today, yesterday, this week and earlier. */
  updatedAt?: number | Date;
  /** First line of the last message, shown under the title. */
  preview?: string;
  pinned?: boolean;
  /** The agent is still working in this conversation. */
  running?: boolean;
  /** Has a reply the user has not read. */
  unread?: boolean;
};

export type ConversationListProps = {
  items: ConversationItem[];
  currentId?: string;
  onSelect: (id: string) => void;
  onNew?: () => void;
  onRename?: (id: string, title: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  /** Shows a search field once there are more items than this. */
  searchAfter?: number;
  /** Reference time for the groups; pass it when rendering on the server. */
  now?: number;
  locale?: AgentLocale;
  motion?: MotionPreference;
  className?: string;
};

const DAY = 86_400_000;

function groupOf(item: ConversationItem, now: number): "pinned" | "today" | "yesterday" | "week" | "earlier" | "none" {
  if (item.pinned) return "pinned";
  if (item.updatedAt === undefined) return "none";
  const time = item.updatedAt instanceof Date ? item.updatedAt.getTime() : item.updatedAt;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const start = today.getTime();
  if (time >= start) return "today";
  if (time >= start - DAY) return "yesterday";
  if (time >= start - 6 * DAY) return "week";
  return "earlier";
}

const GROUPS = [
  { key: "pinned", zh: "置顶", en: "Pinned" },
  { key: "today", zh: "今天", en: "Today" },
  { key: "yesterday", zh: "昨天", en: "Yesterday" },
  { key: "week", zh: "7 天内", en: "Previous 7 days" },
  { key: "earlier", zh: "更早", en: "Earlier" },
  { key: "none", zh: "", en: "" },
] as const;

/**
 * Earlier conversations: grouped by when they were last active, searchable, with pin, rename and
 * delete on each row, and a dot or spinner for unread replies and conversations still running.
 */
export function ConversationList({ items, currentId, onSelect, onNew, onRename, onDelete, onPin, searchAfter = 8, now: fixedNow, locale = "zh", motion = "auto", className }: ConversationListProps) {
  const reduced = useReducedMotion(motion);
  const [now] = useState(() => fixedNow ?? Date.now());
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string>();
  const [draft, setDraft] = useState("");
  const [deleting, setDeleting] = useState<string>();
  const needle = query.trim().toLowerCase();
  const shown = needle ? items.filter(item => `${item.title} ${item.preview ?? ""}`.toLowerCase().includes(needle)) : items;
  const reference = fixedNow ?? now;

  return (
    <nav aria-label={pick(locale, "历史对话", "Conversations")} className={cn("flex min-w-0 flex-col gap-2 tracking-fg", className)}>
      {onNew && (
        <button type="button" onClick={onNew} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-50">
          <PenNewSquareLinear size={16} />{pick(locale, "新对话", "New chat")}
        </button>
      )}
      {items.length > searchAfter && (
        <label className="relative flex items-center">
          <MagniferLinear size={14} color="var(--fg-grey-500)" className="pointer-events-none absolute left-3" />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder={pick(locale, "搜索对话", "Search")} aria-label={pick(locale, "搜索对话", "Search conversations")} className={cn(fieldInput, "py-2 pl-8")} />
        </label>
      )}
      {GROUPS.map(group => {
        const rows = shown.filter(item => groupOf(item, reference) === group.key);
        if (!rows.length) return null;
        return (
          <section key={group.key} className="flex flex-col gap-0.5">
            {group.zh && <h4 className="px-3 pb-0.5 pt-2 text-xs font-semibold text-fg-grey-500">{pick(locale, group.zh, group.en)}</h4>}
            <ul className="flex flex-col gap-0.5">
              <AnimatePresence initial={false}>
                {rows.map(item => {
                  const current = item.id === currentId;
                  return (
                    <animated.li
                      key={item.id}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.12 } }}
                      className={cn("group relative flex min-w-0 items-center rounded-xl transition-colors", current ? "bg-accent-soft" : "hover:bg-fg-grey-100")}
                    >
                      {editing === item.id ? (
                        <form className="flex min-w-0 flex-1 p-1" onSubmit={event => { event.preventDefault(); if (draft.trim()) onRename?.(item.id, draft.trim()); setEditing(undefined); }}>
                          <input autoFocus value={draft} onChange={event => setDraft(event.target.value)} onBlur={() => setEditing(undefined)} onKeyDown={event => { if (event.key === "Escape") setEditing(undefined); }} aria-label={pick(locale, "对话名称", "Conversation name")} className={cn(fieldInput, "py-1.5")} />
                        </form>
                      ) : deleting === item.id ? (
                        <div role="alertdialog" aria-label={pick(locale, "删除对话", "Delete conversation")} className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-sm">
                          <span className="min-w-0 flex-1 truncate text-fg-black">{pick(locale, `删除「${item.title}」？`, `Delete "${item.title}"?`)}</span>
                          <button type="button" onClick={() => setDeleting(undefined)} className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-fg-black hover:bg-fg-grey-200">{pick(locale, "取消", "Cancel")}</button>
                          <button type="button" onClick={() => { onDelete?.(item.id); setDeleting(undefined); }} className="shrink-0 rounded-full bg-fg-red px-2.5 py-1 text-xs font-bold text-white">{pick(locale, "删除", "Delete")}</button>
                        </div>
                      ) : (
                        <>
                          <button type="button" aria-current={current || undefined} onClick={() => onSelect(item.id)} className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left">
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className={cn("truncate text-sm", current ? "font-semibold text-accent" : "text-fg-black", item.unread && !current && "font-semibold")}>{item.title}</span>
                              {item.preview && <span className="truncate text-xs text-fg-grey-500">{item.preview}</span>}
                            </span>
                            {item.running ? <Spinner size={12} /> : item.unread && <span aria-label={pick(locale, "有新回复", "Unread")} className="size-2 shrink-0 rounded-full bg-accent" />}
                          </button>
                          {(onPin || onRename || onDelete) && (
                            <span className="absolute right-1 flex items-center rounded-lg bg-inherit opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                              {onPin && <button type="button" aria-label={item.pinned ? pick(locale, "取消置顶", "Unpin") : pick(locale, "置顶", "Pin")} aria-pressed={Boolean(item.pinned)} onClick={() => onPin(item.id, !item.pinned)} className={cn(iconAction, "aria-pressed:text-accent")}><PinLinear size={14} /></button>}
                              {onRename && <button type="button" aria-label={pick(locale, "重命名", "Rename")} onClick={() => { setEditing(item.id); setDraft(item.title); }} className={iconAction}><PenLinear size={14} /></button>}
                              {onDelete && <button type="button" aria-label={pick(locale, "删除", "Delete")} onClick={() => setDeleting(item.id)} className={cn(iconAction, "hover:text-fg-red")}><TrashBinMinimalisticLinear size={14} /></button>}
                            </span>
                          )}
                        </>
                      )}
                    </animated.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </section>
        );
      })}
      {!shown.length && <p className="px-3 py-6 text-center text-sm text-fg-grey-500">{needle ? pick(locale, "没有找到相关对话", "No matches") : pick(locale, "还没有对话", "No conversations yet")}</p>}
    </nav>
  );
}
