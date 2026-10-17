import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const inventory = JSON.parse(fs.readFileSync('docs/public-api-comparison.json', 'utf8')).current.components;
const names = new Set(Object.keys(inventory));
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : /\.tsx?$/.test(entry.name) ? [path.join(directory, entry.name)] : []);
const files = walk('src/app/components').filter(f => !f.includes('/_fusion/') && !f.includes('/_migration-'));
const docs = Object.fromEntries([...names].map(n => [n, { rows: [], references: [], sections: [] }]));
const unresolved = [];
const explicit = {
  'table/HEADER_CELL_PROPS': ['TableCell'], 'table/TEXT_CELL_PROPS': ['CellText','CellMuted','CellTextSubtitle'],
  'table/IMAGETEXT_PROPS': ['CellImageText'], 'table/USERGROUP_PROPS': ['AvatarGroup'],
  'table/FILE_PROPS': ['CellFile'], 'table/NUMBER_PROPS': ['CellNumber'],
  'table/STATUS_PROPS': ['StatusBadge'], 'table/PROGRESS_PROPS': ['ProgressBadge'], 'table/STATUS_DOT_PROPS': ['CellStatusDot'],
  'table/PROGRESS_BAR_PROPS': ['CellProgressBar'], 'table/CODE_CELL_PROPS': ['CellCode'],
  'table/ACTIONS_PROPS': ['CellActions'], 'table/RATING_PROPS': ['CellRating'],
};
const literals = node => node && (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined;
function attr(element, name) {
  const opening = ts.isJsxElement(element) ? element.openingElement : element;
  const a = opening.attributes?.properties.find(a => ts.isJsxAttribute(a) && a.name.text === name);
  return a?.initializer && ts.isJsxExpression(a.initializer) ? a.initializer.expression : a?.initializer;
}
for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const vars = new Map();
  const line = n => source.getLineAndCharacterOfPosition(n.getStart()).line + 1;
  function declarations(n) { if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name)) vars.set(n.name.text, n.initializer); ts.forEachChild(n, declarations); }
  declarations(source);
  function rows(node, seen = new Set()) {
    if (!node || seen.has(node)) return [];
    seen = new Set(seen).add(node);
    if (ts.isIdentifier(node)) return rows(vars.get(node.text), seen);
    if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return rows(node.expression, seen);
    if (ts.isArrayLiteralExpression(node)) return node.elements.flatMap(e => rows(ts.isSpreadElement(e) ? e.expression : e, seen));
    if (ts.isObjectLiteralExpression(node)) {
      const values = Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p => [p.name.getText(source).replaceAll('"', '').replaceAll("'", ''), literals(p.initializer)]));
      return values.attr ? [{ ...values, file, line: line(node) }] : [];
    }
    return [];
  }
  function owners(node) {
    for (let p = node.parent; p; p = p.parent) if (ts.isJsxElement(p) && /^(Section|BareSection|SubSection)$/.test(p.openingElement.tagName.getText(source))) {
      const title = literals(attr(p, 'title'));
      const hits = title?.match(/\b[A-Z][A-Za-z0-9]+\b/g)?.filter(n=>names.has(n)) ?? [];
      if (hits.length) return hits;
    }
    return [];
  }
  function visit(node) {
    if (ts.isJsxElement(node) && /^(Section|BareSection|SubSection)$/.test(node.openingElement.tagName.getText(source))) {
      const title = literals(attr(node, 'title'));
      for (const name of title?.match(/\b[A-Z][A-Za-z0-9]+\b/g)?.filter(n => names.has(n)) ?? []) docs[name].sections.push({ file, line: line(node) });
    }
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tag = node.tagName.getText(source);
      if (tag === 'CompleteApiReference') {
        const name = literals(attr(node,'name'));
        if (docs[name]) { docs[name].references.push({ file, line: line(node) }); docs[name].rows.push(...rows(attr(node, 'descriptions'))); }
      }
      if (tag === 'ApiTable') {
        const found = rows(attr(node, 'rows'));
        for (const row of found) {
          const prefixed = row.attr.match(/^([A-Z][A-Za-z0-9]+)\.([a-zA-Z_$][\w$]*)$/);
          if (prefixed && docs[prefixed[1]]) docs[prefixed[1]].rows.push({ ...row, attr: prefixed[2] });
        }
        const expression = attr(node, 'rows');
        const family = file.split('/').at(-2);
        const owner = explicit[`${family}/${expression?.getText(source)}`] ?? (file.endsWith('/menu-sections/page.tsx') ? ['AppLayout'] : owners(node));
        if (!owner.length && !file.endsWith('_additional-component-api.tsx') && !found.every(r=>/^[A-Z][\w]+\./.test(r.attr))) unresolved.push({ file, line: line(node), props: found.map(r => r.attr) });
        for (const name of owner) docs[name].rows.push(...found.filter(r=>!r.attr.includes('.')));
      }
    }
    // Extra reference tables are declared as objects and rendered by a family dispatcher.
    if (file.endsWith('_additional-component-api.tsx') && ts.isObjectLiteralExpression(node)) {
      const properties = node.properties.filter(ts.isPropertyAssignment);
      const name = literals(properties.find(p => p.name.getText(source)==='title')?.initializer);
      if (docs[name]) {
        docs[name].rows.push(...rows(properties.find(p => p.name.getText(source)==='rows')?.initializer));
        docs[name].sections.push({ file, line: line(node) });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
const generated = JSON.parse(fs.readFileSync('src/app/components/_agent-api-data.json', 'utf8'));
const coverage = JSON.parse(fs.readFileSync('docs/component-coverage-audit.json', 'utf8'));
const records = Object.entries(inventory).map(([name, component]) => {
  const d = docs[name];
  const example = coverage.components.find(c => c.name === name);
  const owned = component.props.filter(p=>p.file.startsWith('core/src/'));
  const documented = new Set(d.rows.flatMap(row => row.attr.split(/\s*[/、,]\s*/).map(s=>s.trim()).filter(s=>/^[a-zA-Z_$][\w$]*$/.test(s))));
  const generatedNames = d.references.length ? new Set(generated[name]?.props.map(p=>p.name) ?? []) : new Set();
  const missing = owned.filter(p=>!documented.has(p.name) && !generatedNames.has(p.name));
  return { name, role: example?.role, exampleEvidence: { documentation: example?.documentation, cases: example?.cases }, file: component.file, customPropCount: owned.length, documentedNames: [...documented], generatedReference: d.references, sections: d.sections, missing: missing.map(p=>({name:p.name,type:p.type,optional:p.optional})), rows: d.rows, stale: [...documented].filter(n=>!component.props.some(p=>p.name===n)) };
});
const summary = { inspected: records.length, withMissing: records.filter(r=>r.missing.length).length, missingParameters: records.reduce((n,r)=>n+r.missing.length,0), withoutMappedReference: records.filter(r=>!r.rows.length && !r.generatedReference.length).map(r=>r.name), unresolvedTables: unresolved.length };
fs.writeFileSync('docs/documentation-props-audit.json', JSON.stringify({summary,records,unresolved},null,2)+'\n');
let md = '# 逐组件文档参数覆盖核查\n\n核对当前 core 根入口的实际组件参数与组件页面的 ApiTable、完整参数表及共享补充表。只统计定义在 core/src 的参数，排除 React 原生透传属性。斜杠合并的顶层参数分别计数，嵌套字段不冒充顶层参数。自动未关联的参数表单列，未关联不直接认定网站没有文档。完整参数表只证明名称和类型列出，不证明文字解释、示例和行为完整。\n\n';
md += `## 自动核对结果\n\n- 核查组件：${summary.inspected}。\n- 存在未覆盖参数候选的组件：${summary.withMissing}。\n- 未覆盖参数候选：${summary.missingParameters}。\n- 需要人工关联的参数表：${summary.unresolvedTables}。\n\n## 全量候选清单\n\n| 组件 | 自定义参数数 | 未覆盖数 | 未覆盖参数 |\n|---|---:|---:|---|\n`;
md += records.map(r=>`| ${r.name} | ${r.customPropCount} | ${r.missing.length} | ${r.missing.map(p=>p.name).join('、') || '—'} |`).join('\n');
md += '\n\n## 无法自动关联的表格\n\n' + unresolved.map(u=>`- ${u.file}:${u.line}：${u.props.join('、') || '无法静态解析'}`).join('\n') + '\n';
fs.writeFileSync('docs/documentation-props-audit.md',md);
console.log(JSON.stringify(summary,null,2));
