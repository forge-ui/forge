import Link from "next/link";
import { DocArticle, DocHeader } from "../_shared";
import { PromptBlock } from "../agents-md/_prompt-block";

const REQUIREMENTS = [
  "Node 20+",
  "pnpm 9+",
  "Next.js 16+",
  "React 19+",
  "Tailwind v4",
  "GitHub org access",
];

const NPMRC = `@forge-ui:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}`;

const INSTALL = `export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
pnpm add @forge-ui/react`;

const FREE_INSTALL = `pnpm add @forge-ui-official/core`;

const GLOBALS_CSS = `@import "tailwindcss";
@import "@forge-ui/react/styles.css";
@source "../../node_modules/@forge-ui/react/dist";`;

const USE = `import { Button } from "@forge-ui/react";

export default function Page() {
  return <Button>Hello Forge</Button>;
}`;

const INSTALL_SKILL = `curl -fsSL https://forge-mu-amber.vercel.app/install-skill.sh | bash`;

function Step({
  n,
  title,
  caption,
  code,
}: {
  n: number;
  title: string;
  caption?: React.ReactNode;
  code: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl font-semibold text-fg-violet">{n}</span>
        <h2 className="font-display text-xl font-semibold tracking-fg text-fg-black">{title}</h2>
      </div>
      {caption && (
        <p className="text-sm leading-relaxed text-fg-grey-700">{caption}</p>
      )}
      <PromptBlock content={code} />
    </section>
  );
}

export default function QuickStartPage() {
  return (
    <DocArticle>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "快速开始" },
        ]}
        title="快速开始"
        description="5 分钟把 @forge-ui/react 接进 Next.js 16 + Tailwind v4 项目。"
      />

      <div className="flex flex-wrap gap-2">
        {REQUIREMENTS.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-fg-grey-100 px-3 py-1 text-xs font-medium text-fg-grey-900"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-orange-50 p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-fg-violet px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
            FREE · MIT
          </span>
          <span className="text-sm font-semibold tracking-fg text-fg-black">
            先试试免费版？1 行命令搞定，无需 PAT
          </span>
        </div>
        <p className="text-sm leading-relaxed text-fg-grey-700">
          <code className="rounded bg-white/70 px-1 text-xs">@forge-ui-official/core</code>{" "}
          含 30+ 原子组件（Button、TextField、Tooltip、Datepicker、Pagination 等），MIT license，发到公共 npm。直接装就能用：
        </p>
        <PromptBlock content={FREE_INSTALL} />
        <p className="text-xs text-fg-grey-700">
          下面是 <strong>Pro 版</strong>（<code className="rounded bg-white/70 px-1">@forge-ui/react</code>）安装步骤，含 DataTable Pro · 全部 Calendar · 16 个 Charts · 17 个业务 Card · AppLayout · 所有 case 页。
          <Link href="/waitlist" className="ml-1 font-semibold text-fg-violet underline">加入早鸟名单</Link>。
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <Step
          n={1}
          title="新建 .npmrc"
          caption={
            <>
              项目根目录加一份 <code className="rounded bg-fg-grey-100 px-1 text-xs">.npmrc</code>，告诉 pnpm{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">@forge-ui</code> 这个 scope 要去 GitHub Packages 拉。
            </>
          }
          code={NPMRC}
        />
        <Step
          n={2}
          title="安装 @forge-ui/react"
          caption={
            <>
              去 GitHub 生成一个带 <code className="rounded bg-fg-grey-100 px-1 text-xs">read:packages</code> 权限的 classic PAT，丢进 shell 再装包。
            </>
          }
          code={INSTALL}
        />
        <Step
          n={3}
          title="接入 Tailwind 样式"
          caption={
            <>
              在 <code className="rounded bg-fg-grey-100 px-1 text-xs">app/globals.css</code> 顶部加这三行：引入 Tailwind、引入 Forge 的 token 样式、让 Tailwind v4 扫到 Kit 组件产物里的 utility class。
            </>
          }
          code={GLOBALS_CSS}
        />
        <Step
          n={4}
          title="渲染第一个组件"
          caption={
            <>
              <code className="rounded bg-fg-grey-100 px-1 text-xs">pnpm dev</code> 跑起来，页面上看到紫色胶囊按钮就通了。
            </>
          }
          code={USE}
        />
        <Step
          n={5}
          title="顺手给 AI 装一份 skill（可选）"
          caption={
            <>
              让 Claude Code / Cursor / Codex 看懂 Forge 的规矩——组件从{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">@forge-ui/react</code> 拿、颜色走{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">fg-*</code> token、icon 走{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">solar-icon-set</code>，不再手搓 div 复刻组件。装完重启一下 agent。
            </>
          }
          code={INSTALL_SKILL}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-fg-grey-200 pt-6 text-sm">
        <Link
          href="/docs/installation"
          className="font-semibold text-fg-violet underline underline-offset-4 hover:text-fg-violet-700"
        >
          详细安装说明 →
        </Link>
        <Link
          href="/docs/troubleshoot"
          className="font-semibold text-fg-grey-900 underline underline-offset-4 hover:text-fg-black"
        >
          遇到问题？
        </Link>
        <Link
          href="/docs/ui-for-agents"
          className="font-semibold text-fg-grey-900 underline underline-offset-4 hover:text-fg-black"
        >
          AI skill 说明
        </Link>
        <Link
          href="/components"
          className="font-semibold text-fg-grey-900 underline underline-offset-4 hover:text-fg-black"
        >
          看全部组件
        </Link>
      </div>
    </DocArticle>
  );
}
