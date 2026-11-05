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
const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(catalog.map(item => path.join(root, `blocks/${item.name}/${item.name}.tsx`)), parsed.options);
const checker = program.getTypeChecker();
const items = catalog.map(({ name, title, description, component }) => {
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
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, parameter), parameter, ts.TypeFormatFlags.NoTruncation),
    })) };
  });
  const coreComponents = sourceFile.statements.filter(ts.isImportDeclaration).filter(statement => statement.moduleSpecifier.text === "@forge-ui-official/core").flatMap(statement => statement.importClause?.namedBindings?.elements?.filter(element => !element.isTypeOnly).map(element => element.name.text) ?? []);
  const example = `import { ${component} } from "@/components/blocks/${name}";\n\nexport default function Example() {\n  return (${examples[name]});\n}\n`;
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name, type: "registry:block", title, description,
    dependencies: [`@forge-ui-official/core@^${core.version}`],
    meta: { example, props, core: { version: `^${core.version}`, components: coreComponents } },
    files: [{ path: source, type: "registry:component", target: `@components/blocks/${name}.tsx`, content }],
  };
  outputs.set(`public/r/${name}.json`, JSON.stringify(item, null, 2) + "\n");
  const tables = props.map(entry => `## ${entry.component} Props\n\n| Prop | 必填 | Type |\n|---|---|---|\n${entry.properties.map(property => `| ${property.name} | ${property.required ? "是" : "否"} | \`${property.type.replaceAll("|", "\\|").replaceAll("\n", " ")}\` |`).join("\n")}`).join("\n\n");
  outputs.set(`skills/forge-skill/references/blocks/${name}.md`, `# ${title}\n\n由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。\n\n依赖：core ^${core.version}；组件：${coreComponents.join("、") || "无"}。\n\n## 最小可用示例\n\n\`\`\`tsx\n${example}\`\`\`\n\n${tables}\n`);
  return item;
});
outputs.set("public/r/index.json", JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "forge-dashboard-blocks", homepage: "https://forgeui.org/blocks", items,
}, null, 2) + "\n");
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
