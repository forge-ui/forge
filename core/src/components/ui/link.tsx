import NextLink from "next/link";
import { type ReactNode } from "react";

// ============================================================
// StyledLink - 文字链接
// color: purple, dark, blue, green, red, orange, yellow, cyan, gray
// state: default, disabled
// icon: left, right, none
// ============================================================

// Figma: 每个基色在 hover 下切到深色 token（violet-800 / blue-800 / ...），
// disabled 用 stone-500（fg-grey-700）。这里把 base + hover 拆成两类。
const linkColors = {
  purple: "text-fg-violet hover:text-fg-violet-800",
  dark: "text-fg-violet-800 hover:text-fg-violet-900",
  blue: "text-fg-blue hover:text-fg-blue-800",
  green: "text-fg-green-500 hover:text-fg-green-700",
  red: "text-fg-red hover:text-fg-red-800",
  orange: "text-fg-red hover:text-fg-red-800",
  yellow: "text-fg-yellow hover:text-fg-yellow-700",
  cyan: "text-fg-cyan-500 hover:text-fg-cyan-600",
  gray: "text-fg-grey-700 hover:text-fg-grey-900",
} as const;

export type LinkColor = keyof typeof linkColors;

export function StyledLink({
  children,
  href,
  color = "purple",
  disabled = false,
  iconLeft,
  iconRight,
  className = "",
}: {
  children: ReactNode;
  href: string;
  color?: LinkColor;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}) {
  if (disabled) {
    return (
      <span
        className={`inline-flex items-start gap-1 opacity-60 ${linkColors[color]} text-sm font-bold leading-5 tracking-fg ${className}`}
      >
        {iconLeft && <span className="w-5 h-5 flex items-center justify-center">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="w-5 h-5 flex items-center justify-center">{iconRight}</span>}
      </span>
    );
  }

  return (
    <NextLink
      href={href}
      className={`inline-flex items-start gap-1 ${linkColors[color]} text-sm font-bold leading-5 tracking-fg hover:underline ${className}`}
    >
      {iconLeft && <span className="w-5 h-5 flex items-center justify-center">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="w-5 h-5 flex items-center justify-center">{iconRight}</span>}
    </NextLink>
  );
}
