import Link from "next/link";
import Image from "next/image";
import { ChatBubble, ThinkingTrace } from "@forge-ui-official/core";
import { SiteHeader } from "./_components/site-header";
import { HomeCollage } from "./_components/home-collage";
import { HomeMotionDemo } from "./_components/home-motion-demo";
import { PromptBlock } from "./docs/agents-md/_prompt-block";
import { coreVersion } from "./docs/_versions";
import { asset } from "@/lib/asset";

const templates = [
  {
    href: "/templates/project-template",
    title: "项目管理",
    text: "项目、客户、任务和发票。",
    image: asset("/images/showcase/project-template.png"),
  },
  {
    href: "/templates/finance-template",
    title: "财务",
    text: "概览、交易、钱包和发票。",
    image: asset("/images/showcase/templates/finance-template-home.png"),
  },
  {
    href: "/templates/crm-template",
    title: "客户关系",
    text: "客户、线索、销售和活动。",
    image: asset("/images/showcase/templates/crm-template-home.png"),
  },
];

function EntryLink({
  href,
  children,
  variant,
}: {
  href: string;
  children: string;
  variant: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? "forge-button inline-flex items-center justify-center rounded-full bg-fg-black px-4 py-3 text-sm font-bold tracking-fg text-white hover:bg-fg-grey-900"
          : "forge-button inline-flex items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-bold tracking-fg text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200 hover:bg-fg-grey-50"
      }
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col gap-16 px-4 py-12 sm:px-8 sm:py-16">
        <section className="grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex min-w-0 flex-col items-start gap-6">
            <h1 className="max-w-xl font-display text-4xl font-bold tracking-fg text-fg-black sm:text-5xl sm:leading-[1.15]">
              用于内部后台的 React 组件库
            </h1>
            <div className="flex flex-wrap gap-3">
              <EntryLink href="/docs/quick-start" variant="primary">开始使用</EntryLink>
              <EntryLink href="/components" variant="secondary">浏览组件</EntryLink>
            </div>
          </div>
          <HomeMotionDemo />
        </section>

        <section className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl font-semibold tracking-fg text-fg-black">组件</h2>
            <p className="max-w-2xl text-sm leading-6 text-fg-grey-700">
              用站内组件画的缩略图。点一块进入对应页面。
            </p>
          </div>
          <HomeCollage />
        </section>

        <section className="flex min-w-0 flex-col gap-5">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-fg text-fg-black">模板</h2>
              <p className="max-w-2xl text-sm leading-6 text-fg-grey-700">用这些组件拼好的后台页面，可以拿来改。</p>
            </div>
            <Link href="/templates" className="shrink-0 text-sm font-semibold text-fg-blue hover:underline">
              全部模板
            </Link>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article className="relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-fg-grey-200 bg-white md:col-span-2 xl:col-span-3">
              <div aria-hidden className="pointer-events-none flex min-w-0 flex-col gap-3 p-4 sm:p-5">
                <ChatBubble type="sent" color="blue" content="对比一下本季和上季的销量。" motion="auto" />
                <ThinkingTrace
                  variant="steps"
                  settled
                  motion="auto"
                  doneLabel="想了 4 秒"
                  rows={[
                    { primary: "读取本季销量" },
                    { primary: "对照上季数据" },
                    { primary: "写出对比" },
                  ]}
                />
              </div>
              <h3 id="home-template-agent" className="border-t border-fg-grey-200 px-4 py-3 text-sm font-semibold text-fg-black">
                智能体
              </h3>
              <Link
                href="/templates/agent"
                aria-labelledby="home-template-agent"
                className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-blue"
              />
            </article>
            {templates.map((item) => (
              <article key={item.href} className="relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-fg-grey-200 bg-white">
                <div className="relative aspect-video overflow-hidden border-b border-fg-grey-200 bg-fg-grey-100">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col gap-1 px-4 py-3">
                  <h3 id={`home-template-${item.title}`} className="text-sm font-semibold text-fg-black">{item.title}</h3>
                  <p className="text-sm leading-6 text-fg-grey-700">{item.text}</p>
                </div>
                <Link
                  href={item.href}
                  aria-labelledby={`home-template-${item.title}`}
                  className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-blue"
                />
              </article>
            ))}
          </div>
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-5 sm:p-6">
            <h2 className="font-display text-2xl font-semibold tracking-fg text-fg-black">给编码助手</h2>
            <p className="text-sm leading-6 text-fg-grey-900">
              把规则放到项目根目录的 AGENTS.md。编码助手会按 Forge 的组件和颜色来写页面。
            </p>
            <pre className="max-w-full overflow-x-auto rounded-xl bg-fg-grey-50 px-4 py-3 font-mono text-[13px] leading-6 text-fg-black">
              curl -fsSL https://forgeui.org/agents-md &gt; AGENTS.md
            </pre>
            <Link href="/docs/agents-md" className="text-sm font-semibold text-fg-blue hover:underline">
              查看 AGENTS.md
            </Link>
          </div>
          <div className="flex min-w-0 flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-5 sm:p-6">
            <h2 className="font-display text-2xl font-semibold tracking-fg text-fg-black">安装</h2>
            <p className="text-sm leading-6 text-fg-grey-900">当前组件包版本 {coreVersion}。</p>
            <PromptBlock content={`pnpm add @forge-ui-official/core@${coreVersion}`} />
          </div>
        </section>
      </main>
    </div>
  );
}
