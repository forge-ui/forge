/* eslint-disable @next/next/no-img-element */
import { MenuDotsBold, CalendarLinear } from "solar-icon-set";
import { cn } from "../../lib/utils";
import { resolveCardWidthClass, type CardWidth } from "./card-utils";

// ============================================================
// ProjectCard - 项目卡片
// 含 logo, title, description, label, progress, avatars, date
// ============================================================

// labelColor / progressColor 共用同一组枚举（7 色），label 背景跟进度条主题色一致
export type ProjectCardColor =
  | "purple" | "blue" | "green" | "red" | "yellow" | "cyan" | "gray";

const cardColors: Record<ProjectCardColor, { bar: string; text: string; labelBg: string }> = {
  purple: { bar: "bg-fg-violet", text: "text-fg-violet", labelBg: "bg-fg-violet" },
  blue: { bar: "bg-fg-blue", text: "text-fg-blue", labelBg: "bg-fg-blue" },
  green: { bar: "bg-fg-green-500", text: "text-fg-green-500", labelBg: "bg-fg-green-500" },
  red: { bar: "bg-fg-red", text: "text-fg-red", labelBg: "bg-fg-red" },
  yellow: { bar: "bg-fg-yellow", text: "text-fg-yellow", labelBg: "bg-fg-yellow" },
  cyan: { bar: "bg-fg-cyan-500", text: "text-fg-cyan-500", labelBg: "bg-fg-cyan-500" },
  gray: { bar: "bg-fg-grey-700", text: "text-fg-grey-700", labelBg: "bg-fg-grey-700" },
};

export function ProjectCard({
  logo,
  title,
  description,
  labelText,
  labelColor = "gray",
  progress = 0,
  progressColor = "purple",
  avatars = [],
  overflowCount,
  date,
  onMenuClick,
  width,
  className = "",
}: {
  logo?: string;
  title: string;
  description?: string;
  labelText?: string;
  labelColor?: ProjectCardColor;
  progress?: number;
  progressColor?: ProjectCardColor;
  avatars?: string[];
  overflowCount?: number;
  date?: string;
  onMenuClick?: () => void;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const pColor = cardColors[progressColor];
  const lColor = cardColors[labelColor];

  return (
    <div
      className={cn(
        "p-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex-col justify-start items-start gap-4 overflow-hidden",
        resolveCardWidthClass(width, "w-80"),
        className,
      )}
    >
      {/* Header: logo + label + menu */}
      <div className="self-stretch inline-flex justify-between items-start">
        {logo && <img className="w-12 h-12 rounded-lg" src={logo} alt="" />}
        <div className="flex justify-start items-start gap-2">
          {labelText && (
            <div className={`px-2.5 py-1 ${lColor.labelBg} rounded-full inline-flex flex-col justify-center items-center`}>
              <span className="text-white text-sm font-semibold leading-5 tracking-fg">{labelText}</span>
            </div>
          )}
          {onMenuClick && (
            <button onClick={onMenuClick} className="w-6 h-6 p-2 flex justify-center items-center cursor-pointer">
              <span className="rotate-90">
                <MenuDotsBold size={16} color="var(--fg-grey-700)" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch text-fg-black text-sm font-semibold leading-5 tracking-fg">{title}</div>
        {description && (
          <div className="self-stretch h-10 text-fg-grey-700 text-sm font-normal leading-5 tracking-fg line-clamp-2">
            {description}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          <span className="flex-1 text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">Progress</span>
          <span className={`${pColor.text} text-sm font-bold leading-5 tracking-fg`}>{progress}%</span>
        </div>
        <div className="self-stretch h-2 bg-fg-grey-200 rounded-full overflow-hidden">
          <div
            className={`h-2 ${pColor.bar} rounded-full transition-all`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>

      {/* Footer: avatars + date */}
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="flex justify-center items-center">
          <div className="flex -space-x-2">
            {avatars.map((src, i) => (
              <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={src} alt="" />
            ))}
          </div>
          {overflowCount && overflowCount > 0 && (
            <div className="w-8 h-8 p-1 bg-fg-violet-100 rounded-full flex justify-center items-center overflow-hidden -ml-2">
              <span className="text-fg-violet text-xs font-semibold leading-4.5 tracking-fg">+{overflowCount}</span>
            </div>
          )}
        </div>
        {date && (
          <div className="flex justify-center items-center gap-2">
            <CalendarLinear size={20} color="var(--fg-grey-600)" />
            <span className="text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">{date}</span>
          </div>
        )}
      </div>
    </div>
  );
}
