import type { ReactNode } from "react";
import { SurfaceCard } from "@forge-ui-official/core";

export function TemplateSurface({ title, subtitle, action, children, className = "" }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const padding = className.includes("p-0") ? "none" : "sm";
  const shellClassName = className.replace(/\bp-0\b/g, "").trim();

  return (
    <SurfaceCard title={title} subtitle={subtitle} action={action} padding={padding} className={shellClassName}>
      {children}
    </SurfaceCard>
  );
}
