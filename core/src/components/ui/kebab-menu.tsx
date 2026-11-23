"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { MenuDotsBold } from "../../icons";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { useDialogLayerRef, useFloatingContainer } from "../../internal/floating";
import { IconTriggerButton } from "../../internal/icon-trigger-button";
import { MenuEntries, popupClass } from "../../internal/menu-entries";
import type { AccentColor } from "./accent-utils";
import type { DropdownMenuEntry } from "./dropdown-menu";
import type { IconTriggerSurface } from "./icon-trigger";

export type KebabMenuAccent = AccentColor;

export type KebabMenuItem = {
  icon?: ReactNode;
  label: string;
  onSelect?: () => void;
  danger?: boolean;
};

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
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const container = useFloatingContainer(triggerRef, open);
  const close = useCallback(() => setOpen(false), []);
  const layerRef = useDialogLayerRef(close, triggerRef);
  const entries: DropdownMenuEntry[] = items.map(item => ({ label: item.label, icon: item.icon, danger: item.danger, onSelect: item.onSelect }));

  return (
    <div className={cn("relative inline-block", className)}>
      <MenuPrimitive.Root open={open} onOpenChange={next => setOpen(next)} modal={false}>
        <MenuPrimitive.Trigger
          ref={triggerRef}
          render={
            <IconTriggerButton
              motion={motion}
              accent={accent}
              surface={surface}
              aria-label="更多操作"
              icon={<span className="inline-flex rotate-90"><MenuDotsBold size={16} /></span>}
            />
          }
        />
        <MenuPrimitive.Portal container={container}>
          <MenuPrimitive.Positioner side="bottom" align={align === "right" ? "end" : "start"} sideOffset={4} collisionPadding={8} className="z-50">
            <MenuPrimitive.Popup ref={layerRef} data-forge-kebab-menu data-motion={motion} className={cn(popupClass, "w-60 min-w-0")}>
              <MenuEntries entries={entries} accent={accent} motion={motion} />
            </MenuPrimitive.Popup>
          </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
      </MenuPrimitive.Root>
    </div>
  );
}
