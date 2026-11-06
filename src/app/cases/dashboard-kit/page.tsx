"use client";

import { useState } from "react";
import { Panel, SurfaceCard, Button, StatCard, ProgressStatCard, LineChartStatCard, BarChartStatCard, WheelChartStatCard, BalanceCard, ImageStatCard, HighlightCard, ListGroup, WalletGoalCard, ChartHeader, ChartMetricRow, GroupedBarChart, DivergingBarChart, type CardDensity } from "@forge-ui-official/core";
import { PageHeading, Section } from "../_shared";

export default function DashboardKitCases() {
  const [density, setDensity] = useState<CardDensity>("default");
  const [notice, setNotice] = useState("");
  return <>
    <PageHeading title="看板组件" hint="模板风格面板、密度与图表组合；切换密度对比默认和紧凑尺寸。" />
    <Section title="Panel" description="24px 看板圆角；旧业务容器使用 template 变体，SurfaceCard 继续保持原有分区结构。">
      <Panel title="经营概览" subtitle="本月数据" action={<Button size="sm" onClick={() => setNotice("导出为示例操作，未连接后台")}>导出</Button>} footer="更新于今天">卡片内容</Panel>
      <Panel variant="template" title="业务分区" subtitle="兼容原模板容器">业务内容</Panel>
      <SurfaceCard title="分区卡片" subtitle="保留原 API">原有布局不变</SurfaceCard>
    </Section>
    <Section title="CardDensity" description="默认尺寸不变；紧凑密度与看板模板的原有覆盖值一致。">
      <Button onClick={() => setDensity(density === "default" ? "compact" : "default")}>当前：{density === "default" ? "默认" : "紧凑"}</Button>
      <StatCard title="收入" value="¥35,500" density={density} />
      <ProgressStatCard title="目标完成度" value="75%" progressValue={75} density={density} />
      <LineChartStatCard title="收入趋势" value="¥35,500" density={density} />
      <BarChartStatCard title="订单趋势" value="1,240" density={density} />
      <WheelChartStatCard title="转化率" value="80%" density={density} />
      <BalanceCard balance="¥21,500" density={density} />
      <ImageStatCard title="项目表现" value="80%" density={density} />
      <HighlightCard title="本月重点" image="/images/hero.jpg" density={density} />
      <ListGroup title="最近记录" items="本月暂无新增记录" density={density} />
    </Section>
    <Section title="WalletGoalCard" description="目标金额与进度；操作回调由业务方接入。">
      <WalletGoalCard title="年度预算" date="2026 年 12 月" amount="¥16,000" progress={50} progressColor="blue" showActions onTopUp={() => setNotice("已选择追加预算")} onWithdraw={() => setNotice("已选择转出预算")} onEdit={() => setNotice("已选择编辑目标")} topUpLabel="追加" withdrawLabel="转出" editLabel="编辑目标" />
      <p role="status">{notice}</p>
    </Section>
    <Section title="看板图表" description="标题支持筛选切换；指标趋势文案与轴标签可配置。">
      <ChartHeader title="收入趋势" tabs={["全部", "收入", "支出"]} defaultTab="全部" onTabChange={tab => setNotice(`已选择${tab}`)} />
      <ChartMetricRow series={[{ label: "收入", colorClass: "bg-fg-blue", value: "¥35,500", trend: "up", trendValue: "8%" }]} />
      <GroupedBarChart data={[{ label: "周一", values: [40, 20] }, { label: "周二", values: [60, 30] }]} series={[{ label: "收入", colorClass: "bg-fg-blue" }, { label: "支出", colorClass: "bg-fg-red" }]} yAxisLabels={["60", "30", "0"]} />
      <DivergingBarChart data={[{ label: "周一", upperValue: 60, lowerValue: 30 }, { label: "周二", upperValue: 40, lowerValue: 20 }]} upperLabel="收入" lowerLabel="支出" />
    </Section>
  </>;
}
