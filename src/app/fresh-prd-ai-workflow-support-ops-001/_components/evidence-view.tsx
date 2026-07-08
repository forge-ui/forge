import { Button, SurfaceCard } from "@forge-ui-official/core";
import { EvidenceGrid } from "./evidence-grid";
import { RouteHeader } from "./route-header";

export function EvidenceView() {
  return (
    <main className="flex flex-col gap-5 p-5 lg:p-6">
      <RouteHeader eyebrow="Evidence governance" title="Evidence command center" primaryLabel="Export packet" />
      <EvidenceGrid />
      <SurfaceCard title="Datasource freshness" subtitle="Export packet readiness and audit guardrails">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="text-sm font-medium leading-5 tracking-fg text-fg-grey-900">
            Evidence is grouped by provider route log, datasource sync task, support comments, and workflow run history. Export packet actions stay disabled until stale datasource evidence is refreshed.
          </div>
          <div className="flex gap-3 lg:justify-end">
            <Button color="grey" variant="tertiary" size="md">Refresh evidence</Button>
            <Button color="blue" size="md">Export packet</Button>
          </div>
        </div>
      </SurfaceCard>
    </main>
  );
}
