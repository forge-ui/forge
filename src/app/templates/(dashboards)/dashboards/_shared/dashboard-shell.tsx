"use client";

import type { ReactNode } from "react";
import { AppLayout } from "@forge-ui/react";
import type {
  AppLayoutMenuItem,
  AppLayoutMode,
  AppLayoutAccentColor,
  AppLayoutProfile,
  AppLayoutProfilePosition,
} from "@forge-ui/react";

export type DashboardShellVariant =
  | "violet-top"
  | "light-top"
  | "light-sb"
  | "blue-sb";

interface VariantConfig {
  mode: AppLayoutMode;
  accent: AppLayoutAccentColor;
  profilePosition: AppLayoutProfilePosition;
}

const variantConfig: Record<DashboardShellVariant, VariantConfig> = {
  "violet-top": { mode: "dark", accent: "purple", profilePosition: "topbar" },
  "light-top": { mode: "light", accent: "purple", profilePosition: "topbar" },
  "light-sb": { mode: "light", accent: "purple", profilePosition: "sidebar" },
  "blue-sb": { mode: "dark", accent: "blue", profilePosition: "sidebar" },
};

interface DashboardShellProps {
  variant: DashboardShellVariant;
  menuItems: AppLayoutMenuItem[];
  favoriteItems?: AppLayoutMenuItem[];
  profile: AppLayoutProfile;
  teamName?: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  notifications?: number;
  messages?: number;
  pageTitle?: string;
  primaryAction?: { label: string; onClick?: () => void };
  logoText?: string;
  children: ReactNode;
}

export function DashboardShell({
  variant,
  menuItems,
  favoriteItems,
  profile,
  teamName,
  teamAvatar,
  teamMemberCount,
  notifications = 99,
  messages = 99,
  pageTitle,
  primaryAction,
  logoText = "Protask",
  children,
}: DashboardShellProps) {
  const cfg = variantConfig[variant];
  return (
    <AppLayout
      mode={cfg.mode}
      accent={cfg.accent}
      profilePosition={cfg.profilePosition}
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={profile}
      teamName={teamName}
      teamAvatar={teamAvatar}
      teamMemberCount={teamMemberCount}
      notifications={notifications}
      messages={messages}
      pageTitle={pageTitle}
      primaryAction={primaryAction}
      logoText={logoText}
    >
      {children}
    </AppLayout>
  );
}
