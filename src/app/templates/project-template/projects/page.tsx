"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddCircleLinear,
  CloudDownloadLinear,
  Pen2Linear,
} from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  Button,
  ButtonGroup,
  CellActions,
  CellMuted,
  CellText,
  DataTable,
  LineChartStatCard,
  ProgressBar,
  StatusBadge,
  ToolbarDatepicker,
  ToolbarFilterButton,
  ToolbarPillTabs,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import type { ColumnDef, StatusBadgeColor } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../_chrome";
import { projects, type Project, type ProjectStatus } from "../_data";
import { TemplateDeleteDialog, TemplateFormModal } from "../_modals";
import { ProjectLogo } from "../_logos";

const statusColors: Record<ProjectStatus, StatusBadgeColor> = {
  "In Progress": "yellow",
  Draft: "grey",
  Blocked: "red",
  Completed: "green",
};

const statusTabs = ["All Status", "In Progress", "Completed", "Blocked"] as const;

type ModalState = "add" | "edit" | "delete" | null;

export default function ProjectTemplatePage() {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<(typeof statusTabs)[number]>("All Status");
  const [view, setView] = useState<"table" | "card">("table");
  const [modal, setModal] = useState<ModalState>(null);
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  const filteredProjects = useMemo(() => {
    if (activeStatus === "All Status") return projects;
    return projects.filter((project) => project.status === activeStatus);
  }, [activeStatus]);

  const openModal = (state: ModalState, project = projects[0]) => {
    setSelectedProject(project);
    setModal(state);
  };

  const columns: ColumnDef<Project>[] = [
    {
      key: "name",
      header: "Project Name",
      flex: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => router.push(`/templates/project-template/projects/${row.id}`)}
          className="flex items-center gap-4 text-left"
        >
          <ProjectLogo name={row.logo} />
          <CellText>{row.name}</CellText>
        </button>
      ),
    },
    { key: "client", header: "Client", width: "w-[180px]", render: (row) => <CellMuted>{row.client}</CellMuted> },
    { key: "dueDate", header: "Due Date", sortable: true, width: "w-[180px]", render: (row) => <CellMuted>{row.dueDate}</CellMuted> },
    {
      key: "members",
      header: "Contributor",
      width: "w-[180px]",
      render: (row) => (
        <AvatarGroup overflowCount={row.memberOverflow}>
          {row.members.map((src, index) => <Avatar key={index} src={src} size="sm" />)}
        </AvatarGroup>
      ),
    },
    { key: "budget", header: "Budget", sortable: true, width: "w-[180px]", render: (row) => <CellText>{row.budget}</CellText> },
    { key: "status", header: "Status", sortable: true, width: "w-[150px]", render: (row) => <StatusBadge label={row.status} color={statusColors[row.status]} /> },
    {
      key: "action",
      header: "",
      width: "w-[104px]",
      render: (row) => (
        <CellActions
          actions={["eye", "pen", "trash"]}
          onAction={(action) => {
            if (action === "eye") router.push(`/templates/project-template/projects/${row.id}`);
            if (action === "pen") openModal("edit", row);
            if (action === "trash") openModal("delete", row);
          }}
        />
      ),
    },
  ];

  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop
          title="Project"
          current="Project"
          actions={
            <div className="flex items-center gap-4">
              <Button variant="tertiary" iconLeft={<CloudDownloadLinear size={20} />}>Export</Button>
              <Button iconLeft={<AddCircleLinear size={20} />} onClick={() => openModal("add")}>Add New</Button>
            </div>
          }
        />

        <div className="grid grid-cols-4 gap-6">
          <LineChartStatCard size="wide" theme="white" title="Total Project" value="6,784" trend="4%" trendDirection="up" subtitle="+150 today" chartColor="purple" series={[18, 28, 21, 30, 29, 38, 33, 35, 52, 36, 41, 43, 44, 58]} />
          <LineChartStatCard size="wide" theme="white" title="In Progress" value="4,412" trend="10%" trendDirection="up" subtitle="+150 today" chartColor="cyan" series={[20, 24, 18, 29, 23, 32, 30, 44, 36, 42, 39, 51, 55, 66]} />
          <LineChartStatCard size="wide" theme="white" title="Completed" value="1,920" trend="2%" trendDirection="down" subtitle="+150 today" chartColor="green" series={[50, 48, 35, 30, 42, 39, 41, 48, 54, 46, 52, 51, 55, 53]} />
          <LineChartStatCard size="wide" theme="white" title="Blocked" value="140" trend="0%" trendDirection="down" subtitle="+50 today" chartColor="red" series={[60, 49, 45, 31, 28, 32, 30, 22, 18, 20, 16, 17, 15, 14]} />
        </div>

        <div className="h-px bg-fg-grey-200" />

        <div className="flex items-center justify-between">
          <ToolbarPillTabs
            color="purple"
            tabs={statusTabs.map((label) => ({ label, active: label === activeStatus }))}
            onChange={(index) => setActiveStatus(statusTabs[index])}
            className="min-w-[500px]"
          />
          <div className="flex items-center gap-4">
            <ButtonGroup
              color="purple"
              shape="pill"
              activeIndex={view === "table" ? 0 : 1}
              items={[{ label: "Table" }, { label: "Card" }]}
              onChange={(index) => setView(index === 0 ? "table" : "card")}
            />
            <ToolbarDatepicker label="Select Dates" />
            <ToolbarFilterButton label="Filters" />
            <ToolbarShowSelect value="10" options={[{ label: "10", value: "10" }, { label: "25", value: "25" }, { label: "50", value: "50" }]} />
          </div>
        </div>

        {view === "table" ? (
          <DataTable<Project>
            columns={columns}
            rows={filteredProjects}
            color="purple"
            checkboxColor="purple"
            showCheckbox
            showPagination
            currentPage={1}
            totalPages={5}
            paginationLabel={`Showing 1-${filteredProjects.length} from 100`}
          />
        ) : (
          <ProjectCardGrid projects={filteredProjects} onEdit={(project) => openModal("edit", project)} onDelete={(project) => openModal("delete", project)} />
        )}
      </div>

      <ProjectFormModal
        mode={modal === "edit" ? "edit" : "add"}
        open={modal === "add" || modal === "edit"}
        project={selectedProject}
        onClose={() => setModal(null)}
      />
      <TemplateDeleteDialog open={modal === "delete"} title="Delete Project?" description={`Are you sure you want to delete ${selectedProject.name}? This action can't be undone.`} onClose={() => setModal(null)} />
    </ProjectTemplateShell>
  );
}

function ProjectCardGrid({
  projects,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-6">
      {projects.map((project) => (
        <article key={project.id} className="rounded-[28px] border border-fg-grey-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <ProjectLogo name={project.logo} />
            <CellActions
              actions={["eye", "pen", "trash"]}
              onAction={(action) => {
                if (action === "eye") router.push(`/templates/project-template/projects/${project.id}`);
                if (action === "pen") onEdit(project);
                if (action === "trash") onDelete(project);
              }}
            />
          </div>
          <button type="button" className="mt-5 text-left" onClick={() => router.push(`/templates/project-template/projects/${project.id}`)}>
            <h2 className="text-xl font-semibold text-fg-black">{project.name}</h2>
            <p className="mt-1 text-sm text-fg-grey-500">{project.client}</p>
          </button>
          <div className="mt-5 flex items-center justify-between">
            <StatusBadge label={project.status} color={statusColors[project.status]} />
            <span className="text-sm text-fg-grey-500">{project.dueDate}</span>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-fg-grey-500">Progress</span>
              <span className="font-semibold text-fg-black">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} color={project.status === "Blocked" ? "red" : project.status === "Completed" ? "green" : "purple"} />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <AvatarGroup overflowCount={project.memberOverflow}>
              {project.members.map((src, index) => <Avatar key={index} src={src} size="sm" />)}
            </AvatarGroup>
            <span className="font-semibold text-fg-black">{project.budget}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProjectFormModal({
  mode,
  open,
  project,
  onClose,
}: {
  mode: "add" | "edit";
  open: boolean;
  project: Project;
  onClose: () => void;
}) {
  return (
    <TemplateFormModal
      open={open}
      title={mode === "add" ? "Add Project" : "Edit Project"}
      fields={[
        { label: "Project Name", value: mode === "edit" ? project.name : undefined, placeholder: "Project Name" },
        { label: "Client", value: mode === "edit" ? project.client : undefined, placeholder: "Select Client" },
        { label: "Due Date", value: mode === "edit" ? project.dueDate : undefined, placeholder: "Due Date" },
        { label: "Budget", value: mode === "edit" ? project.budget : undefined, placeholder: "$0.00" },
        { label: "Description", value: mode === "edit" ? project.description : undefined, placeholder: "Project description" },
      ]}
      submitIcon={mode === "edit" ? <Pen2Linear size={18} /> : <AddCircleLinear size={18} />}
      submitLabel={mode === "edit" ? "Save Changes" : "Add Project"}
      onClose={onClose}
    />
  );
}
