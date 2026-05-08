"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pen2Linear } from "solar-icon-set";
import { Avatar, Button, ChatBubble, ChatInputBar, DataTable, LineChartStatCard, TabBar } from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../../_chrome";
import { activityItems, members, projects, tasks, type Project, type Task } from "../../_data";
import { ProjectLogo } from "../../_logos";

const memberTabs = [
  { label: "Project", value: "project" },
  { label: "Task", value: "task" },
  { label: "Activity", value: "activity" },
  { label: "Chat", value: "chat" },
] as const;

export default function MemberDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const member = useMemo(() => members.find((item) => item.id === params.id) ?? members[0], [params.id]);
  const [tab, setTab] = useState("project");
  const projectColumns: ColumnDef<Project>[] = [
    { key: "name", header: "Project Name", flex: true, render: (row) => <button type="button" onClick={() => router.push(`/templates/project-template/projects/${row.id}`)} className="flex items-center gap-4 text-left"><ProjectLogo name={row.logo} /><span>{row.name}</span></button> },
    { key: "status", header: "Status", width: "w-[160px]", render: (row) => row.status },
    { key: "budget", header: "Budget", width: "w-[180px]", render: (row) => row.budget },
  ];
  const taskColumns: ColumnDef<Task>[] = [
    { key: "name", header: "Task Name", flex: true, render: (row) => <button type="button" onClick={() => router.push(`/templates/project-template/tasks/${row.id}`)} className="flex items-center gap-4 text-left"><ProjectLogo name={row.logo} /><span>{row.name}</span></button> },
    { key: "progress", header: "Progress", width: "w-[160px]", render: (row) => `${row.progress}%` },
    { key: "priority", header: "Priority", width: "w-[140px]", render: (row) => row.priority },
  ];

  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop title="Member Details" parent="Overview / Team Members" current="Member Details" actions={<Button iconLeft={<Pen2Linear size={18} />}>Edit</Button>} />
        <section className="grid grid-cols-[420px_1fr] gap-6">
          <aside className="rounded-[28px] border border-fg-grey-200 bg-white p-6 text-center">
            <div className="h-36 rounded-2xl bg-gradient-to-r from-fg-violet to-fg-yellow-100" />
            <Avatar src={member.avatar} size="lg" />
            <h2 className="mt-4 text-2xl font-semibold text-fg-black">{member.name}</h2>
            <p className="text-fg-grey-500">ID: {member.handle}</p>
            <div className="mt-8 space-y-4 text-left"><Info label="Member ID" value="ID011221" /><Info label="Role" value={member.role} /><Info label="Project Assigned" value={`${member.assigned} Project`} /><Info label="Email" value={member.email} /><Info label="Phone Number" value={member.phone} /><Info label="Last Online" value={member.lastOnline} /><Info label="Joined" value={member.joined} /></div>
          </aside>
          <main className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-6">
              <LineChartStatCard size="wide" theme="white" title="In Progress" value="11" trend="5%" trendDirection="up" subtitle="+2 today" chartColor="red" />
              <LineChartStatCard size="wide" theme="white" title="Not Started" value="4" trend="25%" trendDirection="up" subtitle="+1 today" chartColor="purple" />
              <LineChartStatCard size="wide" theme="white" title="Finished" value="28" trend="2%" trendDirection="up" subtitle="+2 today" chartColor="green" />
            </div>
            <TabBar color="purple" surface="page" tabs={memberTabs.map((item) => ({ label: item.label, active: tab === item.value }))} onChange={(index) => setTab(memberTabs[index]?.value ?? "project")} />
            {tab === "project" && <DataTable<Project> columns={projectColumns} rows={projects.slice(0, 5)} color="purple" showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-5 from 100" />}
            {tab === "task" && <DataTable<Task> columns={taskColumns} rows={tasks} color="purple" showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-5 from 100" />}
            {tab === "activity" && <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6">{activityItems.map((item) => <div key={item.title} className="border-b border-fg-grey-200 py-4"><h3 className="text-xl font-semibold text-fg-black">{item.title}</h3><p className="text-fg-grey-700">{item.body}</p></div>)}</section>}
            {tab === "chat" && <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6"><ChatBubble type="received" variant="text" content="Lorem ipsum dolor si amet" /><ChatBubble type="sent" color="purple" variant="text" content="Oke thank you ~~" /><ChatInputBar placeholder="Type a message..." /></section>}
          </main>
        </section>
      </div>
    </ProjectTemplateShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-fg-grey-500">{label}</div><div className="text-lg text-fg-black">{value}</div></div>;
}
