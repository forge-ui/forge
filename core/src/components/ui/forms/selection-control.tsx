"use client";

import { type ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { Checkbox } from "../checkbox";
import { formAccents, type FormAccentColor } from "./form-utils";

// ============================================================
// Selection Controls — from Figma "Selection Control" page
// 1. Toggle (Switch) — 3 colors × 2 sizes × 2 states
// 2. RadioButton — 3 colors × 2 states
// 3. CheckboxControl — re-export of Checkbox
// 4. CheckboxWithLabel — checkbox + text with icon/avatar/dot variants
// ============================================================

export type ControlColor = FormAccentColor;

// ── Toggle ────────────────────────────────────────────────

export function Toggle({
  checked = false,
  onChange,
  color = "purple",
  disabled = false,
  size = "md",
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: ControlColor;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const isMd = size === "md";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "p-1 rounded-full inline-flex items-start transition-colors",
        isMd ? "w-9" : "w-8",
        checked ? cn(formAccents[color].bg, "justify-end") : "bg-stone-300 justify-start",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "rounded-full",
          isMd ? "w-3 h-3" : "w-3 h-3",
          checked ? "bg-white" : "bg-stone-50",
        )}
      />
    </button>
  );
}

// ── RadioButton ───────────────────────────────────────────

export function RadioButton({
  checked = false,
  onChange,
  color = "purple",
  disabled = false,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: ControlColor;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
        checked ? cn("p-[5px]", formAccents[color].bg) : "border-2 border-stone-300 bg-white",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      {checked && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
    </button>
  );
}

// ── RadioWithLabel ────────────────────────────────────────
// Figma: "Radio Button with Label" — same structure as CheckboxWithLabel
// but with RadioButton. Supports left/right radio position and dot leading.

export function RadioWithLabel({
  checked = false,
  onChange,
  label,
  color = "purple",
  radioPosition = "left",
  dotColor,
  disabled = false,
  className,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  color?: ControlColor;
  radioPosition?: "left" | "right";
  dotColor?: string;
  disabled?: boolean;
  className?: string;
}) {
  const accent = formAccents[color];

  const radioEl = (
    <RadioButton checked={checked} color={color} onChange={onChange} disabled={disabled} />
  );

  const labelEl = (
    <div className="flex items-start gap-1">
      {dotColor && <div className={cn("w-5 h-5 rounded-full shrink-0", dotColor)} />}
      <span
        className={cn(
          "text-sm leading-5 tracking-fg",
          checked ? cn(accent.text, "font-bold") : "text-fg-grey-700 font-semibold",
        )}
      >
        {label}
      </span>
    </div>
  );

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "inline-flex items-start gap-2 overflow-hidden",
        disabled && "opacity-60 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className,
      )}
    >
      {radioPosition === "left" ? <>{radioEl}{labelEl}</> : <>{labelEl}{radioEl}</>}
    </button>
  );
}

// ── CheckboxControl (re-export) ───────────────────────────

export { Checkbox as CheckboxControl } from "../checkbox";

// ── CheckboxWithLabel ─────────────────────────────────────
// Figma: "Checkbox with Label"
// Props:
//   checkboxPosition: left | right
//   leading: none | icon | avatar | dot
//   color: purple | blue | black

export function CheckboxWithLabel({
  checked = false,
  onChange,
  label,
  color = "purple",
  checkboxPosition = "left",
  icon,
  avatar,
  dotColor,
  disabled = false,
  className,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  color?: ControlColor;
  checkboxPosition?: "left" | "right";
  icon?: ReactNode;
  avatar?: string;
  dotColor?: string;
  disabled?: boolean;
  className?: string;
}) {
  const accent = formAccents[color];

  const checkboxEl = (
    <Checkbox
      checked={checked}
      color={color}
      onChange={onChange}
    />
  );

  const labelEl = (
    <div className="flex items-start gap-1">
      {icon && (
        <div className={cn("w-5 h-5 flex items-center justify-center", checked ? accent.text : "text-fg-grey-700")}>
          {icon}
        </div>
      )}
      {avatar && (
        <img className="w-5 h-5 rounded-full" src={avatar} alt="" />
      )}
      {dotColor && (
        <div className={cn("w-5 h-5 rounded-full", dotColor)} />
      )}
      <span
        className={cn(
          "text-sm leading-5 tracking-fg",
          checked ? cn(accent.text, "font-bold") : "text-fg-grey-700 font-semibold",
        )}
      >
        {label}
      </span>
    </div>
  );

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "inline-flex items-start gap-2 overflow-hidden",
        disabled && "opacity-60 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className,
      )}
    >
      {checkboxPosition === "left" ? (
        <>
          {checkboxEl}
          {labelEl}
        </>
      ) : (
        <>
          {labelEl}
          {checkboxEl}
        </>
      )}
    </button>
  );
}
