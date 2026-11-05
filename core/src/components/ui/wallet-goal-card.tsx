"use client";

import type { ReactNode } from "react";
import { CalendarMinimalisticLinear } from "../../icons";
import { Button } from "./button";
import { KebabMenu } from "./kebab-menu";
import { ProgressBar } from "./progress-bar";

export interface WalletGoalCardProps {
  title: string;
  date: string;
  amount: string;
  progress: number;
  progressColor: "purple" | "green" | "blue" | "red" | "orange" | "yellow" | "cyan";
  showActions?: boolean;
  onEdit?: () => void;
  onTopUp?: () => void;
  onWithdraw?: () => void;
  topUpLabel?: string;
  withdrawLabel?: string;
  editLabel?: string;
  iconBg?: string;
  icon?: ReactNode;
}

export function WalletGoalCard({
  title,
  date,
  amount,
  progress,
  progressColor,
  showActions = false,
  onEdit,
  onTopUp,
  onWithdraw,
  topUpLabel = "Top Up",
  withdrawLabel = "Withdraw",
  editLabel = "Edit",
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
        <KebabMenu items={[{ label: editLabel, onSelect: () => onEdit?.() }]} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-fg-black">{amount}</span>
        <span className="text-sm font-semibold text-fg-grey-700">{progress}%</span>
      </div>
      <ProgressBar value={progress} color={progressColor} size="md" />
      {showActions && (
        <div className="flex items-center gap-2">
          <Button variant="tertiary" size="sm" className="flex-1" onClick={onTopUp}>{topUpLabel}</Button>
          <Button variant="tertiary" size="sm" className="flex-1" onClick={onWithdraw}>{withdrawLabel}</Button>
        </div>
      )}
    </div>
  );
}
