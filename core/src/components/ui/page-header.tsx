"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import {
  MagniferLinear,
  CalendarBoldDuotone,
  MenuDotsBold,
  SortFromTopToBottomBold,
  StarBoldDuotone,
  AltArrowDownLinear,
  AltArrowLeftLinear,
  BellBoldDuotone,
  LetterBoldDuotone,
  HamburgerMenuLinear,
} from "solar-icon-set";
import { CalendarPopup } from "./calendar-popup";
import { PlusIcon } from "./plain-icons";

// ============================================================
// PageHeader — Forge UI Kit page header
// Icon styles: BoldDuotone for widget icons, Linear for functional icons
// Wrapper structure (w-6 h-6 p-2 etc.) is the standard Forge icon slot
// ============================================================

import { accentColors, type AccentColor } from "./accent-utils";

export type PageHeaderColor = AccentColor;
export type PageHeaderVariant = "search" | "title";

export interface PageHeaderProfile {
  name: string;
  role: string;
  avatar: string;
}

export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface PageHeaderProps {
  variant?: PageHeaderVariant;
  color?: PageHeaderColor;
  className?: string;

  // --- Search variant props ---
  /** "search" renders search input (default), "hamburger" renders compact menu button. */
  leftMode?: "search" | "hamburger";
  onHamburgerClick?: () => void;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showCalendar?: boolean;
  onCalendarClick?: () => void;
  calendarButtonClassName?: string;
  notifications?: number;
  onNotificationsClick?: () => void;
  notificationsButtonClassName?: string;
  messages?: number;
  onMessagesClick?: () => void;
  messagesButtonClassName?: string;
  onLanguageClick?: () => void;
  languageButtonClassName?: string;
  languageFlag?: ReactNode;
  showAddButton?: boolean;
  onAddClick?: () => void;
  showProfile?: boolean;
  profile?: PageHeaderProfile;
  onProfileClick?: () => void;
  profileButtonClassName?: string;
  profileNameClassName?: string;
  profileRoleClassName?: string;
  profileChevronClassName?: string;

  // --- Title variant props ---
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  titleAvatar?: string;
  showDatePicker?: boolean;
  datePickerLabel?: string;
  onDatePickerClick?: () => void;
  showFilters?: boolean;
  filtersLabel?: string;
  onFiltersClick?: () => void;
  showKebab?: boolean;
  onKebabClick?: () => void;
  showFavorite?: boolean;
  onFavoriteClick?: () => void;
  secondaryAction?: PageHeaderAction;
  primaryAction?: PageHeaderAction;
  actions?: ReactNode;
  children?: ReactNode;
}

// Notification badge — from Figma export
function NotifBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="px-1.5 py-0.5 left-[29px] top-[4px] absolute bg-fg-red rounded-full inline-flex flex-col justify-center items-center gap-2">
      <div className="text-white text-2xs font-semibold leading-4 tracking-fg">
        {count > 99 ? "99" : count}
      </div>
    </div>
  );
}

// ============================================================
// Search & Widget variant — from Figma "Search & Widget"
// ============================================================

function SearchHeader({
  color = "purple",
  leftMode = "search",
  onHamburgerClick,
  searchPlaceholder = "Search. . .",
  onSearch,
  showCalendar = true,
  onCalendarClick,
  calendarButtonClassName,
  notifications,
  onNotificationsClick,
  notificationsButtonClassName,
  messages,
  onMessagesClick,
  messagesButtonClassName,
  onLanguageClick,
  languageButtonClassName,
  languageFlag,
  showAddButton = true,
  onAddClick,
  showProfile = true,
  profile,
  onProfileClick,
  profileButtonClassName,
  profileNameClassName,
  profileRoleClassName,
  profileChevronClassName,
  children,
  className,
}: PageHeaderProps) {
  const accent = accentColors[color!];

  return (
    <div className={cn("w-full px-6 py-3 border-b border-fg-grey-200 flex flex-col justify-center items-start", className)}>
      <div className="self-stretch flex justify-between items-center gap-4">
        {/* Left: search input or hamburger button */}
        {leftMode === "hamburger" ? (
          <button
            type="button"
            onClick={onHamburgerClick}
            className="p-3 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden hover:bg-fg-grey-100 transition-colors"
          >
            <span className="text-fg-grey-700"><HamburgerMenuLinear size={20} /></span>
          </button>
        ) : (
          <div className="flex-1 max-w-80 min-w-0 px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-start items-center gap-1 overflow-hidden">
            <div className="w-6 h-6 flex justify-center items-center gap-2 text-fg-grey-700">
              <MagniferLinear size={20} />
            </div>
            <div className="flex-1 h-6 flex justify-start items-center gap-2 overflow-hidden">
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full bg-transparent text-fg-grey-700 text-sm font-normal leading-5 tracking-fg outline-none placeholder:text-fg-grey-700"
              />
            </div>
          </div>
        )}

        {/* Right actions */}
        <div className="shrink-0 flex justify-start items-center gap-2">
          <div className="pr-3 flex justify-start items-center gap-2">
            {/* Calendar — Figma: data-style="Bold Duotone" */}
            {showCalendar && (
              <button
                type="button"
                data-popover-trigger="calendar"
                onClick={onCalendarClick}
                className={cn("p-3 rounded-full flex justify-start items-center gap-2 transition-colors", calendarButtonClassName ?? "hover:bg-fg-grey-100 text-fg-grey-700")}
              >
                <div className="w-6 h-6 flex justify-center items-center gap-2">
                  <CalendarBoldDuotone size={20} />
                </div>
              </button>
            )}

            {/* Notifications — Figma: data-style="Bold Duotone", data-notification="Yes" */}
            {notifications !== undefined && (
              <button
                type="button"
                data-popover-trigger="notifications"
                onClick={onNotificationsClick}
                className={cn("p-3 relative rounded-full flex justify-start items-center gap-2 transition-colors", notificationsButtonClassName ?? "hover:bg-fg-grey-100 text-fg-grey-700")}
              >
                <div className="w-6 h-6 flex justify-center items-center gap-2">
                  <BellBoldDuotone size={20} />
                </div>
                <NotifBadge count={notifications} />
              </button>
            )}

            {/* Messages — Figma: data-style="Bold Duotone", data-notification="Yes" */}
            {messages !== undefined && (
              <button
                type="button"
                data-popover-trigger="messages"
                onClick={onMessagesClick}
                className={cn("p-3 relative rounded-full flex justify-start items-center gap-2 transition-colors", messagesButtonClassName ?? "hover:bg-fg-grey-100 text-fg-grey-700")}
              >
                <div className="w-6 h-6 flex justify-center items-center gap-2">
                  <LetterBoldDuotone size={20} />
                </div>
                <NotifBadge count={messages} />
              </button>
            )}

            {/* Language */}
            {(languageFlag || onLanguageClick) && (
              <button
                type="button"
                data-popover-trigger="language"
                onClick={onLanguageClick}
                className={cn("p-3 rounded-full flex justify-start items-center gap-2 transition-colors", languageButtonClassName ?? "hover:bg-fg-grey-100 text-fg-grey-700")}
              >
                <div className="w-6 h-6 flex justify-center items-center gap-2">
                  {languageFlag ?? (
                    <img className="w-5 h-5 rounded-full" src="https://placehold.co/20x20" alt="lang" />
                  )}
                </div>
              </button>
            )}

            {/* Add button — Figma: accent circle + Linear plus icon */}
            {showAddButton && (
              <button
                type="button"
                onClick={onAddClick}
                className={cn(
                  "p-2.5 rounded-full flex justify-center items-center gap-1 overflow-hidden text-white",
                  accent.bg
                )}
              >
                <PlusIcon />
              </button>
            )}
          </div>

          {/* Divider + Profile */}
          {showProfile && profile && (
            <>
              <div className="w-0 h-8 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
              <button
                type="button"
                data-popover-trigger="profile"
                onClick={onProfileClick}
                className={cn("px-3.5 py-3 rounded-xl flex justify-start items-center gap-3 transition-colors", profileButtonClassName ?? "hover:bg-fg-grey-100")}
              >
                <div className="inline-flex flex-col justify-start items-end">
                  <img className="w-10 h-10 rounded-full" src={profile.avatar} alt={profile.name} />
                </div>
                <div className="inline-flex flex-col justify-center items-start gap-0.5">
                  <div className={cn("self-stretch text-sm font-semibold leading-5 tracking-fg line-clamp-1", profileNameClassName ?? "text-fg-black")}>{profile.name}</div>
                  <div className={cn("self-stretch text-xs font-medium leading-4.5 tracking-fg line-clamp-1", profileRoleClassName ?? "text-fg-grey-700")}>{profile.role}</div>
                </div>
                <div className={cn("w-6 h-6 flex justify-center items-center gap-2 text-fg-grey-700", profileChevronClassName)}>
                  <AltArrowDownLinear size={20} />
                </div>
              </button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ============================================================
// Page Title variant — from Figma "Page Title"
// ============================================================

function TitleHeader({
  color = "purple",
  title,
  showBackButton = true,
  onBack,
  titleAvatar,
  showDatePicker = true,
  datePickerLabel = "Select Dates",
  onDatePickerClick,
  showFilters = true,
  filtersLabel = "Filters",
  onFiltersClick,
  showKebab = true,
  onKebabClick,
  showFavorite = true,
  onFavoriteClick,
  secondaryAction,
  primaryAction,
  actions,
  children,
  className,
}: PageHeaderProps) {
  const accent = accentColors[color!];

  return (
    <div className={cn("w-full px-5 py-4 border-b border-fg-grey-200 inline-flex justify-start items-center gap-4", className)}>
      {/* Left: back button + optional avatar + title */}
      <div className="flex-1 flex justify-start items-center gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="p-3.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden hover:bg-fg-grey-100 transition-colors text-fg-grey-700"
          >
            <AltArrowLeftLinear size={20} />
          </button>
        )}
        {titleAvatar && (
          <img className="w-12 h-12 rounded-full" src={titleAvatar} alt="" />
        )}
        {title && (
          <div className="flex-1 text-fg-black text-lg font-semibold leading-7 tracking-fg">{title}</div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex justify-start items-center gap-4">
        {/* Date picker — Figma export had w-6 h-6 p-2 wrapper, but p-2 squashes the SVG to 8px wide via flexbox sizing. Use plain w-6 h-6. */}
        {showDatePicker && (
          <DatePickerButton
            label={datePickerLabel}
            onClick={onDatePickerClick}
            enablePopover={!onDatePickerClick}
            accentBg={accent.bg}
          />
        )}

        {/* Filters — Figma: data-style="Bold" filter icon */}
        {showFilters && (
          <button
            type="button"
            onClick={onFiltersClick}
            className="px-4 py-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden hover:bg-fg-grey-100 transition-colors text-fg-grey-700"
          >
            <SortFromTopToBottomBold size={20} />
            <span className="text-sm font-semibold leading-5 tracking-fg">{filtersLabel}</span>
          </button>
        )}

        {/* Divider */}
        {(showKebab || showFavorite) && (
          <div className="w-0 h-8 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
        )}

        {/* Kebab — Figma: data-style="Bold" rotated dots */}
        {showKebab && (
          <button
            type="button"
            onClick={onKebabClick}
            className="p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-start items-center gap-2 hover:bg-fg-grey-100 transition-colors text-fg-grey-700"
          >
            <MenuDotsBold size={20} />
          </button>
        )}

        {/* Favorite — Figma: data-style="Bold Duotone" star */}
        {showFavorite && (
          <button
            type="button"
            onClick={onFavoriteClick}
            className="p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden hover:bg-fg-grey-100 transition-colors text-fg-grey-700"
          >
            <StarBoldDuotone size={20} />
          </button>
        )}

        {/* Custom actions */}
        {actions}

        {/* Secondary action */}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="pl-3.5 pr-4 py-3.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden hover:bg-fg-grey-100 transition-colors"
          >
            {secondaryAction.icon && (
              <span className="w-5 h-5">{secondaryAction.icon}</span>
            )}
            <span className="text-fg-grey-700 text-sm font-bold leading-5 tracking-fg">{secondaryAction.label}</span>
          </button>
        )}

        {/* Primary action — Figma: accent bg + Linear plus icon */}
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className={cn(
              "pl-3.5 pr-4 py-3.5 rounded-full flex justify-center items-center gap-1 overflow-hidden text-white hover:opacity-90 transition-opacity",
              accent.bg
            )}
          >
            {primaryAction.icon ?? <PlusIcon />}
            <span className="text-white text-sm font-bold leading-5 tracking-fg">{primaryAction.label}</span>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ============================================================
// Export
// ============================================================

export function PageHeader(props: PageHeaderProps) {
  const { variant = "title" } = props;

  if (variant === "search") {
    return <SearchHeader {...props} />;
  }

  return <TitleHeader {...props} />;
}

// ============================================================
// DatePickerButton — Select Dates button with built-in calendar popover
// If `onClick` prop is supplied, it takes over (no built-in popover).
// Otherwise clicking toggles a CalendarPopup below the button.
// ============================================================

function DatePickerButton({
  label,
  onClick,
  enablePopover = false,
  accentBg,
}: {
  label: string;
  onClick?: () => void;
  /** Opt-in to built-in calendar popup on click (only when `onClick` is not set). */
  enablePopover?: boolean;
  accentBg: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const usingInternal = !onClick && enablePopover;

  useEffect(() => {
    if (!usingInternal || !open) return;
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [usingInternal, open]);

  const handleClick = () => {
    if (onClick) onClick();
    else if (usingInternal) setOpen((v) => !v);
  };

  return (
    <div className="relative inline-flex" ref={wrapRef}>
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden hover:bg-fg-grey-100 transition-colors text-fg-grey-700"
      >
        <div className="w-6 h-6 flex justify-center items-center gap-2">
          <CalendarBoldDuotone size={20} />
        </div>
        <div className="h-6 flex justify-start items-center gap-2 overflow-hidden">
          <span className="text-sm font-normal leading-5 tracking-fg whitespace-nowrap">{label}</span>
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
