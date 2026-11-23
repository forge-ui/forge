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
  // Base UI needs a document and DOM constructors before its modules load.
  banner: { js: 'require(require("node:path").resolve(__dirname, "../../test/setup/dom-globals.cjs"));' },
});
