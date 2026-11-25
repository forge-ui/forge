"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useCallback, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { MotionPreference } from "../../../lib/motion";
import { useReducedMotion } from "../../../internal/motion";
import { cn } from "../../../lib/utils";
import { AltArrowDownLinear, CheckCircleLinear, CloseCircleLinear } from "../../../icons";
import { formAccents, type FormAccentColor } from "./form-utils";
import { FieldFrame } from "./field-utils";

// ============================================================
// SelectOption — from Figma "Select Option" page (node 605:104748)
//   type: general | single | multiple | image
//   shape: rounded (corner-12) | pill (full-rounded)
//   color: purple | blue | black
//   state: idle | focus | disabled | error
//   bgVariant: white | grey
// Interaction (listbox keyboard, typeahead, focus return) comes from Base UI Select.
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
  /** 图标建议使用 Solar；image 类型传入 image 时优先显示图片。 */
  icon?: ReactNode;
  /** 菜单项与单选触发器中的辅助说明。 */
  description?: string;
}

type BaseProps = {
  options: SelectOptionItem[];
  motion?: MotionPreference;
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
  /** Shown in the open list when there are no options yet (e.g. a field that depends on another). */
  emptyLabel?: string;
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

const tagBackground: Record<SelectOptionColor, string> = {
  purple: "bg-fg-violet-100",
  blue: "bg-fg-blue-50",
  black: "bg-fg-grey-100",
};
const selectedText: Record<SelectOptionColor, string> = {
  purple: "group-data-selected:text-fg-violet",
  blue: "group-data-selected:text-fg-blue",
  black: "group-data-selected:text-fg-black",
};
const openOutline: Record<SelectOptionColor, string> = {
  purple: "data-popup-open:outline-fg-violet focus-visible:outline-fg-violet",
  blue: "data-popup-open:outline-fg-blue focus-visible:outline-fg-blue",
  black: "data-popup-open:outline-fg-black focus-visible:outline-fg-black",
};

export function SelectOption(props: SelectOptionProps) {
  const {
    options,
    motion = "auto",
    placeholder = "请选择...",
    label,
    errorMessage,
    state = "idle",
    shape = "rounded",
    color = "blue",
    type = "general",
    bgVariant = "white",
    width,
    className,
    headerAction,
    emptyLabel = "暂无选项",
  } = props;

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const attachTrigger = useCallback((node: HTMLElement | null) => { triggerRef.current = node; }, []);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const reduced = useReducedMotion(motion);
  const effectiveMotion = reduced ? "none" : motion;
  const accent = formAccents[color];

  const isError = state === "error";
  const isDisabled = state === "disabled";
  const isMultiple = type === "multiple";
  const isImage = type === "image";
  const isGrey = bgVariant === "grey";
  const shapeClass = shape === "pill" ? "rounded-full" : "rounded-xl";

  const selectedValues: string[] = isMultiple
    ? (Array.isArray(props.value) ? (props.value as string[]) : [])
    : props.value
      ? [props.value as string]
      : [];
  const selectedItems = options.filter((o) => selectedValues.includes(o.value));

  useLayoutEffect(() => {
    // A disabled field must not reopen when it becomes enabled again.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isDisabled && open) setOpen(false);
  }, [isDisabled, open]);

  // Single selection change: the new label slides in.
  const selectionKey = selectedValues.join("\u0000");
  const previousSelection = useRef(selectionKey);
  useLayoutEffect(() => {
    const changed = previousSelection.current !== selectionKey;
    previousSelection.current = selectionKey;
    if (!changed || reduced || isMultiple) return;
    const animation = contentRef.current?.animate?.([
      { opacity: .4, transform: "translateY(5px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
    return () => animation?.cancel();
  }, [selectionKey, reduced, isMultiple]);

  function removeTag(v: string) {
    if (!isMultiple || isDisabled) return;
    (props.onChange as ((value: string[]) => void) | undefined)?.(selectedValues.filter((x) => x !== v));
  }

  // 默认宽度：single=200, multiple=248；业务可以通过 `width` prop 自定义。
  const defaultWidth = isMultiple ? "248px" : "200px";
  const triggerStyle = { width: width ?? defaultWidth, maxWidth: "100%" };
  const surfaceStyle = {
    "--forge-motion-enter-duration": "280ms",
    "--forge-motion-exit-duration": "160ms",
  } as CSSProperties;

  const triggerState = cn(
    isError && "bg-fg-red-50 outline-fg-red",
    isDisabled && "bg-fg-grey-200 outline-fg-grey-200 cursor-not-allowed",
    !isError && !isDisabled && cn(isGrey ? "bg-fg-grey-50" : "bg-background", "outline-fg-grey-100", openOutline[color]),
  );

  return (
    <FieldFrame
      label={label}
      headerAction={headerAction}
      errorMessage={errorMessage}
      showError={isError}
      inputId={triggerId}
      display="inline-flex"
      className={cn("max-w-full", className)}
    >
      <div className="relative min-w-0" style={triggerStyle}>
        <SelectPrimitive.Root<string, boolean>
          multiple={isMultiple}
          value={isMultiple ? selectedValues : (props.value as string | undefined) ?? null}
          onValueChange={(next) => {
            if (isMultiple) (props.onChange as ((value: string[]) => void) | undefined)?.((next as string[] | null) ?? []);
            else if (next != null) (props.onChange as ((value: string) => void) | undefined)?.(next as string);
          }}
          open={open}
          onOpenChange={(next) => setOpen(next && !isDisabled)}
          disabled={isDisabled}
          modal={false}
        >
          <SelectPrimitive.Trigger
            ref={attachTrigger}
            id={triggerId}
            nativeButton={false}
            render={<div />}
            aria-label={label ?? placeholder}
            aria-invalid={isError}
            aria-disabled={isDisabled}
            data-motion={effectiveMotion}
            className={cn(
              "forge-motion-trigger flex items-center gap-2 px-4 py-3 outline outline-1 outline-offset-[-1px] transition-all cursor-pointer overflow-hidden",
              shapeClass,
              isMultiple ? "min-h-12" : selectedItems[0]?.description ? "min-h-12 py-2" : "h-12",
              triggerState,
            )}
            style={{ width: "100%", maxWidth: "100%" }}
          >
            {isMultiple && selectedItems.length > 0 ? (
              <div className="flex-1 flex flex-wrap gap-2">
                {selectedItems.map((item) => (
                  <span key={item.value} className={cn("inline-flex items-center gap-0.5 p-2 rounded-full", tagBackground[color])}>
                    <span className={cn("text-xs font-medium leading-[18px] tracking-fg whitespace-nowrap", accent.text)}>{item.label}</span>
                    {!isDisabled && (
                      <button
                        type="button"
                        aria-label={`移除 ${item.label}`}
                        // Removing a tag must not toggle the listbox underneath.
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); removeTag(item.value); }}
                        className={cn("w-[18px] h-[18px] flex items-center justify-center cursor-pointer shrink-0", accent.text)}
                      >
                        <CloseCircleLinear size={14} color="currentColor" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <div ref={contentRef} className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                {isImage && selectedItems[0]?.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={selectedItems[0].image} alt="" className="size-[22px] shrink-0 rounded-full object-cover" />
                ) : selectedItems[0]?.icon ? <span aria-hidden className="inline-flex size-5 shrink-0 items-center justify-center text-fg-grey-700">{selectedItems[0].icon}</span> : null}
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm font-normal leading-5 tracking-fg",
                      isError && "text-fg-red",
                      isDisabled && "text-fg-grey-700",
                      !selectedItems.length && !isError && "text-fg-grey-700",
                      selectedItems.length > 0 && !isError && !isDisabled && "text-fg-black",
                    )}
                  >{selectedItems[0]?.label ?? placeholder}</span>
                  {selectedItems[0]?.description && <span className="block truncate text-xs font-normal leading-4 tracking-fg text-fg-grey-700">{selectedItems[0].description}</span>}
                </span>
              </div>
            )}
            <span className="forge-chevron w-6 h-6 flex items-center justify-center shrink-0" data-motion={effectiveMotion} data-expanded={open}>
              <AltArrowDownLinear size={20} className={isError ? "text-fg-red" : "text-fg-grey-700"} />
            </span>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner alignItemWithTrigger={false} side="bottom" align="start" sideOffset={4} collisionPadding={8} className="z-50">
              <SelectPrimitive.Popup
                data-motion={effectiveMotion}
                aria-label={label ?? placeholder}
                onBlur={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (next && !event.currentTarget.contains(next) && !triggerRef.current?.contains(next)) setOpen(false);
                }}
                // IME composition must not trigger typeahead; a held key must not toggle repeatedly.
                onKeyDownCapture={(event) => {
                  if (event.nativeEvent.isComposing || (event.repeat && (event.key === " " || event.key === "Enter"))) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
                className="forge-popup flex w-max min-w-(--anchor-width) max-w-(--available-width) max-h-[min(var(--available-height),15rem)] py-2 bg-background rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-100 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] overflow-hidden"
                style={surfaceStyle}
              >
                <SelectPrimitive.List className="flex-1 flex flex-col overflow-y-auto overscroll-contain outline-none">
                  {options.length === 0 && <div className="px-4 py-3 text-sm leading-5 tracking-fg text-fg-grey-500">{emptyLabel}</div>}
                  {options.map((item) => (
                    <SelectPrimitive.Item
                      key={item.value}
                      value={item.value}
                      label={item.label}
                      className={cn("group flex w-full shrink-0 cursor-pointer items-center gap-2 px-4 text-left outline-none data-highlighted:bg-fg-grey-100", item.description ? "min-h-12 py-2" : "h-12 py-3")}
                    >
                      {isImage && item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.image} alt="" className="size-5 shrink-0 rounded-full object-cover" />
                      ) : item.icon ? (
                        <span aria-hidden className={cn("inline-flex size-5 shrink-0 items-center justify-center text-fg-grey-700", selectedText[color])}>{item.icon}</span>
                      ) : null}
                      <span className="min-w-0 flex-1 text-left">
                        <SelectPrimitive.ItemText className={cn("block truncate text-sm leading-5 tracking-fg font-medium text-fg-grey-700 group-data-selected:font-semibold", selectedText[color])}>{item.label}</SelectPrimitive.ItemText>
                        {item.description && <span className="block whitespace-normal break-words text-xs font-normal leading-4 tracking-fg text-fg-grey-700">{item.description}</span>}
                      </span>
                      {/* Reserve the same check column for all rows. */}
                      <SelectPrimitive.ItemIndicator
                        keepMounted
                        className={cn("inline-flex size-[22px] shrink-0 items-center justify-center opacity-0 scale-[.65] data-selected:opacity-100 data-selected:scale-100", !reduced && "transition-[opacity,scale] duration-300", accent.text)}
                      >
                        <CheckCircleLinear size={22} />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.List>
              </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
    </FieldFrame>
  );
}
