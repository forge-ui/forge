import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { PromptBlock } from "./docs/agents-md/_prompt-block";

const entries = [
  { href: "/docs/quick-start", title: "快速开始", text: "安装组件库，写出第一颗按钮。" },
  { href: "/components", title: "组件", text: "看每个组件怎么用，以及参数说明。" },
  { href: "/cases", title: "组件案例", text: "把颜色、尺寸和动效放在一起对照。" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-4">
          <h1 className="font-display text-4xl font-bold tracking-fg text-fg-black">Forge UI Kit</h1>
          <p className="max-w-2xl text-base leading-7 text-fg-grey-900">
            面向内部交付的 React 组件库。先装上，再按组件或案例往下看。
          </p>
        </header>

        <PromptBlock content="pnpm add @forge-ui-official/core" />

        <div className="grid gap-3 sm:grid-cols-3">
          {entries.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-2 rounded-2xl border border-fg-grey-200 bg-white p-4 hover:border-fg-grey-400"
            >
              <span className="text-base font-bold text-fg-black">{item.title}</span>
              <span className="text-sm leading-6 text-fg-grey-700">{item.text}</span>
            </Link>
          ))}
        </div>

        <p className="text-sm text-fg-grey-700">
          <Link href="/docs" className="font-semibold text-fg-blue underline underline-offset-4">介绍</Link>
          里是这套组件库要解决的问题。
        </p>
      </main>
    </div>
  );
}
