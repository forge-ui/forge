"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { MagniferLinear, CalendarBoldDuotone, FilterBold, AltArrowDownLinear, MenuDotsBold, StarBoldDuotone } from "solar-icon-set";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import { Button } from "./button";
import { CalendarPopup } from "./calendar-popup";

// ============================================================
// Toolbar - Top toolbar layout
// Variants: search-filter, page-title
// color: purple, blue, black  (drives active pill tab + callers' Primary button)
// ============================================================

export type ToolbarColor = "purple" | "blue" | "black";

const toolbarPillActive = {
  purple: "bg-fg-violet-100 text-fg-violet",
  blue: "bg-fg-blue-100 text-fg-blue",
  black: "bg-fg-grey-200 text-fg-black",
} as const;

// ── Toolbar (generic flex row) ──────────────────────────────

export function Toolbar({
  left,
  right,
  className,
}: {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-start",
        className,
      )}
    >
      {left}
      {right}
    </div>
  );
}

// ── ToolbarSearchInput ──────────────────────────────────────

export function ToolbarSearchInput({
  placeholder = "搜索...",
  value,
  defaultValue,
  onChange,
  onSubmit,
  ariaLabel,
  className,
}: {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(inputRef.current?.value ?? "");
      }}
      className={cn(
        "w-full min-w-0 px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-start items-center gap-1 overflow-hidden sm:w-80 sm:max-w-80",
        className,
      )}
    >
      <div className="w-6 h-6 flex justify-center items-center">
        <MagniferLinear size={20} color="var(--fg-grey-700)" />
      </div>
      <input
        ref={inputRef}
        type="search"
        aria-label={ariaLabel ?? placeholder}
        placeholder={placeholder}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-6 min-w-0 flex-1 bg-transparent text-sm font-normal leading-5 tracking-fg text-fg-black outline-none placeholder:text-fg-grey-700"
      />
    </form>
  );
}

// ── Shared: outside-click hook ──────────────────────────────

function useOutsideClick<T extends HTMLElement>(
  active: boolean,
  onOutside: () => void,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!active) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [active, onOutside]);
  return ref;
}

// ── ToolbarSelectDropdown ───────────────────────────────────

export interface ToolbarSelectOption {
  label: string;
  value: string;
}

export function ToolbarSelectDropdown({
  placeholder = "请选择...",
  value,
  fixedWidth,
  onClick,
  options,
  onChange,
  className,
}: {
  placeholder?: string;
  value?: string;
  fixedWidth?: boolean;
  /** External click handler. If set, takes over (no built-in dropdown). */
  onClick?: () => void;
  /** Data-driven options. When set (and `onClick` not set), clicking pops the list. */
  options?: ToolbarSelectOption[];
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const usingInternal = !onClick && options !== undefined;
  const wrapRef = useOutsideClick<HTMLDivElement>(usingInternal && open, () => setOpen(false));

  const matched = options?.find((o) => o.value === value);
  const displayText = matched?.label ?? value ?? placeholder;
  const hasValue = value !== undefined;

  const handleClick = () => {
    if (onClick) onClick();
    else if (options !== undefined) setOpen((v) => !v);
  };

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-2 overflow-hidden cursor-pointer",
          fixedWidth && "w-20",
        )}
      >
        <div className="flex-1 h-6 flex justify-start items-center gap-2 overflow-hidden">
          <span
            className={cn(
              "justify-start text-sm font-normal leading-5 tracking-fg whitespace-nowrap",
              hasValue ? "text-fg-black" : "text-fg-grey-700",
            )}
          >
            {displayText}
          </span>
        </div>
        <div className="w-6 h-6 flex justify-center items-center">
          <AltArrowDownLinear size={20} color="var(--fg-grey-700)" />
        </div>
      </button>
      {usingInternal && open && options && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-full bg-white rounded-2xl shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-2 flex flex-col gap-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
              className={cn(
                "px-3 py-2 rounded-xl text-left text-sm leading-5 tracking-fg transition-colors whitespace-nowrap",
                value === opt.value ? "bg-fg-grey-100 text-fg-black font-semibold" : "text-fg-grey-700 hover:bg-fg-grey-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ToolbarDatepicker ───────────────────────────────────────

export function ToolbarDatepicker({
  label = "选择日期",
  onClick,
  enablePopover = false,
  accentBg = "bg-fg-violet",
  className,
}: {
  label?: string;
  /** External click handler. If set, takes over (no built-in calendar). */
  onClick?: () => void;
  /** Opt-in to built-in calendar popup on click (only when `onClick` is not set). */
  enablePopover?: boolean;
  /** Accent bg class for today's highlight in built-in calendar. */
  accentBg?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const usingInternal = !onClick && enablePopover;
  const wrapRef = useOutsideClick<HTMLDivElement>(usingInternal && open, () => setOpen(false));

  const handleClick = () => {
    if (onClick) onClick();
    else if (usingInternal) setOpen((v) => !v);
  };

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer"
      >
        <div className="w-6 h-6 flex justify-center items-center">
          <CalendarBoldDuotone size={20} color="var(--fg-grey-700)" />
        </div>
        <div className="h-6 flex justify-start items-center gap-2 overflow-hidden">
          <span className="justify-start text-fg-grey-700 text-sm font-normal leading-5 tracking-fg whitespace-nowrap">
            {label}
          </span>
        </div>
      </button>
      {usingInternal && open && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <CalendarPopup accentBg={accentBg} />
        </div>
      )}
    </div>
  );
}

// ── ToolbarFilterButton ─────────────────────────────────────

export type ToolbarFilterPanel = ReactNode | ((close: () => void) => ReactNode);

export function ToolbarFilterButton({
  label = "筛选",
  onClick,
  panel,
  className,
}: {
  label?: string;
  /** External click handler. If set, takes over (no built-in popover). */
  onClick?: () => void;
  /** Optional panel. `ReactNode` or `(close) => ReactNode` so inner Apply/Cancel can close it. */
  panel?: ToolbarFilterPanel;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const usingInternal = !onClick && panel !== undefined;
  const wrapRef = useOutsideClick<HTMLDivElement>(usingInternal && open, () => setOpen(false));

  const handleClick = () => {
    if (onClick) onClick();
    else if (panel !== undefined) setOpen((v) => !v);
  };

  const renderedPanel = typeof panel === "function" ? panel(() => setOpen(false)) : panel;

  return (
    <div className={cn("relative inline-flex", className)} ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!onClick && panel === undefined}
        className="px-4 py-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FilterBold size={20} color="var(--fg-grey-700)" />
        <span className="justify-start text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg whitespace-nowrap">
          {label}
        </span>
      </button>
      {usingInternal && open && (
        <div className="absolute right-0 top-full mt-2 z-50">{renderedPanel}</div>
      )}
    </div>
  );
}

// ── ToolbarShowSelect ───────────────────────────────────────

export function ToolbarShowSelect({
  value = "1",
  onClick,
  options,
  onChange,
  className,
}: {
  value?: string;
  onClick?: () => void;
  options?: ToolbarSelectOption[];
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-start items-center gap-2", className)}>
      <span className="justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
        显示
      </span>
      <ToolbarSelectDropdown
        value={value}
        fixedWidth
        onClick={onClick}
        options={options}
        onChange={onChange}
      />
    </div>
  );
}

// ── ToolbarActions (right-side action group) ────────────────

export function ToolbarActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full min-w-0 max-w-full flex-wrap items-start justify-start gap-3 sm:w-auto sm:flex-nowrap sm:justify-end", className)}>
      {children}
    </div>
  );
}

// ── ToolbarKebabButton ──────────────────────────────────────

export function ToolbarKebabButton({
  onClick,
  ariaLabel = "更多操作",
  className,
}: {
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center cursor-pointer",
        className,
      )}
    >
      <MenuDotsBold size={20} color="var(--fg-grey-700)" />
    </button>
  );
}

// ── ToolbarFavoriteButton ───────────────────────────────────

export function ToolbarFavoriteButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center cursor-pointer",
        className,
      )}
    >
      <StarBoldDuotone size={20} color="var(--fg-grey-700)" />
    </button>
  );
}

// ── ToolbarPillTabs ─────────────────────────────────────────
// Pill-style tab group used in Toolbar rows (not to be confused with
// TabBar which renders an underlined bar). Active pill adopts the
// toolbar color; inactive pills stay grey.

export interface ToolbarPillTab {
  label: string;
  active?: boolean;
}

export function ToolbarPillTabs({
  tabs,
  color = "purple",
  onChange,
  className,
}: {
  tabs: ToolbarPillTab[];
  color?: ToolbarColor;
  onChange?: (index: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-start justify-start overflow-x-auto rounded-full bg-white p-1 outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange?.(index)}
          className={cn(
            "flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm leading-5 tracking-fg",
            tab.active
              ? cn(toolbarPillActive[color], "font-bold")
              : "text-fg-grey-700 font-semibold",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── PageTitleToolbar ────────────────────────────────────────

export type PageTitleToolbarVariant = "overview" | "collection" | "detail" | "action";

export interface PageTitleToolbarAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  form?: string;
  ariaLabel?: string;
  testId?: string;
}

export interface PageTitleToolbarDateAction {
  label?: string;
  onClick?: () => void;
  enablePopover?: boolean;
}

export interface PageTitleToolbarMenuAction {
  onClick?: () => void;
  ariaLabel?: string;
}

interface PageTitleToolbarPresetBase {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  color?: ToolbarColor;
}

interface PageTitleToolbarOverviewProps extends PageTitleToolbarPresetBase {
  variant: "overview";
  subtitle?: string;
  dateAction?: PageTitleToolbarDateAction;
  primaryAction?: PageTitleToolbarAction;
  secondaryAction?: never;
  menuAction?: never;
}

interface PageTitleToolbarCollectionProps extends PageTitleToolbarPresetBase {
  variant: "collection";
  subtitle?: string;
  dateAction?: PageTitleToolbarDateAction;
  secondaryAction?: PageTitleToolbarAction;
  primaryAction?: PageTitleToolbarAction;
  menuAction?: never;
}

interface PageTitleToolbarDetailProps extends PageTitleToolbarPresetBase {
  variant: "detail";
  subtitle?: string;
  dateAction?: never;
  menuAction?: PageTitleToolbarMenuAction;
  secondaryAction?: PageTitleToolbarAction;
  primaryAction?: PageTitleToolbarAction;
}

interface PageTitleToolbarActionProps extends PageTitleToolbarPresetBase {
  variant: "action";
  subtitle?: never;
  dateAction?: never;
  menuAction?: never;
  secondaryAction: PageTitleToolbarAction;
  primaryAction: PageTitleToolbarAction;
}

export type PageTitleToolbarPresetProps =
  | PageTitleToolbarOverviewProps
  | PageTitleToolbarCollectionProps
  | PageTitleToolbarDetailProps
  | PageTitleToolbarActionProps;

interface PageTitleToolbarLegacyProps {
  /** @deprecated Use a fixed `variant` with `breadcrumbItems` and typed actions. */
  variant?: never;
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export type PageTitleToolbarProps = PageTitleToolbarPresetProps | PageTitleToolbarLegacyProps;

export function PageTitleToolbar(props: PageTitleToolbarProps) {
  if (props.variant) {
    const {
      variant,
      title,
      subtitle,
      breadcrumbItems,
      color = "purple",
      dateAction,
      menuAction,
      secondaryAction,
      primaryAction,
    } = props;
    const hasActions = Boolean(dateAction || menuAction || secondaryAction || primaryAction);

    return (
      <PageTitleToolbarFrame
        title={title}
        subtitle={subtitle}
        breadcrumbs={
          <Breadcrumbs
            items={breadcrumbItems}
            color={color}
            className="flex-wrap gap-y-1 [&>span]:whitespace-nowrap"
          />
        }
        actions={hasActions ? (
          <ToolbarActions className="w-full flex-wrap sm:w-auto sm:shrink-0">
            {dateAction ? (
              <ToolbarDatepicker
                label={dateAction.label}
                onClick={dateAction.onClick}
                enablePopover={dateAction.enablePopover}
              />
            ) : null}
            {menuAction ? (
              <ToolbarKebabButton
                onClick={menuAction.onClick}
                ariaLabel={menuAction.ariaLabel}
              />
            ) : null}
            {secondaryAction ? (
              <PageTitleActionButton action={secondaryAction} color="grey" variant="tertiary" />
            ) : null}
            {primaryAction ? (
              <PageTitleActionButton action={primaryAction} color={color} variant="primary" />
            ) : null}
          </ToolbarActions>
        ) : undefined}
        className="flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:gap-4 [&>div:first-child]:min-w-0 [&>div:first-child]:w-full"
        variant={variant}
      />
    );
  }

  const { title, subtitle, breadcrumbs, actions, className } = props;

  return (
    <PageTitleToolbarFrame
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      actions={actions}
      className={className}
    />
  );
}

function PageTitleActionButton({
  action,
  color,
  variant,
}: {
  action: PageTitleToolbarAction;
  color: ToolbarColor | "grey";
  variant: "primary" | "tertiary";
}) {
  return (
    <Button
      color={color}
      variant={variant}
      size="lg"
      iconLeft={action.icon}
      onClick={action.onClick}
      disabled={action.disabled}
      type={action.type}
      form={action.form}
      aria-label={action.ariaLabel}
      data-testid={action.testId}
    >
      {action.label}
    </Button>
  );
}

function PageTitleToolbarFrame({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
  variant,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
  variant?: PageTitleToolbarVariant;
}) {
  const hasSubContent = subtitle || breadcrumbs;

  return (
    <div
      data-forge-page-title-variant={variant}
      className={cn(
        "flex w-full self-stretch justify-start items-end gap-4",
        !hasSubContent && "items-center",
        className,
      )}
    >
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
        <h1 className="self-stretch justify-start text-fg-black text-2xl font-semibold leading-8 tracking-fg">
          {title}
        </h1>
        {subtitle && (
          <div className="self-stretch justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
            {subtitle}
          </div>
        )}
        {breadcrumbs}
      </div>
      {actions}
    </div>
  );
}
