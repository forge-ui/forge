import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChatBubble, ThinkingTrace } from "@forge-ui-official/core";
import { SiteHeader } from "./_components/site-header";
import { HomeShowcase } from "./_components/home-showcase";
import { A11yDemo, MotionDemo, ThemeDemo } from "./_components/home-features";
import { InstallCommand } from "./_components/home-install";
import { coreVersion } from "./docs/_versions";
import { asset } from "@/lib/asset";
import "./_components/home-page.css";

const installCommand = `pnpm add @forge-ui-official/core@${coreVersion}`;
const agentsCommand = "curl -fsSL https://forgeui.org/agents-md > AGENTS.md";

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
          ? "inline-flex h-12 items-center justify-center rounded-full bg-fg-black px-5 text-sm font-bold tracking-fg text-white shadow-[0_10px_24px_-12px_rgba(0,10,25,0.65)] hover:bg-fg-grey-900"
          : "inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-bold tracking-fg text-fg-black shadow-[0_8px_20px_-14px_rgba(0,10,25,0.4)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 hover:bg-fg-grey-50"
      }
    >
      {children}
    </Link>
  );
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-fg-blue hover:underline">
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

function Feature({
  id,
  kicker,
  title,
  copy,
  links,
  demo,
  flip = false,
}: {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  links: { href: string; label: string }[];
  demo: ReactNode;
  flip?: boolean;
}) {
  return (
    <section id={id} className="grid min-w-0 items-center gap-8 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
      <div className={flip ? "flex min-w-0 flex-col gap-4 lg:order-2" : "flex min-w-0 flex-col gap-4"}>
        <p className="text-sm font-semibold tracking-fg text-fg-blue">{kicker}</p>
        <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-fg-black sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-base leading-7 text-fg-grey-900">{copy}</p>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <TextLink key={link.href} href={link.href}>{link.label}</TextLink>
          ))}
        </div>
      </div>
      <div className={flip ? "min-w-0 lg:order-1" : "min-w-0"}>
        <div className="home-panel min-w-0 p-4 sm:p-6">{demo}</div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="home-canvas relative min-h-screen">
      <div className="home-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full min-w-0 max-w-[1180px] flex-1 flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
          <section className="grid min-w-0 items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex min-w-0 flex-col items-start gap-6">
              <p className="text-sm font-semibold tracking-fg text-fg-blue">Forge {coreVersion}</p>
              <h1 className="font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.045em] text-fg-black sm:text-6xl lg:text-7xl">
                <span className="block">后台页面</span>
                <span className="block">按规范搭完</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-fg-grey-900">
                按钮、输入框、表格、日历和对话都在这套组件里。颜色用 token 换，动效跟着系统走，编码助手可以按 AGENTS.md 接着写。
              </p>
              <div className="flex flex-wrap gap-3">
                <EntryLink href="/docs/quick-start" variant="primary">开始使用</EntryLink>
                <EntryLink href="/components" variant="secondary">浏览组件</EntryLink>
              </div>
              <InstallCommand command={installCommand} label="复制安装命令" />
            </div>
            <HomeShowcase />
          </section>

          <Feature
            id="theme"
            kicker="主题与 token"
            title="颜色收在 token 里"
            copy="页面不写死色值。下面四个色点对应蓝、绿、红、黑。点一个，统计卡、按钮和进度条一起换。完整色阶在设计规范。"
            links={[{ href: "/components/style-guide", label: "设计规范" }]}
            demo={<ThemeDemo />}
          />

          <Feature
            id="motion"
            kicker="动效"
            title="玻璃、跟随和涟漪"
            copy="悬停玻璃按钮看高光，指针靠近时按钮会跟着移动，点击后涟漪从落点散开。系统开启减弱动效后，这三处动画停住。"
            links={[{ href: "/components/button-link", label: "按钮与链接" }]}
            demo={<MotionDemo />}
            flip
          />

          <Feature
            id="a11y"
            kicker="可访问性"
            title="能读出名字，也能关掉动效"
            copy="输入框带可见标签，开关有可访问名称，按钮能用键盘触发。组件的 motion 设为 auto 时，会跟着系统的减弱动效停下来。"
            links={[{ href: "/components/input-field", label: "表单与输入" }]}
            demo={<A11yDemo />}
          />

          <Feature
            id="agents"
            kicker="AGENTS.md"
            title="把规则交给编码助手"
            copy="项目根目录放一份 AGENTS.md。助手会按 Forge 的组件名、颜色 token 和页面结构来写，而不是另起一套样式。"
            links={[
              { href: "/docs/agents-md", label: "查看 AGENTS.md" },
              { href: "/docs/ui-for-agents", label: "UI for Agents" },
            ]}
            demo={
              <div className="flex min-w-0 flex-col gap-4">
                <InstallCommand command={agentsCommand} label="复制 AGENTS.md 安装命令" />
                <ChatBubble type="sent" color="blue" content="用 Forge 的表格和状态标签列一页采购单。" motion="auto" />
                <ThinkingTrace
                  variant="steps"
                  settled
                  motion="auto"
                  doneLabel="想了 4 秒"
                  rows={[
                    { primary: "查表格和状态标签" },
                    { primary: "按 token 选蓝和黄" },
                    { primary: "写出采购单页面" },
                  ]}
                />
              </div>
            }
            flip
          />

          <Feature
            id="templates"
            kicker="模板"
            title="四套后台，拿去改"
            copy="项目管理、财务、客户关系是整页示例。智能体模板带侧栏、思考过程和对话，点进去可以接着改。"
            links={[{ href: "/templates", label: "全部模板" }]}
            demo={
              <div className="flex min-w-0 flex-col gap-3">
                <article className="relative min-w-0 overflow-hidden rounded-2xl bg-fg-grey-50 outline outline-1 outline-fg-grey-200">
                  <div aria-hidden className="pointer-events-none flex flex-col gap-3 p-4">
                    <ChatBubble type="sent" color="blue" content="对比一下本季和上季的销量。" motion="auto" />
                    <ThinkingTrace
                      variant="steps"
                      settled
                      motion="auto"
                      doneLabel="想了 4 秒"
                      rows={[{ primary: "读取本季销量" }, { primary: "对照上季" }]}
                    />
                  </div>
                  <h3 id="home-template-agent" className="border-t border-fg-grey-200 px-4 py-3 text-sm font-semibold text-fg-black">
                    智能体
                  </h3>
                  <Link
                    href="/templates/agent"
                    aria-labelledby="home-template-agent"
                    className="absolute inset-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-blue"
                  />
                </article>
                {templates.map((item) => (
                  <article key={item.href} className="relative grid min-w-0 grid-cols-[7.5rem_minmax(0,1fr)] overflow-hidden rounded-2xl bg-white outline outline-1 outline-fg-grey-200 sm:grid-cols-[9rem_minmax(0,1fr)]">
                    <div className="relative min-h-24 bg-fg-grey-100">
                      <Image src={item.image} alt="" fill sizes="144px" className="object-cover object-top" unoptimized />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center gap-1 px-4 py-3">
                      <h3 id={`home-template-${item.title}`} className="text-sm font-semibold text-fg-black">{item.title}</h3>
                      <p className="text-sm leading-6 text-fg-grey-900">{item.text}</p>
                    </div>
                    <Link
                      href={item.href}
                      aria-labelledby={`home-template-${item.title}`}
                      className="absolute inset-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-blue"
                    />
                  </article>
                ))}
              </div>
            }
          />

          <section className="home-panel mt-4 flex min-w-0 flex-col items-start gap-5 px-5 py-10 sm:px-10 sm:py-14">
            <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-fg-black sm:text-4xl">
              从当前版本装上
            </h2>
            <p className="max-w-xl text-base leading-7 text-fg-grey-900">
              组件包版本 {coreVersion}。快速开始里有引入方式，组件目录按按钮、表格、日历和对话分开。
            </p>
            <div className="flex flex-wrap gap-3">
              <EntryLink href="/docs/quick-start" variant="primary">开始使用</EntryLink>
              <EntryLink href="/components" variant="secondary">浏览组件</EntryLink>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
