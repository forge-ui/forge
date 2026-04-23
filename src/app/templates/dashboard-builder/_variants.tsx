import type { ReactNode } from "react";
import {
  HomeSmileBoldDuotone,
  InboxBoldDuotone,
  ChartSquareBoldDuotone,
  CalendarBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  FolderBoldDuotone,
  StarBoldDuotone,
  MagniferBoldDuotone,
  SettingsBoldDuotone,
} from "solar-icon-set";
import type {
  AppLayoutMenuItem,
  AppLayoutMode,
  AppLayoutProfile,
  AppLayoutProfilePosition,
  AppLayoutAccentColor,
} from "@forge-ui/react";

export type BuilderVariant = {
  slug: string;
  title: string;
  subtitle: string;
  mode: AppLayoutMode;
  accent: AppLayoutAccentColor;
  profilePosition: AppLayoutProfilePosition;
  showPageHeader: boolean;
  swatch: string;
  thumbnail: string;
};

export const variants: BuilderVariant[] = [
  {
    slug: "light-topbar",
    title: "白菜单 · 紫主题 · 顶栏 Profile",
    subtitle: "白底侧栏，紫色选中态，个人信息放顶栏。",
    mode: "light",
    accent: "purple",
    profilePosition: "topbar",
    showPageHeader: false,
    swatch: "bg-white border border-fg-grey-200",
    thumbnail: "/images/showcase/dashboard-builder/light-topbar.png",
  },
  {
    slug: "light-sidebar",
    title: "白菜单 · 紫主题 · 侧栏 Profile",
    subtitle: "白底侧栏，紫色选中态，个人信息放侧栏底部。",
    mode: "light",
    accent: "purple",
    profilePosition: "sidebar",
    showPageHeader: true,
    swatch: "bg-white border border-fg-grey-200",
    thumbnail: "/images/showcase/dashboard-builder/light-sidebar.png",
  },
  {
    slug: "purple-topbar",
    title: "紫菜单 · 紫主题 · 顶栏 Profile",
    subtitle: "紫色侧栏，个人信息放顶栏。",
    mode: "dark",
    accent: "purple",
    profilePosition: "topbar",
    showPageHeader: false,
    swatch: "bg-fg-violet",
    thumbnail: "/images/showcase/dashboard-builder/purple-topbar.png",
  },
  {
    slug: "purple-sidebar",
    title: "紫菜单 · 紫主题 · 侧栏 Profile",
    subtitle: "紫色侧栏，个人信息放侧栏底部。",
    mode: "dark",
    accent: "purple",
    profilePosition: "sidebar",
    showPageHeader: true,
    swatch: "bg-fg-violet",
    thumbnail: "/images/showcase/dashboard-builder/purple-sidebar.png",
  },
  {
    slug: "blue-topbar",
    title: "蓝菜单 · 蓝主题 · 顶栏 Profile",
    subtitle: "蓝色侧栏，个人信息放顶栏。",
    mode: "dark",
    accent: "blue",
    profilePosition: "topbar",
    showPageHeader: false,
    swatch: "bg-blue-600",
    thumbnail: "/images/showcase/dashboard-builder/blue-topbar.png",
  },
  {
    slug: "blue-sidebar",
    title: "蓝菜单 · 蓝主题 · 侧栏 Profile",
    subtitle: "蓝色侧栏，个人信息放侧栏底部。",
    mode: "dark",
    accent: "blue",
    profilePosition: "sidebar",
    showPageHeader: true,
    swatch: "bg-blue-600",
    thumbnail: "/images/showcase/dashboard-builder/blue-sidebar.png",
  },
  {
    slug: "black-topbar",
    title: "黑菜单 · 黑主题 · 顶栏 Profile",
    subtitle: "深色侧栏，个人信息放顶栏。",
    mode: "dark",
    accent: "black",
    profilePosition: "topbar",
    showPageHeader: false,
    swatch: "bg-fg-black",
    thumbnail: "/images/showcase/dashboard-builder/black-topbar.png",
  },
  {
    slug: "black-sidebar",
    title: "黑菜单 · 黑主题 · 侧栏 Profile",
    subtitle: "深色侧栏，个人信息放侧栏底部。",
    mode: "dark",
    accent: "black",
    profilePosition: "sidebar",
    showPageHeader: true,
    swatch: "bg-fg-black",
    thumbnail: "/images/showcase/dashboard-builder/black-sidebar.png",
  },
];

export const menuItems: AppLayoutMenuItem[] = [
  { icon: <HomeSmileBoldDuotone size={20} />, label: "Text Menu", href: "#a" },
  { icon: <InboxBoldDuotone size={20} />, label: "Text Menu", href: "#b", badge: 3 },
  { icon: <CalendarBoldDuotone size={20} />, label: "Text Menu", href: "#c" },
  { icon: <ChartSquareBoldDuotone size={20} />, label: "Text Menu", href: "#d" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Text Menu", href: "#e" },
  { icon: <MagniferBoldDuotone size={20} />, label: "Text Menu", href: "#f" },
  { icon: <SettingsBoldDuotone size={20} />, label: "Text Menu", href: "#g" },
];

export const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <FolderBoldDuotone size={20} />, label: "Text Menu", href: "#fa" },
  { icon: <StarBoldDuotone size={20} />, label: "Text Menu", href: "#fb" },
  { icon: <FolderBoldDuotone size={20} />, label: "Text Menu", href: "#fc" },
];

export const profile: AppLayoutProfile = {
  avatar: "/images/forge-logo.svg",
  name: "John Doe Hoegan",
  role: "Manager",
};

export const teamMeta = {
  teamName: "Sugab's Team",
  teamAvatar: "/images/forge-logo.svg",
  teamMemberCount: 24,
};

export function findVariant(slug: string): BuilderVariant | undefined {
  return variants.find((v) => v.slug === slug);
}

export function variantHref(slug: string): string {
  return `/dashboard-builder/${slug}`;
}

export const emptyContent: ReactNode = <div className="min-h-[calc(100vh-12rem)]" />;
