import { ActionFeedbackPanel } from "./action-feedback";
import { MetricStrip } from "./metric-strip";
import { RiskTable } from "./risk-table";
import { RouteHeader } from "./route-header";

export function OperationsView() {
  return (
    <main className="flex flex-col gap-5 p-5 lg:p-6">
      <RouteHeader eyebrow="AI workflow operations" title="AI workflow support control tower" />
      <MetricStrip />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <RiskTable />
        <ActionFeedbackPanel />
      </div>
    </main>
  );
}
