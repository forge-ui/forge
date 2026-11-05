"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import {
  AltArrowDownLinear,
  AltArrowLeftLinear,
  BellBoldDuotone,
  CalendarBoldDuotone,
  HamburgerMenuLinear,
  LetterBoldDuotone,
  MagniferLinear,
  MenuDotsBold,
  SortFromTopToBottomBold,
  StarBoldDuotone,
} from "../icons";
import { accentColors } from "../components/ui/accent-utils";
import { AskAi } from "../components/ui/ask-ai";
import { CalendarPopup } from "../components/ui/calendar-popup";
import type { PageHeaderProps } from "../components/ui/page-header";
import { PlusIcon } from "../components/ui/plain-icons";
import { cn } from "../lib/utils";

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

function HeaderMenuButton({
  onClick,
  className,
  ariaLabel = "打开导航",
  expanded,
  controls,
}: {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  expanded?: boolean;
  controls?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={expanded}
      aria-controls={controls}
      data-forge-menu-trigger={controls ? "" : undefined}
      className={cn(
        "p-3 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden hover:bg-fg-grey-100 transition-colors",
        className,
      )}
    >
      <span className="text-fg-grey-700"><HamburgerMenuLinear size={20} /></span>
    </button>
  );
}

export function SearchHeader({
  color = "blue",
  askAi,
  leftMode = "search",
  onHamburgerClick,
  showMobileMenuButton = false,
  hamburgerAriaLabel,
  hamburgerExpanded,
  hamburgerControls,
  searchPlaceholder = "搜索...",
  onSearch,
  showCalendar = true,
  onCalendarClick,
  calendarExpanded,
  calendarButtonClassName,
  notifications,
  onNotificationsClick,
  notificationsExpanded,
  notificationsButtonClassName,
  messages,
  onMessagesClick,
  messagesExpanded,
  messagesButtonClassName,
  onLanguageClick,
  languageExpanded,
  languageButtonClassName,
  languageFlag,
  showAddButton = true,
  onAddClick,
  showProfile = true,
  profile,
  onProfileClick,
  profileExpanded,
  profileButtonClassName,
  profileNameClassName,
  profileRoleClassName,
  profileChevronClassName,
  children,
  className,
}: PageHeaderProps) {
  const accent = accentColors[color!];

  return (
    <div className={cn("w-full px-4 py-3 sm:px-6 border-b border-fg-grey-200 flex flex-col justify-center items-start", className)}>
      <div className="self-stretch flex justify-between items-center gap-2 sm:gap-4">
        {/* Left: search input or hamburger button */}
        {showMobileMenuButton && leftMode !== "hamburger" && (
          <HeaderMenuButton
            onClick={onHamburgerClick}
            ariaLabel={hamburgerAriaLabel}
            expanded={hamburgerExpanded}
            controls={hamburgerControls}
            className="md:hidden"
          />
        )}
        {leftMode === "hamburger" ? (
          <HeaderMenuButton
            onClick={onHamburgerClick}
            ariaLabel={hamburgerAriaLabel}
            expanded={hamburgerExpanded}
            controls={hamburgerControls}
          />
        ) : (
          <div className="flex-1 max-w-none md:max-w-80 min-w-0 px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-start items-center gap-1 overflow-hidden">
            <div className="w-6 h-6 flex justify-center items-center gap-2 text-fg-grey-700">
              <MagniferLinear size={20} />
            </div>
            <div className="flex-1 h-6 flex justify-start items-center gap-2 overflow-hidden">
              <input
                type="text"
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full bg-transparent text-fg-grey-700 text-sm font-normal leading-5 tracking-fg outline-none placeholder:text-fg-grey-700"
              />
            </div>
          </div>
        )}

        {askAi && <AskAi {...askAi} className={cn("ml-auto", askAi.className)} />}

        {/* Right actions */}
        <div
          className={cn(
            "shrink-0 justify-start items-center gap-2",
            showMobileMenuButton ? "hidden md:flex" : "flex",
          )}
        >
          <div className="pr-3 flex justify-start items-center gap-2">
            {/* Calendar — Figma: data-style="Bold Duotone" */}
            {showCalendar && (
              <button
                type="button"
                aria-label="打开日历"
                aria-haspopup="dialog"
                aria-expanded={calendarExpanded}
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
                aria-label={`通知${notifications > 0 ? `，${notifications} 条未读` : ""}`}
                aria-haspopup="dialog"
                aria-expanded={notificationsExpanded}
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
                aria-label={`消息${messages > 0 ? `，${messages} 条未读` : ""}`}
                aria-haspopup="menu"
                aria-expanded={messagesExpanded}
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
                aria-label="切换语言"
                aria-haspopup="menu"
                aria-expanded={languageExpanded}
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
                aria-label="新增"
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
                aria-label={`打开 ${profile.name} 的个人菜单`}
                aria-haspopup="menu"
                aria-expanded={profileExpanded}
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

export function TitleHeader({
  color = "blue",
  askAi,
  title,
  onHamburgerClick,
  showMobileMenuButton = false,
  hamburgerAriaLabel,
  hamburgerExpanded,
  hamburgerControls,
  showBackButton = true,
  onBack,
  titleAvatar,
  showDatePicker = true,
  datePickerLabel = "选择日期",
  onDatePickerClick,
  showFilters = true,
  filtersLabel = "筛选",
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

  const iconButton =
    "shrink-0 inline-flex items-center justify-center rounded-full bg-white p-2 text-fg-grey-700 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-100 @min-[1000px]:p-3.5";

  return (
    <div className="@container w-full min-w-0">
      {/* Container queries, not the viewport: a desktop window can still give this header ~630px.
          Under 1000px, drop secondary copy and tighten padding so actions stay one line.
          Under 560px, the whole action group moves below the title instead of wrapping beside it. */}
      <div
        data-forge-page-header
        className={cn(
          "flex w-full min-w-0 flex-col gap-2 border-b border-fg-grey-200 px-3 py-2 @min-[1000px]:gap-4 @min-[1000px]:px-5 @min-[1000px]:py-4",
          className,
        )}
      >
        <div className="flex w-full min-w-0 flex-col items-stretch gap-2 @min-[560px]:flex-row @min-[560px]:flex-nowrap @min-[560px]:items-center @min-[560px]:gap-3 @min-[1000px]:gap-4">
          <div className="flex shrink-0 items-center gap-2 @min-[1000px]:gap-3">
            {showMobileMenuButton && (
              <HeaderMenuButton
                onClick={onHamburgerClick}
                ariaLabel={hamburgerAriaLabel}
                expanded={hamburgerExpanded}
                controls={hamburgerControls}
                className="md:hidden"
              />
            )}
            {showBackButton && (
              <button
                type="button"
                aria-label="返回"
                onClick={onBack}
                className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full p-2 text-fg-grey-700 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-100 @min-[1000px]:p-3.5"
              >
                <AltArrowLeftLinear size={20} />
              </button>
            )}
            {titleAvatar && (
              <img className="h-10 w-10 shrink-0 rounded-full @min-[1000px]:h-12 @min-[1000px]:w-12" src={titleAvatar} alt="" />
            )}
            {title && (
              <div data-forge-page-title className="whitespace-nowrap text-base font-semibold leading-6 tracking-fg text-fg-black @min-[1000px]:text-lg @min-[1000px]:leading-7">{title}</div>
            )}
          </div>

          <div className="flex w-full min-w-0 flex-nowrap items-center justify-start gap-1.5 @max-[559px]:overflow-x-auto @min-[560px]:w-auto @min-[560px]:min-w-min @min-[560px]:flex-1 @min-[560px]:justify-end @min-[560px]:gap-2 @min-[1000px]:gap-4">
            {showDatePicker && (
              <DatePickerButton
                label={datePickerLabel}
                onClick={onDatePickerClick}
                enablePopover={!onDatePickerClick}
                accentBg={accent.bg}
              />
            )}

            {showFilters && (
              <button
                type="button"
                aria-label={filtersLabel}
                onClick={onFiltersClick}
                className={cn(iconButton, "gap-1 @min-[1000px]:px-4 @min-[1000px]:py-3.5")}
              >
                <SortFromTopToBottomBold size={20} />
                <span className="hidden whitespace-nowrap text-sm font-semibold leading-5 tracking-fg @min-[1000px]:inline">{filtersLabel}</span>
              </button>
            )}

            {(showKebab || showFavorite) && (
              <div className="h-5 w-0 shrink-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200 @min-[1000px]:h-8" />
            )}

            {showKebab && (
              <button
                type="button"
                aria-label="更多操作"
                aria-haspopup="menu"
                onClick={onKebabClick}
                className={iconButton}
              >
                <MenuDotsBold size={20} />
              </button>
            )}

            {showFavorite && (
              <button
                type="button"
                aria-label="收藏"
                onClick={onFavoriteClick}
                className={iconButton}
              >
                <StarBoldDuotone size={20} />
              </button>
            )}

            {actions}

            {secondaryAction && (
              <button
                type="button"
                aria-label={secondaryAction.label}
                onClick={secondaryAction.onClick}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full text-fg-grey-700 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-100",
                  secondaryAction.icon ? "p-2 @min-[1000px]:py-3.5 @min-[1000px]:pl-3.5 @min-[1000px]:pr-4" : "px-3 py-2 @min-[1000px]:py-3.5 @min-[1000px]:pl-3.5 @min-[1000px]:pr-4",
                )}
              >
                {secondaryAction.icon && (
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{secondaryAction.icon}</span>
                )}
                <span className={cn(
                  "whitespace-nowrap text-sm font-bold leading-5 tracking-fg",
                  secondaryAction.icon ? "hidden @min-[1000px]:inline" : false,
                )}>{secondaryAction.label}</span>
              </button>
            )}

            {askAi && (
              <span className="inline-flex shrink-0 @max-[999px]:[&_button]:h-9 @max-[999px]:[&_button]:gap-1 @max-[999px]:[&_button]:px-2 @max-[999px]:[&_button_img]:h-5 @max-[999px]:[&_button_img]:w-5 @max-[999px]:[&_button>span]:hidden">
                <AskAi {...askAi} className={cn("shrink-0", askAi.className)} />
              </span>
            )}

            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full py-2 pl-2.5 pr-3 text-white transition-opacity hover:opacity-90 @min-[1000px]:py-3.5 @min-[1000px]:pl-3.5 @min-[1000px]:pr-4",
                  accent.bg,
                )}
              >
                {primaryAction.icon ?? <PlusIcon />}
                <span className="whitespace-nowrap text-sm font-bold leading-5 tracking-fg text-white">{primaryAction.label}</span>
              </button>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const usingInternal = !onClick && enablePopover;

  useEffect(() => {
    if (!usingInternal || !open) return;
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [usingInternal, open]);

  const handleClick = () => {
    if (onClick) onClick();
    else if (usingInternal) setOpen((v) => !v);
  };

  return (
    <div className="relative inline-flex shrink-0" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup={usingInternal ? "dialog" : undefined}
        aria-expanded={usingInternal ? open : undefined}
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-1 overflow-hidden rounded-full bg-white p-2 text-sm font-normal leading-5 tracking-fg text-fg-grey-700 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-100 @min-[1000px]:px-4 @min-[1000px]:py-3.5"
      >
        <CalendarBoldDuotone size={20} />
        <span className="hidden whitespace-nowrap @min-[1000px]:inline">{label}</span>
      </button>
      {usingInternal && open && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <CalendarPopup accentBg={accentBg} />
        </div>
      )}
    </div>
  );
}
