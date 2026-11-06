import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

test("installer includes both independent dimensional skills and provenance", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "forge-installer-"));
  try {
    const bin = path.join(temporary, "bin");
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, "git"), '#!/bin/bash\nif [[ "$1" == clone ]]; then\n  destination="${@: -1}"\n  mkdir -p "$destination"\n  cp -R "$FX_SOURCE/skills" "$destination/skills"\nfi\n', { mode: 0o755 });
    const destination = path.join(temporary, "installed");
    execFileSync("bash", ["public/install-skill.sh"], { env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, FX_SOURCE: process.cwd(), FORGE_SKILLS_DIR: destination } });
    for (const name of ["forge-skill", "dimensional-drawing", "dimensional-drawing-motion"]) {
      assert.ok(fs.existsSync(path.join(destination, name, "SKILL.md")));
      if (name !== "forge-skill") {
        for (const file of ["LICENSE", "SOURCE.md"]) assert.equal(fs.readFileSync(path.join(destination, name, file), "utf8"), fs.readFileSync(path.join("skills", name, file), "utf8"));
      }
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
