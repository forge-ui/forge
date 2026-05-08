"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { accentColors, type AccentColor } from "./accent-utils";
import { TooltipBubble, type TooltipPosition } from "./tooltip";

export type IconTriggerAccent = AccentColor;
export type IconTriggerState = "idle" | "hover" | "open";
export type IconTriggerSurface = "default" | "onColoredBg";
export type IconTriggerPanelPlacement = "top" | "bottom" | "left" | "right";
export type IconTriggerPanel = ReactNode | ((close: () => void) => ReactNode);

export function IconTrigger({
  icon,
  accent = "purple",
  state: stateProp,
  surface = "default",
  badge,
  tooltip,
  tooltipPosition = "right",
  onClick,
  ariaLabel,
  className,
  panel,
  panelPlacement = "bottom",
}: {
  icon: ReactNode;
  accent?: IconTriggerAccent;
  state?: IconTriggerState;
  surface?: IconTriggerSurface;
  badge?: number;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  /** External click handler. If set, takes over (no built-in popover). */
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  /** Optional panel. `ReactNode` or `(close) => ReactNode` so inner elements can close it. */
  panel?: IconTriggerPanel;
  panelPlacement?: IconTriggerPanelPlacement;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const usingInternal = !onClick && panel !== undefined;
  const state: IconTriggerState = usingInternal
    ? (internalOpen ? "open" : "idle")
    : (stateProp ?? "idle");

  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!usingInternal || !internalOpen) return;
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setInternalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [usingInternal, internalOpen]);

  const accentTheme = accentColors[accent];
  const showBadge = badge !== undefined && badge > 0;

  const stateClass = (() => {
    if (surface === "onColoredBg") {
      return state === "open"
        ? "bg-white/25 text-white"
        : state === "hover"
          ? "bg-white/10 text-white"
          : "text-white/75 hover:bg-white/10";
    }
    return state === "open"
      ? cn(accentTheme.bg, "text-white")
      : state === "hover"
        ? "bg-fg-grey-200 text-fg-grey-700"
        : "text-fg-grey-700 hover:bg-fg-grey-200";
  })();

  // Suppress tooltip when internal panel is open to avoid stacking two popovers.
  const hasInlineTooltip =
    tooltip && (state === "hover" || state === "open") && !(usingInternal && internalOpen);

  const handleClick = () => {
    if (onClick) onClick();
    else if (panel !== undefined) setInternalOpen((v) => !v);
  };

  const renderedPanel = typeof panel === "function" ? panel(() => setInternalOpen(false)) : panel;

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel ?? tooltip}
        className={cn(
          "relative p-3 rounded-full inline-flex items-center justify-center transition-colors",
          stateClass
        )}
      >
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
        {showBadge && (
          <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-fg-red rounded-full text-white text-[10px] font-semibold leading-4 tracking-fg">
            {badge}
          </span>
        )}
      </button>

      {hasInlineTooltip && (
        <div
          aria-hidden
          className={cn(
            "absolute z-50 pointer-events-none",
            tooltipPosition === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
            tooltipPosition === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
            tooltipPosition === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
            tooltipPosition === "right" && "left-full top-1/2 -translate-y-1/2 ml-2"
          )}
        >
          <TooltipBubble content={tooltip!} position={tooltipPosition} />
        </div>
      )}

      {usingInternal && internalOpen && (
        <div
          className={cn(
            "absolute z-50",
            panelPlacement === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
            panelPlacement === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
            panelPlacement === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
            panelPlacement === "right" && "left-full top-1/2 -translate-y-1/2 ml-2"
          )}
        >
          {renderedPanel}
        </div>
      )}
    </div>
  );
}
