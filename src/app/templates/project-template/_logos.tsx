"use client";

import {
  HashtagBoldDuotone,
  LinkRoundAngleLinear,
  PieChart3BoldDuotone,
  Rocket2Bold,
  ShieldUpBold,
  StarBold,
  StarsBold,
  TargetBold,
  TickerStarBoldDuotone,
} from "solar-icon-set";
import type { ProjectLogoKey } from "./_data";

export function ProjectLogo({ name, size = "md" }: { name: ProjectLogoKey; size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "size-24" : size === "sm" ? "size-9" : "size-11";
  const iconSize = size === "lg" ? 74 : size === "sm" ? 28 : 42;
  const baseClass = `inline-flex ${box} shrink-0 items-center justify-center rounded-full`;

  const logos: Record<ProjectLogoKey, React.ReactNode> = {
    oksy: (
      <span className={`${baseClass} bg-fg-blue-500`}>
        <PieChart3BoldDuotone size={Math.round(iconSize * 0.82)} color="#FFFFFF" />
      </span>
    ),
    target: <TargetBold size={iconSize} color="#EF3340" />,
    fourSquare: <StarsBold size={iconSize} color="#FF6B1A" />,
    odoble: <HashtagBoldDuotone size={iconSize} color="var(--fg-violet)" />,
    loopline: <LinkRoundAngleLinear size={iconSize} color="var(--fg-black)" />,
    oce: <TickerStarBoldDuotone size={iconSize} color="#050505" />,
    zola: <Rocket2Bold size={iconSize} color="#4318FF" />,
    slashtri: <TargetBold size={iconSize} color="#FF1717" />,
    shieldfy: <ShieldUpBold size={iconSize} color="#2448B8" />,
    lightbulb: (
      <span className={`${baseClass} bg-fg-red`}>
        <StarBold size={Math.round(iconSize * 0.72)} color="#FFFFFF" />
      </span>
    ),
  };

  return <span className={baseClass}>{logos[name]}</span>;
}

export function ProtaskLogo() {
  return (
    <span className="relative inline-flex size-10 items-center justify-center rounded-full">
      <span className="absolute inset-0 rounded-full border-[9px] border-white" />
      <span className="absolute left-0 top-0 size-5 bg-fg-violet" />
      <span className="absolute right-0 top-1/2 h-2.5 w-5 -translate-y-1/2 bg-fg-violet" />
    </span>
  );
}
