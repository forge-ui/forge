import assert from "node:assert/strict";
import test from "node:test";

import { scanSemanticAliases } from "./semantic-alias-scanner.mjs";

test("scanner covers inline, nested, quoted and multiline orange aliases while ignoring comments", () => {
  const source = `
    const colors = {
      orange: "bg-fg-red",
      nested: {
        "orange": {
          bg:
            "bg-fg-red-100",
          icon: "text-fg-red",
        },
      },
      // orange: "bg-fg-red-900",
    };
  `;

  assert.deepEqual(scanSemanticAliases(source, "fixture.ts"), [
    { aliasPath: "colors.orange", value: "bg-fg-red" },
    { aliasPath: "colors.nested.orange.bg", value: "bg-fg-red-100" },
    { aliasPath: "colors.nested.orange.icon", value: "text-fg-red" },
  ]);
});

test("scanner keeps the declared map name through as-const wrappers", () => {
  assert.deepEqual(
    scanSemanticAliases('const colors = { orange: "bg-fg-red" } as const;', "fixture.ts"),
    [{ aliasPath: "colors.orange", value: "bg-fg-red" }],
  );
});
