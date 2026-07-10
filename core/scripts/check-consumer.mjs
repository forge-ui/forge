import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  consumerScenarios,
  createConsumerInstallArgs,
  createConsumerPackage,
  findUnpinnedExternalDependencies,
} from "./consumer-matrix.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const fixtureRoot = path.join(root, "fixtures/next-consumer");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forge-core-consumer-"));
const tarballDir = path.join(tempRoot, "tarball");
const keepTemp = process.env.FORGE_KEEP_CONSUMER_TMP === "1";

function verifyScenario({ scenario, tarballPath }) {
  const consumerRoot = path.join(tempRoot, scenario.name);
  fs.cpSync(fixtureRoot, consumerRoot, { recursive: true });
  const packageJsonPath = path.join(consumerRoot, "package.json");
  const consumerPackage = createConsumerPackage(
    JSON.parse(fs.readFileSync(packageJsonPath, "utf8")),
    scenario,
    `file:${tarballPath}`,
  );
  const unpinnedDependencies = findUnpinnedExternalDependencies(consumerPackage);
  if (unpinnedDependencies.length > 0) {
    throw new Error(`consumer dependencies must use exact versions: ${unpinnedDependencies.join(", ")}`);
  }
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(consumerPackage, null, 2)}\n`);

  const registry = process.env.FORGE_CONSUMER_REGISTRY ?? "https://registry.npmjs.org";
  const env = {
    ...process.env,
    CI: "1",
    NEXT_TELEMETRY_DISABLED: "1",
    npm_config_registry: registry,
    NPM_CONFIG_REGISTRY: registry,
  };
  execFileSync(
    "npm",
    createConsumerInstallArgs(registry),
    { cwd: consumerRoot, env, stdio: "inherit" },
  );

  const installedPackageJson = path.join(
    consumerRoot,
    "node_modules/@forge-ui-official/core/package.json",
  );
  const installedRealPath = fs.realpathSync(installedPackageJson);
  if (installedRealPath.startsWith(root + path.sep)) {
    throw new Error(`consumer resolved the workspace source instead of the tarball: ${installedRealPath}`);
  }
  const installedNext = JSON.parse(
    fs.readFileSync(path.join(consumerRoot, "node_modules/next/package.json"), "utf8"),
  ).version;
  if (installedNext !== scenario.next) {
    throw new Error(`consumer expected Next ${scenario.next}, installed ${installedNext}`);
  }

  execFileSync("npm", ["run", "build"], {
    cwd: consumerRoot,
    env,
    stdio: "inherit",
  });

  const buildId = path.join(consumerRoot, ".next/BUILD_ID");
  if (!fs.existsSync(buildId)) throw new Error("consumer build did not produce .next/BUILD_ID");

  const htmlPath = path.join(consumerRoot, ".next/server/app/index.html");
  if (!fs.existsSync(htmlPath)) {
    throw new Error("consumer build did not prerender the root route");
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  for (const marker of [
    "Forge Core tarball consumer",
    'data-forge-app-layout="true"',
    'data-forge-data-table="true"',
    "bg-fg-violet",
  ]) {
    if (!html.includes(marker)) {
      throw new Error(`consumer root HTML is missing SSR marker: ${marker}`);
    }
  }

  const cssHrefs = [...new Set(
    [...html.matchAll(/href="([^"?]+\.css)(?:\?[^" ]*)?"/g)]
      .map((match) => match[1])
      .filter((href) => href.startsWith("/_next/static/")),
  )];
  const cssFiles = cssHrefs.map((href) =>
    path.join(consumerRoot, ".next", href.slice("/_next/".length)),
  );
  if (cssFiles.length === 0) {
    throw new Error("consumer root HTML does not reference production CSS");
  }
  for (const file of cssFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`consumer root HTML references missing CSS: ${file}`);
    }
  }

  const css = cssFiles
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
  if (!css.includes("--fg-violet-500:")) {
    throw new Error("consumer CSS is missing Forge token styles");
  }
  if (!/\.bg-fg-violet(?=[,{])/.test(css)) {
    throw new Error("consumer CSS is missing classes discovered from the package dist source");
  }

  return cssFiles.length;
}

try {
  fs.mkdirSync(tarballDir, { recursive: true });
  const [pack] = JSON.parse(
    execFileSync(
      "npm",
      ["pack", "--ignore-scripts", "--json", "--pack-destination", tarballDir],
      { cwd: root, encoding: "utf8" },
    ),
  );
  const tarballPath = path.join(tarballDir, pack.filename);
  const results = consumerScenarios.map((scenario) => ({
    scenario,
    cssFileCount: verifyScenario({ scenario, tarballPath }),
  }));

  console.log(`Forge tarball consumer check passed: ${pack.filename}`);
  for (const { scenario, cssFileCount } of results) {
    console.log(
      `- ${scenario.name}: Next ${scenario.next}, ${cssFileCount} CSS file${cssFileCount === 1 ? "" : "s"} verified`,
    );
  }
} finally {
  if (keepTemp) console.log(`Forge consumer fixture kept at ${tempRoot}`);
  else fs.rmSync(tempRoot, { recursive: true, force: true });
}
