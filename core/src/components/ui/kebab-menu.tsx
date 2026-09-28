"use client";

import type { MotionPreference } from "../../lib/motion";
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
};

const initialPosition: FloatingPosition = { left: 0, top: 0, ready: false };

export function KebabMenu({
  items,
  accent = "purple",
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

  const updatePosition = useCallback(() => {
    const trigger = ref.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    // Measure layout size so the entry scale cannot shift edge alignment.
    const menuWidth = menu.offsetWidth || menuRect.width;
    const menuHeight = menu.offsetHeight || menuRect.height;
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

    setPosition((current) => (
      current.ready && current.left === left && current.top === top
        ? current
        : { left, top, ready: true }
    ));
  }, [align]);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !ref.current?.contains(target)
        && !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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

  const menu = typeof document !== "undefined"
    ? createPortal(
        <MotionPresence open={open} motion={motion}
          ref={menuRef}
          className="z-50"
          style={{
            position: "fixed",
            left: position.left,
            top: position.top,
            visibility: position.ready ? "visible" : "hidden",
          }}
        >
          <DropdownPanel motion={motion}>
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
                  item.onSelect?.();
                  setOpen(false);
                  ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
                }}
              />
            ))}
          </DropdownPanel>
        </MotionPresence>,
        document.body,
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
