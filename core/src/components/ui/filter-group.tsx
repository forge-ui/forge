"use client";

import { useId, useState, type ReactNode } from "react";
import {
  AddSquareLinear,
  MinusSquareLinear,
  FiltersLinear,
} from "solar-icon-set";
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
  title = "Filter Group",
  color = "purple",
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
  const radioName = useId();

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
    <div className="self-stretch bg-fg-grey-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="self-stretch px-4 py-3 border-b border-fg-grey-200 inline-flex justify-start items-center gap-2"
      >
        <span className="flex-1 text-left text-fg-black text-sm font-semibold leading-5 tracking-fg">
          {title}
        </span>
        <span className="inline-flex text-fg-grey-700">
          {open ? (
            <MinusSquareLinear size={20} />
          ) : (
            <AddSquareLinear size={20} />
          )}
        </span>
      </button>

      {open && content.type !== "empty" && (
        <div className="self-stretch bg-white flex justify-start items-stretch">
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
            {content.type === "radio" &&
              content.options.map((option) => (
                <RadioRow
                  key={option.value}
                  color={color}
                  name={radioName}
                  option={option}
                  onSelect={() => content.onSelect?.(option.value)}
                />
              ))}
            {content.type === "range" && (
              <>
                <RangeField
                  label={content.minLabel ?? "Minimum"}
                  placeholder={content.minPlaceholder ?? "Minimum. . ."}
                  value={content.minValue ?? ""}
                  onChange={content.onMinChange}
                />
                <RangeField
                  label={content.maxLabel ?? "Maximum"}
                  placeholder={content.maxPlaceholder ?? "Maximum. . ."}
                  value={content.maxValue ?? ""}
                  onChange={content.onMaxChange}
                />
              </>
            )}
          </div>
          <AccentBar color={color} visible={selectionVisible} />
        </div>
      )}
    </div>
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
    <label className="self-stretch inline-flex items-start gap-2 cursor-pointer">
      <CheckboxBox color={color} checked={checked} />
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
      />
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
    </label>
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
      <span className="w-5 h-5 bg-white rounded-md border-2 border-fg-grey-200 inline-block" />
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
  name,
  option,
  onSelect,
}: {
  color: FilterGroupColor;
  name: string;
  option: FilterGroupRadioOption;
  onSelect: () => void;
}) {
  const checked = option.checked ?? false;
  return (
    <label className="self-stretch inline-flex items-start gap-2 cursor-pointer">
      {checked ? (
        <span className={`p-[5px] rounded-full flex items-start ${accentColors[color].bg}`}>
          <span className="w-2.5 h-2.5 bg-white rounded-full" />
        </span>
      ) : (
        <span className="w-5 h-5 bg-white rounded-full border-2 border-fg-grey-200 inline-block" />
      )}
      <input
        type="radio"
        name={name}
        value={option.value}
        className="sr-only"
        checked={checked}
        onChange={() => onSelect()}
      />
      <SelectionLabel color={color} checked={checked}>
        {option.label}
      </SelectionLabel>
    </label>
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
        checked ? `${accentColors[color].text} font-bold` : "text-fg-grey-700 font-semibold"
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
      <div className="self-stretch px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex items-center gap-2">
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
