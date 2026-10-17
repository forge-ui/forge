"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MotionCollapse, MotionPresence, useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { IconButton } from "./icon-button";
import { Button } from "./button";
import { CloseCircleLinear, CheckCircleLinear, RefreshLinear } from "../../icons";

export interface ToastOptions { title: string; description?: string; /** Milliseconds; 0 keeps the notification until dismissed. */ duration?: number; status?: "loading" | "success" | "error"; action?: { label: string; onClick: () => void }; }
type Entry = ToastOptions & { id: string; open: boolean; revision: number };
export interface ToastApi { toast: (options: ToastOptions) => string; dismiss: (id: string) => void; update: (id: string, options: Partial<ToastOptions>) => void }
const Context = createContext<ToastApi | null>(null);
export function useToast(): ToastApi {
  const value = useContext(Context);
  if (!value) throw new Error("useToast requires ToastProvider");
  return value;
}

function ToastRow({ entry, motion, dismiss, remove, locale }: { entry: Entry; motion: MotionPreference; dismiss: (id: string) => void; remove: (id: string) => void; locale: "zh" | "en" }) {
  const reduced = useReducedMotion(motion);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(entry.duration ?? 4000);
  const row = useRef<HTMLLIElement>(null);
  const pointer = useRef<{ id: number; x: number } | null>(null);
  useEffect(() => { remaining.current = entry.duration ?? 4000; }, [entry.revision, entry.duration]);
  useEffect(() => {
    if (!entry.open || hovered || focused || entry.duration === 0) return;
    const start = Date.now();
    const timer = setTimeout(() => dismiss(entry.id), Math.max(0, remaining.current));
    return () => { clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (Date.now() - start)); };
  }, [entry.id, entry.open, entry.duration, entry.revision, hovered, focused, dismiss]);
  useEffect(() => {
    if (entry.open) return;
    const raw = row.current ? getComputedStyle(row.current).getPropertyValue("--forge-motion-exit-duration").trim() : "";
    const n = parseFloat(raw);
    const duration = Number.isFinite(n) ? n * (raw.endsWith("ms") ? 1 : 1000) : 120;
    const timer = setTimeout(() => remove(entry.id), reduced ? 0 : Math.max(0, duration));
    return () => clearTimeout(timer);
  }, [entry.open, entry.id, reduced, remove]);
  return <li className="forge-toast" data-toast-id={entry.id} ref={row} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onPointerDown={(event) => { if ((event.target as HTMLElement).closest("button")) return; pointer.current = { id: event.pointerId, x: event.clientX }; event.currentTarget.setPointerCapture?.(event.pointerId); setHovered(true); }}
    onPointerMove={(event) => { if (pointer.current?.id === event.pointerId) event.currentTarget.style.translate = `${event.clientX - pointer.current.x}px 0`; }}
    onPointerUp={(event) => { if (pointer.current?.id !== event.pointerId) return; if (Math.abs(event.clientX - pointer.current.x) > 100) dismiss(entry.id); pointer.current = null; event.currentTarget.style.translate = ""; setHovered(false); }}
    onPointerCancel={(event) => { pointer.current = null; event.currentTarget.style.translate = ""; setHovered(false); }}>
    <MotionCollapse open={entry.open} motion={motion}>
      <div className="pb-3"><MotionPresence open={entry.open} motion={motion} className="pointer-events-auto rounded-xl border border-fg-grey-200 bg-white p-4 shadow-lg">
        <div className="flex items-start gap-4">
          {entry.status && <span aria-hidden className={entry.status === "error" ? "text-fg-red" : "text-fg-grey-700"}>{entry.status === "loading" ? <RefreshLinear size={20} className={reduced ? "" : "forge-action-spinner"} /> : entry.status === "success" ? <CheckCircleLinear size={20} /> : <CloseCircleLinear size={20} />}</span>}
          <div role="status" className="min-w-0 flex-1"><p className="text-sm font-semibold text-fg-black">{entry.title}</p>{entry.description && <p className="mt-1 text-sm leading-6 text-fg-grey-700">{entry.description}</p>}</div>
          <IconButton aria-label={`${locale === "en" ? "Dismiss notification" : "关闭通知"}：${entry.title}`} variant="ghost" size="sm" motion={motion} onClick={() => dismiss(entry.id)}><CloseCircleLinear size={18} /></IconButton>
        </div>
        {entry.action && <div className="mt-3"><Button variant="secondary" size="sm" motion={motion} onClick={() => { entry.action!.onClick(); dismiss(entry.id); }}>{entry.action.label}</Button></div>}
        {entry.duration !== 0 && <div className="forge-toast-timer" aria-hidden data-paused={hovered || focused || undefined}><span key={entry.revision} style={{ animationDuration: `${entry.duration ?? 4000}ms`, animationName: reduced ? "none" : undefined }} /></div>}
      </MotionPresence></div>
    </MotionCollapse>
  </li>;
}

export function ToastProvider({ children, motion = "auto", locale = "zh", stacked = false }: { children: ReactNode; motion?: MotionPreference; locale?: "zh" | "en"; stacked?: boolean }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const prefix = useId();
  const list = useRef<HTMLOListElement>(null);
  const positions = useRef(new Map<string, number>());
  const reduced = useReducedMotion(motion);
  const order = entries.map(entry => entry.id).join("|");
  useLayoutEffect(() => {
    const next = new Map<string, number>();
    const animations: Animation[] = [];
    for (const row of list.current?.children ?? []) {
      const node = row as HTMLElement;
      const id = node.dataset.toastId!;
      const top = node.getBoundingClientRect().top;
      const previous = positions.current.get(id);
      next.set(id, top);
      if (!reduced && previous !== undefined && Math.abs(previous - top) > 1 && node.animate) {
        animations.push(node.animate([{ transform: `translateY(${previous - top}px)` }, { transform: "none" }], { duration: 200, easing: "cubic-bezier(.2,.8,.2,1)" }));
      }
    }
    positions.current = next;
    return () => animations.forEach(animation => animation.cancel());
  }, [order, reduced]);
  const counter = useRef(0);
  const toast = useCallback((options: ToastOptions) => {
    const id = `${prefix}-${++counter.current}`;
    setEntries(items => [...items, { ...options, id, open: true, revision: 0 }]);
    return id;
  }, [prefix]);
  const dismiss = useCallback((id: string) => setEntries(items => items.map(item => item.id === id ? { ...item, open: false } : item)), []);
  const remove = useCallback((id: string) => setEntries(items => items.filter(item => item.id !== id)), []);
  const update = useCallback((id: string, options: Partial<ToastOptions>) => setEntries(items => items.map(item => item.id === id ? { ...item, ...options, revision: item.revision + 1 } : item)), []);
  return <Context.Provider value={{ toast, dismiss, update }}>{children}{typeof document !== "undefined" && entries.length > 0 && createPortal(
    <ol ref={list} aria-label={locale === "en" ? "Notifications" : "通知"} data-stacked={stacked || undefined} data-motion={motion} className="forge-toast-list pointer-events-none fixed bottom-4 right-4 z-[100] w-[360px] max-w-[calc(100vw-2rem)] list-none p-0">
      {entries.map(entry => <ToastRow key={entry.id} entry={entry} motion={motion} locale={locale} dismiss={dismiss} remove={remove} />)}
    </ol>, document.body,
  )}</Context.Provider>;
}
