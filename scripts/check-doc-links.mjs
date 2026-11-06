import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function brokenLinks(root, files) {
  const failures = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), "utf8").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]+`/g, "");
    for (const match of text.matchAll(/\]\(([^\s)]+)\)/g)) {
      const href = match[1];
      if (/^(?:[a-z]+:|#|\/)/i.test(href)) continue;
      const target = path.resolve(root, path.dirname(file), decodeURIComponent(href.split("#")[0]));
      if (!target.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(target)) failures.push({ file, href });
    }
  }
  return failures;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const collect = directory => fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? collect(path.join(directory, entry.name)) : entry.name.endsWith(".md") ? [path.join(directory, entry.name)] : []);
  const files = ["README.md", "core/README.md", ...collect("docs"), ...collect("skills/forge-skill"), ...collect("content/guides")];
  const failures = brokenLinks(root, files);
  if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exitCode = 1; }
  else console.log(files.length + " Markdown documents: local link targets verified; remote links and browser acceptance not checked");
}
