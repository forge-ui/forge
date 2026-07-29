import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(scriptDir, "..");
const tokens = fs.readFileSync(path.join(coreRoot, "src/styles/tokens.css"), "utf8");

const expected = {
  "--forge-typography-contract-version": "1",
  "--forge-font-sans-family": '"Manrope Variable"',
  "--forge-font-display-family": '"Plus Jakarta Sans Variable"',
  "--forge-text-2xs-size": "10px",
  "--forge-text-xs-size": "12px",
  "--forge-text-sm-size": "14px",
  "--forge-text-base-size": "16px",
  "--forge-text-lg-size": "18px",
  "--forge-text-xl-size": "20px",
  "--forge-text-2xl-size": "24px",
  "--forge-text-3xl-size": "30px",
  "--forge-text-4xl-size": "36px",
  "--forge-text-5xl-size": "48px",
  "--forge-text-8xl-size": "96px",
  "--forge-text-display-l-size": "28px",
  "--forge-text-arbitrary-10-size": "10px",
  "--forge-text-arbitrary-15-size": "15px",
  "--forge-font-normal-weight": "400",
  "--forge-font-medium-weight": "500",
  "--forge-font-semibold-weight": "600",
  "--forge-font-bold-weight": "700",
  "--forge-leading-3": "12px",
  "--forge-leading-3_5": "14px",
  "--forge-leading-4": "16px",
  "--forge-leading-4_5": "18px",
  "--forge-leading-5": "20px",
  "--forge-leading-6": "24px",
  "--forge-leading-7": "28px",
  "--forge-leading-7_5": "30px",
  "--forge-leading-8": "32px",
  "--forge-leading-9": "36px",
  "--forge-leading-11": "44px",
  "--forge-leading-arbitrary-18": "18px",
  "--forge-leading-arbitrary-60": "60px",
  "--forge-leading-arbitrary-140": "140px",
  "--forge-leading-tight-factor": "1.25",
  "--forge-tracking-fg": "0.5px",
  "--forge-tracking-tight-factor": "-0.025",
  "--forge-tracking-wide-factor": "0.025",
};

test("published Forge styles expose a complete versioned typography contract", () => {
  for (const [name, value] of Object.entries(expected)) {
    assert.match(
      tokens,
      new RegExp(`${escapeRegex(name)}:\\s*${escapeRegex(value)}\\s*;`),
      `${name} must be ${value}`,
    );
  }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
