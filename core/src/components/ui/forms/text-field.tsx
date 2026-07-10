"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/utils";
import {
  FieldFrame,
  FieldTag,
  getFieldClasses,
  type FieldColor,
  type FieldShape,
  type FieldState,
} from "./field-utils";

export type TextFieldState = FieldState;
export type TextFieldShape = FieldShape;
export type TextFieldColor = FieldColor;

export interface TextFieldTag {
  label: string;
  value: string;
}

export type TextFieldProps = {
  state?: TextFieldState;
  shape?: TextFieldShape;
  color?: TextFieldColor;
  label?: string;
  errorMessage?: string;
  headerAction?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  suffix?: ReactNode;
  tags?: TextFieldTag[];
  onRemoveTag?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "onChange">;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField({
  placeholder,
  value,
  state = "idle",
  shape = "rounded",
  color = "purple",
  label,
  errorMessage,
  headerAction,
  iconLeft,
  iconRight,
  suffix,
  type = "text",
  tags,
  onRemoveTag,
  onChange,
  className,
  inputClassName,
  id,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...inputProps
}, ref) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const { wrapper, text } = getFieldClasses({ state, shape, color });
  const isDisabled = state === "disabled" || disabled;
  const hasTags = tags && tags.length > 0;
  // Tag chips already have internal padding (p-2), so the outer wrapper uses
  // tighter p-2 to match Figma's "Multiple" variant height exactly.
  const padding = hasTags ? "p-2" : "px-4 py-3";

  return (
    <FieldFrame
      label={label}
      headerAction={headerAction}
      errorMessage={errorMessage}
      showError={state === "error"}
      errorId={errorId}
      inputId={inputId}
    >
      <div className={cn("flex items-center gap-1", padding, wrapper, className)}>
        {iconLeft && (
          <span className="w-5 h-5 flex items-center justify-center text-fg-grey-700 shrink-0">
            {iconLeft}
          </span>
        )}
        <div className={cn("flex-1 flex items-center gap-2 min-w-0", hasTags && "flex-wrap")}>
          {hasTags &&
            tags.map((tag) => (
              <FieldTag
                key={tag.value}
                label={tag.label}
                color={color}
                onRemove={onRemoveTag ? () => onRemoveTag(tag.value) : undefined}
              />
            ))}
          <input
            id={inputId}
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            disabled={isDisabled}
            aria-invalid={ariaInvalid ?? (state === "error")}
            aria-describedby={[ariaDescribedBy, state === "error" && errorMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn("min-w-0 flex-1", text, inputClassName)}
            {...inputProps}
          />
        </div>
        {suffix && (
          <span className="flex items-center gap-1 text-fg-grey-700 text-sm font-normal leading-5 tracking-fg shrink-0">
            {suffix}
          </span>
        )}
        {iconRight && (
          <span className="w-5 h-5 flex items-center justify-center text-fg-grey-700 shrink-0">
            {iconRight}
          </span>
        )}
      </div>
    </FieldFrame>
  );
});
