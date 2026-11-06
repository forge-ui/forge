import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

test("project page title keeps actions reachable below the small breakpoint", () => {
  const source = fs.readFileSync("src/app/templates/project-template/_chrome.tsx", "utf8");
  assert.match(source, /max-sm:flex-col max-sm:items-stretch/);
  assert.match(source, /max-sm:\[&>div\]:flex-wrap/);
  assert.doesNotMatch(source, /overflow-hidden/);
});

test("ecommerce title rows wrap on narrow screens without changing desktop classes", () => {
  for (const name of ["sellers", "products", "orders", "categories", "customers"]) {
    const source = fs.readFileSync(`src/app/templates/(dashboard)/ecommerce/${name}/page.tsx`, "utf8");
    assert.match(source, /flex items-start justify-between max-sm:flex-col max-sm:items-stretch/);
  }
});
