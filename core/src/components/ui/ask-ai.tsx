"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AltArrowDownLinear, CloseCircleLinear, MagniferLinear } from "solar-icon-set";
import { AskAiIcon } from "../../internal/ask-ai-icon";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import type { AccentColor } from "./accent-utils";
import { accentColors } from "./accent-utils";
import { Checkbox } from "./checkbox";
import { PromptBar } from "./agent/prompt-bar";

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

export type AskAiSurface = "drawer" | "fullscreen";

export interface AskAiSession {
  id: string;
  title: string;
}

/** Suggestion card. `prompt` is what gets sent; it defaults to `label`. */
export interface AskAiSuggestion {
  id?: string;
  label: string;
  prompt?: string;
}

/**
 * Empty-state copy. Defaults are neutral placeholders.
 * Product-specific wording belongs in the host, not in these defaults.
 */
export interface AskAiLanding {
  /** Drawer title. Default: 你好. Also used in fullscreen when `fullscreenTitle` is omitted. */
  title?: string;
  /** Fullscreen title. Falls back to `title`, then 今天想做什么？ */
  fullscreenTitle?: string;
  /** Short status line under the title. Default: 已就绪. */
  status?: string;
  /** Short explanation. Default depends on the surface. */
  hint?: string;
  /** Fullscreen explanation. Falls back to `hint`. */
  fullscreenHint?: string;
  /** Overrides `suggestions` on AskAi when provided, including an empty list. */
  suggestions?: Array<string | AskAiSuggestion>;
}

/** Replace a shell region. Omit a key to keep the built-in region. */
export interface AskAiSlots {
  brand?: ReactNode;
  session?: ReactNode;
  /** Fullscreen rail. Replaces the title capsule, new-chat row, search, and list. */
  rail?: ReactNode;
  /** Empty state. Replaces the default title, status, hint, and suggestion grid. */
  landing?: ReactNode;
  /** Transcript shown while a session is active. */
  messages?: ReactNode;
  /** Replaces PromptBar. The host owns send in that case. */
  composer?: ReactNode;
}

export interface AskAiProps {
  /** Accent for controls; PageHeader supplies its own color when embedded. */
  color?: AccentColor;
  label?: string;
  /** Human-readable page title or path; supplied explicitly by the application. */
  context?: string;
  /** Shortcut for landing suggestion cards. */
  suggestions?: string[];
  placeholder?: string;
  /** Return plain text or text with business links. At most two safe links are shown. */
  onSend: (message: string, request: AskAiRequest) => string | AskAiResponse | Promise<string | AskAiResponse>;
  disabled?: boolean;
  className?: string;
  /** Landing copy. Neutral defaults apply to any field you omit. */
  landing?: AskAiLanding;
  /** Named shell slots. Host-owned nodes replace the matching region. */
  slots?: AskAiSlots;
  /**
   * Sessions for the drawer menu and fullscreen rail.
   * Omit to let the shell record a session the first time the user sends.
   */
  sessions?: AskAiSession[];
  /** Active session. `null` shows landing. Omit to let the shell own selection. */
  activeSessionId?: string | null;
  defaultActiveSessionId?: string | null;
  onActiveSessionChange?: (id: string | null) => void;
  /** Fired when a send starts a session that did not exist yet. */
  onCreateSession?: (session: AskAiSession) => void;
  /** Fired when the user chooses 新建对话. */
  onNewSession?: () => void;
  /** PromptBar model chip. Omit to hide it; the shell does not invent a model name. */
  models?: Array<{ id: string; label: string }>;
  model?: string;
  onModelChange?: (id: string) => void;
  /** Surface used the next time the shell opens. Default: drawer. */
  defaultSurface?: AskAiSurface;
}

const DEFAULT_SUGGESTIONS = ["这个页面可以做什么？", "下一步该做什么？", "帮我总结当前内容"];
const NEW_SESSION_LABEL = "新对话";

const suggestionHover: Record<AccentColor, string> = {
  purple: "hover:border-fg-violet hover:bg-fg-violet-100",
  blue: "hover:border-fg-blue hover:bg-fg-blue-100",
  black: "hover:border-fg-black hover:bg-fg-grey-100",
};

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

function toSuggestions(source: Array<string | AskAiSuggestion>): AskAiSuggestion[] {
  return source.map((item, index) => {
    if (typeof item === "string") return { id: `suggestion-${index}`, label: item, prompt: item };
    return { id: item.id || `suggestion-${index}`, label: item.label, prompt: item.prompt ?? item.label };
  });
}

function filled(value: string | undefined, fallback: string) {
  const text = value?.trim();
  return text ? text : fallback;
}

function landingCopy(surface: AskAiSurface, landing: AskAiLanding | undefined) {
  const title = surface === "fullscreen"
    ? filled(landing?.fullscreenTitle, filled(landing?.title, "今天想做什么？"))
    : filled(landing?.title, "你好");
  const hint = surface === "fullscreen"
    ? filled(landing?.fullscreenHint, filled(landing?.hint, "点左侧建议，或在下方直接说一句话。"))
    : filled(landing?.hint, "点下面的建议，或直接说一句话。");
  return { title, status: filled(landing?.status, "已就绪"), hint };
}

function FullscreenGlyph({ exit = false }: { exit?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="text-fg-grey-500">
      <path
        d={exit ? "M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" : "M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AskIconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-fg-grey-500 hover:bg-fg-grey-100 hover:text-fg-black">
      {children}
    </button>
  );
}

/**
 * Header entry plus a drawer / fullscreen conversation shell.
 * No network calls, page scraping, or ask / act / query routing.
 */
export function AskAi({
  color = "purple",
  label = "Ask AI",
  context,
  suggestions,
  placeholder = "直接说一句话…",
  onSend,
  disabled,
  className,
  landing,
  slots,
  sessions,
  activeSessionId,
  defaultActiveSessionId = null,
  onActiveSessionChange,
  onCreateSession,
  onNewSession,
  models,
  model,
  onModelChange,
  defaultSurface = "drawer",
}: AskAiProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const sessionSeq = useRef(0);
  const threadsRef = useRef<Record<string, AskAiMessage[]>>({});
  const titlesRef = useRef<Record<string, string>>({});
  const defaultSurfaceRef = useRef(defaultSurface);
  defaultSurfaceRef.current = defaultSurface;

  const [open, setOpen] = useState(false);
  const [surface, setSurface] = useState<AskAiSurface>(defaultSurface);
  const [includeContext, setIncludeContext] = useState(true);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState<Record<string, AskAiMessage[]>>({});
  const [internalSessions, setInternalSessions] = useState<AskAiSession[]>([]);
  const [uncontrolledActive, setUncontrolledActive] = useState<string | null>(defaultActiveSessionId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null);

  const sessionsControlled = sessions !== undefined;
  const sessionList = sessions ?? internalSessions;
  const activeId = activeSessionId !== undefined ? activeSessionId : uncontrolledActive;
  const activeIdRef = useRef<string | null>(activeId);
  activeIdRef.current = activeId;
  const showMessages = activeId != null && activeId !== "";
  const suggestionItems = toSuggestions(landing?.suggestions ?? suggestions ?? DEFAULT_SUGGESTIONS);
  const accent = accentColors[color];
  const activeTitle = !showMessages
    ? NEW_SESSION_LABEL
    : sessionList.find((item) => item.id === activeId)?.title ?? titlesRef.current[activeId!] ?? NEW_SESSION_LABEL;
  const visibleMessages = showMessages ? threads[activeId!] ?? [] : [];

  function requestClose() {
    setOpen(false);
    setMenuOpen(false);
    setSurface(defaultSurfaceRef.current);
  }

  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  function setActive(next: string | null) {
    activeIdRef.current = next;
    if (activeSessionId === undefined) setUncontrolledActive(next);
    onActiveSessionChange?.(next);
  }

  function writeThread(sessionId: string, next: AskAiMessage[]) {
    threadsRef.current = { ...threadsRef.current, [sessionId]: next };
    setThreads(threadsRef.current);
  }

  function startNew() {
    setActive(null);
    setMenuOpen(false);
    setDraft("");
    setError(null);
    setFailedQuestion(null);
    onNewSession?.();
  }

  function selectSession(sessionId: string) {
    setActive(sessionId);
    setMenuOpen(false);
    setError(null);
    setFailedQuestion(null);
  }

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); requestCloseRef.current(); }
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
  }, [open, threads, pending, error, activeId, surface]);
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (menuRef.current?.contains(target) || pillRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  async function send(question: string, retry = false) {
    const text = question.trim();
    if (!text || requestRef.current || disabled) return;
    const controller = new AbortController();
    requestRef.current = controller;
    let sessionId = activeIdRef.current;
    if (!sessionId) {
      sessionSeq.current += 1;
      sessionId = `ask-session-${sessionSeq.current}`;
      const title = text.replace(/\s+/g, " ").slice(0, 80);
      titlesRef.current[sessionId] = title;
      if (!sessionsControlled) setInternalSessions((prev) => [{ id: sessionId!, title }, ...prev]);
      onCreateSession?.({ id: sessionId, title });
      setActive(sessionId);
    }
    const prior = threadsRef.current[sessionId] ?? [];
    const history: AskAiMessage[] = retry ? prior : [...prior, { role: "user", content: text }];
    writeThread(sessionId, history);
    setDraft("");
    setError(null);
    setFailedQuestion(null);
    setPending(true);
    const sentFrom = sessionId;
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
      writeThread(sentFrom, [...history, { role: "assistant", content: reply.text, ...(links.length > 0 && { links }) }]);
    } catch {
      if (!controller.signal.aborted && activeIdRef.current === sentFrom) {
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

  const copy = landingCopy(surface, landing);
  const railQuery = query.trim();
  const railSessions = sessionList.filter((item) => !railQuery || item.title.includes(railQuery));
  const railSuggestions = suggestionItems.filter((item) => !railQuery || item.label.includes(railQuery));
  const railShowsSessions = sessionList.length > 0;

  const contextBar = context ? (
    <div className="mx-1 mt-4 flex shrink-0 items-center gap-3 rounded-xl border border-dashed border-fg-grey-200 bg-fg-grey-50 px-3 py-3">
      <span className="shrink-0 text-xs font-semibold text-fg-grey-700">当前页</span>
      <span title={context} className="min-w-0 flex-1 truncate text-xs text-fg-grey-500">{context}</span>
      <Checkbox color={color} aria-label="带当前页" checked={includeContext} onChange={setIncludeContext} disabled={pending} />
      <span className="shrink-0 text-xs text-fg-grey-700">带当前页</span>
    </div>
  ) : null;

  const landingView = (
    <div data-ask-region="landing" className={cn("min-h-full", !slots?.landing && "flex flex-col justify-center gap-3 px-5 py-6", !slots?.landing && surface === "fullscreen" && "items-center px-0 text-center")}>
      {slots?.landing ?? (
        <>
          <h3 data-ask-part="title" className={cn("font-bold tracking-tight text-fg-black", surface === "fullscreen" ? "text-3xl" : "text-display-l")}>{copy.title}</h3>
          <p data-ask-part="status" className="text-xs text-fg-grey-500">{copy.status}</p>
          <p data-ask-part="hint" className="max-w-xl text-sm leading-6 text-fg-grey-700">{copy.hint}</p>
          {suggestionItems.length > 0 && (
            <div className={cn("mt-1 grid w-full grid-cols-2 gap-2.5", surface === "fullscreen" && "max-w-xl")}>
              {suggestionItems.map((item) => (
                <button key={item.id} type="button" disabled={disabled || pending} onClick={() => void send(item.prompt ?? item.label)} className={cn("rounded-xl border border-fg-grey-200 bg-white px-3.5 py-3 text-left text-sm leading-5 text-fg-black disabled:opacity-50", suggestionHover[color])}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const messagesView = slots?.messages ? (
    <div data-ask-region="messages" className="min-h-full">{slots.messages}</div>
  ) : (
    <div role="log" aria-label="对话记录" aria-live="polite" data-ask-region="messages" className="flex flex-col gap-5 px-5 py-5">
      {visibleMessages.map((message, index) => (
        <div key={index} className={cn("flex flex-col gap-1.5", message.role === "user" && "items-end")}>
          <span className="text-xs text-fg-grey-500">{message.role === "user" ? "你" : label}</span>
          <p className={cn("max-w-full whitespace-pre-wrap break-words text-sm leading-6", message.role === "user" ? cn("rounded-2xl px-4 py-3 text-white", accent.bg) : "rounded-2xl bg-fg-grey-100 px-4 py-3")}>{message.content}</p>
          {message.role === "assistant" && message.links && (
            <div className="flex flex-wrap gap-2">
              {message.links.map((link, linkIndex) => <a key={linkIndex} href={link.href} className="max-w-full break-words rounded-xl border border-fg-grey-200 px-3 py-2 text-sm font-semibold text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-fg-grey-500">{link.label}</a>)}
            </div>
          )}
        </div>
      ))}
      {pending && <p role="status" className="text-sm text-fg-grey-500">正在思考…</p>}
      {error && (
        <div className="flex items-center gap-3">
          <p role="alert" className="text-sm text-fg-red">{error}</p>
          <Button size="sm" variant="tertiary" color="grey" onClick={() => failedQuestion && void send(failedQuestion, true)}>重试</Button>
        </div>
      )}
    </div>
  );

  const composer = (
    <div data-ask-region="composer">
      {slots?.composer ?? (
        <PromptBar
          value={draft}
          onChange={setDraft}
          onSend={(message) => { void send(message); }}
          placeholder={placeholder}
          disabled={pending || disabled}
          color={color}
          showAttach={false}
          showDictate={false}
          inputLabel="向 AI 提问"
          inputRef={inputRef}
          rows={2}
          models={models}
          model={model}
          onModelChange={onModelChange}
        />
      )}
    </div>
  );

  const rail = slots?.rail ?? (
    <aside data-ask-region="rail" className="flex w-64 max-w-[46%] shrink-0 flex-col gap-2 border-r border-fg-grey-200 p-3">
      <div className="flex items-center gap-2 px-1 pb-1 font-semibold text-fg-black">
        <AskAiIcon />
        <span className="truncate">{label}</span>
      </div>
      <button type="button" onClick={startNew} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-fg-grey-700 hover:bg-fg-grey-100">＋ 新建对话</button>
      <label className="flex items-center gap-2 rounded-lg bg-fg-grey-50 px-2.5 py-2 text-sm text-fg-grey-500">
        <MagniferLinear size={16} color="var(--fg-grey-500)" />
        <input aria-label="搜索" placeholder="搜索" value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-fg-black outline-none placeholder:text-fg-grey-500" />
      </label>
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
        {railShowsSessions && railSessions.map((item) => (
          <button key={item.id} type="button" onClick={() => selectSession(item.id)} className={cn("rounded-lg px-2.5 py-2 text-left text-sm text-fg-grey-700 hover:bg-fg-grey-100", item.id === activeId && cn(accent.bgTint, accent.text, "font-semibold"))}>{item.title}</button>
        ))}
        {!railShowsSessions && railSuggestions.map((item) => (
          <button key={item.id} type="button" disabled={disabled || pending} onClick={() => void send(item.prompt ?? item.label)} className="rounded-lg px-2.5 py-2 text-left text-sm text-fg-grey-700 hover:bg-fg-grey-100 disabled:opacity-50">{item.label}</button>
        ))}
        {(railShowsSessions ? railSessions : railSuggestions).length === 0 && (
          <p className="px-2 py-3 text-center text-sm text-fg-grey-500">暂无最近对话</p>
        )}
      </div>
    </aside>
  );

  const pillClass = "inline-flex h-9 max-w-56 min-w-0 items-center gap-1 rounded-lg border border-fg-grey-200 bg-white px-2.5 text-sm font-medium text-fg-grey-700";
  const sessionControl = slots?.session ?? (
    surface === "drawer" ? (
      <button ref={pillRef} type="button" aria-haspopup="listbox" aria-expanded={menuOpen} aria-controls={`${id}-sessions`} onClick={() => setMenuOpen((value) => !value)} className={pillClass}>
        <span className="truncate">{activeTitle}</span>
        <AltArrowDownLinear size={14} color="var(--fg-grey-500)" />
      </button>
    ) : (
      <div className={pillClass}>
        <span className="truncate">{activeTitle}</span>
        <AltArrowDownLinear size={14} color="var(--fg-grey-500)" />
      </div>
    )
  );

  const body = (
    <>
      {contextBar}
      <div ref={conversationRef} className="min-h-0 flex-1 overflow-y-auto">
        {showMessages ? messagesView : landingView}
      </div>
    </>
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
        <dialog ref={dialogRef} id={`${id}-dialog`} aria-labelledby={`${id}-title`} aria-modal="true" data-ask-surface={surface}
          onKeyDown={(event) => {
            if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); requestClose(); }
          }}
          onCancel={(event) => { event.preventDefault(); requestClose(); }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) requestClose();
          }}
          className={cn(
            "m-0 h-dvh max-h-none border-0 bg-white p-0 text-fg-black backdrop:bg-fg-black/30",
            surface === "fullscreen" ? "fixed inset-0 w-full max-w-none" : "fixed inset-y-0 left-auto right-0 w-full max-w-[420px] border-l border-fg-grey-200 shadow-xl",
          )}>
          <div className="relative flex h-full min-h-0 flex-col">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-fg-grey-200 px-3">
              <div id={`${id}-title`} className="min-w-0">
                {slots?.brand ?? (
                  <h2 className="flex items-center gap-2 text-sm font-bold text-fg-black">
                    <AskAiIcon />
                    <span className="whitespace-nowrap">{label}</span>
                  </h2>
                )}
              </div>
              {sessionControl}
              <div className="ml-auto flex shrink-0 gap-1">
                <AskIconButton label={surface === "fullscreen" ? "退出全屏" : "全屏"} onClick={() => { setMenuOpen(false); setSurface((value) => value === "fullscreen" ? "drawer" : "fullscreen"); }}>
                  <FullscreenGlyph exit={surface === "fullscreen"} />
                </AskIconButton>
                <AskIconButton label="关闭 Ask AI" onClick={requestClose}>
                  <CloseCircleLinear size={20} />
                </AskIconButton>
              </div>
            </header>
            {menuOpen && surface === "drawer" && !slots?.session && (
              <div ref={menuRef} id={`${id}-sessions`} data-ask-region="session-menu" role="listbox" aria-label="最近对话" className="absolute left-12 right-3 top-14 z-20 rounded-xl border border-fg-grey-200 bg-white p-1.5 shadow-xl">
                <button type="button" onClick={startNew} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-sm text-fg-black hover:bg-fg-grey-100">＋ 新建对话</button>
                <div className="my-1 border-t border-fg-grey-200" />
                {sessionList.length === 0 ? <p className="px-3 py-3 text-center text-sm text-fg-grey-500">暂无最近对话</p> : sessionList.map((item) => (
                  <button key={item.id} type="button" role="option" aria-selected={item.id === activeId} onClick={() => selectSession(item.id)} className={cn("flex w-full rounded-lg px-2.5 py-2.5 text-left text-sm text-fg-black hover:bg-fg-grey-100", item.id === activeId && cn(accent.bgTint, accent.text, "font-semibold"))}>{item.title}</button>
                ))}
              </div>
            )}
            {surface === "fullscreen" ? (
              <div className="flex min-h-0 flex-1">
                {rail}
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <div className="flex w-full max-w-3xl min-h-0 flex-1 flex-col px-6">{body}</div>
                  <div className="w-full max-w-3xl px-6 pb-6">{composer}</div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                {body}
                <div className="shrink-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{composer}</div>
              </div>
            )}
          </div>
        </dialog>, document.body,
      )}
    </>
  );
}
