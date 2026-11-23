"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useLayoutEffect, useRef } from "react";
import { AltArrowDownLinear, CheckCircleLinear } from "../icons";
import type { ComposerModel } from "../components/ui/composer-types";
import { useInheritedScope } from "./floating";

export function PromptModelMenu({ models, model, label, disabled, open, onOpenChange, onModelChange }: {
  models: ComposerModel[]; model?: string; label: string; disabled?: boolean; open: boolean;
  onOpenChange: (open: boolean) => void; onModelChange?: (id: string) => void;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const openedWithArrowUp = useRef(false);
  const selected = models.find(item => item.id === model) ?? models[0];
  const visible = open && !disabled;
  const scope = useInheritedScope(trigger, visible);

  // Open on the current choice (or the last one for ArrowUp), like a native select.
  useLayoutEffect(() => {
    if (!visible) return;
    const frame = requestAnimationFrame(() => {
      const items = popup.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]');
      if (!items?.length) return;
      const index = openedWithArrowUp.current ? items.length - 1 : Math.max(0, models.findIndex(item => item.id === selected?.id));
      openedWithArrowUp.current = false;
      items[index]?.focus({ preventScroll: true });
      items[index]?.scrollIntoView?.({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  // Opening initializes focus; selection changes while open must not steal focus.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <MenuPrimitive.Root open={visible} onOpenChange={next => onOpenChange(next)} modal={false}>
      <MenuPrimitive.Trigger
        ref={trigger}
        disabled={disabled}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onKeyDown={event => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          openedWithArrowUp.current = event.key === "ArrowUp";
          onOpenChange(true);
        }}
        className="inline-flex min-w-0 max-w-48 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-fg-grey-700 hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
      >
        <span className="truncate">{selected?.label}</span>
        <span className="shrink-0" aria-hidden><AltArrowDownLinear size={12} color="var(--fg-grey-500)" /></span>
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal {...scope}>
        <MenuPrimitive.Positioner side="top" align="end" sideOffset={6} collisionPadding={8} className="z-50">
          <MenuPrimitive.Popup
            ref={popup}
            aria-label={label}
            data-motion="auto"
            className="forge-popup flex max-h-[min(320px,var(--available-height))] w-[min(288px,calc(100vw-16px))] flex-col gap-1 overflow-y-auto overscroll-contain rounded-2xl bg-background p-2 text-foreground shadow-xl outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <MenuPrimitive.RadioGroup value={selected?.id} onValueChange={id => onModelChange?.(id as string)}>
              {models.map(item => (
                <MenuPrimitive.RadioItem
                  key={item.id}
                  value={item.id}
                  closeOnClick
                  className="flex w-full shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground outline-none data-highlighted:bg-accent-soft"
                >
                  <span className="min-w-0 flex-1 break-words">{item.label}</span>
                  <span className="w-4 shrink-0 text-accent" aria-hidden>
                    <MenuPrimitive.RadioItemIndicator className="flex"><CheckCircleLinear size={16} /></MenuPrimitive.RadioItemIndicator>
                  </span>
                </MenuPrimitive.RadioItem>
              ))}
            </MenuPrimitive.RadioGroup>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}
