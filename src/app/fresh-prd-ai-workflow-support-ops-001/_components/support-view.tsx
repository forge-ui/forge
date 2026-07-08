import { SurfaceCard } from "@forge-ui-official/core";
import { RouteHeader } from "./route-header";
import { SupportTable } from "./support-table";

export function SupportView() {
  return (
    <main className="flex flex-col gap-5 p-5 lg:p-6">
      <RouteHeader eyebrow="Customer operations" title="Support triage queue" primaryLabel="Create recovery action" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SupportTable />
        <SurfaceCard title="SLA watch" subtitle="Next workflow and audit context">
          <div className="space-y-4 text-sm font-medium leading-5 tracking-fg text-fg-grey-900">
            <p>Open ticket SUP-1048 before the fallback retry so the customer update has verified evidence.</p>
            <p>Audit history links every support action to workflow run, datasource freshness, and recovery owner.</p>
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}
