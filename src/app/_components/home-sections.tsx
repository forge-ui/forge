/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightLinear } from "@forge-ui-official/core/icons";
import { asset } from "@/lib/asset";
import { HomeCopyPrompt } from "./home-copy-prompt";
import { changelogHref } from "../docs/_changelog";
import { coreVersion } from "../docs/_versions";

function SectionHeading({ eyebrow, title, muted, children }: { eyebrow: string; title: string; muted: string; children?: ReactNode }) {
  return (
    <div className="home-section-heading">
      <div>
        <p className="home-eyebrow">{eyebrow}</p>
        <h2 className="home-section-title">
          {title}
          <span>{muted}</span>
        </h2>
      </div>
      {children && <div className="home-section-lead">{children}</div>}
    </div>
  );
}

function MoreLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const content = <>{children}<ArrowRightLinear size={14} color="currentColor" aria-hidden="true" /></>;
  return external
    ? <a href={href} target="_blank" rel="noreferrer" className="home-more-link">{content}</a>
    : <Link href={href} className="home-more-link">{content}</Link>;
}

const layers = [
  { title: "组件", body: "表单、表格、图表、浮层、日历和智能体对话，60 多个组件在一个包里，颜色和间距统一走 token。", href: "/components", link: "浏览组件", image: "/images/home/components-wall.webp" },
  { title: "页面组件", body: "70 个整页区块：看板、列表、详情、表单、设置。每个都是完整源码，复制进项目就能改。", href: "/blocks", link: "浏览页面组件", image: "/images/home/block-kanban-board.webp", zoom: true },
  { title: "模板与 Starter", body: "8 套多页业务模板，加一个带登录页和空白后台的 Next.js 起点仓库。", href: "/templates", link: "查看模板", image: "/images/home/template-task-board.webp", zoom: true },
  { title: "AI 接入", body: "Skill、MCP、AGENTS.md 和 DESIGN.md，让 Claude Code、Codex、Cursor 按 Forge 的规范写页面。", href: "/docs/ui-for-agents", link: "接入编码助手" },
];

const blocks = [
  { name: "ai-workspace-overview", title: "智能体工作台", category: "AI 与智能体" },
  { name: "kanban-board", title: "项目看板", category: "协作与项目" },
  { name: "transactions-table", title: "交易流水", category: "财务" },
  { name: "order-form", title: "分步表单", category: "表单" },
  { name: "provider-settings-form", title: "服务配置表单", category: "表单" },
  { name: "settings-profile", title: "个人资料", category: "设置" },
];

const agentPages = [
  { name: "ai-workspace-overview", title: "智能体工作台" },
  { name: "agent-run", title: "任务会话" },
  { name: "task-run-detail", title: "任务执行详情" },
  { name: "workflow-builder", title: "工作流编排" },
  { name: "runtime-list", title: "运行时管理" },
  { name: "message-channels", title: "消息渠道" },
];

const agentTools = [
  { title: "Skill", body: "组件清单、页面规范和审计清单，编码助手按需读取。", command: "curl -fsSL https://forgeui.org/install-skill.sh | bash", href: "/docs/ui-for-agents" },
  { title: "MCP 服务器", body: "查组件参数、页面组件源码和模板，一条命令接入。", command: "claude mcp add --transport http forge https://forgeui.org/api/mcp", href: "/docs/mcp" },
  { title: "AGENTS.md", body: "放在项目根目录的使用规则，不装插件也能用。", command: "curl -fsSL https://forgeui.org/agents-md > AGENTS.md", href: "/docs/agents-md" },
  { title: "DESIGN.md", body: "一页纸的视觉规则：颜色、字色层级、圆角和状态。", command: "curl -fsSL https://forgeui.org/DESIGN.md > DESIGN.md", href: "/docs/design-md" },
];

const footerColumns = [
  { title: "产品", links: [{ label: "组件", href: "/components" }, { label: "页面组件", href: "/blocks" }, { label: "模板", href: "/templates" }, { label: "Forge Starter", href: "https://github.com/forge-ui/forge-starter" }] },
  { title: "文档", links: [{ label: "快速开始", href: "/docs/quick-start" }, { label: "使用指南", href: "/guides" }, { label: "详细安装", href: "/docs/installation" }, { label: "故障排查", href: "/docs/troubleshoot" }, { label: "更新日志", href: "/docs/changelog" }] },
  { title: "给编码助手", links: [{ label: "Skill", href: "/docs/ui-for-agents" }, { label: "MCP 服务器", href: "/docs/mcp" }, { label: "AGENTS.md", href: "/docs/agents-md" }, { label: "DESIGN.md", href: "/docs/design-md" }, { label: "LLMs.txt", href: "/docs/llms-txt" }] },
  { title: "社区", links: [{ label: "GitHub", href: "https://github.com/forge-ui/forge" }, { label: "反馈问题", href: "https://github.com/forge-ui/forge/issues" }, { label: "npm", href: "https://www.npmjs.com/package/@forge-ui-official/core" }] },
];

export function HomeSections() {
  return (
    <>
      <section className="home-section">
        <SectionHeading eyebrow="Forge 有什么" title="从一个按钮，" muted="到一个能交付的后台。">
          四层东西互相配套：组件管样子，页面组件和模板管整页，Starter 管工程起点，AI 接入让编码助手照着同一套规范写。
        </SectionHeading>
        <div className="home-layer-grid">
          {layers.map((layer) => (
            <Link key={layer.title} href={layer.href} className="home-layer-card">
              {layer.image ? (
                <div className={`home-shot home-shot-short${layer.zoom ? " home-shot-zoom" : ""}`}><img src={asset(layer.image)} alt="" loading="lazy" /></div>
              ) : (
                <div className="home-shot home-shot-short home-terminal" aria-hidden="true">
                  <span><b>$</b> claude mcp add forge …/api/mcp</span>
                  <span className="home-terminal-muted">✓ forge 已连接</span>
                  <span><b>&gt;</b> 用 Forge 做一个订单列表页</span>
                  <span className="home-terminal-muted">查询 DataTable、筛选工具栏…</span>
                </div>
              )}
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
              <span className="home-more-link">{layer.link}<ArrowRightLinear size={14} color="currentColor" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <SectionHeading eyebrow="页面组件" title="整页的结构，" muted="已经替你搭好。">
          每个页面组件都是一份完整源码，布局、状态和交互都在里面。用 shadcn 命令一行装进项目，或者直接复制。
          <code className="home-command">npx shadcn@latest add https://forgeui.org/r/kanban-board.json</code>
        </SectionHeading>
        <div className="home-block-grid">
          {blocks.map((block) => (
            <Link key={block.name} href={`/blocks/${block.name}`} className="home-block-card">
              <div className="home-shot"><img src={asset(`/images/home/block-${block.name}.webp`)} alt={`${block.title}页面预览`} loading="lazy" /></div>
              <div className="home-block-meta">
                <h3>{block.title}</h3>
                <span>{block.category}</span>
              </div>
            </Link>
          ))}
        </div>
        <MoreLink href="/blocks">浏览全部 70 个页面组件</MoreLink>
      </section>

      <section className="home-section">
        <SectionHeading eyebrow="智能体产品" title="做智能体产品的后台，" muted="不用从空白页开始。">
          工作台、任务会话、执行详情、工作流编排、运行时和消息渠道，12 个页面组件取自智能体工场的真实页面，交互按原产品复刻。
        </SectionHeading>
        <div className="home-agent">
          <Link href="/blocks/agent-run" className="home-agent-shot">
            <div className="home-shot home-shot-wide"><img src={asset("/images/home/block-agent-run.webp")} alt="任务会话页面预览" loading="lazy" /></div>
          </Link>
          <ul className="home-agent-list">
            {agentPages.map((page) => (
              <li key={page.name}>
                <Link href={`/blocks/${page.name}`}>
                  {page.title}
                  <ArrowRightLinear size={14} color="currentColor" aria-hidden="true" />
                </Link>
              </li>
            ))}
            <li><MoreLink href="/blocks?category=AI%20%E4%B8%8E%E6%99%BA%E8%83%BD%E4%BD%93">全部智能体页面</MoreLink></li>
          </ul>
        </div>
      </section>

      <section className="home-section">
        <SectionHeading eyebrow="模板与 Starter" title="挑一套最接近的，" muted="改成你的产品。" />
        <div className="home-start-grid">
          <Link href="/templates" className="home-start-card">
            <div className="home-shot"><img src={asset("/images/home/template-task-board.webp")} alt="任务看板模板预览" loading="lazy" /></div>
            <h3>业务模板</h3>
            <p>智能体、任务看板、项目管理、财务、客户关系、电商后台、仪表盘，每套都是多页、可点的完整示例。</p>
            <span className="home-more-link">查看模板<ArrowRightLinear size={14} color="currentColor" aria-hidden="true" /></span>
          </Link>
          <a href="https://github.com/forge-ui/forge-starter" target="_blank" rel="noreferrer" className="home-start-card">
            <div className="home-shot"><img src={asset("/images/showcase/forge-starter.png")} alt="Forge Starter 预览" loading="lazy" /></div>
            <h3>Forge Starter</h3>
            <p>用 Next.js 16、Tailwind v4 和 Forge 搭好的起点仓库，带登录页、空白后台和 AGENTS.md，克隆下来就能写业务。</p>
            <span className="home-more-link">在 GitHub 查看<ArrowRightLinear size={14} color="currentColor" aria-hidden="true" /></span>
          </a>
        </div>
      </section>

      <section className="home-section">
        <SectionHeading eyebrow="给编码助手" title="让 AI 按你的规范写页面，" muted="而不是自由发挥。">
          组件参数、页面规范和审计清单都整理成了编码助手能直接读的格式。装好之后，Claude Code、Codex、Cursor 写页面前会先查 Forge 里有什么，再按规范组合。
          <HomeCopyPrompt />
        </SectionHeading>
        <div className="home-tool-grid">
          {agentTools.map((tool) => (
            <div key={tool.title} className="home-tool-card">
              <div className="home-tool-head">
                <h3>{tool.title}</h3>
                <Link href={tool.href} className="home-more-link">说明<ArrowRightLinear size={14} color="currentColor" aria-hidden="true" /></Link>
              </div>
              <p>{tool.body}</p>
              <code className="home-command">{tool.command}</code>
            </div>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-top">
          <div className="home-footer-brand">
            <Link href="/" className="home-footer-logo">
              <img src={asset("/images/forge-logo-v2.svg")} alt="" className="size-7" />
              <span>Forge</span>
            </Link>
            <p>中文后台的 React 组件库，从组件到整页，一套规范到底。</p>
            <Link href={changelogHref(coreVersion)} className="home-footer-version">
              <span aria-hidden="true" />core {coreVersion} 更新说明
            </Link>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title} className="home-footer-column">
              <p>{column.title}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http")
                      ? <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                      : <Link href={link.href}>{link.label}</Link>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="home-footer-bottom">
          <span>© 2026 Forge UI · MIT License</span>
          <a href="https://github.com/forge-ui/forge" target="_blank" rel="noreferrer" aria-label="GitHub" className="home-footer-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.57.11.78-.25.78-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.73 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.23 2.75.12 3.04.73.8 1.17 1.82 1.17 3.07 0 4.4-2.69 5.37-5.26 5.65.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .3.2.67.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" /></svg>
          </a>
        </div>
      </footer>
    </>
  );
}
