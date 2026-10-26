import { readFile, writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const repository = resolve(directory, "../..");
// The main repository owns its reviewed snapshots. Importing the sibling lab is
// explicit so a normal rebuild cannot overwrite later fixes or require a second checkout.
const lab = process.argv[2] ? resolve(repository, process.argv[2]) : null;
const output = join(repository, "public/prototype/component-fusion");
const prefix = "/prototype/component-fusion";
const catalogSource = lab
  ? JSON.parse(await readFile(join(lab, "public/catalog.json"), "utf8"))
  : JSON.parse(await readFile(join(repository, "src/app/prototype/component-fusion/_catalog-data.json"), "utf8"));
const catalog = Array.isArray(catalogSource) ? catalogSource : catalogSource.items;
const ids = catalog.filter(item => item.mode !== "exclude" && item.id !== "186").map(item => item.id);
if (ids.length !== 122 || new Set(ids).size !== 122) throw new Error("Expected the reviewed 122 prototype IDs.");
await mkdir(join(output, "components"), { recursive: true });
await mkdir(join(output, "shared"), { recursive: true });

const documents = new Map();
const shared = new Map();
if (lab) {
  for (const id of ids.filter(id => /^\d{3}$/.test(id))) {
    const html = await readFile(join(lab, `public/components/${id}.html`), "utf8");
    documents.set(id, html);
    for (const match of html.matchAll(/<(script|style)>([\s\S]*?)<\/\1>/g)) {
      const [tag, kind, body] = match;
      if (body.length < 500) continue;
      const key = createHash("sha256").update(body).digest("hex").slice(0, 12);
      const current = shared.get(key);
      shared.set(key, { tag, kind, body, count: (current?.count || 0) + 1 });
    }
  }
  for (const [hash, entry] of shared) {
    if (entry.count < 2) { shared.delete(hash); continue; }
    await writeFile(join(output, `shared/${hash}.${entry.kind === "script" ? "js" : "css"}`), entry.body);
  }
  const rewrite = text => text.replace(/(["'(])\/(fonts\.css|forge-tokens\.css|i18n\.js|typography-runtime\.js|fonts\/[^"')]+)/g, `$1${prefix}/$2`);
  for (const [id, document] of documents) {
    let html = document.replace("font-src 'self'", "font-src 'self' data:");
    for (const [hash, entry] of shared) {
      const replacement = entry.kind === "script" ? `<script src="${prefix}/shared/${hash}.js"></script>` : `<link rel="stylesheet" href="${prefix}/shared/${hash}.css">`;
      html = html.replace(entry.tag, replacement);
    }
    html = rewrite(html).replace("</head>", `<link rel="stylesheet" href="${prefix}/embed.css"><script src="${prefix}/embed-runtime.js"></script></head>`);
    await writeFile(join(output, `components/${id}.html`), html.replace(/[\t ]+$/gm, "").trimEnd() + "\n");
  }
  for (const name of ["forge-tokens.css", "i18n.js", "typography-runtime.js"]) await copyFile(join(lab, `public/${name}`), join(output, name));
  // Sandboxed frames have an opaque origin. Inline font data avoids font CORS and
  // preserves the same licensed Forge fonts without a new Next response rule.
  let fonts = await readFile(join(lab, "public/fonts.css"), "utf8");
  for (const name of ["manrope", "plus-jakarta-sans"]) {
    const bytes = await readFile(join(lab, `public/fonts/${name}.woff2`));
    fonts = fonts.replace(`/fonts/${name}.woff2`, `data:font/woff2;base64,${bytes.toString("base64")}`);
    await copyFile(join(lab, `licenses/${name}-LICENSE.txt`), join(output, `${name}-LICENSE.txt`));
  }
  await writeFile(join(output, "fonts.css"), fonts);
} else {
  // Fail before rebuilding React examples if the checked-in HTML/assets are missing.
  for (const name of [
    ...ids.filter(id => /^\d{3}$/.test(id)).map(id => `components/${id}.html`),
    "forge-tokens.css", "i18n.js", "typography-runtime.js", "fonts.css",
    "manrope-LICENSE.txt", "plus-jakarta-sans-LICENSE.txt",
  ]) await readFile(join(output, name));
}
for (const name of ["embed.css", "embed-runtime.js", "THIRD_PARTY_NOTICES.md"]) await copyFile(join(directory, name), join(output, name));

const { build } = await import(pathToFileURL(join(repository, "node_modules/.pnpm/node_modules/esbuild/lib/main.js")).href);
await build({
  entryPoints: [join(directory, "feature-entry.tsx")], bundle: true,
  outfile: join(output, "features.js"), format: "iife", jsx: "automatic", minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  banner: { js: "/* eslint-disable @typescript-eslint/no-this-alias -- Generated React and Motion dependency bundle. */" },
  legalComments: "eof", target: "es2020",
});
const featureNames = {
  F01: "Attachment queue", F02: "Tool run card", F03: "Bulk selection actions",
  F04: "Change review", F05: "Agent collaboration", F06: "Search recovery",
};
for (const id of ids.filter(id => /^F0[1-6]$/.test(id))) {
  await writeFile(join(output, `components/${id}.html`), `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' 'self'; script-src 'unsafe-inline' 'self'; img-src data: https:; font-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'"><title>${featureNames[id]}</title><link rel="stylesheet" href="${prefix}/fonts.css"><link rel="stylesheet" href="${prefix}/forge-tokens.css"><link rel="stylesheet" href="${prefix}/features.css"><link rel="stylesheet" href="${prefix}/embed.css"><script src="${prefix}/embed-runtime.js"></script><script src="${prefix}/i18n.js"></script><script src="${prefix}/typography-runtime.js"></script></head><body><div id="root"></div><script src="${prefix}/features.js"></script></body></html>`);
}
const manifest = ids.map(id => {
  const original = catalog.find(item => item.id === id);
  return { id, name: original.name, english: original?.english ?? featureNames[id], src: `${prefix}/components/${id}.html`, kind: id.startsWith("F") ? "react" : "html" };
});
await writeFile(join(directory, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
await writeFile(join(output, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const count = (await readdir(join(output, "components"))).length;
console.log(lab
  ? `Imported ${count} self-contained prototypes (${shared.size} deduplicated shared runtimes/styles).`
  : `Rebuilt React examples and validated ${count} local prototypes without an external lab checkout.`);
