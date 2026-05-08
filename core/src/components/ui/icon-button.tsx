import { type ButtonHTMLAttributes, type ReactNode } from "react";

// ============================================================
// IconButton - 图标按钮 (仅图标，无文字)
// variant: primary (实色) / secondary (浅色) / tertiary (描边) / ghost (透明 + 灰 icon + hover 浅灰)
// shape:   circle (rounded-full, 默认) / square (rounded-md, 用于表格 actions 列)
// color:   purple / dark / blue / red / green / yellow / grey / black / blue-dark
// size:    lg / md / sm
// ============================================================

const iconButtonVariants = {
  purple: {
    primary: "bg-fg-violet text-white",
    secondary: "bg-purple-100 text-fg-violet",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-purple-300 text-fg-violet",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  dark: {
    primary: "bg-violet-800 text-white",
    secondary: "bg-purple-300 text-violet-800",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-violet-800 text-violet-800",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  blue: {
    primary: "bg-blue-600 text-white",
    secondary: "bg-indigo-50 text-blue-600",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-blue-300 text-blue-600",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  red: {
    primary: "bg-fg-red text-white",
    secondary: "bg-rose-50 text-fg-red",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-red-300 text-fg-red",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  green: {
    primary: "bg-emerald-500 text-white",
    secondary: "bg-emerald-50 text-emerald-500",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-emerald-300 text-emerald-500",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  yellow: {
    primary: "bg-fg-yellow text-white",
    secondary: "bg-yellow-50 text-fg-yellow",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-yellow-300 text-fg-yellow",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  grey: {
    primary: "bg-fg-grey-700 text-white",
    secondary: "bg-fg-grey-100 text-fg-grey-700",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  black: {
    primary: "bg-fg-black text-white",
    secondary: "bg-fg-grey-100 text-fg-black",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-fg-grey-500 text-fg-black",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
  "blue-dark": {
    primary: "bg-blue-800 text-white",
    secondary: "bg-indigo-200 text-blue-800",
    tertiary: "outline outline-1 outline-offset-[-1px] outline-blue-800 text-blue-800",
    ghost: "bg-transparent text-fg-grey-700 hover:bg-fg-grey-100",
  },
} as const;

const iconButtonSizes = {
  lg: "p-3.5",
  md: "p-2.5",
  sm: "w-8 h-8 p-1.5",
} as const;

const iconButtonShapes = {
  circle: "rounded-full",
  square: "rounded-md",
} as const;

export type IconButtonColor = keyof typeof iconButtonVariants;
export type IconButtonVariant = "primary" | "secondary" | "tertiary" | "ghost";
export type IconButtonSize = keyof typeof iconButtonSizes;
export type IconButtonShape = keyof typeof iconButtonShapes;

export function IconButton({
  children,
  color = "purple",
  variant = "primary",
  size = "md",
  shape = "circle",
  disabled = false,
  className = "",
  ...props
}: {
  children: ReactNode;
  color?: IconButtonColor;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">) {
  return (
    <button
      disabled={disabled}
      className={`${iconButtonSizes[size]} ${iconButtonVariants[color][variant]} ${iconButtonShapes[shape]} inline-flex justify-center items-center gap-1 overflow-hidden transition-colors ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      {...props}
    >
      <span className="w-5 h-5 flex items-center justify-center">{children}</span>
    </button>
  );
}
