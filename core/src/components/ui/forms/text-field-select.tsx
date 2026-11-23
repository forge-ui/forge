"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useRef, useState } from "react";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { AltArrowDownLinear } from "../../../icons";
import type { FormAccentColor } from "./form-utils";

// ============================================================
// TextFieldSelectSuffix — inline select dropdown designed to sit
// inside TextField's `suffix` slot. Matches Figma "+" Select" variant.
//
// Usage:
//   <TextField
//     suffix={
//       <TextFieldSelectSuffix
//         value="USD"
//         options={["USD","EUR","GBP"]}
//         onChange={setValue}
//         color="blue"
//       />
//     }
//   />
// ============================================================

export function TextFieldSelectSuffix({
  value,
  options,
  onChange,
  color = "blue",
  motion = "auto",
}: {
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  color?: FormAccentColor;
  motion?: MotionPreference;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <SelectPrimitive.Root value={value} onValueChange={(next) => { if (next != null) onChange?.(next); }} open={open} onOpenChange={setOpen} modal={false}>
      <SelectPrimitive.Trigger
        ref={triggerRef}
        data-motion={motion}
        className="forge-motion-trigger flex items-center gap-1 cursor-pointer text-fg-grey-700 text-sm font-normal leading-5 tracking-fg hover:text-fg-black transition-colors outline-none focus-visible:text-fg-black"
      >
        <SelectPrimitive.Value>{value}</SelectPrimitive.Value>
        <span className="forge-chevron inline-flex" data-motion={motion} data-expanded={open}><AltArrowDownLinear size={16} /></span>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner alignItemWithTrigger={false} side="bottom" align="end" sideOffset={4} collisionPadding={8} className="z-50">
          <SelectPrimitive.Popup
            data-motion={motion}
            className="forge-popup min-w-40 max-w-[calc(100vw-2rem)] py-2 bg-background rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-100 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] flex overflow-hidden"
          >
            <SelectPrimitive.List className="flex-1 flex flex-col overflow-y-auto max-h-60 outline-none">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt}
                  value={opt}
                  className={cn("group h-12 px-4 py-3 flex items-center cursor-pointer outline-none text-fg-grey-700 font-medium data-highlighted:bg-fg-grey-100 data-selected:font-semibold", selectedText[color])}
                >
                  <SelectPrimitive.ItemText>{opt}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

const selectedText: Record<FormAccentColor, string> = {
  purple: "data-selected:text-fg-violet",
  blue: "data-selected:text-fg-blue",
  black: "data-selected:text-fg-black",
};
