// ============================================================
// Shared calendar utilities — used by SmallCalendar, FullCalendar,
// Datepicker, and CalendarDayCell.
// Eliminates duplicated month/day helper functions.
// ============================================================

export const MONTH_NAMES = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

export const DAY_NAMES_SHORT = ["日", "一", "二", "三", "四", "五", "六"];
export const DAY_NAMES_UPPER = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}
