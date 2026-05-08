import { cn } from "../../../lib/utils";

export interface ChartTooltipItem {
  color: string;
  label?: string;
  value: string;
  trend?: "up" | "down";
}

interface ChartTooltipProps {
  items: ChartTooltipItem[];
  className?: string;
}

export function ChartTooltip({ items, className }: ChartTooltipProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-fg-black px-4 py-3 shadow-lg",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.color)}
            />
            {item.label && (
              <>
                <span className="text-xs leading-4 tracking-fg text-fg-grey-500">{item.label}</span>
                <span className="text-xs leading-4 tracking-fg text-fg-grey-500">:</span>
              </>
            )}
            <span className="text-xs font-bold leading-4 tracking-fg text-white">{item.value}</span>
            {item.trend && (
              <span
                className={cn(
                  "text-xs",
                  item.trend === "up" ? "text-emerald-500" : "text-fg-red"
                )}
              >
                {item.trend === "up" ? "↑" : "↓"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
