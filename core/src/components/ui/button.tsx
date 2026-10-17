"use client";

import { HoldButton } from "../../internal/hold-button";
import type { MotionPreference } from "../../lib/motion";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { ActionStatus, useActionEffect, type ActionResult } from "../../internal/action-effect";

// ============================================================
// Button — Forge UI Kit text button
// variant: primary (solid), secondary (light bg), tertiary (outline)
// color: purple, dark, blue, red, green, yellow, grey, black
// size: lg, md, sm
// Padding: asymmetric when icon present (pl-3.5 pr-4 / pl-4 pr-3.5)
// ============================================================

const buttonVariants = {
  purple: {
    primary: "bg-fg-violet text-white",
    secondary: "bg-fg-violet-100 text-fg-violet",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-violet-300 text-fg-violet",
  },
  dark: {
    primary: "bg-fg-violet-800 text-white",
    secondary: "bg-fg-violet-300 text-fg-violet-800",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-violet-800 text-fg-violet-800",
  },
  blue: {
    primary: "bg-fg-blue text-white",
    secondary: "bg-fg-blue-50 text-fg-blue",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-blue-300 text-fg-blue",
  },
  red: {
    primary: "bg-fg-red text-white",
    secondary: "bg-fg-red-50 text-fg-red",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-red-300 text-fg-red",
  },
  green: {
    primary: "bg-fg-green-500 text-white",
    secondary: "bg-fg-green-50 text-fg-green-500",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-green-300 text-fg-green-500",
  },
  yellow: {
    primary: "bg-fg-yellow text-fg-black",
    secondary: "bg-fg-yellow-50 text-fg-yellow-900",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-yellow-300 text-fg-yellow-900",
  },
  grey: {
    primary: "bg-fg-grey-700 text-fg-black",
    secondary: "bg-fg-grey-100 text-fg-grey-900",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-900",
  },
  black: {
    primary: "bg-fg-black text-white",
    secondary: "bg-fg-grey-100 text-fg-black",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-grey-500 text-fg-black",
  },
  "blue-dark": {
    primary: "bg-fg-blue-800 text-white",
    secondary: "bg-fg-blue-100 text-fg-blue-800",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-blue-800 text-fg-blue-800",
  },
} as const;

// Figma padding: icon-left → pl-3.5 pr-4, icon-right → pl-4 pr-3.5, no-icon → px-4
const buttonSizes = {
  lg: { base: "py-3.5 text-sm leading-5", noIcon: "px-4", iconLeft: "pl-3.5 pr-4", iconRight: "pl-4 pr-3.5" },
  md: { base: "py-3 text-sm leading-5", noIcon: "px-3.5", iconLeft: "pl-3 pr-3.5", iconRight: "pl-3.5 pr-3" },
  sm: { base: "py-2.5 text-xs leading-4", noIcon: "px-3", iconLeft: "pl-2.5 pr-3", iconRight: "pl-3 pr-2.5" },
} as const;

export type ButtonColor = keyof typeof buttonVariants;
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "hold";
export type ButtonHoldLabels = { idle?: string; done?: string; undo?: string };
export type ButtonEffect = "glass" | "magnetic" | "ripple" | "roll";
export type ButtonProps = {
  children?: ReactNode; color?: ButtonColor; variant?: ButtonVariant; size?: ButtonSize;
  motion?: MotionPreference; iconLeft?: ReactNode; iconRight?: ReactNode; className?: string;
  /** Only used by variant="hold"; milliseconds. */
  holdDuration?: number; onConfirm?: () => void; onUndo?: () => void;
  confirmed?: boolean; locale?: "zh" | "en"; holdLabels?: ButtonHoldLabels;
  effect?: ButtonEffect; loading?: boolean; result?: ActionResult;
  /** Controlled progress, from 0 to 100. */
  progress?: number; loadingLabel?: ReactNode; resultLabel?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">;
export type ButtonSize = keyof typeof buttonSizes;

export function Button({
  children,
  color = "blue",
  variant = "primary",
  size = "lg",
  type = "button",
  disabled = false,
  motion = "auto",
  iconLeft,
  iconRight,
  className = "",
  holdDuration, onConfirm, onUndo, confirmed, locale, holdLabels,
  effect, loading = false, result = "idle", progress, loadingLabel, resultLabel,
  ...props
}: ButtonProps) {
  const effects = useActionEffect(effect, motion, disabled || loading);
  if (variant === "hold") return <HoldButton {...props} type={type} disabled={disabled || loading} aria-busy={loading || props["aria-busy"]} color={color} size={size} motion={motion} iconLeft={iconLeft} iconRight={iconRight} className={className} holdDuration={holdDuration} onConfirm={onConfirm} onUndo={onUndo} confirmed={confirmed} locale={locale} holdLabels={holdLabels}>{children}</HoldButton>;
  const sizeConfig = buttonSizes[size];
  const hasIcon = !!(iconLeft || iconRight);
  const paddingClass = iconLeft ? sizeConfig.iconLeft : iconRight ? sizeConfig.iconRight : sizeConfig.noIcon;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      data-motion={motion}
      data-effect={effect}
      data-size={effect === "glass" ? size : undefined}
      data-result={result === "idle" ? undefined : result}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={cn(
        sizeConfig.base,
        paddingClass,
        buttonVariants[color][variant],
        "forge-button rounded-full inline-flex justify-center items-center overflow-hidden font-bold tracking-fg",
        hasIcon ? "gap-1" : "gap-2",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      {...props}
      onPointerMove={(event) => { effects.move(event); props.onPointerMove?.(event); }}
      onPointerLeave={(event) => { effects.leave(event); props.onPointerLeave?.(event); }}
      onPointerDown={(event) => { effects.move(event); props.onPointerDown?.(event); }}
      onClick={(event) => { effects.press(event.currentTarget); props.onClick?.(event); }}
    >
      {effect === "glass" && <span aria-hidden className="forge-glass-sheen" />}
      {progress !== undefined && <span aria-hidden className="forge-action-progress" style={{ width: `${Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0}%` }} />}
      {(loading || result !== "idle") && <ActionStatus loading={loading} result={result} motion={motion} />}
      {iconLeft && !loading && result === "idle" && <span className="forge-action-icon w-5 h-5 flex items-center justify-center">{iconLeft}</span>}
      <span className="forge-action-label">{loading ? loadingLabel ?? (locale === "en" ? "Processing…" : "处理中…") : result !== "idle" ? resultLabel ?? (result === "success" ? (locale === "en" ? "Done" : "已完成") : (locale === "en" ? "Try again" : "请重试")) : effect === "roll" && typeof children === "string" ? <><span className="sr-only">{children}</span>{Array.from(children).map((letter, index) => <span aria-hidden="true" className="forge-roll-letter" style={{ transitionDelay: `${index * 18}ms` }} data-letter={letter} key={index}>{letter === " " ? "\u00a0" : letter}</span>)}</> : children}</span>
      {iconRight && !loading && result === "idle" && <span className="forge-action-icon w-5 h-5 flex items-center justify-center">{iconRight}</span>}
    </button>
  );
}
