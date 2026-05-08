"use client";

import { notFound } from "next/navigation";
import { AppLayout } from "@forge-ui-official/core";
import {
  findVariant,
  menuItems,
  favoriteItems,
  profile,
  teamMeta,
} from "../_variants";

export function VariantContent({ variant }: { variant: string }) {
  const v = findVariant(variant);
  if (!v) notFound();

  const headerProps = v.showPageHeader
    ? {
        pageHeaderVariant: "detail" as const,
        pageTitle: "Page Title",
        secondaryAction: { label: "Tertiary" },
        primaryAction: { label: "Primary" },
      }
    : {};

  const currentHref = `/dashboard-builder/${v.slug}`;
  const activeMenuItems = menuItems.map((item, i) =>
    i === 0 ? { ...item, href: currentHref } : item,
  );

  return (
    <AppLayout
      mode={v.mode}
      profilePosition={v.profilePosition}
      accent={v.accent}
      teamName={teamMeta.teamName}
      teamAvatar={teamMeta.teamAvatar}
      teamMemberCount={teamMeta.teamMemberCount}
      menuItems={activeMenuItems}
      favoriteItems={favoriteItems}
      profile={profile}
      notifications={99}
      messages={99}
      searchPlaceholder="Search..."
      {...headerProps}
    >
      <div className="min-h-[calc(100vh-12rem)]" />
    </AppLayout>
  );
}
