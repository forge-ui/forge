import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  collectPublicApi,
  collectWildcardApi,
  collectWildcardExportEntries,
} from "./package-contract.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(scriptDir, "..");
const snapshotPath = path.join(scriptDir, "package-api-snapshot.mjs");
const pkg = JSON.parse(fs.readFileSync(path.join(coreRoot, "package.json"), "utf8"));
const [pack] = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--ignore-scripts", "--json"], {
    cwd: coreRoot,
    encoding: "utf8",
  }),
);
const packedPaths = new Set(pack.files.map((file) => file.path));
const wildcardExports = collectWildcardExportEntries(pkg.exports, packedPaths);
if (wildcardExports.errors.length > 0) {
  throw new Error(
    `Cannot update API snapshot:\n${wildcardExports.errors.map((error) => `- ${error}`).join("\n")}`,
  );
}
const publicApi = collectPublicApi(path.join(coreRoot, "dist/index.d.ts"));
const wildcardApi = collectWildcardApi(coreRoot, wildcardExports.entries);
const contents = [
  "// Deliberate compatibility snapshot of public export kinds and declaration signatures.",
  `export const expectedPublicApi = ${JSON.stringify(publicApi, null, 2)};`,
  "",
  `export const expectedWildcardApi = ${JSON.stringify(wildcardApi, null, 2)};`,
  "",
].join("\n");

fs.writeFileSync(snapshotPath, contents);
console.log(
  `Updated ${path.relative(coreRoot, snapshotPath)} with ${publicApi.length} root exports and ${wildcardApi.length} wildcard entries.`,
);
