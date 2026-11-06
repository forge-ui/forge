import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { brokenLinks } from "./check-doc-links.mjs";

test("links resolve after archive moves and missing evidence fails closed", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "forge-links-"));
  try {
    fs.mkdirSync(path.join(root, "archive"));
    fs.writeFileSync(path.join(root, "current.md"), "Current");
    fs.writeFileSync(path.join(root, "archive/old.md"), "[current](../current.md#scope) [missing](missing.md) [external](https://example.com) [sibling](../../outside.md)");
    assert.deepEqual(brokenLinks(root, ["archive/old.md"]), [{ file: "archive/old.md", href: "missing.md" }, { file: "archive/old.md", href: "../../outside.md" }]);
    fs.writeFileSync(path.join(root, "archive/old.md"), "[current](../current.md#scope)\n\n```md\n[example](missing.md)\n```\n`[example](missing.md)`");
    assert.deepEqual(brokenLinks(root, ["archive/old.md"]), []);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
