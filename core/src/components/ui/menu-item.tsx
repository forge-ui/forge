/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";
import { AltArrowDownLinear } from "solar-icon-set";
import { cn } from "../../lib/utils";
import { accentColors, type AccentColor } from "./accent-utils";

export type MenuItemAccent = AccentColor;
export type MenuItemSurface = "default" | "onColoredBg";
export type MenuItemIntent = "default" | "danger";
export type MenuItemKind = "single" | "submenu" | "dropdown";
export type MenuItemState = "idle" | "hover" | "active" | "disabled";

export type MenuItemLead =
  | { kind: "icon"; icon: ReactNode }
  | { kind: "image"; src: string; alt?: string };

export function MenuItem({
  accent = "purple",
  surface = "default",
  intent = "default",
  kind = "single",
  state = "idle",
  active,
  lead,
  label,
  badge,
  className,
  onClick,
}: {
  accent?: MenuItemAccent;
  surface?: MenuItemSurface;
  intent?: MenuItemIntent;
  kind?: MenuItemKind;
  state?: MenuItemState;
  /** shortcut for state='active' */
  active?: boolean;
  lead?: MenuItemLead;
  label?: string;
  badge?: number;
  className?: string;
  onClick?: () => void;
}) {
  const resolvedState = active ? "active" : state;
  const accentTheme = accentColors[accent];
  const hasText = label !== undefined && label !== "";
  const showLead = kind !== "submenu" && lead !== undefined;
  const showBadge = badge !== undefined && badge > 0;
  const showSubmenuArrow = kind === "dropdown" && hasText;
  const showLeftLine =
    resolvedState === "active" && (kind === "dropdown" || kind === "submenu" || kind === "single");

  // Padding: icon-only gets p-3; labeled row gets px-3.5 py-3
  const basePadding = hasText ? "px-3.5 py-3" : "p-3";
  const submenuPadding = hasText ? "pl-11 pr-3.5 py-3.5" : "p-3";

  // Colors — by surface × state × intent
  const stateClass = (() => {
    if (intent === "danger") {
      // Danger items: red text on default surface; on colored bg falls back to white
      if (surface === "onColoredBg") {
        return resolvedState === "active"
          ? "bg-white/25 text-white font-bold"
          : resolvedState === "hover"
            ? "bg-white/10 text-white"
            : resolvedState === "disabled"
              ? "text-white/40 cursor-not-allowed"
              : "text-white/75 hover:bg-white/10";
      }
      return resolvedState === "active"
        ? cn(accentTheme.bg, "text-white")
        : resolvedState === "hover"
          ? "bg-fg-red-50 text-fg-red"
          : resolvedState === "disabled"
            ? "text-fg-red/40 cursor-not-allowed"
            : "text-fg-red hover:bg-fg-red-50";
    }

    if (surface === "onColoredBg") {
      return resolvedState === "active"
        ? "bg-white/25 text-white font-bold"
        : resolvedState === "hover"
          ? "bg-white/10 text-white"
          : resolvedState === "disabled"
            ? "text-white/40 cursor-not-allowed"
            : "text-white/75 hover:bg-white/10";
    }

    // default surface
    return resolvedState === "active"
      ? cn(accentTheme.bg, "text-white")
      : resolvedState === "hover"
        ? "bg-fg-grey-200 text-fg-grey-700"
        : resolvedState === "disabled"
          ? "text-fg-grey-300 cursor-not-allowed"
          : "text-fg-grey-700 hover:bg-fg-grey-200";
  })();

  const labelWeight = resolvedState === "active" ? "font-bold" : "font-semibold";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={resolvedState === "disabled"}
      className={cn(
        "relative rounded-full inline-flex items-center gap-2 transition-colors",
        hasText && "w-full",
        kind === "submenu" ? submenuPadding : basePadding,
        stateClass,
        className
      )}
    >
      {showLeftLine && (
        <span
          aria-hidden
          className={cn(
            "absolute left-[-16px] top-0 w-1 h-12 rounded-tr-lg rounded-br-lg",
            surface === "onColoredBg" ? "bg-white" : accentTheme.bg
          )}
        />
      )}

      {showLead && lead && (
        <span className="w-6 h-6 flex items-center justify-center shrink-0">
          {lead.kind === "icon" ? (
            lead.icon
          ) : (
            <img
              src={lead.src}
              alt={lead.alt ?? ""}
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
        </span>
      )}

      {hasText && (
        <span
          className={cn(
            "flex-1 text-left text-sm leading-5 tracking-fg line-clamp-1",
            labelWeight
          )}
        >
          {label}
        </span>
      )}

      {showBadge && (
        <span
          className={cn(
            "rounded-full bg-fg-red text-white text-[10px] font-semibold leading-4 tracking-fg px-1.5 py-0.5",
            !hasText && "absolute top-1 right-1"
          )}
        >
          {badge}
        </span>
      )}

      {showSubmenuArrow && (
        <span
          className={cn(
            "w-6 h-6 flex items-center justify-center shrink-0",
            resolvedState === "active"
              ? "text-white"
              : surface === "onColoredBg"
                ? "text-white/75"
                : "text-fg-grey-700"
          )}
        >
          <AltArrowDownLinear size={16} />
        </span>
      )}
    </button>
  );
}
