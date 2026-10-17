"use client";

import { forwardRef, type ReactNode } from "react";
import { CloseCircleLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { formAccents, type FormAccentColor } from "./form-utils";

// ============================================================
// Shared state/shape/color primitives for text-based form fields.
// Used by: TextField, TextArea (single/multiline text inputs
// sharing identical state matrix and label/error layout).
// ============================================================

export type FieldState = "idle" | "focus" | "filled" | "disabled" | "error";
export type FieldShape = "rounded" | "pill";
export type FieldColor = FormAccentColor;

export interface FieldClasses {
  /** Outer box (outline + background by state) */
  wrapper: string;
  /** Inner text element (color + placeholder color by state) */
  text: string;
  /** Rounded / pill class (applied to both wrapper and text) */
  shape: string;
}

/**
 * Compute the wrapper/text class pair for a text field based on state.
 * Keeps the 5-state matrix (idle/focus/filled/disabled/error) in a single place.
 */
export function getFieldClasses({
  state = "idle",
  shape = "rounded",
  color = "blue",
}: {
  state?: FieldState;
  shape?: FieldShape;
  color?: FieldColor;
} = {}): FieldClasses {
  const accent = formAccents[color];
  const shapeClass = shape === "pill" ? "rounded-full" : "rounded-xl";

  const wrapper = cn(
    "outline outline-1 outline-offset-[-1px] transition-all",
    shapeClass,
    state === "error" && "bg-fg-red-100 outline-fg-red",
    state === "disabled" && "bg-fg-grey-200 outline-fg-grey-200 cursor-not-allowed",
    state === "focus" && `bg-transparent ${accent.outline}`,
    (state === "filled" || state === "idle") && "bg-white outline-fg-grey-200",
  );

  const text = cn(
    "bg-transparent outline-none text-sm font-normal leading-5 tracking-fg",
    state === "error" && "text-fg-red placeholder:text-fg-red",
    state === "disabled" && "text-fg-grey-700 cursor-not-allowed placeholder:text-fg-grey-700",
    (state === "filled" || state === "focus") && "text-fg-black",
    state === "idle" && "text-fg-black placeholder:text-fg-grey-700",
  );

  return { wrapper, text, shape: shapeClass };
}

// ── Tag chip ─────────────────────────────────────────────────
// From Figma "Purple/Blue/Black Tag Option" — Opacity style (light bg + colored text)

const tagBgByColor: Record<FieldColor, string> = {
  purple: "bg-fg-violet-100",
  blue: "bg-fg-blue-50",
  black: "bg-fg-grey-100",
};

export function FieldTag({
  label,
  color,
  onRemove,
  selected = false,
  locale = "zh",
}: {
  label: string;
  color: FieldColor;
  onRemove?: () => void;
  selected?: boolean;
  locale?: "zh" | "en";
}) {
  const accent = formAccents[color];
  return (
    <span data-tag-selected={selected || undefined} className={cn("inline-flex items-center gap-0.5 p-2 rounded-full", tagBgByColor[color], selected && "outline outline-2 outline-current")}>
      <span className={cn("text-xs font-bold leading-[18px] tracking-fg whitespace-nowrap", accent.text)}>
        {label}
      </span>
      {onRemove && (
        <button
          type="button"
          aria-label={`${locale === "en" ? "Remove" : "移除"} ${label}`}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-[18px] h-[18px] flex items-center justify-center cursor-pointer shrink-0"
        >
          <CloseCircleLinear size={14} color="currentColor" />
        </button>
      )}
    </span>
  );
}

/**
 * Shared shell providing the label-row + body slot + error-message layout.
 * Keeps the label/headerAction/errorMessage markup consistent across text fields.
 *
 * Pass `inputId` to bind the <label htmlFor> — consumers should also set the
 * same id on their underlying input/textarea so clicking the label focuses it.
 */
export const FieldFrame = forwardRef<
  HTMLDivElement,
  {
    label?: string;
    headerAction?: ReactNode;
    errorMessage?: string;
    showError?: boolean;
    errorId?: string;
    inputId?: string;
    display?: "flex" | "inline-flex";
    children: ReactNode;
    className?: string;
  }
>(function FieldFrame(
  { label, headerAction, errorMessage, showError, errorId, inputId, display = "flex", children, className },
  ref,
) {
  return (
    <div ref={ref} className={cn(display, "flex-col gap-1.5", className)}>
      {(label || headerAction) && (
        <div className="flex items-center gap-2 w-full">
          {label && (
            <label
              htmlFor={inputId}
              className="flex-1 text-sm font-medium text-fg-grey-700 leading-5 tracking-fg"
            >
              {label}
            </label>
          )}
          {headerAction}
        </div>
      )}
      {children}
      {showError && errorMessage && (
        <span id={errorId} className="text-fg-red text-xs leading-4 tracking-fg">{errorMessage}</span>
      )}
    </div>
  );
});
