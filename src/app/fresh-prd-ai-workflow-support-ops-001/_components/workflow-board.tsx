import Link from "next/link";
import { Button, ProgressBar, SurfaceCard } from "@forge-ui-official/core";
import { basePath, workflowRuns } from "./data";
import { StatusPill } from "./status-pill";

const lanes = ["Draft", "Active", "Failed", "Retrying"];

export function WorkflowBoard() {
  return (
    <section className="grid gap-4 xl:grid-cols-4">
      {lanes.map((lane) => (
        <SurfaceCard key={lane} title={lane} subtitle="Draft to active lifecycle" padding="sm">
          <div className="flex min-h-64 flex-col gap-3">
            {workflowRuns.filter((run) => run.stage === lane).map((run) => (
              <article key={run.id} className="rounded-card bg-fg-grey-50 p-4 outline outline-1 outline-fg-grey-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold tracking-fg text-fg-black">{run.name}</h2>
                    <p className="mt-1 text-xs font-medium tracking-fg text-fg-grey-700">{run.id} · {run.owner}</p>
                  </div>
                  <StatusPill label={run.stage} />
                </div>
                <div className="mt-3">
                  <ProgressBar value={run.progress} color={run.stage === "Failed" ? "red" : "blue"} size="sm" label={`${run.progress}%`} labelVariant="value" showPercentage />
                </div>
                <p className="mt-3 text-xs font-medium leading-4 tracking-fg text-fg-grey-900">Root cause: {run.rootCause}</p>
                <div className="mt-3 flex justify-between gap-2">
                  <Link href={`${basePath}/workflows/${run.id}`}>
                    <Button color="blue" variant="tertiary" size="sm">Open detail</Button>
                  </Link>
                  <Button color="purple" variant="secondary" size="sm">Advance run</Button>
                </div>
              </article>
            ))}
          </div>
        </SurfaceCard>
      ))}
    </section>
  );
}
