"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ComposerCommand, ComposerSource } from "../components/ui/chat-input-bar";
import { DropdownPanel } from "../components/ui/dropdown-panel";
import { modelMenuPosition } from "./prompt-model-menu";
import { PlusIcon } from "../components/ui/plain-icons";

/** Shared attachment, mention and command menu. */
export function ComposerToolsMenu({ label, attachLabel, sourcesLabel, commandsLabel, onOpen, disabled, onAttach, sources, commands, onSource, onCommand }: {
  label: string; attachLabel: string; sourcesLabel: string; commandsLabel: string; disabled?: boolean; onOpen?: () => void; onAttach?: () => void;
  sources: ComposerSource[]; commands: ComposerCommand[];
  onSource: (item: ComposerSource) => void; onCommand: (item: ComposerCommand) => void;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!open || disabled || !menu.current || !trigger.current) return;
    const element = menu.current;
    const button = trigger.current;
    element.showPopover?.();
    function position() {
      const viewport = window.visualViewport;
      const bounds = { left: viewport?.offsetLeft ?? 0, top: viewport?.offsetTop ?? 0, width: viewport?.width ?? window.innerWidth, height: viewport?.height ?? window.innerHeight };
      const width = Math.max(0, Math.min(288, bounds.width - 16));
      element.style.width = `${width}px`;
      const rect = button.getBoundingClientRect();
      const next = modelMenuPosition({ top: rect.top, bottom: rect.bottom, right: rect.left + width }, width, element.scrollHeight, bounds);
      Object.assign(element.style, { left: `${next.left}px`, top: `${next.top}px`, maxHeight: `${next.maxHeight}px` });
    }
    position();
    menu.current.querySelector<HTMLButtonElement>("button")?.focus();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(position);
    observer?.observe(element); observer?.observe(button);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => { observer?.disconnect(); window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); element.hidePopover?.(); };
  }, [open, disabled]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("focusin", outside); };
  }, [open]);
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); }
      trigger.current?.focus();
      setOpen(false); return;
    }
    const next = event.key === "ArrowDown" ? (index + 1) % items.length : event.key === "ArrowUp" ? (index - 1 + items.length) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
    if (next >= 0) { event.preventDefault(); items[next]?.focus(); }
  }
  function choose(action: () => void) { setOpen(false); action(); }
  const itemClass = "flex w-full flex-col rounded-lg px-3 py-2 text-left text-sm text-fg-black hover:bg-fg-grey-100 focus:bg-fg-grey-100";
  if (!onAttach && !sources.length && !commands.length) return null;
  return <>
    <button ref={trigger} type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} disabled={disabled}
      onClick={() => { if (!open) onOpen?.(); setOpen(current => !current); }} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); onOpen?.(); setOpen(true); } }}
      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-fg-grey-100 disabled:opacity-50"><PlusIcon size={20} /></button>
    {open && !disabled && <div ref={menu} popover="manual" role="menu" aria-label={label} onKeyDown={navigate} className="fixed z-50 m-0 overflow-y-auto rounded-xl border-0 bg-background p-0 text-foreground shadow-lg">
      <DropdownPanel width="w-full" padding="p-2" className="max-h-56 overflow-y-auto">
        {onAttach && <button type="button" role="menuitem" aria-label={attachLabel} title={attachLabel} tabIndex={-1} className={itemClass} onClick={() => choose(() => { onAttach(); trigger.current?.focus(); })}>{attachLabel}</button>}
        {sources.length > 0 && <div role="presentation" className="px-3 py-2 text-xs text-fg-grey-500">@ {sourcesLabel}</div>}
        {sources.map(item => <button key={`source-${item.id}`} type="button" role="menuitem" tabIndex={-1} className={itemClass} onClick={() => choose(() => onSource(item))}><span>{item.label}</span>{item.description && <span className="text-xs text-fg-grey-700">{item.description}</span>}</button>)}
        {commands.length > 0 && <div role="presentation" className="px-3 py-2 text-xs text-fg-grey-500">/ {commandsLabel}</div>}
        {commands.map(item => <button key={`command-${item.id}`} type="button" role="menuitem" tabIndex={-1} className={itemClass} onClick={() => choose(() => onCommand(item))}><span>/{item.label}</span>{item.description && <span className="text-xs text-fg-grey-700">{item.description}</span>}</button>)}
      </DropdownPanel>
    </div>}
  </>;
}
