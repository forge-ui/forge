import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";

// Base UI parts take callbacks and run hooks, so a server component cannot render
// them directly; every source module that imports Base UI must be a client module.
const root = new URL("../src/", import.meta.url).pathname;
function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) ? [path] : [];
  });
}

test("modules importing Base UI start with \"use client\"", () => {
  const missing = files(root)
    .filter((path) => readFileSync(path, "utf8").includes("@base-ui/react"))
    .filter((path) => !/^\s*(\/\*[\s\S]*?\*\/\s*)?["']use client["']/.test(readFileSync(path, "utf8")))
    .map((path) => relative(root, path));
  assert.deepEqual(missing, []);
});
