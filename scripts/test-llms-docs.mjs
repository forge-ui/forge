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
  for (const [name, content] of first.outputs) {
    assert.ok(content.includes("@forge-ui-official/core@" + loadSources(root).core.version));
    if (name === "llms.txt") continue;
    assert.ok(content.includes(loadSources(root).blocks.length + " Blocks are implemented as copyable project source"));
    assert.match(content, /soft StatusBadge/);
    assert.match(content, /@forge-ui-official\/core\/icons/);
    assert.doesNotMatch(content, /forge-app-design/);
  }
  assert.match(first.outputs.get("llms-full.md"), /dashboards\/finance-3/);
  for (const block of loadSources(root).blocks) {
    assert.ok(first.outputs.get("llms-full.md").includes(`/blocks/${block.name} — ${block.category}`));
  }
  assert.match(first.outputs.get("llms-components.md"), /## DataTable/);
});

test("llms.txt follows the v2 format and links markdown pages", () => {
  const index = generateDocuments(root).outputs.get("llms.txt");
  const lines = index.split("\n");
  assert.match(lines[0], /^# Forge UI$/);
  assert.match(index, /\n> Forge 是/);
  for (const line of lines.filter(item => item.startsWith("- ["))) assert.match(line, /^- \[[^\]]+\]\(https:\/\/[^)]+\)(: .+)?$/);
  for (const block of loadSources(root).blocks) assert.ok(index.includes(`(https://www.forgeui.org/blocks/${block.name}.md)`), block.name);
  assert.match(index, /\(https:\/\/www\.forgeui\.org\/components\/table\.md\): DataTable/);
  assert.match(index, /\n## Optional\n/);
  assert.doesNotMatch(index, /explicitly authorized|separate approval|Source fingerprint/);
  assert.ok(index.length < 40000);
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
