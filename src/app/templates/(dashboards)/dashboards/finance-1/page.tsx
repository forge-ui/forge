"use client";

import {
  WidgetBoldDuotone,
  WalletBoldDuotone,
  TransferHorizontalBoldDuotone,
  CardBoldDuotone,
  CardSendBoldDuotone,
  BillListBoldDuotone,
  ChartBoldDuotone,
  CalendarMinimalisticLinear,
  AltArrowRightLinear,
  AltArrowDownLinear,
  ArrowRightUpLinear,
  ArrowRightDownLinear,
  TransferHorizontalLinear,
} from "solar-icon-set";
import {
  Button,
  BalanceCard,
  CreditCard,
  LineChartStatCard,
  BarUpsideDownChart,
  DonutChart,
  ListGroup,
  PlusIcon,
  KebabMenu,
} from "@forge-ui/react";
import type { AppLayoutMenuItem } from "@forge-ui/react";
import {
  DashboardShell,
  WalletGoalCard,
  mainProfile,
  transactions,
  upsideDownBarData,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/dashboards/finance-1" },
  { icon: <ChartBoldDuotone size={20} />, label: "Wealth", href: "#wealth" },
  { icon: <TransferHorizontalBoldDuotone size={20} />, label: "Transactions", href: "#transactions" },
  { icon: <WalletBoldDuotone size={20} />, label: "Wallet", href: "#wallet" },
  { icon: <CardBoldDuotone size={20} />, label: "Card", href: "#card" },
  { icon: <CardSendBoldDuotone size={20} />, label: "Invoice", href: "#invoice" },
  { icon: <BillListBoldDuotone size={20} />, label: "Reports", href: "#reports" },
];

export default function Finance1Page() {
  return (
    <DashboardShell
      mode="dark"
      accent="blue"
      profilePosition="topbar"
      menuItems={menuItems}
      profile={mainProfile}
    >
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-fg-black">Overview</h1>
            <p className="text-sm text-fg-grey-500">Hello John, here&apos;s what happen with your finance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>Select Dates</Button>
            <Button color="purple" iconLeft={<PlusIcon size={16} />}>Add Payment</Button>
          </div>
        </div>

        {/* 3 stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <BalanceCard
            title="Total Balance"
            balance="$21,500"
            trend="10%"
            trendDirection="up"
            subtitle="+$150 today"
            cardNumber="*9821"
            onTransfer={() => {}}
            onRequest={() => {}}
          />
          <LineChartStatCard
            title="Income"
            subtitle="2 Jul - Today"
            value="$35,500"
            trend="10%"
            trendDirection="up"
            chartColor="blue"
            chartDirection="up"
            className="!w-full"
          />
          <LineChartStatCard
            title="Expenses"
            subtitle="2 Jul - Today"
            value="$14,000"
            trend="10%"
            trendDirection="down"
            chartColor="red"
            chartDirection="down"
            className="!w-full"
          />
        </div>

        {/* Card list + Statistic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ListGroup
            title="Card"
            subtitle="All Your Cards"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col gap-3">
                <CreditCard cardNumber="**** **** **** 9090" holderName="John Doe Hoegan" expiry="07/25" theme="purple" />
                <CreditCard cardNumber="**** **** **** 9090" holderName="John Doe Hoegan" expiry="07/25" theme="dark" />
                <Button variant="tertiary" iconLeft={<PlusIcon size={16} />} className="w-full">Add New Card</Button>
              </div>
            }
          />

          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
                <p className="text-sm text-fg-grey-500">Income and Expenses</p>
              </div>
              <Button variant="tertiary" iconRight={<AltArrowDownLinear size={14} />}>Monthly</Button>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-fg-violet-100 flex items-center justify-center text-fg-violet">
                  <ArrowRightUpLinear size={18} />
                </div>
                <div>
                  <div className="text-sm text-fg-grey-500">Income</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-fg-black">$12,201</span>
                    <span className="text-xs font-medium text-emerald-500">10%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-rose-100 flex items-center justify-center text-fg-red">
                  <ArrowRightDownLinear size={18} />
                </div>
                <div>
                  <div className="text-sm text-fg-grey-500">Expenses</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-fg-black">$10,120</span>
                    <span className="text-xs font-medium text-fg-red">10%</span>
                  </div>
                </div>
              </div>
            </div>
            <BarUpsideDownChart
              data={upsideDownBarData}
              accent="purple"
              activeIndex={5}
              showTooltip
              showLabels
              tooltipUpperValue="$680"
              tooltipLowerValue="$280"
              tooltipTrend="up"
              upperColor="bg-blue-600"
              lowerColor="bg-fg-red"
              height="h-[280px]"
            />
          </div>
        </div>

        {/* Wallet + Transactions + All Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ListGroup
            title="Wallet"
            subtitle="Your saving progress"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col gap-3">
                <WalletGoalCard title="Holiday" date="12 December 2025" amount="$1,600" progress={50} progressColor="purple" showActions />
                <WalletGoalCard title="New Laptop" date="24 October 2025" amount="$1,480" progress={100} progressColor="green" showActions />
              </div>
            }
          />

          <ListGroup
            title="Transactions"
            subtitle="Recent Transactions"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 py-2.5">
                    <div className="size-10 rounded-lg overflow-hidden">
                      <img src={t.iconUrl} alt={t.name} className="size-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-fg-black">{t.name}</div>
                      <div className="text-xs text-fg-grey-500">{t.category}</div>
                    </div>
                    <div className="text-sm font-semibold text-fg-black">{t.amount}</div>
                  </div>
                ))}
              </div>
            }
          />

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">All Expenses</h3>
                <p className="text-sm text-fg-grey-500">Based on categories</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <DonutChart
              segments={[
                { value: 40, color: "#2563eb" },
                { value: 25, color: "#fbbf24" },
                { value: 15, color: "#f97316" },
                { value: 12, color: "#10b981" },
                { value: 8, color: "#0ea5e9" },
              ]}
              centerValue="$14,000"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
              size="lg"
            />
            <div className="flex flex-col gap-1.5 text-xs text-fg-grey-700 pt-2 border-t border-fg-grey-200">
              {[
                { label: "Housing", value: "$5,000", color: "#2563eb" },
                { label: "Food", value: "$4,000", color: "#fbbf24" },
                { label: "Transportation", value: "$3,000", color: "#f97316" },
                { label: "Subscription", value: "$1,500", color: "#10b981" },
                { label: "Entertainment", value: "$500", color: "#0ea5e9" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: row.color }} /> {row.label}</span>
                  <span className="font-semibold text-fg-black">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
