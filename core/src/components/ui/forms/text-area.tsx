"use client";

import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef, type ReactNode, type TextareaHTMLAttributes } from "react";
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

export type TextAreaProps = {
  state?: TextAreaState;
  shape?: TextAreaShape;
  color?: TextAreaColor;
  label?: string;
  errorMessage?: string;
  autoGrow?: boolean;
  headerAction?: ReactNode;
  onChange?: (value: string) => void;
  className?: string;
  textareaClassName?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color" | "onChange">;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({
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
  textareaClassName,
  id,
  disabled,
  onInput,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...textareaProps
}, forwardedRef) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const { wrapper, text } = getFieldClasses({ state, shape, color });
  const isDisabled = state === "disabled" || disabled;
  const ref = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLTextAreaElement, []);

  useLayoutEffect(() => {
    if (!autoGrow) return;
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoGrow, value]);

  const handleInput = (e: React.InputEvent<HTMLTextAreaElement>) => {
    onInput?.(e);
    if (autoGrow) {
        const el = e.currentTarget;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <FieldFrame
      label={label}
      headerAction={headerAction}
      errorMessage={errorMessage}
      showError={state === "error"}
      errorId={errorId}
      inputId={inputId}
    >
      <div className={cn("px-4 py-3 overflow-hidden", wrapper, className)}>
        <textarea
          id={inputId}
          ref={ref}
          placeholder={placeholder}
          value={value}
          disabled={isDisabled}
          aria-invalid={ariaInvalid ?? (state === "error")}
          aria-describedby={[ariaDescribedBy, state === "error" && errorMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined}
          rows={rows}
          onInput={handleInput}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn("w-full block resize-none", text, textareaClassName)}
          {...textareaProps}
        />
      </div>
    </FieldFrame>
  );
});
