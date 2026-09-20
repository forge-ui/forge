"use client";

import { useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { MagniferLinear, QuitFullScreenLinear, SidebarMinimalisticLinear } from "solar-icon-set";
import { AskAiIcon } from "./ask-ai-icon";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { PlusIcon } from "../components/ui/plain-icons";
import type { AccentColor } from "../components/ui/accent-utils";
import type { AskAiMessage, AskAiSessionItem } from "./ask-ai-types";

export const ASK_AI_FS_LAYER_ATTR = "data-ask-ai-fs-layer";
/** Session rail width: 16rem token, not a hardcoded px value. */
export const ASK_AI_FULLSCREEN_RAIL_WIDTH = "16rem";

function AskAiFullscreenComposer({
  color,
  draft,
  onDraftChange,
  pending,
  disabled,
  placeholder,
  tall,
  onSubmit,
}: {
  color: AccentColor;
  draft: string;
  onDraftChange: (value: string) => void;
  pending: boolean;
  disabled?: boolean;
  placeholder: string;
  tall?: boolean;
  onSubmit: () => void;
}) {
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form
      data-ask-ai-fs-composer
      className="w-full"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div
        data-ask-ai-fs-composer-box
        className={cn(
          "flex flex-col gap-2.5 rounded-2xl border border-fg-grey-200 bg-background px-3.5 pb-2.5 pt-3.5",
          tall ? "shadow-md" : "shadow-sm",
        )}
      >
        <textarea
          aria-label="向 AI 提问"
          placeholder={placeholder}
          value={draft}
          disabled={pending || disabled}
          rows={tall ? 3 : 2}
          className={cn(
            "w-full resize-none border-0 bg-transparent text-base leading-6 text-foreground outline-none placeholder:text-fg-grey-400",
            tall ? "min-h-16" : "min-h-11",
          )}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="flex items-center justify-end">
          <Button type="submit" size="sm" color={color} disabled={pending || disabled || !draft.trim()}>
            发送
          </Button>
        </div>
      </div>
    </form>
  );
}

function AskAiDefaultTranscript({
  label,
  messages,
  pending,
  error,
  failedQuestion,
  onRetry,
}: {
  label: string;
  messages: AskAiMessage[];
  pending: boolean;
  error: string | null;
  failedQuestion: string | null;
  onRetry: () => void;
}) {
  return (
    <>
      <div role="log" aria-label="对话记录" aria-live="polite" className="flex flex-col gap-5">
        {messages.map((message, index) => (
          <div key={index} className={cn("flex flex-col gap-1.5", message.role === "user" && "items-end")}>
            <span className="text-xs text-fg-grey-500">{message.role === "user" ? "你" : label}</span>
            <p className={cn("max-w-full whitespace-pre-wrap break-words text-sm leading-6", message.role === "user" && "rounded-2xl bg-fg-grey-100 px-4 py-3")}>
              {message.content}
            </p>
            {message.role === "assistant" && message.links && (
              <div className="flex flex-wrap gap-2">
                {message.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="max-w-full break-words rounded-xl border border-fg-grey-200 px-3 py-2 text-sm font-semibold text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-fg-grey-500"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {pending && <p role="status" className="mt-5 text-sm text-fg-grey-500">正在思考…</p>}
      {error && (
        <div className="mt-5 flex items-center gap-3">
          <p role="alert" className="text-sm text-fg-red">{error}</p>
          <Button size="sm" variant="tertiary" color="grey" onClick={onRetry} disabled={!failedQuestion || pending}>
            重试
          </Button>
        </div>
      )}
    </>
  );
}

export function AskAiFullscreenLayer({
  color,
  label,
  railLabel = "Ask",
  landingTitle = "今天想做什么？",
  placeholder,
  brand,
  session,
  messages,
  composer,
  sessions = [],
  currentSessionId,
  onNewSession,
  onSelectSession,
  searchQuery,
  onSearchQueryChange,
  suggestions = [],
  draft,
  onDraftChange,
  pending,
  disabled,
  error,
  failedQuestion,
  conversation,
  hasConversation,
  onSubmit,
  onRetry,
  onSuggestion,
  onExit,
}: {
  color: AccentColor;
  label: string;
  railLabel?: string;
  landingTitle?: string;
  placeholder: string;
  brand?: ReactNode;
  session?: ReactNode;
  messages?: ReactNode;
  composer?: ReactNode;
  sessions?: AskAiSessionItem[];
  currentSessionId?: string;
  onNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  suggestions?: string[];
  draft: string;
  onDraftChange: (value: string) => void;
  pending: boolean;
  disabled?: boolean;
  error: string | null;
  failedQuestion: string | null;
  conversation: AskAiMessage[];
  hasConversation?: boolean;
  onSubmit: () => void;
  onRetry: () => void;
  onSuggestion: (question: string) => void;
  onExit: () => void;
}) {
  const [railOpen, setRailOpen] = useState(true);
  const searchControlled = searchQuery !== undefined;
  const [internalSearch, setInternalSearch] = useState("");
  const railQuery = searchControlled ? searchQuery : internalSearch;
  const inConversation = hasConversation ?? conversation.length > 0;
  const defaultComposer = (
    <AskAiFullscreenComposer
      color={color}
      draft={draft}
      onDraftChange={onDraftChange}
      pending={pending}
      disabled={disabled}
      placeholder={placeholder}
      tall={!inConversation}
      onSubmit={onSubmit}
    />
  );

  function setRailQuery(next: string) {
    if (!searchControlled) setInternalSearch(next);
    onSearchQueryChange?.(next);
  }

  return (
    <div
      {...{ [ASK_AI_FS_LAYER_ATTR]: "" }}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} 全屏`}
      className="pointer-events-auto fixed inset-0 z-50 flex bg-background"
    >
      {railOpen ? (
        <aside
          data-ask-ai-fs-rail
          aria-label="会话栏"
          className="flex min-h-0 shrink-0 flex-col border-r border-fg-grey-200 bg-background px-3 py-4"
          style={{ width: ASK_AI_FULLSCREEN_RAIL_WIDTH }}
        >
          <div className="px-2.5 pb-4 pt-0.5">
            {brand ?? (
              <div className="inline-flex items-center gap-2 text-base font-semibold text-fg-black">
                <AskAiIcon />
                {railLabel}
              </div>
            )}
          </div>
          {session ?? (
            <>
              <button
                type="button"
                data-ask-ai-fs-new
                className="flex w-full items-center gap-2 rounded-lg bg-transparent px-2.5 py-2 text-left text-sm font-medium leading-5 text-fg-grey-700 hover:bg-fg-grey-50 focus-visible:outline-2 focus-visible:outline-fg-grey-500"
                onClick={onNewSession}
              >
                <PlusIcon size={16} />
                新建对话
              </button>
              <div data-ask-ai-fs-rail-search className="mb-5 mt-1">
                <label className="flex items-center gap-2 rounded-lg border border-fg-grey-200 bg-background px-2.5 py-1.5 text-fg-grey-500">
                  <MagniferLinear size={16} />
                  <input
                    type="search"
                    value={railQuery}
                    placeholder="搜索"
                    aria-label="搜索历史"
                    className="w-full bg-transparent text-sm leading-5 text-foreground outline-none placeholder:text-fg-grey-400"
                    onChange={(event) => setRailQuery(event.target.value)}
                  />
                </label>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-0.5">
                {sessions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    data-ask-ai-fs-hist={item.id}
                    className={cn(
                      "block w-full truncate rounded-lg px-2.5 py-2.5 text-left text-sm leading-6 hover:bg-fg-grey-50 focus-visible:outline-2 focus-visible:outline-fg-grey-500",
                      currentSessionId === item.id ? "bg-fg-grey-50 text-fg-black" : "text-fg-grey-700",
                    )}
                    onClick={() => onSelectSession?.(item.id)}
                  >
                    {item.title}
                  </button>
                ))}
                {sessions.length === 0 ? (
                  <p className="px-2.5 py-4 text-center text-sm text-fg-grey-500">暂无最近对话</p>
                ) : null}
              </div>
            </>
          )}
        </aside>
      ) : null}

      <div data-ask-ai-fs-main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <div className="absolute right-4 top-3 z-10 flex items-center gap-1">
          <button
            type="button"
            title={railOpen ? "收起会话栏" : "展开会话栏"}
            aria-label={railOpen ? "收起会话栏" : "展开会话栏"}
            data-ask-ai-fs-rail-toggle
            className="inline-flex size-9 items-center justify-center rounded-lg text-fg-grey-500 hover:bg-fg-grey-50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-fg-grey-500"
            onClick={() => setRailOpen((open) => !open)}
          >
            <SidebarMinimalisticLinear size={18} />
          </button>
          <button
            type="button"
            title="退出全屏"
            aria-label="退出全屏"
            data-ask-ai-exit-fullscreen
            className="inline-flex size-9 items-center justify-center rounded-lg text-fg-grey-500 hover:bg-fg-grey-100 hover:text-foreground focus-visible:outline-2 focus-visible:outline-fg-grey-500"
            onClick={onExit}
          >
            <QuitFullScreenLinear size={18} />
          </button>
        </div>

        {inConversation ? (
          <div data-ask-ai-fs-chat className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-6">
            <div data-ask-ai-fs-messages className="min-h-0 flex-1 overflow-y-auto pb-5 pt-14">
              {messages ?? (
                <AskAiDefaultTranscript
                  label={label}
                  messages={conversation}
                  pending={pending}
                  error={error}
                  failedQuestion={failedQuestion}
                  onRetry={onRetry}
                />
              )}
            </div>
            <div className="shrink-0 pb-7">{composer ?? defaultComposer}</div>
          </div>
        ) : (
          <div data-ask-ai-fs-landing className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-8 pb-10 pt-16">
            <div data-ask-ai-fs-landing-inner className="flex w-full max-w-3xl flex-col items-center">
              <h2 className="mb-7 text-center text-3xl font-semibold leading-tight tracking-fg text-fg-black">
                {landingTitle}
              </h2>
              {composer ?? defaultComposer}
              {messages ? null : (
                <div data-ask-ai-fs-suggest className="mt-4 flex w-full flex-wrap justify-center gap-2.5">
                  {suggestions.map((question, index) => (
                    <button
                      key={`${index}-${question}`}
                      type="button"
                      disabled={pending || disabled}
                      data-ask-ai-fs-suggest-chip
                      className="rounded-xl border border-fg-grey-200 bg-background px-3.5 py-3 text-left text-sm text-fg-black hover:bg-fg-grey-50 focus-visible:outline-2 focus-visible:outline-fg-grey-500 disabled:opacity-50"
                      onClick={() => onSuggestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
