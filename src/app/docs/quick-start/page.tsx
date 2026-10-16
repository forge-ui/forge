import Link from "next/link";
import { DocArticle, DocHeader } from "../_shared";
import { PromptBlock } from "../agents-md/_prompt-block";
import { coreVersion, nodeRequirement, pnpmVersion, repoNext, repoReact } from "../_versions";

const REQUIREMENTS = [
  `Node ${nodeRequirement}`,
  `pnpm ${pnpmVersion}`,
  `Next.js ${repoNext}`,
  `React ${repoReact}`,
  "Tailwind v4",
];

const INSTALL = `pnpm add @forge-ui-official/core@${coreVersion}`;

const GLOBALS_CSS = `@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";

/* 样式文件在 app/globals.css 时用这一行 */
@source "../node_modules/@forge-ui-official/core/dist";

/* 样式文件在 src/app/globals.css 时改成这一行 */
@source "../../node_modules/@forge-ui-official/core/dist";`;

const USE = `import { Button } from "@forge-ui-official/core";

export default function Page() {
  return <Button>开始使用</Button>;
}`;

const INSTALL_SKILL = `curl -fsSL https://forgeui.org/install-skill.sh | bash`;

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
        <span className="font-display text-2xl font-semibold text-fg-blue">{n}</span>
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
        description={`把 @forge-ui-official/core ${coreVersion} 接到 Next.js 和 Tailwind v4 项目里。`}
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
          title="安装 @forge-ui-official/core"
          caption={
            <>
              当前仓库对应的版本是 {coreVersion}。要装别的版本，把命令里的版本号换掉。
            </>
          }
          code={INSTALL}
        />
        <Step
          n={2}
          title="接入 Tailwind 样式"
          caption={
            <>
              在全局样式顶部引入 Tailwind 和 Forge 的样式，并用 <code className="rounded bg-fg-grey-100 px-1 text-xs">@source</code> 让 Tailwind v4 扫描组件产物。样式文件在 <code className="rounded bg-fg-grey-100 px-1 text-xs">app/globals.css</code> 时用 <code className="rounded bg-fg-grey-100 px-1 text-xs">../node_modules</code>；在 <code className="rounded bg-fg-grey-100 px-1 text-xs">src/app/globals.css</code> 时用 <code className="rounded bg-fg-grey-100 px-1 text-xs">../../node_modules</code>。只保留和文件位置匹配的那一行。
            </>
          }
          code={GLOBALS_CSS}
        />
        <Step
          n={3}
          title="渲染第一个组件"
          caption={
            <>
              运行 <code className="rounded bg-fg-grey-100 px-1 text-xs">pnpm dev</code>。页面上应出现一颗默认的蓝色实心按钮，文字是「开始使用」。
            </>
          }
          code={USE}
        />
        <Step
          n={4}
          title="给编码助手装 skill（可选）"
          caption={
            <>
              让 Claude Code、Cursor 或 Codex 按 Forge 的用法写页面：组件从{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">@forge-ui-official/core</code> 引入，颜色用{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">fg-*</code>，图标从{" "}
              <code className="rounded bg-fg-grey-100 px-1 text-xs">@forge-ui-official/core/icons</code> 引入。装完后重启助手。
            </>
          }
          code={INSTALL_SKILL}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-fg-grey-200 pt-6 text-sm">
        <Link
          href="/docs/installation"
          className="font-semibold text-fg-blue underline underline-offset-4 hover:text-fg-blue-700"
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
