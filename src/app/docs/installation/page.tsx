import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { PromptBlock } from "../agents-md/_prompt-block";
import { coreVersion, nodeRequirement, peerNext, peerReact, pnpmVersion, repoNext } from "../_versions";

const toc = [
  { id: "prereq", title: "前置" },
  { id: "install", title: "装包" },
  { id: "wire", title: "接 Tailwind" },
  { id: "peer", title: "Peer deps" },
  { id: "upgrade", title: "升级" },
];

const INSTALL = `pnpm add @forge-ui-official/core@${coreVersion}`;

const GLOBALS_CSS = `@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";

/* 让 Tailwind v4 扫描组件产物，否则 bg-fg-violet、tracking-fg 这类 class 不会生成。
   app/globals.css 用第一行，src/app/globals.css 用第二行，只保留一行。 */
@source "../node_modules/@forge-ui-official/core/dist";
@source "../../node_modules/@forge-ui-official/core/dist";`;

const UPGRADE = `# 升级到最新
pnpm update @forge-ui-official/core

# 安装指定版本。${coreVersion} 是当前仓库版本，其他版本替换这个号
pnpm add @forge-ui-official/core@${coreVersion}`;

export default function InstallationPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "详细安装" },
        ]}
        title="详细安装"
        description="说明每一步在做什么。想先看到一颗按钮，直接看快速开始。"
      />

      <DocSection id="prereq" title="前置">
        <ul className="list-disc space-y-1 pl-5">
          <li>Node.js {nodeRequirement}（与本仓库 <code>engines</code> 一致）</li>
          <li>pnpm {pnpmVersion}（与本仓库 <code>packageManager</code> 一致。npm / yarn 也可以，示例用 pnpm）</li>
          <li>Next.js {peerNext}（本仓库使用 {repoNext}，App Router）</li>
          <li>React {peerReact}、React DOM {peerReact}</li>
          <li>Tailwind CSS v4</li>
          <li>组件包版本 {coreVersion}</li>
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
          在全局样式顶部引入 Tailwind 和 Forge 的样式，并用 <code>@source</code> 扫描产物目录。
          样式文件在 <code>app/globals.css</code> 时路径是 <code>../node_modules/...</code>；
          在 <code>src/app/globals.css</code> 时路径是 <code>../../node_modules/...</code>。下面两行只留和文件位置匹配的一行：
        </p>
        <PromptBlock content={GLOBALS_CSS} />
      </DocSection>

      <DocSection id="peer" title="Peer dependencies">
        <p>
          <code>@forge-ui-official/core</code> 不打包以下依赖，需要你项目里自己有（版本对齐很重要）：
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <code>react</code> {peerReact}、<code>react-dom</code> {peerReact}
          </li>
          <li>
            <code>tailwindcss</code> ^4（以及 <code>@tailwindcss/postcss</code>）
          </li>
          <li>
            <code>@solar-icons/react</code> ^2.3.2（React 实现为 MIT；Solar 图形由 480 Design 提供，采用 CC BY 4.0）
          </li>
          <li>
            <code>next</code> {peerNext}（根入口包含 AppLayout 与 StyledLink，因此是必需 peer dependency）
          </li>
        </ul>
        <p>pnpm 装完如果提示某个 peer 缺失，按提示补装。</p>
      </DocSection>

      <DocSection id="upgrade" title="升级">
        <p>升级命令：</p>
        <PromptBlock content={UPGRADE} />
        <p>
          升级后重新运行 <code>pnpm dev</code>，打开{" "}
          <Link href="/components" className="text-fg-blue underline underline-offset-4 hover:text-fg-blue-700">
            组件页
          </Link>
          ，核对样式和交互是否仍符合预期。
        </p>
      </DocSection>
    </DocArticle>
  );
}
