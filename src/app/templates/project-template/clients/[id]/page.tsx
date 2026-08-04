"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AddCircleLinear, Pen2Linear } from "solar-icon-set";
import { Avatar, Button, ChatBubble, ChatInputBar, DataTable, FileCard, TabBar } from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../../_chrome";
import { activityItems, clients, fileItems, projects, type Project } from "../../_data";
import { projectPageStackClass, projectPanelClass } from "../../_density";
import { ProjectLogo } from "../../_logos";

const clientTabs = [
  { label: "Project", value: "project" },
  { label: "Chat", value: "chat" },
  { label: "Activity", value: "activity" },
  { label: "Shared Files", value: "files" },
] as const;

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const client = useMemo(() => clients.find((item) => item.id === params.id) ?? clients[0], [params.id]);
  const [tab, setTab] = useState("project");
  const columns: ColumnDef<Project>[] = [
    { key: "name", header: "Project Name", flex: true, render: (row) => <button type="button" onClick={() => router.push(`/templates/project-template/projects/${row.id}`)} className="flex items-center gap-4 text-left"><ProjectLogo name={row.logo} /><span>{row.name}</span></button> },
    { key: "due", header: "Due Date", width: "w-[180px]", render: (row) => row.dueDate },
    { key: "budget", header: "Budget", width: "w-[180px]", render: (row) => row.budget },
  ];

  return (
    <ProjectTemplateShell>
      <div className={projectPageStackClass}>
        <PageTop title="Client Details" parent="Overview / Client" current="Client Details" actions={<Button iconLeft={<Pen2Linear size={18} />}>Edit</Button>} />
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className={`${projectPanelClass} text-center`}>
            <Avatar src={client.avatar} size="lg" />
            <h2 className="mt-3 text-xl font-semibold text-fg-black">{client.name}</h2>
            <p className="text-fg-grey-500">{client.email}</p>
            <div className="mt-4 flex justify-center gap-2"><ProjectLogo name={client.logo} size="sm" /><span>{client.company}</span></div>
            <div className="mt-5 space-y-3 text-left"><Info label="Phone Number" value={client.phone} /><Info label="Project" value={`${client.projects} Project`} /><Info label="Added" value={client.added} /></div>
          </aside>
          <main className="flex flex-col gap-4">
            <TabBar color="purple" surface="page" tabs={clientTabs.map((item) => ({ label: item.label, active: tab === item.value }))} onChange={(index) => setTab(clientTabs[index]?.value ?? "project")} />
            {tab === "project" && <DataTable<Project> columns={columns} rows={projects.slice(0, 5)} color="purple" showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-5 from 100" />}
            {tab === "chat" && <ChatPanel />}
            {tab === "activity" && <ActivityPanel />}
            {tab === "files" && <FilesPanel />}
          </main>
        </section>
      </div>
    </ProjectTemplateShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-sm text-fg-grey-500">{label}</div><div className="text-fg-black">{value}</div></div>;
}

function ChatPanel() {
  return <section className={projectPanelClass}><div className="flex flex-col gap-3"><ChatBubble type="received" variant="text" content="Lorem ipsum dolor si amet" /><ChatBubble type="sent" color="purple" variant="text" content="Oke Veronica thank you ~~" /><ChatBubble type="received" variant="file" fileName="Wireframe.doc" fileSize="300kb" /><ChatInputBar placeholder="Type a message..." /></div></section>;
}

function ActivityPanel() {
  return <section className={projectPanelClass}>{activityItems.map((item) => <div key={item.title} className="border-b border-fg-grey-200 py-3"><div className="flex justify-between"><h3 className="font-semibold text-fg-black">{item.title}</h3><span className="text-sm text-fg-grey-500">{item.time}</span></div><p className="mt-1 text-sm text-fg-grey-700">{item.body}</p></div>)}</section>;
}

function FilesPanel() {
  return <section className={projectPanelClass}><div className="mb-3 flex justify-end"><Button iconLeft={<AddCircleLinear size={18} />}>Add File</Button></div><div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{fileItems.map((file) => <FileCard key={file.name} file={{ id: file.name, name: file.name, size: file.size, state: "uploaded" }} />)}</div></section>;
}
