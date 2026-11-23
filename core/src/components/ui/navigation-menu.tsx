"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import type { ReactNode } from "react";
import { AltArrowDownLinear } from "../../icons";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { floatingSurfaceClass } from "../../internal/floating";

export interface NavigationMenuLink {
  label: string;
  href: string;
  description?: string;
  icon?: ReactNode;
}

export type NavigationMenuItem =
  | { label: string; href: string; active?: boolean }
  /** A dropdown panel: pass `links` for a link grid, or `content` for anything custom. */
  | { label: string; links?: NavigationMenuLink[]; content?: ReactNode; columns?: 1 | 2 };

export interface NavigationMenuProps {
  items: NavigationMenuItem[];
  ariaLabel?: string;
  className?: string;
  motion?: MotionPreference;
}

const itemClass =
  "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium leading-5 tracking-fg text-fg-grey-700 outline-none cursor-pointer hover:bg-fg-grey-100 hover:text-fg-black data-popup-open:bg-fg-grey-100 data-popup-open:text-fg-black focus-visible:bg-fg-grey-100 aria-[current=page]:text-fg-black";

/** Website / product top navigation with hover-and-keyboard dropdown panels. */
export function NavigationMenu({ items, ariaLabel, className, motion = "auto" }: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root aria-label={ariaLabel} className={cn("relative", className)}>
      <NavigationMenuPrimitive.List className="flex items-center gap-1">
        {items.map((item) => (
          <NavigationMenuPrimitive.Item key={item.label}>
            {"href" in item ? (
              <NavigationMenuPrimitive.Link href={item.href} active={item.active} className={itemClass}>{item.label}</NavigationMenuPrimitive.Link>
            ) : (
              <>
                <NavigationMenuPrimitive.Trigger className={cn(itemClass, "group")}>
                  {item.label}
                  <NavigationMenuPrimitive.Icon className="forge-chevron inline-flex text-fg-grey-700 group-data-popup-open:rotate-180" data-motion={motion}>
                    <AltArrowDownLinear size={16} />
                  </NavigationMenuPrimitive.Icon>
                </NavigationMenuPrimitive.Trigger>
                <NavigationMenuPrimitive.Content className="p-2">
                  {item.links ? (
                    <ul className={cn("grid gap-1", item.columns === 2 ? "w-[520px] max-w-[calc(100vw-32px)] grid-cols-2" : "w-72")}>
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuPrimitive.Link href={link.href} className="flex items-start gap-3 rounded-xl p-3 outline-none hover:bg-fg-grey-100 focus-visible:bg-fg-grey-100">
                            {link.icon && <span aria-hidden className="flex size-6 shrink-0 items-center justify-center text-fg-grey-700">{link.icon}</span>}
                            <span className="flex min-w-0 flex-col gap-0.5">
                              <span className="text-sm font-medium leading-5 tracking-fg text-fg-black">{link.label}</span>
                              {link.description && <span className="text-xs leading-4 tracking-fg text-fg-grey-700">{link.description}</span>}
                            </span>
                          </NavigationMenuPrimitive.Link>
                        </li>
                      ))}
                    </ul>
                  ) : item.content}
                </NavigationMenuPrimitive.Content>
              </>
            )}
          </NavigationMenuPrimitive.Item>
        ))}
      </NavigationMenuPrimitive.List>
      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={8} className="z-50">
          <NavigationMenuPrimitive.Popup data-motion={motion} className={cn("forge-popup overflow-hidden", floatingSurfaceClass)}>
            <NavigationMenuPrimitive.Viewport className="relative" />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>
    </NavigationMenuPrimitive.Root>
  );
}
