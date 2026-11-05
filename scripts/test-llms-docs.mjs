import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { generateDocuments, loadSources } from "./llms-sources.mjs";

const root = path.resolve(import.meta.dirname, "..");
test("repository sources generate all seven deterministic documents", () => {
  const first = generateDocuments(root);
  const second = generateDocuments(root);
  assert.equal(first.outputs.size, 7);
  assert.equal(first.fingerprint, second.fingerprint);
  for (const content of first.outputs.values()) {
    assert.match(content, /@forge-ui-official\/core@0\.4\.7/);
    assert.match(content, /soft StatusBadge/);
    assert.match(content, /@forge-ui-official\/core\/icons/);
    assert.doesNotMatch(content, /forge-app-design/);
  }
  assert.match(first.outputs.get("llms-full.md"), /dashboards\/finance-3/);
  assert.match(first.outputs.get("llms-components.md"), /## DataTable/);
});

test("missing, empty and version-mismatched sources fail closed", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "forge-llms-test-"));
  try {
    assert.throws(() => loadSources(fixture), /ENOENT/);
    fs.mkdirSync(path.join(fixture, "core"), { recursive: true });
    fs.mkdirSync(path.join(fixture, "docs/for-agents"), { recursive: true });
    fs.writeFileSync(path.join(fixture, "core/package.json"), "");
    assert.throws(() => loadSources(fixture), /Empty source/);
    fs.writeFileSync(path.join(fixture, "core/package.json"), JSON.stringify({ name: "core", version: "1" }));
    fs.writeFileSync(path.join(fixture, "docs/for-agents/inventory.json"), JSON.stringify({ package: "core", version: "2" }));
    assert.throws(() => loadSources(fixture), /mismatch/);
    fs.writeFileSync(path.join(fixture, "docs/for-agents/inventory.json"), JSON.stringify({ package: "core", version: "1", components: [], componentCount: 0 }));
    assert.throws(() => loadSources(fixture), /Empty or incomplete/);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});
