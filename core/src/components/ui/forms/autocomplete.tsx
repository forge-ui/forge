"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { useId, useRef, type ReactNode } from "react";
import { CloseCircleLinear, MagniferLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { useControllableOpen } from "../../../internal/floating";
import { FieldFrame } from "./field-utils";
import type { FormAccentColor } from "./form-utils";
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

// Free-text input with suggestions: the value is whatever the user typed or picked.

export type AutocompleteState = FloatingFieldState;
export type AutocompleteShape = FloatingFieldShape;
export type AutocompleteColor = FormAccentColor;

export interface AutocompleteOption {
  /** Text written into the input when picked. */
  value: string;
  /** Display text; defaults to `value`. */
  label?: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface AutocompleteProps {
  options: (string | AutocompleteOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires when a suggestion is picked (not on free typing). */
  onSelect?: (option: AutocompleteOption) => void;
  label?: string;
  placeholder?: string;
  /** Shown when the text matches nothing. Omit to hide the list instead. */
  emptyText?: ReactNode;
  errorMessage?: string;
  state?: AutocompleteState;
  shape?: AutocompleteShape;
  color?: AutocompleteColor;
  /** Show a search icon at the start. */
  searchIcon?: boolean;
  width?: string;
  headerAction?: ReactNode;
  name?: string;
  locale?: "zh" | "en";
  className?: string;
  motion?: MotionPreference;
}

const normalize = (option: string | AutocompleteOption): AutocompleteOption => typeof option === "string" ? { value: option } : option;

export function Autocomplete({
  options,
  value,
  defaultValue,
  onChange,
  onSelect,
  label,
  placeholder,
  emptyText,
  errorMessage,
  state = "idle",
  shape = "rounded",
  color = "blue",
  searchIcon = false,
  width,
  headerAction,
  name,
  locale = "zh",
  className,
  motion = "auto",
}: AutocompleteProps) {
  const inputId = useId();
  const errorId = useId();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useControllableOpen(undefined, undefined);
  const items = options.map(normalize);
  const isError = state === "error";

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
        <AutocompletePrimitive.Root
          items={items}
          itemToStringValue={(option: AutocompleteOption) => option.value}
          value={value}
          defaultValue={defaultValue}
          onValueChange={next => onChange?.(next)}
          open={open}
          onOpenChange={next => setOpen(next)}
          disabled={state === "disabled"}
          name={name}
          modal={false}
        >
          <AutocompletePrimitive.InputGroup ref={anchorRef} className={cn(floatingFieldClass({ state, shape, color }), "h-12")}>
            {searchIcon && <MagniferLinear size={20} aria-hidden className="shrink-0 text-fg-grey-700" />}
            <AutocompletePrimitive.Input
              id={inputId}
              placeholder={placeholder ?? (locale === "en" ? "Type to search…" : "输入关键词...")}
              aria-invalid={isError || undefined}
              aria-describedby={isError && errorMessage ? errorId : undefined}
              className={floatingInputClass(state)}
            />
            <AutocompletePrimitive.Clear aria-label={locale === "en" ? "Clear" : "清除"} className={floatingIconButtonClass}>
              <CloseCircleLinear size={18} />
            </AutocompletePrimitive.Clear>
          </AutocompletePrimitive.InputGroup>
          <AutocompletePrimitive.Portal>
            <AutocompletePrimitive.Positioner anchor={anchorRef} sideOffset={4} align="start" collisionPadding={8} className="z-50">
              <AutocompletePrimitive.Popup data-motion={motion} className={cn(floatingListPopupClass, emptyText === undefined && "has-[[role=listbox]:empty]:hidden")}>
                {emptyText !== undefined && <AutocompletePrimitive.Empty className={floatingEmptyClass}>{emptyText}</AutocompletePrimitive.Empty>}
                <AutocompletePrimitive.List className="flex flex-col overflow-y-auto overscroll-contain empty:hidden">
                  {(option: AutocompleteOption) => (
                    <AutocompletePrimitive.Item
                      key={option.value}
                      value={option}
                      disabled={option.disabled}
                      onClick={() => onSelect?.(option)}
                      className={cn(floatingOptionClass, option.description ? "min-h-12 py-2" : "h-12")}
                    >
                      <FloatingOptionContent icon={option.icon} label={option.label ?? option.value} description={option.description} color={color} />
                    </AutocompletePrimitive.Item>
                  )}
                </AutocompletePrimitive.List>
              </AutocompletePrimitive.Popup>
            </AutocompletePrimitive.Positioner>
          </AutocompletePrimitive.Portal>
        </AutocompletePrimitive.Root>
      </div>
    </FieldFrame>
  );
}
