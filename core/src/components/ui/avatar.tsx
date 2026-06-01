/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";

// ============================================================
// Avatar - 头像
// type: image, initials
// size: xl, lg, md, sm, xs
// ============================================================

const avatarSizes = {
  "2xl": "w-28 h-28 text-3xl",
  xl: "w-20 h-20 text-xl",
  lg: "w-12 h-12 text-base",
  md: "w-10 h-10 text-sm",
  sm: "w-8 h-8 text-xs",
  xs: "w-6 h-6 text-2xs",
} as const;

const avatarInitialColors = {
  purple: { bg: "bg-purple-100", text: "text-fg-violet" },
  blue: { bg: "bg-indigo-50", text: "text-blue-600" },
  green: { bg: "bg-emerald-50", text: "text-emerald-500" },
  orange: { bg: "bg-orange-100", text: "text-fg-red" },
  yellow: { bg: "bg-fg-yellow-50", text: "text-fg-yellow" },
  cyan: { bg: "bg-teal-50", text: "text-teal-400" },
} as const;

export type AvatarSize = keyof typeof avatarSizes;
export type AvatarInitialColor = keyof typeof avatarInitialColors;

// Online status dot — sized relative to avatar
const onlineDotSizes: Record<AvatarSize, string> = {
  "2xl": "w-5 h-5 border-[3px]",
  xl: "w-4 h-4 border-[3px]",
  lg: "w-3 h-3 border-2",
  md: "w-2.5 h-2.5 border-2",
  sm: "w-2 h-2 border",
  xs: "w-1.5 h-1.5 border",
} as const;

export function Avatar({
  src,
  initials,
  size = "md",
  color = "purple",
  alt = "",
  online = false,
}: {
  src?: string;
  initials?: string;
  size?: AvatarSize;
  color?: AvatarInitialColor;
  alt?: string;
  online?: boolean;
}) {
  const avatarInner = src ? (
    <img
      src={src}
      alt={alt}
      className={`${avatarSizes[size]} rounded-full object-cover`}
    />
  ) : (
    (() => {
      const { bg, text } = avatarInitialColors[color];
      return (
        <div
          className={`${avatarSizes[size]} ${bg} rounded-full inline-flex justify-center items-center overflow-hidden`}
        >
          <span className={`${text} font-semibold leading-8 tracking-fg`}>
            {initials}
          </span>
        </div>
      );
    })()
  );

  if (!online) return avatarInner;

  return (
    <span className="relative inline-flex">
      {avatarInner}
      <span
        className={`${onlineDotSizes[size]} absolute bottom-0 right-0 rounded-full bg-emerald-500 border-white`}
      />
    </span>
  );
}

// ============================================================
// AvatarGroup - 头像组 (堆叠)
// ============================================================

export function AvatarGroup({
  children,
  overflowCount,
}: {
  children: ReactNode;
  overflowCount?: number;
}) {
  const showOverflow = typeof overflowCount === "number" && overflowCount > 0;

  return (
    <div className="flex justify-center items-center">
      <div className="flex -space-x-2">{children}</div>
      {showOverflow && (
        <div className="w-8 h-8 p-1 bg-purple-100 rounded-full flex justify-center items-center overflow-hidden -ml-2 border-2 border-white">
          <span className="text-fg-violet text-xs font-semibold leading-4.5 tracking-fg">
            +{overflowCount}
          </span>
        </div>
      )}
    </div>
  );
}
