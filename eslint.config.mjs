import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".vercel/**",
    "core/dist/**",
    "core/tmp/**",
    "tmp/**",
    "tmp-audit/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored agent skills (MIT, Enes Ozturk). Not app source.
    "skills/dimensional-drawing/**",
    "skills/dimensional-drawing-motion/**",
  ]),
]);

export default eslintConfig;
