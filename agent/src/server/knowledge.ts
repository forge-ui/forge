import { createUIMessageStream, createUIMessageStreamResponse, generateId, tool, type ToolSet } from "ai";
import { z } from "zod";
import { normalizeRequest } from "../request";

/**
 * Background the agent can look up. Only `id`, `title` and `summary` are in every prompt; the content is
 * read when the model asks for it, or loaded up front when the user's message matches `match`.
 */
export type Topic = {
  /** Letters, digits and hyphens, e.g. "quick-start". */
  id: string;
  title: string;
  /** One line on what the topic answers; the model picks topics by it. */
  summary: string;
  /** The full text. A function is called only when the topic is read. */
  content: string | (() => string | Promise<string>);
  /** Patterns on the user's latest message that load this topic with the request, saving a round. Keep them specific. */
  match?: (string | RegExp)[];
};

/** A fixed reply for a fixed question, e.g. the suggested prompts. Sent without calling the model. */
export type CannedAnswer = { question: string; answer: string };

/** Notes for the page the user is on, keyed by path; a key ending in `/*` covers the paths under it. */
export type PageInstructions = Record<string, string> | ((path: string) => string | undefined | null);

const TOPIC_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_CONTENT = 8000;

const clip = (text: string, max: number) => (text.length > max ? text.slice(0, max) + "\n…（后面省略）" : text);

export function checkTopics(topics: Topic[]) {
  const seen = new Set<string>();
  for (const topic of topics) {
    if (!TOPIC_ID.test(topic.id)) throw new Error(`Topic id "${topic.id}" must use lowercase letters, digits and hyphens`);
    if (seen.has(topic.id)) throw new Error(`Duplicate topic id "${topic.id}"`);
    seen.add(topic.id);
  }
}

export function pageInstructionsFor(source: PageInstructions | undefined, path: unknown) {
  if (!source || typeof path !== "string" || !path.startsWith("/")) return undefined;
  const pathname = path.split(/[?#]/)[0];
  if (typeof source === "function") return source(pathname) || undefined;
  if (Object.hasOwn(source, pathname)) return source[pathname];
  // The longest matching prefix wins, so "/docs/theme/*" beats "/docs/*".
  const prefix = Object.keys(source)
    .filter(key => key.endsWith("/*") && (pathname === key.slice(0, -2) || pathname.startsWith(key.slice(0, -1))))
    .sort((left, right) => right.length - left.length)[0];
  return prefix ? source[prefix] : undefined;
}

export function topicCatalog(topics: Topic[]) {
  if (!topics.length) return "";
  return `可查阅的资料（回答相关问题前先用 read_topic 读全文，比检索更快更准；资料里没有的再用其他工具）：\n${topics.map(topic => `- ${topic.id}：${topic.title}。${topic.summary}`).join("\n")}`;
}

async function contentOf(topic: Topic) {
  const content = typeof topic.content === "function" ? await topic.content() : topic.content;
  return clip(content.trim(), MAX_CONTENT);
}

export function topicTool(topics: Topic[]): ToolSet {
  if (!topics.length) return {};
  const ids = topics.map(topic => topic.id) as [string, ...string[]];
  return {
    read_topic: tool({
      description: "读取一份资料的全文。id 用资料目录里的编号。",
      inputSchema: z.object({ id: z.enum(ids) }),
      execute: async ({ id }) => {
        const topic = topics.find(item => item.id === id)!;
        try {
          return { title: topic.title, content: await contentOf(topic) };
        } catch (error) {
          return { error: `资料暂时读不到：${error instanceof Error ? error.message : String(error)}` };
        }
      },
    }),
  };
}

const hits = (topic: Topic, question: string) =>
  (topic.match ?? []).filter(pattern => (typeof pattern === "string" ? question.includes(pattern.toLowerCase()) : pattern.test(question))).length;

/** The topic the question plainly asks about, loaded now so the model can answer in its first step. */
export async function matchedTopic(topics: Topic[], question: string) {
  const text = question.toLowerCase();
  const best = topics.map(topic => ({ topic, score: hits(topic, text) })).filter(item => item.score > 0).sort((left, right) => right.score - left.score)[0];
  if (!best) return "";
  try {
    return `与这个问题直接相关的资料（已经读好，不必再调用 read_topic）：\n## ${best.topic.title}\n${await contentOf(best.topic)}`;
  } catch {
    // The model can still read it through read_topic, which reports the failure.
    return "";
  }
}

export function cannedAnswer(answers: CannedAnswer[], question: string) {
  const wanted = normalizeRequest(question);
  return answers.find(item => normalizeRequest(item.question) === wanted)?.answer;
}

/** Streams a fixed answer in the same format as a model reply. */
export function cannedResponse(answer: string) {
  const id = generateId();
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "start-step" });
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: answer });
      writer.write({ type: "text-end", id });
      writer.write({ type: "finish-step" });
      writer.write({ type: "finish" });
    },
  });
  return createUIMessageStreamResponse({ stream });
}
