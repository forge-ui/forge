"use client";

import { useReducedMotion } from "./motion";
import type { MotionPreference } from "../lib/motion";

type AnimatedNumberProps = {
  value: number;
  locale?: string;
  formatOptions?: Intl.NumberFormatOptions;
  motion?: MotionPreference;
};

/** Internal metric renderer. Stable place-value keys preserve columns across signs and digit counts. */
export function AnimatedNumber({ value, locale = "zh-CN", formatOptions, motion = "auto" }: AnimatedNumberProps) {
  const reduced = useReducedMotion(motion);
  const formatter = new Intl.NumberFormat(locale, formatOptions ?? { maximumFractionDigits: 20 });
  const parts = formatter.formatToParts(value);
  const formatted = parts.map(part => part.value).join("");
  const digitFormatter = new Intl.NumberFormat(locale, { useGrouping: false, numberingSystem: formatter.resolvedOptions().numberingSystem });
  const digits = Array.from({ length: 10 }, (_, digit) => digitFormatter.format(digit));
  let integerPosition = parts.filter(part => part.type === "integer").reduce((count, part) => count + Array.from(part.value).length, 0);
  let fractionPosition = 0;
  let columnIndex = 0;

  return <span className="inline-flex tabular-nums tracking-fg" data-forge-animated-number>
    <span className="sr-only">{formatted}</span>
    <span aria-hidden="true" className="inline-flex h-[1.2em] overflow-hidden leading-[1.2]" style={{ maskImage: reduced ? undefined : "linear-gradient(transparent,currentColor 14%,currentColor 86%,transparent)" }}>
      {parts.flatMap((part, partIndex) => Array.from(part.value).map((character, characterIndex) => {
        const digit = digits.indexOf(character);
        const position = part.type === "integer" ? `integer-${--integerPosition}`
          : part.type === "fraction" ? `fraction-${fractionPosition++}`
          : `${part.type}-${partIndex}-${characterIndex}`;
        if (digit < 0) return <span key={position}>{character}</span>;
        const delay = Math.min(columnIndex++, 12) * .045;
        return <span key={position} data-number-place={position} className="inline-block h-[1.2em] overflow-hidden">
          <span className="flex flex-col" style={{ transform: `translateY(-${digit * 1.2}em)`, transition: reduced ? "none" : `transform .9s cubic-bezier(.3,1.25,.5,1) ${delay}s` }}>
            {digits.map((glyph, index) => <span key={index} className="h-[1.2em] shrink-0">{glyph}</span>)}
          </span>
        </span>;
      }))}
    </span>
  </span>;
}
