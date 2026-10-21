"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";

type Entry = { id: string };

/** Preview ordering locally; only commit the complete order when released. */
export function SortableSubtasks<T extends Entry>({ items, disabled, onReorder, children }: {
  items: T[];
  disabled: boolean;
  onReorder: (ids: string[]) => void;
  children: (item: T, index: number) => ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: string; x: number; y: number; offset: number; height: number; moved: boolean; clientY: number } | null>(null);
  const [preview, setPreview] = useState<{ id: string; height: number; left: number; width: number; before?: string } | null>(null);
  const y = useMotionValue(0);
  const reduced = useReducedMotion();
  const suppressClick = useRef(false);
  const settling = useRef(false);
  const landing = useRef<ReturnType<typeof animate> | null>(null);
  const transaction = useRef(0);
  useEffect(() => () => { transaction.current += 1; landing.current?.stop(); }, []);
  const ordered = preview ? (() => {
    const next = items.filter(item => item.id !== preview.id);
    const moving = items.find(item => item.id === preview.id);
    const index = next.findIndex(item => item.id === preview.before);
    if (moving) next.splice(index < 0 ? next.length : index, 0, moving);
    return next;
  })() : items;

  useEffect(() => {
    const targetAt = (clientY: number, id: string) => [...(root.current?.querySelectorAll<HTMLElement>("[data-subtask-sort-slot]") ?? [])]
      .filter(element => element.dataset.subtaskSortSlot !== id)
      .find(element => clientY < element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2)?.dataset.subtaskSortSlot;
    const update = (clientY: number) => {
      const drag = pointer.current;
      if (!drag?.moved || !root.current) return;
      y.set(clientY - drag.offset);
      const before = targetAt(clientY, drag.id);
      setPreview(current => current && current.before === before && current.id === drag.id ? current : { id: drag.id, height: drag.height, left: root.current!.getBoundingClientRect().left, width: root.current!.getBoundingClientRect().width, before });
    };
    const move = (event: PointerEvent) => {
      const drag = pointer.current;
      if (!drag) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 7) return;
      drag.moved = true; drag.clientY = event.clientY;
      document.documentElement.setPointerCapture(event.pointerId);
      update(event.clientY);
    };
    const suppressReleaseClick = () => {
      suppressClick.current = true;
      requestAnimationFrame(() => { suppressClick.current = false; });
    };
    const cancel = () => {
      if (pointer.current?.moved || settling.current) suppressReleaseClick();
      transaction.current += 1;
      landing.current?.stop(); landing.current = null;
      pointer.current = null; setPreview(null); settling.current = false;
    };
    const release = async (event: PointerEvent) => {
      const drag = pointer.current;
      if (!drag) return;
      pointer.current = null;
      if (!drag.moved) return;
      suppressReleaseClick();
      settling.current = true;
      const releaseTransaction = ++transaction.current;
      const before = targetAt(event.clientY, drag.id);
      const ids = items.filter(item => item.id !== drag.id).map(item => item.id);
      const index = ids.indexOf(before ?? "");
      ids.splice(index < 0 ? ids.length : index, 0, drag.id);
      const slot = [...(root.current?.querySelectorAll<HTMLElement>("[data-subtask-sort-slot]") ?? [])].find(element => element.dataset.subtaskSortSlot === drag.id);
      if (slot && root.current && !reduced) {
        landing.current = animate(y, slot.getBoundingClientRect().top, { duration: 0.16, ease: [0.22, 1, 0.36, 1] });
        await landing.current;
      }
      if (transaction.current !== releaseTransaction) return;
      landing.current = null;
      if (ids.some((id, index) => id !== items[index]?.id)) onReorder(ids);
      setPreview(null); settling.current = false;
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (pointer.current?.moved || settling.current)) { event.preventDefault(); event.stopImmediatePropagation(); cancel(); }
    };
    const click = (event: MouseEvent) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } };
    let frame: number;
    const pan = () => {
      const drag = pointer.current;
      if (drag?.moved) {
        let container = root.current?.parentElement;
        while (container && !(container.scrollHeight > container.clientHeight && /auto|scroll/.test(getComputedStyle(container).overflowY))) container = container.parentElement;
        if (container) {
          const area = container.getBoundingClientRect();
          const previous = container.scrollTop;
          if (drag.clientY < area.top + 40) container.scrollTop -= Math.min(12, (area.top + 40 - drag.clientY) / 3);
          if (drag.clientY > area.bottom - 40) container.scrollTop += Math.min(12, (drag.clientY - area.bottom + 40) / 3);
          if (container.scrollTop !== previous) update(drag.clientY);
        }
      }
      frame = requestAnimationFrame(pan);
    };
    if (preview) frame = requestAnimationFrame(pan);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    window.addEventListener("keydown", key, true);
    window.addEventListener("click", click, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("keydown", key, true);
      window.removeEventListener("click", click, true);
    };
  });

  return <div ref={root} className="subtask-sort-list">{ordered.map((item, index) => <motion.div key={item.id} data-subtask-sort-slot={item.id}
    layout={reduced || preview?.id === item.id ? false : "position"} transition={{ layout: { type: "spring", stiffness: 520, damping: 42, mass: 0.7 } }}
    className={preview?.id === item.id ? "subtask-sort-placeholder" : undefined} style={preview?.id === item.id ? { height: preview.height, transform: "none" } : undefined}>
    <div onDragStart={event => event.preventDefault()} onPointerDown={event => {
        if (disabled || settling.current || event.button !== 0 || event.pointerType !== "mouse" || (event.target as Element).closest('input,textarea,select,[role="checkbox"],[data-sort-ignore]')) return;
        const row = event.currentTarget.getBoundingClientRect();
        pointer.current = { id: item.id, x: event.clientX, y: event.clientY, clientY: event.clientY, offset: event.clientY - row.top, height: row.height, moved: false };
      }}>{preview?.id !== item.id && children(item, index)}</div>
  </motion.div>)}{preview && createPortal(<motion.div ref={node => { if (node && !node.matches(":popover-open")) node.showPopover(); }} popover="manual" className="subtask-sort-floating" style={{ position: "fixed", top: 0, left: preview.left, right: "auto", bottom: "auto", margin: 0, padding: 0, border: 0, width: preview.width, y, pointerEvents: "none", overflow: "visible" }} aria-hidden="true" inert>{items.filter(item => item.id === preview.id).map(item => <div key={item.id}>{children(item, items.findIndex(entry => entry.id === item.id))}</div>)}</motion.div>, document.body)}</div>;
}
