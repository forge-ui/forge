"use client";

import {
  WidgetBoldDuotone,
  BoxBoldDuotone,
  BagBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  ShopBoldDuotone,
  FolderWithFilesBoldDuotone,
  MouseBoldDuotone,
  GameboyBoldDuotone,
  KeyboardBoldDuotone,
  CalendarMinimalisticLinear,
  AltArrowRightLinear,
  EyeLinear,
  TrashBinMinimalisticLinear,
  FilterLinear,
} from "solar-icon-set";
import {
  Button,
  BarChartStatCard,
  HalfDonutChart,
  PieChart,
  DataTable,
  CellImageText,
  CellText,
  CellTextSubtitle,
  StatusBadge,
  KebabMenu,
  IconButton,
  ListGroup,
  ChartListItem,
  PlusIcon,
} from "@forge-ui-official/core";
import type { AppLayoutMenuItem, ColumnDef, StatusBadgeColor } from "@forge-ui-official/core";
import {
  DashboardShell,
  mainProfile,
  orders,
  topProducts,
  regions,
  groupedStatisticBarData,
  groupedStatisticSeries,
  groupedStatisticTooltip,
  FigmaChartHeader,
  FigmaGroupedBarChart,
  type OrderRow,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Dashboard", href: "/templates/dashboards/ecommerce-3" },
  { icon: <BoxBoldDuotone size={20} />, label: "Product", href: "#product" },
  { icon: <BagBoldDuotone size={20} />, label: "Orders", href: "#orders" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Customers", href: "#customers" },
  { icon: <ShopBoldDuotone size={20} />, label: "Seller", href: "#seller" },
  { icon: <FolderWithFilesBoldDuotone size={20} />, label: "File Manager", href: "#file" },
];

const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <MouseBoldDuotone size={20} />, label: "Logic Wireless Mouse", href: "#mouse" },
  { icon: <GameboyBoldDuotone size={20} />, label: "PS Controller", href: "#ps" },
  { icon: <KeyboardBoldDuotone size={20} />, label: "Ximi Keyboard", href: "#kb" },
];

const orderStatusColor: Record<OrderRow["status"], StatusBadgeColor> = {
  Processing: "yellow",
  Canceled: "red",
  Shiped: "blue",
  Success: "green",
  Delivered: "green",
};

const orderColumns: ColumnDef<OrderRow>[] = [
  {
    key: "product",
    header: "Product",
    sortable: true,
    flex: true,
    render: (row) => <CellImageText src={row.productImg} title={row.product} subtitle={row.productSubtitle ?? ""} />,
  },
  {
    key: "customer",
    header: "Customer",
    width: "w-[200px]",
    render: (row) => <CellTextSubtitle title={row.customer} subtitle={row.customerEmail} />,
  },
  {
    key: "total",
    header: "Total",
    sortable: true,
    width: "w-[120px]",
    render: (row) => <CellText>{row.total}</CellText>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "w-[140px]",
    render: (row) => <StatusBadge label={row.status} color={orderStatusColor[row.status]} />,
  },
  {
    key: "actions",
    header: "",
    width: "w-[80px]",
    render: () => (
      <div className="flex items-center gap-2">
        <IconButton variant="ghost" shape="square" size="sm"><EyeLinear size={14} /></IconButton>
        <IconButton variant="ghost" shape="square" size="sm"><TrashBinMinimalisticLinear size={14} /></IconButton>
      </div>
    ),
  },
];

export default function Ecommerce3Page() {
  return (
    <DashboardShell
      mode="light"
      accent="black"
      profilePosition="topbar"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={mainProfile}
    >
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-fg-black">Dashboard</h1>
            <p className="text-sm text-fg-grey-500">Hello John, here&apos;s what happen with your store</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>Select Dates</Button>
            <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            <Button color="black" iconLeft={<PlusIcon size={16} />}>Add Order</Button>
          </div>
        </div>

        {/* 4 colorful stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 [&>*]:!w-full">
          <BarChartStatCard title="Income" value="$75,000" trend="10%" trendDirection="up" subtitle="+$750 today" theme="purple" size="wide" barColor="purple" bars={[10, 30, 60, 95, 50, 40, 30]} />
          <BarChartStatCard title="Orders" value="31,000" trend="5%" trendDirection="up" subtitle="+156 today" theme="blue" size="wide" barColor="blue" bars={[10, 30, 60, 95, 50, 40, 30]} />
          <BarChartStatCard title="Profit" value="$32,125" trend="10%" trendDirection="up" subtitle="+$321 today" theme="green" size="wide" barColor="green" bars={[10, 30, 60, 95, 50, 40, 30]} />
          <BarChartStatCard title="Expenses" value="$18,120" trend="10%" trendDirection="up" subtitle="+$321 today" theme="red" size="wide" barColor="red" bars={[10, 30, 60, 95, 50, 40, 30]} />
        </div>

        {/* Target + Statistic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Target</h3>
                <p className="text-sm text-fg-grey-500">Revenue target</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <HalfDonutChart
              segments={[{ value: 60.02, color: "#7c3aed" }]}
              accent="purple"
              centerValue="60.02%"
              trend="10%"
              trendDirection="up"
              subtitle="+$181 today"
            />
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-fg-grey-200">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-fg-grey-500">Target</span>
                <span className="text-base font-semibold text-fg-black">$20k</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-fg-grey-500">Revenue</span>
                <span className="text-base font-semibold text-fg-black inline-flex items-center gap-1">$16k <span className="text-emerald-500 text-xs">▲</span></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-fg-grey-500">This Week</span>
                <span className="text-base font-semibold text-fg-black inline-flex items-center gap-1">$1.5k <span className="text-emerald-500 text-xs">▲</span></span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <FigmaChartHeader title="Statistic" subtitle="Income and Expenses" tabs={["Daily", "Weekly", "Monthly", "Annual"]} activeTab="Monthly" />
            <FigmaGroupedBarChart
              data={groupedStatisticBarData.map((item) => ({ ...item, values: item.values.slice(0, 1) }))}
              series={groupedStatisticSeries.slice(0, 1)}
              tooltipItems={groupedStatisticTooltip.slice(0, 1)}
              heightClass="h-[280px]"
            />
          </div>
        </div>

        {/* All Expenses + Top Product + Top Category */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">All Expenses</h3>
                <p className="text-sm text-fg-grey-500">Based on categories</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <div className="flex justify-center">
              <PieChart
                segments={[
                  { value: 50, color: "#7c3aed" },
                  { value: 20, color: "#fbbf24" },
                  { value: 15, color: "#10b981" },
                  { value: 10, color: "#f97316" },
                  { value: 5, color: "#0ea5e9" },
                ]}
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-fg-grey-700">
              {[
                { label: "Google Ads", value: "$10,000", color: "#7c3aed" },
                { label: "Facebook Ads", value: "$4,000", color: "#fbbf24" },
                { label: "Discount", value: "$2,100", color: "#10b981" },
                { label: "Freebies", value: "$1,900", color: "#f97316" },
                { label: "Flyer", value: "$742", color: "#0ea5e9" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: row.color }} /> {row.label}</span>
                  <span className="font-semibold text-fg-black">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <ListGroup
            title="Top Product"
            subtitle="Based on Sales"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col">
                {topProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2.5">
                    <div className="size-10 rounded-lg bg-fg-grey-100 flex items-center justify-center overflow-hidden">
                      <img src={p.imageUrl} alt={p.name} className="size-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-fg-black truncate">{p.name}</div>
                      <div className="text-xs text-fg-grey-500">{p.sales}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-fg-black">{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            }
          />

          <ListGroup
            title="Top Category"
            subtitle="Based on sales"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col">
                {[
                  { name: "Smartphone", subtitle: "Subtext", price: "$24,500", color: "purple" as const },
                  { name: "Keyboard", subtitle: "Subtext", price: "$12,500", color: "blue" as const },
                  { name: "Controller", subtitle: "Subtext", price: "$12,251", color: "blue" as const },
                  { name: "Laptop", subtitle: "Subtext", price: "$10,092", color: "blue" as const },
                  { name: "Headphone", subtitle: "Subtext", price: "$9,992", color: "purple" as const },
                  { name: "Speaker", subtitle: "Subtext", price: "$7,640", color: "blue" as const },
                  { name: "Tablet", subtitle: "Subtext", price: "$7,521", color: "blue" as const },
                ].map((c, i) => (
                  <ChartListItem
                    key={i}
                    icon={BoxBoldDuotone}
                    accent={c.color}
                    title={c.name}
                    subtitle={c.subtitle}
                    value={c.price}
                  />
                ))}
              </div>
            }
          />
        </div>

        {/* Recent Orders + Top Region */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Recent Orders</h3>
                <p className="text-sm text-fg-grey-500">Recent orders</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />}>Filters</Button>
                <Button color="black" size="sm" iconRight={<AltArrowRightLinear size={14} />}>See More</Button>
              </div>
            </div>
            <DataTable<OrderRow>
              columns={orderColumns}
              rows={orders}
              showPagination
              currentPage={1}
              totalPages={20}
              onPageChange={() => {}}
              paginationLabel="Showing 1-5 from 100"
            />
          </div>

          <ListGroup
            title="Top Region"
            subtitle="Sales by region"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col">
                {regions.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 py-2.5">
                    <span className="text-2xl">{r.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-fg-black">{r.name}</div>
                      <div className="text-xs text-fg-grey-500">{r.sales}</div>
                    </div>
                    <div className="text-sm font-semibold text-fg-black">{r.amount}</div>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </div>
    </DashboardShell>
  );
}
