"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { useRef, type ButtonHTMLAttributes } from "react";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";

// ============================================================
// Checkbox - 复选框
// color: purple, blue, green, red, orange
// checked/unchecked 状态
// ============================================================

const checkboxColors = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  orange: "bg-fg-red",
  black: "bg-fg-black",
} as const;

export type CheckboxColor = keyof typeof checkboxColors;

export function CheckboxVisual({
  checked,
  indeterminate = false,
  color = "blue",
  motion = "auto",
}: {
  checked: boolean;
  /** Partially selected (e.g. "select all" with some rows checked). */
  indeterminate?: boolean;
  color?: CheckboxColor;
  motion?: MotionPreference;
}) {
  return (
    <span aria-hidden className="forge-check-visual absolute inset-0" data-motion={motion} data-checked={checked || indeterminate}>
      <span className="absolute inset-0 bg-background rounded-md border-2 border-fg-grey-300" />
      <span className={cn("forge-check-fill absolute inset-0 rounded-md", checkboxColors[color])} />
      <svg className="absolute inset-0 w-5 h-5" viewBox="0 0 20 20" fill="none">
        <path className="forge-check-tick" pathLength="1" d={indeterminate ? "M6 10H14" : "M5.28 10.36L8.33 13.22L14.72 6.86"} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  color = "blue",
  onChange,
  disabled = false,
  motion = "auto",
  name,
  value,
  required,
  className,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: {
  checked?: boolean;
  /** Partially selected state; shown as a dash and announced as "mixed". */
  indeterminate?: boolean;
  color?: CheckboxColor;
  onChange?: (checked: boolean) => void;
  motion?: MotionPreference;
  /** Form field name; the checkbox submits `value` (default "on") when checked. */
  name?: string;
  value?: string;
  required?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "onChange" | "type" | "value" | "name">) {
  const prevented = useRef(false);
  return (
    <CheckboxPrimitive.Root
      {...(props as Record<string, unknown>)}
      nativeButton
      render={<button type="button" />}
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      name={name}
      value={value}
      required={required}
      aria-label={ariaLabel ?? "复选框"}
      onClick={(event) => {
        onClick?.(event as unknown as Parameters<NonNullable<typeof onClick>>[0]);
        prevented.current = event.defaultPrevented;
      }}
      onCheckedChange={(next, details) => {
        // A consumer onClick that calls preventDefault() still vetoes the change.
        if (prevented.current) { prevented.current = false; details.cancel(); return; }
        onChange?.(next);
      }}
      className={cn(
        "w-5 h-5 relative shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-blue",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <CheckboxVisual checked={checked} indeterminate={indeterminate} color={color} motion={motion} />
    </CheckboxPrimitive.Root>
  );
}
