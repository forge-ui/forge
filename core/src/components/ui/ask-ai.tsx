"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { CloseCircleLinear } from "solar-icon-set";
import { AskAiIcon } from "../../internal/ask-ai-icon";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import type { AccentColor } from "./accent-utils";
import { Checkbox } from "./checkbox";

export interface AskAiLink {
  label: string;
  href: string;
}

export interface AskAiResponse {
  text: string;
  links?: AskAiLink[];
}

export interface AskAiMessage {
  role: "user" | "assistant";
  content: string;
  links?: AskAiLink[];
}

export interface AskAiRequest {
  /** Only included when the user enables page context. */
  context?: string;
  messages: AskAiMessage[];
  signal: AbortSignal;
}

export interface AskAiProps {
  /** Accent for controls; PageHeader supplies its own color when embedded. */
  color?: AccentColor;
  label?: string;
  /** Human-readable page title or path; supplied explicitly by the application. */
  context?: string;
  suggestions?: string[];
  placeholder?: string;
  /** Return plain text or text with business links. At most two safe links are shown. */
  onSend: (message: string, request: AskAiRequest) => string | AskAiResponse | Promise<string | AskAiResponse>;
  disabled?: boolean;
  className?: string;
}

function responseLinks(links: AskAiLink[] = []): AskAiLink[] {
  return links.filter(({ label, href }) => {
    if (!label.trim() || !href.trim()) return false;
    try {
      return ["http:", "https:"].includes(new URL(href, "https://forge.local").protocol);
    } catch {
      return false;
    }
  }).slice(0, 2).map(({ label, href }) => ({ label: label.trim(), href: href.trim() }));
}

/** Header entry and modal conversation drawer. No network calls or page scraping. */
export function AskAi({ color = "purple", label = "Ask AI", context, suggestions = ["这个页面可以做什么？", "下一步该做什么？", "帮我总结当前内容"], placeholder = "输入问题…", onSend, disabled, className }: AskAiProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [open, setOpen] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<AskAiMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
    };
    document.addEventListener("keydown", escape);
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", escape);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);
  useEffect(() => {
    if (open && conversationRef.current) conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [open, messages, pending, error]);

  async function send(question: string, retry = false) {
    const text = question.trim();
    if (!text || requestRef.current || disabled) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const history: AskAiMessage[] = retry ? messages : [...messages, { role: "user", content: text }];
    setMessages(history);
    setDraft("");
    setError(null);
    setFailedQuestion(null);
    setPending(true);
    try {
      const response = await onSend(text, {
        context: includeContext ? context : undefined,
        messages: history.map((message) => ({ ...message, ...(message.links && { links: message.links.map((link) => ({ ...link })) }) })),
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      const reply = typeof response === "string" ? { text: response } : response;
      if (!reply.text.trim()) throw new Error("Empty response");
      const links = responseLinks(reply.links);
      setMessages([...history, { role: "assistant", content: reply.text, ...(links.length > 0 && { links }) }]);
    } catch {
      if (!controller.signal.aborted) {
        setError("回复暂时未能完成，请重试。");
        setFailedQuestion(text);
      }
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setPending(false);
      }
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }

  return (
    <>
      <button ref={triggerRef} type="button" aria-label={label} aria-haspopup="dialog"
        aria-expanded={open} aria-controls={open ? `${id}-dialog` : undefined}
        disabled={disabled} onClick={() => setOpen(true)}
        className={cn("shrink-0 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-3 md:px-4 text-fg-grey-700 outline outline-1 -outline-offset-1 outline-fg-grey-200 hover:bg-fg-grey-100 focus-visible:ring-2 focus-visible:ring-fg-grey-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", className)}>
        <AskAiIcon />
        <span className="hidden md:inline text-sm font-semibold whitespace-nowrap">{label}</span>
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <dialog ref={dialogRef} id={`${id}-dialog`} aria-labelledby={`${id}-title`} aria-modal="true"
          onKeyDown={(event) => {
            if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); }
          }}
          onCancel={(event) => { event.preventDefault(); setOpen(false); }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false);
          }}
          className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-[460px] border-0 border-l border-fg-grey-200 bg-white p-0 text-fg-black shadow-xl backdrop:bg-fg-black/30">
          <div className="flex h-full min-h-0 flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-fg-grey-200 px-5 py-4">
              <h2 id={`${id}-title`} className="flex items-center gap-2 text-base font-semibold"><AskAiIcon />{label}</h2>
              <button type="button" aria-label="关闭 Ask AI" onClick={() => setOpen(false)} className="rounded-full p-2 text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2"><CloseCircleLinear size={20} /></button>
            </header>
            {context && <div className="mx-4 mt-4 flex shrink-0 items-center gap-3 rounded-xl border border-dashed border-fg-grey-200 bg-fg-grey-50 px-3 py-3">
              <span className="shrink-0 text-xs font-semibold text-fg-grey-700">当前页</span>
              <span title={context} className="min-w-0 flex-1 truncate text-xs text-fg-grey-500">{context}</span>
              <Checkbox color={color} aria-label="带当前页" checked={includeContext} onChange={setIncludeContext} disabled={pending} />
              <span className="shrink-0 text-xs text-fg-grey-700">带当前页</span>
            </div>}
            <div ref={conversationRef} className="min-h-0 flex-1 overflow-y-auto p-5">
              {messages.length === 0 && <div className="flex flex-col gap-5">
                <p className="text-sm leading-6 text-fg-grey-700">{context && includeContext ? "结合当前页面，帮你理解内容、梳理步骤和解答问题。" : "告诉我你想了解什么，我来帮你梳理。"}</p>
                <div className="flex flex-col gap-2">
                  {suggestions.map((question, index) => <button key={`${index}-${question}`} type="button" disabled={disabled} onClick={() => void send(question)} className="rounded-xl border border-fg-grey-200 px-3 py-3 text-left text-sm text-fg-grey-700 hover:bg-fg-grey-100 disabled:opacity-50">{question}</button>)}
                </div>
              </div>}
              <div role="log" aria-label="对话记录" aria-live="polite" className="flex flex-col gap-5">
                {messages.map((message, index) => <div key={index} className={cn("flex flex-col gap-1.5", message.role === "user" && "items-end")}>
                  <span className="text-xs text-fg-grey-500">{message.role === "user" ? "你" : label}</span>
                  <p className={cn("max-w-full whitespace-pre-wrap break-words text-sm leading-6", message.role === "user" && "rounded-2xl bg-fg-grey-100 px-4 py-3")}>{message.content}</p>
                  {message.role === "assistant" && message.links && <div className="flex flex-wrap gap-2">
                    {message.links.map((link, linkIndex) => <a key={linkIndex} href={link.href} className="max-w-full break-words rounded-xl border border-fg-grey-200 px-3 py-2 text-sm font-semibold text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-fg-grey-500">{link.label}</a>)}
                  </div>}
                </div>)}
              </div>
              {pending && <p role="status" className="mt-5 text-sm text-fg-grey-500">正在思考…</p>}
              {error && <div className="mt-5 flex items-center gap-3"><p role="alert" className="text-sm text-fg-red">{error}</p><Button size="sm" variant="tertiary" color="grey" onClick={() => failedQuestion && void send(failedQuestion, true)}>重试</Button></div>}
            </div>
            <form onSubmit={submit} className="flex shrink-0 items-end gap-2 border-t border-fg-grey-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <textarea ref={inputRef} aria-label="向 AI 提问" placeholder={placeholder} rows={2} value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(draft); }
                }}
                className="min-w-0 flex-1 resize-none rounded-xl border border-fg-grey-200 px-3 py-2.5 text-sm leading-5 placeholder:text-fg-grey-500 focus:outline-fg-grey-500" />
              <Button color={color} type="submit" size="md" disabled={pending || disabled || !draft.trim()}>发送</Button>
            </form>
          </div>
        </dialog>, document.body,
      )}
    </>
  );
}
