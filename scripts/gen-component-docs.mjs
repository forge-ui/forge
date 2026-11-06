import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const packageInfo = JSON.parse(fs.readFileSync(path.join(root, "core/package.json"), "utf8"));
const configPath = path.join(root, "core/tsconfig.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
const entry = program.getSourceFile(path.join(root, "core/src/index.ts"));
const moduleSymbol = checker.getSymbolAtLocation(entry);
const flags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const relative = file => path.relative(root, file).split(path.sep).join("/");
const previous = JSON.parse(fs.readFileSync(path.join(root, "docs/for-agents/inventory.json"), "utf8"));
const defaults = new Set(previous.components.filter(item => item.oneShotDefault).map(item => item.name));
const components = checker.getExportsOfModule(moduleSymbol).map(exported => {
  const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  if (!declaration) throw new Error(`No declaration for ${exported.name}`);
  const source = declaration.getSourceFile();
  const kind = symbol.flags & ts.SymbolFlags.Value ? "value" : "type";
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signatures = type.getCallSignatures();
  const propsSymbol = signatures[0]?.parameters[0];
  const propsType = propsSymbol && checker.getTypeOfSymbolAtLocation(propsSymbol, declaration);
  const props = propsType ? checker.getPropertiesOfType(propsType).map(property => {
    const location = property.valueDeclaration ?? property.declarations?.[0] ?? declaration;
    return {
      name: property.name,
      optional: Boolean(property.flags & ts.SymbolFlags.Optional),
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, location), location, flags),
      description: ts.displayPartsToString(property.getDocumentationComment(checker)),
    };
  }) : [];
  const sourcePath = relative(source.fileName);
  return {
    name: exported.name, kind, source: sourcePath,
    module: sourcePath.replace(/^core\/src\/components\/(ui|layouts)\//, "").replace(/\.tsx?$/, ""),
    group: sourcePath.includes("/layouts/") ? "layouts" : "ui",
    oneShotDefault: defaults.has(exported.name),
    signature: kind === "value" ? checker.typeToString(type, declaration, flags) : undefined,
    props,
  };
}).sort((left, right) => left.name.localeCompare(right.name, "en"));
if (!components.length) throw new Error("Empty core export inventory");
const oldByModule = new Map();
const docsDir = path.join(root, "skills/forge-skill/references/components");
for (const item of components) {
  const key = path.basename(item.source).replace(/\.tsx?$/, "");
  if (!oldByModule.has(key)) oldByModule.set(key, []);
  oldByModule.get(key).push(item);
}
const outputs = new Map();
for (const [moduleName, exports] of oldByModule) {
  const selectionPath = path.join(root, "skills/forge-skill/references/component-selection", `${moduleName}.md`);
  const selection = fs.existsSync(selectionPath) ? fs.readFileSync(selectionPath, "utf8").trim() : "";
  const sections = exports.map(item => {
    const source = program.getSourceFile(path.join(root, item.source));
    const symbol = checker.getExportsOfModule(moduleSymbol).find(exported => exported.name === item.name);
    const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const declaration = resolved.valueDeclaration ?? resolved.declarations[0];
    const definition = item.kind === "type" ? `\n\n\`\`\`ts\n${declaration.getText(source)}\n\`\`\`` : `\n\n\`\`\`ts\n${item.signature}\n\`\`\``;
    const rows = item.props.map(prop => `| \`${prop.name}\` | ${prop.optional ? "否" : "是"} | \`${prop.type.replace(/\|/g, "\\|").replace(/\n/g, " ")}\` | ${prop.description.replace(/\|/g, "\\|").replace(/\n/g, " ")} |`).join("\n");
    return `## ${item.name} (${item.kind})${definition}${rows ? `\n\n| 属性 | 必填 | 类型 | 说明 |\n|---|---|---|---|\n${rows}` : ""}`;
  });
  outputs.set(path.join(docsDir, `${moduleName}.md`), `# ${moduleName}\n\n自动生成；请勿编辑 API 部分。来源：\`${exports[0].source}\`；core **${packageInfo.version}**。\n默认值和运行行为以源码初始化为准；类型表不推测默认值。\n\n${sections.join("\n\n")}\n${selection ? `\n${selection}\n` : ""}`);
}
const aliases = { charts: "smooth-line-chart", forms: "text-field", "layouts-app-layout": "app-layout", "plus-icon": "plain-icons" };
for (const [alias, target] of Object.entries(aliases)) {
  const selectionPath = path.join(root, "skills/forge-skill/references/component-selection", `${alias}.md`);
  const selection = fs.existsSync(selectionPath) ? fs.readFileSync(selectionPath, "utf8") : "";
  outputs.set(path.join(docsDir, `${alias}.md`), `# ${alias}\n\ncore ${packageInfo.version}。旧模块名兼容导航；不维护第二份 Props。\n\n参阅 [${target}](${target}.md) 与 [完整导出清单](../../../../docs/for-agents/components.md)。\n\n${selection}`);
}
const exportFingerprint = execFileSync("git", ["hash-object", "--stdin"], { input: JSON.stringify(components), cwd: root, encoding: "utf8" }).trim();
const revision = execFileSync("git", ["log", "-1", "--format=%H", "--", "core/src", "core/package.json"], { cwd: root, encoding: "utf8" }).trim();
const generatedAt = execFileSync("git", ["log", "-1", "--format=%cI", "--", "core/src", "core/package.json"], { cwd: root, encoding: "utf8" }).trim();
const dirty = Boolean(execFileSync("git", ["status", "--porcelain", "--", "core/src", "core/package.json"], { cwd: root, encoding: "utf8" }).trim());
const inventory = { package: packageInfo.name, version: packageInfo.version, source: "core/src/index.ts", revision, dirty, exportFingerprint, generatedAt, generatedAtBasis: "source revision timestamp for reproducibility", componentCount: components.length, oneShotDefaultCount: components.filter(item => item.oneShotDefault).length, components };
outputs.set(path.join(root, "docs/for-agents/inventory.json"), JSON.stringify(inventory, null, 2) + "\n");
outputs.set(path.join(root, "docs/for-agents/components.md"), `# Forge 公开导出清单\n\n由 \`scripts/gen-component-docs.mjs\` 从 \`core/src/index.ts\` 生成；core ${packageInfo.version}，共 ${components.length} 项（区分 value/type，不将类型误称为可渲染组件）。\n\n[机器清单](inventory.json) · [选型与规范](../../skills/forge-skill/SKILL.md)\n\n| 导出 | 种类 | 源码 | API |\n|---|---|---|---|\n${components.map(item => `| ${item.name} | ${item.kind} | [源码](../../${item.source}) | [${path.basename(item.source, path.extname(item.source))}](../../skills/forge-skill/references/components/${path.basename(item.source, path.extname(item.source))}.md) |`).join("\n")}\n`);
let drift = false;
for (const [file, rawContent] of outputs) {
  const content = rawContent.trimEnd() + "\n";
  if (check) {
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) {
      console.error(`Out of date: ${relative(file)}`);
      drift = true;
    }
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
}
if (drift) process.exitCode = 1;
console.log(`${check ? "Checked" : "Generated"} ${components.length} exports in ${oldByModule.size} source modules`);
