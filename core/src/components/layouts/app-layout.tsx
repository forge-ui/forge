"use client";

/* eslint-disable @next/next/no-img-element */

import { type CSSProperties, type ReactNode, useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  AltArrowDownLinear,
  HamburgerMenuLinear,
  CloseSquareLinear,
  CalendarBold,
  BellBold,
  LetterBold,
} from "solar-icon-set";
import { PageHeader } from "../ui/page-header";
import { Breadcrumbs } from "../ui/breadcrumbs";
import {
  MessageMenu,
  NotificationPanel,
  LanguageSwitcher,
  ProfileDropdown,
  TeamSwitcherDropdown,
  CalendarPopup,
  languageFlagDataUrls,
  type LanguageCode,
  type Team,
  type TeamSwitcherLabels,
} from "./sidebar-popovers";
import { forgeLogoDataUrl } from "../../assets/_inlined";
import { accentTokens, findActiveSidebarMenuItem, modeConfig, SidebarMenuItemRow } from "../../internal/app-layout-sidebar";
import { languageLabels } from "../../internal/sidebar-popover-data";

export type { Team };

// ============================================================
// Types
// ============================================================

export type AppLayoutMode = "light" | "dark";
export type AppLayoutProfilePosition = "sidebar" | "topbar";
export type AppLayoutAccentColor = "purple" | "blue" | "black";
export type AppLayoutLanguage = LanguageCode;

interface AppLayoutMenuItemBase {
  icon?: ReactNode;
  label: string;
  badge?: number;
}

export type AppLayoutMenuItem =
  | (AppLayoutMenuItemBase & {
      href: string;
      children?: AppLayoutMenuItem[];
    })
  | (AppLayoutMenuItemBase & {
      href?: undefined;
      children: AppLayoutMenuItem[];
    });

export interface AppLayoutProfile {
  avatar: string;
  name: string;
  role: string;
}

export type AppLayoutPageHeaderVariant = "home" | "detail";

export interface AppLayoutBreadcrumb {
  label: string;
  href?: string;
}

export interface AppLayoutProps {
  mode?: AppLayoutMode;
  profilePosition?: AppLayoutProfilePosition;
  accent?: AppLayoutAccentColor;
  children: ReactNode;
  logo?: ReactNode;
  logoText?: string;
  teamName?: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  /** 自定义 team switcher 下面那行副标题；不传则 fallback 到 `${teamMemberCount} 名成员` */
  teamSubtitle?: string;
  /** 自定义 sidebar 主菜单分组标题 */
  menuSectionLabel?: string;
  /** 自定义 sidebar 收藏分组标题 */
  favoriteSectionLabel?: string;
  teams?: Team[];
  /** 默认 sidebar 主菜单。如果传了 sidebarSlot，这个会被忽略 */
  menuItems?: AppLayoutMenuItem[];
  favoriteItems?: AppLayoutMenuItem[];
  profile?: AppLayoutProfile;
  notifications?: number;
  messages?: number;
  language?: AppLayoutLanguage;
  defaultLanguage?: AppLayoutLanguage;
  onLanguageChange?: (language: AppLayoutLanguage) => void;
  pageHeaderVariant?: AppLayoutPageHeaderVariant;
  onBack?: () => void;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  searchPlaceholder?: string;
  topbarLeftMode?: "search" | "hamburger";
  topbarAccent?: AppLayoutAccentColor;
  pageTitle?: string;
  breadcrumbs?: AppLayoutBreadcrumb[];
  /** 是否在 page header 显示日期选择器（默认：home variant 显示，detail variant 不显示） */
  showDatePicker?: boolean;
  /** 是否在 page header 显示三点菜单（默认 true） */
  showKebab?: boolean;
  /** 是否在 page header 显示收藏操作（默认：home variant 不显示，detail variant 显示） */
  showFavorite?: boolean;
  /** 完全隐藏 page header 区（标题 / 按钮 / 边框）。chat / 沉浸式页面用 */
  hideHeader?: boolean;
  /** 完全自定义 sidebar 主体（替换主菜单 + menuItems + favoriteItems 那块）。
   *  传了就用 slot；没传 fallback 到 menuItems / favoriteItems 老逻辑。 */
  sidebarSlot?: ReactNode;
  /** Expanded sidebar width. Accepts any CSS length; default keeps the Forge starter density. */
  sidebarWidth?: string;
  /** Collapsed sidebar rail width. Accepts any CSS length; default keeps the Forge starter density. */
  collapsedSidebarWidth?: string;
  /** 隐藏 sidebar 底部那一排 widget icon（语言、日历、通知、消息），profile 卡保留 */
  hideSidebarWidgets?: boolean;
  /** 自定义 team switcher 下拉里 invite / settings / createNew 按钮的文案 */
  teamLabels?: TeamSwitcherLabels;
}

// ============================================================
// Popover ID type
// ============================================================

type PopoverId = "calendar" | "messages" | "notifications" | "language" | "profile" | "team" | null;

// ============================================================
// AppLayout
// ============================================================

export function AppLayout({
  mode = "light",
  profilePosition = "topbar",
  accent = "purple",
  children,
  logo,
  logoText = "Forge",
  teamName,
  teamAvatar,
  teamMemberCount,
  teamSubtitle,
  menuSectionLabel = "主菜单",
  favoriteSectionLabel = "常用项目",
  teams,
  menuItems,
  favoriteItems,
  profile,
  notifications,
  messages,
  language,
  defaultLanguage = "zh-CN",
  onLanguageChange,
  searchPlaceholder = "搜索...",
  topbarLeftMode = "search",
  topbarAccent,
  pageTitle,
  breadcrumbs,
  pageHeaderVariant = "home",
  onBack,
  primaryAction,
  secondaryAction,
  showDatePicker,
  showKebab = true,
  showFavorite,
  hideHeader,
  sidebarSlot,
  sidebarWidth = "16rem",
  collapsedSidebarWidth = "5rem",
  hideSidebarWidgets,
  teamLabels,
}: AppLayoutProps) {
  const pathname = usePathname();
  const config = modeConfig[mode];
  const accentCfg = accentTokens[accent];

  const accentActive = config.useAccentBgForActive ? accentCfg.activeBgLight : accentCfg.activeBgDark;
  const accentBar = config.useAccentBgForActive ? accentCfg.accentBar : accentCfg.accentBarDark;
  const activeSidebarItem = findActiveSidebarMenuItem(
    [...(menuItems ?? []), ...(favoriteItems ?? [])],
    pathname,
  );

  // In dark mode, sidebar bg follows accent (purple → violet, blue → blue, black → black)
  const sidebarBg = mode === "dark" ? accentCfg.activeBg : config.sidebar;
  const outerBg = mode === "dark" ? accentCfg.activeBg : config.outer;

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [internalLanguage, setInternalLanguage] = useState<AppLayoutLanguage>(defaultLanguage);
  const activeLanguage = language ?? internalLanguage;
  const activeLanguageLabel = languageLabels[activeLanguage];
  const sidebarStyle = {
    "--forge-sidebar-expanded-width": sidebarWidth,
    "--forge-sidebar-collapsed-width": collapsedSidebarWidth,
  } as CSSProperties;

  // Popover state
  const [openPopover, setOpenPopover] = useState<PopoverId>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileSidebarTriggerRef = useRef<HTMLElement | null>(null);
  const popoverTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMobileSidebarOpen(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");
    const getFocusable = () =>
      [...(sidebarRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])];
    const focusable = getFocusable();
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (sidebarRef.current?.querySelector("[data-popover]")) return;
        event.preventDefault();
        setMobileSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const currentFocusable = getFocusable();
      if (currentFocusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!sidebarRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (mobileSidebarTriggerRef.current?.isConnected) {
        mobileSidebarTriggerRef.current.focus();
      }
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (isMobile && !mobileSidebarOpen) setOpenPopover(null);
  }, [isMobile, mobileSidebarOpen]);

  useEffect(() => {
    if (openPopover === null) return;
    const popover = layoutRef.current?.querySelector<HTMLElement>(
      `[data-popover="${openPopover}"]`,
    );
    const menuItem = popover?.querySelector<HTMLElement>(
      '[role="menu"] [role="menuitem"], [role="menu"] [role="menuitemradio"]',
    );
    const dialogControl = popover?.querySelector<HTMLElement>(
      '[role="dialog"] button:not([disabled]), [role="dialog"] input:not([disabled]), [role="dialog"] [tabindex]:not([tabindex="-1"])',
    );
    (menuItem ?? dialogControl)?.focus();
  }, [openPopover]);

  const togglePopover = useCallback((id: PopoverId) => {
    setOpenPopover((prev) => (prev === id ? null : id));
  }, []);

  const closePopover = useCallback((restoreFocus = false) => {
    setOpenPopover(null);
    if (restoreFocus && popoverTriggerRef.current?.isConnected) {
      popoverTriggerRef.current.focus();
    }
  }, []);

  const selectLanguage = useCallback((nextLanguage: AppLayoutLanguage) => {
    if (language === undefined) setInternalLanguage(nextLanguage);
    onLanguageChange?.(nextLanguage);
    closePopover(true);
  }, [closePopover, language, onLanguageChange]);

  // Click-outside handler
  useEffect(() => {
    if (openPopover === null) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-popover]") || target.closest("[data-popover-trigger]")) return;
      setOpenPopover(null);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      closePopover(true);
    }
    function handleFocusOutside(e: FocusEvent) {
      const target = e.target;
      if (!(target instanceof window.Node)) return;
      const popover = layoutRef.current?.querySelector<HTMLElement>(
        `[data-popover="${openPopover}"]`,
      );
      if (popover?.contains(target) || popoverTriggerRef.current?.contains(target)) return;
      setOpenPopover(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("focusin", handleFocusOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("focusin", handleFocusOutside);
    };
  }, [closePopover, openPopover]);

  // Helper: active icon style
  const iconActive = (id: PopoverId) =>
    openPopover === id ? cn(accentCfg.activeBg, "text-white") : config.topbarIcon;

  const toggleSidebar = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      if (!mobileSidebarOpen && document.activeElement instanceof HTMLElement) {
        mobileSidebarTriggerRef.current = document.activeElement;
      }
      setSidebarCollapsed(false);
      setMobileSidebarOpen((open) => !open);
      return;
    }
    setSidebarCollapsed((collapsed) => !collapsed);
  };

  return (
    <div
      ref={layoutRef}
      data-accent={accent}
      data-forge-app-layout
      onClickCapture={(event) => {
        const trigger = (event.target as Element).closest<HTMLElement>("[data-popover-trigger]");
        if (trigger) popoverTriggerRef.current = trigger;
      }}
      className={cn("w-full min-w-0 min-h-screen flex", outerBg)}
    >
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="关闭主导航"
          data-forge-app-overlay
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ====== Sidebar ====== */}
      <div
        ref={sidebarRef}
        id="forge-app-sidebar"
        data-forge-app-sidebar
        role="navigation"
        aria-label="主导航"
        aria-hidden={isMobile && !mobileSidebarOpen ? true : undefined}
        inert={isMobile && !mobileSidebarOpen ? true : undefined}
        onClickCapture={(event) => {
          if (isMobile && (event.target as HTMLElement).closest("a[href]")) {
            setMobileSidebarOpen(false);
          }
        }}
        style={sidebarStyle}
        className={cn(
          "fixed inset-y-0 left-0 h-dvh flex flex-col shrink-0 z-50 transition-[width,transform] duration-300 md:sticky md:top-0 md:z-30 md:h-screen md:translate-x-0",
          "w-[var(--forge-sidebar-expanded-width)] max-w-[calc(100vw-3rem)] overflow-visible",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed
            ? "md:w-[var(--forge-sidebar-collapsed-width)] md:overflow-hidden"
            : "md:w-[var(--forge-sidebar-expanded-width)] md:overflow-visible",
          sidebarBg
        )}
      >
        {/* Logo */}
        <div className="relative h-20 p-6 flex items-center gap-2.5">
          <div
            inert={sidebarCollapsed ? true : undefined}
            className={cn("flex-1 flex items-center gap-2 overflow-hidden", sidebarCollapsed && "justify-center")}
          >
            {logo ?? <img src={forgeLogoDataUrl} alt="Forge" className="w-8 h-8 shrink-0" />}
            {!sidebarCollapsed && (
              <span className={cn("min-w-0 truncate whitespace-nowrap text-2xl font-semibold leading-8 tracking-fg", config.logoText)}>{logoText}</span>
            )}
          </div>
          {sidebarCollapsed && (
            <button
              type="button"
              aria-label="展开主导航"
              onClick={() => setSidebarCollapsed(false)}
              className="absolute inset-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-violet"
            />
          )}
          {!sidebarCollapsed && (
            <button
              type="button"
              aria-label={isMobile ? "关闭主导航" : "收起主导航"}
              onClick={() => isMobile ? setMobileSidebarOpen(false) : setSidebarCollapsed(true)}
              className={cn("w-5 h-5 flex items-center justify-center transition-colors shrink-0", config.hamburger)}
            >
              {isMobile ? <CloseSquareLinear size={20} /> : <HamburgerMenuLinear size={20} />}
            </button>
          )}
        </div>

        {/* Team switcher */}
        {teamName && !sidebarCollapsed && (
          <div className="px-4 py-3 relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openPopover === "team"}
              data-popover-trigger="team"
              onClick={() => togglePopover("team")}
              className={cn("w-full p-4 rounded-xl flex items-center gap-3 transition-colors", config.teamSwitcher)}
            >
              {teamAvatar && <img src={teamAvatar} alt={teamName} className="w-10 h-10 rounded-full object-cover shrink-0" />}
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className={cn("text-sm font-semibold leading-5 tracking-fg line-clamp-1", config.teamName)}>{teamName}</span>
                {(teamSubtitle ?? (teamMemberCount !== undefined ? `${teamMemberCount} 名成员` : null)) && (
                  <span className={cn("text-xs font-medium leading-4.5 tracking-fg line-clamp-1", config.teamCount)}>
                    {teamSubtitle ?? `${teamMemberCount} 名成员`}
                  </span>
                )}
              </div>
              <span className={cn("w-6 h-6 flex justify-center items-center shrink-0", config.teamChevron)}>
                <AltArrowDownLinear size={16} />
              </span>
            </button>
            {openPopover === "team" && (
              <div data-popover="team" className="absolute left-4 top-full mt-2 z-[60] md:left-full md:top-0 md:ml-2 md:mt-0 md:z-50">
                <TeamSwitcherDropdown
                  teamName={teamName}
                  teamAvatar={teamAvatar}
                  teamMemberCount={teamMemberCount}
                  teamSubtitle={teamSubtitle}
                  teams={teams}
                  labels={teamLabels}
                />
              </div>
            )}
          </div>
        )}

        {/* Menu sections */}
        <div
          data-forge-sidebar-scroll
          className={cn("fg-scrollbar-hidden flex-1 p-4 flex flex-col gap-6 overflow-hidden overflow-y-auto", sidebarCollapsed && "items-center px-2")}
        >
          {sidebarSlot ? (
            sidebarSlot
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {!sidebarCollapsed && (
                  <div className="px-3">
                    <span className={cn("text-xs font-bold leading-4.5 tracking-fg uppercase", config.sectionTitle)}>{menuSectionLabel}</span>
                  </div>
                )}
                {(menuItems ?? []).map((item, i) => (
                  <SidebarMenuItemRow key={item.href ?? `${item.label}-${i}`} item={item} config={config} accentActive={accentActive} accentBar={accentBar} pathname={pathname} activeItem={activeSidebarItem} collapsed={sidebarCollapsed} />
                ))}
              </div>

              {favoriteItems && favoriteItems.length > 0 && (
                <div className="flex flex-col gap-3">
                  {!sidebarCollapsed && (
                    <div className="px-3">
                      <span className={cn("text-xs font-bold leading-4.5 tracking-fg uppercase", config.sectionTitle)}>{favoriteSectionLabel}</span>
                    </div>
                  )}
                  {favoriteItems.map((item, i) => (
                    <SidebarMenuItemRow key={item.href ?? `${item.label}-${i}`} item={item} config={config} accentActive={accentActive} accentBar={accentBar} pathname={pathname} activeItem={activeSidebarItem} collapsed={sidebarCollapsed} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Secondary menu + Profile (when profilePosition === "sidebar") */}
        {(profilePosition === "sidebar" || isMobile) && !sidebarCollapsed && (
          <div className="relative p-4 flex flex-col gap-4">
            {/* Widget row: language, calendar, notifications, messages */}
            {!hideSidebarWidgets && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  aria-label={`切换语言，当前${activeLanguageLabel}`}
                  aria-haspopup="menu"
                  aria-expanded={openPopover === "language"}
                  data-language-code={activeLanguage}
                  data-popover-trigger="language"
                  onClick={() => togglePopover("language")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors shrink-0", iconActive("language"))}
                >
                  <img data-forge-language-flag={activeLanguage} src={languageFlagDataUrls[activeLanguage]} alt="" className="w-5 h-5 rounded-full object-cover" />
                </button>
                <button
                  type="button"
                  aria-label="打开日历"
                  aria-haspopup="dialog"
                  aria-expanded={openPopover === "calendar"}
                  data-popover-trigger="calendar"
                  onClick={() => togglePopover("calendar")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors shrink-0", iconActive("calendar"))}
                >
                  <CalendarBold size={20} />
                </button>
                <button
                  type="button"
                  aria-label={`通知${notifications && notifications > 0 ? `，${notifications} 条未读` : ""}`}
                  aria-haspopup="dialog"
                  aria-expanded={openPopover === "notifications"}
                  data-popover-trigger="notifications"
                  onClick={() => togglePopover("notifications")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors relative shrink-0", iconActive("notifications"))}
                >
                  <BellBold size={20} />
                  {notifications !== undefined && notifications > 0 && openPopover !== "notifications" && (
                    <span className="absolute -right-1.5 top-1 px-1.5 py-0.5 bg-fg-red rounded-full text-white text-2xs font-semibold leading-3.5 tracking-fg">{notifications}</span>
                  )}
                </button>
                <button
                  type="button"
                  aria-label={`消息${messages && messages > 0 ? `，${messages} 条未读` : ""}`}
                  aria-haspopup="menu"
                  aria-expanded={openPopover === "messages"}
                  data-popover-trigger="messages"
                  onClick={() => togglePopover("messages")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors relative shrink-0", iconActive("messages"))}
                >
                  <LetterBold size={20} />
                  {messages !== undefined && messages > 0 && openPopover !== "messages" && (
                    <span className="absolute -right-1.5 top-1 px-1.5 py-0.5 bg-fg-red rounded-full text-white text-2xs font-semibold leading-3.5 tracking-fg">{messages}</span>
                  )}
                </button>
              </div>
            )}

            {/* Profile card */}
            {profile && (
              <button
                type="button"
                aria-label={`打开 ${profile.name} 的个人菜单`}
                aria-haspopup="menu"
                aria-expanded={openPopover === "profile"}
                data-popover-trigger="profile"
                onClick={() => togglePopover("profile")}
                className={cn(
                  "w-full p-4 rounded-xl flex items-center gap-3 transition-colors",
                  openPopover === "profile" ? cn(accentCfg.activeBg, "text-white") : config.profileBg
                )}
              >
                <img src={profile.avatar} alt={profile.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <span className={cn(
                    "text-sm font-semibold leading-5 tracking-fg line-clamp-1 text-left",
                    openPopover === "profile" ? "text-white" : config.profileName
                  )}>{profile.name}</span>
                  <span className={cn(
                    "text-xs font-medium leading-4.5 tracking-fg line-clamp-1 text-left",
                    openPopover === "profile" ? "text-white/70" : config.profileRole
                  )}>{profile.role}</span>
                </div>
                <span className={cn(
                  "w-6 h-6 flex justify-center items-center shrink-0 transition-transform",
                  openPopover === "profile" ? "text-white rotate-180" : config.profileChevron
                )}>
                  <AltArrowDownLinear size={22} />
                </span>
              </button>
            )}

            {/* Sidebar popovers - positioned to the right, in the content area */}
            {openPopover === "language" && (
              <div data-popover="language" className="absolute left-4 bottom-20 z-[60] md:left-full md:ml-4 md:z-50">
                <LanguageSwitcher accentBg={accentCfg.activeBg} value={activeLanguage} onChange={selectLanguage} />
              </div>
            )}
            {openPopover === "calendar" && (
              <div data-popover="calendar" className="absolute left-4 bottom-20 w-[calc(100vw-2rem)] z-[60] md:left-full md:ml-4 md:w-screen md:max-w-[400px] md:z-50">
                <CalendarPopup accentBg={accentCfg.activeBg} />
              </div>
            )}
            {openPopover === "notifications" && (
              <div data-popover="notifications" className="absolute left-4 bottom-4 z-[60] md:left-full md:ml-4 md:z-50">
                <NotificationPanel onClose={() => closePopover(true)} />
              </div>
            )}
            {openPopover === "messages" && (
              <div data-popover="messages" className="absolute left-4 bottom-20 z-[60] md:left-full md:ml-4 md:z-50">
                <MessageMenu />
              </div>
            )}
            {openPopover === "profile" && (
              <div data-popover="profile" className="absolute left-4 bottom-4 z-[60] md:left-full md:ml-4 md:z-50">
                <ProfileDropdown />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====== Content area ====== */}
      <div data-forge-app-content className="min-w-0 w-full flex-1 p-0 md:p-2 flex flex-col min-h-screen">
        <div className={cn("min-w-0 flex-1 flex flex-col max-md:rounded-none max-md:outline-none", config.contentArea)}>

          {/* Topbar: depends on profilePosition */}
          {hideHeader ? null : profilePosition === "topbar" ? (
            /* --- Topbar with search + icons + profile (using PageHeader) --- */
            <div className="relative">
              <PageHeader
                variant="search"
                color={topbarAccent ?? accent}
                leftMode={topbarLeftMode}
                onHamburgerClick={toggleSidebar}
                showMobileMenuButton
                hamburgerAriaLabel={mobileSidebarOpen ? "关闭主导航" : "打开主导航"}
                hamburgerExpanded={mobileSidebarOpen}
                hamburgerControls="forge-app-sidebar"
                searchPlaceholder={searchPlaceholder}
                showCalendar
                onCalendarClick={() => togglePopover("calendar")}
                calendarExpanded={openPopover === "calendar"}
                calendarButtonClassName={iconActive("calendar")}
                messages={messages}
                onMessagesClick={() => togglePopover("messages")}
                messagesExpanded={openPopover === "messages"}
                messagesButtonClassName={iconActive("messages")}
                notifications={notifications}
                onNotificationsClick={() => togglePopover("notifications")}
                notificationsExpanded={openPopover === "notifications"}
                notificationsButtonClassName={iconActive("notifications")}
                onLanguageClick={() => togglePopover("language")}
                languageExpanded={openPopover === "language"}
                languageButtonClassName={iconActive("language")}
                languageFlag={<img data-forge-language-flag={activeLanguage} src={languageFlagDataUrls[activeLanguage]} alt={`切换语言，当前${activeLanguageLabel}`} className="w-5 h-5 rounded-full object-cover" />}
                showProfile={!!profile}
                profile={profile ? { name: profile.name, role: profile.role, avatar: profile.avatar } : undefined}
                onProfileClick={() => togglePopover("profile")}
                profileExpanded={openPopover === "profile"}
                profileButtonClassName={openPopover === "profile" ? cn(accentCfg.activeBg, "text-white") : undefined}
                profileNameClassName={openPopover === "profile" ? "text-white" : "text-fg-black"}
                profileRoleClassName={openPopover === "profile" ? accentCfg.onAccentMuted : "text-fg-grey-700"}
                profileChevronClassName={cn(
                  "transition-transform",
                  openPopover === "profile" ? "text-white rotate-180" : "text-fg-grey-700"
                )}
              />
              {/* Topbar popovers */}
              {!isMobile && openPopover === "calendar" && (
                <div data-popover="calendar" className="absolute top-full right-48 mt-0 z-50">
                  <CalendarPopup accentBg={accentCfg.activeBg} />
                </div>
              )}
              {!isMobile && openPopover === "messages" && (
                <div data-popover="messages" className="absolute top-full right-48 mt-0 z-50">
                  <MessageMenu />
                </div>
              )}
              {!isMobile && openPopover === "notifications" && (
                <div data-popover="notifications" className="absolute top-full right-48 mt-0 z-50">
                  <NotificationPanel onClose={() => closePopover(true)} />
                </div>
              )}
              {!isMobile && openPopover === "language" && (
                <div data-popover="language" className="absolute top-full right-48 mt-0 z-50">
                  <LanguageSwitcher accentBg={accentCfg.activeBg} value={activeLanguage} onChange={selectLanguage} />
                </div>
              )}
              {!isMobile && openPopover === "profile" && (
                <div data-popover="profile" className="absolute top-full right-0 mt-0 z-50">
                  <ProfileDropdown />
                </div>
              )}
            </div>
          ) : pageHeaderVariant === "detail" ? (
            /* --- Detail Page Header (using PageHeader) --- */
            <PageHeader
              variant="title"
              color={accent}
              title={pageTitle}
              onHamburgerClick={toggleSidebar}
              showMobileMenuButton
              hamburgerAriaLabel={mobileSidebarOpen ? "关闭主导航" : "打开主导航"}
              hamburgerExpanded={mobileSidebarOpen}
              hamburgerControls="forge-app-sidebar"
              showBackButton
              onBack={onBack}
              showDatePicker={showDatePicker ?? false}
              showFilters={false}
              showKebab={showKebab}
              showFavorite={showFavorite ?? true}
              secondaryAction={secondaryAction ? { label: secondaryAction.label, onClick: secondaryAction.onClick } : undefined}
              primaryAction={primaryAction ? { label: primaryAction.label, onClick: primaryAction.onClick } : undefined}
            />
          ) : (
            /* --- Home Page Header (using PageHeader) --- */
            <PageHeader
              variant="title"
              color={accent}
              title={pageTitle}
              onHamburgerClick={toggleSidebar}
              showMobileMenuButton
              hamburgerAriaLabel={mobileSidebarOpen ? "关闭主导航" : "打开主导航"}
              hamburgerExpanded={mobileSidebarOpen}
              hamburgerControls="forge-app-sidebar"
              showBackButton={false}
              showDatePicker={showDatePicker ?? true}
              showFilters={false}
              showKebab={showKebab}
              showFavorite={showFavorite ?? false}
              secondaryAction={secondaryAction ? { label: secondaryAction.label, onClick: secondaryAction.onClick } : undefined}
              primaryAction={primaryAction ? { label: primaryAction.label, onClick: primaryAction.onClick } : undefined}
            />
          )}

          {/* Main content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-5 overflow-auto">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} color={accent} />
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
