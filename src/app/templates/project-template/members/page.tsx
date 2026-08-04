"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddCircleLinear, CloudDownloadLinear, MagniferLinear } from "solar-icon-set";
import { Avatar, Button, ButtonGroup, CellActions, CellMuted, CellTextSubtitle, DataTable, TextField, ToolbarFilterButton, ToolbarShowSelect } from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../_chrome";
import { members, type Member } from "../_data";
import { projectPageStackClass } from "../_density";
import { TemplateDeleteDialog, TemplateFormModal } from "../_modals";

export default function MembersPage() {
  const router = useRouter();
  const [view, setView] = useState<"table" | "card">("table");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Member>(members[0]);
  const openModal = (state: "add" | "edit" | "delete", member = members[0]) => {
    setSelected(member);
    setModal(state);
  };

  const columns: ColumnDef<Member>[] = [
    { key: "name", header: "Name", flex: true, render: (row) => <button type="button" className="flex items-center gap-4 text-left" onClick={() => router.push(`/templates/project-template/members/${row.id}`)}><Avatar src={row.avatar} size="md" /><CellTextSubtitle title={row.name} subtitle={row.email} /></button> },
    { key: "role", header: "Role", width: "w-[220px]", render: (row) => <CellMuted>{row.role}</CellMuted> },
    { key: "assigned", header: "Project Assigned", width: "w-[190px]", render: (row) => <CellMuted>{row.assigned} Project</CellMuted> },
    { key: "phone", header: "Phone", width: "w-[180px]", render: (row) => <CellMuted>{row.phone}</CellMuted> },
    { key: "joined", header: "Joined", sortable: true, width: "w-[200px]", render: (row) => <CellMuted>{row.joined}</CellMuted> },
    { key: "actions", header: "", width: "w-[100px]", render: (row) => <CellActions actions={["eye", "pen", "trash"]} onAction={(action) => { if (action === "eye") router.push(`/templates/project-template/members/${row.id}`); if (action === "pen") openModal("edit", row); if (action === "trash") openModal("delete", row); }} /> },
  ];

  return (
    <ProjectTemplateShell>
      <div className={projectPageStackClass}>
        <PageTop title="Team Member" current="Team Members" actions={<div className="flex gap-4"><Button variant="tertiary" iconLeft={<CloudDownloadLinear size={20} />}>Export</Button><Button iconLeft={<AddCircleLinear size={20} />} onClick={() => openModal("add")}>Add New</Button></div>} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-[480px]"><TextField placeholder="Search..." iconLeft={<MagniferLinear size={18} color="#71717A" />} /></div>
            <ButtonGroup color="purple" shape="pill" activeIndex={view === "table" ? 0 : 1} items={[{ label: "Table" }, { label: "Card" }]} onChange={(index) => setView(index === 0 ? "table" : "card")} />
          </div>
          <div className="flex items-center gap-4"><ToolbarFilterButton label="Filters" /><ToolbarShowSelect value="10" /></div>
        </div>
        {view === "table" ? <DataTable<Member> columns={columns} rows={members} color="purple" showCheckbox showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-5 from 100" /> : <MemberCards members={members} onOpen={(member) => router.push(`/templates/project-template/members/${member.id}`)} onEdit={(member) => openModal("edit", member)} onDelete={(member) => openModal("delete", member)} />}
      </div>
      <TemplateFormModal
        title={modal === "edit" ? "Member Edit" : "Member Add New"}
        open={modal === "add" || modal === "edit"}
        fields={[
          { label: "Name", value: selected.name },
          { label: "Role", value: selected.role },
          { label: "Email", value: selected.email },
          { label: "Phone", value: selected.phone },
        ]}
        onClose={() => setModal(null)}
      />
      <TemplateDeleteDialog open={modal === "delete"} title="Delete Member?" description={`Delete ${selected.name}? This action can't be undone.`} onClose={() => setModal(null)} />
    </ProjectTemplateShell>
  );
}

function MemberCards({ members, onOpen, onEdit, onDelete }: { members: Member[]; onOpen: (member: Member) => void; onEdit: (member: Member) => void; onDelete: (member: Member) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {members.concat(members.slice(0, 5)).map((member, index) => (
        <article key={`${member.id}-${index}`} className="rounded-[20px] border border-fg-grey-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <button type="button" className="size-8 rounded-lg border border-fg-grey-300" aria-label="Select member" />
            <CellActions actions={["eye", "pen", "trash"]} onAction={(action) => { if (action === "eye") onOpen(member); if (action === "pen") onEdit(member); if (action === "trash") onDelete(member); }} />
          </div>
          <button type="button" className="mt-3 flex w-full flex-col items-center text-center" onClick={() => onOpen(member)}>
            <Avatar src={member.avatar} size="lg" />
            <h2 className="mt-3 text-lg font-semibold text-fg-black">{member.name}</h2>
            <p className="mt-1 text-fg-grey-500">{member.role}</p>
          </button>
          <div className="mt-4 border-t border-fg-grey-200 pt-3">
            <InfoLine label={index % 2 === 0 ? "Oksy.co" : "Target"} value={member.email} />
            <InfoLine label="Phone" value={member.phone} />
          </div>
        </article>
      ))}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return <div className="mt-2 flex items-center justify-between gap-3 text-sm"><span className="text-fg-grey-500">{label}</span><span className="truncate text-fg-black">{value}</span></div>;
}
