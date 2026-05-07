"use client";

import { useState } from "react";
import {
  WidgetBoldDuotone,
  CardBoldDuotone,
  TransferHorizontalBoldDuotone,
  WalletBoldDuotone,
  CardSendBoldDuotone,
  BillListBoldDuotone,
  ChartBoldDuotone,
  ArrowRightUpLinear,
  ArrowRightDownLinear,
  AltArrowDownLinear,
  CalendarMinimalisticLinear,
  FilterLinear,
  AltArrowRightLinear,
  RefreshLinear,
} from "solar-icon-set";
import {
  Button,
  ListGroup,
  ContactItem,
  CreditCard,
  BalanceCard,
  CurrencyConverter,
  MultilayerDonutChart,
  DataTable,
  CellImageText,
  CellText,
  CellTextSubtitle,
  StatusBadge,
  KebabMenu,
  ListItem,
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
  contacts,
  upsideDownBarData,
  FigmaUpsideDownBarChart,
  type TransactionRow,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/dashboards/finance-3" },
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

const statisticActiveIndex = 5;

const expenseRows = [
  { label: "Housing", value: "$5,500", color: "#7c3aed", subtitle: "Apartment, Electricity, etc", delta: "2.5%", trend: "up" as const },
  { label: "Food", value: "$4,245", color: "#fbbf24", subtitle: "Milk, Coffee, Sereal, etc" },
  { label: "Transportation", value: "$8,147", color: "#f97316", subtitle: "Gas, Taxi, Service", delta: "10%", trend: "up" as const },
];

export default function Finance3Page() {
  const [fromValue, setFromValue] = useState("1,000");
  const [toValue, setToValue] = useState("1089.57");

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
      width: "w-[140px]",
      render: (row) => <StatusBadge label={row.status} color={statusColorMap[row.status]} />,
    },
    {
      key: "actions",
      header: "",
      width: "w-[60px]",
      render: () => (
        <KebabMenu
          items={[
            { label: "View detail", onSelect: () => {} },
            { label: "Download invoice", onSelect: () => {} },
          ]}
        />
      ),
    },
  ];

  return (
    <DashboardShell
      mode="light"
      accent="purple"
      profilePosition="sidebar"
      menuItems={menuItems}
      profile={mainProfile}
      pageTitle="Dashboard"
      primaryAction={{ label: "Add Payment" }}
    >
      <div className="flex flex-col gap-6">
        {/* Main grid: 4 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column (col-span-1) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Total Balance */}
            <BalanceCard
              title="Total Balance"
              balance="$21,500"
              trend="10%"
              trendDirection="up"
              subtitle="+$150 today"
              cardNumber="*9821"
              balanceHidden={false}
              onTransfer={() => {}}
              onRequest={() => {}}
              className="!w-full"
            />

            {/* Credit cards */}
            <ListGroup
              title="Credit"
              subtitle="All Your Cards"
              items={
                <div className="flex flex-col gap-3">
                  <CreditCard cardNumber="9090" holderName="John Doe Hoegan" expiry="07/25" theme="purple" variant="gradient" className="!w-full" />
                  <CreditCard cardNumber="9090" holderName="John Doe Hoegan" expiry="07/25" theme="dark" variant="flat" className="!w-full" />
                  <Button color="grey" variant="tertiary" iconLeft={<PlusIcon size={16} />} className="w-full rounded-full">Add New Card</Button>
                </div>
              }
            />

            {/* Wallet */}
            <ListGroup
              title="Wallet"
              subtitle="Your Savings Progress"
              items={
                <div className="flex flex-col gap-3">
                  <WalletGoalCard title="New Laptop" date="08 Augustus 2024" amount="$1,000" progress={50} progressColor="purple" showActions />
                  <WalletGoalCard title="Holiday" date="12 December 2024" amount="$1,600" progress={100} progressColor="green" showActions />
                </div>
              }
            />

            {/* Conversion */}
            <CurrencyConverter
              title="Conversion"
              subtitle="Convert currency"
              color="purple"
              fromValue={fromValue}
              fromCurrency="EUR"
              toValue={toValue}
              toCurrency="USD"
              exchangeRateText="1 EUR = 1.09 USD"
              onFromChange={setFromValue}
              onToChange={setToValue}
              convertLabel="Convert"
              convertIcon={<RefreshLinear size={16} />}
            />
          </div>

          {/* Right wide region (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Statistic full-width */}
            <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
                  <p className="text-sm text-fg-grey-500">Income and Expenses</p>
                </div>
                <Button color="grey" variant="tertiary" iconRight={<AltArrowDownLinear size={14} />} className="rounded-full text-fg-grey-700">Monthly</Button>
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
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-fg-green">
                        10% <ArrowRightUpLinear size={12} />
                      </span>
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
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-fg-red">
                        10% <ArrowRightDownLinear size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <FigmaUpsideDownBarChart
                data={upsideDownBarData}
                activeIndex={statisticActiveIndex}
                tooltipUpperValue="$680"
                tooltipLowerValue="$280"
                upperColor="bg-fg-violet"
                lowerColor="bg-fg-red"
                heightClass="h-[280px]"
              />
            </div>

            {/* Bottom: Transaction table (left) + Contact/Expenses (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Transaction (col-span-2) */}
              <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-fg-black">Transaction</h3>
                    <p className="text-sm text-fg-grey-500">Recent transactions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button color="grey" variant="tertiary" size="sm" iconLeft={<CalendarMinimalisticLinear size={14} />} className="rounded-full text-fg-grey-700">Select Dates</Button>
                    <Button color="grey" variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />} className="rounded-full text-fg-grey-700">Filters</Button>
                    <Button color="purple" size="sm" iconRight={<AltArrowRightLinear size={14} />} className="rounded-full">See More</Button>
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

              {/* Right column: Contact + All Expenses */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <ListGroup
                  title="Contact"
                  subtitle="Recent transactions"
                  action={<KebabMenu items={[{ label: "View all", onSelect: () => {} }]} />}
                  items={
                    <div className="flex flex-col">
                      {contacts.slice(0, 8).map((c) => (
                        <ContactItem
                          key={c.id}
                          name={c.name}
                          message={c.bank}
                          avatar={c.avatar}
                          online={c.online}
                          color="purple"
                        />
                      ))}
                    </div>
                  }
                />

                {/* All Expenses */}
                <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-fg-black">All Expenses</h3>
                      <p className="text-sm text-fg-grey-500">Based on categories</p>
                    </div>
                    <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
                  </div>
                  <MultilayerDonutChart
                    layers={[
                      { value: 80, color: "#7c3aed" },
                      { value: 60, color: "#2563eb" },
                      { value: 50, color: "#10b981" },
                      { value: 35, color: "#fbbf24" },
                      { value: 20, color: "#f97316" },
                    ]}
                    centerValue="$75.5k"
                    trend="10%"
                    trendDirection="up"
                    subtitle="from last month"
                  />
                  <div className="flex flex-col gap-3 pt-2">
                    {expenseRows.map((e) => (
                      <ListItem
                        key={e.label}
                        lead={{ kind: "icon", icon: <WalletBoldDuotone size={16} />, color: "purple", variant: "light" }}
                        title={e.label}
                        subtitle={e.subtitle}
                        value={e.value}
                        trend={e.delta}
                        trendDirection={e.trend}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
