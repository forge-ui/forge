import type { ReactNode } from "react";
import { DescriptionItem, LineChartStatCard, SurfaceCard } from "@forge-ui-official/core";

export function CrmSurface({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const padding = className.includes("p-0") ? "none" : "sm";
  const shellClassName = className.replace(/\bp-0\b/g, "").trim();

  return (
    <SurfaceCard title={title} subtitle={subtitle} action={action} padding={padding} className={shellClassName}>
      {children}
    </SurfaceCard>
  );
}

export function CrmStat({
  title,
  value,
  tone = "purple",
  bars,
}: {
  title: string;
  value: string;
  tone?: "purple" | "green" | "blue";
  bars: number[];
}) {
  return (
    <LineChartStatCard
      title={title}
      value={value}
      trend="10%"
      subtitle="+150 today"
      theme={tone === "purple" ? "purple" : "white"}
      chartColor={tone === "purple" ? "purple" : tone}
      series={bars}
      width="full"
    />
  );
}

export function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <DescriptionItem
      label={label}
      content={<span className="text-sm font-semibold text-fg-grey-900">{value}</span>}
      className="border-b border-fg-grey-100 py-3 last:border-b-0"
    />
  );
}

export function CrmMetricCard({
  title,
  date,
  value,
  trend,
  trendDirection = "up",
  note,
  icon,
  iconClassName,
  footer,
}: {
  title: string;
  date: string;
  value: string;
  trend: string;
  trendDirection?: "up" | "down";
  note: string;
  icon: ReactNode;
  iconClassName: string;
  footer: ReactNode;
}) {
  return (
    <div className="flex h-52 min-w-0 flex-col justify-between overflow-hidden rounded-[20px] bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="truncate text-lg font-semibold leading-7 tracking-fg text-fg-black">{title}</p>
          <p className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{date}</p>
        </div>
        <div className={`grid size-10 shrink-0 place-items-center rounded-full ${iconClassName}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className="flex min-w-36 flex-1 flex-col gap-3">
          <p className="text-2xl font-semibold tracking-fg text-fg-black">{value}</p>
          <div className="flex items-center gap-1 text-sm leading-5 tracking-fg">
            <span className={trendDirection === "down" ? "font-bold text-fg-red" : "font-bold text-fg-green-500"}>
              {trend}
            </span>
            <span className={trendDirection === "down" ? "text-fg-red" : "text-fg-green-500"}>
              {trendDirection === "down" ? "v" : "^"}
            </span>
            <span className="font-medium text-fg-grey-700">{note}</span>
          </div>
        </div>
        <div className="flex min-w-20 flex-1 items-end justify-end overflow-hidden">
          {footer}
        </div>
      </div>
    </div>
  );
}
