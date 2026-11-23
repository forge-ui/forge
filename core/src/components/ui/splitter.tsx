"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface SplitterProps {
  /** Exactly two panes: list and detail, editor and preview. */
  children: [ReactNode, ReactNode];
  orientation?: "horizontal" | "vertical";
  /** First pane size in percent. */
  size?: number;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
  min?: number;
  max?: number;
  /** Accessible name of the drag handle. */
  handleLabel?: string;
  className?: string;
}

/** Two panes with a draggable divider. Arrow keys resize by 2%, Home/End jump to the limits. */
export function Splitter({ children, orientation = "horizontal", size, defaultSize = 50, onSizeChange, min = 15, max = 85, handleLabel = "调整面板大小", className }: SplitterProps) {
  const [inner, setInner] = useState(defaultSize);
  const current = Math.min(max, Math.max(min, size ?? inner));
  const rootRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const horizontal = orientation === "horizontal";

  function set(next: number) {
    const clamped = Math.round(Math.min(max, Math.max(min, next)) * 10) / 10;
    if (size === undefined) setInner(clamped);
    onSizeChange?.(clamped);
  }

  function fromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = rootRef.current!.getBoundingClientRect();
    const ratio = horizontal ? (event.clientX - rect.left) / rect.width : (event.clientY - rect.top) / rect.height;
    set(ratio * 100);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const grow = horizontal ? "ArrowRight" : "ArrowDown";
    const shrink = horizontal ? "ArrowLeft" : "ArrowUp";
    const next = event.key === grow ? current + 2 : event.key === shrink ? current - 2 : event.key === "Home" ? min : event.key === "End" ? max : null;
    if (next === null) return;
    event.preventDefault();
    set(next);
  }

  return (
    <div ref={rootRef} className={cn("flex h-full w-full min-h-0 min-w-0", horizontal ? "flex-row" : "flex-col", dragging && "select-none", className)}>
      <div className="min-h-0 min-w-0 overflow-auto" style={{ flexBasis: `${current}%`, flexShrink: 0 }}>{children[0]}</div>
      <div
        role="separator"
        tabIndex={0}
        aria-label={handleLabel}
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        data-dragging={dragging || undefined}
        onKeyDown={onKeyDown}
        onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }}
        onPointerMove={event => { if (dragging) fromPointer(event); }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onDoubleClick={() => set(defaultSize)}
        className={cn(
          "group relative flex shrink-0 items-center justify-center outline-none touch-none",
          horizontal ? "w-3 cursor-col-resize" : "h-3 cursor-row-resize",
        )}
      >
        <span aria-hidden className={cn("bg-fg-grey-200 transition-colors group-hover:bg-fg-blue-300 group-focus-visible:bg-fg-blue group-data-dragging:bg-fg-blue", horizontal ? "h-full w-px" : "h-px w-full")} />
        <span aria-hidden className={cn("absolute rounded-full bg-background outline outline-1 outline-fg-grey-300 group-focus-visible:outline-fg-blue group-data-dragging:outline-fg-blue", horizontal ? "h-8 w-1.5" : "h-1.5 w-8")} />
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children[1]}</div>
    </div>
  );
}
