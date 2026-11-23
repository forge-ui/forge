"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { ReactNode } from "react";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { CheckboxVisual } from "../checkbox";
import type { FormAccentColor } from "./form-utils";

// Grouped choices with real keyboard semantics: RadioGroup (arrow keys move and
// select), CheckboxGroup (optional "select all" parent), ToggleGroup (segmented).

export type ChoiceGroupColor = FormAccentColor;
export type ChoiceGroupOrientation = "vertical" | "horizontal";

export interface ChoiceGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

const checkedText: Record<ChoiceGroupColor, string> = {
  purple: "group-data-checked:text-fg-violet",
  blue: "group-data-checked:text-fg-blue",
  black: "group-data-checked:text-fg-black",
};
const checkedFill: Record<ChoiceGroupColor, string> = {
  purple: "group-data-checked:bg-fg-violet",
  blue: "group-data-checked:bg-fg-blue",
  black: "group-data-checked:bg-fg-black",
};

const optionClass =
  "group inline-flex items-start gap-2 text-left outline-none cursor-pointer data-disabled:cursor-not-allowed data-disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-blue rounded-md";

function OptionText({ option, color }: { option: ChoiceGroupOption; color: ChoiceGroupColor }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className={cn("text-sm font-medium leading-5 tracking-fg text-fg-grey-700 group-data-checked:font-semibold", checkedText[color])}>{option.label}</span>
      {option.description && <span className="text-xs leading-4 tracking-fg text-fg-grey-700">{option.description}</span>}
    </span>
  );
}

// ── RadioGroup ──────────────────────────────────────────────

export interface RadioGroupProps {
  options: ChoiceGroupOption[];
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Form field name; submits the chosen value. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  color?: ChoiceGroupColor;
  orientation?: ChoiceGroupOrientation;
  /** Accessible name when there is no visible group label. */
  ariaLabel?: string;
  className?: string;
}

/** One choice from a list. Arrow keys move and select; Tab leaves the group. */
export function RadioGroup({ options, value, defaultValue, onChange, name, required, disabled, color = "blue", orientation = "vertical", ariaLabel, className }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onChange?.(next as string)}
      name={name}
      required={required}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap gap-x-6", className)}
    >
      {options.map((option) => (
        <RadioPrimitive.Root key={option.value} value={option.value} disabled={option.disabled} nativeButton render={<button type="button" />} className={optionClass}>
          <span aria-hidden className={cn("mt-0 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-fg-grey-300 bg-background transition-colors group-data-checked:border-0", checkedFill[color])}>
            <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-white" />
          </span>
          <OptionText option={option} color={color} />
        </RadioPrimitive.Root>
      ))}
    </RadioGroupPrimitive>
  );
}

// ── CheckboxGroup ───────────────────────────────────────────

export interface CheckboxGroupProps {
  options: ChoiceGroupOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Adds a parent checkbox that selects every option and shows a partial state. */
  selectAllLabel?: string;
  /** Form field name; each checked option submits its value. */
  name?: string;
  disabled?: boolean;
  color?: ChoiceGroupColor;
  orientation?: ChoiceGroupOrientation;
  ariaLabel?: string;
  motion?: MotionPreference;
  className?: string;
}

/** Several independent choices, optionally with a "select all" parent. */
export function CheckboxGroup({ options, value, defaultValue, onChange, selectAllLabel, name, disabled, color = "blue", orientation = "vertical", ariaLabel, motion = "auto", className }: CheckboxGroupProps) {
  const allValues = options.filter((option) => !option.disabled).map((option) => option.value);
  const box = (checked: boolean, indeterminate: boolean) => (
    <span aria-hidden className="relative size-5 shrink-0"><CheckboxVisual checked={checked} indeterminate={indeterminate} color={color} motion={motion} /></span>
  );
  return (
    <CheckboxGroupPrimitive
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onChange?.(next)}
      allValues={selectAllLabel ? allValues : undefined}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap gap-x-6", className)}
    >
      {selectAllLabel && (
        <CheckboxPrimitive.Root parent nativeButton render={<button type="button" />} className={optionClass}>
          <CheckboxPrimitive.Indicator keepMounted render={(_, state) => box(state.checked, state.indeterminate)} />
          <OptionText option={{ value: "", label: selectAllLabel }} color={color} />
        </CheckboxPrimitive.Root>
      )}
      {options.map((option) => (
        <CheckboxPrimitive.Root key={option.value} value={option.value} name={name} disabled={option.disabled} nativeButton render={<button type="button" />} className={cn(optionClass, selectAllLabel && orientation === "vertical" && "ml-7")}>
          <CheckboxPrimitive.Indicator keepMounted render={(_, state) => box(state.checked, false)} />
          <OptionText option={option} color={color} />
        </CheckboxPrimitive.Root>
      ))}
    </CheckboxGroupPrimitive>
  );
}

// ── ToggleGroup ─────────────────────────────────────────────

export interface ToggleGroupOption {
  value: string;
  label?: string;
  icon?: ReactNode;
  /** Required when the option has only an icon. */
  ariaLabel?: string;
  disabled?: boolean;
}

type ToggleGroupBase = {
  options: ToggleGroupOption[];
  size?: "sm" | "md";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

export type ToggleGroupProps = ToggleGroupBase & (
  | { multiple?: false; value?: string | null; defaultValue?: string; onChange?: (value: string | null) => void }
  | { multiple: true; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void }
);

/** Segmented buttons: one pressed (view switcher) or several (formatting toolbar). */
export function ToggleGroup(props: ToggleGroupProps) {
  const { options, size = "md", disabled, ariaLabel, className } = props;
  const toArray = (next: string | string[] | null | undefined) => (next == null ? undefined : Array.isArray(next) ? next : [next]);
  return (
    <ToggleGroupPrimitive
      multiple={props.multiple}
      value={props.value === null ? [] : toArray(props.value)}
      defaultValue={toArray(props.defaultValue)}
      onValueChange={(next) => {
        if (props.multiple) props.onChange?.(next as string[]);
        else props.onChange?.((next[0] as string | undefined) ?? null);
      }}
      disabled={disabled}
      loopFocus
      aria-label={ariaLabel}
      className={cn("inline-flex items-center gap-1 rounded-full bg-fg-grey-100 p-1", className)}
    >
      {options.map((option) => (
        <TogglePrimitive
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          aria-label={option.ariaLabel}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-full font-medium tracking-fg text-fg-grey-700 outline-none transition-colors hover:text-fg-black data-pressed:bg-background data-pressed:text-fg-black data-pressed:shadow-[0px_1px_4px_0px_rgba(77,84,100,0.12)] data-disabled:cursor-not-allowed data-disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-blue cursor-pointer",
            size === "sm" ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm",
          )}
        >
          {option.icon && <span aria-hidden className="inline-flex size-5 items-center justify-center">{option.icon}</span>}
          {option.label}
        </TogglePrimitive>
      ))}
    </ToggleGroupPrimitive>
  );
}
