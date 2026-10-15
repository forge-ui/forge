"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";

export interface TabsContentProps {
  /** Changing this key remounts content. Keep form state above this component. */
  activeKey: string | number;
  children?: ReactNode;
  /** Optional full panel set enables native touch scrolling and mouse dragging. */
  panels?: { key: string | number; content: ReactNode; id?: string; labelledBy?: string; ariaLabel?: string }[];
  onActiveKeyChange?: (key: string | number) => void;
  onProgressChange?: (fractionalIndex: number) => void;
  motion?: MotionPreference;
  /** Fade preserves the existing entry-only behavior. Slide also animates exit and height. */
  transition?: "fade" | "slide";
  /** Slide direction. Omit for automatic numeric-key ordering; string keys default to forward. */
  direction?: "forward" | "backward";
  id?: string;
  labelledBy?: string;
  ariaLabel?: string;
  className?: string;
}

export function TabsContent({ transition = "fade", ...props }: TabsContentProps) {
  if (props.panels) return <SwipeTabsContent {...props} />;
  if (transition === "slide") return <SlidingTabsContent {...props} />;
  const { activeKey, children, motion = "auto", id, labelledBy, ariaLabel = "标签内容", className } = props;
  return <div key={activeKey} id={id} role="tabpanel" tabIndex={0} aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : ariaLabel} data-motion={motion} data-state="open" className={cn("forge-tabs-content", className)}>{children}</div>;
}

type PanelState = {
  key: string | number;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  ariaLabel: string;
  direction: number;
  phase: "idle" | "exit" | "enter";
  ready?: boolean;
};
const enterDuration = 300;
const exitDuration = 140;
const easing = "cubic-bezier(.2,.8,.2,1)";

function SlidingTabsContent({ activeKey, children, direction, motion = "auto", id, labelledBy, ariaLabel = "标签内容", className }: TabsContentProps) {
  const reduced = useReducedMotion(motion);
  const [panel, setPanel] = useState<PanelState>({ key: activeKey, children, id, labelledBy, ariaLabel, direction: 1, phase: "idle" });
  const shell = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const height = useRef(0);
  const heightAnimation = useRef<Animation | null>(null);
  const interruptedVisual = useRef<{ key: string | number; opacity: string; transform: string } | null>(null);
  const focusedWithin = useRef(false);
  const nextDirection = direction ? (direction === "forward" ? 1 : -1) : typeof activeKey === "number" && typeof panel.key === "number" && activeKey < panel.key ? -1 : 1;

  // Only one business subtree is ever mounted. While it exits, new requests
  // replace the destination rather than queueing another transition.
  if (panel.key !== activeKey) {
    if (reduced || panel.ready) {
      setPanel({ key: activeKey, children, id, labelledBy, ariaLabel, direction: nextDirection, phase: reduced ? "idle" : "enter" });
    } else if (panel.phase !== "exit") {
      setPanel({ ...panel, direction: nextDirection, phase: "exit" });
    }
  } else if (panel.phase === "exit") {
    // Returning to the current tab cancels departure without remounting it.
    setPanel({ key: activeKey, children, id, labelledBy, ariaLabel, direction: panel.direction, phase: reduced ? "idle" : "enter" });
  } else if (panel.children !== children || panel.id !== id || panel.labelledBy !== labelledBy || panel.ariaLabel !== ariaLabel || (reduced && panel.phase !== "idle")) {
    setPanel({ ...panel, children, id, labelledBy, ariaLabel, phase: reduced ? "idle" : panel.phase });
  }

  useLayoutEffect(() => {
    const container = shell.current;
    const element = content.current;
    if (!container || !element) return;
    if (panel.phase === "exit") {
      if (element.contains(document.activeElement)) {
        focusedWithin.current = true;
        (document.activeElement as HTMLElement).blur();
      }
    } else if (focusedWithin.current && (document.activeElement === document.body || element.contains(document.activeElement))) {
      element.focus({ preventScroll: true });
      focusedWithin.current = false;
    }
    const nextHeight = element.getBoundingClientRect().height;
    const previousHeight = height.current || nextHeight;
    height.current = nextHeight;
    const animateHeight = (from: number, to: number) => {
      heightAnimation.current?.cancel();
      heightAnimation.current = null;
      if (reduced || from === to || !container.animate) return;
      const animation = container.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: enterDuration, easing });
      heightAnimation.current = animation;
      animation.onfinish = () => { if (heightAnimation.current === animation) heightAnimation.current = null; };
    };
    animateHeight(previousHeight, nextHeight);
    const interrupted = interruptedVisual.current?.key === panel.key ? interruptedVisual.current : null;
    interruptedVisual.current = null;
    const animation = !reduced && typeof element.animate === "function" && panel.phase !== "idle"
      ? element.animate(panel.phase === "exit"
        ? [{ opacity: interrupted?.opacity || 1, transform: interrupted?.transform || "translateX(0)" }, { opacity: 0, transform: `translateX(${-panel.direction * 24}px)` }]
        : [{ opacity: interrupted?.opacity || 0, transform: interrupted?.transform || `translateX(${panel.direction * 24}px)` }, { opacity: 1, transform: "translateX(0)" }],
      { duration: panel.phase === "exit" ? exitDuration : enterDuration, easing, fill: "both" })
      : null;
    const timer = panel.phase === "exit" ? window.setTimeout(() => {
      setPanel((current) => current.phase === "exit" ? { ...current, ready: true } : current);
    }, exitDuration) : undefined;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      const targetHeight = element.getBoundingClientRect().height;
      if (targetHeight === height.current) return;
      const from = heightAnimation.current ? container.getBoundingClientRect().height : height.current;
      height.current = targetHeight;
      animateHeight(from, targetHeight);
    });
    observer?.observe(element);
    return () => {
      if (animation) {
        const visual = window.getComputedStyle(element);
        interruptedVisual.current = { key: panel.key, opacity: visual.opacity, transform: visual.transform };
      }
      if (heightAnimation.current) height.current = container.getBoundingClientRect().height;
      heightAnimation.current?.cancel();
      heightAnimation.current = null;
      animation?.cancel();
      if (timer !== undefined) window.clearTimeout(timer);
      observer?.disconnect();
    };
    // Content updates are observed without restarting the transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel.key, panel.phase, reduced]);

  const exiting = panel.phase === "exit";
  return <div ref={shell} className="relative flow-root" data-tabs-transition="slide" data-motion={reduced ? "none" : motion} aria-busy={exiting || undefined} style={{ overflow: "clip" }}
    onFocusCapture={() => { focusedWithin.current = true; }}
    onBlurCapture={(event) => { if (!exiting && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) focusedWithin.current = false; }}>
    <div key={`${typeof panel.key}:${panel.key}`} ref={content} id={panel.id} role="tabpanel" tabIndex={exiting ? -1 : 0}
      aria-labelledby={panel.labelledBy} aria-label={panel.labelledBy ? undefined : panel.ariaLabel} aria-hidden={exiting || undefined} inert={exiting || undefined}
      data-state={exiting ? "closed" : "open"} className={cn("relative flow-root", className)}>{panel.children}</div>
  </div>;
}


function SwipeTabsContent({ activeKey, panels = [], onActiveKeyChange, onProgressChange, motion = "auto", className }: TabsContentProps) {
  const reduced = useReducedMotion(motion);
  const root = useRef<HTMLDivElement>(null);
  const index = Math.max(0, panels.findIndex(panel => panel.key === activeKey));
  const reported = useRef(activeKey);
  // Intermediate scroll positions must not replace a controlled tab request.
  const requestedIndex = useRef<number | null>(null);
  const activeIndex = useRef(index);
  useLayoutEffect(() => { activeIndex.current = index; }, [index]);
  const gesture = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipClick = useRef(false);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reported.current !== activeKey || !el.dataset.positioned) {
      requestedIndex.current = reduced || !el.dataset.positioned ? null : index;
      reported.current = activeKey;
      el.scrollTo?.({ left: index * el.clientWidth, behavior: reduced || !el.dataset.positioned ? "instant" : "smooth" });
      el.dataset.positioned = "true";
      reported.current = activeKey;
    }
  }, [activeKey, index, reduced]);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      el.scrollTo?.({ left: activeIndex.current * el.clientWidth, behavior: "instant" });
    });
    observer?.observe(el);
    return () => { observer?.disconnect(); if (settle.current) clearTimeout(settle.current); };
  }, []);
  function sync() {
    const el = root.current;
    if (!el || !el.clientWidth || !panels.length) return;
    const progress = Math.max(0, Math.min(panels.length - 1, el.scrollLeft / el.clientWidth));
    onProgressChange?.(progress);
    if (requestedIndex.current !== null) {
      if (Math.abs(el.scrollLeft - requestedIndex.current * el.clientWidth) > 1) return;
      requestedIndex.current = null;
    }
    const nearest = panels[Math.round(progress)];
    if (nearest && nearest.key !== reported.current) { reported.current = nearest.key; onActiveKeyChange?.(nearest.key); }
  }
  function end(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const drag = gesture.current, el = root.current;
    if (!drag || !el || event.pointerId !== drag.id) return;
    gesture.current = null;
    skipClick.current = drag.moved;
    const destination = cancelled ? drag.left : Math.round(el.scrollLeft / (el.clientWidth || 1)) * el.clientWidth;
    el.scrollTo?.({ left: destination, behavior: reduced || cancelled ? "instant" : "smooth" });
    if (el.hasPointerCapture?.(event.pointerId)) el.releasePointerCapture(event.pointerId);
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => { setDragging(false); settle.current = null; }, reduced || cancelled ? 0 : 400);
  }
  return <div ref={root} data-tabs-transition="swipe" data-motion={reduced ? "none" : motion} data-dragging={dragging || undefined}
    className={cn("forge-tabs-swipe", className)} onScroll={sync}
    onWheel={() => { requestedIndex.current = null; }}
    onClickCapture={event => { if (skipClick.current) { event.preventDefault(); event.stopPropagation(); skipClick.current = false; } }}
    onPointerDown={event => {
      requestedIndex.current = null;
      if (event.pointerType !== "mouse" || event.button !== 0 || (event.target as HTMLElement).closest("button,input,textarea,select,a,[contenteditable=true]")) return;
      if (settle.current) clearTimeout(settle.current);
      gesture.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
      setDragging(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }}
    onPointerMove={event => {
      const drag = gesture.current;
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 5) { drag.moved = true; setDragging(true); event.currentTarget.scrollLeft = drag.left - dx; }
    }} onPointerUp={event => end(event)} onPointerCancel={event => end(event, true)} onLostPointerCapture={() => { if (gesture.current) { gesture.current = null; setDragging(false); } }}>
    {panels.map((panel, i) => <div key={panel.key} role="tabpanel" id={panel.id} aria-labelledby={panel.labelledBy} aria-label={panel.labelledBy ? undefined : panel.ariaLabel}
      tabIndex={i === index ? 0 : -1} inert={i !== index || undefined} aria-hidden={i !== index || undefined} className="forge-tabs-swipe-panel">{panel.content}</div>)}
  </div>;
}
