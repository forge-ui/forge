import { BLOCK_OF, uiSchemas, uiToolNames, type UiToolName } from "./schema";

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
  | { kind: "code"; language: string; code: string };

const SHELL = new Set(["bash", "sh", "shell", "zsh", "console", "terminal"]);
const FENCE = /^ {0,3}(`{3,})[ \t]*([^\s`]*)[^\n]*$/;

function blockInput(name: UiToolName, body: string): unknown {
  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    return undefined;
  }
  // A bare list is the obvious shorthand for follow-up questions.
  if (name === "suggest_followups" && Array.isArray(value)) value = { questions: value };
  const parsed = uiSchemas[name].safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

function fenced(language: string, body: string): Segment | undefined {
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
 * Splits an answer into text, components and code. While `streaming`, an unclosed fence at the end is
 * held back until it closes, so half a block never renders.
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
    const open = lines[index].match(FENCE);
    if (!open) {
      prose.push(lines[index]);
      continue;
    }
    const close = lines.findIndex((line, at) => at > index && new RegExp(`^ {0,3}${open[1]}\`*[ \\t]*$`).test(line));
    if (close < 0) {
      if (streaming) break;
      prose.push(...lines.slice(index));
      break;
    }
    flush();
    const segment = fenced(open[2], lines.slice(index + 1, close).join("\n"));
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
