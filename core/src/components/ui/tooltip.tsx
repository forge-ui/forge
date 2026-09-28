"use client";

import {
  createContext, useContext, useEffect, useMemo, useRef,
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from "react";
import type { MotionPreference } from "../../lib/motion";
import { MotionPresence } from "../../internal/motion";
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
};

const TooltipTimingContext = createContext<{ delay: number; isWarm: () => boolean; setOpen: (id: string, open: boolean) => void } | null>(null);

function createTooltipTiming(delay: number, warmWindow: number) {
  const state = { open: new Set<string>(), warmUntil: 0 };
  return { delay, isWarm: () => state.open.size > 0 || Date.now() < state.warmUntil, setOpen: (id: string, visible: boolean) => {
    if (visible) state.open.add(id);
    else if (state.open.delete(id)) state.warmUntil = Date.now() + warmWindow;
  } };
}

/** Share the initial hover delay within a toolbar; keyboard focus is immediate. */
export function TooltipGroup({ children, delay = 200, warmWindow = 500 }: { children: ReactNode; delay?: number; warmWindow?: number }) {
  const value = useMemo(() => createTooltipTiming(delay, warmWindow), [delay, warmWindow]);
  return <TooltipTimingContext.Provider value={value}>{children}</TooltipTimingContext.Provider>;
}

export function Tooltip({
  content, position = "top", size = "sm", open, children, motion = "auto", delay,
}: {
  content: string;
  position?: TooltipPosition;
  size?: TooltipSize;
  open?: boolean;
  children: ReactNode;
  motion?: MotionPreference;
  /** Initial pointer delay in milliseconds. Focus always opens immediately. */
  delay?: number;
}) {
  const timing = useContext(TooltipTimingContext);
  const [active, setActive] = useState(false);
  const visible = open ?? active;
  const tooltipId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  function cancel() { if (timer.current !== null) { clearTimeout(timer.current); timer.current = null; } }
  function show() { cancel(); setActive(true); }
  function hide() { cancel(); setActive(false); }
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  // A removed visible tooltip must not keep its group warm forever.
  useEffect(() => { timing?.setOpen(tooltipId, visible); return () => timing?.setOpen(tooltipId, false); }, [timing, visible, tooltipId]);

  const onlyChild = Children.only(children);
  const trigger = isValidElement(onlyChild)
    ? cloneElement(onlyChild as ReactElement<TriggerProps>, {
        "aria-describedby": [(onlyChild.props as TriggerProps)["aria-describedby"], visible ? tooltipId : undefined].filter(Boolean).join(" ") || undefined,
      })
    : onlyChild;
  return <div className="relative inline-flex"
    onFocusCapture={() => { focused.current = true; show(); }}
    onBlurCapture={() => { focused.current = false; if (!hovered.current) hide(); }}
    onMouseEnter={() => { hovered.current = true; cancel(); const wait = timing?.isWarm() ? 0 : (delay ?? timing?.delay ?? 200); if (wait <= 0) show(); else timer.current = setTimeout(show, wait); }}
    onMouseLeave={() => { hovered.current = false; if (!focused.current) hide(); }}
    onKeyDown={(event) => { if (event.key === "Escape") hide(); }}>
    {trigger}
    <MotionPresence open={visible} motion={motion} id={tooltipId} role="tooltip" className={cn("absolute z-50 pointer-events-none", wrapperOffsets[position])}>
      <TooltipBubble content={content} position={position} size={size} />
    </MotionPresence>
  </div>;
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
