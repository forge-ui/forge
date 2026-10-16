import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { HomePromo, HomeStage } from "./_components/home-stage";
import { InstallCommand } from "./_components/home-install";
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
          ? "inline-flex h-9 items-center justify-center rounded-full bg-fg-blue px-4 text-sm font-medium text-white hover:bg-fg-blue-600"
          : "inline-flex h-9 items-center justify-center rounded-full border border-fg-grey-300 bg-transparent px-4 text-sm font-medium text-fg-black hover:bg-white"
      }
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="home-page flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex min-w-0 flex-1 flex-col items-center px-4 pb-12 pt-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="inline-flex h-6 items-center rounded-full bg-fg-blue/15 px-3 text-xs text-fg-blue">
            Forge {coreVersion}
          </p>
          <h1 className="mt-4 font-display text-[1.75rem] font-bold leading-none tracking-tight text-fg-black sm:text-4xl lg:text-5xl">
            内部后台，默认就能排。
            <span className="block text-fg-grey-800/70">颜色、动效都能改。</span>
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-base leading-7 text-fg-grey-800 md:text-lg md:leading-7">
            一套给内部系统用的 React 组件。按钮、表格、日历和对话按同一套 token 出厂，动效会跟着系统的减弱设置走。
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <PillLink href="/docs/quick-start" variant="primary">开始使用</PillLink>
            <PillLink href="/components" variant="secondary">浏览组件</PillLink>
          </div>
          <InstallCommand command={installCommand} label="复制安装命令" />
        </div>
        <HomeStage version={coreVersion} />
        <HomePromo />
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 text-sm text-fg-grey-800">
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
