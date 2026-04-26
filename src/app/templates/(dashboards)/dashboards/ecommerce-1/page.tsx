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
  WheelChartStatCard,
  LineChartStatCard,
  ImageStatCard,
  HighlightCard,
  BarUpsideDownChart,
  MapCard,
  DataTable,
  CellImageText,
  CellText,
  CellTextSubtitle,
  StatusBadge,
  KebabMenu,
  IconButton,
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
  upsideDownBarData,
  type OrderRow,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Dashboard", href: "/templates/dashboards/ecommerce-1" },
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
  { name: "France", flag: "https://placehold.co/44x44/2563eb/fff?text=FR", salesLabel: "147 Sales", value: "$7,456" },
  { name: "Germany", flag: "https://placehold.co/44x44/000/fff?text=DE", salesLabel: "540 Sales", value: "$24,189" },
];

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

export default function Ecommerce1Page() {
  return (
    <DashboardShell
      mode="light"
      accent="blue"
      profilePosition="topbar"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={mainProfile}
      teamName="Sugab HQ"
      teamAvatar="https://i.pravatar.cc/150?u=sugab-hq"
      teamMemberCount={24}
      pageTitle="Dashboard"
      primaryAction={{ label: "Add Order" }}
    >
      <div className="flex flex-col gap-6">
        {/* 3 stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WheelChartStatCard
            title="Total Revenue"
            subtitle="2 Jul - Today"
            value="$32,200"
            trend="10%"
            trendDirection="up"
            theme="blue"
            wheelColor="blue"
            wheelPercent={75}
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
          <ImageStatCard
            title="Customers"
            subtitle="2 Jul - Today"
            value="14,000"
            trend="10%"
            trendDirection="up"
            trendSubtitle="+150 today"
            avatars={[1, 2, 3].map((i) => `https://i.pravatar.cc/80?u=cust-${i}`)}
          />
        </div>

        {/* Statistic + Top Product */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
                <p className="text-sm text-fg-grey-500">Income and Expenses</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-indigo-50 flex items-center justify-center text-blue-600">
                  <ArrowRightUpLinear size={18} />
                </div>
                <div>
                  <div className="text-sm text-fg-grey-500">Income</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-fg-black">$26,201</span>
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
                    <span className="text-xl font-semibold text-fg-black">$18,120</span>
                    <span className="text-xs font-medium text-fg-red">10%</span>
                  </div>
                </div>
              </div>
            </div>
            <BarUpsideDownChart
              data={upsideDownBarData}
              accent="blue"
              activeIndex={5}
              showLabels
              showTooltip
              tooltipUpperValue="$680"
              tooltipLowerValue="$280"
              tooltipTrend="up"
              upperColor="bg-blue-600"
              lowerColor="bg-fg-red"
              height="h-[280px]"
            />
          </div>

          <HighlightCard
            title="Top Product"
            theme="blue"
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop"
            annotations={[
              { label: "Earphone", value: "JDL Earnote Pro 2", position: { top: "20%", left: "8%" } },
              { label: "340 Sales", value: "$24.982", position: { bottom: "30%", right: "8%" } },
            ]}
            products={[
              { image: "https://placehold.co/40x40/e0e7ff/1e40af?text=M", name: "Logic Wireless Mouse", subtitle: "340 Sales", value: "$17.678" },
              { image: "https://placehold.co/40x40/1e293b/fff?text=PS", name: "PS Controller", subtitle: "100 Sales", value: "$5,500" },
              { image: "https://placehold.co/40x40/fef3c7/d97706?text=KB", name: "Ximi Keyboard", subtitle: "50 Sales", value: "$2,500" },
            ]}
          />
        </div>

        {/* Top Region + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MapCard
            title="Top Region"
            subtitle="Sales by region"
            color="blue"
            variant="md"
            regions={regionsForMap}
            highlights={["north-america", "europe", "asia", "oceania"]}
            onMenuClick={() => {}}
          />

          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Recent Orders</h3>
                <p className="text-sm text-fg-grey-500">Recent orders</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="sm" iconLeft={<CalendarMinimalisticLinear size={14} />}>Select Dates</Button>
                <Button variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />}>Filters</Button>
                <Button color="blue" size="sm" iconRight={<AltArrowRightLinear size={14} />}>See More</Button>
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
        </div>
      </div>
    </DashboardShell>
  );
}
