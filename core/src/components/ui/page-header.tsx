"use client";

import type { ReactNode } from "react";
import { SearchHeader, TitleHeader } from "../../internal/page-header-variants";

// ============================================================
// PageHeader — Forge UI Kit page header
// Icon styles: BoldDuotone for widget icons, Linear for functional icons
// Wrapper structure (w-6 h-6 p-2 etc.) is the standard Forge icon slot
// ============================================================

import type { AccentColor } from "./accent-utils";

export type PageHeaderColor = AccentColor;
export type PageHeaderVariant = "search" | "title";

export interface PageHeaderProfile {
  name: string;
  role: string;
  avatar: string;
}

export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface PageHeaderProps {
  variant?: PageHeaderVariant;
  color?: PageHeaderColor;
  className?: string;

  // --- Search variant props ---
  /** "search" renders search input (default), "hamburger" renders compact menu button. */
  leftMode?: "search" | "hamburger";
  onHamburgerClick?: () => void;
  /** Show a mobile-only menu button before the search/title content. */
  showMobileMenuButton?: boolean;
  hamburgerAriaLabel?: string;
  hamburgerExpanded?: boolean;
  hamburgerControls?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showCalendar?: boolean;
  onCalendarClick?: () => void;
  calendarExpanded?: boolean;
  calendarButtonClassName?: string;
  notifications?: number;
  onNotificationsClick?: () => void;
  notificationsExpanded?: boolean;
  notificationsButtonClassName?: string;
  messages?: number;
  onMessagesClick?: () => void;
  messagesExpanded?: boolean;
  messagesButtonClassName?: string;
  onLanguageClick?: () => void;
  languageExpanded?: boolean;
  languageButtonClassName?: string;
  languageFlag?: ReactNode;
  showAddButton?: boolean;
  onAddClick?: () => void;
  showProfile?: boolean;
  profile?: PageHeaderProfile;
  onProfileClick?: () => void;
  profileExpanded?: boolean;
  profileButtonClassName?: string;
  profileNameClassName?: string;
  profileRoleClassName?: string;
  profileChevronClassName?: string;

  // --- Title variant props ---
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  titleAvatar?: string;
  showDatePicker?: boolean;
  datePickerLabel?: string;
  onDatePickerClick?: () => void;
  showFilters?: boolean;
  filtersLabel?: string;
  onFiltersClick?: () => void;
  showKebab?: boolean;
  onKebabClick?: () => void;
  showFavorite?: boolean;
  onFavoriteClick?: () => void;
  secondaryAction?: PageHeaderAction;
  primaryAction?: PageHeaderAction;
  actions?: ReactNode;
  children?: ReactNode;
}

// ============================================================
// Export
// ============================================================

export function PageHeader(props: PageHeaderProps) {
  const { variant = "title" } = props;

  if (variant === "search") {
    return <SearchHeader {...props} />;
  }

  return <TitleHeader {...props} />;
}
