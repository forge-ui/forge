"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { useId, type ReactNode } from "react";
import { MinusLinear, PlusLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { FieldFrame } from "./field-utils";
import type { FormAccentColor } from "./form-utils";
import { floatingFieldClass, floatingIconButtonClass, floatingInputClass, type FloatingFieldShape, type FloatingFieldState } from "./floating-field";

// Numeric input with step buttons, keyboard (Arrow / PageUp / Home / End) and locale formatting.

export type NumberFieldState = FloatingFieldState;
export type NumberFieldShape = FloatingFieldShape;
export type NumberFieldColor = FormAccentColor;

export interface NumberFieldProps {
  value?: number | null;
  defaultValue?: number;
  /** `null` when the input is cleared. */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Display format, e.g. `{ style: "currency", currency: "CNY" }` or `{ style: "percent" }`. */
  format?: Intl.NumberFormatOptions;
  label?: string;
  placeholder?: string;
  /** Text after the number, e.g. a unit. */
  suffix?: ReactNode;
  errorMessage?: string;
  state?: NumberFieldState;
  shape?: NumberFieldShape;
  color?: NumberFieldColor;
  width?: string;
  headerAction?: ReactNode;
  name?: string;
  locale?: "zh" | "en";
  className?: string;
}

export function NumberField({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  format,
  label,
  placeholder,
  suffix,
  errorMessage,
  state = "idle",
  shape = "rounded",
  color = "blue",
  width,
  headerAction,
  name,
  locale = "zh",
  className,
}: NumberFieldProps) {
  const inputId = useId();
  const errorId = useId();
  const isError = state === "error";

  return (
    <FieldFrame
      label={label}
      headerAction={headerAction}
      errorMessage={errorMessage}
      showError={isError}
      errorId={errorId}
      inputId={inputId}
      className={cn("max-w-full", className)}
    >
      <NumberFieldPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={next => onChange?.(next)}
        min={min}
        max={max}
        step={step}
        format={format}
        locale={locale === "en" ? "en-US" : "zh-CN"}
        disabled={state === "disabled"}
        name={name}
        style={{ width: width ?? "100%", maxWidth: "100%" }}
      >
        <NumberFieldPrimitive.Group className={cn(floatingFieldClass({ state, shape, color }), "h-12 px-2")}>
          <NumberFieldPrimitive.Decrement aria-label={locale === "en" ? "Decrease" : "减少"} className={cn(floatingIconButtonClass, "size-8 rounded-full hover:bg-fg-grey-100 data-disabled:opacity-40")}>
            <MinusLinear size={18} />
          </NumberFieldPrimitive.Decrement>
          <NumberFieldPrimitive.Input
            id={inputId}
            placeholder={placeholder}
            aria-invalid={isError || undefined}
            aria-describedby={isError && errorMessage ? errorId : undefined}
            className={cn(floatingInputClass(state), "min-w-0 text-center tabular-nums")}
          />
          {suffix && <span className="shrink-0 text-sm leading-5 tracking-fg text-fg-grey-700">{suffix}</span>}
          <NumberFieldPrimitive.Increment aria-label={locale === "en" ? "Increase" : "增加"} className={cn(floatingIconButtonClass, "size-8 rounded-full hover:bg-fg-grey-100 data-disabled:opacity-40")}>
            <PlusLinear size={18} />
          </NumberFieldPrimitive.Increment>
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
    </FieldFrame>
  );
}
