"use client";

import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "../../../lib/utils";
import {
  FieldFrame,
  getFieldClasses,
  type FieldColor,
  type FieldShape,
  type FieldState,
} from "./field-utils";

export type TextAreaState = FieldState;
export type TextAreaShape = FieldShape;
export type TextAreaColor = FieldColor;

export function TextArea({
  placeholder,
  value,
  state = "idle",
  shape = "rounded",
  color = "purple",
  label,
  errorMessage,
  rows = 5,
  autoGrow = true,
  headerAction,
  onChange,
  className,
  id,
}: {
  placeholder?: string;
  value?: string;
  state?: TextAreaState;
  shape?: TextAreaShape;
  color?: TextAreaColor;
  label?: string;
  errorMessage?: string;
  /** Initial & minimum visible rows */
  rows?: number;
  /** Grow with content (height follows scrollHeight). Default true. */
  autoGrow?: boolean;
  headerAction?: ReactNode;
  onChange?: (value: string) => void;
  className?: string;
  /** Optional id, defaults to a useId-generated value so labels can link via htmlFor */
  id?: string;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const { wrapper, text } = getFieldClasses({ state, shape, color });
  const isDisabled = state === "disabled";
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!autoGrow) return;
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoGrow, value]);

  const handleInput = autoGrow
    ? (e: React.FormEvent<HTMLTextAreaElement>) => {
        const el = e.currentTarget;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    : undefined;

  return (
    <FieldFrame
      label={label}
      headerAction={headerAction}
      errorMessage={errorMessage}
      showError={state === "error"}
      inputId={inputId}
    >
      <div className={cn("px-4 py-3 overflow-hidden", wrapper, className)}>
        <textarea
          id={inputId}
          ref={ref}
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
          rows={rows}
          onInput={handleInput}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn("w-full block resize-none", text)}
        />
      </div>
    </FieldFrame>
  );
}
