"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AddCircleLinear,
  CalendarMinimalisticLinear,
  Pen2Linear,
  MagniferLinear,
  UserPlusLinear,
} from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  Button,
  CellActions,
  CellMuted,
  FileCard,
  FileTypeIcon,
  ProgressBar,
  StatusBadge,
  TabBar,
  TextField,
  ToolbarFilterButton,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import type { StatusBadgeColor } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../../_chrome";
import { activityItems, fileItems, members, projects, tasks, type ProjectStatus, type Task } from "../../_data";
import { TemplateDeleteDialog, TemplateFormModal } from "../../_modals";
import { ProjectLogo } from "../../_logos";

const statusColors: Record<ProjectStatus, StatusBadgeColor> = {
  "In Progress": "yellow",
  Draft: "grey",
  Blocked: "red",
  Completed: "green",
};

const detailTabs = [
  { label: "Overview", value: "overview" },
  { label: "Task", value: "task" },
  { label: "Attachment", value: "attachment" },
  { label: "Teams", value: "teams" },
] as const;

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const project = useMemo(() => projects.find((item) => item.id === params.id) ?? projects[0], [params.id]);
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState<"edit" | "task" | "member" | "attachment" | "date" | "delete" | null>(null);

  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop
          title="Project Details"
          parent="Overview / Project"
          current="Project Details"
          actions={
            <div className="flex items-center gap-4">
              <Button variant="tertiary" iconLeft={<AddCircleLinear size={18} />} onClick={() => setModal("member")}>Invite</Button>
              <Button iconLeft={<Pen2Linear size={18} />} onClick={() => setModal("edit")}>Edit</Button>
            </div>
          }
        />

        <section className="rounded-[32px] bg-fg-grey-50 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-7">
              <ProjectLogo name={project.logo} size="lg" />
              <div>
                <h2 className="text-4xl font-semibold text-fg-black">{project.name.replace("...", "orm")}</h2>
                <div className="mt-5 flex items-center gap-5">
                  <StatusBadge label={project.status} color={statusColors[project.status]} />
                  <AvatarGroup overflowCount={project.memberOverflow}>
                    {project.members.map((src, index) => <Avatar key={index} src={src} size="sm" />)}
                  </AvatarGroup>
                  <Button variant="tertiary" iconLeft={<UserPlusLinear size={18} />} onClick={() => setModal("member")}>Invite</Button>
                </div>
              </div>
            </div>
            <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={18} />} onClick={() => setModal("date")}>{project.dueDate}</Button>
          </div>
        </section>

        <TabBar
          color="purple"
          surface="page"
          tabs={detailTabs.map((item) => ({ label: item.label, active: tab === item.value }))}
          onChange={(index) => setTab(detailTabs[index]?.value ?? "overview")}
        />

        {tab === "overview" && (
          <div className="grid grid-cols-[420px_1fr] gap-6">
            <aside className="flex flex-col gap-6">
              <Panel title="General Information">
                <Info label="Status" value={project.status} />
                <Info label="Client" value={project.client} />
                <Info label="Budget" value={project.budget} />
                <Info label="Due Date" value={project.dueDate} />
              </Panel>
              <Panel title="Teams" action={<Button variant="tertiary" onClick={() => setModal("member")}><AddCircleLinear size={18} /></Button>}>
                {members.slice(0, 4).map((member) => (
                  <button key={member.id} type="button" onClick={() => router.push(`/templates/project-template/members/${member.id}`)} className="flex items-center gap-4 py-3 text-left">
                    <Avatar src={member.avatar} size="md" />
                    <div>
                      <div className="font-semibold text-fg-black">{member.name}</div>
                      <div className="text-sm text-fg-grey-500">{member.role}</div>
                    </div>
                  </button>
                ))}
              </Panel>
              <Panel title="Attachment" action={<Button variant="tertiary" onClick={() => setModal("attachment")}><AddCircleLinear size={18} /></Button>}>
                {fileItems.map((file, index) => <FileCard key={index} file={{ id: file.name, name: file.name, size: file.size, state: "uploaded" }} />)}
              </Panel>
            </aside>
            <main className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <Metric title="Progress" value={project.spent} progress={project.progress} />
                <Metric title="Budget Spent" value={project.spent} progress={project.progress} color="red" />
              </div>
              <Panel title="Description"><p className="text-lg leading-8 text-fg-grey-700">{project.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis ut, varius at arcu.</p></Panel>
              <Panel title="Activity"><ActivityList /></Panel>
              <Panel title="Comments">
                {members.slice(0, 2).map((member, index) => (
                  <div key={member.id} className="flex gap-4 rounded-2xl border border-fg-grey-200 p-4">
                    <Avatar src={member.avatar} size="md" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-fg-black">{member.name}</h4>
                        <span className="text-sm text-fg-grey-500">{index === 0 ? "25 Jan 2022 08:30" : "23 Jan 2022 14:00"}</span>
                      </div>
                      <p className="mt-2 text-fg-grey-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                    </div>
                  </div>
                ))}
                <Button className="self-end">Post Comment</Button>
              </Panel>
            </main>
          </div>
        )}

        {tab === "task" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="max-w-[360px]">
                <TextField placeholder="Search..." iconLeft={<MagniferLinear size={18} color="#71717A" />} />
              </div>
              <div className="flex items-center gap-4">
                <Button variant="tertiary" onClick={() => setModal("task")}><AddCircleLinear size={18} /></Button>
                <Button iconLeft={<Pen2Linear size={18} />} onClick={() => setModal("edit")}>Edit</Button>
              </div>
            </div>
            <KanbanBoard onOpenTask={(task) => router.push(`/templates/project-template/tasks/${task.id}`)} onAddTask={() => setModal("task")} />
          </div>
        )}

        {tab === "attachment" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="max-w-[360px]"><TextField placeholder="Search..." iconLeft={<MagniferLinear size={18} color="#71717A" />} /></div>
              <div className="flex items-center gap-4">
                <ToolbarFilterButton label="Filters" />
                <ToolbarShowSelect value="12" />
                <Button iconLeft={<AddCircleLinear size={18} />} onClick={() => setModal("attachment")}>Upload</Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {attachmentRows.map((file) => <AttachmentTile key={file.name} file={file} onDelete={() => setModal("delete")} />)}
            </div>
          </div>
        )}

        {tab === "teams" && (
          <div className="grid grid-cols-[1fr_380px] gap-6">
            <KanbanBoard onOpenTask={(task) => router.push(`/templates/project-template/tasks/${task.id}`)} onAddTask={() => setModal("task")} compact />
            <TeamDrawer onAddMember={() => setModal("member")} />
          </div>
        )}
      </div>

      <TemplateFormModal
        title={modal === "edit" ? "Edit Project" : modal === "task" ? "Add Task" : modal === "member" ? "Add Member" : modal === "attachment" ? "Add Attachment" : "Edit Date"}
        open={modal === "edit" || modal === "task" || modal === "member" || modal === "attachment" || modal === "date"}
        fields={[
          { label: "Name", placeholder: "Name", value: modal === "edit" ? project.name : undefined },
          { label: "Status", placeholder: "Selected", value: modal === "edit" ? project.status : undefined },
          { label: "Date", placeholder: "24 Feb 2024", value: modal === "date" || modal === "edit" ? project.dueDate : undefined },
          { label: "Budget", placeholder: "$40,000.00", value: modal === "edit" ? project.budget : undefined },
        ]}
        onClose={() => setModal(null)}
      />
      <TemplateDeleteDialog open={modal === "delete"} title="Delete Attachment?" description="Are you sure you want to delete this attachment?" onClose={() => setModal(null)} />
    </ProjectTemplateShell>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6"><div className="mb-5 flex items-center justify-between"><h3 className="text-2xl font-semibold text-fg-black">{title}</h3>{action}</div><div className="flex flex-col gap-4">{children}</div></section>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-fg-grey-500">{label}</div><div className="mt-1 text-lg text-fg-black">{value}</div></div>;
}

function Metric({ title, value, progress, color = "purple" }: { title: string; value: string; progress: number; color?: "purple" | "red" }) {
  return <Panel title={title}><CellMuted>2 Jul - Today</CellMuted><div className="text-5xl font-semibold text-fg-black">{value}</div><ProgressBar value={progress} color={color} /><div className="flex justify-between text-sm"><span className="font-semibold text-fg-green-500">10%</span><span className="text-fg-grey-500">+150 today</span></div></Panel>;
}

function ActivityList() {
  return <div className="relative flex flex-col gap-8 border-l border-dashed border-fg-grey-300 pl-6">{activityItems.map((item) => <div key={item.title} className="relative"><span className="absolute -left-[34px] top-1 size-5 rounded-full border-4 border-fg-violet-100 bg-fg-violet" /><div className="flex justify-between"><h4 className="text-xl font-semibold text-fg-black">{item.title}</h4><span className="text-fg-grey-500">{item.time}</span></div><p className="mt-2 text-fg-grey-700"><span className="font-semibold text-fg-violet">Jay Parker</span> {item.body.replace("Jay Parker ", "")}</p></div>)}</div>;
}

const boardGroups = [
  { title: "To Do", tone: "grey", tasks: tasks.filter((_, index) => index % 4 === 0 || index === 2) },
  { title: "In Progress", tone: "yellow", tasks: tasks.filter((_, index) => index % 4 === 1 || index === 0) },
  { title: "Done", tone: "green", tasks: tasks.filter((task) => task.progress === 100) },
  { title: "Blocked", tone: "red", tasks: tasks.filter((task) => task.priority === "High") },
] as const;

function KanbanBoard({ onOpenTask, onAddTask, compact = false }: { onOpenTask: (task: Task) => void; onAddTask: () => void; compact?: boolean }) {
  return (
    <div className={`grid gap-5 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
      {boardGroups.map((group) => (
        <section key={group.title} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-fg-black">{group.title} ({group.tasks.length})</h3>
            <Button variant="tertiary" onClick={onAddTask}><AddCircleLinear size={18} /></Button>
          </div>
          {group.tasks.map((task) => <TaskBoardCard key={`${group.title}-${task.id}`} task={task} tone={group.tone} onOpen={() => onOpenTask(task)} />)}
        </section>
      ))}
    </div>
  );
}

function TaskBoardCard({ task, tone, onOpen }: { task: Task; tone: "grey" | "yellow" | "green" | "red"; onOpen: () => void }) {
  const progressColor = task.progress === 100 ? "green" : task.priority === "High" ? "red" : "yellow";
  return (
    <article className="rounded-[24px] border border-fg-grey-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <StatusBadge label={task.priority} color={task.priority === "High" ? "red" : task.priority === "Medium" ? "yellow" : "green"} />
        <CellActions actions={["pen"]} />
      </div>
      <button type="button" className="mt-4 text-left" onClick={onOpen}>
        <h4 className="text-lg font-semibold text-fg-black">{task.name.replace("...", "")}</h4>
        <p className="mt-2 text-sm leading-6 text-fg-grey-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel hendrerit ipsum.</p>
      </button>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-fg-grey-500">Progress</span>
          <span className={`font-semibold ${tone === "red" ? "text-fg-red" : tone === "green" ? "text-fg-green-500" : "text-fg-yellow"}`}>{task.progress === 45 ? "Blocked" : `${task.progress}%`}</span>
        </div>
        <ProgressBar value={task.progress || 8} color={progressColor} />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <AvatarGroup overflowCount={task.memberOverflow}>{task.members.slice(0, 3).map((src, index) => <Avatar key={index} src={src} size="sm" />)}</AvatarGroup>
        <span className="text-sm text-fg-grey-500">{task.dueDate}</span>
      </div>
    </article>
  );
}

const attachmentRows = [
  ...fileItems,
  { name: "Project Presentation.ppt", size: "100 KB", type: "ppt" },
  { name: "Photo Material.zip", size: "100 KB", type: "zip" },
  { name: "Brainstorming.pdf", size: "100 KB", type: "pdf" },
  { name: "Marketing Material.ppt", size: "100 KB", type: "ppt" },
  { name: "Pitching Template.ppt", size: "100 KB", type: "ppt" },
  { name: "New Logo.fig", size: "100 KB", type: "fig" },
  { name: "Project Alpha.pdf", size: "100 KB", type: "pdf" },
  { name: "Promo Banner.ppt", size: "100 KB", type: "ppt" },
];

function AttachmentTile({ file, onDelete }: { file: { name: string; size: string }; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-[20px] border border-fg-grey-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <FileTypeIcon fileName={file.name} />
        <div>
          <div className="font-semibold text-fg-black">{file.name}</div>
          <div className="text-sm text-fg-grey-500">{file.size}</div>
        </div>
      </div>
      <CellActions actions={["trash"]} onAction={onDelete} />
    </div>
  );
}

function TeamDrawer({ onAddMember }: { onAddMember: () => void }) {
  return (
    <aside className="rounded-[28px] border border-fg-grey-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-fg-black">Members</h3>
        <Button variant="tertiary" onClick={onAddMember}><AddCircleLinear size={18} /></Button>
      </div>
      <div className="flex flex-col gap-5">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar src={member.avatar} size="md" />
              <div>
                <div className="font-semibold text-fg-black">{member.name}</div>
                <div className="text-sm text-fg-grey-500">{member.role}</div>
              </div>
            </div>
            <CellActions actions={["chat", "mail"]} />
          </div>
        ))}
      </div>
      <Button className="mt-8 w-full" iconLeft={<UserPlusLinear size={18} />} onClick={onAddMember}>Add Member</Button>
    </aside>
  );
}
