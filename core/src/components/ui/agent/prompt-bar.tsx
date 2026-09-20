"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set. Does not replace ChatInputBar.
 */

import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  AltArrowDownLinear,
  ArrowUpLinear,
  CommandLinear,
  HashtagLinear,
  LinkLinear,
  MicrophoneLinear,
  PaperclipLinear,
} from "solar-icon-set";
import { cn } from "../../../lib/utils";

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

export function PromptBar({
  value: controlledValue,
  onChange,
  onSend,
  placeholder = "Ask the agent…",
  sources = [],
  commands = [],
  models = [],
  model,
  onModelChange,
  disabled,
  className = "",
}: {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (message: string) => void;
  placeholder?: string;
  sources?: PromptSource[];
  commands?: PromptCommand[];
  models?: PromptModel[];
  model?: string;
  onModelChange?: (id: string) => void;
  disabled?: boolean;
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
    if (!trimmed || disabled) return;
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
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className={cn("relative rounded-2xl bg-white outline outline-1 outline-fg-grey-200", className)}>
      {openPanel === "sources" && filteredSources.length > 0 && (
        <Picker
          title="Sources"
          items={filteredSources.map((item) => ({
            id: item.id,
            label: item.label,
            description: item.description,
            badge: item.connected ? "Connected" : undefined,
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
          title="Commands"
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
      {openPanel === "models" && models.length > 0 && (
        <Picker
          title="Model"
          items={models.map((item) => ({ id: item.id, label: item.label }))}
          onPick={(id) => {
            onModelChange?.(id);
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
          <IconChip label="Attach" onClick={() => undefined}>
            <PaperclipLinear size={14} color="var(--fg-grey-700)" />
          </IconChip>
          {sources.length > 0 && (
            <IconChip label="@ sources" active={openPanel === "sources"} onClick={() => setPanel((v) => (v === "sources" ? null : "sources"))}>
              <HashtagLinear size={14} color="var(--fg-grey-700)" />
              <span>Sources</span>
            </IconChip>
          )}
          {commands.length > 0 && (
            <IconChip label="/ commands" active={openPanel === "commands"} onClick={() => setPanel((v) => (v === "commands" ? null : "commands"))}>
              <CommandLinear size={14} color="var(--fg-grey-700)" />
              <span>Commands</span>
            </IconChip>
          )}
          <IconChip label="Dictate">
            <MicrophoneLinear size={14} color="var(--fg-grey-700)" />
          </IconChip>
        </div>
        <div className="flex items-center gap-2">
          {models.length > 0 && (
            <button
              type="button"
              onClick={() => setPanel((v) => (v === "models" ? null : "models"))}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-fg-grey-700 hover:bg-fg-grey-100"
            >
              {models.find((item) => item.id === model)?.label ?? models[0]?.label}
              <AltArrowDownLinear size={12} color="var(--fg-grey-500)" />
            </button>
          )}
          <button
            type="button"
            disabled={!canSend}
            onClick={send}
            aria-label="Send"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white hover:brightness-90 disabled:cursor-not-allowed disabled:bg-fg-grey-300"
          >
            <ArrowUpLinear size={16} color="var(--fg-white)" />
          </button>
        </div>
      </div>
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
        active ? "bg-fg-violet-50 text-fg-violet" : "text-fg-grey-700 hover:bg-fg-grey-100",
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
