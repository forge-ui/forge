import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { examples } from "./block-examples.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "blocks/registry.json"), "utf8"));
const core = JSON.parse(fs.readFileSync(path.join(root, "core/package.json"), "utf8"));
const check = process.argv.includes("--check");
const outputs = new Map();
const categories = ["看板首屏", "AI 与智能体", "数据列表", "详情页", "表单", "协作与项目", "财务", "设置", "图表与指标", "页面结构", "认证"];
const screenTitles = {
  analytics: "经营分析看板", "ecommerce-1": "电商经营看板", "ecommerce-2": "电商明细看板", "ecommerce-3": "渠道分析看板",
  "project-1": "项目协作看板", "project-2": "项目进展看板", "finance-1": "财务概览看板", "finance-2": "账户分析看板", "finance-3": "财务工作台",
  crm: "客户经营看板", ecommerce: "电商管理", "project-template": "项目管理", "finance-template": "财务管理", "crm-template": "客户关系管理",
  "micellaneous-template": "团队工作区", agent: "智能体工作台", "task-board": "任务看板", "dashboard-builder": "看板编辑器", orders: "订单管理",
};
const pageTitles = {
  "/templates/ecommerce/products": "商品列表页", "/templates/ecommerce/customers": "客户列表页", "/templates/ecommerce/sellers": "商家列表页", "/templates/ecommerce/categories": "分类管理页",
  "/templates/ecommerce/orders/1": "订单详情页", "/templates/ecommerce/orders/1/invoice": "订单发票页", "/templates/ecommerce/customers/1": "客户详情页", "/templates/ecommerce/products/1": "商品详情页",
  "/templates/ecommerce/products/new": "新增商品页", "/templates/ecommerce/products/1/edit": "编辑商品页", "/templates/ecommerce/orders/new": "新建订单页",
  "/templates/crm-template/leads": "线索管理页", "/templates/crm-template/sales": "商机管理页", "/templates/crm-template/leads/lead-john-bushmill": "线索详情页", "/templates/crm-template/activity": "客户动态页", "/templates/crm-template/customers/john-bushmill": "CRM 客户详情页",
  "/templates/finance-template/invoices/new": "新建发票页", "/templates/finance-template/invoices/inv302012-lisa-greg": "发票详情页", "/templates/finance-template/invoices": "发票列表页", "/templates/finance-template/transactions": "交易流水页",
  "/templates/finance-template/cards": "银行卡页", "/templates/finance-template/wallets": "钱包页", "/templates/finance-template/wealth": "资产配置页", "/templates/finance-template/register": "财务注册页", "/templates/finance-template/forgot-password": "找回密码页",
  "/templates/task-board/tasks": "任务看板页", "/templates/task-board/today": "今日任务页", "/templates/task-board/agents": "智能体列表页", "/templates/task-board/library": "知识库页",
  "/templates/project-template/tasks/marketing-partnership": "任务详情页", "/templates/project-template/members/linda": "成员详情页", "/templates/project-template/clients": "客户名录页", "/templates/project-template/invoices": "项目发票页", "/templates/project-template/files": "项目文件页",
  "/templates/micellaneous-template/calendar": "日历页", "/templates/micellaneous-template/chat": "聊天页", "/templates/micellaneous-template/files": "文件管理页", "/templates/micellaneous-template/register": "注册页",
};
function templateFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? templateFiles(file) : entry.name.endsWith(".tsx") ? [{ file, content: fs.readFileSync(file, "utf8") }] : [];
  });
}
const templates = templateFiles(path.join(root, "src/app/templates"));
function relatedScreens(name, declared = []) {
  const discovered = templates.filter(template => template.content.includes(`@/blocks/${name}/`)).map(template => {
    const segments = path.relative(path.join(root, "src/app/templates"), template.file).split(path.sep).filter(segment => !segment.startsWith("("));
    const dashboard = segments[0] === "dashboards";
    return `/templates/${segments.slice(0, dashboard ? 2 : 1).join("/")}`;
  });
  return [...new Set([...declared, ...discovered])].map(href => ({ href, title: pageTitles[href] ?? screenTitles[href.split("/").at(-1)] ?? "业务模板" }));
}
const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(catalog.map(item => path.join(root, `blocks/${item.name}/${item.name}.tsx`)), parsed.options);
const checker = program.getTypeChecker();
function portableType(type) {
  return type.replace(/import\("([^"]+)"\)/g, (match, module) => {
    if (module.startsWith(path.join(root, "core") + path.sep)) return 'import("@forge-ui-official/core")';
    if (module.includes("/node_modules/@types/react/")) return 'import("react")';
    if (path.isAbsolute(module)) throw new Error(`Non-portable Props type: ${module}`);
    return match;
  });
}
const items = catalog.map(({ name, title, description, component, category, screens, shell }) => {
  if (!categories.includes(category)) throw new Error(`${name}: unknown category ${category}`);
  if (shell !== "none" && (!shell || ![shell.menu, shell.active, shell.title].every(value => typeof value === "string" && value.trim()))) throw new Error(`${name}: missing shell configuration`);
  if (shell !== "none" && shell.with !== undefined && !catalog.some(entry => entry.name === shell.with && entry.name !== name)) throw new Error(`${name}: unknown shell partner ${shell.with}`);
  if (!examples[name]) throw new Error(`${name}: missing example`);
  const source = `blocks/${name}/${name}.tsx`;
  const content = fs.readFileSync(path.join(root, source), "utf8");
  if (!content.includes(`export function ${component}`)) throw new Error(`${name}: missing component`);
  const sourceFile = program.getSourceFile(path.join(root, source));
  const exports = sourceFile.statements.filter(statement => ts.isFunctionDeclaration(statement) && statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword));
  const props = exports.map(declaration => {
    const parameter = declaration.parameters[0];
    const type = checker.getTypeAtLocation(parameter);
    return { component: declaration.name.text, properties: checker.getPropertiesOfType(type).map(property => ({
      name: property.name,
      required: !(property.flags & ts.SymbolFlags.Optional),
      type: portableType(checker.typeToString(checker.getTypeOfSymbolAtLocation(property, parameter), parameter, ts.TypeFormatFlags.NoTruncation)),
    })) };
  });
  const coreComponents = sourceFile.statements.filter(ts.isImportDeclaration).filter(statement => statement.moduleSpecifier.text === "@forge-ui-official/core").flatMap(statement => statement.importClause?.namedBindings?.elements?.filter(element => !element.isTypeOnly).map(element => element.name.text) ?? []);
  const example = `import { ${component} } from "@/components/blocks/${name}";\n\nexport default function Example() {\n  return (${examples[name]});\n}\n`;
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name, type: "registry:block", title, description,
    dependencies: [`@forge-ui-official/core@^${core.version}`],
    meta: { category, screens: relatedScreens(name, screens), example, props, core: { version: `^${core.version}`, components: coreComponents } },
    files: [{ path: source, type: "registry:component", target: `@components/blocks/${name}.tsx`, content }],
  };
  outputs.set(`public/r/${name}.json`, JSON.stringify(item, null, 2) + "\n");
  const tables = props.map(entry => `## ${entry.component} Props\n\n| Prop | 必填 | Type |\n|---|---|---|\n${entry.properties.map(property => `| ${property.name} | ${property.required ? "是" : "否"} | \`${property.type.replaceAll("|", "\\|").replaceAll("\n", " ")}\` |`).join("\n")}`).join("\n\n");
  outputs.set(`skills/forge-skill/references/blocks/${name}.md`, `# ${title}\n\n分类：${category}。${description}\n\n由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。\n\n依赖：core ^${core.version}；组件：${coreComponents.join("、") || "无"}。\n\n## 最小可用示例\n\n\`\`\`tsx\n${example}\`\`\`\n\n${tables}\n`);
  return item;
});
outputs.set("public/r/index.json", JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "forge-dashboard-blocks", homepage: "https://forgeui.org/blocks", items,
}, null, 2) + "\n");
const searchFile = "src/app/_components/search-index.json";
const search = JSON.parse(fs.readFileSync(path.join(root, searchFile), "utf8")).filter(entry => !/^\/blocks(?:[/?#]|$)/.test(entry.id));
search.push({ id: "/blocks", label: "页面组件", group: "页面组件", hint: `${catalog.length} 个页面组件`, keywords: ["blocks", "页面组件库", ...categories] });
search.push(...catalog.map(({ name, title, description, category, component }) => ({ id: `/blocks/${name}`, label: title, group: "页面组件", hint: category, keywords: [name, component, category, description] })));
outputs.set(searchFile, JSON.stringify(search) + "\n");
for (const [file, content] of outputs) {
  const target = path.join(root, file);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content) throw new Error(`Stale registry: ${file}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}
console.log(`${check ? "Checked" : "Generated"} ${items.length} copyable Blocks`);
