"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set. Does not replace ChatInputBar.
 */

import { useContext, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
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
import { AskAiCompactComposerContext } from "../../../internal/ask-ai-composer-context";
import { cn } from "../../../lib/utils";
import type { AccentColor } from "../accent-utils";
import { DropdownPanel } from "../dropdown-panel";
import { PlusIcon } from "../plain-icons";
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
  const compact = useContext(AskAiCompactComposerContext);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toolsTriggerRef = useRef<HTMLButtonElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState("");
  const [dismissedQuery, setDismissedQuery] = useState<string | null>(null);
  const [panel, setPanel] = useState<"sources" | "commands" | "models" | "tools" | null>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const query = useMemo(() => {
    const match = value.match(/(?:^|\s)([@/])(\S*)$/);
    return match ? { kind: match[1] as "@" | "/", term: match[2].toLowerCase() } : null;
  }, [value]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input || !compact) return;
    function resize() {
      if (!input) return;
      input.style.height = "auto";
      input.style.height = `${Math.min(input.scrollHeight, 192)}px`;
    }
    resize();
    if (typeof ResizeObserver === "undefined") return;
    let width = input.clientWidth;
    const observer = new ResizeObserver(() => {
      if (input.clientWidth === width) return;
      width = input.clientWidth;
      resize();
    });
    observer.observe(input);
    return () => observer.disconnect();
  }, [compact, value]);

  useLayoutEffect(() => {
    if (panel !== "tools" || !compact) return;
    toolsMenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus({ preventScroll: true });
    function outside(event: Event) {
      const target = event.target as Node;
      if (!toolsMenuRef.current?.contains(target) && !toolsTriggerRef.current?.contains(target)) setPanel(null);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [panel, compact]);

  function chooseSource(id: string) {
    const source = sources.find(item => item.id === id);
    if (!source) return;
    setValue(`${value.replace(/(?:^|\s)@\S*$/, "").trimEnd()} @${source.label} `);
    setPanel(null);
    inputRef.current?.focus({ preventScroll: true });
  }

  function chooseCommand(id: string) {
    const command = commands.find(item => item.id === id);
    if (!command) return;
    setValue(`/${command.label} `);
    setPanel(null);
    inputRef.current?.focus({ preventScroll: true });
  }

  function navigateTools(event: KeyboardEvent<HTMLDivElement>) {
    const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        (panel === "tools" ? toolsTriggerRef.current : inputRef.current)?.focus({ preventScroll: true });
      }
      setDismissedQuery(query ? `${query.kind}${query.term}` : null);
      setPanel(null);
      return;
    }
    const next = event.key === "ArrowDown" ? (index + 1) % items.length
      : event.key === "ArrowUp" ? (index - 1 + items.length) % items.length
      : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
    if (next >= 0) { event.preventDefault(); items[next]?.focus({ preventScroll: true }); }
  }

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
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && (openPanel === "sources" || openPanel === "commands")) {
      const items = inputRef.current?.parentElement?.querySelectorAll<HTMLButtonElement>("[data-prompt-picker] button");
      if (items?.length) {
        event.preventDefault();
        items[event.key === "ArrowDown" ? 0 : items.length - 1].focus({ preventScroll: true });
        return;
      }
    }
    if (event.key === "Escape") {
      if (openPanel) { event.preventDefault(); event.stopPropagation(); }
      setDismissedQuery(query ? `${query.kind}${query.term}` : null);
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
    panel ?? (dismissedQuery === (query ? `${query.kind}${query.term}` : null) ? null
      : query?.kind === "@" && sources.length ? "sources" : query?.kind === "/" && commands.length ? "commands" : null);
  const active = status !== "idle";
  const canSend = value.trim().length > 0 && !disabled && !active;
  const canStop = status === "running" && Boolean(onStop);
  const actionLabel = status === "stopping" ? stoppingLabel : active ? stopLabel : sendLabel;

  return (
    <div
      data-accent={color}
      data-prompt-status={status}
      className={cn("relative bg-white outline outline-1 outline-fg-grey-200", compact ? "flex flex-wrap items-end rounded-[28px] shadow-sm" : "rounded-2xl", className)}
    >
      {openPanel === "sources" && filteredSources.length > 0 && (
        <Picker
          compact={compact}
          title={sourcesLabel}
          items={filteredSources.map((item) => ({
            id: item.id,
            label: item.label,
            description: item.description,
            badge: item.connected ? connectedLabel : undefined,
          }))}
          onKeyDown={navigateTools}
          onPick={chooseSource}
        />
      )}
      {openPanel === "commands" && filteredCommands.length > 0 && (
        <Picker
          compact={compact}
          title={commandsLabel}
          items={filteredCommands.map((item) => ({
            id: item.id,
            label: item.label,
            description: item.description,
          }))}
          onKeyDown={navigateTools}
          onPick={chooseCommand}
        />
      )}

      {compact && (onAttach || sources.length > 0 || commands.length > 0) && (
        <>
          <button ref={toolsTriggerRef} type="button" aria-label="添加内容和工具" aria-haspopup="menu"
            aria-expanded={panel === "tools"} disabled={disabled}
            onClick={() => setPanel(previous => previous === "tools" ? null : "tools")}
            onKeyDown={event => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault(); setPanel("tools");
              }
            }}
            className="mb-2 ml-2 flex size-9 shrink-0 items-center justify-center rounded-full text-fg-black hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50">
            <PlusIcon size={20} />
          </button>
          {panel === "tools" && (
            <div ref={toolsMenuRef} role="menu" aria-label="添加内容和工具" onKeyDown={navigateTools}
              className="absolute inset-x-0 bottom-full z-10 mb-2">
              <DropdownPanel width="w-full" padding="p-2" className="max-h-[min(24rem,60dvh)] overflow-y-auto">
                {onAttach && <ToolMenuItem icon={<PaperclipLinear size={18} />} label={attachLabel}
                  onClick={() => { setPanel(null); onAttach(); toolsTriggerRef.current?.focus({ preventScroll: true }); }} />}
                {sources.map(source => <ToolMenuItem key={`source-${source.id}`} icon={<LinkLinear size={18} />}
                  label={source.label} description={source.description} onClick={() => chooseSource(source.id)} />)}
                {commands.map(command => <ToolMenuItem key={`command-${command.id}`} icon={<CommandLinear size={18} />}
                  label={`/${command.label}`} description={command.description} onClick={() => chooseCommand(command.id)} />)}
              </DropdownPanel>
            </div>
          )}
        </>
      )}

      <textarea
        ref={inputRef}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        rows={compact ? 1 : 3}
        onChange={(event) => { setDismissedQuery(null); setPanel(null); setValue(event.target.value); }}
        onKeyDown={handleKeyDown}
        className={cn("resize-none bg-transparent px-4 text-[15px] leading-7 text-fg-black placeholder:text-fg-grey-500 focus:outline-none disabled:opacity-50", compact ? "min-w-0 flex-1 basis-0 py-3 !px-2" : "w-full pt-4")}
      />

      <div className={cn("flex items-center justify-between gap-2", compact ? "max-w-full shrink-0 px-2 py-2" : "px-3 pb-3")}>
        {!compact && <div className="flex flex-wrap items-center gap-1.5">
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
        </div>}
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
          {compact && onDictate && <IconChip label={dictateLabel} onClick={onDictate}><MicrophoneLinear size={18} /></IconChip>}
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
  const compact = useContext(AskAiCompactComposerContext);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full py-1.5 text-xs font-medium transition-colors",
        compact ? "px-1.5" : "px-2.5",
        active ? "bg-accent-soft text-accent" : "text-fg-grey-700 hover:bg-fg-grey-100",
      )}
    >
      {children}
    </button>
  );
}

function Picker({
  compact,
  title,
  items,
  onPick,
  onKeyDown,
}: {
  compact: boolean;
  title: string;
  items: { id: string; label: string; description?: string; badge?: string }[];
  onPick: (id: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div data-prompt-picker role={compact ? "menu" : undefined} aria-label={title} onKeyDown={onKeyDown} className="absolute inset-x-3 bottom-full z-10 mb-2 overflow-hidden rounded-xl bg-white outline outline-1 outline-fg-grey-200">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-fg text-fg-grey-500">{title}</p>
      <ul className="max-h-56 overflow-y-auto pb-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              role={compact ? "menuitem" : undefined}
              tabIndex={compact ? -1 : undefined}
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


function ToolMenuItem({ icon, label, description, onClick }: {
  icon: ReactNode; label: string; description?: string; onClick: () => void;
}) {
  return <button type="button" role="menuitem" tabIndex={-1} onClick={onClick}
    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-fg-black hover:bg-fg-grey-100 focus:bg-fg-grey-100 focus:outline-none">
    <span className="shrink-0 text-fg-grey-500">{icon}</span>
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
      <span className="font-medium">{label}</span>
      {description && <span className="text-fg-grey-500">{description}</span>}
    </span>
  </button>;
}
