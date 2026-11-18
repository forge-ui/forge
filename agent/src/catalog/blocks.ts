import { BLOCK_OF, parseBlock, uiToolNames, type UiToolName } from "./schema";

/**
 * The model writes components inside its answer as fenced blocks (```forge:cards + JSON), so a whole
 * answer, components included, comes from one model step. Splitting the text turns each block into
 * a component; plain code fences become code or a copyable command.
 */
export const BLOCK_NAMES: Record<string, UiToolName> = Object.fromEntries(uiToolNames.map(name => [BLOCK_OF[name], name]));

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "block"; name: UiToolName; input: unknown }
  | { kind: "command"; code: string }
  | { kind: "code"; language: string; code: string }
  /** A fence still being written while streaming; `name` is set when it is a component. */
  | { kind: "pending"; name?: UiToolName };

const SHELL = new Set(["bash", "sh", "shell", "zsh", "console", "terminal"]);
const FENCE = /^ {0,3}(`{3,})[ \t]*([^\s`]*)[^\n]*$/;

/**
 * Models often quote words inside a string with plain double quotes (不是"接上就好"). A quote is
 * structural only next to JSON punctuation; any other quote inside a string is escaped.
 */
export function repairQuotes(body: string) {
  let out = "";
  let inString = false;
  for (let index = 0; index < body.length; index++) {
    const char = body[index];
    if (char === "\\" && inString) { out += char + (body[index + 1] ?? ""); index++; continue; }
    if (char !== '"') { out += char; continue; }
    if (!inString) { inString = true; out += char; continue; }
    const next = body.slice(index + 1).trimStart()[0];
    if (next === undefined || next === ":" || next === "," || next === "}" || next === "]") { inString = false; out += char; }
    else out += '\\"';
  }
  return out;
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    try { return JSON.parse(repairQuotes(body)); } catch { return undefined; }
  }
}

function blockInput(name: UiToolName, body: string): unknown {
  let value = parseJson(body);
  if (value === undefined) return undefined;
  // A bare list is the obvious shorthand for follow-up questions.
  if (name === "suggest_followups" && Array.isArray(value)) value = { questions: value };
  return parseBlock(name, value);
}

function fenced(fenceLanguage: string, fenceBody: string): Segment | undefined {
  // ```json with "forge:table" on the first line, or a bare ``` followed by it.
  const named = fenceBody.match(/^\s*(forge:[a-z]+)\s*\n/);
  const language = named && BLOCK_NAMES[named[1]] ? named[1] : fenceLanguage;
  const body = named && BLOCK_NAMES[named[1]] ? fenceBody.slice(named[0].length) : fenceBody;
  const name = BLOCK_NAMES[language.toLowerCase()];
  if (name) {
    const input = blockInput(name, body);
    // A malformed block shows nothing rather than raw JSON.
    return input === undefined ? undefined : { kind: "block", name, input };
  }
  const code = body.replace(/\n+$/, "");
  if (!code.trim()) return undefined;
  if (SHELL.has(language.toLowerCase()) || (!language && !code.includes("\n"))) return { kind: "command", code };
  return { kind: "code", language, code };
}

/**
 * Splits an answer into text, components and code. While `streaming`, an unclosed fence at the end
 * becomes a pending segment until it closes, so half a block never renders.
 */
export function splitBlocks(text: string, streaming = false): Segment[] {
  const segments: Segment[] = [];
  const lines = text.split("\n");
  let prose: string[] = [];
  const flush = () => {
    const value = prose.join("\n").trim();
    if (value) segments.push({ kind: "text", text: value });
    prose = [];
  };
  for (let index = 0; index < lines.length; index++) {
    // The whole block on one line: ```forge:tags {"tags": [...]}```
    const inline = lines[index].match(/^ {0,3}`{3,}\s*(forge:[a-z]+)\s+(\{.*\})\s*`{3,}\s*$/);
    if (inline) {
      flush();
      const segment = fenced(inline[1], inline[2]);
      if (segment) segments.push(segment);
      continue;
    }
    const open = lines[index].match(FENCE);
    if (!open) {
      prose.push(lines[index]);
      continue;
    }
    let close = lines.findIndex((line, at) => at > index && new RegExp(`^ {0,3}${open[1]}\`*[ \\t]*$`).test(line));
    let body = lines.slice(index + 1, close).join("\n");
    // Models sometimes close a block on the JSON's last line: {"title": "…"}```
    if (close < 0 && BLOCK_NAMES[open[2].toLowerCase()]) {
      const glued = lines.findIndex((line, at) => at > index && new RegExp(`${open[1]}\\s*$`).test(line));
      if (glued > 0) {
        close = glued;
        body = [...lines.slice(index + 1, glued), lines[glued].replace(new RegExp(`${open[1]}\\s*$`), "")].join("\n");
      }
    }
    if (close < 0) {
      if (streaming) {
        flush();
        segments.push({ kind: "pending", name: BLOCK_NAMES[open[2].toLowerCase()] });
        break;
      }
      prose.push(...lines.slice(index));
      break;
    }
    flush();
    const segment = fenced(open[2], body);
    if (segment) segments.push(segment);
    index = close;
  }
  flush();
  return segments;
}

/** The prose of an answer without its blocks: what the copy action copies. */
export function proseOf(text: string) {
  return splitBlocks(text).filter(segment => segment.kind === "text").map(segment => (segment as { text: string }).text).join("\n\n");
}
