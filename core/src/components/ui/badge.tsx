import { type ReactNode } from "react";

// ============================================================
// NotificationBadge - 圆形数字徽章 (如 "99+")
// ============================================================
const notificationColors = {
  purple: "bg-fg-violet",
  orange: "bg-fg-red",
  green: "bg-fg-green-500",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
  black: "bg-fg-black",
} as const;

export type NotificationBadgeColor = keyof typeof notificationColors;

export function NotificationBadge({
  children,
  color = "purple",
}: {
  children: ReactNode;
  color?: NotificationBadgeColor;
}) {
  return (
    <span
      className={`px-1.5 py-0.5 ${notificationColors[color]} rounded-full inline-flex flex-col justify-center items-center gap-2`}
    >
      <span className="text-white text-2xs font-semibold leading-4 tracking-fg">
        {children}
      </span>
    </span>
  );
}

// ============================================================
// Label - 标签徽章 (文字标签，支持 outline/solid)
// ============================================================
const labelSizes = {
  lg: "px-3 py-1.5 text-sm leading-5",
  md: "px-2.5 py-1 text-sm leading-5",
  sm: "px-2 py-1 text-xs leading-4",
} as const;

const labelColors = {
  purple: {
    outline: "bg-fg-violet-100 outline outline-1 outline-offset-[-1px] outline-fg-violet-300 text-fg-violet",
    solid: "bg-fg-violet text-white",
  },
  blue: {
    outline: "bg-fg-blue-50 outline outline-1 outline-offset-[-1px] outline-fg-blue-200 text-fg-blue",
    solid: "bg-fg-blue text-white",
  },
  cyan: {
    outline: "bg-fg-cyan-50 outline outline-1 outline-offset-[-1px] outline-fg-cyan-100 text-fg-cyan-500",
    solid: "bg-fg-cyan-500 text-white",
  },
  green: {
    outline: "bg-fg-green-50 outline outline-1 outline-offset-[-1px] outline-fg-green-200 text-fg-green-500",
    solid: "bg-fg-green-500 text-white",
  },
  red: {
    outline: "bg-fg-red-100 outline outline-1 outline-offset-[-1px] outline-fg-red-200 text-fg-red",
    solid: "bg-fg-red text-white",
  },
  yellow: {
    outline: "bg-fg-yellow-50 outline outline-1 outline-offset-[-1px] outline-fg-red-200 text-fg-yellow",
    solid: "bg-fg-yellow text-white",
  },
  gray: {
    outline: "bg-fg-grey-50 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700",
    solid: "bg-fg-grey-700 text-white",
  },
} as const;

export type LabelColor = keyof typeof labelColors;
export type LabelSize = keyof typeof labelSizes;
export type LabelVariant = "outline" | "solid";

export function Label({
  children,
  color = "purple",
  size = "md",
  variant = "outline",
}: {
  children: ReactNode;
  color?: LabelColor;
  size?: LabelSize;
  variant?: LabelVariant;
}) {
  return (
    <span
      className={`${labelSizes[size]} ${labelColors[color][variant]} rounded-full inline-flex flex-col justify-center items-center gap-2`}
    >
      <span className="font-semibold tracking-fg">{children}</span>
    </span>
  );
}

// ============================================================
// CircleIcon - 圆形图标容器
// ============================================================
const circleIconSizes = {
  lg: "w-12 h-12 p-3",
  md: "w-9 h-9 p-2",
  sm: "w-8 h-8 p-1.5",
  xs: "w-6 h-6 p-1",
} as const;

const circleIconVariants = {
  solid: {
    purple: { bg: "bg-fg-violet", icon: "text-white" },
    blue: { bg: "bg-fg-blue", icon: "text-white" },
    red: { bg: "bg-fg-red", icon: "text-white" },
    orange: { bg: "bg-fg-red", icon: "text-white" },
    green: { bg: "bg-fg-green-500", icon: "text-white" },
    yellow: { bg: "bg-fg-yellow", icon: "text-white" },
    cyan: { bg: "bg-fg-cyan-500", icon: "text-white" },
    black: { bg: "bg-fg-black", icon: "text-white" },
  },
  light: {
    purple: { bg: "bg-fg-violet-100", icon: "text-fg-violet" },
    blue: { bg: "bg-fg-blue-50", icon: "text-fg-blue" },
    red: { bg: "bg-fg-red-100", icon: "text-fg-red" },
    orange: { bg: "bg-fg-red-100", icon: "text-fg-red" },
    green: { bg: "bg-fg-green-50", icon: "text-fg-green-500" },
    yellow: { bg: "bg-fg-yellow-50", icon: "text-fg-yellow" },
    cyan: { bg: "bg-fg-cyan-50", icon: "text-fg-cyan-500" },
    black: { bg: "bg-fg-grey-100", icon: "text-fg-black" },
  },
  neutral: {
    purple: { bg: "bg-fg-grey-50", icon: "text-fg-violet" },
    blue: { bg: "bg-fg-grey-50", icon: "text-fg-blue" },
    red: { bg: "bg-fg-grey-50", icon: "text-fg-red" },
    orange: { bg: "bg-fg-grey-50", icon: "text-fg-red" },
    green: { bg: "bg-fg-grey-50", icon: "text-fg-green-500" },
    yellow: { bg: "bg-fg-grey-50", icon: "text-fg-yellow" },
    cyan: { bg: "bg-fg-grey-50", icon: "text-fg-cyan-500" },
    black: { bg: "bg-fg-grey-50", icon: "text-fg-black" },
  },
} as const;

export type CircleIconColor = keyof typeof circleIconVariants.solid;
export type CircleIconSize = keyof typeof circleIconSizes;
export type CircleIconVariant = keyof typeof circleIconVariants;

export function CircleIcon({
  children,
  color = "purple",
  size = "md",
  variant = "solid",
}: {
  children: ReactNode;
  color?: CircleIconColor;
  size?: CircleIconSize;
  variant?: CircleIconVariant;
}) {
  const { bg, icon } = circleIconVariants[variant][color];
  return (
    <div
      className={`${circleIconSizes[size]} ${bg} rounded-full inline-flex justify-center items-center gap-2 overflow-hidden ${icon}`}
    >
      {children}
    </div>
  );
}

// ============================================================
// ArtisticIcon - 带渐变/发光装饰的圆形图标容器 (Figma Artistic)
// 固定 w-12 尺寸，两种装饰变体：gradient (双向对角渐变) / orbs (双色发光球)
// ============================================================
const artisticShells = {
  black: "bg-fg-black",
  blue: "bg-fg-blue",
  purple: "bg-fg-violet",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
} as const;

const artisticGradients = {
  black: {
    topRight: "bg-gradient-to-b from-fg-cyan-500/25 to-fg-cyan-500/0",
    bottomLeft: "bg-gradient-to-b from-fg-cyan-500/0 to-fg-cyan-500",
  },
  blue: {
    topRight: "bg-gradient-to-b from-fg-green-500/50 to-fg-green-500/0",
    bottomLeft: "bg-gradient-to-b from-fg-green-500/0 to-fg-green-500",
  },
  purple: {
    topRight: "bg-gradient-to-b from-fg-yellow/30 to-fg-yellow/0",
    bottomLeft: "bg-gradient-to-b from-fg-yellow/0 to-fg-yellow",
  },
  green: {
    topRight: "bg-gradient-to-b from-fg-yellow/75 to-fg-yellow/0",
    bottomLeft: "bg-gradient-to-b from-fg-yellow/0 to-fg-yellow",
  },
  red: {
    topRight: "bg-gradient-to-b from-fg-yellow/50 to-fg-yellow/0",
    bottomLeft: "bg-gradient-to-b from-fg-yellow/0 to-fg-yellow",
  },
  yellow: {
    topRight: "bg-gradient-to-b from-fg-cyan-500/50 to-fg-cyan-500/0",
    bottomLeft: "bg-gradient-to-b from-fg-cyan-500/0 to-fg-cyan-500",
  },
  cyan: {
    topRight: "bg-gradient-to-b from-fg-violet/25 to-fg-violet/0",
    bottomLeft: "bg-gradient-to-b from-fg-violet/0 to-fg-violet/75",
  },
} as const;

const artisticOrbs = {
  black: { big: "bg-fg-green-500", small: "bg-fg-yellow", bigBlur: "blur-md", smallBlur: "blur-md" },
  blue: { big: "bg-fg-yellow", small: "bg-fg-cyan-500", bigBlur: "blur-md", smallBlur: "blur-md" },
  purple: { big: "bg-fg-cyan-500", small: "bg-fg-yellow", bigBlur: "blur-md", smallBlur: "blur-md" },
  green: { big: "bg-fg-yellow", small: "bg-white", bigBlur: "blur", smallBlur: "blur-[10px]" },
  red: { big: "bg-fg-yellow", small: "bg-white", bigBlur: "blur", smallBlur: "blur-[10px]" },
  yellow: { big: "bg-fg-red", small: "bg-white", bigBlur: "blur", smallBlur: "blur-[10px]" },
  cyan: { big: "bg-fg-violet", small: "bg-fg-yellow", bigBlur: "blur-[10px]", smallBlur: "blur-[10px]" },
} as const;

export type ArtisticIconColor = keyof typeof artisticShells;
export type ArtisticIconVariant = "gradient" | "orbs";

export function ArtisticIcon({
  children,
  color = "purple",
  variant = "gradient",
}: {
  children: ReactNode;
  color?: ArtisticIconColor;
  variant?: ArtisticIconVariant;
}) {
  return (
    <div
      className={`relative w-12 h-12 p-2 ${artisticShells[color]} rounded-full inline-flex justify-center items-center overflow-hidden text-white`}
    >
      {variant === "gradient" ? (
        <>
          <div
            className={`absolute w-10 h-10 left-[20px] top-[-12px] ${artisticGradients[color].topRight} rounded-full`}
          />
          <div
            className={`absolute w-10 h-10 left-[-12px] top-[20px] ${artisticGradients[color].bottomLeft} rounded-full`}
          />
        </>
      ) : (
        <>
          <div
            className={`absolute w-8 h-8 left-[7px] top-[7px] opacity-50 ${artisticOrbs[color].big} rounded-full ${artisticOrbs[color].bigBlur}`}
          />
          <div
            className={`absolute w-4 h-4 left-[5px] top-[27px] ${artisticOrbs[color].small} rounded-full ${artisticOrbs[color].smallBlur}`}
          />
        </>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
