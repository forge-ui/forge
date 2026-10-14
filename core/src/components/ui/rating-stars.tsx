"use client";

import { useState } from "react";
import { StarBold } from "../../icons";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";

export type RatingStarsSize = "sm" | "md" | "lg";
const sizeMap: Record<RatingStarsSize, { icon: number; text: string }> = {
  sm: { icon: 12, text: "text-xs leading-4" },
  md: { icon: 16, text: "text-sm leading-5" },
  lg: { icon: 20, text: "text-base leading-6" },
};

export function RatingStars({ value, total = 5, showValue = true, size = "md", className = "", onChange, readOnly = !onChange, disabled = false, locale = "zh", ariaLabel, motion = "auto" }: {
  value: number; total?: number; showValue?: boolean; size?: RatingStarsSize; className?: string;
  /** Omit to keep the original read-only rating. */
  onChange?: (value: number) => void;
  readOnly?: boolean; disabled?: boolean; locale?: "zh" | "en"; ariaLabel?: string; motion?: MotionPreference;
}) {
  const [preview, setPreview] = useState<number | null>(null);
  const reduced = useReducedMotion(motion);
  const s = sizeMap[size];
  const count = Number.isFinite(total) ? Math.max(1, Math.floor(total)) : 5;
  const current = Number.isFinite(value) ? Math.min(count, Math.max(0, value)) : 0;
  const interactive = !readOnly && Boolean(onChange);
  const shown = interactive && !disabled ? preview ?? current : current;
  const filled = Math.round(shown);
  const select = (next: number) => { if (interactive && !disabled) onChange?.(Math.min(count, Math.max(0, next))); };
  return <div className={`inline-flex items-center gap-1 ${className}`} data-motion={reduced ? "none" : motion}>
    {showValue && <span className={`${s.text} font-medium text-fg-grey-700 tracking-fg`}>{current.toFixed(1)}/{count}</span>}
    <div className="inline-flex items-center gap-1" role={interactive ? "slider" : undefined} tabIndex={interactive && !disabled ? 0 : undefined}
      aria-label={interactive ? ariaLabel ?? (locale === "zh" ? "评分" : "Rating") : undefined}
      aria-valuemin={interactive ? 0 : undefined} aria-valuemax={interactive ? count : undefined} aria-valuenow={interactive ? current : undefined}
      aria-valuetext={interactive ? locale === "zh" ? `${current} / ${count} 星` : `${current} of ${count} stars` : undefined} aria-disabled={interactive ? disabled : undefined}
      onPointerLeave={() => setPreview(null)} onBlur={() => setPreview(null)}
      onKeyDown={event => { if (!interactive || disabled) return; const keys: Record<string, number> = { ArrowRight: current + 1, ArrowUp: current + 1, ArrowLeft: current - 1, ArrowDown: current - 1, Home: 0, End: count }; const next = keys[event.key] ?? (/^\d$/.test(event.key) ? Number(event.key) : undefined); if (next !== undefined) { event.preventDefault(); select(next); } }}>
      {Array.from({ length: count }, (_, index) => interactive ? <span key={index} aria-hidden="true" onPointerEnter={() => !disabled && setPreview(index + 1)} onPointerDown={event => event.preventDefault()} onClick={() => select(index + 1)} className={`forge-rating-star inline-flex p-1 ${disabled ? "opacity-50" : "cursor-pointer"}`} data-filled={index < filled}>
        <StarBold size={s.icon} color={index < filled ? "var(--fg-yellow)" : "var(--fg-grey-200)"} />
      </span> : <StarBold key={index} size={s.icon} color={index < filled ? "var(--fg-yellow)" : "var(--fg-grey-200)"} />)}
    </div>
  </div>;
}
