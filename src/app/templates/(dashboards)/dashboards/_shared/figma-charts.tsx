"use client";

import type { ReactNode } from "react";
import { ArrowRightUpLinear } from "solar-icon-set";

type Trend = "up" | "down";

type ChartPoint = {
  label: string;
  values: number[];
};

type ChartSeries = {
  label: string;
  colorClass: string;
  value?: string;
  trend?: Trend;
};

type TooltipItem = {
  label: string;
  value: string;
  colorClass: string;
  trend?: Trend;
};

const defaultYAxis = ["$1.2k", "$1k", "$800", "$600", "$400", "$200", "0"];

function maxValue(points: ChartPoint[]) {
  return Math.max(...points.flatMap((point) => point.values), 1);
}

function TrendArrow({ trend }: { trend?: Trend }) {
  if (!trend) return null;
  return (
    <span
      className={
        trend === "up"
          ? "inline-block size-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-fg-green"
          : "inline-block size-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-fg-red"
      }
    />
  );
}

export function FigmaChartHeader({
  title,
  subtitle,
  tabs = ["All", "Income", "Expenses", "Profit"],
  activeTab = "All",
  action,
}: {
  title: string;
  subtitle?: string;
  tabs?: string[];
  activeTab?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-7 text-fg-black">{title}</h3>
        {subtitle && <p className="text-sm leading-5 text-fg-grey-700">{subtitle}</p>}
      </div>
      {action ?? (
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-fg-grey-100 p-1 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={
                tab === activeTab
                  ? "rounded-full bg-white px-4 py-2 font-semibold text-fg-violet shadow-subtle"
                  : "rounded-full px-4 py-2 font-medium text-fg-grey-500"
              }
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FigmaMetricRow({ series }: { series: ChartSeries[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      {series.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className={`flex size-10 items-center justify-center rounded-full text-white ${item.colorClass}`}>
            <ArrowRightUpLinear size={18} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium leading-5 text-fg-grey-500">{item.label}</div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold leading-7 text-fg-black">{item.value}</span>
              {item.trend && (
                <span className={item.trend === "up" ? "text-sm font-bold text-fg-green" : "text-sm font-bold text-fg-red"}>
                  10% <TrendArrow trend={item.trend} />
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FigmaGroupedBarChart({
  data,
  series,
  activeIndex = 6,
  tooltipItems,
  yAxisLabels = defaultYAxis,
  heightClass = "h-[280px]",
}: {
  data: ChartPoint[];
  series: ChartSeries[];
  activeIndex?: number;
  tooltipItems?: TooltipItem[];
  yAxisLabels?: string[];
  heightClass?: string;
}) {
  const max = maxValue(data);

  return (
    <div className={`relative grid grid-cols-[52px_1fr] gap-4 ${heightClass}`}>
      <div className="flex h-full flex-col justify-between py-2 text-xs font-medium text-fg-grey-700">
        {yAxisLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="relative flex h-full items-end gap-3 overflow-hidden pt-8">
        <div className="absolute inset-x-0 top-8 bottom-9 flex flex-col justify-between">
          {yAxisLabels.map((label) => (
            <span key={label} className="border-t border-dashed border-fg-grey-200" />
          ))}
        </div>

        {tooltipItems && (
          <div className="absolute left-1/2 top-3 z-20 min-w-40 -translate-x-1/2 rounded-xl bg-fg-black px-4 py-3 text-white shadow-elevated">
            <div className="flex flex-col gap-2">
              {tooltipItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 text-white/70">
                    <span className={`size-2.5 rounded-full ${item.colorClass}`} />
                    {item.label}
                  </span>
                  <span className="font-semibold">
                    {item.value} <TrendArrow trend={item.trend} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.map((point, pointIndex) => (
          <div key={point.label} className="relative z-10 flex h-full flex-1 flex-col justify-end gap-3">
            {pointIndex === activeIndex && (
              <span className="absolute inset-y-8 left-1/2 w-12 -translate-x-1/2 bg-fg-violet-50" />
            )}
            <div className="relative z-10 flex h-[calc(100%-34px)] items-end justify-center gap-2">
              {point.values.map((value, seriesIndex) => (
                <span
                  key={`${point.label}-${series[seriesIndex]?.label ?? seriesIndex}`}
                  className={`w-3 rounded-full ${series[seriesIndex]?.colorClass ?? "bg-fg-violet"}`}
                  style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
                />
              ))}
            </div>
            <div className={pointIndex === activeIndex ? "relative z-10 text-center text-sm font-semibold text-fg-violet" : "relative z-10 text-center text-sm font-medium text-fg-grey-700"}>
              {point.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FigmaUpsideDownBarChart({
  data,
  upperColor = "bg-fg-blue",
  lowerColor = "bg-fg-red",
  activeIndex = 6,
  tooltipUpperValue = "$680",
  tooltipLowerValue = "$280",
  heightClass = "h-[280px]",
}: {
  data: { label: string; upperValue: number; lowerValue: number }[];
  upperColor?: string;
  lowerColor?: string;
  activeIndex?: number;
  tooltipUpperValue?: string;
  tooltipLowerValue?: string;
  heightClass?: string;
}) {
  const max = Math.max(...data.flatMap((item) => [item.upperValue, item.lowerValue]), 1);

  return (
    <div className={`relative flex items-center gap-3 overflow-hidden ${heightClass}`}>
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-fg-grey-200" />
      <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className="border-t border-dashed border-fg-grey-100" />
        ))}
      </div>
      <div className="absolute left-1/2 top-8 z-20 min-w-36 -translate-x-1/2 rounded-xl bg-fg-black px-4 py-3 text-white shadow-elevated">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-white/70"><span className={`size-2.5 rounded-full ${upperColor}`} />Income</span>
          <span className="font-semibold">{tooltipUpperValue}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-white/70"><span className={`size-2.5 rounded-full ${lowerColor}`} />Expenses</span>
          <span className="font-semibold">{tooltipLowerValue}</span>
        </div>
      </div>
      {data.map((item, index) => (
        <div key={item.label} className="relative z-10 flex h-full flex-1 flex-col items-center justify-center">
          {index === activeIndex && <span className="absolute inset-y-6 w-12 bg-fg-violet-50" />}
          <span className={`relative z-10 mb-1 w-3 rounded-full ${upperColor}`} style={{ height: `${Math.max(8, (item.upperValue / max) * 42)}%` }} />
          <span className={`relative z-10 mt-1 w-3 rounded-full ${lowerColor}`} style={{ height: `${Math.max(8, (item.lowerValue / max) * 42)}%` }} />
          <span className={index === activeIndex ? "absolute bottom-0 text-sm font-semibold text-fg-violet" : "absolute bottom-0 text-sm font-medium text-fg-grey-700"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
