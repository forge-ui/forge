import fs from "node:fs";
import path from "node:path";

export type ChangelogBlock =
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

export type ChangelogRelease = {
  version: string;
  id: string;
  blocks: ChangelogBlock[];
};

const CHANGELOG_PATH = path.join(process.cwd(), "core/CHANGELOG.md");
const VERSION_HEADING = /^##\s+v?(\d+\.\d+\.\d+)\s*$/;

export function changelogAnchor(version: string) {
  return `v${version}`;
}

export function changelogHref(version: string) {
  return `/docs/changelog#${changelogAnchor(version)}`;
}

export function parseChangelog(markdown: string): ChangelogRelease[] {
  const releases: ChangelogRelease[] = [];
  let current: ChangelogRelease | null = null;
  let list: string[] | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!current || paragraph.length === 0) return;
    current.blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushList = () => {
    if (!current || !list) return;
    current.blocks.push({ type: "list", items: list });
    list = null;
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = line.match(VERSION_HEADING);
    if (heading) {
      flushParagraph();
      flushList();
      current = { version: heading[1], id: changelogAnchor(heading[1]), blocks: [] };
      releases.push(current);
      continue;
    }
    if (!current || line.startsWith("#")) continue;
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      list ??= [];
      list.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return releases;
}

export function readChangelog() {
  return parseChangelog(fs.readFileSync(CHANGELOG_PATH, "utf8"));
}
