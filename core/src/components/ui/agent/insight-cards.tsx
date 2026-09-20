"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set. No third-party chart vendor.
 */

import { useState } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear, StarsLinear } from "solar-icon-set";
import { Button } from "../button";
import { SurfaceCard } from "../surface-card";

export type InsightTone = "violet" | "green" | "yellow" | "blue";

export type InsightSeries = {
  name: string;
  values: number[];
  tone?: InsightTone;
};

export type InsightChart =
  | { kind: "spark"; series: InsightSeries[] }
  | { kind: "bars"; values: number[] }
  | { kind: "segments"; items: { label: string; pct: number; tone?: InsightTone }[] };

export type InsightCard = {
  id: string;
  title: string;
  body: string;
  prompt?: string;
  chart?: InsightChart;
};

const TONE: Record<InsightTone, string> = {
  violet: "var(--fg-violet)",
  green: "var(--fg-green-500)",
  yellow: "var(--fg-yellow-700)",
  blue: "var(--fg-blue)",
};

function Spark({ series }: { series: InsightSeries[] }) {
  const width = 280;
  const height = 88;
  const max = Math.max(...series.flatMap((item) => item.values), 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full" aria-hidden>
      {series.map((item) => {
        const points = item.values
          .map((value, index) => {
            const x = (index / Math.max(item.values.length - 1, 1)) * width;
            const y = height - (value / max) * (height - 8) - 4;
            return `${x},${y}`;
          })
          .join(" ");
        return (
          <polyline
            key={item.name}
            fill="none"
            stroke={TONE[item.tone ?? "violet"]}
            strokeWidth="2"
            points={points}
          />
        );
      })}
    </svg>
  );
}

function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-24 items-end gap-1.5">
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="flex-1 rounded-t-md bg-fg-violet-100"
          style={{ height: `${Math.max((value / max) * 100, 8)}%` }}
        />
      ))}
    </div>
  );
}

function Segments({ items }: { items: { label: string; pct: number; tone?: InsightTone }[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-fg-grey-100">
        {items.map((item) => (
          <div
            key={item.label}
            style={{ width: `${item.pct}%`, background: TONE[item.tone ?? "violet"] }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-fg-grey-700">
        {items.map((item) => (
          <span key={item.label}>
            {item.label} {item.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function InsightCards({
  cards,
  index: controlledIndex,
  onIndexChange,
  onAsk,
  className = "",
}: {
  cards: InsightCard[];
  index?: number;
  onIndexChange?: (index: number) => void;
  onAsk?: (prompt: string, card: InsightCard) => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState(0);
  const index = controlledIndex ?? uncontrolled;
  const card = cards[index];
  if (!card) return null;

  function go(next: number) {
    const clamped = (next + cards.length) % cards.length;
    if (controlledIndex === undefined) setUncontrolled(clamped);
    onIndexChange?.(clamped);
  }

  return (
    <SurfaceCard
      className={className}
      title={card.title}
      subtitle={`${index + 1} / ${cards.length}`}
      action={
        cards.length > 1 ? (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => go(index - 1)} className="rounded-lg p-1 hover:bg-fg-grey-100" aria-label="Previous insight">
              <AltArrowLeftLinear size={14} color="var(--fg-grey-700)" />
            </button>
            <button type="button" onClick={() => go(index + 1)} className="rounded-lg p-1 hover:bg-fg-grey-100" aria-label="Next insight">
              <AltArrowRightLinear size={14} color="var(--fg-grey-700)" />
            </button>
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        {card.chart?.kind === "spark" && <Spark series={card.chart.series} />}
        {card.chart?.kind === "bars" && <Bars values={card.chart.values} />}
        {card.chart?.kind === "segments" && <Segments items={card.chart.items} />}
        <p className="text-sm leading-6 text-fg-grey-700">{card.body}</p>
        {card.prompt && (
          <Button
            size="sm"
            color="purple"
            variant="secondary"
            className="self-start"
            iconLeft={<StarsLinear size={14} color="var(--fg-violet)" />}
            onClick={() => onAsk?.(card.prompt!, card)}
          >
            {card.prompt}
          </Button>
        )}
      </div>
    </SurfaceCard>
  );
}
