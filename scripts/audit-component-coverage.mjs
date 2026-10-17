import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Static inventory only: JSX evidence and literal branches are not browser acceptance.
const root = process.cwd();
const relative = value => path.relative(root, value).split(path.sep).join('/');
const walkFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walkFiles(path.join(dir, entry.name)) : /\.tsx?$/.test(entry.name) ? [path.join(dir, entry.name)] : []);
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const files = [...walkFiles(path.join(root, 'core/src')), ...walkFiles(path.join(root, 'src/app'))];
const program = ts.createProgram(files, { ...parsed.options, incremental: false, noEmit: true });
const checker = program.getTypeChecker();
const sourceFiles = program.getSourceFiles().filter(file => file.fileName.startsWith(root + '/src/app/') || file.fileName.startsWith(root + '/core/src/'));
const alias = symbol => symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
const at = node => {
  const position = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
  return { file: relative(node.getSourceFile().fileName), line: position.line + 1, column: position.character + 1 };
};
const nodeIds = new Map();
const symbols = new Map();
const edges = new Map();
const usages = [];
const finite = type => {
  const parts = type?.isUnion() ? type.types : [type];
  if (parts.some(item => item && !(item.flags & (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral | ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Never)))) return [];
  return [...new Set(parts.flatMap(item => item?.flags & ts.TypeFlags.StringLiteral ? [item.value] : item?.flags & ts.TypeFlags.NumberLiteral ? [item.value] : item?.flags & ts.TypeFlags.BooleanLiteral ? [item.intrinsicName === 'true'] : []))];
};
const functionLike = node => ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node);
const functionSymbol = node => node.name ? alias(checker.getSymbolAtLocation(node.name)) : ts.isVariableDeclaration(node.parent) ? alias(checker.getSymbolAtLocation(node.parent.name)) : undefined;
for (const source of sourceFiles) {
  const visit = node => {
    if (functionLike(node)) {
      const location = at(node);
      const id = `${location.file}:${node.pos}`;
      const symbol = functionSymbol(node);
      nodeIds.set(node, id);
      if (symbol) symbols.set(symbol, id);
      edges.set(id, new Set());
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
const owner = node => {
  for (let current = node.parent; current; current = current.parent) if (nodeIds.has(current)) return nodeIds.get(current);
  return undefined;
};
const link = (from, to) => { if (from && to) edges.get(from)?.add(to); };
function values(expression, seen = new Set()) {
  if (!expression || seen.has(expression)) return [];
  const next = new Set(seen).add(expression);
  if (ts.isStringLiteralLike(expression) || ts.isNumericLiteral(expression)) return [ts.isNumericLiteral(expression) ? Number(expression.text) : expression.text];
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return [true];
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return [false];
  if (ts.isParenthesizedExpression(expression) || ts.isAsExpression(expression) || ts.isSatisfiesExpression(expression) || ts.isNonNullExpression(expression)) return values(expression.expression, next);
  if (ts.isConditionalExpression(expression)) return [...values(expression.whenTrue, next), ...values(expression.whenFalse, next)];
  if (ts.isArrayLiteralExpression(expression)) return expression.elements.flatMap(item => ts.isSpreadElement(item) ? values(item.expression, next) : values(item, next));
  if (ts.isIdentifier(expression)) {
    const symbol = alias(checker.getSymbolAtLocation(expression));
    return (symbol?.declarations ?? []).flatMap(declaration => {
      if (ts.isVariableDeclaration(declaration) || ts.isBindingElement(declaration)) return values(declaration.initializer, next);
      if (ts.isParameter(declaration)) {
        const fn = declaration.parent;
        const call = fn.parent;
        if (ts.isCallExpression(call) && ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === 'map' && fn.parameters[0] === declaration) return values(call.expression.expression, next);
      }
      return [];
    });
  }
  return [];
}
function jsxSymbol(tag) { return alias(checker.getSymbolAtLocation(ts.isPropertyAccessExpression(tag) ? tag.name : tag)); }
for (const source of sourceFiles) {
  const visit = node => {
    const from = owner(node);
    if (functionLike(node) && !functionSymbol(node)) link(from, nodeIds.get(node));
    if (ts.isCallExpression(node)) link(from, symbols.get(alias(checker.getSymbolAtLocation(ts.isPropertyAccessExpression(node.expression) ? node.expression.name : node.expression))));
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const symbol = jsxSymbol(node.tagName);
      link(from, symbols.get(symbol));
      const attrs = {};
      for (const prop of node.attributes.properties) {
        if (ts.isJsxSpreadAttribute(prop)) { attrs['...spread'] = { text: prop.expression.getText().slice(0, 100), values: [], inferred: [] }; continue; }
        const name = prop.name.getText();
        const expression = prop.initializer && ts.isJsxExpression(prop.initializer) ? prop.initializer.expression : prop.initializer;
        attrs[name] = { text: expression?.getText().slice(0, 140) ?? 'true', values: [...new Set(expression ? values(expression) : [true])], inferred: expression ? finite(checker.getTypeAtLocation(expression)) : [true] };
      }
      usages.push({ symbol, owner: from, ...at(node), attrs });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
// next/dynamic wrappers are real render boundaries, not plain imports. Link only
// the export selected by their loader (module.X); do not mark a whole module used.
for (const source of sourceFiles) {
  const visit = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isCallExpression(node.initializer) && ['dynamic', 'lazy'].includes(node.initializer.expression.getText())) {
      const id = `${relative(source.fileName)}:dynamic:${node.pos}`;
      const symbol = alias(checker.getSymbolAtLocation(node.name));
      symbols.set(symbol, id); edges.set(id, new Set());
      const loader = child => {
        if (ts.isPropertyAccessExpression(child)) link(id, symbols.get(alias(checker.getSymbolAtLocation(child.name))));
        ts.forEachChild(child, loader);
      };
      loader(node.initializer);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
// JSX edges using dynamic aliases were unresolved during the first pass.
for (const usage of usages) link(usage.owner, symbols.get(usage.symbol));
const reachable = start => {
  const reached = new Set(), pending = [start];
  while (pending.length) { const id = pending.pop(); if (!id || reached.has(id)) continue; reached.add(id); pending.push(...(edges.get(id) ?? [])); }
  return reached;
};
const pages = [];
for (const source of sourceFiles.filter(file => /\/src\/app\/(components|cases)\/.*page\.tsx$/.test(file.fileName))) {
  const moduleSymbol = checker.getSymbolAtLocation(source);
  const defaultSymbol = checker.getExportsOfModule(moduleSymbol).find(symbol => symbol.name === 'default');
  const id = symbols.get(alias(defaultSymbol));
  const location = relative(source.fileName);
  pages.push({ file: location, route: '/' + location.replace(/^src\/app\//, '').replace(/\/page\.tsx$/, ''), reached: reachable(id) });
}
// Shared layout injection has pathname/category guards. Never distribute all its JSX to every route.
const injections = ['src/app/components/_fusion/family-examples.tsx', 'src/app/_components/family-interaction-demos.tsx'].map(file => {
  const source = program.getSourceFile(path.join(root, file));
  const moduleSymbol = checker.getSymbolAtLocation(source);
  const exportName = file.includes('family-examples') ? 'FusionFamilyExamples' : 'FamilyInteractionDemos';
  const symbol = checker.getExportsOfModule(moduleSymbol).find(item => item.name === exportName);
  return { file, reached: reachable(symbols.get(alias(symbol))) };
});
const index = program.getSourceFile(path.join(root, 'core/src/index.ts'));
const exported = checker.getExportsOfModule(checker.getSymbolAtLocation(index));
const excluded = [];
const records = [];
const axes = /^(variant|effect|appearance|shape|transition|size|density|theme|surface|state|status|type|mode|orientation|placement|position|direction|color|accent|tone|motion|locale|layout|align|active|disabled|loading|checked|selected|open|result|balanceHidden|clearOnError|collapsible|collapsed)$/;
for (const symbol of exported) {
  const resolved = alias(symbol);
  const declaration = resolved?.valueDeclaration ?? resolved?.declarations?.[0];
  if (!declaration || !/\/core\/src\/components\/(ui|layouts)\//.test(declaration.getSourceFile().fileName)) continue;
  const type = checker.getTypeOfSymbolAtLocation(resolved, declaration);
  const signatures = type.getCallSignatures();
  const returnType = signatures.map(signature => checker.typeToString(signature.getReturnType())).join(' | ');
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(symbol.name) || !signatures.length || !/(Element|ReactNode|ReactElement|ReactPortal)/.test(returnType)) {
    excluded.push({ name: symbol.name, ...at(declaration), reason: !(symbol.flags & ts.SymbolFlags.Value) && !(resolved.flags & ts.SymbolFlags.Value) ? 'type-only' : !signatures.length ? 'non-callable constant/type' : 'not a public React component signature', returnType });
    continue;
  }
  const allOccurrences = usages.filter(usage => usage.symbol === resolved);
  const occurrences = allOccurrences.filter(usage => usage.file.startsWith('src/app/'));
  const composed = allOccurrences.filter(usage => usage.file.startsWith('core/src/')).flatMap(usage => {
    const docsRoutes = pages.filter(page => page.route.startsWith('/components/') && page.reached.has(usage.owner)).map(page => page.route);
    const casesRoutes = pages.filter(page => page.route.startsWith('/cases/') && page.reached.has(usage.owner)).map(page => page.route);
    const injectedVia = injections.filter(item => item.reached.has(usage.owner)).map(item => item.file);
    return docsRoutes.length || casesRoutes.length || injectedVia.length ? [{ file: usage.file, line: usage.line, docsRoutes, casesRoutes, injectedVia, usage }] : [];
  });
  const docs = occurrences.flatMap(usage => pages.filter(page => page.route.startsWith('/components/') && page.reached.has(usage.owner)).map(page => ({ route: page.route, file: usage.file, line: usage.line, usage })));
  const cases = occurrences.flatMap(usage => pages.filter(page => page.route.startsWith('/cases/') && page.reached.has(usage.owner)).map(page => ({ route: page.route, file: usage.file, line: usage.line, usage })));
  const injected = occurrences.flatMap(usage => injections.filter(injection => injection.reached.has(usage.owner)).map(injection => ({ via: injection.file, file: usage.file, line: usage.line, usage })));
  const dedupe = list => [...new Map(list.map(item => [`${item.route ?? item.via}:${item.file}:${item.line}:${item.usage.column}`, item])).values()];
  const evidence = { docs: dedupe(docs), cases: dedupe(cases), injected: dedupe(injected), composed };
  const defaults = {};
  const findDefaults = node => {
    if (ts.isParameter(node) && ts.isObjectBindingPattern(node.name)) for (const part of node.name.elements) if (part.initializer) defaults[(part.propertyName ?? part.name).getText()] = values(part.initializer);
    if (ts.isVariableDeclaration(node) && ts.isObjectBindingPattern(node.name)) for (const part of node.name.elements) if (part.initializer) defaults[(part.propertyName ?? part.name).getText()] = values(part.initializer);
    if (node !== declaration && functionLike(node)) return;
    ts.forEachChild(node, findDefaults);
  };
  let defaultRoot = declaration;
  if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
    const init = declaration.initializer;
    if (functionLike(init)) defaultRoot = init;
    else if (ts.isCallExpression(init)) defaultRoot = init.arguments.find(functionLike) ?? declaration;
  }
  // Read the implementation's parameter defaults, including forwardRef callbacks.
  if (functionLike(defaultRoot)) for (const parameter of defaultRoot.parameters) findDefaults(parameter);
  else findDefaults(declaration);
  const props = signatures[0]?.parameters[0];
  const propsType = props ? checker.getTypeOfSymbolAtLocation(props, declaration) : undefined;
  const variants = [];
  for (const prop of propsType?.getProperties() ?? []) {
    if (/^default[A-Z]/.test(prop.name)) continue;
    const inheritedHtml = (prop.declarations ?? []).length && prop.declarations.every(node => /node_modules.*(@types\/react|\.pnpm\/@types\+react)/.test(node.getSourceFile().fileName));
    if (inheritedHtml && !['disabled', 'checked', 'required', 'readOnly', 'multiple', 'type'].includes(prop.name)) continue;
    const options = finite(checker.getTypeOfSymbolAtLocation(prop, declaration));
    if (!axes.test(prop.name) && !/(Variant|Effect|Appearance|Shape|Transition|Mode|State|Status|Size|Theme|Motion|Color|Align|Placement|Direction)$/.test(prop.name) && !options.every(value => typeof value === 'boolean')) continue;
    if (!options.length || options.length > 24) continue;
    const coverage = {};
    for (const [kind, list] of Object.entries(evidence)) {
      const literals = new Set(), inferred = new Set(), dynamic = [];
      for (const item of list) {
        const attribute = item.usage.attrs[prop.name];
        if (attribute) {
          attribute.values.forEach(value => { if (options.includes(value)) literals.add(value); });
          if (!attribute.values.length) { attribute.inferred.forEach(value => { if (options.includes(value)) inferred.add(value); }); dynamic.push({ file: item.file, line: item.line, expression: attribute.text }); }
        } else if (!item.usage.attrs['...spread']) (defaults[prop.name] ?? []).forEach(value => { if (options.includes(value)) literals.add(value); });
        else dynamic.push({ file: item.file, line: item.line, expression: 'spread props: default cannot be assumed' });
      }
      coverage[kind] = { literalOrDeclaredDefault: [...literals], inferredCandidates: [...inferred], missingLiteralEvidence: options.filter(value => !literals.has(value)), unresolved: dynamic };
    }
    variants.push({ prop: prop.name, priority: /effect|variant|appearance|shape|transition|state|status|result|mode/i.test(prop.name) ? 'behavior-or-meaningful-style' : 'supporting-configuration', options, declaredDefault: defaults[prop.name] ?? [], coverage });
  }
  const strips = list => list.map(({ usage, ...location }) => ({ ...location, column: usage.column, props: usage.attrs }));
  const role = /^(ToastProvider|TooltipGroup)$/.test(symbol.name) ? 'context-or-composition-helper' : /^(CardAvatarGroup|CardGlow|CardIconChip|CardKebabButton|CardTrend|StatCardShell|FinancialOrbs|MastercardLogo|PlusIcon|CloseIcon|CheckIcon|ColorSwatch|ColorSection|TypefaceBlock|TypographySizeRow|TypographyWeightSample)$/.test(symbol.name) ? 'public-render-helper' : /^(Cell|ChartLegendItem|ChartListItem|ChartStatFooter|ChartTooltip|ChartValueRow|GridItem$|TooltipBubble|TooltipAnchor|DropdownDivider|ChecklistItem|CalendarDayCell|CalendarWeekRow)/.test(symbol.name) ? 'public-composition-subcomponent' : 'user-facing-component';
  records.push({ name: symbol.name, role, ...at(declaration), returnType, documentation: evidence.docs.length ? 'jsx-evidence' : composed.some(item => item.docsRoutes.length) ? 'composed-jsx' : 'no-reachable-jsx', cases: evidence.cases.length ? 'jsx-evidence' : evidence.injected.length ? 'shared-layout-jsx' : composed.some(item => item.casesRoutes.length || item.injectedVia.length) ? 'composed-jsx' : 'no-reachable-jsx', evidence: Object.fromEntries(Object.entries(evidence).map(([kind, list]) => [kind, strips(list)])), variants, unassignedJsx: occurrences.filter(usage => !Object.values(evidence).flat().some(item => item.usage === usage)).map(usage => ({ file: usage.file, line: usage.line, column: usage.column, attrs: usage.attrs })) });
}
records.sort((a, b) => a.name.localeCompare(b.name));
const summary = { publicReactComponents: records.length, documentationJsx: records.filter(record => record.documentation === 'jsx-evidence').length, directCaseJsx: records.filter(record => record.cases === 'jsx-evidence').length, onlySharedCaseJsx: records.filter(record => record.cases === 'shared-layout-jsx').length, noCaseJsx: records.filter(record => record.cases === 'no-reachable-jsx').length, composedCaseJsx: records.filter(record => record.cases === 'composed-jsx').length, composedDocumentationJsx: records.filter(record => record.documentation === 'composed-jsx').length, noDocumentationJsx: records.filter(record => record.documentation === 'no-reachable-jsx').length, finitePropAxes: records.reduce((sum, record) => sum + record.variants.length, 0) };
summary.roles = Object.fromEntries([...new Set(records.map(record => record.role))].map(role => [role, records.filter(record => record.role === role).length]));
const report = { generatedAt: new Date().toISOString(), command: 'node scripts/audit-component-coverage.mjs', summary, methodology: [
  '以 core/src/index.ts 的真实公共导出为准，解析 ui/layouts 中 PascalCase、可调用且返回 React Element/Node 的值；排除类型、常量、工具函数和 hooks。',
  '仅统计 TypeScript 符号解析后的真实 JSX 开始/自闭合标签；import、注释和代码字符串均不计展示。行号相同的多个 JSX 按列号区分。',
  '从文档/案例 page 默认导出追踪本地 JSX、函数调用、匿名回调及 next/dynamic 指定的加载导出。共享布局注入单列，路径/分类条件不能视为每个页面都展示所有示例。',
  '字面量证据包括显式值、条件分支、可解析常量数组的 map，以及未被 spread 覆盖的声明默认值；只证明源码可能展示，并非初始可见或浏览器通过。',
  '父组件内部调用的公共子组件有单独组合证据；没有独立 JSX 调用不直接判定缺案例。',
  '类型推导出的联合值仅作为候选，不抵消字面量缺口；动态状态、spread 和复杂对象循环需人工核对。',
  'Provider、渲染辅助、组合子组件和面向用户的组件分开分类；辅助组件无需单独业务卡，配色/尺寸/语言不要求每种配置或笛卡尔积逐一铺开。',
  '有限属性统计包括组件声明的顶层样式与布尔状态；排除继承 React HTML 的通用透传属性，仅保留 disabled/checked/required/readOnly/multiple/type 等用户行为相关项。嵌套数据、焦点、时序和组合仍需跟进。',
  '调用图不能解析所有业务条件，公共 dispatcher 可能使一个组件静态可达多个分类（例如 Accordion）；所有页面关联都是可达候选，不能换算为确实可见覆盖率。',
], excluded, components: records };
fs.writeFileSync('docs/component-coverage-audit.json', JSON.stringify(report, null, 2) + '\n');
const roleLabel = { 'user-facing-component': '用户组件', 'public-composition-subcomponent': '组合子组件', 'public-render-helper': '渲染辅助', 'context-or-composition-helper': '上下文辅助' };
const cell = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const missing = records.filter(record => record.cases === 'no-reachable-jsx');
const noDocs = records.filter(record => record.documentation === 'no-reachable-jsx');
const lines = ['# 公共组件与变体展示覆盖审计', '', `生成时间：${report.generatedAt}`, '', `复现：\`${report.command}\`。这是源码覆盖审计，不代表浏览器验收。`, '', '## 汇总', '', `- 公共 React 组件：${summary.publicReactComponents}。`, `- 组件文档页存在可达 JSX：${summary.documentationJsx}；父组件内部组合展示：${summary.composedDocumentationJsx}；缺少可达 JSX：${summary.noDocumentationJsx}。`, `- 案例页存在可达 JSX：${summary.directCaseJsx}；仅共享布局注入证据：${summary.onlySharedCaseJsx}；父组件内部组合展示：${summary.composedCaseJsx}；无案例 JSX 证据：${summary.noCaseJsx}。`, `- 提取有限属性轴：${summary.finitePropAxes}。`, '', '## 判定边界与误报排除', '', ...report.methodology.map(item => `- ${item}`), '', '“无文档 JSX”不等于完全没有文字文档；“共享注入”需根据 registry 的分类与运行时条件确认，不能按每个页面都展示计算。条件分支和参数循环仅证明源码具有展示路径；隐藏、禁用、异步等状态需要实际操作。', '', '## 无案例 JSX 证据', '', missing.map(record => record.name).join('、') || '无。', '', '## 无文档页 JSX 证据', '', noDocs.map(record => record.name).join('、') || '无。', '', '## 逐组件清单', '', '| 组件（用途） | 源码 | 文档页可达候选 | 案例页可达候选 | 有独立意义的变体缺口（静态） |', '| --- | --- | --- | --- | --- |'];
const representative = (name, prop) => {
  const axis = records.find(record => record.name === name)?.variants.find(axis => axis.prop === prop);
  const seen = [...new Set(Object.values(axis?.coverage ?? {}).flatMap(item => item.literalOrDeclaredDefault))];
  return `${name}.${prop}：已见 ${seen.join(' / ') || '无'}；缺少 ${(axis?.options ?? []).filter(value => !seen.includes(value)).join(' / ') || '无'}。`;
};
const headingIndex = lines.indexOf('## 逐组件清单');
lines.splice(headingIndex, 0, '## 代表项复核', '', ...[['DebitCard','variant'], ['IconButton','shape'], ['Button','effect'], ['IconButton','effect'], ['TabsContent','transition'], ['Drawer','transition']].map(([name, prop]) => '- ' + representative(name, prop)), '- TabsContent 原生滑动由 panels 属性触发，不存在 transition=scroll；须另核对 panels 调用及实际拖动。', '- IconButton 的 send effect 与案例 005 的专用 CSS 飞机发送动效是两条实现路径，不可相互当作覆盖证据。', '- 色彩、大小与 locale 等支持配置的完整缺口保留于 JSON；下表只列有独立意义的变体，不要求每个配置新增案例卡。', '');
for (const record of records) {
  const docRoutes = [...new Set(record.evidence.docs.map(item => item.route))];
  const caseRoutes = [...new Set(record.evidence.cases.map(item => item.route))];
  const gaps = record.variants.filter(axis => axis.priority === 'behavior-or-meaningful-style').flatMap(axis => { const observed = new Set(Object.values(axis.coverage).flatMap(item => item.literalOrDeclaredDefault)); const missing = axis.options.filter(value => !observed.has(value)); return missing.length ? [`${axis.prop}: ${missing.map(value => JSON.stringify(value)).join(', ')}`] : []; });
  lines.push(`| ${record.name}（${roleLabel[record.role]}） | ${record.file}:${record.line} | ${cell(docRoutes.join(', ') || (record.documentation === 'composed-jsx' ? '父组件内部组合展示，见 JSON' : '无 JSX 证据'))} | ${cell(caseRoutes.join(', ') || (record.evidence.injected.length ? '共享布局注入，见 JSON' : record.cases === 'composed-jsx' ? '父组件内部组合展示，见 JSON' : '无 JSX 证据'))} | ${cell(record.role === 'user-facing-component' ? (gaps.join('; ') || '未发现重要变体的字面量缺口；不代表状态全验收') : '辅助/组合能力，不要求独立业务卡；属性明细见 JSON')} |`);
}
lines.push('', '## 完整证据', '', '详见同目录 `component-coverage-audit.json`：每个组件包含导出位置、逐处 JSX 行号、props 表达式、有限联合值、明确字面量/默认值、推导候选、动态未决与未分配页面的 JSX。', '', '## 建议验收顺序', '', '1. 人工确认无案例/无文档项是可独立使用的组件，还是依赖父组件组合展示的子组件。', '2. 补齐有限属性轴的字面量缺口；优先 effect、variant、transition、state/status，避免重建冗长配色矩阵。', '3. 依据业务重要性测试有效/无效输入、加载、错误、空态、禁用、键盘焦点及中英文；每项记录真实操作证据。', '4. 对共享注入组件按 registry 官方分类验证页面可见性，不将仅源码可达当作已上屏。', '');
fs.writeFileSync('docs/component-coverage-audit.md', lines.join('\n'));
console.log(JSON.stringify(summary, null, 2));
