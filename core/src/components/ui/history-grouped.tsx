import { type ReactNode } from "react";
import { HistoryItem, type HistoryItemProps, type HistoryItemColor } from "./history-item";

const progressBarColors: Record<HistoryItemColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
  gray: "bg-fg-grey-500",
  black: "bg-fg-black",
};

export function HistoryGrouped({
  title,
  subtitle,
  badge,
  items,
  action,
  progressHeight = "30%",
  color = "purple",
  className = "",
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  items: HistoryItemProps[];
  action?: ReactNode;
  progressHeight?: string;
  color?: HistoryItemColor;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-fg-grey-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold leading-5 text-fg-black">{title}</span>
          {badge}
        </div>
        {action && <div>{action}</div>}
      </div>
      {subtitle && (
        <div className="px-5 pt-3">
          <span className="text-sm text-fg-grey-700">{subtitle}</span>
        </div>
      )}

      {/* Body */}
      <div className="relative p-5">
        {/* Progress bar on the right */}
        <div className="absolute right-5 top-5 bottom-5 w-1 bg-fg-grey-200 rounded-full overflow-hidden">
          <div
            className={`w-full ${progressBarColors[color]} rounded-full`}
            style={{ height: progressHeight }}
          />
        </div>

        {/* Items */}
        <div className="pr-6">
          {items.map((item, index) => (
            <HistoryItem
              key={index}
              {...item}
              color={color}
              showConnector={index < items.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
