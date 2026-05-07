"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AddCircleLinear, Pen2Linear, UserPlusLinear } from "solar-icon-set";
import { Avatar, AvatarGroup, Button, Checkbox, FileCard, ProgressBar, StatusBadge } from "@forge-ui/react";
import { PageTop, ProjectTemplateShell } from "../../_chrome";
import { activityItems, fileItems, tasks } from "../../_data";
import { TemplateDeleteDialog, TemplateFormModal } from "../../_modals";
import { ProjectLogo } from "../../_logos";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const task = useMemo(() => tasks.find((item) => item.id === params.id) ?? tasks[0], [params.id]);
  const [modal, setModal] = useState<"edit" | "member" | "delete" | null>(null);

  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop
          title="Task Details"
          parent="Overview / Project"
          current="Task Details"
          actions={<div className="flex gap-4"><Button variant="tertiary" iconLeft={<UserPlusLinear size={18} />} onClick={() => setModal("member")}>Add Member</Button><Button iconLeft={<Pen2Linear size={18} />} onClick={() => setModal("edit")}>Edit</Button></div>}
        />

        <section className="grid grid-cols-[420px_1fr] gap-6">
          <aside className="flex flex-col gap-6">
            <Panel title="General Information">
              <div className="flex items-center gap-4"><ProjectLogo name={task.logo} /><div><h2 className="text-2xl font-semibold text-fg-black">{task.name}</h2><p className="text-fg-grey-500">{task.client}</p></div></div>
              <Info label="Status" value={task.status} />
              <Info label="Due Date" value={task.dueDate} />
              <Info label="Priority" value={task.priority} />
            </Panel>
            <Panel title="Members" action={<Button variant="tertiary" onClick={() => setModal("member")}><AddCircleLinear size={18} /></Button>}>
              <AvatarGroup overflowCount={task.memberOverflow}>{task.members.map((src, index) => <Avatar key={index} src={src} size="md" />)}</AvatarGroup>
            </Panel>
            <Panel title="Attachment" action={<Button variant="tertiary"><AddCircleLinear size={18} /></Button>}>
              {fileItems.slice(0, 2).map((file) => <FileCard key={file.name} file={{ id: file.name, name: file.name, size: file.size, state: "uploaded" }} />)}
            </Panel>
          </aside>
          <main className="flex flex-col gap-6">
            <Panel title="Progress">
              <div className="text-6xl font-semibold text-fg-black">{task.progress}%</div>
              <ProgressBar value={task.progress} color={task.progress === 100 ? "green" : task.priority === "High" ? "red" : "yellow"} />
              <div className="flex gap-3"><StatusBadge label={task.priority} color={task.priority === "High" ? "red" : task.priority === "Medium" ? "yellow" : "green"} /><StatusBadge label={task.status} color={task.status === "Finished" ? "green" : task.status === "Not Started" ? "grey" : "yellow"} /></div>
            </Panel>
            <Panel title="Description"><p className="text-lg leading-8 text-fg-grey-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl dui, fringilla ac venenatis ut, varius at arcu.</p></Panel>
            <Panel title="Checklist" action={<Button variant="tertiary"><AddCircleLinear size={18} /></Button>}>
              {["Wireframe", "Moodboard", "Prototype"].map((item, index) => <div key={item} className="flex items-center justify-between rounded-2xl border border-fg-grey-200 p-4"><span className="text-fg-black">{item}</span><Checkbox color="purple" checked={index === 0} /></div>)}
            </Panel>
            <Panel title="Activity">
              {activityItems.map((item) => <div key={item.title} className="border-b border-fg-grey-200 py-4"><h3 className="text-xl font-semibold text-fg-black">{item.title}</h3><p className="text-fg-grey-700">{item.body}</p></div>)}
            </Panel>
          </main>
        </section>
      </div>

      <TemplateFormModal
        open={modal === "edit" || modal === "member"}
        title={modal === "member" ? "Add Member" : "Edit Task"}
        fields={[
          { label: "Task Name", placeholder: "Task Name", value: modal === "edit" ? task.name : undefined },
          { label: "Priority", placeholder: "Priority", value: modal === "edit" ? task.priority : undefined },
          { label: "Due Date", placeholder: "21 Oct 2022", value: modal === "edit" ? task.dueDate : undefined },
          { label: "Member", placeholder: "Select member" },
        ]}
        onClose={() => setModal(null)}
      />
      <TemplateDeleteDialog open={modal === "delete"} title="Delete Task?" description="Are you sure you want to delete this task?" onClose={() => setModal(null)} />
    </ProjectTemplateShell>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6"><div className="mb-5 flex items-center justify-between"><h3 className="text-2xl font-semibold text-fg-black">{title}</h3>{action}</div><div className="flex flex-col gap-4">{children}</div></section>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-fg-grey-500">{label}</div><div className="text-lg text-fg-black">{value}</div></div>;
}
