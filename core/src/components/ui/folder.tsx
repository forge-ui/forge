"use client";

import { useId, useState, useRef, useEffect, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
import { folderShadow, folderBackShadow, folderFrontFill, folderBackFill, folderOutline } from "../../internal/folder-style";
import { useReducedMotion } from "../../internal/motion";

export type FolderItem = { id?: string; label?: string; title?: string; image?: string; alt?: string; description?: string; content?: ReactNode };
export type FolderProps = {
  label: string;
  items?: FolderItem[];
  color?: string;
  mode?: "flap" | "book";
  variant?: "solid" | "glass" | "matte";
  layout?: "spread" | "stack" | "row";
  paperColor?: string;
  tabPosition?: "left" | "center" | "right";
  openOn?: "click" | "hover";
  frost?: number;
  tilt?: number;
  speed?: number;
  bounce?: number;
  peek?: boolean;
  intro?: boolean;
  draggable?: boolean;
  zoomOnClick?: boolean;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (item: FolderItem, index: number) => void;
  disabled?: boolean;
  className?: string;
};

/** Folder interaction inspired by https://reactbits.dev/components/folder.
 * Original Forge implementation; no upstream source is included.
 */
export function Folder({ label, items = [], color = "blue", size = "md", open, defaultOpen = false, onOpenChange, onItemClick, disabled = false, className = "", mode = "flap", variant = "solid", layout = "spread", paperColor = "var(--color-fg-white)", tabPosition = "right", openOn = "click", frost = .25, tilt = .5, speed = 1, bounce = .4, peek = true, intro = false, draggable = false, zoomOnClick = false, theme = "light" }: FolderProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const expanded = open ?? internal;
  const id = useId();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const width = typeof size === "number" ? 224 * Math.min(2, Math.max(.5, size)) : { sm: 180, md: 230, lg: 280 }[size];
  const book = mode === "book";
  const folderHeight = width * (book ? 1.28 : .78);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setFocused(null); if (open === undefined) setInternal(false); } };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const change = (next: boolean) => { if (open === undefined) setInternal(next); onOpenChange?.(next); };
  const transition = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220 * Math.max(.2, speed), damping: 30 - Math.min(1, Math.max(0, bounce)) * 14, mass: .85 };
  const ink = "var(--folder-color)";
  const tabLeft = tabPosition === "left" ? 8 : tabPosition === "center" ? 34 : 54;
  const backOutline = folderOutline(tabLeft);
  return <div ref={root} data-theme={theme} className={`relative inline-flex flex-col items-center gap-5 ${className}`} style={{ width, "--folder-color": ["violet", "blue", "green"].includes(color) ? `var(--color-fg-${color})` : color, opacity: disabled ? .5 : 1 } as CSSProperties}
    onPointerEnter={() => { if (!disabled) { setHovered(true); if (openOn === "hover") change(true); } }} onPointerLeave={() => { setHovered(false); if (openOn === "hover") change(false); }}
    onKeyDown={event => { if (event.key === "Escape" && expanded) { setFocused(null); change(false); event.currentTarget.querySelector<HTMLButtonElement>("[aria-expanded]")?.focus(); } }}>
    <div className="relative w-full" style={{ height: folderHeight + width * .6, perspective: 1000 }}>
      <motion.div className="absolute bottom-0 w-full" style={{ height: folderHeight, transformStyle: "preserve-3d" }}
        animate={{ y: !reduced && hovered ? -7 : 0, rotateX: !reduced && hovered ? 6 * tilt : 0, rotateY: !reduced && hovered ? -8 * tilt : 0 }} transition={transition}>
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0" style={{ top: -folderHeight * .115, height: folderHeight * 1.115, width: "100%", overflow: "visible", filter: folderBackShadow }}>
          <path d={backOutline} fill={folderBackFill(ink)} />
        </svg>
        <span aria-hidden className="absolute flex items-center justify-center whitespace-nowrap font-semibold text-fg-white" style={{ left: `${tabLeft}%`, top: -folderHeight * .115, width: "29%", height: folderHeight * .1115, fontSize: 12, lineHeight: 1, pointerEvents: "none" }}>{label}</span>
        <div id={id} aria-label={`${label}中的文件`} className="absolute inset-0">
          {items.slice(0, 6).map((item, index, visible) => {
            const offset = index - (visible.length - 1) / 2;
            return <motion.button key={item.id ?? index} type="button" disabled={disabled || !expanded} tabIndex={expanded ? 0 : -1} aria-hidden={!expanded} aria-pressed={zoomOnClick ? focused === index : undefined} onClick={() => { if (dragging.current) return; if (zoomOnClick) setFocused(current => current === index ? null : index); onItemClick?.(item, index); }}
              className="absolute flex flex-col overflow-hidden rounded-xl bg-fg-white p-4 text-left text-fg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg-violet"
              drag={draggable && expanded && !reduced} dragMomentum={false} onDragStart={() => { dragging.current = true; }} onDragEnd={() => { setTimeout(() => { dragging.current = false; }, 0); }}
              style={{ touchAction: draggable ? "none" : undefined, bottom: "6%", left: book ? "10%" : "23%", width: book ? "80%" : "54%", height: book ? "88%" : "83%", transformOrigin: "50% 90%", zIndex: focused === index ? 30 : index + 1, boxShadow: "0 4px 12px rgba(0,0,0,.12)", background: paperColor }}
              initial={intro && !reduced ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1,
                x: focused === index ? 0 : expanded ? layout === "stack" ? index * 7 : layout === "row" ? offset * width * .6 : offset * width * .5 : offset * width * .2,
                y: focused === index ? -width * .6 : expanded ? book ? -15 : -width * (.43 - Math.abs(offset) * .035) : -index * 5 - (hovered && peek ? 9 : 0),
                rotate: focused === index ? 0 : expanded && layout === "spread" ? offset * 10 : offset * -4,
                scale: focused === index ? 1.6 : expanded ? 1 : .94 + index * .01 }}
              whileHover={expanded && focused === null && !reduced ? { y: -width * .48, scale: 1.025, rotate: offset * 7 } : undefined}
              whileFocus={expanded && focused === null && !zoomOnClick && !reduced ? { y: -width * .48, scale: 1.025 } : undefined} transition={transition}>
              {item.image ? <img src={item.image} alt={item.alt ?? item.title ?? item.label ?? "文件图片"} draggable={false} className="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)] rounded-lg object-cover" /> : null}
              <span className="text-xs font-semibold">{item.title ?? item.label}</span>
              <div className="mt-3 text-xs leading-5 text-fg-grey-600">{item.description ?? item.content}</div>
              <div aria-hidden className="mt-auto flex flex-col gap-2 pt-3"><span className="h-1.5 w-full rounded bg-fg-grey-200" /><span className="h-1.5 w-3/4 rounded bg-fg-grey-200" /><span className="h-1.5 w-1/2 rounded bg-fg-grey-200" /></div>
            </motion.button>;
          })}
        </div>
        <motion.button type="button" disabled={disabled} aria-expanded={expanded} aria-controls={id} aria-label={`${expanded ? "收起" : "展开"}${label}`} onClick={() => { setFocused(null); change(!expanded); }}
          className="absolute bottom-0 left-0 z-10 flex w-full flex-col justify-end overflow-hidden rounded-2xl p-5 text-left text-fg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg-black"
          style={{ height: book ? "100%" : "70%", transformOrigin: book ? "0% 50%" : "50% 100%", background: variant === "glass" ? `linear-gradient(140deg, color-mix(in srgb, ${ink} 28%, transparent), color-mix(in srgb, ${ink} 12%, transparent))` : variant === "matte" ? ink : folderFrontFill(ink), backdropFilter: variant === "glass" ? `blur(${2 + frost * 15}px) saturate(1.5)` : undefined, border: "none", boxShadow: folderShadow, backfaceVisibility: "hidden" }}
          initial={false} animate={{ rotateY: !reduced && book && expanded ? -170 : 0, rotateX: reduced || book ? 0 : expanded ? -64 : hovered && peek ? -15 : 0, scaleY: reduced && expanded ? .64 : 1 }} transition={transition}>
        </motion.button>
      </motion.div>
    </div>
  </div>;
}
