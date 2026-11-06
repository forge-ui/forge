import { ArrowRightUpLinear, ArrowRightDownLinear } from "@forge-ui-official/core/icons";
import type { ReactNode } from "react";
import { Panel, StatCard, cn, type StatCardProps } from "@forge-ui-official/core";

export interface KpiMetricsProps {
  metrics?: (StatCardProps & { id: string })[];
  children?: ReactNode;
  className?: string;
}

export function KpiMetrics({ metrics = [], children, className = "grid grid-cols-1 items-stretch gap-4 lg:grid-cols-4 [&>*]:w-full" }: KpiMetricsProps) {
  return <div className={cn(className)}>{children ?? metrics.map(({ id, ...metric }) => <StatCard key={id} {...metric} density="compact" />)}</div>;
}

function MiniFinanceLine({
  color,
  direction,
}: {
  color: "purple" | "red";
  direction: "up" | "down";
}) {
  const stroke = color === "purple" ? "var(--fg-violet)" : "var(--fg-red)";
  const points =
    direction === "up"
      ? "M2 50 C18 34 24 70 42 49 C55 32 60 53 74 45 C88 38 94 44 106 48 C121 54 126 32 138 18"
      : "M2 18 C16 36 24 20 39 36 C52 50 58 58 73 55 C88 52 91 42 105 54 C119 66 128 60 138 58";

  return (
    <svg viewBox="0 0 140 76" className="h-14 w-36" aria-hidden="true">
      <defs>
        <linearGradient id={`finance-2-${color}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${points} L138 76 L2 76 Z`} fill={`url(#finance-2-${color}-fade)`} />
      <path d={points} fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function FinanceMetricCard({
  title,
  value,
  color,
  direction,
}: {
  title: string;
  value: string;
  color: "purple" | "red";
  direction: "up" | "down";
}) {
  const iconClass = color === "purple" ? "bg-fg-grey-100 text-fg-violet" : "bg-fg-grey-100 text-fg-red";

  return (
    <Panel gap="sm" className="min-h-44 justify-between">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold leading-5 text-fg-black">{title}</h3>
          <p className="mt-1 text-xs font-medium text-fg-grey-700">2 Jul - Today</p>
        </div>
        <span className={`flex size-9 items-center justify-center rounded-full ${iconClass}`}>
          {direction === "up" ? <ArrowRightUpLinear size={18} /> : <ArrowRightDownLinear size={18} />}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold leading-8 text-fg-black">{value}</div>
          <div className="mt-1 flex items-center gap-1 text-sm font-bold text-fg-green">
            10%
            <span className="inline-block size-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-fg-green" />
            <span className="font-medium text-fg-grey-700">+$150 today</span>
          </div>
        </div>
        <MiniFinanceLine color={color} direction={direction} />
      </div>
    </Panel>
  );
}
