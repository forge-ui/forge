"use client";

import {
  HomeSmileBoldDuotone,
  ChartSquareBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  InboxBoldDuotone,
  CalendarBoldDuotone,
  FolderBoldDuotone,
  StarBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutProfile } from "@forge-ui/react";

export const sampleMenuItems: AppLayoutMenuItem[] = [
  { icon: <HomeSmileBoldDuotone size={20} />, label: "Menu A", href: "/templates/blank" },
  { icon: <InboxBoldDuotone size={20} />, label: "Menu B", href: "#b", badge: 3 },
  { icon: <CalendarBoldDuotone size={20} />, label: "Menu C", href: "#c" },
  { icon: <ChartSquareBoldDuotone size={20} />, label: "Menu D", href: "#d" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Menu E", href: "#e" },
];

export const sampleFavoriteItems: AppLayoutMenuItem[] = [
  { icon: <FolderBoldDuotone size={20} />, label: "Favorite A", href: "#fa" },
  { icon: <StarBoldDuotone size={20} />, label: "Favorite B", href: "#fb" },
];

export const sampleProfile: AppLayoutProfile = {
  avatar: "https://i.pravatar.cc/150?u=forge-user",
  name: "Alex Morgan",
  role: "Product Manager",
};
