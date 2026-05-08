"use client";

import { type ReactNode, useState, useRef, useEffect } from "react";
import { MenuDotsBold } from "solar-icon-set";
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

export function KebabMenu({
  items,
  accent = "purple",
  surface = "default",
  align = "right",
  className,
}: {
  items: KebabMenuItem[];
  accent?: KebabMenuAccent;
  surface?: IconTriggerSurface;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <IconTrigger
        icon={
          <span className="inline-flex rotate-90">
            <MenuDotsBold size={16} />
          </span>
        }
        accent={accent}
        surface={surface}
        state={open ? "open" : "idle"}
        onClick={() => setOpen((v) => !v)}
        ariaLabel="More options"
      />

      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 z-50",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <DropdownPanel>
            {items.map((item, i) => (
              <MenuItem
                key={i}
                lead={item.icon ? { kind: "icon", icon: item.icon } : undefined}
                label={item.label}
                accent={accent}
                intent={item.danger ? "danger" : "default"}
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
              />
            ))}
          </DropdownPanel>
        </div>
      )}
    </div>
  );
}
