"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { FilterBold } from "solar-icon-set";
import { accentColors, type AccentColor } from "./accent-utils";

export type FilterTriggerPanel = ReactNode | ((close: () => void) => ReactNode);

export function FilterTrigger({
  label = "Filters",
  color = "purple",
  count,
  open: openProp,
  onClick,
  panel,
}: {
  label?: string;
  color?: AccentColor;
  count?: number;
  /** Controlled open state. If set, internal state is ignored. */
  open?: boolean;
  /** External click handler. If set, takes over (no built-in popover). */
  onClick?: () => void;
  /** Optional panel content. `ReactNode` or `(close) => ReactNode` so inner Apply/Cancel can close it. */
  panel?: FilterTriggerPanel;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const hasPanel = panel !== undefined;
  const usingInternal = !onClick && openProp === undefined && hasPanel;
  const open = openProp ?? (usingInternal ? internalOpen : false);

  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!usingInternal || !internalOpen) return;
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setInternalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [usingInternal, internalOpen]);

  const accent = accentColors[color];
  const iconColor = open ? accent.text : "text-fg-grey-500";
  const textCls = open ? `${accent.text} font-bold` : "text-fg-grey-700 font-semibold";
  const borderCls = open ? `outline-1 ${accent.outline}` : "outline-1 outline-fg-grey-200";

  const handleClick = () => {
    if (onClick) onClick();
    else if (usingInternal) setInternalOpen((v) => !v);
  };

  const renderedPanel = typeof panel === "function" ? panel(() => setInternalOpen(false)) : panel;

  return (
    <div className="relative inline-flex" ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        className={`px-4 py-3.5 bg-white rounded-full outline ${borderCls} inline-flex items-center gap-1 transition-colors`}
      >
        <span className={`inline-flex ${iconColor}`}>
          <FilterBold size={20} />
        </span>
        <span className={`text-sm leading-5 tracking-fg ${textCls}`}>{label}</span>
        {typeof count === "number" && count > 0 && (
          <span className="min-w-5 h-5 px-1.5 bg-fg-red text-white text-2xs font-bold leading-4 tracking-fg rounded-full inline-flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      {usingInternal && internalOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">{renderedPanel}</div>
      )}
    </div>
  );
}
