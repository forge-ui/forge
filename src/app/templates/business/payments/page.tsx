"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ChartCard,
  DataTable,
  Grid,
  GridItem,
  ProgressStatCard,
  SmoothLineChart,
  StatusBadge,
  Toolbar,
  ToolbarActions,
  ToolbarPillTabs,
  ToolbarSearchInput,
  type ColumnDef,
} from "@forge-ui-official/core";
import { CalendarBoldDuotone, DangerCircleBoldDuotone, WalletMoneyBoldDuotone, ClockCircleBoldDuotone } from "@forge-ui-official/core/icons";
import { BASE, BusinessShell } from "../_chrome";
import { CONTRACTS, MONTHS, REVENUE_BY_MONTH, customerById, yuan } from "../_data";

type PaymentRow = { key: string; contractId: string; customer: string; title: string; milestone: string; date: string; amount: number; state: "已到账" | "待回款" | "已逾期" };

const TODAY = "2026-11-25";

const ROWS: PaymentRow[] = CONTRACTS.filter((contract) => contract.status !== "已退回").flatMap((contract) =>
  contract.milestones.map((milestone) => ({
    key: `${contract.id}-${milestone.title}`,
    contractId: contract.id,
    customer: customerById(contract.customerId)?.name ?? "",
    title: contract.title,
    milestone: milestone.title,
    date: milestone.date,
    amount: milestone.amount,
    state: milestone.done ? "已到账" : milestone.date < TODAY ? "已逾期" : "待回款",
  })),
);

const FILTERS = ["全部", "待回款", "已逾期", "已到账"] as const;

export default function PaymentsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("全部");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => ROWS.filter((row) => (filter === "全部" || row.state === filter) && (!query || `${row.customer}${row.title}`.includes(query))).sort((a, b) => a.date.localeCompare(b.date)), [filter, query]);
  const upcoming = ROWS.filter((row) => row.state === "待回款").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  const columns: ColumnDef<PaymentRow>[] = [
    { key: "date", header: "计划日期", valueKind: "identifier", width: "w-[120px]", render: (row) => row.date },
    { key: "customer", header: "客户", minWidth: 180, render: (row) => <span className="font-medium text-fg-black">{row.customer}</span> },
    { key: "title", header: "合同", minWidth: 200, render: (row) => <div className="flex flex-col"><span>{row.title}</span><span className="text-xs text-fg-grey-700">{row.contractId}</span></div> },
    { key: "milestone", header: "节点", render: (row) => row.milestone },
    { key: "amount", header: "金额", valueKind: "number", render: (row) => yuan(row.amount) },
    { key: "state", header: "状态", width: "w-[100px]", render: (row) => (row.state === "已到账" ? <span className="text-fg-grey-700">已到账</span> : <StatusBadge label={row.state} color={row.state === "已逾期" ? "red" : "yellow"} />) },
  ];

  return (
    <BusinessShell title="回款" secondaryAction={{ label: "导出对账单" }}>
      <div className="flex flex-col gap-5">
        <Grid columns={{ base: 1, sm: 2, lg: 4 }}>
          <ProgressStatCard width="full" density="compact" size="wide" theme="white" title="本月回款" value="¥103.2 万" trend="6.4%" subtitle="目标 ¥140 万" progressValue={74} progressColor="blue" icon={<WalletMoneyBoldDuotone size={18} />} />
          <ProgressStatCard width="full" density="compact" size="wide" theme="white" title="30 天内待回款" value="¥146 万" subtitle="5 笔" progressValue={40} progressColor="yellow" icon={<CalendarBoldDuotone size={18} />} />
          <ProgressStatCard width="full" density="compact" size="wide" theme="white" title="已逾期" value="¥0" subtitle="没有逾期款项" progressValue={0} progressColor="red" icon={<DangerCircleBoldDuotone size={18} />} />
          <ProgressStatCard width="full" density="compact" size="wide" theme="white" title="平均回款周期" value="23 天" trend="4 天" trendDirection="down" subtitle="较上季度" progressValue={60} progressColor="green" icon={<ClockCircleBoldDuotone size={18} />} />
        </Grid>

        <Grid>
          <GridItem span={{ base: "full", lg: 8 }}>
            <ChartCard title="回款趋势" subtitle="签约额与实际回款，单位：万元" className="h-full">
              <SmoothLineChart
                series={[
                  { data: REVENUE_BY_MONTH.signed, color: "bg-fg-blue-500", label: "签约" },
                  { data: REVENUE_BY_MONTH.received, color: "bg-fg-cyan-500", fillArea: true, label: "回款" },
                ]}
                activeIndex={10}
                showTooltip
                tooltipItems={[
                  { color: "bg-fg-blue-500", label: "签约", value: `¥${REVENUE_BY_MONTH.signed[10]} 万` },
                  { color: "bg-fg-cyan-500", label: "回款", value: `¥${REVENUE_BY_MONTH.received[10]} 万` },
                ]}
                yDomain={[0, 150]}
                showYAxis
                yAxisLabels={["150万", "100万", "50万", "0"]}
                xAxisLabels={MONTHS}
                height="h-72"
              />
            </ChartCard>
          </GridItem>
          <GridItem span={{ base: "full", lg: 4 }}>
            <ChartCard title="即将到期" subtitle="按计划日期">
              <div className="flex w-full flex-col">
                {upcoming.map((row) => (
                  <Button variant="unstyled" key={row.key} type="button" onClick={() => router.push(`${BASE}/contracts/${row.contractId}`)} className="flex items-center gap-3 border-b border-fg-grey-100 py-3 text-left last:border-b-0">
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-fg-grey-50 py-1.5">
                      <span className="text-[10px] text-fg-grey-700">{Number(row.date.slice(5, 7))}月</span>
                      <span className="text-base font-semibold leading-5 text-fg-black">{Number(row.date.slice(8))}</span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-fg-black">{row.customer}</span>
                      <span className="truncate text-xs text-fg-grey-700">{row.title} · {row.milestone}</span>
                    </div>
                    <span className="text-sm tabular-nums text-fg-black">{yuan(row.amount)}</span>
                  </Button>
                ))}
              </div>
            </ChartCard>
          </GridItem>
        </Grid>

        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="搜索客户或合同" value={query} onChange={setQuery} />}
          right={
            <ToolbarActions>
              <ToolbarPillTabs color="blue" tabs={FILTERS.map((item) => ({ label: item, active: item === filter }))} onChange={(index) => setFilter(FILTERS[index])} />
            </ToolbarActions>
          }
        />
        <DataTable<PaymentRow> title="回款计划" subtitle={`${rows.length} 笔`} columns={columns} rows={rows} getRowKey={(row) => row.key} color="blue" />
      </div>
    </BusinessShell>
  );
}
