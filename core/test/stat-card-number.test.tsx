import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { StatCard } from "../src/components/ui/stat-card";
import { LineChartStatCard } from "../src/components/ui/line-chart-stat-card";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup(reduced = false) {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  let prefersReduced = reduced;
  const subscribers = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({
    get matches() { return prefersReduced; },
    addEventListener: (_type: string, callback: () => void) => subscribers.add(callback),
    removeEventListener: (_type: string, callback: () => void) => subscribers.delete(callback),
  }) });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Element: dom.window.Element,
    SVGElement: dom.window.SVGElement,
  });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    render: (node: ReactNode) => act(async () => root.render(node)),
    reduce: () => act(async () => { prefersReduced = true; for (const subscriber of subscribers) subscriber(); }),
    close: async () => { await act(async () => root.unmount()); dom.window.close(); },
  };
}

for (const [name, Card] of [["StatCard", StatCard], ["LineChartStatCard", LineChartStatCard]] as const) {
  test(`${name} preserves legacy numeric, string and custom values by default`, () => {
    const numeric = renderToString(<Card title="收入" value={1234.56} />);
    assert.match(numeric, />1234\.56</);
    assert.doesNotMatch(numeric, /data-forge-animated-number/);
    const string = renderToString(<Card title="收入" value="1.28 万" animateValue numberFormat={{ style: "percent" }} />);
    assert.match(string, /1\.28 万/);
    assert.doesNotMatch(string, /data-forge-animated-number/);
    const custom = renderToString(<Card title="收入" value={<strong data-custom-value>待结算</strong>} animateValue />);
    assert.match(custom, /<strong data-custom-value="true">待结算<\/strong>/);
    assert.doesNotMatch(custom, /data-forge-animated-number/);
  });

  test(`${name} formats numbers only when requested and follows locale`, () => {
    const chinese = renderToString(<Card title="收入" value={-1234.56} animateValue numberFormat={{ style: "currency", currency: "CNY" }} />);
    assert.ok(chinese.includes(new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(-1234.56)));
    const english = renderToString(<Card title="Revenue" value={1234.56} locale="en-US" numberFormat={{ style: "currency", currency: "USD" }} />);
    assert.ok(english.includes("$1,234.56"));
    assert.doesNotMatch(english, /transition:transform/);
    const decimal = renderToString(<Card title="数值" value={0.12345} animateValue />);
    assert.match(decimal, /class="sr-only">0\.12345</);
  });

  test(`${name} preserves place-value columns through growth, shrinkage, signs and decimal changes`, async () => {
    const env = await setup();
    try {
      const numberFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
      await env.render(<Card title="数值" value={999.99} animateValue numberFormat={numberFormat} />);
      const units = document.querySelector('[data-number-place="integer-0"]');
      const tenths = document.querySelector('[data-number-place="fraction-0"]');
      const display = () => document.querySelector("[data-forge-animated-number] > .sr-only")!.textContent;
      for (const value of [1000.01, -1000.5, -9.25, 0]) {
        await env.render(<Card title="数值" value={value} animateValue numberFormat={numberFormat} />);
        assert.equal(display(), new Intl.NumberFormat("zh-CN", numberFormat).format(value));
        assert.equal(document.querySelector('[data-number-place="integer-0"]'), units);
        assert.equal(document.querySelector('[data-number-place="fraction-0"]'), tenths);
        assert.equal(document.querySelectorAll('[data-forge-animated-number] > .sr-only').length, 1);
      }
      const column = document.querySelector<HTMLElement>('[data-number-place="integer-0"] > span')!;
      assert.match(column.style.transition, /transform \.9s/);
      await env.reduce();
      assert.equal(column.style.transition, "none");
      await env.render(<Card title="数值" value={1234.5} animateValue numberFormat={numberFormat} />);
      assert.equal(display(), "1,234.50");
      assert.equal(column.style.transition, "none");
    } finally { await env.close(); }
  });

  test(`${name} motion none updates immediately and system reduced motion disables all rolling columns`, async () => {
    for (const reduced of [false, true]) {
      const env = await setup(reduced);
      try {
        const motion = reduced ? "auto" : "none";
        await env.render(<Card title="数值" value={123} animateValue motion={motion} />);
        await env.render(<Card title="数值" value={456} animateValue motion={motion} />);
        assert.equal(document.querySelector(".sr-only")!.textContent, "456");
        for (const column of document.querySelectorAll<HTMLElement>('[data-number-place] > span')) {
          assert.equal(column.style.transition, "none");
        }
        const hundreds = document.querySelector<HTMLElement>('[data-number-place="integer-2"] > span')!;
        assert.equal(hundreds.style.transform, "translateY(-4.8em)");
      } finally { await env.close(); }
    }
  });
}
