"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { MenuEntries, popupClass } from "../../internal/menu-entries";
import type { DropdownMenuAccent, DropdownMenuEntry } from "./dropdown-menu";

export interface MenubarMenu {
  label: string;
  items: DropdownMenuEntry[];
  disabled?: boolean;
}

export interface MenubarProps {
  menus: MenubarMenu[];
  accent?: DropdownMenuAccent;
  ariaLabel?: string;
  className?: string;
  motion?: MotionPreference;
}

/**
 * Desktop-app style menu bar (文件 / 编辑 / 视图…). Arrow keys move across menus;
 * once one menu is open, hovering another opens it.
 */
export function Menubar({ menus, accent = "blue", ariaLabel, className, motion = "auto" }: MenubarProps) {
  return (
    <MenubarPrimitive loopFocus aria-label={ariaLabel} className={cn("inline-flex items-center gap-1 rounded-full border border-fg-grey-200 bg-background p-1", className)}>
      {menus.map((menu) => (
        <MenuPrimitive.Root key={menu.label} disabled={menu.disabled}>
          <MenuPrimitive.Trigger className="rounded-full px-3.5 py-2 text-sm font-medium leading-5 tracking-fg text-fg-grey-700 outline-none cursor-pointer hover:bg-fg-grey-100 data-popup-open:bg-fg-grey-100 data-popup-open:text-fg-black focus-visible:bg-fg-grey-100 data-disabled:cursor-not-allowed data-disabled:opacity-50">
            {menu.label}
          </MenuPrimitive.Trigger>
          <MenuPrimitive.Portal>
            <MenuPrimitive.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={8} className="z-50">
              <MenuPrimitive.Popup data-motion={motion} className={popupClass}>
                <MenuEntries entries={menu.items} accent={accent} motion={motion} />
              </MenuPrimitive.Popup>
            </MenuPrimitive.Positioner>
          </MenuPrimitive.Portal>
        </MenuPrimitive.Root>
      ))}
    </MenubarPrimitive>
  );
}
