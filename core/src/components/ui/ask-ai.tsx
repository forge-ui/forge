"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AskAiIcon } from "../../internal/ask-ai-icon";
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
import { AgentPanel } from "./agent/agent-panel";
import { AgentMessage, PromptSuggestions } from "./agent/agent-conversation";
import { AgentWelcome } from "./agent/agent-welcome";
import { StreamingAnswer } from "./agent/streaming-answer";
import { ThinkingIndicator } from "./agent/thinking";

const EMPTY_MESSAGES: AskAiMessage[] = [];

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
  /** Entry button text and panel title. */
  label?: string;
  suggestions?: string[];
  placeholder?: string;
  /** Return plain text or text with business links. At most two safe links are shown. */
  onSend: (message: string, request: AskAiRequest) => string | AskAiResponse | Promise<string | AskAiResponse>;
  disabled?: boolean;
  className?: string;
  /** Replace the built-in conversation, e.g. with AgentParts driven by your own runtime. */
  messages?: ReactNode;
  /** Replace the built-in composer. */
  composer?: ReactNode;
  /** Earlier conversations, listed under the history button. Displayed as given. */
  sessions?: AskAiSessionItem[];
  currentSessionId?: string;
  onNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  landingTitle?: string;
  /** Supporting copy below the empty-state heading. */
  landingDescription?: string;
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

/**
 * The page-header entry to Forge Agent: the header button opens the Forge Agent panel (AgentPanel)
 * with a built-in conversation over `onSend`. For tools, approvals and generative answers, mount
 * ForgeAgent from @forge-ui-official/agent, or pass your own `messages` and `composer`.
 */
export function AskAi({
  color,
  label = "Forge Agent",
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "输入问题…",
  onSend,
  disabled,
  className,
  messages: messagesSlot,
  composer,
  sessions,
  currentSessionId,
  onNewSession,
  onSelectSession,
  landingTitle,
  landingDescription = "告诉我你想了解什么，我来帮你梳理。",
}: AskAiProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);
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
  useLayoutEffect(() => { threadsRef.current = threads; }, [threads]);
  const conversation = threads[threadKey] ?? EMPTY_MESSAGES;
  const [pending, setPending] = useState(false);
  // The reply that arrived last fades in; replies already read show at once.
  const [fresh, setFresh] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);
  useLayoutEffect(() => {
    const value = triggerRef.current?.closest("[data-accent]")?.getAttribute("data-accent");
    setInheritedAccent(value === "purple" || value === "blue" || value === "black" ? value : undefined);
  }, [open]);

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

  function stop() {
    requestRef.current?.abort();
    requestRef.current = null;
    setPending(false);
  }

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
      setFresh(`${sentKey}:${history.length}`);
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

  const transcript = conversation.length > 0 || pending || error ? (
    <div role="log" aria-label="对话记录" aria-live="polite" className="flex flex-col gap-5">
      {conversation.map((message, index) => message.role === "user"
        ? <AgentMessage key={index} role="user">{message.content}</AgentMessage>
        : (
          <div key={index} className="flex flex-col gap-2">
            <StreamingAnswer text={message.content} format="markdown" size="sm" streaming={fresh === `${threadKey}:${index}`} />
            {message.links && (
              <div className="flex flex-wrap gap-2">
                {message.links.map((link, linkIndex) => <a key={linkIndex} href={link.href} className="max-w-full break-words rounded-full border border-fg-grey-200 px-3 py-1.5 text-sm font-semibold text-fg-black hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-fg-grey-500">{link.label}</a>)}
              </div>
            )}
          </div>
        ))}
      {pending && <ThinkingIndicator />}
      {error && <div className="flex items-center gap-3"><p role="alert" className="text-sm text-fg-red">{error}</p><Button size="sm" variant="tertiary" color="grey" onClick={() => failedQuestion && void send(failedQuestion, true)}>重试</Button></div>}
    </div>
  ) : undefined;

  const empty = (
    <AgentWelcome
      size="sm"
      title={landingTitle || "有什么可以帮你？"}
      description={landingDescription}
      footer={<PromptSuggestions size="sm" suggestions={suggestions} onSelect={(question) => void send(question)} />}
    />
  );

  return (
    <>
      <button ref={triggerRef} type="button" aria-label={label} aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled} onClick={() => setOpen(true)}
        className={cn("shrink-0 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background px-3 md:px-4 text-fg-grey-700 outline outline-1 -outline-offset-1 outline-fg-grey-200 hover:bg-fg-grey-100 focus-visible:ring-2 focus-visible:ring-fg-grey-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", className)}>
        <AskAiIcon />
        <span className="hidden md:inline text-sm font-semibold whitespace-nowrap">{label}</span>
      </button>
      <div data-accent={accent} className="contents">
        <AgentPanel
          title={label}
          open={open}
          onOpenChange={setOpen}
          launcher={false}
          empty={empty}
          followKey={`${conversation.length}-${pending}`}
          onNewChat={startNewSession}
          sessions={sessionList}
          currentSessionId={activeId ?? undefined}
          onSelectSession={selectSession}
          composer={composer ?? {
            value: draft,
            onChange: setDraft,
            onSend: (message: string) => void send(message),
            placeholder,
            disabled,
            status: pending ? "running" : "idle",
            onStop: stop,
          }}
        >
          {messagesSlot ?? transcript}
        </AgentPanel>
      </div>
    </>
  );
}
