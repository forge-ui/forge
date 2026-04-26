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
  { slug: "finance-1", title: "Finance · 顶栏版", subtitle: "白底顶栏 + 黑色主按钮，余额、信用卡、收支统计、转账。" },
  { slug: "finance-2", title: "Finance · 三卡片堆叠", subtitle: "白侧栏 + 紫色主题，卡片堆叠展示、收支折线、半圆甜甜圈。" },
  { slug: "finance-3", title: "Finance · 紫色侧栏", subtitle: "蓝紫侧栏 + 完整理财工作台，余额、统计、转账、汇率换算。" },
  { slug: "ecommerce-1", title: "E-Commerce · 概览", subtitle: "蓝色侧栏 + 销售概览，图片卡、地图分布、订单表格。" },
  { slug: "ecommerce-2", title: "E-Commerce · 商品分析", subtitle: "白侧栏 + 黑主题，气泡图分类、销售指标、商品列表。" },
  { slug: "ecommerce-3", title: "E-Commerce · 订单工作台", subtitle: "深色侧栏 + 订单流程，状态徽章、客户信息、批量操作。" },
  { slug: "project-1", title: "Project · 任务看板", subtitle: "紫色顶栏 + 项目看板，任务列表、进度仪表、团队成员。" },
  { slug: "project-2", title: "Project · 工时统计", subtitle: "白侧栏 + 工时数据，任务时间线、预算追踪、燃尽图。" },
  { slug: "analytics", title: "Analytics · 数据洞察", subtitle: "黑色顶栏 + 多图表组合，流量来源、转化漏斗、留存矩阵。" },
  { slug: "crm", title: "CRM · 客户关系", subtitle: "白侧栏 + 销售管线，客户卡片、跟进时间线、漏斗指标。" },
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
