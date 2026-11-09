import "server-only";
import fs from "node:fs";
import path from "node:path";
import { blocks } from "./_catalog";

interface RegistryBlock {
  files: { content: string }[];
  meta: {
    category: string;
    example: string;
    props: { component: string; properties: { name: string; required: boolean; type: string }[] }[];
    screens: { href: string; title: string }[];
    core: { version: string; components: string[] };
  };
}

export function getRegistryBlock(name: string): RegistryBlock | null {
  if (!blocks.some(block => block.name === name)) return null;
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "r", `${name}.json`), "utf8")) as RegistryBlock;
}
