import { type ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { MenuDotsBold } from "solar-icon-set";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  onMenuClick?: () => void;
  size?: "4col" | "6col" | "8col" | "full";
  minHeight?: string;
  className?: string;
}

const sizeClasses: Record<NonNullable<ChartCardProps["size"]>, string> = {
  "4col": "w-96",
  "6col": "w-[600px]",
  "8col": "w-[800px]",
  full: "self-stretch",
};

function ThreeDotsVerticalIcon() {
  return <span className="text-fg-black"><MenuDotsBold size={20} /></span>;
}

export function ChartCard({
  title,
  subtitle,
  children,
  footer,
  action,
  onMenuClick,
  size = "4col",
  minHeight = "min-h-80",
  className,
}: ChartCardProps) {
  const actionElement = action ?? (
    <button
      onClick={onMenuClick}
      className="p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-start items-center gap-2"
    >
      <ThreeDotsVerticalIcon />
    </button>
  );

  return (
    <div
      className={cn(
        "bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-start items-start overflow-hidden",
        sizeClasses[size],
        minHeight,
        className
      )}
    >
      <div className="self-stretch px-6 pt-6 inline-flex justify-start items-start gap-3">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
          <div className="self-stretch inline-flex justify-start items-center gap-3">
            <span className="text-fg-black text-xl font-semibold leading-8 tracking-fg">
              {title}
            </span>
          </div>
          {subtitle && (
            <span className="self-stretch text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
              {subtitle}
            </span>
          )}
        </div>
        {actionElement}
      </div>
      <div className="self-stretch flex-1 p-6 flex flex-col justify-start items-center gap-6">
        {children}
        {footer}
      </div>
    </div>
  );
}
