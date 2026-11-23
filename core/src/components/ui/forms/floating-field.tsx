"use client";

import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import type { FormAccentColor } from "./form-utils";

// Shared look for input-driven floating lists (Combobox, Autocomplete).

export type FloatingFieldState = "idle" | "disabled" | "error";
export type FloatingFieldShape = "rounded" | "pill";

const focusOutline: Record<FormAccentColor, string> = {
  purple: "focus-within:outline-fg-violet",
  blue: "focus-within:outline-fg-blue",
  black: "focus-within:outline-fg-black",
};

export function floatingFieldClass({ state, shape, color }: { state: FloatingFieldState; shape: FloatingFieldShape; color: FormAccentColor }) {
  return cn(
    "flex w-full items-center gap-2 px-4 outline outline-1 outline-offset-[-1px] transition-all",
    shape === "pill" ? "rounded-full" : "rounded-xl",
    state === "error" && "bg-fg-red-50 outline-fg-red",
    state === "disabled" && "cursor-not-allowed bg-fg-grey-200 outline-fg-grey-200",
    state === "idle" && cn("bg-background outline-fg-grey-200", focusOutline[color]),
  );
}

export function floatingInputClass(state: FloatingFieldState) {
  return cn("min-w-12 flex-1", floatingInputTextClass(state));
}

export function floatingInputTextClass(state: FloatingFieldState) {
  return cn(
    "bg-transparent text-sm font-normal leading-5 tracking-fg outline-none",
    state === "error" && "text-fg-red placeholder:text-fg-red",
    state === "disabled" && "cursor-not-allowed text-fg-grey-700 placeholder:text-fg-grey-700",
    state === "idle" && "text-fg-black placeholder:text-fg-grey-700",
  );
}

export const floatingIconButtonClass =
  "flex size-6 shrink-0 cursor-pointer items-center justify-center text-fg-grey-700 outline-none hover:text-fg-black focus-visible:text-fg-black disabled:cursor-not-allowed";

export const floatingListPopupClass =
  "forge-popup flex max-h-[min(var(--available-height),20rem)] w-(--anchor-width) max-w-(--available-width) flex-col overflow-hidden py-2 bg-background rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-100 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)]";

export const floatingOptionClass =
  "group flex w-full shrink-0 cursor-pointer select-none items-center gap-2 px-4 py-3 text-left outline-none data-highlighted:bg-fg-grey-100 data-disabled:cursor-not-allowed data-disabled:opacity-50";

const selectedText: Record<FormAccentColor, string> = {
  purple: "group-data-selected:text-fg-violet",
  blue: "group-data-selected:text-fg-blue",
  black: "group-data-selected:text-fg-black",
};

/** Row content; selection styling follows the parent item's `data-selected`. */
export function FloatingOptionContent({ icon, label, description, color }: {
  icon?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  color: FormAccentColor;
}) {
  return (
    <>
      {icon && <span aria-hidden className={cn("inline-flex size-5 shrink-0 items-center justify-center text-fg-grey-700", selectedText[color])}>{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm font-medium leading-5 tracking-fg text-fg-grey-700 group-data-selected:font-semibold", selectedText[color])}>{label}</span>
        {description && <span className="block whitespace-normal break-words text-xs font-normal leading-4 tracking-fg text-fg-grey-700">{description}</span>}
      </span>
    </>
  );
}

export const floatingEmptyClass = "px-4 py-3 text-sm font-normal leading-5 tracking-fg text-fg-grey-700 empty:hidden";
