"use client";

import { useState } from "react";
import { Button, ButtonGroup, CreditCard, Panel, ProgressBar, StatusBadge, cn } from "@forge-ui-official/core";
import { CheckCircleLinear, DownloadMinimalisticLinear } from "@forge-ui-official/core/icons";

export interface BillingPlan {
  id: string;
  name: string;
  monthly: number;
  description: string;
  features: string[];
}

export const defaultBillingPlans: BillingPlan[] = [
  { id: "starter", name: "基础版", monthly: 0, description: "小团队试用", features: ["3 个应用智能体", "1 个知识库", "每月 ¥200 模型额度"] },
  { id: "team", name: "团队版", monthly: 1999, description: "多数团队的选择", features: ["不限应用智能体", "10 个知识库", "每月 ¥3,000 模型额度", "消息渠道接入"] },
  { id: "enterprise", name: "企业版", monthly: 6999, description: "私有部署与审计", features: ["私有化运行时", "单点登录与审计日志", "专属客户成功经理", "SLA 99.9%"] },
];

export const defaultBillingInvoices = [
  { id: "BL-202610", period: "2026 年 10 月", amount: 1999, status: "已支付" },
  { id: "BL-202609", period: "2026 年 9 月", amount: 1999, status: "已支付" },
  { id: "BL-202608", period: "2026 年 8 月", amount: 1999, status: "已支付" },
];

export interface SettingsBillingProps {
  plans?: BillingPlan[];
  currentPlan?: string;
  usage?: { label: string; used: number; limit: number; unit: string }[];
  onChangePlan?: (planId: string, yearly: boolean) => void;
  className?: string;
}

const defaultUsage = [
  { label: "模型额度", used: 1862, limit: 3000, unit: "元" },
  { label: "席位", used: 7, limit: 10, unit: "人" },
  { label: "知识库存储", used: 3.2, limit: 10, unit: "GB" },
];

export function SettingsBilling({ plans = defaultBillingPlans, currentPlan = "team", usage = defaultUsage, onChangePlan, className }: SettingsBillingProps) {
  const [yearly, setYearly] = useState(0);
  const [selected, setSelected] = useState(currentPlan);
  const price = (plan: BillingPlan) => yearly ? Math.round(plan.monthly * 0.8) : plan.monthly;

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel variant="template" title="本期用量" subtitle="账单周期 11 月 1 日 – 11 月 30 日" action={<StatusBadge label={plans.find(plan => plan.id === currentPlan)?.name ?? ""} color="blue" variant="soft" />}>
        <ul className="flex flex-col gap-4">{usage.map(item => { const percent = Math.round((item.used / item.limit) * 100); return <li key={item.label} className="flex flex-col gap-2"><div className="flex justify-between text-sm"><span className="text-fg-grey-900">{item.label}</span><span className="tabular-nums text-fg-grey-700">{item.used.toLocaleString("zh-CN")} / {item.limit.toLocaleString("zh-CN")} {item.unit}</span></div><ProgressBar value={percent} color={percent > 80 ? "yellow" : "blue"} size="sm" /></li>; })}</ul>
      </Panel>
      <Panel variant="template" title="付款方式">
        <CreditCard cardNumber="6829" holderName="知行科技" expiry="12/28" theme="blue" width="full" />
        <Button variant="tertiary" size="sm">更换付款方式</Button>
      </Panel>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-semibold text-fg-black">套餐</h2><ButtonGroup ariaLabel="计费周期" shape="pill" items={[{ label: "按月" }, { label: "按年 · 省 20%" }]} activeIndex={yearly} onChange={setYearly} /></div>
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">{plans.map(plan => <li key={plan.id} className={cn("flex flex-col gap-4 rounded-card border bg-background p-6 transition-colors", selected === plan.id ? "border-fg-blue ring-2 ring-fg-blue-100" : "border-fg-grey-200")}>
      <div className="flex items-center justify-between gap-2"><p className="text-base font-semibold text-fg-black">{plan.name}</p>{plan.id === currentPlan && <StatusBadge label="当前套餐" color="blue" variant="soft" />}</div>
      <p className="text-sm text-fg-grey-700">{plan.description}</p>
      <p className="text-3xl font-semibold tabular-nums text-fg-black">{plan.monthly ? `¥${price(plan).toLocaleString("zh-CN")}` : "免费"}{plan.monthly > 0 && <span className="text-sm font-medium text-fg-grey-700"> / 月</span>}</p>
      <ul className="flex flex-col gap-2">{plan.features.map(feature => <li key={feature} className="flex items-center gap-2 text-sm text-fg-grey-900"><span className="shrink-0 text-fg-green-500"><CheckCircleLinear size={16} /></span>{feature}</li>)}</ul>
      <Button className="mt-auto" variant={plan.id === currentPlan ? "tertiary" : "primary"} disabled={plan.id === currentPlan} onClick={() => { setSelected(plan.id); onChangePlan?.(plan.id, yearly === 1); }}>{plan.id === currentPlan ? "使用中" : selected === plan.id ? "已选择，待确认" : plan.monthly > (plans.find(item => item.id === currentPlan)?.monthly ?? 0) ? "升级" : "降级"}</Button>
    </li>)}</ul>
    <Panel variant="template" title="历史账单">
      <ul className="flex flex-col divide-y divide-fg-grey-200">{defaultBillingInvoices.map(invoice => <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div><p className="text-sm font-semibold text-fg-black">{invoice.period}</p><p className="font-mono text-xs text-fg-grey-500">{invoice.id}</p></div><div className="flex items-center gap-4"><span className="text-sm tabular-nums text-fg-black">¥{invoice.amount.toLocaleString("zh-CN")}</span><StatusBadge label={invoice.status} color="green" variant="soft" /><Button size="sm" variant="unstyled" className="text-fg-grey-700 hover:text-fg-blue" aria-label={`下载${invoice.period}账单`}><DownloadMinimalisticLinear size={16} /></Button></div></li>)}</ul>
    </Panel>
  </section>;
}
