import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  collectPublicApi,
  collectWildcardApi,
  collectWildcardExportEntries,
} from "./package-contract.mjs";

test("public API snapshot distinguishes value and type exports", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forge-api-contract-"));
  try {
    const entry = path.join(tempRoot, "index.d.ts");
    fs.writeFileSync(
      entry,
      "export declare function Button(): void; export interface ButtonProps { label: string }\n",
    );

    assert.deepEqual(
      collectPublicApi(entry).map((entry) => entry.split(":").slice(0, 2).join(":")),
      ["Button:value", "ButtonProps:type"],
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("public API snapshot changes when an export keeps its name and kind but changes signature", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forge-api-contract-"));
  try {
    const originalEntry = path.join(tempRoot, "original.d.ts");
    const changedEntry = path.join(tempRoot, "changed.d.ts");
    fs.writeFileSync(originalEntry, "export declare function Button(label: string): void;\n");
    fs.writeFileSync(changedEntry, "export declare function Button(label: number): void;\n");

    const originalApi = collectPublicApi(originalEntry);
    const changedApi = collectPublicApi(changedEntry);

    assert.deepEqual(
      originalApi.map((entry) => entry.split(":").slice(0, 2).join(":")),
      changedApi.map((entry) => entry.split(":").slice(0, 2).join(":")),
    );
    assert.notDeepEqual(originalApi, changedApi);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("public API snapshot follows signature changes through local declaration dependencies", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forge-api-contract-"));
  try {
    const createEntry = (directory, language) => {
      fs.mkdirSync(directory);
      fs.writeFileSync(
        path.join(directory, "language.d.ts"),
        `export type LanguageCode = ${JSON.stringify(language)};\n`,
      );
      const entry = path.join(directory, "index.d.ts");
      fs.writeFileSync(
        entry,
        'import type { LanguageCode } from "./language.js"; export type AppLanguage = LanguageCode;\n',
      );
      return entry;
    };

    const originalApi = collectPublicApi(createEntry(path.join(tempRoot, "original"), "en"));
    const changedApi = collectPublicApi(createEntry(path.join(tempRoot, "changed"), "zh-CN"));
    assert.notDeepEqual(originalApi, changedApi);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("wildcard package exports reject JavaScript and declaration entries without a counterpart", () => {
  const result = collectWildcardExportEntries(
    {
      "./components/ui/*": {
        types: "./dist/components/ui/*.d.ts",
        import: "./dist/components/ui/*.js",
      },
    },
    new Set([
      "dist/components/ui/button.js",
      "dist/components/ui/button.d.ts",
      "dist/components/ui/missing-types.js",
      "dist/components/ui/missing-runtime.d.ts",
    ]),
  );

  assert.deepEqual(result.entries, [
    {
      subpath: "./components/ui/button",
      types: "dist/components/ui/button.d.ts",
      import: "dist/components/ui/button.js",
    },
  ]);
  assert.deepEqual(result.errors, [
    "wildcard export ./components/ui/missing-runtime has no JavaScript entry: dist/components/ui/missing-runtime.js",
    "wildcard export ./components/ui/missing-types has no declaration entry: dist/components/ui/missing-types.d.ts",
  ]);
});

test("wildcard API snapshot includes nested reachable entries and changes with their declarations", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forge-wildcard-contract-"));
  try {
    const declaration = "dist/components/ui/forms/select.d.ts";
    const runtime = "dist/components/ui/forms/select.js";
    fs.mkdirSync(path.join(tempRoot, path.dirname(declaration)), { recursive: true });
    fs.writeFileSync(
      path.join(tempRoot, declaration),
      "export declare function SelectOption(value: string): void;\n",
    );
    fs.writeFileSync(path.join(tempRoot, runtime), "export function SelectOption() {}\n");
    const { entries, errors } = collectWildcardExportEntries(
      {
        "./components/ui/*": {
          types: "./dist/components/ui/*.d.ts",
          import: "./dist/components/ui/*.js",
        },
      },
      new Set([declaration, runtime]),
    );

    assert.deepEqual(errors, []);
    const originalApi = collectWildcardApi(tempRoot, entries);
    assert.equal(originalApi.length, 1);
    assert.match(originalApi[0], /^\.\/components\/ui\/forms\/select:[a-f0-9]{64}$/);

    fs.writeFileSync(
      path.join(tempRoot, declaration),
      "export declare function SelectOption(value: number): void;\n",
    );
    assert.notDeepEqual(collectWildcardApi(tempRoot, entries), originalApi);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("wildcard API snapshot follows re-exported declaration dependencies", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "forge-wildcard-contract-"));
  try {
    const declaration = "dist/components/ui/language.d.ts";
    const runtime = "dist/components/ui/language.js";
    const dependency = path.join(tempRoot, "dist/internal/language.d.ts");
    fs.mkdirSync(path.dirname(dependency), { recursive: true });
    fs.mkdirSync(path.join(tempRoot, path.dirname(declaration)), { recursive: true });
    fs.writeFileSync(
      path.join(tempRoot, declaration),
      'export { languageFlagDataUrls } from "../../internal/language.js";\n',
    );
    fs.writeFileSync(path.join(tempRoot, runtime), "export const languageFlagDataUrls = {};\n");
    fs.writeFileSync(
      dependency,
      "export declare const languageFlagDataUrls: Record<string, string>;\n",
    );
    const { entries, errors } = collectWildcardExportEntries(
      {
        "./components/ui/*": {
          types: "./dist/components/ui/*.d.ts",
          import: "./dist/components/ui/*.js",
        },
      },
      new Set([declaration, runtime]),
    );

    assert.deepEqual(errors, []);
    const originalApi = collectWildcardApi(tempRoot, entries);
    fs.writeFileSync(
      dependency,
      "export declare const languageFlagDataUrls: Record<string, URL>;\n",
    );
    assert.notDeepEqual(collectWildcardApi(tempRoot, entries), originalApi);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
