"use client";

import { forwardRef, type ReactNode } from "react";
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
  color = "purple",
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
}: {
  label: string;
  color: FieldColor;
  onRemove?: () => void;
}) {
  const accent = formAccents[color];
  return (
    <span className={cn("inline-flex items-center gap-0.5 p-2 rounded-full", tagBgByColor[color])}>
      <span className={cn("text-xs font-bold leading-[18px] tracking-fg whitespace-nowrap", accent.text)}>
        {label}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-[18px] h-[18px] flex items-center justify-center cursor-pointer shrink-0"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={accent.text} />
          </svg>
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
    inputId?: string;
    display?: "flex" | "inline-flex";
    children: ReactNode;
    className?: string;
  }
>(function FieldFrame(
  { label, headerAction, errorMessage, showError, inputId, display = "flex", children, className },
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
        <span className="text-fg-red text-xs leading-4 tracking-fg">{errorMessage}</span>
      )}
    </div>
  );
});
