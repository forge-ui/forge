"use client";

import type { ReactNode } from "react";
import { RestartCircleLinear } from "solar-icon-set";
import { accentColors, type AccentColor } from "./accent-utils";

export function FilterPanel({
  title = "Filters",
  color = "purple",
  children,
  onReset,
  onCancel,
  onApply,
  applyLabel = "Apply Filter",
  cancelLabel = "Cancel",
  resetLabel = "Reset",
  className = "",
}: {
  title?: string;
  color?: AccentColor;
  children: ReactNode;
  onReset?: () => void;
  onCancel?: () => void;
  onApply?: () => void;
  applyLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  className?: string;
}) {
  const accent = accentColors[color];

  return (
    <div
      className={`w-full max-w-96 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] flex flex-col overflow-hidden ${className}`}
    >
      <div className="self-stretch px-5 py-4 border-b border-fg-grey-200 inline-flex items-center justify-between gap-2">
        <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg">
          {title}
        </span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center gap-1 text-sm font-semibold leading-5 tracking-fg ${accent.text}`}
          >
            <RestartCircleLinear size={16} />
            {resetLabel}
          </button>
        )}
      </div>

      <div className="self-stretch p-4 flex flex-col gap-3">{children}</div>

      <div className="self-stretch px-5 py-4 border-t border-fg-grey-200 inline-flex justify-end items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-3.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700 text-sm font-bold leading-5 tracking-fg"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onApply}
          className={`px-4 py-3.5 rounded-full text-white text-sm font-bold leading-5 tracking-fg ${accent.bg}`}
        >
          {applyLabel}
        </button>
      </div>
    </div>
  );
}
