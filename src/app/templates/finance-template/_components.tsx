import type { ReactNode } from "react";
import { DescriptionItem, SurfaceCard, ToolbarKebabButton } from "@forge-ui-official/core";

export function FinanceSurface({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const padding = className.includes("p-0") ? "none" : "sm";
  const shellClassName = className.replace(/\bp-0\b/g, "").trim();

  return (
    <SurfaceCard title={title} subtitle={eyebrow} action={action} padding={padding} className={shellClassName}>
      {children}
    </SurfaceCard>
  );
}

export function FieldLine({ label, value }: { label: string; value: string }) {
  return (
    <DescriptionItem
      label={label}
      content={<span className="text-sm font-semibold leading-5 tracking-fg text-fg-grey-900">{value}</span>}
      className="border-b border-fg-grey-100 py-3 last:border-b-0"
    />
  );
}

export function VisualCard({
  theme,
  name,
  type,
  last4,
  balance,
}: {
  theme: "purple" | "blue" | "yellow" | "dark";
  name: string;
  type: string;
  last4: string;
  balance: string;
}) {
  const themeClass = {
    purple: "bg-fg-blue-500 text-white",
    blue: "bg-fg-blue-700 text-white",
    yellow: "bg-fg-yellow text-fg-black",
    dark: "bg-fg-black text-white",
  }[theme];
  const dimTextClass = theme === "yellow" ? "text-fg-black/55" : "text-white/60";
  const numberTextClass = theme === "yellow" ? "text-fg-black" : "text-white";

  return (
    <div className={`relative min-h-[180px] overflow-hidden rounded-[20px] p-5 ${themeClass}`}>
      <div className="absolute right-10 top-[-44px] size-36 rounded-full border-[34px] border-white/18" />
      <div className="absolute bottom-[-58px] right-8 size-36 rounded-full border-[34px] border-fg-green-500/55" />
      <div className="relative flex h-full min-h-[140px] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-sm font-medium tracking-fg ${dimTextClass}`}>Number</p>
            <p className={`mt-2 text-xl font-semibold tracking-fg ${numberTextClass}`}>**** **** **** {last4}</p>
          </div>
          <div className="flex items-center">
            <span className="block size-5 rounded-full bg-fg-red" />
            <span className="-ml-2 block size-5 rounded-full bg-fg-yellow/90" />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={`text-sm font-medium tracking-fg ${dimTextClass}`}>Name</p>
            <p className={`mt-2 text-base font-semibold tracking-fg ${numberTextClass}`}>{name}</p>
          </div>
          <p className={`text-base font-semibold tracking-fg ${numberTextClass}`}>07/25</p>
        </div>
      </div>
    </div>
  );
}

export function FinanceMetricCard({
  title,
  value,
  trend,
  note,
  chartColor = "blue",
}: {
  title: string;
  value: string;
  trend: string;
  note: string;
  chartColor?: "blue" | "green" | "red";
}) {
  const colorClass = {
    blue: "text-fg-blue-500",
    green: "text-fg-green-500",
    red: "text-fg-red",
  }[chartColor];
  const lineStroke = {
    blue: "var(--fg-blue-500)",
    green: "var(--fg-green-500)",
    red: "var(--fg-red)",
  }[chartColor];

  return (
    <div className="relative min-h-[196px] overflow-hidden rounded-[20px] border border-fg-grey-200 bg-white p-5">
      <div className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full bg-fg-grey-50">
        <span className={`block size-4 rounded-[5px] ${chartColor === "blue" ? "bg-fg-blue-500" : chartColor === "green" ? "bg-fg-green-500" : "bg-fg-red"}`} />
      </div>
      <div className="relative flex h-full min-h-[154px] items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-fg text-fg-black">{title}</p>
          <p className="mt-2 text-sm font-medium text-fg-grey-500">2 Jul - Today</p>
          <p className="mt-10 text-3xl font-semibold tracking-fg text-fg-black">{value}</p>
          <p className={`mt-3 text-sm font-semibold ${colorClass}`}>
            {trend} <span className="font-medium text-fg-grey-500">{note}</span>
          </p>
        </div>
        <svg className="mb-5 h-14 w-32 shrink-0" viewBox="0 0 144 64" fill="none" aria-hidden="true">
          <path d="M4 24C17 36 25 20 36 34C47 48 58 42 68 40C78 38 88 30 99 33C110 36 118 23 140 20" stroke={lineStroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 62H140V22C118 25 110 38 99 35C88 32 78 40 68 42C58 44 47 50 36 36C25 22 17 38 4 26V62Z" fill={lineStroke} opacity="0.08" />
        </svg>
      </div>
    </div>
  );
}

export function WalletProgressLine({
  value,
  color,
}: {
  value: number;
  color: "purple" | "green" | "blue" | "yellow" | "red" | "cyan";
}) {
  const classes = {
    purple: "bg-fg-violet text-fg-violet",
    green: "bg-fg-green-500 text-fg-green-500",
    blue: "bg-fg-blue-500 text-fg-blue-500",
    yellow: "bg-fg-yellow text-fg-yellow",
    red: "bg-fg-red text-fg-red",
    cyan: "bg-fg-cyan-500 text-fg-cyan-500",
  }[color];

  return (
    <div className="min-w-[220px]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-fg-grey-500">Progress</span>
        <span className={`text-sm font-semibold ${classes.split(" ")[1]}`}>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-fg-grey-100">
        <div className={`h-full rounded-full ${classes.split(" ")[0]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function FinanceGoalCell({
  title,
  subtitle = "Lorem ipsum dolor sit am...",
  color,
}: {
  title: string;
  subtitle?: string;
  color: "purple" | "green" | "blue" | "yellow" | "red" | "cyan";
}) {
  const bg = {
    purple: "bg-fg-violet-100 text-fg-violet",
    green: "bg-fg-green-100 text-fg-green-500",
    blue: "bg-fg-blue-50 text-fg-blue-500",
    yellow: "bg-fg-yellow/20 text-fg-yellow",
    red: "bg-fg-red-100 text-fg-red",
    cyan: "bg-fg-cyan-50 text-fg-cyan-500",
  }[color];

  return (
    <div className="flex items-center gap-3">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${bg}`}>
        <span className="size-3 rounded-[4px] bg-current" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-5 text-fg-black">{title}</p>
        <p className="truncate text-xs font-medium leading-4.5 text-fg-grey-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function FinanceTransactionCell({
  title,
  subtitle,
  color,
}: {
  title: string;
  subtitle: string;
  color: "purple" | "green" | "blue" | "yellow" | "red" | "cyan";
}) {
  return <FinanceGoalCell title={title} subtitle={subtitle} color={color} />;
}

export function FinanceExpenseGauge() {
  const categories = [
    ["Housing", "Apartment, Electricity, etc", "$5,500", "2.5%", "green", "bg-fg-violet-100 text-fg-violet"],
    ["Food", "Milk, Coffee, Sereal, etc", "$4,245", "", "neutral", "bg-fg-yellow/20 text-fg-yellow"],
    ["Transportation", "Gas, Taxi, Service", "$8,147", "10%", "red", "bg-fg-red-100 text-fg-red"],
    ["Entertaiment", "Movie, Concert,etc", "$4,500", "10%", "green", "bg-fg-green-100 text-fg-green-500"],
    ["Charity", "Campaign", "$1,875", "10%", "green", "bg-fg-cyan-50 text-fg-cyan-500"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="relative mx-auto mt-2 flex h-36 w-64 items-end justify-center overflow-hidden">
        <div className="absolute bottom-0 h-56 w-56 rounded-full border-[34px] border-fg-blue-500 border-b-fg-grey-100 border-l-fg-grey-100 border-r-fg-yellow" />
        <div className="absolute bottom-0 right-8 z-0 h-24 w-24 rounded-full border-[16px] border-fg-red border-b-fg-cyan-500 border-l-fg-green-500 border-t-fg-red" />
        <div className="relative z-10 rounded-full bg-white/90 px-3 text-center">
          <p className="text-3xl font-semibold text-fg-black">$3.1k</p>
          <p className="mt-3 text-sm font-semibold text-fg-green-500">10% <span className="font-medium text-fg-grey-500">+$181</span></p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {categories.map(([label, subtitle, value, trend, trendColor, iconClass]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex size-10 items-center justify-center rounded-full ${iconClass}`}>
                <span className="size-3 rounded-[4px] bg-current" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-fg-black">{label}</span>
                <span className="block text-xs font-medium text-fg-grey-500">{subtitle}</span>
              </span>
            </div>
            <span className="text-right">
              <span className="block text-sm font-semibold text-fg-black">{value}</span>
              {trend && <span className={`block text-xs font-semibold ${trendColor === "red" ? "text-fg-red" : "text-fg-green-500"}`}>{trend}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinanceBudgetPanel() {
  return (
    <div className="rounded-[20px] border border-fg-grey-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-fg-black">Budget</p>
          <p className="mt-3 text-sm font-medium text-fg-grey-500">Budget this Month</p>
        </div>
        <ToolbarKebabButton />
      </div>
      <div className="mt-5 h-16 overflow-hidden rounded-[14px] bg-fg-grey-100">
        <div className="flex h-full w-3/4 items-center justify-center rounded-[14px] bg-fg-blue-500 text-base font-semibold text-white">75%</div>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-medium text-fg-grey-500">+$181 today</span>
        <span className="font-semibold text-fg-green-500">10%</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-xs font-medium text-fg-grey-500">Spent</p>
          <p className="mt-2 text-2xl font-semibold text-fg-black">$3,125</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-fg-grey-500">Left</p>
          <p className="mt-2 text-2xl font-semibold text-fg-black">$42,000</p>
        </div>
      </div>
    </div>
  );
}
