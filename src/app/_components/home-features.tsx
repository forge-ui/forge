"use client";

import { useState } from "react";
import {
  Button,
  ColorPicker,
  ColorSwatch,
  ProgressBar,
  StatCard,
  TextField,
  Toggle,
  type ButtonColor,
  type ProgressColor,
} from "@forge-ui-official/core";
import type { CardTheme } from "@forge-ui-official/core";

const tones: {
  name: string;
  token: string;
  hex: string;
  tone: "dark" | "light";
  dot: string;
  button: ButtonColor;
  card: CardTheme;
  bar: ProgressColor;
}[] = [
  { name: "蓝", token: "--fg-blue", hex: "#3553FF", tone: "light", dot: "bg-fg-blue", button: "blue", card: "blue", bar: "blue" },
  { name: "绿", token: "--fg-green-500", hex: "#09B96D", tone: "light", dot: "bg-fg-green-500", button: "green", card: "green", bar: "green" },
  { name: "红", token: "--fg-red", hex: "#FE4A23", tone: "light", dot: "bg-fg-red", button: "red", card: "red", bar: "red" },
  { name: "黑", token: "--fg-black", hex: "#000A19", tone: "light", dot: "bg-fg-black", button: "black", card: "black", bar: "black" },
];

export function ThemeDemo() {
  const [index, setIndex] = useState(0);
  const tone = tones[index] ?? tones[0];

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-fg-black">点一个色点</p>
        <ColorPicker
          colors={tones.map((item) => item.dot)}
          selectedIndex={index}
          onChange={setIndex}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {tones.map((item, itemIndex) => (
          <button
            key={item.token}
            type="button"
            onClick={() => setIndex(itemIndex)}
            className={
              itemIndex === index
                ? "rounded-xl border-0 bg-transparent p-0 outline outline-2 outline-offset-2 outline-fg-black"
                : "rounded-xl border-0 bg-transparent p-0"
            }
            aria-pressed={itemIndex === index}
            aria-label={`${item.name} ${item.hex}`}
          >
            <ColorSwatch label={item.name} hex={item.hex} tone={item.tone} size="sm" />
          </button>
        ))}
      </div>
      <p className="font-mono text-xs leading-5 text-fg-grey-900">
        {tone.token} · {tone.hex}
      </p>
      <div className="grid min-w-0 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="flex min-w-0 flex-col gap-3">
          <Button color={tone.button} size="md">保存设置</Button>
          <ProgressBar value={64} color={tone.bar} label="同步" showPercentage motion="auto" />
        </div>
        <StatCard
          title="本月回款"
          value="128,400"
          trend="12%"
          subtitle="较上月"
          theme={tone.card}
          size="sm"
          density="compact"
          width="full"
          motion="auto"
        />
      </div>
    </div>
  );
}

export function MotionDemo() {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl bg-[#eef2ff] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-8 -top-10 size-40 rounded-full bg-[#c9d4ff] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-12 right-0 size-40 rounded-full bg-[#d7f6f4] blur-3xl" aria-hidden />
      <div className="relative flex min-w-0 flex-col gap-4">
        <p className="text-sm leading-6 text-fg-grey-900">悬停看玻璃和跟随，点击看涟漪。</p>
        <div className="flex min-w-0 flex-wrap gap-3">
          <Button effect="glass" color="black" variant="secondary" size="md" motion="auto">玻璃</Button>
          <Button effect="magnetic" color="black" size="md" motion="auto">跟随</Button>
          <Button effect="ripple" color="blue" size="md" motion="auto">涟漪</Button>
        </div>
      </div>
    </div>
  );
}

export function A11yDemo() {
  const [name, setName] = useState("林可");
  const [mail, setMail] = useState(true);

  return (
    <form className="flex min-w-0 flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
      <TextField label="姓名" value={name} onChange={setName} />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-fg-black">邮件通知</span>
        <Toggle checked={mail} onChange={setMail} color="blue" ariaLabel="邮件通知" motion="auto" />
      </div>
      <p className="text-sm leading-6 text-fg-grey-900" aria-live="polite">
        {name}，邮件通知{mail ? "开" : "关"}。用 Tab 可以走到输入框、开关和按钮。
      </p>
      <div>
        <Button type="submit" color="black" size="md">保存</Button>
      </div>
    </form>
  );
}
