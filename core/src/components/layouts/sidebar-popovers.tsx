"use client";

/* eslint-disable @next/next/no-img-element */

import { type KeyboardEvent, useState } from "react";
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
} from "solar-icon-set";
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

export type Team = {
  id: string;
  name: string;
  avatar?: string;
  active?: boolean;
};

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
  items[nextIndex]?.focus();
}

// ============================================================
// Calendar helpers
// ============================================================


// ============================================================
// Popover content components
// ============================================================

export function MessageMenu() {
  return (
    <div role="menu" aria-label="消息" onKeyDown={handleMenuKeyDown} className="w-60 p-3 bg-white rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-center items-start gap-1 overflow-hidden">
      {messageMenuItems.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          className="self-stretch px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 hover:bg-fg-grey-100 transition-colors"
        >
          <span className="flex-1 h-6 justify-center text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg">{item.label}</span>
          {item.badge !== undefined && (
            <span className="px-1.5 py-0.5 bg-fg-red rounded-full inline-flex flex-col justify-center items-center gap-2">
              <span className="text-white text-2xs font-semibold leading-4 tracking-fg">{item.badge}</span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <div role="dialog" aria-label="通知" className="w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col justify-start items-start overflow-hidden">
      {/* Header */}
      <div className="self-stretch p-5 bg-white border-b border-fg-grey-200 flex justify-start items-center gap-4 overflow-hidden">
        <span className="flex-1 text-fg-black text-lg font-semibold leading-7 tracking-fg">通知</span>
        <button type="button" aria-label="关闭通知" onClick={onClose} className="w-6 h-6 relative text-fg-grey-700 hover:text-fg-grey-900 transition-colors">
          <CloseCircleLinear size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="max-h-80 overflow-y-auto w-full">
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
                <span className="text-accent text-sm font-bold leading-5 tracking-fg">标为已读</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="self-stretch p-5 bg-white border-t border-fg-grey-200 inline-flex justify-between items-center overflow-hidden">
        <button type="button" className="flex justify-start items-start gap-1 hover:underline">
          <span className="text-accent text-sm font-bold leading-5 tracking-fg">全部标为已读</span>
        </button>
        <button type="button" className="flex justify-start items-start gap-1 hover:underline">
          <span className="text-accent text-sm font-bold leading-5 tracking-fg">查看更多</span>
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
    <div role="menu" aria-label="语言" onKeyDown={handleMenuKeyDown} data-forge-language-switcher data-language-code={active} className="w-60 p-3 bg-white rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-center items-start gap-1 overflow-hidden">
      {languageOptions.map((lang) => {
        const isActive = lang.code === active;
        return (
          <button
            key={lang.code}
            type="button"
            role="menuitemradio"
            data-language-code={lang.code}
            aria-checked={isActive}
            onClick={() => selectLanguage(lang.code)}
            className={cn(
              "self-stretch px-3.5 py-3 relative rounded-full inline-flex justify-start items-center gap-2 transition-colors",
              isActive ? cn(accentBg, "text-white") : "text-fg-grey-700 hover:bg-fg-grey-100"
            )}
          >
            {isActive && <div className={cn("w-1 h-12 left-[-16px] top-0 absolute rounded-tr-lg rounded-br-lg", accentBg)} />}
            <span className="w-6 h-6 flex justify-center items-center">
              <img src={lang.flagUrl} alt={lang.label} className="w-5 h-5 rounded-full object-cover" />
            </span>
            <span className={cn("flex-1 text-sm leading-5 tracking-fg line-clamp-1", isActive ? "font-bold" : "font-semibold")}>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ProfileDropdown() {
  const items = [
    { label: "编辑资料", icon: <PenBold size={20} />, color: "text-fg-grey-700" },
    { label: "修改密码", icon: <LockPasswordBold size={20} />, color: "text-fg-grey-700" },
    { label: "系统设置", icon: <SettingsBold size={20} />, color: "text-fg-grey-700" },
    { label: "退出登录", icon: <Logout2Bold size={20} />, color: "text-fg-red" },
  ];

  return (
    <div role="menu" aria-label="个人菜单" onKeyDown={handleMenuKeyDown} className="w-60 p-3 bg-white rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-center items-start gap-1 overflow-hidden">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          className={cn(
            "self-stretch px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 hover:bg-fg-grey-100 transition-colors",
            item.color
          )}
        >
          <span className="w-6 h-6 flex justify-center items-center">
            <span className="w-5 h-5">{item.icon}</span>
          </span>
          <span className="flex-1 text-sm font-semibold leading-5 tracking-fg line-clamp-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export type TeamSwitcherLabels = {
  invite?: string;
  settings?: string;
  createNew?: string;
};

export function TeamSwitcherDropdown({
  teamName,
  teamAvatar,
  teamMemberCount,
  teamSubtitle,
  teams,
  labels,
  /** When false, only header + teams list (app switcher). Default true. */
  showActions = true,
}: {
  teamName: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  /** 自定义副标题，不传则 fallback 到 `${teamMemberCount} 名成员` */
  teamSubtitle?: string;
  teams?: Team[];
  /** 自定义三个内置按钮的文案（邀请 / 设置 / 新建） */
  labels?: TeamSwitcherLabels;
  showActions?: boolean;
}) {
  const inviteLabel = labels?.invite ?? "邀请成员";
  const settingsLabel = labels?.settings ?? "设置";
  const createNewLabel = labels?.createNew ?? "新建团队";
  const hasTeams = Boolean(teams && teams.length > 0);

  return (
    <div role="menu" aria-label="团队" onKeyDown={handleMenuKeyDown} className="w-64 max-w-[calc(100vw-2rem)] p-3 bg-white rounded-2xl shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-center items-start gap-2.5 overflow-hidden">
      {/* Header: current team (centered layout) */}
      <div className="self-stretch pt-2 flex flex-col justify-start items-center gap-3">
        {teamAvatar && (
          <div className="relative inline-flex justify-start items-start gap-2">
            <img src={teamAvatar} alt={teamName} className="w-16 h-16 rounded-full object-cover" />
          </div>
        )}
        <div className="self-stretch flex flex-col justify-center items-center gap-1">
          <span className="self-stretch text-center text-fg-black text-sm font-semibold leading-5 tracking-fg">{teamName}</span>
          {(teamSubtitle ?? (teamMemberCount !== undefined ? `${teamMemberCount} 名成员` : null)) && (
            <span className="self-stretch text-center text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">
              {teamSubtitle ?? `${teamMemberCount} 名成员`}
            </span>
          )}
        </div>
      </div>

      {showActions ? (
        <>
          <div className="self-stretch flex flex-col justify-start items-start">
            <button type="button" role="menuitem" className="self-stretch px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
              <span className="w-6 h-6 flex justify-center items-center"><UserPlusBold size={20} /></span>
              <span className="flex-1 text-left text-sm font-semibold leading-5 tracking-fg line-clamp-1">{inviteLabel}</span>
            </button>
            <button type="button" role="menuitem" className="self-stretch px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
              <span className="w-6 h-6 flex justify-center items-center"><SettingsBold size={20} /></span>
              <span className="flex-1 text-left text-sm font-semibold leading-5 tracking-fg line-clamp-1">{settingsLabel}</span>
            </button>
          </div>
          <div className="self-stretch px-2.5 flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
          </div>
        </>
      ) : null}

      {/* Team / app list — only when consumer supplies `teams` */}
      {hasTeams ? (
        <>
          {!showActions ? (
            <div className="self-stretch px-2.5 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
            </div>
          ) : null}
          <div className="self-stretch flex flex-col justify-center items-start">
            {teams!.map((team) => (
              <button
                key={team.id}
                type="button"
                role="menuitemradio"
                aria-checked={!!team.active}
                className={cn(
                  "self-stretch px-2.5 py-3 inline-flex justify-start items-center gap-2 transition-colors",
                  team.active ? "text-accent" : "text-fg-grey-700 hover:bg-fg-grey-100"
                )}
              >
                <span className="w-6 h-6 flex justify-center items-center">
                  {team.avatar && (
                    <img src={team.avatar} alt={team.name} className="w-5 h-5 rounded-full object-cover" />
                  )}
                </span>
                <span className={cn("flex-1 text-sm leading-5 tracking-fg text-left line-clamp-1", team.active ? "font-bold" : "font-semibold")}>{team.name}</span>
                {team.active && <CheckCircleBold size={20} />}
              </button>
            ))}
          </div>
          {showActions ? (
            <div className="self-stretch px-2.5 flex flex-col justify-start items-start gap-2">
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
            </div>
          ) : null}
        </>
      ) : null}

      {showActions ? (
        <button type="button" role="menuitem" className="self-stretch px-3.5 py-3 rounded-full inline-flex justify-start items-center gap-2 text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
          <span className="w-6 h-6 flex justify-center items-center"><AddCircleBold size={20} /></span>
          <span className="flex-1 text-left text-sm font-semibold leading-5 tracking-fg line-clamp-1">{createNewLabel}</span>
        </button>
      ) : null}
    </div>
  );
}
