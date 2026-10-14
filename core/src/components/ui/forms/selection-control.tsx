"use client";

import type { MotionPreference } from "../../../lib/motion";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "../../../internal/motion";
import { cn } from "../../../lib/utils";
import { CheckboxVisual } from "../checkbox";
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

export type ToggleProps = {
  checked?: boolean;
  /** Initial value when checked is not supplied. */
  defaultChecked?: boolean;
  motion?: MotionPreference;
  onChange?: (checked: boolean) => void;
  color?: ControlColor;
  disabled?: boolean;
  size?: "sm" | "md";
  ariaLabel?: string;
  /** Allow dragging the thumb; clicking and keyboard activation remain available. */
  draggable?: boolean;
  thumbIcon?: ReactNode;
};

type ToggleDrag = {
  pointerId: number;
  startX: number;
  scale: number;
  travel: number;
  startChecked: boolean;
  moved: boolean;
  offset: number;
};

export function Toggle({
  checked,
  defaultChecked = false,
  motion = "auto",
  onChange,
  color = "purple",
  disabled = false,
  size = "md",
  ariaLabel = "开关",
  draggable = false,
  thumbIcon,
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const active = checked ?? internalChecked;
  const noMotion = useReducedMotion(motion);
  const thumbRef = useRef<HTMLDivElement>(null);
  const drag = useRef<ToggleDrag | null>(null);
  const skipClick = useRef(false);
  const previousChecked = useRef(active);
  const [dragView, setDragView] = useState<{ offset: number; startChecked: boolean } | null>(null);
  const isMd = size === "md";

  // A consumer update or disabled state cancels an in-flight gesture.
  if (dragView && (disabled || !draggable || dragView.startChecked !== active)) setDragView(null);
  useEffect(() => {
    if (drag.current) skipClick.current = true;
    drag.current = null;
  }, [active, disabled, draggable]);

  useEffect(() => {
    const changed = previousChecked.current !== active;
    previousChecked.current = active;
    if (!changed || noMotion || disabled || !thumbRef.current?.animate) return;
    const animation = thumbRef.current.animate([
      { scale: "1 1" },
      { scale: "1.3 1", offset: .35 },
      { scale: "1 1" },
    ], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
    return () => animation.cancel();
  }, [active, disabled, noMotion]);

  function change(next: boolean) {
    if (disabled || next === active) return;
    if (checked === undefined) setInternalChecked(next);
    onChange?.(next);
  }

  function cancelDrag() {
    drag.current = null;
    setDragView(null);
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (disabled || event.button !== 0 || event.isPrimary === false || drag.current) return;
    skipClick.current = false;
    if (!draggable) return;
    const track = event.currentTarget;
    const rect = track.getBoundingClientRect();
    const trackStyle = getComputedStyle(track);
    const layoutWidth = track.offsetWidth || rect.width || (isMd ? 36 : 32);
    const scale = rect.width / layoutWidth || 1;
    const paddingLeft = Number.parseFloat(trackStyle.paddingLeft) || 4;
    const paddingRight = Number.parseFloat(trackStyle.paddingRight) || 4;
    const thumbWidth = thumbRef.current?.offsetWidth || 12;
    const travel = Math.max(0, layoutWidth - paddingLeft - paddingRight - thumbWidth);
    drag.current = { pointerId: event.pointerId, startX: event.clientX, scale, travel, startChecked: active, moved: false, offset: active ? travel : 0 };
    track.setPointerCapture?.(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId || disabled) return;
    const dx = (event.clientX - gesture.startX) / gesture.scale;
    gesture.moved ||= Math.abs(dx) > Math.max(1, gesture.travel * .15);
    if (!gesture.moved) return;
    gesture.offset = Math.max(0, Math.min(gesture.travel, (gesture.startChecked ? gesture.travel : 0) + dx));
    setDragView({ offset: gesture.offset, startChecked: gesture.startChecked });
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    moveDrag(event);
    cancelDrag();
    if (gesture.moved) {
      skipClick.current = true;
      if (gesture.startChecked === active) change(gesture.offset > gesture.travel / 2);
    }
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <button
      type="button"
      role="switch"
      data-motion={noMotion ? "none" : "auto"}
      data-draggable={draggable || undefined}
      data-dragging={Boolean(dragView) || undefined}
      aria-label={ariaLabel}
      aria-checked={active}
      disabled={disabled}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={event => {
        if (drag.current?.pointerId !== event.pointerId) return;
        skipClick.current = true;
        cancelDrag();
      }}
      onLostPointerCapture={event => {
        if (drag.current?.pointerId !== event.pointerId) return;
        skipClick.current = true;
        cancelDrag();
      }}
      onKeyDown={event => {
        if (event.key === "Escape") { skipClick.current = true; cancelDrag(); }
      }}
      onClick={event => {
        if (skipClick.current && event.detail !== 0) { skipClick.current = false; return; }
        skipClick.current = false;
        change(!active);
      }}
      style={draggable ? { touchAction: "pan-y", userSelect: "none" } : undefined}
      className={cn(
        "forge-toggle p-1 rounded-full inline-flex items-start",
        isMd ? "w-9" : "w-8",
        active ? formAccents[color].bg : "bg-fg-grey-300",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <div
        ref={thumbRef}
        aria-hidden="true"
        style={{
          translate: `${dragView?.offset ?? (active ? (isMd ? 16 : 12) : 0)}px`,
          scale: !noMotion && dragView ? "1.15 1" : "1 1",
          transformOrigin: active ? "right center" : "left center",
          transition: noMotion ? "none" : `translate ${dragView ? "0s" : ".5s cubic-bezier(.34,1.16,.64,1)"}, scale .2s ease, background-color .25s ease`,
        }}
        className={cn(
          "forge-toggle-thumb rounded-full w-3 h-3 flex items-center justify-center text-fg-black",
          active ? "bg-white" : "bg-fg-grey-50",
        )}
      >{thumbIcon}</div>
    </button>
  );
}

// ── RadioButton ───────────────────────────────────────────

export function RadioButton({
  checked = false,
  onChange,
  color = "purple",
  disabled = false,
  ariaLabel = "单选项",
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: ControlColor;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-label={ariaLabel}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(true)}
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
        checked ? cn("p-[5px]", formAccents[color].bg) : "border-2 border-fg-grey-300 bg-white",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      {checked && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
    </button>
  );
}

function RadioVisual({ checked, color }: { checked: boolean; color: ControlColor }) {
  return (
    <span
      aria-hidden
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0",
        checked ? cn("p-[5px]", formAccents[color].bg) : "border-2 border-fg-grey-300 bg-white",
      )}
    >
      {checked && <span className="w-2.5 h-2.5 bg-white rounded-full" />}
    </span>
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
  tabIndex,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  color?: ControlColor;
  radioPosition?: "left" | "right";
  dotColor?: string;
  disabled?: boolean;
  className?: string;
  tabIndex?: number;
}) {
  const accent = formAccents[color];

  const radioEl = <RadioVisual checked={checked} color={color} />;

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
      role="radio"
      tabIndex={tabIndex}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(true)}
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
  motion = "auto",
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
  motion?: MotionPreference;
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
    <span aria-hidden className="w-5 h-5 relative shrink-0">
      <CheckboxVisual checked={checked} color={color} motion={motion} />
    </span>
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
      role="checkbox"
      aria-checked={checked}
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
