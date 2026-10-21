"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Button, DropdownPanel, IconButton, MenuItem } from "@forge-ui-official/core";
import { MenuDotsBold } from "@forge-ui-official/core/icons";

type ContextMenuEntry = { label: string; danger?: boolean; onSelect?: () => void; children?: ContextMenuEntry[] };

// Keep the popup in the native top layer, including when used inside a Modal.
export function ContextMenu({ label = "更多操作", triggerLabel, items }: {
  label?: string;
  triggerLabel?: string;
  items: ContextMenuEntry[];
}) {
  const id = useId();
  const trigger = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<ContextMenuEntry | null>(null);
  const returnItem = useRef<string | null>(null);
  const position = () => {
    if (!popup.current || !trigger.current) return;
    const rect = trigger.current.getBoundingClientRect();
    const menu = popup.current.getBoundingClientRect();
    const below = rect.bottom + 4;
    const top = below + menu.height <= window.innerHeight - 8 ? below : rect.top - menu.height - 4;
    popup.current.style.left = `${Math.max(8, Math.min(rect.right - menu.width, window.innerWidth - menu.width - 8))}px`;
    popup.current.style.top = `${Math.max(8, Math.min(top, window.innerHeight - menu.height - 8))}px`;
  };
  useLayoutEffect(() => {
    if (!open) return;
    position();
    const observer = new ResizeObserver(position);
    observer.observe(popup.current!);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => { observer.disconnect(); window.removeEventListener("resize", position); window.removeEventListener("scroll", position, true); };
  }, [open, submenu]);
  useEffect(() => {
    if (!open) return;
    const buttons = [...(popup.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
    const returning = !submenu && returnItem.current;
    (buttons.find(button => returning && button.textContent?.trim() === returning) ?? buttons[0])?.focus();
    if (!submenu) returnItem.current = null;
  }, [open, submenu]);
  const toggle = () => {
      const menu = popup.current!;
      if (open) { menu.hidePopover(); return; }
      returnItem.current = null;
      setSubmenu(null);
      menu.showPopover();
      position();
      menu.querySelector<HTMLButtonElement>("button")?.focus();
  };
  const triggerProps = { "aria-label": label, "aria-haspopup": "menu" as const, "aria-controls": id, "aria-expanded": open, onClick: toggle };
  return <div ref={trigger} data-no-drag>
    {triggerLabel ? <Button color="black" variant="tertiary" size="sm" {...triggerProps}>{triggerLabel}</Button> : <IconButton color="black" variant="ghost" size="sm" {...triggerProps}><MenuDotsBold size={18} /></IconButton>}
    <div ref={popup} id={id} popover="auto" role="menu" aria-label={label} className="task-context-menu" onToggle={(event) => setOpen((event.nativeEvent as ToggleEvent).newState === "open")} onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); popup.current?.hidePopover(); trigger.current?.querySelector("button")?.focus(); }
      if (event.key === "Tab") { popup.current?.hidePopover(); return; }
      if (event.key === "ArrowLeft" && submenu) { event.preventDefault(); event.stopPropagation(); setSubmenu(null); return; }
      if (event.key === "ArrowRight" && !submenu) {
        const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
        const item = items[buttons.indexOf(document.activeElement as HTMLButtonElement)];
        if (item?.children) { event.preventDefault(); event.stopPropagation(); returnItem.current = item.label; setSubmenu(item); }
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }}>
      <DropdownPanel width="w-full">
        {submenu && <MenuItem accent="black" label="返回分区操作" onClick={() => setSubmenu(null)} />}
        {(submenu?.children || items).map((item) => <MenuItem key={item.label} accent="black" label={item.label} kind={item.children ? "dropdown" : "single"} intent={item.danger ? "danger" : undefined} onClick={() => {
          if (item.children) { returnItem.current = item.label; setSubmenu(item); return; }
          popup.current?.hidePopover(); item.onSelect?.();
        }} />)}
      </DropdownPanel>
    </div>
  </div>;
}
