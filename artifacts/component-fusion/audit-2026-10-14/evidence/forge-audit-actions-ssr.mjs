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



const ids=examples.actionIds;let count=0;for(const id of ids)for(const locale of ['zh','en'])for(const color of ['blue','purple','black']){const html=renderToString(React.createElement(examples.ActionsExamples,{id,locale,color,motion:'none'}));assert.ok(html.length>100);assert.doesNotMatch(html,/NaN|undefined%/);count++;}console.log('ACTION_SSR_VARIANTS',count);
