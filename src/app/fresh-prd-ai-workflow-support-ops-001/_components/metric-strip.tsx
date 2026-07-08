import { StatCard } from "@forge-ui-official/core";

export function MetricStrip() {
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      <StatCard title="Blocked incidents" value="3" trend="+1 today" trendDirection="up" subtitle="root cause linked" theme="white" size="wide" />
      <StatCard title="SLA impact scope" value="29" trend="tickets" trendDirection="up" subtitle="downstream support risk" theme="blue" size="wide" />
      <StatCard title="Evidence freshness" value="91%" trend="+8%" trendDirection="up" subtitle="after datasource sync" theme="green" size="wide" />
      <StatCard title="Recovery readiness" value="76%" trend="-4%" trendDirection="down" subtitle="fallback preflight pending" theme="yellow" size="wide" />
    </section>
  );
}
