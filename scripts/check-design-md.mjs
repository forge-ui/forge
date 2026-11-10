import fs from "node:fs";
import { execFileSync } from "node:child_process";

// DESIGN.md is hand-written for agents; keep its colors tied to core tokens and its structure valid.
const design = fs.readFileSync("public/DESIGN.md", "utf8");
const css = fs.readFileSync("core/src/styles/tokens.css", "utf8");
const primitive = name => css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1]?.toUpperCase();
const expected = {
  primary: "fg-blue-500", "on-primary": "fg-white", "primary-soft": "fg-blue-100", "primary-hover": "fg-blue-600",
  background: "fg-white", surface: "fg-grey-50", "on-surface": "fg-black-500", "text-primary": "fg-black-500",
  "text-secondary": "fg-grey-900", "text-muted": "fg-grey-700", "text-disabled": "fg-grey-500", border: "fg-grey-200",
  "border-muted": "fg-grey-100", error: "fg-red-500", warning: "fg-yellow-500", "on-warning": "fg-black-500",
  success: "fg-green-500", info: "fg-cyan-500", violet: "fg-violet-500",
};
const drift = Object.entries(expected).flatMap(([token, source]) => {
  const documented = design.match(new RegExp(`^  ${token}: "(#[0-9A-Fa-f]{6})"`, "m"))?.[1]?.toUpperCase();
  const actual = primitive(source);
  return documented && actual && documented === actual ? [] : [`${token}: DESIGN.md ${documented ?? "missing"} vs ${source} ${actual ?? "missing"}`];
});
if (drift.length) throw new Error("DESIGN.md colors drifted from core tokens:\n" + drift.join("\n"));
const report = JSON.parse(execFileSync("pnpm", ["exec", "design.md", "lint", "public/DESIGN.md"], { encoding: "utf8" }));
if (report.summary.errors) throw new Error("DESIGN.md lint errors:\n" + JSON.stringify(report.findings.filter(item => item.severity === "error"), null, 2));
console.log(`DESIGN.md matches core tokens (${Object.keys(expected).length} colors); lint: 0 errors, ${report.summary.warnings} warnings`);
