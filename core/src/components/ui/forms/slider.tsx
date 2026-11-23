"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import type { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import type { FormAccentColor } from "./form-utils";

// Single value or range slider; arrow keys, PageUp/PageDown, Home/End supported.

export type SliderColor = FormAccentColor;

type SliderBaseProps = {
  min?: number;
  max?: number;
  step?: number;
  /** Format for the value readout and screen readers, e.g. `{ style: "percent" }`. */
  format?: Intl.NumberFormatOptions;
  label?: ReactNode;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
  /** Show the formatted value next to the label. */
  showValue?: boolean;
  disabled?: boolean;
  color?: SliderColor;
  width?: string;
  name?: string;
  locale?: "zh" | "en";
  className?: string;
};

export type SliderValue = number | [number, number];

/** Pass a `[min, max]` tuple as `value` / `defaultValue` for a range slider. */
export type SliderProps<Value extends SliderValue = number> = SliderBaseProps & {
  value?: Value;
  defaultValue?: Value;
  onChange?: (value: Value) => void;
  /** Fires once when the user releases the thumb. */
  onCommit?: (value: Value) => void;
};

const indicatorColor: Record<SliderColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  black: "bg-fg-black",
};
const thumbColor: Record<SliderColor, string> = {
  purple: "border-fg-violet focus-visible:outline-fg-violet",
  blue: "border-fg-blue focus-visible:outline-fg-blue",
  black: "border-fg-black focus-visible:outline-fg-black",
};

export function Slider<Value extends SliderValue = number>(props: SliderProps<Value>) {
  const {
    min = 0,
    max = 100,
    step = 1,
    format,
    label,
    ariaLabel,
    showValue = false,
    disabled = false,
    color = "blue",
    width,
    name,
    locale = "zh",
    className,
  } = props;
  const isRange = Array.isArray(props.value ?? props.defaultValue);
  const thumbs = isRange ? [0, 1] : [0];

  return (
    <SliderPrimitive.Root
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={next => props.onChange?.(next as Value)}
      onValueCommitted={next => props.onCommit?.(next as Value)}
      min={min}
      max={max}
      step={step}
      format={format}
      locale={locale === "en" ? "en-US" : "zh-CN"}
      disabled={disabled}
      name={name}
      thumbAlignment="edge"
      className={cn("flex max-w-full flex-col gap-2 data-disabled:opacity-50", className)}
      style={{ width: width ?? "100%" }}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-3">
          {label && <SliderPrimitive.Label className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{label}</SliderPrimitive.Label>}
          {showValue && <SliderPrimitive.Value className="ml-auto text-sm font-medium leading-5 tracking-fg tabular-nums text-fg-black" />}
        </div>
      )}
      <SliderPrimitive.Control className="flex h-6 w-full touch-none select-none items-center data-disabled:cursor-not-allowed">
        <SliderPrimitive.Track className="relative h-1.5 w-full rounded-full bg-fg-grey-200">
          <SliderPrimitive.Indicator className={cn("rounded-full", indicatorColor[color])} />
          {thumbs.map(index => (
            <SliderPrimitive.Thumb
              key={index}
              index={index}
              aria-label={label ? undefined : ariaLabel ?? (isRange ? (index === 0 ? (locale === "en" ? "Minimum" : "最小值") : (locale === "en" ? "Maximum" : "最大值")) : undefined)}
              className={cn(
                "size-5 cursor-grab rounded-full border-2 bg-background shadow-[0px_2px_8px_0px_rgba(77,84,100,0.15)] outline-offset-2 focus-visible:outline focus-visible:outline-2 data-dragging:cursor-grabbing data-disabled:cursor-not-allowed",
                thumbColor[color],
              )}
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
