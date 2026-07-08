import { SurfaceCard } from "@forge-ui-official/core";

export function DetailRail() {
  return (
    <aside className="flex flex-col gap-4">
      <SurfaceCard title="Evidence" subtitle="Missing items and source freshness">
        <ul className="space-y-3 text-sm font-medium leading-5 tracking-fg text-fg-grey-900">
          <li>Provider route log ready · 2m ago</li>
          <li>Datasource sync lagging · 17m ago</li>
          <li>Support comments ready · 4m ago</li>
        </ul>
      </SurfaceCard>
      <SurfaceCard title="Activity and comments" subtitle="History and audit trail">
        <ul className="space-y-3 text-sm font-medium leading-5 tracking-fg text-fg-grey-900">
          <li>Mina attached fallback preflight result.</li>
          <li>Owen linked similar incident INC-2399.</li>
          <li>Lina moved related ticket SUP-1048 to Assigned.</li>
        </ul>
      </SurfaceCard>
    </aside>
  );
}
