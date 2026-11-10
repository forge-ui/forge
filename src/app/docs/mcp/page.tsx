import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { toolNames } from "@/lib/mcp/server.mjs";
import { CodeBlock } from "../ui-for-agents/_code-block";

export const metadata = { title: "MCP 服务器 · Forge" };

const sections = [
  { id: "connect", title: "连接客户端" },
  { id: "tools", title: "工具与示例提问" },
  { id: "boundary", title: "数据与边界" },
];

export default function McpPage() {
  return (
    <DocArticle toc={sections}>
      <DocHeader title="让 AI 通过 MCP 使用 Forge" description="公开、只读、无鉴权的 Streamable HTTP 服务；不保存会话，不修改项目。" />
      <DocSection {...sections[0]}>
        <p>一条命令装好 Skill 和 MCP（自动识别本机的 Claude Code、Cursor、Codex）：</p>
        <CodeBlock lang="bash" code={`curl -fsSL https://forgeui.org/setup.sh | bash
# 只装到当前项目，并加上 DESIGN.md
curl -fsSL https://forgeui.org/setup.sh | bash -s -- --scope project --design
# 检查是否装好
curl -fsSL https://forgeui.org/setup.sh | bash -s -- --check`} />
        <p>也可以按客户端手动配置：</p>
        <h3 className="font-semibold text-fg-black">Claude Code</h3>
        <CodeBlock lang="bash" code="claude mcp add --transport http forge https://forgeui.org/api/mcp" />
        <h3 className="font-semibold text-fg-black">Codex：~/.codex/config.toml</h3>
        <CodeBlock lang="toml" code={`[mcp_servers.forge]
url = "https://forgeui.org/api/mcp"`} />
        <h3 className="font-semibold text-fg-black">Cursor：.cursor/mcp.json</h3>
        <CodeBlock lang="json" code={`{
  "mcpServers": {
    "forge": { "url": "https://forgeui.org/api/mcp" }
  }
}`} />
      </DocSection>
      <DocSection {...sections[1]}>
        <ul className="flex flex-wrap gap-2">{toolNames.map(name => <li key={name}><code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-black">{name}</code></li>)}</ul>
        <p>写新页面时先调用 recommend，传一句需求（例如“订单列表，带筛选和批量导出”），它会返回页面角色、最接近的模板页面、页面组件、真实页面里用到的组件，以及要先读的规范。再按需用 get_screen、get_block、get_component 查细节，用 get_tokens 查颜色。</p>
        <p>列表与搜索支持 page（从 1 开始）和 pageSize（1–50）；搜索 type 可选 all、components、blocks、screens、guides、rules。详情使用返回的 slug；规范使用 topic。</p>
        <p>search 按相关度排序，支持中英文、多个关键词和常见同义词（看板 / 仪表盘 / dashboard，审批 / 确认），默认不返回 TypeScript 类型；查不到时会给出拼写相近的名称。get_component、get_block、get_screen 默认返回精简结果（import、Props、默认值、安装命令、案例地址），一般只有几千字；需要源码、完整示例时加 detail=&quot;full&quot;。名称不区分大小写和连字符，DataTable、data-table 都能查到。每个结果都带 coreVersion。</p>
        <p>还可读取 forge://rules 资源，使用 forge-page（传 need）或 forge-dashboard（传 goal）提示。例如：“按 Forge 规范设计运营看板，先列模板和区块，再核对状态与审计清单，不要自行增加基础组件。”</p>
      </DocSection>
      <DocSection {...sections[2]}>
        <p>唯一规范正文为 forge-skill；MCP 是可选数据源，不能替代规范。数据由仓库生成并随函数打包；core 版本来自 core/package.json。</p>
        <p>defaults 是直接函数参数的初始化表达式，不推断运行时派生值；未提取时明确提示核对 sourceCode。examples 来自真实案例源码，可能包含项目内依赖，不能直接当成独立文件运行。Screen 依赖仅表示直接源码引用，动态路由不伪造预览实例。</p>
        <p>安装：<code>npx skills add https://github.com/forge-ui/forge --skill forge-skill</code>。另见 <Link href="/guides/ai">AI 使用指南</Link> 与 <a href="/llms.txt">llms.txt</a>。</p>
        <p>服务仅支持 POST；GET/DELETE 返回 405。SDK 校验协议、Accept 与输入，跨源 Origin 返回 403；无 Origin 的原生 MCP 客户端可正常连接。</p>
      </DocSection>
    </DocArticle>
  );
}
