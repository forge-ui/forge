import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ============================================================
// Button — Forge UI Kit text button
// variant: primary (solid), secondary (light bg), tertiary (outline)
// color: purple, dark, blue, red, green, yellow, grey, black
// size: lg, md, sm
// Padding: asymmetric when icon present (pl-3.5 pr-4 / pl-4 pr-3.5)
// ============================================================

const buttonVariants = {
  purple: {
    primary: "bg-fg-violet text-white",
    secondary: "bg-fg-violet-100 text-fg-violet",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-violet-300 text-fg-violet",
  },
  dark: {
    primary: "bg-fg-violet-800 text-white",
    secondary: "bg-fg-violet-300 text-fg-violet-800",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-violet-800 text-fg-violet-800",
  },
  blue: {
    primary: "bg-fg-blue text-white",
    secondary: "bg-fg-blue-50 text-fg-blue",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-blue-300 text-fg-blue",
  },
  red: {
    primary: "bg-fg-red text-white",
    secondary: "bg-fg-red-50 text-fg-red",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-red-300 text-fg-red",
  },
  green: {
    primary: "bg-fg-green-500 text-white",
    secondary: "bg-fg-green-50 text-fg-green-500",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-green-300 text-fg-green-500",
  },
  yellow: {
    primary: "bg-fg-yellow text-white",
    secondary: "bg-fg-yellow-50 text-fg-yellow",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-yellow-300 text-fg-yellow",
  },
  grey: {
    primary: "bg-fg-grey-700 text-white",
    secondary: "bg-fg-grey-100 text-fg-grey-700",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700",
  },
  black: {
    primary: "bg-fg-black text-white",
    secondary: "bg-fg-grey-100 text-fg-black",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-grey-500 text-fg-black",
  },
  "blue-dark": {
    primary: "bg-fg-blue-800 text-white",
    secondary: "bg-fg-blue-100 text-fg-blue-800",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-blue-800 text-fg-blue-800",
  },
} as const;

// Figma padding: icon-left → pl-3.5 pr-4, icon-right → pl-4 pr-3.5, no-icon → px-4
const buttonSizes = {
  lg: { base: "py-3.5 text-sm leading-5", noIcon: "px-4", iconLeft: "pl-3.5 pr-4", iconRight: "pl-4 pr-3.5" },
  md: { base: "py-3 text-sm leading-5", noIcon: "px-3.5", iconLeft: "pl-3 pr-3.5", iconRight: "pl-3.5 pr-3" },
  sm: { base: "py-2.5 text-xs leading-4", noIcon: "px-3", iconLeft: "pl-2.5 pr-3", iconRight: "pl-3 pr-2.5" },
} as const;

export type ButtonColor = keyof typeof buttonVariants;
export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = keyof typeof buttonSizes;

export function Button({
  children,
  color = "purple",
  variant = "primary",
  size = "lg",
  disabled = false,
  iconLeft,
  iconRight,
  className = "",
  ...props
}: {
  children?: ReactNode;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">) {
  const sizeConfig = buttonSizes[size];
  const hasIcon = !!(iconLeft || iconRight);
  const paddingClass = iconLeft ? sizeConfig.iconLeft : iconRight ? sizeConfig.iconRight : sizeConfig.noIcon;

  return (
    <button
      disabled={disabled}
      className={cn(
        sizeConfig.base,
        paddingClass,
        buttonVariants[color][variant],
        "rounded-full inline-flex justify-center items-center overflow-hidden font-bold tracking-fg",
        hasIcon ? "gap-1" : "gap-2",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      {...props}
    >
      {iconLeft && <span className="w-5 h-5 flex items-center justify-center">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="w-5 h-5 flex items-center justify-center">{iconRight}</span>}
    </button>
  );
}
