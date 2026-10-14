"use client";

import { useState } from "react";
import { Button, LineChartStatCard, StatCard } from "@forge-ui-official/core";
import { ChartBoldDuotone, UsersGroupRoundedBoldDuotone } from "@forge-ui-official/core/icons";

export function MetricNumberPreview({ locale, color, motion }: {
  locale: "zh" | "en";
  color: "blue" | "purple" | "black";
  motion: "auto" | "none";
}) {
  const [visitors, setVisitors] = useState(999);
  const [revenue, setRevenue] = useState(12888.5);
  const zh = locale === "zh";
  const numberLocale = zh ? "zh-CN" : "en-US";
  const theme = color === "black" ? "dark" : color;

  function update(direction: number) {
    setVisitors(previous => Math.max(0, previous + direction * 137));
    setRevenue(previous => Math.round((previous + direction * 168.25) * 100) / 100);
  }

  return <div className="flex flex-col gap-4">
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard
        title={zh ? "实时访客" : "Live visitors"}
        value={visitors}
        animateValue
        locale={numberLocale}
        motion={motion}
        theme={theme}
        size="wide"
        icon={<UsersGroupRoundedBoldDuotone size={24} color="currentColor" />}
        subtitle={zh ? "当前正在浏览的访客" : "Visitors browsing right now"}
      />
      <LineChartStatCard
        title={zh ? "本月收入" : "Monthly revenue"}
        value={revenue}
        animateValue
        locale={numberLocale}
        numberFormat={{ style: "currency", currency: zh ? "CNY" : "USD" }}
        motion={motion}
        theme={theme}
        size="wide"
        chartColor={color === "purple" ? "purple" : "blue"}
        series={[8600, 9800, 8900, 10200, 11800, 10900, 12300, revenue]}
        icon={<ChartBoldDuotone size={24} color="currentColor" />}
        subtitle={zh ? "按所选语言显示货币格式" : "Currency follows the selected language"}
      />
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button color={color} size="sm" onClick={() => update(1)}>{zh ? "增加数据" : "Increase"}</Button>
      <Button color={color} size="sm" variant="secondary" onClick={() => update(-1)}>{zh ? "减少数据" : "Decrease"}</Button>
      <Button color={color} size="sm" variant="tertiary" onClick={() => {
        setVisitors(previous => previous >= 1000 ? 999 : 1000);
        setRevenue(previous => previous >= 10000 ? 9999.99 : 10000.01);
      }}>{zh ? "跨位切换" : "Change digit count"}</Button>
      <Button color={color} size="sm" variant="tertiary" onClick={() => setRevenue(previous => -previous)}>{zh ? "正负切换" : "Toggle sign"}</Button>
    </div>
    <p className="text-xs leading-5 text-fg-grey-600">
      {zh ? "数字更新时逐位滚动；负号、货币和小数保持清晰。关闭动效时立即显示结果。" : "Digits roll as values change, with signs, currencies and decimals preserved. Disable motion to show updates immediately."}
    </p>
  </div>;
}
