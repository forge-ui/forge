"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useRef, useState } from "react";
import type { ComposerCommand, ComposerSource } from "../components/ui/chat-input-bar";
import { PlusIcon } from "../components/ui/plain-icons";
import { useInheritedScope } from "./floating";

/** Shared attachment, mention and command menu. */
export function ComposerToolsMenu({ label, attachLabel, sourcesLabel, commandsLabel, onOpen, disabled, onAttach, sources, commands, onSource, onCommand, onQuickActions, quickActionsLabel }: {
  onQuickActions?: () => void; quickActionsLabel?: string;
  label: string; attachLabel: string; sourcesLabel: string; commandsLabel: string; disabled?: boolean; onOpen?: () => void; onAttach?: () => void;
  sources: ComposerSource[]; commands: ComposerCommand[];
  onSource: (item: ComposerSource) => void; onCommand: (item: ComposerCommand) => void;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const scope = useInheritedScope(trigger, open);
  if (!onQuickActions && !onAttach && !sources.length && !commands.length) return null;
  const itemClass = "flex w-full cursor-pointer flex-col rounded-lg px-3 py-2 text-left text-sm text-fg-black outline-none data-highlighted:bg-fg-grey-100";
  const groupLabelClass = "px-3 py-2 text-xs text-fg-grey-500";
  return (
    <MenuPrimitive.Root open={open && !disabled} onOpenChange={next => { if (next) onOpen?.(); setOpen(next); }} modal={false}>
      <MenuPrimitive.Trigger ref={trigger} aria-label={label} disabled={disabled}
        className="forge-composer-plus text-foreground flex h-8 w-8 items-center justify-center rounded-full hover:bg-fg-grey-100 disabled:opacity-50">
        <PlusIcon size={20} />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal {...scope}>
        <MenuPrimitive.Positioner side="top" align="start" sideOffset={6} collisionPadding={8} className="z-50">
          <MenuPrimitive.Popup aria-label={label} data-motion="auto"
            className="forge-popup max-h-[min(224px,var(--available-height))] w-[min(288px,calc(100vw-16px))] overflow-y-auto rounded-xl bg-background p-2 text-foreground shadow-lg outline-none">
            {onQuickActions && <MenuPrimitive.Item className={itemClass} onClick={onQuickActions}>{quickActionsLabel}</MenuPrimitive.Item>}
            {onAttach && <MenuPrimitive.Item className={itemClass} aria-label={attachLabel} title={attachLabel} onClick={onAttach}>{attachLabel}</MenuPrimitive.Item>}
            {sources.length > 0 && (
              <MenuPrimitive.Group>
                <MenuPrimitive.GroupLabel className={groupLabelClass}>@ {sourcesLabel}</MenuPrimitive.GroupLabel>
                {sources.map(item => <MenuPrimitive.Item key={`source-${item.id}`} className={itemClass} onClick={() => onSource(item)}><span>{item.label}</span>{item.description && <span className="text-xs text-fg-grey-700">{item.description}</span>}</MenuPrimitive.Item>)}
              </MenuPrimitive.Group>
            )}
            {commands.length > 0 && (
              <MenuPrimitive.Group>
                <MenuPrimitive.GroupLabel className={groupLabelClass}>/ {commandsLabel}</MenuPrimitive.GroupLabel>
                {commands.map(item => <MenuPrimitive.Item key={`command-${item.id}`} className={itemClass} onClick={() => onCommand(item)}><span>/{item.label}</span>{item.description && <span className="text-xs text-fg-grey-700">{item.description}</span>}</MenuPrimitive.Item>)}
              </MenuPrimitive.Group>
            )}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}
