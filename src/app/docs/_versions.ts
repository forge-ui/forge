import fs from "node:fs";
import path from "node:path";

const root = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
  engines: { node: string };
  packageManager: string;
  dependencies: { next: string; react: string };
};
const core = JSON.parse(fs.readFileSync(path.join(process.cwd(), "core/package.json"), "utf8")) as {
  version: string;
  peerDependencies: { next: string; react: string };
};

export const nodeRequirement = root.engines.node;
export const pnpmVersion = root.packageManager.replace(/^pnpm@/, "");
export const coreVersion = core.version;
export const repoNext = root.dependencies.next.replace(/^\^/, "");
export const repoReact = root.dependencies.react.replace(/^\^/, "");
export const peerNext = core.peerDependencies.next;
export const peerReact = core.peerDependencies.react;
