"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";
import { Button, Label, ProgressBar, SmallCalendar, StatCard, TextField, Toggle, UserCard } from "@forge-ui-official/core";

const day = new Date().getDate();

const reducedQuery = "(prefers-reduced-motion: reduce)";

export function HomeShowcase() {
  const [notify, setNotify] = useState(true);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (window.matchMedia(reducedQuery).matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--px", x.toFixed(3));
    event.currentTarget.style.setProperty("--py", y.toFixed(3));
  };

  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--px", "0");
    event.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <div className="home-stage" onPointerMove={move} onPointerLeave={reset}>
      <div
        className="home-piece home-piece-stat"
        style={{ "--tilt": "-6deg", "--depth": "16", "--bob": "-8px", "--dur": "7.2s" } as CSSProperties}
      >
        <StatCard
          title="本月回款"
          value="128,400"
          trend="12%"
          trendDirection="up"
          subtitle="较上月"
          theme="black"
          size="sm"
          density="compact"
          width="full"
          motion="auto"
          className="home-shadow"
        />
      </div>

      <div
        className="home-piece home-piece-user"
        style={{ "--tilt": "5deg", "--depth": "22", "--bob": "-10px", "--dur": "8.4s", "--delay": "-1.2s" } as CSSProperties}
      >
        <UserCard
          initials="林"
          initialsColor="blue"
          name="林可"
          subtitle={<span className="text-xs font-medium text-fg-grey-900">采购</span>}
          badge={<Label color="blue" size="sm">在岗</Label>}
          stats={[
            { label: "待办", value: "6" },
            { label: "完成", value: "18" },
          ]}
          width="full"
          className="home-shadow"
        />
      </div>

      <div
        className="home-piece home-piece-cal"
        style={{ "--tilt": "3deg", "--depth": "10", "--bob": "-8px", "--dur": "9s", "--delay": "-2s" } as CSSProperties}
      >
        <SmallCalendar
          title="本周日程"
          subtitle="采购与对账"
          color="blue"
          width="full"
          className="home-shadow"
          events={[
            { day, title: "核对发票", timeRange: "10:00 – 10:30", color: "blue" },
            { day, title: "供应商回访", timeRange: "15:00 – 15:40", color: "green" },
          ]}
        />
      </div>

      <div
        className="home-piece home-piece-form"
        style={{ "--tilt": "-2deg", "--depth": "14", "--bob": "-6px", "--dur": "6.8s", "--delay": "-0.6s" } as CSSProperties}
      >
        <div className="flex min-w-0 flex-col gap-3 rounded-3xl bg-white p-4 home-shadow outline outline-1 outline-fg-grey-200">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg-black">采购单</p>
              <p className="text-xs leading-5 text-fg-grey-900">18 / 24 已核对</p>
            </div>
            <Toggle checked={notify} onChange={setNotify} color="blue" size="sm" ariaLabel="接收采购通知" motion="auto" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Label color="blue" size="sm" variant="solid">进行中</Label>
            <Label color="blue" size="sm">已核对</Label>
            <Label color="red" size="sm">待发货</Label>
          </div>
          <TextField label="单号" placeholder="例如 3021" />
          <ProgressBar value={notify ? 72 : 36} color="blue" size="sm" label="同步" showPercentage motion="auto" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" color="black">提交</Button>
            <Button size="sm" color="black" variant="tertiary">暂存</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
