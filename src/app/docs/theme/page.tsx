import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { parseScale } from "@/lib/theme.mjs";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { ThemeGenerator } from "./_theme-generator";

export const metadata = { title: "主题定制 · Forge" };

const toc = [
  { id: "generator", title: "生成主题" },
  { id: "usage", title: "使用" },
  { id: "scope", title: "能改什么" },
];

const reference = parseScale(fs.readFileSync(path.join(process.cwd(), "core/src/styles/tokens.css"), "utf-8"));

export default function ThemePage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[{ label: "文档", href: "/docs" }, { label: "主题定制" }]}
        title="主题定制"
        description="选主色、圆角和字体，右边是真实组件的预览，下面直接生成可以复制的 CSS。不用改组件代码，也不用等 core 发版。"
      />
      <DocSection {...toc[0]}>
        <ThemeGenerator reference={reference} />
      </DocSection>
      <DocSection {...toc[1]}>
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>把生成的 CSS 放进全局样式文件，写在 <code>@import &quot;@forge-ui-official/core/styles.css&quot;</code> 之后。</li>
          <li>换了字体的话，确认项目里加载了对应字体。如果在 <code>&lt;html style&gt;</code> 里写过 <code>--font-manrope</code>，内联样式优先，要改那里。</li>
          <li>用编码助手的项目，把主色也写进 <Link href="/docs/design-md" className="text-fg-blue hover:underline">DESIGN.md</Link> 的 primary，助手生成页面时才会和主题一致。</li>
        </ol>
      </DocSection>
      <DocSection {...toc[2]}>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>主色：按 Forge 蓝的明暗曲线生成 50 到 900 的整套色阶，覆盖 <code>--fg-blue-*</code>。所有用 <code>color=&quot;blue&quot;</code>（默认值）的组件和 <code>accent</code> 都跟着变，蓝色的状态标签也会变成主色。</li>
          <li>圆角：按比例缩放 Tailwind 的 <code>--radius-*</code> 和卡片圆角；<code>rounded-full</code> 的胶囊按钮、头像保持不变。</li>
          <li>字体：替换正文和标题两个字体变量。</li>
          <li>灰色、白色和深色模式暂时不能改：core 里还有大量直接写死的灰色和白色，要先换成语义 token。</li>
        </ul>
      </DocSection>
    </DocArticle>
  );
}
