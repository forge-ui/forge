"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set. Does not replace ChatInputBar.
 */

import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  ArrowUpLinear,
  CommandLinear,
  HashtagLinear,
  LinkLinear,
  MicrophoneLinear,
  PaperclipLinear,
  RefreshLinear,
  StopBold,
} from "../../../icons";
import { cn } from "../../../lib/utils";
import type { AccentColor } from "../accent-utils";
import { PromptModelMenu } from "../../../internal/prompt-model-menu";

export type PromptSource = {
  id: string;
  label: string;
  description?: string;
  connected?: boolean;
};

export type PromptCommand = {
  id: string;
  label: string;
  description?: string;
};

export type PromptModel = {
  id: string;
  label: string;
};

export type PromptBarStatus = "idle" | "running" | "stopping";

export function PromptBar({
  value: controlledValue,
  onChange,
  onSend,
  status = "idle",
  onStop,
  sendLabel = "Send",
  stopLabel = "停止生成",
  stoppingLabel = "正在停止…",
  onAttach,
  onDictate,
  placeholder = "Ask the agent…",
  sourcesLabel = "Sources",
  commandsLabel = "Commands",
  sources = [],
  commands = [],
  models = [],
  model,
  onModelChange,
  modelMenuLabel = "Model",
  disabled,
  color,
  connectedLabel = "Connected",
  attachLabel = "Attach",
  dictateLabel = "Dictate",
  className = "",
}: {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (message: string) => void;
  /** Controlled task state. Running includes waiting for the first response. */
  status?: PromptBarStatus;
  /** Request cancellation; the caller sets stopping, then idle after confirmation. */
  onStop?: () => void;
  sendLabel?: string;
  stopLabel?: string;
  stoppingLabel?: string;
  onAttach?: () => void;
  onDictate?: () => void;
  placeholder?: string;
  /** Visible label, picker title and accessible name; pass translated text for the current language. */
  sourcesLabel?: string;
  /** Visible label, picker title and accessible name; pass translated text for the current language. */
  commandsLabel?: string;
  sources?: PromptSource[];
  commands?: PromptCommand[];
  models?: PromptModel[];
  model?: string;
  onModelChange?: (id: string) => void;
  /** Accessible name for the model menu and its trigger. */
  modelMenuLabel?: string;
  /** Disable editing/sending and model selection; an active task can still be stopped. */
  disabled?: boolean;
  /** Maps `--accent` so the send button follows AppLayout / site accent. */
  color?: AccentColor;
  connectedLabel?: string;
  attachLabel?: string;
  dictateLabel?: string;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState("");
  const [panel, setPanel] = useState<"sources" | "commands" | "models" | null>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const query = useMemo(() => {
    const match = value.match(/(?:^|\s)([@/])(\S*)$/);
    return match ? { kind: match[1] as "@" | "/", term: match[2].toLowerCase() } : null;
  }, [value]);

  function setValue(next: string) {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  }

  function send() {
    const trimmed = value.trim();
    if (!trimmed || disabled || status !== "idle") return;
    onSend?.(trimmed);
    setValue("");
    setPanel(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      setPanel(null);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  }

  const filteredSources = sources.filter((item) =>
    !query || query.kind !== "@" ? true : item.label.toLowerCase().includes(query.term),
  );
  const filteredCommands = commands.filter((item) =>
    !query || query.kind !== "/" ? true : item.label.toLowerCase().includes(query.term),
  );
  const openPanel =
    panel ?? (query?.kind === "@" && sources.length ? "sources" : query?.kind === "/" && commands.length ? "commands" : null);
  const active = status !== "idle";
  const canSend = value.trim().length > 0 && !disabled && !active;
  const canStop = status === "running" && Boolean(onStop);
  const actionLabel = status === "stopping" ? stoppingLabel : active ? stopLabel : sendLabel;

  return (
    <div
      data-accent={color}
      data-prompt-status={status}
      className={cn("relative rounded-2xl bg-white outline outline-1 outline-fg-grey-200", className)}
    >
      {openPanel === "sources" && filteredSources.length > 0 && (
        <Picker
          title={sourcesLabel}
          items={filteredSources.map((item) => ({
            id: item.id,
            label: item.label,
            description: item.description,
            badge: item.connected ? connectedLabel : undefined,
          }))}
          onPick={(id) => {
            const source = sources.find((item) => item.id === id);
            if (!source) return;
            setValue(`${value.replace(/(?:^|\s)@\S*$/, "").trimEnd()} @${source.label} `);
            setPanel(null);
          }}
        />
      )}
      {openPanel === "commands" && filteredCommands.length > 0 && (
        <Picker
          title={commandsLabel}
          items={filteredCommands.map((item) => ({
            id: item.id,
            label: item.label,
            description: item.description,
          }))}
          onPick={(id) => {
            const command = commands.find((item) => item.id === id);
            if (!command) return;
            setValue(`/${command.label} `);
            setPanel(null);
          }}
        />
      )}


      <textarea
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent px-4 pt-4 text-[15px] leading-7 text-fg-black placeholder:text-fg-grey-500 focus:outline-none disabled:opacity-50"
      />

      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {onAttach ? (
            <IconChip label={attachLabel} onClick={onAttach}>
              <PaperclipLinear size={14} color="var(--fg-grey-700)" />
            </IconChip>
          ) : null}
          {sources.length > 0 && (
            <IconChip label={`@ ${sourcesLabel === "Sources" ? "sources" : sourcesLabel}`} active={openPanel === "sources"} onClick={() => setPanel((v) => (v === "sources" ? null : "sources"))}>
              <HashtagLinear size={14} color="var(--fg-grey-700)" />
              <span>{sourcesLabel}</span>
            </IconChip>
          )}
          {commands.length > 0 && (
            <IconChip label={`/ ${commandsLabel === "Commands" ? "commands" : commandsLabel}`} active={openPanel === "commands"} onClick={() => setPanel((v) => (v === "commands" ? null : "commands"))}>
              <CommandLinear size={14} color="var(--fg-grey-700)" />
              <span>{commandsLabel}</span>
            </IconChip>
          )}
          {onDictate ? (
            <IconChip label={dictateLabel} onClick={onDictate}>
              <MicrophoneLinear size={14} color="var(--fg-grey-700)" />
            </IconChip>
          ) : null}
        </div>
        <div className="flex min-w-0 items-center gap-2">
          {models.length > 0 && (
            <PromptModelMenu
              models={models}
              model={model}
              label={modelMenuLabel}
              disabled={disabled}
              open={panel === "models"}
              onOpenChange={(open) => setPanel(open ? "models" : null)}
              onModelChange={onModelChange}
            />
          )}
          <button
            type="button"
            disabled={active ? !canStop : !canSend}
            onClick={active ? () => { if (canStop) onStop?.(); } : send}
            aria-label={actionLabel}
            aria-busy={status === "stopping" || undefined}
            title={actionLabel}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-fg-grey-300",
              active ? "bg-fg-black text-fg-white" : "bg-accent text-accent-foreground",
            )}
          >
            {status === "stopping" ? (
              <RefreshLinear size={16} color="var(--fg-white)" className="motion-safe:animate-spin" />
            ) : active ? (
              <StopBold size={16} color="var(--fg-white)" />
            ) : (
              <ArrowUpLinear size={16} color="var(--fg-white)" />
            )}
          </button>
        </div>
      </div>
      <span role="status" className="sr-only">{status === "stopping" ? stoppingLabel : ""}</span>
    </div>
  );
}

function IconChip({
  children,
  label,
  active,
  onClick,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-accent-soft text-accent" : "text-fg-grey-700 hover:bg-fg-grey-100",
      )}
    >
      {children}
    </button>
  );
}

function Picker({
  title,
  items,
  onPick,
}: {
  title: string;
  items: { id: string; label: string; description?: string; badge?: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="absolute inset-x-3 bottom-full z-10 mb-2 overflow-hidden rounded-xl bg-white outline outline-1 outline-fg-grey-200">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-fg text-fg-grey-500">{title}</p>
      <ul className="max-h-56 overflow-y-auto pb-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onPick(item.id)}
              className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-fg-grey-100"
            >
              <LinkLinear size={14} color="var(--fg-grey-500)" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-fg-black">{item.label}</span>
                {item.description && <span className="block text-xs text-fg-grey-500">{item.description}</span>}
              </span>
              {item.badge && <span className="text-xs text-fg-green-500">{item.badge}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
