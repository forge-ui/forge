import { RouteHeader } from "./route-header";
import { WorkflowBoard } from "./workflow-board";

export function WorkflowsView() {
  return (
    <main className="flex flex-col gap-5 p-5 lg:p-6">
      <RouteHeader eyebrow="Automation runs" title="Workflow recovery board" primaryLabel="Create recovery action" />
      <WorkflowBoard />
    </main>
  );
}
