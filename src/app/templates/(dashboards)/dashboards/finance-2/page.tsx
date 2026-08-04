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
  DashedHalfDonutChart,
  DataTable,
  CellImageText,
  CellTextSubtitle,
  CellText,
  StatusBadge,
  KebabMenu,
  PageDot,
  PlusIcon,
} from "@forge-ui-official/core";
import type {
  AppLayoutMenuItem,
  ColumnDef,
  StatusBadgeColor,
} from "@forge-ui-official/core";
import {
  DashboardShell,
  mainProfile,
  transactions,
  upsideDownBarData,
  FigmaUpsideDownBarChart,
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

function MiniFinanceLine({
  color,
  direction,
}: {
  color: "purple" | "red";
  direction: "up" | "down";
}) {
  const stroke = color === "purple" ? "#7239EA" : "#FE4A23";
  const points =
    direction === "up"
      ? "M2 50 C18 34 24 70 42 49 C55 32 60 53 74 45 C88 38 94 44 106 48 C121 54 126 32 138 18"
      : "M2 18 C16 36 24 20 39 36 C52 50 58 58 73 55 C88 52 91 42 105 54 C119 66 128 60 138 58";

  return (
    <svg viewBox="0 0 140 76" className="h-20 w-44" aria-hidden="true">
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

function FinanceStatCard({
  title,
  value,
  color,
  direction,
}: {
  title: "Income" | "Expenses";
  value: string;
  color: "purple" | "red";
  direction: "up" | "down";
}) {
  const iconClass = color === "purple" ? "bg-fg-grey-100 text-fg-violet" : "bg-fg-grey-100 text-fg-red";

  return (
    <div className="rounded-3xl border border-fg-grey-200 bg-white p-7 min-h-[248px] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold leading-8 text-fg-black">{title}</h3>
          <p className="mt-3 text-base font-medium leading-6 text-fg-grey-700">2 Jul - Today</p>
        </div>
        <span className={`flex size-14 items-center justify-center rounded-full ${iconClass}`}>
          {direction === "up" ? <ArrowRightUpLinear size={24} /> : <ArrowRightDownLinear size={24} />}
        </span>
      </div>
      <div className="flex items-end justify-between gap-5">
        <div>
          <div className="text-4xl font-semibold leading-[48px] text-fg-black">{value}</div>
          <div className="mt-4 flex items-center gap-2 text-base font-bold text-fg-green">
            10%
            <span className="inline-block size-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-fg-green" />
            <span className="font-medium text-fg-grey-700">+$150 today</span>
          </div>
        </div>
        <MiniFinanceLine color={color} direction={direction} />
      </div>
    </div>
  );
}

function CardCarouselPreview() {
  return (
    <div className="relative -mx-8 h-[286px] overflow-hidden">
      <div className="absolute left-0 top-12 h-40 w-12 overflow-hidden rounded-r-2xl">
        <div className="absolute left-[-236px] top-0">
          <CreditCard cardNumber="9090" holderName="John Doe Hoegan" expiry="07/25" theme="yellow" variant="flat" className="[&_*]:invisible" />
        </div>
      </div>
      <div className="absolute right-0 top-12 h-40 w-12 overflow-hidden rounded-l-2xl">
        <div className="absolute right-[-236px] top-0">
          <CreditCard cardNumber="9090" holderName="John Doe Hoegan" expiry="07/25" theme="blue" variant="flat" className="[&_*]:invisible" />
        </div>
      </div>
      <div className="absolute left-1/2 top-12 -translate-x-1/2">
        <CreditCard
          cardNumber="9090"
          holderName="John Doe Hoegan"
          expiry="07/25"
          theme="purple"
          variant="gradient"
          className="shadow-card"
        />
      </div>
    </div>
  );
}

function FinanceWalletPanel() {
  return (
    <div className="rounded-3xl border border-fg-grey-200 bg-white p-8 min-h-[520px] flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold leading-8 text-fg-black">Wallet</h3>
          <p className="mt-3 text-base font-medium leading-6 text-fg-grey-700">Your Savings Progress</p>
        </div>
        <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
      </div>
      <div className="relative mt-12 flex-1 overflow-hidden">
        <div className="absolute left-[-280px] top-0 h-[310px] w-[260px] rounded-[28px] border border-fg-grey-200 bg-white" />
        <div className="absolute right-[-280px] top-0 h-[310px] w-[260px] rounded-[28px] border border-fg-grey-200 bg-white" />
        <div className="mx-6 rounded-[28px] border border-fg-grey-200 bg-white p-8 shadow-subtle">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-full bg-fg-grey-100 text-fg-violet">
                <WalletBoldDuotone size={26} />
              </span>
              <div>
                <div className="text-xl font-semibold text-fg-black">Holiday</div>
                <div className="mt-1 text-base text-fg-grey-700">12 December 2024</div>
              </div>
            </div>
            <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
          </div>
          <div className="mt-10 flex items-end justify-between">
            <span className="text-2xl font-semibold text-fg-black">$1,600</span>
            <span className="text-2xl font-semibold text-fg-violet">50%</span>
          </div>
          <div className="mt-5 h-3 rounded-full bg-fg-grey-100">
            <div className="h-full w-1/2 rounded-full bg-fg-violet" />
          </div>
          <div className="mt-8 border-t border-fg-grey-200 pt-8 grid grid-cols-2 gap-5">
            <Button color="grey" variant="tertiary" className="h-14 rounded-full text-base font-semibold">Top Up</Button>
            <Button color="grey" variant="tertiary" className="h-14 rounded-full text-base font-semibold">Withdraw</Button>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2">
        <PageDot active>1</PageDot>
        <PageDot>2</PageDot>
        <PageDot>3</PageDot>
      </div>
    </div>
  );
}

function AllExpensesPanel() {
  return (
    <div className="rounded-3xl bg-white border border-fg-grey-200 p-8 min-h-[520px] flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold leading-8 text-fg-black">All Expenses</h3>
          <p className="mt-3 text-base font-medium leading-6 text-fg-grey-700">Based on categories</p>
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
      <div className="flex flex-col gap-5 pt-2">
        {[
          { label: "Housing", value: "$5,731", color: "#7239EA", subtitle: "Apartment, Electricity, etc", delta: "2.5%" },
          { label: "Food", value: "$4,245", color: "#F6C002", subtitle: "Milk, Coffee, Sereal, etc" },
          { label: "Transportation", value: "$3,150", color: "#09B96D", subtitle: "Gas, Taxi, Service", delta: "5%" },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-4">
            <div className="size-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${row.color}14` }}>
              <WalletBoldDuotone size={22} color={row.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-fg-black">{row.label}</div>
              <div className="mt-1 text-sm text-fg-grey-700 truncate">{row.subtitle}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-fg-black">{row.value}</div>
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
    </div>
  );
}

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl bg-white border border-fg-grey-200 p-8 min-h-[470px] flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold leading-8 text-fg-black">Card</h3>
                <p className="mt-3 text-base font-medium leading-6 text-fg-grey-700">All Your Cards</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <CardCarouselPreview />
            <Button color="grey" variant="tertiary" iconLeft={<PlusIcon size={20} />} className="h-16 w-full rounded-full text-base font-semibold">Add New Card</Button>
          </div>

          <FinanceWalletPanel />
          <AllExpensesPanel />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FinanceStatCard title="Income" value="$35,500" color="purple" direction="up" />
            <FinanceStatCard title="Expenses" value="$14,000" color="red" direction="down" />
          </div>

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-8 min-h-[610px] flex flex-col gap-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold leading-8 text-fg-black">Statistic</h3>
                <p className="mt-3 text-base font-medium leading-6 text-fg-grey-700">Income and Expenses</p>
              </div>
              <Button color="grey" variant="tertiary" iconRight={<AltArrowDownLinear size={18} />} className="h-14 rounded-full px-8 text-base font-medium text-fg-grey-700">Monthly</Button>
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
            <FigmaUpsideDownBarChart
              data={upsideDownBarData}
              activeIndex={5}
              tooltipUpperValue="$680"
              tooltipLowerValue="$280"
              upperColor="bg-fg-violet"
              lowerColor="bg-fg-red"
              heightClass="h-[360px]"
            />
          </div>

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Transaction</h3>
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
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
