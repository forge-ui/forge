/* eslint-disable @next/next/no-img-element */
import { AltArrowDownLinear } from "solar-icon-set";
import { cn } from "../../lib/utils";
import { accentColors, type AccentColor } from "./accent-utils";

export type ProfileCardState = "idle" | "hover" | "selected";
export type ProfileCardSurface = "default" | "onColoredBg";

export function ProfileCard({
  avatar,
  name,
  subtitle,
  state = "idle",
  accent = "purple",
  surface = "default",
  className,
  onClick,
}: {
  avatar: string;
  name: string;
  subtitle?: string;
  state?: ProfileCardState;
  accent?: AccentColor;
  surface?: ProfileCardSurface;
  className?: string;
  onClick?: () => void;
}) {
  const accentTheme = accentColors[accent];

  const shellClass =
    surface === "onColoredBg"
      ? state === "selected"
        ? "bg-white/25"
        : state === "hover"
          ? "bg-white/10"
          : "bg-white/10"
      : state === "selected"
        ? accentTheme.bg
        : state === "hover"
          ? "bg-fg-grey-200"
          : "bg-fg-grey-50 outline outline-1 outline-offset-[-1px] outline-fg-grey-200";

  const titleClass =
    surface === "onColoredBg"
      ? "text-white"
      : state === "selected"
        ? "text-white"
        : "text-fg-black";

  const subtitleClass =
    surface === "onColoredBg"
      ? "text-white/75"
      : state === "selected"
        ? accentTheme.onAccentMuted
        : "text-fg-grey-700";

  const arrowClass =
    surface === "onColoredBg"
      ? "text-white"
      : state === "selected"
        ? "text-white"
        : "text-fg-grey-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl inline-flex items-center gap-3 transition-colors text-left",
        shellClass,
        className
      )}
    >
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 flex flex-col justify-center items-start gap-0.5 min-w-0">
        <span
          className={cn(
            "self-stretch text-sm font-semibold leading-5 tracking-fg line-clamp-1",
            titleClass
          )}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={cn(
              "self-stretch text-xs font-medium leading-4 tracking-fg line-clamp-1",
              subtitleClass
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
      <span className={cn("w-6 h-6 flex items-center justify-center shrink-0", arrowClass)}>
        <AltArrowDownLinear size={16} />
      </span>
    </button>
  );
}
