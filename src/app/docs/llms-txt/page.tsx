import { DocArticle, DocHeader, DocSection } from "../_shared";
import { CodeBlock } from "../ui-for-agents/_code-block";

export const metadata = { title: "LLMs.txt · Forge" };

const toc = [
  { id: "files", title: "文件列表" },
  { id: "usage", title: "使用" },
];

const files = [
  { href: "/llms.txt", description: "入口索引：列出下面这些文件和 MCP、使用指南的地址。" },
  { href: "/llms-full.md", description: "完整规范、页面组件和模板路由、组件导出清单。" },
  { href: "/llms-full-cn.md", description: "中文入口，正文与 llms-full.md 同源。" },
  { href: "/llms-semantic.md", description: "语义、布局、状态、浮层和动效规范。" },
  { href: "/llms-components.md", description: "每个组件的导出签名和 Props。" },
  { href: "/DESIGN.md", description: "一页纸视觉规则。" },
];

const usage = `请先读 https://forgeui.org/llms.txt ，
再按需读取 llms-components.md 里的组件参数，用 Forge 实现这个页面：……`;

export default function LlmsTxtPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[{ label: "文档", href: "/docs" }, { label: "LLMs.txt" }]}
        title="LLMs.txt"
        description="把 Forge 文档整理成纯文本，方便 ChatGPT、Claude 等不装 Skill 的助手直接读取。"
      />
      <DocSection {...toc[0]}>
        <ul className="flex flex-col gap-3">
          {files.map((file) => (
            <li key={file.href} className="flex flex-col gap-0.5">
              <a href={file.href} target="_blank" rel="noreferrer" className="font-mono text-sm font-semibold text-fg-blue hover:underline">
                {file.href}
              </a>
              <span>{file.description}</span>
            </li>
          ))}
        </ul>
        <p>文件由仓库源码生成，随站点一起发布，和当前组件版本一致。</p>
      </DocSection>
      <DocSection {...toc[1]}>
        <p>在对话开头发给助手：</p>
        <CodeBlock code={usage} />
        <p>能装插件的编码助手优先用 Skill 或 MCP，按需读取，比整份文本省上下文。</p>
      </DocSection>
    </DocArticle>
  );
}
