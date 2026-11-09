import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";
import { toolNames } from "@/lib/mcp/server.mjs";

export const metadata = { title: "MCP 接入 · Forge" };

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
        <h3>Claude Code</h3>
        <pre className="overflow-x-auto">{`claude mcp add --transport http forge https://forgeui.org/api/mcp`}</pre>
        <h3>Codex：~/.codex/config.toml</h3>
        <pre>{`[mcp_servers.forge]
url = "https://forgeui.org/api/mcp"`}</pre>
        <h3>Cursor：.cursor/mcp.json</h3>
        <pre>{`{
  "mcpServers": {
    "forge": { "url": "https://forgeui.org/api/mcp" }
  }
}`}</pre>
      </DocSection>
      <DocSection {...sections[1]}>
        <ul>{toolNames.map(name => <li key={name}><code>{name}</code></li>)}</ul>
        <p>先 search 查询“运营看板”，读取 get_rules 的 page-standards 和 status，再用 get_screen、get_block、get_component 给出配方。</p>
        <p>列表与搜索支持 page（从 1 开始）和 pageSize（1–50）；搜索 type 可选 all、components、blocks、screens、guides、rules。详情使用返回的 slug；规范使用 topic。</p>
        <p>get_component 返回真实 import、Props、源码参数默认值、案例与示例、相关导出及 core 版本。get_block 返回 registry 源码、安装命令、依赖与 Props；get_screen 返回模板路由、预览地址和依赖。</p>
        <p>还可读取 forge://rules 资源，使用 forge-dashboard 提示并提供 goal。例如：“按 Forge 规范设计运营看板，先列模板和区块，再核对状态与审计清单，不要自行增加基础组件。”</p>
      </DocSection>
      <DocSection {...sections[2]}>
        <p>唯一规范正文为 forge-skill；MCP 是可选数据源，不能替代规范。数据由仓库生成并随函数打包；core 版本来自 core/package.json。</p>
        <p>defaults 是直接函数参数的初始化表达式，不推断运行时派生值；未提取时明确提示核对 sourceCode。examples 来自真实案例源码，可能包含项目内依赖，不能直接当成独立文件运行。Screen 依赖仅表示直接源码引用，动态路由不伪造预览实例。</p>
        <p>安装：<code>npx skills add https://github.com/forge-ui/forge --skill forge-skill</code>。另见 <Link href="/guides/ai">AI 使用指南</Link> 与 <a href="/llms.txt">llms.txt</a>。</p>
        <p>服务仅支持 POST；GET/DELETE 返回 405。SDK 校验协议、Accept 与输入，跨源 Origin 返回 403；无 Origin 的原生 MCP 客户端可正常连接。正式站点是否可用需另行部署验证，本次不发布。</p>
      </DocSection>
    </DocArticle>
  );
}
