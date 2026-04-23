import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "./_shared";

const toc = [
  { id: "what-is-forge", title: "Forge 是什么" },
  { id: "why", title: "为什么做这个" },
  { id: "principles", title: "核心原则" },
  { id: "whats-inside", title: "里面有什么" },
];

export default function IntroductionPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "介绍" },
        ]}
        title="介绍"
        description="Forge UI Kit 是什么、解决什么问题、跟市面其他 Kit 的关系。"
      />

      <DocSection id="what-is-forge" title="Forge 是什么">
        <p>
          Forge 是一套面向内部 ToB 交付的 React UI Kit，技术栈是 Next.js 16 · React
          19 · Tailwind v4 · TypeScript 5，图标选用 solar-icon。
        </p>
        <p>
          内容包括 60+ 组件、业务级模版（Ecommerce / Auth）以及 Dashboard Builder
          8 种外壳，都从 Figma 设计稿 1:1 还原。团队拿它快速交付客户定制后台，
          不必每个新项目都从零拼骨架。
        </p>
      </DocSection>

      <DocSection id="why" title="为什么做这个">
        <p>
          <strong>市面空白。</strong>开源 React/Next.js
          生态里，没有同时满足「面向 AI agent 可理解 + 快速开发 + ToB
          交付级」的 Kit。
        </p>
        <p>
          <strong>纯 AI 生成不可靠。</strong>即便是 Figma Make
          这类直出方案，也无法严格按照既有 UI 规范生成新页面——真实场景里要的是
          「按规范设计新业务页」，但 AI 只是参考规范自由发挥，产物风格很难控制。
        </p>
        <p>
          <strong>Forge 的解法。</strong>做一套 Claude Code / Codex
          这类编程 Agent 能读懂的设计系统——人和 AI 对齐需求后，AI 100% 基于
          Forge 组件产出固定风格的页面，人从展现层解放出来，专注业务逻辑和交付速度。
        </p>
      </DocSection>

      <DocSection id="principles" title="核心原则">
        <p>四条最基础的硬规矩，新增组件和业务页都要遵守：</p>
        <ul className="flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>Figma-First</strong> — Figma 是单一真相源，
            复刻从 Dev Mode 原始代码开始，不靠截图或记忆。
          </li>
          <li>
            <strong>Token-Driven</strong> — 颜色、字号、圆角、阴影、间距走 CSS
            变量，组件内不写 <code>#hex</code> 和裸 <code>px</code>。
          </li>
          <li>
            <strong>Kit Only</strong> — 业务页只允许 import Kit 组件，
            禁止手搓 <code>div</code> 复刻已有组件；pattern 重复 3 次立即抽到 Kit。
          </li>
          <li>
            <strong>AI-Readable</strong> — props 扁平语义化，每个组件配{" "}
            <code>&lt;ApiTable&gt;</code>，让 AI agent 照表调用不用猜。
          </li>
        </ul>
      </DocSection>

      <DocSection id="whats-inside" title="里面有什么">
        <ul className="flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>
              <Link
                href="/components"
                className="text-fg-violet hover:underline"
              >
                组件
              </Link>
            </strong>{" "}
            — 60+ 基础组件，分 Foundations 和 Components 两组。
          </li>
          <li>
            <strong>
              <Link
                href="/cases"
                className="text-fg-violet hover:underline"
              >
                组件矩阵
              </Link>
            </strong>{" "}
            — 每个组件所有变体、尺寸、状态、颜色矩阵铺开展示。
          </li>
          <li>
            <strong>
              <Link
                href="/templates"
                className="text-fg-violet hover:underline"
              >
                模版
              </Link>
            </strong>{" "}
            — 用 Kit 拼好的整套业务页：Ecommerce Admin、Auth、Dashboard Builder。
          </li>
          <li>
            <strong>
              <Link
                href="/docs/ui-for-agents"
                className="text-fg-violet hover:underline"
              >
                UI for Agents
              </Link>
            </strong>{" "}
            — Skill 插件 + AGENTS.md 约定，让 Claude Code / Codex 开箱即用地基于 Forge 产页面。
          </li>
        </ul>
      </DocSection>
    </DocArticle>
  );
}
