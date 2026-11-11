"use client";

import type { ReactNode } from "react";
import { Avatar, BarChartStatCard, CreditCard, ProgressBar, StatusBadge, type ColumnDef } from "@forge-ui-official/core";
import { CardCarousel } from "@/blocks/card-carousel/card-carousel";
import { CompositionCard } from "@/blocks/composition-card/composition-card";
import { CrmMetricCard } from "@/blocks/crm-summary/crm-summary";
import { FinanceOverview, defaultFinanceAccounts, defaultFinanceGoals } from "@/blocks/finance-overview/finance-overview";
import { FinanceSurface, FieldLine } from "@/blocks/finance-workspace/finance-workspace";
import { GoalProgressList } from "@/blocks/goal-progress-list/goal-progress-list";
import { KpiMetrics } from "@/blocks/kpi-metrics/kpi-metrics";
import { OrdersTableSection, defaultOrders, type OrderRecord } from "@/blocks/orders-table-section/orders-table-section";
import { OverviewDashboard, defaultOverviewComposition, defaultOverviewMetrics, defaultOverviewTrend } from "@/blocks/overview-dashboard/overview-dashboard";
import { ProjectOverview } from "@/blocks/project-overview/project-overview";
import { RankingList } from "@/blocks/ranking-list/ranking-list";
import { RecentRecords } from "@/blocks/recent-records/recent-records";
import { RegionDistribution } from "@/blocks/region-distribution/region-distribution";
import { TrendChart } from "@/blocks/trend-chart/trend-chart";
import { ProductsTable } from "@/blocks/products-table/products-table";
import { CustomersTable } from "@/blocks/customers-table/customers-table";
import { SellersTable } from "@/blocks/sellers-table/sellers-table";
import { CategoriesTable } from "@/blocks/categories-table/categories-table";
import { OrderDetail } from "@/blocks/order-detail/order-detail";
import { InvoiceDocument } from "@/blocks/invoice-document/invoice-document";
import { CustomerProfile } from "@/blocks/customer-profile/customer-profile";
import { ProductDetail } from "@/blocks/product-detail/product-detail";
import { LeadsTable } from "@/blocks/leads-table/leads-table";
import { DealsTable } from "@/blocks/deals-table/deals-table";
import { LeadDetail } from "@/blocks/lead-detail/lead-detail";
import { ProductForm } from "@/blocks/product-form/product-form";
import { OrderForm } from "@/blocks/order-form/order-form";
import { InvoiceForm } from "@/blocks/invoice-form/invoice-form";
import { KanbanBoard } from "@/blocks/kanban-board/kanban-board";
import { TaskDetail } from "@/blocks/task-detail/task-detail";
import { MemberProfile } from "@/blocks/member-profile/member-profile";
import { CalendarMonth } from "@/blocks/calendar-month/calendar-month";
import { FileManager } from "@/blocks/file-manager/file-manager";
import { TransactionsTable } from "@/blocks/transactions-table/transactions-table";
import { InvoicesTable } from "@/blocks/invoices-table/invoices-table";
import { CardsManagement } from "@/blocks/cards-management/cards-management";
import { SavingsGoalsTable } from "@/blocks/savings-goals-table/savings-goals-table";
import { WealthOverview } from "@/blocks/wealth-overview/wealth-overview";
import { ClientDirectory } from "@/blocks/client-directory/client-directory";
import { RegisterForm } from "@/blocks/register-form/register-form";
import { PasswordRecovery } from "@/blocks/password-recovery/password-recovery";
import { LayoutTopbarProfile } from "@/blocks/layout-topbar-profile/layout-topbar-profile";
import { LayoutSidebarProfile } from "@/blocks/layout-sidebar-profile/layout-sidebar-profile";
import { LayoutIconRail } from "@/blocks/layout-icon-rail/layout-icon-rail";
import { LayoutSettings } from "@/blocks/layout-settings/layout-settings";
import { LayoutImmersive } from "@/blocks/layout-immersive/layout-immersive";
import { ProviderSettingsForm } from "@/blocks/provider-settings-form/provider-settings-form";
import { DialogForm } from "@/blocks/dialog-form/dialog-form";
import { AiWorkspaceOverview } from "@/blocks/ai-workspace-overview/ai-workspace-overview";
import { AgentCatalog } from "@/blocks/agent-catalog/agent-catalog";
import { AgentRun } from "@/blocks/agent-run/agent-run";
import { TaskRunDetail } from "@/blocks/task-run-detail/task-run-detail";
import { RuntimeList } from "@/blocks/runtime-list/runtime-list";
import { MessageChannels } from "@/blocks/message-channels/message-channels";
import { AutonomousAgents } from "@/blocks/autonomous-agents/autonomous-agents";
import { AiAssistantHome } from "@/blocks/ai-assistant-home/ai-assistant-home";
import { AgentOrchestration } from "@/blocks/agent-orchestration/agent-orchestration";
import { AgentUsage } from "@/blocks/agent-usage/agent-usage";
import { PromptEvals } from "@/blocks/prompt-evals/prompt-evals";
import { SettingsProfile } from "@/blocks/settings-profile/settings-profile";
import { SettingsMembers } from "@/blocks/settings-members/settings-members";
import { SettingsRoles } from "@/blocks/settings-roles/settings-roles";
import { SettingsNotifications } from "@/blocks/settings-notifications/settings-notifications";
import { SettingsSecurity } from "@/blocks/settings-security/settings-security";
import { SettingsBilling } from "@/blocks/settings-billing/settings-billing";
import { ProjectPortfolio } from "@/blocks/project-portfolio/project-portfolio";
import { WorkflowBuilder } from "@/blocks/workflow-builder/workflow-builder";
import { IntegrationsDirectory } from "@/blocks/integrations-directory/integrations-directory";
import { OnboardingFlow } from "@/blocks/onboarding-flow/onboarding-flow";
import { LoginForm } from "@/blocks/login-form/login-form";

const currency = (amount: number) => `¥${amount.toLocaleString("zh-CN")}`;
const recordStatuses = { paid: { label: "已支付", color: "green" }, processing: { label: "处理中", color: "blue" }, refunded: { label: "已退款", color: "grey" } } as const;
const recordColumns: ColumnDef<OrderRecord>[] = [
  { key: "id", header: "订单号", minWidth: 160, render: order => <span className="font-medium">{order.id}</span> },
  { key: "customer", header: "客户", minWidth: 170, render: order => <div className="flex items-center gap-2.5"><Avatar initials={order.customer.slice(0, 1)} size="sm" /><div><p className="font-medium">{order.customer}</p><p className="text-xs text-fg-grey-500">{order.company}</p></div></div> },
  { key: "amount", header: "金额", minWidth: 110, valueKind: "number", render: order => <span className="font-semibold tabular-nums">{currency(order.amount)}</span> },
  { key: "status", header: "状态", minWidth: 95, render: order => <StatusBadge {...recordStatuses[order.status]} variant="soft" /> },
  { key: "date", header: "日期", minWidth: 120, render: order => order.date },
];

const previews: Record<string, ReactNode> = {
  "overview-dashboard": <OverviewDashboard />,
  "orders-table-section": <OrdersTableSection />,
  "project-overview": <ProjectOverview />,
  "finance-overview": <FinanceOverview />,
  "kpi-metrics": <div className="@container"><KpiMetrics className="grid grid-cols-1 gap-4 @min-[480px]:grid-cols-2 @min-[960px]:grid-cols-4 [&>*]:w-full" metrics={defaultOverviewMetrics.map(metric => ({ id: metric.id, title: metric.title, value: String(metric.value), trend: metric.trend, subtitle: metric.subtitle, data: metric.data, visualization: metric.visualization, theme: metric.theme }))} /></div>,
  "recent-records": <RecentRecords title="最近订单" subtitle="知行科技 · 最近 6 笔交易" columns={recordColumns} data={defaultOrders} getRowKey={order => order.id} />,
  "trend-chart": <TrendChart title="收入与支出" subtitle="2026.10.25 — 10.31 · 人民币" chart={defaultOverviewTrend} />,
  "ranking-list": <RankingList title="客户收入排行" subtitle="知行科技 · 本周前 5 位客户" entries={[
    { id: "qingshi", title: "青石建筑", subtitle: "企业年度订阅 · 12 笔", value: "¥32,800", avatar: "青" },
    { id: "yuanshan", title: "远山设计", subtitle: "团队协作方案 · 18 笔", value: "¥28,600", avatar: "远" },
    { id: "shiguang", title: "拾光商业", subtitle: "客户经营方案 · 9 笔", value: "¥21,400", avatar: "拾" },
    { id: "muhe", title: "木禾文化", subtitle: "企业年度订阅 · 8 笔", value: "¥18,200", avatar: "木" },
    { id: "yunfan", title: "云帆科技", subtitle: "实施与培训 · 6 笔", value: "¥12,000", avatar: "云" },
  ]} />,
  "composition-card": <CompositionCard title="收入构成" subtitle="知行科技 · 本周业务收入" chart={defaultOverviewComposition} />,
  "region-distribution": <div className="@container h-full"><RegionDistribution title="客户地区分布" subtitle="知行科技 · 本周营业收入" className="h-full grid grid-cols-1 @min-[480px]:grid-cols-2 @min-[480px]:[&>div:first-child]:col-span-2 @min-[480px]:[&>div:nth-child(2)]:self-center @min-[480px]:[&>div:nth-child(2)]:py-4 [&>div:last-child]:p-4 [&>div:last-child]:gap-3" highlights={["asia", "europe", "north-america"]} regions={[
    { name: "中国", countryCode: "CN", salesLabel: "146 笔订单", value: "¥72,800" },
    { name: "新加坡", countryCode: "SG", salesLabel: "38 笔订单", value: "¥21,400" },
    { name: "日本", countryCode: "JP", salesLabel: "28 笔订单", value: "¥14,600" },
    { name: "英国", countryCode: "GB", salesLabel: "22 笔订单", value: "¥11,200" },
    { name: "美国", countryCode: "US", salesLabel: "14 笔订单", value: "¥8,600" },
  ]} /></div>,
  "goal-progress-list": <GoalProgressList title="资金目标" subtitle="知行科技 · 2026 年度计划"><div className="divide-y divide-fg-grey-100">{defaultFinanceGoals.map(goal => <div key={goal.id} className="py-3 first:pt-0 last:pb-0"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-fg-black">{goal.title}</p><p className="mt-1 whitespace-nowrap text-xs text-fg-grey-500">{goal.date}</p></div><span className="text-sm font-semibold text-fg-grey-700">{goal.progress}%</span></div><p className="mt-2 whitespace-nowrap text-sm font-semibold tabular-nums text-fg-black">{goal.amount}</p><div className="mt-2"><ProgressBar value={goal.progress} color={goal.progressColor} /></div></div>)}</div></GoalProgressList>,
  "card-carousel": <div className="rounded-3xl border border-fg-grey-200 bg-background p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-fg-black">企业账户</h3><p className="mt-1 text-xs text-fg-grey-500">知行科技 · 账户总额</p></div><strong className="text-lg tabular-nums text-fg-black">¥466,800</strong></div><CardCarousel cards={defaultFinanceAccounts.map(({ id, ...account }) => ({ id, ...account, width: "full" }))} size="compact" showPagination /><p className="mt-3 text-center text-xs text-fg-grey-500">2 个账户 · 日常经营与企业储备</p></div>,
  "crm-summary": <div className="@container h-full"><div className="grid h-full auto-rows-fr grid-cols-1 gap-4"><CrmMetricCard title="新增客户" date="2026.10.25 — 10.31" value="86" trend="16.2%" note="较上一周" footer={<div className="w-full pb-2"><ProgressBar value={86} color="blue" /><p className="mt-2 text-right text-xs text-fg-grey-500">周目标 100 位</p></div>} /><BarChartStatCard title="客户贡献收入" value="¥128,600" trend="12.8%" subtitle="知行科技 · 较上一周" bars={defaultOverviewMetrics[0].data} density="compact" size="wide" width="full" theme="white" barColor="blue" /></div></div>,
  "finance-workspace": <FinanceSurface title="账户概览" eyebrow="知行科技 · 经营与储备账户"><div className="@container"><div className="grid grid-cols-1 gap-5 @min-[480px]:grid-cols-2"><div className="flex flex-col gap-4"><CreditCard {...defaultFinanceAccounts[0]} width="full" /><div className="flex items-center justify-between text-sm"><span className="text-fg-grey-700">日常经营账户</span><strong className="text-fg-black">¥326,800</strong></div></div><dl><FieldLine label="账户总额" value="¥466,800" /><FieldLine label="本周收入" value="¥128,600" /><FieldLine label="本周支出" value="¥74,800" /><FieldLine label="风险储备金" value="¥140,000" /></dl></div></div></FinanceSurface>,
  "products-table": <ProductsTable />,
  "customers-table": <CustomersTable />,
  "sellers-table": <SellersTable />,
  "categories-table": <CategoriesTable />,
  "order-detail": <OrderDetail />,
  "invoice-document": <InvoiceDocument />,
  "customer-profile": <CustomerProfile />,
  "product-detail": <ProductDetail />,
  "leads-table": <LeadsTable />,
  "deals-table": <DealsTable />,
  "lead-detail": <LeadDetail />,
  "product-form": <ProductForm />,
  "order-form": <OrderForm />,
  "invoice-form": <InvoiceForm />,
  "kanban-board": <KanbanBoard />,
  "task-detail": <TaskDetail />,
  "member-profile": <MemberProfile />,
  "calendar-month": <CalendarMonth />,
  "file-manager": <FileManager />,
  "transactions-table": <TransactionsTable />,
  "invoices-table": <InvoicesTable />,
  "cards-management": <CardsManagement />,
  "savings-goals-table": <SavingsGoalsTable />,
  "wealth-overview": <WealthOverview />,
  "client-directory": <ClientDirectory />,
  "register-form": <RegisterForm />,
  "password-recovery": <PasswordRecovery />,
  "layout-topbar-profile": <LayoutTopbarProfile />,
  "layout-sidebar-profile": <LayoutSidebarProfile />,
  "layout-icon-rail": <LayoutIconRail />,
  "layout-settings": <LayoutSettings />,
  "layout-immersive": <LayoutImmersive />,
  "provider-settings-form": <ProviderSettingsForm />,
  "dialog-form": <DialogForm />,
  "ai-workspace-overview": <AiWorkspaceOverview />,
  "agent-catalog": <AgentCatalog />,
  "agent-run": <AgentRun />,
  "task-run-detail": <TaskRunDetail />,
  "runtime-list": <RuntimeList />,
  "message-channels": <MessageChannels />,
  "autonomous-agents": <AutonomousAgents />,
  "ai-assistant-home": <AiAssistantHome />,
  "agent-orchestration": <AgentOrchestration />,
  "agent-usage": <AgentUsage />,
  "prompt-evals": <PromptEvals />,
  "settings-profile": <SettingsProfile />,
  "settings-members": <SettingsMembers />,
  "settings-roles": <SettingsRoles />,
  "settings-notifications": <SettingsNotifications />,
  "settings-security": <SettingsSecurity />,
  "settings-billing": <SettingsBilling />,
  "project-portfolio": <ProjectPortfolio />,
  "workflow-builder": <WorkflowBuilder />,
  "integrations-directory": <IntegrationsDirectory />,
  "onboarding-flow": <OnboardingFlow />,
  "login-form": <LoginForm />,
};

export function BlockPreview({ name }: { name: string }) {
  return previews[name] ?? null;
}

export const previewNames = Object.keys(previews);
