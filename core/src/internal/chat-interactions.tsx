"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AddCircleLinear, CloseCircleLinear, MicrophoneLinear } from "../icons";
import { useReducedMotion } from "./motion";
import type { MotionPreference } from "../lib/motion";
import type { ComposerReply, ComposerVoiceState } from "../components/ui/composer-types";

export type ChatReaction = { id: string; label: string; content: ReactNode; count: number; selected?: boolean };
export type ChatReactionOption = Pick<ChatReaction, "id" | "label" | "content">;

export function ChatReactions({ reactions, options, onChange, locale, motion }: {
  reactions: ChatReaction[]; options: ChatReactionOption[]; onChange: (id: string) => void; locale: "zh" | "en"; motion: MotionPreference;
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const reduced = useReducedMotion(motion);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return <div ref={root} className="forge-chat-reactions relative flex flex-wrap gap-1.5" data-motion={reduced ? "none" : motion} onKeyDown={event => {
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
  }}>
    {reactions.filter(item => item.count > 0).map(item => <button key={item.id} type="button" aria-pressed={Boolean(item.selected)} aria-label={`${item.label} · ${item.count}`} onClick={() => onChange(item.id)} className="forge-chat-reaction inline-flex min-h-8 items-center gap-1 rounded-lg border border-fg-grey-200 bg-white px-2 text-xs text-fg-black"><span aria-hidden>{item.content}</span>{item.count}</button>)}
    {options.length > 0 && <button ref={trigger} type="button" className="rounded-lg p-1 text-fg-grey-700" aria-label={locale === "zh" ? "添加反应" : "Add reaction"} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => { setOpen(!open); setCursor(0); }}><AddCircleLinear size={20} /></button>}
    {open && <div id={id} role="dialog" aria-label={locale === "zh" ? "选择反应" : "Choose a reaction"} className="forge-chat-reaction-picker absolute bottom-full left-0 z-20 mb-2 grid w-64 max-w-[calc(100vw-3rem)] grid-cols-6 gap-1 rounded-xl border border-fg-grey-200 bg-white p-2 shadow-sm" onKeyDown={event => {
      const delta = ({ ArrowRight: 1, ArrowLeft: -1, ArrowDown: 6, ArrowUp: -6 } as Record<string, number>)[event.key];
      if (delta !== undefined) { event.preventDefault(); const next = ((cursor + delta) % options.length + options.length) % options.length; setCursor(next); event.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus(); }
    }}>{options.map((item, index) => <button key={item.id} type="button" autoFocus={index === 0} tabIndex={cursor === index ? 0 : -1} onFocus={() => setCursor(index)} aria-label={item.label} className="h-9 w-full min-w-0 rounded-lg text-lg hover:bg-fg-grey-100" onClick={() => { onChange(item.id); setOpen(false); trigger.current?.focus(); }}>{item.content}</button>)}</div>}
  </div>;
}

export function ComposerContext({ replyTo, onCancelReply, attachments, locale }: { replyTo?: ComposerReply; onCancelReply?: () => void; attachments?: ReactNode; locale: "zh" | "en" }) {
  if (!replyTo && !attachments) return null;
  return <div className="flex w-full flex-col gap-2">
    {replyTo && <div className="forge-composer-reply flex items-center gap-3 rounded-lg bg-fg-grey-50 px-3 py-2 text-sm"><div className="min-w-0 flex-1"><p className="text-xs font-medium text-fg-grey-700">{locale === "zh" ? "回复" : "Replying to"} {replyTo.name}</p><p className="truncate text-fg-black">{replyTo.content}</p></div>{onCancelReply && <button type="button" aria-label={locale === "zh" ? "取消回复" : "Cancel reply"} onClick={onCancelReply}><CloseCircleLinear size={18} /></button>}</div>}
    {attachments}
  </div>;
}

export function ComposerVoice({ state, level = 0, onStart, onEnd, onCancel, disabled, locale, motion }: {
  state: ComposerVoiceState; level?: number; onStart: () => void; onEnd?: () => void; onCancel?: () => void; disabled?: boolean; locale: "zh" | "en"; motion?: MotionPreference;
}) {
  const held = useRef(false);
  const cancelRef = useRef(onCancel);
  useEffect(() => { cancelRef.current = onCancel; }, [onCancel]);
  useEffect(() => () => { if (held.current) { held.current = false; cancelRef.current?.(); } }, []);
  const reduced = useReducedMotion(motion);
  const start = () => { if (held.current || disabled || state === "processing") return; held.current = true; onStart(); };
  const end = (cancel: boolean) => { if (!held.current) return; held.current = false; if (cancel) onCancel?.(); else onEnd?.(); };
  const label = locale === "zh" ? state === "recording" ? "松开发送语音" : state === "processing" ? "正在识别" : "按住说话" : state === "recording" ? "Release to finish" : state === "processing" ? "Transcribing" : "Hold to talk";
  return <div className="flex items-center gap-2" data-voice-state={state}>
    {state !== "idle" && <span className="flex h-6 items-center gap-1" aria-hidden>{[.6, .9, 1, .8, .5].map((weight, index) => <i key={index} className="w-1 rounded-full bg-current" style={{ height: `${6 + 18 * Math.max(0, Math.min(1, level)) * weight}px`, transition: reduced ? "none" : "height 90ms linear" }} />)}</span>}
    <button type="button" disabled={disabled || state === "processing"} aria-label={label} className="rounded-lg p-2 text-fg-grey-700 hover:bg-fg-grey-100 disabled:opacity-50" style={{ touchAction: "none" }}
      onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); start(); }} onPointerUp={() => end(false)} onPointerCancel={() => end(true)} onLostPointerCapture={() => end(true)} onBlur={() => end(true)}
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); end(true); } else if ((event.key === " " || event.key === "Enter") && !event.repeat) { event.preventDefault(); start(); } }} onKeyUp={event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); end(false); } }} onContextMenu={event => event.preventDefault()}><MicrophoneLinear size={20} /></button>
  </div>;
}
