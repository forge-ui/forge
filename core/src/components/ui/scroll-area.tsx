"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps {
  children: ReactNode;
  /** Scroll direction(s) that get a styled scrollbar. */
  orientation?: ScrollAreaOrientation;
  /** Max height of the scroll viewport, any CSS length. */
  maxHeight?: string;
  /** Height of the scroll viewport, any CSS length. */
  height?: string;
  className?: string;
  /** Class for the inner content wrapper. */
  contentClassName?: string;
  /** Accessible name; set it when the area holds important content (it becomes focusable). */
  ariaLabel?: string;
}

const scrollbarClass =
  "flex touch-none select-none rounded-full p-0.5 opacity-0 transition-opacity data-hovering:opacity-100 data-scrolling:opacity-100 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5";

/** Native scrolling with thin Forge scrollbars that appear on hover or while scrolling. */
export function ScrollArea({
  children,
  orientation = "vertical",
  maxHeight,
  height,
  className,
  contentClassName,
  ariaLabel,
}: ScrollAreaProps) {
  const style: CSSProperties = { maxHeight, height };
  return (
    <ScrollAreaPrimitive.Root className={cn("relative flex min-h-0 overflow-hidden", className)}>
      <ScrollAreaPrimitive.Viewport
        aria-label={ariaLabel}
        tabIndex={ariaLabel ? 0 : undefined}
        className="w-full overscroll-contain rounded-[inherit] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-blue"
        style={style}
      >
        <ScrollAreaPrimitive.Content className={contentClassName}>{children}</ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {orientation !== "horizontal" && (
        <ScrollAreaPrimitive.Scrollbar orientation="vertical" className={scrollbarClass}>
          <ScrollAreaPrimitive.Thumb className="w-full rounded-full bg-fg-grey-300 hover:bg-fg-grey-600" />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      {orientation !== "vertical" && (
        <ScrollAreaPrimitive.Scrollbar orientation="horizontal" className={scrollbarClass}>
          <ScrollAreaPrimitive.Thumb className="h-full rounded-full bg-fg-grey-300 hover:bg-fg-grey-600" />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      {orientation === "both" && <ScrollAreaPrimitive.Corner />}
    </ScrollAreaPrimitive.Root>
  );
}
