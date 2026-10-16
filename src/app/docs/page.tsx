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
        description="Forge UI Kit 是什么，以及文档站里有哪些内容。"
      />

      <DocSection id="what-is-forge" title="Forge 是什么">
        <p>
          Forge 是一套用于内部后台交付的 React 组件库。技术栈是 Next.js 16、React 19、Tailwind v4 和 TypeScript。图标来自 Solar Icons（React 实现为 MIT，图形为 CC BY 4.0）。
        </p>
        <p>
          库里有按钮、表单、表格、弹窗和布局这些常用组件，也有几套可以复制的业务模板。新项目可以直接用这些组件搭后台，不必每次从空页面开始。
        </p>
      </DocSection>

      <DocSection id="why" title="为什么做这个">
        <p>
          通用组件库通常只提供控件，不管后台页面怎么拼，也不说明编码助手该怎么选用。只按截图生成页面时，间距、颜色和组件选择容易和现有规范不一致。
        </p>
        <p>
          Forge 把组件、颜色和布局收成同一套用法。人和编码助手都从这套组件里取，页面风格更稳定，业务逻辑仍然由人来确认。
        </p>
      </DocSection>

      <DocSection id="principles" title="核心原则">
        <p>新增组件和业务页遵循这四条：</p>
        <ul className="flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>以设计稿为准</strong> — 组件对照 Figma Dev Mode 的标注实现，不按截图或记忆重画。
          </li>
          <li>
            <strong>用 token</strong> — 颜色、字号、圆角、阴影和间距走 CSS 变量。组件里不写 <code>#hex</code> 和裸 <code>px</code>。
          </li>
          <li>
            <strong>只用库里的组件</strong> — 业务页 import 已有组件。库里已经有的控件，不再用 <code>div</code> 再做一遍。同一段结构出现 3 次，就抽成组件。
          </li>
          <li>
            <strong>参数写清楚</strong> — props 用扁平、能读懂的名字。每个组件页有参数表，调用时按表填写。
          </li>
        </ul>
      </DocSection>

      <DocSection id="whats-inside" title="里面有什么">
        <ul className="flex list-disc flex-col gap-2 pl-6">
          <li>
            <strong>
              <Link href="/components" className="text-fg-blue hover:underline">
                组件
              </Link>
            </strong>{" "}
            — 每个组件的用法和参数。
          </li>
          <li>
            <strong>
              <Link href="/cases" className="text-fg-blue hover:underline">
                组件案例
              </Link>
            </strong>{" "}
            — 颜色、尺寸、状态，以及可以操作的场景。
          </li>
          <li>
            <strong>
              <Link href="/templates" className="text-fg-blue hover:underline">
                模板
              </Link>
            </strong>{" "}
            — 用组件拼好的业务页，包括电商后台、登录页和仪表盘。
          </li>
          <li>
            <strong>
              <Link href="/docs/ui-for-agents" className="text-fg-blue hover:underline">
                UI for Agents
              </Link>
            </strong>{" "}
            — 给 Claude Code、Cursor、Codex 的规则，说明组件从哪里引入、颜色和布局怎么用。
          </li>
        </ul>
      </DocSection>
    </DocArticle>
  );
}
