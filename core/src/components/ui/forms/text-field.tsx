"use client";

import { useId, type ReactNode } from "react";
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

export function TextField({
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
  tags,
  onRemoveTag,
  onChange,
  className,
  id,
}: {
  placeholder?: string;
  value?: string;
  state?: TextFieldState;
  shape?: TextFieldShape;
  color?: TextFieldColor;
  label?: string;
  errorMessage?: string;
  headerAction?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Right-aligned suffix (e.g. "cm", currency, unit, dropdown trigger) */
  suffix?: ReactNode;
  /** Render tag chips before the input (Multiple variant) */
  tags?: TextFieldTag[];
  onRemoveTag?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
  /** Optional id, defaults to a useId-generated value so labels can link via htmlFor */
  id?: string;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const { wrapper, text } = getFieldClasses({ state, shape, color });
  const isDisabled = state === "disabled";
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
            type="text"
            placeholder={placeholder}
            value={value}
            disabled={isDisabled}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn("min-w-0 flex-1", text)}
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
}
