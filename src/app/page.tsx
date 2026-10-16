import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { PromptBlock } from "./docs/agents-md/_prompt-block";
import { coreVersion } from "./docs/_versions";

const entries = [
  { href: "/docs", title: "文档", text: "组件库要解决的问题，以及接入方式。" },
  { href: "/docs/quick-start", title: "快速开始", text: "安装组件包，在页面上放一颗按钮。" },
  { href: "/components", title: "组件", text: "每个组件的用法和参数。" },
  { href: "/cases", title: "组件案例", text: "颜色、尺寸，以及可以操作的场景。" },
  { href: "/templates", title: "模板", text: "用组件拼好的后台页面，可以拿来改。" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-4">
          <h1 className="font-display text-4xl font-bold tracking-fg text-fg-black">Forge UI Kit</h1>
          <p className="max-w-2xl text-base leading-7 text-fg-grey-900">
            用于内部后台的 React 组件库。文档、组件、案例和模板都从这里进入。
          </p>
        </header>

        <PromptBlock content={`pnpm add @forge-ui-official/core@${coreVersion}`} />

        <div className="grid gap-3 sm:grid-cols-2">
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

      </main>
    </div>
  );
}
