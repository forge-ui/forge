"use client";

import { useState, useRef, useEffect, useId, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { AltArrowDownLinear, AltArrowUpLinear } from "solar-icon-set";
import { formAccents, type FormAccentColor } from "./form-utils";
import { FieldFrame, FieldTag } from "./field-utils";

// ============================================================
// SelectOption — from Figma "Select Option" page (node 605:104748)
// 1:1 replica of spec with all variants:
//   type: general | single | multiple | image
//   shape: rounded (corner-12) | pill (full-rounded)
//   color: purple | blue | black
//   state: idle | focus | disabled | error
//   bgVariant: white | grey
// ============================================================

export type SelectOptionState = "idle" | "focus" | "disabled" | "error";
export type SelectOptionShape = "rounded" | "pill";
export type SelectOptionColor = FormAccentColor;
export type SelectOptionType = "general" | "single" | "multiple" | "image";
export type SelectOptionBgVariant = "white" | "grey";

export interface SelectOptionItem {
  value: string;
  label: string;
  image?: string;
}

// ── Option Item (dropdown row) ──────────────────────────────

function OptionItem({
  item,
  selected,
  color,
  isImage,
  onClick,
}: {
  item: SelectOptionItem;
  selected: boolean;
  color: SelectOptionColor;
  isImage?: boolean;
  onClick: () => void;
}) {
  const accent = formAccents[color];
  return (
    <button
      type="button"
      role="option"
      tabIndex={-1}
      aria-selected={selected}
      onClick={onClick}
      className="h-12 px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-fg-grey-100 transition-colors w-full"
    >
      {isImage && item.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={item.image} alt="" className="w-5 h-5 rounded-full shrink-0 object-cover" />
      )}
      <span
        className={cn(
          "flex-1 text-sm leading-5 tracking-fg truncate",
          selected ? cn("font-bold", accent.text) : "font-semibold text-fg-grey-700",
        )}
      >
        {item.label}
      </span>
      {selected && (
        <svg className={cn("w-[22px] h-[22px] shrink-0", accent.text)} viewBox="0 0 22 22" fill="none">
          <path d="M5.5 11.5L9 15L16.5 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ── SelectOption (main) ─────────────────────────────────────

type BaseProps = {
  options: SelectOptionItem[];
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  state?: SelectOptionState;
  shape?: SelectOptionShape;
  color?: SelectOptionColor;
  type?: SelectOptionType;
  bgVariant?: SelectOptionBgVariant;
  /** Trigger width. Defaults: single=200px, multiple=248px. Accepts any CSS width (e.g. "320px", "100%"). */
  width?: string;
  className?: string;
  headerAction?: ReactNode;
};

type SingleProps = BaseProps & {
  type?: "general" | "single" | "image";
  value?: string;
  onChange?: (value: string) => void;
};

type MultipleProps = BaseProps & {
  type: "multiple";
  value?: string[];
  onChange?: (value: string[]) => void;
};

export type SelectOptionProps = SingleProps | MultipleProps;

export function SelectOption(props: SelectOptionProps) {
  const {
    options,
    placeholder = "请选择...",
    label,
    errorMessage,
    state = "idle",
    shape = "rounded",
    color = "purple",
    type = "general",
    bgVariant = "white",
    width,
    className,
    headerAction,
  } = props;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pendingOptionFocusRef = useRef<"first" | "last" | null>(null);
  const listboxId = useId();
  const accent = formAccents[color];

  const isError = state === "error";
  const isDisabled = state === "disabled";
  const isOpen = open && !isDisabled;
  const isMultiple = type === "multiple";
  const isImage = type === "image";
  const isGrey = bgVariant === "grey";

  const shapeClass = shape === "pill" ? "rounded-full" : "rounded-xl";

  function getOptionElements(container: ParentNode | null = ref.current) {
    return container
      ? [...container.querySelectorAll<HTMLElement>('[role="option"]')]
      : [];
  }

  function focusBoundaryOption(target: "first" | "last") {
    const optionElements = getOptionElements();
    const targetIndex = target === "first" ? 0 : optionElements.length - 1;
    optionElements[targetIndex]?.focus();
  }

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!isOpen || pendingOptionFocusRef.current === null) return;
    const optionElements = ref.current
      ? [...ref.current.querySelectorAll<HTMLElement>('[role="option"]')]
      : [];
    const targetIndex = pendingOptionFocusRef.current === "first" ? 0 : optionElements.length - 1;
    optionElements[targetIndex]?.focus();
    pendingOptionFocusRef.current = null;
  }, [isOpen, options.length]);

  const selectedValues: string[] = isMultiple
    ? (Array.isArray(props.value) ? (props.value as string[]) : [])
    : props.value
      ? [props.value as string]
      : [];
  const selectedItems = options.filter((o) => selectedValues.includes(o.value));

  function selectSingle(v: string) {
    if (isMultiple) return;
    (props.onChange as ((value: string) => void) | undefined)?.(v);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function toggleMultiple(v: string) {
    if (!isMultiple) return;
    const next = selectedValues.includes(v)
      ? selectedValues.filter((x) => x !== v)
      : [...selectedValues, v];
    (props.onChange as ((value: string[]) => void) | undefined)?.(next);
  }

  function removeTag(v: string) {
    if (!isMultiple) return;
    const next = selectedValues.filter((x) => x !== v);
    (props.onChange as ((value: string[]) => void) | undefined)?.(next);
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (isDisabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const target = event.key === "ArrowDown" ? "first" : "last";
      if (isOpen) {
        focusBoundaryOption(target);
      } else {
        pendingOptionFocusRef.current = target;
        setOpen(true);
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleListboxKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const currentOption = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!currentOption || !event.currentTarget.contains(currentOption)) return;

    const optionElements = getOptionElements(event.currentTarget);
    const currentIndex = optionElements.indexOf(currentOption);
    if (currentIndex < 0 || optionElements.length === 0) return;

    let nextIndex: number;
    switch (event.key) {
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % optionElements.length;
        break;
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + optionElements.length) % optionElements.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = optionElements.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    optionElements[nextIndex]?.focus();
  }

  // Trigger styling (exactly per Figma: outline-based border)
  // 默认宽度：single=200, multiple=248；业务可以通过 `width` prop 自定义。
  const defaultWidth = isMultiple ? "248px" : "200px";
  const triggerBase = cn(
    "flex items-center gap-2 px-4 py-3 outline outline-1 outline-offset-[-1px] transition-all cursor-pointer overflow-hidden",
    shapeClass,
    isMultiple ? "min-h-12" : "h-12",
  );
  const triggerStyle = { width: width ?? defaultWidth };

  const triggerState = cn(
    isError && "bg-fg-red-50 outline-fg-red",
    isDisabled && "bg-fg-grey-200 outline-fg-grey-200 cursor-not-allowed",
    isOpen && !isError && !isDisabled && cn(isGrey ? "bg-fg-grey-50" : "bg-white", accent.outline),
    !isError && !isDisabled && !isOpen && cn(isGrey ? "bg-fg-grey-50" : "bg-white", "outline-fg-grey-100"),
  );

  const ChevronIcon = isOpen ? AltArrowUpLinear : AltArrowDownLinear;

  return (
    <FieldFrame
      ref={ref}
      label={label}
      headerAction={headerAction}
      errorMessage={errorMessage}
      showError={isError}
      display="inline-flex"
      className={className}
    >
      <div className="relative">
        <div
          ref={triggerRef}
          role="combobox"
          tabIndex={isDisabled ? -1 : 0}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-label={label ?? placeholder}
          aria-disabled={isDisabled}
          aria-invalid={isError}
          className={cn(triggerBase, triggerState)}
          style={triggerStyle}
          onClick={() => !isDisabled && setOpen(!open)}
          onKeyDown={handleTriggerKeyDown}
        >
          {/* Content */}
          {isMultiple && selectedItems.length > 0 ? (
            <div className="flex-1 flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <FieldTag
                  key={item.value}
                  label={item.label}
                  color={color}
                  onRemove={() => removeTag(item.value)}
                />
              ))}
            </div>
          ) : isImage && selectedItems[0] ? (
            <>
              {selectedItems[0].image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={selectedItems[0].image} alt="" className="w-[22px] h-[22px] rounded-full shrink-0 object-cover" />
              )}
              <span className="flex-1 text-sm font-normal leading-5 tracking-fg text-fg-black truncate">
                {selectedItems[0].label}
              </span>
            </>
          ) : (
            <div className="flex-1 h-6 flex items-center overflow-hidden">
              <span
                className={cn(
                  "text-sm font-normal leading-5 tracking-fg truncate",
                  isError && "text-fg-red",
                  isDisabled && "text-fg-grey-700",
                  !selectedItems.length && !isError && "text-fg-grey-700",
                  selectedItems.length > 0 && !isError && !isDisabled && "text-fg-black",
                )}
              >
                {selectedItems[0]?.label ?? placeholder}
              </span>
            </div>
          )}

          {/* Chevron */}
          <span className="w-6 h-6 flex items-center justify-center shrink-0">
            <ChevronIcon size={20} className={isError ? "text-fg-red" : "text-fg-grey-700"} />
          </span>
        </div>

        {/* Dropdown — 宽度跟 trigger 一致 */}
        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            aria-multiselectable={isMultiple || undefined}
            onKeyDown={handleListboxKeyDown}
            className="absolute top-full left-0 mt-1 py-2 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-100 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] z-50 flex overflow-hidden"
            style={triggerStyle}
          >
            <div className="flex-1 flex flex-col overflow-y-auto max-h-60">
              {options.map((option) => (
                <OptionItem
                  key={option.value}
                  item={option}
                  selected={selectedValues.includes(option.value)}
                  color={color}
                  isImage={isImage}
                  onClick={() => isMultiple ? toggleMultiple(option.value) : selectSingle(option.value)}
                />
              ))}
            </div>
            {/* Scrollbar track with accent thumb */}
            {options.length > 4 && (
              <div className="w-1 bg-fg-grey-100 self-stretch shrink-0 relative">
                <div className={cn("absolute top-2 left-0 right-0 h-14 rounded-full", accent.bg)} />
              </div>
            )}
          </div>
        )}
      </div>
    </FieldFrame>
  );
}
