"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUpLinear, PaperclipLinear, PlainLinear } from "../../icons";
import { DropdownPanel } from "./dropdown-panel";

export type ChatInputBarToggle = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function ChatInputBar({
  placeholder = "输入消息...",
  value: controlledValue,
  onChange,
  onSend,
  className = "",
  multiline = false,
  rows = 3,
  toggles,
  sendLabel,
  showAttachment = !toggles,
  onAttach,
  attachLabel = "添加附件",
  sendOnEnter = false,
  disabled,
  sendDisabled = false,
  inputLabel = "消息内容",
  clearOnSend = true,
  density = "default",
  sources = [],
  sourcesLabel = "提及",
}: {
  placeholder?: string;
  /** Controlled value. Pass with onChange to manage external state. */
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (message: string) => void;
  className?: string;
  /** Render a textarea instead of a single-line input */
  multiline?: boolean;
  /** Textarea row count (multiline only) */
  rows?: number;
  /** Footer toggle chips (e.g. Deep think, Web search). When provided, the built-in attachment icon is hidden by default. */
  toggles?: ChatInputBarToggle[];
  /** When given, send button renders as a labeled pill (label + arrow). Otherwise circular icon-only. */
  sendLabel?: string;
  /** Whether to show the built-in attachment icon. Defaults to true when no toggles. */
  showAttachment?: boolean;
  onAttach?: () => void;
  attachLabel?: string;
  /** Multiline Enter sends when enabled; Shift+Enter inserts a newline. */
  sendOnEnter?: boolean;
  /** Disable the input + send */
  disabled?: boolean;
  /** Disable sending while keeping the draft editable. */
  sendDisabled?: boolean;
  inputLabel?: string;
  /** Controlled async callers can clear only after success. */
  clearOnSend?: boolean;
  density?: "default" | "compact";
  /** Mention suggestions displayed above the composer, inserted at the caret. */
  sources?: { id: string; label: string; description?: string }[];
  sourcesLabel?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const listId = useId();
  const [mentionOpen, setMentionOpen] = useState(false);
  const [caret, setCaret] = useState(value.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const trigger = value.slice(0, caret).match(/(?:^|\s)@([^\s@]*)$/);
  const query = trigger?.[1] ?? "";
  const matches = sources.filter(source => `${source.label} ${source.description ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    if (!mentionOpen) return;
    const close = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMentionOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [mentionOpen]);

  function chooseMention(source: (typeof sources)[number]) {
    const before = value.slice(0, caret);
    const start = trigger ? before.lastIndexOf("@") : caret;
    const prefix = value.slice(0, start);
    const inserted = `${prefix && !/\s$/.test(prefix) && !trigger ? " " : ""}@${source.label} `;
    setValue(`${prefix}${inserted}${value.slice(caret)}`);
    const nextCaret = prefix.length + inserted.length;
    setCaret(nextCaret);
    setMentionOpen(false);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(nextCaret, nextCaret);
    });
  }

  function updateInput(element: HTMLInputElement | HTMLTextAreaElement, composing = false) {
    setValue(element.value);
    const position = element.selectionStart ?? element.value.length;
    setCaret(position);
    setActiveIndex(0);
    if (!composing) setMentionOpen(sources.length > 0 && /(?:^|\s)@[^\s@]*$/.test(element.value.slice(0, position)));
  }

  const mentionPanel = mentionOpen && !disabled ? (
    <div className="absolute left-0 bottom-full z-30 mb-2 w-80 max-w-full">
    <DropdownPanel width="w-full" padding="p-1">
      <div className="px-3 py-2 text-xs font-medium text-fg-grey-700">选择{sourcesLabel}对象 · 输入名称筛选</div>
      <div id={listId} role="listbox" aria-label={`选择${sourcesLabel}对象`} className="max-h-56 w-full overflow-y-auto">
        {matches.length ? matches.map((source, index) => (
          <button key={source.id} id={`${listId}-${index}`} type="button" role="option" aria-selected={index === activeIndex}
            onMouseDown={event => event.preventDefault()} onClick={() => chooseMention(source)}
            className={`flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm ${index === activeIndex ? "bg-fg-grey-100" : "hover:bg-fg-grey-50"}`}>
            <span className="w-full break-words text-fg-black">{source.label}</span>
            {source.description && <span className="text-xs text-fg-grey-700">{source.description}</span>}
          </button>
        )) : <div className="px-3 py-4 text-sm text-fg-grey-700">没有匹配的提及对象</div>}
      </div>
    </DropdownPanel>
    </div>
  ) : null;

  function setValue(next: string) {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled || sendDisabled) return;
    onSend?.(trimmed);
    if (clearOnSend) setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
    if (mentionOpen) {
      if (e.key === "Escape") { e.preventDefault(); setMentionOpen(false); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = matches.length ? (activeIndex + (e.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length : 0;
        setActiveIndex(next);
        document.getElementById(`${listId}-${next}`)?.scrollIntoView({ block: "nearest" });
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (matches[activeIndex]) chooseMention(matches[activeIndex]);
        return;
      }
    }
    const isCmd = e.metaKey || e.ctrlKey;
    const shouldSend = multiline ? (e.key === "Enter" && !e.shiftKey && (sendOnEnter || isCmd)) : (e.key === "Enter" && !e.shiftKey);
    if (shouldSend) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = value.trim().length > 0 && !disabled && !sendDisabled;

  if (multiline) {
    return (
      <div
        ref={containerRef}
        className={`relative bg-white rounded-2xl outline outline-1 outline-fg-grey-200 ${density === "compact" ? "p-3 gap-2" : "p-4 gap-3"} flex flex-col ${className}`}
      >
        {mentionPanel}
        <textarea
          ref={element => { inputRef.current = element; }}
          aria-expanded={mentionOpen}
          aria-controls={mentionOpen ? listId : undefined}
          aria-activedescendant={mentionOpen && matches[activeIndex] ? `${listId}-${activeIndex}` : undefined}
          aria-autocomplete={sources.length ? "list" : undefined}
          onSelect={event => setCaret(event.currentTarget.selectionStart)}
          onCompositionEnd={event => updateInput(event.currentTarget)}
          aria-label={inputLabel}
          value={value}
          onChange={(e) => updateInput(e.currentTarget, (e.nativeEvent as InputEvent).isComposing)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className="w-full resize-none border-0 bg-transparent px-1 py-0 text-[15px] leading-7 text-fg-black placeholder:text-fg-grey-500 focus:outline-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {showAttachment && onAttach && (
              <button type="button" aria-label={attachLabel} title={attachLabel} onClick={onAttach} disabled={disabled}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-grey-700 transition-colors hover:bg-fg-grey-100 disabled:opacity-50">
                <PaperclipLinear size={20} color="currentColor" />
              </button>
            )}
            {sources.length > 0 && <ToggleButton label={`@ ${sourcesLabel}`} disabled={disabled} active={mentionOpen} onClick={() => {
              setMentionOpen(open => !open); setActiveIndex(0); inputRef.current?.focus();
            }}>@ {sourcesLabel}</ToggleButton>}
            {toggles?.map((t) => (
              <ToggleButton
                key={t.id}
                label={t.label}
                disabled={disabled}
                active={t.active}
                onClick={t.onClick}
                icon={t.icon}
              >
                {t.label}
              </ToggleButton>
            ))}
          </div>
          <SendButton onClick={handleSend} disabled={!canSend} sendLabel={sendLabel} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative px-4 py-3 bg-white rounded-xl outline outline-1 outline-fg-grey-200 flex items-center gap-2 ${className}`}
    >
      {showAttachment && onAttach && (
        <button
          type="button"
          onClick={onAttach}
          aria-label={attachLabel}
          title={attachLabel}
          disabled={disabled}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-fg-grey-100 transition-colors text-fg-grey-700"
        >
          <PaperclipLinear size={20} color="currentColor" />
        </button>
      )}
      {mentionPanel}
      <input
        ref={element => { inputRef.current = element; }}
        onSelect={event => setCaret(event.currentTarget.selectionStart ?? value.length)}
        onCompositionEnd={event => updateInput(event.currentTarget)}
        aria-expanded={mentionOpen}
        aria-controls={mentionOpen ? listId : undefined}
        aria-activedescendant={mentionOpen && matches[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        aria-autocomplete={sources.length ? "list" : undefined}
        aria-label={inputLabel}
        type="text"
        value={value}
        onChange={(e) => updateInput(e.currentTarget, (e.nativeEvent as InputEvent).isComposing)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 text-sm text-fg-black placeholder:text-fg-grey-500 outline-none bg-transparent disabled:opacity-50"
      />
      <SendButton onClick={handleSend} disabled={!canSend} sendLabel={sendLabel} compact />
    </div>
  );
}

function ToggleButton({
  children,
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  children?: ReactNode;
  disabled?: boolean;
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={
        active
          ? "flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white transition"
          : "flex items-center gap-1.5 rounded-full bg-fg-grey-100 px-3 py-1.5 text-xs font-medium text-fg-grey-900 transition hover:bg-fg-grey-200"
      }
    >
      {icon}
      {children}
    </button>
  );
}

function SendButton({
  onClick,
  disabled,
  sendLabel,
  compact,
}: {
  onClick: () => void;
  disabled: boolean;
  sendLabel?: string;
  compact?: boolean;
}) {
  if (sendLabel) {
    return (
      <button
        type="button"
        aria-label={sendLabel}
        onClick={onClick}
        disabled={disabled}
        className="flex h-9 shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-fg-grey-300"
      >
        {sendLabel}
        <ArrowUpLinear size={15} color="var(--fg-white)" />
      </button>
    );
  }
  return (
    <button
      type="button"
      aria-label="发送消息"
      title="发送消息"
      onClick={onClick}
      disabled={disabled}
      className={`shrink-0 ${compact ? "w-9 h-9" : "w-10 h-10"} bg-accent rounded-full flex items-center justify-center transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-fg-grey-300`}
    >
      <PlainLinear size={compact ? 16 : 18} color="white" />
    </button>
  );
}
