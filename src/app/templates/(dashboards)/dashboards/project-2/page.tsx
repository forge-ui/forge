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
  ArrowRightUpLinear,
  PhoneCallingLinear,
  LetterLinear,
} from "solar-icon-set";
import {
  Button,
  ProgressStatCard,
  LineChartStatCard,
  WheelChartStatCard,
  SmoothLineChart,
  PieChart,
  ProjectCard,
  Avatar,
  IconButton,
  KebabMenu,
  ListGroup,
  PlusIcon,
  FullCalendar,
} from "@forge-ui/react";
import type { AppLayoutMenuItem, CalendarEvent } from "@forge-ui/react";
import {
  DashboardShell,
  mainProfile,
  teamMeta,
  teamMembers,
  months,
} from "../_shared";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/dashboards/project-2" },
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

const calendarEvents: CalendarEvent[] = [
  { day: 4, label: "Selected", color: "purple" },
  { day: 8, label: "Event", color: "red" },
  { day: 9, label: "Event", color: "yellow" },
  { day: 11, label: "Event", color: "green" },
  { day: 17, label: "Event", color: "purple" },
  { day: 23, label: "Event", color: "red" },
];

const recentProjects = [
  { id: "1", name: "Template Design", logo: "https://placehold.co/40x40/dbeafe/2563eb?text=T", labelText: "Label", labelColor: "red" as const, progress: 65, progressColor: "red" as const, date: "21 Oct 2022", members: ["p1", "p2", "p3", "p4"] },
  { id: "2", name: "Website Redesign", logo: "https://placehold.co/40x40/fed7aa/ea580c?text=W", labelText: "Label", labelColor: "green" as const, progress: 100, progressColor: "green" as const, date: "21 Oct 2022", members: ["p5", "p6"] },
  { id: "3", name: "Marketing Project", logo: "https://placehold.co/40x40/dbeafe/7c3aed?text=M", labelText: "Label", labelColor: "gray" as const, progress: 45, progressColor: "purple" as const, date: "21 Oct 2022", members: ["p7", "p8"] },
];

export default function Project2Page() {
  return (
    <DashboardShell
      variant="light-sb"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={mainProfile}
      teamName={teamMeta.teamName}
      teamAvatar={teamMeta.teamAvatar}
      teamMemberCount={teamMeta.teamMemberCount}
      pageTitle="Overview"
    >
      <div className="flex flex-col gap-6">
        {/* 3 stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProgressStatCard
            title="Active Project"
            subtitle="2 Jul - Today"
            value="4,412"
            trend="10%"
            trendDirection="up"
            theme="purple"
            progressValue={42}
            progressColor="red"
            icon={<FolderBoldDuotone size={20} />}
          />
          <LineChartStatCard
            title="Active Client"
            subtitle="2 Jul - Today"
            value="1,456"
            trend="10%"
            trendDirection="up"
            chartColor="green"
            chartDirection="down"
          />
          <WheelChartStatCard
            title="Team Assigned"
            subtitle="2 Jul - Today"
            value="324"
            trend="5%"
            trendDirection="up"
            wheelColor="red"
            wheelPercent={80}
          />
        </div>

        {/* Statistic + All Project pie */}
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
                { label: "Income", value: "$26,201", trend: "10%", up: true, color: "#7c3aed" },
                { label: "Expenses", value: "$18,120", trend: "10%", up: false, color: "#f97316" },
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
                { data: [0.4, 0.5, 0.6, 0.55, 0.7, 0.65, 0.7, 0.75, 0.8, 0.7, 0.65, 0.7].map((v) => v * 1000), color: "#2563eb" },
                { data: [0.5, 0.55, 0.6, 0.6, 0.55, 0.65, 0.6, 0.6, 0.65, 0.6, 0.55, 0.55].map((v) => v * 1000), color: "#fbbf24" },
                { data: [0.3, 0.35, 0.4, 0.4, 0.35, 0.45, 0.5, 0.45, 0.45, 0.5, 0.45, 0.4].map((v) => v * 1000), color: "#10b981" },
                { data: [0.55, 0.5, 0.55, 0.5, 0.55, 0.6, 0.55, 0.55, 0.5, 0.5, 0.45, 0.5].map((v) => v * 1000), color: "#ef4444" },
              ]}
              accent="purple"
              activeIndex={6}
              showTooltip
              tooltipItems={[
                { label: "Income", value: "$680", trend: "up", color: "#2563eb" },
                { label: "Expenses", value: "$280", trend: "down", color: "#fbbf24" },
                { label: "Profit", value: "$280", trend: "down", color: "#10b981" },
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
                <h3 className="text-lg font-semibold text-fg-black">All Project</h3>
                <p className="text-sm text-fg-grey-500">Based on status</p>
              </div>
              <KebabMenu items={[{ label: "Refresh", onSelect: () => {} }]} />
            </div>
            <div className="flex justify-center">
              <PieChart
                segments={[
                  { value: 40, color: "#2563eb" },
                  { value: 30, color: "#fbbf24" },
                  { value: 20, color: "#10b981" },
                  { value: 10, color: "#ef4444" },
                ]}
                size="lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#2563eb" }} /> Total Project</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#fbbf24" }} /> In Progress</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#10b981" }} /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: "#ef4444" }} /> Unfinished</span>
            </div>
          </div>
        </div>

        {/* Recent Project + Team Member + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ListGroup
            title="Recent Project"
            subtitle="Recent Active Project"
            action={<KebabMenu items={[{ label: "View all", onSelect: () => {} }]} />}
            items={
              <div className="flex flex-col gap-3">
                {recentProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    logo={p.logo}
                    title={p.name}
                    labelText={p.labelText}
                    labelColor={p.labelColor}
                    progress={p.progress}
                    progressColor={p.progressColor}
                    date={p.date}
                    avatars={p.members.map((u) => `https://i.pravatar.cc/80?u=${u}`)}
                    overflowCount={p.members.length > 4 ? p.members.length - 4 : undefined}
                  />
                ))}
              </div>
            }
          />

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

          <div className="rounded-3xl bg-white border border-fg-grey-200 p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg-black">Calendar</h3>
                <p className="text-sm text-fg-grey-500">Recent schedule</p>
              </div>
              <KebabMenu items={[{ label: "View all", onSelect: () => {} }]} />
            </div>
            <FullCalendar
              view="month"
              color="purple"
              year={2025}
              month={9}
              day={4}
              events={calendarEvents}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
