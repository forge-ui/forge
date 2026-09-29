import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

function collectSourceEntries(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
    .flatMap((entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectSourceEntries(absolutePath);
      if (!/\.(?:ts|tsx)$/.test(entry.name) || entry.name.endsWith(".d.ts")) return [];
      return [path.relative(process.cwd(), absolutePath).split(path.sep).join("/")];
    });
}

export default defineConfig({
  // Keep declaration output stable: glob expansion order can change between
  // builds and reorder equivalent TypeScript unions in the emitted .d.ts files.
  entry: collectSourceEntries(path.resolve("src")),
  format: ["esm"],
  dts: true,
  bundle: false,
  clean: true,
  sourcemap: true,
  target: "es2022",
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "next",
    "@solar-icons/react",
  ],
  tsconfig: "tsconfig.build.json",
});
