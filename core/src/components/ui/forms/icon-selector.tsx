"use client";

import { type ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { MagniferLinear, AddCircleLinear } from "solar-icon-set";
import { formAccents, type FormAccentColor } from "./form-utils";

// ============================================================
// Icon Selector — 3 sub-components from Figma:
// 1. ColorPicker — row of color dots
// 2. IconPicker — grid of icons with color picker popover
// 3. IconSelector — full component: preview circle + popover with search + icon grid
// ============================================================

export type IconSelectorColor = FormAccentColor;

// ── Color Picker ──────────────────────────────────────────

const defaultPalette = [
  "bg-fg-violet",
  "bg-emerald-500",
  "bg-teal-400",
  "bg-fg-yellow",
  "bg-fg-red",
  "bg-blue-600",
  "bg-fg-grey-700",
  "bg-fg-black",
];

export function ColorPicker({
  colors = defaultPalette,
  selectedIndex,
  onChange,
  className,
}: {
  colors?: string[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {colors.map((color, i) => {
        const isSelected = i === selectedIndex;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(i)}
            className={cn(
              "p-0.5 rounded-full flex items-center gap-2 cursor-pointer",
              isSelected && "outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
            )}
          >
            <div className={cn("w-5 h-5 rounded-full relative", color)}>
              {isSelected && (
                <svg className="absolute inset-0 m-auto" width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Icon Picker (grid) ────────────────────────────────────

export function IconPicker({
  icons,
  selectedIndex,
  onChange,
  color = "purple",
  className,
}: {
  icons: ReactNode[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
  color?: IconSelectorColor;
  className?: string;
}) {
  const accent = formAccents[color];

  return (
    <div className={cn("flex flex-wrap gap-2 content-start", className)}>
      {icons.map((icon, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange?.(index)}
            className={cn(
              "p-2 rounded-[10px] flex items-center justify-center cursor-pointer transition-colors",
              isSelected
                ? cn("outline outline-1 outline-offset-[-1px]", accent.outline, accent.text)
                : "text-fg-grey-700 hover:bg-fg-grey-200",
            )}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {icon}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Icon Selector (full) ──────────────────────────────────

export function IconSelector({
  icons,
  selectedIndex,
  onChange,
  label,
  color = "purple",
  searchPlaceholder = "Search icon. . .",
  className,
}: {
  icons: ReactNode[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
  label?: string;
  color?: IconSelectorColor;
  searchPlaceholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const accent = formAccents[color];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const hasSelection = selectedIndex !== undefined && selectedIndex >= 0;

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)} ref={containerRef}>
      {label && (
        <div className="self-stretch flex items-start gap-2">
          <span className="flex-1 text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">{label}</span>
        </div>
      )}
      <div className="self-stretch relative inline-flex items-center gap-3">
        {/* Preview circle */}
        <div
          className={cn(
            "w-16 h-16 p-5 bg-fg-grey-200 rounded-full flex justify-center items-center gap-2 overflow-hidden",
            open && cn("outline outline-1 outline-offset-[-1px]", accent.outline),
          )}
        >
          {hasSelection ? (
            <div className={cn("w-8 h-8 flex items-center justify-center", accent.text)}>
              {icons[selectedIndex!]}
            </div>
          ) : (
            <span className="text-fg-grey-700"><AddCircleLinear size={32} /></span>
          )}
        </div>

        {/* Select / Close button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn("flex items-start gap-1 cursor-pointer", accent.text)}
        >
          <AddCircleLinear size={20} />
          <span className="text-sm font-bold leading-5 tracking-fg">
            {open ? "Close" : "Select"}
          </span>
        </button>

        {/* Popover */}
        {open && (
          <div className="absolute left-[76px] top-[50px] w-80 z-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col overflow-hidden bg-white shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)]">
            {/* Search */}
            <div className="self-stretch p-4 border-b border-fg-grey-200 flex flex-col gap-2">
              <div className="self-stretch px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex items-center gap-1 overflow-hidden">
                <div className="w-6 h-6 flex justify-center items-center text-fg-grey-700">
                  <MagniferLinear size={20} />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="flex-1 h-6 text-fg-grey-700 text-sm font-normal leading-5 tracking-fg bg-transparent outline-none placeholder:text-fg-grey-700"
                />
              </div>
            </div>

            {/* Icon grid */}
            <div className="self-stretch p-3 flex flex-wrap gap-2 content-start max-h-72 overflow-y-auto">
              {icons.map((icon, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onChange?.(index);
                    }}
                    className={cn(
                      "p-2 rounded-[10px] flex items-center justify-center cursor-pointer transition-colors",
                      isSelected
                        ? cn("outline outline-1 outline-offset-[-1px]", accent.outline, accent.text)
                        : "text-fg-grey-700 hover:bg-fg-grey-200",
                    )}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {icon}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
