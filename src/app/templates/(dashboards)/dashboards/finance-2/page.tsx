"use client";

import { WalletProgressPanel } from "@/blocks/goal-progress-list/goal-progress-list";

import { AppLayout, DivergingBarChart, Panel } from "@forge-ui-official/core";
import { KpiMetrics, FinanceMetricCard } from "@/blocks/kpi-metrics/kpi-metrics";
import { TrendChart } from "@/blocks/trend-chart/trend-chart";
import { RecentRecords } from "@/blocks/recent-records/recent-records";
import { CardCarousel } from "@/blocks/card-carousel/card-carousel";
import { DashboardHeader } from "@/app/templates/_shared/dashboard-header";

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
} from "@forge-ui-official/core/icons";
import {
  Button,
  DashedHalfDonutChart,
  DataTable,
  CellImageText,
  CellTextSubtitle,
  CellText,
  StatusBadge,
  KebabMenu,
  PlusIcon,
} from "@forge-ui-official/core";
import type {
  AppLayoutMenuItem,
  ColumnDef,
  StatusBadgeColor,
} from "@forge-ui-official/core";
import { mainProfile, transactions, upsideDownBarData, type TransactionRow } from "../_shared";

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

function AllExpensesPanel() {
  return (
    <Panel className="min-h-[420px]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold leading-5 text-fg-black">All Expenses</h3>
          <p className="mt-1 text-xs font-medium text-fg-grey-700">Based on categories</p>
        </div>
        <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
      </div>
      <DashedHalfDonutChart
        segments={[
          { value: 40, color: "#7239EA" },
          { value: 20, color: "#F6C002" },
          { value: 15, color: "#09B96D" },
          { value: 8, color: "#FE4A23" },
          { value: 6, color: "#43CED7" },
        ]}
        centerValue="75%"
        trend="10%"
        trendDirection="up"
        subtitle="+$181 today"
      />
      <div className="flex flex-col gap-3 pt-1">
        {[
          { label: "Housing", value: "$5,731", color: "#7239EA", subtitle: "Apartment, Electricity, etc", delta: "2.5%" },
          { label: "Food", value: "$4,245", color: "#F6C002", subtitle: "Milk, Coffee, Sereal, etc" },
          { label: "Transportation", value: "$3,150", color: "#09B96D", subtitle: "Gas, Taxi, Service", delta: "5%" },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div className="size-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${row.color}14` }}>
              <WalletBoldDuotone size={18} color={row.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-fg-black">{row.label}</div>
              <div className="mt-1 text-xs text-fg-grey-700 truncate">{row.subtitle}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-fg-black">{row.value}</div>
              {row.delta && (
                <div className="mt-1 flex items-center justify-end gap-1 text-sm font-bold text-fg-green">
                  {row.delta}
                  <span className="inline-block size-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-fg-green" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default function Finance2Page() {
  return (
    <AppLayout
      notifications={99}
      messages={99}
      logoText="Protask"
      mode="light"
      accent="black"
      profilePosition="topbar"
      menuItems={menuItems}
      profile={mainProfile}
      pageTitle="Dashboard"
      primaryAction={{ label: "Add Payment" }}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Panel gap="none" className="min-h-[380px]">
            <DashboardHeader className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold leading-5 text-fg-black">Card</h3>
                <p className="mt-1 text-xs font-medium text-fg-grey-700">All Your Cards</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </DashboardHeader>
            <CardCarousel size="default" cards={[
              { id: "primary", cardNumber: "9090", holderName: "John Doe Hoegan", expiry: "07/25", theme: "purple", variant: "gradient" },
              { id: "next", cardNumber: "9090", holderName: "John Doe Hoegan", expiry: "07/25", theme: "blue", variant: "flat" },
              { id: "previous", cardNumber: "9090", holderName: "John Doe Hoegan", expiry: "07/25", theme: "yellow", variant: "flat" },
            ]} />
            <Button color="grey" variant="tertiary" iconLeft={<PlusIcon size={16} />} className="h-10 w-full rounded-full text-sm font-semibold">Add New Card</Button>
          </Panel>

          <WalletProgressPanel />
          <AllExpensesPanel />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <KpiMetrics className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FinanceMetricCard title="Income" value="$35,500" color="purple" direction="up" />
            <FinanceMetricCard title="Expenses" value="$14,000" color="red" direction="down" />
          </KpiMetrics>

          <TrendChart className="min-h-[460px]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold leading-5 text-fg-black">Statistic</h3>
                <p className="mt-1 text-xs font-medium text-fg-grey-700">Income and Expenses</p>
              </div>
              <Button color="grey" variant="tertiary" iconRight={<AltArrowDownLinear size={14} />} className="h-10 rounded-full px-5 text-sm font-medium text-fg-grey-700">Monthly</Button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-fg-violet-100 flex items-center justify-center text-fg-violet">
                  <ArrowRightUpLinear size={18} />
                </div>
                <div>
                  <div className="text-sm text-fg-grey-500">Income</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-fg-black">$12,201</span>
                    <span className="text-xs font-medium text-fg-green">10%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-fg-red-100 flex items-center justify-center text-fg-red">
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
            <DivergingBarChart
              data={upsideDownBarData}
              activeIndex={5}
              tooltipUpperValue="$680"
              tooltipLowerValue="$280"
              upperColor="bg-fg-violet"
              lowerColor="bg-fg-red"
              heightClass="h-56"
            />
          </TrendChart>

          <RecentRecords >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-fg-black">Transaction</h3>
                <p className="text-sm text-fg-grey-500">Recent transactions</p>
              </div>
              <div className="flex items-center gap-2">
                <Button color="grey" variant="tertiary" size="sm" iconLeft={<CalendarMinimalisticLinear size={14} />} className="rounded-full text-fg-grey-700">Select Dates</Button>
                <Button color="grey" variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />} className="rounded-full text-fg-grey-700">Filters</Button>
                <Button color="black" size="sm" iconRight={<AltArrowRightLinear size={14} />} className="rounded-full">See More</Button>
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
          </RecentRecords>
        </div>

      </div>
    </AppLayout>
  );
}
