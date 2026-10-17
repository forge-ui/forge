"use client";

import { useState } from "react";
import { Button, Toggle } from "@forge-ui-official/core";

export function ToggleMotionPreview({ locale, color, motion }: {
  locale: "zh" | "en";
  color: "blue" | "purple" | "black";
  motion: "auto" | "none";
}) {
  const [quiet, setQuiet] = useState(false);
  const [digest, setDigest] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const zh = locale === "zh";
  const rows = [
    {
      label: zh ? "免打扰" : "Do not disturb",
      description: quiet
        ? (zh ? "暂停声音提醒，消息仍会保留。" : "Sound alerts are paused. Messages are still saved.")
        : (zh ? "新消息到达时播放提醒。" : "Play a sound when new messages arrive."),
      checked: quiet, onChange: setQuiet, size: "md" as const,
    },
    {
      label: zh ? "每日摘要" : "Daily digest",
      description: digest
        ? (zh ? "每天 9:00 汇总工作区动态。" : "Summarize workspace activity at 9:00 each day.")
        : (zh ? "仅在工作区查看动态。" : "Read activity directly in the workspace."),
      checked: digest, onChange: setDigest, size: "sm" as const,
    },
  ];

  return <div className="flex flex-col gap-4">
    <div className="overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
      {rows.map((row, index) => <div key={index} className={`flex items-center justify-between gap-6 p-5 ${index ? "border-t border-fg-grey-200" : ""}`}>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-fg-grey-900">{row.label}</p>
          <p className="mt-1 text-sm leading-5 text-fg-grey-600" aria-live="polite">{row.description}</p>
        </div>
        <div className="shrink-0">
          <Toggle checked={row.checked} onChange={row.onChange} ariaLabel={row.label} size={row.size} color={color} motion={motion} disabled={disabled} draggable />
        </div>
      </div>)}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button color={color} size="sm" variant="secondary" aria-pressed={disabled} onClick={() => setDisabled(value => !value)}>
        {disabled ? (zh ? "启用开关" : "Enable switches") : (zh ? "禁用开关" : "Disable switches")}
      </Button>
      <p className="text-xs leading-5 text-fg-grey-600">
        {zh ? "点击切换，也可左右拖动；拖到另一侧再松开即可切换。Tab 聚焦后按空格也可操作。" : "Click or drag across the midpoint to switch. You can also focus with Tab and press Space."}
      </p>
    </div>
  </div>;
}
