import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import { BarChart } from "../src/components/ui/charts/bar-chart";
import { DivergingBarChart, GroupedBarChart } from "../src/components/ui/charts/dashboard-charts";
import { Pagination } from "../src/components/ui/pagination";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const LARGE = 70_000;

test("charts size a large series without overflowing the call stack", () => {
  const diverging = Array.from({ length: LARGE }, (_, index) => ({ label: String(index), upperValue: 1, lowerValue: 2 }));
  assert.doesNotThrow(() => renderToString(<DivergingBarChart data={diverging} />));
  const bars = Array.from({ length: LARGE }, (_, index) => ({ label: String(index), value: index }));
  assert.doesNotThrow(() => renderToString(<BarChart data={bars} />));
});

test("a non-finite reading does not collapse the other bars of a grouped chart", () => {
  const html = renderToString(<GroupedBarChart data={[{ label: "有限", values: [20] }, { label: "缺失", values: [NaN, Infinity, -5] }]} series={[]} />);
  assert.doesNotMatch(html, /height:(?:NaN|Infinity)%/);
  assert.match(html, /height:100%/);
});

test("an empty pagination offers no page buttons", () => {
  const html = renderToString(<Pagination currentPage={1} totalPages={0} />);
  assert.doesNotMatch(html, /第 0 页/);
});
