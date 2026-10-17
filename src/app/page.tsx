import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { InstallCommand } from "./_components/home-install";
import { HomeBelow, HomeWorkspace } from "./_components/home-demos";
import { coreVersion } from "./docs/_versions";
import "./_components/home-page.css";

const installCommand = `pnpm add @forge-ui-official/core@${coreVersion}`;

function PillLink({
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
          ? "inline-flex h-10 items-center justify-center rounded-full bg-fg-blue px-4 text-sm font-medium text-white hover:bg-fg-blue-600"
          : "inline-flex h-10 items-center justify-center rounded-full border border-fg-grey-300 bg-white px-4 text-sm font-medium text-fg-black hover:bg-fg-grey-50"
      }
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="home-page flex min-h-screen min-w-0 flex-col">
      <SiteHeader />
      <main className="flex min-w-0 flex-1 flex-col pb-16">
        <section className="mx-auto grid w-full min-w-0 max-w-[1200px] items-center gap-8 px-4 pb-4 pt-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-12 lg:pb-8 lg:pt-14">
          <div className="min-w-0">
            <p className="text-sm font-medium text-fg-blue">Forge {coreVersion}</p>
            <h1 className="mt-3 font-display text-[1.75rem] font-bold leading-[1.25] tracking-tight text-fg-black sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              统计、日程、看板和对话，都有现成的样子
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-fg-grey-900">
              玻璃、跟随、涟漪和文字切换都可以打开。系统要求减弱动效时，这些动画会停。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <PillLink href="/docs/quick-start" variant="primary">开始使用</PillLink>
              <PillLink href="/components" variant="secondary">浏览组件</PillLink>
            </div>
            <InstallCommand command={installCommand} label="复制安装命令" />
          </div>
          <HomeWorkspace />
        </section>
        <HomeBelow />
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 text-sm text-fg-grey-900">
        <p>Forge {coreVersion}</p>
        <nav aria-label="页脚" className="flex items-center gap-3">
          <Link href="/docs" className="hover:text-fg-black">文档</Link>
          <Link href="/components" className="hover:text-fg-black">组件</Link>
          <Link href="/templates" className="hover:text-fg-black">模板</Link>
        </nav>
      </footer>
    </div>
  );
}
