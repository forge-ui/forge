import TurndownService from "turndown";
import rawData from "@/lib/mcp/data.json";
import { kitNavGroups } from "@/app/_components/kit-nav";

export const runtime = "nodejs";

const SITE = "https://www.forgeui.org";
const families = kitNavGroups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));

type Component = { name: string; label?: string; kind: string; oneShotDefault: boolean; import: string; cases: string[]; docs?: string[]; defaults: Record<string, string>; props: { name: string; optional: boolean; type: string; description: string }[] };
type Block = { slug: string; title: string; category: string; description: string; install: string };
type Doc = { slug: string; title: string; content: string };
const data = rawData as unknown as { coreVersion: string; components: Component[]; blocks: Block[]; rules: Doc[]; guides: Doc[] };

const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();

function componentSection(component: Component) {
  const rows = component.props.map((prop) => `| \`${prop.name}\` | ${prop.optional ? "否" : "是"} | \`${cell(prop.type)}\` | ${cell(prop.description || "")} |`);
  const defaults = Object.entries(component.defaults).map(([name, value]) => `\`${name}\` = \`${value}\``).join("，");
  return [
    `## ${component.name}${component.label ? `（${component.label}）` : ""}`,
    "```tsx\n" + component.import + "\n```",
    rows.length ? "| 属性 | 必填 | 类型 | 说明 |\n|---|---|---|---|\n" + rows.join("\n") : "",
    defaults ? `默认值：${defaults}` : "",
  ].filter(Boolean).join("\n\n");
}

function familyMarkdown(slug: string) {
  const family = families.find((item) => item.slug === slug);
  if (!family) return null;
  const members = data.components.filter((component) => component.kind === "value" && /^[A-Z]/.test(component.name) && (component.cases.includes(`/cases/${slug}`) || component.docs?.includes(slug)));
  const primary = members.filter((component) => component.oneShotDefault || component.label || component.docs?.includes(slug));
  const listed = (primary.length ? primary : members).sort((left, right) => Number(right.oneShotDefault) - Number(left.oneShotDefault) || right.props.length - left.props.length).slice(0, 24);
  return [
    `# ${family.label}`,
    `> Forge 组件 · ${family.group} · core ${data.coreVersion}。页面：${SITE}/components/${slug} · 案例：${SITE}/cases/${slug}`,
    "组件从 `@forge-ui-official/core` 引入，图标从 `@forge-ui-official/core/icons` 引入。完整参数和源码可用 MCP 的 get_component（detail=\"full\"）查询。",
    ...listed.map(componentSection),
    members.length > listed.length ? `## 其他相关导出\n\n${members.slice(listed.length).map((component) => component.name).join("、")}` : "",
  ].filter(Boolean).join("\n\n") + "\n";
}

function blockMarkdown(block: Block) {
  const reference = data.rules.find((rule) => rule.slug === `blocks/${block.slug}`)?.content.replace(/^# .*\n/, "").trim();
  return [
    `# ${block.title}`,
    `> Forge 页面组件 · ${block.category}。预览：${SITE}/blocks/${block.slug}`,
    block.description,
    "## 安装\n\n```bash\n" + block.install + "\n```",
    reference ?? "",
  ].filter(Boolean).join("\n\n") + "\n";
}

function blocksIndex() {
  const categories = [...new Set(data.blocks.map((block) => block.category))];
  return [
    "# 页面组件",
    `> ${data.blocks.length} 个可复制进项目的整页区块，基于 @forge-ui-official/core ${data.coreVersion}。每个都可以用 shadcn 命令安装。`,
    ...categories.map((category) => `## ${category}\n\n` + data.blocks.filter((block) => block.category === category).map((block) => `- [${block.title}](${SITE}/blocks/${block.slug}.md): ${block.description}`).join("\n")),
  ].join("\n\n") + "\n";
}

function guidesIndex() {
  return ["# 使用指南", ...data.guides.map((guide) => `- [${guide.title}](${SITE}/guides/${guide.slug}.md)`)].join("\n\n") + "\n";
}

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
turndown.remove(["script", "style", "noscript", "button", "nav"]);
turndown.remove((node) => node.nodeName.toLowerCase() === "svg");
// Docs render code one line per <div> with a line-number span; rebuild the plain lines.
turndown.addRule("numberedCode", {
  filter: (node) => node.nodeName === "PRE",
  replacement: (_content, node) => {
    const code = (node as HTMLElement).querySelector("code") ?? (node as HTMLElement);
    const lines = Array.from(code.children).filter((child) => child.nodeName === "DIV");
    const text = lines.length
      ? lines.map((line) => Array.from(line.childNodes).filter((child) => !(child.nodeType === 1 && (child as HTMLElement).hasAttribute("data-md-skip"))).map((child) => child.textContent ?? "").join("").replace(/\u00a0/g, "")).join("\n")
      : code.textContent ?? "";
    return "\n\n```\n" + text.replace(/\n+$/, "") + "\n```\n\n";
  },
});
turndown.remove((node) => node.nodeType === 1 && (node as HTMLElement).hasAttribute("data-md-skip"));

async function docsMarkdown(request: Request, path: string) {
  const response = await fetch(new URL(`/${path}`, request.url), { headers: { accept: "text/html" } });
  if (!response.ok) return null;
  const html = await response.text();
  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/)?.[1];
  if (!article) return null;
  return turndown.turndown(article).replace(/\n{3,}/g, "\n\n").trim() + `\n\n---\n\n来源：${SITE}/${path}\n`;
}

async function render(request: Request, segments: string[]) {
  const [section, slug, ...rest] = segments;
  if (rest.length) return null;
  if (section === "blocks") {
    if (!slug) return blocksIndex();
    const block = data.blocks.find((item) => item.slug === slug);
    return block ? blockMarkdown(block) : null;
  }
  if (section === "components" || section === "cases") return slug ? familyMarkdown(slug) : null;
  if (section === "guides") {
    if (!slug) return guidesIndex();
    return data.guides.find((guide) => guide.slug === slug)?.content ?? null;
  }
  if (section === "docs") return docsMarkdown(request, segments.join("/"));
  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const markdown = await render(request, path);
  if (!markdown) return new Response("Not found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      // The HTML page is the canonical copy; without this Google files each .md twin as an unclaimed duplicate.
      link: `<${SITE}/${path.join("/")}>; rel="canonical", <${SITE}/llms.txt>; rel="describedby"`,
    },
  });
}
