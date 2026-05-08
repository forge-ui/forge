import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.{ts,tsx}"],
  format: ["esm"],
  dts: true,
  bundle: false,
  clean: true,
  sourcemap: true,
  target: "es2022",
  outDir: "dist",
  external: ["react", "react-dom", "next", "solar-icon-set"],
  tsconfig: "tsconfig.build.json",
});
