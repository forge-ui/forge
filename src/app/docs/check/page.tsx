import { DocArticle, DocHeader, DocSection } from "../_shared";
import { CodeBlock } from "../ui-for-agents/_code-block";
import { ruleList } from "../../../../public/forge-check.mjs";


const toc = [
  { id: "run", title: "运行" },
  { id: "rules", title: "检查哪些规则" },
  { id: "ignore", title: "豁免" },
  { id: "boundary", title: "能力边界" },
];

const cli = `curl -fsSL https://forgeui.org/forge-check.mjs -o forge-check.mjs
node forge-check.mjs src            # 检查 src 下所有 .tsx / .jsx
node forge-check.mjs src --json     # 输出 JSON，方便 CI 和编码助手读取`;

const mcp = `check_code({ code: "<页面源码>", filename: "app/orders/page.tsx" })`;

export default function CheckPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[{ label: "文档", href: "/docs" }, { label: "页面检查" }]}
        title="页面检查"
        description="把审计清单里能从源码判断的条目做成检查：写完页面跑一遍，按行号和改法修，错误清零再交付。"
      />
      <DocSection {...toc[0]}>
        <p>命令行版本是一个没有依赖的脚本，Node 18 以上即可运行；有错误时退出码为 1，可以直接放进 CI。</p>
        <CodeBlock code={cli} lang="bash" />
        <p>接入了 <a href="/docs/mcp" className="text-fg-blue hover:underline">Forge MCP</a> 的编码助手可以直接调用：</p>
        <CodeBlock code={mcp} />
      </DocSection>
      <DocSection {...toc[1]}>
        <ul className="flex flex-col gap-3">
          {ruleList.map((rule) => (
            <li key={rule.rule} className="flex flex-col gap-0.5">
              <span className="font-semibold text-fg-black">
                {rule.message}
                <span className="ml-2 font-mono text-xs font-normal text-fg-grey-700">{rule.audit} · {rule.rule} · {rule.severity === "error" ? "错误" : "警告"}</span>
              </span>
              <span>{rule.fix}</span>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection {...toc[2]}>
        <p>确有理由时，在该行末尾加注释 <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-black">forge-check-disable-line</code> 并写明原因；原生按钮、表格和输入框也可以加 <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-[13px] text-fg-black">data-forge-allow</code>。</p>
      </DocSection>
      <DocSection {...toc[3]}>
        <p>检查只看源码文本，覆盖颜色、引入、手写组件、主题、状态、字色和空操作这些能静态判断的规则。布局是否贴合模板、交互是否闭环、在浏览器里是否正常，仍要按审计清单截图和实际操作核对。</p>
      </DocSection>
    </DocArticle>
  );
}
