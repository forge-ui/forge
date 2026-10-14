/** Geometry is kept independent of presentation so domains, stacking and intervals agree. */
export type ChartPoint = [number, number];
export function chartDomain(values: number[], domain?: [number, number]): [number, number] {
  if (domain && Number.isFinite(domain[0]) && Number.isFinite(domain[1]) && domain[1] > domain[0]) return domain;
  const valid = values.filter(Number.isFinite);
  const min = valid.length ? Math.min(...valid) : 0, max = valid.length ? Math.max(...valid) : 1;
  return min === max ? min > 0 ? [0, max] : min < 0 ? [min - Math.abs(min) * .1, max + Math.abs(max) * .1] : [0, 1] : [min, max];
}
export function chartPoints(data: number[], domain: [number, number], width = 400, height = 120): ChartPoint[] {
  const [min, max] = chartDomain(data, domain);
  return data.map((value, index) => [data.length === 1 ? width / 2 : index / Math.max(1, data.length - 1) * width, height - (Math.max(min, Math.min(max, Number.isFinite(value) ? value : min)) - min) / (max - min) * height]);
}
export function linePath(points: ChartPoint[]) { return points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" "); }
export function bandPath(upper: ChartPoint[], lower: ChartPoint[]) { return upper.length && upper.length === lower.length ? `${linePath(upper)} ${linePath([...lower].reverse()).replace(/^M/, "L")} Z` : ""; }
export function stackedBounds(series: number[][]) {
  const totals: number[] = [];
  return series.map(values => { const lower = values.map((_, index) => totals[index] ?? 0); const upper = values.map((value, index) => totals[index] = lower[index] + Math.max(0, Number.isFinite(value) ? value : 0)); return { lower, upper }; });
}
export function ringFractions(values: number[]) { const valid = values.map(value => Math.max(0, Number.isFinite(value) ? value : 0)); const total = valid.reduce((sum, value) => sum + value, 0); let start = 0; return valid.map(value => { const fraction = total ? value / total : 0; const result = { start, fraction }; start += fraction; return result; }); }
