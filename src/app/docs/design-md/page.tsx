import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { PromptBlock } from "../agents-md/_prompt-block";
import { CodeBlock } from "../ui-for-agents/_code-block";

export const metadata = { title: "DESIGN.md · Forge" };

const toc = [
  { id: "preview", title: "DESIGN.md 预览" },
  { id: "usage", title: "使用" },
  { id: "difference", title: "和其他文件的分工" },
];

const designSource = fs.readFileSync(path.join(process.cwd(), "public/DESIGN.md"), "utf-8");

const usageCmd = `curl -fsSL https://forgeui.org/DESIGN.md > DESIGN.md`;

export default function DesignMdPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[{ label: "文档", href: "/docs" }, { label: "DESIGN.md" }]}
        title="DESIGN.md"
        description="Forge 的视觉规则：颜色、字色层级、字体、圆角、状态和布局。按 google-labs-code/design.md 规范编写，开头是 YAML token，后面是说明和该做、不该做的事。"
      />
      <DocSection {...toc[0]}>
        <PromptBlock content={designSource} />
      </DocSection>
      <DocSection {...toc[1]}>
        <p>放到项目根目录。DESIGN.md 不会被编码助手自动读取，要在 AGENTS.md 或 CLAUDE.md 里加一句：“所有视觉和交互决定遵循 DESIGN.md，实现时用语义 token，不写 hex。”</p>
        <p>文件里的颜色和 core 的 tokens.css 自动比对，并用官方 lint 检查结构，改动 token 时会一起报出来。</p>
        <CodeBlock code={usageCmd} lang="bash" />
      </DocSection>
      <DocSection {...toc[2]}>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>DESIGN.md 只管“长什么样”：token、层级、形状和交互底线。</li>
          <li>
            <Link href="/docs/agents-md" className="text-fg-blue hover:underline">AGENTS.md</Link> 管“怎么用 Forge”：引入方式、组件清单和工作流。
          </li>
          <li>
            <Link href="/docs/ui-for-agents" className="text-fg-blue hover:underline">Skill</Link> 和 <Link href="/docs/mcp" className="text-fg-blue hover:underline">MCP</Link> 按需提供组件参数、页面组件和模板源码，适合组件多的项目。
          </li>
        </ul>
      </DocSection>
    </DocArticle>
  );
}
