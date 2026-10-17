import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
const root = process.cwd();
const sources = {};
function visit(dir) {
  for (const entry of readdirSync(dir, {withFileTypes:true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (/\.(tsx?|css)$/.test(entry.name)) sources[relative(root, path)] = readFileSync(path, 'utf8');
  }
}
visit(join(root,'src/app/components/_fusion'));
for (const file of readdirSync(join(root,'src/app/components')).filter(name=>name.startsWith('_migration-')&&name.endsWith('.tsx'))) {
 const path = `src/app/components/${file}`;sources[path]=readFileSync(path,'utf8');
}
for (const file of ['motion-demos.tsx','animated-widget-demos.tsx']) {
 const path=`src/app/_components/${file}`;sources[path]=readFileSync(path,'utf8');
}
for (const file of ['page.tsx', '_generation-demo.tsx', '_sources.ts']) {
 const path=`src/app/cases/chat-input-bar/${file}`;sources[path]=readFileSync(path,'utf8');
}
const sidebar='src/app/prototype/component-fusion/_sidebar-preview.tsx';sources[sidebar]=readFileSync(sidebar,'utf8');
writeFileSync(join(root,'src/app/components/_example-sources.json'),JSON.stringify(sources));
console.log(`Generated ${Object.keys(sources).length} example source files`);
