"use client";

import { useState, type ComponentProps } from "react";
import { CreditCard, PageDot } from "@forge-ui-official/core";

export interface CardCarouselProps {
  cards: (ComponentProps<typeof CreditCard> & { id: string })[];
  size?: "compact" | "default";
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  showPagination?: boolean;
}

export function CardCarousel({ cards, size = "default", index, defaultIndex = 0, onIndexChange, showPagination = false }: CardCarouselProps) {
  const [selected, setSelected] = useState(defaultIndex);
  if (!cards.length) return null;
  const current = Math.max(0, Math.min(cards.length - 1, index ?? selected));
  const compact = size === "compact";
  const { id: activeId, ...active } = cards[current];
  const { id: previousId, ...previous } = cards[(current + cards.length - 1) % cards.length];
  const { id: nextId, ...next } = cards[(current + 1) % cards.length];
  return <>
    <div className={compact ? "relative -mx-4 h-40 overflow-hidden" : "relative -mx-4 h-56 overflow-hidden"}>
      <div className={compact ? "absolute left-0 top-3 h-32 w-8 overflow-hidden rounded-r-xl" : "absolute left-0 top-6 h-40 w-10 overflow-hidden rounded-r-2xl"}>
        <div className="absolute left-[-236px] top-0"><CreditCard key={previousId} {...previous} className="[&_*]:invisible" /></div>
      </div>
      <div className={compact ? "absolute right-0 top-3 h-32 w-8 overflow-hidden rounded-l-xl" : "absolute right-0 top-6 h-40 w-10 overflow-hidden rounded-l-2xl"}>
        <div className="absolute right-[-236px] top-0"><CreditCard key={nextId} {...next} className="[&_*]:invisible" /></div>
      </div>
      <div className={compact ? "absolute left-1/2 top-3 w-[clamp(12rem,78%,15rem)] -translate-x-1/2" : "absolute left-1/2 top-6 -translate-x-1/2"}>
        <CreditCard key={activeId} {...active} className="shadow-card" />
      </div>
    </div>
    {showPagination && <div className="flex items-center justify-center gap-2">{cards.map((card, cardIndex) => <PageDot key={card.id} active={current === cardIndex} onClick={() => { setSelected(cardIndex); onIndexChange?.(cardIndex); }}>{cardIndex + 1}</PageDot>)}</div>}
  </>;
}
