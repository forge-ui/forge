import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateDocuments } from "./llms-sources.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
execFileSync(process.execPath, [path.join(root, "scripts/gen-component-docs.mjs"), "--check"], { cwd: root, stdio: "inherit" });
const { outputs, fingerprint } = generateDocuments(root);
let drift = false;
for (const [name, content] of outputs) {
  const file = path.join(root, "public", name);
  if (check) {
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) {
      console.error("Out of date: public/" + name);
      drift = true;
    }
  } else fs.writeFileSync(file, content);
}
if (drift) process.exitCode = 1;
console.log((check ? "Checked " : "Generated ") + outputs.size + " local-source AI documents; " + fingerprint);
