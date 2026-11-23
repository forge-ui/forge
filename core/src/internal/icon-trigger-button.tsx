"use client";

import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import type { MotionPreference } from "../lib/motion";
import { cn } from "../lib/utils";
import { accentColors, type AccentColor } from "../components/ui/accent-utils";

export type IconTriggerVisualState = "idle" | "hover" | "open";
export type IconTriggerVisualSurface = "default" | "onColoredBg";

// `data-popup-open` comes from Base UI triggers, so open styling follows the real popup state.
const popupOpen: Record<AccentColor, string> = {
  purple: "data-popup-open:bg-fg-violet data-popup-open:text-white data-popup-open:hover:bg-fg-violet",
  blue: "data-popup-open:bg-fg-blue data-popup-open:text-white data-popup-open:hover:bg-fg-blue",
  black: "data-popup-open:bg-fg-black data-popup-open:text-white data-popup-open:hover:bg-fg-black",
};

/** The round icon button shared by IconTrigger and KebabMenu; forwards ref and props for Base UI triggers. */
export function IconTriggerButton({
  icon,
  badge,
  accent = "blue",
  surface = "default",
  state = "idle",
  motion = "auto",
  className,
  ref,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: ReactNode;
  badge?: number;
  accent?: AccentColor;
  surface?: IconTriggerVisualSurface;
  state?: IconTriggerVisualState;
  motion?: MotionPreference;
  ref?: Ref<HTMLButtonElement>;
}) {
  const accentTheme = accentColors[accent];
  const stateClass = surface === "onColoredBg"
    ? state === "open"
      ? "bg-white/25 text-white"
      : state === "hover"
        ? "bg-white/10 text-white"
        : "text-white/75 hover:bg-white/10 data-popup-open:bg-white/25 data-popup-open:text-white"
    : state === "open"
      ? cn(accentTheme.bg, "text-white")
      : state === "hover"
        ? "bg-fg-grey-200 text-fg-grey-700"
        : cn("text-fg-grey-700 hover:bg-fg-grey-200", popupOpen[accent]);

  return (
    <button
      type="button"
      data-motion={motion}
      {...props}
      ref={ref}
      className={cn("forge-button relative p-3 rounded-full inline-flex items-center justify-center", stateClass, className)}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-fg-red rounded-full text-white text-[10px] font-semibold leading-4 tracking-fg">
          {badge}
        </span>
      )}
    </button>
  );
}
