import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/app/_components/site-header";
import { asset } from "@/lib/asset";

type ShowcaseItem = {
  href: string;
  title: string;
  description: string;
  thumbnail?: string;
  thumbnails?: string[];
  external?: boolean;
};

const items: ShowcaseItem[] = [
  {
    href: "/templates/agent",
    title: "智能体",
    thumbnail: asset("/images/showcase/agent-workspace.png"),
    description: "动态智能体工作台，支持流式生成、停止重试、工具调用、计划审核和交互输入。",
  },
  {
    href: "/templates/task-board",
    title: "任务看板",
    description: "工作空间、项目和我的任务。支持拖动看板、列表、任务详情和本地保存。",
    thumbnail: asset("/images/showcase/task-board.png"),
  },
  {
    href: "/templates/project-template",
    title: "项目管理",
    description: "项目管理示例，包含项目、客户、成员、任务、文件和发票。",
    thumbnail: asset("/images/showcase/project-template.png"),
  },
  {
    href: "/templates/finance-template",
    title: "财务",
    description: "财务后台示例，包含概览、交易、钱包、卡片和发票。",
    thumbnail: asset("/images/showcase/templates/finance-template-home.png"),
  },
  {
    href: "/templates/crm-template",
    title: "客户关系",
    description: "客户、线索、销售和活动管理的多页示例。",
    thumbnail: asset("/images/showcase/templates/crm-template-home.png"),
  },
  {
    href: "/templates/micellaneous-template",
    title: "杂项",
    description: "日历、聊天、文件和表格操作放在同一套侧栏里的示例。",
    thumbnail: asset("/images/showcase/templates/micellaneous-template-home.png"),
  },
  {
    href: "/templates/ecommerce/products",
    title: "电商后台",
    description: "商品、订单、客户、分类和卖家的列表、详情和表单。",
    thumbnail: asset("/images/showcase/ecommerce.png"),
  },
  {
    href: "/templates/dashboards",
    title: "仪表盘",
    description: "10 个已填数据的控制台，覆盖项目、分析、客户、电商和财务。",
    thumbnail: asset("/images/showcase/dashboards/finance-3.png"),
  },
  {
    href: "https://github.com/forge-ui/forge-starter",
    title: "Forge Starter",
    description: "Next.js 16、Tailwind v4 和 Forge 的起点仓库，含登录页、空白后台和 AGENTS.md。",
    thumbnail: asset("/images/showcase/forge-starter.png"),
    external: true,
  },
];

export default function ExamplesIndex() {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-fg text-fg-black">模板</h1>
            <p className="max-w-2xl text-base leading-7 text-fg-grey-700">
              用 Forge UI Kit 拼出来的示例项目。挑一个当起点复制改造，或者看它们怎么组合组件做业务。
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="flex flex-col gap-0 overflow-hidden rounded-3xl bg-white border border-fg-grey-200 hover:border-fg-grey-400 transition-colors"
              >
                <div className="relative aspect-video w-full overflow-hidden border-b border-fg-grey-200 bg-fg-grey-100">
                  {item.thumbnails ? (
                    <div className="absolute inset-0 grid grid-cols-4 gap-px bg-fg-grey-200">
                      {item.thumbnails.slice(0, 4).map((src, i) => (
                        <div key={i} className="relative overflow-hidden bg-white">
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 25vw, (max-width: 1024px) 12vw, 8vw"
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  ) : item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <h2 className="text-xl font-bold tracking-fg text-fg-black">{item.title}</h2>
                  <p className="text-sm leading-6 text-fg-grey-700 line-clamp-2">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
