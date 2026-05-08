"use client";

import { useRouter } from "next/navigation";
import { AddCircleLinear, FolderOpenLinear } from "solar-icon-set";
import { Avatar, AvatarGroup, Button, LineChartStatCard, ProgressBar, StatusBadge } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../_chrome";
import { clients, members, projects, tasks } from "../_data";
import { ProjectLogo } from "../_logos";

export default function ProjectTemplateOverviewPage() {
  const router = useRouter();
  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop title="Overview" current="Overview" actions={<Button iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push("/templates/project-template/projects")}>New Project</Button>} />
        <div className="grid grid-cols-4 gap-6">
          <LineChartStatCard size="wide" theme="white" title="Total Project" value="6,784" trend="4%" trendDirection="up" subtitle="+150 today" chartColor="purple" />
          <LineChartStatCard size="wide" theme="white" title="Client" value={String(clients.length * 10)} trend="10%" trendDirection="up" subtitle="+8 today" chartColor="cyan" />
          <LineChartStatCard size="wide" theme="white" title="Team Member" value={String(members.length * 8)} trend="2%" trendDirection="up" subtitle="+2 today" chartColor="green" />
          <LineChartStatCard size="wide" theme="white" title="Task" value={String(tasks.length * 20)} trend="0%" trendDirection="down" subtitle="+5 today" chartColor="red" />
        </div>
        <section className="grid grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project) => (
            <button key={project.id} type="button" onClick={() => router.push(`/templates/project-template/projects/${project.id}`)} className="rounded-[28px] border border-fg-grey-200 bg-white p-6 text-left">
              <div className="flex items-center justify-between"><ProjectLogo name={project.logo} /><StatusBadge label={project.status} color={project.status === "Completed" ? "green" : project.status === "Blocked" ? "red" : project.status === "Draft" ? "grey" : "yellow"} /></div>
              <h2 className="mt-5 text-2xl font-semibold text-fg-black">{project.name}</h2>
              <p className="mt-1 text-fg-grey-500">{project.client}</p>
              <div className="mt-5"><ProgressBar value={project.progress} color={project.status === "Completed" ? "green" : project.status === "Blocked" ? "red" : "purple"} /></div>
              <div className="mt-5 flex items-center justify-between"><AvatarGroup overflowCount={project.memberOverflow}>{project.members.map((src, index) => <Avatar key={index} src={src} size="sm" />)}</AvatarGroup><FolderOpenLinear size={20} color="#71717A" /></div>
            </button>
          ))}
        </section>
      </div>
    </ProjectTemplateShell>
  );
}
