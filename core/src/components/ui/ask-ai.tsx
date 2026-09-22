"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseCircleLinear, FullScreenLinear } from "solar-icon-set";
import { AskAiIcon } from "../../internal/ask-ai-icon";
import { AskHistoryDropdown } from "../../internal/ask-ai-history";
import {
  ASK_AI_FS_LAYER_ATTR,
  ASK_AI_FULLSCREEN_RAIL_WIDTH,
  AskAiFullscreenLayer,
} from "../../internal/ask-ai-fullscreen";
import type {
  AskAiLink,
  AskAiMessage,
  AskAiRequest,
  AskAiResponse,
  AskAiSessionItem,
} from "../../internal/ask-ai-types";
import { cn } from "../../lib/utils";
import type { AccentColor } from "./accent-utils";
import { Button } from "./button";
import { IconButton } from "./icon-button";

const EMPTY_MESSAGES: AskAiMessage[] = [];

export { ASK_AI_FS_LAYER_ATTR, ASK_AI_FULLSCREEN_RAIL_WIDTH };
export type {
  AskAiLink,
  AskAiMessage,
  AskAiRequest,
  AskAiResponse,
  AskAiSessionItem,
} from "../../internal/ask-ai-types";

export interface AskAiProps {
  /** Overrides the surrounding accent. Omit to follow the nearest data-accent, or the kit default. */
  color?: AccentColor;
  label?: string;
  suggestions?: string[];
  placeholder?: string;
  /** Return plain text or text with business links. At most two safe links are shown. */
  onSend: (message: string, request: AskAiRequest) => string | AskAiResponse | Promise<string | AskAiResponse>;
  disabled?: boolean;
  className?: string;
  /** Replace the entire drawer header (brand, session, tools). */
  header?: ReactNode;
  /** Replace the Ask mark + title in the drawer header and fullscreen rail. */
  brand?: ReactNode;
  /** Replace session chrome (drawer header extras / fullscreen history). */
  session?: ReactNode;
  /** Replace the conversation / empty-state body. */
  messages?: ReactNode;
  /**
   * Replace the default composer (textarea + 发送).
   * Consumers can swap in PromptBar once the agent package is published.
   */
  composer?: ReactNode;
  /** Controlled fullscreen layer. Independent of the drawer — not a stretched dialog. */
  fullscreen?: boolean;
  /** Uncontrolled initial fullscreen when `fullscreen` is omitted. */
  defaultFullscreen?: boolean;
  onFullscreenChange?: (open: boolean) => void;
  /** Drawer header control that opens the fullscreen layer. Default true. */
  showFullscreenTrigger?: boolean;
  /** Session list for the default fullscreen rail. Displayed as given; core does not filter. */
  sessions?: AskAiSessionItem[];
  currentSessionId?: string;
  onNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  /**
   * Force fullscreen landing vs chat layout.
   * Defaults to the built-in conversation length (or chat layout when `messages` is passed).
   */
  hasConversation?: boolean;
  landingTitle?: string;
  /** Fullscreen rail title when `brand` is omitted. */
  railLabel?: string;
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

const DEFAULT_SUGGESTIONS = ["这个页面可以做什么？", "下一步该做什么？", "帮我总结当前内容"];

/** Header entry, modal conversation drawer, and optional fullscreen shell. No network calls or page scraping. */
export function AskAi({
  color,
  label = "Ask AI",
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "输入问题…",
  onSend,
  disabled,
  className,
  header,
  brand,
  session,
  messages: messagesSlot,
  composer,
  fullscreen,
  defaultFullscreen = false,
  onFullscreenChange,
  showFullscreenTrigger = true,
  sessions,
  currentSessionId,
  onNewSession,
  onSelectSession,
  searchQuery,
  onSearchQueryChange,
  hasConversation,
  landingTitle,
  railLabel,
}: AskAiProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const enteredFromDrawerRef = useRef(false);
  const skipTriggerFocusRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [inheritedAccent, setInheritedAccent] = useState<AccentColor | undefined>();
  const accent = color ?? inheritedAccent;
  const [draft, setDraft] = useState("");
  const sessionsControlled = sessions !== undefined;
  const [internalSessions, setInternalSessions] = useState<AskAiSessionItem[]>([]);
  const sessionList = sessions ?? internalSessions;
  const [pickedId, setPickedId] = useState<string | null>(currentSessionId ?? null);
  const activeId = currentSessionId !== undefined ? currentSessionId : pickedId;
  const threadKey = activeId || "default";
  const [threads, setThreads] = useState<Record<string, AskAiMessage[]>>({});
  const threadsRef = useRef(threads);
  threadsRef.current = threads;
  const conversation = threads[threadKey] ?? EMPTY_MESSAGES;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null);
  const [internalFullscreen, setInternalFullscreen] = useState(defaultFullscreen);
  const fullscreenControlled = fullscreen !== undefined;
  const fullscreenOpen = fullscreenControlled ? fullscreen : internalFullscreen;
  const fullscreenControlledRef = useRef(fullscreenControlled);
  const onFullscreenChangeRef = useRef(onFullscreenChange);
  fullscreenControlledRef.current = fullscreenControlled;
  onFullscreenChangeRef.current = onFullscreenChange;

  function setFullscreenOpen(next: boolean) {
    if (!fullscreenControlled) setInternalFullscreen(next);
    onFullscreenChange?.(next);
  }

  function enterFullscreen() {
    if (open) {
      enteredFromDrawerRef.current = true;
      skipTriggerFocusRef.current = true;
      setOpen(false);
    }
    setFullscreenOpen(true);
  }

  function exitFullscreen() {
    const fromDrawer = enteredFromDrawerRef.current;
    enteredFromDrawerRef.current = false;
    setFullscreenOpen(false);
    if (fromDrawer) setOpen(true);
  }

  function writeThread(key: string, next: AskAiMessage[]) {
    const updated = { ...threadsRef.current, [key]: next };
    threadsRef.current = updated;
    setThreads(updated);
  }

  function selectSession(id: string) {
    if (currentSessionId === undefined) setPickedId(id);
    setError(null);
    setFailedQuestion(null);
    onSelectSession?.(id);
  }

  function startNewSession() {
    setDraft("");
    setError(null);
    setFailedQuestion(null);
    if (!sessionsControlled) {
      const id = `ask-${Date.now()}`;
      setInternalSessions((prev) => [{ id, title: "新对话" }, ...prev]);
      setPickedId(id);
    }
    onNewSession?.();
  }

  useEffect(() => () => requestRef.current?.abort(), []);
  useLayoutEffect(() => {
    const value = triggerRef.current?.closest("[data-accent]")?.getAttribute("data-accent");
    setInheritedAccent(value === "purple" || value === "blue" || value === "black" ? value : undefined);
  }, [open, fullscreenOpen]);
  useEffect(() => {
    if (fullscreenOpen && open) {
      enteredFromDrawerRef.current = true;
      skipTriggerFocusRef.current = true;
      setOpen(false);
    }
  }, [fullscreenOpen, open]);
  useEffect(() => {
    if (fullscreenOpen) {
      const previousOverflow = document.body.style.overflow;
      const escape = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const fromDrawer = enteredFromDrawerRef.current;
        enteredFromDrawerRef.current = false;
        if (!fullscreenControlledRef.current) setInternalFullscreen(false);
        onFullscreenChangeRef.current?.(false);
        if (fromDrawer) setOpen(true);
      };
      document.addEventListener("keydown", escape, true);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", escape, true);
        document.body.style.overflow = previousOverflow;
      };
    }
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
      if (skipTriggerFocusRef.current) {
        skipTriggerFocusRef.current = false;
        return;
      }
      trigger?.focus();
    };
  }, [open, fullscreenOpen]);
  useEffect(() => {
    if (open && conversationRef.current) conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [open, conversation, pending, error]);

  async function send(question: string, retry = false) {
    const text = question.trim();
    if (!text || requestRef.current || disabled) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const sentKey = threadKey;
    const prior = threadsRef.current[sentKey] ?? [];
    const history: AskAiMessage[] = retry ? prior : [...prior, { role: "user", content: text }];
    writeThread(sentKey, history);
    if (!sessionsControlled && activeId) {
      setInternalSessions((prev) => prev.map((item) => (
        item.id === activeId && item.title === "新对话"
          ? { ...item, title: text.replace(/\s+/g, " ").slice(0, 80) }
          : item
      )));
    }
    setDraft("");
    setError(null);
    setFailedQuestion(null);
    setPending(true);
    try {
      const response = await onSend(text, {
        messages: history.map((message) => ({ ...message, ...(message.links && { links: message.links.map((link) => ({ ...link })) }) })),
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      const reply = typeof response === "string" ? { text: response } : response;
      if (!reply.text.trim()) throw new Error("Empty response");
      const links = responseLinks(reply.links);
      writeThread(sentKey, [...history, { role: "assistant", content: reply.text, ...(links.length > 0 && { links }) }]);
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

  const defaultBrand = (
    <h2 id={`${id}-title`} className="flex items-center gap-2 text-base font-semibold"><AskAiIcon />{label}</h2>
  );
  const headerTools = (
    <div className="flex shrink-0 items-center gap-1" data-ask-ai-header-tools>
      {showFullscreenTrigger && (
        <IconButton
          type="button"
          size="sm"
          shape="square"
          variant="ghost"
          color="grey"
          title="全屏"
          aria-label="全屏"
          data-ask-ai-fullscreen
          onClick={enterFullscreen}
        >
          <FullScreenLinear size={18} />
        </IconButton>
      )}
      <button type="button" aria-label="关闭 Ask AI" onClick={() => setOpen(false)} className="rounded-full p-2 text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2">
        <CloseCircleLinear size={20} />
      </button>
    </div>
  );

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
        <dialog ref={dialogRef} id={`${id}-dialog`} data-accent={accent} aria-labelledby={`${id}-title`} aria-modal="true"
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
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-fg-grey-200 px-5 py-4">
              {header ?? (
                <>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {brand ? <div id={`${id}-title`}>{brand}</div> : defaultBrand}
                    {session ?? (
                      <AskHistoryDropdown
                        sessions={sessionList}
                        currentSessionId={activeId ?? undefined}
                        onNewSession={startNewSession}
                        onSelectSession={selectSession}
                      />
                    )}
                  </div>
                  {headerTools}
                </>
              )}
            </header>
            {messagesSlot ?? (
              <>
                <div ref={conversationRef} className="min-h-0 flex-1 overflow-y-auto p-5">
                  {conversation.length === 0 && <div className="flex flex-col gap-5">
                    <p className="text-sm leading-6 text-fg-grey-700">告诉我你想了解什么，我来帮你梳理。</p>
                    <div className="flex flex-col gap-2">
                      {suggestions.map((question, index) => <button key={`${index}-${question}`} type="button" disabled={disabled} onClick={() => void send(question)} className="rounded-xl border border-fg-grey-200 px-3 py-3 text-left text-sm text-fg-grey-700 hover:bg-fg-grey-100 disabled:opacity-50">{question}</button>)}
                    </div>
                  </div>}
                  <div role="log" aria-label="对话记录" aria-live="polite" className="flex flex-col gap-5">
                    {conversation.map((message, index) => <div key={index} className={cn("flex flex-col gap-1.5", message.role === "user" && "items-end")}>
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
              </>
            )}
            {composer ?? (
              <form onSubmit={submit} className="flex shrink-0 items-end gap-2 border-t border-fg-grey-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <textarea ref={inputRef} aria-label="向 AI 提问" placeholder={placeholder} rows={2} value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(draft); }
                  }}
                  className="min-w-0 flex-1 resize-none rounded-xl border border-fg-grey-200 px-3 py-2.5 text-sm leading-5 placeholder:text-fg-grey-500 focus:outline-fg-grey-500" />
                <button type="submit" disabled={pending || disabled || !draft.trim()} className="rounded-full bg-accent px-3.5 py-3 text-sm font-bold leading-5 tracking-fg text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60">发送</button>
              </form>
            )}
          </div>
        </dialog>, document.body,
      )}
      {fullscreenOpen && typeof document !== "undefined" && createPortal(
        <AskAiFullscreenLayer
          color={accent}
          label={label}
          railLabel={railLabel}
          landingTitle={landingTitle}
          placeholder={placeholder}
          brand={brand}
          session={session}
          messages={messagesSlot}
          composer={composer}
          sessions={sessionList}
          currentSessionId={activeId ?? undefined}
          onNewSession={startNewSession}
          onSelectSession={selectSession}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          suggestions={suggestions}
          draft={draft}
          onDraftChange={setDraft}
          pending={pending}
          disabled={disabled}
          error={error}
          failedQuestion={failedQuestion}
          conversation={conversation}
          hasConversation={hasConversation ?? (messagesSlot ? true : undefined)}
          onSubmit={() => void send(draft)}
          onRetry={() => failedQuestion && void send(failedQuestion, true)}
          onSuggestion={(question) => void send(question)}
          onExit={exitFullscreen}
        />,
        document.body,
      )}
    </>
  );
}
