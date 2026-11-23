"use client";

/* eslint-disable @next/next/no-img-element */

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useContext, type KeyboardEvent, type ReactNode, type Ref, useState } from "react";
import { useShellPanel } from "../../internal/shell-popover";
import { ShellMenuContext } from "../../internal/shell-menu-context";
import { cn } from "../../lib/utils";
import {
  CloseCircleLinear,
  CheckCircleBold,
  AddCircleBold,
  UserPlusBold,
  PenBold,
  LockPasswordBold,
  SettingsBold,
  Logout2Bold,
} from "../../icons";
import {
  languageOptions,
  messageMenuItems,
  notificationItems,
  type LanguageCode,
} from "../../internal/sidebar-popover-data";
export { CalendarPopup } from "../ui/calendar-popup";
export {
  chinaFlagDataUrl,
  japanFlagDataUrl,
  languageFlagDataUrls,
  languageMarkDataUrl,
  taiwanFlagDataUrl,
  usFlagDataUrl,
} from "../../internal/sidebar-popover-data";
export type { LanguageCode } from "../../internal/sidebar-popover-data";

export type AppSwitcherItem = {
  id: string;
  name: string;
  avatar?: string;
  active?: boolean;
};

/** @deprecated Use AppSwitcherItem. */
export type Team = AppSwitcherItem;

function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

  const items = [...event.currentTarget.querySelectorAll<HTMLElement>(
    '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"])',
  )];
  if (items.length === 0) return;

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  let nextIndex: number;
  if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = items.length - 1;
  else if (event.key === "ArrowDown") nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
  else nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;

  event.preventDefault();
  items[nextIndex]?.focus({ preventScroll: true });
}

function MenuRow({ radioValue, className, onSelect, children, ...attributes }: {
  radioValue?: string; className: string; onSelect?: () => void; children: ReactNode;
} & Record<`data-${string}`, string | undefined> & { "aria-checked"?: boolean }) {
  const inMenu = useContext(ShellMenuContext);
  // The checked row keeps its accent fill; only other rows get the highlight tint.
  const rowClass = cn(className, "outline-none cursor-pointer data-highlighted:[&:not([data-checked])]:bg-fg-grey-100 data-highlighted:data-checked:ring-2 data-highlighted:data-checked:ring-inset data-highlighted:data-checked:ring-white/40");
  if (inMenu && radioValue !== undefined) {
    const { "aria-checked": _checked, ...rest } = attributes;
    void _checked;
    return <MenuPrimitive.RadioItem {...rest} value={radioValue} closeOnClick onClick={onSelect} className={rowClass}>{children}</MenuPrimitive.RadioItem>;
  }
  if (inMenu) return <MenuPrimitive.Item {...attributes} onClick={onSelect} className={rowClass}>{children}</MenuPrimitive.Item>;
  return <button {...attributes} type="button" role={radioValue !== undefined ? "menuitemradio" : "menuitem"} onClick={onSelect} className={className}>{children}</button>;
}

/** The list wrapper: a plain `role="menu"` when standalone, a radio group inside the shell menu. */
function MenuList({ label, radioValue, className, children, panelRef, ...attributes }: { label: string; radioValue?: string; className: string; children: ReactNode; panelRef?: Ref<HTMLDivElement> } & Record<`data-${string}`, string | boolean | undefined>) {
  const inMenu = useContext(ShellMenuContext);
  if (inMenu) {
    return <div {...attributes} ref={panelRef} className={className}>{radioValue !== undefined ? <MenuPrimitive.RadioGroup value={radioValue} className="contents">{children}</MenuPrimitive.RadioGroup> : children}</div>;
  }
  return <div {...attributes} ref={panelRef} role="menu" aria-label={label} onKeyDown={handleMenuKeyDown} className={className}>{children}</div>;
}

// ============================================================
// Calendar helpers
// ============================================================


// ============================================================
// Popover content components
// ============================================================

export function MessageMenu() {
  return (
    <MenuList label="消息" className="w-60 p-3 bg-background rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-center items-start gap-1 overflow-hidden">
      {messageMenuItems.map((item) => (
        <MenuRow
          key={item.label}
          className="self-stretch px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 hover:bg-fg-grey-100 transition-colors"
        >
          <span className="flex-1 h-6 text-left text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">{item.label}</span>
          {item.badge !== undefined && (
            <span className="px-1.5 py-0.5 bg-fg-red rounded-full inline-flex flex-col justify-center items-center gap-2">
              <span className="text-white text-2xs font-semibold leading-4 tracking-fg">{item.badge}</span>
            </span>
          )}
        </MenuRow>
      ))}
    </MenuList>
  );
}

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useShellPanel(320);
  return (
    <div ref={panelRef} role="dialog" aria-label="通知" className="w-[360px] max-w-[calc(100vw-2rem)] bg-background rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col justify-start items-start overflow-hidden">
      {/* Header */}
      <div className="self-stretch shrink-0 p-5 bg-background border-b border-fg-grey-200 flex justify-start items-center gap-4 overflow-hidden">
        <span className="flex-1 text-fg-black text-lg font-semibold leading-7 tracking-fg">通知</span>
        <button type="button" aria-label="关闭通知" onClick={onClose} className="w-6 h-6 relative text-fg-grey-700 hover:text-fg-grey-900 transition-colors">
          <CloseCircleLinear size={24} />
        </button>
      </div>

      {/* Body */}
      <div data-shell-list className="min-h-0 max-h-80 overflow-y-auto w-full">
        {notificationItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "w-full px-5 py-4 flex flex-col justify-start items-end gap-2",
              !item.read && "bg-fg-yellow-50"
            )}
          >
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              <div className="inline-flex justify-start items-start gap-2">
                <div className="flex justify-start items-center gap-1">
                  <span className="text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">{item.tag}</span>
                </div>
                <div className="flex justify-start items-center gap-1">
                  <span className="text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">{item.time}</span>
                </div>
              </div>
              <span className="self-stretch text-fg-black text-base font-semibold leading-6 tracking-fg">{item.title}</span>
              <span className="w-full text-fg-grey-900 text-sm font-normal leading-5 tracking-fg">{item.description}</span>
            </div>
            {!item.read && (
              <button type="button" className="inline-flex justify-start items-start gap-1 hover:underline">
                <span className="text-accent text-sm font-medium leading-5 tracking-fg">标为已读</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="self-stretch shrink-0 p-5 bg-background border-t border-fg-grey-200 inline-flex justify-between items-center overflow-hidden">
        <button type="button" className="flex justify-start items-start gap-1 hover:underline">
          <span className="text-accent text-sm font-medium leading-5 tracking-fg">全部标为已读</span>
        </button>
        <button type="button" className="flex justify-start items-start gap-1 hover:underline">
          <span className="text-accent text-sm font-medium leading-5 tracking-fg">查看更多</span>
        </button>
      </div>
    </div>
  );
}

export type LanguageSwitcherProps = {
  accentBg: string;
  value?: LanguageCode;
  defaultValue?: LanguageCode;
  onChange?: (language: LanguageCode) => void;
};

export function LanguageSwitcher({
  accentBg,
  value,
  defaultValue = "zh-CN",
  onChange,
}: LanguageSwitcherProps) {
  const [internalValue, setInternalValue] = useState<LanguageCode>(defaultValue);
  const active = value ?? internalValue;

  const selectLanguage = (language: LanguageCode) => {
    if (value === undefined) setInternalValue(language);
    onChange?.(language);
  };

  return (
    <MenuList label="语言" radioValue={active} data-forge-language-switcher data-language-code={active} className="w-60 p-3 bg-background rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-center items-start gap-1 overflow-hidden">
      {languageOptions.map((lang) => {
        const isActive = lang.code === active;
        return (
          <MenuRow
            key={lang.code}
            radioValue={lang.code}
            data-language-code={lang.code}
            aria-checked={isActive}
            onSelect={() => selectLanguage(lang.code)}
            className={cn(
              "self-stretch px-3.5 py-3 relative rounded-full inline-flex justify-start items-center gap-2 transition-colors",
              isActive ? cn(accentBg, "text-white") : "text-fg-grey-700 hover:bg-fg-grey-100"
            )}
          >
            {isActive && <div className={cn("w-1 h-12 left-[-16px] top-0 absolute rounded-tr-lg rounded-br-lg", accentBg)} />}
            <span className="w-6 h-6 flex justify-center items-center">
              <img src={lang.flagUrl} alt={lang.label} className="w-5 h-5 rounded-full object-cover" />
            </span>
            <span className={cn("flex-1 text-left text-sm leading-5 tracking-fg line-clamp-1", isActive ? "font-semibold" : "font-medium")}>{lang.label}</span>
          </MenuRow>
        );
      })}
    </MenuList>
  );
}

export type ProfileMenuItem = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  /** "danger" for sign-out and other destructive entries. */
  tone?: "default" | "danger";
};

export function ProfileDropdown({ locale = "zh", items, onClose }: { locale?: "zh" | "en"; items?: ProfileMenuItem[]; onClose?: () => void } = {}) {
  const panelRef = useShellPanel();
  // Without items the menu shows placeholder entries for templates and demos.
  const entries: (Omit<ProfileMenuItem, "onSelect"> & { onSelect?: () => void })[] = items ?? [
    { label: locale === "en" ? "Edit profile" : "编辑资料", icon: <PenBold size={20} /> },
    { label: locale === "en" ? "Change password" : "修改密码", icon: <LockPasswordBold size={20} /> },
    { label: locale === "en" ? "Settings" : "系统设置", icon: <SettingsBold size={20} /> },
    { label: locale === "en" ? "Sign out" : "退出登录", icon: <Logout2Bold size={20} />, tone: "danger" },
  ];

  return (
    <MenuList panelRef={panelRef} label={locale === "en" ? "Profile menu" : "个人菜单"} className="w-60 p-3 bg-background rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
      {entries.map((item) => (
        <MenuRow
          key={item.label}
          onSelect={item.onSelect ? () => { onClose?.(); item.onSelect?.(); } : undefined}
          className={cn(
            "self-stretch shrink-0 px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 hover:bg-fg-grey-100 transition-colors",
            item.tone === "danger" ? "text-fg-red" : "text-fg-grey-700"
          )}
        >
          {item.icon && (
            <span className="w-6 h-6 flex justify-center items-center">
              <span className="w-5 h-5">{item.icon}</span>
            </span>
          )}
          <span className="flex-1 text-left text-sm font-medium leading-5 tracking-fg line-clamp-1">{item.label}</span>
        </MenuRow>
      ))}
    </MenuList>
  );
}

export type TeamSwitcherLabels = {
  invite?: string;
  settings?: string;
  createNew?: string;
};

export function TeamSwitcherDropdown({
  locale = "zh",
  teamName,
  teamAvatar,
  teamMemberCount,
  teamSubtitle,
  teams,
  labels,
  /** When false, only header + teams list (app switcher). Default false. */
  showActions = false,
  onAppChange,
}: {
  locale?: "zh" | "en";
  teamName: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  /** 自定义副标题，不传则 fallback 到 `${teamMemberCount} 名成员` */
  teamSubtitle?: string;
  teams?: Team[];
  /** 自定义三个内置按钮的文案（邀请 / 设置 / 新建） */
  labels?: TeamSwitcherLabels;
  showActions?: boolean;
  onAppChange?: (app: AppSwitcherItem) => void;
}) {
  const panelRef = useShellPanel(288);
  const inviteLabel = labels?.invite ?? (locale === "en" ? "Invite members" : "邀请成员");
  const settingsLabel = labels?.settings ?? (locale === "en" ? "Settings" : "设置");
  const createNewLabel = labels?.createNew ?? (locale === "en" ? "Create team" : "新建团队");
  const hasTeams = Boolean(teams && teams.length > 0);
  const subtitle = teamSubtitle ?? (showActions && teamMemberCount !== undefined ? (locale === "en" ? `${teamMemberCount} members` : `${teamMemberCount} 名成员`) : (locale === "en" ? "Current application" : "当前应用"));

  return (
    <MenuList panelRef={panelRef} label={locale === "en" ? "Switch application" : "应用切换"} radioValue={teams?.find((team) => team.active)?.id ?? ""} className="w-64 max-w-[calc(100vw-2rem)] p-3 bg-background rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      {/* Header: current team (centered layout) */}
      <div className="self-stretch shrink-0 pt-2 flex flex-col justify-start items-center gap-3">
        {teamAvatar && (
          <div className="relative inline-flex justify-start items-start gap-2">
            <img src={teamAvatar} alt={teamName} className="w-16 h-16 rounded-full object-cover" />
          </div>
        )}
        <div className="self-stretch shrink-0 flex flex-col justify-center items-center gap-1">
          <span className="self-stretch shrink-0 text-center text-fg-black text-sm font-medium leading-5 tracking-fg">{teamName}</span>
          {subtitle && (
            <span className="self-stretch shrink-0 text-center text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {showActions ? (
        <>
          <div className="self-stretch shrink-0 flex flex-col justify-start items-start">
            <MenuRow className="self-stretch shrink-0 px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
              <span className="w-6 h-6 flex justify-center items-center"><UserPlusBold size={20} /></span>
              <span className="flex-1 text-left text-sm font-medium leading-5 tracking-fg line-clamp-1">{inviteLabel}</span>
            </MenuRow>
            <MenuRow className="self-stretch shrink-0 px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
              <span className="w-6 h-6 flex justify-center items-center"><SettingsBold size={20} /></span>
              <span className="flex-1 text-left text-sm font-medium leading-5 tracking-fg line-clamp-1">{settingsLabel}</span>
            </MenuRow>
          </div>
          <div className="self-stretch shrink-0 px-2.5 flex flex-col justify-start items-start gap-2">
            <div className="self-stretch shrink-0 h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
          </div>
        </>
      ) : null}

      {/* Team / app list — only when consumer supplies `teams` */}
      {hasTeams ? (
        <>
          {!showActions ? (
            <div className="self-stretch shrink-0 px-2.5 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch shrink-0 h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
            </div>
          ) : null}
          <div data-shell-list className="self-stretch min-h-0 max-h-72 overflow-y-auto flex flex-col items-start">
            {teams!.map((team) => (
              <MenuRow
                key={team.id}
                radioValue={team.id}
                aria-checked={!!team.active}
                onSelect={() => onAppChange?.(team)}
                className={cn(
                  "self-stretch shrink-0 px-2.5 py-3 inline-flex justify-start items-center gap-2 transition-colors",
                  team.active ? "text-accent" : "text-fg-grey-700 hover:bg-fg-grey-100"
                )}
              >
                <span className="w-6 h-6 flex justify-center items-center">
                  {team.avatar && (
                    <img src={team.avatar} alt={team.name} className="w-5 h-5 rounded-full object-cover" />
                  )}
                </span>
                <span className={cn("flex-1 text-sm leading-5 tracking-fg text-left line-clamp-1", team.active ? "font-semibold" : "font-medium")}>{team.name}</span>
                {team.active && <CheckCircleBold size={20} />}
              </MenuRow>
            ))}
          </div>
          {showActions ? (
            <div className="self-stretch shrink-0 px-2.5 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch shrink-0 h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
            </div>
          ) : null}
        </>
      ) : null}

      {showActions ? (
        <MenuRow className="self-stretch shrink-0 px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
          <span className="w-6 h-6 flex justify-center items-center"><AddCircleBold size={20} /></span>
          <span className="flex-1 text-left text-sm font-medium leading-5 tracking-fg line-clamp-1">{createNewLabel}</span>
        </MenuRow>
      ) : null}
    </MenuList>
  );
}

/** Application switcher with a controlled current application. */
export function AppSwitcherDropdown({
  locale = "zh", appName, appIcon, appSubtitle, apps, onAppChange,
}: {
  locale?: "zh" | "en";
  appName: string;
  appIcon?: string;
  appSubtitle?: string;
  apps?: AppSwitcherItem[];
  onAppChange?: (app: AppSwitcherItem) => void;
}) {
  return <TeamSwitcherDropdown locale={locale} teamName={appName} teamAvatar={appIcon} teamSubtitle={appSubtitle} teams={apps} showActions={false} onAppChange={onAppChange} />;
}
