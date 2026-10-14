"use client";

import { useState, type ReactNode } from "react";
import { BarChart, BarHorizontalChart, Button, DonutChart, MultilayerDonutChart, SmoothLineChart } from "@forge-ui-official/core";
import type { FusionExampleProps, FusionSettings } from "./types";

type Settings = FusionSettings;
const t = (locale: Settings["locale"], zh: string, en: string) => locale === "zh" ? zh : en;
const number = (value: number, locale: Settings["locale"]) => Math.round(value).toLocaleString(locale === "zh" ? "zh-CN" : "en-US");
function Panel({ children }: { children: ReactNode }) { return <div className="flex w-full max-w-lg flex-col gap-5 rounded-xl border border-fg-grey-200 bg-white p-5">{children}</div>; }
function Choices({ labels, selected, onChange, locale, color, motion }: Settings & { labels: string[]; selected: number; onChange: (index: number) => void }) {
  return <div role="group" aria-label={t(locale, "切换数据", "Choose data")} className="flex flex-wrap gap-2">{labels.map((label, index) => <Button key={label} color={color} variant={index === selected ? "secondary" : "tertiary"} size="sm" motion={motion} aria-pressed={index === selected} onClick={() => onChange(index)}>{label}</Button>)}</div>;
}

const SALES = [[32, 45, 38, 52, 61, 74, 58], [210, 245, 198, 276, 302], [1200, 1420, 1080, 1610, 1830, 1700, 2120, 2380, 2210, 2640, 2290, 3100]];
function SalesExample(settings: Settings) {
  const { locale, color, motion } = settings;
  const [period, setPeriod] = useState(0), [active, setActive] = useState<number>(), [pinned, setPinned] = useState<number>();
  const values = SALES[period];
  const labels = values.map((_, index) => period === 0 ? (locale === "zh" ? ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])[index] : period === 1 ? t(locale, `第 ${index + 1} 周`, `W${index + 1}`) : t(locale, `${index + 1} 月`, String(index + 1)));
  const at = active ?? pinned;
  const total = values.reduce((sum, value) => sum + value, 0), mean = total / values.length;
  const current = at === undefined ? total : values[at];
  const delta = at === undefined ? [12, 8, -4][period] : at ? (values[at] / values[at - 1] - 1) * 100 : undefined;
  const top = Math.ceil(Math.max(...values) / 3 / 10) * 30;
  return <Panel><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-fg-grey-500">{at === undefined ? t(locale, "销售额", "Sales") : labels[at]}</p><p className="mt-1 text-3xl font-semibold tabular-nums text-fg-black">¥{number(current * 10000, locale)}</p><p className="text-xs text-fg-grey-500">{delta === undefined ? "—" : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`} {t(locale, "较前期", "vs previous")}</p></div><Choices {...settings} labels={locale === "zh" ? ["周", "月", "年"] : ["W", "M", "Y"]} selected={period} onChange={index => { setPeriod(index); setActive(undefined); setPinned(undefined); }} /></div><div className="pt-6"><BarChart data={values.map((value, index) => ({ value, label: labels[index] }))} accent={color} motion={motion} activeIndex={at} pinnedIndex={pinned} onActiveIndexChange={setActive} onSelect={index => setPinned(current => current === index ? undefined : index)} domain={[0, top]} referenceValue={mean} referenceLabel={t(locale, "均值", "Average")} showLabels showTooltip={at !== undefined} tooltipValue={at === undefined ? undefined : `¥${number(values[at] * 10000, locale)}`} barWidth="wide" height="h-48" ariaLabel={t(locale, "销售额，方向键选择，回车固定", "Sales; arrows to select, Enter to pin")} /></div><p className="text-xs text-fg-grey-500">{t(locale, "悬停查看；点击固定。方向键移动，Home / End 跳到首尾。", "Hover to inspect; click to pin. Arrow keys move, Home / End jump.")}</p></Panel>;
}

function stableSeries(seed: number, first: number, last: number, volatility: number) {
  const random = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let value = Math.imul(seed ^ seed >>> 15, 1 | seed); value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value; return ((value ^ value >>> 14) >>> 0) / 4294967296; };
  const walk = [0]; for (let index = 1; index < 61; index++) walk.push(walk[index - 1] + (random() - .5) * volatility);
  return walk.map((value, index) => Math.round(first + (last - first) * index / 60 + value - walk[60] * index / 60));
}
const PRICES = [stableSeries(7, 52300, 53540, 420), stableSeries(3, 50100, 53540, 700), stableSeries(11, 57900, 53540, 1100), stableSeries(5, 38200, 53540, 2600)];
function PriceExample(settings: Settings) {
  const { locale, color, motion } = settings;
  const [period, setPeriod] = useState(0), [active, setActive] = useState<number>();
  const data = PRICES[period], at = active ?? data.length - 1, value = data[at], difference = value - data[0];
  const names = locale === "zh" ? ["今日", "近一周", "近一月", "近一年"] : ["Today", "Week", "Month", "Year"];
  const eventIndex = [20, 36, 38, 44][period];
  const events = locale === "zh" ? ["成交放量", "产品发布", "业绩发布", "份额拆分"] : ["Volume spike", "Product launch", "Earnings", "Stock split"];
  const label = period === 0 ? `${String(9 + Math.floor(at * 6.5 / 60)).padStart(2, "0")}:${String(Math.round(at * 6.5) % 60).padStart(2, "0")}` : `${names[period]} · ${at + 1}/61`;
  return <Panel><div><p className="text-xs text-fg-grey-500">{active === undefined ? names[period] : label}</p><p className="mt-1 text-3xl font-semibold tabular-nums text-fg-black">¥{number(value, locale)}</p><p className={`text-sm ${difference < 0 ? "text-fg-red" : "text-fg-green-500"}`}>{difference >= 0 ? "+" : ""}{number(difference, locale)} ({(difference / data[0] * 100).toFixed(2)}%)</p></div><div className="pt-5"><SmoothLineChart series={[{ data, fillArea: true }]} accent={color} motion={motion} interpolation="linear" highlightToActive markers={[{ index: eventIndex, label: events[period] }]} activeIndex={at} onActiveIndexChange={setActive} height="h-48" showTooltip={active !== undefined} tooltipItems={[{ color: `bg-fg-${color === "purple" ? "violet" : color}`, value: `¥${number(value, locale)}` }]} ariaLabel={t(locale, "价格走势，左右方向键查看", "Price history; left and right arrows to inspect")} /></div><p role="status" className="text-xs text-fg-grey-500">{Math.abs(at - eventIndex) <= 1 ? `${events[period]} · ` : ""}{label}</p><Choices {...settings} selected={period} labels={names} onChange={index => { setPeriod(index); setActive(undefined); }} /></Panel>;
}

function SpendingExample(settings: Settings) {
  const { locale, color, motion } = settings;
  const values = [4820, 3160, 1280, 890, 650];
  const labels = locale === "zh" ? ["餐饮", "购物", "交通", "订阅", "其他"] : ["Food", "Shopping", "Transport", "Subscriptions", "Other"];
  const [included, setIncluded] = useState(values.map(() => true)), [active, setActive] = useState<number>();
  const [notice, setNotice] = useState("");
  const total = values.reduce((sum, value, index) => sum + (included[index] ? value : 0), 0);
  const toggle = (index: number) => { if (included[index] && included.filter(Boolean).length === 1) { setNotice(t(locale, "至少保留一个分类", "Keep at least one category")); return; } setIncluded(current => current.map((value, i) => i === index ? !value : value)); setActive(undefined); setNotice(""); };
  const selected = active !== undefined && included[active] ? active : undefined;
  return <Panel><div><p className="text-xs text-fg-grey-500">{t(locale, "十月支出", "October spending")}</p><p className="text-base font-semibold text-fg-black">{t(locale, "支出主要用在了哪里？", "Where did most of it go?")}</p></div><DonutChart interactive segments={values.map((value, index) => ({ value, label: labels[index], disabled: !included[index] }))} accent={color} motion={motion} activeIndex={active} onActiveIndexChange={setActive} onSegmentToggle={toggle} centerValue={`¥${number(selected === undefined ? total : values[selected], locale)}`} subtitle={selected === undefined ? t(locale, "已选分类总计", "Selected total") : `${labels[selected]} · ${(values[selected] / total * 100).toFixed(1)}%`} ariaLabel={t(locale, "支出分类，点击环段切换", "Spending categories; click a segment to toggle")} /><div className="flex flex-col gap-1">{labels.map((label, index) => <button key={label} type="button" aria-pressed={included[index]} onClick={() => toggle(index)} onPointerEnter={() => setActive(index)} onPointerLeave={() => setActive(undefined)} onFocus={() => setActive(index)} onBlur={() => setActive(undefined)} className={`flex min-h-9 items-center justify-between rounded-lg px-2 text-sm text-fg-black hover:bg-fg-grey-50 ${included[index] ? "" : "opacity-40"}`}><span>{label}</span><span className="tabular-nums">¥{number(values[index], locale)}</span></button>)}</div><p role="status" className="text-xs text-fg-grey-500">{notice || t(locale, "关闭分类后，剩余环段按比例重新排列。", "Excluded segments shrink; the remaining segments redistribute.")}</p></Panel>;
}

const DAYS = [[.62, .4, .75], [1.04, 1.1, 1], [.88, .7, .92], [1.32, 1.6, 1.08], [.45, .2, .58], [1.12, 1.05, 1.17], [.84, 1.24, .75]];
function ActivityExample(settings: Settings) {
  const { locale, color, motion } = settings;
  const [day, setDay] = useState(6), [active, setActive] = useState<number>();
  const labels = locale === "zh" ? ["活动", "运动", "站立"] : ["Move", "Exercise", "Stand"], units = locale === "zh" ? ["千卡", "分钟", "小时"] : ["kcal", "min", "hr"], goals = [500, 30, 12];
  const weekdays = locale === "zh" ? ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return <Panel><p className="text-base font-semibold text-fg-black">{t(locale, "活动记录", "Activity")} · {weekdays[day]}</p><div className="flex flex-wrap items-center justify-center gap-3"><MultilayerDonutChart sweep={360} layers={DAYS[day].map(value => ({ value: value * 100 }))} accent={color} motion={motion} activeIndex={active} ariaLabel={t(locale, "活动完成度，支持超过目标", "Activity progress including goals exceeded")} /><div className="flex flex-col gap-3">{labels.map((label, index) => <button key={label} type="button" onFocus={() => setActive(index)} onBlur={() => setActive(undefined)} onPointerEnter={() => setActive(index)} onPointerLeave={() => setActive(undefined)} className="rounded-lg p-2 text-left hover:bg-fg-grey-50"><span className="block text-xs text-fg-grey-500">{label}</span><span className="text-sm font-semibold tabular-nums text-fg-black">{Math.round(DAYS[day][index] * goals[index])} / {goals[index]} {units[index]}</span></button>)}</div></div><div role="group" aria-label={t(locale, "选择日期", "Pick a day")} className="flex justify-between gap-1" onKeyDown={event => { const next = event.key === "ArrowLeft" ? day - 1 : event.key === "ArrowRight" ? day + 1 : event.key === "Home" ? 0 : event.key === "End" ? 6 : undefined; if (next === undefined) return; event.preventDefault(); const index = Math.max(0, Math.min(6, next)); setDay(index); event.currentTarget.querySelectorAll<HTMLButtonElement>("button")[index]?.focus(); }}>{weekdays.map((label, index) => <button key={label} type="button" tabIndex={day === index ? 0 : -1} aria-pressed={day === index} className={`rounded-lg px-2 py-2 text-xs ${day === index ? "bg-fg-grey-100 font-semibold text-fg-black" : "text-fg-grey-500"}`} onClick={() => setDay(index)}><svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>{[13, 9, 5].map((radius, ring) => <circle key={ring} cx="16" cy="16" r={radius} fill="none" stroke={`var(--fg-${color === "purple" ? "violet" : color})`} strokeOpacity={1 - ring * .25} strokeWidth="3" pathLength="100" strokeDasharray={`${Math.min(100, DAYS[index][ring] * 100)} 100`} transform="rotate(-90 16 16)" />)}</svg>{label}</button>)}</div><p className="text-xs text-fg-grey-500">{t(locale, "本周三项全部达标：", "All goals completed this week: ")}{DAYS.filter(values => values.every(value => value >= 1)).length}{t(locale, " 天", " days")}</p></Panel>;
}

const USAGE = [[25, 38, 23, 52, 64, 56, 73], [26, 25, 33, 50, 30, 60, 32], [25, 35, 26, 38, 32, 35, 29]];
function StackedExample(settings: Settings) {
  const { locale, color, motion } = settings;
  const [isolated, setIsolated] = useState(-1);
  const labels = locale === "zh" ? ["存储", "接口", "模型"] : ["Storage", "API", "Models"];
  const series = isolated < 0 ? USAGE : [USAGE[isolated]];
  const sum = series.flat().reduce((total, value) => total + value, 0), all = USAGE.flat().reduce((total, value) => total + value, 0);
  return <Panel><SmoothLineChart series={series.map((data, index) => ({ data, fillArea: true, color: `color-mix(in srgb, var(--fg-${color === "purple" ? "violet" : color}) ${[100, 70, 40][isolated < 0 ? index : isolated]}%, white)` }))} stacked={isolated < 0} interpolation="linear" accent={color} motion={motion} yDomain={[0, 180]} height="h-48" xAxisLabels={locale === "zh" ? ["周一", "周四", "周日"] : ["Mon", "Thu", "Sun"]} ariaLabel={t(locale, "累计资源用量", "Stacked resource usage")} /><Choices {...settings} labels={labels} selected={isolated} onChange={index => setIsolated(current => current === index ? -1 : index)} /><p role="status" className="text-center text-sm text-fg-grey-700">{isolated < 0 ? t(locale, "总计", "Total") : labels[isolated]} {sum} GB·h{isolated < 0 ? "" : ` · ${(sum / all * 100).toFixed(1)}%`}</p></Panel>;
}

function TargetExample(settings: Settings) {
  const { locale, color, motion } = settings;
  const [target, setTarget] = useState(70);
  const token = `var(--fg-${color === "purple" ? "violet" : color})`;
  return <Panel><p className="text-sm text-fg-grey-500">{t(locale, "实际", "Actual")} <strong className="text-2xl font-semibold text-fg-black">¥74K</strong></p><div className="py-3"><BarHorizontalChart data={[{ value: 74 }]} accent={color} motion={motion} domain={[0, 100]} target={target} targetLabel={t(locale, `目标 ${target}`, `Target ${target}`)} ranges={[{ to: 50, color: "var(--fg-grey-100)" }, { to: 75, color: `color-mix(in srgb, ${token} 20%, white)` }, { to: 100, color: `color-mix(in srgb, ${token} 35%, white)` }]} barWidth="wide" color="bg-fg-black" /></div><div className="relative h-4 text-xs text-fg-grey-500">{[0, 50, 75, 100].map(value => <span key={value} className="absolute" style={{ left: `${value}%`, transform: value === 0 ? undefined : value === 100 ? "translateX(-100%)" : "translateX(-50%)" }}>{value}</span>)}</div><label className="text-sm text-fg-grey-700">{t(locale, "目标", "Target")} ¥{target}K<input className="mt-2 h-8 w-full" style={{ accentColor: token }} type="range" min={40} max={100} step={2} value={target} onChange={event => setTarget(Number(event.target.value))} aria-label={t(locale, "季度目标（千元）", "Quarterly target (K)")} /></label><p role="status" className="text-xs text-fg-grey-500">{t(locale, "较目标", "vs target")} {74 - target >= 0 ? "+" : "−"}¥{Math.abs(74 - target)}K · {(74 / target * 100).toFixed(1)}%</p></Panel>;
}

function ForecastExample(settings: Settings) {
  const { locale, color, motion } = settings;
  const [confidence, setConfidence] = useState(0);
  const data = [31, 58, 46, 77, 73, 91, 103, 120];
  const margin = confidence === 0 ? 14 : 26;
  const lower = data.map((value, index) => value - Math.max(0, index - 4) / 3 * margin), upper = data.map((value, index) => value + Math.max(0, index - 4) / 3 * margin);
  return <Panel><SmoothLineChart series={[{ data, fillArea: false, forecastFrom: 4 }]} bands={[{ lower, upper }]} accent={color} motion={motion} interpolation="linear" yDomain={[0, 160]} height="h-48" xAxisLabels={locale === "zh" ? ["历史", "今天", "4 周后"] : ["Observed", "Today", "4 weeks"]} ariaLabel={t(locale, "预测与置信区间", "Forecast and confidence interval")} /><Choices {...settings} labels={locale === "zh" ? ["80% 区间", "95% 区间"] : ["80% interval", "95% interval"]} selected={confidence} onChange={setConfidence} /><p role="status" className="text-center text-sm text-fg-grey-700">{t(locale, "预测", "Forecast")} 120 · {120 - margin}–{120 + margin}</p></Panel>;
}

export function ChartExamples(props: FusionExampleProps) {
  const demos = { "095": SalesExample, "096": PriceExample, "097": SpendingExample, "099": ActivityExample, "157": StackedExample, "163": TargetExample, "165": ForecastExample };
  const Demo = demos[props.id as keyof typeof demos];
  return Demo ? <Demo {...props} /> : null;
}
