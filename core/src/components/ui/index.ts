// Base components
export { NotificationBadge, Label, CircleIcon, ArtisticIcon } from "./badge";
export type { NotificationBadgeColor, LabelColor, LabelSize, LabelVariant, CircleIconColor, CircleIconSize, CircleIconVariant, ArtisticIconColor, ArtisticIconVariant } from "./badge";

export { Button } from "./button";
export type { ButtonColor, ButtonVariant, ButtonSize } from "./button";

export { PlusIcon, CloseIcon, CheckIcon } from "./plain-icons";

export { IconButton } from "./icon-button";
export type { IconButtonColor, IconButtonVariant, IconButtonSize, IconButtonShape } from "./icon-button";

export { StyledLink } from "./link";
export type { LinkColor } from "./link";

export { ProgressBar } from "./progress-bar";
export type { ProgressColor, ProgressSize, ProgressLabelVariant, ProgressLabelSize } from "./progress-bar";

export { Checkbox } from "./checkbox";
export type { CheckboxColor } from "./checkbox";

export { Avatar, AvatarGroup } from "./avatar";
export type { AvatarSize, AvatarInitialColor } from "./avatar";

// Composite components
export { StatCard } from "./stat-card";
export { ProjectCard } from "./project-card";
export type { ProjectCardColor } from "./project-card";
export { TaskCard } from "./task-card";
export type { TaskCardColor } from "./task-card";
export { UserCard } from "./user-card";

// Stat card variants
export { ProgressStatCard } from "./progress-stat-card";
export { LineChartStatCard } from "./line-chart-stat-card";
export type { LineChartColor } from "./line-chart-stat-card";
export { WheelChartStatCard } from "./wheel-chart-stat-card";
export type { WheelColor } from "./wheel-chart-stat-card";
export { BarChartStatCard } from "./bar-chart-stat-card";
export type { BarColor } from "./bar-chart-stat-card";

// Financial & complex cards
export { BalanceCard } from "./balance-card";
export { DebitCard } from "./debit-card";
export { CreditCard } from "./credit-card";
export { ImageStatCard } from "./image-stat-card";
export { HighlightCard } from "./highlight-card";
export { ProgressCard } from "./progress-card";
export { ActivityCard } from "./activity-card";

// Chat & social components
export { ContactItem } from "./contact-item";
export { ChatBubble } from "./chat-bubble";
export { ChatInputBar } from "./chat-input-bar";
export type { ChatInputBarToggle } from "./chat-input-bar";
export { CommentItem } from "./comment-item";
export type { CommentData, CommentReply } from "./comment-item";
export { ReviewItem } from "./review-item";
export { FilterGroup } from "./filter-group";
export type {
  FilterGroupColor,
  FilterGroupContent,
  FilterGroupCheckboxOption,
  FilterGroupRadioOption,
} from "./filter-group";
export { FilterTrigger } from "./filter-trigger";
export { FilterPanel } from "./filter-panel";

// Timeline & History
export { HistoryItem } from "./history-item";
export type { HistoryItemProps, HistoryItemVariant, HistoryItemShowDatetime, HistoryItemColor } from "./history-item";

export { HistoryGrouped } from "./history-grouped";

// Calendar
export { EventTag } from "./event-tag";
export type { EventTagColor, EventTagSize, EventTagVariant } from "./event-tag";

export { CalendarDayCell } from "./calendar-day-cell";
export { CalendarWeekRow } from "./calendar-week-row";

export { EventCard } from "./event-card";
export type { EventCardColor } from "./event-card";

export { SmallCalendar } from "./small-calendar";
export type { SmallCalendarEvent } from "./small-calendar";

export { SmallDailyCalendar } from "./small-daily-calendar";
export type { DailyEvent } from "./small-daily-calendar";

export { FullCalendar } from "./full-calendar";
export type { CalendarEvent } from "./full-calendar";

// Chart components
export {
  MeterChart,
  HalfDonutChart,
  DashedHalfDonutChart,
  DonutChart,
  PieChart,
  MultilayerDonutChart,
  BubbleChart,
  BarChart,
  BarHorizontalChart,
  BarUpsideDownChart,
  SmoothLineChart,
  ChartTooltip,
  ChartCard,
  ChartListItem,
  ChartLegendItem,
  ChartValueRow,
  ChartStatFooter,
} from "./charts";

// List & Menu components
export { ListItem, DescriptionItem } from "./list-item";
export type { ListItemLead, ListItemIconLead, ListItemAvatarLead, ListItemImageLead, DescriptionItemLead } from "./list-item";
export { ListGroup } from "./list-group";
export type { ListGroupTab } from "./list-group";
export { MapCard } from "./map-card";
export type { MapVariant, MapContinent, MapRegion } from "./map-card";
export { MenuItem } from "./menu-item";
export type {
  MenuItemAccent,
  MenuItemSurface,
  MenuItemIntent,
  MenuItemKind,
  MenuItemState,
  MenuItemLead,
} from "./menu-item";
export { DropdownPanel, DropdownDivider } from "./dropdown-panel";
export { IconTrigger } from "./icon-trigger";
export type {
  IconTriggerAccent,
  IconTriggerState,
  IconTriggerSurface,
} from "./icon-trigger";
export { ProfileCard } from "./profile-card";
export type { ProfileCardState, ProfileCardSurface } from "./profile-card";
export { NotificationItem } from "./notification-item";
export type { NotificationItemColor } from "./notification-item";
export { KebabMenu } from "./kebab-menu";
export type { KebabMenuAccent, KebabMenuItem } from "./kebab-menu";

// Navigation components
export { SidebarMenu } from "./sidebar-menu";
export type {
  SidebarMenuAccent,
  SidebarMenuItem,
  SidebarMenuMode,
  SidebarMenuBgMode,
} from "./sidebar-menu";

// Form components
export {
  TextField,
  TextArea,
  SelectOption,
  MediaUpload,
  ProfileImgUpload,
  FileUpload,
  FileCard,
  FileTypeIcon,
  Datepicker,
  Toggle,
  RadioButton,
  CheckboxControl,
  CheckboxWithLabel,
  IconSelector,
  IconPicker,
  ColorPicker,
  TextFieldSelectSuffix,
} from "./forms";
export type {
  TextFieldState,
  TextFieldShape,
  TextFieldColor,
  TextAreaState,
  TextAreaShape,
  TextAreaColor,
  SelectOptionState,
  SelectOptionShape,
  SelectOptionColor,
  SelectOptionType,
  SelectOptionBgVariant,
  SelectOptionItem,
  FileItem,
  FileState,
  FileUploadColor,
  MediaItem,
  MediaUploadColor,
  DatepickerState,
  DatepickerShape,
  DatepickerColor,
  ControlColor,
  IconSelectorColor,
} from "./forms";

// Dialog & Overlay
export { ConfirmationDialog } from "./confirmation-dialog";
export type { ConfirmationDialogColor, ConfirmationDialogLayout } from "./confirmation-dialog";

export { Tooltip, TooltipBubble, TooltipAnchor } from "./tooltip";
export type { TooltipPosition, TooltipSize, TooltipAnchorState } from "./tooltip";

// Navigation & Controls
export { PageDot } from "./page-dot";
export type { PageDotColor } from "./page-dot";

export { Pagination } from "./pagination";
export type { PaginationColor } from "./pagination";

export { Stepper } from "./stepper";
export type { StepperColor } from "./stepper";

export { TabBar } from "./tab-bar";
export type { TabBarColor, TabBarSurface, TabItem } from "./tab-bar";

export { ButtonGroup } from "./button-group";
export type { ButtonGroupColor, ButtonGroupShape, ButtonGroupItem } from "./button-group";

export { TopBar } from "./topbar";
export type { TopBarColor } from "./topbar";

export { PageHeader } from "./page-header";
export type { PageHeaderColor, PageHeaderVariant, PageHeaderProfile, PageHeaderAction, PageHeaderProps } from "./page-header";

export { Breadcrumbs } from "./breadcrumbs";
export type { BreadcrumbColor, BreadcrumbItem } from "./breadcrumbs";

export {
  Toolbar,
  ToolbarSearchInput,
  ToolbarSelectDropdown,
  ToolbarDatepicker,
  ToolbarFilterButton,
  ToolbarShowSelect,
  ToolbarActions,
  ToolbarKebabButton,
  ToolbarFavoriteButton,
  ToolbarPillTabs,
  PageTitleToolbar,
} from "./toolbar";
export type { ToolbarColor, ToolbarPillTab } from "./toolbar";

// Widget components
export { CurrencyConverter } from "./currency-converter";
export type { CurrencyConverterColor } from "./currency-converter";

export { RatingStars } from "./rating-stars";
export type { RatingStarsSize } from "./rating-stars";

export { ImageGrid } from "./image-grid";
export type { ImageGridSize } from "./image-grid";

export { ProductRow } from "./product-row";

// Data Table components
export {
  TableCell,
  DataTable,
  FullWidthTable,
  StatusBadge,
  ProgressBadge,
  CellText,
  CellTextSubtitle,
  CellMuted,
  CellImageText,
  CellProgressValue,
  CellKebabMenu,
  CellStatusDot,
  CellNumber,
  CellProgressBar,
  CellCode,
  CellRating,
  CellFile,
  CellActions,
  CellLink,
} from "./data-table";
export type {
  TableCellVariant,
  TableCellProps,
  CellContentType,
  ColumnDef,
  StatusBadgeColor,
  StatusDotColor,
  ProgressBadgeColor,
  ProgressBarColor,
  CellActionKey,
  CellLinkColor,
  DataTableColor,
  DataTableProps,
  FullWidthTableProps,
} from "./data-table";

// Shared accent colors
export { accentColors } from "./accent-utils";
export type { AccentColor, AccentConfig } from "./accent-utils";

// Shared card theme utilities (8-color theme matrix used by StatCard & variants)
export {
  cardThemes,
  ALL_CARD_THEMES,
  statCardSizes,
  CardGlow,
  CardTrend,
  CardIconChip,
  CardKebabButton,
  CardAvatarGroup,
  StatCardShell,
  resolveCardTheme,
  financialThemes,
  FinancialOrbs,
  MastercardLogo,
} from "./card-utils";
export type {
  CardTheme,
  CardThemeConfig,
  TrendDirection,
  StatCardSize,
  FinancialTheme,
  FinancialThemeConfig,
  FinancialVariant,
  LegacyCardTheme,
  CardBadgeVariant,
} from "./card-utils";

// Style Guide display atoms (Color / Typography case)
export {
  ColorSwatch,
  ColorSection,
  TypefaceBlock,
  TypographyWeightSample,
  TypographySizeRow,
} from "./style-guide";
export type { ColorScaleStop, ColorSwatchSize } from "./style-guide";

// Layout templates
export { AppLayout } from "../layouts/app-layout";
export type { AppLayoutMode, AppLayoutProfilePosition, AppLayoutAccentColor, AppLayoutMenuItem, AppLayoutProfile, AppLayoutBreadcrumb, AppLayoutPageHeaderVariant } from "../layouts/app-layout";
