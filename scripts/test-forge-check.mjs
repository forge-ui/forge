import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkCode } from "../public/forge-check.mjs";

const rules = code => checkCode(code).findings.map(item => item.rule);

test("flags each static rule with line, audit id and fix", () => {
  const code = [
    'import { Star } from "lucide-react";',
    'import { StarBold } from "@solar-icons/react";',
    '<div className="bg-[#7239EA] p-[13px]" style={{ color: "#333" }} />',
    '<button onClick={() => {}}>保存</button>',
    '<table><tbody /></table>',
    '<input value={name} />',
    '<AppLayout accent="purple" />',
    '<Button color="violet">提交</Button>',
    '<StatusBadge variant="solid" label="已完成" />',
    '<span className="rounded-full bg-fg-green-50 px-2">已完成</span>',
    '<h2 className="text-lg text-fg-grey-500">标题</h2>',
    '<a href="#">查看</a>',
    'alert("保存成功");',
    '<div role="dialog" />',
  ].join("\n");
  const found = checkCode(code);
  for (const rule of ["foreign-ui-library", "direct-solar-import", "hex-color", "arbitrary-px", "raw-button", "empty-handler", "raw-table", "raw-form-control", "purple-default", "violet-color-prop", "solid-status", "handmade-status-pill", "grey-heading", "placeholder-link", "fake-success", "raw-dialog"]) {
    assert.ok(found.findings.some(item => item.rule === rule), rule);
  }
  const hex = found.findings.find(item => item.rule === "hex-color");
  assert.equal(hex.line, 3);
  assert.equal(hex.audit, "V1");
  assert.ok(hex.fix.length > 10);
  assert.ok(found.summary.errors >= 5);
});

test("does not flag Forge-conforming code or data that only looks like hex", () => {
  const code = [
    'import { Button, DataTable, StatusBadge } from "@forge-ui-official/core";',
    'import { StarLinear } from "@forge-ui-official/core/icons";',
    'const orders = [{ id: "#302012", sku: "#ABC" }];',
    '<a href="#details">详情</a>',
    '<div className="w-[280px] gap-6 p-6 text-fg-grey-700"><StatusBadge label="已完成" color="green" /></div>',
    '<Button onClick={save}>保存</Button>',
    '<p className="text-sm text-fg-grey-700">说明</p>',
    '<button type="button" data-forge-allow className="contents">卡片</button>',
    '<input type="hidden" name="id" />',
    '<td className="p-[13px]">x</td> {/* forge-check-disable-line 设计稿要求 */}',
  ].join("\n");
  assert.deepEqual(rules(code), []);
});

test("CLI walks directories, prints a summary and exits non-zero on errors", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "forge-check-"));
  try {
    fs.mkdirSync(path.join(dir, "src/app"), { recursive: true });
    fs.writeFileSync(path.join(dir, "src/app/page.tsx"), '<a href="#">x</a>\n');
    fs.writeFileSync(path.join(dir, "src/app/ok.tsx"), '<Button onClick={go}>去</Button>\n');
    let failed = false;
    try { execFileSync(process.execPath, [path.resolve("public/forge-check.mjs"), "--json"], { cwd: dir, encoding: "utf8" }); }
    catch (error) {
      failed = true;
      const report = JSON.parse(error.stdout);
      assert.equal(report.summary.files, 2);
      assert.equal(report.summary.errors, 1);
      assert.equal(report.findings[0].rule, "placeholder-link");
    }
    assert.ok(failed);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
