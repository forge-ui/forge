/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";
import { MenuDotsBold } from "solar-icon-set";
import { cn } from "../../lib/utils";
import { resolveCardWidthClass, type CardWidth } from "./card-utils";

// ============================================================
// UserCard - 用户卡片
// 支持 photo 或 initials 头像
// 支持 badge (label) 或 subtitle
// 底部有 stats 区域
// ============================================================

export function UserCard({
  avatar,
  initials,
  initialsColor = "purple",
  name,
  badge,
  subtitle,
  stats,
  checked = false,
  onMenuClick,
  width,
  className = "",
}: {
  avatar?: string;
  initials?: string;
  initialsColor?: "purple" | "blue" | "green" | "orange";
  name: string;
  badge?: ReactNode;
  subtitle?: ReactNode;
  stats?: { label: string; value: string }[];
  checked?: boolean;
  onMenuClick?: () => void;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const initialsColors = {
    purple: { bg: "bg-fg-violet-100", text: "text-fg-violet" },
    blue: { bg: "bg-fg-blue-50", text: "text-fg-blue" },
    green: { bg: "bg-fg-green-50", text: "text-fg-green-500" },
    orange: { bg: "bg-fg-red-100", text: "text-fg-red" },
  };

  const iColor = initialsColors[initialsColor];

  return (
    <div
      className={cn(
        "p-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] flex-col justify-start items-center gap-4 overflow-hidden",
        checked ? "outline-fg-violet" : "outline-fg-grey-200",
        resolveCardWidthClass(width, "w-52"),
        className,
      )}
    >
      {/* Avatar + name + badge */}
      <div className="self-stretch relative flex flex-col justify-start items-center gap-4">
        {avatar ? (
          <img className="w-20 h-20 rounded-full object-cover" src={avatar} alt="" />
        ) : (
          <div className={`w-20 h-20 p-2.5 ${iColor.bg} rounded-full inline-flex justify-center items-center overflow-hidden`}>
            <span className={`${iColor.text} text-xl font-semibold leading-7.5 tracking-fg`}>{initials}</span>
          </div>
        )}
        <div className="self-stretch flex flex-col justify-center items-center gap-1">
          <div className="self-stretch text-center text-fg-black text-sm font-semibold leading-5 tracking-fg">{name}</div>
          {badge && <div>{badge}</div>}
          {subtitle && <div>{subtitle}</div>}
        </div>

        {/* Menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="w-6 h-6 p-2 absolute right-0 top-0 inline-flex justify-center items-center cursor-pointer"
          >
            <span className="rotate-90">
              <MenuDotsBold size={16} color="var(--fg-grey-700)" />
            </span>
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
          <div className="self-stretch inline-flex justify-center items-center gap-2.5">
            {stats.map((stat, i) => (
              <div key={i} className="flex-1 inline-flex flex-col justify-start items-center gap-1">
                <div className="self-stretch text-center text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">{stat.label}</div>
                <div className="self-stretch text-center text-fg-black text-sm font-semibold leading-5 tracking-fg">{stat.value}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
