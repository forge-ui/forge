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
const {createRoot}=await import('react-dom/client');const app=createRoot(document.getElementById('root'));const render=async(locale)=>React.act(async()=>app.render(React.createElement(examples.ActionsExamples,{id:'054',locale,color:'blue',motion:'none'})));
await render('zh');await React.act(async()=>[...document.querySelectorAll('button')].find(x=>x.textContent==='关注').click());await React.act(async()=>[...document.querySelectorAll('button')].find(x=>x.textContent==='关注').click());console.log('ZH', [...document.querySelectorAll('button')].map(x=>[x.textContent,x.getAttribute('aria-pressed')]));await render('en');console.log('EN',[...document.querySelectorAll('button')].map(x=>[x.textContent,x.getAttribute('aria-pressed')]));await React.act(async()=>app.unmount());dom.window.close();
