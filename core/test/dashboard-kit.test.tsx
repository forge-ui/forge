import { createHash } from "node:crypto";
import defaults from "./fixtures/dashboard-defaults.json";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Panel } from "../src/components/ui/panel";
import { ChartHeader, ChartMetricRow, GroupedBarChart, DivergingBarChart } from "../src/components/ui/charts/dashboard-charts";
import { WalletGoalCard } from "../src/components/ui/wallet-goal-card";
import { StatCard } from "../src/components/ui/stat-card";
import { ProgressStatCard } from "../src/components/ui/progress-stat-card";
import { LineChartStatCard } from "../src/components/ui/line-chart-stat-card";
import { BarChartStatCard } from "../src/components/ui/bar-chart-stat-card";
import { WheelChartStatCard } from "../src/components/ui/wheel-chart-stat-card";
import { BalanceCard } from "../src/components/ui/balance-card";
import { ImageStatCard } from "../src/components/ui/image-stat-card";
import { HighlightCard } from "../src/components/ui/highlight-card";
import { ListGroup } from "../src/components/ui/list-group";
import type { CardDensity } from "../src/components/ui/card-utils";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(protocol + "test");

function parse(node: ReactNode) {
  return new JSDOM(renderToStaticMarkup(node)).window.document;
}

test("Panel preserves direct content, attributes, slots and both shell variants", () => {
  const document = parse(<Panel title="经营分析" subtitle="本月" action={<button>导出</button>} footer={<small>更新时间</small>} data-testid="panel"><section>内容</section></Panel>);
  const panel = document.querySelector('[data-testid="panel"]')!;
  assert.match(panel.className, /rounded-3xl.*p-4.*gap-4/);
  assert.equal(panel.children.length, 3);
  assert.equal(panel.children[1].tagName, "SECTION");
  assert.equal(panel.querySelector("h2")?.textContent, "经营分析");
  assert.equal(panel.querySelector("button")?.textContent, "导出");
  assert.equal(panel.lastElementChild?.textContent, "更新时间");
  const template = parse(<Panel variant="template" title="详情">内容</Panel>);
  assert.match(template.body.firstElementChild!.className, /rounded-card.*p-6.*gap-6/);
  assert.equal(parse(<Panel gap="none">内容</Panel>).body.firstElementChild!.children.length, 0);
  assert.doesNotMatch(parse(<Panel gap="none">内容</Panel>).body.firstElementChild!.className, /gap-/);
  assert.match(parse(<Panel gap="sm">内容</Panel>).body.firstElementChild!.className, /gap-3/);
});

const families: [string, (density?: CardDensity) => ReactNode, string][] = [
  ["StatCard", (density) => <StatCard title="收入" value="100" density={density} />, "p-4"],
  ["ProgressStatCard", (density) => <ProgressStatCard title="收入" value="100" density={density} />, "p-4"],
  ["LineChartStatCard", (density) => <LineChartStatCard title="收入" value="100" density={density} />, "p-4"],
  ["BarChartStatCard", (density) => <BarChartStatCard title="收入" value="100" density={density} />, "p-4"],
  ["WheelChartStatCard", (density) => <WheelChartStatCard title="收入" value="100" density={density} />, "p-4"],
  ["BalanceCard", (density) => <BalanceCard balance="100" density={density} />, "p-4"],
  ["ImageStatCard", (density) => <ImageStatCard title="收入" value="100" density={density} />, "p-4"],
  ["HighlightCard", (density) => <HighlightCard title="收入" image="/image.png" density={density} />, "h-96"],
  ["ListGroup", (density) => <ListGroup title="收入" items={<span>记录</span>} density={density} />, "px-4 pt-4"],
];

for (const [name, render, compactClass] of families) {
  test(name + " keeps omitted density equal to default and exposes compact without important overrides", () => {
    assert.equal(renderToStaticMarkup(render()), renderToStaticMarkup(render("default")));
    const compact = renderToStaticMarkup(render("compact"));
    assert.ok(compact.includes(compactClass));
    assert.notEqual(compact, renderToStaticMarkup(render("default")));
    assert.doesNotMatch(compact, /![a-z]/);
  });
}

test("charts retain axes, series, tooltip, labels and empty-data safety", () => {
  const grouped = parse(<GroupedBarChart data={[{ label: "十一月", values: [50, 100] }]} series={[{ label: "收入", colorClass: "bg-fg-blue" }, { label: "利润", colorClass: "bg-fg-green" }]} activeIndex={0} tooltipItems={[{ label: "收入", value: "50", colorClass: "bg-fg-blue", trend: "up" }]} />);
  assert.ok(grouped.body.textContent?.includes("十一月"));
  assert.ok(grouped.querySelector('[style="height:50%"]'));
  assert.ok(grouped.querySelector('[style="height:100%"]'));
  assert.match(grouped.body.textContent!, /收入/);
  assert.doesNotMatch(renderToStaticMarkup(<GroupedBarChart data={[]} series={[]} />), /NaN|Infinity/);
  const diverging = renderToStaticMarkup(<DivergingBarChart data={[{ label: "周一", upperValue: 100, lowerValue: 50 }]} upperLabel="收入" lowerLabel="支出" />);
  assert.match(diverging, /height:42%/);
  assert.match(diverging, /height:21%/);
  assert.match(diverging, /收入/);
  assert.match(diverging, /支出/);
  assert.doesNotMatch(renderToStaticMarkup(<DivergingBarChart data={[]} />), /NaN|Infinity/);
  assert.match(renderToStaticMarkup(<ChartMetricRow series={[{ label: "增长", colorClass: "bg-fg-green", value: "100", trend: "up", trendValue: "25%" }]} />), /25%/);
});

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement });
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}

test("ChartHeader supports controlled and uncontrolled interaction", async () => {
  const environment = await setup();
  try {
    const selected: string[] = [];
    await environment.render(<ChartHeader title="趋势" tabs={["全部", "收入"]} defaultTab="全部" onTabChange={(tab) => selected.push(tab)} />);
    const buttons = document.querySelectorAll("button");
    assert.equal(buttons[0].getAttribute("aria-pressed"), "true");
    await act(async () => buttons[1].click());
    assert.equal(buttons[1].getAttribute("aria-pressed"), "true");
    assert.deepEqual(selected, ["收入"]);
    await environment.render(<ChartHeader title="趋势" tabs={["全部", "收入"]} activeTab="全部" onTabChange={(tab) => selected.push(tab)} />);
    await act(async () => document.querySelectorAll("button")[1].click());
    assert.equal(document.querySelectorAll("button")[0].getAttribute("aria-pressed"), "true");
    await environment.render(<ChartHeader title="趋势" action={<button>自定义操作</button>} />);
    assert.equal(document.querySelectorAll("button").length, 1);
  } finally { await environment.close(); }
});

test("WalletGoalCard preserves optional actions and invokes localized callbacks", async () => {
  const environment = await setup();
  try {
    const actions: string[] = [];
    const props = { title: "储蓄", date: "十一月", amount: "100", progress: 50, progressColor: "purple" as const };
    await environment.render(<WalletGoalCard {...props} />);
    assert.doesNotMatch(document.body.textContent!, /Top Up|Withdraw/);
    await environment.render(<WalletGoalCard {...props} showActions topUpLabel="存入" withdrawLabel="取出" onTopUp={() => actions.push("top-up")} onWithdraw={() => actions.push("withdraw")} />);
    for (const label of ["存入", "取出"]) {
      const button = Array.from(document.querySelectorAll("button")).find((item) => item.textContent === label)!;
      assert.ok(button);
      await act(async () => button.click());
    }
    assert.deepEqual(actions, ["top-up", "withdraw"]);
  } finally { await environment.close(); }
});

const defaultComponents = { StatCard, ProgressStatCard, LineChartStatCard, BarChartStatCard, WheelChartStatCard, BalanceCard, ImageStatCard, HighlightCard, ListGroup };

test("all 81 default card combinations retain exact pre-migration markup", () => {
  for (const entry of defaults.cases) {
    const Component = defaultComponents[entry.name as keyof typeof defaultComponents] as (props: Record<string, unknown>) => ReactNode;
    const markup = renderToStaticMarkup(<Component title="Title" subtitle="Subtitle" value="100" balance="100" image="/image.png" items="List" size={entry.size} theme={entry.theme} trend="10%" avatars={["/avatar.png"]} />);
    assert.equal(createHash("sha256").update(markup).digest("hex"), entry.sha256, entry.name + "/" + entry.size + "/" + entry.theme);
  }
});
