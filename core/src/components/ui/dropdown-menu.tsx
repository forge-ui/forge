"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useCallback, useRef, type ReactElement, type ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { useControllableOpen, useDialogLayerRef, useFloatingContainer } from "../../internal/floating";
import { MenuEntries, popupClass } from "../../internal/menu-entries";
import type { AccentColor } from "./accent-utils";

export type DropdownMenuAccent = AccentColor;
export type DropdownMenuSide = "top" | "bottom" | "left" | "right";
export type DropdownMenuAlign = "start" | "center" | "end";

type EntryBase = { key?: string; disabled?: boolean };

export type DropdownMenuActionEntry = EntryBase & {
  type?: "item";
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  /** Shortcut hint shown on the right, e.g. "⌘K". Display only. */
  shortcut?: string;
  danger?: boolean;
  /** Renders the item as a link. */
  href?: string;
  onSelect?: () => void;
};
export type DropdownMenuCheckboxEntry = EntryBase & {
  type: "checkbox";
  label: ReactNode;
  icon?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};
export type DropdownMenuSubmenuEntry = EntryBase & {
  type: "submenu";
  label: ReactNode;
  icon?: ReactNode;
  items: DropdownMenuEntry[];
};
export type DropdownMenuGroupEntry = { type: "group"; key?: string; label: ReactNode; items: DropdownMenuEntry[] };
export type DropdownMenuDividerEntry = { type: "divider"; key?: string };

export type DropdownMenuEntry =
  | DropdownMenuActionEntry
  | DropdownMenuCheckboxEntry
  | DropdownMenuSubmenuEntry
  | DropdownMenuGroupEntry
  | DropdownMenuDividerEntry;

type SharedMenuProps = {
  items: DropdownMenuEntry[];
  /** Highlight color for checked entries. */
  accent?: DropdownMenuAccent;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  motion?: MotionPreference;
};

export type DropdownMenuProps = SharedMenuProps & {
  /** Element that opens the menu. It must forward `ref` and spread props onto a DOM element (Button, IconTrigger, native button). */
  trigger: ReactElement;
  side?: DropdownMenuSide;
  align?: DropdownMenuAlign;
  /** Open on hover as well as click. */
  openOnHover?: boolean;
};

export function DropdownMenu({
  trigger,
  items,
  accent = "blue",
  side = "bottom",
  align = "start",
  openOnHover = false,
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  motion = "auto",
}: DropdownMenuProps) {
  const [open, setOpen] = useControllableOpen(openProp, onOpenChange, defaultOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const container = useFloatingContainer(triggerRef, open);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const layerRef = useDialogLayerRef(close, triggerRef);

  return (
    <MenuPrimitive.Root open={open} onOpenChange={next => setOpen(next)} modal={false}>
      <MenuPrimitive.Trigger ref={triggerRef} render={trigger} openOnHover={openOnHover} />
      <MenuPrimitive.Portal container={container}>
        <MenuPrimitive.Positioner side={side} align={align} sideOffset={4} collisionPadding={8} className="z-50">
          <MenuPrimitive.Popup ref={layerRef} data-motion={motion} className={cn(popupClass, className)}>
            <MenuEntries entries={items} accent={accent} motion={motion} />
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}

export type ContextMenuEntry = DropdownMenuEntry;

export type ContextMenuProps = SharedMenuProps & {
  /** Area that opens the menu on right click or long press. */
  children: ReactNode;
  /** Class for the trigger area. */
  areaClassName?: string;
};

export function ContextMenu({
  children,
  items,
  accent = "blue",
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  areaClassName,
  motion = "auto",
}: ContextMenuProps) {
  const [open, setOpen] = useControllableOpen(openProp, onOpenChange, defaultOpen);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const container = useFloatingContainer(areaRef, open);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const layerRef = useDialogLayerRef(close, areaRef);

  return (
    <ContextMenuPrimitive.Root open={open} onOpenChange={next => setOpen(next)}>
      <ContextMenuPrimitive.Trigger ref={areaRef} className={areaClassName}>{children}</ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal container={container}>
        <ContextMenuPrimitive.Positioner collisionPadding={8} className="z-50">
          <ContextMenuPrimitive.Popup ref={layerRef} data-motion={motion} className={cn(popupClass, className)}>
            <MenuEntries entries={items} accent={accent} motion={motion} />
          </ContextMenuPrimitive.Popup>
        </ContextMenuPrimitive.Positioner>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
}
