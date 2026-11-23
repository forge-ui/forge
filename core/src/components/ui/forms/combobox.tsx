"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { useId, useRef, type ReactNode, type RefObject } from "react";
import { AltArrowDownLinear, CheckCircleLinear, CloseCircleLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { useControllableOpen } from "../../../internal/floating";
import { FieldFrame } from "./field-utils";
import { formAccents, type FormAccentColor } from "./form-utils";
import {
  FloatingOptionContent,
  floatingEmptyClass,
  floatingFieldClass,
  floatingIconButtonClass,
  floatingInputClass,
  floatingListPopupClass,
  floatingOptionClass,
  type FloatingFieldShape,
  type FloatingFieldState,
} from "./floating-field";

// Searchable select: type to filter a fixed option list, pick one or many.

export type ComboboxState = FloatingFieldState;
export type ComboboxShape = FloatingFieldShape;
export type ComboboxColor = FormAccentColor;

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

type ComboboxBaseProps = {
  options: ComboboxOption[];
  label?: string;
  placeholder?: string;
  /** Shown when the query matches nothing. */
  emptyText?: ReactNode;
  errorMessage?: string;
  state?: ComboboxState;
  shape?: ComboboxShape;
  color?: ComboboxColor;
  /** Field width, any CSS width. Defaults to 100% of the parent. */
  width?: string;
  headerAction?: ReactNode;
  /** Form field name; submits the selected value(s). */
  name?: string;
  locale?: "zh" | "en";
  className?: string;
  motion?: MotionPreference;
};

type ComboboxSingleProps = ComboboxBaseProps & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
};

type ComboboxMultipleProps = ComboboxBaseProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
};

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const tagBackground: Record<ComboboxColor, string> = {
  purple: "bg-fg-violet-100",
  blue: "bg-fg-blue-50",
  black: "bg-fg-grey-100",
};

function findOption(options: ComboboxOption[], value: string | null | undefined) {
  return value == null ? null : options.find(option => option.value === value) ?? null;
}

export function Combobox(props: ComboboxProps) {
  const {
    options,
    label,
    placeholder,
    emptyText,
    errorMessage,
    state = "idle",
    shape = "rounded",
    color = "blue",
    width,
    headerAction,
    name,
    locale = "zh",
    className,
    motion = "auto",
  } = props;
  const inputId = useId();
  const errorId = useId();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useControllableOpen(undefined, undefined);
  const accent = formAccents[color];
  const disabled = state === "disabled";
  const isError = state === "error";
  const resolvedPlaceholder = placeholder ?? (locale === "en" ? "Search…" : "搜索...");
  const resolvedEmpty = emptyText ?? (locale === "en" ? "No results" : "没有匹配项");

  const input = (
    <ComboboxPrimitive.Input
      id={inputId}
      placeholder={resolvedPlaceholder}
      aria-invalid={isError || undefined}
      aria-describedby={isError && errorMessage ? errorId : undefined}
      className={floatingInputClass(state)}
    />
  );
  const chevron = (
    <ComboboxPrimitive.Trigger aria-label={locale === "en" ? "Show options" : "展开选项"} className={floatingIconButtonClass}>
      <span className="forge-chevron inline-flex" data-motion={motion} data-expanded={open}><AltArrowDownLinear size={20} /></span>
    </ComboboxPrimitive.Trigger>
  );

  const shared = {
    items: options,
    itemToStringLabel: (option: ComboboxOption) => option.label,
    itemToStringValue: (option: ComboboxOption) => option.value,
    isItemEqualToValue: (option: ComboboxOption, selected: ComboboxOption) => option.value === selected.value,
    open,
    onOpenChange: (next: boolean) => setOpen(next),
    disabled,
    name,
    modal: false,
  } as const;

  return (
    <FieldFrame
      label={label}
      headerAction={headerAction}
      errorMessage={errorMessage}
      showError={isError}
      errorId={errorId}
      inputId={inputId}
      className={cn("max-w-full", className)}
    >
      <div style={{ width: width ?? "100%", maxWidth: "100%" }}>
        {props.multiple ? (
          <ComboboxPrimitive.Root
            {...shared}
            multiple
            value={props.value === undefined ? undefined : props.value.map(value => findOption(options, value)).filter((option): option is ComboboxOption => !!option)}
            defaultValue={props.defaultValue?.map(value => findOption(options, value)).filter((option): option is ComboboxOption => !!option)}
            onValueChange={(next: ComboboxOption[]) => props.onChange?.(next.map(option => option.value))}
          >
            <ComboboxPrimitive.Chips ref={anchorRef} className={cn(floatingFieldClass({ state, shape, color }), "min-h-12 flex-wrap py-2")}>
              <ComboboxPrimitive.Value>
                {(selected: ComboboxOption[]) => selected.map(option => (
                  <ComboboxPrimitive.Chip key={option.value} className={cn("inline-flex items-center gap-0.5 rounded-full py-1.5 pl-2.5 pr-1.5 outline-none", tagBackground[color])}>
                    <span className={cn("whitespace-nowrap text-xs font-medium leading-[18px] tracking-fg", accent.text)}>{option.label}</span>
                    <ComboboxPrimitive.ChipRemove aria-label={`${locale === "en" ? "Remove" : "移除"} ${option.label}`} className={cn("flex size-[18px] cursor-pointer items-center justify-center", accent.text)}>
                      <CloseCircleLinear size={14} />
                    </ComboboxPrimitive.ChipRemove>
                  </ComboboxPrimitive.Chip>
                ))}
              </ComboboxPrimitive.Value>
              {input}
              {chevron}
            </ComboboxPrimitive.Chips>
            <ComboboxList anchorRef={anchorRef} color={color} motion={motion} emptyText={resolvedEmpty} />
          </ComboboxPrimitive.Root>
        ) : (
          <ComboboxPrimitive.Root
            {...shared}
            value={props.value === undefined ? undefined : findOption(options, props.value)}
            defaultValue={findOption(options, props.defaultValue)}
            onValueChange={(next: ComboboxOption | null) => props.onChange?.(next?.value ?? null)}
          >
            <ComboboxPrimitive.InputGroup ref={anchorRef} className={cn(floatingFieldClass({ state, shape, color }), "h-12")}>
              {input}
              <ComboboxPrimitive.Clear aria-label={locale === "en" ? "Clear" : "清除"} className={floatingIconButtonClass}>
                <CloseCircleLinear size={18} />
              </ComboboxPrimitive.Clear>
              {chevron}
            </ComboboxPrimitive.InputGroup>
            <ComboboxList anchorRef={anchorRef} color={color} motion={motion} emptyText={resolvedEmpty} />
          </ComboboxPrimitive.Root>
        )}
      </div>
    </FieldFrame>
  );
}

function ComboboxList({ anchorRef, color, motion, emptyText }: {
  anchorRef: RefObject<HTMLDivElement | null>;
  color: ComboboxColor;
  motion: MotionPreference;
  emptyText: ReactNode;
}) {
  const accent = formAccents[color];
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner anchor={anchorRef} sideOffset={4} align="start" collisionPadding={8} className="z-50">
        <ComboboxPrimitive.Popup data-motion={motion} className={floatingListPopupClass}>
          <ComboboxPrimitive.Empty className={floatingEmptyClass}>{emptyText}</ComboboxPrimitive.Empty>
          <ComboboxPrimitive.List className="flex flex-col overflow-y-auto overscroll-contain empty:hidden">
            {(option: ComboboxOption) => (
              <ComboboxPrimitive.Item key={option.value} value={option} disabled={option.disabled} className={cn(floatingOptionClass, option.description ? "min-h-12 py-2" : "h-12")}>
                <FloatingOptionContent icon={option.icon} label={option.label} description={option.description} color={color} />
                <ComboboxPrimitive.ItemIndicator keepMounted className={cn("inline-flex size-[22px] shrink-0 items-center justify-center opacity-0 data-selected:opacity-100", accent.text)}>
                  <CheckCircleLinear size={22} />
                </ComboboxPrimitive.ItemIndicator>
              </ComboboxPrimitive.Item>
            )}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}
