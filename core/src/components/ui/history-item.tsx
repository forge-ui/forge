/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";

export type HistoryItemVariant = "regular" | "badge" | "profile";
export type HistoryItemShowDatetime = "inline" | "bottom";

// Regular dot (filled + light ring) + Badge icon container (light bg + solid icon color)
const historyItemColors = {
  purple: {
    dot: "bg-fg-violet",
    ring: "border-fg-violet-100",
    badgeBg: "bg-fg-violet-100",
    badgeIcon: "text-fg-violet",
  },
  blue: {
    dot: "bg-fg-blue",
    ring: "border-fg-blue-50",
    badgeBg: "bg-fg-blue-50",
    badgeIcon: "text-fg-blue",
  },
  green: {
    dot: "bg-fg-green-500",
    ring: "border-fg-green-50",
    badgeBg: "bg-fg-green-50",
    badgeIcon: "text-fg-green-500",
  },
  red: {
    dot: "bg-fg-red",
    ring: "border-fg-red-100",
    badgeBg: "bg-fg-red-100",
    badgeIcon: "text-fg-red",
  },
  yellow: {
    dot: "bg-fg-yellow",
    ring: "border-fg-yellow-50",
    badgeBg: "bg-fg-yellow-50",
    badgeIcon: "text-fg-yellow",
  },
  cyan: {
    dot: "bg-fg-cyan-500",
    ring: "border-fg-cyan-50",
    badgeBg: "bg-fg-cyan-50",
    badgeIcon: "text-fg-cyan-500",
  },
  gray: {
    dot: "bg-fg-grey-500",
    ring: "border-fg-grey-100",
    badgeBg: "bg-fg-grey-100",
    badgeIcon: "text-fg-grey-700",
  },
  black: {
    dot: "bg-fg-black",
    ring: "border-fg-grey-100",
    badgeBg: "bg-fg-grey-100",
    badgeIcon: "text-fg-black",
  },
} as const;

export type HistoryItemColor = keyof typeof historyItemColors;

export interface HistoryItemProps {
  variant?: HistoryItemVariant;
  color?: HistoryItemColor;
  title: string;
  description?: ReactNode;
  datetime?: string;
  showDatetime?: HistoryItemShowDatetime;
  tags?: ReactNode;
  icon?: ReactNode;
  avatar?: string;
  showConnector?: boolean;
  className?: string;
}

function Indicator({
  variant,
  color,
  icon,
  avatar,
}: {
  variant: HistoryItemVariant;
  color: HistoryItemColor;
  icon?: ReactNode;
  avatar?: string;
}) {
  if (variant === "profile") {
    return (
      <img
        src={avatar}
        alt=""
        className="w-10 h-10 rounded-full border-2 border-white object-cover shrink-0"
      />
    );
  }

  const palette = historyItemColors[color];

  if (variant === "badge") {
    return (
      <div
        className={`w-10 h-10 p-2 ${palette.badgeBg} ${palette.badgeIcon} rounded-full inline-flex justify-center items-center shrink-0`}
      >
        {icon}
      </div>
    );
  }

  return (
    <div
      className={`w-6 h-6 ${palette.dot} rounded-full border-4 ${palette.ring} shrink-0`}
    />
  );
}

export function HistoryItem({
  variant = "regular",
  color = "purple",
  title,
  description,
  datetime,
  showDatetime = "inline",
  tags,
  icon,
  avatar,
  showConnector = true,
  className = "",
}: HistoryItemProps) {
  return (
    <div className={`w-full flex items-stretch gap-2 ${className}`}>
      {/* Left column: indicator + connector */}
      <div className="flex flex-col items-center">
        <Indicator variant={variant} color={color} icon={icon} avatar={avatar} />
        {showConnector && (
          <div className="w-px flex-1 bg-fg-grey-200" />
        )}
      </div>

      {/* Right column: content */}
      <div className="flex-1 pb-4 inline-flex flex-col justify-start items-start gap-2">
        {/* Title row */}
        <div className="self-stretch inline-flex justify-start items-center gap-2">
          <div className="flex-1 text-fg-black text-sm font-semibold leading-5 tracking-fg">{title}</div>
          {datetime && showDatetime === "inline" && (
            <div className="text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">{datetime}</div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="self-stretch text-sm font-normal leading-5 tracking-fg">{description}</div>
        )}

        {/* Tags */}
        {tags && (
          <div className="inline-flex justify-start items-center gap-2">{tags}</div>
        )}

        {/* Bottom datetime */}
        {datetime && showDatetime === "bottom" && (
          <div className="self-stretch text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">{datetime}</div>
        )}
      </div>
    </div>
  );
}
