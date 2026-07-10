"use client";

import { type ButtonHTMLAttributes } from "react";
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
  color = "purple",
}: {
  checked: boolean;
  color?: CheckboxColor;
}) {
  return checked ? (
    <>
      <span className={cn("absolute inset-0 rounded-md", checkboxColors[color])} />
      <svg
        aria-hidden
        className="absolute inset-0 w-5 h-5"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M5.28 10.36L8.33 13.22L14.72 6.86"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  ) : (
    <span className="absolute inset-0 bg-white rounded-md border-2 border-fg-grey-300" />
  );
}

export function Checkbox({
  checked = false,
  color = "purple",
  onChange,
  disabled = false,
  className,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: {
  checked?: boolean;
  color?: CheckboxColor;
  onChange?: (checked: boolean) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "onChange" | "type">) {
  return (
    <button
      {...props}
      type="button"
      role="checkbox"
      aria-label={ariaLabel ?? "复选框"}
      aria-checked={checked}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onChange?.(!checked);
      }}
      className={cn(
        "w-5 h-5 relative shrink-0",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <CheckboxVisual checked={checked} color={color} />
    </button>
  );
}
