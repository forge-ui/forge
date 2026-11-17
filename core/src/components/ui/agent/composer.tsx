"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { PlusLinear } from "../../../icons";
import { QuickActionFan, QuickActionGlyph, composerMorph } from "../../../internal/composer-quick-actions";
import { SendButton } from "../../../internal/composer-send";
import { useReducedMotion } from "../../../internal/motion";
import { PromptModelMenu } from "../../../internal/prompt-model-menu";
import { cn } from "../../../lib/utils";
import type { ChatInputBarQuickAction } from "../chat-input-bar";
import type { ComposerModel, ComposerStatus } from "../composer-types";
import { pick, type AgentLocale } from "./agent-utils";

type ComposerContextValue = {
  value: string;
  setValue: (value: string) => void;
  send: () => void;
  canSend: boolean;
  status: ComposerStatus;
  stop?: () => void;
  disabled: boolean;
  placeholder: string;
  quickActions: ChatInputBarQuickAction[];
  quickOpen: boolean;
  setQuickOpen: (open: boolean) => void;
  selectedQuick?: ChatInputBarQuickAction;
  clearQuick: () => void;
  bindInput: (element: HTMLTextAreaElement | null) => void;
  focusInput: () => void;
  locale: AgentLocale;
};

const ComposerContext = createContext<ComposerContextValue | null>(null);

function useComposer(part: string) {
  const context = useContext(ComposerContext);
  if (!context) throw new Error(`${part} must be inside <Composer>`);
  return context;
}

export type ComposerProps = {
  children: ReactNode;
  /** Called with the trimmed text and the quick action picked for it, if any. */
  onSend: (text: string, quickAction?: ChatInputBarQuickAction) => void;
  /** Controlled draft; omit to let the composer keep it. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** "running" turns send into stop. */
  status?: ComposerStatus;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  /** Cards that fan out above the input on an empty conversation, as in ChatInputBar. */
  quickActions?: ChatInputBarQuickAction[];
  /** Folds the quick-action cards once the conversation has messages. */
  hasMessages?: boolean;
  /** Keep the draft after sending, e.g. until the host confirms. */
  keepOnSend?: boolean;
  locale?: AgentLocale;
  className?: string;
};

/**
 * The composer in parts: pick ComposerInput, ComposerToolbar, ComposerAction, ComposerModelMenu and
 * ComposerSend and lay them out yourself. Same surface, quick-action fan and send button as
 * ChatInputBar, which stays the ready-made version.
 */
export function Composer({ children, onSend, value: controlled, onValueChange, status = "idle", onStop, disabled = false, placeholder, quickActions = [], hasMessages = false, keepOnSend = false, locale = "zh", className }: ComposerProps) {
  const [draft, setDraft] = useState("");
  const value = controlled ?? draft;
  const setValue = (next: string) => { if (controlled === undefined) setDraft(next); onValueChange?.(next); };
  // The fan follows the conversation: open while empty, folded once it has messages; a toggle holds until that changes.
  const [quick, setQuick] = useState({ hasMessages, open: !hasMessages });
  if (quick.hasMessages !== hasMessages) setQuick({ hasMessages, open: !hasMessages });
  const [selectedId, setSelectedId] = useState<string>();
  const selectedQuick = quickActions.find(action => action.id === selectedId);
  const input = useRef<HTMLTextAreaElement | null>(null);
  const focusInput = () => input.current?.focus();
  const canSend = !disabled && status === "idle" && value.trim().length > 0;
  const setQuickOpen = (open: boolean) => setQuick({ hasMessages, open });
  const quickOpen = quick.open && !disabled;

  const context: ComposerContextValue = {
    value,
    setValue,
    canSend,
    status,
    stop: onStop,
    disabled,
    placeholder: selectedQuick?.placeholder ?? placeholder ?? pick(locale, "输入消息…", "Type a message…"),
    quickActions,
    quickOpen,
    setQuickOpen,
    selectedQuick,
    clearQuick: () => { setSelectedId(undefined); setQuickOpen(true); focusInput(); },
    bindInput: element => { input.current = element; },
    focusInput,
    locale,
    send: () => {
      if (!canSend) return;
      onSend(value.trim(), selectedQuick);
      if (!keepOnSend) setValue("");
      setSelectedId(undefined);
      setQuickOpen(false);
    },
  };

  return (
    <ComposerContext.Provider value={context}>
      <div
        data-has-quick={quickActions.length > 0 || undefined}
        data-quick-open={(quickActions.length > 0 && quickOpen) || undefined}
        data-multiline
        data-prompt-status={status}
        className={cn("forge-composer-shell", className)}
      >
        {quickActions.length > 0 && (
          <QuickActionFan
            actions={quickActions}
            open={quickOpen}
            selectedId={selectedId}
            disabled={disabled}
            label={pick(locale, "快捷操作", "Quick actions")}
            onChoose={action => { setSelectedId(action.id); setQuickOpen(false); action.onClick?.(); focusInput(); }}
            onClose={() => { setQuickOpen(false); focusInput(); }}
          />
        )}
        <div onPointerDown={event => { if (event.target === event.currentTarget) { event.preventDefault(); focusInput(); } }} className="forge-composer-surface relative flex flex-col gap-3 rounded-2xl bg-background p-4 outline outline-1 outline-border">
          {children}
        </div>
      </div>
    </ComposerContext.Provider>
  );
}

/** Anything above the input inside the surface: attachments, a reply quote, the prompt queue. */
export function ComposerHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

export type ComposerInputProps = {
  /** Visible rows before the field grows. */
  rows?: number;
  /** Rows it grows to before scrolling. */
  maxRows?: number;
  /** Enter sends and Shift+Enter breaks the line; off makes Enter a line break and ⌘/Ctrl+Enter sends. */
  sendOnEnter?: boolean;
  label?: string;
  className?: string;
};

/** The text field: grows with its text, shows the picked quick action as a removable chip. */
export function ComposerInput({ rows = 2, maxRows = 8, sendOnEnter = true, label, className }: ComposerInputProps) {
  const composer = useComposer("ComposerInput");
  const reduced = useReducedMotion();
  const { value, bindInput } = composer;
  const field = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    const element = field.current;
    if (!element) return;
    element.style.height = "auto";
    const line = parseFloat(getComputedStyle(element).lineHeight) || 20;
    element.style.height = `${Math.min(element.scrollHeight, line * maxRows)}px`;
  }, [value, maxRows]);
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (composer.selectedQuick && (event.key === "Escape" || (event.key === "Backspace" && !value))) { event.preventDefault(); composer.clearQuick(); return; }
    const submit = sendOnEnter ? event.key === "Enter" && !event.shiftKey : event.key === "Enter" && (event.metaKey || event.ctrlKey);
    if (submit) { event.preventDefault(); composer.send(); }
  };
  return (
    <div className="flex min-w-0 items-start gap-2">
      <AnimatePresence initial={false}>
        {composer.selectedQuick && (
          <motion.button
            key={composer.selectedQuick.id}
            type="button"
            onClick={composer.clearQuick}
            aria-label={pick(composer.locale, `移除操作：${composer.selectedQuick.label}`, `Remove ${composer.selectedQuick.label}`)}
            className={`forge-quick-chip forge-quick-chip--${composer.selectedQuick.kind ?? "custom"}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={reduced ? { duration: 0 } : composerMorph}
          >
            {composer.selectedQuick.icon ?? (composer.selectedQuick.kind && <QuickActionGlyph id={composer.selectedQuick.kind} />)}<span>{composer.selectedQuick.label}</span><span aria-hidden="true">×</span>
          </motion.button>
        )}
      </AnimatePresence>
      <textarea
        ref={element => { field.current = element; bindInput(element); }}
        rows={rows}
        value={value}
        disabled={composer.disabled}
        placeholder={composer.placeholder}
        aria-label={label ?? pick(composer.locale, "消息内容", "Message")}
        onChange={event => composer.setValue(event.target.value)}
        onKeyDown={onKeyDown}
        className={cn("min-w-0 flex-1 resize-none bg-transparent text-sm leading-6 tracking-fg text-fg-black outline-none placeholder:text-fg-grey-700 disabled:cursor-not-allowed", className)}
      />
    </div>
  );
}

/** The row under the input. Put actions first and wrap the right-hand group in `<span className="ml-auto">`. */
export function ComposerToolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}>{children}</div>;
}

export type ComposerActionProps = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  /** Toggles the quick-action cards instead of calling onClick. */
  toggleQuickActions?: boolean;
  active?: boolean;
  /** Shows the label next to the icon. */
  showLabel?: boolean;
};

/** A toolbar button: attach, dictate, web search, or the + that brings the quick-action cards back. */
export function ComposerAction({ label, icon, onClick, toggleQuickActions = false, active, showLabel = false }: ComposerActionProps) {
  const composer = useComposer("ComposerAction");
  const pressed = toggleQuickActions ? composer.quickOpen : active;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={composer.disabled}
      onClick={() => (toggleQuickActions ? composer.setQuickOpen(!composer.quickOpen) : onClick?.())}
      className={cn("forge-composer-plus inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full text-sm font-medium text-fg-black transition-colors hover:bg-fg-grey-100 aria-pressed:bg-accent-soft aria-pressed:text-accent disabled:opacity-50", showLabel ? "px-3" : "w-9")}
    >
      {icon ?? <PlusLinear size={18} className={cn("transition-transform", toggleQuickActions && composer.quickOpen && "rotate-45")} />}
      {showLabel && label}
    </button>
  );
}

export type ComposerModelMenuProps = {
  models: ComposerModel[];
  model?: string;
  onModelChange?: (id: string) => void;
  label?: string;
};

/** The model picker from ChatInputBar, as a toolbar part. */
export function ComposerModelMenu({ models, model, onModelChange, label }: ComposerModelMenuProps) {
  const composer = useComposer("ComposerModelMenu");
  const [open, setOpen] = useState(false);
  if (!models.length) return null;
  return <PromptModelMenu models={models} model={model} label={label ?? pick(composer.locale, "选择模型", "Model")} disabled={composer.disabled} open={open} onOpenChange={setOpen} onModelChange={onModelChange} />;
}

/** Send, or stop while a reply streams. */
export function ComposerSend({ label, stopLabel, stoppingLabel }: { label?: string; stopLabel?: string; stoppingLabel?: string }) {
  const composer = useComposer("ComposerSend");
  return (
    <SendButton
      status={composer.status}
      onStop={composer.stop}
      stopLabel={stopLabel ?? pick(composer.locale, "停止生成", "Stop")}
      stoppingLabel={stoppingLabel ?? pick(composer.locale, "正在停止…", "Stopping…")}
      onClick={composer.send}
      disabled={!composer.canSend}
      sendLabel={label}
      compact
    />
  );
}
