import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { ChartHeader } from "../src/components/ui/charts/dashboard-charts";

const nodeProtocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

test("chart header only renders explicitly localized tabs", () => {
  assert.doesNotMatch(renderToStaticMarkup(<ChartHeader title="趋势" />), /<button|Income|Expenses/);
  const markup = renderToStaticMarkup(<ChartHeader title="趋势" tabs={["日", "周", "月"]} />);
  assert.match(markup, /aria-pressed="true"[^>]*>日/);
  assert.match(markup, />月<\/button>/);
  assert.doesNotMatch(renderToStaticMarkup(<ChartHeader title="趋势" tabs={[]} />), /<button/);
});
