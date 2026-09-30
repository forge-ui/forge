import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, StrictMode, type ComponentProps } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { StreamingAnswer } from "../src/components/ui/agent/streaming-answer";

const nodeProtocol = "node:";
// Keep the node:test import compatible with the existing CJS test bundle.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

type Props = ComponentProps<typeof StreamingAnswer>;

/** Advance animation frames and timers together, without real-time sleeps. */
function setup(initialReducedMotion = false, serverMarkup?: string) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root">${serverMarkup ?? ""}</div></body></html>`, { url: "http://localhost/" });
  const restore: Array<() => void> = [];
  const replace = (object: object, key: string, value: unknown) => {
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    Object.defineProperty(object, key, { configurable: true, writable: true, value });
    restore.push(() => {
      if (descriptor) Object.defineProperty(object, key, descriptor);
      else Reflect.deleteProperty(object, key);
    });
  };
  let now = 1_000;
  let nextId = 0;
  let reducedMotion = initialReducedMotion;
  let mounted = serverMarkup === undefined;
  const listeners = new Set<() => void>();
  const tasks = new Map<number, { due: number; callback: () => void }>();
  const later = (callback: () => void, delay = 0) => {
    const id = ++nextId;
    tasks.set(id, { due: now + Math.max(1, Number(delay) || 0), callback });
    return id;
  };
  const cancel = (id: number) => { tasks.delete(id); };
  const frame = (callback: FrameRequestCallback) => later(() => callback(now), 16);
  const media = {
    get matches() { return reducedMotion; },
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_type: string, callback: () => void) => listeners.add(callback),
    removeEventListener: (_type: string, callback: () => void) => listeners.delete(callback),
    addListener: (callback: () => void) => listeners.add(callback),
    removeListener: (callback: () => void) => listeners.delete(callback),
  };
  for (const [key, value] of Object.entries({
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    self: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    MouseEvent: dom.window.MouseEvent,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  })) replace(globalThis, key, value);
  replace(Date, "now", () => now);
  replace(globalThis.performance, "now", () => now);
  replace(dom.window.performance, "now", () => now);
  replace(dom.window, "matchMedia", () => media);
  for (const target of [globalThis, dom.window]) {
    replace(target, "setTimeout", later);
    replace(target, "clearTimeout", cancel);
    replace(target, "requestAnimationFrame", frame);
    replace(target, "cancelAnimationFrame", cancel);
  }
  let root = serverMarkup === undefined ? createRoot(document.getElementById("root")!) : undefined;
  const hydrationErrors: unknown[] = [];
  const advance = async (milliseconds: number) => {
    const until = now + milliseconds;
    let iterations = 0;
    for (;;) {
      const next = [...tasks].sort((a, b) => a[1].due - b[1].due)[0];
      if (!next || next[1].due > until) break;
      assert.ok(++iterations < 10_000, "animation scheduler must not loop indefinitely");
      now = next[1].due;
      tasks.delete(next[0]);
      await act(async () => next[1].callback());
    }
    now = until;
    await act(async () => {});
  };
  const body = () => document.querySelector<HTMLElement>(".forge-streaming-body")!;
  const text = () => body().textContent ?? "";
  const state = () => document.querySelector(".forge-streaming-answer")?.getAttribute("data-streaming-state");
  const unmount = async () => {
    if (mounted) {
      await act(async () => root?.unmount());
      mounted = false;
    }
  };
  return {
    body, text, state, advance, unmount, hydrationErrors,
    pending: () => tasks.size,
    listeners: () => listeners.size,
    render: (props: Props, key = "answer", strict = false) => act(async () => {
      const answer = <StreamingAnswer {...props} key={key} />;
      root!.render(strict ? <StrictMode>{answer}</StrictMode> : answer);
    }),
    hydrate: (props: Props) => act(async () => {
      root = hydrateRoot(document.getElementById("root")!, <StreamingAnswer {...props} />, {
        onRecoverableError: (error) => hydrationErrors.push(error),
      });
      mounted = true;
    }),
    reduce: (value = true) => act(async () => { reducedMotion = value; listeners.forEach((listener) => listener()); }),
    until: async (predicate: () => boolean, limit = 5_000) => {
      for (let elapsed = 0; !predicate() && elapsed < limit; elapsed += 16) await advance(16);
      assert.ok(predicate(), `condition must be satisfied within ${limit} ms`);
    },
    cleanup: async () => {
      await unmount();
      dom.window.close();
      restore.reverse().forEach((reset) => reset());
    },
  };
}

test("legacy streaming completes after the final fade; static answers preserve their text", async () => {
  const env = setup();
  let completed = 0;
  try {
    const text = "Hello,  world!\nA second line.";
    await env.render({ text });
    assert.equal(env.text(), text);
    assert.equal(env.state(), "complete");

    await env.render({ text, streaming: true, onDone: () => completed++ }, "playback");
    assert.equal(env.state(), "streaming");
    assert.equal(completed, 0);
    await env.until(() => env.text() === text);
    assert.equal(completed, 0, "last text insertion must not finish before its 500 ms fade");
    await env.advance(300);
    assert.equal(completed, 0);
    await env.advance(500);
    assert.equal(env.state(), "complete");
    assert.equal(completed, 1);
    await env.advance(2_000);
    assert.equal(completed, 1);
    await env.render({ text, streaming: true, duration: 0, onDone: () => completed++ }, "instant");
    assert.equal(env.text(), text);
    assert.equal(env.state(), "complete");
    assert.equal(completed, 2);
  } finally { await env.cleanup(); }
});

test("growing streams retain visible nodes and remain busy through a pause in arrivals", async () => {
  const env = setup();
  let completed = 0;
  const props: Props = { text: "Hello world", status: "streaming", followUps: ["Continue"], onDone: () => completed++ };
  try {
    await env.render(props);
    await env.advance(2_000);
    assert.ok(env.text().includes("Hello"));
    assert.ok(props.text.startsWith(env.text()), "the open final word may wait for the next arrival");
    assert.equal(env.state(), "streaming");
    assert.equal(completed, 0);
    assert.equal(document.querySelector("button"), null, "follow-ups wait for the transport to finish");
    const firstWord = [...env.body().querySelectorAll("span")].find((node) => Boolean(node.textContent))!;
    assert.ok(firstWord, "animated text exposes a stable span");
    const visible = env.text();
    await env.render({ ...props, text: `${props.text}\n你好，世界。` });
    assert.ok(env.text().startsWith(visible), "an append must not erase or replay existing text");
    assert.ok(env.body().contains(firstWord), "the first animated span must keep its DOM identity");
    await env.advance(2_000);
    assert.ok(env.text().includes("你好"));
    assert.ok(`${props.text}\n你好，世界。`.startsWith(env.text()));
    assert.ok(env.body().contains(firstWord));
    assert.equal(env.state(), "streaming");
    assert.equal(completed, 0);

    await env.render({ ...props, text: "Hello世" });
    await env.advance(2_000);
    const latinWord = [...env.body().querySelectorAll("span")].find((node) => node.textContent === "Hello")!;
    assert.ok(latinWord);
    await env.render({ ...props, text: "Hello世界" });
    await env.advance(2_000);
    assert.ok(env.body().contains(latinWord), "CJK appended to a Latin word must keep the original word span");
    assert.equal(latinWord.textContent, "Hello", "the existing Latin word must not be split into letters");
    assert.ok("Hello世界".startsWith(env.text()));
  } finally { await env.cleanup(); }
});

test("continuous per-frame appends render before transport completes", async () => {
  for (const format of ["plain", "markdown"] as const) {
    const env = setup();
    const text = "持续追加的中文回答应在接收过程中显示。".repeat(6).slice(0, 100);
    let completed = 0;
    let visible = "";
    let firstProgress = 0;
    try {
      for (let length = 1; length <= text.length; length++) {
        const received = text.slice(0, length);
        await env.render({ text: received, status: "streaming", format, onDone: () => completed++ });
        await env.advance(16);
        assert.ok(env.text().startsWith(visible), "continuous appends must preserve the visible prefix");
        visible = env.text();
        assert.ok(received.startsWith(visible));
        if (length === 20) firstProgress = visible.length;
        assert.equal(env.state(), "streaming");
        assert.equal(completed, 0);
      }
      assert.ok(firstProgress > 0, `${format}: text must appear while an input update arrives every frame`);
      assert.ok(visible.length > firstProgress, `${format}: rendering must continue during uninterrupted arrivals`);
      await env.render({ text, status: "complete", format, onDone: () => completed++ });
      await env.until(() => env.text() === text);
      await env.advance(1_000);
      assert.equal(env.state(), "complete");
      assert.equal(completed, 1);
    } finally { await env.cleanup(); }
  }
});

test("explicit completion drains text, calls the latest onDone once, then enables follow-ups", async () => {
  const env = setup();
  const finished: string[] = [];
  const selected: Array<[string, number]> = [];
  const props: Props = { text: "现在开始逐步显示这段中文回答。", status: "streaming", duration: 500, followUps: ["继续解释"], onDone: () => finished.push("old"), onFollowUp: (text, index) => selected.push([text, index]) };
  try {
    await env.render(props);
    await env.advance(32);
    await env.render({ ...props, status: "complete", onDone: () => finished.push("latest") });
    assert.equal(env.state(), "streaming", "queued text is still busy after the transport finishes");
    await env.until(() => env.text() === props.text);
    assert.equal(finished.length, 0);
    assert.equal(document.querySelector("button"), null);
    await env.advance(1_000);
    assert.equal(env.state(), "complete");
    assert.deepEqual(finished, ["latest"]);
    await act(async () => document.querySelector<HTMLButtonElement>("button")!.click());
    assert.deepEqual(selected, [["继续解释", 0]]);
    await env.render({ ...props, status: "complete", onDone: () => finished.push("rerender") });
    await env.advance(1_000);
    assert.deepEqual(finished, ["latest"]);
  } finally { await env.cleanup(); }
});

test("stopping freezes the visible prefix and a new key starts a fresh playback", async () => {
  const env = setup();
  let completed = 0;
  const props: Props = { text: "这一段回答很长，用于验证停止时已经显示的内容能够保留，剩余内容不会继续出现。".repeat(3), status: "streaming", onDone: () => completed++ };
  try {
    await env.render(props);
    await env.until(() => env.text().length > 0);
    const visible = env.text();
    assert.ok(visible.length < props.text.length);
    await env.render({ ...props, status: "stopped" });
    await env.advance(2_000);
    assert.equal(env.text(), visible);
    assert.equal(env.state(), "stopped");
    await env.render({ ...props, text: `${props.text}仍然不应追加。`, status: "stopped" });
    await env.advance(1_000);
    assert.equal(env.text(), visible);
    assert.equal(completed, 0);
    await env.render({ text: "重新播放", streaming: true, onDone: () => completed++ }, "replay");
    await env.advance(2_000);
    assert.equal(env.text(), "重新播放");
    assert.equal(env.state(), "complete");
    assert.equal(completed, 1);
  } finally { await env.cleanup(); }
});

test("replacing an answer cancels the previous generation and its completion callback", async () => {
  const env = setup();
  const finished: string[] = [];
  try {
    await env.render({ text: "Old answer", streaming: true, onDone: () => finished.push("old") });
    await env.until(() => env.text() === "Old answer");
    await env.render({ text: "新的回答内容", status: "streaming", onDone: () => finished.push("new") });
    assert.equal(env.text().includes("Old"), false);
    await env.advance(2_000);
    assert.ok(env.text().startsWith("新的回答"));
    assert.ok("新的回答内容".startsWith(env.text()));
    assert.equal(finished.length, 0, "old timers must not finish the replacement stream");
    await env.render({ text: "新的回答内容", status: "complete", onDone: () => finished.push("new") });
    await env.advance(1_000);
    assert.equal(env.text(), "新的回答内容");
    assert.deepEqual(finished, ["new"]);
  } finally { await env.cleanup(); }
});

test("motion none and reduced motion show arrivals immediately while keeping an open stream busy", async () => {
  for (const reduced of [false, true]) {
    const env = setup(reduced);
    let completed = 0;
    const props: Props = { text: "立即显示 👩🏽‍💻", status: "streaming", motion: reduced ? "auto" : "none", onDone: () => completed++ };
    try {
      await env.render(props);
      assert.equal(env.text(), props.text);
      assert.equal(env.state(), "streaming");
      assert.equal(completed, 0);
      await env.render({ ...props, text: `${props.text}\n追加内容` });
      assert.equal(env.text(), `${props.text}\n追加内容`);
      assert.equal(completed, 0);
      await env.render({ ...props, text: `${props.text}\n追加内容`, status: "complete" });
      assert.equal(env.state(), "complete");
      assert.equal(completed, 1);
    } finally { await env.cleanup(); }
  }
});

test("restoring motion does not replay an answer already displayed without animation", async () => {
  for (const format of ["plain", "markdown"] as const) {
    for (const preference of ["component", "system"] as const) {
      const env = setup(preference === "system");
      const props: Props = { text: "已显示内容 👩🏽‍💻", status: "streaming", format, motion: preference === "component" ? "none" : "auto" };
      const animatedText = () => env.body().querySelector(".forge-answer-segment, [data-sd-animate]");
      try {
        await env.render(props);
        assert.equal(env.text(), props.text);
        assert.equal(animatedText(), null);
        if (preference === "system") await env.reduce(false);
        await env.render({ ...props, motion: "auto" });
        assert.equal(env.text(), props.text);
        assert.equal(animatedText(), null, `${format}: restoring ${preference} motion must not replay visible text`);
        const appended = `${props.text} 已追加。`;
        await env.render({ ...props, motion: "auto", text: appended });
        assert.equal(env.text(), appended, "the same generation keeps displaying arrivals immediately");
        assert.equal(animatedText(), null);
        assert.equal(env.state(), "streaming");
        await env.advance(1_000);
        assert.equal(animatedText(), null);

        await env.render({ ...props, motion: "auto", text: "这是一段新的回答，将在恢复动效后继续逐步显示。".repeat(3) });
        await env.until(() => animatedText() !== null);
        assert.equal(env.state(), "streaming", "a replacement generation can enable animations again");
      } finally { await env.cleanup(); }
    }
  }
});

test("live reduced motion flushes queued text; StrictMode and unmount leave no duplicate work", async () => {
  const env = setup();
  let completed = 0;
  const props: Props = { text: "实时修改动效偏好时应立即显示全部内容，并正确清理定时器。".repeat(4), status: "streaming", onDone: () => completed++ };
  try {
    await env.render(props, "strict", true);
    await env.advance(32);
    assert.ok(env.text().length < props.text.length);
    await env.reduce();
    assert.equal(env.text(), props.text);
    assert.equal(env.state(), "streaming");
    await env.render({ ...props, status: "complete" }, "strict", true);
    assert.equal(completed, 1);
    await env.advance(2_000);
    assert.equal(completed, 1);
    await env.reduce(false);
    await env.render(props, "unmount-active-stream", true);
    assert.ok(env.pending() > 0, "an active stream has scheduled animation work");
    await env.unmount();
    assert.equal(env.pending(), 0);
    assert.equal(env.listeners(), 0);
    await env.advance(2_000);
    assert.equal(completed, 1);
  } finally { await env.cleanup(); }
});

test("plain streaming keeps whitespace, Markdown symbols, and complete Unicode graphemes", async () => {
  const env = setup();
  const text = "  中文 👩🏽‍💻 👨‍👩‍👧‍👦 🇨🇳 e\u0301\n\n\t**原样保留**  end  ";
  const boundaries = new Set([""]);
  let prefix = "";
  for (const { segment } of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)) {
    prefix += segment;
    boundaries.add(prefix);
  }
  try {
    await env.render({ text, status: "streaming" });
    await env.advance(64);
    assert.ok(boundaries.has(env.text()));
    await env.render({ text, status: "complete" });
    for (let elapsed = 0; env.text() !== text && elapsed < 5_000; elapsed += 16) {
      assert.ok(boundaries.has(env.text()), `visible text must end on a grapheme boundary: ${JSON.stringify(env.text())}`);
      await env.advance(16);
    }
    assert.equal(env.text(), text);
    assert.equal(env.body().querySelector("strong"), null);
  } finally { await env.cleanup(); }
});

test("Markdown renders lists, emphasis and tables while rejecting HTML and dangerous URLs", async () => {
  const env = setup();
  const text = [
    "**Summary**", "", "1. First item", "2. Second item", "",
    "| Name | Value |", "| --- | --- |", "| Example | 42 |", "",
    "[Good](https://example.com/docs)", "[Bad](javascript:alert%281%29)", "[Data](data:text/html,hello)", "",
    '<script>alert("untrusted")</script>', '<img src="x" onerror="alert(1)">',
  ].join("\n");
  try {
    await env.render({ text, status: "complete", format: "markdown" });
    assert.equal(env.body().querySelector('strong, [data-streamdown="strong"]')?.textContent, "Summary");
    assert.equal(env.body().querySelectorAll("ol li").length, 2);
    assert.equal(env.body().querySelector("table tbody td")?.textContent, "Example");
    assert.ok(env.body().querySelector('a[href="https://example.com/docs"]'));
    assert.equal(env.body().querySelector("script, img[onerror], [onclick]"), null);
    for (const anchor of env.body().querySelectorAll("a[href]")) {
      assert.doesNotMatch(anchor.getAttribute("href")!, /^(?:javascript|data|vbscript):/i);
    }
    assert.equal(env.state(), "complete");
  } finally { await env.cleanup(); }
});

test("Markdown animation keeps emoji and combining marks together across appends", async () => {
  const env = setup();
  const text = "**家庭** 👨‍👩‍👧‍👦 👩🏽‍💻 🇨🇳 e\u0301 已收到。 ";
  const graphemes = ["👨‍👩‍👧‍👦", "👩🏽‍💻", "🇨🇳", "e\u0301"];
  const props: Props = { text, status: "streaming", format: "markdown" };
  try {
    await env.render(props);
    await env.advance(2_000);
    const spans = [...env.body().querySelectorAll("[data-sd-animate]")];
    assert.ok(spans.length > 0, "Markdown text must use the configured entrance animation");
    for (const grapheme of graphemes) {
      assert.ok(spans.some((span) => span.textContent?.trim() === grapheme), `one animation span must contain the complete ${grapheme} grapheme; got ${JSON.stringify(spans.map((span) => span.textContent))}`);
    }
    assert.equal(spans.some((span) => /^[\u200d\p{Mark}]+$/u.test(span.textContent ?? "")), false);
    const family = spans.find((span) => span.textContent?.trim() === graphemes[0])!;
    const visible = env.text();
    await env.render({ ...props, text: `${text}现在继续。` });
    assert.ok(env.text().startsWith(visible));
    assert.ok(env.body().contains(family), "appending Markdown must retain the existing animated glyph");
    await env.advance(2_000);
    assert.ok(env.body().contains(family));
    await env.render({ ...props, text: `${text}现在继续。`, status: "complete" });
    await env.advance(1_000);
    assert.equal(env.text(), "家庭 👨‍👩‍👧‍👦 👩🏽‍💻 🇨🇳 e\u0301 已收到。 现在继续。");
    assert.equal(env.state(), "complete");
  } finally { await env.cleanup(); }
});

test("server rendering includes complete history and safely escapes plain text", () => {
  const markup = renderToStaticMarkup(<StreamingAnswer text={'  <script>alert("text")</script>\n中文 👩🏽‍💻'} streaming status="complete" />);
  assert.match(markup, /data-streaming-state="complete"/);
  assert.ok(markup.includes("&lt;script&gt;"));
  assert.ok(markup.includes("中文 👩🏽‍💻"));
  assert.equal(markup.includes("<script>"), false);
  const markdown = renderToStaticMarkup(<StreamingAnswer text="**历史消息**" status="complete" format="markdown" />);
  assert.match(markdown, /<(?:strong|span)[^>]*>历史消息<\/(?:strong|span)>/);
});

test("hydrated playback starts from the server prefix and uses the actual motion preference", async () => {
  for (const reduced of [false, true]) {
    let completed = 0;
    const props: Props = { text: "Hydrated playback fades in over time. 你好，世界。", streaming: true, onDone: () => completed++ };
    const markup = renderToString(<StreamingAnswer {...props} />);
    const env = setup(reduced, markup);
    try {
      assert.equal(env.text(), "", "server playback must not flash the full answer before hydration");
      assert.equal(env.state(), "streaming");
      await env.hydrate(props);
      if (reduced) {
        assert.equal(env.text(), props.text);
        assert.equal(env.state(), "complete");
        assert.equal(completed, 1);
      } else {
        assert.ok(env.text().length < props.text.length);
        assert.equal(env.state(), "streaming");
        assert.equal(completed, 0);
        await env.until(() => env.text().length > 0);
        assert.ok(env.text().length < props.text.length, "hydration must keep gradual playback");
        await env.until(() => env.text() === props.text);
        assert.equal(completed, 0);
        await env.advance(1_000);
        assert.equal(env.state(), "complete");
        assert.equal(completed, 1);
      }
      assert.equal(env.hydrationErrors.length, 0);
    } finally { await env.cleanup(); }
  }
});
