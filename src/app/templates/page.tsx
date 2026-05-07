import Link from "next/link";
import Image from "next/image";
import { ArrowRightLinear } from "solar-icon-set";
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
    href: "/templates/project-template",
    title: "Project Management",
    description:
      "Protask 项目管理模板，包含项目、客户、成员、任务、文件和发票的完整多页工作流。",
    thumbnail: asset("/images/showcase/project-template.png"),
  },
  {
    href: "/templates/ecommerce/products",
    title: "Ecommerce Admin",
    description:
      "一套电商后台，管商品、订单、客户、分类、卖家，列表详情表单都齐了。",
    thumbnail: asset("/images/showcase/ecommerce.png"),
  },
  {
    href: "/templates/dashboard-builder",
    title: "Dashboard Builder",
    description:
      "8 种空白后台外壳，白紫蓝黑 × 顶栏/侧栏 Profile，挑一个当起点。",
    thumbnail: asset("/images/showcase/dashboard-builder-hero.png"),
  },
  {
    href: "/templates/dashboards",
    title: "Dashboards",
    description:
      "10 个填好的 SaaS 控制台样板，Project / Analytics / CRM / E-Commerce / Finance 五大业务，4 种侧栏配色齐活。",
    thumbnail: asset("/images/showcase/dashboards/finance-3.png"),
  },
  {
    href: "https://github.com/forge-ui/forge-starter",
    title: "Forge Starter",
    description:
      "Next.js 16 + Tailwind v4 + Forge 的起点仓库，登录注册 + 空白后台 + AGENTS.md，gh template 一键 fork。",
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
            <h1 className="text-4xl font-bold tracking-fg text-fg-black">Examples</h1>
            <p className="max-w-2xl text-base leading-7 text-fg-grey-700">
              用 Forge UI Kit 拼出来的示例项目。挑一个当起点复制改造，或者看它们怎么组合组件做业务。
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-0 overflow-hidden rounded-3xl bg-white border border-fg-grey-200 hover:border-fg-grey-400 transition-colors"
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
                  <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-fg-violet">
                    Open example
                    <ArrowRightLinear size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
