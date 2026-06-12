/* eslint-disable @next/next/no-img-element */

import { accentColors, type AccentColor } from "./accent-utils";

// Chat-specific extensions for ContactItem (subtitle color when active, team avatar bg).
// Aligned with forge token系：teamBg/teamText 走对应 accent 的 fg-{color}-100 / fg-{color}。
// black.teamBg 走 fg-grey-100 而非 fg-black-100（与 accentColors.black.bgTint 一致）。
const chatAccentExtras: Record<AccentColor, { teamBg: string; teamText: string; activeSubText: string }> = {
  purple: { teamBg: "bg-fg-violet-100", teamText: "text-fg-violet", activeSubText: "text-fg-violet-100" },
  blue: { teamBg: "bg-fg-blue-100", teamText: "text-fg-blue", activeSubText: "text-fg-blue-100" },
  black: { teamBg: "bg-fg-grey-200", teamText: "text-fg-black", activeSubText: "text-fg-grey-200" },
};

export function ContactItem({
  type = "person",
  color = "purple",
  avatar,
  initials,
  name,
  message,
  online = false,
  active = false,
  unreadCount,
  time,
  className = "",
}: {
  type?: "person" | "team";
  color?: AccentColor;
  avatar?: string;
  initials?: string;
  name: string;
  message?: string;
  online?: boolean;
  active?: boolean;
  unreadCount?: number;
  time?: string;
  className?: string;
}) {
  const accent = accentColors[color];
  const extra = chatAccentExtras[color];

  const computedInitials = (initials ?? name
    .split(" ")
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase()) || "??";

  // Online dot's outline matches background — active state matches accent bg, otherwise white
  const onlineDotOutline = active ? accent.outline : "outline-white";

  return (
    <div
      className={`px-3 py-3.5 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${
        active ? accent.bg : "hover:bg-fg-grey-100"
      } ${className}`}
    >
      {/* Avatar */}
      <div className="relative inline-flex flex-col justify-start items-end shrink-0">
        {type === "person" ? (
          <img
            src={avatar ?? "https://placehold.co/40x40"}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 p-2.5 ${extra.teamBg} rounded-full inline-flex justify-center items-center`}>
            <span className={`${extra.teamText} text-sm font-bold leading-5 tracking-fg`}>
              {computedInitials}
            </span>
          </div>
        )}
        {online && (
          <span
            className={`absolute right-0 bottom-0 w-2.5 h-2.5 bg-fg-green-500 rounded-full outline-2 ${onlineDotOutline}`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <p
          className={`text-sm font-semibold leading-5 tracking-fg line-clamp-1 ${
            active ? "text-white" : "text-fg-black"
          }`}
        >
          {name}
        </p>
        {message && (
          <p
            className={`text-xs font-normal leading-4 tracking-fg line-clamp-1 ${
              active ? extra.activeSubText : "text-fg-grey-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Right side: time + unread badge (orange-600 per Figma) */}
      {(time || (unreadCount !== undefined && unreadCount > 0)) && (
        <div className="flex flex-col items-end gap-1 shrink-0">
          {time && (
            <span
              className={`text-xs ${
                active ? extra.activeSubText : "text-fg-grey-700"
              }`}
            >
              {time}
            </span>
          )}
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-fg-red rounded-full text-white text-[10px] font-semibold leading-4 tracking-fg">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
