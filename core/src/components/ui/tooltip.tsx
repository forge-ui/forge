"use client";

import {
  createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useCallback,
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
import { MotionPresence, useReducedMotion } from "../../internal/motion";
import { createPortal } from "react-dom";
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

// Absolute offsets for Tooltip wrapper: position the bubble relative to the anchor.
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

type TooltipBox = { left: number; top: number };
const TooltipTimingContext = createContext<{ delay: number; isWarm: () => boolean; setOpen: (id: string, open: boolean) => void; getPosition: () => TooltipBox | null; setPosition: (box: TooltipBox) => void } | null>(null);

function createTooltipTiming(delay: number, warmWindow: number) {
  const state = { open: new Set<string>(), warmUntil: 0, position: null as TooltipBox | null };
  return { delay, getPosition: () => state.position, setPosition: (box: TooltipBox) => { state.position = box; }, isWarm: () => state.open.size > 0 || Date.now() < state.warmUntil, setOpen: (id: string, visible: boolean) => {
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
  const timing = useContext(TooltipTimingContext);
  const reduced = useReducedMotion(motion);
  const [active, setActive] = useState(false);
  const visible = open ?? active;
  const tooltipId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const anchor = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const attachAnchor = useCallback((node: HTMLDivElement | null) => {
    anchor.current = node;
    if (node) setPortalTarget(node.closest("dialog") ?? node.ownerDocument.body);
  }, []);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const place = useCallback(() => {
    if (!anchor.current || !bubble.current) return;
    const box = anchor.current.getBoundingClientRect();
    const tip = bubble.current.getBoundingClientRect();
    const point = followCursor && !focused.current ? pointer.current : null;
    const x = point?.x ?? box.left + box.width / 2;
    const y = point?.y ?? box.top + box.height / 2;
    const gap = 8;
    let left = x - tip.width / 2;
    let top = position === "bottom" ? (point?.y ?? box.bottom) + gap : (point?.y ?? box.top) - tip.height - gap;
    if (position === "left") { left = (point?.x ?? box.left) - tip.width - gap; top = y - tip.height / 2; }
    if (position === "right") { left = (point?.x ?? box.right) + gap; top = y - tip.height / 2; }
    const finalBox = { left: Math.max(gap, Math.min(left, window.innerWidth - tip.width - gap)), top: Math.max(gap, Math.min(top, window.innerHeight - tip.height - gap)) };
    bubble.current.style.left = `${finalBox.left}px`;
    bubble.current.style.top = `${finalBox.top}px`;
    bubble.current.style.setProperty("--forge-tooltip-arrow-x", position === "top" || position === "bottom" ? `${Math.max(-tip.width / 2 + 8, Math.min(tip.width / 2 - 8, x - finalBox.left - tip.width / 2))}px` : "0px");
    bubble.current.style.setProperty("--forge-tooltip-arrow-y", position === "left" || position === "right" ? `${Math.max(-tip.height / 2 + 8, Math.min(tip.height / 2 - 8, y - finalBox.top - tip.height / 2))}px` : "0px");
    timing?.setPosition(finalBox);
  }, [followCursor, position, timing]);
  useLayoutEffect(() => {
    if (!visible || !portalTarget || !bubble.current) return;
    const tip = bubble.current;
    const dialog = portalTarget.tagName === "DIALOG" ? portalTarget as HTMLDialogElement : null;
    let frame = 0;
    const trackDialog = () => {
      frame = 0;
      place();
      if (dialog?.getAnimations().some(animation => animation.playState === "running")) frame = window.requestAnimationFrame(trackDialog);
    };
    // A popover inside the owning dialog stays above its backdrop and escapes
    // the dialog's animated transform / clipping without changing coordinates.
    const syncLayer = () => {
      if (!tip.showPopover) return;
      const hidden = dialog && (!dialog.open || dialog.dataset.state === "closed");
      if (hidden) {
        if (tip.matches(":popover-open")) tip.hidePopover();
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        if (!tip.matches(":popover-open")) tip.showPopover();
        if (dialog?.getAnimations && !frame) frame = window.requestAnimationFrame(trackDialog);
      }
      place();
    };
    const previous = timing?.isWarm() ? timing.getPosition() : null;
    syncLayer();
    place();
    const current = timing?.getPosition();
    const animation = !reduced && previous && current && bubble.current?.animate ? bubble.current.animate([{ translate: `${previous.left - current.left}px ${previous.top - current.top}px` }, { translate: "0px 0px" }], { duration: 180, easing: "cubic-bezier(.2,.8,.2,1)" }) : null;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    if (bubble.current) observer?.observe(bubble.current);
    if (anchor.current) observer?.observe(anchor.current);
    const dialogObserver = dialog ? new window.MutationObserver(syncLayer) : null;
    if (dialog) dialogObserver?.observe(dialog, { attributes: true, attributeFilter: ["open", "data-state"] });
    window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { animation?.cancel(); observer?.disconnect(); dialogObserver?.disconnect(); if (frame) window.cancelAnimationFrame(frame); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [visible, place, content, timing, reduced, portalTarget]);
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
  return <div ref={attachAnchor} className="relative inline-flex"
    onPointerMove={(event) => { pointer.current = { x: event.clientX, y: event.clientY }; if (visible && followCursor) place(); }}
    onFocusCapture={() => { focused.current = true; show(); }}
    onBlurCapture={() => { focused.current = false; if (!hovered.current) hide(); }}
    onMouseEnter={() => { hovered.current = true; cancel(); const wait = timing?.isWarm() ? 0 : (delay ?? timing?.delay ?? 200); if (wait <= 0) show(); else timer.current = setTimeout(show, wait); }}
    onMouseLeave={() => { hovered.current = false; if (!focused.current) hide(); }}
    onKeyDown={(event) => { if (event.key === "Escape") hide(); }}>
    {trigger}
    {portalTarget && createPortal(<MotionPresence ref={bubble} open={visible} motion={motion} id={tooltipId} role="tooltip" popover="manual" className="forge-tooltip-position fixed z-50 pointer-events-none" style={{ right: "auto", bottom: "auto", margin: 0, border: 0, padding: 0, background: "transparent", overflow: "visible" }}>
      <TooltipBubble content={content} position={position} size={size} />
    </MotionPresence>, portalTarget)}
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
