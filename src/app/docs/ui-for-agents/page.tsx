import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { CodeBlock } from "./_code-block";

const toc = [
  { id: "installation", title: "一条命令安装" },
  { id: "results", title: "装了有什么不同" },
  { id: "usage", title: "怎么用" },
  { id: "whats-included", title: "Skill 里有什么" },
  { id: "clients", title: "支持的工具" },
  { id: "faq", title: "常见问题" },
  { id: "related", title: "相关文档" },
];

const installCmd = `# Skill + MCP，自动识别本机的 Claude Code / Cursor / Codex
curl -fsSL https://www.forgeui.org/setup.sh | bash

# 只装到当前项目，并放一份 DESIGN.md
curl -fsSL https://www.forgeui.org/setup.sh | bash -s -- --scope project --design

# 其他选项：--client claude|cursor|codex|all  --mode skill|mcp|both  --dry-run  --check`;

const structureTree = `forge-skill/
├── SKILL.md            # 工作流与铁律：先定页面角色，再选模板、页面组件和组件，最后检查
├── scripts/            # list / get-component / get-case / get-template / project-info …
└── references/         # 二十多份按需读取的规范
    ├── workflow.md               # 从需求到交付的步骤
    ├── page-patterns.md          # 列表、详情、表单、看板等页面模式
    ├── component-selection/      # 什么场景用哪个组件
    ├── tokens.md                 # 颜色、字色层级、深色模式
    ├── status-presentation.md    # 状态怎么表达
    ├── overlay-focus.md          # 弹窗、抽屉的焦点与关闭
    └── audit-checklist.md        # 交付前的审计清单`;

const prompt = `做一个订单列表页：顶部有搜索和状态筛选，
表格显示订单号、客户、金额、状态和下单时间，支持勾选后批量导出。`;

export default function UIForAgentsPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "前端设计 Skill" },
        ]}
        title="前端设计 Skill"
        description="Forge Skill 让 Claude Code、Codex 和 Cursor 按同一套规范写后台页面：知道用哪个组件、怎么排版、颜色和状态怎么表达，写完还能自己检查。"
      />

      <DocSection id="installation" title="一条命令安装">
        <p>
          Skill 遵循{" "}
          <a href="https://agentskills.io/home" target="_blank" rel="noreferrer" className="text-fg-blue hover:underline">
            Agent Skills 通用规范
          </a>
          。安装脚本会同时装好 Skill 和{" "}
          <Link href="/docs/mcp" className="text-fg-blue hover:underline">Forge MCP</Link>
          ，已装过的会跳过。
        </p>
        <CodeBlock code={installCmd} lang="bash" />
      </DocSection>

      <DocSection id="results" title="装了有什么不同">
        <p>
          我们用 20 个常见后台任务（订单列表、客户详情、运营看板、设置、登录、智能体对话、任务看板、日程等）做了对比：同一个 Claude Code，项目里都装了 Forge 组件库，区别只在有没有装 Skill 和 MCP。
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>合格率：90% → 100%（页面存在、类型检查通过、用 Forge 组件、不引入其他 UI 库、页面检查无错误、用对组件，六项全过才算合格）</li>
          <li>页面检查无错误：95% → 100%；平均警告：0.7 → 0</li>
          <li>典型差别：日程页没装时用日历格子自己拼月视图，装了之后直接用 FullCalendar；后台框架没装时头像颜色写死成 hex</li>
          <li>代价：每题平均多花约 50 秒，用在读规范和查组件参数上</li>
        </ul>
        <p>
          题目、评分规则和结果都在{" "}
          <a href="https://github.com/forge-ui/forge/tree/main/evals" target="_blank" rel="noreferrer" className="text-fg-blue hover:underline">
            evals 目录
          </a>
          ，可以自己复现。
        </p>
      </DocSection>

      <DocSection id="usage" title="怎么用">
        <p>装好后不用特别调用，直接用中文描述页面，助手会自动读取 Skill：</p>
        <CodeBlock code={prompt} />
        <p>
          它会先判断页面角色，再用 MCP 查 DataTable、Toolbar、StatusBadge 的参数，写完调用 MCP 的 check_code 自查。也可以用{" "}
          <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-blue">/forge-skill</code>{" "}
          显式调用。完整的演示过程见{" "}
          <Link href="/articles/claude-code-admin-pages" className="text-fg-blue hover:underline">用 Claude Code 写后台页面</Link>
          。
        </p>
      </DocSection>

      <DocSection id="whats-included" title="Skill 里有什么">
        <p>主文件只放工作流和铁律，细节放在参考文档里按需读取，大块的组件参数交给 MCP 查询，避免撑爆上下文。</p>
        <CodeBlock code={structureTree} />
      </DocSection>

      <DocSection id="clients" title="支持的工具">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Claude Code、Cursor、Codex：安装脚本自动识别并安装到各自的 skills 目录</li>
          <li>其他支持 Agent Skills 格式的工具：把 skills/forge-skill 目录复制到它的 skills 目录</li>
          <li>不支持 Skill 的助手：用 MCP，或直接读取 <Link href="/docs/llms-txt" className="text-fg-blue hover:underline">llms.txt</Link></li>
        </ul>
      </DocSection>

      <DocSection id="faq" title="常见问题">
        <h3 className="font-semibold text-fg-black">和 Anthropic 官方的 frontend-design Skill 有什么区别？</h3>
        <p>
          frontend-design 追求每个界面都有鲜明、不重复的视觉风格，适合营销页和原型；Forge Skill 追求第二十个页面和第一个页面一致，适合后台系统。做后台时不建议两者同时启用。详见{" "}
          <Link href="/articles/frontend-design-skill" className="text-fg-blue hover:underline">前端设计 Skill 怎么选</Link>
          。
        </p>
        <h3 className="font-semibold text-fg-black">只装 Skill 不装 MCP 可以吗？</h3>
        <p>可以，加 <code className="font-mono text-[13px]">--mode skill</code>。Skill 会用自带脚本读组件文档：优先读本地的 Forge 仓库，找不到时读 GitHub 上的源码。MCP 查得更快、返回更精简，能装就建议一起装。</p>
        <h3 className="font-semibold text-fg-black">怎么更新？</h3>
        <p>重新运行安装命令即可；<code className="font-mono text-[13px]">--check</code> 只检查当前安装状态，不做改动。</p>
      </DocSection>

      <DocSection id="related" title="相关文档">
        <ul className="ml-5 list-disc space-y-1.5">
          <li><Link href="/docs/mcp" className="text-fg-blue hover:underline">MCP 服务器</Link> — 按需查询组件、页面组件和模板</li>
          <li><Link href="/docs/check" className="text-fg-blue hover:underline">页面检查</Link> — 从源码里找出违反规范的写法</li>
          <li><Link href="/docs/agents-md" className="text-fg-blue hover:underline">AGENTS.md</Link> 和 <Link href="/docs/design-md" className="text-fg-blue hover:underline">DESIGN.md</Link> — 把项目约定交给编码助手</li>
          <li><a href="https://docs.claude.com/en/docs/claude-code/skills" target="_blank" rel="noreferrer" className="text-fg-blue hover:underline">Claude Code Skills</a>、<a href="https://cursor.com/docs/context/skills" target="_blank" rel="noreferrer" className="text-fg-blue hover:underline">Cursor Skills</a>、<a href="https://developers.openai.com/codex" target="_blank" rel="noreferrer" className="text-fg-blue hover:underline">Codex</a> — 各工具的官方说明</li>
        </ul>
      </DocSection>
    </DocArticle>
  );
}
