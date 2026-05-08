"use client";

import { CalendarMinimalisticLinear } from "solar-icon-set";
import { Button, KebabMenu, ProgressBar } from "@forge-ui-official/core";

interface WalletGoalCardProps {
  title: string;
  date: string;
  amount: string;
  progress: number;
  progressColor: "purple" | "green" | "blue" | "red" | "orange" | "yellow" | "cyan";
  showActions?: boolean;
  iconBg?: string;
  icon?: React.ReactNode;
}

export function WalletGoalCard({
  title,
  date,
  amount,
  progress,
  progressColor,
  showActions = false,
  iconBg = "#ede9fe",
  icon,
}: WalletGoalCardProps) {
  return (
    <div className="rounded-2xl border border-fg-grey-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full flex items-center justify-center" style={{ backgroundColor: iconBg }}>
            {icon ?? <CalendarMinimalisticLinear size={18} />}
          </div>
          <div>
            <div className="text-sm font-semibold text-fg-black">{title}</div>
            <div className="text-xs text-fg-grey-500">{date}</div>
          </div>
        </div>
        <KebabMenu items={[{ label: "Edit", onSelect: () => {} }]} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-fg-black">{amount}</span>
        <span className="text-sm font-semibold text-fg-grey-700">{progress}%</span>
      </div>
      <ProgressBar value={progress} color={progressColor} size="md" />
      {showActions && (
        <div className="flex items-center gap-2">
          <Button variant="tertiary" size="sm" className="flex-1">Top Up</Button>
          <Button variant="tertiary" size="sm" className="flex-1">Withdraw</Button>
        </div>
      )}
    </div>
  );
}
