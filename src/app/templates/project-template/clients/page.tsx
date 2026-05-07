"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AddCircleLinear, CloudDownloadLinear, MagniferLinear } from "solar-icon-set";
import { Avatar, Button, ButtonGroup, CellActions, CellMuted, CellTextSubtitle, DataTable, TextField, ToolbarDatepicker, ToolbarFilterButton, ToolbarShowSelect } from "@forge-ui/react";
import type { ColumnDef } from "@forge-ui/react";
import { PageTop, ProjectTemplateShell } from "../_chrome";
import { clients, type Client } from "../_data";
import { TemplateDeleteDialog, TemplateFormModal } from "../_modals";
import { ProjectLogo } from "../_logos";

export default function ClientsPage() {
  const router = useRouter();
  const [view, setView] = useState<"table" | "card">("table");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Client>(clients[0]);
  const rows = useMemo(() => clients, []);
  const openModal = (state: "add" | "edit" | "delete", client = clients[0]) => {
    setSelected(client);
    setModal(state);
  };

  const columns: ColumnDef<Client>[] = [
    { key: "name", header: "Name", flex: true, render: (row) => <button type="button" onClick={() => router.push(`/templates/project-template/clients/${row.id}`)} className="flex items-center gap-4 text-left"><Avatar src={row.avatar} size="md" /><CellTextSubtitle title={row.name} subtitle={row.email} /></button> },
    { key: "company", header: "Company", width: "w-[220px]", render: (row) => <span className="flex items-center gap-3"><ProjectLogo name={row.logo} size="sm" /><span>{row.company}</span></span> },
    { key: "phone", header: "Phone", width: "w-[180px]", render: (row) => <CellMuted>{row.phone}</CellMuted> },
    { key: "project", header: "Project", width: "w-[150px]", render: (row) => <CellMuted>{row.projects} Project</CellMuted> },
    { key: "added", header: "Added", sortable: true, width: "w-[180px]", render: (row) => <CellMuted>{row.added}</CellMuted> },
    { key: "actions", header: "", width: "w-[100px]", render: (row) => <CellActions actions={["eye", "pen", "trash"]} onAction={(action) => { if (action === "eye") router.push(`/templates/project-template/clients/${row.id}`); if (action === "pen") openModal("edit", row); if (action === "trash") openModal("delete", row); }} /> },
  ];

  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop title="Client" current="Client" actions={<div className="flex gap-4"><Button variant="tertiary" iconLeft={<CloudDownloadLinear size={20} />}>Export</Button><Button iconLeft={<AddCircleLinear size={20} />} onClick={() => openModal("add")}>Add New</Button></div>} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-[480px]"><TextField placeholder="Search..." iconLeft={<MagniferLinear size={18} color="#71717A" />} /></div>
            <ButtonGroup color="purple" shape="pill" activeIndex={view === "table" ? 0 : 1} items={[{ label: "Table" }, { label: "Card" }]} onChange={(index) => setView(index === 0 ? "table" : "card")} />
          </div>
          <div className="flex items-center gap-4"><ToolbarDatepicker label="Select Dates" /><ToolbarFilterButton label="Filters" /><ToolbarShowSelect value="10" /></div>
        </div>
        {view === "table" ? <DataTable<Client> columns={columns} rows={rows} color="purple" showCheckbox showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-10 from 100" /> : <ClientCards clients={rows} onEdit={(client) => openModal("edit", client)} onDelete={(client) => openModal("delete", client)} />}
      </div>
      <TemplateFormModal
        title={modal === "edit" ? "Client Edit" : "Client Add New"}
        open={modal === "add" || modal === "edit"}
        fields={[
          { label: "Name", value: selected.name },
          { label: "Email", placeholder: "user@mail.com", value: modal === "edit" ? selected.email : undefined },
          { label: "Company", placeholder: "Company", value: modal === "edit" ? selected.company : undefined },
          { label: "Phone", placeholder: "050 414 8778", value: modal === "edit" ? selected.phone : undefined },
        ]}
        onClose={() => setModal(null)}
      />
      <TemplateDeleteDialog open={modal === "delete"} title="Delete Client?" description={`Delete ${selected.name}? This action can't be undone.`} onClose={() => setModal(null)} />
    </ProjectTemplateShell>
  );
}

function ClientCards({ clients, onEdit, onDelete }: { clients: Client[]; onEdit: (client: Client) => void; onDelete: (client: Client) => void }) {
  const router = useRouter();
  return <div className="grid grid-cols-4 gap-6">{clients.slice(0, 8).map((client) => <article key={client.id} className="rounded-[28px] border border-fg-grey-200 bg-white p-6 text-center"><Avatar src={client.avatar} size="lg" /><h2 className="mt-4 text-xl font-semibold text-fg-black">{client.name}</h2><p className="text-fg-grey-500">{client.email}</p><div className="mt-5 flex items-center justify-center gap-2"><ProjectLogo name={client.logo} size="sm" /><span>{client.company}</span></div><p className="mt-3 text-fg-grey-500">{client.projects} Project</p><div className="mt-5 flex justify-center"><CellActions actions={["eye", "pen", "trash"]} onAction={(action) => { if (action === "eye") router.push(`/templates/project-template/clients/${client.id}`); if (action === "pen") onEdit(client); if (action === "trash") onDelete(client); }} /></div></article>)}</div>;
}
