"use client";

import { useContext, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowUpLinear, PlainLinear, StopBold, RefreshLinear, MicrophoneLinear } from "../../icons";
import type { ComposerModel, ComposerStatus } from "./composer-types";
import { PromptModelMenu } from "../../internal/prompt-model-menu";
import { AskAiCompactComposerContext } from "../../internal/ask-ai-composer-context";
import { ComposerToolsMenu } from "../../internal/composer-tools-menu";
import type { AccentColor } from "./accent-utils";
import { DropdownPanel } from "./dropdown-panel";

export type ComposerSource = { id: string; label: string; description?: string; connected?: boolean };
export type ComposerCommand = { id: string; label: string; description?: string };

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
  showAttachment = true,
  onAttach,
  attachLabel = "添加附件",
  sendOnEnter = false,
  disabled,
  status = "idle",
  onStop,
  stopLabel = "停止生成",
  stoppingLabel = "正在停止…",
  models = [],
  model,
  onModelChange,
  modelMenuLabel = "Model",
  sendDisabled = false,
  inputLabel = "消息内容",
  clearOnSend = true,
  density = "default",
  sources = [],
  sourcesLabel = "提及",
  commands = [],
  commandsLabel = "命令",
  emptyCommandsLabel = "没有匹配的命令",
  connectedLabel = "已连接",
  onDictate,
  dictateLabel = "语音输入",
  toolsMenuLabel = "添加内容和工具",
  permissions = [],
  permission,
  onPermissionChange,
  permissionMenuLabel = "权限",
  color,
  emptySourcesLabel = "没有匹配的提及对象",
}: {
  commands?: ComposerCommand[];
  commandsLabel?: string;
  emptyCommandsLabel?: string;
  connectedLabel?: string;
  onDictate?: () => void;
  dictateLabel?: string;
  toolsMenuLabel?: string;
  /** Permission choices are owned and enforced by the caller. */
  permissions?: ComposerModel[];
  permission?: string;
  onPermissionChange?: (id: string) => void;
  permissionMenuLabel?: string;
  color?: AccentColor;
  status?: ComposerStatus;
  /** Request cancellation; caller confirms stopping, then idle. */
  onStop?: () => void;
  stopLabel?: string;
  stoppingLabel?: string;
  models?: ComposerModel[];
  model?: string;
  onModelChange?: (id: string) => void;
  modelMenuLabel?: string;
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
  /** Footer toggle chips (e.g. Deep think, Web search). Attachment and context actions remain in the plus menu. */
  toggles?: ChatInputBarToggle[];
  /** When given, send button renders as a labeled pill (label + arrow). Otherwise circular icon-only. */
  sendLabel?: string;
  /** Whether to include attachments in the plus menu. Defaults to true. */
  showAttachment?: boolean;
  onAttach?: () => void;
  attachLabel?: string;
  /** Multiline Enter sends when enabled; Shift+Enter inserts a newline. */
  sendOnEnter?: boolean;
  /** Disable editing and tool selection; active generation remains stoppable. */
  disabled?: boolean;
  /** Disable sending while keeping the draft editable. */
  sendDisabled?: boolean;
  inputLabel?: string;
  /** Controlled async callers can clear only after success. */
  clearOnSend?: boolean;
  density?: "default" | "compact";
  /** Mention suggestions displayed above the composer, inserted at the caret. */
  sources?: ComposerSource[];
  sourcesLabel?: string;
  emptySourcesLabel?: string;
}) {
  const compact = useContext(AskAiCompactComposerContext) || density === "compact";
  const [commandOpen, setCommandOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const listId = useId();
  const [modelOpen, setModelOpen] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [caret, setCaret] = useState(value.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const commandTrigger = value.slice(0, caret).match(/(?:^|\s)\/([^\s/]*)$/);
  const commandMatches = commands.filter(item => `${item.label} ${item.description ?? ""}`.toLowerCase().includes(commandTrigger?.[1]?.toLowerCase() ?? ""));
  const trigger = value.slice(0, caret).match(/(?:^|\s)@([^\s@]*)$/);
  const query = trigger?.[1] ?? "";
  const matches = sources.filter(source => `${source.label} ${source.description ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!compact || input?.tagName !== "TEXTAREA") return;
    function resize() {
      if (!input) return;
      input.style.height = "auto";
      input.style.height = `${Math.min(input.scrollHeight, 192)}px`;
    }
    resize();
    if (!input || typeof ResizeObserver === "undefined") return;
    let width = input.clientWidth;
    const observer = new ResizeObserver(() => {
      if (input.clientWidth === width) return;
      width = input.clientWidth;
      resize();
    });
    observer.observe(input);
    return () => observer.disconnect();
  }, [compact, value]);
  useEffect(() => {
    if (!mentionOpen && !commandOpen) return;
    const close = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMentionOpen(false);
      if (!containerRef.current?.contains(event.target as Node)) setCommandOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [mentionOpen, commandOpen]);

  function chooseCommand(command: ComposerCommand) {
    const before = value.slice(0, caret);
    const start = commandTrigger ? before.lastIndexOf("/") : caret;
    const prefix = value.slice(0, start);
    const inserted = `${prefix && !/\s$/.test(prefix) && !commandTrigger ? " " : ""}/${command.label} `;
    setValue(`${prefix}${inserted}${value.slice(caret)}`);
    setCaret(prefix.length + inserted.length);
    setCommandOpen(false);
    setMentionOpen(false);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(prefix.length + inserted.length, prefix.length + inserted.length);
    });
  }

  function chooseMention(source: (typeof sources)[number]) {
    const before = value.slice(0, caret);
    const start = trigger ? before.lastIndexOf("@") : caret;
    const prefix = value.slice(0, start);
    const inserted = `${prefix && !/\s$/.test(prefix) && !trigger ? " " : ""}@${source.label} `;
    setValue(`${prefix}${inserted}${value.slice(caret)}`);
    const nextCaret = prefix.length + inserted.length;
    setCaret(nextCaret);
    setMentionOpen(false);
    setCommandOpen(false);
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
    if (!composing) setCommandOpen(commands.length > 0 && /(?:^|\s)\/[^\s/]*$/.test(element.value.slice(0, position)));
    if (!composing) setMentionOpen(sources.length > 0 && /(?:^|\s)@[^\s@]*$/.test(element.value.slice(0, position)));
  }

  const commandPanel = commandOpen && !disabled ? <div data-prompt-picker className="absolute left-0 bottom-full z-30 mb-2 w-80 max-w-full"><DropdownPanel width="w-full" padding="p-1">
    <div className="px-3 py-2 text-xs font-medium text-fg-grey-700">{commandsLabel}</div>
    <ul id={`${listId}-commands`} role="listbox" aria-label={commandsLabel} className="max-h-56 overflow-y-auto">
      {commandMatches.map((item, index) => <li key={item.id}><button id={`${listId}-command-${index}`} role="option" aria-selected={index === activeIndex} type="button" onMouseDown={event => event.preventDefault()} onClick={() => chooseCommand(item)} className={`flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm ${index === activeIndex ? "bg-fg-grey-100" : "hover:bg-fg-grey-50"}`}><span>{item.label}</span>{item.description && <span className="text-xs text-fg-grey-700">{item.description}</span>}</button></li>)}
      {!commandMatches.length && <li className="px-3 py-4 text-sm text-fg-grey-700">{emptyCommandsLabel}</li>}
    </ul>
  </DropdownPanel></div> : null;
  const mentionPanel = mentionOpen && !disabled ? (
    <div data-prompt-picker className="absolute left-0 bottom-full z-30 mb-2 w-80 max-w-full">
    <DropdownPanel width="w-full" padding="p-1">
      <div className="px-3 py-2 text-xs font-medium text-fg-grey-700">选择{sourcesLabel}对象 · 输入名称筛选</div>
      <div id={listId} role="listbox" aria-label={`选择${sourcesLabel}对象`} className="max-h-56 w-full overflow-y-auto">
        {matches.length ? matches.map((source, index) => (
          <button key={source.id} id={`${listId}-${index}`} type="button" role="option" aria-selected={index === activeIndex}
            onMouseDown={event => event.preventDefault()} onClick={() => chooseMention(source)}
            className={`flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm ${index === activeIndex ? "bg-fg-grey-100" : "hover:bg-fg-grey-50"}`}>
            <span className="w-full break-words text-fg-black">{source.label}</span>
            {source.connected && <span className="text-xs text-fg-grey-700">{connectedLabel}</span>}
            {source.description && <span className="text-xs text-fg-grey-700">{source.description}</span>}
          </button>
        )) : <div className="px-3 py-4 text-sm text-fg-grey-700">{emptySourcesLabel}</div>}
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
    if (!trimmed || disabled || sendDisabled || status !== "idle") return;
    onSend?.(trimmed);
    if (clearOnSend) { setValue(""); setCaret(0); }
    setMentionOpen(false);
    setCommandOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
    if (commandOpen) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setCommandOpen(false); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(index => commandMatches.length ? (index + (e.key === "ArrowDown" ? 1 : -1) + commandMatches.length) % commandMatches.length : 0); return; }
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (commandMatches[activeIndex]) chooseCommand(commandMatches[activeIndex]); return; }
    }
    if (mentionOpen) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setMentionOpen(false); return; }
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

  const canSend = value.trim().length > 0 && !disabled && !sendDisabled && status === "idle";

  const modelPicker = models.length > 0 ? <PromptModelMenu models={models} model={model} label={modelMenuLabel} disabled={disabled} open={modelOpen} onOpenChange={setModelOpen} onModelChange={onModelChange} /> : null;
  const permissionPicker = permissions.length ? <PromptModelMenu models={permissions} model={permission} label={permissionMenuLabel} disabled={disabled} open={permissionOpen} onOpenChange={setPermissionOpen} onModelChange={onPermissionChange} /> : null;
  const extraTools = <>
    {onDictate && <button type="button" aria-label={dictateLabel} title={dictateLabel} onClick={onDictate} disabled={disabled} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-fg-grey-100"><MicrophoneLinear size={18} color="currentColor" /></button>}
  </>;
  const actionProps = { status, onStop, stopLabel, stoppingLabel };

  if (multiline) {
    return (
      <div
        ref={containerRef}
        data-accent={color}
        data-prompt-status={status}
        className={`relative bg-white rounded-2xl outline outline-1 outline-fg-grey-200 ${compact ? "p-3 gap-2" : "p-4 gap-3"} flex flex-col ${className}`}
      >
        {mentionPanel}{commandPanel}
        <textarea
          ref={element => { inputRef.current = element; }}
          aria-haspopup={sources.length || commands.length ? "listbox" : undefined}
          aria-controls={commandOpen ? `${listId}-commands` : mentionOpen ? listId : undefined}
          aria-activedescendant={commandOpen && commandMatches[activeIndex] ? `${listId}-command-${activeIndex}` : mentionOpen && matches[activeIndex] ? `${listId}-${activeIndex}` : undefined}
          aria-autocomplete={sources.length || commands.length ? "list" : undefined}
          onSelect={event => setCaret(event.currentTarget.selectionStart)}
          onCompositionEnd={event => updateInput(event.currentTarget)}
          aria-label={inputLabel}
          value={value}
          onChange={(e) => updateInput(e.currentTarget, (e.nativeEvent as InputEvent).isComposing)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={compact ? 1 : rows}
          disabled={disabled}
          className="w-full resize-none border-0 bg-transparent px-1 py-0 text-[15px] leading-7 text-fg-black placeholder:text-fg-grey-500 focus:outline-none disabled:opacity-50"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <ComposerToolsMenu label={toolsMenuLabel} attachLabel={attachLabel} sourcesLabel={sourcesLabel} commandsLabel={commandsLabel} onOpen={() => { setCaret(inputRef.current?.selectionStart ?? value.length); setMentionOpen(false); setCommandOpen(false); }} disabled={disabled} onAttach={showAttachment ? onAttach : undefined} sources={sources} commands={commands} onSource={chooseMention} onCommand={chooseCommand} />
            {extraTools}
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
          <div className="ml-auto flex min-w-0 max-w-full items-center gap-2">{permissionPicker}{modelPicker}<SendButton {...actionProps} onClick={handleSend} disabled={!canSend} sendLabel={sendLabel} /></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-accent={color}
      data-prompt-status={status}
      className={`relative px-4 py-3 bg-white rounded-xl outline outline-1 outline-fg-grey-200 flex items-center gap-2 ${className}`}
    >
      <ComposerToolsMenu label={toolsMenuLabel} attachLabel={attachLabel} sourcesLabel={sourcesLabel} commandsLabel={commandsLabel} onOpen={() => { setCaret(inputRef.current?.selectionStart ?? value.length); setMentionOpen(false); setCommandOpen(false); }} disabled={disabled} onAttach={showAttachment ? onAttach : undefined} sources={sources} commands={commands} onSource={chooseMention} onCommand={chooseCommand} />
      {mentionPanel}{commandPanel}
      <input
        ref={element => { inputRef.current = element; }}
        onSelect={event => setCaret(event.currentTarget.selectionStart ?? value.length)}
        onCompositionEnd={event => updateInput(event.currentTarget)}
        aria-haspopup={sources.length || commands.length ? "listbox" : undefined}
        aria-controls={commandOpen ? `${listId}-commands` : mentionOpen ? listId : undefined}
        aria-activedescendant={commandOpen && commandMatches[activeIndex] ? `${listId}-command-${activeIndex}` : mentionOpen && matches[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        aria-autocomplete={sources.length || commands.length ? "list" : undefined}
        aria-label={inputLabel}
        type="text"
        value={value}
        onChange={(e) => updateInput(e.currentTarget, (e.nativeEvent as InputEvent).isComposing)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 text-sm text-fg-black placeholder:text-fg-grey-500 outline-none bg-transparent disabled:opacity-50"
      />
      {extraTools}{permissionPicker}{modelPicker}<SendButton {...actionProps} onClick={handleSend} disabled={!canSend} sendLabel={sendLabel} compact />
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
  status, onStop, stopLabel, stoppingLabel,
  onClick,
  disabled,
  sendLabel,
  compact,
}: {
  status: ComposerStatus;
  onStop?: () => void;
  stopLabel: string;
  stoppingLabel: string;
  onClick: () => void;
  disabled: boolean;
  sendLabel?: string;
  compact?: boolean;
}) {
  if (status !== "idle") {
    const stopping = status === "stopping";
    const label = stopping ? stoppingLabel : stopLabel;
    return <button type="button" aria-label={label} title={label} aria-busy={stopping || undefined} disabled={stopping || !onStop}
      onClick={() => onStop?.()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fg-black text-fg-white disabled:cursor-not-allowed disabled:opacity-50">
      {stopping ? <RefreshLinear size={16} color="currentColor" /> : <StopBold size={16} color="currentColor" />}
    </button>;
  }
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
