import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { CodeBlock } from "./_code-block";

const toc = [
  { id: "installation", title: "安装" },
  { id: "usage", title: "使用" },
  { id: "whats-included", title: "覆盖内容" },
  { id: "structure", title: "结构" },
  { id: "related", title: "相关文档" },
];

const installCmd = `# Claude Code / Cursor
curl -fsSL https://forgeui.org/install-skill.sh | bash

# Codex
curl -fsSL https://forgeui.org/install-skill.sh | FORGE_AGENT=codex bash`;

const structureTree = `.claude/skills/forge-react/ 或 .codex/skills/forge-react/
├── SKILL.md                       # 主入口（定位 / 铁律 / 工作流 / 脚本索引）
├── scripts/
│   ├── list.mjs                   # 列出 components / cases / templates
│   ├── get-component.mjs          # 读取组件规格页
│   ├── get-case.mjs               # 读取 case 示例页
│   └── get-template.mjs           # 读取业务模板页
└── references/
    └── tokens.md                  # 颜色 token、语义变量、icon 默认色`;

export default function UIForAgentsPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "UI for Agents" },
        ]}
        title="UI for Agents"
        description="让 AI 助手用 Forge UI Kit 拼业务页面。"
      />

      <div className="text-base font-normal leading-[1.8] text-fg-grey-900">
        <p>
          Forge Skill 给 AI 助手完整的 Forge 组件知识、颜色 token、布局规范与工作流。
          Skill 按需加载，上下文更省。
        </p>
      </div>

      <DocSection id="installation" title="安装">
        <p>
          一行命令装好，遵循{" "}
          <a
            href="https://agentskills.io/home"
            target="_blank"
            rel="noreferrer"
            className="text-fg-violet hover:underline"
          >
            Agent Skills 通用规范
          </a>
          ，Claude Code / Cursor / Codex 都可以安装到自己的 skills 目录。
        </p>
        <CodeBlock code={installCmd} lang="bash" />
      </DocSection>

      <DocSection id="usage" title="使用">
        <p>
          Skill 会被 AI 助手{" "}
          <strong className="text-fg-black">自动发现</strong>，也可以用{" "}
          <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-violet">
            /forge
          </code>{" "}
          命令直接调用。
        </p>
        <p>让 AI 帮你做：</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>用 Forge 组件搭业务页面</li>
          <li>基于现成模板创建后台骨架</li>
          <li>定制主题与配色</li>
          <li>查询组件 props 与用法</li>
        </ul>
        <p>
          脚本会优先读取本地 Forge 仓库，找不到时再读取 GitHub 上的公开源码。
        </p>
      </DocSection>

      <DocSection id="whats-included" title="覆盖内容">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Forge UI Kit 安装与接入指南</li>
          <li>组件规格页、case 页、业务模板页索引</li>
          <li>颜色 token 全表（8 色 × 10 shade）与字体 token</li>
          <li>Icon（solar-icon-set）用法与常见踩坑</li>
          <li>
            布局模板（
            <code className="font-mono text-[13px]">AppLayout</code> / 登录套件 / 电商业务骨架）
          </li>
          <li>设计原则与组合模式（按 case 参考）</li>
        </ul>
      </DocSection>

      <DocSection id="structure" title="结构">
        <CodeBlock code={structureTree} />
      </DocSection>

      <DocSection id="related" title="相关文档">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <a
              href="https://agentskills.io/home"
              target="_blank"
              rel="noreferrer"
              className="text-fg-violet hover:underline"
            >
              Agent Skills 规范
            </a>
            {" "}— Agent Skills 格式定义
          </li>
          <li>
            <a
              href="https://docs.claude.com/en/docs/claude-code/skills"
              target="_blank"
              rel="noreferrer"
              className="text-fg-violet hover:underline"
            >
              Claude Agent Skills
            </a>
            {" "}— Claude 官方 Skills 文档
          </li>
          <li>
            <a
              href="https://cursor.com/docs/context/skills"
              target="_blank"
              rel="noreferrer"
              className="text-fg-violet hover:underline"
            >
              Cursor Skills
            </a>
            {" "}— 在 Cursor 中使用 Skills
          </li>
          <li>
            <a
              href="https://developers.openai.com/codex"
              target="_blank"
              rel="noreferrer"
              className="text-fg-violet hover:underline"
            >
              Codex
            </a>
            {" "}— 在 Codex 中使用 Skills
          </li>
          <li>
            <Link href="/docs/quick-start" className="text-fg-violet hover:underline">
              快速开始
            </Link>
            {" "}— 从 0 到第一个业务页
          </li>
          <li>
            <Link href="/cases" className="text-fg-violet hover:underline">
              组件
            </Link>
            {" "}— 所有组件用法示例
          </li>
        </ul>
      </DocSection>
    </DocArticle>
  );
}
