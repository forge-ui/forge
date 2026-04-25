import { type ReactNode } from "react";

// ============================================================
// InfoRow — examples sidebar 信息行（裸 icon + label + value 上下排）
// 不在 UI Kit (DescriptionItem 用 CircleIcon 包，跟此处需要的裸 icon 视觉不同)
// 仅 src/app/templates/ 下业务示例使用
// ============================================================

export function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-2 items-start">
      <span className="shrink-0 mt-0.5 text-fg-grey-700">{icon}</span>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-sm font-semibold text-fg-grey-700 leading-5 tracking-fg">
          {label}
        </span>
        <div className="text-sm font-medium text-fg-black leading-5 tracking-fg">
          {children}
        </div>
      </div>
    </div>
  );
}
