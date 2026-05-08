import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

export function DropdownPanel({
  children,
  width = "w-60",
  padding = "p-2",
  className,
}: {
  children: ReactNode;
  width?: string;
  padding?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-center items-start gap-1 overflow-hidden",
        width,
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownDivider() {
  return (
    <div className="self-stretch px-2.5">
      <div className="h-0 outline outline-1 outline-offset-[-0.50px] outline-fg-grey-200" />
    </div>
  );
}
