"use client";

import Link from "next/link";
import { CalendarCard, ChartHeader, ChartMetricRow, StatCard } from "@forge-ui-official/core";
import { SiteHeader } from "../_components/site-header";
import { KpiMetrics } from "@/blocks/kpi-metrics/kpi-metrics";
import { RecentRecords } from "@/blocks/recent-records/recent-records";
import { TrendChart } from "@/blocks/trend-chart/trend-chart";
import { RankingList } from "@/blocks/ranking-list/ranking-list";
import { CompositionCard } from "@/blocks/composition-card/composition-card";
import { DashboardHeader } from "@/blocks/dashboard-header/dashboard-header";
import { RegionDistribution } from "@/blocks/region-distribution/region-distribution";
import { MemberList } from "@/blocks/member-list/member-list";
import { GoalProgressList } from "@/blocks/goal-progress-list/goal-progress-list";
import { ActivityFeed } from "@/blocks/activity-feed/activity-feed";
import { ScheduleCard } from "@/blocks/schedule-card/schedule-card";
import { CardCarousel } from "@/blocks/card-carousel/card-carousel";
import catalog from "../../../blocks/registry.json";
import corePackage from "../../../core/package.json";
import { CrmStat } from "@/blocks/crm-summary/crm-summary";
import { FinanceSurface, VisualCard } from "@/blocks/finance-workspace/finance-workspace";
import { TemplateSurface } from "@/blocks/template-surface/template-surface";
import { ConversationHeader } from "@/blocks/conversation-header/conversation-header";
import { ProjectSection } from "@/blocks/project-section/project-section";

const previews = {
  "crm-summary": <CrmStat title="客户增长" value="1,240" bars={[20, 35, 28, 50, 60]} />,
  "finance-workspace": <FinanceSurface title="账户概览"><VisualCard theme="blue" name="演示账户" type="借记卡" last4="2026" balance="¥12,000" /></FinanceSurface>,
  "template-surface": <TemplateSurface title="会话详情" subtitle="演示内容区">可替换为列表、详情或聊天内容。</TemplateSurface>,
  "conversation-header": <ConversationHeader title="项目计划" subtitle="设计工作室 / 工作助手"><span className="text-sm text-fg-grey-700">操作插槽</span></ConversationHeader>,
  "project-section": <ProjectSection title="任务详情" className="rounded-card border border-fg-grey-200 bg-white p-4">本周重点任务与进展。</ProjectSection>,
  "kpi-metrics": <KpiMetrics className="grid grid-cols-1 gap-4 sm:grid-cols-2" metrics={[{ id: "income", title: "营业收入", value: "¥35,500", trend: "10%", theme: "blue" }, { id: "orders", title: "订单数", value: "1,240", trend: "7%" }]} />,
  "recent-records": <RecentRecords title="最近订单" columns={[{ key: "name", header: "订单", render: (row: { id: string; name: string }) => row.name }]} data={[{ id: "order-1", name: "企业年度订阅" }]} getRowKey={row => row.id} />,
  "trend-chart": <TrendChart title="收入趋势" chart={{ data: [{ label: "周一", values: [40] }, { label: "周二", values: [60] }, { label: "周三", values: [50] }], series: [{ label: "收入", colorClass: "bg-fg-blue" }], yAxisLabels: ["60", "30", "0"], activeIndex: 1 }} />,
  "ranking-list": <RankingList title="渠道排行" subtitle="按本月收入排序" items={<><StatCard title="自然搜索" value="¥12,500" density="compact" /><StatCard title="直接访问" value="¥8,200" density="compact" /></>} />,
  "composition-card": <CompositionCard title="收入构成" chart={{ segments: [{ value: 60, color: "bg-fg-blue" }, { value: 40, color: "bg-fg-green" }], centerValue: "¥35,500", size: "sm" }} />,
  "dashboard-header": <DashboardHeader title="经营概览" description="本月关键指标与待办事项" action={<span className="text-xs text-fg-grey-500">本月</span>} />,
  "region-distribution": <RegionDistribution title="地区分布" subtitle="按销售额统计" />,
  "member-list": <MemberList title="项目成员" members={[{ id: "member-1", name: "张宁", initials: "张", subtitle: "产品负责人" }]} />,
  "goal-progress-list": <GoalProgressList title="储蓄目标" goals={[{ id: "goal-1", title: "年度预算", date: "2026 年 12 月", amount: "¥16,000", progress: 50, progressColor: "blue" }]} />,
  "activity-feed": <ActivityFeed title="最近活动" events={[{ id: "event-1", icon: null, headerText: "项目动态", datetime: "今天 09:30", avatar: "/images/team/edward-allen.png", title: "需求评审已完成", description: "项目已进入设计阶段", metadata: [] }]} />,
  "schedule-card": <ScheduleCard title="项目日程"><CalendarCard defaultDate={new Date(2026, 10, 5)} /></ScheduleCard>,
  "card-carousel": <CardCarousel showPagination size="compact" cards={[{ id: "card-1", cardNumber: "9090", holderName: "张宁", expiry: "07/28", theme: "purple", variant: "gradient" }, { id: "card-2", cardNumber: "8080", holderName: "张宁", expiry: "08/28", theme: "blue", variant: "flat" }]} />,
};

export default function BlocksPage() {
  return <div className="min-h-screen bg-fg-grey-50">
    <SiteHeader />
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8">
      <DashboardHeader title="页面区块" description={`${catalog.length} 个可复制、可修改的页面区块。先选模板，再替换业务数据。`} />
      <p className="text-sm text-fg-grey-700">区块源码只使用 core 公开 API 与设计 token，不是 core 的额外导出。<Link className="text-fg-blue" href="/templates">查看完整模板</Link> · <a className="text-fg-blue" href="/r/index.json">注册表索引</a></p>
      <p className="text-sm text-fg-grey-700">当前代码依赖本地 core {corePackage.version}；本地开发请使用 workspace 版本。本次不发布 npm 或网站，公网安装能力需另行核实。</p>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        {catalog.map(block => <section key={block.name} id={block.name} className="flex min-w-0 flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4">
          <div><h2 className="text-lg font-semibold text-fg-black">{block.title}</h2><p className="text-sm text-fg-grey-700">{block.description}</p></div>
          <div className="min-w-0 overflow-x-auto rounded-2xl bg-fg-grey-50 p-4">{previews[block.name as keyof typeof previews]}</div>
          <code className="break-all text-xs text-fg-grey-700">npx shadcn@latest add https://forgeui.org/r/{block.name}.json</code>
          <a className="text-sm font-semibold text-fg-blue" href={`/r/${block.name}.json`}>查看区块源码与依赖</a>
        </section>)}
      </div>
      <ChartHeader title="图表标题与指标行" tabs={["全部", "收入", "支出"]} defaultTab="全部" />
      <ChartMetricRow series={[{ label: "收入", colorClass: "bg-fg-blue", value: "¥35,500", trend: "up", trendValue: "8%" }]} />
    </main>
  </div>;
}
