"use client";

import { useState } from "react";
import { AddCircleLinear } from "solar-icon-set";
import { Button, CellActions, DataTable, FileTypeIcon, ToolbarFilterButton, ToolbarShowSelect } from "@forge-ui/react";
import type { ColumnDef } from "@forge-ui/react";
import { PageTop, ProjectTemplateShell } from "../_chrome";
import { fileItems, projects } from "../_data";
import { TemplateDeleteDialog, TemplateFormModal } from "../_modals";

type FileRow = { id: string; name: string; project: string; size: string; added: string };

const rows: FileRow[] = fileItems.flatMap((file, index) => projects.slice(0, 3).map((project) => ({
  id: `${file.name}-${project.id}`,
  name: file.name,
  project: project.name,
  size: file.size,
  added: `${12 + index} Dec 2023`,
})));

export default function FilesPage() {
  const [modal, setModal] = useState<"add" | "delete" | null>(null);
  const columns: ColumnDef<FileRow>[] = [
    { key: "name", header: "File Name", flex: true, render: (row) => <span className="flex items-center gap-3"><FileTypeIcon fileName={row.name} /> <span>{row.name}</span></span> },
    { key: "project", header: "Project", width: "w-[240px]", render: (row) => row.project },
    { key: "size", header: "Size", width: "w-[140px]", render: (row) => row.size },
    { key: "added", header: "Added", sortable: true, width: "w-[180px]", render: (row) => row.added },
    { key: "actions", header: "", width: "w-[100px]", render: () => <CellActions actions={["eye", "trash"]} onAction={(action) => action === "trash" && setModal("delete")} /> },
  ];
  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop title="File Manager" current="File Manager" actions={<Button iconLeft={<AddCircleLinear size={18} />} onClick={() => setModal("add")}>Add File</Button>} />
        <div className="flex justify-end gap-4"><ToolbarFilterButton label="Filters" /><ToolbarShowSelect value="10" /></div>
        <DataTable<FileRow> columns={columns} rows={rows} color="purple" showCheckbox showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-9 from 100" />
      </div>
      <TemplateFormModal
        title="Add Attachment"
        open={modal === "add"}
        fields={[
          { label: "File Name", placeholder: "Wireframe.doc" },
          { label: "Project", placeholder: "Select project" },
        ]}
        submitLabel="Upload"
        onClose={() => setModal(null)}
      />
      <TemplateDeleteDialog open={modal === "delete"} title="Delete Attachment?" description="Are you sure you want to delete this attachment?" onClose={() => setModal(null)} />
    </ProjectTemplateShell>
  );
}
