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

const GLOBALS_CSS = `@import "tailwindcss";
@import "@forge-ui/react/styles.css";
@source "../../node_modules/@forge-ui/react/dist";`;

const USE = `import { Button } from "@forge-ui/react";

export default function Page() {
  return <Button>Hello Forge</Button>;
}`;

const INSTALL_SKILL = `curl -fsSL https://forge-ui.github.io/forge/install-skill.sh | bash`;

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

      <div className="flex flex-col gap-8">
        <Step
          n={1}
          title="配 .npmrc"
          caption={
            <>
              项目根目录新建 <code className="rounded bg-fg-grey-100 px-1 text-xs">.npmrc</code>，把{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">@forge-ui</code> scope 指向 GitHub Packages。
            </>
          }
          code={NPMRC}
        />
        <Step
          n={2}
          title="装"
          caption={
            <>
              从 GitHub 生成一个带 <code className="rounded bg-fg-grey-100 px-1 text-xs">read:packages</code> 权限的 PAT，export 到 shell 后安装。
            </>
          }
          code={INSTALL}
        />
        <Step
          n={3}
          title="接 Tailwind"
          caption={
            <>
              在 <code className="rounded bg-fg-grey-100 px-1 text-xs">app/globals.css</code> 顶部加三行：import
              Tailwind、import 组件样式、让 Tailwind 扫产物目录。
            </>
          }
          code={GLOBALS_CSS}
        />
        <Step
          n={4}
          title="用"
          caption={
            <>
              <code className="rounded bg-fg-grey-100 px-1 text-xs">pnpm dev</code>，页面上看到紫色按钮就通了。
            </>
          }
          code={USE}
        />
        <Step
          n={5}
          title="给 AI 装 skill（可选）"
          caption={
            <>
              让 Claude Code / Cursor / Codex 自动按 Forge 规范拼页面——import 走{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">@forge-ui/react</code>，颜色走{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">fg-*</code> token，icon 走{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">solar-icon-set</code>，不会手搓 div 复刻。装完重启一下 agent 即可生效。
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
