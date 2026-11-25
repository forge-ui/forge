"use client";

import { useState } from "react";
import {
  Avatar,
  BarChartStatCard,
  ChartHeader,
  ChartMetricRow,
  DonutChart,
  GroupedBarChart,
  Grid,
  GridItem,
  LineChartStatCard,
  MultilayerDonutChart,
  Panel,
  SmoothLineChart,
  WheelChartStatCard,
} from "@aideui/core";
import { TrendChart } from "@/blocks/trend-chart/trend-chart";
import { BusinessShell } from "../_chrome";
import { CUSTOMERS, MONTHS, SALES } from "../_data";

const PERIODS = ["按月", "按季度"];

const TARGET_SERIES = [
  { label: "实际签约", colorClass: "bg-fg-blue-500", value: "¥1,042 万", trend: "up" as const, trendValue: "24.5%" },
  { label: "目标", colorClass: "bg-fg-grey-300", value: "¥1,200 万" },
];
const MONTHLY = { actual: [62, 68, 71, 69, 78, 84, 88, 86, 95, 101, 112, 128], target: [80, 80, 85, 90, 90, 95, 100, 100, 105, 110, 115, 120] };
const QUARTERLY = { actual: [201, 231, 269, 341], target: [245, 275, 305, 345] };

const PRODUCTS = [
  { label: "数据集开发平台", value: 437, percent: 84, color: "var(--fg-blue-500)" },
  { label: "智能体工场", value: 323, percent: 65, color: "var(--fg-cyan-500)" },
  { label: "SaaS 订阅", value: 198, percent: 48, color: "var(--fg-violet)" },
];

const REGIONS = [
  { name: "华东", value: 386, share: 37 },
  { name: "华北", value: 271, share: 26 },
  { name: "华南", value: 188, share: 18 },
  { name: "西南", value: 115, share: 11 },
  { name: "其他", value: 82, share: 8 },
];

const REGION_COLORS = ["var(--fg-blue-500)", "var(--fg-cyan-500)", "var(--fg-violet)", "var(--fg-yellow)", "var(--fg-grey-300)"];

const FUNNEL = [
  { stage: "线索", count: 1280, color: "bg-fg-blue-100 text-fg-blue-500" },
  { stage: "有效商机", count: 412, color: "bg-fg-blue-200 text-fg-blue-500" },
  { stage: "方案演示", count: 186, color: "bg-fg-blue-300 text-white" },
  { stage: "商务谈判", count: 74, color: "bg-fg-blue-400 text-white" },
  { stage: "签约", count: 39, color: "bg-fg-blue-500 text-white" },
];

const INDUSTRY = [
  { label: "能源", value: 24, color: "var(--fg-blue-500)" },
  { label: "医疗", value: 21, color: "var(--fg-cyan-500)" },
  { label: "制造", value: 18, color: "var(--fg-violet)" },
  { label: "教育", value: 15, color: "var(--fg-yellow)" },
  { label: "其他", value: 22, color: "var(--fg-grey-300)" },
];

const TEAM = [
  { ...SALES.lin, color: "bg-fg-blue-500", signed: "¥398 万", deals: 9, rate: "34%", data: [18, 22, 21, 26, 29, 31, 34] },
  { ...SALES.chen, color: "bg-fg-cyan-500", signed: "¥321 万", deals: 7, rate: "29%", data: [16, 17, 21, 19, 24, 27, 29] },
  { ...SALES.zhou, color: "bg-fg-violet", signed: "¥186 万", deals: 11, rate: "41%", data: [9, 12, 11, 15, 14, 17, 18] },
  { ...SALES.jiang, color: "bg-fg-green-500", signed: "¥137 万", deals: 5, rate: "22%", data: [8, 9, 11, 10, 12, 11, 13] },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState(PERIODS[0]);
  const source = period === "按月" ? MONTHLY : QUARTERLY;
  const labels = period === "按月" ? MONTHS : ["Q1", "Q2", "Q3", "Q4"];
  const top = Math.ceil(Math.max(...source.actual, ...source.target) / 10) * 10;
  const active = source.actual.length - 1;
  const renewals = [...CUSTOMERS].sort((a, b) => a.renewalDate.localeCompare(b.renewalDate)).slice(0, 5);

  return (
    <BusinessShell title="报表" secondaryAction={{ label: "导出 PDF" }} primaryAction={{ label: "订阅周报" }}>
      <div className="flex flex-col gap-5">
        <Grid columns={{ base: 1, sm: 2, lg: 4 }}>
          <BarChartStatCard width="full" density="compact" size="wide" theme="white" title="年度签约" value="¥1,042 万" trend="24.5%" subtitle="较去年" barColor="purple" bars={[40, 46, 48, 47, 53, 57, 60, 58, 64, 68, 76, 86]} />
          <WheelChartStatCard width="full" density="compact" size="wide" theme="white" title="目标完成率" value="86.8%" trend="6.2%" subtitle="年度目标 ¥1,200 万" wheelColor="blue" wheelPercent={87} />
          <LineChartStatCard width="full" density="compact" size="wide" theme="white" title="平均客单价" value="¥26.7 万" trend="9.1%" subtitle="39 份新签" chartColor="cyan" series={[19, 21, 20, 22, 23, 22, 24, 25, 24, 26, 25, 27]} />
          <WheelChartStatCard width="full" density="compact" size="wide" theme="white" title="续约率" value="94.6%" trend="0.4%" trendDirection="down" subtitle="3 家待续约" wheelColor="green" wheelPercent={95} />
        </Grid>

        <Grid>
          <GridItem span={{ base: "full", lg: 8 }}>
            <TrendChart className="h-full">
              <ChartHeader title="签约额与目标" subtitle="单位：万元" tabs={PERIODS} activeTab={period} onTabChange={setPeriod} />
              <ChartMetricRow series={TARGET_SERIES} />
              <GroupedBarChart
                key={period}
                data={labels.map((label, index) => ({ label, values: [source.actual[index], source.target[index]] }))}
                series={TARGET_SERIES}
                activeIndex={active}
                tooltipItems={[
                  { label: "实际签约", value: `¥${source.actual[active]} 万`, colorClass: "bg-fg-blue-500", trend: "up" },
                  { label: "目标", value: `¥${source.target[active]} 万`, colorClass: "bg-fg-grey-300" },
                ]}
                yAxisLabels={[1, 0.75, 0.5, 0.25, 0].map((ratio) => (ratio === 0 ? "0" : `${Math.round(top * ratio)}万`))}
                heightClass="h-72"
              />
            </TrendChart>
          </GridItem>
          <GridItem span={{ base: "full", lg: 4 }}>
            <Panel title="产品线完成度" subtitle="实际签约 / 年度目标" className="h-full">
              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <div className="w-52">
                  <MultilayerDonutChart layers={PRODUCTS.map((item) => ({ value: item.percent, color: item.color }))} centerValue="¥958万" subtitle="三条主线合计" />
                </div>
                <div className="flex w-full flex-col gap-3">
                  {PRODUCTS.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                      <span className="flex-1 text-fg-grey-900">{item.label}</span>
                      <span className="tabular-nums text-fg-grey-700">¥{item.value} 万</span>
                      <span className="w-10 text-right font-medium tabular-nums">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </GridItem>
        </Grid>

        <Grid columns={{ base: 1, lg: 3 }}>
          <Panel title="销售漏斗" subtitle="本年累计，百分比为相对线索的转化率">
            <div className="flex flex-col items-center gap-1.5 py-2">
              {FUNNEL.map((step, index) => (
                <div key={step.stage} className={`flex h-11 items-center justify-between rounded-xl px-4 text-sm ${step.color}`} style={{ width: `${100 - index * 12}%` }}>
                  <span className="font-medium">{step.stage}</span>
                  <span className="tabular-nums">
                    {step.count.toLocaleString("zh-CN")}
                    {index > 0 && <span className="ml-2 opacity-80">{((step.count / FUNNEL[0].count) * 100).toFixed(1)}%</span>}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="区域分布" subtitle="本年签约额">
            <div className="flex flex-col gap-4 py-1">
              {REGIONS.map((region, index) => (
                <div key={region.name} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-fg-black">{region.name}</span>
                    <span className="tabular-nums text-fg-grey-700">
                      ¥{region.value} 万 · <span className="text-fg-black">{region.share}%</span>
                    </span>
                  </div>
                  <span className="h-2.5 overflow-hidden rounded-full bg-fg-grey-100">
                    <span className="block h-full rounded-full" style={{ width: `${(region.share / REGIONS[0].share) * 100}%`, background: REGION_COLORS[index] }} />
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="客户行业" subtitle={`${CUSTOMERS.length + 1634} 家客户`}>
            <div className="flex items-center gap-5 py-2">
              <div className="w-32 shrink-0">
                <DonutChart segments={INDUSTRY.map((item) => ({ value: item.value, label: item.label, color: item.color }))} size="sm" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                {INDUSTRY.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <span className="size-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="flex-1 text-fg-grey-900">{item.label}</span>
                    <span className="font-medium tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Grid>

        <Grid columns={{ base: 1, lg: 2 }}>
          <Panel title="团队业绩" subtitle="本年签约、成单数和赢单率">
            <div className="flex flex-col">
              {TEAM.map((person) => (
                <div key={person.name} className="flex items-center gap-4 border-b border-fg-grey-100 py-3 last:border-b-0">
                  <Avatar src={person.avatar} alt={person.name} size="md" />
                  <div className="flex w-28 flex-col">
                    <span className="text-sm font-medium text-fg-black">{person.name}</span>
                    <span className="text-xs text-fg-grey-700">
                      {person.deals} 单 · 赢单 {person.rate}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <SmoothLineChart series={[{ data: person.data, color: person.color, fillArea: true }]} height="h-10" yDomain={[Math.min(...person.data) - 2, Math.max(...person.data) + 2]} />
                  </div>
                  <span className="w-20 text-right text-sm font-medium tabular-nums">{person.signed}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="续约预测" subtitle="按到期时间排序">
            <div className="flex flex-col">
              {renewals.map((customer) => {
                const chance = customer.health >= 80 ? "高" : customer.health >= 60 ? "中" : "低";
                return (
                  <div key={customer.id} className="flex items-center gap-4 border-b border-fg-grey-100 py-3 last:border-b-0">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-fg-black">{customer.name}</span>
                      <span className="text-xs text-fg-grey-700">
                        {customer.renewalDate} 到期 · ¥{(customer.annualFee / 10000).toFixed(0)} 万
                      </span>
                    </div>
                    <span className="h-1.5 w-24 overflow-hidden rounded-full bg-fg-grey-100">
                      <span className={`block h-full rounded-full ${chance === "低" ? "bg-fg-red" : chance === "中" ? "bg-fg-yellow" : "bg-fg-green-500"}`} style={{ width: `${customer.health}%` }} />
                    </span>
                    <span className={`w-16 text-right text-sm font-medium ${chance === "低" ? "text-fg-red" : chance === "中" ? "text-fg-yellow-700" : "text-fg-green-500"}`}>续约{chance}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </Grid>
      </div>
    </BusinessShell>
  );
}
