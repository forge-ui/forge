"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

const INSET = 16;

/** Keep the existing shell anchors; correct only actual viewport overflow. */
export function useShellPopoverPosition(root: RefObject<HTMLElement | null>, open: string | null) {
  useLayoutEffect(() => {
    if (!open || !["team", "profile", "notifications"].includes(open)) return;
    const wrapper = root.current?.querySelector<HTMLElement>(`[data-popover="${open}"]`);
    if (!wrapper) return;
    let x = 0;
    let y = 0;
    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const left = rect.left - x;
      const top = rect.top - y;
      x = Math.max(INSET, Math.min(left, window.innerWidth - INSET - rect.width)) - left;
      y = Math.max(INSET, Math.min(top, window.innerHeight - INSET - rect.height)) - top;
      wrapper.style.translate = `${x}px ${y}px`;
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(wrapper);
    if (wrapper.parentElement) observer?.observe(wrapper.parentElement);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    update();
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      wrapper.style.removeProperty("translate");
    };
  }, [root, open]);
}

/** One scroll owner: list when chrome fits, whole panel on very short screens. */
export function useShellPanel(listLimit?: number) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    const list = panel.querySelector<HTMLElement>("[data-shell-list]");
    const update = () => {
      const budget = Math.max(1, window.innerHeight - INSET * 2);
      // Natural chrome includes panel padding/gaps and all non-list children.
      const css = window.getComputedStyle(panel);
      const children = [...panel.children] as HTMLElement[];
      const chrome = parseFloat(css.paddingTop || "0") + parseFloat(css.paddingBottom || "0")
        + Math.max(0, children.length - 1) * (parseFloat(css.rowGap) || parseFloat(css.gap) || 0)
        + children.filter((child) => child !== list).reduce((sum, child) => sum + child.getBoundingClientRect().height, 0);
      const whole = !list || budget - chrome < 48;
      panel.style.maxHeight = `${budget}px`;
      panel.style.overflowY = whole ? "auto" : "hidden";
      panel.dataset.shellScroll = whole ? "panel" : "list";
      if (list) {
        list.style.maxHeight = whole ? "none" : `${Math.min(listLimit ?? Infinity, budget - chrome)}px`;
        list.style.overflowY = whole ? "visible" : "auto";
        list.style.flexShrink = whole ? "0" : "1";
      }
      if (panel.contains(document.activeElement)) reveal({ target: document.activeElement } as FocusEvent);
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(panel);
    for (const child of panel.children) observer?.observe(child);
    const mutation = new window.MutationObserver(() => {
      for (const child of panel.children) observer?.observe(child);
      update();
    });
    mutation.observe(panel, { childList: true, subtree: true, characterData: true });
    const reveal = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const owner = panel.dataset.shellScroll === "list" && list?.contains(target) ? list : panel;
      const bounds = owner.getBoundingClientRect();
      const item = target.getBoundingClientRect();
      if (item.bottom > bounds.bottom) owner.scrollTop += item.bottom - bounds.bottom;
      else if (item.top < bounds.top) owner.scrollTop -= bounds.top - item.top;
    };
    panel.addEventListener("focusin", reveal);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer?.disconnect();
      mutation.disconnect();
      panel.removeEventListener("focusin", reveal);
      window.removeEventListener("resize", update);
    };
  }, [listLimit]);
  return ref;
}

/** Dismiss orphaned anchors, but adopt a visible replacement across shell breakpoints. */
export function useShellPopoverAnchor(
  root: RefObject<HTMLElement | null>,
  trigger: RefObject<HTMLElement | null>,
  open: string | null,
  dismiss: () => void,
  adopt: (element: HTMLElement) => void,
) {
  useLayoutEffect(() => {
    if (!open) return;
    const check = () => {
      if (trigger.current?.isConnected) return;
      const replacement = [...(root.current?.querySelectorAll<HTMLElement>(`[data-popover-trigger="${open}"]`) ?? [])]
        .find((element) => element.isConnected && !element.closest('[inert], [aria-hidden="true"]') && element.getClientRects().length > 0);
      if (replacement) adopt(replacement);
      else dismiss();
    };
    const observer = new window.MutationObserver(check);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    check();
    return () => observer.disconnect();
  }, [root, trigger, open, dismiss, adopt]);
}

/** Preserve only focus that belonged to the remounted shell layer. */
export function useShellPopoverFocus(root: RefObject<HTMLElement | null>, open: string | null, host: boolean) {
  const previous = useRef<{ open: string; index: number } | null>(null);
  useLayoutEffect(() => {
    const selector = 'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])';
    const panel = () => open ? root.current?.querySelector<HTMLElement>(`[data-popover="${open}"]`) : null;
    const remember = (event: FocusEvent) => {
      const target = event.target;
      const surface = panel();
      if (open && target instanceof HTMLElement && surface?.contains(target)) {
        previous.current = { open, index: [...surface.querySelectorAll(selector)].indexOf(target) };
      } else previous.current = null;
    };
    const saved = previous.current;
    if (open && saved?.open === open && document.activeElement === document.body) {
      const surface = panel();
      const items = surface?.querySelectorAll<HTMLElement>(selector);
      (items?.[saved.index] ?? items?.[0])?.focus({ preventScroll: true });
    }
    document.addEventListener("focusin", remember);
    return () => document.removeEventListener("focusin", remember);
  }, [root, open, host]);
}
