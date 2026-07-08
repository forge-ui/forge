import { SurfaceCard } from "@forge-ui-official/core";
import { evidenceItems } from "./data";
import { StatusPill } from "./status-pill";

export function EvidenceGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {evidenceItems.map((item) => (
        <SurfaceCard key={item.id} title={item.source} subtitle={item.id}>
          <div className="flex flex-col gap-4">
            <StatusPill label={item.state} />
            <dl className="space-y-2 text-sm font-medium tracking-fg text-fg-grey-900">
              <div className="flex justify-between gap-3"><dt>Datasource freshness</dt><dd>{item.freshness}</dd></div>
              <div className="flex justify-between gap-3"><dt>Owner</dt><dd>{item.owner}</dd></div>
            </dl>
          </div>
        </SurfaceCard>
      ))}
    </section>
  );
}
