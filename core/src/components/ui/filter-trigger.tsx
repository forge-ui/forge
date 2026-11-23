"use client";

import { type ReactNode, useState } from "react";
import { AnchoredPanel } from "../../internal/anchored-panel";
import { FilterBold } from "../../icons";
import { accentColors, type AccentColor } from "./accent-utils";

export type FilterTriggerPanel = ReactNode | ((close: () => void) => ReactNode);

export function FilterTrigger({
  label = "筛选",
  color = "blue",
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

  const accent = accentColors[color];
  const iconColor = open ? accent.text : "text-fg-grey-500";
  const textCls = open ? `${accent.text} font-semibold` : "text-fg-grey-700 font-medium";
  const borderCls = open ? `outline-1 ${accent.outline}` : "outline-1 outline-fg-grey-200";

  const handleClick = () => {
    if (onClick) onClick();
    else if (usingInternal) setInternalOpen((v) => !v);
  };

  const renderedPanel = typeof panel === "function" ? panel(() => setInternalOpen(false)) : panel;

  const button = (
    <button
      type="button"
      onClick={usingInternal ? undefined : handleClick}
      className={`px-4 py-3.5 bg-background rounded-full outline ${borderCls} inline-flex items-center gap-1 transition-colors`}
    >
      <span className={`inline-flex ${iconColor}`}>
        <FilterBold size={20} />
      </span>
      <span className={`text-sm leading-5 tracking-fg ${textCls}`}>{label}</span>
      {typeof count === "number" && count > 0 && (
        <span className="min-w-5 h-5 px-1.5 bg-fg-red text-white text-2xs font-semibold leading-4 tracking-fg rounded-full inline-flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );

  if (!usingInternal) return <div className="relative inline-flex">{button}</div>;
  return (
    <div className="relative inline-flex">
      <AnchoredPanel open={internalOpen} onOpenChange={setInternalOpen} trigger={button} label={label}>{renderedPanel}</AnchoredPanel>
    </div>
  );
}
