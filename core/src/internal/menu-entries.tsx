"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import type { ReactNode } from "react";
import { AltArrowRightLinear, CheckCircleLinear } from "../icons";
import type { MotionPreference } from "../lib/motion";
import { cn } from "../lib/utils";
import { floatingSurfaceClass } from "./floating";
import { accentColors } from "../components/ui/accent-utils";
import type { DropdownMenuAccent, DropdownMenuEntry } from "../components/ui/dropdown-menu";

// Shared by DropdownMenu, ContextMenu and KebabMenu.

export const popupClass = cn(
  "forge-popup flex max-h-(--available-height) min-w-56 max-w-[min(var(--available-width),calc(100vw-16px))] flex-col gap-1 overflow-y-auto p-2 outline-none",
  floatingSurfaceClass,
);

const rowClass =
  "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-full px-3.5 py-3 text-left text-sm font-medium leading-5 tracking-fg text-fg-grey-700 outline-none data-highlighted:bg-fg-grey-100 data-disabled:cursor-not-allowed data-disabled:text-fg-grey-300";

function EntryIcon({ icon }: { icon?: ReactNode }) {
  if (!icon) return null;
  return <span aria-hidden className="flex size-6 shrink-0 items-center justify-center">{icon}</span>;
}

function EntryLabel({ label, description }: { label: ReactNode; description?: ReactNode }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate">{label}</span>
      {description && <span className="block text-xs font-normal leading-4 text-fg-grey-700">{description}</span>}
    </span>
  );
}

export function MenuEntries({ entries, accent, motion }: { entries: DropdownMenuEntry[]; accent: DropdownMenuAccent; motion: MotionPreference }) {
  return entries.map((entry, index) => {
    const key = entry.key ?? index;
    switch (entry.type) {
      case "divider":
        return <MenuPrimitive.Separator key={key} className="mx-2.5 my-1 h-px shrink-0 bg-fg-grey-200" />;
      case "group":
        return (
          <MenuPrimitive.Group key={key} className="flex flex-col gap-1">
            <MenuPrimitive.GroupLabel className="px-3.5 pb-1 pt-2 text-xs font-medium leading-4 tracking-fg text-fg-grey-700">{entry.label}</MenuPrimitive.GroupLabel>
            <MenuEntries entries={entry.items} accent={accent} motion={motion} />
          </MenuPrimitive.Group>
        );
      case "checkbox":
        return (
          <MenuPrimitive.CheckboxItem
            key={key}
            checked={entry.checked}
            onCheckedChange={checked => entry.onCheckedChange(checked)}
            disabled={entry.disabled}
            closeOnClick={false}
            className={cn(rowClass, "data-checked:text-fg-black")}
          >
            <EntryIcon icon={entry.icon} />
            <EntryLabel label={entry.label} />
            <span aria-hidden className={cn("flex size-[22px] shrink-0 items-center justify-center", accentColors[accent].text)}>
              <MenuPrimitive.CheckboxItemIndicator keepMounted className="data-unchecked:opacity-0">
                <CheckCircleLinear size={22} />
              </MenuPrimitive.CheckboxItemIndicator>
            </span>
          </MenuPrimitive.CheckboxItem>
        );
      case "submenu":
        return (
          <MenuPrimitive.SubmenuRoot key={key} disabled={entry.disabled}>
            <MenuPrimitive.SubmenuTrigger className={cn(rowClass, "data-popup-open:bg-fg-grey-100")}>
              <EntryIcon icon={entry.icon} />
              <EntryLabel label={entry.label} />
              <AltArrowRightLinear size={16} aria-hidden className="shrink-0 text-fg-grey-700" />
            </MenuPrimitive.SubmenuTrigger>
            <MenuPrimitive.Portal>
              <MenuPrimitive.Positioner side="inline-end" align="start" sideOffset={4} alignOffset={-8} collisionPadding={8} className="z-50">
                <MenuPrimitive.Popup data-motion={motion} className={popupClass}>
                  <MenuEntries entries={entry.items} accent={accent} motion={motion} />
                </MenuPrimitive.Popup>
              </MenuPrimitive.Positioner>
            </MenuPrimitive.Portal>
          </MenuPrimitive.SubmenuRoot>
        );
      default: {
        const content = (
          <>
            <EntryIcon icon={entry.icon} />
            <EntryLabel label={entry.label} description={entry.description} />
            {entry.shortcut && <kbd className="shrink-0 font-sans text-xs font-normal leading-4 tracking-fg text-fg-grey-700">{entry.shortcut}</kbd>}
          </>
        );
        const className = cn(rowClass, entry.danger && "text-fg-red data-highlighted:bg-fg-red-50 data-disabled:text-fg-red/40");
        if (entry.href) {
          return (
            <MenuPrimitive.LinkItem key={key} href={entry.href} closeOnClick onClick={entry.onSelect} className={className}>
              {content}
            </MenuPrimitive.LinkItem>
          );
        }
        return (
          <MenuPrimitive.Item key={key} disabled={entry.disabled} onClick={entry.onSelect} className={className}>
            {content}
          </MenuPrimitive.Item>
        );
      }
    }
  });
}

