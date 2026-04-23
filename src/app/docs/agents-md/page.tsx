import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { CodeBlock } from "../ui-for-agents/_code-block";
import { PromptBlock } from "./_prompt-block";

const toc = [
  { id: "preview", title: "AGENTS.md 预览" },
  { id: "usage", title: "使用" },
  { id: "what-it-does", title: "内容覆盖" },
  { id: "options", title: "放哪个文件" },
  { id: "related", title: "相关文档" },
];

const promptSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/docs/agents-md/_prompt.md"),
  "utf-8",
);

const usageCmd = `# 推荐：粘到项目根的 AGENTS.md
curl -fsSL https://forge.ui/agents-md > AGENTS.md`;

export default function AgentsMdPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "AGENTS.md" },
        ]}
        title="AGENTS.md"
        description="把 Forge 规则作为单文件粘到项目根，AI 编码助手自动读。"
      />

      <div className="text-base font-normal leading-[1.8] text-fg-grey-900">
        <p>
          给 AI 编码助手的 Forge 规则清单。比 Skill 简单——不需要安装、不需要按需加载，一个 Markdown 文件搞定。适合轻量项目或快速试用。
        </p>
        <p className="mt-3 rounded-lg border border-fg-yellow-200 bg-fg-yellow-50 px-4 py-3 text-sm text-fg-black">
          <strong>提示：</strong>
          组件多、上下文紧张的项目建议走{" "}
          <Link href="/docs/ui-for-agents" className="text-fg-violet hover:underline">
            UI for Agents
          </Link>{" "}
          的 Skill 方案，按需加载更省 token。
        </p>
      </div>

      <DocSection id="preview" title="AGENTS.md 预览">
        <p>下面是完整内容，点击「展开代码」可查看全文，右上角 Copy 按钮一键复制：</p>
        <PromptBlock content={promptSource} />
      </DocSection>

      <DocSection id="usage" title="使用">
        <p>三种接入方式，按你的工具选一个：</p>
        <ol className="ml-5 list-decimal space-y-2">
          <li>
            <strong className="text-fg-black">粘贴到文件</strong>：复制上面预览的内容，粘到项目根的{" "}
            <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-violet">
              AGENTS.md
            </code>
            、
            <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-violet">
              CLAUDE.md
            </code>{" "}
            或{" "}
            <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-violet">
              .cursorrules
            </code>
            。
          </li>
          <li>
            <strong className="text-fg-black">命令行拉取</strong>（即将上线）：
          </li>
        </ol>
        <CodeBlock code={usageCmd} lang="bash" />
        <ol className="ml-5 list-decimal space-y-2" start={3}>
          <li>
            <strong className="text-fg-black">对话首轮</strong>：复制内容，作为 ChatGPT / Claude.ai 对话的第一条消息发给 AI，然后再发 PRD。
          </li>
        </ol>
      </DocSection>

      <DocSection id="what-it-does" title="内容覆盖">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Forge UI Kit 定位与 AI 的职责边界</li>
          <li>5 条铁律（import / token / icon / layout / 看 case 示例）</li>
          <li>60+ 组件清单，按 9 大类分组</li>
          <li>颜色 token 全表：8 色 × 10 shade</li>
          <li>
            Icon 规范：<code className="font-mono text-[13px]">solar-icon-set</code> 用法与两个常见踩坑
          </li>
          <li>
            <code className="font-mono text-[13px]">AppLayout</code> props 与示例
          </li>
          <li>登录套件、业务模板入口</li>
          <li>22 个 case 页索引</li>
          <li>PRD → 页面工作流 + 提交前自检清单</li>
        </ul>
      </DocSection>

      <DocSection id="options" title="放哪个文件">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <code className="font-mono text-[13px]">AGENTS.md</code> — 通用格式，Claude Code / Codex / OpenCode 都读
          </li>
          <li>
            <code className="font-mono text-[13px]">CLAUDE.md</code> — Claude Code 专属
          </li>
          <li>
            <code className="font-mono text-[13px]">.cursorrules</code> — Cursor 专属
          </li>
          <li>同时放多个也可以，内容一致即可</li>
        </ul>
      </DocSection>

      <DocSection id="related" title="相关文档">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <Link href="/docs/ui-for-agents" className="text-fg-violet hover:underline">
              UI for Agents
            </Link>
            {" "}— Skill 方案（推荐，按需加载）
          </li>
          <li>
            <a
              href="https://agents.md"
              target="_blank"
              rel="noreferrer"
              className="text-fg-violet hover:underline"
            >
              AGENTS.md 规范
            </a>
            {" "}— AGENTS.md 格式定义
          </li>
          <li>
            <a
              href="https://docs.claude.com/en/docs/claude-code/memory"
              target="_blank"
              rel="noreferrer"
              className="text-fg-violet hover:underline"
            >
              CLAUDE.md
            </a>
            {" "}— Claude Code 的 AGENTS.md 等价物
          </li>
          <li>
            <Link href="/docs/quick-start" className="text-fg-violet hover:underline">
              快速开始
            </Link>
            {" "}— 从 0 到第一个业务页
          </li>
        </ul>
      </DocSection>
    </DocArticle>
  );
}
