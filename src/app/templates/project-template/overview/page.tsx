"use client";

import { KpiMetrics } from "@/blocks/kpi-metrics/kpi-metrics";
import { useRouter } from "next/navigation";
import { AddCircleLinear, FolderOpenLinear } from "@forge-ui-official/core/icons";
import { Avatar, AvatarGroup, Button, LineChartStatCard, ProgressBar, StatusBadge } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../_chrome";
import { clients, members, projects, tasks } from "../_data";
import { projectPageStackClass } from "../_density";
import { ProjectLogo } from "../_logos";

export default function ProjectTemplateOverviewPage() {
  const router = useRouter();
  return (
    <ProjectTemplateShell>
      <div className={projectPageStackClass}>
        <PageTop title="Overview" current="Overview" actions={<Button iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push("/templates/project-template/projects")}>New Project</Button>} />
        <KpiMetrics className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LineChartStatCard density="compact" size="wide" theme="white" title="Total Project" value="6,784" trend="4%" trendDirection="up" subtitle="+150 today" chartColor="purple" />
          <LineChartStatCard density="compact" size="wide" theme="white" title="Client" value={String(clients.length * 10)} trend="10%" trendDirection="up" subtitle="+8 today" chartColor="cyan" />
          <LineChartStatCard density="compact" size="wide" theme="white" title="Team Member" value={String(members.length * 8)} trend="2%" trendDirection="up" subtitle="+2 today" chartColor="green" />
          <LineChartStatCard density="compact" size="wide" theme="white" title="Task" value={String(tasks.length * 20)} trend="0%" trendDirection="down" subtitle="+5 today" chartColor="red" />
        </KpiMetrics>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <Button variant="unstyled" key={project.id} type="button" onClick={() => router.push(`/templates/project-template/projects/${project.id}`)} className="rounded-[20px] border border-fg-grey-200 bg-white p-4 text-left">
              <div className="flex items-center justify-between"><ProjectLogo name={project.logo} /><StatusBadge label={project.status} color={project.status === "Completed" ? "green" : project.status === "Blocked" ? "red" : project.status === "Draft" ? "grey" : "yellow"} /></div>
              <h2 className="mt-3 text-lg font-semibold text-fg-black">{project.name}</h2>
              <p className="mt-1 text-fg-grey-500">{project.client}</p>
              <div className="mt-3"><ProgressBar value={project.progress} color={project.status === "Completed" ? "green" : project.status === "Blocked" ? "red" : "purple"} /></div>
              <div className="mt-3 flex items-center justify-between"><AvatarGroup overflowCount={project.memberOverflow}>{project.members.map((src, index) => <Avatar key={index} src={src} size="sm" />)}</AvatarGroup><FolderOpenLinear size={18} color={"var(--fg-grey-800)"} /></div>
            </Button>
          ))}
        </section>
      </div>
    </ProjectTemplateShell>
  );
}
