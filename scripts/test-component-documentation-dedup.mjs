import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require=createRequire(import.meta.url);
const {build}=require('../node_modules/.pnpm/node_modules/esbuild/lib/main.js');
const temp=path.resolve('core/tmp/documentation-dedup-tests');fs.mkdirSync(temp,{recursive:true});
await build({stdin:{contents:`export { default as TabPage } from './src/app/components/tab/page';
export { default as AgentPage } from './src/app/components/agent/page';
export { AnimatedWidgetDemos } from './src/app/_components/animated-widget-demos';`,resolveDir:process.cwd(),loader:'tsx'},outfile:path.join(temp,'pages.mjs'),bundle:true,platform:'node',packages:'external',format:'esm',plugins:[{name:'next-node-extension',setup(b){b.onResolve({filter:/^next\/link$/},()=>({path:'next/link.js',external:true}));}}],jsx:'automatic'});
const pages=await import(pathToFileURL(path.join(temp,'pages.mjs')).href);
after(()=>fs.rmSync(temp,{recursive:true,force:true}));
test('duplicate tab guide is replaced with a working canonical destination',()=>{
 const html=renderToStaticMarkup(React.createElement(pages.TabPage));
 assert.match(html,/href="\/components\/button-link#buttongroup"/);
 assert.doesNotMatch(html,/<section[^>]*id="buttongroup"/);
 assert.match(html,/id="tabbar"/);
});
test('agent descriptions and complete API render as one table per component',()=>{
 const html=renderToStaticMarkup(React.createElement(pages.AgentPage));
 assert.equal((html.match(/>参数<\/th>/g)??[]).length,12);
 assert.match(html,/应用接收回答的状态/);
 assert.match(html,/ChatInputBarSendContext|\/components\/chat-input-bar/);
});
for(const only of ['otp','tabs','members'])test(`${only} widget has one named guide with its API inside`,()=>{
 const html=renderToStaticMarkup(React.createElement(pages.AnimatedWidgetDemos,{only,motion:'none'}));
 assert.equal((html.match(/data-case-section=/g)??[]).length,1);
 assert.equal((html.match(/<table/g)??[]).length,1);
 assert.match(html,/参数说明/);
});
test('duplication table covers every public component exactly once',()=>{
 const inventory=JSON.parse(fs.readFileSync('docs/component-coverage-audit.json')).components;
 const report=JSON.parse(fs.readFileSync('docs/component-duplication-audit.json'));
 assert.deepEqual(report.records.map(x=>x.name).sort(),inventory.map(x=>x.name).sort());
 assert.equal(new Set(report.records.map(x=>x.name)).size,182);
 assert.equal(report.summary.remainingDuplicateCandidates,0);
});
