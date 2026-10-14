"use client";

import { useState } from "react";
import { Button, SelectOption } from "@forge-ui-official/core";
import { BellLinear, CalendarLinear, ChatDotsLinear, ClockCircleLinear, LetterLinear } from "@forge-ui-official/core/icons";

export function SelectMotionPreview({ locale, color, motion }: {
  locale: "zh" | "en";
  color: "blue" | "purple" | "black";
  motion: "auto" | "none";
}) {
  const [delivery, setDelivery] = useState("inbox");
  const [disabled, setDisabled] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const zh = locale === "zh";
  const options = [
    { value: "inbox", label: zh ? "站内消息" : "Workspace inbox", description: zh ? "在工作区接收所有通知" : "Receive every notification in your workspace", icon: <ChatDotsLinear size={20} /> },
    { value: "email", label: zh ? "邮件通知" : "Email notifications", description: zh ? "重要更新发送到工作邮箱" : "Send important updates to your work email", icon: <LetterLinear size={20} /> },
    { value: "desktop", label: zh ? "桌面提醒" : "Desktop alerts", description: zh ? "新任务和提及即时提醒" : "Get instant alerts for new tasks and mentions", icon: <BellLinear size={20} /> },
    { value: "daily", label: zh ? "每日摘要" : "Daily digest", description: zh ? "每天 9:00 汇总昨日动态" : "Summarize yesterday’s activity at 9:00", icon: <ClockCircleLinear size={20} /> },
    { value: "weekly", label: zh ? "每周摘要" : "Weekly digest", description: zh ? "每周一汇总项目进展" : "Review project progress every Monday", icon: <CalendarLinear size={20} /> },
    { value: "off", label: zh ? "暂停通知" : "Pause notifications", description: zh ? "保留消息，暂不主动提醒" : "Keep messages without sending alerts", icon: <BellLinear size={20} /> },
  ];
  const selected = options.find(option => option.value === delivery)!;

  return <div className="flex min-w-0 flex-col gap-4">
    <div className="max-w-full rounded-xl border border-fg-grey-200 bg-white p-5" style={{ width: narrow ? "280px" : "100%" }}>
      <SelectOption
        label={zh ? "通知投递方式" : "Notification delivery"}
        placeholder={zh ? "选择投递方式" : "Choose a delivery method"}
        options={options} value={delivery} onChange={setDelivery}
        state={disabled ? "disabled" : "idle"} color={color} motion={motion}
        width="100%" className="w-full"
      />
      <p className="mt-5 text-sm leading-5 text-fg-grey-700" aria-live="polite">
        {zh ? "当前设置：" : "Current setting: "}<span className="font-semibold text-fg-grey-900">{selected.label}</span>
      </p>
      <p className="mt-1 text-xs leading-4 text-fg-grey-600">{selected.description}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" color={color} variant="secondary" aria-pressed={disabled} onClick={() => setDisabled(value => !value)}>
        {disabled ? (zh ? "启用选择" : "Enable selection") : (zh ? "禁用选择" : "Disable selection")}
      </Button>
      <Button size="sm" color={color} variant="secondary" aria-pressed={narrow} onClick={() => setNarrow(value => !value)}>
        {narrow ? (zh ? "恢复宽度" : "Restore width") : (zh ? "收窄预览" : "Narrow preview")}
      </Button>
    </div>
    <p className="text-xs leading-5 text-fg-grey-600">
      {zh ? "打开后可用方向键移动、Enter 选择、Esc 关闭；选项较多时可滚动。" : "Use arrow keys to move, Enter to choose, and Esc to close. Scroll to see more options."}
    </p>
  </div>;
}
