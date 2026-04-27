"use client";

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
  AltArrowDownLinear,
  ArrowRightUpLinear,
  Pen2Linear,
  PhoneCallingLinear,
  LetterLinear,
} from "solar-icon-set";
import {
  Button,
  StatCard,
  ImageStatCard,
  BarChartStatCard,
  BubbleChart,
  BarChart,
  EventCard,
  ContactItem,
  DataTable,
  CellImageText,
  CellMuted,
  StatusBadge,
  KebabMenu,
  Avatar,
  AvatarGroup,
  ChartLegendItem,
  PlusIcon,
  IconButton,
  ListGroup,
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
  projects,
  teamMembers,
  statisticBarData,
  type ProjectRow,
} from "../_shared";

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
    <DashboardShell
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
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-fg-black">Overview</h1>
            <p className="text-sm text-fg-grey-500">Hello John, here&apos;s what happen with your project</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>Select Dates</Button>
            <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            <Button iconLeft={<PlusIcon size={16} />}>Add Project</Button>
          </div>
        </div>

        {/* 4 stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard size="wide" title="Total Project" value="6,784" trend="10%" trendDirection="up" subtitle="+150 today" icon={<FolderBoldDuotone size={20} />} badgeVariant="opacity" />
          <StatCard size="wide" title="In Progress" value="4,412" trend="5%" trendDirection="up" subtitle="+150 today" icon={<CartLargeBoldDuotone size={20} />} badgeVariant="opacity" />
          <StatCard size="wide" title="Completed" value="1,920" trend="2%" trendDirection="up" subtitle="+150 today" icon={<FolderWithFilesBoldDuotone size={20} />} badgeVariant="opacity" />
          <StatCard size="wide" title="Unfinished" value="329" trend="0%" trendDirection="down" subtitle="+150 today" icon={<BillListBoldDuotone size={20} />} badgeVariant="opacity" />
        </div>

        {/* Statistic + All Project bubble */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
                <p className="text-sm text-fg-grey-500">Income and expenses</p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-fg-grey-100 p-1 text-xs">
                <button className="px-3 py-1.5 rounded-full bg-white shadow-sm text-fg-black">All</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Income</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Expenses</button>
                <button className="px-3 py-1.5 text-fg-grey-500">Profit</button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: "Income", value: "$26,120", trend: "10%", up: true, color: "#7c3aed" },
                { label: "Expenses", value: "$18,000", trend: "10%", up: false, color: "#f97316" },
                { label: "Profit", value: "$7,820", trend: "10%", up: true, color: "#0ea5e9" },
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

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">All Project</h3>
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
              height={260}
            />
            <div className="flex items-center justify-center gap-4 text-xs text-fg-grey-700">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#fbbf24" }} /> In Progress</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#10b981" }} /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#f97316" }} /> Unfinished</span>
            </div>
          </div>
        </div>

        {/* Team of the Month + Client Growth + Daily Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ImageStatCard
              title="Team of the Month"
              value="Edward Allen"
              theme="purple"
              trend="146 Finished"
              trendDirection="up"
              trendSubtitle="80% Success"
              avatars={[]}
              action={<IconButton variant="ghost" shape="square" size="sm"><AltArrowRightLinear size={16} /></IconButton>}
            />
            <BarChartStatCard
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
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Daily Activity</h3>
                <p className="text-sm text-fg-grey-500">Today&apos;s activity</p>
              </div>
              <KebabMenu items={[{ label: "View all", onSelect: () => {} }]} />
            </div>
            {/* Hour header */}
            <div className="grid grid-cols-6 text-xs text-fg-grey-500 border-b border-fg-grey-200 pb-2">
              {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((h) => (
                <div key={h}>{h}</div>
              ))}
            </div>
            {/* Gantt rows */}
            <div className="relative flex flex-col gap-2 pt-2 min-h-[260px]">
              <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border-l border-fg-grey-100" />
                ))}
              </div>
              <div className="grid grid-cols-6 gap-1">
                <div className="col-start-2 col-span-1">
                  <EventCard
                    title="Design Check-In"
                    timeRange="10:00-11:00"
                    color="purple"
                    avatars={[1, 2, 3].map((i) => `https://i.pravatar.cc/80?u=daily-${i}`)}
                    overflowCount={6}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <div className="col-start-1 col-span-2">
                  <EventCard
                    title="Daily Meeting"
                    timeRange="09:00-11:00"
                    color="yellow"
                    avatars={[4, 5, 6].map((i) => `https://i.pravatar.cc/80?u=daily-${i}`)}
                    overflowCount={6}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <div className="col-start-3 col-span-1">
                  <EventCard
                    title="Project Brainstorming"
                    timeRange="11:00-12:00"
                    color="orange"
                    avatars={[7, 8, 9].map((i) => `https://i.pravatar.cc/80?u=daily-${i}`)}
                    overflowCount={6}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-1">
                <div className="col-start-5 col-span-1">
                  <EventCard
                    title="Project Kick Off"
                    timeRange="13:00-14:00"
                    color="cyan"
                    avatars={[10, 11, 12].map((i) => `https://i.pravatar.cc/80?u=daily-${i}`)}
                    overflowCount={6}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects + Team Member */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Projects</h3>
                <p className="text-sm text-fg-grey-500">Recent projects</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="sm" iconLeft={<CalendarMinimalisticLinear size={14} />}>Select Dates</Button>
                <Button variant="tertiary" size="sm">Filters</Button>
                <Button size="sm" iconRight={<AltArrowRightLinear size={14} />}>See More</Button>
              </div>
            </div>
            <DataTable<ProjectRow>
              columns={projectColumns}
              rows={projects}
              showPagination
              currentPage={1}
              totalPages={20}
              onPageChange={() => {}}
              paginationLabel="Showing 1-5 from 100"
            />
          </div>

          <ListGroup
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
    </DashboardShell>
  );
}
