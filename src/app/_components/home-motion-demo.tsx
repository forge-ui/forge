"use client";

import { Accordion, Button, ProgressBar, Toggle } from "@forge-ui-official/core";

const effects = [
  { effect: "glass", label: "玻璃", color: "blue", variant: "primary" },
  { effect: "magnetic", label: "跟随", color: "black", variant: "primary" },
  { effect: "ripple", label: "涟漪", color: "blue", variant: "secondary" },
  { effect: "roll", label: "文字切换", color: "black", variant: "tertiary" },
] as const;

export function HomeMotionDemo() {
  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-fg-black">动效</p>
        <p className="text-sm leading-6 text-fg-grey-700">
          悬停或点击下面的按钮。系统开启减弱动效时，这些动画会停掉。
        </p>
      </div>
      <div className="flex min-w-0 flex-wrap gap-3">
        {effects.map((item) => (
          <Button
            key={item.effect}
            effect={item.effect}
            color={item.color}
            variant={item.variant}
            size="md"
            motion="auto"
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-4 border-t border-fg-grey-200 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-fg-black">通知</span>
          <Toggle defaultChecked color="blue" size="sm" ariaLabel="通知" motion="auto" />
        </div>
        <ProgressBar value={72} color="blue" label="同步" showPercentage motion="auto" />
        <Accordion
          motion="auto"
          items={[
            {
              value: "panel",
              title: "折叠面板",
              content: <p className="text-sm leading-6 text-fg-grey-700">展开和收起使用同一套动效。</p>,
            },
          ]}
        />
      </div>
    </div>
  );
}
