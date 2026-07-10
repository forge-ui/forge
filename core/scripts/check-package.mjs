import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { gzipSync } from "node:zlib";
import {
  collectPublicApi,
  collectWildcardApi,
  collectWildcardExportEntries,
} from "./package-contract.mjs";
import * as packageApiSnapshot from "./package-api-snapshot.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const packageJsonPath = path.join(root, "package.json");
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const { expectedPublicApi, expectedWildcardApi = [] } = packageApiSnapshot;
const [pack] = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--ignore-scripts", "--json"], {
    cwd: root,
    encoding: "utf8",
  }),
);

const limits = {
  packed: 520_000,
  unpacked: 2_150_000,
  entries: 360,
  sourceMaps: 1_150_000,
  normalJsRaw: 40_000,
  normalJsGzip: 20_000,
  inlinedRaw: 90_000,
  inlinedGzip: 20_000,
  mapDataRaw: 205_000,
  mapDataGzip: 75_000,
  stylesRaw: 15_000,
};

const expectedExports = {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.js",
  },
  "./components/ui/*": {
    types: "./dist/components/ui/*.d.ts",
    import: "./dist/components/ui/*.js",
  },
  "./components/layouts/*": {
    types: "./dist/components/layouts/*.d.ts",
    import: "./dist/components/layouts/*.js",
  },
  "./styles.css": "./dist/styles.css",
  "./package.json": "./package.json",
};
const expectedManifestFields = {
  main: "./dist/index.js",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  sideEffects: ["**/*.css"],
  peerDependencies: {
    next: ">=15",
    react: ">=19",
    "react-dom": ">=19",
    "solar-icon-set": "^2",
    tailwindcss: "^4",
  },
  peerDependenciesMeta: undefined,
};

const errors = [];
const packedPaths = new Set(pack.files.map((file) => file.path));

function checkLimit(label, actual, limit) {
  if (actual > limit) errors.push(`${label}: ${actual} B > ${limit} B`);
}

checkLimit("packed size", pack.size, limits.packed);
checkLimit("unpacked size", pack.unpackedSize, limits.unpacked);
if (pack.entryCount > limits.entries) {
  errors.push(`entry count: ${pack.entryCount} > ${limits.entries}`);
}
if (pack.entryCount !== pack.files.length) {
  errors.push(`entryCount (${pack.entryCount}) does not match files.length (${pack.files.length})`);
}

const allowedPathPattern = /^(?:README\.md|LICENSE(?:\.md)?|package\.json|dist\/(?:styles\.css|.+\.(?:js|js\.map|d\.ts)))$/;
for (const file of pack.files) {
  if (!allowedPathPattern.test(file.path)) {
    errors.push(`unexpected packed file: ${file.path}`);
  }
}

if (!isDeepStrictEqual(pkg.exports, expectedExports)) {
  errors.push("package exports changed; update the compatibility snapshot deliberately");
}
if (!isDeepStrictEqual(pkg.files, ["dist"])) {
  errors.push(`package files must remain ["dist"], received ${JSON.stringify(pkg.files)}`);
}
for (const [field, expected] of Object.entries(expectedManifestFields)) {
  if (!isDeepStrictEqual(pkg[field], expected)) {
    errors.push(
      `package ${field} changed: expected ${JSON.stringify(expected)}, received ${JSON.stringify(pkg[field])}`,
    );
  }
}

const actualPublicApi = collectPublicApi(path.join(root, "dist/index.d.ts"));
if (!isDeepStrictEqual(actualPublicApi, expectedPublicApi)) {
  const expectedSet = new Set(expectedPublicApi);
  const actualSet = new Set(actualPublicApi);
  const added = actualPublicApi.filter((entry) => !expectedSet.has(entry));
  const removed = expectedPublicApi.filter((entry) => !actualSet.has(entry));
  errors.push(
    `public API changed; added=${JSON.stringify(added)}, removed=${JSON.stringify(removed)}. Update package-api-snapshot.mjs deliberately`,
  );
}

function collectExportTargets(value, targets = []) {
  if (typeof value === "string") targets.push(value);
  else if (value && typeof value === "object") {
    for (const nested of Object.values(value)) collectExportTargets(nested, targets);
  }
  return targets;
}

for (const target of collectExportTargets(pkg.exports)) {
  if (!target.startsWith("./") || target.split("/").includes("..")) {
    errors.push(`unsafe export target: ${target}`);
    continue;
  }
  const packedTarget = target.slice(2);
  if (!target.includes("*") && !packedPaths.has(packedTarget)) {
    errors.push(`export target is missing from tarball: ${target}`);
  }
}

const wildcardExports = collectWildcardExportEntries(pkg.exports, packedPaths);
errors.push(...wildcardExports.errors);
const actualWildcardApi = collectWildcardApi(root, wildcardExports.entries);
if (!isDeepStrictEqual(actualWildcardApi, expectedWildcardApi)) {
  const expectedSet = new Set(expectedWildcardApi);
  const actualSet = new Set(actualWildcardApi);
  const added = actualWildcardApi.filter((entry) => !expectedSet.has(entry));
  const removed = expectedWildcardApi.filter((entry) => !actualSet.has(entry));
  errors.push(
    `wildcard declaration API changed; added=${JSON.stringify(added)}, removed=${JSON.stringify(removed)}. Update package-api-snapshot.mjs deliberately`,
  );
}

for (const requiredPath of [
  "dist/components/layouts/app-layout.js",
  "dist/components/layouts/app-layout.d.ts",
  "dist/components/layouts/sidebar-popovers.js",
  "dist/components/layouts/sidebar-popovers.d.ts",
  "dist/components/ui/page-header.js",
  "dist/components/ui/page-header.d.ts",
  "dist/internal/app-layout-sidebar.js",
  "dist/internal/app-layout-sidebar.d.ts",
  "dist/internal/page-header-variants.js",
  "dist/internal/page-header-variants.d.ts",
  "dist/internal/sidebar-popover-data.js",
  "dist/internal/sidebar-popover-data.d.ts",
]) {
  if (!packedPaths.has(requiredPath)) {
    errors.push(`required split layout entry is missing from tarball: ${requiredPath}`);
  }
}

const jsFiles = pack.files.filter((file) => file.path.endsWith(".js"));
for (const file of jsFiles) {
  const declaration = file.path.replace(/\.js$/, ".d.ts");
  const sourceMap = `${file.path}.map`;
  if (!packedPaths.has(declaration)) errors.push(`missing declaration for ${file.path}`);
  if (!packedPaths.has(sourceMap)) errors.push(`missing sourcemap for ${file.path}`);

  const absolutePath = path.join(root, file.path);
  const contents = fs.readFileSync(absolutePath);
  const raw = contents.byteLength;
  const gzip = gzipSync(contents, { level: 9 }).byteLength;

  if (file.path === "dist/components/ui/map-data.js") {
    checkLimit(`${file.path} raw`, raw, limits.mapDataRaw);
    checkLimit(`${file.path} gzip`, gzip, limits.mapDataGzip);
  } else if (file.path === "dist/assets/_inlined.js") {
    checkLimit(`${file.path} raw`, raw, limits.inlinedRaw);
    checkLimit(`${file.path} gzip`, gzip, limits.inlinedGzip);
  } else {
    checkLimit(`${file.path} raw`, raw, limits.normalJsRaw);
    checkLimit(`${file.path} gzip`, gzip, limits.normalJsGzip);
  }
}

const sourceMapBytes = pack.files
  .filter((file) => file.path.endsWith(".js.map"))
  .reduce((total, file) => total + file.size, 0);
checkLimit("all JavaScript sourcemaps", sourceMapBytes, limits.sourceMaps);

const styles = pack.files.find((file) => file.path === "dist/styles.css");
if (!styles) errors.push("dist/styles.css is missing from tarball");
else checkLimit("dist/styles.css raw", styles.size, limits.stylesRaw);

if (errors.length > 0) {
  console.error("Forge package check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Forge package check passed: ${pack.size} B packed, ${pack.unpackedSize} B unpacked, ${pack.entryCount} files, ${sourceMapBytes} B sourcemaps.`,
  );
}
