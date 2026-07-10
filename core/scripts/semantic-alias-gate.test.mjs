import assert from "node:assert/strict";
import test from "node:test";

import { createSemanticAliasGate } from "./semantic-alias-gate.mjs";

test("精确路径和值只批准一次，重复出现会被视为新增 alias", () => {
  const gate = createSemanticAliasGate([
    ["src/components/ui/badge.tsx", "bg-fg-red"],
  ]);

  assert.equal(gate.consume("src/components/ui/badge.tsx", "bg-fg-red"), true);
  assert.equal(gate.consume("src/components/ui/badge.tsx", "bg-fg-red"), false);
  assert.deepEqual(gate.finalize(), { duplicates: [], stale: [] });
});

test("未被源码消费的批准项会成为 stale", () => {
  const gate = createSemanticAliasGate([
    ["src/components/ui/badge.tsx", "bg-fg-red"],
  ]);

  assert.deepEqual(gate.finalize(), {
    duplicates: [],
    stale: [["src/components/ui/badge.tsx", "bg-fg-red"]],
  });
});

test("allowlist 自身的重复指纹会成为配置错误", () => {
  const entry = ["src/components/ui/badge.tsx", "bg-fg-red"];
  const gate = createSemanticAliasGate([entry, entry]);

  assert.deepEqual(gate.finalize(), {
    duplicates: [["src/components/ui/badge.tsx", "bg-fg-red"]],
    stale: [["src/components/ui/badge.tsx", "bg-fg-red"]],
  });
});

test("同一文件和值必须按 alias path 分别批准", () => {
  const gate = createSemanticAliasGate([
    ["src/components/ui/badge.tsx", "circleIconVariants.light.orange.icon", "text-fg-red"],
  ]);

  assert.equal(
    gate.consume(
      "src/components/ui/badge.tsx",
      "circleIconVariants.neutral.orange.icon",
      "text-fg-red",
    ),
    false,
  );
  assert.equal(
    gate.consume(
      "src/components/ui/badge.tsx",
      "circleIconVariants.light.orange.icon",
      "text-fg-red-900",
    ),
    false,
  );
  assert.equal(
    gate.consume(
      "src/components/ui/badge.tsx",
      "circleIconVariants.light.orange.icon",
      "text-fg-red",
    ),
    true,
  );
});
