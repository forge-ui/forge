"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUpLinear, PaperclipLinear, PlainLinear } from "solar-icon-set";

export type ChatInputBarToggle = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function ChatInputBar({
  placeholder = "Type a message...",
  value: controlledValue,
  onChange,
  onSend,
  className = "",
  multiline = false,
  rows = 3,
  toggles,
  sendLabel,
  showAttachment = !toggles,
  disabled,
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
  /** Disable the input + send */
  disabled?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  function setValue(next: string) {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const isCmd = e.metaKey || e.ctrlKey;
    const shouldSend = multiline ? (e.key === "Enter" && isCmd) : (e.key === "Enter" && !e.shiftKey);
    if (shouldSend) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  if (multiline) {
    return (
      <div
        className={`bg-white rounded-2xl outline outline-1 outline-fg-grey-200 p-4 flex flex-col gap-3 ${className}`}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className="w-full resize-none border-0 bg-transparent px-1 py-0 text-[15px] leading-7 text-fg-black placeholder:text-fg-grey-500 focus:outline-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {showAttachment && (
              <ToggleButton label="Attach">
                <PaperclipLinear size={15} color="var(--fg-grey-900)" />
              </ToggleButton>
            )}
            {toggles?.map((t) => (
              <ToggleButton
                key={t.id}
                label={t.label}
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
      className={`px-4 py-3 bg-white rounded-xl outline outline-1 outline-fg-grey-200 flex items-center gap-2 ${className}`}
    >
      {showAttachment && (
        <button
          type="button"
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-fg-grey-100 transition-colors text-fg-grey-700"
        >
          <PaperclipLinear size={20} color="currentColor" />
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
}: {
  children?: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
        onClick={onClick}
        disabled={disabled}
        className="flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-fg-grey-300"
      >
        {sendLabel}
        <ArrowUpLinear size={15} color="var(--fg-white)" />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`shrink-0 ${compact ? "w-9 h-9" : "w-10 h-10"} bg-accent rounded-full flex items-center justify-center transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-fg-grey-300`}
    >
      <PlainLinear size={compact ? 16 : 18} color="white" />
    </button>
  );
}
