import Link from "next/link";
import { Button, SurfaceCard } from "@forge-ui-official/core";
import { basePath } from "./data";
import { DetailRail } from "./detail-rail";
import { RouteHeader } from "./route-header";

export function WorkflowDetailView() {
  return (
    <main className="flex flex-col gap-5 p-5 lg:p-6">
      <RouteHeader eyebrow="Workflow run detail" title="Workflow run detail RUN-8124" primaryHref={`${basePath}/recovery/new`} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SurfaceCard title="Root cause" subtitle="Impact, related entities, SOP, next action">
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-card bg-fg-grey-50 p-4 outline outline-1 outline-fg-grey-200">
              <h2 className="text-sm font-semibold tracking-fg text-fg-black">Decision reason</h2>
              <p className="mt-2 text-sm leading-5 tracking-fg text-fg-grey-900">
                LLM provider quota exhausted while datasource sync was 17 minutes stale, so the agent run returned incomplete evidence.
              </p>
            </section>
            <section className="rounded-card bg-fg-grey-50 p-4 outline outline-1 outline-fg-grey-200">
              <h2 className="text-sm font-semibold tracking-fg text-fg-black">Impact scope</h2>
              <p className="mt-2 text-sm leading-5 tracking-fg text-fg-grey-900">
                18 support tickets, 4 enterprise accounts, and one evidence export packet are downstream of this run.
              </p>
            </section>
            <section className="rounded-card bg-fg-grey-50 p-4 outline outline-1 outline-fg-grey-200">
              <h2 className="text-sm font-semibold tracking-fg text-fg-black">Related entities</h2>
              <p className="mt-2 text-sm leading-5 tracking-fg text-fg-grey-900">
                Similar incident INC-2399, related support ticket SUP-1048, and evidence packet EV-91 share the same fallback policy.
              </p>
            </section>
            <section className="rounded-card bg-fg-grey-50 p-4 outline outline-1 outline-fg-grey-200">
              <h2 className="text-sm font-semibold tracking-fg text-fg-black">SOP next action</h2>
              <p className="mt-2 text-sm leading-5 tracking-fg text-fg-grey-900">
                Refresh datasource evidence, retry with fallback provider, then notify the assigned support owner.
              </p>
            </section>
          </div>
          <div className="mt-5 flex gap-3">
            <Link href={`${basePath}/workflows`}>
              <Button color="grey" variant="tertiary" size="md">Back to board</Button>
            </Link>
            <Link href={`${basePath}/support`}>
              <Button color="blue" size="md">Open linked ticket</Button>
            </Link>
          </div>
        </SurfaceCard>
        <DetailRail />
      </div>
    </main>
  );
}
