import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(root, "..");
const componentRoot = path.join(root, "src/components");
const tokenCss = path.join(root, "src/styles/tokens.css");

// Default scope is the core component package only. `--showcase` additionally
// scans the repo showcase/sample sources below as an opt-in review scope:
// every finding there is reported as a warning (never an error, never affects
// the exit code) so the publish gate stays focused on core. core dist and
// node_modules are never scanned.
const includeShowcase = process.argv.includes("--showcase");
const showcaseRoots = [
  "src/app/cases",
  "src/app/components",
  "plugins/forge-app-design/samples",
].map((relPath) => path.join(repoRoot, relPath));
const skippedDirectories = new Set(["dist", "node_modules", ".next"]);

const sourceExtensions = new Set([".ts", ".tsx"]);
const hardcodedColorPattern =
  /#[0-9a-fA-F]{3,8}|\b(bg|text|border|ring|from|to|via|stroke|fill|shadow)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\b/g;
const dirtyVarPattern = /var\(--[a-z0-9-]+\)[0-9a-fA-F]/g;
const forgeTokenClassPattern =
  /(?:bg|text|border|outline|ring|from|to|via|stroke|fill)-(fg-[a-z]+(?:-\d{2,3})?)(?:\b|\/)/g;
const fixedWidthPattern =
  /\b(?:w-(?:96|80|72|64|48)|w-\[(?:[2-9]\d{2,}|[1-9]\d{3,})px\])/g;
// Fixed width classification (warnings, not errors):
// - Safe by construction: width resolved through the card-family opt-in API
//   (resolveCardWidthClass / fixedWidth) or bounded by max-w so it still
//   shrinks with the parent.
// - Allowed context: overlay/popover/dialog/picker/input internals own their
//   width by design; showcase-compat lines are explicitly documented.
// - Everything else is a suspicious production-card fixed width → warn.
const fixedWidthSafeLinePattern =
  /(max-w|resolveCardWidthClass|fixedWidth|object-cover|w-\[(5|18|22)px\])/;
const fixedWidthAllowedFilePattern =
  /(dialog|popover|modal|drawer|overlay|tooltip|dropdown|calendar|datepicker|icon-selector|select|menu|toolbar|upload)/i;
const showcaseCompatLinePattern = /\b(showcase|figma)\b/i;
// width="fixed" is a documented showcase-only escape hatch; flag it when it
// appears outside comments/docs/showcase so accidental production examples
// surface in review.
const widthFixedPropPattern = /\bwidth\s*=\s*(?:"fixed"|\{\s*["']fixed["']\s*\})/g;
const commentLinePattern = /^(\/\/|\/?\*)/;
// `orange:` variant keys intentionally resolve to fg-red: the Figma source
// names the style "orange" but its hex equals Forge Red 500, and tokens.css
// defines no fg-orange scale. The alias is kept verbatim for visual parity
// with Figma. It stays a review *warning* (not an error) so any newly added
// orange -> fg-* mapping still gets human eyes, without failing the gate for
// the documented historical aliases.
const semanticAliasPattern = /\borange\s*:\s*["'][^"']*fg-red[^"']*["']/g;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skippedDirectories.has(entry.name)) continue;
      files.push(...walk(file));
      continue;
    }
    if (sourceExtensions.has(path.extname(entry.name))) files.push(file);
  }
  return files;
}

// Lines inside an explicit fixed-width API map (e.g. ChartCard's
// fixedWidthClasses) are safe by construction: those classes only apply
// behind an explicit `width="fixed"` opt-in, so flagging the map itself is
// noise. Call sites that pass `width="fixed"` or hardcode w-96 etc. are
// still flagged.
function collectFixedWidthApiMapLines(source) {
  const safeLines = new Set();
  let braceDepth = 0;
  let insideMap = false;
  source.split(/\n/).forEach((line, index) => {
    if (!insideMap && /\b\w*[Ff]ixedWidth\w*\s*(?::[^=]*)?=\s*\{/.test(line)) {
      insideMap = true;
      braceDepth = 0;
    }
    if (insideMap) {
      safeLines.add(index + 1);
      braceDepth += (line.match(/\{/g) ?? []).length;
      braceDepth -= (line.match(/\}/g) ?? []).length;
      if (braceDepth <= 0) insideMap = false;
    }
  });
  return safeLines;
}

function linesForMatch(source, pattern) {
  const lines = source.split(/\n/);
  const matches = [];
  lines.forEach((line, index) => {
    pattern.lastIndex = 0;
    const found = [...line.matchAll(pattern)];
    for (const match of found) {
      matches.push({ line: index + 1, match: match[0], text: line.trim() });
    }
  });
  return matches;
}

function rel(file) {
  return file.startsWith(root + path.sep)
    ? path.relative(root, file)
    : path.relative(repoRoot, file);
}

function collectTokenDefinitions() {
  const css = fs.readFileSync(tokenCss, "utf8");
  return new Set(
    [...css.matchAll(/--color-(fg-[a-z]+(?:-\d{2,3})?)\s*:/g)].map((match) => match[1]),
  );
}

const tokenDefinitions = collectTokenDefinitions();
const errors = [];
const warnings = [];
const showcaseWarnings = [];

function auditFile(file, { showcaseScope }) {
  const source = fs.readFileSync(file, "utf8");
  // In showcase scope everything is review-only: token violations there are
  // worth surfacing but must not fail the core publish gate.
  const pushError = showcaseScope
    ? (item) => showcaseWarnings.push(item)
    : (item) => errors.push(item);
  const pushWarning = showcaseScope
    ? (item) => showcaseWarnings.push(item)
    : (item) => warnings.push(item);

  for (const hit of linesForMatch(source, hardcodedColorPattern)) {
    pushError({
      type: "hardcoded-color",
      file,
      ...hit,
    });
  }

  for (const hit of linesForMatch(source, dirtyVarPattern)) {
    pushError({
      type: "dirty-css-var",
      file,
      ...hit,
    });
  }

  for (const line of source.split(/\n/).entries()) {
    const [index, text] = line;
    forgeTokenClassPattern.lastIndex = 0;
    for (const match of text.matchAll(forgeTokenClassPattern)) {
      if (!tokenDefinitions.has(match[1])) {
        pushError({
          type: "unknown-forge-token",
          file,
          line: index + 1,
          match: match[0],
          text: text.trim(),
        });
      }
    }
  }

  const isAllowedFixedWidthFile = fixedWidthAllowedFilePattern.test(rel(file));
  const fixedWidthApiMapLines = collectFixedWidthApiMapLines(source);

  for (const hit of linesForMatch(source, fixedWidthPattern)) {
    if (fixedWidthSafeLinePattern.test(hit.text)) continue;
    if (fixedWidthApiMapLines.has(hit.line)) continue;
    if (isAllowedFixedWidthFile) continue;
    if (commentLinePattern.test(hit.text)) continue;
    if (showcaseCompatLinePattern.test(hit.text)) continue;
    pushWarning({
      type: "fixed-width-review",
      file,
      ...hit,
    });
  }

  for (const hit of linesForMatch(source, widthFixedPropPattern)) {
    if (commentLinePattern.test(hit.text)) continue;
    if (showcaseCompatLinePattern.test(hit.text)) continue;
    if (isAllowedFixedWidthFile) continue;
    pushWarning({
      type: "width-fixed-review",
      file,
      ...hit,
    });
  }

  for (const hit of linesForMatch(source, semanticAliasPattern)) {
    pushWarning({
      type: "semantic-alias-review",
      file,
      ...hit,
    });
  }
}

const coreFiles = walk(componentRoot);
for (const file of coreFiles) {
  auditFile(file, { showcaseScope: false });
}

let showcaseFileCount = 0;
if (includeShowcase) {
  for (const showcaseRoot of showcaseRoots) {
    if (!fs.existsSync(showcaseRoot)) continue;
    const files = walk(showcaseRoot);
    showcaseFileCount += files.length;
    for (const file of files) {
      auditFile(file, { showcaseScope: true });
    }
  }
}

function printItems(label, items) {
  if (items.length === 0) return;
  console.log(`\n${label}`);
  for (const item of items) {
    console.log(`${item.type}: ${rel(item.file)}:${item.line} ${item.match}`);
    console.log(`  ${item.text}`);
  }
}

printItems("Forge component audit errors", errors);
printItems("Forge component audit warnings", warnings);
printItems("Forge showcase audit warnings (opt-in review scope)", showcaseWarnings);

let summary = `\nForge component audit: ${errors.length} error(s), ${warnings.length} warning(s) across ${coreFiles.length} files.`;
if (includeShowcase) {
  summary += ` Showcase scope: ${showcaseWarnings.length} review warning(s) across ${showcaseFileCount} files.`;
}
console.log(summary);

if (errors.length > 0) process.exitCode = 1;
