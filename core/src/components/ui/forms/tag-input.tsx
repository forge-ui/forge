"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { CloseCircleLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { FieldFrame } from "./field-utils";
import { floatingFieldClass, floatingInputClass, type FloatingFieldShape } from "./floating-field";
import { formAccents, type FormAccentColor } from "./form-utils";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  /** Upper limit; the input disables when reached. */
  max?: number;
  /** Return an error message to reject a tag, e.g. an invalid email. */
  validate?: (tag: string) => string | null | undefined;
  /** Keys that commit the typed text, besides Enter. */
  separators?: string[];
  disabled?: boolean;
  errorMessage?: string;
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  locale?: "zh" | "en";
  className?: string;
}

/** Free-form multiple values: keywords, email recipients, labels. Paste a list to add several at once. */
export function TagInput({ value, defaultValue = [], onChange, label, placeholder, max, validate, separators = [",", "，"], disabled = false, errorMessage, name, color = "blue", shape = "rounded", locale = "zh", className }: TagInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const tags = value ?? inner;
  const [draft, setDraft] = useState("");
  const [rejected, setRejected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();
  const accent = formAccents[color];
  const full = max !== undefined && tags.length >= max;
  const message = rejected ?? errorMessage;
  const state = disabled ? "disabled" : message ? "error" : "idle";

  function update(next: string[]) {
    if (value === undefined) setInner(next);
    onChange?.(next);
  }

  const splitter = new RegExp(`[${separators.map(char => char.replace(/[\\\]^-]/g, "\\$&")).join("")}\\n]`);

  /** Adds every valid value; invalid ones stay in the input with the first error shown. */
  function add(raw: string) {
    const candidates = raw.split(splitter).map(text => text.trim()).filter(Boolean);
    const next = [...tags];
    const invalid: string[] = [];
    let problem: string | null = null;
    for (const tag of candidates) {
      if (max !== undefined && next.length >= max) break;
      if (next.includes(tag)) continue;
      const message = validate?.(tag);
      if (message) { invalid.push(tag); problem ??= message; continue; }
      next.push(tag);
    }
    setRejected(problem);
    setDraft(invalid.join(separators[0] ?? ","));
    if (next.length !== tags.length) update(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" || separators.includes(event.key)) {
      if (!draft.trim()) return;
      event.preventDefault();
      add(draft);
    } else if (event.key === "Backspace" && !draft && tags.length) {
      update(tags.slice(0, -1));
    }
  }

  return (
    <FieldFrame label={label} errorMessage={message ?? undefined} showError={state === "error"} errorId={errorId} inputId={inputId} className={cn("max-w-full", className)}>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(floatingFieldClass({ state, shape, color }), "min-h-12 flex-wrap gap-1.5 py-2 cursor-text")}
      >
        {tags.map(tag => (
          <span key={tag} className={cn("inline-flex max-w-full items-center gap-0.5 rounded-full py-1 pl-2.5 pr-1.5 text-xs font-medium leading-[18px] tracking-fg", accent.bgTint, accent.text)}>
            <span className="truncate">{tag}</span>
            {!disabled && (
              <button type="button" aria-label={`${locale === "en" ? "Remove" : "移除"} ${tag}`} onClick={event => { event.stopPropagation(); update(tags.filter(item => item !== tag)); inputRef.current?.focus(); }} className="flex size-[18px] shrink-0 cursor-pointer items-center justify-center">
                <CloseCircleLinear size={14} />
              </button>
            )}
            {name && <input type="hidden" name={name} value={tag} />}
          </span>
        ))}
        <InputPrimitive
          ref={inputRef}
          id={inputId}
          value={draft}
          disabled={disabled || full}
          aria-invalid={state === "error" || undefined}
          aria-describedby={state === "error" ? errorId : undefined}
          placeholder={tags.length ? undefined : placeholder ?? (locale === "en" ? "Type and press Enter" : "输入后按回车添加")}
          onValueChange={next => { setDraft(next); if (rejected) setRejected(null); }}
          onKeyDown={onKeyDown}
          onBlur={() => { if (draft.trim()) add(draft); }}
          onPaste={event => {
            const text = event.clipboardData.getData("text");
            if (!splitter.test(text)) return;
            event.preventDefault();
            add(text);
          }}
          className={cn(floatingInputClass(state), "h-7")}
        />
      </div>
    </FieldFrame>
  );
}
