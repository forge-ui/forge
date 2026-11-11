"use client";

import { Button, KebabMenu, PageDot } from "@forge-ui-official/core";
import { WalletBoldDuotone } from "@forge-ui-official/core/icons";
import { Panel, WalletGoalCard, type PanelProps, type WalletGoalCardProps } from "@forge-ui-official/core";

export type GoalProgressListProps = Omit<PanelProps, "children"> & {
  children?: PanelProps["children"];
  goals?: (WalletGoalCardProps & { id: string })[];
};

export function GoalProgressList({ goals = [], children, ...panel }: GoalProgressListProps) {
  return <Panel {...panel}>{children ?? goals.map(({ id, ...goal }) => <WalletGoalCard key={id} {...goal} />)}</Panel>;
}

export interface WalletProgressPanelProps {
  title?: string;
  subtitle?: string;
  goalTitle?: string;
  date?: string;
  amount?: string;
  progress?: number;
  onRefresh?: () => void;
  onTopUp?: () => void;
  onWithdraw?: () => void;
}

export function WalletProgressPanel({ title = "Wallet", subtitle = "Your Savings Progress", goalTitle = "Holiday", date = "12 December 2024", amount = "$1,600", progress = 50, onRefresh, onTopUp, onWithdraw }: WalletProgressPanelProps) {
  return (
    <Panel gap="none" className="min-h-[420px]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold leading-5 text-fg-black">{title}</h3>
          <p className="mt-1 text-xs font-medium text-fg-grey-700">{subtitle}</p>
        </div>
        <KebabMenu items={[{ label: "Refresh", onSelect: () => onRefresh?.() }]} />
      </div>
      <div className="relative mt-6 flex-1 overflow-hidden">
        <div className="absolute left-[-280px] top-0 h-[310px] w-[260px] rounded-[28px] border border-fg-grey-200 bg-background" />
        <div className="absolute right-[-280px] top-0 h-[310px] w-[260px] rounded-[28px] border border-fg-grey-200 bg-background" />
        <div className="mx-4 rounded-[28px] border border-fg-grey-200 bg-background p-4 shadow-subtle">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-fg-grey-100 text-fg-violet">
                <WalletBoldDuotone size={20} />
              </span>
              <div>
                <div className="text-sm font-semibold text-fg-black">{goalTitle}</div>
                <div className="mt-1 text-xs text-fg-grey-700">{date}</div>
              </div>
            </div>
            <KebabMenu items={[{ label: "Refresh", onSelect: () => onRefresh?.() }]} />
          </div>
          <div className="mt-6 flex items-end justify-between">
            <span className="text-lg font-semibold text-fg-black">{amount}</span>
            <span className="text-lg font-semibold text-fg-violet">{progress}%</span>
          </div>
          <div className="mt-5 h-3 rounded-full bg-fg-grey-100">
            <div className="h-full rounded-full bg-fg-violet" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
          </div>
          <div className="mt-5 border-t border-fg-grey-200 pt-5 grid grid-cols-2 gap-3">
            <Button color="grey" variant="tertiary" className="h-10 rounded-full text-sm font-semibold" onClick={onTopUp}>Top Up</Button>
            <Button color="grey" variant="tertiary" className="h-10 rounded-full text-sm font-semibold" onClick={onWithdraw}>Withdraw</Button>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        <PageDot active>1</PageDot>
        <PageDot>2</PageDot>
        <PageDot>3</PageDot>
      </div>
    </Panel>
  );
}
