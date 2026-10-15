import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
const root = process.cwd();
function save(file, content) {
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) throw new Error(`接口清单已过期，请运行 node scripts/audit-public-api-comparison.mjs：${file}`);
  } else fs.writeFileSync(file, content);
}
const entry = path.join(root, 'core/src/index.ts');
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options;
const mainFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', 'main', '--', 'core/src'], { encoding: 'utf8' }).trim().split('\n');
const historical = new Map(mainFiles.filter(f => /\.tsx?$/.test(f)).map(f => [path.join(root, f), execFileSync('git', ['show', `main:${f}`], { encoding: 'utf8' })]));
function inspect(previous) {
  const host = ts.createCompilerHost(options);
  if (previous) {
    const read = host.readFile.bind(host), exists = host.fileExists.bind(host);
    host.readFile = f => f.startsWith(path.join(root, 'core/src/')) ? historical.get(f) : read(f);
    host.fileExists = f => f.startsWith(path.join(root, 'core/src/')) ? historical.has(f) : exists(f);
  }
  const program = ts.createProgram([entry], { ...options, incremental: false }, host);
  const checker = program.getTypeChecker();
  const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(entry)));
  const components = {};
  const types = {};
  for (const exported of exports) {
    const name = exported.name;
    if (!/^[A-Z]/.test(name)) continue;
    const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const declaration = symbol.valueDeclaration;
    if (!declaration) {
      const d = symbol.declarations?.[0];
      if (d) {
        const type = checker.getDeclaredTypeOfSymbol(symbol);
        types[name] = { type: ts.isTypeAliasDeclaration(d) ? d.type.getText() : checker.typeToString(type, d, ts.TypeFormatFlags.NoTruncation), fields: checker.getPropertiesOfType(type).filter(p => p.declarations?.some(d => d.getSourceFile().fileName.startsWith(path.join(root, "core/src/")))).map(p => { const at = p.valueDeclaration ?? p.declarations?.[0] ?? d; return { name: p.name, type: checker.typeToString(checker.getTypeOfSymbolAtLocation(p, at), at, ts.TypeFormatFlags.NoTruncation), optional: !!(p.flags & ts.SymbolFlags.Optional) }; }) };
      }
      continue;
    }
    const signature = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures()[0];
    if (!signature || !signature.parameters.length) continue;
    const result = checker.typeToString(signature.getReturnType());
    if (!/Element|ReactNode|ReactElement/.test(result)) continue;
    const parameter = signature.parameters[0];
    const parameterDeclaration = parameter.valueDeclaration ?? declaration;
    const propsType = checker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration);
    const defaults = {};
    if (ts.isParameter(parameterDeclaration) && ts.isObjectBindingPattern(parameterDeclaration.name)) {
      for (const binding of parameterDeclaration.name.elements) if (binding.initializer) defaults[binding.propertyName?.getText() ?? binding.name.getText()] = binding.initializer.getText();
    }
    const branches = propsType.isUnion() ? propsType.types : [propsType];
    const allProps = [...new Map(branches.flatMap(branch => checker.getPropertiesOfType(branch)).map(prop => [prop.name, prop])).values()];
    const props = allProps.map(prop => {
      const d = prop.valueDeclaration ?? prop.declarations?.[0] ?? declaration;
      const typeText = [...new Set(branches.flatMap(branch => {
        const member = checker.getPropertyOfType(branch, prop.name);
        if (!member) return [];
        const at = member.valueDeclaration ?? member.declarations?.[0] ?? d;
        return [checker.typeToString(checker.getTypeOfSymbolAtLocation(member, at), at, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)];
      }))].join(' | ');
      return { name: prop.name, type: typeText, optional: branches.some(branch => { const member = checker.getPropertyOfType(branch, prop.name); return !member || !!(member.flags & ts.SymbolFlags.Optional); }), defaultValue: defaults[prop.name] ?? null, comment: ts.displayPartsToString(prop.getDocumentationComment(checker)), file: path.relative(root, d.getSourceFile().fileName) };
    });
    components[name] = { file: path.relative(root, declaration.getSourceFile().fileName), props };
  }
  return { exports: exports.map(s => s.name).sort(), components, types };
}
const main = inspect(true), current = inspect(false);
const comparisons = Object.entries(current.components).map(([name, component]) => {
  const old = main.components[name];
  return { name, file: component.file, mainCount: old?.props.length ?? 0, currentCount: component.props.length, added: component.props.filter(p => !old?.props.some(o => o.name === p.name)).map(p => p.name), removed: old?.props.filter(p => !component.props.some(o => o.name === p.name)).map(p => p.name) ?? [], changed: component.props.filter(p => old?.props.some(o => o.name === p.name && o.type !== p.type)).map(p => p.name) };
});
const report = { mainCommit: execFileSync('git', ['rev-parse', 'main'], {encoding:'utf8'}).trim(), currentCommit: execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim(), main, current, comparisons, removedExports: main.exports.filter(n => !current.exports.includes(n)), addedExports: current.exports.filter(n => !main.exports.includes(n)) };
save('docs/public-api-comparison.json', JSON.stringify(report, null, 2) + '\n');
const focus = comparisons.filter(c => /\/agent\/|chat-input-bar|ask-ai|chat-|composer/.test(c.file) || /PageTitleToolbar|TopBar|AppLayout/.test(c.name));
let md = `# 主分支与迁移版本 API 对照\n\n基准 main：${report.mainCommit}。当前 HEAD：${report.currentCommit}，包含本地未提交源码。\n\n通过 TypeScript 编译器解析 core 根入口的公开组件与实际参数类型，包含继承属性。以下是静态接口核对，不代表行为、示例或浏览器验收通过。类型文字变化需人工判断是否为破坏性修改。\n\n## 智能体与聊天相关组件\n\n| 组件 | main 参数数 | 当前参数数 | 新增参数 | 删除参数 | 类型变化 |\n|---|---:|---:|---|---|---|\n`;
const row = c => `| ${c.name} | ${c.mainCount} | ${c.currentCount} | ${c.added.join(', ') || '—'} | ${c.removed.join(', ') || '—'} | ${c.changed.join(', ') || '—'} |\n`;
md += focus.map(row).join('');
md += '\n## 全部公开组件\n\n| 组件 | main 参数数 | 当前参数数 | 新增参数 | 删除参数 | 类型变化 |\n|---|---:|---:|---|---|---|\n' + comparisons.map(row).join('');
md += `\n## 导出变化\n\n删除：${report.removedExports.join(', ') || '无'}。\n\n新增：${report.addedExports.join(', ') || '无'}。\n\n## 智能体与聊天参数明细\n`;
for (const c of focus) md += `\n### ${c.name}\n\n源码：\`${c.file}\`。\n\n| 参数 | 类型 | 是否必填 | 源码默认值 |\n|---|---|---|---|\n` + current.components[c.name].props.map(p => `| ${p.name} | \`${p.type.replaceAll('|','\\|')}\` | ${p.optional ? '否':'是'} | ${p.defaultValue ?? '未在参数解构处设置'} |\n`).join('');
save('docs/public-api-comparison.md', md);
console.log(JSON.stringify({ main: Object.keys(main.components).length, current: comparisons.length, focus: focus.length, removedExports: report.removedExports, removedProps: comparisons.filter(c=>c.removed.length), focusSummary: focus.map(c=>({name:c.name,main:c.mainCount,current:c.currentCount})) }, null, 2));

function relatedTypes(name) {
  const found = new Set();
  function collect(text) {
    for (const token of text.match(/\b[A-Z][A-Za-z0-9_]+\b/g) ?? []) {
      const type = current.types[token];
      if (!type || found.has(token) || (!type.fields.length && !/^[\s\S]*["']/.test(type.type)) || token.endsWith('Props')) continue;
      found.add(token);
      for (const field of type.fields) collect(field.type);
    }
  }
  for (const prop of current.components[name].props) collect(prop.type);
  return [...found].map(name => ({ name, definition: current.types[name].fields.length ? "" : current.types[name].type, fields: current.types[name].fields }));
}
const referenceNames = focus.map(c => c.name);
save('src/app/components/_agent-api-data.json', JSON.stringify(Object.fromEntries(referenceNames.map(name => [name, { props: current.components[name].props.map(({name, type, optional, defaultValue}) => ({name, type, optional, defaultValue})), types: relatedTypes(name) }])), null, 2) + '\n');
const catalog = JSON.parse(fs.readFileSync('src/app/prototype/component-fusion/_catalog-data.json', 'utf8'));
const active = catalog.items.filter(item => item.mode !== 'defer');
const migration = active.map(item => ({ id: item.id, name: item.name, family: item.family, mode: item.mode, targets: item.target.map(name => ({ name, publicComponent: !!current.components[name], publicExport: current.exports.includes(name) })), declaredHref: item.href, accepted: item.accepted }));
save('docs/migration-api-crosswalk.json', JSON.stringify(migration, null, 2) + '\n');
save('docs/migration-api-crosswalk.md', '# 迁移清单与公开 API 对照\n\n逐项核对目录中的目标名称是否可从 core 根入口导入。目标对应不代表单个组件本身拥有整套案例交互；组合案例的状态管理仍由应用负责。accepted 是目录原字段，不代替本轮验收。页面路径保留目录声明，实际路由还须结合 registry 的分类覆盖规则。\n\n| 编号 | 案例 | 分类 | 目标组件 | 目录验收标记 |\n|---|---|---|---|---|\n' + migration.map(item => `| ${item.id} | ${item.name} | ${item.family} | ${item.targets.map(t => `${t.name}${t.publicComponent ? '' : t.publicExport ? '（公开导出，非本脚本识别的组件）' : '（未在根入口找到）'}`).join('、')} | ${item.accepted ? '已标记' : '未标记'} |`).join('\n') + '\n');
