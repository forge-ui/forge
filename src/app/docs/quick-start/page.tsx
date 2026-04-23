import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { PromptBlock } from "../agents-md/_prompt-block";

const toc = [
  { id: "prereq", title: "前置" },
  { id: "install", title: "装" },
  { id: "wire", title: "接" },
  { id: "use", title: "用" },
  { id: "troubleshoot", title: "装不上？" },
  { id: "upgrade", title: "升级" },
  { id: "next", title: "往哪走" },
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

const USE = `import { Button } from "@forge-ui/react";

export default function Page() {
  return <Button>Hello Forge</Button>;
}`;

const UPGRADE = `# 升级到最新
pnpm update @forge-ui/react

# 升级到指定版本
pnpm add @forge-ui/react@0.2.0`;

export default function QuickStartPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "快速开始" },
        ]}
        title="快速开始"
        description="把 @forge-ui/react 接到一个已有的 Next.js 16 + Tailwind v4 项目里。全程大概 5 分钟。"
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

      <DocSection id="install" title="装">
        <p>
          <code>@forge-ui/react</code> 发在 GitHub Packages 的 <code>forge-ui</code> org 下，
          默认私有，装之前要先拿 token。
        </p>

        <h3 className="text-xl font-semibold text-fg-black">1. 生成一个 Personal Access Token</h3>
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

        <h3 className="text-xl font-semibold text-fg-black">2. 项目根目录加 .npmrc</h3>
        <p>
          把 <code>@forge-ui</code> scope 指向 GitHub Packages，顺便读取 shell 里的 token：
        </p>
        <PromptBlock content={NPMRC} />
        <p>
          强烈建议把 <code>.npmrc</code> 加进 <code>.gitignore</code>——虽然里面只是 token 占位符，
          但团队里每个人的 token 都是独立的。
        </p>

        <h3 className="text-xl font-semibold text-fg-black">3. 把 token 注入 shell</h3>
        <PromptBlock content={EXPORT_TOKEN} />

        <h3 className="text-xl font-semibold text-fg-black">4. 装</h3>
        <PromptBlock content={INSTALL} />
        <p>
          装成功的话，<code>node_modules/@forge-ui/react/dist/</code>{" "}
          里会有 js + d.ts + styles.css。
        </p>
      </DocSection>

      <DocSection id="wire" title="接">
        <p>
          在 <code>app/globals.css</code> 顶部 import Tailwind 和 Forge 的 token 样式，
          并用 <code>@source</code> 让 Tailwind v4 去扫 Forge 产物目录：
        </p>
        <PromptBlock content={GLOBALS_CSS} />
        <p>
          <strong>关于 peer dependencies：</strong>
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

      <DocSection id="use" title="用">
        <p>
          到这一步就可以 import 了。页面里丢一个 <code>Button</code>：
        </p>
        <PromptBlock content={USE} />
        <p>
          <code>pnpm dev</code> 起服务，页面上应该出现一个紫色胶囊按钮。看到了就说明
          token、utility class、组件三件套都通了。
        </p>
      </DocSection>

      <DocSection id="troubleshoot" title="装不上？">
        <p>常见几种失败，按症状对：</p>
        <dl className="flex flex-col gap-4">
          <div>
            <dt className="font-semibold text-fg-black">
              <code>401 Unauthorized</code> / <code>403 Forbidden</code>
            </dt>
            <dd className="mt-1 pl-4">
              token 没 <code>read:packages</code> scope，或过期了，或你还没被加进 org。
              跑 <code>echo $GITHUB_TOKEN</code> 先确认 shell 里拿到了 token。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-fg-black">装上了但样式全灰 / 按钮没颜色</dt>
            <dd className="mt-1 pl-4">
              Tailwind 没扫到产物。确认 <code>globals.css</code> 里 <code>@source</code>{" "}
              相对路径能从 css 文件定位到 <code>node_modules/@forge-ui/react/dist</code>。
              monorepo 里路径可能是 <code>../../../node_modules/...</code>。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-fg-black">
              <code>Cannot find module &quot;@forge-ui/react/styles.css&quot;</code>
            </dt>
            <dd className="mt-1 pl-4">
              装的是太旧的版本（<code>0.1.0</code> 之前）。跑{" "}
              <code>pnpm update @forge-ui/react</code>，或检查 <code>package.json</code>{" "}
              里版本是不是 <code>^0.1.0</code>。
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-fg-black">React peer dep 警告</dt>
            <dd className="mt-1 pl-4">
              项目 React 版本 &lt; 19。升到 19 或以上。Forge 里用了 React 19 的特性，
              18 以下用不了。
            </dd>
          </div>
        </dl>
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
          ，每个 tag 有 changelog。升级就是：
        </p>
        <PromptBlock content={UPGRADE} />
        <p>
          升完之后重跑 <code>pnpm dev</code>，顺手到 <code>/components</code>{" "}
          页点一遍新版本的组件，看有没有破坏兼容。
        </p>
      </DocSection>

      <DocSection id="next" title="往哪走">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/components"
            className="group flex flex-col gap-1 rounded-xl border border-fg-grey-200 bg-white p-5 transition-colors hover:border-fg-violet hover:bg-fg-violet-50"
          >
            <span className="text-sm font-semibold text-fg-black group-hover:text-fg-violet">
              看全部组件 →
            </span>
            <span className="text-xs leading-relaxed text-fg-grey-700">
              每个组件的变体、props、能用在哪
            </span>
          </Link>
          <Link
            href="/templates"
            className="group flex flex-col gap-1 rounded-xl border border-fg-grey-200 bg-white p-5 transition-colors hover:border-fg-violet hover:bg-fg-violet-50"
          >
            <span className="text-sm font-semibold text-fg-black group-hover:text-fg-violet">
              看拼好的页面 →
            </span>
            <span className="text-xs leading-relaxed text-fg-grey-700">
              dashboard、ecommerce 成品模板，直接拿
            </span>
          </Link>
          <Link
            href="/docs/ui-for-agents"
            className="group flex flex-col gap-1 rounded-xl border border-fg-grey-200 bg-white p-5 transition-colors hover:border-fg-violet hover:bg-fg-violet-50"
          >
            <span className="text-sm font-semibold text-fg-black group-hover:text-fg-violet">
              给 AI 写规则 →
            </span>
            <span className="text-xs leading-relaxed text-fg-grey-700">
              一份 AGENTS.md，让 Claude / Cursor 按 Forge 方式写代码
            </span>
          </Link>
        </div>
      </DocSection>
    </DocArticle>
  );
}
