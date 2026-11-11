"use client";

import type { MotionPreference } from "../../lib/motion";
import { fixedPortalCoordinates, focusIfAvailable, isDialogInert, nearestDialogPortal, registerDialogLayer } from "../../internal/dialog-ownership";
import { MotionPresence } from "../../internal/motion";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MenuDotsBold } from "../../icons";
import { cn } from "../../lib/utils";
import { MenuItem } from "./menu-item";
import { DropdownPanel } from "./dropdown-panel";
import { IconTrigger, type IconTriggerSurface } from "./icon-trigger";
import type { AccentColor } from "./accent-utils";

export type KebabMenuAccent = AccentColor;

export type KebabMenuItem = {
  icon?: ReactNode;
  label: string;
  onSelect?: () => void;
  danger?: boolean;
};

const MENU_GAP = 4;
const VIEWPORT_PADDING = 8;

type FloatingPosition = {
  left: number;
  top: number;
  ready: boolean;
  maxHeight?: number;
  maxWidth?: number;
};

const initialPosition: FloatingPosition = { left: 0, top: 0, ready: false };

export function KebabMenu({
  items,
  accent = "blue",
  surface = "default",
  align = "right",
  className,
  motion = "auto",
}: {
  items: KebabMenuItem[];
  accent?: KebabMenuAccent;
  surface?: IconTriggerSurface;
  align?: "left" | "right";
  className?: string;
  motion?: MotionPreference;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<FloatingPosition>(initialPosition);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const returnFocus = useCallback(() => {
    const trigger = ref.current?.querySelector<HTMLButtonElement>("button") ?? null;
    if (!focusIfAvailable(trigger)) {
      const dialog = ref.current?.closest<HTMLDialogElement>('dialog[open]');
      if (dialog) focusIfAvailable(dialog);
    }
  }, []);
  useEffect(() => () => clearTimeout(focusTimer.current), []);
  useLayoutEffect(() => {
    if (open && ref.current) setPortalHost(nearestDialogPortal(ref.current));
  }, [open]);

  const updatePosition = useCallback(() => {
    const trigger = ref.current;
    const menu = menuRef.current;
    if (!trigger || !menu || !portalHost) return;
    const coordinates = fixedPortalCoordinates(portalHost, 0, 0);

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    // Measure layout size so the entry scale cannot shift edge alignment.
    const menuWidth = menu.offsetWidth ? menu.offsetWidth * coordinates.scaleX : menuRect.width;
    const menuHeight = menu.offsetHeight ? menu.offsetHeight * coordinates.scaleY : menuRect.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const desiredLeft = align === "right"
      ? triggerRect.right - menuWidth
      : triggerRect.left;
    const maxLeft = Math.max(
      VIEWPORT_PADDING,
      viewportWidth - menuWidth - VIEWPORT_PADDING,
    );
    const left = Math.min(
      Math.max(desiredLeft, VIEWPORT_PADDING),
      maxLeft,
    );

    const below = triggerRect.bottom + MENU_GAP;
    const above = triggerRect.top - MENU_GAP - menuHeight;
    const fitsBelow = below + menuHeight <= viewportHeight - VIEWPORT_PADDING;
    const fitsAbove = above >= VIEWPORT_PADDING;
    const desiredTop = !fitsBelow && fitsAbove ? above : below;
    const maxTop = Math.max(
      VIEWPORT_PADDING,
      viewportHeight - menuHeight - VIEWPORT_PADDING,
    );
    const top = Math.min(
      Math.max(desiredTop, VIEWPORT_PADDING),
      maxTop,
    );

    const next = {
      left: coordinates.left + left / coordinates.scaleX,
      top: coordinates.top + top / coordinates.scaleY,
      maxHeight: Math.max(0, viewportHeight - 2 * VIEWPORT_PADDING) / coordinates.scaleY,
      maxWidth: Math.max(0, viewportWidth - 2 * VIEWPORT_PADDING) / coordinates.scaleX,
      ready: true,
    };
    setPosition(current => Object.keys(next).every(key => current[key as keyof FloatingPosition] === next[key as keyof typeof next]) ? current : next);
  }, [align, portalHost]);

  useEffect(() => {
    if (!open) return;
    const owner = ref.current?.closest('dialog');
    const checkOwner = () => {
      const trigger = ref.current;
      if (!trigger?.isConnected || isDialogInert(trigger) || (owner && (!owner.open || owner.dataset.state === 'closed'))) setOpen(false);
    };
    const observer = new window.MutationObserver(checkOwner);
    // Observe validity only; probe mutations never trigger a new position measurement.
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'inert', 'data-state'] });
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !ref.current?.contains(target)
        && !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => { observer.disconnect(); document.removeEventListener("mousedown", handler); };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    return registerDialogLayer(menuRef.current, () => {
      setOpen(false);
      returnFocus();
    }, ref.current?.querySelector<HTMLButtonElement>("button"));
  }, [open, portalHost, returnFocus]);

  useLayoutEffect(() => {
    if (!open) return;
    // Position the portal before paint to avoid a visible jump at viewport edges.
    updatePosition();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updatePosition);
    if (ref.current) observer.observe(ref.current);
    if (menuRef.current) observer.observe(menuRef.current);
    return () => observer.disconnect();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useLayoutEffect(() => {
    if (!open || !portalHost || typeof window.requestAnimationFrame !== "function") return;
    let frame = 0;
    const track = () => {
      window.cancelAnimationFrame(frame);
      updatePosition();
      const ancestors: HTMLElement[] = [];
      for (let element: HTMLElement | null = portalHost; element; element = element.parentElement) ancestors.push(element);
      if (ancestors.some(element => element.getAnimations?.().some(animation => animation.playState === "running"))) frame = window.requestAnimationFrame(track);
    };
    track();
    document.addEventListener("transitionrun", track, true);
    document.addEventListener("transitionend", track, true);
    document.addEventListener("animationstart", track, true);
    document.addEventListener("animationend", track, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("transitionrun", track, true);
      document.removeEventListener("transitionend", track, true);
      document.removeEventListener("animationstart", track, true);
      document.removeEventListener("animationend", track, true);
    };
  }, [open, portalHost, updatePosition]);

  const menu = typeof document !== "undefined" && portalHost
    ? createPortal(
        <MotionPresence open={open} motion={motion}
          ref={menuRef}
          className="z-50 overflow-auto"
          data-forge-kebab-menu
          style={{
            position: "fixed",
            left: position.left,
            top: position.top,
            visibility: position.ready ? "visible" : "hidden",
            maxHeight: position.maxHeight,
            maxWidth: position.maxWidth,
          }}
        >
          <DropdownPanel motion={motion} className="max-w-full shrink-0">
            {items.map((item, i) => (
              <MenuItem
                key={i}
                lead={item.icon ? { kind: "icon", icon: item.icon } : undefined}
                label={item.label}
                accent={accent}
                intent={item.danger ? "danger" : "default"}
                motion={motion}
                onClick={() => {
                  if (!open) return;
                  const active = document.activeElement;
                  const menuElement = menuRef.current;
                  const location = window.location.href;
                  const owner = ref.current?.closest('dialog');
                  // Establish the durable opener before the selected menu item unmounts.
                  returnFocus();
                  setOpen(false);
                  item.onSelect?.();
                  clearTimeout(focusTimer.current);
                  // Let child dialogs, route changes and caller focus effects commit first.
                  focusTimer.current = setTimeout(() => {
                    if (window.location.href !== location || !ref.current?.isConnected) return;
                    const current = document.activeElement;
                    const newDialog = [...document.querySelectorAll('dialog[open]')].some(dialog => dialog !== owner && !dialog.contains(owner ?? null));
                    if (newDialog) return;
                    if (current === document.body || current === active || (current && menuElement?.contains(current))) returnFocus();
                  }, 0);
                }}
              />
            ))}
          </DropdownPanel>
        </MotionPresence>,
        portalHost,
      )
    : null;

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <IconTrigger
        motion={motion}
        icon={
          <span className="inline-flex rotate-90">
            <MenuDotsBold size={16} />
          </span>
        }
        accent={accent}
        surface={surface}
        state={open ? "open" : "idle"}
        onClick={() => {
          if (!open) setPosition(initialPosition);
          setOpen((value) => !value);
        }}
        ariaLabel="更多操作"
      />
      {menu}
    </div>
  );
}
