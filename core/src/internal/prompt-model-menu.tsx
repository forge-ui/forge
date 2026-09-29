"use client";

import { useId, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { AltArrowDownLinear, CheckCircleLinear } from "../icons";
import { DropdownPanel } from "../components/ui/dropdown-panel";
import type { PromptModel } from "../components/ui/agent/prompt-bar";

const GAP = 6;
const EDGE = 8;

/** Same viewport clamping strategy as KebabMenu, with above/right preference. */
export function modelMenuPosition(anchor: { top: number; bottom: number; right: number }, width: number, height: number, viewport: { left: number; top: number; width: number; height: number }) {
  const above = Math.max(0, anchor.top - viewport.top - EDGE - GAP);
  const below = Math.max(0, viewport.top + viewport.height - EDGE - anchor.bottom - GAP);
  const useAbove = height <= above || above >= below;
  const maxHeight = Math.min(320, useAbove ? above : below);
  const left = Math.max(viewport.left + EDGE, Math.min(anchor.right - width, viewport.left + viewport.width - EDGE - width));
  const top = useAbove ? anchor.top - GAP - Math.min(height, maxHeight) : anchor.bottom + GAP;
  return { left, top: Math.max(viewport.top + EDGE, top), maxHeight };
}

export function PromptModelMenu({ models, model, label, disabled, open, onOpenChange, onModelChange }: {
  models: PromptModel[]; model?: string; label: string; disabled?: boolean; open: boolean;
  onOpenChange: (open: boolean) => void; onModelChange?: (id: string) => void;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const initialIndex = useRef<number | null>(null);
  const selected = models.find(item => item.id === model) ?? models[0];
  const visible = open && !disabled;

  function close(restore = false) {
    onOpenChange(false);
    if (restore) trigger.current?.focus({ preventScroll: true });
  }

  useLayoutEffect(() => {
    if (!visible) return;
    const element = menu.current!;
    const button = trigger.current!;
    // Top layer escapes clipping and stacking contexts without leaving the host's
    // DOM focus scope, inherited theme, accent, or native fullscreen subtree.
    element.showPopover?.();
    function position() {
      const viewport = window.visualViewport;
      const bounds = { left: viewport?.offsetLeft ?? 0, top: viewport?.offsetTop ?? 0, width: viewport?.width ?? window.innerWidth, height: viewport?.height ?? window.innerHeight };
      element.style.width = `${Math.max(0, Math.min(288, bounds.width - EDGE * 2))}px`;
      const next = modelMenuPosition(button.getBoundingClientRect(), element.offsetWidth, element.scrollHeight, bounds);
      Object.assign(element.style, { left: `${next.left}px`, top: `${next.top}px`, maxHeight: `${next.maxHeight}px` });
    }
    position();
    const index = initialIndex.current ?? Math.max(0, models.findIndex(item => item.id === selected?.id));
    initialIndex.current = null;
    const item = element.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')[index];
    item?.focus({ preventScroll: true });
    item?.scrollIntoView?.({ block: "nearest" });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(position);
    observer?.observe(button);
    observer?.observe(element);
    if (element.firstElementChild) observer?.observe(element.firstElementChild);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    window.visualViewport?.addEventListener("resize", position);
    window.visualViewport?.addEventListener("scroll", position);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      window.visualViewport?.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("scroll", position);
      element.hidePopover?.();
    };
  // Opening initializes focus; selection changes while open must not steal focus.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) return;
    function outside(event: Event) {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !trigger.current?.contains(target)) onOpenChange(false);
    }
    function fullscreenChanged() {
      if (menu.current?.contains(document.activeElement)) trigger.current?.focus({ preventScroll: true });
      onOpenChange(false);
    }
    document.addEventListener("fullscreenchange", fullscreenChanged);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChanged);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [visible, onOpenChange]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation(); // First Escape closes the menu, not its drawer.
      close(true);
      return;
    }
    if (event.key === "Tab") {
      // Resume the host's normal tab order from the trigger, including its trap.
      close(true);
      return;
    }
    const items = Array.from(menu.current!.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "ArrowDown" ? (current + 1) % items.length
      : event.key === "ArrowUp" ? (current - 1 + items.length) % items.length
      : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
    if (next !== null) {
      event.preventDefault();
      items[next]?.focus({ preventScroll: true });
      items[next]?.scrollIntoView?.({ block: "nearest" });
    }
  }

  return <>
    <button ref={trigger} id={`${id}-trigger`} type="button" disabled={disabled}
      aria-label={`${label}: ${selected?.label ?? ""}`} aria-haspopup="menu" aria-expanded={visible} aria-controls={visible ? id : undefined}
      onClick={() => onOpenChange(!visible)}
      onKeyDown={event => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        initialIndex.current = event.key === "ArrowUp" ? models.length - 1 : Math.max(0, models.findIndex(item => item.id === selected?.id));
        onOpenChange(true);
      }}
      className="inline-flex min-w-0 max-w-48 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50">
      <span className="truncate">{selected?.label}</span>
      <span className="shrink-0" aria-hidden><AltArrowDownLinear size={12} color="var(--fg-grey-500)" /></span>
    </button>
    {visible && <div ref={menu} id={id} role="menu" aria-label={label} popover="manual" onKeyDown={navigate}
      className="fixed z-50 m-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border-0 bg-background p-0 text-foreground shadow-xl"
      style={{ inset: "auto", width: 288, maxWidth: "calc(100vw - 16px)", maxHeight: 320 }}>
      <DropdownPanel width="w-full" className="!bg-background" motion="none">
        {models.map(item => <button key={item.id} type="button" role="menuitemradio" aria-checked={item.id === selected?.id} tabIndex={-1}
          onClick={() => { onModelChange?.(item.id); close(true); }}
          className="flex w-full shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground hover:bg-accent-soft focus:bg-accent-soft focus:outline-none">
          <span className="min-w-0 flex-1 break-words">{item.label}</span>
          <span className="w-4 shrink-0 text-accent" aria-hidden>{item.id === selected?.id && <CheckCircleLinear size={16} />}</span>
        </button>)}
      </DropdownPanel>
    </div>}
  </>;
}
