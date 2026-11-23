"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import type { MotionPreference } from "../../lib/motion";
import { useFloatingContainer } from "../../internal/floating";
import { cn } from "../../lib/utils";

// ============================================================
// Tooltip — Figma: w-2 h-1 bg-fg-black rectangle arrow (NOT CSS triangle)
// position: top | bottom | left | right
// size: sm (single-line) | lg (multi-line w-44)
// ============================================================

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipSize = "sm" | "lg";

const bubbleBody = (size: TooltipSize) =>
  cn(
    "bg-fg-black rounded-md text-white text-xs font-normal leading-4 tracking-fg",
    size === "sm" ? "px-2 py-1.5 whitespace-nowrap" : "p-2 w-44"
  );

// Arrow is a 8×4 px rectangle, rotated depending on position.
// top: arrow sits below bubble (bubble is above the anchor)
// bottom: arrow sits above bubble
// left: arrow sits on the right side of bubble (bubble is to the left of anchor), rotated -90
// right: arrow sits on the left side of bubble, rotated 90
const arrowBase = "w-2 h-1 bg-fg-black";

/**
 * Static bubble — renders inline, no absolute positioning.
 * Use in showcases or anywhere you need a tooltip shape without anchoring logic.
 */
export function TooltipBubble({
  content,
  position = "top",
  size = "sm",
}: {
  content: string;
  position?: TooltipPosition;
  size?: TooltipSize;
}) {
  if (position === "top" || position === "bottom") {
    return (
      <div className="inline-flex flex-col items-center">
        {position === "bottom" && <div data-tooltip-arrow className={arrowBase} />}
        <div className={bubbleBody(size)}>{content}</div>
        {position === "top" && <div data-tooltip-arrow className={arrowBase} />}
      </div>
    );
  }
  // left / right — arrow is vertical, rotated 90deg
  return (
    <div className="inline-flex items-center">
      {position === "right" && (
        <div data-tooltip-arrow className={cn(arrowBase, "rotate-90")} />
      )}
      <div className={bubbleBody(size)}>{content}</div>
      {position === "left" && (
        <div data-tooltip-arrow className={cn(arrowBase, "-rotate-90")} />
      )}
    </div>
  );
}

/** Share the hover delay within a toolbar; once one tooltip is open, neighbours open instantly. */
export function TooltipGroup({ children, delay = 200, warmWindow = 500 }: { children: ReactNode; delay?: number; warmWindow?: number }) {
  return <TooltipPrimitive.Provider delay={delay} timeout={warmWindow}>{children}</TooltipPrimitive.Provider>;
}

type TriggerProps = { "aria-describedby"?: string };

const arrowSide =
  "data-[side=top]:top-full data-[side=bottom]:bottom-full data-[side=bottom]:rotate-180 data-[side=left]:left-full data-[side=left]:-rotate-90 data-[side=left]:origin-top-left data-[side=right]:right-full data-[side=right]:rotate-90 data-[side=right]:origin-top-right";

/**
 * Interactive tooltip — shows on hover/focus around `children`.
 *
 * - Pass `open` to control visibility externally (true/false).
 * - Omit `open` for the default hover/focus-driven behavior; keyboard focus opens immediately.
 */
export function Tooltip({
  content, position = "top", size = "sm", open, children, motion = "auto", delay, followCursor = false,
}: {
  content: string;
  position?: TooltipPosition;
  size?: TooltipSize;
  open?: boolean;
  children: ReactNode;
  motion?: MotionPreference;
  /** Initial pointer delay in milliseconds. Focus always opens immediately. */
  delay?: number;
  /** Follow a pointer while keeping the bubble within the viewport. Focus remains anchored. */
  followCursor?: boolean;
}) {
  const [active, setActive] = useState(false);
  const visible = open ?? active;
  const anchorRef = useRef<HTMLElement | null>(null);
  const attachAnchor = useCallback((node: HTMLElement | null) => { anchorRef.current = node; }, []);
  const container = useFloatingContainer(anchorRef, visible);
  const tooltipId = useId();

  const onlyChild = Children.only(children);
  const trigger = isValidElement(onlyChild)
    ? cloneElement(onlyChild as ReactElement<TriggerProps>, {
        "aria-describedby": [(onlyChild.props as TriggerProps)["aria-describedby"], visible ? tooltipId : undefined].filter(Boolean).join(" ") || undefined,
      })
    : onlyChild;

  return (
    <TooltipPrimitive.Root open={visible} onOpenChange={next => setActive(next)} trackCursorAxis={followCursor ? "both" : "none"}>
      <TooltipPrimitive.Trigger
        ref={attachAnchor}
        delay={delay}
        render={<span className="relative inline-flex" />}
        onKeyDown={event => { if (event.key === "Escape") setActive(false); }}
      >
        {trigger}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal container={container}>
        <TooltipPrimitive.Positioner side={position} sideOffset={8} collisionPadding={8} className="z-50">
          <TooltipPrimitive.Popup
            id={tooltipId}
            role="tooltip"
            data-motion={motion}
            className={cn("forge-popup forge-tooltip-position pointer-events-none relative", bubbleBody(size))}
          >
            {content}
            <TooltipPrimitive.Arrow data-tooltip-arrow className={cn("absolute", arrowBase, arrowSide)} />
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

// ============================================================
// TooltipAnchor — 14×14 icon trigger paired with Tooltip
// Figma: p-0.5 + Bold Duotone icon w-3.5 h-3.5
// state: idle (transparent) | active (bg-fg-grey-200 rounded)
// ============================================================

export type TooltipAnchorState = "idle" | "active";

export function TooltipAnchor({
  icon,
  state = "idle",
  className,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  state?: TooltipAnchorState;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      className={cn(
        "p-0.5 inline-flex items-center justify-center gap-1 rounded transition-colors",
        state === "active"
          ? "bg-fg-grey-200 text-fg-grey-700"
          : "text-fg-grey-500 hover:bg-fg-grey-200 hover:text-fg-grey-700",
        className
      )}
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>
    </button>
  );
}
