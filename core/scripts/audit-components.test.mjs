import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(scriptDir, "..");
const fixturePath = path.join(
  coreRoot,
  "src/internal/__audit-components-internal-fixture__.tsx",
);

test("component audit fails for a forbidden color in published internal implementation", () => {
  fs.writeFileSync(
    fixturePath,
    'export const InternalFixture = () => <div className="bg-red-500" />;\n',
  );

  try {
    const result = spawnSync(process.execPath, ["scripts/audit-components.mjs"], {
      cwd: coreRoot,
      encoding: "utf8",
    });

    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(
      result.stdout,
      /hardcoded-color: src\/internal\/__audit-components-internal-fixture__\.tsx:1 bg-red-500/,
    );
  } finally {
    fs.rmSync(fixturePath, { force: true });
  }
});
