import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";

const toc = [
  { id: "open", title: "打开图集" },
  { id: "pages", title: "页面线稿" },
  { id: "usage", title: "怎么用" },
  { id: "version", title: "版本与范围" },
];

type Sheet = { id: string; name: string; scope: string; status?: string };
const atlas = JSON.parse(fs.readFileSync(path.join(process.cwd(), "docs/design/atlas/sheets.json"), "utf-8")) as {
  version: string;
  date: string;
  coreCurrent: string;
  coreBaseline: string;
  sheets: Sheet[];
};
const href = (id: string) => `/design/forge-design-atlas.html#${id}`;
const pageSheets = ["list", "form", "settings", "detail"].map((id) => atlas.sheets.find((sheet) => sheet.id === id)!);
const outdated = atlas.sheets.filter((sheet) => sheet.status === "outdated");

export default function DesignAtlasPage() {
  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[{ label: "文档", href: "/docs" }, { label: "线稿图集" }]}
        title="线稿图集"
        description={`Forge 组件与页面的结构尺寸线稿，共 ${atlas.sheets.length} 张：每张图标出槽位、间距与伸缩方式，附变量表、使用规则和待决策项。`}
      />
      <DocSection {...toc[0]}>
        <p>
          图集是一个独立的 HTML 页面，黑白线稿，不依赖站点样式，可以直接收藏或离线保存。
        </p>
        <p>
          <a href="/design/forge-design-atlas.html" className="font-medium text-fg-blue hover:underline">打开线稿图集 →</a>
        </p>
      </DocSection>
      <DocSection {...toc[1]}>
        <p>做页面先看这四张，它们定义区域顺序和间距归属；组件图在选好结构之后按需查。</p>
        <ul className="ml-5 list-disc space-y-1.5">
          {pageSheets.map((sheet) => (
            <li key={sheet.id}>
              <a href={href(sheet.id)} className="text-fg-blue hover:underline">{sheet.name}</a>：{sheet.scope}
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection {...toc[2]}>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>读图顺序：结构图 → 变量表 → 使用规则 → 待决策。尺寸以变量表为准，不从画面量。</li>
          <li>页面推荐值（阅读宽、区块与字段间距、两列阈值）与 <Link href="/docs/ui-for-agents" className="text-fg-blue hover:underline">前端设计 Skill</Link> 里的页面规范一致，是设计起点；按业务内容调整时写明理由。</li>
          <li>给自己的页面出同样画法的结构图，可以用 Skill 附带的 dimensional-drawing。</li>
        </ul>
      </DocSection>
      <DocSection {...toc[3]}>
        <p>
          当前为规范提案 {atlas.version}（{atlas.date}），适用 core {atlas.coreCurrent}。组件图基于 core {atlas.coreBaseline} 绘制，之后尺寸有变化的在对应图内标注；Forge Agent 组件尚未纳入。
        </p>
        {outdated.length > 0 && (
          <p>
            以下图对应的组件已重构，待按新组件重画：
            {outdated.map((sheet, index) => (
              <span key={sheet.id}>{index > 0 && "、"}<a href={href(sheet.id)} className="text-fg-blue hover:underline">{sheet.name}</a></span>
            ))}
            。
          </p>
        )}
      </DocSection>
    </DocArticle>
  );
}
