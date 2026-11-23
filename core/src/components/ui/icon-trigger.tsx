"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { type ReactNode, useCallback, useId, useRef, useState } from "react";
import type { MotionPreference } from "../../lib/motion";
import { IconTriggerButton } from "../../internal/icon-trigger-button";
import { cn } from "../../lib/utils";
import type { AccentColor } from "./accent-utils";
import { Tooltip, type TooltipPosition } from "./tooltip";

export type IconTriggerAccent = AccentColor;
export type IconTriggerState = "idle" | "hover" | "open";
export type IconTriggerSurface = "default" | "onColoredBg";
export type IconTriggerPanelPlacement = "top" | "bottom" | "left" | "right";
export type IconTriggerPanel = ReactNode | ((close: () => void) => ReactNode);

export function IconTrigger({
  icon,
  accent = "blue",
  state: stateProp,
  surface = "default",
  badge,
  tooltip,
  tooltipPosition = "right",
  onClick,
  ariaLabel,
  className,
  motion = "auto",
  panel,
  panelPlacement = "bottom",
  initialFocus = false,
  panelAlign = "center",
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
  motion?: MotionPreference;
  /** Optional panel. `ReactNode` or `(close) => ReactNode` so inner elements can close it. */
  panel?: IconTriggerPanel;
  panelPlacement?: IconTriggerPanelPlacement;
  initialFocus?: "first" | "selected" | false;
  panelAlign?: "center" | "start" | "end";
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const usingInternal = !onClick && panel !== undefined;
  const state: IconTriggerState = usingInternal
    ? (internalOpen ? "open" : "idle")
    : (stateProp ?? "idle");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();
  const close = useCallback(() => setInternalOpen(false), []);

  const button = (
    <IconTriggerButton
      icon={icon}
      badge={badge}
      accent={accent}
      surface={surface}
      state={state}
      motion={motion}
      aria-label={ariaLabel ?? tooltip}
      aria-expanded={!usingInternal && stateProp !== undefined ? stateProp === "open" : undefined}
      onClick={onClick ? () => onClick() : undefined}
    />
  );

  const focusTarget = () => {
    if (!initialFocus) return false;
    const node = panelRef.current;
    const selected = initialFocus === "selected" ? node?.querySelector<HTMLElement>('[aria-checked="true"],[aria-selected="true"]') : null;
    return selected ?? node?.querySelector<HTMLElement>('button:not(:disabled),input:not(:disabled),[tabindex="0"]') ?? true;
  };

  const trigger = usingInternal ? (
    <PopoverPrimitive.Root open={internalOpen} onOpenChange={next => setInternalOpen(next)} modal={false}>
      <PopoverPrimitive.Trigger ref={triggerRef} render={button} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side={panelPlacement} align={panelAlign} sideOffset={8} collisionPadding={8} className="z-50">
          <PopoverPrimitive.Popup ref={panelRef} id={panelId} data-icon-trigger-panel data-motion={motion} initialFocus={focusTarget} className="forge-popup outline-none">
            {typeof panel === "function" ? panel(close) : panel}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  ) : button;

  // Static `hover` / `open` states keep the tooltip visible for showcases; an open panel hides it.
  const tooltipOpen = usingInternal ? (internalOpen ? false : undefined) : stateProp === "hover" || stateProp === "open" ? true : undefined;

  return (
    <div className={cn("relative inline-flex", className)}>
      {tooltip ? <Tooltip content={tooltip} position={tooltipPosition} open={tooltipOpen} motion={motion}>{trigger}</Tooltip> : trigger}
    </div>
  );
}
