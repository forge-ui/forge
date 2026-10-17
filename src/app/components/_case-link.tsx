"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { casesNavGroups } from "../cases/_nav";

export function CaseLink() {
  const pathname = usePathname();
  const slug = pathname.split("/").filter(Boolean)[1];
  const match = casesNavGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === `/cases/${slug}`);
  if (!match) return null;

  return (
    <p className="border-t border-fg-grey-200 pt-8 text-sm leading-6 text-fg-grey-700">
      颜色、尺寸、状态和动效的对照见
      <Link href={match.href} className="mx-1 font-semibold text-fg-blue underline underline-offset-4">
        {match.label}案例
      </Link>
      。
    </p>
  );
}
