import { pageMetadata } from "@/lib/seo";
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
    thumbnail: asset("/images/showcase/dashboards/ecommerce-1.png"),
  },
  {
    href: "https://github.com/forge-ui/forge-starter",
    title: "Forge Starter",
    description: "可直接上线的 Next.js 后台脚手架：登录、角色权限、从 OpenAPI 生成模块、Ask AI 和编码助手 Skill。",
    thumbnail: asset("/images/showcase/forge-starter.png"),
    external: true,
  },
];


export const metadata = pageMetadata("/templates");

export default function ExamplesIndex() {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-fg text-fg-black">React 后台管理系统模板</h1>
            <p className="max-w-3xl text-base leading-7 text-fg-grey-900">
              用 Forge 组件搭出来的完整后台：CRM、电商、财务、项目管理、任务看板、仪表盘和智能体工作台。每个模板都能直接打开、点击体验；需要的页面用一条 shadcn 命令复制进项目，或者用 Forge Starter 起一个带登录和权限的完整项目。
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="flex flex-col gap-0 overflow-hidden rounded-3xl bg-background border border-fg-grey-200 hover:border-fg-grey-400 transition-colors"
              >
                <div className="relative aspect-video w-full overflow-hidden border-b border-fg-grey-200 bg-fg-grey-100">
                  {item.thumbnails ? (
                    <div className="absolute inset-0 grid grid-cols-4 gap-px bg-fg-grey-200">
                      {item.thumbnails.slice(0, 4).map((src, i) => (
                        <div key={i} className="relative overflow-hidden bg-background">
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
                      alt={`${item.title}模板截图`}
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

          <section className="grid gap-8 border-t border-fg-grey-200 pt-10 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold tracking-fg text-fg-black">两种用法</h2>
              <ul className="ml-5 list-disc space-y-2 text-sm leading-6 text-fg-grey-900">
                <li>
                  只要几个页面：在<Link href="/blocks" className="text-fg-blue hover:underline">页面组件</Link>里找到对应的整页区块，用 <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-xs">npx shadcn add</code> 装进现有的 Next.js 项目，源码归你改。
                </li>
                <li>
                  从零开始一个后台：用 <a href="https://github.com/forge-ui/forge-starter" target="_blank" rel="noreferrer" className="text-fg-blue hover:underline">Forge Starter</a>，自带登录、角色与菜单权限、PostgreSQL、从 OpenAPI 生成模块和 Ask AI。
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold tracking-fg text-fg-black">技术栈</h2>
              <ul className="ml-5 list-disc space-y-2 text-sm leading-6 text-fg-grey-900">
                <li>Next.js 16、React 19、Tailwind CSS v4、TypeScript</li>
                <li>组件来自 <Link href="/components/button-link" className="text-fg-blue hover:underline">@forge-ui-official/core</Link>，支持浅色和深色模式，主色、圆角、字体可以在<Link href="/docs/theme" className="text-fg-blue hover:underline">主题定制</Link>里换</li>
                <li>配套给 Claude Code、Codex、Cursor 用的<Link href="/docs/ui-for-agents" className="text-fg-blue hover:underline">前端设计 Skill</Link>，让编码助手照着模板的写法加新页面</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 md:col-span-2">
              <h2 className="text-xl font-bold tracking-fg text-fg-black">常见问题</h2>
              <dl className="grid gap-4 text-sm leading-6 md:grid-cols-2">
                <div><dt className="font-semibold text-fg-black">免费吗？能用在商业项目里吗？</dt><dd className="text-fg-grey-900">组件库、页面组件和 Forge Starter 都是 MIT 协议，可以免费用于商业项目。</dd></div>
                <div><dt className="font-semibold text-fg-black">模板里的数据是真的吗？</dt><dd className="text-fg-grey-900">是演示数据，用来展示页面效果和交互。接自己的接口时，可以参考 Forge Starter 的模块写法。</dd></div>
                <div><dt className="font-semibold text-fg-black">支持 Vue 吗？</dt><dd className="text-fg-grey-900">不支持，Forge 只提供 React 版本。</dd></div>
                <div><dt className="font-semibold text-fg-black">和 GitHub 上的开源 admin 模板有什么区别？</dt><dd className="text-fg-grey-900">Forge 的模板、页面组件和组件是同一套规范，并配有给编码助手的 Skill 和页面检查，新加的页面也能和已有页面保持一致。</dd></div>
              </dl>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
