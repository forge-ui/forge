#!/usr/bin/env node
// Builds the self-contained line-drawing atlas (public/design/forge-design-atlas.html)
// from docs/design/atlas: sheet data, drawing kit, per-sheet drawings and styles.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const here = join(root, "docs/design/atlas");
const out = join(root, "public/design/forge-design-atlas.html");

const data = JSON.parse(readFileSync(join(here, "sheets.json"), "utf8"));
const index = JSON.parse(readFileSync(join(here, "components.json"), "utf8"));
const kit = readFileSync(join(here, "drawing-kit.js"), "utf8");
const draw = readFileSync(join(here, "draw-sheets.js"), "utf8");
const css = readFileSync(join(here, "drawing.css"), "utf8");

const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const sheets = data.sheets;
const total = String(sheets.length).padStart(2, "0");
const byId = new Map(sheets.map((s) => [s.id, s]));

const sections = sheets.map((s, i) => {
  const n = String(i + 1).padStart(2, "0");
  const outdated = s.status === "outdated";
  const figs = s.vars.slice(0, 6).map((v) => `<div><span class="lbl">${esc(v[0])} · ${esc(v[1])}</span><div class="v">${esc(v[2])}</div></div>`).join("");
  const rules = s.rules.map((r) => `<li>${esc(r)}</li>`).join("");
  const refs = s.sources.map(([path, why]) => `<li><code>${esc(path)}</code>：${esc(why)}</li>`).join("");
  const records = (s.records ?? []).map((r) => `<li>${esc(r)}</li>`).join("");
  const table = s.vars.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("");
  return `<section id="${esc(s.id)}" class="subject${outdated ? " outdated" : ""}"><header class="tb"><div class="big"><span class="lbl">FORGE DESIGN REFERENCE · ${n}</span><h2>${esc(s.name)}</h2><p>${esc(s.scope)}</p></div><div><span class="lbl">DWG NO.</span><div class="v">FG-${esc(s.id.toUpperCase())}-001</div></div><div><span class="lbl">REV / STATUS</span><div class="v">${data.version} · ${outdated ? "待重画" : "规范提案"}</div></div><div><span class="lbl">SHEETS</span><div class="v">1 / 本主题</div></div><div><span class="lbl">UNITS</span><div class="v">CSS px @ 1×</div></div><div><span class="lbl">SCALE</span><div class="v">${esc(s.scale)}</div></div><div><span class="lbl">SOURCE</span><div class="v">Core / 文档 / 布局提案</div></div><div class="notes"><div><strong>NOTES · 通用读图说明</strong><ol><li>不从画面量尺寸，以变量表为准；示意比例不构成标准值。</li><li>图内仅绘制结构槽位；HUG 随内容，FLEX 占剩余空间，FILL 填满父容器。</li><li>尺寸代码在每张图内独立编号；outline 不计入盒子尺寸。</li></ol></div><div><strong>适用与证据</strong><ol start="4"><li>实线为结构，虚线为槽位，点划线为参考或外包络。</li><li>表内区分源码现状、推导与推荐；[TBD] 为待决策。</li><li>黑白图用于结构审阅；配色依照语义 Token，不能从灰度推断实际颜色。</li></ol></div></div><div class="figs">${figs}</div></header>${s.statusNote ? `<p class="status-note">${esc(s.statusNote)}</p>` : ""}<div class="scroll" tabindex="0" aria-label="${esc(s.name)}图纸，可横向滚动"><svg id="sheet-${esc(s.id)}" viewBox="0 0 1700 1060" role="img" aria-label="${esc(s.name)}：结构、尺寸标注、细节和变量表"><title>${esc(s.name)}设计规范图</title><desc>${esc(s.scope)}。精确尺寸和公式亦可在下方文字表格读取。</desc></svg></div><div class="foot"><span>${data.date} | FORGE DESIGN REFERENCE</span><span>${esc(s.name)} · ${n} / ${total}</span></div><div class="reading"><div><h3>使用规则与边界</h3><ol>${rules}</ol><h3>待决策</h3><p>${esc(s.tbd)}</p></div><div><h3>源码依据</h3><ul>${refs}</ul></div></div><details><summary>展开可检索的变量表</summary><table><thead><tr><th>代码</th><th>变量</th><th>值 / 公式</th></tr></thead><tbody>${table}</tbody></table></details>${records ? `<details><summary>验证记录（core ${esc(data.coreBaseline)} 基线）</summary><p class="evidence">${esc(s.evidence)}</p><ul class="records">${records}</ul></details>` : ""}<a class="back" href="#top">返回目录 ↑</a></section>`;
}).join("");

const nav = sheets.map((s, i) => `<a href="#${esc(s.id)}"${s.status === "outdated" ? ' class="outdated"' : ""}><span>${String(i + 1).padStart(2, "0")}</span>${esc(s.name)}</a>`).join("");

const componentRows = index.components
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => {
    const links = c.sheets.filter((id) => byId.has(id)).map((id) => `<a href="#${esc(id)}">${esc(byId.get(id).name)}</a>`).join(" · ");
    return `<tr><th scope="row"><code>${esc(c.name)}</code></th><td>${links}</td><td>${c.publicExport ? "公开" : "0.10 起不再公开导出"}</td></tr>`;
  })
  .join("");
const excludedRows = index.excluded.map((c) => `<tr><th scope="row"><code>${esc(c.name)}</code></th><td>${esc(c.reason)}</td></tr>`).join("");
const outdated = sheets.filter((s) => s.status === "outdated").map((s) => `<a href="#${esc(s.id)}">${esc(s.name)}</a>`).join("、");

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Forge 设计规范线稿图集 · ${data.version}</title><meta name="description" content="Forge 组件与页面的结构尺寸线稿：${sheets.length} 张黑白标注图，含变量表、使用规则与待决策。"><style>${css}</style></head><body><main class="wrap" id="top"><header class="intro"><span class="eyebrow">FORGE / DESIGN SPECIFICATION / ${data.version}</span><h1>把界面，定义到结构与尺度。</h1><p>组件与页面设计规范 · ${sheets.length} 张结构线稿 · ${data.date}</p><div class="status">规范提案 ${data.version} · 适用 core ${data.coreCurrent} · 组件图基于 core ${esc(data.coreBaseline)} 绘制，0.10 起有变化的已在图内标注</div><nav aria-label="规范目录">${nav}</nav><div class="overview"><div><h3>01 · 基础约定（core ${data.coreCurrent}）</h3><p>正文字体 Inter，字距 0；主文字 #1F1F1F（fg-black-500），次要文字 #737373（fg-grey-700），边框 #E5E5E5（fg-grey-200），浅底 #F5F5F5（fg-grey-100）；侧栏未选中项保留浅灰 #868686。14px 及以下强调用 medium，选中态用 semibold。颜色一律用语义 Token，不写死色值。</p></div><div><h3>02 · 组件契约</h3><p>按组件家族逐张标注槽位、尺寸、变体、状态与使用边界；尺寸取自源码，派生高度保留公式，未定义值保留 [TBD]。</p></div><div><h3>03 · 页面组合</h3><p>列表、表单、设置与详情分别定义区域顺序与间距归属；推荐值与 forge-skill 页面规范一致，是设计起点而非 Token。</p></div></div><p class="notice">阅读顺序：结构图 → 变量表 → 使用规则 → 待决策。源码现状不等于已验收的统一标准；差异保留适用范围。${outdated ? `以下图对应组件已重构，待重画：${outdated}。` : ""}Forge Agent 组件（0.8 起新增）尚未纳入本图集。</p><details class="component-index"><summary>按组件查图（${index.components.length} 个视觉组件）</summary><table><thead><tr><th>组件</th><th>基础图／补充图</th><th>导出</th></tr></thead><tbody>${componentRows}</tbody></table></details><details class="component-index"><summary>另有 ${index.excluded.length} 个导出不属于视觉组件</summary><table><thead><tr><th>导出</th><th>理由</th></tr></thead><tbody>${excludedRows}</tbody></table></details></header>${sections}<footer class="end">源数据与构建脚本：forge 仓库 docs/design/atlas 与 scripts/build-design-atlas.mjs。文字规范见 skills/forge-skill/references/page-recommended-standard.md。</footer></main><script>${kit}\nconst SHEETS=${JSON.stringify(sheets)};\n${draw}</script></body></html>`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`${out} · ${sheets.length} sheets · ${(html.length / 1024).toFixed(0)} KB`);
