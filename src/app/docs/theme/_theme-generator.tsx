"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  SelectOption,
  Checkbox,
  ProgressBar,
  StatusBadge,
  SurfaceCard,
  TextField,
  Toggle,
  cn,
} from "@forge-ui-official/core";
import {
  COLOR_PRESETS,
  DEFAULT_THEME,
  FONT_PRESETS,
  RADIUS_PRESETS,
  fontPreset,
  generateScale,
  normalizeHex,
  previewVariables,
  radiusValues,
  themeCss,
} from "@/lib/theme.mjs";
import { CodeBlock } from "../ui-for-agents/_code-block";

type Scale = Record<number, string>;

const ORDERS = [
  { name: "华东分销中心", initials: "华", status: "待发货", amount: "¥ 12,480" },
  { name: "星河零售", initials: "星", status: "已完成", amount: "¥ 8,960" },
  { name: "北辰科技", initials: "北", status: "待发货", amount: "¥ 3,215" },
];

export function ThemeGenerator({ reference }: { reference: Scale }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [hexDraft, setHexDraft] = useState(DEFAULT_THEME.color);
  const [tab, setTab] = useState(0);
  const [notify, setNotify] = useState(true);

  const scale = useMemo(() => generateScale(theme.color, reference), [theme.color, reference]);
  const variables = useMemo(() => previewVariables(theme, reference) as CSSProperties, [theme, reference]);
  const css = useMemo(() => themeCss(theme, reference), [theme, reference]);
  const font = fontPreset(theme.font);
  const cardRadius = radiusValues(theme.radius).card;

  const setColor = (value: string) => {
    setHexDraft(value);
    const hex = normalizeHex(value);
    if (hex) setTheme((current) => ({ ...current, color: hex }));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="flex flex-col gap-7">
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold text-fg-black">主色</legend>
            {/* px-1 leaves room for the selected swatch's offset outline. */}
            <div className="flex flex-wrap gap-2 px-1 py-1">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={theme.color === preset.value}
                  aria-label={preset.label}
                  title={preset.label}
                  onClick={() => setColor(preset.value)}
                  className={cn(
                    "size-9 rounded-full outline outline-2 outline-offset-2 transition",
                    theme.color === preset.value ? "outline-fg-black" : "outline-transparent hover:outline-fg-grey-300",
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
            <div className="flex items-end gap-2">
              <TextField
                label="自定义色值"
                value={hexDraft}
                onChange={setColor}
                state={normalizeHex(hexDraft) ? undefined : "error"}
                errorMessage={normalizeHex(hexDraft) ? undefined : "填 6 位色值，如 #3553FF"}
                className="flex-1"
              />
              <input
                type="color"
                aria-label="选择颜色"
                value={theme.color}
                onChange={(event) => setColor(event.target.value.toUpperCase())}
                className="mb-1 size-11 shrink-0 cursor-pointer rounded-lg border border-fg-grey-200 bg-background p-1"
              />
            </div>
            <div className="flex overflow-hidden rounded-lg" aria-label="生成的色阶">
              {Object.entries(scale).map(([step, value]) => (
                <div key={step} title={`${step} ${value}`} className="h-6 flex-1" style={{ backgroundColor: value }} />
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold text-fg-black">圆角</legend>
            <div className="-mx-1 max-w-full overflow-x-auto px-1 py-1">
              <ButtonGroup
                items={RADIUS_PRESETS.map((preset) => ({ label: preset.label }))}
                activeIndex={RADIUS_PRESETS.findIndex((preset) => preset.id === theme.radius)}
                onChange={(index) => setTheme((current) => ({ ...current, radius: RADIUS_PRESETS[index].id }))}
                ariaLabel="圆角"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold text-fg-black">字体</legend>
            <SelectOption
              type="single"
              width="100%"
              options={FONT_PRESETS.map((preset) => ({ value: preset.id, label: preset.label }))}
              value={theme.font}
              onChange={(value: string) => setTheme((current) => ({ ...current, font: value as typeof current.font }))}
            />
            {font.note && <p className="text-xs leading-5 text-fg-grey-700">{font.note}</p>}
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold text-fg-black">预览</legend>
            <ButtonGroup
              items={[{ label: "浅色" }, { label: "深色" }]}
              activeIndex={theme.mode === "dark" ? 1 : 0}
              onChange={(index) => setTheme((current) => ({ ...current, mode: index === 1 ? "dark" : "light" }))}
              ariaLabel="预览模式"
            />
          </fieldset>

          <Button
            variant="secondary"
            color="black"
            size="sm"
            className="self-start"
            onClick={() => {
              setTheme(DEFAULT_THEME);
              setHexDraft(DEFAULT_THEME.color);
            }}
          >
            恢复默认
          </Button>
        </div>

        <div data-theme={theme.mode} className="forge-theme-preview min-w-0 rounded-card bg-fg-grey-50 p-4 font-sans sm:p-6" style={variables}>
          <style>{`.forge-theme-preview .rounded-card { border-radius: ${cardRadius}px; }`}</style>
          <SurfaceCard
            title="本周订单"
            subtitle="按下单时间倒序"
            action={<Button size="sm">新建订单</Button>}
          >
            <div className="flex flex-col gap-5">
              <ButtonGroup items={[{ label: "全部" }, { label: "待发货" }, { label: "已完成" }]} activeIndex={tab} onChange={setTab} ariaLabel="订单状态" />
              <ul className="flex flex-col divide-y divide-fg-grey-200">
                {ORDERS.map((order) => (
                  <li key={order.name} className="flex items-center gap-3 py-3">
                    <Avatar initials={order.initials} size="sm" color="blue" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg-black">{order.name}</span>
                    <StatusBadge label={order.status} color={order.status === "已完成" ? "green" : "blue"} />
                    <span className="w-20 text-right text-sm tabular-nums text-fg-grey-900">{order.amount}</span>
                  </li>
                ))}
              </ul>
              <ProgressBar value={68} label="本月目标" showPercentage color="blue" />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="客户名称" placeholder="输入客户名称" />
                <TextField label="联系邮箱" placeholder="name@company.com" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-3 text-sm text-fg-grey-900">
                  <Toggle checked={notify} onChange={setNotify} ariaLabel="发货后通知客户" />
                  发货后通知客户
                </label>
                <label className="flex items-center gap-2 text-sm text-fg-grey-900">
                  <Checkbox defaultChecked />
                  同步到财务
                </label>
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="tertiary">取消</Button>
                <Button variant="secondary">存为草稿</Button>
                <Button>提交订单</Button>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>

      <CodeBlock code={css} lang="css" label="生成的 CSS" />
    </div>
  );
}
