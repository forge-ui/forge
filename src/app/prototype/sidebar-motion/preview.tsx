"use client";

import { useState, type ReactNode } from "react";
import {
  AppLayout,
  Button,
  type AppLayoutAccentColor,
  type AppLayoutMode,
} from "@forge-ui-official/core";
import { menuSections } from "./menu";

const accents: { value: AppLayoutAccentColor; label: string }[] = [
  { value: "blue", label: "蓝色" },
  { value: "purple", label: "紫色" },
  { value: "black", label: "黑色" },
];

export function SidebarMotionPreview({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<AppLayoutAccentColor>("blue");
  const [mode, setMode] = useState<AppLayoutMode>("light");
  const [motion, setMotion] = useState<"auto" | "none">("auto");

  return (
    <AppLayout
      menuSections={menuSections}
      mode={mode}
      accent={accent}
      motion={motion}
      logoText="Forge"
      appName="应用布局预览"
      appSubtitle="本地体验"
      profilePosition="sidebar"
      profile={{ name: "林晓", role: "设计师", avatar: "/images/protask/crm/john-hoegan-avatar.png" }}
      hideSidebarWidgets
      pageTitle="应用布局 · 侧栏动效"
      showDatePicker={false}
      showKebab={false}
      showFavorite={false}
    >
      <section aria-label="预览设置" className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-2xl border border-fg-grey-200 bg-fg-white p-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-semibold text-fg-grey-700">主题色</legend>
          <div className="flex gap-2">
            {accents.map((option) => (
              <Button key={option.value} color={option.value} size="sm" variant={accent === option.value ? "primary" : "tertiary"} aria-pressed={accent === option.value} onClick={() => setAccent(option.value)}>
                {option.label}
              </Button>
            ))}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-semibold text-fg-grey-700">外观</legend>
          <div className="flex gap-2">
            <Button color="black" size="sm" variant={mode === "light" ? "primary" : "tertiary"} aria-pressed={mode === "light"} onClick={() => setMode("light")}>浅色</Button>
            <Button color="black" size="sm" variant={mode === "dark" ? "primary" : "tertiary"} aria-pressed={mode === "dark"} onClick={() => setMode("dark")}>深色</Button>
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-semibold text-fg-grey-700">动效</legend>
          <div className="flex gap-2">
            <Button color="black" size="sm" variant={motion === "auto" ? "primary" : "tertiary"} aria-pressed={motion === "auto"} onClick={() => setMotion("auto")}>跟随系统</Button>
            <Button color="black" size="sm" variant={motion === "none" ? "primary" : "tertiary"} aria-pressed={motion === "none"} onClick={() => setMotion("none")}>关闭动效</Button>
          </div>
        </fieldset>
      </section>
      {children}
    </AppLayout>
  );
}
