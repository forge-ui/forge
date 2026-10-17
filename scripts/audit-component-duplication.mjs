import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const coverage = JSON.parse(fs.readFileSync('docs/component-coverage-audit.json', 'utf8'));
const props = JSON.parse(fs.readFileSync('docs/documentation-props-audit.json', 'utf8')).records;
const catalog = JSON.parse(fs.readFileSync('src/app/prototype/component-fusion/_catalog-data.json', 'utf8')).items.filter(x => x.mode !== 'defer');
const names = new Set(coverage.components.map(c => c.name));
const guides = Object.fromEntries([...names].map(n => [n, []]));
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : e.name.endsWith('.tsx') ? [path.join(dir,e.name)] : []);
// A named component guide is different from using that component in another guide.
for (const file of [...walk('src/app/components').filter(f => /\/page\.tsx$/.test(f)), 'src/app/_components/animated-widget-demos.tsx']) {
  const source = ts.createSourceFile(file,fs.readFileSync(file,'utf8'),99,true,4);
  function visit(n) {
    if (ts.isJsxElement(n) && ['Section','BareSection','SubSection'].includes(n.openingElement.tagName.getText(source))) {
      const title = n.openingElement.attributes.properties.find(p => p.name?.getText(source)==='title')?.initializer;
      if (title && ts.isStringLiteral(title) && names.has(title.text)) guides[title.text].push({file,line:source.getLineAndCharacterOfPosition(n.getStart()).line+1});
    }
    ts.forEachChild(n,visit);
  } visit(source);
}
const changes = {
  ChatInputBar: '已合并：智能体页改为链接，消息输入栏保留唯一主说明；回答组合仍保留。',
  ButtonGroup: '已合并：页签中的重复介绍、颜色、形状、代码和 API 移至按钮与链接；保留原锚点链接。',
  Breadcrumbs: '已合并：工具栏中的重复说明移至页面标题；保留工具栏业务组合。',
  FileCard: '已合并：卡片中的重复说明移至文件；上传、成功、失败示例集中展示。',
  OtpInput: '已合并：示例和参数位于同一节，移除末尾重复标题。',
  LiquidTabs: '已合并：示例和参数位于同一节，移除末尾重复标题。',
  AddMember: '已合并：示例和参数位于同一节，移除末尾重复标题。',
};
for (const n of ['ThinkingTrace','StreamingAnswer','ApprovalCard','AgentTaskRows','AgentDiffTable','AgentCodeBlock','InsightCards','CommandSearch','AgentFlowchart']) changes[n]='已合并：简表说明并入完整 API，保留一张参数表及原有示例。';
const widgetOwners={OtpInput:'input-field',CalendarCard:'calendar',LiquidTabs:'tab',AddMember:'agent',Accordion:'grid',Drawer:'modal',Modal:'modal',TabsContent:'tab',TooltipGroup:'tooltip',ToastProvider:'modal'};
const family = file => file==='src/app/_components/animated-widget-demos.tsx' ? undefined : file.match(/src\/app\/components\/([^/]+)\/page\.tsx$/)?.[1];
const records=coverage.components.map(c=>{
 const p=props.find(x=>x.name===c.name);
 const references=[...new Set([...(p?.rows??[]),...(p?.generatedReference??[])].map(x=>family(x.file)).filter(Boolean))];
 const owners=[...new Set([...guides[c.name].map(x=>family(x.file)).filter(Boolean),...references,...(widgetOwners[c.name]?[widgetOwners[c.name]]:[])])];
 const reuseRoutes=[...new Set(c.evidence.docs.map(x=>x.route))].sort();
 const primaryCases=catalog.filter(x=>x.target[0]===c.name).map(x=>({id:x.id,name:x.name}));
 const repeatedGuides=guides[c.name].length>1;
 const disposition=changes[c.name] ?? (repeatedGuides ? '需核对：存在多个同名说明，见来源。' : owners.length>1 ? '需核对：多个参数归属页面，见来源。' : c.role!=='user-facing-component' ? '保留：组合子组件或辅助能力随父组件说明，无需独立案例卡。' : owners.length ? '保留：单一主说明；多处 JSX 为组合或变体使用，未检出第二份同名说明。' : '未发现重复主说明；尚无明确主说明归属，属于文档覆盖待补项。');
 return {name:c.name,role:c.role,source:`${c.file}:${c.line}`,owners,reuseRoutes,namedGuides:guides[c.name],primaryCases,disposition,needsReview:!changes[c.name]&&(repeatedGuides||owners.length>1)};
});
const summary={components:records.length,consolidatedComponents:records.filter(x=>changes[x.name]).length,remainingDuplicateCandidates:records.filter(x=>x.needsReview).length,withoutExplicitOwner:records.filter(x=>!x.owners.length).length};
const report={summary,records};
fs.writeFileSync('docs/component-duplication-audit.json',JSON.stringify(report,null,2)+'\n');
const role={'user-facing-component':'组件','public-composition-subcomponent':'组合子组件','public-render-helper':'渲染辅助','context-or-composition-helper':'上下文辅助'};
let md=`# 组件重复检查与融合统计\n\n以 core 公共导出的 ${summary.components} 个 React 组件为统计范围，每个组件占一行。已处理 ${summary.consolidatedComponents} 个组件的重复展示或说明（含本轮之前已处理的 ChatInputBar）。剩余需核对的重复候选 ${summary.remainingDuplicateCandidates} 个；${summary.withoutExplicitOwner} 个未被命名标题或参数表扫描识别出主说明归属，须结合父组件说明核对，不能误记为“文档完整”。\n\n## 判断口径\n\n- 同一组件出现多次，不等于重复组件：颜色、大小、受控状态和业务组合保留。\n- 相同组件的基础展示、代码和参数在多个分类重复铺开时，集中到一个主说明，原位置保留链接。\n- 同名组件在示例和追加 API 区各占一节时，合成一节；简表与完整表重叠时，合成一张表。\n- “主说明”来自实际 Section 标题与 API 归属；“使用页面”来自 TypeScript JSX 调用图，只表示静态可达，不能当作重复页面数量或浏览器验收。\n- 交互清单只列该组件作为首个目标的条目，其他目标视为组合依赖；F03 与 178 共用一个列表操作台，沿用既有别名。99 条迁移记录不等于新增 99 个导出组件。\n- 此表检查文档组织与重复归属，不能据此认定全部参数、变体或动效已通过逐项运行验收。参数缺项另见 documentation-props-audit.md。\n\n## 全量统计\n\n| 组件 | 类型 | 主说明分类 | 使用页面数 | 主要交互条目 | 处理结论 |\n|---|---|---|---:|---|---|\n`;
for(const r of records)md+=`| ${r.name} | ${role[r.role]??r.role} | ${r.owners.map(x=>`[${x}](/components/${x})`).join('、')||'未明确'} | ${r.reuseRoutes.length} | ${r.primaryCases.map(x=>x.id).join('、')||'—'} | ${r.disposition} |\n`;
md+='\n## 来源与复查\n\n逐项源码位置、同名说明位置、页面路径和交互名称见同名 JSON 文件。复查命令：\n\n```sh\nnode scripts/audit-component-coverage.mjs\nnode scripts/audit-documentation-props.mjs\nnode scripts/audit-component-duplication.mjs\n```\n';
fs.writeFileSync('docs/component-duplication-audit.md',md);console.log(summary);for(const r of records.filter(x=>x.needsReview)) console.log(r.name,r.owners,r.namedGuides);
