"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from "react";
import { cn } from "../../lib/utils";

// ============================================================
// Tooltip — Figma: w-2 h-1 bg-slate-950 rectangle arrow (NOT CSS triangle)
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
        {position === "bottom" && <div className={arrowBase} />}
        <div className={bubbleBody(size)}>{content}</div>
        {position === "top" && <div className={arrowBase} />}
      </div>
    );
  }
  // left / right — arrow is vertical, rotated 90deg
  return (
    <div className="inline-flex items-center">
      {position === "right" && (
        <div className={cn(arrowBase, "rotate-90")} />
      )}
      <div className={bubbleBody(size)}>{content}</div>
      {position === "left" && (
        <div className={cn(arrowBase, "-rotate-90")} />
      )}
    </div>
  );
}

// Absolute offsets for Tooltip wrapper: position the bubble relative to the anchor.
const wrapperOffsets: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
  left: "right-full top-1/2 -translate-y-1/2 mr-1",
  right: "left-full top-1/2 -translate-y-1/2 ml-1",
};

/**
 * Interactive tooltip — shows on hover/focus around `children`.
 * Reuses TooltipBubble for the visual so arrow/shape stays consistent.
 *
 * - Pass `open` to control visibility externally (true/false).
 * - Omit `open` for the default hover/focus-driven behavior.
 */
type TriggerProps = {
  "aria-describedby"?: string;
  onFocus?: (e: FocusEvent<HTMLElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
};

export function Tooltip({
  content,
  position = "top",
  size = "sm",
  open,
  children,
}: {
  content: string;
  position?: TooltipPosition;
  size?: TooltipSize;
  /** Controlled visibility. When undefined, tooltip follows hover/focus. */
  open?: boolean;
  children: ReactNode;
}) {
  const [active, setActive] = useState(false);
  const visible = open ?? active;
  const tooltipId = useId();

  // Inject aria-describedby + focus handlers onto the real trigger element
  // so screen readers associate the tooltip with the focusable element
  // (e.g. a button), not the wrapper div.
  const onlyChild = Children.only(children);
  const trigger =
    isValidElement(onlyChild)
      ? cloneElement(onlyChild as ReactElement<TriggerProps>, {
          "aria-describedby": visible ? tooltipId : undefined,
          onFocus: (e: FocusEvent<HTMLElement>) => {
            (onlyChild.props as TriggerProps).onFocus?.(e);
            setActive(true);
          },
          onBlur: (e: FocusEvent<HTMLElement>) => {
            (onlyChild.props as TriggerProps).onBlur?.(e);
            setActive(false);
          },
        })
      : onlyChild;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {trigger}
      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn("absolute z-50 pointer-events-none", wrapperOffsets[position])}
        >
          <TooltipBubble content={content} position={position} size={size} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// TooltipAnchor — 14×14 icon trigger paired with Tooltip
// Figma: p-0.5 + Bold Duotone icon w-3.5 h-3.5
// state: idle (transparent) | active (bg-gray-200 rounded)
// ============================================================

export type TooltipAnchorState = "idle" | "active";

export function TooltipAnchor({
  icon,
  state = "idle",
  className,
  onClick,
}: {
  icon: ReactNode;
  state?: TooltipAnchorState;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
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
