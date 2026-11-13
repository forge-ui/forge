import Link from "next/link";
import { coreVersion, nodeRequirement, repoNext } from "../../docs/_versions";
import { Callout, Code, PreviewToc, Step, Steps } from "../_chrome";

const toc = [
  { id: "install", title: "安装组件库" },
  { id: "styles", title: "接入样式" },
  { id: "fonts", title: "加载字体" },
  { id: "first-component", title: "渲染第一个组件" },
  { id: "agents", title: "给编码助手装 Skill" },
  { id: "shadcn", title: "用过 shadcn init 的项目" },
  { id: "next", title: "下一步" },
];

const GLOBALS_CSS = `@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";

/* app/globals.css 用这一行；src/app/globals.css 改成 ../../node_modules */
@source "../node_modules/@forge-ui-official/core/dist";`;

const FONTS = `// app/layout.tsx
import "@fontsource-variable/manrope";
import "@fontsource-variable/plus-jakarta-sans";

/* app/globals.css */
:root {
  --font-manrope: "Manrope Variable", system-ui, sans-serif;
  --font-plus-jakarta-sans: "Plus Jakarta Sans Variable", system-ui, sans-serif;
}`;

const USE = `import { Button } from "@forge-ui-official/core";

export default function Page() {
  return <Button>开始使用</Button>;
}`;

const SHADCN_FIX = `/* 把 @theme inline 里的这两行 */
--font-sans: var(--font-sans);
--font-heading: var(--font-sans);

/* 改成 */
--font-sans: var(--font-manrope);
--font-heading: var(--font-plus-jakarta-sans);`;

export default function QuickStartPreview() {
  return (
    <div className="mx-auto flex w-full max-w-[1080px] gap-14">
      <article className="flex min-w-0 max-w-[760px] flex-1 flex-col gap-8 pt-10 pb-28">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-medium text-fg-black">入门</p>
          <h1 className="font-display text-[32px] font-semibold leading-tight tracking-[-0.01em] text-fg-black">快速开始</h1>
          <p className="text-lg leading-8 text-fg-grey-700">五分钟把 Forge 接进一个 Next.js 项目：装组件库、接样式、渲染第一个按钮。</p>
        </header>

        <p className="leading-7 text-fg-black/85">
          Forge 是一个 npm 包加一份样式文件。装好之后，在页面里直接引入组件就能用，不需要额外的 Provider 或配置文件。下面的步骤按顺序做一遍，最后页面上会出现一颗蓝色按钮。
        </p>

        <Callout title="开始前需要">
          <ul className="ml-4 list-disc space-y-1">
            <li>Node {nodeRequirement}</li>
            <li>一个 Next.js {repoNext} 以上、React 19、Tailwind CSS v4 的项目。没有的话先运行 <code>npx create-next-app@latest</code>。</li>
          </ul>
        </Callout>

        <Steps>
          <Step id="install" title="安装组件库">
            <Code label="终端">{`pnpm add @forge-ui-official/core@${coreVersion}`}</Code>
            <p className="leading-7 text-fg-black/85">当前版本是 {coreVersion}。用 npm 或 yarn 也可以，把 <code>pnpm add</code> 换成对应的命令。</p>
          </Step>
          <Step id="styles" title="接入样式">
            <p className="leading-7 text-fg-black/85">在全局样式文件顶部引入 Tailwind 和 Forge 的样式。<code>@source</code> 让 Tailwind 扫描组件里用到的类名，路径要和样式文件的位置对应。</p>
            <Code label="app/globals.css">{GLOBALS_CSS}</Code>
          </Step>
          <Step id="fonts" title="加载字体">
            <p className="leading-7 text-fg-black/85">正文用 Manrope，标题用 Plus Jakarta Sans，中文跟随系统字体。不加载也能用，会退回系统字体，只是和官网看起来不一样。</p>
            <Code label="终端">{"pnpm add @fontsource-variable/manrope @fontsource-variable/plus-jakarta-sans"}</Code>
            <Code>{FONTS}</Code>
          </Step>
          <Step id="first-component" title="渲染第一个组件">
            <Code label="app/page.tsx">{USE}</Code>
            <p className="leading-7 text-fg-black/85">运行 <code>pnpm dev</code>，打开 <code>http://localhost:3000</code>，页面上应出现一颗蓝色实心按钮，文字是「开始使用」。</p>
          </Step>
          <Step id="agents" title="给编码助手装 Skill（可选）">
            <p className="leading-7 text-fg-black/85">让 Claude Code、Codex 和 Cursor 按 Forge 的规范写页面：选对组件、用对颜色，写完自己检查。</p>
            <Code label="终端">{"curl -fsSL https://www.forgeui.org/setup.sh | bash"}</Code>
          </Step>
        </Steps>

        <section id="shadcn" className="flex scroll-mt-24 flex-col gap-4 pt-4">
          <h2 className="text-2xl font-semibold leading-8 text-fg-black">用过 shadcn init 的项目</h2>
          <p className="leading-7 text-fg-black/85">
            安装 <Link href="/blocks" className="prose-link">页面组件</Link> 时，<code>npx shadcn add</code> 会先运行 shadcn init。init 写入的 <code>--font-sans: var(--font-sans)</code> 引用了自己，整站会变成衬线字，改成下面这样就好：
          </p>
          <Code label="app/globals.css">{SHADCN_FIX}</Code>
        </section>

        <section id="next" className="flex scroll-mt-24 flex-col gap-4 pt-4">
          <h2 className="text-2xl font-semibold leading-8 text-fg-black">下一步</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/blocks", title: "页面组件", body: "70 个整页区块，一条命令复制进项目。" },
              { href: "/templates", title: "后台模板", body: "CRM、电商、财务等完整后台，直接点开体验。" },
              { href: "/docs/theme", title: "主题定制", body: "换主色、圆角和字体，生成一段 CSS。" },
              { href: "/docs/ui-for-agents", title: "前端设计 Skill", body: "让编码助手按同一套规范写页面。" },
            ].map(card => (
              <Link key={card.href} href={card.href} className="flex flex-col gap-1 rounded-2xl border border-fg-grey-200 bg-background p-4 transition-colors hover:border-fg-grey-300">
                <span className="font-medium text-fg-black">{card.title}</span>
                <span className="text-sm leading-6 text-fg-grey-700">{card.body}</span>
              </Link>
            ))}
          </div>
        </section>
      </article>
      <PreviewToc items={toc} />
    </div>
  );
}
