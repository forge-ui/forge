"use client";

import {
  WidgetBoldDuotone,
  UserBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  CartLargeBoldDuotone,
  ChartBoldDuotone,
  TagBoldDuotone,
  WalletBoldDuotone,
  CalendarMinimalisticLinear,
  AltArrowRightLinear,
  FilterLinear,
  PhoneCallingLinear,
  VideocameraRecordLinear,
  UsersGroupRoundedLinear,
  DocumentTextLinear,
  DownloadMinimalisticLinear,
} from "solar-icon-set";
import {
  Button,
  HighlightCard,
  BarChartStatCard,
  BarChart,
  MeterChart,
  DataTable,
  CellImageText,
  CellMuted,
  CellText,
  StatusBadge,
  Label,
  KebabMenu,
  ListGroup,
  ActivityCard,
  PlusIcon,
} from "@forge-ui/react";
import type {
  AppLayoutMenuItem,
  ColumnDef,
  StatusBadgeColor,
} from "@forge-ui/react";
import {
  DashboardShell,
  mainProfile,
  teamMeta,
  leads,
  statisticBarData,
  type LeadRow,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/dashboards/crm" },
  { icon: <UserBoldDuotone size={20} />, label: "Customer", href: "#customer" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Leads", href: "#leads" },
  { icon: <CartLargeBoldDuotone size={20} />, label: "Sales", href: "#sales" },
  { icon: <ChartBoldDuotone size={20} />, label: "Activity", href: "#activity" },
  { icon: <TagBoldDuotone size={20} />, label: "Campaign", href: "#campaign" },
];

const leadStatusColor: Record<LeadRow["status"], StatusBadgeColor> = {
  New: "blue",
  Hot: "red",
  Cold: "cyan",
  Warm: "yellow",
  Success: "green",
};

const leadColumns: ColumnDef<LeadRow>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    flex: true,
    render: (r) => <CellImageText src={r.avatar} title={r.name} subtitle={r.email} rounded="full" />,
  },
  {
    key: "status",
    header: "Status",
    width: "w-[120px]",
    render: (r) => <StatusBadge label={r.status} color={leadStatusColor[r.status]} />,
  },
  {
    key: "phone",
    header: "Phone",
    width: "w-[160px]",
    render: (r) => <CellText>{r.phone}</CellText>,
  },
  {
    key: "added",
    header: "Added",
    sortable: true,
    width: "w-[140px]",
    render: (r) => <CellMuted>{r.added}</CellMuted>,
  },
  {
    key: "actions",
    header: "",
    width: "w-[60px]",
    render: () => (
      <KebabMenu items={[{ label: "View", onSelect: () => {} }]} />
    ),
  },
];

export default function CrmPage() {
  return (
    <DashboardShell
      mode="light"
      accent="purple"
      profilePosition="topbar"
      menuItems={menuItems}
      profile={mainProfile}
      teamName={teamMeta.teamName}
      teamAvatar={teamMeta.teamAvatar}
      teamMemberCount={teamMeta.teamMemberCount}
    >
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-fg-black">Overview</h1>
            <p className="text-sm text-fg-grey-500">Hello John, here&apos;s what happen with your dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>Select Dates</Button>
            <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
          </div>
        </div>

        {/* 3 stats: Revenue (highlight) + Leads (bar) + Customer (bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 [&>*]:!w-full">
          <div className="rounded-card bg-fg-violet text-white p-5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-violet-700 opacity-50" />
            <div className="absolute -right-6 -top-6 size-32 rounded-full bg-violet-600 opacity-40" />
            <div className="relative flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="text-base font-medium text-white">Revenue</div>
                <div className="text-xs text-white/75">2 Jul - Today</div>
              </div>
              <div className="size-10 rounded-full bg-white/15 flex items-center justify-center">
                <WalletBoldDuotone size={18} />
              </div>
            </div>
            <div className="relative text-3xl font-semibold leading-9">1,200</div>
            <div className="relative">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/75">Progress</span>
                <span>25%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-violet-800/50 overflow-hidden">
                <div className="h-full rounded-full bg-fg-red" style={{ width: "25%" }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-300">10%</span>
                <span className="text-white/75">+$150 today</span>
              </div>
            </div>
          </div>

          <BarChartStatCard
            title="Leads"
            value="44,210"
            trend="10%"
            trendDirection="up"
            subtitle="+150 today"
            barColor="purple"
            bars={[16, 24, 32, 20, 40]}
          />
          <BarChartStatCard
            title="Customer"
            value="21,230"
            trend="10%"
            trendDirection="up"
            subtitle="+150 today"
            barColor="purple"
            bars={[14, 22, 18, 38, 28]}
          />
        </div>

        {/* Average Sales bar + Success Rate meter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Average Sales</h3>
                <p className="text-sm text-fg-grey-500">Income and expenses</p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-fg-grey-100 p-1 text-xs">
                <button className="px-3 py-1.5 rounded-full bg-white shadow-sm text-fg-black">All</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Income</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Expenses</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Profit</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-fg-violet flex items-center justify-center text-white">
                <WalletBoldDuotone size={18} />
              </div>
              <div>
                <div className="text-xs text-fg-grey-500">Income</div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-fg-black">$26,201</span>
                  <span className="text-xs font-medium text-emerald-500">10%</span>
                </div>
              </div>
            </div>
            <BarChart
              data={statisticBarData}
              accent="purple"
              activeIndex={6}
              showLabels
              showTooltip
              tooltipValue="$680"
              tooltipTrend="up"
              height="h-[260px]"
              barWidth="thin"
            />
          </div>

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Success Rate</h3>
                <p className="text-sm text-fg-grey-500">Conversion rate</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <MeterChart
              segments={[{ value: 75, color: "bg-fg-violet" }]}
              accent="purple"
              trend="5.8%"
              trendDirection="up"
              subtitle="+86 today"
            />
            <p className="text-center text-xs text-fg-grey-500 px-4">
              You succeed convert <span className="font-semibold text-fg-black">86</span> customer today, its higher than yesterday
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-fg-grey-200">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-fg-grey-500">Leads</span>
                <span className="text-lg font-semibold text-fg-black inline-flex items-center gap-1">44.2 <span className="text-emerald-500 text-xs">▲</span></span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-fg-grey-500">Customer</span>
                <span className="text-lg font-semibold text-fg-black inline-flex items-center gap-1">11.2k <span className="text-emerald-500 text-xs">▲</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Recent Leads</h3>
                <p className="text-sm text-fg-grey-500">Recent leads</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="sm" iconLeft={<CalendarMinimalisticLinear size={14} />}>Select Dates</Button>
                <Button variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />}>Filters</Button>
                <Button size="sm" iconRight={<AltArrowRightLinear size={14} />}>See More</Button>
              </div>
            </div>
            <DataTable<LeadRow>
              columns={leadColumns}
              rows={leads}
              showPagination
              currentPage={1}
              totalPages={20}
              onPageChange={() => {}}
              paginationLabel="Showing 1-5 from 100"
            />
          </div>

          <ListGroup
            title="Activity"
            subtitle="Recent activity"
            action={<KebabMenu items={[{ label: "View all", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col gap-4">
                <ActivityCard
                  icon={<UsersGroupTwoRoundedBoldDuotone size={16} />}
                  headerText="Status Changed"
                  datetime="04/10/25, 12:45"
                  avatar="https://i.pravatar.cc/40?u=actor-1"
                  title="Status Changed"
                  description="Customer Agung Ilham status changed to Warm"
                  metadata={[
                    { label: "From", value: <Label color="red">Hot</Label> },
                    { label: "To", value: <Label color="yellow">Warm</Label> },
                  ]}
                />
                <ActivityCard
                  icon={<VideocameraRecordLinear size={16} />}
                  headerText="Video Call"
                  datetime="02/10/25, 06:15"
                  avatar="https://i.pravatar.cc/40?u=actor-2"
                  title="Video Call"
                  description="You have had a meeting with Josh Adam"
                  metadata={[]}
                />
                <ActivityCard
                  icon={<UsersGroupRoundedLinear size={16} />}
                  headerText="Regular Meet"
                  datetime="24/09/24, 14:15"
                  avatar="https://i.pravatar.cc/40?u=actor-3"
                  title="Regular Meet"
                  description="You have had a meeting with John Bushmill"
                  metadata={[
                    { label: "Doc", value: <span className="inline-flex items-center gap-2 text-xs"><DocumentTextLinear size={14} /> Meeting MOM.doc</span> },
                  ]}
                />
              </div>
            }
          />
        </div>
      </div>
    </DashboardShell>
  );
}
