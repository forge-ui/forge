"use client";

import { PagedDataTable } from "../../../_shared/paged-data-table";
import { ScheduleCard, GanttSchedule } from "@/app/templates/_shared/schedule-card";
import { MemberList } from "@/app/templates/_shared/member-list";

import { AppLayout, ChartHeader, GroupedBarChart, ChartMetricRow, Panel } from "@forge-ui-official/core";
import { KpiMetrics } from "@/blocks/kpi-metrics/kpi-metrics";
import { TrendChart } from "@/blocks/trend-chart/trend-chart";
import { RecentRecords } from "@/blocks/recent-records/recent-records";
import { DashboardHeader } from "@/app/templates/_shared/dashboard-header";

import {
  WidgetBoldDuotone,
  FolderBoldDuotone,
  UserBoldDuotone,
  FolderWithFilesBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  BillListBoldDuotone,
  StarBoldDuotone,
  TagBoldDuotone,
  CartLargeBoldDuotone,
  CalendarMinimalisticLinear,
  AltArrowRightLinear,
  PhoneCallingLinear,
  LetterLinear,
} from "@forge-ui-official/core/icons";
import {
  Button,
  StatCard,
  ImageStatCard,
  BarChartStatCard,
  BubbleChart,
  DataTable,
  CellImageText,
  CellMuted,
  StatusBadge,
  KebabMenu,
  Avatar,
  AvatarGroup,
  PlusIcon,
  IconButton,
  } from "@forge-ui-official/core";
import type {
  AppLayoutMenuItem,
  ColumnDef,
  StatusBadgeColor,
} from "@forge-ui-official/core";
import { mainProfile, teamMeta, projects, teamMembers, groupedStatisticBarData, groupedStatisticSeries, groupedStatisticTooltip, type ProjectRow } from "../_shared";
import { asset } from "@/lib/asset";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/dashboards/project-1" },
  { icon: <FolderBoldDuotone size={20} />, label: "Project", href: "#project" },
  { icon: <UserBoldDuotone size={20} />, label: "Client", href: "#client" },
  { icon: <FolderWithFilesBoldDuotone size={20} />, label: "File Manager", href: "#file" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Team Member", href: "#team" },
  { icon: <BillListBoldDuotone size={20} />, label: "Invoice", href: "#invoice" },
];

const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <StarBoldDuotone size={20} />, label: "Project Alpha", href: "#alpha" },
  { icon: <TagBoldDuotone size={20} />, label: "Black Friday", href: "#friday" },
];

const projectStatusColor: Record<ProjectRow["status"], StatusBadgeColor> = {
  "In Progress": "yellow",
  Pending: "grey",
  Unfinished: "red",
  Completed: "green",
};

const projectColumns: ColumnDef<ProjectRow>[] = [
  {
    key: "name",
    header: "Project Name",
    sortable: true,
    flex: true,
    render: (row) => <CellImageText src={row.iconUrl} title={row.name} subtitle={row.client} />,
  },
  {
    key: "due",
    header: "Due Date",
    sortable: true,
    width: "w-[140px]",
    render: (row) => <CellMuted>{row.due}</CellMuted>,
  },
  {
    key: "members",
    header: "Members",
    width: "w-[160px]",
    render: (row) => (
      <AvatarGroup overflowCount={row.members.length > 4 ? row.members.length - 4 : undefined}>
        {row.members.slice(0, 4).map((src, i) => <Avatar key={i} src={src} size="sm" />)}
      </AvatarGroup>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    width: "w-[140px]",
    render: (row) => <StatusBadge label={row.status} color={projectStatusColor[row.status]} />,
  },
];

export default function Project1Page() {
  return (
    <AppLayout
      notifications={99}
      messages={99}
      logoText="Protask"
      mode="dark"
      accent="purple"
      profilePosition="topbar"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={mainProfile}
      teamName={teamMeta.teamName}
      teamAvatar={teamMeta.teamAvatar}
      teamMemberCount={teamMeta.teamMemberCount}
    >
      <div className="flex flex-col gap-5">
        {/* Page header */}
        <DashboardHeader className="flex items-start justify-between max-sm:flex-col max-sm:items-stretch max-sm:gap-3 max-sm:[&>div]:min-w-0 max-sm:[&>div]:max-w-full max-sm:[&>div]:flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-fg-black">Overview</h1>
            <p className="text-sm text-fg-grey-500">Hello John, here&apos;s what happen with your project</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>Select Dates</Button>
            <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            <Button iconLeft={<PlusIcon size={16} />}>Add Project</Button>
          </div>
        </DashboardHeader>

        {/* 4 stats */}
        <KpiMetrics className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard density="compact" size="wide" title="Total Project" value="6,784" trend="10%" trendDirection="up" subtitle="+150 today" icon={<FolderBoldDuotone size={20} />} badgeVariant="opacity" />
          <StatCard density="compact" size="wide" title="In Progress" value="4,412" trend="5%" trendDirection="up" subtitle="+150 today" icon={<CartLargeBoldDuotone size={20} />} badgeVariant="opacity" />
          <StatCard density="compact" size="wide" title="Completed" value="1,920" trend="2%" trendDirection="up" subtitle="+150 today" icon={<FolderWithFilesBoldDuotone size={20} />} badgeVariant="opacity" />
          <StatCard density="compact" size="wide" title="Unfinished" value="329" trend="0%" trendDirection="down" subtitle="+150 today" icon={<BillListBoldDuotone size={20} />} badgeVariant="opacity" />
        </KpiMetrics>

        {/* Statistic + All Project bubble */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <TrendChart className="lg:col-span-2">
            <ChartHeader title="Statistic" subtitle="Income and expenses" tabs={["All", "Income", "Expenses", "Profit"]} />
            <ChartMetricRow series={groupedStatisticSeries} />
            <GroupedBarChart
              data={groupedStatisticBarData}
              series={groupedStatisticSeries}
              tooltipItems={groupedStatisticTooltip}
              heightClass="h-56"
            />
          </TrendChart>

          <Panel >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-fg-black">All Project</h3>
                <p className="text-sm text-fg-grey-500">Based on status</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <BubbleChart
              bubbles={[
                { value: 58.33, label: "58.33%", color: "bg-yellow-400" },
                { value: 25, label: "25%", color: "bg-emerald-500" },
                { value: 8, label: "8%", color: "bg-orange-500" },
              ]}
              height={220}
            />
            <div className="flex items-center justify-center gap-4 text-xs text-fg-grey-700">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "var(--fg-yellow-500)" }} /> In Progress</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "var(--fg-green-500)" }} /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "var(--fg-red-300)" }} /> Unfinished</span>
            </div>
          </Panel>
        </div>

        {/* Team of the Month + Client Growth + Daily Activity */}
        <KpiMetrics className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <ImageStatCard
              density="compact" className="!min-h-56"
              size="wide"
              title="Team of the Month"
              value="Edward Allen"
              theme="purple"
              trend="146 Finished"
              trendDirection="up"
              trendSubtitle="80% Success"
              backgroundImage={asset("/images/team/edward-allen.png")}
              backgroundImageAlt="Edward Allen"
              action={<IconButton variant="ghost" shape="square" size="sm"><AltArrowRightLinear size={16} /></IconButton>}
            />
            <BarChartStatCard
              density="compact"
              size="wide"
              title="Client Growth"
              subtitle="2 Jul - Today"
              value="1,456"
              trend="10%"
              trendDirection="up"
              barColor="purple"
              bars={[10, 30, 60, 95, 50, 40, 30]}
            />
          </div>

          {/* Daily Activity gantt */}
          <ScheduleCard gap="sm" className="lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-fg-black">Daily Activity</h3>
                <p className="text-sm text-fg-grey-500">Today&apos;s activity</p>
              </div>
              <KebabMenu items={[{ label: "View all", onSelect: () => {} }]} />
            </div>
            <GanttSchedule hours={["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]} entries={[
                { id: "event-1", columnClassName: "col-start-2 col-span-1", event: { title: "Design Check-In", timeRange: "10:00-11:00", color: "purple", avatars: [1, 2, 3].map(index => `https://i.pravatar.cc/80?u=daily-${index}`), overflowCount: 6 } },
                { id: "event-2", columnClassName: "col-start-1 col-span-2", event: { title: "Daily Meeting", timeRange: "09:00-11:00", color: "yellow", avatars: [4, 5, 6].map(index => `https://i.pravatar.cc/80?u=daily-${index}`), overflowCount: 6 } },
                { id: "event-3", columnClassName: "col-start-3 col-span-1", event: { title: "Project Brainstorming", timeRange: "11:00-12:00", color: "orange", avatars: [7, 8, 9].map(index => `https://i.pravatar.cc/80?u=daily-${index}`), overflowCount: 6 } },
                { id: "event-4", columnClassName: "col-start-5 col-span-1", event: { title: "Project Kick Off", timeRange: "13:00-14:00", color: "cyan", avatars: [10, 11, 12].map(index => `https://i.pravatar.cc/80?u=daily-${index}`), overflowCount: 6 } },
              ]} />
          </ScheduleCard>
        </KpiMetrics>

        {/* Projects + Team Member */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RecentRecords className="lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-fg-black">Projects</h3>
                <p className="text-sm text-fg-grey-500">Recent projects</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="sm" iconLeft={<CalendarMinimalisticLinear size={14} />}>Select Dates</Button>
                <Button variant="tertiary" size="sm">Filters</Button>
                <Button size="sm" iconRight={<AltArrowRightLinear size={14} />}>See More</Button>
              </div>
            </div>
            <PagedDataTable<ProjectRow>
              columns={projectColumns}
              rows={projects}
            />
          </RecentRecords>

          <MemberList
            density="compact"
            title="Team Member"
            subtitle="All Team Member"
            action={<KebabMenu items={[{ label: "View all", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col">
                {teamMembers.slice(0, 8).map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar src={m.avatar} online={m.online} size="md" />
                      <div>
                        <div className="text-sm font-semibold text-fg-black">{m.name}</div>
                        <div className="text-xs text-fg-grey-500">{m.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconButton variant="ghost" shape="square" size="sm"><PhoneCallingLinear size={14} /></IconButton>
                      <IconButton variant="ghost" shape="square" size="sm"><LetterLinear size={14} /></IconButton>
                    </div>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}
