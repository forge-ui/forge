import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { loadSources } from "./llms-sources.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const source = loadSources(root);
const guides = fs.readdirSync(path.join(root, "content/guides")).filter(file => file.endsWith(".md")).sort().map(file => {
  const content = read("content/guides/" + file);
  return { slug: file.slice(0, -3), title: content.split("\n")[0].slice(2), content, url: "https://forgeui.org/guides/" + file.slice(0, -3) };
});
const blocks = source.blocks.map(block => ({ ...block, registry: JSON.parse(read("public/r/" + block.name + ".json")), slug: block.name, install: "npx shadcn@latest add https://forgeui.org/r/" + block.name + ".json" }));
for (const guide of guides) for (const fence of guide.content.matchAll(/```(?:tsx?|jsx?)\n([\s\S]*?)```/g)) {
  const ast = ts.createSourceFile("guide.tsx", fence[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const moduleName = statement.moduleSpecifier.text;
    const bindings = statement.importClause?.namedBindings;
    if (statement.importClause?.name || !bindings || !ts.isNamedImports(bindings)) throw new Error("Only named imports supported in guides: " + guide.slug);
    const exports = moduleName === source.core.name ? source.inventory.components.map(item => item.name) : blocks.filter(item => moduleName === "@/components/blocks/" + item.slug).flatMap(item => item.registry.files.flatMap(file => [...file.content.matchAll(/export (?:function|const|interface|type) (\w+)/g)].map(match => match[1])));
    for (const binding of bindings.elements) if (!exports.includes((binding.propertyName ?? binding.name).text)) throw new Error("Unknown guide import: " + guide.slug + " " + binding.name.text);
  }
}
// Components documented with an ApiBlock on /components/<slug>, even when no case page uses them yet.
const documentedOn = Object.entries(Object.groupBy(fs.readdirSync(path.join(root, "src/app/components"), { withFileTypes: true }).filter(entry => entry.isDirectory()).flatMap(entry => fs.readdirSync(path.join(root, "src/app/components", entry.name)).filter(file => file.endsWith(".tsx")).flatMap(file => [...read(`src/app/components/${entry.name}/${file}`).matchAll(/<ApiBlock\b[^>]*\btitle="([A-Z]\w*)"/g)].map(match => ({ name: match[1], slug: entry.name })))), item => item.name)).reduce((map, [name, entries]) => ({ ...map, [name]: [...new Set(entries.map(entry => entry.slug))] }), {});
const componentDetails = item => {
  const content = read(item.source);
  const ast = ts.createSourceFile(item.source, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const defaults = {};
  const inspect = node => {
    if (ts.isFunctionDeclaration(node) && node.name?.text === item.name) {
      for (const parameter of node.parameters) if (ts.isObjectBindingPattern(parameter.name)) for (const binding of parameter.name.elements) if (binding.initializer) defaults[binding.name.getText(ast)] = binding.initializer.getText(ast);
    }
    ts.forEachChild(node, inspect);
  };
  inspect(ast);
  const cases = source.cases.filter(entry => new RegExp("\\b" + item.name + "\\b").test(read(entry.file)));
  return { defaults, defaultsEvidence: Object.keys(defaults).length ? "源码函数参数初始化表达式" : "未提取到函数参数默认值；请核对 sourceCode，不推断", sourceCode: content, cases: cases.map(entry => "/cases/" + entry.route), docs: documentedOn[item.name] ?? [], examples: cases.slice(0, 1).map(entry => ({ source: entry.file, code: read(entry.file) })) };
};
const labels = Object.fromEntries([...read("src/app/components/_labels.ts").matchAll(/"([^"]+)":\s*"([^"（]+)（/g)].map(match => [match[1], match[2]]));
const families = Object.fromEntries([...read("src/app/_components/kit-nav.ts").matchAll(/slug: "([^"]+)", label: "([^"]+)"/g)].map(match => [match[1], match[2]]));
const componentLabels = item => {
  const caseSlugs = item.cases.map(route => route.replace("/cases/", ""));
  return { label: labels[item.name] ?? "", family: caseSlugs.map(slug => families[slug]).filter(Boolean).join("、") };
};
const components = source.inventory.components.map(item => ({ ...item, ...componentDetails(item), slug: item.name, import: "import { " + (item.kind === "type" ? "type " : "") + item.name + " } from \"" + source.core.name + "\";", coreVersion: source.core.version, documentation: read("skills/forge-skill/references/components/" + path.basename(item.module) + ".md"), related: source.inventory.components.filter(other => other.module === item.module && other.name !== item.name).map(other => other.name) }));
for (const component of components) Object.assign(component, componentLabels(component));
const knownScreenTitles = Object.fromEntries(blocks.flatMap(block => block.registry.meta?.screens ?? []).map(screen => [screen.href, screen.title]));
const screenTitle = content => content.match(/(?:pageTitle|current)=\{?"([^"]{2,40})"/)?.[1] ?? content.match(/<PageTitleToolbar[^>]*?\stitle="([^"]{2,40})"/)?.[1] ?? content.match(/<h1[^>]*>\s*([^<{]{2,40})</)?.[1]?.trim();
const screens = source.templates.map(item => {
  const content = read(item.file);
  return { slug: item.route || "index", title: item.route ? knownScreenTitles["/templates/" + item.route] ?? screenTitle(content) ?? item.route : "模板索引", source: item.file, route: "/templates" + (item.route ? "/" + item.route : ""), previewUrl: item.route.includes("[") ? null : "https://forgeui.org/templates" + (item.route ? "/" + item.route : ""), routePattern: item.route.includes("["), blocks: blocks.filter(block => content.includes(block.component)).map(block => block.slug), components: components.filter(component => component.kind === "value" && new RegExp("\\b" + component.name + "\\b").test(content)).map(component => component.name), sourceCode: content };
});
const rules = source.references.filter(item => item.file !== "skills/forge-skill/SKILL.md").map(item => ({ slug: item.file.replace("skills/forge-skill/references/", "").replace(/\.md$/, ""), title: item.content.split("\n").find(line => line.startsWith("# "))?.slice(2) ?? item.file, content: item.content, source: item.file }));
const tokenBlock = (css, selector) => css.slice(css.indexOf(selector)).split("\n}")[0];
const tokensCss = read("core/src/styles/tokens.css");
const tokens = [["primitive", ":root {"], ["semantic", ":root,\n[data-theme=\"light\"] {"]].flatMap(([layer, selector]) => [...tokenBlock(tokensCss, selector).matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].filter(match => !match[1].startsWith("--forge-")).map(match => ({ name: match[1], value: match[2].trim(), layer, ...(match[1].startsWith("--fg-") ? { tailwind: match[1].slice(2) } : {}) })));
if (!tokens.some(token => token.name === "--accent")) throw new Error("Semantic tokens not found in tokens.css");
const data = { coreVersion: source.core.version, components, blocks, screens, rules, guides, tokens };
const target = path.join(root, "src/lib/mcp/data.json");
const output = JSON.stringify(data, null, 2) + "\n";
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, output);
console.log("MCP data and guide imports verified: " + components.length + " exports, " + blocks.length + " blocks, " + screens.length + " screens, " + guides.length + " guides, " + tokens.length + " tokens");
