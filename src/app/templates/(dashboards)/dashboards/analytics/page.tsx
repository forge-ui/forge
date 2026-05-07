"use client";

import {
  WidgetBoldDuotone,
  BoxBoldDuotone,
  BagBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  DocumentBoldDuotone,
  ChartBoldDuotone,
  CartLargeBoldDuotone,
  WalletBoldDuotone,
  TagBoldDuotone,
  CalendarMinimalisticLinear,
  VideocameraRecordLinear,
  PhoneLinear,
} from "solar-icon-set";
import {
  Button,
  ProgressStatCard,
  MapCard,
  DataTable,
  CellText,
  ProgressBadge,
  KebabMenu,
  ListGroup,
  ChartListItem,
} from "@forge-ui/react";
import type { AppLayoutMenuItem, ColumnDef, MapRegion } from "@forge-ui/react";
import {
  DashboardShell,
  WalletGoalCard,
  mainProfile,
  groupedStatisticBarData,
  groupedStatisticSeries,
  groupedStatisticTooltip,
  FigmaChartHeader,
  FigmaGroupedBarChart,
  FigmaMetricRow,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Dashboard", href: "/templates/dashboards/analytics" },
  { icon: <BoxBoldDuotone size={20} />, label: "Product", href: "#product" },
  { icon: <BagBoldDuotone size={20} />, label: "Orders", href: "#orders" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Leads", href: "#leads" },
  { icon: <DocumentBoldDuotone size={20} />, label: "Page", href: "#page" },
  { icon: <ChartBoldDuotone size={20} />, label: "Campaign", href: "#campaign" },
];

const visitSources = [
  { icon: VideocameraRecordLinear, accent: "black" as const, title: "Tiktok", subtitle: "Tiktok post", value: "1,240", trend: undefined, trendDirection: undefined },
  { icon: ChartBoldDuotone, accent: "blue" as const, title: "Google", subtitle: "Google ads", value: "1,189", trend: "7%", trendDirection: "up" as const },
  { icon: ChartBoldDuotone, accent: "blue" as const, title: "Facebook", subtitle: "Facebook post", value: "1,100", trend: undefined, trendDirection: undefined },
  { icon: PhoneLinear, accent: "blue" as const, title: "WhatsApp", subtitle: "Direct message", value: "908", trend: "8%", trendDirection: "up" as const },
  { icon: ChartBoldDuotone, accent: "purple" as const, title: "Instagram", subtitle: "Instagram post", value: "900", trend: "9%", trendDirection: "down" as const },
  { icon: ChartBoldDuotone, accent: "blue" as const, title: "Facebook", subtitle: "Youtube video", value: "870", trend: "4%", trendDirection: "up" as const },
];

const topCategoriesAnalytics = [
  { name: "Smartphone", subtitle: "640 Sales", price: "$24,500", delta: "5%", color: "purple" as const },
  { name: "Keyboard", subtitle: "120 Sales", price: "$12,500", delta: undefined, color: "blue" as const },
  { name: "Controller", subtitle: "132 Sales", price: "$12,251", delta: "8%", color: "blue" as const },
  { name: "Laptop", subtitle: "10 Sales", price: "$10,092", delta: "5%", color: "blue" as const },
  { name: "Headphone", subtitle: "198 Sales", price: "$9,992", delta: "7.5%", color: "purple" as const },
  { name: "Speaker", subtitle: "86 Sales", price: "$7,640", delta: undefined, color: "blue" as const },
];

type ReferralRow = {
  id: string;
  page: string;
  sessions: string;
  sessionsDelta: string;
  sessionsTrend: "up" | "down" | "flat";
  rate: string;
  rateDelta: string;
  rateTrend: "up" | "down" | "flat";
};

const referralRows: ReferralRow[] = [
  { id: "1", page: "Facebook", sessions: "1,259", sessionsDelta: "10%", sessionsTrend: "up", rate: "45.01%", rateDelta: "15%", rateTrend: "up" },
  { id: "2", page: "Google", sessions: "1,069", sessionsDelta: "5%", sessionsTrend: "down", rate: "41.90%", rateDelta: "0%", rateTrend: "flat" },
  { id: "3", page: "Direct Messages", sessions: "974", sessionsDelta: "12%", sessionsTrend: "up", rate: "35%", rateDelta: "8%", rateTrend: "down" },
  { id: "4", page: "Blueskit.com", sessions: "891", sessionsDelta: "0%", sessionsTrend: "flat", rate: "32%", rateDelta: "5%", rateTrend: "up" },
  { id: "5", page: "Intagram", sessions: "702", sessionsDelta: "0%", sessionsTrend: "flat", rate: "28.05%", rateDelta: "0%", rateTrend: "flat" },
];

type PerformingRow = {
  id: string;
  page: string;
  clicks: string;
  clicksDelta: string;
  clicksTrend: "up" | "down" | "flat";
  position: string;
  positionDelta: string;
  positionTrend: "up" | "down" | "flat";
};

const performingRows: PerformingRow[] = [
  { id: "1", page: "Homepage", clicks: "1,759", clicksDelta: "10%", clicksTrend: "up", position: "3.90", positionDelta: "10%", positionTrend: "up" },
  { id: "2", page: "Product List", clicks: "1,569", clicksDelta: "9%", clicksTrend: "down", position: "3.87", positionDelta: "9%", positionTrend: "down" },
  { id: "3", page: "Voucher List", clicks: "1,278", clicksDelta: "0%", clicksTrend: "flat", position: "3.01", positionDelta: "0%", positionTrend: "flat" },
  { id: "4", page: "Campaign.blackfriday.com", clicks: "907", clicksDelta: "12%", clicksTrend: "down", position: "2.76", positionDelta: "12%", positionTrend: "down" },
  { id: "5", page: "Sale.1212.com", clicks: "891", clicksDelta: "23%", clicksTrend: "up", position: "2.50", positionDelta: "23%", positionTrend: "up" },
];

const trendColor = (trend: "up" | "down" | "flat") => (trend === "up" ? "green" : trend === "down" ? "red" : "grey") as "green" | "red" | "grey";

const referralColumns: ColumnDef<ReferralRow>[] = [
  { key: "page", header: "Pages", flex: true, render: (r) => <CellText>{r.page}</CellText> },
  {
    key: "sessions",
    header: "Sessions",
    sortable: true,
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.sessions}</CellText>
        <ProgressBadge label={r.sessionsDelta} color={trendColor(r.sessionsTrend)} />
      </div>
    ),
  },
  {
    key: "rate",
    header: "Conv. Rate",
    sortable: true,
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.rate}</CellText>
        <ProgressBadge label={r.rateDelta} color={trendColor(r.rateTrend)} />
      </div>
    ),
  },
];

const performingColumns: ColumnDef<PerformingRow>[] = [
  { key: "page", header: "Pages", flex: true, render: (r) => <CellText>{r.page}</CellText> },
  {
    key: "clicks",
    header: "Clicks",
    sortable: true,
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.clicks}</CellText>
        <ProgressBadge label={r.clicksDelta} color={trendColor(r.clicksTrend)} />
      </div>
    ),
  },
  {
    key: "position",
    header: "Avg. Position",
    sortable: true,
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.position}</CellText>
        <ProgressBadge label={r.positionDelta} color={trendColor(r.positionTrend)} />
      </div>
    ),
  },
];

const regionsForMap: MapRegion[] = [
  { name: "United Kingdom", flag: "https://placehold.co/44x44/1e40af/fff?text=UK", salesLabel: "340 Session", value: "$17,678" },
  { name: "Spain", flag: "https://placehold.co/44x44/dc2626/fff?text=ES", salesLabel: "100 Session", value: "$5,500" },
  { name: "Indonesia", flag: "https://placehold.co/44x44/dc2626/fff?text=ID", salesLabel: "50 Session", value: "$2,500" },
];

export default function AnalyticsPage() {
  return (
    <DashboardShell
      mode="light"
      accent="purple"
      profilePosition="topbar"
      menuItems={menuItems}
      profile={mainProfile}
    >
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-fg-black">Dashboard</h1>
            <p className="text-sm text-fg-grey-500">Hello John, here&apos;s what happen with your page</p>
          </div>
          <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>Select Dates</Button>
        </div>

        {/* 4 progress stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 [&>*]:!w-full">
          <ProgressStatCard size="wide" title="Income" value="6,784" trend="10%" trendDirection="up" subtitle="+150 today" theme="white" progressValue={25} progressColor="purple" icon={<WalletBoldDuotone size={18} />} />
          <ProgressStatCard size="wide" title="Orders" value="4,412" trend="5%" trendDirection="down" subtitle="+150 today" theme="white" progressValue={25} progressColor="blue" icon={<CartLargeBoldDuotone size={18} />} />
          <ProgressStatCard size="wide" title="Profit" value="1,920" trend="2%" trendDirection="up" subtitle="+150 today" theme="white" progressValue={25} progressColor="green" icon={<ChartBoldDuotone size={18} />} />
          <ProgressStatCard size="wide" title="Expenses" value="329" trend="0%" trendDirection="down" subtitle="+150 today" theme="white" progressValue={25} progressColor="red" icon={<TagBoldDuotone size={18} />} />
        </div>

        {/* Statistic + Campaign */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <FigmaChartHeader title="Statistic" subtitle="Income and expenses" />
            <FigmaMetricRow series={groupedStatisticSeries.slice(0, 2)} />
            <FigmaGroupedBarChart
              data={groupedStatisticBarData.map((item) => ({ ...item, values: item.values.slice(0, 2) }))}
              series={groupedStatisticSeries.slice(0, 2)}
              tooltipItems={groupedStatisticTooltip.slice(0, 2)}
              heightClass="h-[300px]"
            />
          </div>

          <ListGroup
            title="Campaign"
            subtitle="Active campaign"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col gap-3">
                <WalletGoalCard title="Black Friday" date="22 Nov - 29 Nov 2024" amount="$40,000" progress={45} progressColor="purple" />
                <WalletGoalCard title="Audio 30% Off" date="01 Aug - 31 Nov 2024" amount="$40,000" progress={45} progressColor="green" />
                <div className="flex items-center gap-3 rounded-2xl border border-fg-grey-200 p-4">
                  <div className="size-10 rounded-full bg-fg-grey-100 flex items-center justify-center">
                    <UsersGroupTwoRoundedBoldDuotone size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-fg-black">New Users</div>
                  </div>
                  <KebabMenu items={[{ label: "View", onSelect: () => {} }]} />
                </div>
              </div>
            }
          />
        </div>

        {/* Top Region + Visit by Source + Top Category */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MapCard
            title="Top Region"
            subtitle="User session in each region"
            color="purple"
            variant="md"
            regions={regionsForMap}
            highlights={["north-america", "europe", "asia", "oceania"]}
            onMenuClick={() => {}}
          />

          <ListGroup
            title="Visit by Source"
            subtitle="Link clicked"
            action={<KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col">
                {visitSources.map((s, i) => (
                  <ChartListItem
                    key={i}
                    icon={s.icon}
                    accent={s.accent}
                    title={s.title}
                    subtitle={s.subtitle}
                    value={s.value}
                    trend={s.trend}
                    trendDirection={s.trendDirection}
                  />
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
                {topCategoriesAnalytics.map((c, i) => (
                  <ChartListItem
                    key={i}
                    icon={ChartBoldDuotone}
                    accent={c.color}
                    title={c.name}
                    subtitle={c.subtitle}
                    value={c.price}
                    trend={c.delta}
                    trendDirection="up"
                  />
                ))}
              </div>
            }
          />
        </div>

        {/* Top Referral Pages + Top Performing Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Top Referral Pages</h3>
                <p className="text-sm text-fg-grey-500">Based on session</p>
              </div>
              <Button size="sm" iconLeft={<DocumentBoldDuotone size={14} />}>Reports</Button>
            </div>
            <DataTable<ReferralRow>
              columns={referralColumns}
              rows={referralRows}
              showPagination
              currentPage={1}
              totalPages={3}
              onPageChange={() => {}}
              paginationLabel="Showing 1-5 from 15"
            />
          </div>

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Top Performing Pages</h3>
                <p className="text-sm text-fg-grey-500">Based on clicks</p>
              </div>
              <Button size="sm" iconLeft={<DocumentBoldDuotone size={14} />}>Reports</Button>
            </div>
            <DataTable<PerformingRow>
              columns={performingColumns}
              rows={performingRows}
              showPagination
              currentPage={1}
              totalPages={3}
              onPageChange={() => {}}
              paginationLabel="Showing 1-5 from 15"
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
