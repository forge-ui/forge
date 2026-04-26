"use client";

import {
  WidgetBoldDuotone,
  ChartBoldDuotone,
  TransferHorizontalBoldDuotone,
  WalletBoldDuotone,
  CardBoldDuotone,
  CardSendBoldDuotone,
  BillListBoldDuotone,
  CalendarMinimalisticLinear,
  AltArrowRightLinear,
  AltArrowDownLinear,
  ArrowRightUpLinear,
  ArrowRightDownLinear,
  FilterLinear,
} from "solar-icon-set";
import {
  Button,
  CreditCard,
  LineChartStatCard,
  BarUpsideDownChart,
  DashedHalfDonutChart,
  DataTable,
  CellImageText,
  CellTextSubtitle,
  CellText,
  StatusBadge,
  KebabMenu,
  ListGroup,
  PageDot,
  PlusIcon,
} from "@forge-ui/react";
import type {
  AppLayoutMenuItem,
  ColumnDef,
  StatusBadgeColor,
} from "@forge-ui/react";
import {
  DashboardShell,
  WalletGoalCard,
  mainProfile,
  transactions,
  upsideDownBarData,
  type TransactionRow,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/dashboards/finance-2" },
  { icon: <ChartBoldDuotone size={20} />, label: "Wealth", href: "#wealth" },
  { icon: <TransferHorizontalBoldDuotone size={20} />, label: "Transactions", href: "#transactions" },
  { icon: <WalletBoldDuotone size={20} />, label: "Wallet", href: "#wallet" },
  { icon: <CardBoldDuotone size={20} />, label: "Card", href: "#card" },
  { icon: <CardSendBoldDuotone size={20} />, label: "Invoice", href: "#invoice" },
  { icon: <BillListBoldDuotone size={20} />, label: "Reports", href: "#reports" },
];

const statusColorMap: Record<TransactionRow["status"], StatusBadgeColor> = {
  Pending: "yellow",
  Success: "green",
  Canceled: "red",
};

const transactionColumns: ColumnDef<TransactionRow>[] = [
  {
    key: "name",
    header: "Name/Business",
    sortable: true,
    flex: true,
    render: (row) => <CellImageText src={row.iconUrl} title={row.name} subtitle={row.category} />,
  },
  {
    key: "amount",
    header: "Amount",
    width: "w-[140px]",
    render: (row) => <CellText>{row.amount}</CellText>,
  },
  {
    key: "date",
    header: "Date & Time",
    sortable: true,
    width: "w-[170px]",
    render: (row) => <CellTextSubtitle title={row.date} subtitle={row.time ?? ""} />,
  },
  {
    key: "status",
    header: "Status",
    width: "w-[120px]",
    render: (row) => <StatusBadge label={row.status} color={statusColorMap[row.status]} />,
  },
  {
    key: "actions",
    header: "",
    width: "w-[60px]",
    render: () => <KebabMenu items={[{ label: "View", onSelect: () => {} }]} />,
  },
];

export default function Finance2Page() {
  return (
    <DashboardShell
      mode="light"
      accent="black"
      profilePosition="topbar"
      menuItems={menuItems}
      profile={mainProfile}
      pageTitle="Dashboard"
      primaryAction={{ label: "Add Payment" }}
    >
      <div className="flex flex-col gap-6">
        {/* Card stack + Income + Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Card stack */}
          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Card</h3>
                <p className="text-sm text-fg-grey-500">All Your Cards</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <div className="relative h-44 flex items-center justify-center overflow-hidden">
              <div className="absolute scale-[0.65] -translate-x-14 -rotate-6 opacity-70">
                <CreditCard cardNumber="**** **** **** 9090" holderName="John Doe Hoegan" expiry="07/25" theme="yellow" />
              </div>
              <div className="absolute scale-[0.65] translate-x-14 rotate-6 opacity-70">
                <CreditCard cardNumber="**** **** **** 9090" holderName="John Doe Hoegan" expiry="07/25" theme="dark" />
              </div>
              <div className="relative scale-[0.85]">
                <CreditCard cardNumber="**** **** **** 9090" holderName="John Doe Hoegan" expiry="07/25" theme="purple" />
              </div>
            </div>
            <Button variant="tertiary" iconLeft={<PlusIcon size={16} />} className="w-full">Add New Card</Button>
          </div>

          <LineChartStatCard
            title="Income"
            subtitle="2 Jul - Today"
            value="$35,500"
            trend="10%"
            trendDirection="up"
            chartColor="purple"
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

        {/* Wallet + Statistic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Wallet</h3>
                <p className="text-sm text-fg-grey-500">Your Savings Progress</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <WalletGoalCard title="Holiday" date="12 December 2024" amount="$1,600" progress={50} progressColor="purple" showActions />
            <div className="flex items-center justify-center gap-1 pt-1">
              <PageDot active>1</PageDot>
              <PageDot>2</PageDot>
              <PageDot>3</PageDot>
            </div>
          </div>

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
              upperColor="bg-fg-violet"
              lowerColor="bg-fg-red"
              height="h-[260px]"
            />
          </div>
        </div>

        {/* All Expenses + Transaction */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">All Expenses</h3>
                <p className="text-sm text-fg-grey-500">Based on categories</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <DashedHalfDonutChart
              segments={[
                { value: 40, color: "#7c3aed" },
                { value: 20, color: "#fbbf24" },
                { value: 15, color: "#10b981" },
              ]}
              centerValue="75%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="flex flex-col gap-2 pt-2 border-t border-fg-grey-200 text-xs">
              {[
                { label: "Housing", value: "$5,731", color: "#7c3aed", subtitle: "Apartment, Electricity, etc", delta: "2.5%" },
                { label: "Food", value: "$4,245", color: "#fbbf24", subtitle: "Milk, Coffee, Sereal, etc" },
                { label: "Transportation", value: "$3,150", color: "#10b981", subtitle: "Gas, Taxi, Service", delta: "5%" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 py-1.5">
                  <div className="size-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${row.color}22` }}>
                    <WalletBoldDuotone size={18} color={row.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-fg-black">{row.label}</div>
                    <div className="text-xs text-fg-grey-500 truncate">{row.subtitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-fg-black">{row.value}</div>
                    {row.delta && <div className="text-xs text-emerald-500">{row.delta} ▲</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Transaction</h3>
                <p className="text-sm text-fg-grey-500">Recent transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="sm" iconLeft={<CalendarMinimalisticLinear size={14} />}>Select Dates</Button>
                <Button variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />}>Filters</Button>
                <Button color="black" size="sm" iconRight={<AltArrowRightLinear size={14} />}>See More</Button>
              </div>
            </div>
            <DataTable<TransactionRow>
              columns={transactionColumns}
              rows={transactions}
              showPagination
              currentPage={1}
              totalPages={20}
              onPageChange={() => {}}
              paginationLabel="Showing 1-5 from 100"
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
