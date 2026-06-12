/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/utils";

const solidColors = {
  purple: "bg-fg-violet text-white",
  green: "bg-fg-green-500 text-white",
  red: "bg-fg-red text-white",
  yellow: "bg-fg-yellow text-white",
  blue: "bg-fg-blue text-white",
  cyan: "bg-fg-cyan-500 text-white",
  orange: "bg-fg-red text-white",
} as const;

const outlineColors = {
  purple: "bg-fg-violet-100 outline outline-1 outline-offset-[-1px] outline-fg-violet-300 text-fg-violet",
  green: "bg-fg-green-50 outline outline-1 outline-offset-[-1px] outline-fg-green-200 text-fg-green-500",
  red: "bg-fg-red-100 outline outline-1 outline-offset-[-1px] outline-fg-red-200 text-fg-red",
  yellow: "bg-fg-yellow-50 outline outline-1 outline-offset-[-1px] outline-fg-red-200 text-fg-yellow",
  blue: "bg-fg-blue-50 outline outline-1 outline-offset-[-1px] outline-fg-blue-200 text-fg-blue",
  cyan: "bg-fg-cyan-50 outline outline-1 outline-offset-[-1px] outline-fg-cyan-100 text-fg-cyan-500",
  orange: "bg-fg-red-50 outline outline-1 outline-offset-[-1px] outline-fg-red-200 text-fg-red",
} as const;

const sizes = {
  sm: "px-2 py-1.5 text-2xs gap-1",
  md: "px-2.5 py-2 text-xs gap-1.5",
} as const;

export type EventTagColor = keyof typeof solidColors;
export type EventTagSize = keyof typeof sizes;
export type EventTagVariant = "solid" | "outline";

export function EventTag({
  label,
  color = "purple",
  size = "md",
  variant = "solid",
  avatar,
  block = false,
  className,
}: {
  label: string;
  color?: EventTagColor;
  size?: EventTagSize;
  variant?: EventTagVariant;
  /** Small circular avatar shown before the label (Figma Month cell style) */
  avatar?: string;
  /** Use block-level flex (fills parent width). Default inline-flex. */
  block?: boolean;
  className?: string;
}) {
  const colorClass = variant === "solid" ? solidColors[color] : outlineColors[color];
  const avatarSize = size === "sm" ? 16 : 18;

  return (
    <span
      className={cn(
        "rounded-lg font-semibold items-center leading-tight",
        block ? "flex" : "inline-flex",
        sizes[size],
        colorClass,
        className,
      )}
    >
      {avatar && (
        <img
          src={avatar}
          alt=""
          className="rounded-full object-cover shrink-0"
          style={{ width: avatarSize, height: avatarSize }}
        />
      )}
      <span className="truncate">{label}</span>
    </span>
  );
}
