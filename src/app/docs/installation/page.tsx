import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { PromptBlock } from "../agents-md/_prompt-block";

const toc = [
  { id: "prereq", title: "前置" },
  { id: "install", title: "装包" },
  { id: "wire", title: "接 Tailwind" },
  { id: "peer", title: "Peer deps" },
  { id: "upgrade", title: "升级" },
];

const INSTALL = `pnpm add @forge-ui-official/core`;

const GLOBALS_CSS = `@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";

/* 让 Tailwind v4 扫 node_modules 里的组件产物，
   不然组件用到的 bg-fg-violet、tracking-fg 之类的 utility class 都不会生成 */
@source "../../node_modules/@forge-ui-official/core/dist";`;

const UPGRADE = `# 升级到最新
pnpm update @forge-ui-official/core

# 升级到指定版本
pnpm add @forge-ui-official/core@0.2.0`;

export default function InstallationPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "详细安装" },
        ]}
        title="详细安装"
        description="逐步说明每一步在做什么、为什么。想先跑起来看效果，直接看 /docs/quick-start。"
      />

      <DocSection id="prereq" title="前置">
        <ul className="list-disc space-y-1 pl-5">
          <li>Node.js 20+</li>
          <li>pnpm 9+（npm / yarn 也行，示例用 pnpm）</li>
          <li>Next.js 16+（App Router）</li>
          <li>React 19+、React DOM 19+</li>
          <li>Tailwind CSS v4</li>
        </ul>
      </DocSection>

      <DocSection id="install" title="装包">
        <PromptBlock content={INSTALL} />
        <p>
          装成功的话，<code>node_modules/@forge-ui-official/core/dist/</code>{" "}
          里会有 js + d.ts + styles.css。
        </p>
      </DocSection>

      <DocSection id="wire" title="接 Tailwind">
        <p>
          在 <code>app/globals.css</code> 顶部 import Tailwind 和 Forge 的 token 样式，
          并用 <code>@source</code> 让 Tailwind v4 去扫 Forge 产物目录：
        </p>
        <PromptBlock content={GLOBALS_CSS} />
      </DocSection>

      <DocSection id="peer" title="Peer dependencies">
        <p>
          <code>@forge-ui-official/core</code> 不打包以下依赖，需要你项目里自己有（版本对齐很重要）：
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>react</code> {">="}19、<code>react-dom</code> {">="}19
          </li>
          <li>
            <code>tailwindcss</code> ^4（以及 <code>@tailwindcss/postcss</code>）
          </li>
          <li>
            <code>solar-icon-set</code> ^2
          </li>
          <li>
            <code>next</code> {">="}15（可选，只在用到 AppLayout 等依赖 next/link 的组件时才需要）
          </li>
        </ul>
        <p>pnpm 装完如果提示某个 peer 缺失，按提示补装。</p>
      </DocSection>

      <DocSection id="upgrade" title="升级">
        <p>升级命令：</p>
        <PromptBlock content={UPGRADE} />
        <p>
          升完重跑 <code>pnpm dev</code>，顺手到{" "}
          <Link href="/components" className="text-fg-violet underline underline-offset-4 hover:text-fg-violet-700">
            /components
          </Link>{" "}
          页点一遍新版本的组件，看有没有破坏兼容。
        </p>
      </DocSection>
    </DocArticle>
  );
}
