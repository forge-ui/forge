import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { PromptBlock } from "../agents-md/_prompt-block";

const toc = [
  { id: "prereq", title: "前置" },
  { id: "token", title: "生成 Token" },
  { id: "npmrc", title: "配 .npmrc" },
  { id: "export", title: "注入 Token" },
  { id: "install", title: "装包" },
  { id: "wire", title: "接 Tailwind" },
  { id: "peer", title: "Peer deps" },
  { id: "upgrade", title: "升级" },
];

const NPMRC = `@forge-ui:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}`;

const EXPORT_TOKEN = `# 临时：放进当前 shell
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx

# 持久：写进 ~/.zshrc 或用 direnv 的 .envrc
# 注意不要把 token 提交进 git，.npmrc 本身也建议 gitignore`;

const INSTALL = `pnpm add @forge-ui/react`;

const GLOBALS_CSS = `@import "tailwindcss";
@import "@forge-ui/react/styles.css";

/* 让 Tailwind v4 扫 node_modules 里的组件产物，
   不然组件用到的 bg-fg-violet、tracking-fg 之类的 utility class 都不会生成 */
@source "../../node_modules/@forge-ui/react/dist";`;

const UPGRADE = `# 升级到最新
pnpm update @forge-ui/react

# 升级到指定版本
pnpm add @forge-ui/react@0.2.0`;

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
          <li>
            GitHub 账号被加进 <code>forge-ui</code> org 并拿到 packages 的 read 权限。
            找 org 管理员拉你进 team。
          </li>
        </ul>
      </DocSection>

      <DocSection id="token" title="生成 Personal Access Token">
        <p>
          <code>@forge-ui/react</code> 发在 GitHub Packages 的 <code>forge-ui</code> org 下，
          默认私有，装之前要先拿 token。
        </p>
        <p>
          去 GitHub 的{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noreferrer"
            className="text-fg-violet underline underline-offset-4 hover:text-fg-violet-700"
          >
            Personal access tokens (classic)
          </a>{" "}
          页面，<strong>Generate new token (classic)</strong>，只勾选{" "}
          <code>read:packages</code> 这一个 scope，过期时间按你们规定。拿到 <code>ghp_</code>{" "}
          开头的字符串，只会显示一次。
        </p>
      </DocSection>

      <DocSection id="npmrc" title="配 .npmrc">
        <p>
          项目根目录新建 <code>.npmrc</code>，把 <code>@forge-ui</code> scope 指向 GitHub Packages，
          顺便读取 shell 里的 token：
        </p>
        <PromptBlock content={NPMRC} />
        <p>
          强烈建议把 <code>.npmrc</code> 加进 <code>.gitignore</code>——虽然里面只是 token 占位符，
          但团队里每个人的 token 都是独立的。
        </p>
      </DocSection>

      <DocSection id="export" title="注入 Token">
        <PromptBlock content={EXPORT_TOKEN} />
      </DocSection>

      <DocSection id="install" title="装包">
        <PromptBlock content={INSTALL} />
        <p>
          装成功的话，<code>node_modules/@forge-ui/react/dist/</code>{" "}
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
          <code>@forge-ui/react</code> 不打包以下依赖，需要你项目里自己有（版本对齐很重要）：
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
        <p>
          发版节奏看{" "}
          <a
            href="https://github.com/forge-ui/forge-core/releases"
            target="_blank"
            rel="noreferrer"
            className="text-fg-violet underline underline-offset-4 hover:text-fg-violet-700"
          >
            forge-core Releases
          </a>
          ，每个 tag 有 changelog。升级命令：
        </p>
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
