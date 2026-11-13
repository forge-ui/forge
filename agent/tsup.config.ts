import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

// One output file per source file (no bundling), so "use client" stays at the top of client modules.
function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return sources(absolute);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts") ? [path.relative(process.cwd(), absolute).split(path.sep).join("/")] : [];
  });
}

export default defineConfig({
  entry: sources(path.resolve("src")),
  format: ["esm"],
  dts: true,
  bundle: false,
  clean: true,
  sourcemap: true,
  target: "es2022",
  outDir: "dist",
});
