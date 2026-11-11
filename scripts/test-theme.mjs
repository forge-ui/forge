import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { generateScale, normalizeHex, parseScale, previewVariables, radiusValues, SCALE_STEPS, themeCss } from "../src/lib/theme.mjs";

const tokens = fs.readFileSync(new URL("../core/src/styles/tokens.css", import.meta.url), "utf8");
const blue = parseScale(tokens);
const distance = (left, right) => Math.max(...[0, 2, 4].map(index => Math.abs(parseInt(left.slice(1 + index, 3 + index), 16) - parseInt(right.slice(1 + index, 3 + index), 16))));

test("the reference scale is the light primitives, not the generated dark palette", () => {
  assert.equal(blue[50], "#EBEEFF");
  assert.equal(blue[500], "#3553FF");
  assert.equal(blue[900], "#16236B");
});

test("the Forge blue reproduces its own scale exactly", () => {
  assert.deepEqual(generateScale("#3553FF", blue), blue);
});

test("another hue follows the same curve as the hand-tuned core scale", () => {
  const violet = parseScale(tokens, "violet");
  const generated = generateScale(violet[500], blue);
  for (const step of SCALE_STEPS) assert.ok(distance(generated[step], violet[step]) <= 6, `${step}: ${generated[step]} vs ${violet[step]}`);
});

test("scales stay ordered from light to dark and in sRGB", () => {
  for (const color of ["#16A34A", "#EAB308", "#111827", "#E11D48"]) {
    const scale = generateScale(color, blue);
    const lightness = SCALE_STEPS.map(step => [0, 2, 4].reduce((sum, index) => sum + parseInt(scale[step].slice(1 + index, 3 + index), 16), 0));
    for (let index = 1; index < lightness.length; index++) assert.ok(lightness[index] <= lightness[index - 1], `${color} ${SCALE_STEPS[index]}`);
    for (const value of Object.values(scale)) assert.match(value, /^#[0-9A-F]{6}$/);
  }
});

test("css only overrides what changed; the default theme needs nothing", () => {
  assert.match(themeCss({ color: "#3553FF", radius: "default", font: "default" }, blue), /不需要额外 CSS/);
  const css = themeCss({ color: "#16a34a", radius: "compact", font: "system" }, blue);
  assert.match(css, /--fg-blue-500: #16A34A;/);
  assert.match(css, /--radius-xl: 6px;/);
  assert.match(css, /\.rounded-card \{ border-radius: 10px; \}/);
  assert.match(css, /--font-manrope: system-ui/);
  assert.doesNotMatch(themeCss({ color: "#3553FF", radius: "round", font: "default" }, blue), /--fg-blue|--font/);
});

test("preview variables restate values tokens.css derives on :root", () => {
  const variables = previewVariables({ color: "#16A34A", radius: "default", font: "default" }, blue);
  for (const name of ["--fg-blue", "--accent", "--accent-soft", "--focus"]) assert.ok(variables[name], name);
  assert.equal(radiusValues("none").card, 0);
  assert.equal(normalizeHex("abc"), "#AABBCC");
  assert.equal(normalizeHex("blue"), null);
});
