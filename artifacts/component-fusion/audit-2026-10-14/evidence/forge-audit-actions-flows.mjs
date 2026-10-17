import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { test, after } from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";

const root = "/Users/hesong/Documents/gihub_space/forge";
const require = createRequire(root + "/package.json");
const { build } = require("./node_modules/.pnpm/node_modules/esbuild/lib/main.js");
const temp = "/tmp/forge-audit-actions-runtime";
mkdirSync(temp, { recursive: true });
await build({
  absWorkingDir: root,
  stdin: { contents: `export * from './src/app/components/_fusion/registry';
    export { ActionsExamples } from './src/app/components/_fusion/actions';
    export { FormsNavigationExamples } from './src/app/components/_fusion/forms-navigation';
    export { AgentChartExamples } from './src/app/components/_fusion/agent-charts';
    export { CompositionExamples } from './src/app/components/_fusion/compositions';
    export { MigrationPreview } from './src/app/components/_migration-previews';
    export { SidebarFusionPreview } from './src/app/prototype/component-fusion/_sidebar-preview';`, resolveDir: root, loader: "tsx" },
  outfile: resolve(temp, "examples.mjs"), bundle: true, packages: "external", platform: "node", format: "esm", jsx: "automatic", logLevel: "silent",
  plugins: [{ name: "node-next-entry", setup(plugin) {
    plugin.onResolve({ filter: /^next\/image$/ }, () => ({ path: "next-image", namespace: "next-default" }));
    plugin.onLoad({ filter: /.*/, namespace: "next-default" }, () => ({ contents: 'import entry from "next/image.js"; export default entry.default ?? entry;', loader: "js", resolveDir: root }));
    plugin.onResolve({ filter: /^next\// }, ({ path }) => ({ path: require.resolve(path), external: true })); } }],
  alias: { "@forge-ui-official/core": resolve(root, "core/src/index.ts"), "@forge-ui-official/core/icons": resolve(root, "core/src/icons.tsx") },
});
const examples = await import(pathToFileURL(resolve(temp, "examples.mjs")));


const {JSDOM}=require('./core/node_modules/jsdom');
const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost',pretendToBeVisual:true});dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
for(const name of ['window','document','navigator','HTMLElement','Element','SVGElement'])Object.defineProperty(globalThis,name,{configurable:true,value:dom.window[name]});globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.getComputedStyle=dom.window.getComputedStyle;globalThis.ResizeObserver=class{observe(){}disconnect(){}};
const {createRoot}=await import('react-dom/client');const app=createRoot(document.getElementById('root'));
const render=async(id)=>React.act(async()=>app.render(React.createElement(examples.ActionsExamples,{key:id,id,locale:'zh',color:'purple',motion:'none'})));
const button=(label)=>[...document.querySelectorAll('button')].find(x=>x.textContent.trim()===label||x.getAttribute('aria-label')===label);const click=async(label)=>{assert.ok(button(label),label);await React.act(async()=>button(label).click());};const wait=async(ms)=>React.act(async()=>new Promise(r=>setTimeout(r,ms)));const results=[];
for(const id of ['001','004','005','081']){await render(id);await React.act(async()=>document.querySelector('button').click());await click('取消');await wait(150);assert.match(document.querySelector('[role=status]').textContent,/准备就绪|按钮背后/);results.push(id+':cancel-clean');}
for(const id of ['006','012','022']){await render(id);const node=document.querySelector('button');await React.act(async()=>node.click());assert.equal(node.getAttribute('aria-pressed'),'true');await React.act(async()=>node.click());assert.equal(node.getAttribute('aria-pressed'),'false');results.push(id+':toggle');}
await render('018');for(let i=0;i<12;i++)await click('增加数量');assert.equal(document.querySelector('output').textContent,'10');assert.equal(button('增加数量').disabled,true);for(let i=0;i<12;i++)await click('减少数量');assert.equal(document.querySelector('output').textContent,'1');results.push('018:bounds');
await render('008');Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}});await click('复制命令');assert.match(document.querySelector('.fusion-action-hint').textContent,/失败/);results.push('008:clipboard-error');
await render('066');await click('使用 Apple 继续');await click('使用其他方式');await wait(350);assert.equal(document.querySelector('.fusion-social-panel').getAttribute('data-picked'),'false');assert.equal(document.activeElement.getAttribute('data-provider'),'Apple');results.push('066:pending-cancel-focus');
await render('071');const deletion=button('删除邮件');await React.act(async()=>deletion.focus());await React.act(async()=>deletion.click());console.log('071_AFTER_DELETE_ACTIVE_ELEMENT',document.activeElement.tagName);await click('撤销');assert.equal(document.querySelectorAll('.forge-swipe-row').length,3);results.push('071:delete-undo');
await render('083');await click('取消');await wait(1700);assert.match(document.body.textContent,/已取消/);assert.ok(button('重新运行'));results.push('083:queue-cancel');
await render('087');for(let i=0;i<3;i++)await click('下一阶段');assert.ok(button('重新演示'));assert.equal(document.querySelectorAll('[aria-current=step]').length,1);await click('重新演示');results.push('087:steps-reset');
await render('089');await click('项目 · /projects');await wait(60);assert.match(document.querySelector('code').textContent,/\/projects/);await click('重置示例');assert.match(document.querySelector('code').textContent,/\/projcts/);results.push('089:correction-reset');
await render('090');await click('立即重试');await wait(1250);await click('立即重试');await wait(1250);assert.ok(button('重新演示'));results.push('090:failure-retry-success');
console.log(JSON.stringify(results));await React.act(async()=>app.unmount());dom.window.close();
