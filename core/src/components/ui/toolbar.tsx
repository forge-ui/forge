"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { MagniferLinear, CalendarBoldDuotone, FilterBold, AltArrowDownLinear, MenuDotsBold, StarBoldDuotone } from "solar-icon-set";
import { CalendarPopup } from "./calendar-popup";

// ============================================================
// Toolbar - Top toolbar layout
// Variants: search-filter, page-title
// color: purple, blue, black  (drives active pill tab + callers' Primary button)
// ============================================================

export type ToolbarColor = "purple" | "blue" | "black";

const toolbarPillActive = {
  purple: "bg-fg-violet-100 text-fg-violet",
  blue: "bg-fg-blue-100 text-fg-blue",
  black: "bg-fg-grey-200 text-fg-black",
} as const;

// ── Toolbar (generic flex row) ──────────────────────────────

export function Toolbar({
  left,
  right,
  className,
}: {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-between items-start w-full", className)}>
      {left}
      {right}
    </div>
  );
}

// ── ToolbarSearchInput ──────────────────────────────────────

export function ToolbarSearchInput({
  placeholder = "Search. . .",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-80 min-w-0 px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-start items-center gap-1 overflow-hidden",
        className,
      )}
    >
      <div className="w-6 h-6 flex justify-center items-center">
        <MagniferLinear size={20} color="var(--fg-grey-700)" />
      </div>
      <div className="flex-1 h-6 flex justify-start items-center gap-2 overflow-hidden">
        <span className="justify-start text-fg-grey-700 text-sm font-normal leading-5 tracking-fg">
          {placeholder}
        </span>
      </div>
    </div>
  );
}

// ── Shared: outside-click hook ──────────────────────────────

function useOutsideClick<T extends HTMLElement>(
  active: boolean,
  onOutside: () => void,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!active) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [active, onOutside]);
  return ref;
}

// ── ToolbarSelectDropdown ───────────────────────────────────

export interface ToolbarSelectOption {
  label: string;
  value: string;
}

export function ToolbarSelectDropdown({
  placeholder = "Select. . .",
  value,
  fixedWidth,
  onClick,
  options,
  onChange,
  className,
}: {
  placeholder?: string;
  value?: string;
  fixedWidth?: boolean;
  /** External click handler. If set, takes over (no built-in dropdown). */
  onClick?: () => void;
  /** Data-driven options. When set (and `onClick` not set), clicking pops the list. */
  options?: ToolbarSelectOption[];
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const usingInternal = !onClick && options !== undefined;
  const wrapRef = useOutsideClick<HTMLDivElement>(usingInternal && open, () => setOpen(false));

  const matched = options?.find((o) => o.value === value);
  const displayText = matched?.label ?? value ?? placeholder;
  const hasValue = value !== undefined;

  const handleClick = () => {
    if (onClick) onClick();
    else if (options !== undefined) setOpen((v) => !v);
  };

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-2 overflow-hidden cursor-pointer",
          fixedWidth && "w-20",
        )}
      >
        <div className="flex-1 h-6 flex justify-start items-center gap-2 overflow-hidden">
          <span
            className={cn(
              "justify-start text-sm font-normal leading-5 tracking-fg whitespace-nowrap",
              hasValue ? "text-fg-black" : "text-fg-grey-700",
            )}
          >
            {displayText}
          </span>
        </div>
        <div className="w-6 h-6 flex justify-center items-center">
          <AltArrowDownLinear size={20} color="var(--fg-grey-700)" />
        </div>
      </button>
      {usingInternal && open && options && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-full bg-white rounded-2xl shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-2 flex flex-col gap-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
              className={cn(
                "px-3 py-2 rounded-xl text-left text-sm leading-5 tracking-fg transition-colors whitespace-nowrap",
                value === opt.value ? "bg-fg-grey-100 text-fg-black font-semibold" : "text-fg-grey-700 hover:bg-fg-grey-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ToolbarDatepicker ───────────────────────────────────────

export function ToolbarDatepicker({
  label = "Select Dates",
  onClick,
  enablePopover = false,
  accentBg = "bg-fg-violet",
  className,
}: {
  label?: string;
  /** External click handler. If set, takes over (no built-in calendar). */
  onClick?: () => void;
  /** Opt-in to built-in calendar popup on click (only when `onClick` is not set). */
  enablePopover?: boolean;
  /** Accent bg class for today's highlight in built-in calendar. */
  accentBg?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const usingInternal = !onClick && enablePopover;
  const wrapRef = useOutsideClick<HTMLDivElement>(usingInternal && open, () => setOpen(false));

  const handleClick = () => {
    if (onClick) onClick();
    else if (usingInternal) setOpen((v) => !v);
  };

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer"
      >
        <div className="w-6 h-6 flex justify-center items-center">
          <CalendarBoldDuotone size={20} color="var(--fg-grey-700)" />
        </div>
        <div className="h-6 flex justify-start items-center gap-2 overflow-hidden">
          <span className="justify-start text-fg-grey-700 text-sm font-normal leading-5 tracking-fg whitespace-nowrap">
            {label}
          </span>
        </div>
      </button>
      {usingInternal && open && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <CalendarPopup accentBg={accentBg} />
        </div>
      )}
    </div>
  );
}

// ── ToolbarFilterButton ─────────────────────────────────────

export type ToolbarFilterPanel = ReactNode | ((close: () => void) => ReactNode);

export function ToolbarFilterButton({
  label = "Filters",
  onClick,
  panel,
  className,
}: {
  label?: string;
  /** External click handler. If set, takes over (no built-in popover). */
  onClick?: () => void;
  /** Optional panel. `ReactNode` or `(close) => ReactNode` so inner Apply/Cancel can close it. */
  panel?: ToolbarFilterPanel;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const usingInternal = !onClick && panel !== undefined;
  const wrapRef = useOutsideClick<HTMLDivElement>(usingInternal && open, () => setOpen(false));

  const handleClick = () => {
    if (onClick) onClick();
    else if (panel !== undefined) setOpen((v) => !v);
  };

  const renderedPanel = typeof panel === "function" ? panel(() => setOpen(false)) : panel;

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer"
      >
        <FilterBold size={20} color="var(--fg-grey-700)" />
        <span className="justify-start text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg whitespace-nowrap">
          {label}
        </span>
      </button>
      {usingInternal && open && (
        <div className="absolute right-0 top-full mt-2 z-50">{renderedPanel}</div>
      )}
    </div>
  );
}

// ── ToolbarShowSelect ───────────────────────────────────────

export function ToolbarShowSelect({
  value = "1",
  onClick,
  options,
  onChange,
  className,
}: {
  value?: string;
  onClick?: () => void;
  options?: ToolbarSelectOption[];
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-start items-center gap-2", className)}>
      <span className="justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
        Show
      </span>
      <ToolbarSelectDropdown
        value={value}
        fixedWidth
        onClick={onClick}
        options={options}
        onChange={onChange}
      />
    </div>
  );
}

// ── ToolbarActions (right-side action group) ────────────────

export function ToolbarActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-start items-start gap-3", className)}>
      {children}
    </div>
  );
}

// ── ToolbarKebabButton ──────────────────────────────────────

export function ToolbarKebabButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center cursor-pointer",
        className,
      )}
    >
      <MenuDotsBold size={20} color="var(--fg-grey-700)" />
    </button>
  );
}

// ── ToolbarFavoriteButton ───────────────────────────────────

export function ToolbarFavoriteButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center cursor-pointer",
        className,
      )}
    >
      <StarBoldDuotone size={20} color="var(--fg-grey-700)" />
    </button>
  );
}

// ── ToolbarPillTabs ─────────────────────────────────────────
// Pill-style tab group used in Toolbar rows (not to be confused with
// TabBar which renders an underlined bar). Active pill adopts the
// toolbar color; inactive pills stay grey.

export interface ToolbarPillTab {
  label: string;
  active?: boolean;
}

export function ToolbarPillTabs({
  tabs,
  color = "purple",
  onChange,
  className,
}: {
  tabs: ToolbarPillTab[];
  color?: ToolbarColor;
  onChange?: (index: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-1 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex justify-start items-start overflow-hidden",
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange?.(index)}
          className={cn(
            "px-3.5 py-2.5 rounded-full flex justify-center items-center gap-2 text-sm leading-5 tracking-fg cursor-pointer",
            tab.active
              ? cn(toolbarPillActive[color], "font-bold")
              : "text-fg-grey-700 font-semibold",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── PageTitleToolbar ────────────────────────────────────────

export function PageTitleToolbar({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const hasSubContent = subtitle || breadcrumbs;

  return (
    <div
      className={cn(
        "self-stretch inline-flex justify-start items-end gap-4",
        !hasSubContent && "items-center",
        className,
      )}
    >
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-fg-black text-2xl font-semibold leading-8 tracking-fg">
          {title}
        </div>
        {subtitle && (
          <div className="self-stretch justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
            {subtitle}
          </div>
        )}
        {breadcrumbs}
      </div>
      {actions}
    </div>
  );
}
