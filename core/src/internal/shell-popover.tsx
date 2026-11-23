"use client";

import { useLayoutEffect, useRef } from "react";

const INSET = 16;

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
