import assert from "node:assert/strict";
import test from "node:test";

import {
  consumerScenarios,
  createConsumerInstallArgs,
  createConsumerPackage,
  findUnpinnedExternalDependencies,
} from "./consumer-matrix.mjs";

test("consumer matrix covers the first supported minor of Next 15 and Next 16", () => {
  assert.deepEqual(consumerScenarios, [
    { name: "next-15", next: "15.0.8" },
    { name: "next-16", next: "16.0.11" },
  ]);
});

test("consumer package pins every external dependency while keeping the tarball dynamic", () => {
  const packageJson = createConsumerPackage(
    {
      dependencies: { next: "0.0.0", react: "19.2.4" },
      devDependencies: { typescript: "5.9.3" },
    },
    consumerScenarios[0],
    "file:/tmp/forge-core.tgz",
  );

  assert.equal(packageJson.dependencies.next, "15.0.8");
  assert.equal(packageJson.dependencies["@forge-ui-official/core"], "file:/tmp/forge-core.tgz");
  assert.deepEqual(findUnpinnedExternalDependencies(packageJson), []);
});

test("consumer install keeps platform optional binaries required by Tailwind and Next", () => {
  const args = createConsumerInstallArgs("https://registry.npmjs.org");

  assert.equal(args.includes("--omit=optional"), false);
  assert.deepEqual(args.slice(-2), ["--registry", "https://registry.npmjs.org"]);
});
