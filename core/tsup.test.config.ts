import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["test/*.test.tsx"],
  format: ["cjs"],
  platform: "node",
  target: "node22",
  outDir: "tmp/core-tests",
  clean: true,
  external: ["jsdom"],
  noExternal: [/^@solar-icons\/react/, /^streamdown$/],
});
