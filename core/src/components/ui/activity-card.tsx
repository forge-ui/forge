/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";
import { MenuDotsBold } from "solar-icon-set";

export function ActivityCard({
  icon,
  headerText,
  datetime,
  avatar,
  title,
  description,
  metadata,
  onMenuClick,
}: {
  icon: ReactNode;
  headerText: string;
  datetime: string;
  avatar: string;
  title: string;
  description: string;
  metadata: { label: string; value: string | ReactNode }[];
  onMenuClick?: () => void;
}) {
  return (
    <div className="bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-fg-grey-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="shrink-0">{icon}</span>
          <span className="text-sm font-medium leading-5 text-fg-black">{headerText}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm leading-5 text-fg-grey-700">{datetime}</span>
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md hover:bg-fg-grey-100 transition-colors"
            >
              <span className="rotate-90">
                <MenuDotsBold size={16} color="var(--fg-grey-700)" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex gap-3">
        <img
          src={avatar}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold leading-5 text-fg-black">{title}</span>
            <span className="text-sm leading-5 text-fg-grey-700">{description}</span>
          </div>

          {/* Metadata */}
          {metadata.length > 0 && (
            <div className="p-4 bg-fg-grey-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex items-start gap-4">
              {metadata.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  {index > 0 && (
                    <div className="w-0 self-stretch outline outline-1 outline-offset-[-0.5px] outline-fg-grey-200" />
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-fg-grey-700">{item.label}</span>
                    <span className="text-sm font-medium leading-5 text-fg-black">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
