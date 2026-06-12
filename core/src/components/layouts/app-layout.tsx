"use client";

/* eslint-disable @next/next/no-img-element */

import { type CSSProperties, type ReactNode, useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  AltArrowDownLinear,
  HamburgerMenuLinear,
  CalendarBoldDuotone,
  BellBoldDuotone,
  LetterBoldDuotone,
} from "solar-icon-set";
import { PageHeader } from "../ui/page-header";
import {
  MessageMenu,
  NotificationPanel,
  LanguageSwitcher,
  ProfileDropdown,
  TeamSwitcherDropdown,
  CalendarPopup,
  usFlagDataUrl,
  type Team,
  type TeamSwitcherLabels,
} from "./sidebar-popovers";
import { forgeLogoDataUrl } from "../../assets/_inlined";

export type { Team };

// ============================================================
// Types
// ============================================================

export type AppLayoutMode = "light" | "dark";
export type AppLayoutProfilePosition = "sidebar" | "topbar";
export type AppLayoutAccentColor = "purple" | "blue" | "black";

export interface AppLayoutMenuItem {
  icon?: ReactNode;
  label: string;
  href: string;
  badge?: number;
  children?: AppLayoutMenuItem[];
}

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

interface AppLayoutProps {
  mode?: AppLayoutMode;
  profilePosition?: AppLayoutProfilePosition;
  accent?: AppLayoutAccentColor;
  children: ReactNode;
  logo?: ReactNode;
  logoText?: string;
  teamName?: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  /** 自定义 team switcher 下面那行副标题；不传则 fallback 到 `${teamMemberCount} Members` */
  teamSubtitle?: string;
  teams?: Team[];
  /** 默认 sidebar 主菜单。如果传了 sidebarSlot，这个会被忽略 */
  menuItems?: AppLayoutMenuItem[];
  favoriteItems?: AppLayoutMenuItem[];
  profile?: AppLayoutProfile;
  notifications?: number;
  messages?: number;
  pageHeaderVariant?: AppLayoutPageHeaderVariant;
  onBack?: () => void;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  searchPlaceholder?: string;
  pageTitle?: string;
  breadcrumbs?: AppLayoutBreadcrumb[];
  /** 是否在 page header 显示日期选择器（默认：home variant 显示，detail variant 不显示） */
  showDatePicker?: boolean;
  /** 是否在 page header 显示三点菜单（默认 true） */
  showKebab?: boolean;
  /** 完全隐藏 page header 区（标题 / 按钮 / 边框）。chat / 沉浸式页面用 */
  hideHeader?: boolean;
  /** 完全自定义 sidebar 主体（替换 MAIN MENU + menuItems + favoriteItems 那块）。
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
// Accent color tokens
// ============================================================

const accentTokens = {
  purple: {
    activeBg: "bg-fg-violet",
    activeBgLight: "bg-fg-violet",
    activeBgDark: "bg-white/20",
    accentBar: "bg-fg-violet",
    accentBarDark: "bg-white",
    addButton: "bg-fg-violet",
    onAccentMuted: "text-fg-violet-100",
  },
  blue: {
    activeBg: "bg-fg-blue",
    activeBgLight: "bg-fg-blue",
    activeBgDark: "bg-white/20",
    accentBar: "bg-fg-blue",
    accentBarDark: "bg-white",
    addButton: "bg-fg-blue",
    onAccentMuted: "text-fg-blue-100",
  },
  black: {
    activeBg: "bg-fg-black",
    activeBgLight: "bg-fg-black",
    activeBgDark: "bg-white/20",
    accentBar: "bg-fg-black",
    accentBarDark: "bg-white",
    addButton: "bg-fg-black",
    onAccentMuted: "text-fg-grey-400",
  },
} as const;

// ============================================================
// Mode config (light vs dark sidebar)
// ============================================================

const modeConfig = {
  light: {
    outer: "bg-white",
    sidebar: "bg-white shadow-subtle",
    logoText: "text-fg-black",
    hamburger: "text-fg-grey-700 hover:text-fg-black",
    teamSwitcher: "bg-fg-grey-50 outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
    teamName: "text-fg-black",
    teamCount: "text-fg-grey-700",
    teamChevron: "text-fg-grey-700",
    sectionTitle: "text-fg-grey-700",
    menuItem: "text-fg-grey-700 hover:bg-fg-grey-100",
    menuItemActiveText: "text-white font-bold",
    badgeBg: "bg-fg-red",
    profileBg: "bg-fg-grey-50 outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
    profileName: "text-fg-black",
    profileRole: "text-fg-grey-700",
    profileChevron: "text-fg-grey-900",
    contentArea: "bg-fg-grey-50 rounded-3xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
    topbarText: "text-fg-black",
    topbarSubtext: "text-fg-grey-700",
    topbarIcon: "text-fg-grey-700 hover:text-fg-black",
    dividerColor: "bg-fg-grey-200",
    breadcrumbText: "text-fg-grey-700",
    breadcrumbActive: "text-fg-black",
    useAccentBgForActive: true,
  },
  dark: {
    outer: "bg-fg-black",
    sidebar: "bg-fg-black",
    logoText: "text-white",
    hamburger: "text-white/70 hover:text-white",
    teamSwitcher: "bg-white/10",
    teamName: "text-white",
    teamCount: "text-white/70",
    teamChevron: "text-white/70",
    sectionTitle: "text-white/50",
    menuItem: "text-white/70 hover:bg-white/10",
    menuItemActiveText: "text-white font-bold",
    badgeBg: "bg-fg-red",
    profileBg: "bg-white/10",
    profileName: "text-white",
    profileRole: "text-white/70",
    profileChevron: "text-white/70",
    contentArea: "bg-fg-grey-50 rounded-3xl",
    topbarText: "text-fg-black",
    topbarSubtext: "text-fg-grey-700",
    topbarIcon: "text-fg-grey-700 hover:text-fg-black",
    dividerColor: "bg-fg-grey-200",
    breadcrumbText: "text-fg-grey-700",
    breadcrumbActive: "text-fg-black",
    useAccentBgForActive: false,
  },
} as const;

// ============================================================
// Menu Item
// ============================================================

function SidebarMenuItemRow({
  item,
  config,
  accentActive,
  accentBar,
  pathname,
  depth = 0,
  collapsed = false,
}: {
  item: AppLayoutMenuItem;
  config: (typeof modeConfig)[AppLayoutMode];
  accentActive: string;
  accentBar: string;
  pathname: string;
  depth?: number;
  collapsed?: boolean;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isExactActive = pathname === item.href;
  const isChildActive = hasChildren && item.children!.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/")
  );
  const isActive = hasChildren ? false : (isExactActive || (item.href.split("/").length > 2 && pathname.startsWith(item.href + "/")));
  const [expanded, setExpanded] = useState(isExactActive || isChildActive || false);

  // Collapsed mode: icon-only
  if (collapsed && depth === 0) {
    const link = hasChildren ? item.children![0].href : item.href;
    const active = isActive || isChildActive;
    return (
      <a href={link} className="flex justify-center" title={item.label}>
        <span className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          active ? cn(accentActive, "text-white") : config.menuItem
        )}>
          {item.icon}
        </span>
      </a>
    );
  }

  const row = (
    <button
      type="button"
      onClick={() => { if (hasChildren) setExpanded(!expanded); }}
      className={cn(
        "self-stretch px-3.5 py-3 rounded-full inline-flex items-center gap-2 transition-colors relative",
        depth > 0 && "pl-[46px]",
        isActive ? cn(accentActive, config.menuItemActiveText) : config.menuItem
      )}
    >
      {isActive && depth === 0 && (
        <div className={cn("w-1 h-12 absolute left-[-16px] top-0 rounded-tr-lg rounded-br-lg", accentBar)} />
      )}
      {item.icon && <span className="w-6 h-6 flex justify-center items-center shrink-0">{item.icon}</span>}
      <span className="flex-1 text-sm font-semibold leading-5 tracking-fg line-clamp-1 text-left">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span className={cn("px-1.5 py-0.5 rounded-full inline-flex flex-col justify-center items-center gap-2", config.badgeBg)}>
          <span className="text-white text-2xs font-semibold leading-3.5 tracking-fg">{item.badge}</span>
        </span>
      )}
      {hasChildren && (
        <span className="w-6 h-6 flex justify-center items-center shrink-0">
          <span className={cn("transition-transform inline-flex", expanded && "rotate-180")}>
            <AltArrowDownLinear size={16} />
          </span>
        </span>
      )}
    </button>
  );

  const children = hasChildren && expanded && (
    <div className="flex flex-col">
      {item.children!.map((child, i) => (
        <SidebarMenuItemRow key={i} item={child} config={config} accentActive={accentActive} accentBar={accentBar} pathname={pathname} depth={depth + 1} />
      ))}
    </div>
  );

  if (item.href && !hasChildren) {
    return <a href={item.href} className="flex flex-col">{row}{children}</a>;
  }
  return <div className="flex flex-col">{row}{children}</div>;
}

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
  teams,
  menuItems,
  favoriteItems,
  profile,
  notifications,
  messages,
  searchPlaceholder = "Search...",
  pageTitle,
  breadcrumbs,
  pageHeaderVariant = "home",
  onBack,
  primaryAction,
  secondaryAction,
  showDatePicker,
  showKebab = true,
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

  // In dark mode, sidebar bg follows accent (purple → violet, blue → blue, black → black)
  const sidebarBg = mode === "dark" ? accentCfg.activeBg : config.sidebar;
  const outerBg = mode === "dark" ? accentCfg.activeBg : config.outer;

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarStyle = {
    "--forge-sidebar-expanded-width": sidebarWidth,
    "--forge-sidebar-collapsed-width": collapsedSidebarWidth,
  } as CSSProperties;

  // Popover state
  const [openPopover, setOpenPopover] = useState<PopoverId>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  const togglePopover = useCallback((id: PopoverId) => {
    setOpenPopover((prev) => (prev === id ? null : id));
  }, []);

  // Click-outside handler
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (openPopover === null) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-popover]") || target.closest("[data-popover-trigger]")) return;
      setOpenPopover(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPopover]);

  // Helper: active icon style
  const iconActive = (id: PopoverId) =>
    openPopover === id ? cn(accentCfg.activeBg, "text-white") : config.topbarIcon;

  return (
    <div ref={layoutRef} data-accent={accent} className={cn("w-full min-h-screen flex", outerBg)}>
      {/* ====== Sidebar ====== */}
      <div
        style={sidebarStyle}
        className={cn(
          "sticky top-0 h-screen flex flex-col shrink-0 z-30 transition-all duration-300",
          sidebarCollapsed
            ? "w-[var(--forge-sidebar-collapsed-width)] overflow-hidden"
            : "w-[var(--forge-sidebar-expanded-width)] overflow-visible",
          sidebarBg
        )}
      >
        {/* Logo */}
        <div className="h-20 p-6 flex items-center gap-2.5">
          <div
            className={cn("flex-1 flex items-center gap-2 overflow-hidden", sidebarCollapsed && "justify-center cursor-pointer")}
            onClick={sidebarCollapsed ? () => setSidebarCollapsed(false) : undefined}
          >
            {logo ?? <img src={forgeLogoDataUrl} alt="Forge" className="w-8 h-8 shrink-0" />}
            {!sidebarCollapsed && (
              <span className={cn("text-2xl font-semibold leading-8 tracking-fg whitespace-nowrap", config.logoText)}>{logoText}</span>
            )}
          </div>
          {!sidebarCollapsed && (
            <button type="button" onClick={() => setSidebarCollapsed(true)} className={cn("w-5 h-5 transition-colors shrink-0", config.hamburger)}>
              <HamburgerMenuLinear size={20} />
            </button>
          )}
        </div>

        {/* Team switcher */}
        {teamName && !sidebarCollapsed && (
          <div className="px-4 py-3 relative">
            <button
              type="button"
              data-popover-trigger="team"
              onClick={() => togglePopover("team")}
              className={cn("w-full p-4 rounded-xl flex items-center gap-3 transition-colors", config.teamSwitcher)}
            >
              {teamAvatar && <img src={teamAvatar} alt={teamName} className="w-10 h-10 rounded-full object-cover shrink-0" />}
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className={cn("text-sm font-semibold leading-5 tracking-fg line-clamp-1", config.teamName)}>{teamName}</span>
                {(teamSubtitle ?? (teamMemberCount !== undefined ? `${teamMemberCount} Members` : null)) && (
                  <span className={cn("text-xs font-medium leading-4.5 tracking-fg line-clamp-1", config.teamCount)}>
                    {teamSubtitle ?? `${teamMemberCount} Members`}
                  </span>
                )}
              </div>
              <span className={cn("w-6 h-6 flex justify-center items-center shrink-0", config.teamChevron)}>
                <AltArrowDownLinear size={16} />
              </span>
            </button>
            {openPopover === "team" && (
              <div data-popover="team" className="absolute left-full top-0 ml-2 z-50">
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
        <div className={cn("fg-scrollbar-hidden flex-1 p-4 flex flex-col gap-6 overflow-hidden overflow-y-auto", sidebarCollapsed && "items-center px-2")}>
          {sidebarSlot ? (
            sidebarSlot
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {!sidebarCollapsed && (
                  <div className="px-3">
                    <span className={cn("text-xs font-bold leading-4.5 tracking-fg uppercase", config.sectionTitle)}>Main Menu</span>
                  </div>
                )}
                {(menuItems ?? []).map((item, i) => (
                  <SidebarMenuItemRow key={i} item={item} config={config} accentActive={accentActive} accentBar={accentBar} pathname={pathname} collapsed={sidebarCollapsed} />
                ))}
              </div>

              {favoriteItems && favoriteItems.length > 0 && (
                <div className="flex flex-col gap-3">
                  {!sidebarCollapsed && (
                    <div className="px-3">
                      <span className={cn("text-xs font-bold leading-4.5 tracking-fg uppercase", config.sectionTitle)}>Favorite</span>
                    </div>
                  )}
                  {favoriteItems.map((item, i) => (
                    <SidebarMenuItemRow key={i} item={item} config={config} accentActive={accentActive} accentBar={accentBar} pathname={pathname} collapsed={sidebarCollapsed} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Secondary menu + Profile (when profilePosition === "sidebar") */}
        {profilePosition === "sidebar" && !sidebarCollapsed && (
          <div className="relative p-4 flex flex-col gap-4">
            {/* Widget row: language, calendar, notifications, messages */}
            {!hideSidebarWidgets && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  data-popover-trigger="language"
                  onClick={() => togglePopover("language")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors shrink-0", iconActive("language"))}
                >
                  <img src={usFlagDataUrl} alt="Language" className="w-5 h-5 rounded-full object-cover" />
                </button>
                <button
                  type="button"
                  data-popover-trigger="calendar"
                  onClick={() => togglePopover("calendar")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors shrink-0", iconActive("calendar"))}
                >
                  <CalendarBoldDuotone size={20} />
                </button>
                <button
                  type="button"
                  data-popover-trigger="notifications"
                  onClick={() => togglePopover("notifications")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors relative shrink-0", iconActive("notifications"))}
                >
                  <BellBoldDuotone size={20} />
                  {notifications !== undefined && notifications > 0 && openPopover !== "notifications" && (
                    <span className="absolute -right-1.5 top-1 px-1.5 py-0.5 bg-fg-red rounded-full text-white text-2xs font-semibold leading-3.5 tracking-fg">{notifications}</span>
                  )}
                </button>
                <button
                  type="button"
                  data-popover-trigger="messages"
                  onClick={() => togglePopover("messages")}
                  className={cn("p-3 rounded-full flex items-center justify-center transition-colors relative shrink-0", iconActive("messages"))}
                >
                  <LetterBoldDuotone size={20} />
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
              <div data-popover="language" className="absolute left-full bottom-20 ml-4 z-50">
                <LanguageSwitcher accentBg={accentCfg.activeBg} />
              </div>
            )}
            {openPopover === "calendar" && (
              <div data-popover="calendar" className="absolute left-full bottom-20 ml-4 z-50">
                <CalendarPopup accentBg={accentCfg.activeBg} />
              </div>
            )}
            {openPopover === "notifications" && (
              <div data-popover="notifications" className="absolute left-full bottom-4 ml-4 z-50">
                <NotificationPanel onClose={() => setOpenPopover(null)} />
              </div>
            )}
            {openPopover === "messages" && (
              <div data-popover="messages" className="absolute left-full bottom-20 ml-4 z-50">
                <MessageMenu />
              </div>
            )}
            {openPopover === "profile" && (
              <div data-popover="profile" className="absolute left-full bottom-4 ml-4 z-50">
                <ProfileDropdown />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====== Content area ====== */}
      <div className="flex-1 p-2 flex flex-col min-h-screen">
        <div className={cn("flex-1 flex flex-col", config.contentArea)}>

          {/* Topbar: depends on profilePosition */}
          {profilePosition === "topbar" ? (
            /* --- Topbar with search + icons + profile (using PageHeader) --- */
            <div className="relative">
              <PageHeader
                variant="search"
                color={accent}
                searchPlaceholder={searchPlaceholder}
                showCalendar
                onCalendarClick={() => togglePopover("calendar")}
                calendarButtonClassName={iconActive("calendar")}
                messages={messages}
                onMessagesClick={() => togglePopover("messages")}
                messagesButtonClassName={iconActive("messages")}
                notifications={notifications}
                onNotificationsClick={() => togglePopover("notifications")}
                notificationsButtonClassName={iconActive("notifications")}
                onLanguageClick={() => togglePopover("language")}
                languageButtonClassName={iconActive("language")}
                languageFlag={<img src={usFlagDataUrl} alt="Language" className="w-5 h-5 rounded-full object-cover" />}
                showProfile={!!profile}
                profile={profile ? { name: profile.name, role: profile.role, avatar: profile.avatar } : undefined}
                onProfileClick={() => togglePopover("profile")}
                profileButtonClassName={openPopover === "profile" ? cn(accentCfg.activeBg, "text-white") : undefined}
                profileNameClassName={openPopover === "profile" ? "text-white" : "text-fg-black"}
                profileRoleClassName={openPopover === "profile" ? accentCfg.onAccentMuted : "text-fg-grey-700"}
                profileChevronClassName={cn(
                  "transition-transform",
                  openPopover === "profile" ? "text-white rotate-180" : "text-fg-grey-700"
                )}
              />
              {/* Topbar popovers */}
              {openPopover === "calendar" && (
                <div data-popover="calendar" className="absolute top-full right-48 mt-0 z-50">
                  <CalendarPopup accentBg={accentCfg.activeBg} />
                </div>
              )}
              {openPopover === "messages" && (
                <div data-popover="messages" className="absolute top-full right-48 mt-0 z-50">
                  <MessageMenu />
                </div>
              )}
              {openPopover === "notifications" && (
                <div data-popover="notifications" className="absolute top-full right-48 mt-0 z-50">
                  <NotificationPanel onClose={() => setOpenPopover(null)} />
                </div>
              )}
              {openPopover === "language" && (
                <div data-popover="language" className="absolute top-full right-48 mt-0 z-50">
                  <LanguageSwitcher accentBg={accentCfg.activeBg} />
                </div>
              )}
              {openPopover === "profile" && (
                <div data-popover="profile" className="absolute top-full right-0 mt-0 z-50">
                  <ProfileDropdown />
                </div>
              )}
            </div>
          ) : hideHeader ? null : pageHeaderVariant === "detail" ? (
            /* --- Detail Page Header (using PageHeader) --- */
            <PageHeader
              variant="title"
              color={accent}
              title={pageTitle}
              showBackButton
              onBack={onBack}
              showDatePicker={showDatePicker ?? false}
              showFilters={false}
              showKebab={showKebab}
              showFavorite
              secondaryAction={secondaryAction ? { label: secondaryAction.label, onClick: secondaryAction.onClick } : undefined}
              primaryAction={primaryAction ? { label: primaryAction.label, onClick: primaryAction.onClick } : undefined}
            />
          ) : (
            /* --- Home Page Header (using PageHeader) --- */
            <PageHeader
              variant="title"
              color={accent}
              title={pageTitle}
              showBackButton={false}
              showDatePicker={showDatePicker ?? true}
              showFilters={false}
              showKebab={showKebab}
              showFavorite={false}
              primaryAction={primaryAction ? { label: primaryAction.label, onClick: primaryAction.onClick } : undefined}
            />
          )}

          {/* Main content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-5 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
