import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { DonutChart } from "../src/components/ui/charts/donut-chart";
import { PieChart } from "../src/components/ui/charts/pie-chart";
import { buildConicGradient } from "../src/components/ui/charts/chart-utils";

const nodeProtocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

test("composition gradients resolve the legacy green alias for count data", () => {
  const segments = [257, 255, 253, 255].map((value, index) => ({ value, color: ["var(--fg-blue)", "var(--fg-green)", "var(--fg-yellow)", "var(--fg-violet)"][index] }));
  const gradient = buildConicGradient(segments);
  assert.match(gradient, /var\(--fg-green-500\)/);
  assert.doesNotMatch(gradient, /var\(--fg-green\)/);
  assert.match(gradient, /100%/);
  for (const Chart of [DonutChart, PieChart]) {
    const markup = renderToStaticMarkup(<Chart segments={segments} />);
    assert.match(markup, /conic-gradient/);
    assert.doesNotMatch(markup, /var\(--fg-green\)/);
    assert.match(renderToStaticMarkup(<Chart segments={[]} />), /var\(--fg-grey-200\)/);
  }
});
