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
  ArrowRightUpLinear,
  ArrowRightDownLinear,
} from "solar-icon-set";
import {
  Button,
  ProgressStatCard,
  LineChartStatCard,
  BarChartStatCard,
  SmoothLineChart,
  BubbleChart,
  MapCard,
  DataTable,
  CellImageText,
  CellText,
  CellTextSubtitle,
  CellMuted,
  StatusBadge,
  KebabMenu,
  IconButton,
  ListGroup,
  ChartListItem,
  PlusIcon,
} from "@forge-ui/react";
import type {
  AppLayoutMenuItem,
  ColumnDef,
  StatusBadgeColor,
  MapRegion,
} from "@forge-ui/react";
import {
  DashboardShell,
  mainProfile,
  orders,
  topProducts,
  months,
  type OrderRow,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Dashboard", href: "/templates/dashboards/ecommerce-2" },
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

const regionsForMap: MapRegion[] = [
  { name: "United Kingdom", flag: "https://placehold.co/44x44/1e40af/fff?text=UK", salesLabel: "340 Sales", value: "$17,678" },
  { name: "Spain", flag: "https://placehold.co/44x44/dc2626/fff?text=ES", salesLabel: "100 Sales", value: "$5,500" },
  { name: "Indonesia", flag: "https://placehold.co/44x44/dc2626/fff?text=ID", salesLabel: "50 Sales", value: "$2,500" },
];

const orderColumns: ColumnDef<OrderRow>[] = [
  {
    key: "invoice",
    header: "Invoice",
    sortable: true,
    width: "w-[120px]",
    render: (row) => <CellText>{row.invoice ?? ""}</CellText>,
  },
  {
    key: "product",
    header: "Product",
    sortable: true,
    flex: true,
    render: (row) => <CellImageText src={row.productImg} title={row.product} subtitle={row.productSubtitle ?? ""} />,
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    width: "w-[120px]",
    render: (row) => <CellMuted>{row.date ?? ""}</CellMuted>,
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
    width: "w-[120px]",
    render: (row) => <CellText>{row.total}</CellText>,
  },
  {
    key: "payment",
    header: "Payment",
    width: "w-[140px]",
    render: (row) => <CellText>{row.payment ?? ""}</CellText>,
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
    width: "w-[60px]",
    render: () => <KebabMenu items={[{ label: "View", onSelect: () => {} }]} />,
  },
];

export default function Ecommerce2Page() {
  return (
    <DashboardShell
      mode="light"
      accent="purple"
      profilePosition="topbar"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={mainProfile}
      pageTitle="Dashboard"
      primaryAction={{ label: "Add Order" }}
    >
      <div className="flex flex-col gap-6">
        {/* 3 stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProgressStatCard
            title="Total Revenue"
            subtitle="2 Jul - Today"
            value="$32,200"
            trend="10%"
            trendDirection="up"
            theme="purple"
            progressValue={25}
            progressColor="red"
          />
          <LineChartStatCard
            title="Orders"
            subtitle="1 Jan - Today"
            value="31,300"
            trend="10%"
            trendDirection="up"
            chartColor="red"
            chartDirection="down"
          />
          <BarChartStatCard
            title="Customers"
            subtitle="2 Jul - Today"
            value="14,000"
            trend="10%"
            trendDirection="up"
            barColor="purple"
            bars={[10, 30, 60, 95, 50, 40, 30]}
          />
        </div>

        {/* Statistic + Expenses bubbles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
                <p className="text-sm text-fg-grey-500">Income and Expenses</p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-fg-grey-100 p-1 text-xs">
                <button className="px-3 py-1.5 text-fg-grey-500">Day</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Week</button>
                <button className="px-3 py-1.5 rounded-full bg-white shadow-sm text-fg-black">Month</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Year</button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: "Income", value: "$26,201", trend: "10%", up: true, color: "#7c3aed" },
                { label: "Expenses", value: "$18,120", trend: "10%", up: false, color: "#fbbf24" },
                { label: "Profit", value: "$18,120", trend: "10%", up: true, color: "#0ea5e9" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="size-9 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: s.color }}>
                    <ArrowRightUpLinear size={16} />
                  </div>
                  <div>
                    <div className="text-xs text-fg-grey-500">{s.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-fg-black">{s.value}</span>
                      <span className={`text-xs font-medium ${s.up ? "text-emerald-500" : "text-fg-red"}`}>{s.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SmoothLineChart
              series={[
                { data: [0.5, 0.55, 0.65, 0.6, 0.55, 0.7, 0.55, 0.6, 0.6, 0.65, 0.55, 0.5].map((v) => v * 1000), color: "#7c3aed" },
                { data: [0.4, 0.4, 0.5, 0.45, 0.42, 0.55, 0.45, 0.5, 0.45, 0.55, 0.4, 0.45].map((v) => v * 1000), color: "#fbbf24" },
                { data: [0.2, 0.22, 0.25, 0.22, 0.2, 0.3, 0.22, 0.2, 0.18, 0.2, 0.18, 0.2].map((v) => v * 1000), color: "#ef4444" },
              ]}
              accent="purple"
              activeIndex={6}
              showTooltip
              tooltipItems={[
                { label: "Income", value: "$680", trend: "up", color: "#7c3aed" },
                { label: "Expenses", value: "$280", trend: "down", color: "#fbbf24" },
                { label: "Profit", value: "$280", trend: "down", color: "#ef4444" },
              ]}
              showYAxis
              yAxisLabels={["$1.2k", "$1k", "$800", "$600", "$400", "$200", "0"]}
              xAxisLabels={months}
              height="h-[260px]"
            />
          </div>

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Expenses</h3>
                <p className="text-sm text-fg-grey-500">Based on category</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <BubbleChart
              bubbles={[
                { value: 58.33, label: "58.33%", color: "bg-fg-violet" },
                { value: 25, label: "25%", color: "bg-yellow-400" },
                { value: 8, label: "8%", color: "bg-sky-500" },
                { value: 2, label: "2%", color: "bg-orange-500" },
              ]}
              height={240}
            />
            <div className="grid grid-cols-2 gap-2 text-xs text-fg-grey-700">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#7c3aed" }} /> Google Ads</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#fbbf24" }} /> Facebook Ads</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#0ea5e9" }} /> Discount</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#f97316" }} /> Flyer</span>
            </div>
          </div>
        </div>

        {/* Top Region + Top Product + Top Category */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MapCard
            title="Top Region"
            subtitle="Sales by region"
            color="purple"
            variant="md"
            regions={regionsForMap}
            highlights={["north-america", "europe", "asia", "oceania"]}
            onMenuClick={() => {}}
          />

          <ListGroup
            title="Top Product"
            subtitle="Based on Sales"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col">
                {topProducts.slice(0, 7).map((p) => (
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
                      <div className="text-xs text-emerald-500">8%</div>
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

        {/* Recent Orders table */}
        <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg-black">Recent Orders</h3>
              <p className="text-sm text-fg-grey-500">Recent orders</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />}>Filters</Button>
              <Button variant="tertiary" size="sm">Show 5</Button>
              <Button size="sm" iconRight={<AltArrowRightLinear size={14} />}>See More</Button>
            </div>
          </div>
          <DataTable<OrderRow>
            columns={orderColumns}
            rows={orders}
            showCheckbox
            showPagination
            currentPage={1}
            totalPages={20}
            onPageChange={() => {}}
            paginationLabel="Showing 1-10 from 100"
          />
        </div>
      </div>
    </DashboardShell>
  );
}
