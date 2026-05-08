import { type ComponentType } from "react";
import { cn } from "../../../lib/utils";
import { TrendText } from "./chart-utils";
import { accentColors, type AccentColor } from "../accent-utils";

type IconComponent = ComponentType<{ size?: number; color?: string }>;

interface ChartListItemProps {
  /** Solar icon component reference (e.g. `WalletLinear`). Accent drives its color + bg. */
  icon?: IconComponent;
  accent?: AccentColor;
  title: string;
  subtitle?: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export function ChartListItem({
  icon: Icon,
  accent = "purple",
  title,
  subtitle,
  value,
  trend,
  trendDirection,
}: ChartListItemProps) {
  const theme = accentColors[accent];
  return (
    <div className="self-stretch inline-flex justify-start items-center gap-2">
      <div className="flex-1 flex justify-start items-center gap-2">
        {Icon && (
          <div
            className={cn(
              "w-11 h-11 p-2 rounded-full flex items-center justify-center shrink-0",
              theme.bgTint
            )}
          >
            <Icon size={20} color={theme.hex} />
          </div>
        )}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg line-clamp-1">
            {title}
          </span>
          {subtitle && (
            <span className="text-fg-grey-700 text-xs font-medium leading-4 tracking-fg">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg">
          {value}
        </span>
        {trend && <TrendText trend={trend} trendDirection={trendDirection} size="xs" />}
      </div>
    </div>
  );
}
