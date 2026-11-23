"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { useState, type ReactNode } from "react";
import {
  AddSquareLinear,
  MinusSquareLinear,
  FiltersLinear,
} from "../../icons";
import { accentColors, type AccentColor } from "./accent-utils";

export type FilterGroupColor = AccentColor;

export type FilterGroupCheckboxOption = {
  value: string;
  label: string;
  checked?: boolean;
  colorDot?: string;
};

export type FilterGroupRadioOption = {
  value: string;
  label: string;
  checked?: boolean;
};

export type FilterGroupContent =
  | { type: "empty" }
  | {
      type: "checkbox";
      options: FilterGroupCheckboxOption[];
      onToggle?: (value: string, checked: boolean) => void;
    }
  | {
      type: "radio";
      options: FilterGroupRadioOption[];
      onSelect?: (value: string) => void;
    }
  | {
      type: "range";
      minLabel?: string;
      maxLabel?: string;
      minPlaceholder?: string;
      maxPlaceholder?: string;
      minValue?: string;
      maxValue?: string;
      onMinChange?: (value: string) => void;
      onMaxChange?: (value: string) => void;
    };

export function FilterGroup({
  title = "筛选分组",
  color = "blue",
  content = { type: "empty" },
  defaultOpen,
  hasSelection,
}: {
  title?: string;
  color?: FilterGroupColor;
  content?: FilterGroupContent;
  defaultOpen?: boolean;
  hasSelection?: boolean;
}) {
  const computedDefaultOpen = defaultOpen ?? content.type !== "empty";
  const [open, setOpen] = useState(computedDefaultOpen);

  // range 分组在 Figma 中不展示右侧 accent bar
  const selectionVisible =
    content.type === "range"
      ? false
      : (hasSelection ??
        (content.type === "checkbox"
          ? content.options.some((o) => o.checked)
          : content.type === "radio"
            ? content.options.some((o) => o.checked)
            : false));

  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen} className="self-stretch bg-fg-grey-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col overflow-hidden">
      <CollapsiblePrimitive.Trigger
        className="self-stretch px-4 py-3 border-b border-fg-grey-200 inline-flex justify-start items-center gap-2"
      >
        <span className="flex-1 text-left text-fg-black text-sm font-medium leading-5 tracking-fg">
          {title}
        </span>
        <span className="inline-flex text-fg-grey-700">
          {open ? (
            <MinusSquareLinear size={20} />
          ) : (
            <AddSquareLinear size={20} />
          )}
        </span>
      </CollapsiblePrimitive.Trigger>

      {content.type !== "empty" && (
        <CollapsiblePrimitive.Panel className="self-stretch bg-background flex justify-start items-stretch">
          <div className="flex-1 p-4 flex flex-col gap-4">
            {content.type === "checkbox" &&
              content.options.map((option) => (
                <CheckboxRow
                  key={option.value}
                  color={color}
                  option={option}
                  onToggle={(checked) => content.onToggle?.(option.value, checked)}
                />
              ))}
            {content.type === "radio" && (
              <RadioGroupPrimitive
                aria-label={typeof title === "string" ? title : undefined}
                value={content.options.find((option) => option.checked)?.value ?? null}
                onValueChange={(value) => content.onSelect?.(value as string)}
                className="flex flex-col gap-4"
              >
                {content.options.map((option) => (
                  <RadioRow key={option.value} color={color} option={option} />
                ))}
              </RadioGroupPrimitive>
            )}
            {content.type === "range" && (
              <>
                <RangeField
                  label={content.minLabel ?? "最小值"}
                  placeholder={content.minPlaceholder ?? "请输入最小值"}
                  value={content.minValue ?? ""}
                  onChange={content.onMinChange}
                />
                <RangeField
                  label={content.maxLabel ?? "最大值"}
                  placeholder={content.maxPlaceholder ?? "请输入最大值"}
                  value={content.maxValue ?? ""}
                  onChange={content.onMaxChange}
                />
              </>
            )}
          </div>
          <AccentBar color={color} visible={selectionVisible} />
        </CollapsiblePrimitive.Panel>
      )}
    </CollapsiblePrimitive.Root>
  );
}

function AccentBar({ color, visible }: { color: FilterGroupColor; visible: boolean }) {
  return (
    <div className="self-stretch w-2 bg-fg-grey-100 flex flex-col items-start overflow-hidden">
      {visible && <div className={`w-1 h-14 ${accentColors[color].bg}`} />}
    </div>
  );
}

function CheckboxRow({
  color,
  option,
  onToggle,
}: {
  color: FilterGroupColor;
  option: FilterGroupCheckboxOption;
  onToggle: (checked: boolean) => void;
}) {
  const checked = option.checked ?? false;
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={(next) => onToggle(next)}
      className="self-stretch inline-flex items-start gap-2 cursor-pointer rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-blue"
    >
      <CheckboxBox color={color} checked={checked} />
      <span className="flex items-start gap-1">
        {option.colorDot && (
          <span
            aria-hidden
            className={`w-5 h-5 rounded-full inline-block ${option.colorDot}`}
          />
        )}
        <SelectionLabel color={color} checked={checked}>
          {option.label}
        </SelectionLabel>
      </span>
    </CheckboxPrimitive.Root>
  );
}

function CheckboxBox({
  color,
  checked,
}: {
  color: FilterGroupColor;
  checked: boolean;
}) {
  if (!checked) {
    return (
      <span className="w-5 h-5 bg-background rounded-md border-2 border-fg-grey-200 inline-block" />
    );
  }
  return (
    <span className={`w-5 h-5 rounded-md relative inline-block ${accentColors[color].bg}`}>
      <svg
        className="absolute inset-0 w-full h-full text-white"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="5 10 9 14 15 7" />
      </svg>
    </span>
  );
}

function RadioRow({
  color,
  option,
}: {
  color: FilterGroupColor;
  option: FilterGroupRadioOption;
}) {
  const checked = option.checked ?? false;
  return (
    <RadioPrimitive.Root
      value={option.value}
      className="self-stretch inline-flex items-start gap-2 cursor-pointer rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-blue"
    >
      {checked ? (
        <span className={`p-[5px] rounded-full flex items-start ${accentColors[color].bg}`}>
          <span className="w-2.5 h-2.5 bg-white rounded-full" />
        </span>
      ) : (
        <span className="w-5 h-5 bg-background rounded-full border-2 border-fg-grey-200 inline-block" />
      )}
      <SelectionLabel color={color} checked={checked}>
        {option.label}
      </SelectionLabel>
    </RadioPrimitive.Root>
  );
}

function SelectionLabel({
  color,
  checked,
  children,
}: {
  color: FilterGroupColor;
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`flex-1 text-sm leading-5 tracking-fg ${
        checked ? `${accentColors[color].text} font-semibold` : "text-fg-grey-700 font-medium"
      }`}
    >
      {children}
    </span>
  );
}

function RangeField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="self-stretch flex flex-col gap-1.5">
      <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
        {label}
      </span>
      <div className="self-stretch px-4 py-3 bg-background rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex items-center gap-2">
        <span className="inline-flex text-fg-grey-700">
          <FiltersLinear size={20} />
        </span>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm leading-5 text-fg-black placeholder:text-fg-grey-500"
        />
      </div>
    </div>
  );
}
