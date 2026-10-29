"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { folderShadow, folderBackShadow, folderFrontFill, folderBackFill, folderOutline } from "../../internal/folder-style";
import { useReducedMotion } from "../../internal/motion";

export type FolderFloatProps = {
  label: string;
  items: { id: string; label: string }[];
  trigger?: "hover" | "click";
  color?: "violet" | "blue" | "green";
  onSelect?: (id: string) => void;
  className?: string;
};

/** Independently implemented floating-note folder interaction. */
export function FolderFloat({ label, items, trigger = "hover", color = "blue", onSelect, className = "" }: FolderFloatProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const reduced = useReducedMotion();
  const id = useId();
  const active = open || pinned;
  const ink = `var(--color-fg-${color})`;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 210, damping: 17 };
  return <div className={`relative w-full max-w-md ${className}`} style={{ height: 360 }}
    onPointerEnter={event => { if (trigger === "hover" && event.pointerType !== "touch") setOpen(true); }}
    onPointerLeave={() => setOpen(false)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setPinned(false); } }}
    onKeyDown={event => { if (event.key === "Escape") { setOpen(false); setPinned(false); event.currentTarget.querySelector<HTMLButtonElement>("[aria-expanded]")?.focus(); } }}>
    <div className="absolute bottom-5 left-1/2" style={{ width: 200, height: 148, marginLeft: -100, perspective: 800 }}>
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0" style={{ top: -17, height: 153, width: "100%", overflow: "visible", filter: folderBackShadow }}>
        <path d={folderOutline()} fill={folderBackFill(ink)} />
      </svg>
      <span aria-hidden className="absolute flex items-center justify-center whitespace-nowrap font-semibold text-fg-white" style={{ left: 108, top: -18, width: 58, height: 17, fontSize: 12, lineHeight: "17px", pointerEvents: "none" }}>{label}</span>
      {[0, 1].map(index => <motion.div key={index} aria-hidden className="absolute inset-x-3 rounded-xl border border-fg-grey-200 bg-fg-white" style={{ height: 105, bottom: 10 }} animate={{ y: active ? -10 - index * 4 : -index * 4, rotate: index ? 3 : -3 }} transition={spring} />)}
      <div id={id} aria-label={`${label}中的便签`}>
        {items.slice(0, 8).map((item, index, visible) => {
          const row = Math.floor(index / 2), column = index % 2;
          const odd = visible.length % 2 === 1 && index === visible.length - 1;
          return <motion.button key={item.id} type="button" tabIndex={active ? 0 : -1} aria-hidden={!active} disabled={!active}
            className="absolute left-1/2 top-0 z-20 max-w-44 truncate rounded-full border border-fg-grey-200 bg-fg-white px-4 py-2 text-xs font-medium text-fg-black shadow-md focus-visible:outline-2 focus-visible:outline-fg-violet"
            style={{ marginLeft: -65, width: 130, pointerEvents: active ? "auto" : "none" }} initial={false}
            animate={{ x: active ? odd ? 0 : (column ? 1 : -1) * (row % 2 ? 72 : 78) : 0, y: active ? -45 - row * 48 : 45, opacity: active ? 1 : 0, scale: active ? 1 : .45, rotate: active ? (index % 2 ? 5 : -5) : 0 }}
            transition={{ ...spring, delay: reduced ? 0 : active ? index * .045 : (visible.length - index - 1) * .025 }}
            whileHover={reduced ? undefined : { scale: 1.08, rotate: 0 }} whileTap={{ scale: .95 }}
            onClick={() => { onSelect?.(item.id); setOpen(false); setPinned(false); }}>{item.label}</motion.button>;
        })}
      </div>
      <motion.button type="button" aria-expanded={active} aria-controls={id} aria-label={`${active ? "收起" : "展开"}${label}`}
        onClick={() => { const next = !active; setPinned(next); setOpen(false); }}
        className="absolute inset-x-0 bottom-0 z-10 flex h-32 flex-col justify-end rounded-2xl p-5 text-left text-fg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg-black"
        style={{ background: folderFrontFill(ink), transformOrigin: "bottom", border: "none", boxShadow: folderShadow }}
        animate={{ rotateX: reduced ? 0 : active ? -35 : -14 }} transition={spring}>

      </motion.button>
    </div>
  </div>;
}
