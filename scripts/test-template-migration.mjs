import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";

function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}

const sources = files("src/app/templates").filter(file => file.endsWith(".tsx") && !file.includes("/(dashboards)/"));

test("business templates use core controls and semantic color families", () => {
  for (const file of sources) {
    const text = fs.readFileSync(file, "utf8");
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        assert.ok(!["button", "input", "select", "textarea", "table"].includes(node.tagName.getText(source)), `${file}: native ${node.tagName.getText(source)}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    assert.doesNotMatch(text, /(?:bg|text|border|outline|ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d/, file);
    assert.doesNotMatch(text, /!gap-|!p-/, file);
  }
});

test("all registered blocks have discoverable gallery previews", () => {
  const catalog = JSON.parse(fs.readFileSync("blocks/registry.json", "utf8"));
  const gallery = fs.readFileSync("src/app/blocks/page.tsx", "utf8");
  for (const entry of catalog) assert.ok(gallery.includes(`"${entry.name}":`), entry.name);
});
