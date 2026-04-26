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

interface DashboardShellProps {
  mode: AppLayoutMode;
  accent: AppLayoutAccentColor;
  profilePosition: AppLayoutProfilePosition;
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
  mode,
  accent,
  profilePosition,
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
  return (
    <AppLayout
      mode={mode}
      accent={accent}
      profilePosition={profilePosition}
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
