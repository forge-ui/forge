import Link from "next/link";
import Image from "next/image";
import { ArrowRightLinear } from "solar-icon-set";
import { SiteHeader } from "@/app/_components/site-header";
import { asset } from "@/lib/asset";

type DashboardEntry = {
  slug: string;
  title: string;
  subtitle: string;
};

const entries: DashboardEntry[] = [
  { slug: "finance-1", title: "Finance · Overview", subtitle: "深蓝侧栏 / 顶栏 profile · 余额、信用卡列表、Income/Expenses 折线 + 双向柱图。" },
  { slug: "finance-2", title: "Finance · Card 中心", subtitle: "白侧栏 黑主题 / 顶栏 profile · 三张信用卡堆叠展示、收支折线、半圆甜甜圈、交易表格。" },
  { slug: "finance-3", title: "Finance · 工作台", subtitle: "白侧栏 紫主题 / 侧栏 profile · 余额、信用卡、Wallet、汇率换算、统计 + 表格全家桶。" },
  { slug: "ecommerce-1", title: "E-Commerce · 销售概览", subtitle: "白侧栏 蓝主题 / 顶栏 profile · Total Revenue 蓝卡 + Top Product 高亮卡 + Top Region 地图。" },
  { slug: "ecommerce-2", title: "E-Commerce · 数据分析", subtitle: "白侧栏 紫主题 / 顶栏 profile · Total Revenue/Orders/Customers 三卡 + 多色折线 + Expenses 气泡图。" },
  { slug: "ecommerce-3", title: "E-Commerce · 订单工作台", subtitle: "白侧栏 黑主题 / 顶栏 profile · 紫蓝绿红四彩卡 + Target 仪表 + 紫色单色柱图 + 订单列表。" },
  { slug: "project-1", title: "Project · 项目概览", subtitle: "深紫侧栏 / 顶栏 profile · Total/In Progress/Completed/Unfinished 四指标 + Team Member。" },
  { slug: "project-2", title: "Project · 工作台", subtitle: "白侧栏 蓝主题 / 侧栏 profile · Active Project/Client/Team 三卡 + 三色折线 + 饼图 + Calendar。" },
  { slug: "analytics", title: "Analytics · 数据洞察", subtitle: "白侧栏 紫主题 / 顶栏 profile · 四指标 progress + 紫色柱图 + Campaign 列表。" },
  { slug: "crm", title: "CRM · 客户分析", subtitle: "白侧栏 紫主题 / 顶栏 profile · Revenue/Leads/Customer 三卡 + Average Sales 紫柱图 + 转化进度条。" },
];

export default function DashboardsGallery() {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 lg:px-8">
        <header className="flex flex-col gap-3 mb-10">
          <h1 className="text-4xl font-bold tracking-fg text-fg-black">Dashboards</h1>
          <p className="max-w-2xl text-base leading-7 text-fg-grey-700">
            10 个填好业务内容的 SaaS 控制台样板，覆盖 Finance / E-Commerce / Project / Analytics / CRM 五大场景。挑一个最贴的复制改造。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((e) => (
            <Link
              key={e.slug}
              href={`/templates/dashboards/${e.slug}`}
              className="group flex flex-col gap-0 overflow-hidden rounded-3xl bg-white border border-fg-grey-200 hover:border-fg-grey-400 transition-colors"
            >
              <div className="relative aspect-video w-full overflow-hidden border-b border-fg-grey-200 bg-fg-grey-100">
                <Image
                  src={asset(`/images/showcase/dashboards/${e.slug}.png`)}
                  alt={e.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-3 p-6">
                <h2 className="text-lg font-bold tracking-fg text-fg-black">{e.title}</h2>
                <p className="text-sm leading-6 text-fg-grey-700">{e.subtitle}</p>
                <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-fg-violet">
                  打开模板
                  <ArrowRightLinear size={16} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
