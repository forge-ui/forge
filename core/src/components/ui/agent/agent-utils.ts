"use client";

import { useEffect, useState } from "react";

export type AgentLocale = "zh" | "en";

export const pick = (locale: AgentLocale, zh: string, en: string) => (locale === "en" ? en : zh);

/** 4.2 s → "4.2 秒", 95 s → "1 分 35 秒". */
export function formatDuration(milliseconds: number, locale: AgentLocale = "zh") {
  const seconds = Math.max(0, milliseconds) / 1000;
  if (seconds < 10) return pick(locale, `${seconds.toFixed(1)} 秒`, `${seconds.toFixed(1)}s`);
  if (seconds < 60) return pick(locale, `${Math.round(seconds)} 秒`, `${Math.round(seconds)}s`);
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  if (minutes < 60) return pick(locale, rest ? `${minutes} 分 ${rest} 秒` : `${minutes} 分钟`, rest ? `${minutes}m ${rest}s` : `${minutes}m`);
  const hours = Math.floor(minutes / 60);
  return pick(locale, `${hours} 小时 ${minutes % 60} 分`, `${hours}h ${minutes % 60}m`);
}

export function formatTokens(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(count);
}

export function formatCost(amount: number, currency = "$") {
  return `${currency}${amount < 0.01 && amount > 0 ? amount.toFixed(4) : amount.toFixed(2)}`;
}

/**
 * Milliseconds since `startedAt`, ticking while `running` and frozen once it stops. Starts at 0 so
 * server and client render the same text; pass a final duration explicitly for finished work.
 */
export function useElapsed(startedAt: number | Date | undefined, running: boolean) {
  const start = startedAt instanceof Date ? startedAt.getTime() : startedAt;
  const [now, setNow] = useState(start ?? 0);
  useEffect(() => {
    if (!running || start === undefined) return;
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, [running, start]);
  return start === undefined ? undefined : Math.max(0, now - start);
}
